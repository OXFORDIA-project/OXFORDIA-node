#!/usr/bin/env Rscript

required <- c("devtools", "urlchecker")
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
  root_dir,
  "packages",
  c(
    "oxfordiar",
    "oxfordiar.data.nemaline",
    "oxfordiar.stat.mean",
    "oxfordiar.stat.kaplanmeier"
  )
)

for (package_dir in package_dirs) {
  message("\n==> ", basename(package_dir))
  devtools::build_readme(pkg = package_dir)
  urlchecker::url_check(path = package_dir)
  devtools::check(pkg = package_dir, manual = TRUE, error_on = "warning")
}
