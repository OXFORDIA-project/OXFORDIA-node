# `oxfordiar`

Common Oxfordia runtime for R.

`oxfordiar` is the shared runtime for the Oxfordia R ecosystem. It provides:

- authentication helpers
- target definitions
- graph-path builders
- data shortcut types
- low-level federated query execution

Use statistic-specific packages for actual analyses:

- [`oxfordiar.data.nemaline`](../oxfordiar.data.nemaline/README.md) for nemaline shortcuts
- [`oxfordiar.stat.mean`](../oxfordiar.stat.mean/README.md) for mean queries
- [`oxfordiar.stat.kaplanmeier`](../oxfordiar.stat.kaplanmeier/README.md) for Kaplan-Meier queries

## Package Usage

### Install

If the packages are available on CRAN, install the runtime plus whichever data
and statistic packages you want to use:

```r
install.packages(
  c("oxfordiar", "oxfordiar.data.nemaline", "oxfordiar.stat.mean"),
  repos = "https://cloud.r-project.org"
)
```

For Kaplan-Meier queries instead of means:

```r
install.packages(
  c("oxfordiar", "oxfordiar.data.nemaline", "oxfordiar.stat.kaplanmeier"),
  repos = "https://cloud.r-project.org"
)
```

### Quick Start

This package does not run statistics by itself. It supplies the common runtime
used by the stat packages.

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.mean)

targets <- ox_targets(
  ox_target(
    name = "site_a",
    resource_uri = "https://pod-a.example.org/alice/data.ttl"
  )
)

result <- ox_mean(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = targets
)

result$data
```

`ox_mean()` returns an `ox_result_set`, not a bare data frame. The actual result
rows are in `result$data`.

See the package-specific READMEs for higher-level usage:

- [`oxfordiar.data.nemaline`](../oxfordiar.data.nemaline/README.md)
- [`oxfordiar.stat.mean`](../oxfordiar.stat.mean/README.md)
- [`oxfordiar.stat.kaplanmeier`](../oxfordiar.stat.kaplanmeier/README.md)

### API

#### Authentication

`ox_auth_none()`

Creates a no-auth configuration.

```r
auth <- ox_auth_none()
```

`ox_auth_solid(issuer = NULL, client_id = NULL, client_secret = NULL, safety_margin = 30L, session = NULL)`

Creates a Solid auth configuration. Use either:

- `issuer`, `client_id`, and `client_secret`
- `session = solidauthr::solid_session(...)`

```r
auth <- ox_auth_solid(
  issuer = "https://solid-idp.example.org",
  client_id = Sys.getenv("SOLID_CLIENT_ID"),
  client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
)
```

`ox_auth_bearer(token)`

Creates bearer-token auth.

```r
auth <- ox_auth_bearer("my-token")
```

`ox_auth_headers(headers)`

Creates raw header-based auth from a named list.

```r
auth <- ox_auth_headers(list(Authorization = "Bearer my-token"))
```

#### Targets

`ox_target(name, resource_uri, label = NULL, base_url = NULL, auth = NULL, api_path = "/.api/stat", description = NULL)`

Creates a query target.

Arguments:

- `name`: target name used in result provenance
- `resource_uri`: dataset resource URI
- `label`: optional human-readable label
- `base_url`: optional explicit API origin; if omitted, the origin is derived
  from `resource_uri`
- `auth`: optional per-target auth override
- `api_path`: API path prefix, default `/.api/stat`
- `description`: optional free-text description

Example:

```r
target <- ox_target(
  name = "site_a",
  resource_uri = "https://pod-a.example.org/alice/data.ttl",
  base_url = "https://api-a.example.org",
  auth = ox_auth_bearer("site-a-token")
)
```

`ox_targets(...)`

Collects one or more targets into a list.

```r
targets <- ox_targets(
  ox_target("site_a", "https://pod-a.example.org/alice/data.ttl"),
  ox_target("site_b", "https://pod-b.example.org/bob/data.ttl")
)
```

#### Data Shortcuts

`ox_data_shortcut(name, path, description = NULL)`

Creates a reusable named shortcut object from a graph path. In most cases you
will use a data package such as `oxfordiar.data.nemaline` instead of creating
shortcuts manually.

```r
shortcut <- ox_data_shortcut(
  name = "ExampleValue",
  path = ox_graph_path(
    start = ox_node_filter(iri = "https://example.org/Person")
  )
)
```

#### Graph Paths

`ox_graph_path(start, steps = NULL, target = NULL, name = NULL, id = NULL)`

Creates a graph-path definition for a query field.

`ox_node_filter(rdf_type = NULL, iri = NULL, categories = NULL, predicates = NULL, id = NULL)`

Creates a node filter.

`ox_node_selector(filter)`

Creates a node selector.

`ox_literal_filter(datatype = NULL, lang = NULL, equals = NULL, one_of = NULL, min = NULL, max = NULL, id = NULL)`

Creates a literal filter.

`ox_literal_selector(filter)`

Creates a literal selector.

`ox_predicate_filter(predicate, inverse = FALSE, some = NULL, every = NULL, none = NULL, id = NULL)`

Creates a predicate constraint.

`ox_traversal_step(via, inverse = FALSE, where = NULL, id = NULL)`

Creates one traversal step within a graph path.

Example:

```r
path <- ox_graph_path(
  start = ox_node_filter(
    predicates = list(
      ox_predicate_filter(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        some = ox_node_selector(
          ox_node_filter(
            iri = "https://w3id.org/semanticarts/ns/ontology/gist/Person"
          )
        )
      )
    )
  ),
  steps = list(
    ox_traversal_step("https://w3id.org/semanticarts/ns/ontology/gist/numericValue")
  )
)
```

#### Low-Level Query Execution

`ox_query(route, targets, fields = list(), auth = ox_auth_none(), parse_result = NULL, combine_results = NULL, statistic = route, fail_fast = TRUE)`

Runs a federated query directly against one or more targets.

Arguments:

- `route`: API route segment such as `"mean"`
- `targets`: one or more `ox_target()` objects
- `fields`: named list of request fields
- `auth`: default auth configuration
- `parse_result`: function that converts one target payload into rows
- `combine_results`: function that combines successful target rows
- `statistic`: statistic label used in result provenance
- `fail_fast`: if `TRUE`, stop on the first target error; if `FALSE`, collect
  target errors in `result$errors`

Field values may be:

- scalar values
- `ox_data_shortcut` objects
- `ox_graph_path` objects

Example:

```r
result <- ox_query(
  route = "mean",
  statistic = "mean",
  targets = ox_targets(
    ox_target("site_a", "https://pod-a.example.org/alice/data.ttl")
  ),
  fields = list(
    graphPath = ox_nemaline_shortcut("BaselineAge")
  ),
  parse_result = function(payload, target) {
    data.frame(
      mean = as.numeric(payload$mean),
      count = as.integer(payload$count),
      stringsAsFactors = FALSE
    )
  }
)
```

#### Return Value

`ox_query()` returns an `ox_result_set` list with:

- `data`: data frame of successful rows
- `by_target`: named list of successful per-target data frames
- `errors`: data frame of per-target errors
- `responses`: raw successful request/response payloads
- `route`: route used for the query
- `statistic`: statistic label
- `fields`: request fields
- `targets`: targets that were queried

`result$data` is the combined result. `result$by_target` keeps the successful
per-target data frames before any statistic-specific combining.

## Development

### Install Development Dependencies

Install the R-side development tools:

```r
install.packages(
  c("remotes", "testthat", "lintr", "roxygen2"),
  repos = "https://cloud.r-project.org"
)
```

If you want to use Nx wrappers from the monorepo, install the workspace Node
dependencies too:

```sh
npm install
```

Then install the local Oxfordia R packages in dependency order:

```sh
Rscript packages/oxfordiar/scripts/install-deps.R
```

That script installs:

1. `solidauthr`
2. `oxfordiar`
3. `oxfordiar.data.nemaline`
4. `oxfordiar.stat.mean`
5. `oxfordiar.stat.kaplanmeier`

### Smoke Test

Copy the example env file:

```sh
cp packages/oxfordiar/.env.example packages/oxfordiar/.env
```

The smoke test reads that file with base R `readRenviron()`, so it should use
standard `NAME=value` environment-variable syntax.

Fill in real auth and target values for the three smoke-test targets, then run:

```sh
Rscript packages/oxfordiar/scripts/smoke-test.R
```

Or with Nx:

```sh
npx nx run oxfordiar:smoke-test
```

The smoke test runs a mean query and a Kaplan-Meier query in sequence across
three targets. It is intentionally a happy-path example, so the script assumes
the env file defines all of the values it uses.

Configure the mean shortcut with `OX_MEAN_SHORTCUT` and the Kaplan-Meier
shortcuts with:

- `OX_KAPLAN_MEIER_TIME_SHORTCUT`
- `OX_KAPLAN_MEIER_EVENT_SHORTCUT`
- `OX_KAPLAN_MEIER_GROUP_SHORTCUT`

See [packages/oxfordiar/.env.example](./.env.example) for the full env layout.
The script reads these target variables directly:

- `OX_TARGET_1_SERVER_NAME`
- `OX_TARGET_1_RESOURCE_URI`
- `OX_TARGET_2_SERVER_NAME`
- `OX_TARGET_2_RESOURCE_URI`
- `OX_TARGET_3_SERVER_NAME`
- `OX_TARGET_3_RESOURCE_URI`

### Tests

Run the package tests directly:

```sh
Rscript packages/oxfordiar/scripts/test.R
Rscript packages/oxfordiar.data.nemaline/scripts/test.R
Rscript packages/oxfordiar.stat.mean/scripts/test.R
Rscript packages/oxfordiar.stat.kaplanmeier/scripts/test.R
```

Or with Nx:

```sh
npx nx run oxfordiar:test
npx nx run oxfordiar-data-nemaline:test
npx nx run oxfordiar-stat-mean:test
npx nx run oxfordiar-stat-kaplanmeier:test
```

### Lint and Build

Run all R linters in the monorepo:

```sh
npm run lint:r
```

Build a package tarball:

```sh
npx nx run oxfordiar:build
```

### Publish

Recommended release order:

1. `solidauthr`
2. `oxfordiar`
3. `oxfordiar.data.nemaline`
4. `oxfordiar.stat.mean`
5. `oxfordiar.stat.kaplanmeier`

Recommended release workflow:

1. Update `DESCRIPTION` metadata and the package version.
2. Regenerate Rd docs and `NAMESPACE` with `roxygen2::roxygenise()`.
3. Run the relevant package tests and `npm run lint:r`.
4. Build the source tarball with `R CMD build` or the Nx `build` target.
5. Run `R CMD check --as-cran` on the built tarball.
6. Submit the packages to CRAN in dependency order.

To update and tag all Oxfordia R package versions together, use:

```sh
bash scripts/release-r.sh get
bash scripts/release-r.sh set 0.1.0
bash scripts/release-r.sh tag
```

Or do the version update and tag creation in one step:

```sh
bash scripts/release-r.sh release 0.1.0
```

The script treats these packages as one release unit:

- `oxfordiar`
- `oxfordiar.data.nemaline`
- `oxfordiar.stat.mean`
- `oxfordiar.stat.kaplanmeier`

It updates every `DESCRIPTION` version, rewrites dependent package imports to
`oxfordiar (>= <version>)`, and creates an annotated git tag named
`r-v<version>`.
