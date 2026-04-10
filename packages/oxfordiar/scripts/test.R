file_arg <- grep(
  "^--file=",
  commandArgs(trailingOnly = FALSE),
  value = TRUE
)
if (length(file_arg) == 0) {
  stop("Unable to determine the oxfordiar script path.", call. = FALSE)
}
package_root <- normalizePath(
  file.path(
    dirname(sub("^--file=", "", file_arg[[1]])),
    ".."
  ),
  mustWork = TRUE
)
workspace_root <- normalizePath(
  file.path(package_root, "..", ".."),
  mustWork = TRUE
)

required_packages <- c("testthat")
missing <- required_packages[
  !vapply(
    required_packages,
    requireNamespace,
    logical(1),
    quietly = TRUE
  )
]
if (length(missing) > 0) {
  stop(
    sprintf(
      "Install required packages before running tests: %s",
      paste(missing, collapse = ", ")
    ),
    call. = FALSE
  )
}

temp_lib <- file.path(tempdir(), "oxfordiar-lib")
dir.create(temp_lib, recursive = TRUE, showWarnings = FALSE)
.libPaths(c(temp_lib, .libPaths()))

install.packages(
  file.path(workspace_root, "packages", "solidauthr"),
  repos = NULL,
  type = "source",
  lib = temp_lib
)
install.packages(package_root, repos = NULL, type = "source", lib = temp_lib)

library(testthat)
library(oxfordiar, lib.loc = temp_lib)
testthat::test_dir(
  file.path(package_root, "tests", "testthat"),
  reporter = "summary"
)
