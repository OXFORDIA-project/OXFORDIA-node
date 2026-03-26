import type { Schema } from "shexj";
import type { GraphPath } from "@oxfordia/types";
import {
  createEmptyGraphPath,
  makeId,
  type StatisticPolicy,
  type StatisticAccessRuleObjectValue,
  type StatisticAccessRuleScalarValue,
  type StatisticAccessRuleValue,
} from "../types";

type TripleConstraint = {
  predicate: string;
  valueExpr?: unknown;
  min?: number;
  max?: number;
};

export type FieldType = "string" | "integer" | "boolean" | "graphPath" | "object";

export type SchemaFieldDefinition = {
  key: string;
  predicate: string;
  label: string;
  type: FieldType;
  repeated: boolean;
  min: number;
  max: number;
  nestedFields?: SchemaFieldDefinition[];
};

function shortIri(value: string): string {
  const hashIndex = value.lastIndexOf("#");
  if (hashIndex >= 0 && hashIndex < value.length - 1) return value.slice(hashIndex + 1);
  const slashIndex = value.lastIndexOf("/");
  if (slashIndex >= 0 && slashIndex < value.length - 1) return value.slice(slashIndex + 1);
  return value;
}

function extractConstraints(expression: unknown): TripleConstraint[] {
  if (!expression || typeof expression !== "object") return [];
  const maybe = expression as { type?: unknown; expressions?: unknown[] };
  if (maybe.type === "TripleConstraint") {
    const triple = expression as TripleConstraint;
    return typeof triple.predicate === "string" ? [triple] : [];
  }
  if (Array.isArray(maybe.expressions)) {
    return maybe.expressions.flatMap((child) => extractConstraints(child));
  }
  return [];
}

function getShapeDeclById(schema: Schema, shapeId: string): Record<string, unknown> | undefined {
  const shapes = Array.isArray(schema.shapes) ? schema.shapes : [];
  return shapes.find(
    (shape) =>
      shape &&
      typeof shape === "object" &&
      (shape as { id?: unknown }).id === shapeId,
  ) as Record<string, unknown> | undefined;
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function getTopShapeId(schema: Schema, statisticName?: string): string | null {
  const shapes = Array.isArray(schema.shapes) ? schema.shapes : [];
  if (statisticName) {
    const expectedShapeSuffix = `${toPascalCase(statisticName)}StatisticAccessRuleShape`;
    const namedShape = shapes.find((shape) => {
      const id = (shape as { id?: unknown })?.id;
      return typeof id === "string" && id.endsWith(expectedShapeSuffix);
    });
    if (namedShape && typeof (namedShape as { id?: unknown }).id === "string") {
      return (namedShape as { id: string }).id;
    }
  }
  const statisticAccessRuleShape = shapes.find((shape) => {
    const id = (shape as { id?: unknown })?.id;
    return typeof id === "string" && id.endsWith("StatisticAccessRuleShape");
  });
  if (
    statisticAccessRuleShape &&
    typeof (statisticAccessRuleShape as { id?: unknown }).id === "string"
  ) {
    return (statisticAccessRuleShape as { id: string }).id;
  }
  if (typeof schema.start === "string") return schema.start;
  const first = shapes[0] as { id?: unknown } | undefined;
  return typeof first?.id === "string" ? first.id : null;
}

function inferScalarFromValueExpr(valueExpr: unknown): Exclude<FieldType, "graphPath" | "object"> {
  if (!valueExpr || typeof valueExpr !== "object") return "string";
  const asRecord = valueExpr as Record<string, unknown>;
  if (asRecord.datatype === "http://www.w3.org/2001/XMLSchema#integer") return "integer";
  if (asRecord.datatype === "http://www.w3.org/2001/XMLSchema#boolean") return "boolean";
  return "string";
}

function buildFieldDefinition(
  schema: Schema,
  constraint: TripleConstraint,
): SchemaFieldDefinition | null {
  const predicate = constraint.predicate;
  const key = shortIri(predicate);
  const repeated = constraint.max === -1 || (typeof constraint.max === "number" && constraint.max > 1);
  const min = typeof constraint.min === "number" ? constraint.min : 1;
  const max = typeof constraint.max === "number" ? constraint.max : 1;
  const valueExpr = constraint.valueExpr;

  if (typeof valueExpr === "string") {
    if (valueExpr.endsWith("GraphPathShape")) {
      return { key, predicate, label: key, type: "graphPath", repeated, min, max };
    }
    const nestedShape = getShapeDeclById(schema, valueExpr);
    if (!nestedShape) {
      return { key, predicate, label: key, type: "string", repeated, min, max };
    }
    const shapeExpr =
      nestedShape.shapeExpr && typeof nestedShape.shapeExpr === "object"
        ? (nestedShape.shapeExpr as Record<string, unknown>)
        : null;
    const nestedFields = extractConstraints(shapeExpr?.expression).map((nestedConstraint) =>
      buildFieldDefinition(schema, nestedConstraint),
    ).filter((field): field is SchemaFieldDefinition => Boolean(field));
    return {
      key,
      predicate,
      label: key,
      type: "object",
      repeated: true,
      min,
      max,
      nestedFields,
    };
  }

  return {
    key,
    predicate,
    label: key,
    type: inferScalarFromValueExpr(valueExpr),
    repeated,
    min,
    max,
  };
}

export function getPolicyFieldDefinitions(
  schema: Schema,
  statisticName?: string,
): SchemaFieldDefinition[] {
  const topShapeId = getTopShapeId(schema, statisticName);
  if (!topShapeId) return [];
  const shape = getShapeDeclById(schema, topShapeId);
  if (!shape) return [];
  const shapeExpr =
    shape.shapeExpr && typeof shape.shapeExpr === "object"
      ? (shape.shapeExpr as Record<string, unknown>)
      : null;
  const fields = extractConstraints(shapeExpr?.expression)
    .map((constraint) => buildFieldDefinition(schema, constraint))
    .filter((field): field is SchemaFieldDefinition => Boolean(field));
  return fields;
}

function defaultScalar(
  fieldType: "string" | "integer" | "boolean",
): StatisticAccessRuleScalarValue {
  if (fieldType === "integer") return 1;
  if (fieldType === "boolean") return false;
  return "";
}

function createDefaultObjectItem(
  fields: SchemaFieldDefinition[],
): StatisticAccessRuleObjectValue {
  const values: Record<string, StatisticAccessRuleValue> = {};
  fields.forEach((field) => {
    if (field.type === "graphPath") {
      values[field.key] = createEmptyGraphPath();
      return;
    }
    if (field.type === "object") {
      values[field.key] = [];
      return;
    }
    values[field.key] = defaultScalar(field.type);
  });
  return { id: makeId("item"), values };
}

export function createDefaultPolicyValues(
  schema: Schema,
  statisticName?: string,
): Record<string, StatisticAccessRuleValue> {
  const values: Record<string, StatisticAccessRuleValue> = {};
  getPolicyFieldDefinitions(schema, statisticName).forEach((field) => {
    if (field.type === "graphPath") {
      values[field.key] = field.repeated ? [] : createEmptyGraphPath();
      return;
    }
    if (field.type === "object") {
      values[field.key] = [];
      return;
    }
    values[field.key] = field.repeated ? [] : defaultScalar(field.type);
  });
  return values;
}

export function createDefaultStatisticPolicy(
  statisticName: string,
  schema: Schema,
): StatisticPolicy {
  return {
    id: makeId("stat"),
    statisticName,
    values: createDefaultPolicyValues(schema, statisticName),
  };
}

export function getGraphPathFromValue(
  value: StatisticAccessRuleValue | undefined,
): GraphPath {
  if (value && typeof value === "object" && "start" in value) {
    return value as GraphPath;
  }
  return createEmptyGraphPath();
}
