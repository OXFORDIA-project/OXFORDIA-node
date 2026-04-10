script_path <- {
  file_arg <- grep(
    "^--file=",
    commandArgs(trailingOnly = FALSE),
    value = TRUE
  )
  if (length(file_arg) == 0) {
    stop("Unable to determine script path.", call. = FALSE)
  }
  sub("^--file=", "", file_arg[[1]])
}

scripts_dir <- normalizePath(
  dirname(script_path),
  mustWork = TRUE
)
package_root <- normalizePath(
  file.path(scripts_dir, ".."),
  mustWork = TRUE
)
workspace_root <- normalizePath(
  file.path(package_root, "..", ".."),
  mustWork = TRUE
)

if (!requireNamespace("remotes", quietly = TRUE)) {
  install.packages("remotes", repos = "https://cloud.r-project.org")
}

local_packages <- c(
  "solidauthr",
  "oxfordiar",
  "oxfordiar.data.nemaline",
  "oxfordiar.stat.mean",
  "oxfordiar.stat.kaplanmeier"
)

for (package_name in local_packages) {
  remotes::install_local(
    file.path(workspace_root, "packages", package_name),
    dependencies = TRUE,
    upgrade = "never",
    force = TRUE
  )
}
