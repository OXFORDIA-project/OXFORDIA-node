# `oxfordiar.data.nemaline`

Nemaline shortcut catalog for Oxfordia R, for the Nemaline Myopathy Data
Federation pilot analysis (2026/2027) template.

This package provides named nemaline dataset shortcuts as `ox_data_shortcut`
objects. Those shortcuts can be passed directly to statistic packages such as
`oxfordiar.stat.count`, `oxfordiar.stat.mean`,
`oxfordiar.stat.standarddeviation` and `oxfordiar.stat.kaplanmeier`. The
original nemaline shortcuts now live in `oxfordiar.data.legacynemaline`.

`inst/nemaline-shortcuts.json` is a copy of
`packages/data-plugin-nemaline_core/src/shortcuts.json`; a test in the
monorepo fails if the two drift apart.

## Install

The Oxfordia R packages are not on CRAN yet. See the
[`oxfordiar` install instructions](../oxfordiar/README.md#install) for
installing from GitHub or from a local clone.

## API

### `ox_nemaline_shortcut(name)`

Looks up one shortcut by name and returns an `ox_data_shortcut`. Lookup is
case-insensitive and ignores spaces, underscores and hyphens, so
`"currentFN"`, `"current fn"` and `"CurrentFN"` are the same. An unknown name
raises an error listing the available shortcuts.

### `ox_nemaline_shortcuts()`

Returns a named list of every nemaline shortcut.

## Available Shortcuts

- `Participant`: every participant (use with `ox_count()` for totals and
  breakdowns).
- One shortcut per spreadsheet field, e.g. `BaselineAge`, `CausativeGene`,
  `GenderAssignedAtBirth`, `Zygosity`, `MFM32Total`, `Weight`, `Height`,
  `Variant1Pathogenicity`.
- Fields derived at upload: `ZScoreH`, `ZScoreW` (UK-WHO height/weight-for-age
  Z-scores), `CurrentFN` (Walker / Sitter / Non-Sitter), `AmbGainEvent` and
  `AmbGainTime` (Kaplan-Meier inputs for attaining ambulation).

Run `names(ox_nemaline_shortcuts())` for the full list.

## Example

```r
library(oxfordiar)
library(oxfordiar.data.nemaline)
library(oxfordiar.stat.count)

result <- ox_count(
  ox_nemaline_shortcut("Participant"),
  targets = ox_targets(
    ox_target("site_a", "https://pod.example.org/alice/data.ttl")
  ),
  group_by = ox_nemaline_shortcut("CausativeGene")
)

result$data
```
