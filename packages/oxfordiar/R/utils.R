ox_is_scalar_string <- function(value) {
  is.character(value) &&
    length(value) == 1 &&
    !is.na(value) &&
    nzchar(trimws(value))
}

ox_assert_scalar_string <- function(value, arg) {
  if (!ox_is_scalar_string(value)) {
    stop(
      sprintf("`%s` must be a non-empty string.", arg),
      call. = FALSE
    )
  }
  invisible(value)
}

ox_assert_named_list <- function(value, arg) {
  if (!is.list(value)) {
    stop(
      sprintf("`%s` must be a list.", arg),
      call. = FALSE
    )
  }

  value_names <- names(value)
  if (
    is.null(value_names) ||
      any(!nzchar(value_names))
  ) {
    stop(
      sprintf("`%s` must be a named list.", arg),
      call. = FALSE
    )
  }

  invisible(value)
}

ox_normalize_name <- function(value) {
  ox_assert_scalar_string(value, deparse(substitute(value)))
  normalized <- trimws(value)
  normalized <- gsub("[_[:space:]]+", "-", normalized)
  tolower(normalized)
}

ox_trim_trailing_slash <- function(value) {
  sub("/+$", "", value)
}

ox_url_origin <- function(value, arg = "value") {
  ox_assert_scalar_string(value, arg)

  parts <- regmatches(
    value,
    regexec("^([A-Za-z][A-Za-z0-9+.-]*://[^/?#]+)", value, perl = TRUE)
  )[[1]]

  if (length(parts) == 0) {
    stop(
      sprintf("`%s` must be an absolute URL with a scheme and authority.", arg),
      call. = FALSE
    )
  }

  parts[[2]]
}

ox_compact_list <- function(value) {
  value[!vapply(value, is.null, logical(1))]
}

`%||%` <- function(x, y) {
  if (is.null(x)) {
    y
  } else {
    x
  }
}

ox_bind_rows_fill <- function(rows) {
  rows <- Filter(
    Negate(is.null),
    rows
  )
  if (length(rows) == 0) {
    return(data.frame())
  }

  rows <- lapply(
    rows,
    function(row) {
      if (is.data.frame(row)) {
        return(row)
      }
      if (is.list(row)) {
        return(as.data.frame(
          row,
          stringsAsFactors = FALSE,
          check.names = FALSE
        ))
      }
      stop("Rows must be data frames or named lists.", call. = FALSE)
    }
  )

  all_names <- unique(
    unlist(
      lapply(rows, names),
      use.names = FALSE
    )
  )
  rows <- lapply(
    rows,
    function(row) {
      missing_names <- setdiff(all_names, names(row))
      for (missing_name in missing_names) {
        row[[missing_name]] <- NA
      }
      row[, all_names, drop = FALSE]
    }
  )

  out <- do.call(rbind, rows)
  rownames(out) <- NULL
  out
}

ox_empty_df <- function(columns = character()) {
  out <- stats::setNames(
    vector("list", length(columns)),
    columns
  )
  as.data.frame(out, stringsAsFactors = FALSE, check.names = FALSE)
}

ox_strip_ansi <- function(value) {
  if (
    is.null(value) ||
      length(value) == 0
  ) {
    return(value)
  }

  gsub("\033\\[[0-9;]*m", "", value, perl = TRUE)
}

ox_env_flag <- function(name, default = FALSE) {
  value <- Sys.getenv(name, unset = "")
  if (!nzchar(trimws(value))) {
    return(isTRUE(default))
  }

  tolower(trimws(value)) %in%
    c("1", "true", "yes", "y", "on")
}

ox_truncate_string <- function(value, max_chars = 1000L) {
  if (
    is.null(value) ||
      length(value) == 0
  ) {
    return(value)
  }

  value <- paste(value, collapse = "\n")
  if (nchar(value, type = "chars") <= max_chars) {
    return(value)
  }

  paste0(
    substr(value, 1, max_chars),
    "... [truncated]"
  )
}

ox_render_debug_value <- function(value, max_chars = 1000L) {
  if (is.null(value)) {
    return(NA_character_)
  }

  rendered <- if (
    is.character(value) &&
      length(value) == 1
  ) {
    value
  } else {
    tryCatch(
      jsonlite::toJSON(value, auto_unbox = TRUE, pretty = TRUE, null = "null"),
      error = function(...) {
        paste(
          utils::capture.output(str(value)),
          collapse = "\n"
        )
      }
    )
  }

  ox_truncate_string(rendered, max_chars = max_chars)
}

ox_context_error <- function(message, context = list(), class = "ox_error") {
  err <- simpleError(
    ox_strip_ansi(message),
    call = NULL
  )
  class(err) <- c(class, class(err))
  err$ox_context <- context
  err
}

ox_stop_context <- function(message, context = list(), class = "ox_error") {
  stop(ox_context_error(message, context = context, class = class))
}

ox_error_context <- function(error) {
  error$ox_context %||% list()
}

ox_debug_enabled <- function() {
  isTRUE(getOption("oxfordia.debug")) ||
    ox_env_flag("OX_DEBUG")
}

ox_debug_log <- function(...) {
  if (!ox_debug_enabled()) {
    return(invisible(FALSE))
  }

  message("[oxfordia] ", paste0(..., collapse = ""))
  invisible(TRUE)
}
