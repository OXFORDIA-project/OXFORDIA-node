SolidSession <- R6::R6Class(
  "SolidSession",
  public = list(
    issuer = NULL,
    client_id = NULL,
    token_endpoint = NULL,
    oidc_configuration = NULL,
    dpop_key = NULL,
    access_token = NULL,
    access_token_expires_at = NULL,
    safety_margin = NULL,
    token_nonce = NULL,
    resource_nonces = NULL,
    initialize = function(
      issuer,
      client_id,
      client_secret,
      safety_margin = 30L,
      dpop_key = NULL
    ) {
      solid_assert_scalar_string(issuer, "issuer")
      solid_assert_scalar_string(client_id, "client_id")
      solid_assert_scalar_string(client_secret, "client_secret")

      self$issuer <- solid_trim_trailing_slash(issuer)
      self$client_id <- client_id
      private$client_secret <- client_secret
      self$safety_margin <- as.integer(safety_margin)
      self$dpop_key <- dpop_key %||% solid_new_dpop_key()
      self$resource_nonces <- list()

      invisible(private$discover())
    },
    print = function(...) {
      expiry <- if (is.null(self$access_token_expires_at)) {
        "none"
      } else {
        format(self$access_token_expires_at, tz = "UTC", usetz = TRUE)
      }

      cat(
        sprintf(
          "<SolidSession issuer=%s token_endpoint=%s expires_at=%s>\n",
          self$issuer,
          self$token_endpoint %||% "unresolved",
          expiry
        )
      )

      invisible(self)
    },
    token = function(force_refresh = FALSE) {
      private$ensure_token(force_refresh = force_refresh)
      self$access_token
    },
    fetch = function(
      url,
      method = "GET",
      body = NULL,
      content_type = NULL,
      headers = NULL,
      query = NULL
    ) {
      solid_assert_scalar_string(url, "url")
      private$ensure_token()

      request_method <- solid_require_method(method)
      req <- solid_build_request(
        url = url,
        method = request_method,
        headers = headers,
        query = query,
        body = body,
        content_type = content_type
      )

      target_url <- url
      origin_key <- solid_origin_key(url)

      perform_once <- function() {
        auth_headers <- solid_prepare_resource_request(
          method = request_method,
          url = target_url,
          access_token = self$access_token,
          dpop_key = self$dpop_key,
          nonce = private$get_resource_nonce(origin_key)
        )

        auth_req <- solid_attach_redacted_headers(
          req,
          list(
            Authorization = auth_headers$authorization,
            DPoP = auth_headers$dpop
          )
        )

        httr2::req_perform(auth_req)
      }

      resp <- private$perform_with_nonce_retry(
        perform_once = perform_once,
        get_nonce = function() private$get_resource_nonce(origin_key),
        set_nonce = function(value) {
          private$set_resource_nonce(origin_key, value)
        }
      )

      if (httr2::resp_status(resp) >= 400) {
        solid_stop_for_response(
          resp,
          sprintf("%s %s", request_method, target_url)
        )
      }

      resp
    },
    get = function(url, headers = NULL, query = NULL) {
      self$fetch(url = url, method = "GET", headers = headers, query = query)
    },
    put = function(
      url,
      body = NULL,
      content_type = NULL,
      headers = NULL,
      query = NULL
    ) {
      self$fetch(
        url = url,
        method = "PUT",
        body = body,
        content_type = content_type,
        headers = headers,
        query = query
      )
    },
    post = function(
      url,
      body = NULL,
      content_type = NULL,
      headers = NULL,
      query = NULL
    ) {
      self$fetch(
        url = url,
        method = "POST",
        body = body,
        content_type = content_type,
        headers = headers,
        query = query
      )
    },
    patch = function(
      url,
      body = NULL,
      content_type = NULL,
      headers = NULL,
      query = NULL
    ) {
      self$fetch(
        url = url,
        method = "PATCH",
        body = body,
        content_type = content_type,
        headers = headers,
        query = query
      )
    },
    delete = function(url, headers = NULL, query = NULL) {
      self$fetch(url = url, method = "DELETE", headers = headers, query = query)
    }
  ),
  private = list(
    client_secret = NULL,
    discover = function(force = FALSE) {
      if (!force && !is.null(self$oidc_configuration)) {
        return(self$oidc_configuration)
      }

      req <- solid_build_request(solid_build_well_known_url(self$issuer))
      resp <- httr2::req_perform(req)

      if (httr2::resp_status(resp) >= 400) {
        solid_stop_for_response(resp, "OIDC discovery")
      }

      configuration <- solid_resp_json(resp)
      scopes <- unlist(
        configuration$scopes_supported %||% list(),
        use.names = FALSE
      )
      auth_methods <- unlist(
        configuration$token_endpoint_auth_methods_supported %||% list(),
        use.names = FALSE
      )
      dpop_algs <- unlist(
        configuration$dpop_signing_alg_values_supported %||% list(),
        use.names = FALSE
      )

      if (!("webid" %in% scopes)) {
        stop(
          "The issuer does not advertise support for the `webid` scope.",
          call. = FALSE
        )
      }

      if (!solid_is_scalar_string(configuration$token_endpoint %||% NULL)) {
        stop(
          "The issuer response did not include a usable `token_endpoint`.",
          call. = FALSE
        )
      }

      if (
        length(auth_methods) > 0 && !("client_secret_basic" %in% auth_methods)
      ) {
        stop(
          "The issuer does not advertise `client_secret_basic` token authentication.",
          call. = FALSE
        )
      }

      if (length(dpop_algs) > 0 && !("ES256" %in% dpop_algs)) {
        stop(
          "The issuer does not advertise ES256 for DPoP signing.",
          call. = FALSE
        )
      }

      self$oidc_configuration <- configuration
      self$token_endpoint <- configuration$token_endpoint
      configuration
    },
    ensure_token = function(force_refresh = FALSE) {
      if (
        force_refresh ||
          is.null(self$access_token) ||
          private$token_is_stale()
      ) {
        private$request_token()
      }

      invisible(self$access_token)
    },
    token_is_stale = function() {
      if (is.null(self$access_token_expires_at)) {
        return(TRUE)
      }

      remaining <- as.numeric(difftime(
        self$access_token_expires_at,
        Sys.time(),
        units = "secs"
      ))

      remaining <= self$safety_margin
    },
    request_token = function() {
      private$discover()

      perform_once <- function() {
        token_request <- solid_prepare_token_request(
          client_id = self$client_id,
          client_secret = private$client_secret,
          token_endpoint = self$token_endpoint,
          dpop_key = self$dpop_key,
          nonce = self$token_nonce
        )

        req <- httr2::request(self$token_endpoint)
        req <- httr2::req_method(req, "POST")
        req <- solid_attach_redacted_headers(
          req,
          list(
            Authorization = token_request$authorization,
            DPoP = token_request$dpop
          )
        )
        req <- do.call(httr2::req_body_form, c(list(req), token_request$body))
        req <- solid_no_error(req)
        httr2::req_perform(req)
      }

      resp <- private$perform_with_nonce_retry(
        perform_once = perform_once,
        get_nonce = function() self$token_nonce,
        set_nonce = function(value) {
          self$token_nonce <- value
        }
      )

      if (httr2::resp_status(resp) >= 400) {
        solid_stop_for_response(resp, "Token request")
      }

      payload <- solid_resp_json(resp)
      expires_in <- as.numeric(payload$expires_in %||% 300)

      self$access_token <- payload$access_token
      self$access_token_expires_at <- Sys.time() + expires_in

      if (!solid_is_scalar_string(self$access_token)) {
        stop(
          "The token endpoint response did not include an `access_token`.",
          call. = FALSE
        )
      }

      invisible(payload)
    },
    perform_with_nonce_retry = function(perform_once, get_nonce, set_nonce) {
      retried <- FALSE

      repeat {
        resp <- perform_once()
        nonce <- solid_first_header(resp, "DPoP-Nonce")
        status <- httr2::resp_status(resp)

        if (!is.null(nonce)) {
          set_nonce(nonce)
        }

        if (!retried && !is.null(nonce) && status %in% c(400L, 401L)) {
          retried <- TRUE
          next
        }

        return(resp)
      }
    },
    get_resource_nonce = function(origin_key) {
      self$resource_nonces[[origin_key]] %||% NULL
    },
    set_resource_nonce = function(origin_key, value) {
      self$resource_nonces[[origin_key]] <- value
      invisible(value)
    }
  )
)

solid_session <- function(
  issuer,
  client_id,
  client_secret,
  safety_margin = 30L
) {
  SolidSession$new(
    issuer = issuer,
    client_id = client_id,
    client_secret = client_secret,
    safety_margin = safety_margin
  )
}
