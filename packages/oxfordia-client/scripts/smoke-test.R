required_packages <- c("httr", "jsonlite")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop(
    sprintf(
      "Install required packages before running the smoke test: %s",
      paste(missing_packages, collapse = ", ")
    ),
    call. = FALSE
  )
}

script_path <- {
  file_arg <- grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)
  if (length(file_arg) == 0) {
    stop("Unable to determine script path.", call. = FALSE)
  }
  sub("^--file=", "", file_arg[[1]])
}

package_root <- normalizePath(file.path(dirname(script_path), ".."), mustWork = TRUE)
r_dir <- file.path(package_root, "R")

source_files <- c(
  "utils.R",
  "graph-path.R",
  "plugins.R",
  "client.R",
  "builtins.R",
  "query.R"
)

for (source_file in source_files) {
  sys.source(file.path(r_dir, source_file), envir = globalenv())
}

env_or_stop <- function(name) {
  value <- Sys.getenv(name, unset = "")
  if (!nzchar(value)) {
    stop(sprintf("Environment variable `%s` is required.", name), call. = FALSE)
  }
  value
}

server_name <- Sys.getenv("OX_SERVER_NAME", unset = "site_a")
server_url <- env_or_stop("OX_SERVER_URL")
resource_uri <- env_or_stop("OX_RESOURCE_URI")
data_schema <- Sys.getenv("OX_DATA_SCHEMA", unset = "nemaline")
stat_name <- Sys.getenv("OX_STAT", unset = "mean")
bearer_token <- Sys.getenv("OX_BEARER_TOKEN", unset = "")

auth <- if (nzchar(bearer_token)) ox_auth_bearer(bearer_token) else ox_auth_none()

client <- default_client() |>
  ox_register_server(
    ox_server(
      name = server_name,
      base_url = server_url,
      auth = auth
    )
  )

target <- ox_target(
  server = server_name,
  resource_uri = resource_uri,
  data_schema = data_schema
)

spec <- if (ox_normalize_name(stat_name) == "kaplan-meier") {
  ox_kaplan_meier(
    time_path = ox_shortcut(Sys.getenv("OX_TIME_SHORTCUT", unset = "KaplanMeierTime")),
    event_path = ox_shortcut(Sys.getenv("OX_EVENT_SHORTCUT", unset = "KaplanMeierEvent")),
    group_by_path = {
      group_shortcut <- Sys.getenv("OX_GROUP_SHORTCUT", unset = "")
      if (nzchar(group_shortcut)) ox_shortcut(group_shortcut) else NULL
    },
    data_schema = data_schema
  )
} else {
  ox_mean(
    graph_path = ox_shortcut(Sys.getenv("OX_SHORTCUT", unset = "BaselineAge")),
    data_schema = data_schema
  )
}

cat("Running Oxfordia smoke test\n")
cat(sprintf("  Server:      %s\n", server_url))
cat(sprintf("  Resource:    %s\n", resource_uri))
cat(sprintf("  Data schema: %s\n", data_schema))
cat(sprintf("  Statistic:   %s\n\n", stat_name))

result <- ox_query(client, spec, targets = target, fail_fast = FALSE)

if (nrow(result$errors) > 0) {
  cat("Errors\n")
  print(result$errors)
  quit(status = 1)
}

cat("Result\n")
print(result$data)
