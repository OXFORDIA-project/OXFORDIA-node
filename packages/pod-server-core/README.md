# `pod-server-core`

Core server library that hosts data/statistic plugins.

Concepts:
- Wraps the statistic API router and Community Solid Server integration points.
- Accepts injected `dataPlugins` and `statisticPlugins`.
- Keeps the generic server pieces separate from the default Oxfordia plugin bundle.

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
