import type { LdoBase } from "@ldo/ldo";
import type { JSONSchema4 } from "json-schema";
import type { StatisticPlugin } from "@oxfordia/stat-plugin_core";

export type StatisticQuery = {
  resourceUri: string;
};

/**
 * Outcome of post-query disclosure control:
 * - `true`: release the output as-is
 * - `Error`: release nothing (the message becomes the 403 body)
 * - `{ release }`: release this redacted output instead, e.g. a grouped
 *   result with small cells suppressed
 */
export type StatisticPostQueryResult<Output> = true | Error | { release: Output };

export interface StatisticApiPlugin<
  Query extends StatisticQuery,
  Output,
  StatisticAccessRule extends LdoBase,
  Globals = unknown,
> extends StatisticPlugin<StatisticAccessRule> {
  querySchema: JSONSchema4;
  normalizeQuery?(query: unknown): unknown;
  evaluateStatisticAccessRulePreQuery(
    query: Query,
    statisticAccessRule: StatisticAccessRule,
  ): true | Error;
  performQuery(query: Query, globals: Globals): Promise<Output>;
  evaluateStatisticAccessRulePostQuery(
    query: Query,
    statisticAccessRule: StatisticAccessRule,
    output: Output,
  ): StatisticPostQueryResult<Output>;
}

export type AnyStatisticApiPlugin<Globals = unknown> = StatisticApiPlugin<
  StatisticQuery,
  unknown,
  LdoBase,
  Globals
>;
