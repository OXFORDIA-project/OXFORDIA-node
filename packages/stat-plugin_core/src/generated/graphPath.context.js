"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphPathContext = void 0;
/**
 * =============================================================================
 * graphPathContext: JSONLD Context for graphPath
 * =============================================================================
 */
exports.graphPathContext = {
    name: {
        "@id": "https://oxfordia.setmeld.com/statistics#name",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
    },
    start: {
        "@id": "https://oxfordia.setmeld.com/statistics#start",
        "@type": "@id",
    },
    rdfType: {
        "@id": "https://oxfordia.setmeld.com/statistics#rdfType",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@isCollection": true,
    },
    iri: {
        "@id": "https://oxfordia.setmeld.com/statistics#iri",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@isCollection": true,
    },
    categories: {
        "@id": "https://oxfordia.setmeld.com/statistics#categories",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@isCollection": true,
    },
    predicates: {
        "@id": "https://oxfordia.setmeld.com/statistics#predicates",
        "@type": "@id",
        "@isCollection": true,
    },
    predicate: {
        "@id": "https://oxfordia.setmeld.com/statistics#predicate",
        "@type": "@id",
    },
    inverse: {
        "@id": "https://oxfordia.setmeld.com/statistics#inverse",
        "@type": "http://www.w3.org/2001/XMLSchema#boolean",
    },
    some: {
        "@id": "https://oxfordia.setmeld.com/statistics#some",
        "@type": "@id",
    },
    node: {
        "@id": "https://oxfordia.setmeld.com/statistics#node",
        "@type": "@id",
    },
    literal: {
        "@id": "https://oxfordia.setmeld.com/statistics#literal",
        "@type": "@id",
    },
    datatype: {
        "@id": "https://oxfordia.setmeld.com/statistics#datatype",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@isCollection": true,
    },
    lang: {
        "@id": "https://oxfordia.setmeld.com/statistics#lang",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@isCollection": true,
    },
    equals: "https://oxfordia.setmeld.com/statistics#equals",
    oneOf: "https://oxfordia.setmeld.com/statistics#oneOf",
    min: {
        "@id": "https://oxfordia.setmeld.com/statistics#min",
        "@type": "http://www.w3.org/2001/XMLSchema#decimal",
    },
    max: {
        "@id": "https://oxfordia.setmeld.com/statistics#max",
        "@type": "http://www.w3.org/2001/XMLSchema#decimal",
    },
    every: {
        "@id": "https://oxfordia.setmeld.com/statistics#every",
        "@type": "@id",
    },
    none: {
        "@id": "https://oxfordia.setmeld.com/statistics#none",
        "@type": "@id",
    },
    steps: {
        "@id": "https://oxfordia.setmeld.com/statistics#steps",
        "@type": "@id",
        "@isCollection": true,
    },
    via: {
        "@id": "https://oxfordia.setmeld.com/statistics#via",
        "@type": "@id",
    },
    where: {
        "@id": "https://oxfordia.setmeld.com/statistics#where",
        "@type": "@id",
    },
    target: {
        "@id": "https://oxfordia.setmeld.com/statistics#target",
        "@type": "@id",
    },
};
//# sourceMappingURL=graphPath.context.js.map