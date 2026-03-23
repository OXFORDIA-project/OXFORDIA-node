#!/bin/sh

set -eu

CONFIG_FILE="${CONFIG_FILE:-./config.env}"
GENERATED_ENV="./.env.generated"
NGINX_GENERATED_CONF="./nginx/generated/default.conf"
LE_CERT_DIR="./nginx/letsencrypt"
LE_WEBROOT="./nginx/certbot-www"
RUNTIME_CERT_DIR="./nginx/runtime-certs"

usage() {
  echo "Usage: ./deploy.sh <init|up|down|restart|logs|status|renew-certs>"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

ensure_config() {
  if [ ! -f "$CONFIG_FILE" ]; then
    echo "Missing $CONFIG_FILE. Run ./deploy.sh init first." >&2
    exit 1
  fi
}

sync_config_defaults() {
  example="./config.env.example"
  [ -f "$example" ] || return
  [ -f "$CONFIG_FILE" ] || return

  added=0
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ""|\#*) continue ;;
    esac
    key="${line%%=*}"
    if ! grep -q "^${key}=" "$CONFIG_FILE"; then
      if [ "$added" -eq 0 ]; then
        printf '\n# Added during upgrade from config.env.example\n' >> "$CONFIG_FILE"
      fi
      printf '%s\n' "$line" >> "$CONFIG_FILE"
      added=1
    fi
  done < "$example"

  if [ "$added" -eq 1 ]; then
    echo "Updated $CONFIG_FILE with missing defaults from config.env.example"
    echo "Review newly added keys in $CONFIG_FILE."
  fi
}

init_config() {
  if [ -f "./config.env" ]; then
    echo "config.env already exists; no changes made."
    exit 0
  fi
  cp "./config.env.example" "./config.env"
  echo "Created config.env from config.env.example"
}

derive_server_name() {
  if [ -n "${NGINX_SERVER_NAME:-}" ]; then
    return
  fi
  host="${BASE_URL#*://}"
  host="${host%%/*}"
  NGINX_SERVER_NAME="$host"
}

validate_common() {
  [ -n "${BASE_URL:-}" ] || { echo "BASE_URL is required."; exit 1; }
  [ -n "${HOST_DATA_DIR:-}" ] || { echo "HOST_DATA_DIR is required."; exit 1; }
  [ -n "${NODE_HOST_PORT:-}" ] || { echo "NODE_HOST_PORT is required."; exit 1; }
  [ -n "${TRUST_PROXY:-}" ] || { echo "TRUST_PROXY is required."; exit 1; }
  [ -n "${TRIPLESTORE_MODE:-}" ] || { echo "TRIPLESTORE_MODE is required."; exit 1; }
  [ -n "${PROXY_MODE:-}" ] || { echo "PROXY_MODE is required."; exit 1; }
  [ -n "${TLS_MODE:-}" ] || { echo "TLS_MODE is required."; exit 1; }

  case "$TRIPLESTORE_MODE" in
    bundled|external) ;;
    *) echo "TRIPLESTORE_MODE must be bundled or external."; exit 1 ;;
  esac

  case "$PROXY_MODE" in
    nginx|external|none) ;;
    *) echo "PROXY_MODE must be nginx, external, or none."; exit 1 ;;
  esac

  case "$TLS_MODE" in
    none|custom|letsencrypt) ;;
    *) echo "TLS_MODE must be none, custom, or letsencrypt."; exit 1 ;;
  esac
}

configure_triplestore() {
  TRIPLESTORE_PROFILE=""
  if [ "$TRIPLESTORE_MODE" = "bundled" ]; then
    TRIPLESTORE_PROFILE="--profile bundled-triplestore"
    TRIPLESTORE_URL="http://triplestore:9999/blazegraph/sparql"
  else
    [ -n "${EXTERNAL_TRIPLESTORE_URL:-}" ] || {
      echo "EXTERNAL_TRIPLESTORE_URL is required when TRIPLESTORE_MODE=external."
      exit 1
    }
    TRIPLESTORE_URL="$EXTERNAL_TRIPLESTORE_URL"
  fi
}

configure_proxy() {
  NGINX_PROFILE=""
  NODE_HOST_BIND="0.0.0.0"
  NGINX_CLIENT_MAX_BODY_SIZE="${NGINX_CLIENT_MAX_BODY_SIZE:-1g}"
  if [ "$PROXY_MODE" = "nginx" ]; then
    NGINX_PROFILE="--profile bundled-nginx"
    NODE_HOST_BIND="127.0.0.1"
  fi

  if [ "$PROXY_MODE" != "nginx" ] && [ "$TLS_MODE" != "none" ]; then
    echo "TLS_MODE must be none unless PROXY_MODE=nginx."
    exit 1
  fi
}

write_generated_env() {
  mkdir -p "$HOST_DATA_DIR" "./nginx/generated" "$LE_CERT_DIR" "$LE_WEBROOT" "$RUNTIME_CERT_DIR"
  cat > "$GENERATED_ENV" <<EOF
BASE_URL=$BASE_URL
TRUST_PROXY=$TRUST_PROXY
HOST_DATA_DIR=$HOST_DATA_DIR
NODE_HOST_BIND=$NODE_HOST_BIND
NODE_HOST_PORT=$NODE_HOST_PORT
TRIPLESTORE_URL=$TRIPLESTORE_URL
TRIPLESTORE_HOST_PORT=${TRIPLESTORE_HOST_PORT:-9999}
HTTP_PORT=${HTTP_PORT:-80}
HTTPS_PORT=${HTTPS_PORT:-443}
EOF
}

write_nginx_http_only() {
  cat > "$NGINX_GENERATED_CONF" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $NGINX_SERVER_NAME;
    server_tokens off;
    client_max_body_size $NGINX_CLIENT_MAX_BODY_SIZE;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://node-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }
}
EOF
}

write_nginx_custom_tls() {
  cat > "$NGINX_GENERATED_CONF" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $NGINX_SERVER_NAME;
    server_tokens off;
    client_max_body_size $NGINX_CLIENT_MAX_BODY_SIZE;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name $NGINX_SERVER_NAME;
    server_tokens off;
    client_max_body_size $NGINX_CLIENT_MAX_BODY_SIZE;

    ssl_certificate /etc/nginx/runtime-certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/runtime-certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://node-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }
}
EOF
}

write_nginx_letsencrypt_tls() {
  cert_path="/etc/letsencrypt/live/$NGINX_SERVER_NAME/fullchain.pem"
  key_path="/etc/letsencrypt/live/$NGINX_SERVER_NAME/privkey.pem"

  cat > "$NGINX_GENERATED_CONF" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $NGINX_SERVER_NAME;
    server_tokens off;
    client_max_body_size $NGINX_CLIENT_MAX_BODY_SIZE;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name $NGINX_SERVER_NAME;
    server_tokens off;
    client_max_body_size $NGINX_CLIENT_MAX_BODY_SIZE;

    ssl_certificate $cert_path;
    ssl_certificate_key $key_path;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://node-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }
}
EOF
}

compose_cmd() {
  docker compose --env-file "$GENERATED_ENV" $TRIPLESTORE_PROFILE $NGINX_PROFILE "$@"
}

issue_letsencrypt_if_needed() {
  cert_file="$LE_CERT_DIR/live/$NGINX_SERVER_NAME/fullchain.pem"
  if [ -f "$cert_file" ]; then
    return
  fi

  [ -n "${SSL_EMAIL:-}" ] || {
    echo "SSL_EMAIL is required when TLS_MODE=letsencrypt."
    exit 1
  }

  if [ "$NGINX_SERVER_NAME" = "_" ] || [ -z "$NGINX_SERVER_NAME" ]; then
    echo "NGINX_SERVER_NAME must be a real hostname for letsencrypt."
    exit 1
  fi

  write_nginx_http_only
  compose_cmd up -d node-app nginx
  docker compose --env-file "$GENERATED_ENV" --profile certbot run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    --email "$SSL_EMAIL" \
    --agree-tos \
    --no-eff-email \
    --non-interactive \
    -d "$NGINX_SERVER_NAME"
}

prepare_nginx() {
  if [ "$PROXY_MODE" != "nginx" ]; then
    return
  fi

  derive_server_name

  case "$TLS_MODE" in
    none)
      write_nginx_http_only
      ;;
    custom)
      [ -f "${CUSTOM_CERT_FULLCHAIN:-}" ] || {
        echo "CUSTOM_CERT_FULLCHAIN must point to an existing file."
        exit 1
      }
      [ -f "${CUSTOM_CERT_PRIVKEY:-}" ] || {
        echo "CUSTOM_CERT_PRIVKEY must point to an existing file."
        exit 1
      }
      cp "${CUSTOM_CERT_FULLCHAIN}" "$RUNTIME_CERT_DIR/fullchain.pem"
      cp "${CUSTOM_CERT_PRIVKEY}" "$RUNTIME_CERT_DIR/privkey.pem"
      write_nginx_custom_tls
      ;;
    letsencrypt)
      issue_letsencrypt_if_needed
      write_nginx_letsencrypt_tls
      ;;
  esac
}

load_config() {
  ensure_config
  sync_config_defaults
  # shellcheck disable=SC1090
  . "$CONFIG_FILE"
  validate_common
  configure_triplestore
  configure_proxy
  write_generated_env
}

up() {
  load_config
  prepare_nginx
  compose_cmd up -d --build
  if [ "$PROXY_MODE" = "nginx" ]; then
    compose_cmd restart nginx
  fi
  echo "Deployment is up."
}

down() {
  load_config
  compose_cmd down
}

restart_stack() {
  load_config
  compose_cmd restart
}

logs() {
  load_config
  compose_cmd logs -f --tail=200
}

status() {
  load_config
  compose_cmd ps
}

renew_certs() {
  load_config
  [ "$PROXY_MODE" = "nginx" ] || {
    echo "renew-certs is only valid when PROXY_MODE=nginx."
    exit 1
  }
  [ "$TLS_MODE" = "letsencrypt" ] || {
    echo "renew-certs is only valid when TLS_MODE=letsencrypt."
    exit 1
  }
  derive_server_name
  write_nginx_http_only
  compose_cmd up -d nginx node-app
  docker compose --env-file "$GENERATED_ENV" --profile certbot run --rm certbot renew --webroot -w /var/www/certbot
  write_nginx_letsencrypt_tls
  compose_cmd restart nginx
  echo "Certificate renewal complete."
}

require_cmd docker

ACTION="${1:-}"
case "$ACTION" in
  init) init_config ;;
  up) up ;;
  down) down ;;
  restart) restart_stack ;;
  logs) logs ;;
  status) status ;;
  renew-certs) renew_certs ;;
  *) usage; exit 1 ;;
esac
