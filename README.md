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

- `packages/data-plugin_core`: shared data-plugin contract and graph-path shortcut helpers
- `packages/data-plugin_ui`: shared linked-data-browser UI contract for data plugins
- `packages/data-plugin-nemaline_core`: nemaline ShEx/LDO generation and shortcut catalog
- `packages/data-plugin-nemaline_ui`: nemaline resource view and CSV resource creator
- `packages/stat-plugin_core`: shared statistic-plugin contract plus common GraphPath/statistic-access-rule LDO assets
- `packages/stat-plugin_server`: server statistic-plugin contract and SPARQL helpers
- `packages/stat-plugin_ui`: statistic-plugin UI contract and graph-path editor helpers
- `packages/stat-plugin-mean_*`: mean statistic core/server/ui packages
- `packages/stat-plugin-kaplan-meier_*`: Kaplan-Meier statistic core/server/ui packages
- `packages/oxfordia-client`: R client for federated statistic queries using registered data/statistic plugins
- `packages/pod-server-core`: generic server wrapper that accepts injected plugins
- `packages/pod-server`: default server bundle with nemaline, mean, and Kaplan-Meier
- `packages/pod-ui-core`: generic UI wrapper that accepts injected plugin UIs
- `packages/pod-ui`: default UI bundle with nemaline, mean, and Kaplan-Meier

### Local Development

```bash
npm install
npm run dev
```

`npm run dev` now builds and watches the refactored package graph directly:

- `packages/pod-server` provides the CSS config, Components.js bundle, and server dev process
- `packages/pod-ui` produces the hosted `dist-server/` build served by CSS
- `_old/` is reference material only and is not part of the new dev flow

Run three pod servers in parallel with:

```bash
npm run dev:multiple
```

Defaults:

- pod 1: `http://localhost:3100`
- pod 2: `http://localhost:3101`
- pod 3: `http://localhost:3102`
- all three default to the same SPARQL endpoint: `http://localhost:8889/bigdata/sparql`

Override per-instance settings with env vars such as `PORT_1`, `BASE_URL_2`, `DATA_DIR_3`, or `SPARQL_ENDPOINT_1`.
If you want stronger triplestore isolation without multiple containers, point `SPARQL_ENDPOINT_1/2/3` at different Blazegraph namespaces in the same Blazegraph instance.

### Common Scripts

- `npm run dev` / `npm run dev:server` / `npm run dev:ui`
- `npm run dev:multiple`
- `npm run build`
- `npm run build:server:packages` / `npm run build:ui:packages`
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
