# `pod-ui-core`

Core linked-data-browser wrapper for Oxfordia UI composition.

Concepts:
- Provides the default Home and Statistic Access Rule resource views.
- Accepts injected `dataPluginUis` and `statisticPluginUis`.
- Dynamically adapts the statistic-access-rule editor to the supplied statistic UI plugins.

Example:
```tsx
import { PodUiCore } from "@oxfordia/pod-ui-core";

<PodUiCore
  mode="server-ui"
  dataPluginUis={dataPluginUis}
  statisticPluginUis={statisticPluginUis}
/>
```
