# syntax=docker/dockerfile:1.7

FROM node:20-slim AS build

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY packages ./packages
COPY docker ./docker
COPY deploy ./deploy

RUN npm ci
RUN npm run build:server:packages
RUN npm run build:ui
RUN npm prune --omit=dev
RUN bash deploy/common/stage-runtime.sh /runtime

FROM node:20-slim AS runtime

WORKDIR /opt/oxfordia-pod

RUN useradd --system --uid 10001 --gid node --home-dir /opt/oxfordia-pod --no-create-home oxfordia-pod \
  && mkdir -p /var/lib/oxfordia-pod/data /tmp \
  && chown -R 10001:node /var/lib/oxfordia-pod /tmp

COPY --from=build --chown=10001:node /runtime/ /opt/oxfordia-pod/

ENV CSS_CONFIG=/opt/oxfordia-pod/packages/pod-server/config/config.json \
    CSS_MAIN_MODULE_PATH=/opt/oxfordia-pod/packages/pod-server \
    CSS_ROOT_FILE_PATH=/var/lib/oxfordia-pod/data \
    CSS_PORT=3000

USER 10001:node

EXPOSE 3000

ENTRYPOINT ["/opt/oxfordia-pod/entrypoint.sh"]
