#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PACKAGES=(
  "packages/solidauthr"
  "packages/oxfordiar"
  "packages/oxfordiar.data.nemaline"
  "packages/oxfordiar.data.legacynemaline"
  "packages/oxfordiar.stat.mean"
  "packages/oxfordiar.stat.kaplanmeier"
  "packages/oxfordiar.stat.count"
  "packages/oxfordiar.stat.standarddeviation"
)

DEPENDENT_PACKAGES=(
  "packages/oxfordiar.data.nemaline"
  "packages/oxfordiar.data.legacynemaline"
  "packages/oxfordiar.stat.mean"
  "packages/oxfordiar.stat.kaplanmeier"
  "packages/oxfordiar.stat.count"
  "packages/oxfordiar.stat.standarddeviation"
)

usage() {
  cat <<'EOF'
Usage: scripts/release-r.sh [get|set <version>|bump <major|minor|patch|dev>]

Commands:
  get                     Print the current shared R package version
  set <version>           Update all R package versions to <version>
  bump <type>             Bump the current version (major|minor|patch|dev)

Releases do not need this script locally: the publish workflows run
`set <version>` in CI before building (see .github/workflows/publish-r-packages.yml).
EOF
}

description_path() {
  printf "%s/%s\n" "$ROOT_DIR" "$1/DESCRIPTION"
}

current_version() {
  sed -n 's/^Version:[[:space:]]*//p' "$(description_path "packages/oxfordiar")" | head -n 1
}

validate_version() {
  local version="$1"
  if [[ ! "$version" =~ ^[0-9]+(\.[0-9]+)+$ ]]; then
    echo "Invalid R package version: $version" >&2
    exit 1
  fi
}

set_description_version() {
  local path="$1"
  local version="$2"
  perl -0pi -e "s/^Version:\\s*.*/Version: $version/m" "$path"
}

# Pins the dependency on <name> to (>= <version>). Dependencies sit on their
# own indented line under Imports:, which keeps the match away from the
# Package: line of e.g. oxfordiar.data.nemaline.
set_import_version() {
  local path="$1"
  local name="$2"
  local version="$3"
  perl -pi -e \
    "s/^(\\s+)\\Q$name\\E(?:\\s*\\(>=\\s*[^)]+\\))?(?=,?\\s*\$)/\\1$name (>= $version)/" \
    "$path"
}

set_version() {
  local version="$1"
  validate_version "$version"

  for package in "${PACKAGES[@]}"; do
    set_description_version "$(description_path "$package")" "$version"
  done

  set_import_version "$(description_path packages/oxfordiar)" solidauthr "$version"
  for package in "${DEPENDENT_PACKAGES[@]}"; do
    set_import_version "$(description_path "$package")" oxfordiar "$version"
  done

  echo "Updated Oxfordia R packages to version $version"
}

bump_version() {
  local current="$1"
  local bump_type="$2"

  validate_version "$current"

  IFS='.' read -r -a parts <<< "$current"
  if (( ${#parts[@]} < 3 )); then
    echo "Expected at least major.minor.patch in version: $current" >&2
    exit 1
  fi

  local major="${parts[0]}"
  local minor="${parts[1]}"
  local patch="${parts[2]}"

  case "$bump_type" in
    major)
      echo "$((major + 1)).0.0"
      ;;
    minor)
      echo "$major.$((minor + 1)).0"
      ;;
    patch)
      echo "$major.$minor.$((patch + 1))"
      ;;
    dev)
      if (( ${#parts[@]} >= 4 )); then
        echo "$major.$minor.$patch.$((parts[3] + 1))"
      else
        echo "$major.$minor.$patch.9000"
      fi
      ;;
    *)
      echo "Invalid bump type: $bump_type" >&2
      exit 1
      ;;
  esac
}

command="${1:-get}"

case "$command" in
  get)
    current_version
    ;;
  set)
    [[ $# -eq 2 ]] || { usage; exit 1; }
    set_version "$2"
    ;;
  bump)
    [[ $# -eq 2 ]] || { usage; exit 1; }
    new_version="$(bump_version "$(current_version)" "$2")"
    set_version "$new_version"
    echo "$new_version"
    ;;
  *)
    usage
    exit 1
    ;;
esac
