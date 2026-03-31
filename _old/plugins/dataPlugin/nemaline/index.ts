import { oxfordiaSchema } from "../../_ldo/oxfordia.schema";
import { nemalineGraphPathShortcuts } from "./shortcuts";

export const nemalineDataPlugin = {
  name: "nemaline",
  schema: oxfordiaSchema,
  graphPathShortcuts: nemalineGraphPathShortcuts,
};
