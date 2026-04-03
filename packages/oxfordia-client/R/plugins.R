ox_query_field <- function(name, json_key = name, kind = c("string", "number", "boolean", "graph_path", "raw"), required = TRUE, shortcutable = FALSE, description = NULL) {
  kind <- match.arg(kind)
  ox_assert_scalar_string(name, "name")
  ox_assert_scalar_string(json_key, "json_key")
  if (!is.logical(required) || length(required) != 1 || is.na(required)) {
    stop("`required` must be TRUE or FALSE.", call. = FALSE)
  }
  if (!is.logical(shortcutable) || length(shortcutable) != 1 || is.na(shortcutable)) {
    stop("`shortcutable` must be TRUE or FALSE.", call. = FALSE)
  }

  structure(
    ox_compact_list(list(
      name = name,
      json_key = json_key,
      kind = kind,
      required = required,
      shortcutable = shortcutable,
      description = description
    )),
    class = c("ox_query_field", "list")
  )
}

ox_data_plugin <- function(name, shortcuts = list(), schema = NULL, context = NULL, shape_types = NULL, description = NULL) {
  ox_assert_scalar_string(name, "name")
  if (!is.list(shortcuts)) {
    stop("`shortcuts` must be a named list.", call. = FALSE)
  }
  if (length(shortcuts) > 0) {
    ox_assert_named_list(shortcuts, "shortcuts")
  }

  structure(
    list(
      name = ox_normalize_name(name),
      shortcuts = shortcuts,
      schema = schema,
      context = context,
      shape_types = shape_types,
      description = description
    ),
    class = c("ox_data_plugin", "list")
  )
}

ox_stat_plugin <- function(name, route, fields = list(), parse_result = NULL, combine_results = NULL, description = NULL) {
  ox_assert_scalar_string(name, "name")
  ox_assert_scalar_string(route, "route")
  if (!is.list(fields)) {
    stop("`fields` must be a list of query fields.", call. = FALSE)
  }

  if (length(fields) > 0) {
    field_names <- vapply(fields, function(field) {
      if (!is.list(field) || is.null(field$name)) {
        stop("Each field must be created by `ox_query_field()`.", call. = FALSE)
      }
      field$name
    }, character(1))
    fields <- stats::setNames(fields, field_names)
  }

  if (is.null(parse_result)) {
    parse_result <- function(payload, target, spec) {
      payload
    }
  }
  if (is.null(combine_results)) {
    combine_results <- function(rows) {
      ox_bind_rows_fill(rows)
    }
  }

  structure(
    list(
      name = ox_normalize_name(name),
      route = route,
      fields = fields,
      parse_result = parse_result,
      combine_results = combine_results,
      description = description
    ),
    class = c("ox_stat_plugin", "list")
  )
}

ox_resolve_shortcut_from_plugin <- function(data_plugin, shortcut_name) {
  direct <- data_plugin$shortcuts[[shortcut_name]]
  if (!is.null(direct)) {
    result <- if (is.function(direct)) direct() else direct
    if (is.null(result$name)) {
      result$name <- shortcut_name
    }
    return(result)
  }

  normalized <- ox_normalize_name(shortcut_name)
  available_names <- names(data_plugin$shortcuts)
  matched_name <- available_names[vapply(available_names, ox_normalize_name, character(1)) == normalized]
  if (length(matched_name) == 0) {
    stop(
      sprintf(
        "Shortcut '%s' was not found in data plugin '%s'. Available shortcuts: %s",
        shortcut_name,
        data_plugin$name,
        paste(available_names, collapse = ", ")
      ),
      call. = FALSE
    )
  }

  result <- data_plugin$shortcuts[[matched_name[[1]]]]
  result <- if (is.function(result)) result() else result
  if (is.null(result$name)) {
    result$name <- matched_name[[1]]
  }
  result
}

