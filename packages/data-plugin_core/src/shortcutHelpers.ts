import { set } from "@ldo/ldo";
import type {
  GraphLiteralFilter,
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
} from "@oxfordia/stat-plugin_core";

function createLocalId(prefix: string): string {
  return `#${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function iriRef(value: string): { "@id": string } {
  return { "@id": value };
}

export function nodeFilter(params: {
  rdfType?: string[];
  iri?: string[];
  categories?: string[];
  predicates?: GraphPredicateFilter[];
}): GraphNodeFilter {
  return {
    "@id": createLocalId("graph-node-filter"),
    rdfType: params.rdfType ? set(...params.rdfType) : undefined,
    iri: params.iri ? set(...params.iri) : undefined,
    categories: params.categories ? set(...params.categories) : undefined,
    predicates: params.predicates ? set(...params.predicates) : undefined,
  };
}

export function nodeSelector(filter: GraphNodeFilter): GraphValueSelector {
  return {
    "@id": createLocalId("graph-value-selector"),
    node: filter,
  } as GraphValueSelector;
}

export function literalSelector(filter: GraphLiteralFilter): GraphValueSelector {
  return {
    "@id": createLocalId("graph-value-selector"),
    literal: filter,
  } as GraphValueSelector;
}

export function predicateFilter(params: {
  predicate: string;
  inverse?: boolean;
  some?: GraphValueSelector;
  every?: GraphValueSelector;
  none?: GraphValueSelector;
}): GraphPredicateFilter {
  return {
    "@id": createLocalId("graph-predicate-filter"),
    predicate: iriRef(params.predicate),
    inverse: params.inverse,
    some: params.some,
    every: params.every,
    none: params.none,
  };
}

export function traversalStep(params: {
  via: string;
  inverse?: boolean;
  where?: GraphNodeFilter;
}): GraphTraversalStep {
  return {
    "@id": createLocalId("graph-traversal-step"),
    via: iriRef(params.via),
    inverse: params.inverse,
    where: params.where,
  };
}

export function graphPath(params: {
  name?: string;
  start: GraphNodeFilter;
  steps?: GraphTraversalStep[];
  target?: GraphValueSelector;
}): GraphPath {
  return {
    "@id": createLocalId("graph-path"),
    name: params.name,
    start: params.start,
    steps: params.steps ? set(...params.steps) : undefined,
    target: params.target,
  };
}
