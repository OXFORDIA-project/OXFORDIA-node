# Load local packages
# For actual usage, load packages as follows:
# library(oxfordiar)
# library(oxfordiar.data.nemaline)
# library(oxfordiar.stat.mean)
# library(oxfordiar.stat.kaplanmeier)
script_path <- sub(
  "^--file=",
  "",
  grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)[[1]]
)
package_root <- normalizePath(
  file.path(dirname(script_path), ".."),
  mustWork = TRUE
)
workspace_root <- normalizePath(
  file.path(package_root, "..", ".."),
  mustWork = TRUE
)
env_file <- Sys.getenv("OX_ENV_FILE", unset = file.path(package_root, ".env"))

if (file.exists(env_file)) {
  readRenviron(env_file)
}

pkgload::load_all(
  file.path(workspace_root, "packages", "solidauthr"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar.data.nemaline"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar.stat.mean"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)
pkgload::load_all(
  file.path(workspace_root, "packages", "oxfordiar.stat.kaplanmeier"),
  export_all = FALSE,
  helpers = FALSE,
  quiet = TRUE
)

auth <- oxfordiar::ox_auth_solid(
  issuer = Sys.getenv("OX_SOLID_ISSUER"),
  client_id = Sys.getenv("OX_SOLID_CLIENT_ID"),
  client_secret = Sys.getenv("OX_SOLID_CLIENT_SECRET")
)
# End Load Packages

targets <- oxfordiar::ox_targets(
  oxfordiar::ox_target(
    name = Sys.getenv("OX_TARGET_1_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_1_RESOURCE_URI")
  ),
  oxfordiar::ox_target(
    name = Sys.getenv("OX_TARGET_2_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_2_RESOURCE_URI")
  ),
  oxfordiar::ox_target(
    name = Sys.getenv("OX_TARGET_3_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_3_RESOURCE_URI")
  )
)

mean_result <- oxfordiar.stat.mean::ox_mean(
  shortcut = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
    "OX_MEAN_SHORTCUT"
  )),
  targets = targets,
  auth = auth
)
cat("Overall mean\n")
print(mean_result$data)
cat("\n")
cat("Per-target means\n")
print(mean_result$by_target)
cat("\n")

kaplan_meier_result <- oxfordiar.stat.kaplanmeier::ox_kaplan_meier(
  time = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
    "OX_KAPLAN_MEIER_TIME_SHORTCUT"
  )),
  event = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
    "OX_KAPLAN_MEIER_EVENT_SHORTCUT"
  )),
  group_by = oxfordiar.data.nemaline::ox_nemaline_shortcut(Sys.getenv(
    "OX_KAPLAN_MEIER_GROUP_SHORTCUT"
  )),
  targets = targets,
  auth = auth
)
cat("Kaplan-Meier rows\n")
print(kaplan_meier_result$data)
cat("\n")
cat("Kaplan-Meier rows by target\n")
print(kaplan_meier_result$by_target)
cat("\n")
cat("Kaplan-Meier rows grouped by group\n")
print(kaplan_meier_result$grouped)
