# Scripts Directory

Scripts used by the OXFORDIA Pod project.

## Scripts

- **`create-deploy-package.js`** — Builds the Docker Compose deployment tarball. Run `npm run deploy:package` (which runs `npm run build` then this script). Produces `build/oxfordia-node-deploy-<version>.tar.gz`.
- **`dev-multiple.sh`** — Starts three pod servers in parallel for local federation testing. Run `npm run dev:pods`.
- **`version.sh`** — Version management: get/set/bump version in `version.json` and `package.json`, and sync dependency URLs in config.

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
```

Deployment is done by extracting the tarball and using Docker Compose; see [deploy/README.md](../deploy/README.md).
