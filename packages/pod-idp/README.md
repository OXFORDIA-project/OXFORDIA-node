# `pod-idp`

`pod-idp` is a single-server Community Solid Server deployment for account management, self-hosted WebIDs, and client credentials.

It uses a custom CSS config in [`config/css-idp.json`](./config/css-idp.json) behind Caddy for HTTPS termination. The deployment intentionally keeps pod creation enabled because that is the reliable latest-CSS path for creating same-server WebIDs such as `https://solid-idp.university.edu/alice/profile/card#me` without any second service. The CSS container persists its data under `/data`, and Caddy stores certificates in Docker volumes.

## Prerequisites

- Docker Engine and the Compose plugin (`docker compose`)
- A public DNS record for your server host
- Ports `80` and `443` open to the internet
- A host that remote Solid servers can reach over HTTPS

## Quick Start

```bash
cd packages/pod-idp
cp .env.example .env
# edit .env
docker compose up -d
```

The main settings are:

- `CSS_BASE_URL`: the public HTTPS base URL for the server, preferably with a trailing slash
- `DOMAIN`: the hostname Caddy will serve
- `ACME_EMAIL`: the contact address for Let’s Encrypt
- `HTTP_PORT` and `HTTPS_PORT`: public listener ports

By default the CSS container listens on port `3000` internally and also binds `127.0.0.1:${IDP_LOCAL_PORT}` for local diagnostics and for the integration script in this repo. Use `http://localhost:${IDP_LOCAL_PORT}/` from the host if you want local HTTP requests to satisfy CSS's localhost-only development exception for insecure WebIDs. The optional `IDP_INTERNAL_PORT` setting lets you align the container's own listen port with the host port for local end-to-end tests; that loopback binding is not exposed publicly.

## Local Testing

For local development, the simplest supported path is plain HTTP on `localhost`.

Use these settings in `.env`:

```bash
CSS_BASE_URL=http://localhost:3300/
DOMAIN=localhost
ACME_EMAIL=local@example.invalid
IDP_LOCAL_PORT=3300
IDP_INTERNAL_PORT=3300
```

Then start only the CSS container:

```bash
docker compose up -d idp
```

You can then test:

- discovery at `http://localhost:3300/.well-known/openid-configuration`
- account management at `http://localhost:3300/.account/`
- browser registration at `http://localhost:3300/.account/login/password/register/`

Important local-only notes:

- Use `localhost`, not `127.0.0.1`. CSS accepts insecure local HTTP development URLs on `localhost`, and the local integration script in this repo depends on that behavior.
- Keep `IDP_LOCAL_PORT` and `IDP_INTERNAL_PORT` the same for local HTTP testing. CSS needs to dereference its own WebID during authenticated requests, so the container must be listening on the same `localhost:<port>` URL that it publishes in `CSS_BASE_URL`.
- This mode is for local development only. Remote Solid servers validating tokens from this issuer still need a publicly reachable HTTPS issuer in real deployments.

### About Local HTTPS

The checked-in Docker Compose setup is aimed at production HTTPS behind Caddy and local HTTP development. It does not provide a zero-configuration localhost HTTPS mode out of the box.

Caddy can generate local certificates for `localhost`, but in this split-container setup CSS also has to dereference its own `CSS_BASE_URL` during authenticated requests. If `CSS_BASE_URL` is `https://localhost/...`, the CSS container sees `localhost` as itself, not the separate Caddy container, so extra networking changes are required before local HTTPS will work reliably.

If you specifically want local HTTPS, treat it as a separate development setup rather than the default `docker compose up -d` path. The current repo documents and tests the local HTTP path above.

## First Operator Account

CSS does not have a special built-in administrator role here. The first operator account is simply the first account created through the account UI or JSON API.

For a browser-based bootstrap:

1. Open `https://your-domain/.account/login/password/register/`
2. Register an email/password account
3. Create a pod on the account page
4. Use the generated same-server WebID, for example `https://your-domain/alice/profile/card#me`
5. Create client credentials for that WebID from the same account page

If you need a pre-created bootstrap account instead of open self-registration, use a CSS seed configuration or tighten access to the account creation API with ACLs on `/.account/account/`.

## User Registration And Client Credentials

Users can self-register through:

- `https://your-domain/.account/login/password/register/`

After signing in, they can:

- create a pod, which also generates a same-server WebID
- optionally link external WebIDs if needed
- generate client credentials for that WebID
- revoke old client credentials from the account page

The same account-management workflow is also available through the CSS JSON API rooted at `https://your-domain/.account/`.

## Why This Is Not OIDC-Only

Older CSS guidance often points at an `identity-only.json` style deployment. In the current latest CSS image, the OIDC-only preset is `oidc.json`, and that preset is suitable for linking existing WebIDs, but not for minting same-server WebIDs without another host. Since this project explicitly wants one server that hosts its own WebIDs, this deployment enables file-backed pods and uses those pods to generate WebIDs on the same origin.

## Verify The Deployment

Check discovery:

```bash
curl -fsSL https://solid-idp.university.edu/.well-known/openid-configuration
```

The JSON should expose at least:

- `issuer`
- `token_endpoint`
- `jwks_uri`
- `scopes_supported` including `webid`

You can also confirm the JWKS endpoint referenced by `jwks_uri` is reachable without authentication.

## Security Notes

- Keep `CSS_BASE_URL` on public HTTPS only. Remote Solid servers must be able to fetch discovery metadata and JWKS documents from that URL.
- This deployment stores pod data as well as identity data. Backups therefore need to cover both account metadata and any generated pod resources.
- Back up the Docker volume named `pod-idp_idp_data` or replace the named volume with a host bind mount if your operations model prefers filesystem backups.
- Keep the `solidproject/community-server` and `caddy` images updated, and pin versions after validation for repeatable rollouts.
- Restrict account creation if self-service registration is too open for your institution. CSS’s identity-provider docs describe using authorization rules on `/.account/`.
- Treat client-credential secrets like passwords. CSS shows the secret only once when it is created.

## Using The Credentials From R

The companion R package in this repo lives at `packages/solidauthr`.

Example:

```r
library(solidauthr)

session <- solid_session(
  issuer = "https://solid-idp.university.edu/",
  client_id = Sys.getenv("SOLID_CLIENT_ID"),
  client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
)

resp <- session$get("https://some-pod.example.org/private/data.ttl")
```

## Integration Script

A local end-to-end integration script is included at:

- `packages/solidauthr/scripts/pod-idp-integration.R`

It starts the `idp` service only, provisions an account and pod through the JSON API, uses the generated same-server WebID, creates client credentials, and exercises `solidauthr` against the running issuer and pod resource. No auxiliary WebID host is involved.
