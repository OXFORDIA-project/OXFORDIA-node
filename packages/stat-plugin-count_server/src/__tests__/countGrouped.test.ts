import { describe, it, expect, vi } from "vitest";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type { CountStatisticAccessRule } from "@oxfordia/stat-plugin-count_core";
import type { StatisticPluginServerGlobals } from "@oxfordia/stat-plugin_server";
import { countPlugin } from "../countPlugin";
import {
  evaluateCountStatisticAccessRule,
  evaluateCountStatisticAccessRulePostQuery,
} from "../evaluateCountStatisticAccessRule";

const PERSON = "https://w3id.org/semanticarts/ns/ontology/gist/Person";
const PARTICIPANT = {
  "@id": "#participant",
  start: { "@id": "#s", rdfType: [PERSON] },
} as unknown as GraphPath;
const step = (via: string) =>
  ({
    "@id": `#${via}`,
    start: { "@id": "#s", rdfType: [PERSON] },
    steps: [{ "@id": "#st", via: { "@id": `http://example.org/${via}` } }],
  }) as unknown as GraphPath;
const GENE = step("gene");
const GENDER = step("gender");
const SITE = step("site");

const rule = {
  "@id": "#rule",
  allowedPath: [{ "@id": "#ap", graphPath: PARTICIPANT, groupByGraphPath: [GENE, GENDER], minCount: 3 }],
} as unknown as CountStatisticAccessRule;

describe("grouped count access rule", () => {
  it("allows permitted group-bys and rejects others", () => {
    expect(evaluateCountStatisticAccessRule(PARTICIPANT, rule, [GENE, GENDER])).toBe(true);
    expect(evaluateCountStatisticAccessRule(PARTICIPANT, rule, [SITE])).toBeInstanceOf(Error);
  });

  it("suppresses only the cells below minCount and releases no total", () => {
    const output = {
      groups: [
        { values: ["g:NEB"], labels: ["NEB"], count: 7 },
        { values: ["g:ACTA1"], labels: ["ACTA1"], count: 2 },
        { values: ["g:TPM2"], labels: ["TPM2"], count: 3 },
      ],
    };
    expect(evaluateCountStatisticAccessRulePostQuery(PARTICIPANT, rule, output, [GENE])).toEqual({
      release: {
        groups: [
          { values: ["g:NEB"], labels: ["NEB"], count: 7 },
          { values: ["g:ACTA1"], labels: ["ACTA1"], suppressed: true },
          { values: ["g:TPM2"], labels: ["TPM2"], count: 3 },
        ],
      },
    });
  });

  it("still withholds an ungrouped count below minCount", () => {
    expect(evaluateCountStatisticAccessRulePostQuery(PARTICIPANT, rule, { count: 2 })).toBeInstanceOf(Error);
    expect(evaluateCountStatisticAccessRulePostQuery(PARTICIPANT, rule, { count: 3 })).toBe(true);
  });
});

describe("count query", () => {
  function globalsReturning(rows: unknown[]) {
    const fetchBindings = vi.fn().mockResolvedValue(rows);
    return {
      fetchBindings,
      globals: { sparqlEndpoint: "http://sparql", sparqlFetcher: { fetchBindings } } as unknown as StatisticPluginServerGlobals,
    };
  }

  it("counts distinct participants, not distinct values", async () => {
    const { fetchBindings, globals } = globalsReturning([{ count: { value: "12" } }]);
    const output = await countPlugin.performQuery({ resourceUri: "http://pod/d.ttl", graphPath: GENE }, globals);
    expect(output).toEqual({ count: 12 });
    expect(fetchBindings.mock.calls[0][1]).toContain("COUNT(DISTINCT ?subject)");
  });

  it("returns one group per combination of group values", async () => {
    const { globals } = globalsReturning([
      { group0: { value: "http://x/Gene_NEB" }, count: { value: "5" } },
      { group0: { value: "http://x/Gene_TPM2" }, count: { value: "1" } },
    ]);
    const output = await countPlugin.performQuery(
      { resourceUri: "http://pod/d.ttl", graphPath: PARTICIPANT, groupByPaths: [GENE] },
      globals,
    );
    expect(output).toEqual({
      groups: [
        { values: ["http://x/Gene_NEB"], labels: ["NEB"], count: 5 },
        { values: ["http://x/Gene_TPM2"], labels: ["TPM2"], count: 1 },
      ],
    });
  });
});
