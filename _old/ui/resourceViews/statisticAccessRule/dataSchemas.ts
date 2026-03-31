import type { Schema } from "shexj";

export type DataSchemaJsonTripleConstraint = {
  predicate: string;
  valueExpr: string;
};

export type DataSchemaJsonShape = {
  id: string;
  tripleConstraints?: DataSchemaJsonTripleConstraint[];
};

export type DataSchemaJsonView = {
  name: string;
  shapeCount: number;
  shapes?: DataSchemaJsonShape[];
};

function normalizeValueExpr(valueExpr: unknown): string {
  if (typeof valueExpr === "string") {
    return valueExpr;
  }
  if (!valueExpr || typeof valueExpr !== "object") {
    return "Unknown";
  }
  if ("values" in valueExpr && Array.isArray(valueExpr.values)) {
    return valueExpr.values.join(" | ");
  }
  if ("datatype" in valueExpr && typeof valueExpr.datatype === "string") {
    return `datatype:${valueExpr.datatype}`;
  }
  if ("type" in valueExpr && typeof valueExpr.type === "string") {
    return valueExpr.type;
  }
  return "Unknown";
}

function collectTripleConstraints(expression: unknown): DataSchemaJsonTripleConstraint[] {
  if (!expression || typeof expression !== "object") {
    return [];
  }
  if ("type" in expression && expression.type === "TripleConstraint") {
    return [
      {
        predicate:
          "predicate" in expression && typeof expression.predicate === "string"
            ? expression.predicate
            : "Unknown",
        valueExpr: normalizeValueExpr(
          "valueExpr" in expression ? expression.valueExpr : undefined,
        ),
      },
    ];
  }
  if ("expressions" in expression && Array.isArray(expression.expressions)) {
    return expression.expressions.flatMap((child) => collectTripleConstraints(child));
  }
  return [];
}

export function asJsonDataSchema(name: string, schema: Schema): DataSchemaJsonView {
  const shapes = Array.isArray(schema.shapes) ? schema.shapes : [];
  const jsonShapes: DataSchemaJsonShape[] = shapes.map((shapeDecl) => {
    const id =
      "id" in shapeDecl && typeof shapeDecl.id === "string"
        ? shapeDecl.id
        : "UnknownShape";
    const expression =
      "shapeExpr" in shapeDecl &&
      shapeDecl.shapeExpr &&
      typeof shapeDecl.shapeExpr === "object" &&
      "expression" in shapeDecl.shapeExpr
        ? shapeDecl.shapeExpr.expression
        : undefined;
    return {
      id,
      tripleConstraints: collectTripleConstraints(expression),
    };
  });

  return {
    name,
    shapeCount: jsonShapes.length,
    shapes: jsonShapes,
  };
}
