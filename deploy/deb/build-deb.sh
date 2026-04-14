#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
version="${VERSION:-$(node -p "require('${repo_root}/package.json').version")}"
arches="${ARCHES:-${ARCH:-amd64 arm64}}"
maintainer="${MAINTAINER:-OXFORDIA Project <opensource@oxfordia.org>}"

build_root="${repo_root}/build/deb"

download_node() {
  local target_arch="$1"
  local node_version node_arch node_dist archive_path extract_dir

  node_version="$(node -p "process.version")"

  case "${target_arch}" in
    amd64) node_arch="x64" ;;
    arm64) node_arch="arm64" ;;
    *)
      echo "Unsupported Debian architecture: ${target_arch}" >&2
      exit 1
      ;;
  esac

  node_dist="node-${node_version}-linux-${node_arch}"
  archive_path="${build_root}/${node_dist}.tar.xz"
  extract_dir="${build_root}/${node_dist}"

  if [ ! -f "${archive_path}" ]; then
    curl -fsSL "https://nodejs.org/dist/${node_version}/${node_dist}.tar.xz" -o "${archive_path}"
  fi

  if [ ! -x "${extract_dir}/bin/node" ]; then
    rm -rf "${extract_dir}"
    mkdir -p "${extract_dir}"
    tar -xJf "${archive_path}" -C "${extract_dir}" --strip-components=1
  fi

  printf '%s\n' "${extract_dir}/bin/node"
}

rm -rf "${build_root}"
mkdir -p "${build_root}"

(
  cd "${repo_root}"
  npm run build:server
  npm run build:ui

  test -f "${repo_root}/packages/pod-server/dist/components/context.jsonld"
  test -f "${repo_root}/packages/pod-server-core/templates/identity/password/create-login.html.ejs"
  test -f "${repo_root}/packages/pod-ui/dist-server/index.html"
)

for arch in ${arches}; do
  package_root="${build_root}/package-${arch}"
  runtime_root="${package_root}/opt/oxfordia-pod"
  output_path="${repo_root}/build/oxfordia-pod_${version}_${arch}.deb"
  node_binary="$(download_node "${arch}")"

  rm -rf "${package_root}"
  rm -f "${output_path}"

  (
    cd "${repo_root}"
    bash deploy/common/stage-runtime.sh "${runtime_root}"
  )

  mkdir -p "${runtime_root}/bin" "${package_root}/lib/systemd/system" "${package_root}/etc/default"
  cp "${node_binary}" "${runtime_root}/bin/node"
  install -m 0644 "${repo_root}/deploy/deb/oxfordia-pod.service" "${package_root}/lib/systemd/system/oxfordia-pod.service"
  install -m 0644 "${repo_root}/deploy/deb/oxfordia-pod.default" "${package_root}/etc/default/oxfordia-pod"

  fpm \
    -s dir \
    -t deb \
    -n oxfordia-pod \
    -v "${version}" \
    --architecture "${arch}" \
    --package "${output_path}" \
    --maintainer "${maintainer}" \
    --description "Oxfordia Pod Server - A Solid pod server built on Community Solid Server" \
    --license "MIT" \
    --url "https://github.com/OXFORDIA-project/OXFORDIA-node" \
    -d systemd \
    --config-files /etc/default/oxfordia-pod \
    --after-install "${repo_root}/deploy/deb/postinst" \
    --before-remove "${repo_root}/deploy/deb/prerm" \
    -C "${package_root}" \
    .
done
