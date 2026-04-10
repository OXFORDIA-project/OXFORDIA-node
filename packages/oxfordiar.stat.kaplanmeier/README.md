# `oxfordiar.stat.kaplanmeier`

Kaplan-Meier statistic queries for Oxfordia R.

`ox_kaplan_meier()` calculates Kaplan-Meier inputs across one or more targets.
It accepts data shortcuts or full graph paths. It does not accept shortcut names
as plain strings.

## Install

If the packages are available on CRAN:

```r
install.packages(
  c("oxfordiar", "oxfordiar.data.nemaline", "oxfordiar.stat.kaplanmeier"),
  repos = "https://cloud.r-project.org"
)
```

## Quick Start

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.kaplanmeier)

result <- ox_kaplan_meier(
  time = ox_nemaline_shortcut("KaplanMeierTime"),
  event = ox_nemaline_shortcut("KaplanMeierEvent"),
  group_by = ox_nemaline_shortcut("ClusterCategory"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

`ox_kaplan_meier()` returns an `ox_result_set`. The Kaplan-Meier rows are in
`result$data`. When `group_by` is supplied, `result$grouped` also contains data
frames split by group across all successful targets.

## API

### `ox_kaplan_meier(time, event, targets, auth = oxfordiar::ox_auth_none(), group_by = NULL, fail_fast = TRUE)`

Arguments:

- `time`: an `ox_data_shortcut` or `ox_graph_path`
- `event`: an `ox_data_shortcut` or `ox_graph_path`
- `targets`: one or more `ox_target()` objects
- `auth`: default authentication configuration
- `group_by`: optional `ox_data_shortcut` or `ox_graph_path`
- `fail_fast`: if `TRUE`, stop on the first target error; if `FALSE`, collect
  target errors in `result$errors`

Behavior:

- `time`, `event`, and `group_by` may be shortcut objects from a data package
- `time`, `event`, and `group_by` may also be manual graph paths
- plain strings such as `"KaplanMeierTime"` are rejected on purpose

### Return Value

`ox_kaplan_meier()` returns an `ox_result_set` list with:

- `data`: data frame of successful Kaplan-Meier rows
- `by_target`: named list of successful per-target Kaplan-Meier data frames
- `grouped`: when `group_by` is supplied, a named list of grouped data frames
- `errors`: data frame of target errors when `fail_fast = FALSE`
- `responses`: raw successful request/response entries
- `route`, `statistic`, `fields`, `targets`: query metadata

`result$data` is a data frame with these columns:

- `target`
- `resource_uri`
- `statistic`
- `time`
- `event`
- `group`
- `group_value`

`group` is the display label. `group_value` is the raw group identifier returned
by the server. For ungrouped queries, both are typically `NA`.

When `group_by` is supplied, `result$grouped` is a named list of data frames
split by group label across all successful targets.

## Examples

### Grouped Kaplan-Meier Query

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.kaplanmeier)

result <- ox_kaplan_meier(
  time = ox_nemaline_shortcut("KaplanMeierTime"),
  event = ox_nemaline_shortcut("KaplanMeierEvent"),
  group_by = ox_nemaline_shortcut("ClusterCategory"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
result$grouped
```

### Ungrouped Kaplan-Meier Query

```r
result <- ox_kaplan_meier(
  time = ox_nemaline_shortcut("KaplanMeierTime"),
  event = ox_nemaline_shortcut("KaplanMeierEvent"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

### Kaplan-Meier Query Over Manual Graph Paths

```r
library(oxfordiar)
library(oxfordiar.stat.kaplanmeier)

time_path <- ox_graph_path(
  start = ox_node_filter(iri = "https://example.org/Person")
)

event_path <- ox_graph_path(
  start = ox_node_filter(iri = "https://example.org/Person")
)

result <- ox_kaplan_meier(
  time = time_path,
  event = event_path,
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  )
)

result$data
```

### Collect Per-Target Errors Instead of Failing Fast

```r
result <- ox_kaplan_meier(
  time = ox_nemaline_shortcut("KaplanMeierTime"),
  event = ox_nemaline_shortcut("KaplanMeierEvent"),
  group_by = ox_nemaline_shortcut("ClusterCategory"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl"),
    ox_target("site_b", "https://pod.example.org/bob/data.ttl")
  ),
  fail_fast = FALSE
)

result$data
result$errors
```
