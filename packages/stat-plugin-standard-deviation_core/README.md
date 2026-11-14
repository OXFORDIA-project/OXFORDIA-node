# `stat-plugin-standard-deviation_core`

Standard deviation statistic access-rule core package.

Concepts:
- Holds the standard-deviation-specific ShEx source and generated LDO files.
- Exposes `standardDeviationStatisticPlugin`, `StandardDeviationStatisticAccessRule`, and `StandardDeviationAllowedPath`.
- Each allowed path pairs a graph path with a `minCount` threshold and a `minDistinctValues` threshold.

Example:
```ts
import { standardDeviationStatisticPlugin, StandardDeviationStatisticAccessRuleShapeType } from "@oxfordia/stat-plugin-standard-deviation_core";
```
