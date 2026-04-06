script_path <- {
  file_arg <- grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)
  if (length(file_arg) == 0) {
    stop("Unable to determine script path.", call. = FALSE)
  }
  sub("^--file=", "", file_arg[[1]])
}

scripts_dir <- normalizePath(dirname(script_path), mustWork = TRUE)
package_root <- normalizePath(file.path(scripts_dir, ".."), mustWork = TRUE)
workspace_root <- normalizePath(file.path(package_root, "..", ".."), mustWork = TRUE)

if (!requireNamespace("remotes", quietly = TRUE)) {
  install.packages("remotes", repos = "https://cloud.r-project.org")
}

remotes::install_local(
  file.path(workspace_root, "packages", "solidauthr"),
  dependencies = TRUE,
  upgrade = "never",
  force = TRUE
)

remotes::install_deps(
  pkgdir = package_root,
  dependencies = TRUE,
  upgrade = "never"
)
