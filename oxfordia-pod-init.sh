#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root."
  exit 1
fi

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

prompt() {
  local label="$1" default_value="$2" value
  read -r -p "${label} [${default_value}]: " value
  printf '%s\n' "${value:-$default_value}"
}

choose() {
  local label="$1" option_a="$2" option_b="$3" choice
  while :; do
    printf '%s\n1) %s\n2) %s\n> ' "${label}" "${option_a}" "${option_b}"
    read -r choice
    case "${choice}" in
      1) printf '1\n'; return ;;
      2) printf '2\n'; return ;;
    esac
  done
}

ensure_apt() {
  if [ "${APT_UPDATED}" -eq 0 ]; then
    apt-get update
    APT_UPDATED=1
  fi
  apt-get install -y "$@"
}

base_url="$(prompt "Public base URL" "${CSS_BASE_URL:-https://pod.example.org}")"
data_dir="$(prompt "Data directory" "${CSS_ROOT_FILE_PATH:-/var/lib/oxfordia-pod/data}")"
port="$(prompt "HTTP port" "${CSS_PORT:-3000}")"
workers="$(prompt "CSS workers (blank keeps CSS default)" "${CSS_WORKERS:-}")"
config_path="$(prompt "CSS config file" "${CSS_CONFIG:-/opt/oxfordia-pod/packages/pod-server/config/config.json}")"
host_name="$(printf '%s' "${base_url}" | sed -E 's#^[a-z]+://([^/:]+).*#\1#')"

triplestore_choice="$(choose "Triplestore" "Use an existing SPARQL endpoint" "Install and configure local Blazegraph")"
if [ "${triplestore_choice}" = "1" ]; then
  sparql_endpoint="$(prompt "SPARQL endpoint URL" "${CSS_SPARQL_ENDPOINT:-http://localhost:8889/bigdata/sparql}")"
else
  sparql_endpoint="http://127.0.0.1:8889/bigdata/sparql"
  ensure_apt openjdk-17-jre-headless curl
  install -d "${BLAZEGRAPH_DIR}"
  if [ ! -f "${BLAZEGRAPH_JAR}" ]; then
    curl -fsSL "https://repo1.maven.org/maven2/com/blazegraph/blazegraph-jar/2.1.6/blazegraph-jar-2.1.6.jar" -o "${BLAZEGRAPH_JAR}"
  fi
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
fi

proxy_choice="$(choose "Reverse proxy" "I already have a reverse proxy" "Set up nginx")"
tls_choice="1"
trust_proxy="false"
if [ "${proxy_choice}" = "2" ]; then
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
  tls_choice="$(choose "TLS" "Skip TLS here" "Set up Let's Encrypt with certbot")"
  if [ "${tls_choice}" = "2" ]; then
    ensure_apt certbot python3-certbot-nginx
    certbot --nginx -d "${host_name}"
  fi
fi

install -d -o oxfordia-pod -g oxfordia-pod "${data_dir}"

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

systemctl daemon-reload
systemctl enable --now oxfordia-pod
systemctl restart oxfordia-pod

echo "Oxfordia Pod Server is configured."
echo "Base URL: ${base_url}"
echo "Health check: ${base_url%/}/healthz"
