#!/usr/bin/env node
// Development reverse proxy that puts pod-server (CSS) and the Expo/Metro dev
// server behind a single origin. Metro's HMR client always connects to
// `window.location.host`, so the UI bundle has to be served from the pod's own
// origin for Fast Refresh to work.
//
// Routing:
//   /.ui-static/*                    -> Metro (prefix stripped; public/ assets)
//   *.bundle, *.map, Metro endpoints -> Metro
//   everything else                  -> pod-server
//
// Env: PORT (public, default 3000), SERVER_PORT (default 3001), METRO_PORT (default 8081)

const http = require("http");
const net = require("net");

const PORT = Number(process.env.PORT || 3000);
const SERVER_PORT = Number(process.env.SERVER_PORT || 3001);
const METRO_PORT = Number(process.env.METRO_PORT || 8081);
const UPSTREAM_HOST = "127.0.0.1";

const UI_STATIC_PREFIX = "/.ui-static/";
const METRO_PREFIXES = [
  "/hot",
  "/message",
  "/events",
  "/symbolicate",
  "/status",
  "/assets/",
  "/_expo/",
  "/[metro-project]/",
  "/[metro-watchFolders]/",
];

function route(url) {
  const pathname = url.split("?")[0];
  if (pathname.startsWith(UI_STATIC_PREFIX)) {
    return { port: METRO_PORT, path: url.slice(UI_STATIC_PREFIX.length - 1) };
  }
  if (
    pathname.endsWith(".bundle") ||
    pathname.endsWith(".map") ||
    METRO_PREFIXES.some(
      (prefix) =>
        pathname === prefix.replace(/\/$/, "") || pathname.startsWith(prefix),
    )
  ) {
    return { port: METRO_PORT, path: url };
  }
  return { port: SERVER_PORT, path: url };
}

function upstreamName(port) {
  return port === METRO_PORT ? "Metro" : "pod-server";
}

const server = http.createServer((req, res) => {
  const target = route(req.url);
  const proxyReq = http.request(
    {
      host: UPSTREAM_HOST,
      port: target.port,
      method: req.method,
      path: target.path,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(
        proxyRes.statusCode,
        proxyRes.statusMessage,
        proxyRes.rawHeaders,
      );
      proxyRes.pipe(res);
    },
  );
  proxyReq.on("error", (error) => {
    if (res.headersSent) {
      res.destroy();
      return;
    }
    res.writeHead(502, { "content-type": "text/plain" });
    res.end(
      `${upstreamName(target.port)} is not reachable on port ${target.port} (${error.code}). ` +
        "It may still be starting or restarting.\n",
    );
  });
  req.pipe(proxyReq);
});

// WebSockets: Metro HMR (/hot, /message) and CSS notification channels.
server.on("upgrade", (req, socket, head) => {
  const target = route(req.url);
  const upstream = net.connect(target.port, UPSTREAM_HOST, () => {
    const headerLines = [];
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      headerLines.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
    }
    upstream.write(
      `${req.method} ${target.path} HTTP/${req.httpVersion}\r\n` +
        `${headerLines.join("\r\n")}\r\n\r\n`,
    );
    if (head.length > 0) upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error", () => upstream.destroy());
});

server.listen(PORT, () => {
  console.log(
    `Dev proxy on http://localhost:${PORT} -> pod-server :${SERVER_PORT}, Metro :${METRO_PORT}`,
  );
});
