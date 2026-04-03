# `stat-plugin-kaplan-meier_server`

Kaplan-Meier statistic API plugin.

Concepts:
- Implements the server `StatisticApiPlugin` for time/event/grouped observation queries.
- Reuses shared graph-path/SPARQL utilities from `stat-plugin_server`.

Example:
```ts
import { kaplanMeierPlugin } from "@oxfordia/stat-plugin-kaplan-meier_server";
```
