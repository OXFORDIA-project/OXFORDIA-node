#!/usr/bin/env Rscript

if (!requireNamespace("lintr", quietly = TRUE)) {
  stop(
    "Install the `lintr` package before running `Rscript scripts/lint-r.R`.",
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
package_dirs <- if (length(args) == 0) discover_r_package_dirs() else args

package_dirs <- normalizePath(package_dirs, mustWork = TRUE)
all_lints <- list()

for (package_dir in package_dirs) {
  lints <- lintr::lint_package(package_dir)

  if (length(lints) > 0) {
    all_lints[[package_dir]] <- lints
  }
}

if (length(all_lints) == 0) {
  cat("R lint passed.\n")
  quit(status = 0)
}

for (package_dir in names(all_lints)) {
  print(all_lints[[package_dir]])
}

quit(status = 1)
