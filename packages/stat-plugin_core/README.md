# `stat-plugin_core`

Shared statistic-plugin core types and common LDO assets.

Concepts:
- Defines the base `StatisticPlugin` contract.
- Holds shared `GraphPath` and `StatisticAccessRuleDocument` ShEx/LDO generation.
- Exposes the JSON-schema version of graph paths as `graphPathJsonSchema`.

Example:
```ts
import {
  GraphPathShapeType,
  StatisticAccessRuleDocumentShapeType,
  graphPathJsonSchema,
} from "@oxfordia/stat-plugin_core";
```
