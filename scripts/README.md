# Scripts Directory

Scripts used by the OXFORDIA Pod project.

## Scripts

- **`create-deploy-package.js`** — Builds the Docker Compose deployment tarball. Run `npm run deploy:package` (which runs `npm run build` then this script). Produces `build/oxfordia-node-deploy-<version>.tar.gz`.
- **`dev-multiple.sh`** — Starts three pod servers in parallel for local federation testing. Run `npm run dev:pods`.
- **`version.sh`** — Version management: get/set/bump/check the version in `package.json`, `package-lock.json` and the Helm `Chart.yaml`. Release CI runs `set <tag>` so every artifact matches the release tag.

## Usage

```bash
# Create the deployment package (build + tarball)
npm run deploy:package

# Run three pod servers in parallel
npm run dev:pods

# Version
npm run version:get
npm run version:set 1.0.0
npm run version:bump patch
npm run version:check
```

Deployment is done by extracting the tarball and using Docker Compose; see [deploy/README.md](../deploy/README.md).
