import { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * mean_statisticAccessRuleSchemaContext: JSONLD Context for mean_statisticAccessRuleSchema
 * =============================================================================
 */
export const mean_statisticAccessRuleSchemaContext: LdoJsonldContext = {
  allowedPath: {
    "@id": "https://fedresda.setmeld.com/statistics#allowedPath",
    "@type": "@id",
    "@isCollection": true,
  },
  graphPath: {
    "@id": "https://fedresda.setmeld.com/statistics#graphPath",
    "@type": "@id",
  },
  start: {
    "@id": "https://fedresda.setmeld.com/statistics#start",
    "@type": "@id",
  },
  rdfType: {
    "@id": "https://fedresda.setmeld.com/statistics#rdfType",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  iri: {
    "@id": "https://fedresda.setmeld.com/statistics#iri",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  categories: {
    "@id": "https://fedresda.setmeld.com/statistics#categories",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  predicates: {
    "@id": "https://fedresda.setmeld.com/statistics#predicates",
    "@type": "@id",
    "@isCollection": true,
  },
  predicate: {
    "@id": "https://fedresda.setmeld.com/statistics#predicate",
    "@type": "@id",
  },
  inverse: {
    "@id": "https://fedresda.setmeld.com/statistics#inverse",
    "@type": "http://www.w3.org/2001/XMLSchema#boolean",
  },
  some: {
    "@id": "https://fedresda.setmeld.com/statistics#some",
    "@type": "@id",
  },
  node: {
    "@id": "https://fedresda.setmeld.com/statistics#node",
    "@type": "@id",
  },
  literal: {
    "@id": "https://fedresda.setmeld.com/statistics#literal",
    "@type": "@id",
  },
  datatype: {
    "@id": "https://fedresda.setmeld.com/statistics#datatype",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  lang: {
    "@id": "https://fedresda.setmeld.com/statistics#lang",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  equals: "https://fedresda.setmeld.com/statistics#equals",
  oneOf: "https://fedresda.setmeld.com/statistics#oneOf",
  min: {
    "@id": "https://fedresda.setmeld.com/statistics#min",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  max: {
    "@id": "https://fedresda.setmeld.com/statistics#max",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  every: {
    "@id": "https://fedresda.setmeld.com/statistics#every",
    "@type": "@id",
  },
  none: {
    "@id": "https://fedresda.setmeld.com/statistics#none",
    "@type": "@id",
  },
  steps: {
    "@id": "https://fedresda.setmeld.com/statistics#steps",
    "@type": "@id",
    "@isCollection": true,
  },
  via: {
    "@id": "https://fedresda.setmeld.com/statistics#via",
    "@type": "@id",
  },
  where: {
    "@id": "https://fedresda.setmeld.com/statistics#where",
    "@type": "@id",
  },
  target: {
    "@id": "https://fedresda.setmeld.com/statistics#target",
    "@type": "@id",
  },
  minValues: {
    "@id": "https://fedresda.setmeld.com/statistics#minValues",
    "@type": "http://www.w3.org/2001/XMLSchema#integer",
  },
};
