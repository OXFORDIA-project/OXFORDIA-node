#' Create a Graph Path
#'
#' @param start A graph-node filter created by `ox_node_filter()`.
#' @param steps Optional list of traversal steps.
#' @param target Optional target selector.
#' @param name Optional display name.
#' @param id Optional identifier.
#'
#' @export
ox_graph_path <- function(
  start,
  steps = NULL,
  target = NULL,
  name = NULL,
  id = NULL
) {
  if (!is.list(start)) {
    stop(
      "`start` must be a graph-node filter created by `ox_node_filter()`.",
      call. = FALSE
    )
  }

  if (!is.null(name)) {
    ox_assert_scalar_string(name, "name")
  }
  if (!is.null(id)) {
    ox_assert_scalar_string(id, "id")
  }

  if (!is.null(steps)) {
    if (
      !is.list(steps) ||
        any(!vapply(steps, is.list, logical(1)))
    ) {
      stop("`steps` must be a list of traversal steps.", call. = FALSE)
    }
  }

  structure(
    ox_compact_list(list(
      `@id` = id,
      name = name,
      start = start,
      steps = steps,
      target = target
    )),
    class = c("ox_graph_path", "list")
  )
}

#' Create a Graph Node Filter
#'
#' @param rdf_type Optional RDF type filter.
#' @param iri Optional IRI filter.
#' @param categories Optional category filter.
#' @param predicates Optional list of predicate filters.
#' @param id Optional identifier.
#'
#' @export
ox_node_filter <- function(
  rdf_type = NULL,
  iri = NULL,
  categories = NULL,
  predicates = NULL,
  id = NULL
) {
  if (
    !is.null(predicates) &&
      (!is.list(predicates) ||
        any(!vapply(predicates, is.list, logical(1))))
  ) {
    stop("`predicates` must be a list of predicate filters.", call. = FALSE)
  }
  if (!is.null(id)) {
    ox_assert_scalar_string(id, "id")
  }

  structure(
    ox_compact_list(
      list(
        `@id` = id,
        rdfType = ox_as_character_set(rdf_type),
        iri = ox_as_character_set(iri),
        categories = ox_as_character_set(categories),
        predicates = predicates
      )
    ),
    class = c("ox_node_filter", "list")
  )
}

#' Create a Node Selector
#'
#' @param filter A graph-node filter.
#'
#' @export
ox_node_selector <- function(filter) {
  if (!is.list(filter)) {
    stop("`filter` must be a graph-node filter.", call. = FALSE)
  }
  structure(
    list(node = filter),
    class = c("ox_value_selector", "list")
  )
}

#' Create a Literal Selector
#'
#' @param filter A graph-literal filter.
#'
#' @export
ox_literal_selector <- function(filter) {
  if (!is.list(filter)) {
    stop("`filter` must be a graph-literal filter.", call. = FALSE)
  }
  structure(
    list(literal = filter),
    class = c("ox_value_selector", "list")
  )
}

#' Create a Literal Filter
#'
#' @param datatype Optional datatype filter.
#' @param lang Optional language filter.
#' @param equals Optional equality filter.
#' @param one_of Optional inclusion filter.
#' @param min Optional minimum value.
#' @param max Optional maximum value.
#' @param id Optional identifier.
#'
#' @export
ox_literal_filter <- function(
  datatype = NULL,
  lang = NULL,
  equals = NULL,
  one_of = NULL,
  min = NULL,
  max = NULL,
  id = NULL
) {
  if (!is.null(datatype)) {
    datatype <- ox_as_character_set(datatype)
  }
  if (!is.null(lang)) {
    lang <- ox_as_character_set(lang)
  }
  if (!is.null(id)) {
    ox_assert_scalar_string(id, "id")
  }

  structure(
    ox_compact_list(
      list(
        `@id` = id,
        datatype = datatype,
        lang = lang,
        equals = equals,
        oneOf = one_of,
        min = min,
        max = max
      )
    ),
    class = c("ox_literal_filter", "list")
  )
}

#' Create a Predicate Filter
#'
#' @param predicate Predicate IRI.
#' @param inverse Whether the predicate is inverse.
#' @param some Optional existential selector.
#' @param every Optional universal selector.
#' @param none Optional negated selector.
#' @param id Optional identifier.
#'
#' @export
ox_predicate_filter <- function(
  predicate,
  inverse = FALSE,
  some = NULL,
  every = NULL,
  none = NULL,
  id = NULL
) {
  if (
    !is.logical(inverse) ||
      length(inverse) != 1 ||
      is.na(inverse)
  ) {
    stop("`inverse` must be TRUE or FALSE.", call. = FALSE)
  }
  if (!is.null(id)) {
    ox_assert_scalar_string(id, "id")
  }

  structure(
    ox_compact_list(
      list(
        `@id` = id,
        predicate = ox_as_iri_ref(predicate, "predicate"),
        inverse = if (inverse) TRUE else NULL,
        some = some,
        every = every,
        none = none
      )
    ),
    class = c("ox_predicate_filter", "list")
  )
}

#' Create a Traversal Step
#'
#' @param via Predicate IRI.
#' @param inverse Whether the traversal is inverse.
#' @param where Optional node filter applied at this step.
#' @param id Optional identifier.
#'
#' @export
ox_traversal_step <- function(via, inverse = FALSE, where = NULL, id = NULL) {
  if (
    !is.logical(inverse) ||
      length(inverse) != 1 ||
      is.na(inverse)
  ) {
    stop("`inverse` must be TRUE or FALSE.", call. = FALSE)
  }
  if (!is.null(id)) {
    ox_assert_scalar_string(id, "id")
  }

  structure(
    ox_compact_list(
      list(
        `@id` = id,
        via = ox_as_iri_ref(via, "via"),
        inverse = if (inverse) TRUE else NULL,
        where = where
      )
    ),
    class = c("ox_traversal_step", "list")
  )
}

ox_as_iri_ref <- function(value, arg = deparse(substitute(value))) {
  if (
    is.list(value) &&
      !is.null(value[["@id"]])
  ) {
    return(value)
  }

  ox_assert_scalar_string(value, arg)
  list(`@id` = value)
}

ox_as_character_set <- function(value) {
  if (is.null(value)) {
    return(NULL)
  }
  if (
    !is.character(value) ||
      any(is.na(value)) ||
      any(!nzchar(trimws(value)))
  ) {
    stop("Expected a character vector with non-empty values.", call. = FALSE)
  }
  unname(value)
}
