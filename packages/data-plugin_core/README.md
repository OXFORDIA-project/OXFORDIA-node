# `data-plugin_core`

Shared data-plugin contract and shortcut helpers.

Concepts:
- A `DataPlugin` carries the data schema `schema`, `context`, `shapeTypes`, and `graphPathShortcuts`.
- Shortcut helpers resolve named `GraphPath` definitions for a specific data schema.

Example:
```ts
import { findDataSchema, getGraphPathShortcutsForDataSchema } from "@oxfordia/data-plugin_core";

const schema = findDataSchema(dataPlugins, "nemaline");
const shortcuts = getGraphPathShortcutsForDataSchema(dataPlugins, "nemaline");
```
