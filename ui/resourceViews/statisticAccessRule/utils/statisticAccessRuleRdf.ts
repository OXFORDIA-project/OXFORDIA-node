import { parseRdf, set } from "@ldo/ldo";
import { namedNode } from "@ldo/rdf-utils";
import type {
  GraphLiteralFilter,
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
} from "@oxfordia/types";
import type {
  StatisticPolicy,
  StatisticAccessRuleLoadResult,
  StatisticAccessRuleScalarValue,
  StatisticAccessRuleSchemas,
  StatisticAccessRuleValue,
} from "../types";
import { createEmptyGraphPath, makeId } from "../types";
import {
  createDefaultPolicyValues,
  getGraphPathFromValue,
  getPolicyFieldDefinitions,
  type SchemaFieldDefinition,
} from "./statisticAccessRuleSchemaForm";

const SAR = "https://oxfordia.setmeld.com/statistic-access-rule#";
const STATP = "https://oxfordia.setmeld.com/statistics#";
const DATA_SCHEMA_PREDICATE = `${SAR}dataSchema`;
const HAS_STATISTIC_POLICY_PREDICATE = `${SAR}hasStatisticPolicy`;
const STATISTIC_NAME_PREDICATE = `${SAR}statisticName`;
const START_PREDICATE = `${STATP}start`;
const STEPS_PREDICATE = `${STATP}steps`;
const TARGET_PREDICATE = `${STATP}target`;
const VIA_PREDICATE = `${STATP}via`;
const INVERSE_PREDICATE = `${STATP}inverse`;
const WHERE_PREDICATE = `${STATP}where`;
const RDF_TYPE_PREDICATE = `${STATP}rdfType`;
const IRI_PREDICATE = `${STATP}iri`;
const CATEGORIES_PREDICATE = `${STATP}categories`;
const PREDICATES_PREDICATE = `${STATP}predicates`;
const PREDICATE_PREDICATE = `${STATP}predicate`;
const SOME_PREDICATE = `${STATP}some`;
const EVERY_PREDICATE = `${STATP}every`;
const NONE_PREDICATE = `${STATP}none`;
const NODE_PREDICATE = `${STATP}node`;
const LITERAL_PREDICATE = `${STATP}literal`;
const DATATYPE_PREDICATE = `${STATP}datatype`;
const LANG_PREDICATE = `${STATP}lang`;
const EQUALS_PREDICATE = `${STATP}equals`;
const ONE_OF_PREDICATE = `${STATP}oneOf`;
const MIN_PREDICATE = `${STATP}min`;
const MAX_PREDICATE = `${STATP}max`;

type RdfTerm = { termType?: string; value?: string };
type Quad = { subject?: RdfTerm; object?: RdfTerm };
type IriObject = { "@id": string };
type ScalarLiteral = string | number | boolean;

function asArray(matchResult: unknown): Quad[] {
  const maybeToArray = matchResult as { toArray?: () => unknown[] };
  if (typeof maybeToArray.toArray === "function") {
    return maybeToArray.toArray() as Quad[];
  }
  return [];
}

function allPredicateMatches(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  predicate: string,
): Quad[] {
  return asArray(dataset.match(null, namedNode(predicate), null));
}

function firstLiteral(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  subjectValue: string,
  predicate: string,
): string | null {
  const matches = allPredicateMatches(dataset, predicate).filter(
    (q) => q.subject?.value === subjectValue,
  );
  const value = matches[0]?.object?.value;
  return typeof value === "string" ? value : null;
}

function allLiterals(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  subjectValue: string,
  predicate: string,
): string[] {
  const matches = allPredicateMatches(dataset, predicate).filter(
    (q) => q.subject?.value === subjectValue,
  );
  return matches
    .map((m) => m.object?.value)
    .filter((v): v is string => typeof v === "string");
}

function allObjectNodeValues(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  subjectValue: string,
  predicate: string,
): string[] {
  const matches = allPredicateMatches(dataset, predicate).filter(
    (q) => q.subject?.value === subjectValue,
  );
  return matches
    .filter((m) => m.object?.termType === "NamedNode" || m.object?.termType === "BlankNode")
    .map((m) => m.object?.value)
    .filter((v): v is string => typeof v === "string");
}

function escapeTurtleLiteral(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toLiteralTerm(value: string): string {
  return `"${escapeTurtleLiteral(value)}"`;
}

function toIriToken(value: string): string {
  if (value.startsWith("<") && value.endsWith(">")) return value;
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("urn:")
  ) {
    return `<${value}>`;
  }
  return value;
}

function toCollectionArray<T>(value: T | T[] | Iterable<T> | undefined): T[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value as T];
  if (typeof value === "object" && Symbol.iterator in (value as object)) {
    return Array.from(value as Iterable<T>);
  }
  return [value as T];
}

function toBoolean(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function toNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function toScalarLiteral(value: string): ScalarLiteral {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function isIriObject(value: unknown): value is IriObject {
  if (!value || typeof value !== "object") return false;
  const maybe = value as Record<string, unknown>;
  return typeof maybe["@id"] === "string";
}

function getIriValue(value: string | IriObject | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (isIriObject(value)) return value["@id"];
  return undefined;
}

function toIriObject(value: string | undefined): IriObject | undefined {
  return value ? { "@id": value } : undefined;
}

function parseGraphLiteralFilter(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  literalNodeId: string | undefined,
): GraphLiteralFilter {
  if (!literalNodeId) return {};
  const datatype = allLiterals(dataset, literalNodeId, DATATYPE_PREDICATE);
  const lang = allLiterals(dataset, literalNodeId, LANG_PREDICATE);
  const equalsLiteral = firstLiteral(dataset, literalNodeId, EQUALS_PREDICATE);
  const oneOfValues = allLiterals(dataset, literalNodeId, ONE_OF_PREDICATE).map(
    (item) => toScalarLiteral(item),
  );
  return {
    datatype: datatype.length > 0 ? set(...datatype) : undefined,
    lang: lang.length > 0 ? set(...lang) : undefined,
    equals: equalsLiteral !== null ? toScalarLiteral(equalsLiteral) : undefined,
    oneOf: oneOfValues.length > 0 ? set(...oneOfValues) : undefined,
    min: toNumber(firstLiteral(dataset, literalNodeId, MIN_PREDICATE)),
    max: toNumber(firstLiteral(dataset, literalNodeId, MAX_PREDICATE)),
  };
}

function parseGraphValueSelector(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  selectorNodeId: string | undefined,
): GraphValueSelector {
  if (!selectorNodeId) return {};
  const nodeNodeId = allObjectNodeValues(dataset, selectorNodeId, NODE_PREDICATE)[0];
  if (nodeNodeId) {
    return { node: parseGraphNodeFilter(dataset, nodeNodeId) } as GraphValueSelector;
  }
  const literalNodeId = allObjectNodeValues(dataset, selectorNodeId, LITERAL_PREDICATE)[0];
  if (literalNodeId) {
    return { literal: parseGraphLiteralFilter(dataset, literalNodeId) } as GraphValueSelector;
  }
  return {};
}

function parseGraphPredicateFilter(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  predicateFilterNodeId: string | undefined,
): GraphPredicateFilter | null {
  if (!predicateFilterNodeId) return null;
  const predicate = toIriObject(
    allObjectNodeValues(dataset, predicateFilterNodeId, PREDICATE_PREDICATE)[0],
  );
  if (!predicate) return null;
  const someNode = allObjectNodeValues(dataset, predicateFilterNodeId, SOME_PREDICATE)[0];
  const everyNode = allObjectNodeValues(dataset, predicateFilterNodeId, EVERY_PREDICATE)[0];
  const noneNode = allObjectNodeValues(dataset, predicateFilterNodeId, NONE_PREDICATE)[0];
  return {
    predicate,
    inverse: toBoolean(firstLiteral(dataset, predicateFilterNodeId, INVERSE_PREDICATE)),
    some: someNode ? parseGraphValueSelector(dataset, someNode) : undefined,
    every: everyNode ? parseGraphValueSelector(dataset, everyNode) : undefined,
    none: noneNode ? parseGraphValueSelector(dataset, noneNode) : undefined,
  };
}

function parseGraphNodeFilter(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  filterNodeId: string | undefined,
): GraphNodeFilter {
  if (!filterNodeId) return {};
  const predicates = allObjectNodeValues(dataset, filterNodeId, PREDICATES_PREDICATE)
    .map((predicateFilterNodeId) =>
      parseGraphPredicateFilter(dataset, predicateFilterNodeId),
    )
    .filter((value): value is GraphPredicateFilter => Boolean(value));
  return {
    rdfType: set(...allLiterals(dataset, filterNodeId, RDF_TYPE_PREDICATE)),
    iri: set(...allLiterals(dataset, filterNodeId, IRI_PREDICATE)),
    categories: set(...allLiterals(dataset, filterNodeId, CATEGORIES_PREDICATE)),
    predicates: predicates.length > 0 ? set(...predicates) : undefined,
  };
}

function parseGraphTraversalStep(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  stepNodeId: string | undefined,
): GraphTraversalStep | null {
  if (!stepNodeId) return null;
  const via = toIriObject(allObjectNodeValues(dataset, stepNodeId, VIA_PREDICATE)[0]);
  if (!via) return null;
  const whereNode = allObjectNodeValues(dataset, stepNodeId, WHERE_PREDICATE)[0];
  return {
    via,
    inverse: toBoolean(firstLiteral(dataset, stepNodeId, INVERSE_PREDICATE)),
    where: whereNode ? parseGraphNodeFilter(dataset, whereNode) : undefined,
  };
}

function parseGraphPath(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  graphPathNode: string | undefined,
): GraphPath {
  if (!graphPathNode) return createEmptyGraphPath();
  const startNodeId = allObjectNodeValues(dataset, graphPathNode, START_PREDICATE)[0];
  const steps = allObjectNodeValues(dataset, graphPathNode, STEPS_PREDICATE)
    .map((stepNode) => parseGraphTraversalStep(dataset, stepNode))
    .filter((value): value is GraphTraversalStep => Boolean(value));
  const targetNodeId = allObjectNodeValues(dataset, graphPathNode, TARGET_PREDICATE)[0];
  return {
    start: parseGraphNodeFilter(dataset, startNodeId),
    steps: set(...steps),
    target: targetNodeId
      ? parseGraphValueSelector(dataset, targetNodeId)
      : undefined,
  };
}

function toIriTerm(value: string | IriObject | undefined): string | null {
  const iri = getIriValue(value);
  if (!iri) return null;
  return toIriToken(iri);
}

function toScalarLiteralTerm(value: ScalarLiteral): string {
  if (typeof value === "number") return `${Number(value)}`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return toLiteralTerm(value);
}

function createNamedNode(prefix: string): string {
  return `<#${makeId(prefix)}>`;
}

function addTriple(
  lines: string[],
  subject: string,
  predicate: string,
  object: string,
): void {
  lines.push(`${subject} ${predicate} ${object} .`);
}

function addGraphLiteralFilter(
  lines: string[],
  filter: GraphLiteralFilter,
): string {
  const literalNode = createNamedNode("literal");
  toCollectionArray(filter.datatype).forEach((datatype) => {
    addTriple(lines, literalNode, "statp:datatype", toLiteralTerm(datatype));
  });
  toCollectionArray(filter.lang).forEach((lang) => {
    addTriple(lines, literalNode, "statp:lang", toLiteralTerm(lang));
  });
  if (
    typeof filter.equals === "string" ||
    typeof filter.equals === "number" ||
    typeof filter.equals === "boolean"
  ) {
    addTriple(
      lines,
      literalNode,
      "statp:equals",
      toScalarLiteralTerm(filter.equals),
    );
  }
  toCollectionArray(filter.oneOf).forEach((value) => {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      addTriple(lines, literalNode, "statp:oneOf", toScalarLiteralTerm(value));
    }
  });
  if (typeof filter.min === "number") {
    addTriple(lines, literalNode, "statp:min", `${filter.min}`);
  }
  if (typeof filter.max === "number") {
    addTriple(lines, literalNode, "statp:max", `${filter.max}`);
  }
  return literalNode;
}

function addGraphValueSelector(
  lines: string[],
  selector: GraphValueSelector | undefined,
): string | null {
  if (!selector) return null;
  const selectorRecord = selector as Record<string, unknown>;
  const selectorNode = createNamedNode("selector");
  if ("node" in selectorRecord && selectorRecord.node) {
    const nodeFilterNode = addGraphNodeFilter(
      lines,
      selectorRecord.node as GraphNodeFilter,
    );
    addTriple(lines, selectorNode, "statp:node", nodeFilterNode);
    return selectorNode;
  }
  if ("literal" in selectorRecord && selectorRecord.literal) {
    const literalNode = addGraphLiteralFilter(
      lines,
      selectorRecord.literal as GraphLiteralFilter,
    );
    addTriple(lines, selectorNode, "statp:literal", literalNode);
    return selectorNode;
  }
  return null;
}

function addGraphPredicateFilter(
  lines: string[],
  filter: GraphPredicateFilter,
): string | null {
  const predicateTerm = toIriTerm(filter.predicate);
  if (!predicateTerm) return null;
  const filterNode = createNamedNode("predicate-filter");
  addTriple(lines, filterNode, "statp:predicate", predicateTerm);
  if (filter.inverse === true) {
    addTriple(lines, filterNode, "statp:inverse", "true");
  }
  const someNode = addGraphValueSelector(lines, filter.some);
  if (someNode) addTriple(lines, filterNode, "statp:some", someNode);
  const everyNode = addGraphValueSelector(lines, filter.every);
  if (everyNode) addTriple(lines, filterNode, "statp:every", everyNode);
  const noneNode = addGraphValueSelector(lines, filter.none);
  if (noneNode) addTriple(lines, filterNode, "statp:none", noneNode);
  return filterNode;
}

function addGraphNodeFilter(lines: string[], filter: GraphNodeFilter): string {
  const nodeFilterNode = createNamedNode("node-filter");
  toCollectionArray(filter.rdfType).forEach((value) => {
    addTriple(lines, nodeFilterNode, "statp:rdfType", toLiteralTerm(value));
  });
  toCollectionArray(filter.iri).forEach((value) => {
    addTriple(lines, nodeFilterNode, "statp:iri", toLiteralTerm(value));
  });
  toCollectionArray(filter.categories).forEach((value) => {
    addTriple(lines, nodeFilterNode, "statp:categories", toLiteralTerm(value));
  });
  toCollectionArray(filter.predicates).forEach((predicateFilter) => {
    const predicateFilterNode = addGraphPredicateFilter(lines, predicateFilter);
    if (predicateFilterNode) {
      addTriple(lines, nodeFilterNode, "statp:predicates", predicateFilterNode);
    }
  });
  return nodeFilterNode;
}

function addGraphTraversalStep(
  lines: string[],
  step: GraphTraversalStep,
): string | null {
  const via = toIriTerm(step.via);
  if (!via) return null;
  const stepNode = createNamedNode("step");
  addTriple(lines, stepNode, "statp:via", via);
  if (step.inverse === true) {
    addTriple(lines, stepNode, "statp:inverse", "true");
  }
  if (step.where) {
    const whereNode = addGraphNodeFilter(lines, step.where);
    addTriple(lines, stepNode, "statp:where", whereNode);
  }
  return stepNode;
}

function addGraphPath(lines: string[], graphPath: GraphPath): string {
  const graphPathNode = createNamedNode("graph-path");
  const startNode = addGraphNodeFilter(lines, graphPath.start);
  addTriple(lines, graphPathNode, "statp:start", startNode);
  toCollectionArray(graphPath.steps).forEach((step) => {
    const stepNode = addGraphTraversalStep(lines, step);
    if (stepNode) addTriple(lines, graphPathNode, "statp:steps", stepNode);
  });
  const targetNode = addGraphValueSelector(lines, graphPath.target);
  if (targetNode) addTriple(lines, graphPathNode, "statp:target", targetNode);
  return graphPathNode;
}

function appendFieldsForSubject(
  lines: string[],
  subjectNode: string,
  fields: SchemaFieldDefinition[],
  values: Record<string, StatisticAccessRuleValue>,
): void {
  fields.forEach((field) => {
    const value = values[field.key];
    const predicateTerm = `<${field.predicate}>`;
    if (field.type === "graphPath") {
      if (field.repeated) {
        const list = Array.isArray(value) ? (value as GraphPath[]) : [];
        list.forEach((graphPath) => {
          const graphPathNode = addGraphPath(lines, graphPath);
          addTriple(lines, subjectNode, predicateTerm, graphPathNode);
        });
        return;
      }
      const graphPath = getGraphPathFromValue(value);
      const graphPathNode = addGraphPath(lines, graphPath);
      addTriple(lines, subjectNode, predicateTerm, graphPathNode);
      return;
    }

    if (field.type === "object") {
      const items = Array.isArray(value)
        ? (value as { values: Record<string, StatisticAccessRuleValue> }[])
        : [];
      items.forEach((item) => {
        const objectNode = createNamedNode("field-object");
        addTriple(lines, subjectNode, predicateTerm, objectNode);
        appendFieldsForSubject(
          lines,
          objectNode,
          field.nestedFields ?? [],
          item.values,
        );
      });
      return;
    }

    if (field.repeated) {
      const list = Array.isArray(value)
        ? (value as StatisticAccessRuleScalarValue[])
        : [];
      list.forEach((item) => {
        addTriple(lines, subjectNode, predicateTerm, toLiteral(item));
      });
      return;
    }

    addTriple(
      lines,
      subjectNode,
      predicateTerm,
      toLiteral((value as StatisticAccessRuleScalarValue) ?? ""),
    );
  });
}

export function getStatisticAccessRuleTtlUri(targetUri: string): string {
  if (targetUri.endsWith(".statistic-access-rule.ttl")) return targetUri;
  if (targetUri.endsWith(".statistic-access-rule.jsonld")) {
    return targetUri.replace(
      /\.statistic-access-rule\.jsonld$/i,
      ".statistic-access-rule.ttl",
    );
  }
  if (targetUri.endsWith(".statistic-access-rule.json")) {
    return targetUri.replace(
      /\.statistic-access-rule\.json$/i,
      ".statistic-access-rule.ttl",
    );
  }
  return targetUri;
}

export function getCandidateStatisticAccessRuleUris(targetUri: string): string[] {
  const ttl = getStatisticAccessRuleTtlUri(targetUri);
  const jsonld = ttl.replace(
    /\.statistic-access-rule\.ttl$/i,
    ".statistic-access-rule.jsonld",
  );
  const json = ttl.replace(
    /\.statistic-access-rule\.ttl$/i,
    ".statistic-access-rule.json",
  );
  return [ttl, jsonld, json];
}

export async function loadStatisticAccessRule(
  authFetch: typeof fetch,
  targetUri: string,
  statisticAccessRuleSchemas: StatisticAccessRuleSchemas,
): Promise<StatisticAccessRuleLoadResult> {
  const candidates = getCandidateStatisticAccessRuleUris(targetUri);
  for (const uri of candidates) {
    const res = await authFetch(uri);
    if (!res.ok) continue;
    const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
    const body = await res.text();

    if (uri.endsWith(".ttl") || contentType.includes("text/turtle")) {
      const dataset = await parseRdf(body, { baseIRI: uri, format: "Turtle" });
      const datasetLike = dataset as unknown as {
        match: (s: unknown, p: unknown, o: unknown) => unknown;
      };
      const dataSchemaMatches = allPredicateMatches(datasetLike, DATA_SCHEMA_PREDICATE);
      const policySubject = dataSchemaMatches[0]?.subject?.value;
      const dataSchemaName = dataSchemaMatches[0]?.object?.value;
      if (!policySubject || typeof dataSchemaName !== "string") {
        return { dataSchemaName: null, statisticPolicies: [] };
      }
      const policyNodes = allObjectNodeValues(
        datasetLike,
        policySubject,
        HAS_STATISTIC_POLICY_PREDICATE,
      );

      const statisticPolicies: StatisticPolicy[] = [];
      policyNodes.forEach((policyNode) => {
        const statisticName = firstLiteral(
          datasetLike,
          policyNode,
          STATISTIC_NAME_PREDICATE,
        );
        if (!statisticName) return;
        const schema = statisticAccessRuleSchemas[statisticName];
        const fieldDefs = schema
          ? getPolicyFieldDefinitions(schema, statisticName)
          : [];
        const values: Record<string, StatisticAccessRuleValue> = schema
          ? createDefaultPolicyValues(schema, statisticName)
          : {};
        fieldDefs.forEach((field) => {
          values[field.key] = parseFieldValue(datasetLike, policyNode, field);
        });
        statisticPolicies.push({
          id: makeId("stat"),
          statisticName,
          values,
        });
      });

      return { dataSchemaName, statisticPolicies };
    }

    const parsedJson = JSON.parse(body) as Record<string, unknown>;
    const dataSchemaName =
      typeof parsedJson.dataSchema === "string" ? parsedJson.dataSchema : null;
    return { dataSchemaName, statisticPolicies: [] };
  }
  throw new Error("Unable to load any statistic access rule resource variant.");
}

export function buildStatisticAccessRuleTurtle(
  dataSchemaName: string | null,
  statisticPolicies: StatisticPolicy[],
  statisticAccessRuleSchemas: StatisticAccessRuleSchemas,
): string {
  const lines: string[] = [
    `@prefix sar: <${SAR}> .`,
    `@prefix statp: <${STATP}> .`,
    "",
    "<#policy> a sar:StatisticAccessRule .",
    `<#policy> sar:dataSchema "${escapeTurtleLiteral(dataSchemaName ?? "nemaline")}" .`,
  ];

  statisticPolicies.forEach((policy) => {
    const schema = statisticAccessRuleSchemas[policy.statisticName];
    const fieldDefs = schema
      ? getPolicyFieldDefinitions(schema, policy.statisticName)
      : [];
    const policyNode = createNamedNode("statistic-policy");
    addTriple(lines, "<#policy>", "sar:hasStatisticPolicy", policyNode);
    addTriple(
      lines,
      policyNode,
      "sar:statisticName",
      toLiteralTerm(policy.statisticName),
    );
    appendFieldsForSubject(lines, policyNode, fieldDefs, policy.values);
  });

  lines.push("");
  return lines.join("\n");
}

function toLiteral(value: string | number | boolean): string {
  if (typeof value === "number") return `${Number(value)}`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return `"${escapeTurtleLiteral(value)}"`;
}

function parseFieldValue(
  dataset: { match: (s: unknown, p: unknown, o: unknown) => unknown },
  subjectNode: string,
  field: SchemaFieldDefinition,
): StatisticAccessRuleValue {
  if (field.type === "graphPath") {
    const nodes = allObjectNodeValues(dataset, subjectNode, field.predicate);
    if (field.repeated) {
      return nodes.map((node) => parseGraphPath(dataset, node));
    }
    return parseGraphPath(dataset, nodes[0]);
  }

  if (field.type === "object") {
    const nodes = allObjectNodeValues(dataset, subjectNode, field.predicate);
    return nodes.map((node) => {
      const values: Record<string, StatisticAccessRuleValue> = {};
      (field.nestedFields ?? []).forEach((nestedField) => {
        values[nestedField.key] = parseFieldValue(dataset, node, nestedField);
      });
      return { id: makeId("item"), values };
    });
  }

  const literals = allLiterals(dataset, subjectNode, field.predicate);
  if (field.repeated) {
    return literals.map((literal) =>
      parseScalarLiteral(
        literal,
        field.type === "integer" || field.type === "boolean" ? field.type : "string",
      ),
    );
  }
  return parseScalarLiteral(
    literals[0] ?? "",
    field.type === "integer" || field.type === "boolean" ? field.type : "string",
  );
}

function parseScalarLiteral(
  literal: string,
  fieldType: "string" | "integer" | "boolean",
): string | number | boolean {
  if (fieldType === "integer") {
    const numeric = Number(literal);
    return Number.isFinite(numeric) ? Math.max(1, Math.trunc(numeric)) : 1;
  }
  if (fieldType === "boolean") {
    return literal === "true";
  }
  return literal;
}
