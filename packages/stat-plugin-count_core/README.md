# `stat-plugin-count_core`

Count statistic access-rule core package.

Concepts:
- Holds the count-specific ShEx source and generated LDO files.
- Exposes `countStatisticPlugin`, `CountStatisticAccessRule`, and `CountAllowedPath`.
- Each allowed path pairs a graph path with a `minCount` small-cell suppression threshold.

Example:
```ts
import { countStatisticPlugin, CountStatisticAccessRuleShapeType } from "@oxfordia/stat-plugin-count_core";
```
