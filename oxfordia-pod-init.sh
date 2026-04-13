#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/var/log/oxfordia-pod"
LOG_FILE="${LOG_DIR}/init.log"

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

log() {
  printf '[%s] %s\n' "$(timestamp)" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
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

if ! id -u oxfordia-pod >/dev/null 2>&1; then
  echo "Install the oxfordia-pod package before running this script."
  exit 1
fi

ENV_FILE="/etc/default/oxfordia-pod"
NGINX_SITE="/etc/nginx/sites-available/oxfordia-pod"
BLAZEGRAPH_UNIT="/lib/systemd/system/blazegraph.service"
BLAZEGRAPH_DIR="/opt/blazegraph"
BLAZEGRAPH_JAR="${BLAZEGRAPH_DIR}/blazegraph.jar"
APT_UPDATED=0

[ -f "${ENV_FILE}" ] && . "${ENV_FILE}"

log "Starting oxfordia-pod host initialization."
log "Log file: ${LOG_FILE}"

prompt() {
  local label="$1" default_value="$2" value
  read -r -p "${label} [${default_value}]: " value
  printf '%s\n' "${value:-$default_value}"
}

confirm() {
  local label="$1" default_value="$2" reply default_hint
  case "${default_value}" in
    y|Y|yes|YES) default_hint="Y/n" ;;
    *) default_hint="y/N" ;;
  esac

  while :; do
    read -r -p "${label} [${default_hint}]: " reply
    reply="${reply:-$default_value}"
    case "${reply}" in
      y|Y|yes|YES) printf 'yes\n'; return ;;
      n|N|no|NO) printf 'no\n'; return ;;
    esac
  done
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

base_url="$(prompt "Public base URL" "${CSS_BASE_URL:-https://pod.example.org}")"
data_dir="$(prompt "Data directory" "${CSS_ROOT_FILE_PATH:-/var/lib/oxfordia-pod/data}")"
port="$(prompt "HTTP port" "${CSS_PORT:-3000}")"
workers="$(prompt "CSS workers (blank keeps CSS default)" "${CSS_WORKERS:-}")"
config_path="$(prompt "CSS config file" "${CSS_CONFIG:-/opt/oxfordia-pod/packages/pod-server/config/config.json}")"
host_name="$(printf '%s' "${base_url}" | sed -E 's#^[a-z]+://([^/:]+).*#\1#')"

log "Collected base settings for host ${host_name}."

setup_nginx="$(confirm "Do you want nginx set up?" "n")"
setup_certbot="$(confirm "Do you want SSL configured via certbot?" "n")"
setup_blazegraph="$(confirm "Do you want Blazegraph set up?" "n")"

if [ "${setup_certbot}" = "yes" ] && [ "${setup_nginx}" != "yes" ]; then
  log "Certbot via nginx requires nginx. Enabling nginx setup automatically."
  setup_nginx="yes"
fi

if [ "${setup_blazegraph}" = "yes" ]; then
  log "Configuring local Blazegraph."
  sparql_endpoint="http://127.0.0.1:8889/bigdata/sparql"
  ensure_apt openjdk-17-jre-headless curl
  install -d -o oxfordia-pod -g oxfordia-pod "${BLAZEGRAPH_DIR}"
  if [ ! -f "${BLAZEGRAPH_JAR}" ]; then
    log "Downloading Blazegraph."
    curl -fsSL "https://repo1.maven.org/maven2/com/blazegraph/blazegraph-jar/2.1.6/blazegraph-jar-2.1.6.jar" -o "${BLAZEGRAPH_JAR}"
    chown oxfordia-pod:oxfordia-pod "${BLAZEGRAPH_JAR}"
  else
    log "Reusing existing Blazegraph jar at ${BLAZEGRAPH_JAR}."
  fi
  log "Writing Blazegraph systemd unit."
  install -d /lib/systemd/system
  cat > "${BLAZEGRAPH_UNIT}" <<EOF
[Unit]
Description=Blazegraph
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=oxfordia-pod
Group=oxfordia-pod
WorkingDirectory=${BLAZEGRAPH_DIR}
ExecStart=/usr/bin/java -server -Xms512m -Xmx1g -jar ${BLAZEGRAPH_JAR}
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable --now blazegraph
  log "Blazegraph is enabled and started."
else
  log "Using an external SPARQL endpoint."
  sparql_endpoint="$(prompt "SPARQL endpoint URL" "${CSS_SPARQL_ENDPOINT:-http://localhost:8889/bigdata/sparql}")"
fi

trust_proxy="false"
if [ "${setup_nginx}" = "yes" ]; then
  log "Configuring nginx reverse proxy."
  trust_proxy="true"
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
  ln -sfn "${NGINX_SITE}" /etc/nginx/sites-enabled/oxfordia-pod
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl enable --now nginx
  systemctl reload nginx
  log "nginx is enabled and reloaded."
  if [ "${setup_certbot}" = "yes" ]; then
    log "Configuring TLS with certbot for ${host_name}."
    ensure_apt certbot python3-certbot-nginx
    certbot --nginx -d "${host_name}"
    log "certbot configuration completed."
  fi
else
  log "Skipping nginx setup."
fi

if [ "${setup_certbot}" = "yes" ] && [ "${setup_nginx}" != "yes" ]; then
  fail "Certbot was requested without nginx, which should not be possible."
fi

log "Ensuring application data directory exists at ${data_dir}."
install -d -o oxfordia-pod -g oxfordia-pod "${data_dir}"

log "Writing environment configuration to ${ENV_FILE}."
cat > "${ENV_FILE}" <<EOF
# Managed by oxfordia-pod-init.sh. Re-run the script or edit manually.
CSS_BASE_URL=${base_url}
CSS_CONFIG=${config_path}
CSS_MAIN_MODULE_PATH=/opt/oxfordia-pod/packages/pod-server
CSS_ROOT_FILE_PATH=${data_dir}
CSS_PORT=${port}
CSS_SPARQL_ENDPOINT=${sparql_endpoint}
TRUST_PROXY=${trust_proxy}
OXFORDIA_POD_ARGS=
EOF

if [ -n "${workers}" ]; then
  printf 'CSS_WORKERS=%s\n' "${workers}" >> "${ENV_FILE}"
fi

log "Enabling and restarting oxfordia-pod service."
systemctl daemon-reload
systemctl enable --now oxfordia-pod
systemctl restart oxfordia-pod

log "Oxfordia Pod Server is configured."
log "Base URL: ${base_url}"
log "Health check: ${base_url%/}/healthz"
