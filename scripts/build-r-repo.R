#!/usr/bin/env Rscript

# Builds the Oxfordia R packages into a CRAN-style repository so users can
# install them with install.packages(repos = ...), without a clone or CRAN.
#
# Usage: Rscript scripts/build-r-repo.R [--prune] <repo-dir>
#
# Writes <repo-dir>/src/contrib/<pkg>_<version>.tar.gz plus the PACKAGES index.
# Tarballs already in <repo-dir> are kept, so pointing this at an existing
# repository (e.g. the gh-pages checkout) adds a release; the index lists only
# the newest version of each package. Older versions are moved to
# src/contrib/Archive/<pkg>/, where remotes::install_version() looks for them,
# or deleted with --prune (used for the next channel, which publishes on every
# push).

args <- commandArgs(trailingOnly = TRUE)
prune <- "--prune" %in% args
args <- setdiff(args, "--prune")
if (length(args) != 1) {
  stop(
    "Usage: Rscript scripts/build-r-repo.R [--prune] <repo-dir>",
    call. = FALSE
  )
}

root_dir <- normalizePath(getwd(), mustWork = TRUE)
if (!file.exists(file.path(root_dir, "scripts", "build-r-repo.R"))) {
  stop("Run this script from the repository root.", call. = FALSE)
}

# Dependency order; also the full set of packages that are published.
# solidauthr is not here: it is published to CRAN on its own.
packages <- c(
  "oxfordiar",
  "oxfordiar.data.nemaline",
  "oxfordiar.data.legacynemaline",
  "oxfordiar.stat.mean",
  "oxfordiar.stat.kaplanmeier",
  "oxfordiar.stat.count",
  "oxfordiar.stat.standarddeviation"
)

withr_dir <- function(dir, fn) {
  old <- setwd(dir)
  on.exit(setwd(old), add = TRUE)
  fn()
}

# Moves every tarball except the newest version of each package into
# Archive/<pkg>/, matching CRAN's layout, or deletes them when prune is TRUE.
archive_old_versions <- function(contrib_dir, prune = FALSE) {
  tarballs <- list.files(contrib_dir, pattern = "\\.tar\\.gz$")
  names <- sub("_.*$", "", tarballs)
  versions <- sub("^[^_]+_(.*)\\.tar\\.gz$", "\\1", tarballs)
  for (name in unique(names)) {
    mine <- which(names == name)
    newest <- as.character(max(numeric_version(versions[mine])))
    for (i in mine[versions[mine] != newest]) {
      if (prune) {
        file.remove(file.path(contrib_dir, tarballs[[i]]))
        next
      }
      archive_dir <- file.path(contrib_dir, "Archive", name)
      dir.create(archive_dir, recursive = TRUE, showWarnings = FALSE)
      file.rename(
        file.path(contrib_dir, tarballs[[i]]),
        file.path(archive_dir, tarballs[[i]])
      )
    }
  }
}

contrib_dir <- file.path(args[[1]], "src", "contrib")
dir.create(contrib_dir, recursive = TRUE, showWarnings = FALSE)
contrib_dir <- normalizePath(contrib_dir, mustWork = TRUE)

build_dir <- tempfile("oxfordia-r-build-")
dir.create(build_dir)
on.exit(unlink(build_dir, recursive = TRUE), add = TRUE)

r_bin <- file.path(R.home("bin"), "R")
for (package in packages) {
  message("==> Building ", package)
  status <- withr_dir(build_dir, function() {
    system2(
      r_bin,
      c(
        "CMD", "build",
        "--no-build-vignettes", "--no-manual", "--no-resave-data",
        shQuote(file.path(root_dir, "packages", package))
      )
    )
  })
  if (!identical(status, 0L)) {
    stop("R CMD build failed for ", package, call. = FALSE)
  }
}

built <- list.files(build_dir, pattern = "\\.tar\\.gz$", full.names = TRUE)
if (length(built) != length(packages)) {
  stop(
    "Expected ", length(packages), " tarballs, got ", length(built),
    call. = FALSE
  )
}

for (tarball in built) {
  destination <- file.path(contrib_dir, basename(tarball))
  if (file.exists(destination)) {
    stop(
      basename(tarball),
      " is already published.",
      call. = FALSE
    )
  }
  file.copy(tarball, destination)
}

archive_old_versions(contrib_dir, prune = prune)
tools::write_PACKAGES(contrib_dir, type = "source", addFiles = TRUE)

message("\nRepository written to ", normalizePath(args[[1]]))
message("Published:")
message(paste0("  ", basename(built), collapse = "\n"))
