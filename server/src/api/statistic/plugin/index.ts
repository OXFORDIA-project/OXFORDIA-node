import type { AnyStatisticApiPlugin } from "../StatisticPlugin";
import { kaplanMeierPlugin } from "./kaplanMeier/kaplanMeierPlugin";
import { meanPlugin } from "./mean/meanPlugin";

/** All registered statistic plugins. Add new plugins here. */
export const statisticsPlugins: AnyStatisticApiPlugin[] = [
  meanPlugin,
  kaplanMeierPlugin,
];

export function findStatisticPlugin(
  route: string,
): AnyStatisticApiPlugin | undefined {
  return statisticsPlugins.find((plugin) => plugin.route === route);
}
