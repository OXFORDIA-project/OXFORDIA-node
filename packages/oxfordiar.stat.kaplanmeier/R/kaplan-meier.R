#' Run a Kaplan-Meier Query
#'
#' @param time Time shortcut or graph path.
#' @param event Event shortcut or graph path.
#' @param targets One or more targets created by `ox_target()`.
#' @param auth Default authentication configuration.
#' @param group_by Optional grouping shortcut or graph path.
#' @param fail_fast Whether to stop on the first target error.
#'
#' @export
ox_kaplan_meier <- function(
  time,
  event,
  targets,
  auth = oxfordiar::ox_auth_none(),
  group_by = NULL,
  fail_fast = TRUE
) {
  time <- ox_kaplan_meier_path(time, "time")
  event <- ox_kaplan_meier_path(event, "event")
  if (!is.null(group_by)) {
    group_by <- ox_kaplan_meier_path(group_by, "group_by")
  }

  oxfordiar::ox_query(
    route = "kaplan-meier",
    statistic = "kaplan-meier",
    targets = targets,
    auth = auth,
    fields = list(
      timePath = time,
      eventPath = event,
      groupByPath = group_by
    ),
    parse_result = ox_kaplan_meier_parse_result,
    fail_fast = fail_fast
  )
}

ox_kaplan_meier_parse_result <- function(payload, target = NULL) {
  groups <- payload$groups %||% NULL
  if (!is.null(groups) && length(groups) > 0) {
    rows <- list()

    for (group_entry in groups) {
      observations <- group_entry$observations %||% list()
      if (length(observations) == 0) {
        next
      }

      for (observation in observations) {
        rows[[length(rows) + 1]] <- ox_kaplan_meier_result_row(
          time = observation$time,
          event = observation$event,
          group = group_entry$group %||% NULL,
          group_label = group_entry$groupLabel %||% NULL
        )
      }
    }

    if (length(rows) == 0) {
      return(ox_kaplan_meier_empty_df(c(
        "time",
        "event",
        "group",
        "group_value"
      )))
    }

    return(ox_kaplan_meier_bind_rows(rows))
  }

  observations <- payload$observations
  if (is.null(observations) || length(observations) == 0) {
    return(ox_kaplan_meier_empty_df(c("time", "event", "group", "group_value")))
  }

  rows <- lapply(observations, function(row) {
    ox_kaplan_meier_result_row(
      time = row$time,
      event = row$event,
      group = row$group %||% NULL,
      group_label = row$groupLabel %||% NULL
    )
  })

  ox_kaplan_meier_bind_rows(rows)
}

ox_kaplan_meier_group_label <- function(value) {
  if (is.null(value) || !nzchar(trimws(as.character(value)))) {
    return(NA_character_)
  }

  value <- trimws(as.character(value))
  last <- sub("^.*[/#]", "", value)

  cluster_match <- regmatches(
    last,
    regexec("^Cluster_?([0-9]+)$|^C([0-9]+)$", last, perl = TRUE)
  )[[1]]
  if (length(cluster_match) > 0) {
    group_id <- cluster_match[[2]] %||% cluster_match[[3]]
    return(sprintf("Group %s", group_id))
  }

  variant_match <- regmatches(
    last,
    regexec(
      "GeneticGroup_?Variant([0-9]+)|Variant_?([0-9]+)",
      last,
      perl = TRUE
    )
  )[[1]]
  if (length(variant_match) > 0) {
    variant_id <- variant_match[[2]] %||% variant_match[[3]]
    return(sprintf("Variant %s", variant_id))
  }

  if (
    grepl(
      "^Status_?NonAmbulant$|^StatusNonAmbulant$",
      last,
      perl = TRUE,
      ignore.case = TRUE
    )
  ) {
    return("Non Ambulant")
  }

  if (
    grepl(
      "^Status_?Ambulant$|^StatusAmbulant$",
      last,
      perl = TRUE,
      ignore.case = TRUE
    )
  ) {
    return("Ambulant")
  }

  last <- gsub("[_-]+", " ", last)
  last <- gsub("([a-z])([A-Z])", "\\1 \\2", last, perl = TRUE)
  trimws(last)
}

ox_kaplan_meier_result_row <- function(
  time,
  event,
  group = NULL,
  group_label = NULL
) {
  raw_group <- if (is.null(group)) NA_character_ else as.character(group)
  display_group <- if (is.null(group_label)) {
    ox_kaplan_meier_group_label(raw_group)
  } else {
    ox_kaplan_meier_group_label(group_label)
  }

  data.frame(
    time = as.numeric(time %||% NA_real_),
    event = as.logical(event %||% NA),
    group = display_group,
    group_value = raw_group,
    stringsAsFactors = FALSE,
    check.names = FALSE
  )
}

ox_kaplan_meier_path <- function(value, arg) {
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

ox_kaplan_meier_bind_rows <- function(rows) {
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

ox_kaplan_meier_empty_df <- function(columns = character()) {
  out <- stats::setNames(vector("list", length(columns)), columns)
  as.data.frame(out, stringsAsFactors = FALSE, check.names = FALSE)
}

`%||%` <- function(x, y) {
  if (is.null(x)) y else x
}
