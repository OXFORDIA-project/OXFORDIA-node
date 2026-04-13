#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
image_name="${IMAGE_NAME:-oxfordia-pod-deb-test}"
container_name="${CONTAINER_NAME:-oxfordia-pod-deb-test-$$}"
base_image="${BASE_IMAGE:-ubuntu:24.04}"

cleanup() {
  docker rm -f "${container_name}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

require_cmd docker
require_cmd npm
require_cmd node

version="$(node -p "require('${repo_root}/package.json').version")"
deb_path="${repo_root}/build/oxfordia-pod_${version}_amd64.deb"

echo "Building Debian package..."
(
  cd "${repo_root}"
  npm run build:deb
)

if [[ ! -f "${deb_path}" ]]; then
  echo "Expected package was not created: ${deb_path}" >&2
  exit 1
fi

echo "Building Docker test image..."
docker build \
  --build-arg BASE_IMAGE="${base_image}" \
  -t "${image_name}" \
  -f - "${repo_root}" <<'EOF'
ARG BASE_IMAGE=ubuntu:24.04
FROM ${BASE_IMAGE}

ENV container=docker

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    dbus \
    procps \
    python3 \
    systemd \
    systemd-sysv \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
EOF

echo "Starting Docker test container..."
docker run -d \
  --privileged \
  --cgroupns=host \
  --name "${container_name}" \
  -v /sys/fs/cgroup:/sys/fs/cgroup:rw \
  "${image_name}" >/dev/null

echo "Waiting for systemd to become ready..."
for _ in $(seq 1 30); do
  if docker exec "${container_name}" systemctl is-system-running --wait >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! docker exec "${container_name}" systemctl status >/dev/null 2>&1; then
  echo "systemd did not become ready inside the test container" >&2
  docker logs "${container_name}" >&2 || true
  exit 1
fi

echo "Copying package into container..."
docker cp "${deb_path}" "${container_name}:/tmp/oxfordia-pod.deb"

echo "Starting mock SPARQL endpoint..."
docker exec "${container_name}" bash -lc "cat >/tmp/mock-sparql.py <<'PY'
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('content-length', '0'))
        if length:
            self.rfile.read(length)
        body = b'{\"head\":{},\"boolean\":true}'
        self.send_response(200)
        self.send_header('Content-Type', 'application/sparql-results+json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        return


HTTPServer(('127.0.0.1', 8889), Handler).serve_forever()
PY
nohup python3 /tmp/mock-sparql.py >/tmp/mock-sparql.log 2>&1 &"

echo "Installing package..."
docker exec "${container_name}" bash -lc "apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y /tmp/oxfordia-pod.deb"

echo "Configuring package environment..."
docker exec "${container_name}" bash -lc "cat >/etc/default/oxfordia-pod <<'EOF'
CSS_BASE_URL=http://localhost:3000/
CSS_CONFIG=/opt/oxfordia-pod/packages/pod-server/config/config.json
CSS_MAIN_MODULE_PATH=/opt/oxfordia-pod/packages/pod-server
CSS_ROOT_FILE_PATH=/var/lib/oxfordia-pod/data
CSS_PORT=3000
CSS_SPARQL_ENDPOINT=http://127.0.0.1:8889/bigdata/sparql
TRUST_PROXY=false
OXFORDIA_POD_ARGS=
EOF"

echo "Starting oxfordia-pod service..."
docker exec "${container_name}" systemctl enable --now oxfordia-pod

echo "Waiting for HTTP readiness..."
ready=0
for _ in $(seq 1 60); do
  if docker exec "${container_name}" curl -fsS http://127.0.0.1:3000/healthz >/tmp/oxfordia-pod-healthz.json 2>/dev/null; then
    ready=1
    break
  fi

  if ! docker exec "${container_name}" systemctl is-active --quiet oxfordia-pod; then
    echo "oxfordia-pod failed before becoming ready" >&2
    docker exec "${container_name}" journalctl -u oxfordia-pod --no-pager -n 200 >&2 || true
    exit 1
  fi

  sleep 1
done

if [[ "${ready}" -ne 1 ]]; then
  echo "Timed out waiting for oxfordia-pod readiness" >&2
  docker exec "${container_name}" journalctl -u oxfordia-pod --no-pager -n 200 >&2 || true
  exit 1
fi

healthz_output="$(docker exec "${container_name}" cat /tmp/oxfordia-pod-healthz.json)"
echo "healthz: ${healthz_output}"

if [[ "${healthz_output}" != *'"ok":true'* ]]; then
  echo "Unexpected readiness payload: ${healthz_output}" >&2
  docker exec "${container_name}" journalctl -u oxfordia-pod --no-pager -n 200 >&2 || true
  exit 1
fi

echo "Checking installed package contents..."
docker exec "${container_name}" test -f /opt/oxfordia-pod/packages/pod-server/dist/components/context.jsonld

echo "Debian package smoke test passed."
