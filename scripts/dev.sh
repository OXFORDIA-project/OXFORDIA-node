#!/usr/bin/env bash

# Local development: pod-server + live pod-ui (Metro with Fast Refresh) behind one origin.
#
#   browser -> dev-proxy :PORT ─┬─> pod-server (CSS) :SERVER_PORT   (BASE_URL = proxy URL)
#                               └─> Metro dev server :METRO_PORT    (bundle, HMR, /.ui-static/)
#
# - types:      one incremental `tsc -b --watch` over the whole monorepo. Server packages
#               run from its dist/ output; the UI only uses it for type errors.
# - components: regenerates pod-server's Components.js definitions when its src/ changes.
# - server:     nodemon restarts CSS when server-side dist/ output or config changes.
# - ui:         Metro bundles pod-ui and all @oxfordia/* UI packages straight from src/.
#
# `scripts/dev.sh server` runs only the server side: CSS directly on PORT with the static
# pod-ui build (dist-server), no Metro and no proxy. Use it for API/plugin work.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

MODE="${1:-all}"

export PORT="${PORT:-3000}"
export SERVER_PORT="${SERVER_PORT:-3001}"
export METRO_PORT="${METRO_PORT:-8081}"
BASE_URL="${BASE_URL:-http://localhost:${PORT}}"

# Incremental: near-instant when dist/ is already up to date.
echo "Building server packages (incremental)..."
npx tsc -b packages/pod-server/tsconfig.json --pretty false
npm --prefix packages/pod-server run --silent build:components

COMPONENTS_CMD="npm --prefix packages/pod-server run dev:components"

case "$MODE" in
  all)
    printf '\nPod: %s\n     (pod-server on :%s, Metro on :%s; open the URL above, not these)\n\n' \
      "$BASE_URL" "$SERVER_PORT" "$METRO_PORT"
    exec npx concurrently -k -n types,components,server,ui,proxy \
      "tsc -b --watch --preserveWatchOutput" \
      "$COMPONENTS_CMD" \
      "env PORT=${SERVER_PORT} BASE_URL=${BASE_URL} CONFIG=./config/config.dev.json npm --prefix packages/pod-server run dev" \
      "npm --prefix packages/pod-ui run dev" \
      "node scripts/dev-proxy.js"
    ;;
  server)
    if [ ! -f packages/pod-ui/dist-server/index.html ]; then
      echo "Note: packages/pod-ui/dist-server is missing; run 'npm run build:ui' for the static UI." >&2
    fi
    printf '\nPod: %s  (static UI from packages/pod-ui/dist-server)\n\n' "$BASE_URL"
    exec npx concurrently -k -n server-types,components,server \
      "tsc -b packages/pod-server/tsconfig.json --watch --preserveWatchOutput" \
      "$COMPONENTS_CMD" \
      "env PORT=${PORT} BASE_URL=${BASE_URL} npm --prefix packages/pod-server run dev"
    ;;
  *)
    echo "Usage: $0 [all|server]" >&2
    exit 1
    ;;
esac
