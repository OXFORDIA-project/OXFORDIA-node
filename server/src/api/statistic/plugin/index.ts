import type { AnyStatisticApiPlugin } from "@oxfordia/plugins";
import type { IntegrationPodGlobals } from "../../../globals";
import { kaplanMeierPlugin } from "./kaplanMeier/kaplanMeierPlugin";
import { meanPlugin } from "./mean/meanPlugin";

/** All registered statistic plugins. Add new plugins here. */
export const statisticsPlugins: AnyStatisticApiPlugin<IntegrationPodGlobals>[] = [
  meanPlugin,
  kaplanMeierPlugin,
];

export function findStatisticPlugin(
  route: string,
): AnyStatisticApiPlugin<IntegrationPodGlobals> | undefined {
  return statisticsPlugins.find((plugin) => plugin.route === route);
}
