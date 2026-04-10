script_path <- function() {
  file_arg <- grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)
  if (length(file_arg) > 0) {
    return(sub("^--file=", "", file_arg[[1]]))
  }

  frames <- sys.frames()
  ofiles <- Filter(
    Negate(is.null),
    lapply(frames, function(frame) frame$ofile %||% NULL)
  )
  if (length(ofiles) > 0) {
    return(normalizePath(ofiles[[length(ofiles)]], mustWork = FALSE))
  }

  stop("Unable to determine the current script path.", call. = FALSE)
}

package_root <- function() {
  script_candidate <- tryCatch(
    normalizePath(file.path(dirname(script_path()), ".."), mustWork = FALSE),
    error = function(...) NULL
  )

  candidate_roots <- c(
    script_candidate,
    normalizePath(getwd(), mustWork = FALSE),
    normalizePath(
      file.path(getwd(), "packages", "solidauthr"),
      mustWork = FALSE
    )
  )

  for (candidate in unique(candidate_roots)) {
    if (dir.exists(file.path(candidate, "R"))) {
      return(normalizePath(candidate, mustWork = TRUE))
    }
  }

  stop("Unable to determine the solidauthr package root.", call. = FALSE)
}

source_package_files <- function() {
  r_dir <- file.path(package_root(), "R")
  source_files <- c(
    "utils.R",
    "dpop.R",
    "http.R",
    "session.R"
  )

  for (source_file in source_files) {
    sys.source(file.path(r_dir, source_file), envir = globalenv())
  }
}

require_packages <- function(packages) {
  missing <- packages[
    !vapply(packages, requireNamespace, logical(1), quietly = TRUE)
  ]
  if (length(missing) > 0) {
    stop(
      sprintf(
        "Install required packages before running this script: %s",
        paste(missing, collapse = ", ")
      ),
      call. = FALSE
    )
  }
}

activate_local_library <- function() {
  local_lib <- file.path(package_root(), ".rlib")
  if (dir.exists(local_lib)) {
    .libPaths(c(local_lib, .libPaths()))
  }

  invisible(local_lib)
}
