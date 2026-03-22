import { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * kaplanMeier_statisticAccessRuleSchemaContext: JSONLD Context for kaplanMeier_statisticAccessRuleSchema
 * =============================================================================
 */
export const kaplanMeier_statisticAccessRuleSchemaContext: LdoJsonldContext = {
  cohortPath: {
    "@id": "https://fedresda.setmeld.com/statistics#cohortPath",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  eventPath: {
    "@id": "https://fedresda.setmeld.com/statistics#eventPath",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
  timePath: {
    "@id": "https://fedresda.setmeld.com/statistics#timePath",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@isCollection": true,
  },
};
