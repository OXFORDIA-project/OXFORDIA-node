#' Create a No-Auth Configuration
#'
#' @export
ox_auth_none <- function() {
  structure(
    list(type = "none"),
    class = c("ox_auth", "list")
  )
}

#' Create a Solid Auth Configuration
#'
#' @param issuer Solid issuer URL.
#' @param client_id OAuth client id.
#' @param client_secret OAuth client secret.
#' @param safety_margin Token safety margin in seconds.
#' @param session Optional prebuilt `solidauthr::solid_session()` object.
#'
#' @export
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
        paste(
          "Provide either `session` or the `issuer` / `client_id` /",
          "`client_secret` fields, not both."
        ),
        call. = FALSE
      )
    }
    if (!inherits(session, "SolidSession")) {
      stop(
        "`session` must be created by `solidauthr::solid_session()`.",
        call. = FALSE
      )
    }

    cache$session <- session
    return(
      structure(
        list(type = "solid", safety_margin = safety_margin, cache = cache),
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

#' Create a Bearer Token Auth Configuration
#'
#' @param token Bearer token.
#'
#' @export
ox_auth_bearer <- function(token) {
  ox_assert_scalar_string(token, "token")
  structure(
    list(type = "bearer", token = token),
    class = c("ox_auth", "list")
  )
}

#' Create a Raw Header Auth Configuration
#'
#' @param headers Named list of headers.
#'
#' @export
ox_auth_headers <- function(headers) {
  if (
    !is.list(headers) ||
      is.null(names(headers)) ||
      any(!nzchar(names(headers)))
  ) {
    stop("`headers` must be a named list.", call. = FALSE)
  }

  structure(
    list(type = "headers", headers = headers),
    class = c("ox_auth", "list")
  )
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

  if (
    !is.list(auth) ||
      !ox_is_scalar_string(auth$type %||% NULL)
  ) {
    stop(
      paste(
        "`auth` must be NULL, a `solidauthr::solid_session()` object,",
        "or created by an `ox_auth_*()` helper."
      ),
      call. = FALSE
    )
  }

  if (identical(auth$type, "solid")) {
    auth$safety_margin <- ox_normalize_safety_margin(
      auth$safety_margin %||% 30L
    )
    if (
      is.null(auth$cache) ||
        !is.environment(auth$cache)
    ) {
      cache <- new.env(parent = emptyenv())
      cache$session <- NULL
      auth$cache <- cache
    } else if (!exists("session", envir = auth$cache, inherits = FALSE)) {
      auth$cache$session <- NULL
    }

    if (is.null(auth$cache$session)) {
      ox_assert_scalar_string(auth$issuer %||% NULL, "auth$issuer")
      ox_assert_scalar_string(auth$client_id %||% NULL, "auth$client_id")
      ox_assert_scalar_string(
        auth$client_secret %||% NULL,
        "auth$client_secret"
      )
    }
  }

  auth
}

ox_normalize_safety_margin <- function(value) {
  if (
    !is.numeric(value) ||
      length(value) != 1 ||
      is.na(value) ||
      value < 0
  ) {
    stop("`safety_margin` must be a single non-negative number.", call. = FALSE)
  }

  as.integer(value)
}

ox_resolve_solid_session <- function(auth) {
  if (
    is.null(auth) ||
      !identical(auth$type, "solid")
  ) {
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

ox_resolve_request_auth <- function(auth, target) {
  target$auth %||% auth %||% ox_auth_none()
}

ox_auth_header_values <- function(auth) {
  if (
    is.null(auth) ||
      identical(auth$type, "none")
  ) {
    return(list())
  }
  if (identical(auth$type, "solid")) {
    return(list())
  }
  if (identical(auth$type, "bearer")) {
    return(list(Authorization = paste("Bearer", auth$token)))
  }
  if (identical(auth$type, "headers")) {
    return(auth$headers)
  }

  stop(
    sprintf("Unsupported auth type '%s'.", auth$type),
    call. = FALSE
  )
}
