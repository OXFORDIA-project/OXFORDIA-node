# OXFORDIA Pod

OXFORDIA (OXford Federation for Orchestrating Remote Data & International Analytics) Pod is a Solid Pod deployment for federated research data.

## For Deployers

OXFORDIA Pod ships in three release artifacts built from this monorepo:

- Docker image in GitHub Container Registry: `ghcr.io/<org>/pod-server:<tag>`
- Helm chart published from `deploy/helm/pod-server`
- Debian packages:
  - `oxfordia-pod_<version>_amd64.deb`
  - `oxfordia-pod_<version>_arm64.deb`
  - `oxfordia-pod-idp_<version>_amd64.deb`
  - `oxfordia-pod-idp_<version>_arm64.deb`

### Docker

The container preserves Community Solid Server's native startup interface. Pass standard CSS flags directly to the image entrypoint.

```bash
docker run --rm -p 3000:3000 \
  -e CSS_BASE_URL=http://localhost:3000/ \
  -e CSS_ROOT_FILE_PATH=/data \
  -e CSS_SPARQL_ENDPOINT=http://host.docker.internal:9999/blazegraph/sparql \
  -v "$PWD/data:/data" \
  ghcr.io/<org>/pod-server:<tag> \
  --showStackTrace
```

Notes:

- the server listens on port `3000`
- `GET /healthz` returns readiness/liveness status
- CSS flags such as `--baseUrl`, `--workers`, `--config`, and `--rootFilePath` pass through unchanged
- CSS environment variables such as `CSS_BASE_URL`, `CSS_CONFIG`, and `CSS_SPARQL_ENDPOINT` are supported directly

### Kubernetes With Helm

Add the chart repository and install with either `--set` flags or a values file:

```bash
helm repo add oxfordia https://your-org.github.io/pod-server
helm install my-pod oxfordia/pod-server \
  --set app.baseUrl=https://pod.example.org \
  --set triplestore.mode=external \
  --set triplestore.external.url=https://sparql.example.org/query \
  --set ingress.enabled=true \
  --set ingress.hostname=pod.example.org
```

Or:

```bash
helm install my-pod oxfordia/pod-server -f my-values.yaml
```

Important values:

- `image.repository`, `image.tag`: container image to deploy
- `app.baseUrl`: sets `CSS_BASE_URL`
- `app.trustProxy`: configures Express trust proxy handling
- `css.extraEnv`: pass additional CSS environment variables through directly
- `css.extraArgs`: append native CSS CLI arguments directly
- `triplestore.mode`: `external` or `managed`
- `persistence.*`: PVC configuration for pod data
- `ingress.*`: optional ingress and TLS configuration

### Debian Package

The Debian package installs only the application and systemd unit. It does not manage nginx, certbot, or a triplestore.

Release builds publish both `amd64` and `arm64` `.deb` artifacts.

Install and configure:

```bash
curl -LO https://github.com/OXFORDIA-project/OXFORDIA-node/releases/download/<tag>/oxfordia-pod_<version>_amd64.deb
sudo apt install ./oxfordia-pod_<version>_amd64.deb
sudo vim /etc/default/oxfordia-pod
sudo systemctl enable --now oxfordia-pod
sudo journalctl -u oxfordia-pod -f
```

Use the concrete release tag in the download URL, for example `v0.0.1-alpha.5`.
GitHub's `/releases/latest/download/...` path only follows the latest non-prerelease release, so it will not resolve alpha pre-releases reliably.

Wait until the log shows `Listening to server at http://localhost:3000/` before testing the port. The unit uses `Type=simple`, so `systemctl status oxfordia-pod` can report `active (running)` a few seconds before the HTTP listener is ready.

The package installs:

- application runtime in `/opt/oxfordia-pod`
- systemd unit at `/lib/systemd/system/oxfordia-pod.service`
- operator-managed env file at `/etc/default/oxfordia-pod`

### Optional Server Init Script

`oxfordia-pod-init.sh` is a separate release asset for interactive host setup after the `.deb` is installed. It can:

- write `/etc/default/oxfordia-pod`
- explicitly ask whether to install and configure local Blazegraph
- explicitly ask whether to install and configure nginx
- explicitly ask whether to configure SSL with certbot
- write a timestamped setup log to `/var/log/oxfordia-pod/init.log`

Certbot setup requires a public DNS hostname. It will not work for `localhost`, bare hostnames, or IP addresses.
On Debian 12, the `apt`-packaged Certbot can sometimes mask the real ACME failure as `AttributeError: can't set attribute`; when that happens, the init script now prints the tail of `/var/log/letsencrypt/letsencrypt.log` and retries once.

Usage:

```bash
curl -LO https://github.com/OXFORDIA-project/OXFORDIA-node/releases/download/<tag>/oxfordia-pod-init.sh
sudo bash oxfordia-pod-init.sh
```

### Identity Provider Debian Package

The repo also publishes a Debian package for the single-server Community Solid Server identity provider deployment in `packages/pod-idp`.

Install and configure:

```bash
curl -LO https://github.com/OXFORDIA-project/OXFORDIA-node/releases/download/<tag>/oxfordia-pod-idp_<version>_amd64.deb
sudo apt install ./oxfordia-pod-idp_<version>_amd64.deb
sudo vim /etc/default/oxfordia-pod-idp
sudo systemctl enable --now oxfordia-pod-idp
sudo journalctl -u oxfordia-pod-idp -f
```

The package installs:

- application runtime in `/opt/oxfordia-pod-idp`
- systemd unit at `/lib/systemd/system/oxfordia-pod-idp.service`
- operator-managed env file at `/etc/default/oxfordia-pod-idp`

`oxfordia-pod-idp-init.sh` is a separate release asset for reverse-proxy and TLS setup after the `.deb` is installed. It:

- writes `/etc/default/oxfordia-pod-idp`
- installs and configures `nginx`
- optionally configures SSL with certbot
- writes a timestamped setup log to `/var/log/oxfordia-pod-idp/init.log`

Usage:

```bash
curl -LO https://github.com/OXFORDIA-project/OXFORDIA-node/releases/download/<tag>/oxfordia-pod-idp-init.sh
sudo bash oxfordia-pod-idp-init.sh
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
- `packages/pod-idp`: single-server CSS identity-provider deployment and related operator assets

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
npm run dev:pods
```

Defaults:

- pod 1: `http://localhost:3100`
- pod 2: `http://localhost:3101`
- pod 3: `http://localhost:3102`
- all three default to the same SPARQL endpoint: `http://localhost:9999/blazegraph/sparql`

Override per-instance settings with env vars such as `PORT_1`, `BASE_URL_2`, `DATA_DIR_3`, or `SPARQL_ENDPOINT_1`.
If you want stronger triplestore isolation without multiple containers, point `SPARQL_ENDPOINT_1/2/3` at different SPARQL endpoints.

### Common Scripts

- `npm run dev` / `npm run dev:server` / `npm run dev:ui`
- `npm run dev:pods`
- `npm run build`
- `npm run build:server:types` / `npm run build:ui:types`
- `npm run build:docker`
- `npm run build:deb`
  By default this emits both `build/oxfordia-pod_<version>_amd64.deb` and `build/oxfordia-pod_<version>_arm64.deb`.
- `npm run build:deb:idp`
  This emits both `build/oxfordia-pod-idp_<version>_amd64.deb` and `build/oxfordia-pod-idp_<version>_arm64.deb`.
- `npm run test:deb`
- `npm run act:list`
- `npm run act:validate`
- `npm run act:next`
- `npm run act:release`
- `npm run graph`
- `npm run check:types`
- `npm run version:get`
- `npm run version:set <version>`
- `npm run version:bump <major|minor|patch|prerelease>`

### Debian Package Test Container

For manual Debian package debugging, start a systemd-capable Docker container with the local `build/` directory mounted in:

```bash
npm run test:deb
docker exec -it oxfordia-pod-deb-dev /bin/bash
```

Inside the container:

- `/workspace/debs` contains copied `.deb` files from the local `build/` directory
- `/workspace/build` contains the local build artifacts, including the generated `.deb`
- `/workspace/repo` contains the full checked-out repository
- `systemd` is available, so you can install the package and manage `oxfordia-pod` with `systemctl`

### Testing GitHub Actions Locally

[`act`](https://github.com/nektos/act) is configured for this repo with a checked-in [.actrc](/Users/jacksonmorgan/O/oxfordia-node/.actrc:1). On Apple Silicon it defaults to `linux/amd64`, which avoids the runner-architecture warning from `act`.

Create a local secrets file before running jobs that interact with GHCR or releases:

```bash
cp .secrets.act.example .secrets
vim .secrets
```

Useful commands:

```bash
npm run act:list
npm run act:validate
npm run act:next
npm run act:release
```

Notes:

- `act:validate` runs the `pull_request` validation job locally
- `act:next` simulates a push to the `next` branch using `.github/act/push-next.json`
- `act:release` simulates a tagged release push using `.github/act/push-tag.json`
- jobs that publish images or releases need a valid `GITHUB_TOKEN` in `.secrets`

### Release Artifacts

Tag pushes matching `v*` run `.github/workflows/release-deploy-package.yml` and publish:

- container image: `ghcr.io/<org>/pod-server:<tag>`
- Debian packages:
  - `oxfordia-pod_<version>_amd64.deb`
  - `oxfordia-pod_<version>_arm64.deb`
  - `oxfordia-pod-idp_<version>_amd64.deb`
  - `oxfordia-pod-idp_<version>_arm64.deb`
- init script: `oxfordia-pod-init.sh`
- idp init script: `oxfordia-pod-idp-init.sh`
- Helm chart from `deploy/helm/pod-server` via GitHub Pages

For a specific release:

```bash
wget https://github.com/OXFORDIA-project/OXFORDIA-node/releases/download/<tag>/oxfordia-pod_<version>_amd64.deb
```

### Deployment Services

- `pod-server` (Community Solid Server)
- optional external or managed triplestore
- optional `nginx`
- optional `certbot`

## License

MIT
