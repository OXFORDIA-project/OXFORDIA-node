# `pod-server-core`

Core server library that hosts data/statistic plugins.

Concepts:
- Wraps the statistic API router and Community Solid Server integration points.
- Accepts injected `dataPlugins` and `statisticPlugins`.
- Keeps the generic server pieces separate from the default Oxfordia plugin bundle.
- Owns the shared identity flow assets used by the default pod bundle, including the custom create-login template.

Example:
```ts
import { createApp } from "@oxfordia/pod-server-core";

const app = createApp({
  baseUrl,
  rootFilePath,
  sparqlEndpoint,
  resourceStore,
  statisticPlugins,
});
```
