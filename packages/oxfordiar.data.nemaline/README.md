# `oxfordiar.data.nemaline`

Nemaline shortcut catalog for Oxfordia R.

This package provides named nemaline dataset shortcuts as `ox_data_shortcut`
objects. Those shortcuts can be passed directly to statistic packages such as
`oxfordiar.stat.mean` and `oxfordiar.stat.kaplanmeier`.

## Install

If the packages are available on CRAN:

```r
install.packages(
  c("oxfordiar", "oxfordiar.data.nemaline"),
  repos = "https://cloud.r-project.org"
)
```

If you also want to run statistics:

```r
install.packages(
  c("oxfordiar", "oxfordiar.data.nemaline", "oxfordiar.stat.mean", "oxfordiar.stat.kaplanmeier"),
  repos = "https://cloud.r-project.org"
)
```

## Quick Start

```r
library(oxfordiar.data.nemaline)

baseline_age <- ox_nemaline_shortcut("BaselineAge")
all_shortcuts <- ox_nemaline_shortcuts()

baseline_age
names(all_shortcuts)
```

## API

### `ox_nemaline_shortcut(name)`

Looks up one shortcut by name and returns an `ox_data_shortcut`.

Behavior:

- lookup is case-insensitive
- spaces, underscores, and hyphens are normalized during lookup
- an unknown name raises an error listing the available shortcuts

Example:

```r
baseline_age <- ox_nemaline_shortcut("baseline age")
```

### `ox_nemaline_shortcuts()`

Returns a named list of every nemaline shortcut in the package.

Example:

```r
shortcuts <- ox_nemaline_shortcuts()
names(shortcuts)
```

## Available Shortcuts

- `PersonId`: person identifier text value.
- `ClusterCategory`: nemaline cluster category.
- `GeneticGroup`: nemaline genetic variant grouping.
- `AmbulationStatus`: ambulant vs non-ambulant status.
- `DominantHand`: dominant hand category.
- `BelowAverageFlag`: below-average performance flag.
- `BaselineAge`: baseline age numeric value.
- `LoAAge`: age at loss of ambulation.
- `TotalMFM`: total MFM32 aggregate score.
- `KaplanMeierEvent`: Kaplan-Meier event indicator.
- `KaplanMeierTime`: Kaplan-Meier time-to-event.
- `MFMVisitTimeFromBaseline`: elapsed time from study enrollment for an MFM visit.
- `MFMVisitScore`: MFM32 visit score.

## Examples

### Use a Nemaline Shortcut With Mean

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

### Use Nemaline Shortcuts With Kaplan-Meier

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
