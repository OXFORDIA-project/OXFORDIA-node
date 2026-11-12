#' Build a Graph Path from a JSON-Parsed List
#'
#' Converts the plain-list representation produced by
#' `jsonlite::fromJSON()` into a typed `ox_graph_path` object.
#' This is the standard way to load graph-path shortcuts
#' distributed as JSON files alongside data plugins.
#'
#' @param x A named list representing a graph path (as returned by
#'   `jsonlite::fromJSON(..., simplifyVector = FALSE)`).
#'
#' @return An `ox_graph_path` object.
#'
#' @export
ox_graph_path_from_json <- function(x) {
  steps <- if (!is.null(x$steps))
    lapply(x$steps, ox_traversal_step_from_json)
  target <- if (!is.null(x$target))
    ox_value_selector_from_json(x$target)
  ox_graph_path(
    start = ox_node_filter_from_json(x$start),
    steps = steps,
    target = target,
    name = x$name
  )
}

ox_node_filter_from_json <- function(x) {
  preds <- if (!is.null(x$predicates))
    lapply(x$predicates, ox_predicate_filter_from_json)
  ox_node_filter(
    rdf_type = ox_json_string_array(x$rdfType),
    iri = ox_json_string_array(x$iri),
    categories = ox_json_string_array(x$categories),
    predicates = preds
  )
}

ox_predicate_filter_from_json <- function(x) {
  ox_predicate_filter(
    predicate = x$predicate[["@id"]],
    inverse = isTRUE(x$inverse),
    some = if (!is.null(x$some))
      ox_value_selector_from_json(x$some),
    every = if (!is.null(x$every))
      ox_value_selector_from_json(x$every),
    none = if (!is.null(x$none))
      ox_value_selector_from_json(x$none)
  )
}

ox_traversal_step_from_json <- function(x) {
  ox_traversal_step(
    via = x$via[["@id"]],
    inverse = isTRUE(x$inverse),
    where = if (!is.null(x$where))
      ox_node_filter_from_json(x$where)
  )
}

ox_value_selector_from_json <- function(x) {
  if (!is.null(x$node)) {
    ox_node_selector(ox_node_filter_from_json(x$node))
  } else if (!is.null(x$literal)) {
    ox_literal_selector(ox_literal_filter_from_json(x$literal))
  } else {
    stop(
      "Value selector must have a 'node' or 'literal' field.",
      call. = FALSE
    )
  }
}

ox_literal_filter_from_json <- function(x) {
  ox_literal_filter(
    datatype = ox_json_string_array(x$datatype),
    lang = ox_json_string_array(x$lang),
    equals = x$equals,
    one_of = ox_json_string_array(x$oneOf),
    min = x$min,
    max = x$max
  )
}

# Normalises a JSON string array (list of strings under simplifyVector=FALSE)
# to an R character vector.
ox_json_string_array <- function(x) {
  if (is.null(x)) return(NULL)
  unlist(x, use.names = FALSE)
}
