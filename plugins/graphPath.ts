import { JSONSchema4 } from "json-schema";

const stringSetSchema: JSONSchema4 = {
  anyOf: [
    { type: "string" },
    {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
  ],
};

const idObjectSchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  required: ["@id"],
  properties: {
    "@id": { type: "string" },
  },
};

const metadataSchemaProperties: Record<string, JSONSchema4> = {
  "@id": { type: "string" },
  "@context": {},
  name: { type: "string" },
};

/**
 * JSON Schema representation of GraphPath.
 * Mirrors the canonical LDO typings generated from oxfordia (mean policy graph-path shapes).
 */
export const graphPathSchema: JSONSchema4 = {
  type: "object",
  additionalProperties: false,
  required: ["start"],
  properties: {
    ...metadataSchemaProperties,
    start: { $ref: "#/definitions/graphNodeFilter" },
    steps: {
      type: "array",
      items: { $ref: "#/definitions/graphTraversalStep" },
    },
    target: { $ref: "#/definitions/graphValueSelector" },
  },
  definitions: {
    graphPath: {
      type: "object",
      additionalProperties: false,
      required: ["start"],
      properties: {
        ...metadataSchemaProperties,
        start: { $ref: "#/definitions/graphNodeFilter" },
        steps: {
          type: "array",
          items: { $ref: "#/definitions/graphTraversalStep" },
        },
        target: { $ref: "#/definitions/graphValueSelector" },
      },
    },
    graphNodeFilter: {
      type: "object",
      additionalProperties: false,
      properties: {
        ...metadataSchemaProperties,
        rdfType: stringSetSchema,
        iri: stringSetSchema,
        categories: stringSetSchema,
        predicates: {
          type: "array",
          items: { $ref: "#/definitions/graphPredicateFilter" },
        },
      },
    },
    graphPredicateFilter: {
      type: "object",
      additionalProperties: false,
      required: ["predicate"],
      properties: {
        ...metadataSchemaProperties,
        predicate: idObjectSchema,
        inverse: { type: "boolean" },
        some: { $ref: "#/definitions/graphValueSelector" },
        every: { $ref: "#/definitions/graphValueSelector" },
        none: { $ref: "#/definitions/graphValueSelector" },
      },
    },
    graphTraversalStep: {
      type: "object",
      additionalProperties: false,
      required: ["via"],
      properties: {
        ...metadataSchemaProperties,
        via: idObjectSchema,
        inverse: { type: "boolean" },
        where: { $ref: "#/definitions/graphNodeFilter" },
      },
    },
    graphValueSelector: {
      type: "object",
      additionalProperties: false,
      properties: {
        ...metadataSchemaProperties,
        node: { $ref: "#/definitions/graphNodeFilter" },
        literal: { $ref: "#/definitions/graphLiteralFilter" },
      },
    },
    graphLiteralFilter: {
      type: "object",
      additionalProperties: false,
      properties: {
        ...metadataSchemaProperties,
        datatype: stringSetSchema,
        lang: stringSetSchema,
        equals: {},
        oneOf: {
          anyOf: [
            {},
            {
              type: "array",
              items: {},
              minItems: 1,
            },
          ],
        },
        min: { type: "number" },
        max: { type: "number" },
      },
    },
  },
};
