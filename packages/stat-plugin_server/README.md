# `stat-plugin_server`

Server-side statistic-plugin contract and utilities.

Concepts:
- Defines `StatisticApiPlugin`.
- Holds shared graph-path comparison and SPARQL helpers.
- Provides the minimal globals contract needed by statistic query executors.

Example:
```ts
import type { StatisticApiPlugin } from "@oxfordia/stat-plugin_server";
```
