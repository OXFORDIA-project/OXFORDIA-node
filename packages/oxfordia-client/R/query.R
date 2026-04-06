ox_query_spec <- function(statistic, ..., data_schema = NULL) {
  ox_assert_scalar_string(statistic, "statistic")
  if (!is.null(data_schema)) {
    ox_assert_scalar_string(data_schema, "data_schema")
  }

  structure(
    list(
      statistic = ox_normalize_name(statistic),
      data_schema = if (is.null(data_schema)) NULL else ox_normalize_name(data_schema),
      fields = list(...)
    ),
    class = c("ox_query_spec", "list")
  )
}

ox_mean <- function(graph_path, data_schema = NULL) {
  ox_query_spec(
    statistic = "mean",
    data_schema = data_schema,
    graph_path = graph_path
  )
}

ox_kaplan_meier <- function(time_path, event_path, group_by_path = NULL, data_schema = NULL) {
  ox_query_spec(
    statistic = "kaplan-meier",
    data_schema = data_schema,
    time_path = time_path,
    event_path = event_path,
    group_by_path = group_by_path
  )
}

ox_query <- function(client = default_client(), spec, targets, fail_fast = TRUE) {
  stat_plugin <- ox_resolve_stat_plugin(client, spec$statistic)
  targets <- ox_targets(targets)
  ox_validate_query_targets(client, targets)

  responses <- vector("list", length(targets))
  parsed_rows <- vector("list", length(targets))
  errors <- list()

  for (index in seq_along(targets)) {
    target <- targets[[index]]
    result <- tryCatch(
      ox_query_one(client, spec, target, stat_plugin),
      error = function(error) error
    )

    if (inherits(result, "error")) {
      if (isTRUE(fail_fast)) {
        stop(result)
      }

      errors[[length(errors) + 1]] <- ox_error_row(target, spec, result)
      next
    }

    responses[[index]] <- result
    parsed_rows[[index]] <- result$data
  }

  data <- stat_plugin$combine_results(parsed_rows)
  if (length(errors) == 0) {
    error_df <- ox_empty_df(c("server", "resource_uri", "data_schema", "statistic", "error"))
  } else {
    error_df <- ox_bind_rows_fill(errors)
  }

  structure(
    list(
      data = data,
      errors = error_df,
      responses = Filter(Negate(is.null), responses),
      spec = spec,
      targets = targets
    ),
    class = c("ox_result_set", "list")
  )
}

ox_query_one <- function(client, spec, target, stat_plugin) {
  server <- ox_resolve_server(client, target$server)
  data_schema <- ox_resolve_data_schema(target, spec)
  data_plugin <- if (is.null(data_schema)) NULL else ox_resolve_data_plugin(client, data_schema)
  auth <- ox_resolve_request_auth(client, server)

  body <- ox_build_request_body(spec, target, stat_plugin, data_plugin)
  response <- ox_perform_request(server, target, stat_plugin$route, body, auth = auth)
  parsed <- tryCatch(
    stat_plugin$parse_result(response$body, target, spec),
    error = function(error) {
      ox_stop_context(
        sprintf("Failed to parse response from '%s': %s", response$url, conditionMessage(error)),
        context = list(
          url = response$url,
          status = response$status,
          auth_type = response$auth_type,
          request_body = body,
          response_headers = response$headers,
          response_content_type = ox_header_value(response$headers, "content-type"),
          response_preview = ox_render_debug_value(response$text, max_chars = 1200L)
        ),
        class = "ox_parse_error"
      )
    }
  )
  parsed <- ox_as_result_data_frame(parsed)
  parsed <- ox_add_provenance(parsed, target, spec, data_schema)

  list(
    request = body,
    response = response,
    data = parsed
  )
}

ox_resolve_data_schema <- function(target, spec) {
  if (!is.null(target$data_schema)) {
    return(target$data_schema)
  }
  spec$data_schema
}

ox_build_request_body <- function(spec, target, stat_plugin, data_plugin = NULL) {
  body <- list(resourceUri = target$resource_uri)

  for (field_name in names(stat_plugin$fields)) {
    field <- stat_plugin$fields[[field_name]]
    value <- spec$fields[[field_name]]

    if (is.null(value)) {
      if (isTRUE(field$required)) {
        stop(
          sprintf("Query spec for '%s' is missing required field '%s'.", spec$statistic, field_name),
          call. = FALSE
        )
      }
      next
    }

    body[[field$json_key]] <- ox_encode_field_value(value, field, data_plugin)
  }

  body
}

ox_encode_field_value <- function(value, field, data_plugin = NULL) {
  if (field$kind == "graph_path") {
    return(ox_resolve_graph_path(value, field, data_plugin))
  }
  if (field$kind == "string") {
    ox_assert_scalar_string(value, field$name)
    return(value)
  }
  if (field$kind == "number") {
    if (!is.numeric(value) || length(value) != 1 || is.na(value)) {
      stop(sprintf("Field '%s' must be a single number.", field$name), call. = FALSE)
    }
    return(as.numeric(value))
  }
  if (field$kind == "boolean") {
    if (!is.logical(value) || length(value) != 1 || is.na(value)) {
      stop(sprintf("Field '%s' must be TRUE or FALSE.", field$name), call. = FALSE)
    }
    return(isTRUE(value))
  }
  value
}

ox_resolve_graph_path <- function(value, field, data_plugin = NULL) {
  if (inherits(value, "ox_shortcut") || (is.character(value) && length(value) == 1)) {
    if (is.null(data_plugin)) {
      stop(
        sprintf(
          "Field '%s' uses a shortcut but no data schema was provided on the query spec or target.",
          field$name
        ),
        call. = FALSE
      )
    }
    shortcut_name <- if (inherits(value, "ox_shortcut")) value$name else value[[1]]
    return(ox_resolve_shortcut_from_plugin(data_plugin, shortcut_name))
  }

  if (is.list(value) && !is.null(value$start)) {
    return(value)
  }

  stop(
    sprintf(
      "Field '%s' must be a graph path or shortcut reference.",
      field$name
    ),
    call. = FALSE
  )
}

ox_validate_query_targets <- function(client, targets) {
  grouped_targets <- split(targets, vapply(targets, function(target) target$server, character(1)))

  for (server_name in names(grouped_targets)) {
    server <- ox_resolve_server(client, server_name)
    if (!is.null(server$base_url)) {
      next
    }

    origins <- unique(vapply(
      grouped_targets[[server_name]],
      function(target) ox_url_origin(target$resource_uri, "target$resource_uri"),
      character(1)
    ))

    if (length(origins) > 1) {
      stop(
        sprintf(
          "Server '%s' maps to multiple resource origins (%s). Register that server with an explicit `base_url` or use distinct server names.",
          server_name,
          paste(origins, collapse = ", ")
        ),
        call. = FALSE
      )
    }
  }

  invisible(targets)
}

ox_perform_request <- function(server, target, route, body, auth = NULL) {
  base_url <- ox_resolve_server_base_url(server, target)
  url <- paste0(
    base_url,
    server$api_path,
    "/",
    route
  )

  auth_type <- auth$type %||% "none"
  ox_debug_log("POST ", url)
  ox_debug_log("  auth: ", auth_type)
  ox_debug_log("  body: ", ox_render_debug_value(body, max_chars = 1200L))

  response <- ox_post_json(url, body, auth)
  status <- httr2::resp_status(response)
  response_headers <- ox_response_headers(response)
  response_text_result <- ox_response_text(response)
  if (!is.null(response_text_result$error)) {
    ox_debug_log("  status: ", status)
    ox_debug_log("  response headers: ", ox_render_debug_value(response_headers, max_chars = 1200L))
    ox_debug_log("  body read error: ", response_text_result$error)

    ox_stop_context(
      sprintf(
        "Request to '%s' returned HTTP %s, but the response body could not be read: %s",
        url,
        status,
        response_text_result$error
      ),
      context = list(
        url = url,
        status = status,
        auth_type = auth_type,
        request_body = body,
        response_headers = response_headers,
        response_content_type = ox_header_value(response_headers, "content-type"),
        response_body_error = response_text_result$error
      ),
      class = "ox_http_error"
    )
  }

  response_text <- response_text_result$text %||% ""
  if (!nzchar(response_text)) {
    ox_debug_log("  status: ", status)
    ox_debug_log("  response headers: ", ox_render_debug_value(response_headers, max_chars = 1200L))
    ox_debug_log("  response body: <empty>")

    ox_stop_context(
      sprintf("Request to '%s' returned HTTP %s with an empty response body.", url, status),
      context = list(
        url = url,
        status = status,
        auth_type = auth_type,
        request_body = body,
        response_headers = response_headers,
        response_content_type = ox_header_value(response_headers, "content-type"),
        response_preview = ""
      ),
      class = "ox_http_error"
    )
  }

  response_body <- ox_parse_response_body(response_text)
  ox_debug_log("  status: ", status)
  ox_debug_log("  response headers: ", ox_render_debug_value(response_headers, max_chars = 1200L))
  ox_debug_log("  response body: ", ox_render_debug_value(response_text, max_chars = 1200L))

  list(
    url = url,
    status = status,
    auth_type = auth_type,
    headers = response_headers,
    body = response_body,
    text = response_text
  )
}

ox_resolve_server_base_url <- function(server, target = NULL) {
  if (!is.null(server$base_url)) {
    return(server$base_url)
  }

  if (is.null(target) || !ox_is_scalar_string(target$resource_uri %||% NULL)) {
    stop(
      sprintf(
        "Server '%s' does not define `base_url`, and the target does not provide a usable `resource_uri` to derive it from.",
        server$name %||% "<unknown>"
      ),
      call. = FALSE
    )
  }

  ox_url_origin(target$resource_uri, "target$resource_uri")
}

ox_post_json <- function(url, body, auth = NULL) {
  tryCatch(
    {
      if (!is.null(auth) && identical(auth$type, "solid")) {
        session <- ox_resolve_solid_session(auth)
        return(
          session$post(
            url,
            body = body,
            content_type = "application/json",
            headers = list(Accept = "application/json")
          )
        )
      }

      headers <- ox_auth_header_values(auth)
      headers$Accept <- headers$Accept %||% "application/json"

      req <- httr2::request(url)
      req <- httr2::req_method(req, "POST")
      req <- httr2::req_body_json(req, body)
      req <- do.call(httr2::req_headers, c(list(req), headers))
      req <- httr2::req_error(req, is_error = function(resp) FALSE)

      response <- httr2::req_perform(req)
      status <- httr2::resp_status(response)
      if (status >= 400) {
        response_headers <- ox_response_headers(response)
        response_text_result <- ox_response_text(response)
        response_text <- response_text_result$text %||% ""
        response_body <- ox_parse_response_body(response_text)
        rendered <- if (is.character(response_body)) response_body else jsonlite::toJSON(response_body, auto_unbox = TRUE, pretty = TRUE)

        ox_debug_log("  status: ", status)
        ox_debug_log("  response headers: ", ox_render_debug_value(response_headers, max_chars = 1200L))
        ox_debug_log("  response body: ", ox_render_debug_value(response_text, max_chars = 1200L))

        ox_stop_context(
          sprintf("Request to '%s' failed with HTTP %s: %s", url, status, rendered),
          context = list(
            url = url,
            status = status,
            auth_type = auth$type %||% "none",
            request_body = body,
            response_headers = response_headers,
            response_content_type = ox_header_value(response_headers, "content-type"),
            response_preview = ox_render_debug_value(response_text, max_chars = 1200L),
            response_body_error = response_text_result$error %||% NULL
          ),
          class = "ox_http_error"
        )
      }

      response
    },
    error = function(error) {
      if (inherits(error, "ox_http_error")) {
        stop(error)
      }

      ox_stop_context(
        conditionMessage(error),
        context = list(
          url = url,
          auth_type = auth$type %||% "none",
          request_body = body
        ),
        class = "ox_http_error"
      )
    }
  )
}

ox_auth_header_values <- function(auth) {
  if (is.null(auth) || identical(auth$type, "none")) {
    return(list())
  }
  if (identical(auth$type, "solid")) {
    return(list())
  }
  if (identical(auth$type, "bearer")) {
    return(list(Authorization = paste("Bearer", auth$token)))
  }
  if (identical(auth$type, "headers")) {
    return(auth$headers)
  }

  stop(sprintf("Unsupported auth type '%s'.", auth$type), call. = FALSE)
}

ox_parse_response_body <- function(response_text) {
  if (!nzchar(response_text)) {
    return(list())
  }

  tryCatch(
    jsonlite::fromJSON(response_text, simplifyVector = FALSE),
    error = function(error) response_text
  )
}

ox_as_result_data_frame <- function(value) {
  if (is.data.frame(value)) {
    return(value)
  }
  if (is.list(value)) {
    return(as.data.frame(value, stringsAsFactors = FALSE, check.names = FALSE))
  }
  data.frame(value = value, stringsAsFactors = FALSE, check.names = FALSE)
}

ox_add_provenance <- function(data, target, spec, data_schema) {
  if (is.null(data) || !is.data.frame(data)) {
    return(data)
  }

  row_count <- nrow(data)
  data$server <- rep(target$server, row_count)
  data$resource_uri <- rep(target$resource_uri, row_count)
  data$data_schema <- rep(data_schema %||% NA_character_, row_count)
  data$statistic <- rep(spec$statistic, row_count)

  ordered_names <- c("server", "resource_uri", "data_schema", "statistic", setdiff(names(data), c("server", "resource_uri", "data_schema", "statistic")))
  data[, ordered_names, drop = FALSE]
}

ox_error_row <- function(target, spec, error) {
  context <- ox_error_context(error)

  data.frame(
    server = target$server,
    resource_uri = target$resource_uri,
    data_schema = ox_resolve_data_schema(target, spec),
    statistic = spec$statistic,
    error = ox_strip_ansi(conditionMessage(error)),
    url = context$url %||% NA_character_,
    status = if (is.null(context$status)) NA_integer_ else as.integer(context$status),
    auth_type = context$auth_type %||% NA_character_,
    response_content_type = context$response_content_type %||% NA_character_,
    response_body_error = context$response_body_error %||% NA_character_,
    request_body = ox_render_debug_value(context$request_body, max_chars = 1200L),
    response_preview = ox_render_debug_value(context$response_preview, max_chars = 1200L),
    response_headers = ox_render_debug_value(context$response_headers, max_chars = 1200L),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_response_headers <- function(response) {
  headers <- tryCatch(httr2::resp_headers(response), error = function(...) list())
  if (length(headers) == 0) {
    return(list())
  }

  header_values <- unclass(headers)
  header_names <- names(headers)
  if (!is.null(header_names)) {
    names(header_values) <- header_names
  }

  as.list(header_values)
}

ox_response_text <- function(response) {
  tryCatch(
    list(text = httr2::resp_body_string(response), error = NULL),
    error = function(error) {
      list(
        text = NULL,
        error = ox_strip_ansi(conditionMessage(error))
      )
    }
  )
}

ox_header_value <- function(headers, name, default = NULL) {
  if (is.null(headers) || length(headers) == 0) {
    return(default)
  }

  header_names <- tolower(names(headers))
  match_index <- match(tolower(name), header_names)
  if (is.na(match_index)) {
    return(default)
  }

  headers[[match_index]]
}

print.ox_result_set <- function(x, ...) {
  cat(
    sprintf(
      "<ox_result_set> %d row(s), %d error(s), %d response(s)\n",
      nrow(x$data),
      nrow(x$errors),
      length(x$responses)
    )
  )
  if (nrow(x$data) > 0) {
    print(utils::head(x$data, 10))
  }
  if (nrow(x$errors) > 0) {
    cat("Errors:\n")
    print(x$errors)
  }
  invisible(x)
}
