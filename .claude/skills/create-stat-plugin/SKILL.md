---
name: create-stat-plugin
description: Step-by-step guide for adding a new statistic plugin (core + server + UI TypeScript packages and the oxfordiar.stat.* R client) to the OXFORDIA monorepo, modelled on the mean and kaplan-meier plugins. Use when asked to create, scaffold, or add a new statistic / stat plugin, or a new `/.api/stat/:route` endpoint.
---

# Creating a Statistic Plugin

A statistic plugin is five pieces that must agree on one name. Build them in this order, because each layer imports the one before it:

| # | Package | Purpose | Reference implementations |
|---|---------|---------|---------------------------|
| 1 | `packages/stat-plugin-{name}_core` | ShEx access-rule shape, generated LDO types, `StatisticPlugin` identity | `stat-plugin-mean_core`, `stat-plugin-kaplan-meier_core` |
| 2 | `packages/stat-plugin-{name}_server` | Query schema, access-rule evaluation, SPARQL `performQuery` | `stat-plugin-mean_server`, `stat-plugin-kaplan-meier_server` |
| 3 | `packages/stat-plugin-{name}_ui` | Policy editor used by the access-rule view | `stat-plugin-mean_ui`, `stat-plugin-kaplan-meier_ui` |
| 4 | Wiring | tsconfig paths and references, `pod-server` and `pod-ui` registration | see Step 4 |
| 5 | `packages/oxfordiar.stat.{rname}` | R client that calls `oxfordiar::ox_query()` | `oxfordiar.stat.mean`, `oxfordiar.stat.kaplanmeier` |

**Pick a reference first.** Copy **mean** when the statistic takes a single graph path and returns an aggregate (`AVG`/`COUNT`-style). Copy **kaplan-meier** when it takes several graph paths that share a subject, has optional inputs, or returns per-row observations. Read the reference's files before you write anything. Mirror them closely, because the repo values consistency between plugins.

> `.cursor/rules/statistics-architecture.mdc` still has an "Adding a new statistic plugin" checklist that points at paths that no longer exist (`server/src/api/statistic/plugin/`, `@oxfordia/types`, `statisticPlugins.ts`). Ignore that checklist and use this guide.

## Naming

Settle every name before you create any files. Example statistic: "standard deviation".

| Token | Convention | Example | Used for |
|-------|-----------|---------|----------|
| `{name}` | kebab-case | `standard-deviation` | package dirs, `plugin.name`, `plugin.route`, `statisticName`, URL `/.api/stat/standard-deviation` |
| `{camel}` | camelCase | `standardDeviation` | `.shex` file prefix, exported values (`standardDeviationPlugin`) |
| `{Pascal}` | PascalCase | `StandardDeviation` | shapes and types (`StandardDeviationStatisticAccessRule`) |
| `{rname}` | lowercase, no separators | `standarddeviation` | R package `oxfordiar.stat.standarddeviation` (R package names can't contain `-` or `_`) |
| `{snake}` | snake_case | `standard_deviation` | R function `ox_standard_deviation()` |

`name` and `route` must be identical. The server matches policies on `statisticName === plugin.name || plugin.route`, and the UI's `isPolicy` compares against the same string.

---

## Step 1: Core package (`stat-plugin-{name}_core`)

Files (copy from `packages/stat-plugin-mean_core/`):

```
package.json        # name @oxfordia/stat-plugin-{name}_core; scripts build:ldo + build
project.json        # Nx name stat-plugin-{name}_core; outputs include {projectRoot}/src/generated
tsconfig.json       # references ../stat-plugin_core
README.md           # short Concepts + Example block, same format as mean's
src/shapes/{camel}_statisticAccessRuleSchema.shex
src/generated/      # produced by `ldo build`, committed to git, never hand-edit
src/index.ts
```

### 1a. ShEx shape

Start from `packages/stat-plugin-mean_core/src/shapes/mean_statisticAccessRuleSchema.shex`:

```shex
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX statp: <https://oxfordia.setmeld.com/statistics#>

start = @statp:{Pascal}StatisticAccessRuleShape

statp:{Pascal}StatisticAccessRuleShape {
  statp:allowedPath @statp:{Pascal}AllowedPathShape +
}

statp:{Pascal}AllowedPathShape {
  statp:graphPath @statp:GraphPathShape ;      # one per graph-path input of the query
  statp:minCount xsd:integer ;                 # disclosure-control parameter(s)
}

# ...then copy GraphPathShape, GraphNodeFilterShape, GraphPredicateFilterShape,
# GraphTraversalStepShape, GraphValueSelectorShape, GraphLiteralFilterShape
# VERBATIM from the mean .shex file.
```

Rules:
- **Copy the six `Graph*Shape` declarations verbatim.** Every plugin keeps its own copy because LDO needs them inside the same schema. Don't change them, because `graphPathsAreEqual` and the UI editors depend on that exact structure.
- The root shape always holds `statp:allowedPath ... +`. Each allowed-path entry describes **one permitted combination of query inputs** plus the disclosure thresholds that apply to it.
- Name each graph-path predicate after its role (`timeGraphPath`, `eventGraphPath`). Use `*` for a set of permitted alternatives, as KM's `groupByGraphPath` does.
- LDO camelCases hyphenated predicates (`statp:k-anonymity` becomes `kAnonymity`). Prefer plain camelCase predicates in new shapes to avoid the surprise.
- Use the `statp:` namespace for everything.

### 1b. Generate LDO files

```bash
npm --prefix packages/stat-plugin-{name}_core run build:ldo
```

This writes `{camel}_statisticAccessRuleSchema.{context,schema,shapeTypes,typings}.ts` into `src/generated/`. Re-run it after every `.shex` change and commit the output.

### 1c. `src/index.ts`

Same shape as mean's:

```ts
import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";
import { {camel}_statisticAccessRuleSchemaContext } from "./generated/{camel}_statisticAccessRuleSchema.context";
import { {camel}_statisticAccessRuleSchemaSchema } from "./generated/{camel}_statisticAccessRuleSchema.schema";
import { {Pascal}StatisticAccessRuleShapeType } from "./generated/{camel}_statisticAccessRuleSchema.shapeTypes";
import type { {Pascal}StatisticAccessRule } from "./generated/{camel}_statisticAccessRuleSchema.typings";

export * from "./generated/{camel}_statisticAccessRuleSchema.context";
export * from "./generated/{camel}_statisticAccessRuleSchema.schema";
export * from "./generated/{camel}_statisticAccessRuleSchema.shapeTypes";
export * from "./generated/{camel}_statisticAccessRuleSchema.typings";

export const {camel}StatisticPlugin: StatisticPlugin<{Pascal}StatisticAccessRule> = {
  name: "{name}",
  route: "{name}",
  statisticAccessRuleSchema: {camel}_statisticAccessRuleSchemaSchema,
  statisticAccessRuleShapeType: {Pascal}StatisticAccessRuleShapeType,
};

export const {camel}StatisticPluginContext = {camel}_statisticAccessRuleSchemaContext;
```

---

## Step 2: Server package (`stat-plugin-{name}_server`)

Files (copy from `packages/stat-plugin-mean_server/`):

```
package.json        # scripts.build = "tsc -b tsconfig.json"
project.json
tsconfig.json       # references ../stat-plugin_server and ../stat-plugin-{name}_core; excludes __tests__
README.md
src/index.ts                                   # export * from both files below
src/{camel}Plugin.ts                           # StatisticApiPlugin object + query + SPARQL
src/evaluate{Pascal}StatisticAccessRule.ts     # pure pre/post evaluation functions
src/__tests__/evaluate{Pascal}StatisticAccessRule.test.ts
```

Keep evaluation logic in its own file as **pure functions** so you can unit-test it without SPARQL.

### 2a. Query and output types and `querySchema`

```ts
export interface {Pascal}Query {
  resourceUri: string;
  graphPath: GraphPath;          // one field per graph-path input
}

export interface {Pascal}Output { /* JSON-serialisable result */ }

const {camel}QuerySchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,   // required
  required: ["resourceUri", "graphPath"],
  properties: {
    resourceUri: { type: "string", format: "uri", minLength: 1 },  // required
    graphPath: graphPathJsonSchema,                                 // from @oxfordia/stat-plugin_core
  },
};
```

- Request field names here are the HTTP and R contract (`graphPath`, `timePath`, `eventPath`, `groupByPath`). They don't have to match the ShEx predicate names (`timeGraphPath`, ...).
- Validation uses `json-schema` v0.4.0, which enforces `additionalProperties: false` only at the root and is inconsistent about `required`. Don't rely on it for nested guarantees. Defend against bad input in your own code too.
- **Optional inputs:** R serialises `list(groupByPath = NULL)` as `{}` or `null`. Follow KM: allow `anyOf: [graphPathJsonSchema, emptyObjectJsonSchema, nullJsonSchema]` and add a `normalizeQuery` that deletes the key when it's empty, so that downstream code sees `undefined`.

### 2b. Access-rule evaluation

The handler (`packages/pod-server-core/src/api/statistic/statisticQueryHandler.ts`) runs the following for each matching policy. The query is allowed if **any** policy passes both stages.

1. `evaluateStatisticAccessRulePreQuery(query, rule)`: **authorization**. Is this exact combination of graph paths on the allow-list?
2. `performQuery(query, globals)`
3. `evaluateStatisticAccessRulePostQuery(query, rule, output)`: **disclosure control**. Is the result safe to release (counts ≥ `minCount`, k-anonymity per group, and so on)?

When a check fails, `return new Error("...")`. Don't throw. The message becomes the 403 body, so make it specific. KM's evaluator is a good model: it tells the caller *which* path failed and uses `graphPathDebugString`, truncated, for context.

Helpers from `@oxfordia/stat-plugin_server`:

| Helper | Use |
|--------|-----|
| `toCollectionArray(rule.allowedPath)` | Turn an LdSet or a single value into an array. Always use it on LDO collections. |
| `findMatchingAllowedPath(queryGraphPath, allowedPaths)` | Single-path plugins whose entries have a `graphPath` field (mean). |
| `graphPathsAreEqual(a, b)` | Multi-path plugins: write your own `find...AllowedPath` (KM). |
| `graphPathDebugString(gp)` | Readable path for error messages. |
| `toRecord` + `readProperty(record, "minCount", FULL_IRI)` | Read numeric thresholds robustly (mean's `readAllowedPathMinCount`). Also clamp with `Math.max(0, Math.floor(raw))` and return `NaN` for missing values, then fail closed. |

**Never ship a permissive check.** The post-query stage must enforce every threshold declared in your ShEx shape. (KM currently returns `true` from post-query and doesn't enforce `kAnonymity`. Don't copy that gap.) If an output has no count, compute one in `performQuery` so the post check has something to compare against.

### 2c. `performQuery` via `executeStatisticSparqlQuery`

Don't hand-build SPARQL. Describe the bindings and projections:

```ts
const rows = await executeStatisticSparqlQuery({
  resourceUri: query.resourceUri,          // query is scoped to GRAPH <resourceUri>
  pathBindings: [
    { key: "value", graphPath: query.graphPath, requireNumeric: true },
  ],
  selectFields: [
    { alias: "agg",   expression: (v) => `AVG(${v.value ?? "?value"})` },
    { alias: "count", expression: (v) => `COUNT(${v.value ?? "?value"})` },
  ],
  globals,
});
```

- **Several paths about the same entity:** give each binding the same `startVar: "?subject"` and a distinct `variableNamespace` (`"t_"`, `"e_"`, `"g_"`) so the variables don't collide (see `executeKaplanMeierQuery`).
- `requireNumeric: true` adds `FILTER(isNumeric(...))`.
- Parse with `parseNumericBindingValue(row, alias)` and `parseStringBindingValue(row, alias)`. Triplestores may return `COUNT` as a decimal, so round it (mean does this).
- If there's no usable data, `throw new Error(...)` from `performQuery`, as mean does when the count is 0.
- Prefer aggregating in SPARQL. Return raw rows (as KM does) only when the statistic can't be combined server-side, and then make sure post-query disclosure control covers them.

### 2d. Assemble the plugin

```ts
export const {camel}Plugin: StatisticApiPlugin<
  {Pascal}Query, {Pascal}Output, {Pascal}StatisticAccessRule, StatisticPluginServerGlobals
> = {
  ...{camel}StatisticPlugin,
  querySchema: {camel}QuerySchema,
  // normalizeQuery: ...,   // only if there are optional inputs
  evaluateStatisticAccessRulePreQuery(query, rule) { return evaluate{Pascal}StatisticAccessRule(..., rule); },
  async performQuery(query, globals) { ... },
  evaluateStatisticAccessRulePostQuery(query, rule, output) { return evaluate{Pascal}StatisticAccessRulePostQuery(..., rule, output); },
};
```

### 2e. Tests

Mirror `packages/stat-plugin-mean_server/src/__tests__/evaluateMeanStatisticAccessRule.test.ts`: build fixtures with `as unknown as` casts (`makePath`, `makeAllowedPath`, `makeAccessRule`) and cover:
- no allowed paths → Error
- matching path → `true`, non-matching → Error, match in a later entry → `true`
- every threshold: equal (pass), above (pass), below (Error that names both numbers), missing or invalid (Error), decimal floored, negative clamped
- for multi-path plugins: each path mismatched individually, a valid-individually-but-disallowed combination, and optional path allowed or disallowed

Tests live in `src/__tests__/*.test.ts`. The root `vitest.config.mts` picks them up and resolves `@oxfordia/*` through `tsconfig.base.json` paths, so Step 4a must be done before they'll run.

---

## Step 3: UI package (`stat-plugin-{name}_ui`)

Files (copy from `packages/stat-plugin-mean_ui/`):

```
package.json, project.json, README.md
tsconfig.json       # "jsx": "react-jsx"; references ../stat-plugin_ui and ../stat-plugin-{name}_core
src/index.ts                               # {camel}StatisticPluginUi
src/{Pascal}StatisticPolicyEditor.tsx
```

### 3a. `src/index.ts`

```ts
type {Pascal}StatisticPolicy = StatisticPolicy & {
  allowedPath?: {Pascal}AllowedPath | Iterable<{Pascal}AllowedPath>;
};

export const {camel}StatisticPluginUi: StatisticPluginUi<{Pascal}StatisticPolicy> = {
  ...{camel}StatisticPlugin,
  displayName: "Human Name",
  createPolicy: () =>
    ({
      "@id": `#${createId("{name}-policy")}`,   // fragment id, unique
      statisticName: "{name}",                   // must equal plugin.name
      allowedPath: set(),                        // LDO set() for empty collections
    }) as {Pascal}StatisticPolicy,
  isPolicy: (policy): policy is {Pascal}StatisticPolicy => policy.statisticName === "{name}",
  Editor: {Pascal}StatisticPolicyEditor,
};

export * from "./{Pascal}StatisticPolicyEditor";
```

### 3b. Policy editor

Copy `MeanStatisticPolicyEditor.tsx` (single path) or `KaplanMeierStatisticPolicyEditor.tsx` (multiple and optional paths), then adapt the fields.

- The editor is **controlled**. Never mutate `policy`. Call `onChange({ ...policy, allowedPath: set(...nextArray) })`. The parent view persists the change through LDO, so don't `fetch` here.
- `create{Pascal}AllowedPath()` gives each new entry a `#{name}-allowed-path-xxxx` id and seeds every graph-path field with `ensureGraphPathIds(createEmptyGraphPath())`, every set with `set()`, and every threshold with a default of `1`.
- Use `GraphPathFieldEditor` (pass `gpOptions` through) for graph paths and `NumericTextInput` for thresholds. After editing a path, wrap it with `ensureGraphPathIds(next)`.
- Keep the existing look: `useTheme()` colors, `StyleSheet` inside `useMemo`, card per allowed path, `Trash2` corner remove button, and an "Add Allowed Path" `Button variant="secondary"` from `linked-data-browser`.
- See `.cursor/rules/linked-data-browser-components.mdc` for other components.

---

## Step 4: Wiring

Missing any one of these causes "cannot find module" errors or a plugin that silently doesn't appear.

### 4a. Root TypeScript config
- `tsconfig.base.json` → `compilerOptions.paths`: add `@oxfordia/stat-plugin-{name}_core`, `_server`, `_ui` → `./packages/<pkg>/src/index.ts` (next to the mean entries).
- `tsconfig.json` → `references`: add all three `./packages/<pkg>/tsconfig.json`.

### 4b. Server registration
- `packages/pod-server/package.json` dependencies: `"@oxfordia/stat-plugin-{name}_server": "*"`
- `packages/pod-server/tsconfig.json` references: `{ "path": "../stat-plugin-{name}_server" }`
- `packages/pod-server/src/index.ts`: import `{camel}Plugin` and append it to `defaultStatisticPlugins`.

### 4c. UI registration
- `packages/pod-ui/package.json` dependencies: `"@oxfordia/stat-plugin-{name}_ui": "*"`
- `packages/pod-ui/tsconfig.json` references: `{ "path": "../stat-plugin-{name}_ui" }`
- `packages/pod-ui/src/index.ts`: import `{camel}StatisticPluginUi` and append it to `defaultStatisticPluginUis`.
- No Metro change is needed. `packages/pod-ui/metro.config.js` resolves any `@oxfordia/<pkg>` to `packages/<pkg>/src/index.ts` automatically.

### 4d. Link workspaces
Run `npm install` at the root so npm symlinks the new packages into `node_modules/@oxfordia/`.

### 4e. Default access rules (optional, ask first)
`packages/data-plugin-nemaline_ui/src/defaultStatisticAccessRule.ts` (and the angelman equivalent) seed new access-rule documents with mean and KM policies built from data-plugin shortcuts. If the new statistic should be on by default for a dataset, add a `createDefault{Pascal}AllowedPath` there along with the matching `tsconfig.json` reference to `../stat-plugin-{name}_core`. This changes what data is exposed by default, so confirm with the user before doing it.

---

## Step 5: R client (`packages/oxfordiar.stat.{rname}`)

Copy `packages/oxfordiar.stat.mean/` and rename throughout:

```
DESCRIPTION          # Package: oxfordiar.stat.{rname}; Imports: oxfordiar (>= 0.0.0.9000); same version as siblings
NAMESPACE            # export(ox_{snake})  (maintained by hand)
.Rbuildignore, .lintr   # copy unchanged
project.json         # Nx name oxfordiar-stat-{rname}; replace every package path / tarball glob
R/package.R          # "_PACKAGE"
R/{name}.R
scripts/test.R       # replace the package name and temp-lib dir name
tests/testthat.R
tests/testthat/test-{name}.R
```

### 5a. `R/{name}.R`

```r
#' Run a ... Query
#'
#' @param shortcut Data shortcut or graph path.
#' @param targets One or more targets created by `ox_target()`.
#' @param auth Default authentication configuration.
#' @param fail_fast Whether to stop on the first target error.
#'
#' @export
ox_{snake} <- function(shortcut, targets, auth = oxfordiar::ox_auth_none(), fail_fast = TRUE) {
  shortcut <- ox_{snake}_path(shortcut, "shortcut")
  oxfordiar::ox_query(
    route = "{name}",
    statistic = "{name}",
    targets = targets,
    auth = auth,
    fields = list(graphPath = shortcut),   # keys MUST equal the server querySchema property names
    parse_result = ox_{snake}_parse_result,
    combine_results = ox_{snake}_combine_results,
    fail_fast = fail_fast
  )
}
```

- `ox_{snake}_parse_result(payload, target = NULL)` turns one pod's JSON into a `data.frame` with explicit types (`as.numeric`, `as.integer(round(...))`) and `NA` defaults through a local `%||%`.
- `ox_{snake}_combine_results(rows)` pools results across pods **correctly for the statistic**. Mean count-weights the per-target means. Return a zero-row typed `data.frame` when `rows` is empty. Omit it only if row-binding is the correct combination (KM omits it and `ox_query` falls back to `ox_bind_rows_fill`).
- `ox_{snake}_path()` accepts only `ox_data_shortcut` or `ox_graph_path` objects and rejects bare strings with an error that mentions `ox_data_shortcut`.
- Keep helpers unexported. Stay within the `.lintr` limits (80-character lines).

### 5b. Tests

Mirror `tests/testthat/test-mean.R`. Use `testthat::local_mocked_bindings(ox_perform_request = ..., .package = "oxfordiar")` to assert the `route` and body field names and to return canned payloads. Cover a single target, multi-target pooling (`result$data` plus `result$by_target`), and string-shortcut rejection.

### 5c. Register with release tooling
Add `packages/oxfordiar.stat.{rname}` / `"oxfordiar.stat.{rname}"` next to the mean and KM entries in:
- `scripts/release-r.sh` (both `PACKAGES` and `DEPENDENT_PACKAGES`)
- `scripts/release-r-checklist.R`
- `scripts/release-r-preflight.R`
- `scripts/release-r-winbuilder.R`

---

## Step 6: Docs

- Add the three TS packages and the R package to the package lists in `CLAUDE.md` (Plugin System → Statistic Plugins, and R Packages) and `README.md`, matching the existing entries.
- Each new package gets a short `README.md` in the same "Concepts / Example" format as mean's.

---

## Step 7: Verify

Run these and report actual results. Don't claim success if a command failed.

```bash
npm install
npm --prefix packages/stat-plugin-{name}_core run build:ldo   # generated files up to date
npm run check:types                                           # server + UI + whole monorepo
npm test                                                      # vitest, including your new tests
Rscript packages/oxfordiar.stat.{rname}/scripts/test.R
npm run lint:r && npm run format:r:check
```

End-to-end, if a triplestore is available:
1. `npm run dev`, open `http://localhost:3000`, open a resource's `.statistic-access-rule.ttl`, and confirm the new statistic appears with its `displayName`. Add a policy, edit it, save, and reload.
2. `POST /.api/stat/{name}` with an allowed path → 200. With a disallowed path → 403 and your pre-query message. With data below the threshold → 403 and your post-query message.
3. From R: `ox_{snake}(shortcut, ox_targets(...))` against two pods from `npm run dev:pods`.

## Final checklist

- [ ] `name` == `route` == `statisticName` in `createPolicy`/`isPolicy` == R `route`/`statistic`
- [ ] `.shex` copies the `Graph*Shape` declarations verbatim; generated files regenerated and committed
- [ ] `querySchema` has `resourceUri` (uri) and `additionalProperties: false`; optional inputs normalised
- [ ] Pre-query enforces the allow-list; post-query enforces **every** threshold in the shape (no `return true` stubs)
- [ ] Evaluation functions are pure and unit-tested
- [ ] UI editor is controlled, uses `set()`, `ensureGraphPathIds`, unique `#` ids
- [ ] `tsconfig.base.json` paths, root `tsconfig.json` refs, pod-server and pod-ui package.json, tsconfig, and `index.ts` all updated
- [ ] R package: request field names match `querySchema`, `combine_results` pools correctly, tests mock `ox_perform_request`, release scripts updated
- [ ] `check:types`, `npm test`, R tests, and R lint all pass
