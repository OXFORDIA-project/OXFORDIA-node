import type { Schema } from "shexj";

/**
 * =============================================================================
 * angelmanDataSchemaSchema: ShexJ Schema for angelman_dataSchema
 * =============================================================================
 */
export const angelmanDataSchemaSchema: Schema = {
  type: "Schema",
  start: "https://paediatrics.ox.ac.uk/terms/PersonShape",
  shapes: [
    {
      id: "https://paediatrics.ox.ac.uk/terms/PersonShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Person",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isIdentifiedBy",
              valueExpr: "https://paediatrics.ox.ac.uk/terms/IDShape",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Record ID",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "Unique study record identifier (REDCap: record_id)",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Gender_Male",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Gender_Female",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Gender_Other",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Sex of the participant (REDCap: d_gender). 1=Male, 2=Female",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Right",
                  "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Left",
                  "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Mixed",
                  "https://paediatrics.ox.ac.uk/angelman/terms/DominantHand_Unknown",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Dominant hand of participant (REDCap: d_dominant). 1=Left, 2=Right, 3=Ambidextrous, 4=Not determined",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Age at Screening",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Age at date of screening in decimal years (REDCap: es_age, number_1dp)",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              inverse: true,
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/StudyVisitShape",
              min: 0,
              max: -1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Study Visits",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Clinical assessment visits attended by this participant",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Study Participant",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "A person enrolled in the Angelman HasHis-FAST UK study (REDCap form: demographics)",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/terms/IDShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://w3id.org/semanticarts/ns/ontology/gist/ID"],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/uniqueText",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "ID string",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "The record identifier text value",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Record ID",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "Unique alphanumeric study identifier assigned at enrolment (REDCap: record_id)",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Aspect_Age",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Unit_Year",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Age (years, 1 d.p.)",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Age at Screening",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "Age of the participant in decimal years recorded at the screening visit (REDCap: es_age)",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/StudyVisitShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Determination",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Baseline",
                  "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit2",
                  "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit3",
                  "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit4",
                  "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit5",
                  "https://paediatrics.ox.ac.uk/angelman/terms/VisitType_Visit6",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Visit Type",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Which numbered study visit this record represents (Baseline, Visit 2–6)",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
              valueExpr: "https://paediatrics.ox.ac.uk/terms/PersonShape",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Participant",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "The enrolled study participant assessed at this visit",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/VisitAgeMagnitude",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Age at Visit",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Participant age in decimal years at the time of this visit",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/produces",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLFIMYoungResult",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "PedsQL FIM — Young Child (1-month)",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "PedsQL Family Impact Module for carers of children under 7, referencing the past 1 month (REDCap form: pedsql_family_impact_module, sections fim_*_q* without _7_ suffix)",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/produces",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLFIM7PlusResult",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "PedsQL FIM — 7-day reference",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "PedsQL Family Impact Module referencing the past 7 days (REDCap form: pedsql_family_impact_module, sections fim_*_7_q*)",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/produces",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLAdultResult",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "PedsQL Adult / Child Quality of Life Inventory",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "PedsQL age-banded QoL Inventory (parent-reported) covering Physical, Emotional, Social, and School/Work functioning (REDCap form: pedsql_adult_quality_of_life_inventory)",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Study Visit",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "A scheduled clinical assessment visit in the Angelman HasHis-FAST UK study. Date recorded in REDCap field dov (date_dmy). Visit type covers Baseline through Visit 6.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/VisitAgeMagnitude",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_AgeAtVisit",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Unit_Year",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Age (years)",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Age at Visit",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "Participant age in decimal years at the time of this specific study visit",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLFIMYoungResult",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Content",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Concept_FIM_YoungChild",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Instrument concept",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "PedsQL FIM instrument for young children, 1-month reference period",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q6",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q6",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Communication Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Communication Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Communication Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Daily Activities Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Daily Activities Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Daily Activities Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q5",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "PedsQL Family Impact Module — Young Child (past 1 month)",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL Family Impact Module completed by the carer, referencing the past 1 month. Covers caregiver Physical Functioning, Emotional Functioning, Social Functioning, Cognitive Functioning, Communication, Worry, Daily Activities, and Family Relationships.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel tired during the day",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Physical Functioning Q1 (REDCap: fim_functioning_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel tired when I wake up in the morning",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Physical Functioning Q2 (REDCap: fim_functioning_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel too tired to do the things I like to do",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Physical Functioning Q3 (REDCap: fim_functioning_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I get headaches",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Physical Functioning Q4 (REDCap: fim_functioning_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel physically weak",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Physical Functioning Q5 (REDCap: fim_functioning_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Functioning_Q6",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Functioning_Q6",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel sick to my stomach",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Physical Functioning Q6 (REDCap: fim_functioning_q6). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel anxious",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Emotional Functioning Q1 (REDCap: fim_meotional_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel sad",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Emotional Functioning Q2 (REDCap: fim_meotional_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel angry",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Emotional Functioning Q3 (REDCap: fim_meotional_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel frustrated",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Emotional Functioning Q4 (REDCap: fim_meotional_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Emotional_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Emotional_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel helpless or hopeless",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Emotional Functioning Q5 (REDCap: fim_meotional_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel isolated from others",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Social Functioning Q1 (REDCap: fim_social_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I have trouble getting support from others",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Social Functioning Q2 (REDCap: fim_social_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard to find time for social activities",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Social Functioning Q3 (REDCap: fim_social_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Social_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Social_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I do not have enough energy for social activities",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Social Functioning Q4 (REDCap: fim_social_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to keep my attention on things",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Cognitive Functioning Q1 (REDCap: fim_cognitive_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to remember what people tell me",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Cognitive Functioning Q2 (REDCap: fim_cognitive_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to remember what I just heard",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Cognitive Functioning Q3 (REDCap: fim_cognitive_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to think quickly",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Cognitive Functioning Q4 (REDCap: fim_cognitive_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Cognitive_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Cognitive_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I have trouble remembering what I was just thinking",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Cognitive Functioning Q5 (REDCap: fim_cognitive_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Communication_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I feel that others do not understand my family's situation",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Communication Q1 (REDCap: fim_communication_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Communication_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "It is hard for me to talk about my child's health with others",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Communication Q2 (REDCap: fim_communication_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Communication_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Communication_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to tell doctors and nurses how I feel",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Communication Q3 (REDCap: fim_communication_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about whether or not my child's medical treatments are working",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value: "PedsQL FIM Worry Q1 (REDCap: fim_worry_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about the side effects of my child's medications/medical treatments",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value: "PedsQL FIM Worry Q2 (REDCap: fim_worry_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about how others will react to my child's condition",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value: "PedsQL FIM Worry Q3 (REDCap: fim_worry_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about how my child's illness is affecting other family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value: "PedsQL FIM Worry Q4 (REDCap: fim_worry_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Worry_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Worry_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I worry about my child's future",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value: "PedsQL FIM Worry Q5 (REDCap: fim_worry_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Activities_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Family activities taking more time and effort",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Daily Activities Q1 (REDCap: fim_activities_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Activities_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Difficulty finding time to finish household tasks",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Daily Activities Q2 (REDCap: fim_activities_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Activities_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Activities_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Feeling too tired to finish household tasks",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Daily Activities Q3 (REDCap: fim_activities_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Lack of communication between family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Family Relationships Q1 (REDCap: fim_relationship_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Conflicts between family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Family Relationships Q2 (REDCap: fim_relationship_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Difficulty making decisions together as a family",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Family Relationships Q3 (REDCap: fim_relationship_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Difficulty solving family problems together",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Family Relationships Q4 (REDCap: fim_relationship_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIMYoung_Relationships_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM_Relationships_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Stress or tension between family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM Family Relationships Q5 (REDCap: fim_relationship_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLFIM7PlusResult",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Content",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Concept_FIM_7Plus",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Instrument concept",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "PedsQL FIM instrument with 7-day reference period",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q6",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Physical Functioning Q6",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Emotional Functioning Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Social Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Cognitive Functioning Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q6",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Communication Q6",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q7",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Communication Q7",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q8",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Communication Q8",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Worry Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q1",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Daily Activities Q1",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q2",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Daily Activities Q2",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q3",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Daily Activities Q3",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q4",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q4",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q5",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q5",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q6",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q6",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q7",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q7",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q8",
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Family Relationships Q8",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "PedsQL Family Impact Module — 7-day reference",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL Family Impact Module completed by the carer, referencing the past 7 days. Covers caregiver Physical Functioning, Emotional Functioning, Social Functioning, Cognitive Functioning, Communication, Worry, Daily Activities, and Family Relationships.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel tired during the day",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Physical Functioning Q1 (REDCap: fim_physical_7_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel tired when I wake up in the morning",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Physical Functioning Q2 (REDCap: fim_physical_7_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel too tired to do the things I like to do",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Physical Functioning Q3 (REDCap: fim_physical_7_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I get headaches",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Physical Functioning Q4 (REDCap: fim_physical_7_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel physically weak",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Physical Functioning Q5 (REDCap: fim_physical_7_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Physical_Q6",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Physical_Q6",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel sick to my stomach",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Physical Functioning Q6 (REDCap: fim_physical_7_q6). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel anxious",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Emotional Functioning Q1 (REDCap: fim_emotional_7_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel sad",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Emotional Functioning Q2 (REDCap: fim_emotional_7_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel angry",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Emotional Functioning Q3 (REDCap: fim_emotional_7_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel frustrated",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Emotional Functioning Q4 (REDCap: fim_emotional_7_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Emotional_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Emotional_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel helpless or hopeless",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Emotional Functioning Q5 (REDCap: fim_emotional_7_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I feel isolated from others",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Social Functioning Q1 (REDCap: fim_social_7_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I have trouble getting support from others",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Social Functioning Q2 (REDCap: fim_social_7_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard to find time for social activities",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Social Functioning Q3 (REDCap: fim_social_7_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Social_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Social_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I do not have enough energy for social activities",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Social Functioning Q4 (REDCap: fim_social_7_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to keep my attention on things",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Cognitive Functioning Q1 (REDCap: fim_cognitive_7_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to remember what people tell me",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Cognitive Functioning Q2 (REDCap: fim_cognitive_7_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to remember what I just heard",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Cognitive Functioning Q3 (REDCap: fim_cognitive_7_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to think quickly",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Cognitive Functioning Q4 (REDCap: fim_cognitive_7_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Cognitive_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Cognitive_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I have trouble remembering what I was just thinking",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Cognitive Functioning Q5 (REDCap: fim_cognitive_7_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q6",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Communication_Q6",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I feel that others do not understand my family's situation",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Communication Q6 (REDCap: fim_communication_7_q6). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q7",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Communication_Q7",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "It is hard for me to talk about my child's health with others",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Communication Q7 (REDCap: fim_communication_7_q7). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Communication_Q8",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Communication_Q8",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "It is hard for me to tell doctors and nurses how I feel",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Communication Q8 (REDCap: fim_communication_7_q8). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about whether or not my child's medical treatments are working",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Worry Q1 (REDCap: fim_worry_7_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about the side effects of my child's medications/medical treatments",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Worry Q2 (REDCap: fim_worry_7_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about how others will react to my child's condition",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Worry Q3 (REDCap: fim_worry_7_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "I worry about how my child's illness is affecting other family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Worry Q4 (REDCap: fim_worry_7_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_Worry_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_Worry_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "I worry about my child's future",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Worry Q5 (REDCap: fim_worry_7_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q1",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_DailyActivities_Q1",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Family activities taking more time and effort",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Daily Activities Q1 (REDCap: fim_daily_activ_7_q1). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q2",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_DailyActivities_Q2",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Difficulty finding time to finish household tasks",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Daily Activities Q2 (REDCap: fim_daily_activ_7_q2). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_DailyActivities_Q3",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_DailyActivities_Q3",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Feeling too tired to finish household tasks",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Daily Activities Q3 (REDCap: fim_daily_activ_7_q3). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q4",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q4",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Lack of communication between family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Family Relationships Q4 (REDCap: fim_f_relationship_7_q4). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q5",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q5",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Conflicts between family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Family Relationships Q5 (REDCap: fim_f_relationship_7_q5). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q6",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q6",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Difficulty making decisions together as a family",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Family Relationships Q6 (REDCap: fim_f_relationship_7_q6). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q7",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q7",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Difficulty solving family problems together",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Family Relationships Q7 (REDCap: fim_f_relationship_7_q7). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/FIM7_FamilyRelationships_Q8",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_FIM7_FamilyRelationships_Q8",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "Stress or tension between family members",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL FIM 7-day Family Relationships Q8 (REDCap: fim_f_relationship_7_q8). Scored 0–4.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/PedsQLAdultResult",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Content",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isAbout",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Concept_AdultQoL",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Instrument concept",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "PedsQL QoL instrument, age-banded parent-reported form",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_2to4",
                  "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_5to7",
                  "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_8to12",
                  "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_13to17",
                  "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_18to25",
                  "https://paediatrics.ox.ac.uk/angelman/terms/AgeBand_26Plus",
                ],
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "Age Band",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "PedsQL age band determining which item set applies (REDCap: age_calculate). 2=Toddlers 2-4, 11=Young Children 5-7, 10=Children 8-12, 8=Teens 13-18, 4=Young Adults 18-25, 2=Adults 26+",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/angelman/terms/AdultItemMagnitude",
              min: 0,
              max: -1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "QoL Item Response",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "A single item response from the age-appropriate PedsQL subscale. The aspect IRI encodes the REDCap column number (e.g. ag:Aspect_Adult_Q107). Items scored 0–4.",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value:
                "PedsQL Quality of Life Inventory (parent-reported, age-banded)",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "PedsQL age-banded Quality of Life Inventory, parent-reported, covering Physical Functioning, Emotional Functioning, Social Functioning, and School/Work Functioning. Age band is selected by the age_calculate checkbox field.",
            },
          },
        ],
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/angelman/terms/AdultItemMagnitude",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q107",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q108",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q109",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q110",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q111",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q112",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q113",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q114",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q115",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q116",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q117",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q118",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q119",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q120",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q121",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q122",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q123",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q124",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q125",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q126",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q127",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q128",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q129",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q137",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q138",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q139",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q140",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q141",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q142",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q143",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q144",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q145",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q146",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q147",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q148",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q149",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q150",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q151",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q152",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q153",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q154",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q155",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q156",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q157",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q158",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q159",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q166",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q167",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q168",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q169",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q170",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q171",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q172",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q173",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q174",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q175",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q176",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q177",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q178",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q179",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q180",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q181",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q182",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q183",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q184",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q185",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q186",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q187",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q188",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q193",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q194",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q195",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q196",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q197",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q198",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q199",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q200",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q201",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q202",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q203",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q204",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q205",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q206",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q207",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q208",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q209",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q210",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q211",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q212",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q213",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q214",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q215",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q340",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q342",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q343",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q344",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q345",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q346",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q347",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q348",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q349",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q350",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q351",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q352",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q353",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q354",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q355",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q356",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q357",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q358",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q359",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q360",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q361",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q362",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q363",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q77",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q78",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q79",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q80",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q81",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q82",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q83",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q84",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q85",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q86",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q87",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q88",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q89",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q90",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q91",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q92",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q93",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q94",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q95",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q96",
                  "https://paediatrics.ox.ac.uk/angelman/terms/Aspect_Adult_Q97",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
              min: 0,
              max: 1,
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "PedsQL QoL Item Response",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "One item response within the PedsQL age-banded QoL inventory. The gist:hasAspect value identifies the specific item via its REDCap column number. Physical items: walking, running, sport, lifting, bathing/chores, aches, fatigue. Emotional items: fear, sadness, anger, sleep, worry. Social items: peer relationships, teasing, keeping up. School/Work items: attention, forgetting, keeping up, absences.",
            },
          },
        ],
      },
    },
  ],
};
