#' Execute a Federated Oxfordia Query
#'
#' @param route API route segment.
#' @param targets One or more targets created by `ox_target()`.
#' @param fields Named list of request fields.
#' @param auth Default authentication configuration.
#' @param parse_result Function that converts a target payload into rows.
#' @param combine_results Function that combines successful target rows.
#' @param statistic Statistic label used in result provenance.
#' @param fail_fast Whether to stop on the first target error.
#'
#' @export
ox_query <- function(
  route,
  targets,
  fields = list(),
  auth = ox_auth_none(),
  parse_result = NULL,
  combine_results = NULL,
  statistic = route,
  fail_fast = TRUE
) {
  ox_assert_scalar_string(route, "route")
  ox_assert_scalar_string(statistic, "statistic")
  auth <- ox_normalize_auth(auth)
  targets <- ox_query_targets(targets)

  if (!is.list(fields)) {
    stop("`fields` must be a named list.", call. = FALSE)
  }
  if (length(fields) > 0) {
    ox_assert_named_list(fields, "fields")
  }

  if (is.null(parse_result)) {
    parse_result <- function(payload, target) payload
  }
  if (!is.function(parse_result)) {
    stop("`parse_result` must be a function.", call. = FALSE)
  }

  if (is.null(combine_results)) {
    combine_results <- function(rows) ox_bind_rows_fill(rows)
  }
  if (!is.function(combine_results)) {
    stop("`combine_results` must be a function.", call. = FALSE)
  }

  responses <- vector("list", length(targets))
  by_target <- vector("list", length(targets))
  errors <- list()

  for (index in seq_along(targets)) {
    target <- targets[[index]]
    result <- tryCatch(
      ox_query_one(
        route = route,
        target = target,
        fields = fields,
        auth = auth,
        parse_result = parse_result,
        statistic = statistic
      ),
      error = function(error) error
    )

    if (inherits(result, "error")) {
      if (isTRUE(fail_fast)) {
        stop(result)
      }

      errors[[
        length(errors) +
          1
      ]] <- ox_error_row(target, statistic, result)
      next
    }

    responses[[index]] <- result
    by_target[[index]] <- result$data
  }

  names(by_target) <- vapply(
    targets,
    function(target) target$name,
    character(1)
  )
  by_target <- Filter(Negate(is.null), by_target)
  data <- combine_results(by_target)
  error_columns <- c(
    "target",
    "resource_uri",
    "statistic",
    "error",
    "url",
    "status",
    "auth_type",
    "response_content_type",
    "response_body_error",
    "request_body",
    "response_preview",
    "response_headers"
  )
  error_df <- if (length(errors) == 0) {
    ox_empty_df(error_columns)
  } else {
    ox_bind_rows_fill(errors)
  }

  structure(
    list(
      data = data,
      by_target = by_target,
      errors = error_df,
      responses = Filter(
        Negate(is.null),
        responses
      ),
      route = route,
      statistic = statistic,
      fields = fields,
      targets = targets
    ),
    class = c("ox_result_set", "list")
  )
}

ox_query_one <- function(route, target, fields, auth, parse_result, statistic) {
  request_auth <- ox_resolve_request_auth(auth, target)
  body <- ox_build_request_body(target, fields)
  response <- ox_perform_request(target, route, body, auth = request_auth)
  parsed <- tryCatch(
    parse_result(response$body, target),
    error = function(error) {
      ox_stop_context(
        sprintf(
          "Failed to parse response from '%s': %s",
          response$url,
          conditionMessage(error)
        ),
        context = list(
          url = response$url,
          status = response$status,
          auth_type = response$auth_type,
          request_body = body,
          response_headers = response$headers,
          response_content_type = ox_header_value(
            response$headers,
            "content-type"
          ),
          response_preview = ox_render_debug_value(
            response$text,
            max_chars = 1200L
          )
        ),
        class = "ox_parse_error"
      )
    }
  )
  parsed <- ox_as_result_data_frame(parsed)
  parsed <- ox_add_provenance(parsed, target, statistic)

  list(request = body, response = response, data = parsed)
}

ox_build_request_body <- function(target, fields) {
  encoded_fields <- lapply(fields, ox_encode_query_value)
  ox_compact_list(
    c(
      list(resourceUri = target$resource_uri),
      encoded_fields
    )
  )
}

ox_perform_request <- function(target, route, body, auth = NULL) {
  base_url <- ox_resolve_target_base_url(target)
  url <- paste0(base_url, target$api_path, "/", route)

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
    ox_debug_log(
      "  response headers: ",
      ox_render_debug_value(response_headers, max_chars = 1200L)
    )
    ox_debug_log("  body read error: ", response_text_result$error)

    ox_stop_context(
      sprintf(
        paste(
          "Request to '%s' returned HTTP %s, but the response body",
          "could not be read: %s"
        ),
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
        response_content_type = ox_header_value(
          response_headers,
          "content-type"
        ),
        response_body_error = response_text_result$error
      ),
      class = "ox_http_error"
    )
  }

  response_text <- response_text_result$text %||% ""
  if (!nzchar(response_text)) {
    ox_debug_log("  status: ", status)
    ox_debug_log(
      "  response headers: ",
      ox_render_debug_value(response_headers, max_chars = 1200L)
    )
    ox_debug_log("  response body: <empty>")

    ox_stop_context(
      sprintf(
        "Request to '%s' returned HTTP %s with an empty response body.",
        url,
        status
      ),
      context = list(
        url = url,
        status = status,
        auth_type = auth_type,
        request_body = body,
        response_headers = response_headers,
        response_content_type = ox_header_value(
          response_headers,
          "content-type"
        ),
        response_preview = ""
      ),
      class = "ox_http_error"
    )
  }

  response_body <- ox_parse_response_body(response_text)
  ox_debug_log("  status: ", status)
  ox_debug_log(
    "  response headers: ",
    ox_render_debug_value(response_headers, max_chars = 1200L)
  )
  ox_debug_log(
    "  response body: ",
    ox_render_debug_value(response_text, max_chars = 1200L)
  )

  list(
    url = url,
    status = status,
    auth_type = auth_type,
    headers = response_headers,
    body = response_body,
    text = response_text
  )
}

ox_resolve_target_base_url <- function(target) {
  if (!is.null(target$base_url)) {
    return(target$base_url)
  }

  if (!ox_is_scalar_string(target$resource_uri %||% NULL)) {
    stop(
      sprintf(
        paste(
          "Target '%s' does not define `base_url`, and its",
          "`resource_uri` cannot be used to derive one."
        ),
        target$name %||% "<unknown>"
      ),
      call. = FALSE
    )
  }

  ox_url_origin(target$resource_uri, "target$resource_uri")
}

ox_post_json <- function(url, body, auth = NULL) {
  tryCatch(
    {
      if (
        !is.null(auth) &&
          identical(auth$type, "solid")
      ) {
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
      req <- do.call(
        httr2::req_headers,
        c(
          list(req),
          headers
        )
      )
      req <- httr2::req_error(req, is_error = function(resp) FALSE)

      response <- httr2::req_perform(req)
      status <- httr2::resp_status(response)
      if (status >= 400) {
        response_headers <- ox_response_headers(response)
        response_text_result <- ox_response_text(response)
        response_text <- response_text_result$text %||% ""
        response_body <- ox_parse_response_body(response_text)
        rendered <- if (is.character(response_body)) {
          response_body
        } else {
          jsonlite::toJSON(response_body, auto_unbox = TRUE, pretty = TRUE)
        }

        ox_debug_log("  status: ", status)
        ox_debug_log(
          "  response headers: ",
          ox_render_debug_value(response_headers, max_chars = 1200L)
        )
        ox_debug_log(
          "  response body: ",
          ox_render_debug_value(response_text, max_chars = 1200L)
        )

        ox_stop_context(
          sprintf(
            "Request to '%s' failed with HTTP %s: %s",
            url,
            status,
            rendered
          ),
          context = list(
            url = url,
            status = status,
            auth_type = auth$type %||% "none",
            request_body = body,
            response_headers = response_headers,
            response_content_type = ox_header_value(
              response_headers,
              "content-type"
            ),
            response_preview = ox_render_debug_value(
              response_text,
              max_chars = 1200L
            ),
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

ox_add_provenance <- function(data, target, statistic) {
  if (
    is.null(data) ||
      !is.data.frame(data)
  ) {
    return(data)
  }

  row_count <- nrow(data)
  data$target <- rep(target$name, row_count)
  data$resource_uri <- rep(target$resource_uri, row_count)
  data$statistic <- rep(statistic, row_count)

  ordered_names <- c(
    "target",
    "resource_uri",
    "statistic",
    setdiff(
      names(data),
      c("target", "resource_uri", "statistic")
    )
  )
  data[, ordered_names, drop = FALSE]
}

ox_error_row <- function(target, statistic, error) {
  context <- ox_error_context(error)

  data.frame(
    target = target$name,
    resource_uri = target$resource_uri,
    statistic = statistic,
    error = ox_strip_ansi(conditionMessage(error)),
    url = context$url %||% NA_character_,
    status = if (is.null(context$status)) {
      NA_integer_
    } else {
      as.integer(context$status)
    },
    auth_type = context$auth_type %||% NA_character_,
    response_content_type = context$response_content_type %||%
      NA_character_,
    response_body_error = context$response_body_error %||%
      NA_character_,
    request_body = ox_render_debug_value(
      context$request_body,
      max_chars = 1200L
    ),
    response_preview = ox_render_debug_value(
      context$response_preview,
      max_chars = 1200L
    ),
    response_headers = ox_render_debug_value(
      context$response_headers,
      max_chars = 1200L
    ),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_response_headers <- function(response) {
  headers <- tryCatch(
    httr2::resp_headers(response),
    error = function(...) list()
  )
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
    list(
      text = httr2::resp_body_string(response),
      error = NULL
    ),
    error = function(error) {
      list(text = NULL, error = ox_strip_ansi(conditionMessage(error)))
    }
  )
}

ox_header_value <- function(headers, name, default = NULL) {
  if (
    is.null(headers) ||
      length(headers) == 0
  ) {
    return(default)
  }

  header_names <- tolower(names(headers))
  match_index <- match(
    tolower(name),
    header_names
  )
  if (is.na(match_index)) {
    return(default)
  }

  headers[[match_index]]
}

#' @export
print.ox_result_set <- function(x, ...) {
  data_rows <- if (is.data.frame(x$data)) nrow(x$data) else length(x$data)
  cat(
    sprintf(
      "<ox_result_set> %d row(s), %d error(s), %d response(s)\n",
      data_rows,
      nrow(x$errors),
      length(x$responses)
    )
  )
  if (is.data.frame(x$data) && nrow(x$data) > 0) {
    print(utils::head(x$data, 10))
  }
  if (nrow(x$errors) > 0) {
    cat("Errors:\n")
    print(x$errors)
  }
  invisible(x)
}
