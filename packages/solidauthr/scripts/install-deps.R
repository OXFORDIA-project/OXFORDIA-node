source("packages/solidauthr/scripts/helpers.R")

local_lib <- file.path(package_root(), ".rlib")
dir.create(local_lib, recursive = TRUE, showWarnings = FALSE)

if (!requireNamespace("remotes", quietly = TRUE)) {
  install.packages(
    "remotes",
    lib = local_lib,
    repos = "https://cloud.r-project.org"
  )
}

.libPaths(c(local_lib, .libPaths()))

remotes::install_deps(
  pkgdir = package_root(),
  dependencies = TRUE,
  upgrade = "never"
)
