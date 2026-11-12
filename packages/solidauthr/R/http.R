solid_no_error <- function(req) {
  httr2::req_error(req, is_error = function(resp) FALSE)
}

# Performs a request, tagging transport failures (DNS, connection refused, TLS)
# with the step and URL so callers can tell which request never got a response.
solid_perform <- function(req, step, method, url) {
  solid_debug_log(step, ": ", method, " ", url)
  resp <- tryCatch(
    httr2::req_perform(req),
    error = function(error) {
      stop(
        sprintf(
          "%s failed: %s %s could not be completed: %s",
          step,
          method,
          url,
          conditionMessage(error)
        ),
        call. = FALSE
      )
    }
  )
  solid_debug_log(
    step,
    ": HTTP ",
    httr2::resp_status(resp),
    if (!httr2::resp_has_body(resp)) " (empty body)" else ""
  )
  resp
}

solid_apply_headers <- function(req, headers) {
  if (is.null(headers) || length(headers) == 0) {
    return(req)
  }

  solid_assert_named_list(headers, "headers")
  do.call(httr2::req_headers, c(list(req), headers))
}

solid_apply_query <- function(req, query) {
  if (is.null(query) || length(query) == 0) {
    return(req)
  }

  solid_assert_named_list(query, "query")
  do.call(httr2::req_url_query, c(list(req), query))
}

solid_apply_body <- function(req, body, content_type = NULL) {
  if (is.null(body)) {
    return(req)
  }

  normalized_type <- tolower(sub(";.*$", "", content_type %||% ""))

  if (
    is.list(body) &&
      identical(normalized_type, "application/x-www-form-urlencoded")
  ) {
    return(do.call(httr2::req_body_form, c(list(req), body)))
  }

  if (
    is.list(body) &&
      (is.null(content_type) || identical(normalized_type, "application/json"))
  ) {
    return(httr2::req_body_json(req, body))
  }

  if (is.raw(body) || is.character(body)) {
    if (is.null(content_type)) {
      return(httr2::req_body_raw(req, body))
    }

    return(httr2::req_body_raw(req, body, type = content_type))
  }

  stop(
    "`body` must be NULL, a named list, a raw vector, or a length-1 character string.",
    call. = FALSE
  )
}

solid_build_request <- function(
  url,
  method = "GET",
  headers = NULL,
  query = NULL,
  body = NULL,
  content_type = NULL
) {
  req <- httr2::request(url)
  req <- solid_apply_query(req, query)
  req <- solid_apply_body(req, body, content_type = content_type)
  req <- httr2::req_method(req, solid_require_method(method))
  req <- solid_apply_headers(req, headers)
  solid_no_error(req)
}

solid_attach_redacted_headers <- function(req, headers) {
  if (length(headers) == 0) {
    return(req)
  }

  do.call(httr2::req_headers_redacted, c(list(req), headers))
}
