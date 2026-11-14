# `oxfordiar.stat.standarddeviation`

Standard deviation statistic queries for Oxfordia R.

`ox_standard_deviation()` calculates federated sample standard deviations across
one or more targets. It accepts a data shortcut or a full graph path. It does
not accept shortcut names as plain strings.

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
library(oxfordiar.stat.standarddeviation)

result <- ox_standard_deviation(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

`ox_standard_deviation()` returns an `ox_result_set`. `result$data` contains the
pooled standard deviation, mean and count, and `result$by_target` keeps the
individual per-target data frames.

## API

### `ox_standard_deviation(shortcut, targets, auth = oxfordiar::ox_auth_none(), fail_fast = TRUE)`

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
- per-target results are pooled into the standard deviation of the combined
  sample using each target's standard deviation, mean and count
- each pod withholds its result (HTTP 403) when the sample has fewer than two
  values, fewer than the policy `minCount`, or fewer distinct values than the
  policy `minDistinctValues`; with `fail_fast = FALSE` such targets appear in
  `result$errors` and are left out of the pooled result

### Return Value

`ox_standard_deviation()` returns an `ox_result_set` list with:

- `data`: one-row data frame containing the pooled standard deviation, mean and
  count
- `by_target`: named list of successful per-target data frames
- `errors`: data frame of target errors when `fail_fast = FALSE`
- `responses`: raw successful request/response entries
- `route`, `statistic`, `fields`, `targets`: query metadata

`result$data` is a data frame with these columns:

- `standard_deviation`
- `mean`
- `count`

Each entry in `result$by_target` is a data frame with these columns:

- `target`
- `resource_uri`
- `statistic`
- `standard_deviation`
- `mean`
- `count`
- `distinct_count`

## Grouping

Pass `group_by` (one shortcut, or a list of two) to break the result down,
for example by causative gene, or by gene and gender:

```r
result <- ox_standard_deviation(
  ox_nemaline_shortcut("BaselineAge"),
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

### Standard Deviation Over a Nemaline Shortcut

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.standarddeviation)

targets <- ox_targets(
  ox_target("site_a", "https://pod.example.org/alice/data.ttl"),
  ox_target("site_b", "https://pod.example.org/bob/data.ttl")
)

result <- ox_standard_deviation(
  shortcut = ox_nemaline_shortcut("BaselineAge"),
  targets = targets
)

result$data
result$by_target
```

### Collect Per-Target Errors Instead of Failing Fast

```r
result <- ox_standard_deviation(
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
