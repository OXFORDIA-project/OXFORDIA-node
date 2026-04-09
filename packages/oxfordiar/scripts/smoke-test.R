library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.mean)
library(oxfordiar.stat.kaplanmeier)

script_path <- sub(
  "^--file=",
  "",
  grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)[[1]]
)
package_root <- normalizePath(
  file.path(dirname(script_path), ".."),
  mustWork = TRUE
)
env_file <- Sys.getenv("OX_ENV_FILE", unset = file.path(package_root, ".env"))

if (file.exists(env_file)) {
  readRenviron(env_file)
}

auth <- ox_auth_solid(
  issuer = Sys.getenv("OX_SOLID_ISSUER"),
  client_id = Sys.getenv("OX_SOLID_CLIENT_ID"),
  client_secret = Sys.getenv("OX_SOLID_CLIENT_SECRET")
)

targets <- ox_targets(
  ox_target(
    name = Sys.getenv("OX_TARGET_1_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_1_RESOURCE_URI")
  ),
  ox_target(
    name = Sys.getenv("OX_TARGET_2_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_2_RESOURCE_URI")
  ),
  ox_target(
    name = Sys.getenv("OX_TARGET_3_SERVER_NAME"),
    resource_uri = Sys.getenv("OX_TARGET_3_RESOURCE_URI")
  )
)

mean_result <- ox_mean(
  shortcut = ox_nemaline_shortcut(Sys.getenv("OX_MEAN_SHORTCUT")),
  targets = targets,
  auth = auth
)
print(mean_result$data)
cat("\n")

kaplan_meier_result <- ox_kaplan_meier(
  time = ox_nemaline_shortcut(Sys.getenv("OX_KAPLAN_MEIER_TIME_SHORTCUT")),
  event = ox_nemaline_shortcut(Sys.getenv("OX_KAPLAN_MEIER_EVENT_SHORTCUT")),
  group_by = ox_nemaline_shortcut(Sys.getenv("OX_KAPLAN_MEIER_GROUP_SHORTCUT")),
  targets = targets,
  auth = auth
)
print(kaplan_meier_result$data)
