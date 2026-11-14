#' Return All Nemaline Shortcuts
#'
#' @export
ox_legacy_nemaline_shortcuts <- function() {
  shortcuts_raw <- ox_legacy_nemaline_load_json()
  stats::setNames(
    lapply(names(shortcuts_raw), function(name) {
      oxfordiar::ox_data_shortcut(
        name = name,
        path = oxfordiar::ox_graph_path_from_json(shortcuts_raw[[name]])
      )
    }),
    names(shortcuts_raw)
  )
}

#' Look Up a Nemaline Shortcut by Name
#'
#' @param name Shortcut name.
#'
#' @export
ox_legacy_nemaline_shortcut <- function(name) {
  shortcuts_raw <- ox_legacy_nemaline_load_json()
  available_names <- names(shortcuts_raw)
  normalized_names <- vapply(
    available_names,
    ox_legacy_nemaline_normalize_name,
    character(1)
  )
  match_index <- match(
    ox_legacy_nemaline_normalize_name(name),
    normalized_names
  )

  if (is.na(match_index)) {
    stop(
      sprintf(
        "Unknown legacy nemaline shortcut '%s'. Available shortcuts: %s",
        name,
        paste(available_names, collapse = ", ")
      ),
      call. = FALSE
    )
  }

  matched_name <- available_names[[match_index]]
  oxfordiar::ox_data_shortcut(
    name = matched_name,
    path = oxfordiar::ox_graph_path_from_json(shortcuts_raw[[match_index]])
  )
}

ox_legacy_nemaline_load_json <- function() {
  path <- system.file(
    "legacy-nemaline-shortcuts.json",
    package = "oxfordiar.data.legacynemaline"
  )
  jsonlite::fromJSON(path, simplifyVector = FALSE)
}

ox_legacy_nemaline_normalize_name <- function(value) {
  value <- trimws(value)
  value <- gsub("[_[:space:]-]+", "", value)
  tolower(value)
}
