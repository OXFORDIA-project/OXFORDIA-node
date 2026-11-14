#' Prepare Group-By Shortcuts for a Statistic Query
#'
#' Validates `group_by` (`NULL`, one shortcut or graph path, or a list of up
#' to two) and returns the request paths together with the column names used
#' for each group in results.
#'
#' @param group_by `NULL`, an `ox_data_shortcut`/`ox_graph_path`, or a list of
#'   up to two of them.
#'
#' @return A list with `paths` (or `NULL`) and `names`.
#'
#' @export
ox_group_by_spec <- function(group_by) {
  if (is.null(group_by)) {
    return(list(paths = NULL, names = character()))
  }
  if (ox_is_path_like(group_by)) {
    group_by <- list(group_by)
  }
  if (!is.list(group_by) || length(group_by) == 0) {
    stop(
      paste(
        "`group_by` must be created by `ox_data_shortcut()` or",
        "`ox_graph_path()` (or be a list of up to two of them), e.g.",
        "`ox_nemaline_shortcut(\"CausativeGene\")`."
      ),
      call. = FALSE
    )
  }
  if (length(group_by) > 2) {
    stop("`group_by` supports at most two shortcuts.", call. = FALSE)
  }

  paths <- lapply(group_by, function(value) {
    if (!ox_is_path_like(value)) {
      stop(
        paste(
          "Each `group_by` entry must be created by `ox_data_shortcut()`",
          "or `ox_graph_path()`."
        ),
        call. = FALSE
      )
    }
    ox_encode_query_value(value)
  })
  group_names <- vapply(
    seq_along(group_by),
    function(index) {
      value <- group_by[[index]]
      name <- value$name %||% paths[[index]]$name %||% ""
      if (nzchar(name)) name else paste0("group_", index)
    },
    character(1)
  )

  list(paths = unname(paths), names = make.unique(group_names))
}

#' Parse a Grouped Statistic Payload
#'
#' Turns `payload$groups` into one row per group: a label column per group
#' name, `suppressed`, the statistic columns returned by `parse_values`, and
#' finally a `<name>_value` column per group with the raw value.
#'
#' @param payload Response body with a `groups` list.
#' @param group_names Column names from [ox_group_by_spec()].
#' @param parse_values Function mapping one group entry to a named list of
#'   statistic values (called for released and suppressed groups alike, so it
#'   must tolerate missing fields).
#'
#' @export
ox_parse_grouped_payload <- function(payload, group_names, parse_values) {
  groups <- payload$groups %||% list()
  rows <- lapply(groups, function(group) {
    values <- unlist(group$values %||% list(), use.names = FALSE)
    labels <- unlist(group$labels %||% list(), use.names = FALSE)
    label_columns <- list()
    value_columns <- list()
    for (index in seq_along(group_names)) {
      name <- group_names[[index]]
      label_columns[[name]] <- as.character(labels[index] %||% values[index])
      value_columns[[paste0(name, "_value")]] <- as.character(values[index])
    }
    c(
      label_columns,
      list(suppressed = isTRUE(group$suppressed)),
      parse_values(group),
      value_columns
    )
  })
  if (length(rows) == 0) {
    return(data.frame())
  }
  ox_bind_rows_fill(rows)
}

#' Combine Grouped Results Across Targets
#'
#' Combines each group (matched on the raw group values) across targets with
#' `combine`, using only the targets that released the cell. Adds `sites`
#' (targets reporting the group) and `suppressed_sites` (targets that withheld
#' it); a combined value with `suppressed_sites > 0` is a partial total.
#'
#' @param rows Per-target data frames from [ox_parse_grouped_payload()].
#' @param group_names Column names from [ox_group_by_spec()].
#' @param combine The statistic's ungrouped combine function, called with a
#'   list holding one data frame of released rows.
#'
#' @export
ox_combine_grouped <- function(rows, group_names, combine) {
  by_target <- ox_bind_rows_fill(rows)
  if (nrow(by_target) == 0) {
    return(data.frame())
  }

  value_columns <- paste0(group_names, "_value")
  key_parts <- unname(as.list(by_target[value_columns]))
  keys <- do.call(paste, c(key_parts, sep = "\r"))
  out <- lapply(unique(keys), function(key) {
    cell <- by_target[keys == key, , drop = FALSE]
    released <- cell[!cell$suppressed, , drop = FALSE]
    combined <- combine(list(released))
    if (nrow(combined) == 0) {
      combined[1, ] <- NA
    }
    first <- cell[1, , drop = FALSE]
    rownames(first) <- NULL
    cbind(
      first[group_names],
      combined,
      sites = nrow(cell),
      suppressed_sites = sum(cell$suppressed),
      first[value_columns],
      stringsAsFactors = FALSE
    )
  })
  result <- do.call(rbind, out)
  rownames(result) <- NULL
  result
}

ox_is_path_like <- function(value) {
  inherits(value, "ox_data_shortcut") ||
    inherits(value, "ox_graph_path") ||
    (is.list(value) && !is.null(value$start))
}
