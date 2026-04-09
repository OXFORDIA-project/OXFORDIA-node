test_that("token requests use client_secret_basic plus DPoP", {
  key <- solidauthr:::solid_new_dpop_key()
  prepared <- solidauthr:::solid_prepare_token_request(
    client_id = "client id/with:special",
    client_secret = "s3cr et/with:special",
    token_endpoint = "https://solid-idp.example/.oidc/token",
    dpop_key = key
  )

  auth_raw <- rawToChar(openssl::base64_decode(sub(
    "^Basic ",
    "",
    prepared$authorization
  )))
  proof <- solidauthr:::solid_parse_jwt(prepared$dpop)

  expect_identical(
    auth_raw,
    "client%20id%2Fwith%3Aspecial:s3cr%20et%2Fwith%3Aspecial"
  )
  expect_identical(prepared$body$grant_type, "client_credentials")
  expect_identical(prepared$body$scope, "webid")
  expect_identical(proof$payload$htm, "POST")
  expect_identical(proof$payload$htu, "https://solid-idp.example/.oidc/token")
})
