ox_query_spec <- function(statistic, ..., data_schema = NULL) {
  ox_assert_scalar_string(statistic, "statistic")
  if (!is.null(data_schema)) {
    ox_assert_scalar_string(data_schema, "data_schema")
  }

  structure(
    list(
      statistic = ox_normalize_name(statistic),
      data_schema = if (is.null(data_schema)) NULL else ox_normalize_name(data_schema),
      fields = list(...)
    ),
    class = c("ox_query_spec", "list")
  )
}

ox_mean <- function(graph_path, data_schema = NULL) {
  ox_query_spec(
    statistic = "mean",
    data_schema = data_schema,
    graph_path = graph_path
  )
}

ox_kaplan_meier <- function(time_path, event_path, group_by_path = NULL, data_schema = NULL) {
  ox_query_spec(
    statistic = "kaplan-meier",
    data_schema = data_schema,
    time_path = time_path,
    event_path = event_path,
    group_by_path = group_by_path
  )
}

ox_query <- function(client = default_client(), spec, targets, fail_fast = TRUE) {
  stat_plugin <- ox_resolve_stat_plugin(client, spec$statistic)
  targets <- ox_targets(targets)

  responses <- vector("list", length(targets))
  parsed_rows <- vector("list", length(targets))
  errors <- list()

  for (index in seq_along(targets)) {
    target <- targets[[index]]
    result <- tryCatch(
      ox_query_one(client, spec, target, stat_plugin),
      error = function(error) error
    )

    if (inherits(result, "error")) {
      if (isTRUE(fail_fast)) {
        stop(result)
      }

      errors[[length(errors) + 1]] <- data.frame(
        server = target$server,
        resource_uri = target$resource_uri,
        data_schema = ox_resolve_data_schema(target, spec),
        statistic = spec$statistic,
        error = conditionMessage(result),
        stringsAsFactors = FALSE,
        check.names = FALSE
      )
      next
    }

    responses[[index]] <- result
    parsed_rows[[index]] <- result$data
  }

  data <- stat_plugin$combine_results(parsed_rows)
  if (length(errors) == 0) {
    error_df <- ox_empty_df(c("server", "resource_uri", "data_schema", "statistic", "error"))
  } else {
    error_df <- ox_bind_rows_fill(errors)
  }

  structure(
    list(
      data = data,
      errors = error_df,
      responses = Filter(Negate(is.null), responses),
      spec = spec,
      targets = targets
    ),
    class = c("ox_result_set", "list")
  )
}

ox_query_one <- function(client, spec, target, stat_plugin) {
  server <- ox_resolve_server(client, target$server)
  data_schema <- ox_resolve_data_schema(target, spec)
  data_plugin <- if (is.null(data_schema)) NULL else ox_resolve_data_plugin(client, data_schema)

  body <- ox_build_request_body(spec, target, stat_plugin, data_plugin)
  response <- ox_perform_request(server, stat_plugin$route, body)
  parsed <- stat_plugin$parse_result(response$body, target, spec)
  parsed <- ox_as_result_data_frame(parsed)
  parsed <- ox_add_provenance(parsed, target, spec, data_schema)

  list(
    request = body,
    response = response,
    data = parsed
  )
}

ox_resolve_data_schema <- function(target, spec) {
  if (!is.null(target$data_schema)) {
    return(target$data_schema)
  }
  spec$data_schema
}

ox_build_request_body <- function(spec, target, stat_plugin, data_plugin = NULL) {
  body <- list(resourceUri = target$resource_uri)

  for (field_name in names(stat_plugin$fields)) {
    field <- stat_plugin$fields[[field_name]]
    value <- spec$fields[[field_name]]

    if (is.null(value)) {
      if (isTRUE(field$required)) {
        stop(
          sprintf("Query spec for '%s' is missing required field '%s'.", spec$statistic, field_name),
          call. = FALSE
        )
      }
      next
    }

    body[[field$json_key]] <- ox_encode_field_value(value, field, data_plugin)
  }

  body
}

ox_encode_field_value <- function(value, field, data_plugin = NULL) {
  if (field$kind == "graph_path") {
    return(ox_resolve_graph_path(value, field, data_plugin))
  }
  if (field$kind == "string") {
    ox_assert_scalar_string(value, field$name)
    return(value)
  }
  if (field$kind == "number") {
    if (!is.numeric(value) || length(value) != 1 || is.na(value)) {
      stop(sprintf("Field '%s' must be a single number.", field$name), call. = FALSE)
    }
    return(as.numeric(value))
  }
  if (field$kind == "boolean") {
    if (!is.logical(value) || length(value) != 1 || is.na(value)) {
      stop(sprintf("Field '%s' must be TRUE or FALSE.", field$name), call. = FALSE)
    }
    return(isTRUE(value))
  }
  value
}

ox_resolve_graph_path <- function(value, field, data_plugin = NULL) {
  if (inherits(value, "ox_shortcut") || (is.character(value) && length(value) == 1)) {
    if (is.null(data_plugin)) {
      stop(
        sprintf(
          "Field '%s' uses a shortcut but no data schema was provided on the query spec or target.",
          field$name
        ),
        call. = FALSE
      )
    }
    shortcut_name <- if (inherits(value, "ox_shortcut")) value$name else value[[1]]
    return(ox_resolve_shortcut_from_plugin(data_plugin, shortcut_name))
  }

  if (is.list(value) && !is.null(value$start)) {
    return(value)
  }

  stop(
    sprintf(
      "Field '%s' must be a graph path or shortcut reference.",
      field$name
    ),
    call. = FALSE
  )
}

ox_perform_request <- function(server, route, body) {
  url <- paste0(
    server$base_url,
    server$api_path,
    "/",
    route
  )

  headers <- ox_auth_header_values(server$auth)
  response <- httr::POST(
    url = url,
    body = body,
    encode = "json",
    httr::accept_json(),
    httr::content_type_json(),
    httr::add_headers(.headers = headers)
  )
  status <- httr::status_code(response)
  response_text <- httr::content(response, as = "text", encoding = "UTF-8")
  response_body <- ox_parse_response_body(response_text)

  if (status >= 400) {
    rendered <- if (is.character(response_body)) response_body else jsonlite::toJSON(response_body, auto_unbox = TRUE, pretty = TRUE)
    stop(
      sprintf("Request to '%s' failed with HTTP %s: %s", url, status, rendered),
      call. = FALSE
    )
  }

  list(
    url = url,
    status = status,
    body = response_body,
    text = response_text
  )
}

ox_auth_header_values <- function(auth) {
  if (is.null(auth) || identical(auth$type, "none")) {
    return(list())
  }
  if (identical(auth$type, "bearer")) {
    return(list(Authorization = paste("Bearer", auth$token)))
  }
  if (identical(auth$type, "headers")) {
    return(auth$headers)
  }

  stop(sprintf("Unsupported auth type '%s'.", auth$type), call. = FALSE)
}

ox_parse_response_body <- function(response_text) {
  if (!nzchar(response_text)) {
    return(list())
  }

  tryCatch(
    jsonlite::fromJSON(response_text, simplifyVector = FALSE),
    error = function(error) response_text
  )
}

ox_as_result_data_frame <- function(value) {
  if (is.data.frame(value)) {
    return(value)
  }
  if (is.list(value)) {
    return(as.data.frame(value, stringsAsFactors = FALSE, check.names = FALSE))
  }
  data.frame(value = value, stringsAsFactors = FALSE, check.names = FALSE)
}

ox_add_provenance <- function(data, target, spec, data_schema) {
  if (is.null(data) || !is.data.frame(data)) {
    return(data)
  }

  row_count <- nrow(data)
  data$server <- rep(target$server, row_count)
  data$resource_uri <- rep(target$resource_uri, row_count)
  data$data_schema <- rep(data_schema %||% NA_character_, row_count)
  data$statistic <- rep(spec$statistic, row_count)

  ordered_names <- c("server", "resource_uri", "data_schema", "statistic", setdiff(names(data), c("server", "resource_uri", "data_schema", "statistic")))
  data[, ordered_names, drop = FALSE]
}

print.ox_result_set <- function(x, ...) {
  cat(
    sprintf(
      "<ox_result_set> %d row(s), %d error(s), %d response(s)\n",
      nrow(x$data),
      nrow(x$errors),
      length(x$responses)
    )
  )
  if (nrow(x$data) > 0) {
    print(utils::head(x$data, 10))
  }
  if (nrow(x$errors) > 0) {
    cat("Errors:\n")
    print(x$errors)
  }
  invisible(x)
}
