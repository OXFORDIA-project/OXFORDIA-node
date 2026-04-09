source("scripts/helpers.R")
activate_local_library()

require_packages(c(
  "httr2",
  "jose",
  "jsonlite",
  "openssl",
  "R6",
  "uuid",
  "testthat"
))

temp_lib <- file.path(tempdir(), "solidauthr-lib")
dir.create(temp_lib, recursive = TRUE, showWarnings = FALSE)
.libPaths(c(temp_lib, .libPaths()))

package_dir <- package_root()
tryCatch(
  install.packages(package_dir, repos = NULL, type = "source", lib = temp_lib),
  error = function(err) {
    stop(
      sprintf("Package installation failed during test setup: %s", err$message),
      call. = FALSE
    )
  }
)

library(testthat)
library(solidauthr, lib.loc = temp_lib)
testthat::test_dir("tests/testthat", reporter = "summary")
