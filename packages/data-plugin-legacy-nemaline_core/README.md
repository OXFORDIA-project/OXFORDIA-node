# `data-plugin-legacy-nemaline_core`

Legacy nemaline data-plugin core package (data schema name `legacy-nemaline`).

Concepts:
- Holds the original nemaline ShEx source (clusters, MFM visits, Kaplan-Meier observations) and generated LDO files.
- Superseded by `data-plugin-nemaline_core`, which follows the 2026/2027 pilot analysis template. Kept so existing pods and access rules can still be read.
- Publishes the legacy graph-path shortcut catalog through `legacyNemalineDataPlugin`.

Example:
```ts
import { legacyNemalineDataPlugin, PersonShapeType } from "@oxfordia/data-plugin-legacy-nemaline_core";
```
