# `oxfordiar.stat.mean`

Mean statistic queries for Oxfordia R.

`ox_mean()` calculates federated means across one or more targets. It accepts a
data shortcut or a full graph path. It does not accept shortcut names as plain
strings.

## Install

If the packages are available on CRAN:

```r
install.packages(
  c("oxfordiar", "oxfordiar.data.nemaline", "oxfordiar.stat.mean"),
  repos = "https://cloud.r-project.org"
)
```

## Quick Start

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.mean)

result <- ox_mean(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

`ox_mean()` returns an `ox_result_set`. The mean rows are in `result$data`.

## API

### `ox_mean(shortcut, targets, auth = oxfordiar::ox_auth_none(), fail_fast = TRUE)`

Arguments:

- `shortcut`: an `ox_data_shortcut` or `ox_graph_path`
- `targets`: one or more `ox_target()` objects
- `auth`: default authentication configuration
- `fail_fast`: if `TRUE`, stop on the first target error; if `FALSE`, collect
  target errors in `result$errors`

Behavior:

- `shortcut` may be a shortcut object from a data package such as
  `ox_nemaline_shortcut("BaselineAge")`
- `shortcut` may also be a manually constructed `ox_graph_path()`
- plain strings such as `"BaselineAge"` are rejected on purpose

### Return Value

`ox_mean()` returns an `ox_result_set` list with:

- `data`: data frame of successful mean rows
- `errors`: data frame of target errors when `fail_fast = FALSE`
- `responses`: raw successful request/response entries
- `route`, `statistic`, `fields`, `targets`: query metadata

`result$data` is a data frame with these columns:

- `target`
- `resource_uri`
- `statistic`
- `mean`
- `count`

## Examples

### Mean Over a Nemaline Shortcut

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.mean)

targets <- ox_targets(
  ox_target("site_a", "https://pod.example.org/alice/data.ttl"),
  ox_target("site_b", "https://pod.example.org/bob/data.ttl")
)

result <- ox_mean(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = targets
)

result$data
```

### Mean Over a Manual Graph Path

```r
library(oxfordiar)
library(oxfordiar.stat.mean)

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
  )
)

result <- ox_mean(
  shortcut = path,
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

### Collect Per-Target Errors Instead of Failing Fast

```r
result <- ox_mean(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl"),
    ox_target("site_b", "https://pod.example.org/bob/data.ttl")
  ),
  fail_fast = FALSE
)

result$data
result$errors
```

### Use Default Auth and Target-Specific Auth

```r
result <- ox_mean(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = ox_targets(
    ox_target(
      name = "site_a",
      resource_uri = "https://pod.example.org/alice/data.ttl",
      auth = ox_auth_bearer("site-a-token")
    )
  ),
  auth = ox_auth_solid(
    issuer = "https://solid-idp.example.org",
    client_id = Sys.getenv("SOLID_CLIENT_ID"),
    client_secret = Sys.getenv("SOLID_CLIENT_SECRET")
  )
)
```
