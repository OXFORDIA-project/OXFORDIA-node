# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

OXFORDIA Pod is a Solid Pod deployment for federated research data. It's an Nx monorepo with Node.js packages (TypeScript/React) and R packages. The codebase bundles Community Solid Server (CSS) with custom plugins for federated data queries and statistics.

**Key repositories:**
- Main server: `packages/pod-server` (bundles CSS with plugins)
- UI: `packages/pod-ui` (Expo-based React web app)
- R client: `packages/oxfordiar` (federated query client)

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Full dev server with live reload (both pod-server and pod-ui)
npm run dev

# Dev pod-server only
npm run dev:server

# Dev pod-ui only  
npm run dev:ui

# Run three pod instances in parallel (for testing federation)
npm run dev:pods
```

Default URLs:
- Pod 1: `http://localhost:3100`
- Pod 2: `http://localhost:3101`
- Pod 3: `http://localhost:3102`
- All connect to `http://localhost:9999/blazegraph/sparql` by default

Override with env vars: `PORT_1`, `BASE_URL_2`, `DATA_DIR_3`, `SPARQL_ENDPOINT_1`, etc.

### Build

```bash
# Build all packages
npm run build

# Build TypeScript for pod-server and pod-ui specifically
npm run build:server:types
npm run build:ui:types

# Watch mode for types
npm run watch:server:types
npm run watch:ui:types

# Type check entire monorepo
npm run check:types

# Docker image
npm run build:docker

# Debian packages (both amd64 and arm64)
npm run build:deb
npm run build:deb:idp
```

### Testing & Validation

```bash
# Lint and format checks (ESLint, TypeScript)
npm run check:types

# Test Debian package in a systemd-capable container
npm run test:deb

# Format/lint R code
npm run format:r
npm run lint:r
npm run format:r:check
```

### Version Management

```bash
npm run version:get       # Print current version
npm run version:set v0.0.2-alpha.1  # Set exact version
npm run version:bump major|minor|patch|prerelease
```

### GitHub Actions (Local Testing with `act`)

```bash
npm run act:list          # List available jobs
npm run act:validate      # Run PR validation locally
npm run act:next          # Simulate push to `next` branch
npm run act:release       # Simulate tagged release push
```

Requires a `.secrets` file for jobs that publish images or releases. See `.secrets.act.example`.

## Architecture

### Monorepo Structure

The repo uses **Nx** for build orchestration. TypeScript packages are configured as a workspace in `package.json`.

#### Core Server & UI

- **`packages/pod-server-core`**: Generic server wrapper accepting injected data and statistic plugins. Implements:
  - Express app factory (`createApp`)
  - HTTP handler for CSS integration
  - SPARQL endpoint integration
  - API router for `/api/stat/:route`
  - Account/login helpers

- **`packages/pod-server`**: Default server bundle that injects:
  - Nemaline data plugin
  - Mean and Kaplan-Meier statistic plugins
  - CSS config and Components.js bundle
  - Password login handler

- **`packages/pod-ui-core`**: Generic UI wrapper (React/Expo) accepting injected plugin UIs. Includes:
  - Home view
  - Statistic access rule editor
  - Resource navigation

- **`packages/pod-ui`**: Default UI bundle injecting nemaline, mean, and Kaplan-Meier UI plugins. Built with Expo and served as static HTML from pod-server.

#### Plugin System

**Data Plugins** (`data-plugin_*`):
- `data-plugin_core`: Contract/interfaces
- `data-plugin_ui`: UI contract for resource views
- `data-plugin-nemaline_core`: Nemaline ShEx schema and LDO generation
- `data-plugin-nemaline_ui`: Nemaline-specific resource views

**Statistic Plugins** (`stat-plugin_*`):
- `stat-plugin_core`: Core contract, defines query/output/access-rule schemas
- `stat-plugin_server`: Server-side contract and SPARQL helpers
- `stat-plugin_ui`: UI contract and form builders
- `stat-plugin-mean_*`: Mean statistic (core/server/ui)
- `stat-plugin-kaplan-meier_*`: Kaplan-Meier survival analysis (core/server/ui)

#### R Packages

- **`packages/oxfordiar`**: Common runtime for federated queries (auth, graph-path builders, query execution)
- **`packages/oxfordiar.data.nemaline`**: R client for nemaline data queries
- **`packages/oxfordiar.stat.mean`**: R client for mean statistics
- **`packages/oxfordiar.stat.kaplanmeier`**: R client for Kaplan-Meier statistics

#### Utilities

- **`packages/solidauthr`**: Shared authentication helpers (used by R and Node)

### Plugin Architecture

There are two independent plugin families: **data plugins** and **stat plugins**. Each family has up to three layers (core/server/ui), plus an R package layer. Plugins are registered in `packages/pod-server/src/index.ts` (server) and `packages/pod-ui/src/index.ts` (UI) by adding them to the `default*Plugins` arrays — the core and UI bundles are thin wrappers that inject these arrays.

Package naming convention: `{type}-plugin-{name}_{layer}` (e.g. `stat-plugin-mean_server`, `data-plugin-nemaline_ui`).

#### Data Plugin — Core (`@oxfordia/data-plugin_core`)

Defines the data schema for a class of RDF resources. Must implement `DataPlugin`:

```typescript
interface DataPlugin {
  name: string;                                     // lowercase identifier e.g. "nemaline"
  schema: Schema;                                   // ShEx Schema
  context: LdoJsonldContext;                        // JSON-LD context
  shapeTypes: Record<string, ShapeType<LdoBase>>;   // LDO shape types keyed by name
  graphPathShortcuts: GraphPathShortcutMap;         // Record<name, () => GraphPath>
}
```

ShEx schemas live in `src/shapes/`, generated LDO types in `src/generated/`, shortcuts in `src/shortcuts.ts`.

#### Data Plugin — UI (`@oxfordia/data-plugin_ui`)

Provides the resource view and creator for the pod browser. Must implement `DataPluginUi`:

```typescript
interface DataPluginUi {
  name: string;                     // must match DataPlugin.name
  resourceView: ResourceViewConfig; // linked-data-browser config
  resourceCreator: ResourceCreatorConfig;
  dataPlugin?: DataPlugin;          // optional reference to core plugin
}

interface ResourceViewConfig {
  name: string;
  displayName: string;
  displayIcon: ComponentType;
  view: ComponentType;              // React component rendered for matching resources
  canDisplay: (targetUri, resource, dataset) => boolean;
}
```

There is no data plugin server layer — data plugins are consumed server-side only through the core `DataPlugin` interface.

#### Stat Plugin — Core (`@oxfordia/stat-plugin_core`)

Defines the statistic's identity and its access-rule RDF shape. Must implement `StatisticPlugin`:

```typescript
interface StatisticPlugin<SAR extends LdoBase = LdoBase> {
  name: string;                                      // e.g. "mean", "kaplan-meier"
  route: string;                                     // API route segment, matches name
  statisticAccessRuleSchema: Schema;                 // ShEx Schema for access rule
  statisticAccessRuleShapeType: ShapeType<SAR>;      // LDO type for the rule
}
```

The core plugin is spread into both the server and UI plugin objects.

#### Stat Plugin — Server (`@oxfordia/stat-plugin_server`)

Adds query handling and authorization logic on top of the core. Must implement `StatisticApiPlugin`:

```typescript
interface StatisticApiPlugin<Query, Output, SAR, Globals> extends StatisticPlugin<SAR> {
  querySchema: JSONSchema4;                  // JSON Schema 4 for the incoming query
  normalizeQuery?(query: unknown): unknown;  // optional pre-validation normalization
  evaluateStatisticAccessRulePreQuery(query: Query, rule: SAR): true | Error;
  performQuery(query: Query, globals: Globals): Promise<Output>;
  evaluateStatisticAccessRulePostQuery(query: Query, rule: SAR, output: Output): true | Error;
}
```

- `evaluateStatisticAccessRulePreQuery` — authorization check before the query runs (e.g. requested GraphPath is on the allow-list)
- `performQuery` — executes SPARQL and returns typed output; receives `{ sparqlEndpoint, sparqlFetcher, logger }`
- `evaluateStatisticAccessRulePostQuery` — disclosure control after results are available (e.g. reject if count < minimum)

`querySchema` must include `resourceUri: { type: "string", format: "uri" }` and `additionalProperties: false`.

**Statistic query request flow:**
1. `POST /.api/stat/:route` — route resolves the plugin
2. Request validated against `querySchema`
3. Access rule loaded from `{resourceUri}.statistic-access-rule.ttl`, policy entry matched by `statisticName`
4. `evaluateStatisticAccessRulePreQuery` called
5. `performQuery` called with SPARQL globals
6. `evaluateStatisticAccessRulePostQuery` called on the result
7. JSON response returned

#### Stat Plugin — UI (`@oxfordia/stat-plugin_ui`)

Provides the policy editor component shown in the access rule editor. Must implement `StatisticPluginUi`:

```typescript
interface StatisticPluginUi<Policy extends StatisticPolicy> extends StatisticPlugin {
  displayName: string;                              // human-readable e.g. "Mean"
  createPolicy: () => Policy;                       // factory for a blank policy object
  isPolicy: (policy: StatisticPolicy) => policy is Policy;  // type guard, checks statisticName
  Editor: ComponentType<StatisticPolicyEditorProps<Policy>>;
}

interface StatisticPolicyEditorProps<Policy> {
  policy: Policy;
  onChange: (next: Policy) => void;
  gpOptions: StatisticAccessRuleEditorGraphPathOptions;
}
```

`createPolicy` must set `statisticName` to match `plugin.name` and generate a unique `@id`. Use `set()` from LDO for empty collections.

#### R Plugin — Data (`oxfordiar.data.{name}`)

An R package that exposes graph-path shortcuts for a data schema. Must export two functions:

```r
ox_{name}_shortcuts()      # Returns named list of shortcut factory functions
ox_{name}_shortcut(name)   # Looks up a shortcut by name, returns ox_data_shortcut object
```

Package name: `oxfordiar.data.{name}`. Depends on `oxfordiar`. Shortcuts are defined using `ox_data_shortcut(name, path)` with `ox_graph_path(...)` paths.

#### R Plugin — Stat (`oxfordiar.stat.{name}`)

An R package that wraps `ox_query()` for a specific statistic. Must export one primary function:

```r
ox_{name}(shortcut, targets, auth = ox_auth_none(), fail_fast = TRUE)
```

Internally calls `oxfordiar::ox_query(route = "{name}", fields = list(graphPath = shortcut), parse_result = ..., combine_results = ...)`. Must implement `ox_{name}_parse_result(payload, target)` and `ox_{name}_combine_results(rows)` to produce data frames. Package name: `oxfordiar.stat.{name}`.

### Storage & Data Model

**Dual Storage:**
- **File System** (`/.internal/*`): Internal pod metadata
- **SPARQL Endpoint**: All other data (RDF triples)

Config routing rule in `config/config.json` splits traffic by regex. This allows internal state (config, ACLs) on disk while research data lives in a triplestore.

### Key Technical Decisions

1. **Components.js (Linked Software Dependencies)**: CSS uses LSD/Components.js for runtime dependency injection and config. Pod config is JSON-LD with `@context` for class instantiation.

2. **LDO for RDF Edits**: The UI uses LDO (`@ldo/solid-react`) for shape-driven RDF reads/writes with LDO transactions. Avoid raw `fetch PUT/PATCH` for RDF; use `useChangeSubject` or `useChangeDataset` instead.

3. **Expo for Multi-Platform UI**: Pod-ui uses Expo with React Native Web. The `dist-server/` build is static HTML served as a Solid resource by pod-server.

4. **Plugin Injection via Defaults**: Pod-server and pod-ui are thin wrappers that inject default plugins. Custom deployments can build alternative bundles with different plugins.

5. **ShEx + LDO for Graph Navigation**: Data schemas are ShEx (Shape Expressions). LDO uses ShEx to generate TypeScript interfaces for graph-path authoring in statistic rules.

## Important Patterns & Files

### Server-Side

- **Entry**: `packages/pod-server/src/index.ts` — exports `createApp()` and `ApiHandler`
- **Config**: `packages/pod-server/config/config.json` — JSON-LD Components.js config for CSS
- **API Router**: `packages/pod-server-core/src/api/apiRouter.ts` — handles `/api/stat/:route`
- **Statistic Query Handler**: `packages/pod-server-core/src/api/statistic/statisticQueryHandler.ts` — policy evaluation and plugin invocation
- **Graph-Path to SPARQL**: `packages/pod-server-core/src/api/statistic/plugin/util/graphPathToSparqlBuilder.ts` — compiles graph-path instructions to SPARQL

### UI-Side

- **Entry**: `packages/pod-ui/src/index.ts` — exports `PodUi()` component
- **Core Shell**: `packages/pod-ui-core/src/PodUiCore.tsx` — main layout and plugin integration
- **Statistic Access Rule Editor**: `packages/pod-ui-core/src/resourceViews/statisticAccessRule/` — form builder for policy editing
  - `StatisticAccessRuleView.tsx` — component
  - `useStatisticAccessRuleEditorData.ts` — LDO hooks for RDF edits
  - `statisticAccessRuleSchemaForm.ts` — JSON Schema → form generator

### Important Cursor Rules (`.cursor/rules/`)

These provide domain-specific guidance:

1. **statistics-architecture.mdc**: Deep dive into statistic plugins, data schemas, access rules, and the request flow. Key for adding new statistics.

2. **linked-data-browser-components.mdc**: Catalog of importable UI components from the `linked-data-browser` package for building resource views.

3. **ldo-usage-guidelines.mdc**: Best practices for LDO RDF reads/writes in the UI (use `useChangeSubject` / `useChangeDataset`, avoid raw fetch).

## Deployment

### Docker

```bash
npm run build:docker
docker run --rm -p 3000:3000 \
  -e CSS_BASE_URL=http://localhost:3000/ \
  -e CSS_ROOT_FILE_PATH=/data \
  -e CSS_SPARQL_ENDPOINT=http://host.docker.internal:9999/blazegraph/sparql \
  -v "$PWD/data:/data" \
  oxfordia-pod-server
```

### Debian Package

Release artifacts include `oxfordia-pod_<version>_amd64.deb` and `oxfordia-pod_<version>_arm64.deb`. See README.md for systemd setup.

### Helm Chart

Chart in `deploy/helm/pod-server` publishes via GitHub Pages. Configure storage, ingress, and external triplestore via `values.yaml`.

## Testing & CI/CD

- **GitHub Actions**: Workflows in `.github/workflows/` for validation, pre-release, and release builds.
- **Local Act Testing**: Use `npm run act:*` commands to test workflows locally.
- **Debian Package Test**: `npm run test:deb` spins up a systemd container for package installation testing.

## Notes for Contributors

- **TypeScript**: All Node packages use TypeScript 5.5 with strict mode. Check types with `npm run check:types`.
- **Build Output**: Each package compiles to `dist/`. Nx caches builds automatically.
- **Adding a Statistic Plugin**: See statistics-architecture.mdc checklist in `.cursor/rules/`.
- **UI Component System**: Linked Data Browser exports a full component library for custom resource views.
- **R Package Release**: `npm run release:r` orchestrates R package checks, building, and publishing.
