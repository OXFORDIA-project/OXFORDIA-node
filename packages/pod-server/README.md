# `pod-server`

Default Oxfordia server bundle.

Concepts:
- Thin wrapper around `pod-server-core`.
- Injects the nemaline, mean, and Kaplan-Meier plugins.
- Includes the Community Solid Server config and generated Components.js bundle needed to run the default pod.

Example:
```ts
import { createApp } from "@oxfordia/pod-server";
```

Local dev:
```bash
npm --prefix packages/pod-server run dev
```
