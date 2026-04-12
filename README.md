# OXFORDIA Pod

OXFORDIA (OXford Federation for Orchestrating Remote Data & International Analytics) Pod is a Solid Pod deployment for federated research data.

## For Deployers

// TODO: fill this in after deploying.

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
