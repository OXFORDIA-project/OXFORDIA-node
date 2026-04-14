#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/var/log/oxfordia-pod-idp"
LOG_FILE="${LOG_DIR}/init.log"

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

log() {
  printf '[%s] %s\n' "$(timestamp)" "$*"
}

tty_prompt() {
  local prompt_text="$1" value

  if [ -r /dev/tty ] && [ -w /dev/tty ]; then
    printf '%s' "${prompt_text}" > /dev/tty
    IFS= read -r value < /dev/tty
  else
    read -r -p "${prompt_text}" value
  fi

  printf '%s\n' "${value}"
}

on_error() {
  local exit_code=$?
  log "ERROR: Initialization failed at line ${BASH_LINENO[0]} with exit code ${exit_code}."
  exit "${exit_code}"
}

trap on_error ERR

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root."
  exit 1
fi

mkdir -p "${LOG_DIR}"
touch "${LOG_FILE}"
chmod 0644 "${LOG_FILE}"

exec > >(tee -a "${LOG_FILE}") 2>&1

if ! id -u oxfordia-pod-idp >/dev/null 2>&1; then
  echo "Install the oxfordia-pod-idp package before running this script."
  exit 1
fi

ENV_FILE="/etc/default/oxfordia-pod-idp"
NGINX_SITE="/etc/nginx/sites-available/oxfordia-pod-idp"
APT_UPDATED=0

[ -f "${ENV_FILE}" ] && . "${ENV_FILE}"

log "Starting oxfordia-pod-idp host initialization."
log "Log file: ${LOG_FILE}"

prompt() {
  local label="$1" default_value="$2" value
  value="$(tty_prompt "${label} [${default_value}]: ")"
  printf '%s\n' "${value:-$default_value}"
}

confirm() {
  local label="$1" default_value="$2" reply default_hint
  case "${default_value}" in
    y|Y|yes|YES) default_hint="Y/n" ;;
    *) default_hint="y/N" ;;
  esac

  while :; do
    reply="$(tty_prompt "${label} [${default_hint}]: ")"
    reply="${reply:-$default_value}"
    case "${reply}" in
      y|Y|yes|YES) printf 'yes\n'; return ;;
      n|N|no|NO) printf 'no\n'; return ;;
      *)
        if [ -w /dev/tty ]; then
          printf 'Please answer yes or no.\n' > /dev/tty
        else
          printf 'Please answer yes or no.\n' >&2
        fi
        ;;
    esac
  done
}

require_public_certbot_host() {
  if [[ "${host_name}" == "localhost" || "${host_name}" == "localhost.localdomain" || "${host_name}" != *.* || "${host_name}" =~ ^[0-9.]+$ || "${host_name}" == *:* ]]; then
    log "ERROR: Certbot requires a public DNS hostname. '${host_name}' is not valid for Let's Encrypt."
    exit 1
  fi
}

run_certbot() {
  certbot --nginx --force-interactive -d "${host_name}" < /dev/tty > /dev/tty 2>&1
}

show_certbot_log_hint() {
  if [ -f /var/log/letsencrypt/letsencrypt.log ]; then
    log "Showing the last 60 lines from /var/log/letsencrypt/letsencrypt.log."
    tail -n 60 /var/log/letsencrypt/letsencrypt.log > /dev/tty || true
  fi
}

ensure_apt() {
  if [ "${APT_UPDATED}" -eq 0 ]; then
    log "Refreshing apt package index."
    apt-get update
    APT_UPDATED=1
  fi
  log "Installing apt packages: $*"
  apt-get install -y "$@"
}

base_url="$(prompt "Public base URL" "${CSS_BASE_URL:-https://idp.example.org/}")"
port="$(prompt "HTTP port" "${CSS_PORT:-3300}")"
data_dir="${CSS_ROOT_FILE_PATH:-/var/lib/oxfordia-pod-idp/data}"
host_name="$(printf '%s' "${base_url}" | sed -E 's#^[a-z]+://([^/:]+).*#\1#')"
setup_certbot="$(confirm "Do you want SSL configured via certbot?" "y")"

log "Collected base settings for host ${host_name}."

log "Configuring nginx reverse proxy."
ensure_apt nginx
cat > "${NGINX_SITE}" <<EOF
server {
    listen 80;
    server_name ${host_name};

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
    }
}
EOF
ln -sfn "${NGINX_SITE}" /etc/nginx/sites-enabled/oxfordia-pod-idp
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx
systemctl reload nginx
log "nginx is enabled and reloaded."

if [ "${setup_certbot}" = "yes" ]; then
  log "Configuring TLS with certbot for ${host_name}."
  require_public_certbot_host
  if [ ! -r /dev/tty ] || [ ! -w /dev/tty ]; then
    log "ERROR: Certbot requires an interactive terminal. Re-run oxfordia-pod-idp-init.sh from a shell."
    exit 1
  fi
  ensure_apt certbot python3-certbot-nginx
  if ! run_certbot; then
    log "certbot failed."
    if grep -q "AttributeError: can't set attribute" /var/log/letsencrypt/letsencrypt.log 2>/dev/null; then
      log "Debian 12's certbot package can hide the real ACME error behind 'AttributeError: can't set attribute'."
      show_certbot_log_hint
      log "Retrying certbot once."
      run_certbot || {
        log "certbot failed again after retry."
        show_certbot_log_hint
        exit 1
      }
    else
      show_certbot_log_hint
      exit 1
    fi
  fi
  log "certbot configuration completed."
else
  log "Skipping certbot setup."
fi

log "Ensuring application data directory exists at ${data_dir}."
install -d -o oxfordia-pod-idp -g oxfordia-pod-idp "${data_dir}"

log "Writing environment configuration to ${ENV_FILE}."
cat > "${ENV_FILE}" <<EOF
# Managed by oxfordia-pod-idp-init.sh. Re-run the script or edit manually.
CSS_BASE_URL=${base_url}
CSS_CONFIG=/opt/oxfordia-pod-idp/packages/pod-idp/config/css-idp.json
CSS_ROOT_FILE_PATH=${data_dir}
CSS_PORT=${port}
TRUST_PROXY=true
CSS_LOGGING_LEVEL=${CSS_LOGGING_LEVEL:-info}
OXFORDIA_POD_IDP_ARGS=
EOF

log "Enabling and restarting oxfordia-pod-idp service."
systemctl enable oxfordia-pod-idp
systemctl restart oxfordia-pod-idp

log "Oxfordia Pod IDP is configured."
log "Base URL: ${base_url}"
log "Discovery document: ${base_url%/}/.well-known/openid-configuration"
