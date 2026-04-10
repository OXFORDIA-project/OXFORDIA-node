source("packages/solidauthr/scripts/helpers.R")
activate_local_library()

require_packages(c("httr2", "jose", "jsonlite", "openssl", "R6", "uuid"))
source_package_files()

find_binary <- function(candidates) {
  for (candidate in candidates) {
    path <- Sys.which(candidate)
    if (nzchar(path)) {
      return(path)
    }
  }

  ""
}

run_command <- function(command, args, wait = TRUE, fail_message = NULL) {
  output <- system2(command, args, stdout = TRUE, stderr = TRUE, wait = wait)
  status <- attr(output, "status")

  if (!wait) {
    return(list(output = output, status = status %||% 0L))
  }

  if (!is.null(status) && !identical(status, 0L)) {
    if (length(output) > 0) {
      cat(paste(output, collapse = "\n"), "\n")
    }
    stop(
      fail_message %||% sprintf("Command failed: %s", command),
      call. = FALSE
    )
  }

  list(output = output, status = status %||% 0L)
}

http_request <- function(url, method = "GET", headers = NULL, body = NULL) {
  req <- httr2::request(url)
  req <- httr2::req_method(req, method)
  req <- httr2::req_headers(req, Accept = "application/json")

  if (!is.null(headers) && length(headers) > 0) {
    req <- do.call(httr2::req_headers, c(list(req), headers))
  }

  if (!is.null(body)) {
    req <- httr2::req_body_json(req, body)
  }

  req <- httr2::req_error(req, is_error = function(resp) FALSE)
  resp <- httr2::req_perform(req)

  list(
    response = resp,
    status = httr2::resp_status(resp),
    payload = tryCatch(
      httr2::resp_body_json(resp, check_type = FALSE, simplifyVector = FALSE),
      error = function(...) list()
    )
  )
}

format_payload <- function(payload) {
  values <- flatten_values(payload)
  if (length(values) == 0) {
    return("<empty>")
  }

  paste(values, collapse = " ")
}

lookup_path <- function(value, path) {
  current <- value

  for (key in path) {
    if (!is.list(current) || is.null(current[[key]])) {
      return(NULL)
    }

    current <- current[[key]]
  }

  current
}

require_control <- function(payload, path, label) {
  value <- lookup_path(payload, path)
  if (!solid_is_scalar_string(value)) {
    stop(
      sprintf("CSS response did not include `%s`.", label),
      call. = FALSE
    )
  }

  value
}

flatten_values <- function(value) {
  if (is.null(value)) {
    return(character())
  }
  if (is.atomic(value)) {
    return(as.character(value))
  }
  if (is.list(value)) {
    return(unlist(lapply(value, flatten_values), use.names = FALSE))
  }

  character()
}

extract_first_matching_value <- function(value, pattern) {
  values <- unique(flatten_values(value))
  matches <- grep(pattern, values, value = TRUE, perl = TRUE)
  if (length(matches) == 0) {
    return(NULL)
  }

  matches[[1]]
}

wait_for_http <- function(url, expected_status = 200L, timeout_seconds = 60) {
  deadline <- Sys.time() + timeout_seconds

  repeat {
    result <- tryCatch(http_request(url), error = function(err) NULL)
    if (!is.null(result) && identical(result$status, expected_status)) {
      return(invisible(result))
    }

    if (Sys.time() >= deadline) {
      stop(sprintf("Timed out waiting for %s", url), call. = FALSE)
    }

    Sys.sleep(2)
  }
}

port_is_in_use <- function(port) {
  connection <- tryCatch(
    suppressWarnings(
      socketConnection(
        host = "127.0.0.1",
        port = port,
        open = "r+",
        blocking = TRUE,
        timeout = 1
      )
    ),
    error = function(...) NULL
  )

  if (is.null(connection)) {
    return(FALSE)
  }

  close(connection)
  TRUE
}

find_available_port <- function(start_port = 3300L, attempts = 200L) {
  for (offset in seq_len(attempts) - 1L) {
    candidate <- start_port + offset
    if (port_is_in_use(candidate)) {
      next
    }

    listener <- tryCatch(serverSocket(candidate), error = function(...) NULL)
    if (!is.null(listener)) {
      close(listener)
      return(candidate)
    }
  }

  stop(
    "Unable to find a free local port for the integration CSS server.",
    call. = FALSE
  )
}

main <- function() {
  docker_bin <- find_binary(c("docker"))

  if (!nzchar(docker_bin)) {
    stop(
      "`docker` must be installed to run the integration script.",
      call. = FALSE
    )
  }

  workspace_root <- normalizePath(
    file.path(package_root(), "..", ".."),
    mustWork = TRUE
  )
  pod_idp_root <- file.path(workspace_root, "packages", "pod-idp")

  project_name <- sprintf("solidauthr-it-%s", Sys.getpid())
  keep_stack <- tolower(Sys.getenv(
    "SOLIDAUTHR_KEEP_STACK",
    unset = "false"
  )) %in%
    c("1", "true", "yes")
  requested_port <- Sys.getenv("SOLIDAUTHR_IDP_PORT", unset = "")
  idp_port <- if (nzchar(requested_port)) {
    as.integer(requested_port)
  } else {
    find_available_port()
  }
  issuer <- sprintf("http://localhost:%s/", idp_port)

  env_file <- tempfile("solidauthr-idp-", fileext = ".env")
  writeLines(
    c(
      sprintf("CSS_BASE_URL=%s", issuer),
      "DOMAIN=localhost",
      "ACME_EMAIL=integration@example.invalid",
      "HTTP_PORT=38080",
      "HTTPS_PORT=38443",
      sprintf("IDP_LOCAL_PORT=%s", idp_port),
      sprintf("IDP_INTERNAL_PORT=%s", idp_port),
      "CSS_IMAGE=solidproject/community-server:latest"
    ),
    env_file,
    useBytes = TRUE
  )

  compose_args <- function(...) {
    c(
      "compose",
      "--project-name",
      project_name,
      "--project-directory",
      pod_idp_root,
      "--env-file",
      env_file,
      ...
    )
  }

  cat(sprintf(
    "Using CSS integration issuer %s (project %s)\n",
    issuer,
    project_name
  ))

  on.exit(
    {
      if (!keep_stack) {
        try(
          run_command(
            docker_bin,
            compose_args("down", "-v", "--remove-orphans"),
            fail_message = "Failed to tear down the integration stack."
          ),
          silent = TRUE
        )
      }

      unlink(env_file)
    },
    add = TRUE
  )

  run_command(
    docker_bin,
    compose_args("up", "-d", "idp"),
    fail_message = "Failed to start the CSS server."
  )

  wait_for_http(sprintf("%s.well-known/openid-configuration", issuer))

  account_index <- http_request(sprintf("%s.account/", issuer))
  stopifnot(account_index$status < 400)

  account_create_url <- require_control(
    account_index$payload,
    c("controls", "account", "create"),
    "controls.account.create"
  )

  account_create <- http_request(
    account_create_url,
    method = "POST"
  )
  stopifnot(account_create$status < 400)

  account_token <- account_create$payload$authorization
  if (!solid_is_scalar_string(account_token)) {
    stop("CSS did not return an account authorization token.", call. = FALSE)
  }

  auth_headers <- list(
    Authorization = paste("CSS-Account-Token", account_token)
  )

  authorized_index <- http_request(
    sprintf("%s.account/", issuer),
    headers = auth_headers
  )
  if (authorized_index$status >= 400) {
    stop(
      sprintf(
        "Failed to fetch authenticated account controls: %s",
        format_payload(authorized_index$payload)
      ),
      call. = FALSE
    )
  }

  email <- sprintf("solidauthr-%s@example.invalid", Sys.getpid())
  password <- "solidauthr-password"
  pod_name <- sprintf("solidauthr-%s", Sys.getpid())

  password_create_url <- require_control(
    authorized_index$payload,
    c("controls", "password", "create"),
    "controls.password.create"
  )

  password_create <- http_request(
    password_create_url,
    method = "POST",
    headers = auth_headers,
    body = list(email = email, password = password)
  )
  if (password_create$status >= 400) {
    stop(
      sprintf(
        "Failed to add an email/password login: %s",
        format_payload(password_create$payload)
      ),
      call. = FALSE
    )
  }

  pod_create_url <- require_control(
    authorized_index$payload,
    c("controls", "account", "pod"),
    "controls.account.pod"
  )

  pod_create <- http_request(
    pod_create_url,
    method = "POST",
    headers = auth_headers,
    body = list(name = pod_name)
  )

  if (pod_create$status >= 400) {
    stop(
      sprintf(
        "Failed to create the integration pod: %s",
        format_payload(pod_create$payload)
      ),
      call. = FALSE
    )
  }

  webid <- pod_create$payload$webId %||% NULL
  if (!solid_is_scalar_string(webid)) {
    webid <- sprintf("%s%s/profile/card#me", issuer, pod_name)
  }

  pod_base <- pod_create$payload$pod %||% NULL
  if (!solid_is_scalar_string(pod_base)) {
    pod_base <- sub("/profile/card#me$", "/", webid)
  }

  client_credentials_url <- require_control(
    authorized_index$payload,
    c("controls", "account", "clientCredentials"),
    "controls.account.clientCredentials"
  )

  resource_url <- paste0(pod_base, "integration.ttl")

  credentials <- http_request(
    client_credentials_url,
    method = "POST",
    headers = auth_headers,
    body = list(name = "solidauthr-integration", webId = webid)
  )

  if (credentials$status >= 400) {
    stop(
      sprintf(
        "Failed to create client credentials: %s",
        format_payload(credentials$payload)
      ),
      call. = FALSE
    )
  }

  session <- solid_session(
    issuer = issuer,
    client_id = credentials$payload$id,
    client_secret = credentials$payload$secret
  )

  token <- session$token()
  write_body <- paste(
    "@prefix dct: <http://purl.org/dc/terms/> .",
    "<> dct:title \"solidauthr integration\" ."
  )

  session$put(
    resource_url,
    body = write_body,
    content_type = "text/turtle"
  )

  resource_resp <- session$get(resource_url)
  resource_body <- httr2::resp_body_string(resource_resp)
  resp <- session$get(sprintf("%s.well-known/openid-configuration", issuer))
  discovery <- httr2::resp_body_json(
    resp,
    check_type = FALSE,
    simplifyVector = FALSE
  )

  cat("solidauthr integration succeeded\n")
  cat(sprintf("  Issuer:      %s\n", issuer))
  cat(sprintf("  Pod:         %s\n", pod_base))
  cat(sprintf("  WebID:       %s\n", webid))
  cat(sprintf("  Client ID:   %s\n", credentials$payload$id))
  cat(sprintf("  Token bytes: %s\n", nchar(token)))
  cat(sprintf("  Discovery:   %s\n", discovery$token_endpoint))
  cat(sprintf("  Resource:    %s\n", resource_url))
  cat(sprintf("  Body bytes:  %s\n", nchar(resource_body)))
}

main()
