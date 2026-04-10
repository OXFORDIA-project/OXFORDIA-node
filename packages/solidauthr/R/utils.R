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

solid_resp_json <- function(resp) {
  body <- httr2::resp_body_string(resp)
  if (!nzchar(body)) {
    return(list())
  }

  solid_parse_json(body)
}

solid_error_message <- function(resp) {
  payload <- tryCatch(solid_resp_json(resp), error = function(...) NULL)
  candidates <- character()

  if (is.list(payload)) {
    candidates <- c(
      payload$message %||% NULL,
      payload$error_description %||% NULL,
      payload$error %||% NULL,
      payload$details %||% NULL
    )
  }

  candidates <- candidates[nzchar(candidates)]
  if (length(candidates) > 0) {
    return(candidates[[1]])
  }

  body <- httr2::resp_body_string(resp)
  if (nzchar(body)) {
    return(body)
  }

  ""
}

solid_stop_for_response <- function(resp, context) {
  message <- solid_error_message(resp)
  status <- httr2::resp_status(resp)

  if (nzchar(message)) {
    stop(sprintf("%s failed (%s): %s", context, status, message), call. = FALSE)
  }

  stop(sprintf("%s failed (%s).", context, status), call. = FALSE)
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
