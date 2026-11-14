import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import shortcuts from "../shortcuts.json";

describe("oxfordiar.data.nemaline", () => {
  it("ships the same shortcut catalog as this plugin", () => {
    const rCopy = JSON.parse(
      readFileSync(resolve(__dirname, "../../../oxfordiar.data.nemaline/inst/nemaline-shortcuts.json"), "utf8"),
    );
    expect(rCopy).toEqual(shortcuts);
  });
});
