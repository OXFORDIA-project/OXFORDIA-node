script_path <- {
  file_arg <- grep("^--file=", commandArgs(trailingOnly = FALSE), value = TRUE)
  if (length(file_arg) == 0) {
    stop("Unable to determine script path.", call. = FALSE)
  }
  sub("^--file=", "", file_arg[[1]])
}

required_packages <- c("httr2", "jsonlite", "solidauthr")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop(
    sprintf(
      "Install required packages before running the smoke test with `Rscript packages/oxfordia-client/scripts/install-deps.R`: %s",
      paste(missing_packages, collapse = ", ")
    ),
    call. = FALSE
  )
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

strip_matching_quotes <- function(value) {
  if (nchar(value) < 2) {
    return(value)
  }

  first <- substr(value, 1, 1)
  last <- substr(value, nchar(value), nchar(value))
  if ((first == "\"" && last == "\"") || (first == "'" && last == "'")) {
    return(substr(value, 2, nchar(value) - 1))
  }

  value
}

resolve_env_file <- function() {
  explicit <- Sys.getenv("OX_ENV_FILE", unset = "")
  if (nzchar(explicit)) {
    if (!file.exists(explicit)) {
      stop(sprintf("The requested env file does not exist: %s", explicit), call. = FALSE)
    }
    return(normalizePath(explicit, mustWork = TRUE))
  }

  candidates <- unique(c(
    file.path(package_root, ".env"),
    file.path(getwd(), ".env")
  ))

  existing <- candidates[file.exists(candidates)]
  if (length(existing) == 0) {
    return(NULL)
  }

  normalizePath(existing[[1]], mustWork = TRUE)
}

load_env_file <- function(path, override = FALSE) {
  if (is.null(path)) {
    return(invisible(FALSE))
  }

  lines <- readLines(path, warn = FALSE, encoding = "UTF-8")
  for (line_index in seq_along(lines)) {
    raw_line <- lines[[line_index]]
    line <- trimws(raw_line)
    if (!nzchar(line) || startsWith(line, "#")) {
      next
    }

    line <- sub("^export\\s+", "", line)
    parts <- regmatches(
      line,
      regexec("^([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(.*)$", line, perl = TRUE)
    )[[1]]

    if (length(parts) == 0) {
      stop(
        sprintf("Unable to parse %s line %d: %s", path, line_index, raw_line),
        call. = FALSE
      )
    }

    key <- parts[[2]]
    value <- strip_matching_quotes(parts[[3]])
    existing <- Sys.getenv(key, unset = NA_character_)
    if (!isTRUE(override) && !is.na(existing) && nzchar(existing)) {
      next
    }

    do.call(Sys.setenv, stats::setNames(list(value), key))
  }

  invisible(TRUE)
}

indexed_env_name <- function(prefix, index, suffix) {
  sprintf("OX_%s_%d_%s", prefix, index, suffix)
}

indexed_env <- function(prefix, index, suffix, default = "") {
  value <- Sys.getenv(indexed_env_name(prefix, index, suffix), unset = "")
  if (nzchar(value)) {
    return(value)
  }
  default
}

indexed_env_or_stop <- function(prefix, index, suffix) {
  value <- indexed_env(prefix, index, suffix, default = "")
  if (!nzchar(value)) {
    stop(
      sprintf("Environment variable `%s` is required.", indexed_env_name(prefix, index, suffix)),
      call. = FALSE
    )
  }
  value
}

indexed_env_indexes <- function(prefix) {
  env_names <- names(Sys.getenv())
  matches <- regmatches(
    env_names,
    regexec(sprintf("^OX_%s_([0-9]+)_", prefix), env_names, perl = TRUE)
  )
  indexes <- unique(vapply(matches[lengths(matches) > 0], function(match) match[[2]], character(1)))
  sort(as.integer(indexes))
}

build_auth_config <- function(issuer, client_id, client_secret, bearer_token) {
  if (nzchar(issuer) && nzchar(client_id) && nzchar(client_secret)) {
    return(
      ox_auth_solid(
        issuer = issuer,
        client_id = client_id,
        client_secret = client_secret
      )
    )
  }

  if (nzchar(bearer_token)) {
    return(ox_auth_bearer(bearer_token))
  }

  ox_auth_none()
}

build_client_auth <- function() {
  build_auth_config(
    issuer = Sys.getenv("OX_SOLID_ISSUER", unset = ""),
    client_id = Sys.getenv("OX_SOLID_CLIENT_ID", unset = ""),
    client_secret = Sys.getenv("OX_SOLID_CLIENT_SECRET", unset = ""),
    bearer_token = Sys.getenv("OX_BEARER_TOKEN", unset = "")
  )
}

build_target_config <- function(index) {
  list(
    server_name = indexed_env_or_stop("TARGET", index, "SERVER_NAME"),
    resource_uri = indexed_env_or_stop("TARGET", index, "RESOURCE_URI")
  )
}

read_target_configs <- function() {
  indexes <- indexed_env_indexes("TARGET")
  if (length(indexes) == 0) {
    stop(
      "Define at least one indexed target with `OX_TARGET_1_SERVER_NAME` and `OX_TARGET_1_RESOURCE_URI`.",
      call. = FALSE
    )
  }

  lapply(indexes, build_target_config)
}

build_server_override <- function(index) {
  list(
    name = indexed_env_or_stop("SERVER", index, "NAME"),
    base_url = indexed_env_or_stop("SERVER", index, "URL")
  )
}

read_server_overrides <- function(target_configs) {
  overrides <- list()

  indexes <- indexed_env_indexes("SERVER")
  for (index in indexes) {
    override <- build_server_override(index)
    key <- ox_normalize_name(override$name)

    if (!is.null(overrides[[key]]) && !identical(overrides[[key]]$base_url, override$base_url)) {
      stop(
        sprintf("Conflicting server URL overrides were provided for server '%s'.", override$name),
        call. = FALSE
      )
    }

    overrides[[key]] <- override
  }

  unused_overrides <- setdiff(
    names(overrides),
    unique(vapply(target_configs, function(config) ox_normalize_name(config$server_name), character(1)))
  )
  if (length(unused_overrides) > 0) {
    stop(
      sprintf(
        "Server overrides were provided for unknown server name(s): %s",
        paste(unused_overrides, collapse = ", ")
      ),
      call. = FALSE
    )
  }

  overrides
}

resolve_server_url <- function(target_config, server_overrides = list()) {
  override <- server_overrides[[ox_normalize_name(target_config$server_name)]] %||% NULL
  if (!is.null(override)) {
    return(override$base_url)
  }

  ox_url_origin(target_config$resource_uri, "target_config$resource_uri")
}

server_signature <- function(server_name, base_url, api_path) {
  list(
    name = ox_normalize_name(server_name),
    base_url = base_url,
    api_path = api_path
  )
}

build_client_and_targets <- function(target_configs, client_auth, api_path, server_overrides = list()) {
  client <- default_client(auth = client_auth)
  registered_servers <- list()
  targets <- vector("list", length(target_configs))

  for (index in seq_along(target_configs)) {
    config <- target_configs[[index]]
    normalized_name <- ox_normalize_name(config$server_name)
    base_url <- server_overrides[[normalized_name]]$base_url %||% NULL
    signature <- server_signature(config$server_name, base_url, api_path)

    if (is.null(registered_servers[[normalized_name]])) {
      client <- ox_register_server(
        client,
        ox_server(
          name = config$server_name,
          base_url = base_url,
          api_path = api_path
        )
      )
      registered_servers[[normalized_name]] <- signature
    } else if (!identical(registered_servers[[normalized_name]], signature)) {
      stop(
        sprintf(
          "Conflicting configuration detected for server '%s'. Reused server names must keep the same URL and API path.",
          config$server_name
        ),
        call. = FALSE
      )
    }

    targets[[index]] <- ox_target(
      server = config$server_name,
      resource_uri = config$resource_uri
    )
  }

  list(client = client, targets = targets)
}

env_file <- resolve_env_file()
load_env_file(env_file)

client_auth <- build_client_auth()
api_path <- Sys.getenv("OX_API_PATH", unset = "/.api/stat")
stat_name <- Sys.getenv("OX_STAT", unset = "mean")
data_schema <- Sys.getenv("OX_DATA_SCHEMA", unset = "nemaline")
target_configs <- read_target_configs()
server_overrides <- read_server_overrides(target_configs)
query_setup <- build_client_and_targets(
  target_configs = target_configs,
  client_auth = client_auth,
  api_path = api_path,
  server_overrides = server_overrides
)
client <- query_setup$client
targets <- query_setup$targets

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
if (!is.null(env_file)) {
  cat(sprintf("  Env file:    %s\n", env_file))
}
cat(sprintf("  Targets:     %d\n", length(targets)))
cat(sprintf("  Servers:     %d\n", length(unique(vapply(target_configs, function(config) ox_normalize_name(config$server_name), character(1))))))
cat(sprintf("  Statistic:   %s\n", stat_name))
cat("  Query plan:\n")
for (config in target_configs) {
  cat(
    sprintf(
      "    %s :: %s [%s] -> %s%s\n",
      config$server_name,
      config$resource_uri,
      data_schema,
      resolve_server_url(config, server_overrides),
      api_path
    )
  )
}
cat("\n")

result <- ox_query(client, spec, targets = targets, fail_fast = FALSE)

if (nrow(result$errors) > 0) {
  cat("Errors\n")
  print(result$errors)
  quit(status = 1)
}

cat("Result\n")
print(result$data)
