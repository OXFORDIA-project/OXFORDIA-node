# SetMeld Pod Deployment

This deployment package is designed for a simple workflow:

1. Edit one config file (`config.env`)
2. Run one script (`./deploy.sh up`)

No manual Docker profile selection, no chmod steps, and no in-container Nginx template logic.

## Quick Start

```bash
tar -xzf fedresda-node-deploy-*.tar.gz
cd fedresda-node-deploy
./deploy.sh init
# edit config.env
./deploy.sh up
```

## Configuration Model

All options live in `config.env`. Key switches:

- `TRIPLESTORE_MODE=bundled|external`
- `PROXY_MODE=nginx|external|none`
- `TLS_MODE=none|custom|letsencrypt` (only when `PROXY_MODE=nginx`)

### Triplestore

- `bundled`: deploy bundled Blazegraph and wire app automatically.
- `external`: set `EXTERNAL_TRIPLESTORE_URL` to your SPARQL endpoint.

### Proxy

- `nginx`: deploy bundled Nginx.
- `external`: do not run Nginx; use your own reverse proxy.
- `none`: no proxy; app is exposed directly on `NODE_HOST_PORT`.

### TLS

- `none`: HTTP only.
- `custom`: set `CUSTOM_CERT_FULLCHAIN` and `CUSTOM_CERT_PRIVKEY` to existing host PEM files.
- `letsencrypt`: set `SSL_EMAIL`; script uses certbot and writes certs under `nginx/letsencrypt`.

## Operational Commands

```bash
./deploy.sh up
./deploy.sh down
./deploy.sh restart
./deploy.sh status
./deploy.sh logs
./deploy.sh renew-certs
```

## Upgrade Flow

Upgrade in place so your `config.env` stays in the same directory:

```bash
cd fedresda-node-deploy
cp config.env config.env.backup

cd ..
wget https://github.com/SetMeld/fedresda-node/releases/latest/download/fedresda-node-deploy-latest.tar.gz
tar -xzf fedresda-node-deploy-latest.tar.gz --strip-components=1 -C fedresda-node-deploy

cd fedresda-node-deploy
./deploy.sh up
```

Notes:

- `./deploy.sh up` auto-adds newly introduced config keys from `config.env.example`.
- Keep `HOST_DATA_DIR` unchanged to preserve existing pod data.
- If needed, restore your backup with `cp config.env.backup config.env`, extract a previous release tarball, and run `./deploy.sh up`.

## Architecture

- `node-app`: Community Solid Server app container.
- `triplestore`: optional bundled Blazegraph (`TRIPLESTORE_MODE=bundled`).
- `nginx`: optional bundled reverse proxy (`PROXY_MODE=nginx`).
- `certbot`: invoked by `deploy.sh` for Let's Encrypt issue/renew.
