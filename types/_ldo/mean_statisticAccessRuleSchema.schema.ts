import { Schema } from "shexj";

/**
 * =============================================================================
 * mean_statisticAccessRuleSchemaSchema: ShexJ Schema for mean_statisticAccessRuleSchema
 * =============================================================================
 */
export const mean_statisticAccessRuleSchemaSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://fedresda.setmeld.com/statistics#MeanStatisticAccessRuleShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate: "https://fedresda.setmeld.com/statistics#allowedPath",
          valueExpr: "https://fedresda.setmeld.com/statistics#AllowedPathShape",
          min: 1,
          max: -1,
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#AllowedPathShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#graphPath",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphPathShape",
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#minValues",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#GraphPathShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#start",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphNodeFilterShape",
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#steps",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphTraversalStepShape",
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#target",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#GraphNodeFilterShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#rdfType",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#iri",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#categories",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#predicates",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphPredicateFilterShape",
              min: 0,
              max: -1,
            },
          ],
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#GraphPredicateFilterShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#predicate",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#inverse",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#boolean",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#some",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#every",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#none",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#GraphTraversalStepShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#via",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#inverse",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#boolean",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#where",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphNodeFilterShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#GraphValueSelectorShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "OneOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#node",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphNodeFilterShape",
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#literal",
              valueExpr:
                "https://fedresda.setmeld.com/statistics#GraphLiteralFilterShape",
            },
          ],
        },
      },
    },
    {
      id: "https://fedresda.setmeld.com/statistics#GraphLiteralFilterShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#datatype",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#lang",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#equals",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#oneOf",
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#min",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://fedresda.setmeld.com/statistics#max",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
  ],
};
