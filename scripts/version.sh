#!/usr/bin/env bash
set -euo pipefail

# Version management for OXFORDIA Pod.
#
# The release tag is the source of truth: release CI runs `set <tag>` before
# building, so every artifact carries the tag's version, then commits the
# stamped files back to main. These files hold the version:
#   - package.json / package-lock.json (root package)
#   - deploy/helm/pod-server/Chart.yaml (version and appVersion)
#
# Usage: ./scripts/version.sh [get | set <version> | bump <type> | check [<version>]]

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
chart_file="${repo_root}/deploy/helm/pod-server/Chart.yaml"
semver_re='^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'

get_version() {
    node -p "require('${repo_root}/package.json').version"
}

chart_field() {
    sed -n "s/^$1: *//p" "${chart_file}"
}

normalize() {
    local version="${1#v}"
    if [[ ! "${version}" =~ ${semver_re} ]]; then
        echo "Error: Invalid version: $1" >&2
        exit 1
    fi
    echo "${version}"
}

set_version() {
    local new_version
    new_version="$(normalize "$1")"

    (cd "${repo_root}" && VERSION="${new_version}" node -e '
const fs = require("fs");
const version = process.env.VERSION;
for (const file of ["package.json", "package-lock.json"]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  json.version = version;
  if (json.packages && json.packages[""]) json.packages[""].version = version;
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}')

    sed -i.bak \
        -e "s/^version: .*/version: ${new_version}/" \
        -e "s/^appVersion: .*/appVersion: ${new_version}/" \
        "${chart_file}"
    rm -f "${chart_file}.bak"

    echo "Version updated to: ${new_version}"
}

check_version() {
    local expected="${1:-}"
    local pkg lock chart_version chart_app status=0
    pkg="$(get_version)"
    lock="$(node -p "require('${repo_root}/package-lock.json').version")"
    chart_version="$(chart_field version)"
    chart_app="$(chart_field appVersion)"
    if [[ -n "${expected}" ]]; then
        expected="$(normalize "${expected}")"
    else
        expected="${pkg}"
    fi

    for entry in "package.json:${pkg}" "package-lock.json:${lock}" \
        "Chart.yaml version:${chart_version}" "Chart.yaml appVersion:${chart_app}"; do
        if [[ "${entry##*:}" != "${expected}" ]]; then
            echo "Version mismatch: ${entry%:*} is ${entry##*:}, expected ${expected}" >&2
            status=1
        fi
    done

    if [[ "${status}" -ne 0 ]]; then
        echo "Run: npm run version:set ${expected}" >&2
        exit 1
    fi
    echo "All versions are ${expected}"
}

bump_version() {
    local current_version bump_type="$1"
    current_version="$(get_version)"

    local major minor patch prerelease_version
    if [[ "$current_version" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)(-([a-zA-Z0-9.-]+))?$ ]]; then
        major="${BASH_REMATCH[1]}"
        minor="${BASH_REMATCH[2]}"
        patch="${BASH_REMATCH[3]}"
        prerelease_version="${BASH_REMATCH[5]}"
    else
        echo "Error: Invalid version format: $current_version" >&2
        exit 1
    fi

    local new_version
    case "$bump_type" in
        "major")
            new_version="$((major + 1)).0.0"
            ;;
        "minor")
            new_version="$major.$((minor + 1)).0"
            ;;
        "patch")
            new_version="$major.$minor.$((patch + 1))"
            ;;
        "prerelease")
            if [[ -n "$prerelease_version" ]]; then
                if [[ "$prerelease_version" =~ ^([a-zA-Z0-9.-]+)\.([0-9]+)$ ]]; then
                    new_version="$major.$minor.$patch-${BASH_REMATCH[1]}.$((BASH_REMATCH[2] + 1))"
                else
                    new_version="$major.$minor.$patch-$prerelease_version.1"
                fi
            else
                new_version="$major.$minor.$patch-alpha.0"
            fi
            ;;
        *)
            echo "Error: Invalid bump type. Use: major, minor, patch, or prerelease" >&2
            exit 1
            ;;
    esac

    set_version "$new_version"
}

case "${1:-get}" in
    "get")
        get_version
        ;;
    "set")
        if [[ -z "${2:-}" ]]; then
            echo "Usage: $0 set <version>" >&2
            exit 1
        fi
        set_version "$2"
        ;;
    "bump")
        if [[ -z "${2:-}" ]]; then
            echo "Usage: $0 bump <major|minor|patch|prerelease>" >&2
            exit 1
        fi
        bump_version "$2"
        ;;
    "check")
        check_version "${2:-}"
        ;;
    *)
        echo "Usage: $0 [get | set <version> | bump <type> | check [<version>]]"
        echo ""
        echo "Commands:"
        echo "  get                - Print the current version"
        echo "  set <version>      - Set the version everywhere (a leading v is stripped)"
        echo "  bump <type>        - Bump version (major|minor|patch|prerelease)"
        echo "  check [<version>]  - Fail if any file disagrees (with each other, or with <version>)"
        exit 1
        ;;
esac
