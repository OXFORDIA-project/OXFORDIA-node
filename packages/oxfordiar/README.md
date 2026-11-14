# `oxfordiar`

Common Oxfordia runtime for R.

`oxfordiar` is the shared runtime for the Oxfordia R ecosystem. It provides:

- authentication helpers
- target definitions
- graph-path builders
- data shortcut types
- low-level federated query execution

Use statistic-specific packages for actual analyses:

- [`oxfordiar.data.nemaline`](../oxfordiar.data.nemaline/README.md) for nemaline pilot shortcuts
- [`oxfordiar.data.legacynemaline`](../oxfordiar.data.legacynemaline/README.md) for the original nemaline shortcuts
- [`oxfordiar.stat.mean`](../oxfordiar.stat.mean/README.md) for mean queries
- [`oxfordiar.stat.kaplanmeier`](../oxfordiar.stat.kaplanmeier/README.md) for Kaplan-Meier queries
- [`oxfordiar.stat.count`](../oxfordiar.stat.count/README.md) for count queries
- [`oxfordiar.stat.standarddeviation`](../oxfordiar.stat.standarddeviation/README.md) for standard deviation queries

## Package Usage

### Install

The Oxfordia R packages are published to the Oxfordia R repository, a
CRAN-style repository hosted on GitHub Pages. They are not on CRAN. You do not
need a clone of this repo, Node, or GitHub credentials; plain
`install.packages()` works.

#### From the Oxfordia R repository (recommended)

Requires R 4.1 or newer. Add the Oxfordia repository alongside CRAN, which
supplies `solidauthr` (the Solid authentication package, published to CRAN on
its own) and the third-party dependencies (`httr2`, `jose`, `jsonlite`):

```r
install.packages(
  c(
    "solidauthr",
    "oxfordiar",
    "oxfordiar.data.nemaline",
    "oxfordiar.stat.count",
    "oxfordiar.stat.mean",
    "oxfordiar.stat.standarddeviation",
    "oxfordiar.stat.kaplanmeier"
  ),
  repos = c(
    oxfordia = "https://oxfordia-project.github.io/OXFORDIA-node/r",
    CRAN = "https://cloud.r-project.org"
  )
)
```

This is the full set used by `smoke-test-next.R`. Leave out any statistic
package you don't need, or add `oxfordiar.data.legacynemaline` for the original
nemaline shortcuts. List `solidauthr` and `oxfordiar` explicitly as above:
`install.packages()` only upgrades the packages you name, so leaving them out
can keep an older copy of the runtime.

To upgrade later, run the same command again.

On macOS and Windows you will see a warning like
`unable to access index for repository .../bin/macosx/...`. This is expected:
the Oxfordia packages are pure R and published as source only, so R falls back
to the source packages. They need no compiler.

To use the repository in every session without repeating `repos`, add it to
your `~/.Rprofile`:

```r
local({
  repos <- getOption("repos")
  repos["oxfordia"] <- "https://oxfordia-project.github.io/OXFORDIA-node/r"
  options(repos = repos)
})
```

Then `install.packages("oxfordiar.stat.mean")` and `update.packages()` work as
for any CRAN package.

#### Versions and the `next` channel

The R packages are published by the same GitHub Actions workflows as the pod,
so every pod release has a matching set of R packages. R versions can only
contain numbers, so the R version is the pod version without its pre-release
label, plus a build number: pod release `v0.0.1-alpha.8` publishes, for
example, R packages `0.0.1.42`. Each release's notes on GitHub list the exact
R version, and its assets include the R tarballs. The build number always
increases, so a newer release is always a newer R version.

Every push to the `next` branch publishes a pre-release build to a separate
repository. Use it only to try changes before they are released:

```r
repos = c(
  oxfordia = "https://oxfordia-project.github.io/OXFORDIA-node/r-next",
  CRAN = "https://cloud.r-project.org"
)
```

`r-next` keeps only the newest build. Its build numbers are counted separately
from releases, so when switching between `r` and `r-next`, reinstall the
packages rather than relying on `update.packages()`.

#### From release tarballs (offline or pinned)

Every pod release on the
[releases page](https://github.com/OXFORDIA-project/OXFORDIA-node/releases)
has one `.tar.gz` per R package among its assets, named
`<package>_<r-version>.tar.gz`. Download the ones you need and install them in
dependency order, `oxfordiar` first, then the data and statistic packages.
`solidauthr` is not among them; it comes from CRAN:

```r
install.packages(c("solidauthr", "jsonlite"))  # dependencies, from CRAN

version <- "0.0.1.42" # the R version from the release's assets
for (pkg in c(
  "oxfordiar",
  "oxfordiar.data.nemaline",
  "oxfordiar.stat.count",
  "oxfordiar.stat.mean",
  "oxfordiar.stat.standarddeviation",
  "oxfordiar.stat.kaplanmeier"
)) {
  install.packages(sprintf("%s_%s.tar.gz", pkg, version), repos = NULL)
}
```

To pin an exact version from the repository instead, use
`remotes::install_version("oxfordiar", "0.0.1.42", repos = ...)`. Older
release versions stay available under `src/contrib/Archive/`.

#### From a local clone

Use this if you want to edit the packages. Only R is required; Node and the
rest of the monorepo are not needed.

```sh
git clone https://github.com/OXFORDIA-project/OXFORDIA-node.git
cd OXFORDIA-node
Rscript packages/oxfordiar/scripts/install-deps.R
```

The script installs every Oxfordia R package from the checkout in dependency
order.

### Running the smoke test without a clone

`smoke-test-next.R` runs the nemaline pilot analysis (federation summary,
baseline table, statistical comparison and a Kaplan-Meier curve) against one to
three pods. To run it outside this repo:

1. Install the packages from the Oxfordia R repository as shown above.
2. Download `smoke-test-next.R` and `smoke-test.env.example` from the latest
   release into the same folder:

   ```sh
   curl -LO https://github.com/OXFORDIA-project/OXFORDIA-node/releases/latest/download/smoke-test-next.R
   curl -LO https://github.com/OXFORDIA-project/OXFORDIA-node/releases/latest/download/smoke-test.env.example
   ```

   For a `next` pre-release, download them from that pre-release's assets
   instead.
3. Rename `smoke-test.env.example` to `.env` and fill in your Solid client
   credentials (`OX_SOLID_*`) and one to three targets (`OX_TARGET_n_*`).
4. Run it from that folder:

   ```sh
   Rscript smoke-test-next.R
   ```

   or, in RStudio, set the working directory to that folder and
   `source("smoke-test-next.R")`.

The script reads `.env` from its own folder; set `OX_ENV_FILE=/path/to/file`
to use another file. If a package is missing it stops and prints the
`install.packages()` command to fix it. Set `OX_DEBUG=1` to print request and
response details. `OX_KM_GENES` (default `NEB,ACTA1`) picks the genes kept for
the Kaplan-Meier table.

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
  c("remotes", "testthat", "lintr", "roxygen2", "devtools", "usethis", "urlchecker"),
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

That script installs every Oxfordia R package (`solidauthr`, `oxfordiar`, the
data packages and the statistic packages) in dependency order.

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

`smoke-test-next.R` uses the same env file and runs the nemaline pilot
analysis:

```sh
Rscript packages/oxfordiar/scripts/smoke-test-next.R
```

Inside a checkout it loads the package sources with `pkgload::load_all()`, so
it always tests the current code; set `OX_USE_INSTALLED=1` to use the installed
packages instead. Outside a checkout it uses the installed packages (see
[Running the smoke test without a clone](#running-the-smoke-test-without-a-clone)).

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

There is nothing to run locally. The R packages are published by the same
workflows as the pod:

- **Cutting a GitHub release** (see [Release Process](../../README.md#release-process))
  publishes to `https://oxfordia-project.github.io/OXFORDIA-node/r` and
  attaches the R tarballs, `smoke-test-next.R` and `smoke-test.env.example` to
  that release.
- **Pushing to `next`** publishes to
  `https://oxfordia-project.github.io/OXFORDIA-node/r-next` and attaches the
  same files to the automated pre-release.

Both call
[`.github/workflows/publish-r-packages.yml`](../../.github/workflows/publish-r-packages.yml),
which:

1. derives the R version (`<major.minor.patch>.<run number>`, see
   [Versions and the `next` channel](#versions-and-the-next-channel)) and
   stamps it into every `DESCRIPTION` with `scripts/release-r.sh set`
2. builds all packages into the repository on the `gh-pages` branch (`r/` or
   `r-next/`); `r/` moves previous versions to `Archive/`, `r-next/` deletes
   them
3. installs them from that repository in a clean library to check they load
4. pushes to `gh-pages` and waits until GitHub Pages serves the new version
5. hands the tarballs to the release job, which attaches them to the release

The `DESCRIPTION` files in the repo stay at their development version
(`0.0.0.9000`); only the published packages carry the release version.
Re-running a failed release reuses R packages that were already published.

Before a release, run the checks:

```sh
Rscript scripts/release-r-preflight.R
npm run lint:r
```

To try the repository locally:

```sh
Rscript scripts/build-r-repo.R /tmp/oxfordia-r
```

```r
install.packages("oxfordiar.stat.mean", repos = c(
  oxfordia = "file:///tmp/oxfordia-r",
  CRAN = "https://cloud.r-project.org"
), type = "source")
```

`scripts/release-r.sh set <version>` sets every `DESCRIPTION` version and
rewrites the inter-package imports to `oxfordiar (>= <version>)`. CI uses
it; you only need it locally to test a specific version.

These packages are released together, with one shared version.
`packages/solidauthr` is not published here: it is released to CRAN
separately, and `oxfordiar` depends on the CRAN version
(`solidauthr (>= 0.1.2)`). Raise that minimum when `oxfordiar` needs a newer
`solidauthr` feature, after the new version is on CRAN.

- `oxfordiar`
- `oxfordiar.data.nemaline`
- `oxfordiar.data.legacynemaline`
- `oxfordiar.stat.mean`
- `oxfordiar.stat.kaplanmeier`
- `oxfordiar.stat.count`
- `oxfordiar.stat.standarddeviation`
