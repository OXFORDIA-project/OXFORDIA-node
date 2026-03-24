import { Schema } from "shexj";

/**
 * =============================================================================
 * statisticAccessRuleDocumentSchema: ShexJ Schema for statisticAccessRuleDocument
 * =============================================================================
 */
export const statisticAccessRuleDocumentSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRuleDocumentShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistic-access-rule#dataSchema",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistic-access-rule#hasStatisticPolicy",
              valueExpr:
                "https://oxfordia.setmeld.com/statistic-access-rule#StatisticPolicyShape",
              min: 0,
              max: -1,
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistic-access-rule#StatisticPolicyShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate:
            "https://oxfordia.setmeld.com/statistic-access-rule#statisticName",
          valueExpr: {
            type: "NodeConstraint",
            datatype: "http://www.w3.org/2001/XMLSchema#string",
          },
        },
      },
    },
  ],
};
