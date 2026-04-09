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
    combine_results = ox_mean_combine_results,
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

ox_mean_combine_results <- function(rows) {
  by_target <- ox_mean_bind_rows(rows)
  if (nrow(by_target) == 0) {
    return(
      data.frame(
        mean = numeric(),
        count = integer(),
        stringsAsFactors = FALSE,
        check.names = FALSE
      )
    )
  }

  valid <- !is.na(by_target$mean) & !is.na(by_target$count)
  total_count <- sum(by_target$count[valid], na.rm = TRUE)
  overall_mean <- if (total_count > 0) {
    sum(by_target$mean[valid] * by_target$count[valid], na.rm = TRUE) /
      total_count
  } else {
    NA_real_
  }

  data.frame(
    mean = overall_mean,
    count = as.integer(total_count),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_mean_bind_rows <- function(rows) {
  rows <- Filter(Negate(is.null), rows)
  if (length(rows) == 0) {
    return(data.frame())
  }

  out <- do.call(rbind, rows)
  rownames(out) <- NULL
  out
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
