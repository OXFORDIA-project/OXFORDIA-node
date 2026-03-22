# FedResDa Pod — Node app image. Dependencies are copied in; no npm install at runtime.
FROM node:20-alpine

WORKDIR /app

# Copy application and dependencies (pre-built; no network at build or run)
COPY package.json package-lock.json ./
COPY dist/ ./dist/
COPY config/ ./config/
COPY ui/ ./ui/
COPY templates/ ./templates/
COPY node_modules/ ./node_modules/

# Server config references ../ui/... paths.
# In this image, process cwd is /app, so ../ui resolves to /ui.
# Provide /ui -> /app/ui to keep config paths valid.
RUN ln -s /app/ui /ui

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Data directory is mounted at /app/data
VOLUME ["/app/data"]

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
