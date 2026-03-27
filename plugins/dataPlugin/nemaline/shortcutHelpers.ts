import { set } from "@ldo/ldo";
import type {
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
} from "../../_ldo/oxfordia.typings";

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
    rdfType: params.rdfType ? set(...params.rdfType) : undefined,
    iri: params.iri ? set(...params.iri) : undefined,
    categories: params.categories ? set(...params.categories) : undefined,
    predicates: params.predicates ? set(...params.predicates) : undefined,
  };
}

export function nodeSelector(filter: GraphNodeFilter): GraphValueSelector {
  return { node: filter } as GraphValueSelector;
}

export function predicateFilter(params: {
  predicate: string;
  inverse?: boolean;
  some?: GraphValueSelector;
  every?: GraphValueSelector;
  none?: GraphValueSelector;
}): GraphPredicateFilter {
  return {
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
    via: iriRef(params.via),
    inverse: params.inverse,
    where: params.where,
  };
}

export function graphPath(params: {
  start: GraphNodeFilter;
  steps?: GraphTraversalStep[];
  target?: GraphValueSelector;
}): GraphPath {
  return {
    start: params.start,
    steps: params.steps ? set(...params.steps) : undefined,
    target: params.target,
  };
}
