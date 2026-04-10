#!/usr/bin/env Rscript

required <- c("usethis", "withr")
missing <- required[!vapply(required, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing) > 0) {
  stop(
    sprintf(
      "Install required packages before running this script: %s",
      paste(missing, collapse = ", ")
    ),
    call. = FALSE
  )
}

root_dir <- normalizePath(getwd(), mustWork = TRUE)

package_dirs <- file.path(
  normalizePath(root_dir, mustWork = TRUE),
  "packages",
  c(
    "oxfordiar",
    "oxfordiar.data.nemaline",
    "oxfordiar.stat.mean",
    "oxfordiar.stat.kaplanmeier"
  )
)

version <- commandArgs(trailingOnly = TRUE)
version <- if (length(version) > 0) version[[1]] else NULL

for (package_dir in package_dirs) {
  withr::with_dir(package_dir, {
    usethis::proj_set(package_dir)
    usethis::use_release_issue(version = version)
  })
}
