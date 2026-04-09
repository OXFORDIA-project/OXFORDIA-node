#' Run a Mean Query
#'
#' @param shortcut Data shortcut or graph path.
#' @param targets One or more targets created by `ox_target()`.
#' @param auth Default authentication configuration.
#' @param fail_fast Whether to stop on the first target error.
#'
#' @export
ox_mean <- function(
  shortcut,
  targets,
  auth = oxfordiar::ox_auth_none(),
  fail_fast = TRUE
) {
  shortcut <- ox_mean_path(shortcut, "shortcut")

  oxfordiar::ox_query(
    route = "mean",
    statistic = "mean",
    targets = targets,
    auth = auth,
    fields = list(graphPath = shortcut),
    parse_result = ox_mean_parse_result,
    fail_fast = fail_fast
  )
}

ox_mean_parse_result <- function(payload, target = NULL) {
  data.frame(
    mean = as.numeric(payload$mean %||% NA_real_),
    count = as.integer(round(payload$count %||% NA_real_)),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_mean_path <- function(value, arg) {
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
