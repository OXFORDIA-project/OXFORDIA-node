# `stat-plugin-standard-deviation_server`

Standard deviation statistic API plugin.

Concepts:
- Implements the server `StatisticApiPlugin` for sample standard deviation queries.
- Returns the mean and count alongside the standard deviation so clients can pool results across pods. A standard-deviation policy therefore also releases the mean.
- Pre-query: the graph path must be on the policy allow-list.
- Post-query: rejects results with fewer than two values, fewer than `minCount` values, or fewer than `minDistinctValues` distinct values.

Example:
```ts
import { standardDeviationPlugin } from "@oxfordia/stat-plugin-standard-deviation_server";
```
