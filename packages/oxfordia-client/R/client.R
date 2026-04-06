ox_client <- function(servers = list(), data_plugins = list(), stat_plugins = list(), auth = ox_auth_none()) {
  structure(
    list(
      servers = servers,
      data_plugins = data_plugins,
      stat_plugins = stat_plugins,
      auth = ox_normalize_auth(auth)
    ),
    class = c("ox_client", "list")
  )
}

ox_server <- function(name, base_url = NULL, auth = NULL, api_path = "/.api/stat", description = NULL) {
  ox_assert_scalar_string(name, "name")
  if (!is.null(base_url)) {
    ox_assert_scalar_string(base_url, "base_url")
    base_url <- ox_trim_trailing_slash(base_url)
  }
  ox_assert_scalar_string(api_path, "api_path")
  auth <- ox_normalize_auth(auth, allow_null = TRUE)

  structure(
    list(
      name = ox_normalize_name(name),
      base_url = base_url,
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

ox_auth_solid <- function(
  issuer = NULL,
  client_id = NULL,
  client_secret = NULL,
  safety_margin = 30L,
  session = NULL
) {
  safety_margin <- ox_normalize_safety_margin(safety_margin)
  cache <- new.env(parent = emptyenv())
  cache$session <- NULL

  if (!is.null(session)) {
    if (
      !is.null(issuer) ||
        !is.null(client_id) ||
        !is.null(client_secret)
    ) {
      stop(
        "Provide either `session` or the `issuer` / `client_id` / `client_secret` fields, not both.",
        call. = FALSE
      )
    }
    if (!inherits(session, "SolidSession")) {
      stop("`session` must be created by `solidauthr::solid_session()`.", call. = FALSE)
    }

    cache$session <- session
    return(
      structure(
        list(
          type = "solid",
          safety_margin = safety_margin,
          cache = cache
        ),
        class = c("ox_auth", "list")
      )
    )
  }

  ox_assert_scalar_string(issuer, "issuer")
  ox_assert_scalar_string(client_id, "client_id")
  ox_assert_scalar_string(client_secret, "client_secret")

  structure(
    list(
      type = "solid",
      issuer = ox_trim_trailing_slash(issuer),
      client_id = client_id,
      client_secret = client_secret,
      safety_margin = safety_margin,
      cache = cache
    ),
    class = c("ox_auth", "list")
  )
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

ox_normalize_auth <- function(auth, allow_null = FALSE) {
  if (is.null(auth)) {
    if (isTRUE(allow_null)) {
      return(NULL)
    }
    return(ox_auth_none())
  }

  if (inherits(auth, "SolidSession")) {
    return(ox_auth_solid(session = auth))
  }

  if (!is.list(auth) || !ox_is_scalar_string(auth$type %||% NULL)) {
    stop(
      "`auth` must be NULL, a `solidauthr::solid_session()` object, or created by an `ox_auth_*()` helper.",
      call. = FALSE
    )
  }

  if (identical(auth$type, "solid")) {
    auth$safety_margin <- ox_normalize_safety_margin(auth$safety_margin %||% 30L)
    if (is.null(auth$cache) || !is.environment(auth$cache)) {
      cache <- new.env(parent = emptyenv())
      cache$session <- NULL
      auth$cache <- cache
    } else if (!exists("session", envir = auth$cache, inherits = FALSE)) {
      auth$cache$session <- NULL
    }

    if (is.null(auth$cache$session)) {
      ox_assert_scalar_string(auth$issuer %||% NULL, "auth$issuer")
      ox_assert_scalar_string(auth$client_id %||% NULL, "auth$client_id")
      ox_assert_scalar_string(auth$client_secret %||% NULL, "auth$client_secret")
    }
  }

  auth
}

ox_normalize_safety_margin <- function(value) {
  if (!is.numeric(value) || length(value) != 1 || is.na(value) || value < 0) {
    stop("`safety_margin` must be a single non-negative number.", call. = FALSE)
  }

  as.integer(value)
}

ox_resolve_solid_session <- function(auth) {
  if (is.null(auth) || !identical(auth$type, "solid")) {
    return(NULL)
  }

  auth <- ox_normalize_auth(auth)
  session <- auth$cache$session %||% NULL
  if (!is.null(session)) {
    return(session)
  }

  auth$cache$session <- solidauthr::solid_session(
    issuer = auth$issuer,
    client_id = auth$client_id,
    client_secret = auth$client_secret,
    safety_margin = auth$safety_margin
  )
  auth$cache$session
}

ox_resolve_request_auth <- function(client, server) {
  server$auth %||% client$auth %||% ox_auth_none()
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

default_client <- function(auth = ox_auth_none()) {
  ox_client(auth = auth) |>
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
