ox_is_scalar_string <- function(value) {
  is.character(value) &&
    length(value) == 1 &&
    !is.na(value) &&
    nzchar(trimws(value))
}

ox_assert_scalar_string <- function(value, arg) {
  if (!ox_is_scalar_string(value)) {
    stop(sprintf("`%s` must be a non-empty string.", arg), call. = FALSE)
  }
  invisible(value)
}

ox_assert_named_list <- function(value, arg) {
  if (!is.list(value)) {
    stop(sprintf("`%s` must be a list.", arg), call. = FALSE)
  }

  value_names <- names(value)
  if (is.null(value_names) || any(!nzchar(value_names))) {
    stop(sprintf("`%s` must be a named list.", arg), call. = FALSE)
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

ox_compact_list <- function(value) {
  value[!vapply(value, is.null, logical(1))]
}

`%||%` <- function(x, y) {
  if (is.null(x)) y else x
}

ox_is_true <- function(value) {
  isTRUE(value)
}

ox_registry_put <- function(registry, key, value) {
  registry[[ox_normalize_name(key)]] <- value
  registry
}

ox_registry_get <- function(registry, key, what) {
  result <- registry[[ox_normalize_name(key)]]
  if (is.null(result)) {
    stop(sprintf("Unknown %s '%s'.", what, key), call. = FALSE)
  }
  result
}

ox_as_list <- function(value) {
  if (is.null(value)) {
    return(list())
  }
  if (is.list(value) && !is.data.frame(value)) {
    return(value)
  }
  list(value)
}

ox_bind_rows_fill <- function(rows) {
  rows <- Filter(Negate(is.null), rows)
  if (length(rows) == 0) {
    return(data.frame())
  }

  rows <- lapply(rows, function(row) {
    if (is.data.frame(row)) {
      return(row)
    }
    if (is.list(row)) {
      return(as.data.frame(row, stringsAsFactors = FALSE, check.names = FALSE))
    }
    stop("Rows must be data frames or named lists.", call. = FALSE)
  })

  all_names <- unique(unlist(lapply(rows, names), use.names = FALSE))
  rows <- lapply(rows, function(row) {
    missing_names <- setdiff(all_names, names(row))
    for (missing_name in missing_names) {
      row[[missing_name]] <- NA
    }
    row[, all_names, drop = FALSE]
  })

  out <- do.call(rbind, rows)
  rownames(out) <- NULL
  out
}

ox_empty_df <- function(columns = character()) {
  out <- stats::setNames(vector("list", length(columns)), columns)
  as.data.frame(out, stringsAsFactors = FALSE, check.names = FALSE)
}

ox_script_path <- function() {
  file_arg <- grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)
  if (length(file_arg) == 0) {
    stop("Unable to determine the current script path.", call. = FALSE)
  }
  sub("^--file=", "", file_arg[[1]])
}
