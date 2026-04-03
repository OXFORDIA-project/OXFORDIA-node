# `pod-ui`

Default Oxfordia UI bundle.

Concepts:
- Thin wrapper around `pod-ui-core`.
- Injects the nemaline, mean, and Kaplan-Meier UI plugins.
- Includes the hosted Expo web shell used by `pod-server` in local development.

Example:
```tsx
import { PodUi } from "@oxfordia/pod-ui";

<PodUi mode="server-ui" />
```

Hosted web build:
```bash
npm --prefix packages/pod-ui run build:server
```
