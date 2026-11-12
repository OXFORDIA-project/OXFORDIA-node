#' Run a Standard Deviation Query
#'
#' @param shortcut Data shortcut or graph path.
#' @param targets One or more targets created by `ox_target()`.
#' @param auth Default authentication configuration.
#' @param fail_fast Whether to stop on the first target error.
#'
#' @export
ox_standard_deviation <- function(
  shortcut,
  targets,
  auth = oxfordiar::ox_auth_none(),
  fail_fast = TRUE
) {
  shortcut <- ox_standard_deviation_path(shortcut, "shortcut")

  oxfordiar::ox_query(
    route = "standard-deviation",
    statistic = "standard-deviation",
    targets = targets,
    auth = auth,
    fields = list(graphPath = shortcut),
    parse_result = ox_standard_deviation_parse_result,
    combine_results = ox_standard_deviation_combine_results,
    fail_fast = fail_fast
  )
}

ox_standard_deviation_parse_result <- function(payload, target = NULL) {
  data.frame(
    standard_deviation = as.numeric(
      payload$standardDeviation %||% NA_real_
    ),
    mean = as.numeric(payload$mean %||% NA_real_),
    count = as.integer(round(payload$count %||% NA_real_)),
    distinct_count = as.integer(round(payload$distinctCount %||% NA_real_)),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

# Pools per-target sample standard deviations into the standard deviation of
# the combined sample:
#   SS = sum((n_i - 1) * s_i^2 + n_i * (m_i - M)^2), sd = sqrt(SS / (N - 1))
ox_standard_deviation_combine_results <- function(rows) {
  by_target <- ox_standard_deviation_bind_rows(rows)
  empty <- data.frame(
    standard_deviation = numeric(),
    mean = numeric(),
    count = integer(),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
  if (nrow(by_target) == 0) {
    return(empty)
  }

  valid <- !is.na(by_target$standard_deviation) &
    !is.na(by_target$mean) &
    !is.na(by_target$count)
  n <- by_target$count[valid]
  m <- by_target$mean[valid]
  s <- by_target$standard_deviation[valid]
  total_count <- sum(n)

  overall_mean <- if (total_count > 0) sum(m * n) / total_count else NA_real_
  overall_sd <- if (total_count > 1) {
    sqrt(sum((n - 1) * s^2 + n * (m - overall_mean)^2) / (total_count - 1))
  } else {
    NA_real_
  }

  data.frame(
    standard_deviation = overall_sd,
    mean = overall_mean,
    count = as.integer(total_count),
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_standard_deviation_bind_rows <- function(rows) {
  rows <- Filter(Negate(is.null), rows)
  if (length(rows) == 0) {
    return(data.frame())
  }

  out <- do.call(rbind, rows)
  rownames(out) <- NULL
  out
}

ox_standard_deviation_path <- function(value, arg) {
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
