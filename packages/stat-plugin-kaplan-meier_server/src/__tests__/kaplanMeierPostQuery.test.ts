import { describe, it, expect } from "vitest";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import type { KaplanMeierStatisticAccessRule } from "@oxfordia/stat-plugin-kaplan-meier_core";
import { evaluateKaplanMeierStatisticAccessRulePostQuery } from "../evaluateKaplanMeierStatisticAccessRule";

const step = (via: string) =>
  ({
    "@id": `#${via}`,
    start: { "@id": "#s", rdfType: ["http://example.org/Person"] },
    steps: [{ "@id": "#st", via: { "@id": `http://example.org/${via}` } }],
  }) as unknown as GraphPath;
const TIME = step("time");
const EVENT = step("event");
const GENE = step("gene");

const rule = (kAnonymity: unknown) =>
  ({
    "@id": "#rule",
    allowedPath: [{ "@id": "#ap", timeGraphPath: TIME, eventGraphPath: EVENT, groupByGraphPath: [GENE], kAnonymity }],
  }) as unknown as KaplanMeierStatisticAccessRule;

const obs = (group: string | undefined, n: number) =>
  Array.from({ length: n }, (_, i) => ({ time: i, event: i % 2 === 0, ...(group ? { group } : {}) }));

describe("kaplan-meier k-anonymity", () => {
  it("withholds an ungrouped result below k", () => {
    expect(evaluateKaplanMeierStatisticAccessRulePostQuery(TIME, EVENT, undefined, rule(3), { observations: obs(undefined, 2) }))
      .toBeInstanceOf(Error);
    expect(evaluateKaplanMeierStatisticAccessRulePostQuery(TIME, EVENT, undefined, rule(3), { observations: obs(undefined, 3) }))
      .toBe(true);
  });

  it("drops groups below k together with their observations", () => {
    const output = {
      observations: [...obs("NEB", 4), ...obs("TPM2", 2)],
      groups: [
        { group: "NEB", groupLabel: "NEB", observations: obs(undefined, 4) },
        { group: "TPM2", groupLabel: "TPM2", observations: obs(undefined, 2) },
      ],
    };
    const result = evaluateKaplanMeierStatisticAccessRulePostQuery(TIME, EVENT, GENE, rule(3), output);
    expect(result).toEqual({
      release: { observations: obs("NEB", 4), groups: [output.groups[0]] },
    });
  });

  it("fails closed when every group is below k or k is missing", () => {
    const output = { observations: obs("NEB", 1), groups: [{ group: "NEB", groupLabel: "NEB", observations: obs(undefined, 1) }] };
    expect(evaluateKaplanMeierStatisticAccessRulePostQuery(TIME, EVENT, GENE, rule(3), output)).toBeInstanceOf(Error);
    expect(evaluateKaplanMeierStatisticAccessRulePostQuery(TIME, EVENT, undefined, rule(undefined), { observations: obs(undefined, 9) }))
      .toBeInstanceOf(Error);
  });
});
