import { describe, it, expect, vi } from "vitest";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type { StandardDeviationStatisticAccessRule } from "@oxfordia/stat-plugin-standard-deviation_core";
import type { StatisticPluginServerGlobals } from "@oxfordia/stat-plugin_server";
import { standardDeviationPlugin, summarizeValues } from "../standardDeviationPlugin";
import { evaluateStandardDeviationStatisticAccessRulePostQuery } from "../evaluateStandardDeviationStatisticAccessRule";

const step = (via: string) =>
  ({
    "@id": `#${via}`,
    start: { "@id": "#s", rdfType: ["http://example.org/Person"] },
    steps: [{ "@id": "#st", via: { "@id": `http://example.org/${via}` } }],
  }) as unknown as GraphPath;
const AGE = step("age");
const GENE = step("gene");

const rule = {
  "@id": "#rule",
  allowedPath: [{ "@id": "#ap", graphPath: AGE, groupByGraphPath: [GENE], minCount: 3, minDistinctValues: 2 }],
} as unknown as StandardDeviationStatisticAccessRule;

describe("summarizeValues", () => {
  it("matches the sample standard deviation", () => {
    expect(summarizeValues([2, 4, 4, 4, 5, 5, 7, 9])).toEqual({
      standardDeviation: Math.sqrt(32 / 7),
      mean: 5,
      count: 8,
      distinctCount: 5,
    });
    expect(summarizeValues([3])?.standardDeviation).toBeNull();
    expect(summarizeValues([])).toBeUndefined();
  });
});

describe("grouped standard deviation", () => {
  it("summarises each group from the fetched values", async () => {
    const row = (gene: string, value: number) => ({ group0: { value: `http://x/Gene_${gene}` }, value: { value: String(value) } });
    const fetchBindings = vi.fn().mockResolvedValue([row("NEB", 1), row("NEB", 3), row("NEB", 5), row("TPM2", 4)]);
    const globals = { sparqlEndpoint: "s", sparqlFetcher: { fetchBindings } } as unknown as StatisticPluginServerGlobals;
    const output = await standardDeviationPlugin.performQuery(
      { resourceUri: "http://pod/d.ttl", graphPath: AGE, groupByPaths: [GENE] },
      globals,
    );
    expect(output).toEqual({
      groups: [
        { values: ["http://x/Gene_NEB"], labels: ["NEB"], standardDeviation: 2, mean: 3, count: 3, distinctCount: 3 },
        { values: ["http://x/Gene_TPM2"], labels: ["TPM2"], standardDeviation: null, mean: 4, count: 1, distinctCount: 1 },
      ],
    });
  });

  it("suppresses cells failing minCount or minDistinctValues", () => {
    const cell = (v: string, count: number, distinctCount: number) => ({
      values: [v], labels: [v], standardDeviation: 1, mean: 2, count, distinctCount,
    });
    const output = { groups: [cell("ok", 5, 3), cell("small", 2, 2), cell("flat", 6, 1)] };
    expect(evaluateStandardDeviationStatisticAccessRulePostQuery(AGE, rule, output, [GENE])).toEqual({
      release: {
        groups: [
          cell("ok", 5, 3),
          { values: ["small"], labels: ["small"], suppressed: true },
          { values: ["flat"], labels: ["flat"], suppressed: true },
        ],
      },
    });
  });
});
