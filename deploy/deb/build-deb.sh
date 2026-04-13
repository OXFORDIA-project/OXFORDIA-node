#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
version="${VERSION:-$(node -p "require('${repo_root}/package.json').version")}"
arch="${ARCH:-amd64}"
maintainer="${MAINTAINER:-OXFORDIA Project <opensource@oxfordia.org>}"

build_root="${repo_root}/build/deb"
package_root="${build_root}/package"
runtime_root="${package_root}/opt/oxfordia-pod"
output_path="${repo_root}/build/oxfordia-pod_${version}_${arch}.deb"

rm -rf "${build_root}"

(
  cd "${repo_root}"
  npm run build:server
  npm run build:ui

  test -f "${repo_root}/packages/pod-server/dist/components/context.jsonld"
  test -f "${repo_root}/packages/pod-ui/dist-server/index.html"

  bash deploy/common/stage-runtime.sh "${runtime_root}"
)

mkdir -p "${runtime_root}/bin" "${package_root}/lib/systemd/system" "${package_root}/etc/default"
cp "$(command -v node)" "${runtime_root}/bin/node"
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
