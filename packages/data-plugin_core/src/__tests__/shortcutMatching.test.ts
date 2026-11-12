import { describe, it, expect } from "vitest";
import { resolveGraphPathShortcut } from "../shortcutMatching";
import type { DataPlugin } from "../types";
import type { GraphPath } from "@oxfordia/stat-plugin_core";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PRED_A = "http://example.org/hasAge";
const PRED_B = "http://example.org/hasName";

function makePluginWithShortcuts(shortcuts: Record<string, GraphPath>): DataPlugin {
  return {
    name: "nemaline",
    schema: {} as DataPlugin["schema"],
    context: {} as DataPlugin["context"],
    shapeTypes: {},
    graphPathShortcuts: shortcuts,
  };
}

// Uses traversal steps so the comparator can distinguish paths by `via` IRI.
// The shortcutMatching algorithm compares steps by their `via` predicate IRI.
const simplePath: GraphPath = {
  "@id": "#simple",
  name: "simpleShortcut",
  start: { "@id": "#s" },
  steps: [{ "@id": "#step", via: { "@id": PRED_A } }],
} as unknown as GraphPath;

// Same structure as simplePath but without the `name` field (structural match)
const simplePathNoName: GraphPath = {
  "@id": "#simple2",
  start: { "@id": "#s" },
  steps: [{ "@id": "#step2", via: { "@id": PRED_A } }],
} as unknown as GraphPath;

// Structurally different: uses PRED_B as the via predicate
const differentPath: GraphPath = {
  "@id": "#diff",
  start: { "@id": "#s" },
  steps: [{ "@id": "#step3", via: { "@id": PRED_B } }],
} as unknown as GraphPath;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("resolveGraphPathShortcut", () => {
  it("resolves by name when the graphPath has a name field", () => {
    const plugins = [makePluginWithShortcuts({ simpleShortcut: simplePath })];
    const result = resolveGraphPathShortcut(plugins, "nemaline", simplePath);
    expect(result).not.toBeNull();
    expect(result?.name).toBe("simpleShortcut");
  });

  it("resolves by structural match when there is no name field", () => {
    const plugins = [makePluginWithShortcuts({ simpleShortcut: simplePath })];
    const result = resolveGraphPathShortcut(plugins, "nemaline", simplePathNoName);
    expect(result).not.toBeNull();
    expect(result?.name).toBe("simpleShortcut");
  });

  it("returns null when there is no structural match", () => {
    const plugins = [makePluginWithShortcuts({ simpleShortcut: simplePath })];
    const result = resolveGraphPathShortcut(plugins, "nemaline", differentPath);
    expect(result).toBeNull();
  });

  it("returns null for an unknown schema name", () => {
    const plugins = [makePluginWithShortcuts({ simpleShortcut: simplePath })];
    const result = resolveGraphPathShortcut(plugins, "unknown", simplePath);
    expect(result).toBeNull();
  });

  it("returns null for a null schema name", () => {
    const plugins = [makePluginWithShortcuts({ simpleShortcut: simplePath })];
    expect(resolveGraphPathShortcut(plugins, null, simplePath)).toBeNull();
  });

  it("returns null for an empty shortcut map", () => {
    const plugins = [makePluginWithShortcuts({})];
    expect(resolveGraphPathShortcut(plugins, "nemaline", simplePathNoName)).toBeNull();
  });
});
