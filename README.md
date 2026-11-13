# OXFORDIA Pod

OXFORDIA (OXford Federation for Orchestrating Remote Data & International Analytics) Pod is a Solid Pod deployment for federated research data.

## For Deployers

OXFORDIA Pod ships in three release artifacts built from this monorepo:

- Docker image in GitHub Container Registry (amd64 / arm64): `ghcr.io/oxfordia-project/oxfordia-node:<tag>`
- Helm chart published from `deploy/helm/pod-server`
- Debian packages:
  - `oxfordia-pod_<version>_amd64.deb`
  - `oxfordia-pod_<version>_arm64.deb`
  - `oxfordia-pod-idp_<version>_amd64.deb`
  - `oxfordia-pod-idp_<version>_arm64.deb`

### Docker

The container preserves Community Solid Server's native startup interface. Configure it with `CSS_*` environment variables, or pass standard CSS flags directly to the image entrypoint.

```bash
docker run -d -p 3000:3000 \
  -e CSS_BASE_URL=https://pod.example.org/ \
  -e CSS_SPARQL_ENDPOINT=https://sparql.example.org/bigdata/sparql \
  -v oxfordia-data:/var/lib/oxfordia-pod/data \
  ghcr.io/oxfordia-project/oxfordia-node:latest
```

Tags: `<version>` and `latest` for releases, `0.0.0-next.<sha>` and `next` for pre-releases from the `next` branch.

| Variable | Default | Description |
|---|---|---|
| `CSS_BASE_URL` | `http://localhost:3000/` | Public URL of the node, with trailing slash |
| `CSS_SPARQL_ENDPOINT` | — | SPARQL endpoint that stores pod data (required) |
| `CSS_ROOT_FILE_PATH` | `/var/lib/oxfordia-pod/data` | Internal pod state (accounts, ACLs, `.internal/`) |
| `CSS_PORT` | `3000` | Port the server listens on inside the container |
| `TRUST_PROXY` | unset | Set to `true` behind a TLS-terminating reverse proxy |

Notes:

- mount a volume at `/var/lib/oxfordia-pod/data`; it must be writable by uid `10001`
- terminate TLS in a reverse proxy in front of the container; `CSS_BASE_URL` must be the public `https://` URL
- `GET /healthz` returns `200` when the server is up and the SPARQL endpoint answers, `503` otherwise; the image's Docker `HEALTHCHECK` uses it
- CSS flags such as `--baseUrl`, `--workers`, `--config`, and `--rootFilePath` pass through unchanged
- any other CSS environment variable (e.g. `CSS_LOGGING_LEVEL`, `CSS_WORKERS`) is supported directly

### Kubernetes With Helm

Add the chart repository and install with either `--set` flags or a values file:

```bash
helm repo add oxfordia https://oxfordia-project.github.io/OXFORDIA-node
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

- `image.repository`, `image.tag`: container image to deploy (`image.tag` defaults to the chart `appVersion`)
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
- `packages/data-plugin-nemaline_core`: nemaline pilot-analysis ShEx/LDO generation and shortcut catalog
- `packages/data-plugin-nemaline_ui`: nemaline pilot-analysis resource view and CSV resource creator
- `packages/data-plugin-legacy-nemaline_*`: the original nemaline data plugin (schema name `legacy-nemaline`)
- `packages/stat-plugin_core`: shared statistic-plugin contract plus common GraphPath/statistic-access-rule LDO assets
- `packages/stat-plugin_server`: server statistic-plugin contract and SPARQL helpers
- `packages/stat-plugin_ui`: statistic-plugin UI contract and graph-path editor helpers
- `packages/stat-plugin-mean_*`: mean statistic core/server/ui packages
- `packages/stat-plugin-kaplan-meier_*`: Kaplan-Meier statistic core/server/ui packages
- `packages/oxfordia-client`: R client for federated statistic queries using registered data/statistic plugins
- `packages/pod-server-core`: generic server wrapper that accepts injected plugins
- `packages/pod-server`: default server bundle with nemaline, legacy nemaline, mean, and Kaplan-Meier
- `packages/pod-ui-core`: generic UI wrapper that accepts injected plugin UIs
- `packages/pod-ui`: default UI bundle with nemaline, legacy nemaline, angelman, mean, and Kaplan-Meier
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
- `npm run version:check [<version>]`

The release tag is the source of truth for versions. Release CI stamps the tag's version into `package.json`, `package-lock.json` and the Helm `Chart.yaml` before building every artifact, then commits those files back to `main`. Pushes to `next` fail early if those files disagree.

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

### Cutting a Release

Releases are built entirely by GitHub Actions from a GitHub release. You never edit version numbers by hand: the tag you create is the version, and CI stamps it into every artifact and commits it back to `main`.

**One-time repository setup** (skip if already done):

1. **Settings → Actions → General → Workflow permissions:** select *Read and write permissions*. The workflows push to `gh-pages` and `main` and publish to GHCR.
2. **Settings → Pages:** source *Deploy from a branch*, branch `gh-pages`, folder `/ (root)`. This serves the Helm repository.
3. If `main` has branch protection, allow `github-actions[bot]` to push to it, or the version sync job fails.
4. After the first image is published, open the `oxfordia-node` package (repository → Packages) → *Package settings* → *Change visibility* → **Public**. New GHCR packages start private.

**To release:**

1. Make sure everything you want to ship is merged to `main`, and that the latest push to `next` produced a working pre-release (Actions → *Publish Pre-Release*).
2. Pick the version. Check the current one with `npm run version:get`, and follow semver (`0.0.1-alpha.8`, `0.1.0`, `1.0.0`, …).
3. On GitHub, go to **Releases → Draft a new release**.
4. **Choose a tag** → type `v<version>` (e.g. `v0.0.1-alpha.8`) → *Create new tag on publish*. Target: `main`.
5. Set the title (usually the tag) and write release notes, or click *Generate release notes*.
6. Leave **Set as a pre-release unchecked**, even for `alpha`/`beta` versions. The release workflow skips releases marked as pre-releases; those are reserved for the automated builds from `next`.
7. Leave **Set as the latest release** checked, then click **Publish release**.
8. Watch **Actions → Publish Release**. Expect about 10–20 minutes: the `.deb` builds take ~4 minutes, while the Docker build (slowest on the first run, before its cache exists) and the wait for GitHub Pages take the rest. The workflow:
   - builds the four `.deb` packages and the multi-arch Docker image (smoke-tested before tagging)
   - attaches the `.deb`s, their unversioned copies, the init scripts and the Helm chart to the release
   - publishes the Helm index to `gh-pages` and checks that `helm pull` works
   - commits the new version to `package.json`, `package-lock.json` and `Chart.yaml` on `main`
9. Pull `main` afterwards to pick up the version commit.

**Verify the release:**

```bash
docker pull ghcr.io/oxfordia-project/oxfordia-node:<version>
helm repo add oxfordia https://oxfordia-project.github.io/OXFORDIA-node && helm repo update
helm search repo oxfordia/pod-server --versions | head -3
curl -sIL https://github.com/OXFORDIA-project/OXFORDIA-node/releases/latest/download/oxfordia-pod_amd64.deb | grep -i "^http"
```

**If a job fails:** fix the cause on `main`, then re-run the failed jobs from the workflow run page (*Re-run failed jobs*). Every step is safe to re-run. If the fix needs code changes, delete the release *and* its tag, then create the release again from step 3 so the tag points at the fixed commit. If only the image needs rebuilding, run **Actions → Publish Docker Image** manually with the release tag.

### Release Artifacts

Publishing a GitHub release runs `.github/workflows/publish-release.yml` and publishes:

- container image (amd64 / arm64): `ghcr.io/oxfordia-project/oxfordia-node:<version>` and `:latest`, via `.github/workflows/publish-docker-image.yml`
- Debian packages:
  - `oxfordia-pod_<version>_amd64.deb`
  - `oxfordia-pod_<version>_arm64.deb`
  - `oxfordia-pod-idp_<version>_amd64.deb`
  - `oxfordia-pod-idp_<version>_arm64.deb`
- unversioned copies of each `.deb` (`oxfordia-pod_<arch>.deb`, `oxfordia-pod-idp_<arch>.deb`), so `releases/latest/download/<name>` always resolves to the newest release
- init script: `oxfordia-pod-init.sh`
- idp init script: `oxfordia-pod-idp-init.sh`
- Helm chart `pod-server-<version>.tgz`, indexed in the Helm repository at `https://oxfordia-project.github.io/OXFORDIA-node` (`index.yaml` on the `gh-pages` branch)

Pushes to `next` publish the same set as a pre-release, plus the `next` image tag.

To republish an image for an existing release tag, run the **Publish Docker Image** workflow manually from the Actions tab.

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
