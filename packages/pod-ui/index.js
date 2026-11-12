import React from "react";
import { registerRootComponent } from "expo";
import { Screen } from "./app/index";

// import.meta.url (used by @uvdsl/solid-oidc-client-browser to locate RefreshWorker.js)
// is transformed to globalThis.__ExpoImportMetaRegistry.url. The Expo default points to
// the bundle file path, which resolves RefreshWorker.js to the wrong directory in
// server-hosted mode. Override it to point at the static root where Expo exports the file.
if (typeof window !== "undefined") {
  globalThis.__ExpoImportMetaRegistry = {
    url:
      window.location.origin +
      (process.env.EXPO_PUBLIC_IS_SERVER_HOSTED === "true"
        ? "/.ui-static/"
        : "/"),
  };
}

export function App() {
  return <Screen />;
}

registerRootComponent(App);
