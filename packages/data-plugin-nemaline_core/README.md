# `data-plugin-nemaline_core`

Nemaline data-plugin core package for the Nemaline Myopathy Data Federation pilot analysis (2026/2027).

Concepts:
- Holds the nemaline ShEx source and generated LDO files. The schema follows
  "Guidance for pilot analysis data entry" V1.0 (13 Oct 2026): one `gist:Person`
  per spreadsheet row, describing the baseline visit.
- Numeric fields are `gist:Magnitude`s on the person, distinguished by `gist:hasAspect`
  (ages in decimal years, weight in kg, scores unitless, …).
- Dropdown fields are `gist:isCategorizedBy` values (`nm:Gene_NEB`, `nm:Zygosity_Hemizygous`, …).
- Variant 1 and variant 2 are separate `nm:GeneticVariant` parts (`gist:hasPart`),
  tagged `nm:VariantPosition_1` / `nm:VariantPosition_2`, with the HGVS
  nomenclature in `gist:containedText`.
- Also models fields derived at upload by `data-plugin-nemaline_ui`: `ZScoreH`, `ZScoreW`,
  `CurrentFN`, `AmbGainEvent`, `AmbGainTime`.
- Publishes one graph-path shortcut per field through `nemalineDataPlugin`
  (e.g. `BaselineAge`, `MFM32Total`, `CausativeGene`, `Variant1Pathogenicity`, `ZScoreH`).

Example:
```ts
import { nemalineDataPlugin, PersonShapeType } from "@oxfordia/data-plugin-nemaline_core";
```
