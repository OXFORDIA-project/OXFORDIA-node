# OXFORDIA Pod

OXFORDIA (OXford Federation for Orchestrating Remote Data & International Analytics) Pod is a Solid Pod deployment for federated research data.

## For Deployers

### What You Need

- Docker with Compose plugin (`docker compose`)
- A hostname and DNS record pointing to the server (for public deployments)
- Host storage path for persistent data (`HOST_DATA_DIR`)

### Production Deploy (Docker Compose Package)

Download and start from a release artifact:

```bash
wget https://github.com/OXFORDIA-project/OXFORDIA-node/releases/latest/download/oxfordia-node-deploy-latest.tar.gz
tar -xzf oxfordia-node-deploy-latest.tar.gz
cd oxfordia-node-deploy
./deploy.sh init
# edit config.env
./deploy.sh up
```

Or build the package from source:

```bash
npm install
npm run build
npm run deploy:package
```

This creates `build/oxfordia-node-deploy-<version>.tar.gz`.

### Required Configuration (`config.env`)

Required keys validated by `deploy.sh`:

- `BASE_URL` (public app URL, for example `https://pod.example.org`)
- `HOST_DATA_DIR` (persistent host directory)
- `NODE_HOST_PORT`
- `TRUST_PROXY`
- `TRIPLESTORE_MODE` (`bundled` or `external`)
- `PROXY_MODE` (`nginx`, `external`, or `none`)
- `TLS_MODE` (`none`, `custom`, or `letsencrypt`)

Mode-specific keys:

- `TRIPLESTORE_MODE=external` -> set `EXTERNAL_TRIPLESTORE_URL`
- `TLS_MODE=custom` -> set `CUSTOM_CERT_FULLCHAIN` and `CUSTOM_CERT_PRIVKEY`
- `TLS_MODE=letsencrypt` -> set `SSL_EMAIL`
- `PROXY_MODE=nginx` -> optional `NGINX_CLIENT_MAX_BODY_SIZE` (default `1g`, e.g. `2g`)

### Reverse Proxy and `TRUST_PROXY`

Set `TRUST_PROXY` to match your network path so Express correctly uses forwarded headers:

- unset/empty: default behavior (do not trust forwarded headers)
- `true` or `1`: trust proxy
- `false` or `0`: explicitly do not trust
- numeric value: trust that many proxy hops

When proxying (Nginx/F5/etc.), ensure these headers are passed:

- `X-Forwarded-For`
- `X-Forwarded-Proto`

If `PROXY_MODE=external`, disable bundled Nginx and configure your own proxy similarly.

### Day-2 Operations

```bash
./deploy.sh status
./deploy.sh logs
./deploy.sh restart
./deploy.sh down
./deploy.sh renew-certs
```

`renew-certs` is only valid with `PROXY_MODE=nginx` and `TLS_MODE=letsencrypt`.

### Upgrade an Already-Running Server

Upgrade in place so `config.env` stays where it is:

```bash
# from the server, while in the existing deploy directory
cd oxfordia-node-deploy
cp config.env config.env.backup

cd ..
wget https://github.com/OXFORDIA-project/OXFORDIA-node/releases/latest/download/oxfordia-node-deploy-latest.tar.gz
tar -xzf oxfordia-node-deploy-latest.tar.gz --strip-components=1 -C oxfordia-node-deploy

cd oxfordia-node-deploy
./deploy.sh up
```

Notes:

- `deploy.sh up` now auto-adds any missing config keys from `config.env.example` during upgrades.
- Keep `HOST_DATA_DIR` unchanged so existing pod data remains available.
- If needed, restore your backup with `cp config.env.backup config.env`, extract a previous release tarball, and run `./deploy.sh up`.

## For Users

### Access the App

- Open your pod URL (or `http://localhost:3000/` in local dev).
- Sign up and create your pod/account.
- Set an SSH key in the UI if you need Git-based integration workflows.

### Dev Data Locations

In local development, data is stored under `data/`, including:

- `data/.internal/integration-git`
- `data/.internal/integration-code`
- `data/.internal/integration-meta`
- `data/.internal/authorized_keys`

Example push target in dev:

```bash
git remote add origin ssh://git@localhost:2229/my_repo_name.git
git push -u origin main
```

## For Maintainers

### Monorepo Layout

- `server` (`@oxfordia/server`): Community Solid Server integration and API layer
- `ui` (`@oxfordia/ui`): React/Expo UI app
- `plugins` (`@oxfordia/plugins`): shared generated/schema types and plugin definitions

### Local Development

```bash
npm install
npm run dev
```

### Common Scripts

- `npm run dev` / `npm run dev:server` / `npm run dev:ui`
- `npm run build` / `npm run build:plugins` / `npm run build:server` / `npm run build:ui`
- `npm run graph`
- `npm run deploy:package`
- `npm run version:get`
- `npm run version:set <version>`
- `npm run version:bump <major|minor|patch|prerelease>`

### Release Artifacts

Pushes to `main` run `.github/workflows/release-deploy-package.yml` and publish:

- `oxfordia-node-deploy-latest.tar.gz`
- `oxfordia-node-deploy-<version>.tar.gz`

For a specific release:

```bash
wget https://github.com/OXFORDIA-project/OXFORDIA-node/releases/download/<tag>/oxfordia-node-deploy-<version>.tar.gz
```

### Deployment Services

- `node-app` (Community Solid Server)
- optional `triplestore` (bundled Blazegraph)
- optional `nginx`
- `certbot` (invoked by script for Let's Encrypt issue/renew)

## License

MIT
