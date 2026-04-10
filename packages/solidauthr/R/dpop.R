solid_new_dpop_key <- function(private_key = NULL) {
  private_key <- private_key %||% openssl::ec_keygen("P-256")
  public_key <- as.list(private_key)$pubkey
  public_jwk <- solid_public_jwk(public_key)

  list(
    private_key = private_key,
    public_key = public_key,
    public_jwk = public_jwk,
    jkt = solid_jwk_thumbprint(public_jwk)
  )
}

solid_public_jwk <- function(public_key) {
  jwk <- solid_parse_json(jose::write_jwk(public_key))
  list(
    crv = jwk$crv,
    kty = jwk$kty,
    x = jwk$x,
    y = jwk$y
  )
}

solid_jwk_thumbprint <- function(jwk) {
  canonical <- solid_json(list(
    crv = jwk$crv,
    kty = jwk$kty,
    x = jwk$x,
    y = jwk$y
  ))

  solid_base64url_encode(openssl::sha256(charToRaw(canonical)))
}

solid_access_token_hash <- function(access_token) {
  solid_base64url_encode(openssl::sha256(charToRaw(access_token)))
}

solid_jwt_claim <- function(...) {
  structure(solid_compact_list(list(...)), class = c("jwt_claim", "list"))
}

solid_parse_jwt <- function(token) {
  segments <- strsplit(token, ".", fixed = TRUE)[[1]]
  if (length(segments) != 3) {
    stop("JWTs must contain exactly three segments.", call. = FALSE)
  }

  decode_segment <- function(segment) {
    solid_parse_json(rawToChar(jose::base64url_decode(segment)))
  }

  list(
    header = decode_segment(segments[[1]]),
    payload = decode_segment(segments[[2]]),
    signature = jose::base64url_decode(segments[[3]]),
    signing_input = charToRaw(paste(segments[[1]], segments[[2]], sep = "."))
  )
}

solid_build_dpop_proof <- function(
  dpop_key,
  method,
  url,
  access_token = NULL,
  nonce = NULL
) {
  method <- solid_require_method(method)
  htu <- solid_normalize_htu(url)

  claim <- solid_jwt_claim(
    jti = uuid::UUIDgenerate(),
    htm = method,
    htu = htu,
    iat = as.integer(Sys.time()),
    ath = if (is.null(access_token)) {
      NULL
    } else {
      solid_access_token_hash(access_token)
    },
    nonce = nonce
  )

  jose::jwt_encode_sig(
    claim = claim,
    key = dpop_key$private_key,
    header = list(
      typ = "dpop+jwt",
      jwk = dpop_key$public_jwk
    )
  )
}

solid_client_credentials_authorization <- function(client_id, client_secret) {
  solid_assert_scalar_string(client_id, "client_id")
  solid_assert_scalar_string(client_secret, "client_secret")

  encoded <- paste0(
    solid_percent_encode(client_id),
    ":",
    solid_percent_encode(client_secret)
  )

  paste("Basic", solid_base64_encode(encoded))
}

solid_prepare_token_request <- function(
  client_id,
  client_secret,
  token_endpoint,
  dpop_key,
  nonce = NULL
) {
  list(
    authorization = solid_client_credentials_authorization(
      client_id,
      client_secret
    ),
    dpop = solid_build_dpop_proof(
      dpop_key = dpop_key,
      method = "POST",
      url = token_endpoint,
      nonce = nonce
    ),
    body = list(
      grant_type = "client_credentials",
      scope = "webid"
    )
  )
}

solid_prepare_resource_request <- function(
  method,
  url,
  access_token,
  dpop_key,
  nonce = NULL
) {
  list(
    authorization = paste("DPoP", access_token),
    dpop = solid_build_dpop_proof(
      dpop_key = dpop_key,
      method = method,
      url = url,
      access_token = access_token,
      nonce = nonce
    )
  )
}
