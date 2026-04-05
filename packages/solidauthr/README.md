# `solidauthr`

`solidauthr` is an R package for Solid-OIDC client-credentials authentication against Community Solid Server identity providers.

It discovers the issuer configuration, generates a session-scoped DPoP key pair, requests DPoP-bound access tokens with the `webid` scope, and attaches fresh DPoP proofs to each outgoing Solid request.

## Usage

```r
library(solidauthr)
library(httr2)

session <- solid_session(
  issuer = "https://solid-idp.university.edu/",
  client_id = Sys.getenv("SOLID_CLIENT_ID"),
  client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
)

resp <- session$get("https://some-pod.example.org/private/data.ttl")
httr2::resp_body_string(resp)

session$put(
  "https://some-pod.example.org/private/new.ttl",
  body = "@prefix dct: <http://purl.org/dc/terms/> . <> dct:title \"Example\" .",
  content_type = "text/turtle"
)
```

## Session API

The constructor returns an R6 object with these methods:

- `$fetch(url, method = "GET", ...)`
- `$get(url, ...)`
- `$put(url, body, content_type, ...)`
- `$post(url, body, content_type, ...)`
- `$patch(url, body, content_type, ...)`
- `$delete(url, ...)`
- `$token(force_refresh = FALSE)`

The session keeps one EC P-256 DPoP key pair for its lifetime and re-requests access tokens automatically when they are close to expiry.

## Development

`DESCRIPTION` is the source of truth for R package dependencies. For local development, install them from `DESCRIPTION` into the package-local library first:

```bash
Rscript packages/solidauthr/scripts/install-deps.R
```

Build the package:

```bash
npx nx run solidauthr:build
```

Run unit tests:

```bash
npx nx run solidauthr:test
```

Run the Docker-backed integration script:

```bash
Rscript packages/solidauthr/scripts/pod-idp-integration.R
```
