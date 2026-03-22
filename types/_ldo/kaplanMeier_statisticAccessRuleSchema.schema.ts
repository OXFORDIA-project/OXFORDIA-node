import { Schema } from "shexj";

/**
 * =============================================================================
 * kaplanMeier_statisticAccessRuleSchemaSchema: ShexJ Schema for kaplanMeier_statisticAccessRuleSchema
 * =============================================================================
 */
export const kaplanMeier_statisticAccessRuleSchemaSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://fedresda.setmeld.com/statistics#KaplanMeierStatisticAccessRuleShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#cohortPath",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 1,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#eventPath",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 1,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#timePath",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 1,
              max: -1,
            },
          ],
        },
      },
    },
  ],
};
