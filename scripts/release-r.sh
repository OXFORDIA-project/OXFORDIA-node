#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PACKAGES=(
  "packages/oxfordiar"
  "packages/oxfordiar.data.nemaline"
  "packages/oxfordiar.stat.mean"
  "packages/oxfordiar.stat.kaplanmeier"
)

DEPENDENT_PACKAGES=(
  "packages/oxfordiar.data.nemaline"
  "packages/oxfordiar.stat.mean"
  "packages/oxfordiar.stat.kaplanmeier"
)

TAG_PREFIX="r-v"

usage() {
  cat <<'EOF'
Usage: scripts/release-r.sh [get|set <version>|bump <major|minor|patch|dev>|tag [version]|release <version>]

Commands:
  get                     Print the current shared R package version
  set <version>           Update all R package versions to <version>
  bump <type>             Bump the current version (major|minor|patch|dev)
  tag [version]           Create annotated git tag r-v<version>
  release <version>       Update all versions and create annotated git tag r-v<version>
EOF
}

description_path() {
  printf "%s/%s\n" "$ROOT_DIR" "$1/DESCRIPTION"
}

current_version() {
  sed -n 's/^Version:[[:space:]]*//p' "$(description_path "${PACKAGES[0]}")" | head -n 1
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

set_oxfordiar_import_version() {
  local path="$1"
  local version="$2"
  perl -0pi -e \
    "s/oxfordiar(?:\\s*\\(>=\\s*[^)]+\\))?/oxfordiar (>= $version)/g" \
    "$path"
}

set_version() {
  local version="$1"
  validate_version "$version"

  for package in "${PACKAGES[@]}"; do
    set_description_version "$(description_path "$package")" "$version"
  done

  for package in "${DEPENDENT_PACKAGES[@]}"; do
    set_oxfordiar_import_version "$(description_path "$package")" "$version"
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

create_tag() {
  local version="$1"
  local tag="${TAG_PREFIX}${version}"

  if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
    echo "Tag already exists: $tag" >&2
    exit 1
  fi

  git tag -a "$tag" -m "Oxfordia R release $version"
  echo "Created tag $tag"
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
  tag)
    if [[ $# -eq 2 ]]; then
      validate_version "$2"
      create_tag "$2"
    elif [[ $# -eq 1 ]]; then
      create_tag "$(current_version)"
    else
      usage
      exit 1
    fi
    ;;
  release)
    [[ $# -eq 2 ]] || { usage; exit 1; }
    set_version "$2"
    create_tag "$2"
    ;;
  *)
    usage
    exit 1
    ;;
esac
