#' Run a Count Query
#'
#' @param shortcut Data shortcut or graph path.
#' @param targets One or more targets created by `ox_target()`.
#' @param auth Default authentication configuration.
#' @param fail_fast Whether to stop on the first target error.
#'
#' @export
ox_count <- function(
  shortcut,
  targets,
  auth = oxfordiar::ox_auth_none(),
  fail_fast = TRUE
) {
  shortcut <- ox_count_path(shortcut, "shortcut")

  oxfordiar::ox_query(
    route = "count",
    statistic = "count",
    targets = targets,
    auth = auth,
    fields = list(graphPath = shortcut),
    parse_result = ox_count_parse_result,
    combine_results = ox_count_combine_results,
    fail_fast = fail_fast
  )
}

ox_count_parse_result <- function(payload, target = NULL) {
  data.frame(
    count = as.integer(round(payload$count %||% NA_real_)),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_count_combine_results <- function(rows) {
  by_target <- ox_count_bind_rows(rows)
  if (nrow(by_target) == 0) {
    return(
      data.frame(
        count = integer(),
        stringsAsFactors = FALSE,
        check.names = FALSE
      )
    )
  }

  data.frame(
    count = as.integer(sum(by_target$count, na.rm = TRUE)),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_count_bind_rows <- function(rows) {
  rows <- Filter(Negate(is.null), rows)
  if (length(rows) == 0) {
    return(data.frame())
  }

  out <- do.call(rbind, rows)
  rownames(out) <- NULL
  out
}

ox_count_path <- function(value, arg) {
  if (inherits(value, "ox_data_shortcut")) {
    return(value)
  }
  if (
    inherits(value, "ox_graph_path") ||
      (is.list(value) && !is.null(value$start))
  ) {
    return(value)
  }

  stop(
    sprintf(
      "`%s` must be created by `ox_data_shortcut()` or `ox_graph_path()`.",
      arg
    ),
    call. = FALSE
  )
}

`%||%` <- function(x, y) {
  if (is.null(x)) y else x
}
