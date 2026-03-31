# `data-plugin_ui`

Shared UI contract for data plugins.

Concepts:
- A `DataPluginUi` provides the linked-data-browser `resourceView` and `resourceCreator`.
- `dataPlugin` is optional glue for hosts like `pod-ui-core` that also need the core schema metadata.

Example:
```ts
import type { DataPluginUi } from "@oxfordia/data-plugin_ui";

const pluginUi: DataPluginUi = {
  name: "nemaline",
  resourceView,
  resourceCreator,
};
```
