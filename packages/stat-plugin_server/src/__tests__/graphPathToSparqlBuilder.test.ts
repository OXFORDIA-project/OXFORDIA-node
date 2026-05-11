import { describe, it, expect } from "vitest";
import {
  buildGraphPathWhereClause,
  toIriToken,
  toTemplateStringsArray,
} from "../util/graphPathToSparqlBuilder";
import type { GraphPath } from "@oxfordia/stat-plugin_core";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function path(partial: Partial<GraphPath>): GraphPath {
  return { "@id": "#p", start: { "@id": "#s" }, ...partial } as unknown as GraphPath;
}

const RDF_TYPE = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>";
const GIST_CATEGORIZED_BY =
  "<https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy>";

// ---------------------------------------------------------------------------
// toIriToken
// ---------------------------------------------------------------------------

describe("toIriToken", () => {
  it("leaves an already-bracketed IRI unchanged", () => {
    expect(toIriToken("<http://example.org/>")).toBe("<http://example.org/>");
  });

  it("wraps an http IRI", () => {
    expect(toIriToken("http://example.org/")).toBe("<http://example.org/>");
  });

  it("wraps an https IRI", () => {
    expect(toIriToken("https://example.org/prop")).toBe(
      "<https://example.org/prop>",
    );
  });

  it("wraps a urn IRI", () => {
    expect(toIriToken("urn:example:foo")).toBe("<urn:example:foo>");
  });

  it("leaves a non-IRI token unchanged (e.g. prefixed name)", () => {
    expect(toIriToken("?someVar")).toBe("?someVar");
  });
});

// ---------------------------------------------------------------------------
// toTemplateStringsArray
// ---------------------------------------------------------------------------

describe("toTemplateStringsArray", () => {
  it("returns an array-like with the string as the first element", () => {
    const tsa = toTemplateStringsArray("hello");
    expect(tsa[0]).toBe("hello");
  });

  it("has a raw property matching the value", () => {
    const tsa = toTemplateStringsArray("hello");
    expect(tsa.raw[0]).toBe("hello");
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — minimal / empty path
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — empty path", () => {
  it("returns startVar ?node0 and empty patterns for a bare start", () => {
    const result = buildGraphPathWhereClause(path({ start: { "@id": "#s" } }));
    expect(result.startVar).toBe("?node0");
    expect(result.terminalVar).toBe("?node0");
    expect(result.patterns).toEqual([]);
    expect(result.requiresXsdPrefix).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — start node filters
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — rdfType filter", () => {
  it("emits a VALUES block for rdfType", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          rdfType: ["http://example.org/Person"],
        },
      }),
    );
    expect(result.patterns).toHaveLength(2);
    expect(result.patterns[0]).toMatch(RDF_TYPE);
    expect(result.patterns[1]).toMatch(
      "VALUES",
    );
    expect(result.patterns[1]).toContain("<http://example.org/Person>");
  });

  it("includes all rdfTypes in the VALUES block", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          rdfType: ["http://example.org/A", "http://example.org/B"],
        },
      }),
    );
    expect(result.patterns[1]).toContain("<http://example.org/A>");
    expect(result.patterns[1]).toContain("<http://example.org/B>");
  });
});

describe("buildGraphPathWhereClause — iri filter", () => {
  it("emits a VALUES block on the start variable for iri filter", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: { "@id": "#s", iri: ["http://example.org/specific"] },
      }),
    );
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0]).toMatch(/^VALUES \?node0/);
    expect(result.patterns[0]).toContain("<http://example.org/specific>");
  });
});

describe("buildGraphPathWhereClause — categories filter", () => {
  it("emits an isCategorizedBy triple and VALUES block", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          categories: ["http://example.org/Cat"],
        },
      }),
    );
    expect(result.patterns).toHaveLength(2);
    expect(result.patterns[0]).toContain(GIST_CATEGORIZED_BY);
    expect(result.patterns[1]).toContain("<http://example.org/Cat>");
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — predicate filters
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — predicate filter (some)", () => {
  it("emits a bare triple for the `some` quantifier", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          predicates: [
            {
              "@id": "#pf",
              predicate: { "@id": "http://example.org/hasProp" },
              some: { "@id": "#sel" },
            },
          ],
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("<http://example.org/hasProp>");
    expect(joined).not.toContain("FILTER NOT EXISTS");
  });
});

describe("buildGraphPathWhereClause — predicate filter (none)", () => {
  it("emits FILTER NOT EXISTS for the `none` quantifier", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          predicates: [
            {
              "@id": "#pf",
              predicate: { "@id": "http://example.org/hasProp" },
              none: { "@id": "#sel" },
            },
          ],
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("FILTER NOT EXISTS");
    expect(joined).toContain("<http://example.org/hasProp>");
  });
});

describe("buildGraphPathWhereClause — predicate filter (every)", () => {
  it("emits FILTER NOT EXISTS for the `every` quantifier", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          predicates: [
            {
              "@id": "#pf",
              predicate: { "@id": "http://example.org/hasProp" },
              every: { "@id": "#sel" },
            },
          ],
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("FILTER NOT EXISTS");
    expect(joined).toContain("<http://example.org/hasProp>");
  });
});

describe("buildGraphPathWhereClause — predicate filter (no quantifier)", () => {
  it("emits a bare ?any triple when no quantifier is specified", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: {
          "@id": "#s",
          predicates: [
            {
              "@id": "#pf",
              predicate: { "@id": "http://example.org/hasProp" },
            },
          ],
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("<http://example.org/hasProp>");
    expect(joined).not.toContain("FILTER NOT EXISTS");
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — traversal steps
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — traversal step", () => {
  it("emits a triple for a step with via predicate", () => {
    const result = buildGraphPathWhereClause(
      path({
        steps: [
          { "@id": "#step", via: { "@id": "http://example.org/hasPart" } },
        ],
      }),
    );
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0]).toContain("<http://example.org/hasPart>");
    expect(result.terminalVar).not.toBe(result.startVar);
  });

  it("emits an inverted triple for an inverse step", () => {
    const result = buildGraphPathWhereClause(
      path({
        steps: [
          {
            "@id": "#step",
            via: { "@id": "http://example.org/partOf" },
            inverse: true,
          },
        ],
      }),
    );
    const triple = result.patterns[0];
    // Inverse: object comes before predicate in the triple
    const terminalIdx = triple.indexOf(result.terminalVar);
    const startIdx = triple.indexOf(result.startVar);
    expect(terminalIdx).toBeLessThan(startIdx);
  });

  it("advances terminalVar with each step", () => {
    const result = buildGraphPathWhereClause(
      path({
        steps: [
          { "@id": "#s1", via: { "@id": "http://example.org/a" } },
          { "@id": "#s2", via: { "@id": "http://example.org/b" } },
        ],
      }),
    );
    expect(result.patterns).toHaveLength(2);
    expect(result.terminalVar).not.toBe(result.startVar);
  });

  it("adds a filter for a step with a where clause", () => {
    const result = buildGraphPathWhereClause(
      path({
        steps: [
          {
            "@id": "#step",
            via: { "@id": "http://example.org/hasPart" },
            where: {
              "@id": "#where",
              rdfType: ["http://example.org/Part"],
            },
          },
        ],
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("<http://example.org/hasPart>");
    expect(joined).toContain("VALUES");
    expect(joined).toContain("<http://example.org/Part>");
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — literal target
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — literal target: datatype", () => {
  it("emits a FILTER(datatype(...)) pattern", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: {
            "@id": "#lit",
            datatype: "http://www.w3.org/2001/XMLSchema#decimal",
          },
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("FILTER(datatype(");
    expect(joined).toContain(
      "<http://www.w3.org/2001/XMLSchema#decimal>",
    );
  });
});

describe("buildGraphPathWhereClause — literal target: lang", () => {
  it("emits a FILTER(LCASE(lang(...))) pattern", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: { "@id": "#lit", lang: "en" },
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("FILTER(LCASE(lang(");
    expect(joined).toContain('"en"');
  });
});

describe("buildGraphPathWhereClause — literal target: min/max", () => {
  it("emits FILTER(isNumeric) and FILTER(xsd:decimal) for min", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: { "@id": "#lit", min: 18 },
        },
      }),
    );
    expect(result.requiresXsdPrefix).toBe(true);
    const joined = result.patterns.join("\n");
    expect(joined).toContain("FILTER(isNumeric(");
    expect(joined).toContain(">= 18");
  });

  it("emits a max FILTER", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: { "@id": "#lit", max: 100 },
        },
      }),
    );
    expect(result.requiresXsdPrefix).toBe(true);
    const joined = result.patterns.join("\n");
    expect(joined).toContain("<= 100");
  });

  it("emits both min and max FILTERs together", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: { "@id": "#lit", min: 0, max: 150 },
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain(">= 0");
    expect(joined).toContain("<= 150");
  });
});

describe("buildGraphPathWhereClause — literal target: equals", () => {
  it("emits FILTER(? = ...) for equals", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: { "@id": "#lit", equals: 42 },
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("= 42");
  });
});

describe("buildGraphPathWhereClause — literal target: oneOf", () => {
  it("emits FILTER(? IN (...)) for oneOf", () => {
    const result = buildGraphPathWhereClause(
      path({
        target: {
          "@id": "#t",
          literal: { "@id": "#lit", oneOf: ["active", "pending"] },
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("IN (");
    expect(joined).toContain('"active"');
    expect(joined).toContain('"pending"');
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — node target
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — node target", () => {
  it("applies node filter to the terminal variable", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: { "@id": "#s" },
        steps: [{ "@id": "#step", via: { "@id": "http://example.org/a" } }],
        target: {
          "@id": "#t",
          node: {
            "@id": "#nf",
            rdfType: ["http://example.org/Output"],
          },
        },
      }),
    );
    const joined = result.patterns.join("\n");
    expect(joined).toContain("<http://example.org/Output>");
    expect(joined).toContain("VALUES");
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — custom options
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — custom options", () => {
  it("respects a custom startVar", () => {
    const result = buildGraphPathWhereClause(
      path({ start: { "@id": "#s", rdfType: ["http://example.org/X"] } }),
      { startVar: "?subject" },
    );
    expect(result.startVar).toBe("?subject");
    expect(result.patterns[0]).toContain("?subject");
  });

  it("respects a custom variableNamespace", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: { "@id": "#s", rdfType: ["http://example.org/X"] },
      }),
      { variableNamespace: "gp1" },
    );
    const vars = result.patterns.join(" ");
    expect(vars).toContain("?gp1");
  });

  it("does not set requiresXsdPrefix for non-numeric filters", () => {
    const result = buildGraphPathWhereClause(path({ start: { "@id": "#s" } }));
    expect(result.requiresXsdPrefix).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildGraphPathWhereClause — applyWhere
// ---------------------------------------------------------------------------

describe("buildGraphPathWhereClause — applyWhere", () => {
  it("accumulates patterns via applyWhere chain", () => {
    const result = buildGraphPathWhereClause(
      path({
        start: { "@id": "#s", rdfType: ["http://example.org/Person"] },
      }),
    );
    const accumulated: string[] = [];
    const fakeQuery = {
      WHERE(strings: TemplateStringsArray) {
        accumulated.push(strings[0]);
        return this;
      },
    };
    result.applyWhere(fakeQuery);
    expect(accumulated).toHaveLength(result.patterns.length);
    expect(accumulated).toEqual(result.patterns);
  });
});
