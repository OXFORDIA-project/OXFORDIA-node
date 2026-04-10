#!/usr/bin/env Rscript

if (nzchar(Sys.which("air")) == FALSE) {
  stop(
    paste(
      "Install Posit's `air` formatter before running",
      "`Rscript scripts/format-r.R`."
    ),
    call. = FALSE
  )
}

discover_r_package_dirs <- function(root = "packages") {
  descriptions <- list.files(
    root,
    pattern = "^DESCRIPTION$",
    recursive = TRUE,
    full.names = TRUE
  )

  unique(dirname(descriptions))
}

args <- commandArgs(trailingOnly = TRUE)
check_only <- "--check" %in% args
package_dirs <- setdiff(args, "--check")
package_dirs <- if (length(package_dirs) == 0) discover_r_package_dirs() else package_dirs
package_dirs <- normalizePath(package_dirs, mustWork = TRUE)

air_args <- c("format")

if (check_only) {
  air_args <- c(air_args, "--check")
}

air_args <- c(air_args, package_dirs)

status <- system2("air", air_args)

quit(status = status)
