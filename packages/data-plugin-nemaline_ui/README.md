# `data-plugin-nemaline_ui`

Nemaline linked-data-browser UI package for the pilot analysis template.

Concepts:
- Packages the nemaline `ResourceView` (participant table with nested variants) and `ResourceCreator`.
- The CSV importer reads the "Pilot Run NM Data fed XLSX file for pod upload V1.0"
  template saved as a plain CSV. Columns are read by position (several headers repeat),
  formula columns are ignored and decimal ages are recomputed from years + months.
  Blank rows are skipped; unrecognised values are skipped and reported.
- Participants are identified only by spreadsheet row number (`#participant-row-<n>`);
  the template deliberately has no participant ID column.
- Computes derived fields at upload (`derivedFields.ts`), replacing per-analysis mutation:
  - `ZScoreH` / `ZScoreW`: height/weight-for-age Z-scores at baseline from the UK-WHO
    reference, a port of `sitar::LMS2z(..., "ukwhopt")` (`lmsZScore.ts`,
    `ukWhoGrowthReference.json`). None for participants over 20 or without a recorded sex.
  - `CurrentFN`: `Walker` / `Sitter` / `Non-Sitter` from baseline ambulation and sitting.
  - `AmbGainEvent` / `AmbGainTime`: Kaplan-Meier event and time for attaining ambulation
    (time = age ambulation achieved, 18 if not recorded; otherwise censored at baseline age).
- Writes a default statistic access rule allowing the mean of every numeric and derived
  field with a minimum count of 3 (the UK default from the pilot guidance), and
  Kaplan-Meier on `AmbGainTime`/`AmbGainEvent` grouped by gene, gender, zygosity or `CurrentFN`.

Example:
```ts
import { nemalineDataPluginUi } from "@oxfordia/data-plugin-nemaline_ui";
```
