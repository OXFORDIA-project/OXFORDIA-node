import { describe, it, expect, vi } from "vitest";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type { MeanStatisticAccessRule } from "@oxfordia/stat-plugin-mean_core";
import type { StatisticPluginServerGlobals } from "@oxfordia/stat-plugin_server";
import { meanPlugin } from "../meanPlugin";
import { evaluateMeanStatisticAccessRulePostQuery } from "../evaluateMeanStatisticAccessRule";

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
  allowedPath: [{ "@id": "#ap", graphPath: AGE, groupByGraphPath: [GENE], minCount: 3 }],
} as unknown as MeanStatisticAccessRule;

describe("grouped mean", () => {
  it("suppresses cells below minCount", () => {
    const output = {
      groups: [
        { values: ["a"], labels: ["A"], mean: 4.5, count: 4 },
        { values: ["b"], labels: ["B"], mean: 9, count: 1 },
      ],
    };
    expect(evaluateMeanStatisticAccessRulePostQuery(AGE, rule, output, [GENE])).toEqual({
      release: {
        groups: [
          { values: ["a"], labels: ["A"], mean: 4.5, count: 4 },
          { values: ["b"], labels: ["B"], suppressed: true },
        ],
      },
    });
  });

  it("queries AVG and COUNT per group", async () => {
    const fetchBindings = vi.fn().mockResolvedValue([
      { group0: { value: "http://x/Gene_NEB" }, mean: { value: "6.5" }, count: { value: "4" } },
    ]);
    const globals = { sparqlEndpoint: "s", sparqlFetcher: { fetchBindings } } as unknown as StatisticPluginServerGlobals;
    const output = await meanPlugin.performQuery({ resourceUri: "http://pod/d.ttl", graphPath: AGE, groupByPaths: [GENE] }, globals);
    expect(output).toEqual({ groups: [{ values: ["http://x/Gene_NEB"], labels: ["NEB"], mean: 6.5, count: 4 }] });
    expect(fetchBindings.mock.calls[0][1]).toMatch(/GROUP BY \?g0_node2\s*$/);
  });

  it("returns an empty group list rather than failing when nothing matches", async () => {
    const fetchBindings = vi.fn().mockResolvedValue([]);
    const globals = { sparqlEndpoint: "s", sparqlFetcher: { fetchBindings } } as unknown as StatisticPluginServerGlobals;
    await expect(
      meanPlugin.performQuery({ resourceUri: "http://pod/d.ttl", graphPath: AGE, groupByPaths: [GENE] }, globals),
    ).resolves.toEqual({ groups: [] });
  });
});
