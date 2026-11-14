import { describe, it, expect } from "vitest";
import { createLdoDataset, parseRdf, toTurtle, type LdoDataset } from "@ldo/ldo";
import { namedNode } from "@ldo/rdf-utils";
import type { Term } from "@rdfjs/types";
import {
  PersonShapeType,
  nemalineDataPlugin,
} from "@oxfordia/data-plugin-nemaline_core";
import {
  columnIndex,
  convertPilotCsv,
  parseCsv,
  PILOT_COLUMN_COUNT,
  PilotCsvFormatError,
} from "../nemalinePilotCsv";
import { DERIVED_NUMERIC_FIELDS, NUMERIC_COLUMNS } from "../pilotColumns";
import {
  createNemalineDefaultStatisticAccessRuleDocument,
  nemalineDefaultStatisticAccessRuleDocumentShapeType,
} from "../defaultStatisticAccessRule";
import type { LdoBase, ShapeType } from "@ldo/ldo";
import { findGraphPathShortcutByName } from "@oxfordia/data-plugin_core";
import { countStatisticPlugin } from "@oxfordia/stat-plugin-count_core";
import { meanStatisticPlugin } from "@oxfordia/stat-plugin-mean_core";
import { standardDeviationStatisticPlugin } from "@oxfordia/stat-plugin-standard-deviation_core";
import { kaplanMeierStatisticPlugin } from "@oxfordia/stat-plugin-kaplan-meier_core";
import { evaluateCountStatisticAccessRule } from "@oxfordia/stat-plugin-count_server";
import { evaluateMeanStatisticAccessRule } from "@oxfordia/stat-plugin-mean_server";
import { evaluateStandardDeviationStatisticAccessRule } from "@oxfordia/stat-plugin-standard-deviation_server";
import { evaluateKaplanMeierStatisticAccessRule } from "@oxfordia/stat-plugin-kaplan-meier_server";
import { ldArr, toParticipantRow } from "../participantRows";
import { ukWhoZScore } from "../lmsZScore";

const BASE_URI = "https://pod.example/data/Nemalinepilot_test_Oct2026.ttl";
const NM = "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/";
const XSD_DECIMAL = "http://www.w3.org/2001/XMLSchema#decimal";

// Header row of "Pilot Run NM Data fed XLSX file for pod upload V1.0 13Oct2026.xlsx".
const HEADERS = [
  "Age at baseline visit (years)", "Age at Baseline visit (months)", "Decimal age conversion (Baseline visit)",
  "Gender assigned at birth", "Causative gene", "Zygosity", "Number of variants",
  "Variant 1 HGVS nomenclature", "Variant 1 Type", "Variant 1 Consequence", "Loss of function predicted?", "Pathogenicity",
  "Variant 2 HGVS nomenclature", "Variant 2 Type", "Variant 2 Consequence", "Loss of function predicted?", "Pathogenicity",
  "Muscle Biopsy?", "Biopsy result", "Age of First Symptom (years)", "Age of first symptom (months)",
  "Decimal age (first symptom)", "Nature of first syptom(s)", "Age of presentation (years)",
  "Age of presentation (months)", "Decimal age of presentation", "Age of diagnosis (years)",
  "Age of diagnosis (months)", "Decimal age of diagnosis", "Family History", "Ever achieved ambulation?",
  "Age ambulation achieved (years)", "Age ambulation achieved (months)", "Decimal Age",
  "Ambulant at baseline visit", "If N, age ambulation lost (years)", "If N, age ambulation lost (months)",
  "Decimal age", "Ever achieved independent sitting?", "Age independent sitting achieved (years)",
  "Age independent sitting achieved (months)", "Decimal age", "Independent sitting at baseline visit?",
  "If N, age ability to sit independently lost (years)", "If N, age ability to sit independently lost (months)",
  "Decimal age", "Time on ventilation (hours)", "Time off ventilation (hours)", "total hours (should be 24)",
  "Type of ventilation", "Previous ventilation", "Requirement for tube feeding at baseline visit?",
  "If yes age (years) tube feeding commenced", "CEDAS score", "Previous tube feeding", "weight(kg) (1dp)",
  "Height (cm) (1dp)", "Scoliosis?", "If yes cobb angle (degrees)", "Age cobb angle taken (years)",
  "Ever had spinal surgery?", "if Y, age of surgery", "CHOP total best side", "MFM32 total ",
  "MFM32 D1 score", "MFM32 D2 score", "MFM32 D3 score", "Grip strength kg (best) R hand",
  "Grip strength kg (best) L hand", "Make of Device used", "Model of device used",
  "Pinch strength kg (best) R hand", "Pinch strength kg (best ) L hand", "Make of device used",
  "Model of device used",
];

const COMPUTED_ZEROS: Record<string, string> = {
  C: "0", V: "0", Z: "0", AC: "0", AH: "0", AL: "0", AP: "0", AT: "0", AW: "0",
};

function csvRow(values: Record<string, string>): string {
  const cells = new Array<string>(PILOT_COLUMN_COUNT).fill("");
  for (const [column, value] of Object.entries(values)) {
    cells[columnIndex(column)] = /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }
  return cells.join(",");
}

// Every field populated, so every shortcut should resolve for this row.
const FULL_ROW = {
  ...COMPUTED_ZEROS,
  A: "1", B: "6", D: "Female", E: "NEB", F: "Compound Heterozygous", G: "2",
  H: "NM_001271208.2:c.24579G>A, p.(Trp8193*)", I: "Single Nucleotide Variant (SNV)", J: "Nonsense",
  K: "Yes", L: "Pathogenic",
  M: "NM_001271208.2:c.100del", N: "Deletion", O: "Frameshift", P: "Yes", Q: "Likely Pathogenic",
  R: "Yes", S: "Nemaline rods or bodies", T: "0", U: "0.5", W: "Skeletal muscle weakness only",
  X: "0", Y: "3", AA: "2", AB: "0", AD: "No", AE: "Yes", AF: "1", AG: "6", AI: "No",
  AJ: "5", AK: "0", AM: "Yes", AN: "0", AO: "8", AQ: "No", AR: "6", AS: "0",
  AU: "10", AV: "14", AW: "24", AX: "Non-Invasive Ventilation", AY: "no", AZ: "yes", BA: "0.5",
  BB: "3", BC: "no", BD: "12.3", BE: "88.4", BF: "yes", BG: "25", BH: "1.5", BI: "yes", BJ: "10",
  BK: "40", BL: "60", BM: "20", BN: "25", BO: "15", BP: "5.5", BQ: "5.1",
  BR: "Jamar/Performance Health", BS: "Hydraulic Hand Dynamometer", BT: "2.2", BU: "2.1",
  BV: "CITEC", BW: "Pinchmeter",
};

// Months only, an alias, "No 2nd variant" options and two invalid values.
const SPARSE_ROW = {
  ...COMPUTED_ZEROS,
  A: "0", B: "18", D: "male", E: "CFL-2", I: "Deletion",
  N: "No 2nd Variant", O: "No 2nd Variant", P: "No 2nd Variant", Q: "No 2nd variant",
  W: "Sneezing", AJ: "unknown",
};

const CSV = [
  HEADERS.map((h) => (h.includes(",") ? `"${h}"` : h)).join(","),
  csvRow(FULL_ROW),
  csvRow(SPARSE_ROW),
  csvRow(COMPUTED_ZEROS),
  csvRow(COMPUTED_ZEROS),
].join("\r\n");

// ─── minimal graph-path evaluator over the written triples ───────────────────

type NodeFilter = { predicates?: PredicateFilter[]; iri?: string[] };
type PredicateFilter = { predicate: { "@id": string }; some?: { node?: NodeFilter } };
type Shortcut = {
  start: NodeFilter;
  steps: { via: { "@id": string }; where?: NodeFilter }[];
  target?: { node?: NodeFilter };
};

function matchesFilter(dataset: LdoDataset, node: Term, filter: NodeFilter | undefined): boolean {
  if (!filter) return true;
  if (filter.iri && !filter.iri.includes(node.value)) return false;
  return (filter.predicates ?? []).every((p) =>
    dataset
      .match(node as never, namedNode(p.predicate["@id"]))
      .toArray()
      .some((q) => matchesFilter(dataset, q.object, p.some?.node)),
  );
}

function evaluate(dataset: LdoDataset, shortcut: Shortcut): Map<string, Term[]> {
  const results = new Map<string, Term[]>();
  const subjects = new Map<string, Term>();
  dataset.toArray().forEach((q) => subjects.set(q.subject.value, q.subject));
  for (const start of subjects.values()) {
    if (!matchesFilter(dataset, start, shortcut.start)) continue;
    let frontier: Term[] = [start];
    for (const step of shortcut.steps) {
      frontier = frontier.flatMap((node) =>
        dataset
          .match(node as never, namedNode(step.via["@id"]))
          .toArray()
          .map((q) => q.object)
          .filter((o) => matchesFilter(dataset, o, step.where)),
      );
    }
    frontier = frontier.filter((t) => matchesFilter(dataset, t, shortcut.target?.node));
    results.set(start.value, frontier);
  }
  return results;
}

function writeToDataset(persons: ReturnType<typeof convertPilotCsv>["persons"]): LdoDataset {
  const dataset = createLdoDataset();
  for (const person of persons) {
    dataset.usingType(PersonShapeType).fromJson(person);
  }
  return dataset;
}

const ROW_2 = `${BASE_URI}#participant-row-2`;
const ROW_3 = `${BASE_URI}#participant-row-3`;

describe("parseCsv", () => {
  it("handles quoted commas, escaped quotes, CRLF and a BOM", () => {
    expect(parseCsv('﻿a,"b, c","say ""hi"""\r\n1,2,3\n')).toEqual([
      ["a", "b, c", 'say "hi"'],
      ["1", "2", "3"],
    ]);
  });
});

describe("convertPilotCsv", () => {
  const { persons, warnings } = convertPilotCsv(CSV, BASE_URI);

  it("creates one participant per non-blank row, keyed by spreadsheet row", () => {
    expect(persons.map((p) => p["@id"])).toEqual([ROW_2, ROW_3]);
  });

  it("reports unparseable values instead of guessing", () => {
    expect(warnings).toEqual([
      'Row 3, column W (Nature of first symptom(s)): unrecognised value "Sneezing"',
      'Row 3, column AJ (Age ambulation lost): "unknown" is not a number',
    ]);
  });

  it("rejects a CSV that does not follow the template", () => {
    expect(() => convertPilotCsv("Id,Cluster\n1,C1", BASE_URI)).toThrow(PilotCsvFormatError);
    const shifted = [["Row", ...HEADERS].join(","), csvRow(FULL_ROW)].join("\n");
    expect(() => convertPilotCsv(shifted, BASE_URI)).toThrow(/check columns A/);
  });

  describe("written with LDO and queried through the shortcuts", () => {
    const dataset = writeToDataset(persons);
    const shortcuts = nemalineDataPlugin.graphPathShortcuts as unknown as Record<string, Shortcut>;
    const values = (name: string, subject: string) =>
      (evaluate(dataset, shortcuts[name]).get(subject) ?? []).map((t) => t.value);

    it("resolves every shortcut for a fully populated row", () => {
      const empty = Object.keys(shortcuts).filter((name) => values(name, ROW_2).length !== 1);
      expect(empty).toEqual([]);
    });

    it("stores the fields derived at upload", () => {
      // Row 2: female, 1.5 y, not ambulant/sitting at baseline, walked at 1.5 y.
      expect(values("CurrentFN", ROW_2)).toEqual([`${NM}CurrentFunction_NonSitter`]);
      expect(values("AmbGainEvent", ROW_2)).toEqual(["1"]);
      expect(values("AmbGainTime", ROW_2)).toEqual(["1.5"]);
      expect(Number(values("ZScoreH", ROW_2)[0])).toBeCloseTo(ukWhoZScore("ht", "female", 1.5, 88.4)!, 9);
      expect(Number(values("ZScoreW", ROW_2)[0])).toBeCloseTo(ukWhoZScore("wt", "female", 1.5, 12.3)!, 9);
      // Row 3 has no height, weight, baseline status or ambulation history.
      for (const name of ["ZScoreH", "ZScoreW", "CurrentFN", "AmbGainEvent", "AmbGainTime"]) {
        expect(values(name, ROW_3)).toEqual([]);
      }
    });

    it("stores decimal ages computed from years + months", () => {
      expect(values("BaselineAge", ROW_2)).toEqual(["1.5"]);
      expect(values("BaselineAge", ROW_3)).toEqual(["1.5"]);
      expect(values("AgeAtFirstSymptom", ROW_2).map(Number)[0]).toBeCloseTo(0.5 / 12);
      const literal = evaluate(dataset, shortcuts.Weight).get(ROW_2)?.[0];
      expect(literal?.termType).toBe("Literal");
      expect((literal as { datatype?: Term }).datatype?.value).toBe(XSD_DECIMAL);
    });

    it("matches dropdown values case-insensitively and via aliases", () => {
      expect(values("VentilationType", ROW_2)).toEqual([`${NM}Ventilation_NonInvasive`]);
      expect(values("PreviousVentilation", ROW_2)).toEqual([`${NM}PreviousVentilation_No`]);
      expect(values("GenderAssignedAtBirth", ROW_3)).toEqual([`${NM}Gender_Male`]);
      expect(values("CausativeGene", ROW_3)).toEqual([`${NM}Gene_CFL2`]);
    });

    it("models each variant separately and treats 'No 2nd Variant' as absent", () => {
      expect(values("Variant1HGVS", ROW_2)).toEqual(["NM_001271208.2:c.24579G>A, p.(Trp8193*)"]);
      expect(values("Variant2Pathogenicity", ROW_2)).toEqual([
        `${NM}Pathogenicity_LikelyPathogenic`,
      ]);
      expect(values("Variant1Type", ROW_3)).toEqual([`${NM}VariantType_Deletion`]);
      expect(values("Variant1HGVS", ROW_3)).toEqual([]);
      expect(values("Variant2Type", ROW_3)).toEqual([]);
    });
  });
});

describe("createNemalineDefaultStatisticAccessRuleDocument", () => {
  const RULE_URI = "https://pod.example/data/x.statistic-access-rule.ttl";
  const rule = createNemalineDefaultStatisticAccessRuleDocument(RULE_URI);
  const policies = [...rule.hasStatisticPolicy!] as unknown as {
    statisticName: string;
    allowedPath: Set<Record<string, unknown>>;
  }[];
  const policy = (name: string) => [...policies.find((p) => p.statisticName === name)!.allowedPath];

  it("grants count, mean, standard deviation and Kaplan-Meier", () => {
    expect(rule.dataSchema).toBe("nemaline");
    expect(policies.map((p) => p.statisticName).sort()).toEqual(
      ["count", "kaplan-meier", "mean", "standard-deviation"],
    );
    expect(policy("mean")).toHaveLength(NUMERIC_COLUMNS.length + DERIVED_NUMERIC_FIELDS.length);
    expect(policy("standard-deviation")).toHaveLength(NUMERIC_COLUMNS.length + DERIVED_NUMERIC_FIELDS.length);
    expect(policy("mean").every((p) => p.minCount === 3)).toBe(true);
    const [km] = policy("kaplan-meier") as { timeGraphPath: { name: string }; kAnonymity: number }[];
    expect(km.timeGraphPath.name).toBe("AmbGainTime");
    expect(km.kAnonymity).toBe(3);
  });

  describe("read back from RDF by the server evaluators", () => {
    const dataset = createLdoDataset();
    dataset.usingType(nemalineDefaultStatisticAccessRuleDocumentShapeType).fromJson(rule);
    const shortcut = (name: string) =>
      findGraphPathShortcutByName([nemalineDataPlugin], "nemaline", name)!.graphPath;
    const read = <T>(plugin: { statisticAccessRuleShapeType: ShapeType<T> }, fragment: string) =>
      dataset.usingType(plugin.statisticAccessRuleShapeType as ShapeType<LdoBase>).fromSubject(`${RULE_URI}#${fragment}`) as unknown as T;

    it("allows the participant counts the smoke test asks for", () => {
      const countRule = read(countStatisticPlugin, "count-policy");
      const participant = shortcut("Participant");
      expect(evaluateCountStatisticAccessRule(participant, countRule)).toBe(true);
      expect(evaluateCountStatisticAccessRule(participant, countRule, [shortcut("CausativeGene")])).toBe(true);
      expect(
        evaluateCountStatisticAccessRule(participant, countRule, [shortcut("CausativeGene"), shortcut("GenderAssignedAtBirth")]),
      ).toBe(true);
      expect(evaluateCountStatisticAccessRule(participant, countRule, [shortcut("CausativeGene"), shortcut("CurrentFN")])).toBe(true);
      // Free-text HGVS is not a permitted breakdown.
      expect(evaluateCountStatisticAccessRule(participant, countRule, [shortcut("Variant1HGVS")])).toBeInstanceOf(Error);
    });

    it("allows grouped means and standard deviations by stratifier only", () => {
      const meanRule = read(meanStatisticPlugin, "mean-policy");
      const sdRule = read(standardDeviationStatisticPlugin, "standard-deviation-policy");
      for (const field of ["BaselineAge", "ZScoreH"]) {
        expect(evaluateMeanStatisticAccessRule(shortcut(field), meanRule, [shortcut("CausativeGene")])).toBe(true);
        expect(evaluateStandardDeviationStatisticAccessRule(shortcut(field), sdRule, [shortcut("CausativeGene")])).toBe(true);
      }
      expect(evaluateMeanStatisticAccessRule(shortcut("BaselineAge"), meanRule, [shortcut("BiopsyResult")])).toBeInstanceOf(Error);
    });

    it("allows the stratified Kaplan-Meier curve", () => {
      const kmRule = read(kaplanMeierStatisticPlugin, "kaplan-meier-policy");
      expect(
        evaluateKaplanMeierStatisticAccessRule(shortcut("AmbGainTime"), shortcut("AmbGainEvent"), shortcut("CausativeGene"), kmRule),
      ).toBe(true);
    });
  });
});

describe("toParticipantRow", () => {
  // Reads back through LDO proxies from parsed Turtle, as the view does, so
  // context problems (e.g. a collection read back as a single value) show up.
  it("reads every displayed value back from the stored RDF", async () => {
    const { persons } = convertPilotCsv(CSV, BASE_URI);
    const turtle = await toTurtle(
      writeToDataset(persons)
        .usingType(PersonShapeType)
        .matchSubject("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "https://w3id.org/semanticarts/ns/ontology/gist/Person"),
    );
    const parsed = await parseRdf(turtle, { baseIRI: BASE_URI });
    const people = ldArr(
      parsed
        .usingType(PersonShapeType)
        .matchSubject("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "https://w3id.org/semanticarts/ns/ontology/gist/Person"),
    );
    const rows = people.map((p, i) => toParticipantRow(p, i)).sort((a, b) => a.row! - b.row!);

    expect(rows[0]).toEqual({
      id: ROW_2,
      row: 2,
      baselineAge: 1.5,
      gender: "Female",
      gene: "NEB",
      zygosity: "Compound Heterozygous",
      ambulant: "No",
      sitting: "No",
      ventilation: "Non-Invasive ventilation",
      tubeFed: "Yes",
      cedas: 3,
      mfm32: 60,
      chopIntend: 40,
      weight: 12.3,
      height: 88.4,
      currentFunction: "Non-Sitter",
      heightZScore: expect.closeTo(ukWhoZScore("ht", "female", 1.5, 88.4)!, 9),
      weightZScore: expect.closeTo(ukWhoZScore("wt", "female", 1.5, 12.3)!, 9),
      ambGainTime: 1.5,
      ambGainEvent: 1,
      variants: [
        {
          position: 1,
          hgvs: "NM_001271208.2:c.24579G>A, p.(Trp8193*)",
          type: "Single Nucleotide Variant (SNV)",
          consequence: "Nonsense",
          lossOfFunction: "Yes",
          pathogenicity: "Pathogenic",
        },
        {
          position: 2,
          hgvs: "NM_001271208.2:c.100del",
          type: "Deletion",
          consequence: "Frameshift",
          lossOfFunction: "Yes",
          pathogenicity: "Likely Pathogenic",
        },
      ],
    });
    expect(rows[1]).toMatchObject({
      row: 3,
      baselineAge: 1.5,
      gene: "CFL2",
      mfm32: undefined,
      currentFunction: undefined,
      heightZScore: undefined,
      ambGainTime: undefined,
      ambGainEvent: undefined,
    });
    expect(rows[1].variants).toHaveLength(1);
  });
});
