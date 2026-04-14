#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

PORT_1="${PORT_1:-3100}"
PORT_2="${PORT_2:-3101}"
PORT_3="${PORT_3:-3102}"

BASE_URL_1="${BASE_URL_1:-http://localhost:${PORT_1}}"
BASE_URL_2="${BASE_URL_2:-http://localhost:${PORT_2}}"
BASE_URL_3="${BASE_URL_3:-http://localhost:${PORT_3}}"

MULTI_SPARQL_ENDPOINT="${MULTI_SPARQL_ENDPOINT:-http://localhost:9999/blazegraph/sparql}"
SPARQL_ENDPOINT_1="${SPARQL_ENDPOINT_1:-$MULTI_SPARQL_ENDPOINT}"
SPARQL_ENDPOINT_2="${SPARQL_ENDPOINT_2:-$MULTI_SPARQL_ENDPOINT}"
SPARQL_ENDPOINT_3="${SPARQL_ENDPOINT_3:-$MULTI_SPARQL_ENDPOINT}"

DATA_DIR_1="${DATA_DIR_1:-$ROOT_DIR/data/multi/pod1}"
DATA_DIR_2="${DATA_DIR_2:-$ROOT_DIR/data/multi/pod2}"
DATA_DIR_3="${DATA_DIR_3:-$ROOT_DIR/data/multi/pod3}"

GIT_URI_1="${GIT_URI_1:-localhost:2229}"
GIT_URI_2="${GIT_URI_2:-localhost:2229}"
GIT_URI_3="${GIT_URI_3:-localhost:2229}"

mkdir -p "$DATA_DIR_1" "$DATA_DIR_2" "$DATA_DIR_3"

cat <<EOF
Starting 3 pod servers
  pod-1: ${BASE_URL_1}
    data:   ${DATA_DIR_1}
    sparql: ${SPARQL_ENDPOINT_1}
  pod-2: ${BASE_URL_2}
    data:   ${DATA_DIR_2}
    sparql: ${SPARQL_ENDPOINT_2}
  pod-3: ${BASE_URL_3}
    data:   ${DATA_DIR_3}
    sparql: ${SPARQL_ENDPOINT_3}

Override with:
  PORT_1/2/3
  BASE_URL_1/2/3
  DATA_DIR_1/2/3
  MULTI_SPARQL_ENDPOINT or SPARQL_ENDPOINT_1/2/3
  GIT_URI_1/2/3
EOF

exec concurrently -n server-types,pod-1,pod-2,pod-3 \
  "npm run watch:server:types" \
  "env PORT=${PORT_1} BASE_URL=${BASE_URL_1} DATA_DIR=${DATA_DIR_1} SPARQL_ENDPOINT=${SPARQL_ENDPOINT_1} GIT_URI=${GIT_URI_1} npm --prefix packages/pod-server run serve" \
  "env PORT=${PORT_2} BASE_URL=${BASE_URL_2} DATA_DIR=${DATA_DIR_2} SPARQL_ENDPOINT=${SPARQL_ENDPOINT_2} GIT_URI=${GIT_URI_2} npm --prefix packages/pod-server run serve" \
  "env PORT=${PORT_3} BASE_URL=${BASE_URL_3} DATA_DIR=${DATA_DIR_3} SPARQL_ENDPOINT=${SPARQL_ENDPOINT_3} GIT_URI=${GIT_URI_3} npm --prefix packages/pod-server run serve"
