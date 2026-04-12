#!/usr/bin/env bash
set -euo pipefail

dest_dir="${1:?destination directory is required}"

rm -rf "${dest_dir}"
mkdir -p "${dest_dir}/packages"

cp package.json "${dest_dir}/package.json"
cp -R node_modules "${dest_dir}/node_modules"
cp docker/entrypoint.sh "${dest_dir}/entrypoint.sh"
chmod 0755 "${dest_dir}/entrypoint.sh"

for package_dir in packages/*; do
  [ -d "${package_dir}" ] || continue
  [ -f "${package_dir}/package.json" ] || continue

  target_dir="${dest_dir}/${package_dir}"
  mkdir -p "${target_dir}"
  cp "${package_dir}/package.json" "${target_dir}/package.json"

  for asset in config dist dist-server; do
    if [ -e "${package_dir}/${asset}" ]; then
      cp -R "${package_dir}/${asset}" "${target_dir}/${asset}"
    fi
  done
done
