#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
image_name="${IMAGE_NAME:-oxfordia-pod-deb-dev}"
container_name="${CONTAINER_NAME:-oxfordia-pod-deb-dev}"
base_image="${BASE_IMAGE:-ubuntu:24.04}"
build_dir="${repo_root}/build"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

require_cmd docker

if [[ ! -d "${build_dir}" ]]; then
  echo "Build directory not found: ${build_dir}" >&2
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
    bash \
    ca-certificates \
    curl \
    dbus \
    less \
    procps \
    systemd \
    systemd-sysv \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
EOF

if docker ps -a --format '{{.Names}}' | grep -Fx "${container_name}" >/dev/null 2>&1; then
  echo "Removing existing container ${container_name}..."
  docker rm -f "${container_name}" >/dev/null
fi

echo "Starting container ${container_name}..."
docker run -d \
  --privileged \
  --name "${container_name}" \
  --cgroupns=host \
  -v /sys/fs/cgroup:/sys/fs/cgroup:rw \
  -v "${build_dir}:/workspace/build" \
  -v "${repo_root}:/workspace/repo" \
  -w /workspace \
  "${image_name}" >/dev/null

echo "Waiting for systemd..."
for _ in $(seq 1 30); do
  if docker exec "${container_name}" systemctl is-system-running --wait >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! docker exec "${container_name}" systemctl status >/dev/null 2>&1; then
  echo "systemd did not become ready in ${container_name}" >&2
  exit 1
fi

echo "Copying Debian packages into container..."
docker exec "${container_name}" mkdir -p /workspace/debs
if find "${build_dir}" -maxdepth 1 -type f -name '*.deb' | grep -q .; then
  docker exec "${container_name}" bash -lc 'cp /workspace/build/*.deb /workspace/debs/'
fi

echo
echo "Container is ready."
echo "Mounted paths:"
echo "  /workspace/build -> ${build_dir}"
echo "  /workspace/repo  -> ${repo_root}"
echo
echo "Copied package files:"
echo "  /workspace/debs"
echo
echo "Open a shell with:"
echo "  docker exec -it ${container_name} /bin/bash"
echo
echo "systemd is available inside the container."
