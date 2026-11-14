import { describe, it, expect, vi } from "vitest";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import {
  buildGroupByQueryParts,
  evaluateGroupedAllowedPath,
  findMatchingGroupedAllowedPath,
  groupValueLabel,
  normalizeGroupByPathsQuery,
  readGroupKey,
  suppressGroups,
  type StatisticGroup,
} from "../util/groupBy";
import { executeStatisticSparqlQuery } from "../util/statisticSparqlQuery";
import type { StatisticPluginServerGlobals } from "../types";

const PERSON = "https://w3id.org/semanticarts/ns/ontology/gist/Person";

function stepPath(via: string): GraphPath {
  return {
    "@id": `#${via}`,
    start: { "@id": "#s", rdfType: [PERSON] },
    steps: [{ "@id": "#step", via: { "@id": `http://example.org/${via}` } }],
  } as unknown as GraphPath;
}

const AGE = stepPath("age");
const WEIGHT = stepPath("weight");
const GENE = stepPath("gene");
const GENDER = stepPath("gender");
const SITE = stepPath("site");

const entry = (graphPath: GraphPath, groupBy: GraphPath[] = []) => ({
  graphPath,
  groupByGraphPath: groupBy,
});

describe("normalizeGroupByPathsQuery", () => {
  it.each([[{}], [null], [[]]])("drops an empty groupByPaths (%j)", (empty) => {
    expect(normalizeGroupByPathsQuery({ resourceUri: "x", groupByPaths: empty })).toEqual({
      resourceUri: "x",
    });
  });

  it("wraps a single path in an array", () => {
    expect(normalizeGroupByPathsQuery({ groupByPaths: GENE })).toEqual({ groupByPaths: [GENE] });
  });

  it("leaves arrays and queries without groupByPaths unchanged", () => {
    const query = { groupByPaths: [GENE, GENDER] };
    expect(normalizeGroupByPathsQuery(query)).toEqual(query);
    const plain = { resourceUri: "x" };
    expect(normalizeGroupByPathsQuery(plain)).toBe(plain);
  });
});

describe("findMatchingGroupedAllowedPath", () => {
  const allowed = [entry(AGE, [GENE, GENDER]), entry(WEIGHT)];

  it("matches an ungrouped query on the graphPath alone", () => {
    expect(findMatchingGroupedAllowedPath(WEIGHT, [], allowed)).toBe(allowed[1]);
  });

  it("requires every requested group-by to be allowed", () => {
    expect(findMatchingGroupedAllowedPath(AGE, [GENE], allowed)).toBe(allowed[0]);
    expect(findMatchingGroupedAllowedPath(AGE, [GENE, GENDER], allowed)).toBe(allowed[0]);
    expect(findMatchingGroupedAllowedPath(AGE, [GENE, SITE], allowed)).toBeUndefined();
    expect(findMatchingGroupedAllowedPath(WEIGHT, [GENE], allowed)).toBeUndefined();
  });
});

describe("evaluateGroupedAllowedPath", () => {
  const allowed = [entry(AGE, [GENE]), entry(WEIGHT, [GENDER])];

  it("returns the matching entry", () => {
    expect(evaluateGroupedAllowedPath("mean", AGE, [GENE], allowed)).toBe(allowed[0]);
  });

  it("reports an empty policy", () => {
    expect(evaluateGroupedAllowedPath("mean", AGE, [], [])).toEqual(
      new Error("No allowed graph paths are configured for mean."),
    );
  });

  it("distinguishes a disallowed graphPath from a disallowed group-by", () => {
    expect((evaluateGroupedAllowedPath("mean", SITE, [], allowed) as Error).message).toBe(
      "Requested graphPath is not allowed by mean statistic policy.",
    );
    expect((evaluateGroupedAllowedPath("mean", AGE, [SITE], allowed) as Error).message).toMatch(
      /^Requested groupByPath is not allowed for this graphPath/,
    );
  });

  it("rejects more than two group-by paths", () => {
    const result = evaluateGroupedAllowedPath("mean", AGE, [GENE, GENDER, SITE], allowed);
    expect((result as Error).message).toBe("At most 2 groupByPaths are supported (got 3).");
  });
});

describe("groupValueLabel", () => {
  it.each([
    ["https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_NEB", "NEB"],
    ["https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_NonSitter", "Non Sitter"],
    ["https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_CompoundHeterozygous", "Compound Heterozygous"],
    ["http://example.org/thing#Plain", "Plain"],
    ["a literal", "a literal"],
  ])("%s → %s", (value, label) => {
    expect(groupValueLabel(value)).toBe(label);
  });
});

describe("readGroupKey", () => {
  it("reads every group value with labels", () => {
    const row = {
      group0: { termType: "NamedNode", value: "http://x/terms/Gene_NEB" },
      group1: { termType: "NamedNode", value: "http://x/terms/Gender_Female" },
    };
    expect(readGroupKey(row, 2)).toEqual({
      values: ["http://x/terms/Gene_NEB", "http://x/terms/Gender_Female"],
      labels: ["NEB", "Female"],
    });
  });

  it("returns undefined when a group value is missing", () => {
    expect(readGroupKey({ group0: { value: "http://x/A" } }, 2)).toBeUndefined();
  });
});

describe("suppressGroups", () => {
  it("replaces failing cells with placeholders that carry no statistic", () => {
    const groups: StatisticGroup<{ count: number }>[] = [
      { values: ["a"], labels: ["A"], count: 5 },
      { values: ["b"], labels: ["B"], count: 2 },
    ];
    expect(suppressGroups(groups, (g) => g.count >= 3)).toEqual([
      { values: ["a"], labels: ["A"], count: 5 },
      { values: ["b"], labels: ["B"], suppressed: true },
    ]);
  });
});

describe("grouped SPARQL", () => {
  it("binds group paths to the shared subject and adds GROUP BY", async () => {
    const fetchBindings = vi.fn().mockResolvedValue([]);
    const globals = {
      sparqlEndpoint: "http://sparql",
      sparqlFetcher: { fetchBindings },
    } as unknown as StatisticPluginServerGlobals;
    const groupBy = buildGroupByQueryParts([GENE, GENDER], "?subject");

    await executeStatisticSparqlQuery({
      resourceUri: "http://pod/data.ttl",
      pathBindings: [{ key: "value", graphPath: AGE, startVar: "?subject" }, ...groupBy.pathBindings],
      selectFields: [...groupBy.selectFields, { alias: "count", expression: () => "COUNT(DISTINCT ?subject)" }],
      groupByKeys: groupBy.keys,
      globals,
    });

    const query: string = fetchBindings.mock.calls[0][1];
    expect(query).toContain("?subject <http://example.org/age> ?node2");
    expect(query).toContain("?subject <http://example.org/gene> ?g0_node2");
    expect(query).toContain("?subject <http://example.org/gender> ?g1_node2");
    expect(query).toContain("(?g0_node2 AS ?group0) (?g1_node2 AS ?group1)");
    expect(query.trim()).toMatch(/GROUP BY \?g0_node2 \?g1_node2$/);
  });
});
