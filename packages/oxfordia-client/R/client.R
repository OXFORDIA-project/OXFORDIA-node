ox_client <- function(servers = list(), data_plugins = list(), stat_plugins = list()) {
  structure(
    list(
      servers = servers,
      data_plugins = data_plugins,
      stat_plugins = stat_plugins
    ),
    class = c("ox_client", "list")
  )
}

ox_server <- function(name, base_url, auth = ox_auth_none(), api_path = "/.api/stat", description = NULL) {
  ox_assert_scalar_string(name, "name")
  ox_assert_scalar_string(base_url, "base_url")
  ox_assert_scalar_string(api_path, "api_path")

  structure(
    list(
      name = ox_normalize_name(name),
      base_url = ox_trim_trailing_slash(base_url),
      api_path = api_path,
      auth = auth,
      description = description
    ),
    class = c("ox_server", "list")
  )
}

ox_auth_none <- function() {
  structure(list(type = "none"), class = c("ox_auth", "list"))
}

ox_auth_bearer <- function(token) {
  ox_assert_scalar_string(token, "token")
  structure(list(type = "bearer", token = token), class = c("ox_auth", "list"))
}

ox_auth_headers <- function(headers) {
  if (!is.list(headers) || is.null(names(headers)) || any(!nzchar(names(headers)))) {
    stop("`headers` must be a named list.", call. = FALSE)
  }
  structure(list(type = "headers", headers = headers), class = c("ox_auth", "list"))
}

ox_register_server <- function(client, server) {
  client$servers <- ox_registry_put(client$servers, server$name, server)
  client
}

ox_register_data_plugin <- function(client, data_plugin) {
  client$data_plugins <- ox_registry_put(client$data_plugins, data_plugin$name, data_plugin)
  client
}

ox_register_stat_plugin <- function(client, stat_plugin) {
  client$stat_plugins <- ox_registry_put(client$stat_plugins, stat_plugin$name, stat_plugin)
  client
}

ox_target <- function(server, resource_uri, data_schema = NULL, label = NULL) {
  ox_assert_scalar_string(server, "server")
  ox_assert_scalar_string(resource_uri, "resource_uri")
  if (!is.null(data_schema)) {
    ox_assert_scalar_string(data_schema, "data_schema")
  }
  if (!is.null(label)) {
    ox_assert_scalar_string(label, "label")
  }

  structure(
    list(
      server = ox_normalize_name(server),
      resource_uri = resource_uri,
      data_schema = if (is.null(data_schema)) NULL else ox_normalize_name(data_schema),
      label = label
    ),
    class = c("ox_target", "list")
  )
}

ox_targets <- function(...) {
  values <- list(...)
  if (length(values) == 1 && is.list(values[[1]]) && !inherits(values[[1]], "ox_target")) {
    values <- values[[1]]
  }
  values
}

ox_register_builtin_plugins <- function(client, data = c("nemaline"), statistics = c("mean", "kaplan-meier")) {
  for (data_name in data) {
    client <- ox_register_data_plugin(client, ox_builtin_data_plugin(data_name))
  }
  for (stat_name in statistics) {
    client <- ox_register_stat_plugin(client, ox_builtin_stat_plugin(stat_name))
  }
  client
}

default_client <- function() {
  ox_client() |>
    ox_register_builtin_plugins()
}

ox_default_client <- default_client

print.ox_client <- function(x, ...) {
  cat(
    sprintf(
      "<ox_client> %d server(s), %d data plugin(s), %d statistic plugin(s)\n",
      length(x$servers),
      length(x$data_plugins),
      length(x$stat_plugins)
    )
  )
  invisible(x)
}

ox_resolve_server <- function(client, name) {
  ox_registry_get(client$servers, name, "server")
}

ox_resolve_data_plugin <- function(client, name) {
  ox_registry_get(client$data_plugins, name, "data plugin")
}

ox_resolve_stat_plugin <- function(client, name) {
  ox_registry_get(client$stat_plugins, name, "statistic plugin")
}

