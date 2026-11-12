solid_is_scalar_string <- function(value) {
  is.character(value) &&
    length(value) == 1 &&
    !is.na(value) &&
    nzchar(trimws(value))
}

solid_assert_scalar_string <- function(value, arg) {
  if (!solid_is_scalar_string(value)) {
    stop(sprintf("`%s` must be a non-empty string.", arg), call. = FALSE)
  }

  invisible(value)
}

solid_assert_named_list <- function(value, arg) {
  if (is.null(value)) {
    return(invisible(list()))
  }

  if (!is.list(value)) {
    stop(sprintf("`%s` must be a named list.", arg), call. = FALSE)
  }

  value_names <- names(value)
  if (is.null(value_names) || any(!nzchar(value_names))) {
    stop(sprintf("`%s` must be a named list.", arg), call. = FALSE)
  }

  invisible(value)
}

solid_trim_trailing_slash <- function(value) {
  sub("/+$", "", value)
}

solid_compact_list <- function(value) {
  value[!vapply(value, is.null, logical(1))]
}

`%||%` <- function(x, y) {
  if (is.null(x)) y else x
}

solid_base64url_encode <- function(value) {
  if (is.character(value)) {
    value <- charToRaw(value)
  }
  jose::base64url_encode(value)
}

solid_base64_encode <- function(value) {
  if (is.character(value)) {
    value <- charToRaw(value)
  }
  openssl::base64_encode(value)
}

solid_percent_encode <- function(value) {
  utils::URLencode(value, reserved = TRUE)
}

solid_parse_json <- function(text) {
  jsonlite::fromJSON(text, simplifyVector = FALSE)
}

solid_json <- function(value) {
  jsonlite::toJSON(
    value,
    auto_unbox = TRUE,
    null = "null",
    pretty = FALSE
  )
}

solid_resp_text <- function(resp) {
  if (!httr2::resp_has_body(resp)) {
    return("")
  }

  tryCatch(httr2::resp_body_string(resp), error = function(...) "")
}

solid_resp_json <- function(resp) {
  body <- solid_resp_text(resp)
  if (!nzchar(body)) {
    return(list())
  }

  solid_parse_json(body)
}

solid_truncate <- function(value, max_chars = 500L) {
  if (nchar(value, type = "chars") <= max_chars) {
    return(value)
  }

  paste0(substr(value, 1, max_chars), "... [truncated]")
}

solid_error_message <- function(resp) {
  payload <- tryCatch(solid_resp_json(resp), error = function(...) NULL)
  candidates <- character()

  if (is.list(payload)) {
    candidates <- unlist(
      list(
        payload$message %||% NULL,
        payload$error_description %||% NULL,
        payload$error %||% NULL,
        payload$details %||% NULL
      ),
      use.names = FALSE
    )
    candidates <- as.character(candidates)
  }

  candidates <- candidates[nzchar(candidates)]
  if (length(candidates) > 0) {
    return(candidates[[1]])
  }

  solid_truncate(trimws(solid_resp_text(resp)))
}

solid_stop_for_response <- function(resp, step, method, url) {
  message <- solid_error_message(resp)
  status <- httr2::resp_status(resp)
  content_type <- httr2::resp_header(resp, "content-type", default = NULL)
  www_authenticate <- httr2::resp_header(
    resp,
    "www-authenticate",
    default = NULL
  )

  details <- c(
    sprintf(
      "%s failed: %s %s returned HTTP %s%s",
      step,
      method,
      url,
      status,
      if (nzchar(message)) paste0(": ", message) else " (empty body)."
    ),
    if (!is.null(content_type)) paste0("  Content-Type: ", content_type),
    if (!is.null(www_authenticate)) {
      paste0("  WWW-Authenticate: ", www_authenticate)
    }
  )

  stop(paste(details, collapse = "\n"), call. = FALSE)
}

solid_debug_enabled <- function() {
  isTRUE(getOption("solidauthr.debug")) ||
    tolower(trimws(Sys.getenv("SOLID_DEBUG", unset = ""))) %in%
      c("1", "true", "yes", "y", "on")
}

solid_debug_log <- function(...) {
  if (!solid_debug_enabled()) {
    return(invisible(FALSE))
  }

  message("[solidauthr] ", paste0(..., collapse = ""))
  invisible(TRUE)
}

solid_normalize_htu <- function(url) {
  without_fragment <- sub("#.*$", "", url)
  without_query <- sub("\\?.*$", "", without_fragment)
  parts <- regmatches(
    without_query,
    regexec(
      "^([A-Za-z][A-Za-z0-9+.-]*://[^/]+)(/.*)?$",
      without_query,
      perl = TRUE
    )
  )[[1]]

  if (length(parts) == 0) {
    stop(
      sprintf("Unable to normalize URL for DPoP proof: %s", url),
      call. = FALSE
    )
  }

  path <- if (length(parts) >= 3 && nzchar(parts[[3]])) parts[[3]] else "/"
  paste0(parts[[2]], path)
}

solid_origin_key <- function(url) {
  normalized <- solid_normalize_htu(url)
  sub("^([A-Za-z][A-Za-z0-9+.-]*://[^/]+).*$", "\\1", normalized, perl = TRUE)
}

solid_build_well_known_url <- function(issuer) {
  paste0(solid_trim_trailing_slash(issuer), "/.well-known/openid-configuration")
}

solid_require_method <- function(method) {
  solid_assert_scalar_string(method, "method")
  toupper(trimws(method))
}

solid_first_header <- function(resp, header) {
  value <- httr2::resp_header(resp, header, default = NULL)
  if (is.null(value) || !nzchar(value)) {
    return(NULL)
  }
  value
}
