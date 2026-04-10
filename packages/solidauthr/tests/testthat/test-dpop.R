test_that("JWK thumbprints use the canonical EC members only", {
  jwk <- list(
    crv = "P-256",
    kty = "EC",
    x = "f83OJ3D2xF4Q6zNqE6bD1zYf-jM4kQWz5nR7A-1Y7WA",
    y = "x_FEzRu9h2a5nY1Vg8bY4W4D3P5sT6v7w8x9y0z1A2B",
    alg = "ES256",
    use = "sig"
  )

  expected <- jose::base64url_encode(openssl::sha256(charToRaw(
    '{"crv":"P-256","kty":"EC","x":"f83OJ3D2xF4Q6zNqE6bD1zYf-jM4kQWz5nR7A-1Y7WA","y":"x_FEzRu9h2a5nY1Vg8bY4W4D3P5sT6v7w8x9y0z1A2B"}'
  )))

  expect_identical(solidauthr:::solid_jwk_thumbprint(jwk), expected)
})

test_that("DPoP proofs carry the required header and claims", {
  key <- solidauthr:::solid_new_dpop_key()
  proof <- solidauthr:::solid_build_dpop_proof(
    dpop_key = key,
    method = "GET",
    url = "https://pod.example.org/private/data.ttl?foo=bar#frag",
    access_token = "example-access-token"
  )

  parts <- solidauthr:::solid_parse_jwt(proof)

  expect_identical(parts$header$typ, "dpop+jwt")
  expect_identical(parts$header$alg, "ES256")
  expect_setequal(names(parts$header$jwk), c("crv", "kty", "x", "y"))
  expect_false("d" %in% names(parts$header$jwk))
  expect_identical(parts$payload$htm, "GET")
  expect_identical(
    parts$payload$htu,
    "https://pod.example.org/private/data.ttl"
  )
  expect_identical(
    parts$payload$ath,
    solidauthr:::solid_access_token_hash("example-access-token")
  )
  expect_equal(length(parts$signature), 64)
})
