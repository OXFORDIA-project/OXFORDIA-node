import { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * statisticAccessRuleDocumentContext: JSONLD Context for statisticAccessRuleDocument
 * =============================================================================
 */
export const statisticAccessRuleDocumentContext: LdoJsonldContext = {
  type: {
    "@id": "@type",
    "@isCollection": true,
  },
  StatisticAccessRule: {
    "@id":
      "https://fedresda.setmeld.com/statistic-access-rule#StatisticAccessRule",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      dataSchema: {
        "@id": "https://fedresda.setmeld.com/statistic-access-rule#dataSchema",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
      hasStatisticPolicy: {
        "@id":
          "https://fedresda.setmeld.com/statistic-access-rule#hasStatisticPolicy",
        "@type": "@id",
        "@isCollection": true,
      },
    },
  },
  dataSchema: {
    "@id": "https://fedresda.setmeld.com/statistic-access-rule#dataSchema",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  hasStatisticPolicy: {
    "@id":
      "https://fedresda.setmeld.com/statistic-access-rule#hasStatisticPolicy",
    "@type": "@id",
    "@isCollection": true,
  },
  statisticName: {
    "@id": "https://fedresda.setmeld.com/statistic-access-rule#statisticName",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
};
