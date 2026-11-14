# `oxfordiar.stat.count`

Count statistic queries for Oxfordia R.

`ox_count()` calculates federated counts across one or more targets. It accepts a
data shortcut or a full graph path. It does not accept shortcut names as plain
strings.

## Install

The Oxfordia R packages are not on CRAN yet. See the
[`oxfordiar` install instructions](../oxfordiar/README.md#install) for
installing from GitHub or from a local clone. They install this package along
with `solidauthr`, `oxfordiar` and the other Oxfordia packages, in the right
order.

## Quick Start

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.count)

result <- ox_count(
  shortcut = ox_nemaline_shortcut("Participant"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

`ox_count()` returns an `ox_result_set`. `result$data` contains the summed
count, and `result$by_target` keeps the individual per-target count data frames.

## API

### `ox_count(shortcut, targets, auth = oxfordiar::ox_auth_none(), fail_fast = TRUE)`

Arguments:

- `shortcut`: an `ox_data_shortcut` or `ox_graph_path`
- `targets`: one or more `ox_target()` objects
- `auth`: default authentication configuration
- `fail_fast`: if `TRUE`, stop on the first target error; if `FALSE`, collect
  target errors in `result$errors`

Behavior:

- `shortcut` may be a shortcut object from a data package such as
  `ox_nemaline_shortcut("Participant")`
- `shortcut` may also be a manually constructed `ox_graph_path()`
- plain strings such as `"PersonId"` are rejected on purpose
- each pod counts the distinct nodes or values the graph path resolves to
- each pod withholds its count (HTTP 403) when it is below that pod's policy
  `minCount`; with `fail_fast = FALSE` such targets appear in `result$errors`
  and are left out of the summed count

### Return Value

`ox_count()` returns an `ox_result_set` list with:

- `data`: one-row data frame containing the overall federated count (the sum
  of the per-target counts)
- `by_target`: named list of successful per-target count data frames
- `errors`: data frame of target errors when `fail_fast = FALSE`
- `responses`: raw successful request/response entries
- `route`, `statistic`, `fields`, `targets`: query metadata

`result$data` is a data frame with these columns:

- `count`

Each entry in `result$by_target` is a data frame with these columns:

- `target`
- `resource_uri`
- `statistic`

- `count`

## Grouping

Pass `group_by` (one shortcut, or a list of two) to break the result down,
for example by causative gene, or by gene and gender:

```r
result <- ox_count(
  ox_nemaline_shortcut("Participant"),
  targets = targets,
  group_by = list(
    ox_nemaline_shortcut("CausativeGene"),
    ox_nemaline_shortcut("GenderAssignedAtBirth")
  )
)
```

`result$data` has one row per group: a column per group-by (named after the
shortcut, holding the label), the combined statistic, `sites` (targets that
reported the group) and `suppressed_sites` (targets that withheld it because
it fell below their minimum count; such combined values are partial).
`result$per_site` has the same rows for each target. Each group-by must be
allowed for the shortcut by the target's statistic access rule.

## Examples

### Count Over a Nemaline Shortcut

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.count)

targets <- ox_targets(
  ox_target("site_a", "https://pod.example.org/alice/data.ttl"),
  ox_target("site_b", "https://pod.example.org/bob/data.ttl")
)

result <- ox_count(
  shortcut = ox_nemaline_shortcut("Participant"),
  targets = targets
)

result$data
result$by_target
```

### Count Over a Manual Graph Path

```r
library(oxfordiar)
library(oxfordiar.stat.count)

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

result <- ox_count(
  shortcut = path,
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

### Collect Per-Target Errors Instead of Failing Fast

```r
result <- ox_count(
  shortcut = ox_nemaline_shortcut("Participant"),
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
result <- ox_count(
  shortcut = ox_nemaline_shortcut("Participant"),
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
