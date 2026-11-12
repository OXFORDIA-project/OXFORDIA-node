# `stat-plugin-count_server`

Count statistic API plugin.

Concepts:
- Implements the server `StatisticApiPlugin` for count queries.
- Counts the distinct nodes or values a graph path resolves to.
- Pre-query: the graph path must be on the policy allow-list.
- Post-query: the count is suppressed (403) when it is below the matched `minCount`.

Example:
```ts
import { countPlugin } from "@oxfordia/stat-plugin-count_server";
```
