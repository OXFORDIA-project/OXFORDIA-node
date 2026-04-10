#' Create a Data Shortcut
#'
#' @param name Shortcut name.
#' @param path Graph path created by `ox_graph_path()`.
#' @param description Optional description.
#'
#' @export
ox_data_shortcut <- function(name, path, description = NULL) {
  ox_assert_scalar_string(name, "name")
  if (
    !inherits(path, "ox_graph_path") &&
      !(is.list(path) &&
        !is.null(path$start))
  ) {
    stop("`path` must be created by `ox_graph_path()`.", call. = FALSE)
  }

  structure(
    list(
      name = trimws(name),
      path = path,
      description = description
    ),
    class = c("ox_data_shortcut", "list")
  )
}

ox_encode_query_value <- function(value) {
  if (is.null(value)) {
    return(NULL)
  }
  if (inherits(value, "ox_data_shortcut")) {
    return(value$path)
  }
  if (inherits(value, "ox_graph_path")) {
    return(value)
  }
  if (
    is.list(value) &&
      !is.null(value$start)
  ) {
    return(value)
  }
  if (is.atomic(value)) {
    return(unname(value))
  }

  value
}
