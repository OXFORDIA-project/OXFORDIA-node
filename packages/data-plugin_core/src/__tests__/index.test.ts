import { describe, it, expect } from "vitest";
import {
  findDataPlugin,
  findDataSchema,
  getGraphPathShortcutsForDataSchema,
  findGraphPathShortcutByName,
} from "../index";
import type { DataPlugin } from "../types";
import type { GraphPath } from "@oxfordia/stat-plugin_core";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const fooPath: GraphPath = {
  "@id": "#foo-path",
  start: { "@id": "#s", rdfType: ["http://example.org/Foo"] },
} as unknown as GraphPath;

const barPath: GraphPath = {
  "@id": "#bar-path",
  start: { "@id": "#s", rdfType: ["http://example.org/Bar"] },
} as unknown as GraphPath;

const fooPlugin: DataPlugin = {
  name: "foo",
  schema: {} as DataPlugin["schema"],
  context: {} as DataPlugin["context"],
  shapeTypes: {},
  graphPathShortcuts: {
    fooShortcut: fooPath,
    barShortcut: barPath,
  },
};

const betaPlugin: DataPlugin = {
  name: "beta",
  schema: {} as DataPlugin["schema"],
  context: {} as DataPlugin["context"],
  shapeTypes: {},
  graphPathShortcuts: {},
};

const plugins = [fooPlugin, betaPlugin];

// ---------------------------------------------------------------------------
// findDataPlugin
// ---------------------------------------------------------------------------

describe("findDataPlugin", () => {
  it("finds a plugin by exact name", () => {
    expect(findDataPlugin(plugins, "foo")).toBe(fooPlugin);
  });

  it("returns undefined for an unknown name", () => {
    expect(findDataPlugin(plugins, "unknown")).toBeUndefined();
  });

  it("normalises the name (case-insensitive, trimmed)", () => {
    expect(findDataPlugin(plugins, "  FOO  ")).toBe(fooPlugin);
  });

  it("returns undefined for null", () => {
    expect(findDataPlugin(plugins, null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(findDataPlugin(plugins, undefined)).toBeUndefined();
  });

  it("works with an empty plugins array", () => {
    expect(findDataPlugin([], "foo")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// findDataSchema
// ---------------------------------------------------------------------------

describe("findDataSchema", () => {
  it("returns the schema for a found plugin", () => {
    expect(findDataSchema(plugins, "foo")).toBe(fooPlugin.schema);
  });

  it("returns undefined when the plugin is not found", () => {
    expect(findDataSchema(plugins, "missing")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getGraphPathShortcutsForDataSchema
// ---------------------------------------------------------------------------

describe("getGraphPathShortcutsForDataSchema", () => {
  it("returns all shortcuts for a plugin as an array with names", () => {
    const shortcuts = getGraphPathShortcutsForDataSchema(plugins, "foo");
    expect(shortcuts).toHaveLength(2);
    const names = shortcuts.map((s) => s.name).sort();
    expect(names).toEqual(["barShortcut", "fooShortcut"]);
  });

  it("returns [] for a plugin with no shortcuts", () => {
    expect(getGraphPathShortcutsForDataSchema(plugins, "beta")).toEqual([]);
  });

  it("returns [] for an unknown plugin", () => {
    expect(getGraphPathShortcutsForDataSchema(plugins, "unknown")).toEqual([]);
  });

  it("each shortcut carries the graphPath from the plugin map", () => {
    const shortcuts = getGraphPathShortcutsForDataSchema(plugins, "foo");
    const fooShortcut = shortcuts.find((s) => s.name === "fooShortcut");
    expect(fooShortcut?.graphPath).toBeDefined();
  });

  it("sets name on the graphPath when it lacks one", () => {
    const shortcuts = getGraphPathShortcutsForDataSchema(plugins, "foo");
    for (const shortcut of shortcuts) {
      expect(shortcut.graphPath.name).toBe(shortcut.name);
    }
  });
});

// ---------------------------------------------------------------------------
// findGraphPathShortcutByName
// ---------------------------------------------------------------------------

describe("findGraphPathShortcutByName", () => {
  it("finds a shortcut by name", () => {
    const result = findGraphPathShortcutByName(plugins, "foo", "fooShortcut");
    expect(result).not.toBeNull();
    expect(result?.name).toBe("fooShortcut");
  });

  it("returns null for an unknown shortcut name", () => {
    expect(findGraphPathShortcutByName(plugins, "foo", "nonExistent")).toBeNull();
  });

  it("returns null for an unknown plugin", () => {
    expect(
      findGraphPathShortcutByName(plugins, "unknown", "fooShortcut"),
    ).toBeNull();
  });

  it("returns a shortcut object with both name and graphPath", () => {
    const result = findGraphPathShortcutByName(plugins, "foo", "barShortcut");
    expect(result?.name).toBe("barShortcut");
    expect(result?.graphPath).toBeDefined();
  });
});
