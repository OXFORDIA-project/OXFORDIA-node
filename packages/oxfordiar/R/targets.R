#' Create a Query Target
#'
#' @param name Target name.
#' @param resource_uri Resource URI.
#' @param label Optional label.
#' @param base_url Optional explicit API origin.
#' @param auth Optional per-target auth override.
#' @param api_path API path prefix.
#' @param description Optional description.
#'
#' @export
ox_target <- function(
  name,
  resource_uri,
  label = NULL,
  base_url = NULL,
  auth = NULL,
  api_path = "/.api/stat",
  description = NULL
) {
  ox_assert_scalar_string(name, "name")
  ox_assert_scalar_string(resource_uri, "resource_uri")
  if (!is.null(label)) {
    ox_assert_scalar_string(label, "label")
  }
  if (!is.null(base_url)) {
    ox_assert_scalar_string(base_url, "base_url")
    base_url <- ox_trim_trailing_slash(base_url)
  }
  ox_assert_scalar_string(api_path, "api_path")
  auth <- ox_normalize_auth(auth, allow_null = TRUE)

  structure(
    list(
      name = trimws(name),
      resource_uri = resource_uri,
      label = label,
      base_url = base_url,
      auth = auth,
      api_path = api_path,
      description = description
    ),
    class = c("ox_target", "list")
  )
}

#' Collect Query Targets
#'
#' @param ... Target objects or a single list of targets.
#'
#' @export
ox_targets <- function(...) {
  values <- list(...)
  if (
    length(values) == 1 &&
      is.list(values[[1]]) &&
      !inherits(values[[1]], "ox_target")
  ) {
    values <- values[[1]]
  }
  values
}

ox_query_targets <- function(targets) {
  targets <- ox_targets(targets)
  if (length(targets) == 0) {
    stop("At least one target is required.", call. = FALSE)
  }

  for (target in targets) {
    if (!inherits(target, "ox_target")) {
      stop("Each target must be created by `ox_target()`.", call. = FALSE)
    }
  }

  targets
}
