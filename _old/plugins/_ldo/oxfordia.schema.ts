import { Schema } from "shexj";

/**
 * =============================================================================
 * oxfordiaSchema: ShexJ Schema for oxfordia
 * =============================================================================
 */
export const oxfordiaSchema: Schema = {
  type: "Schema",
  start: "https://paediatrics.ox.ac.uk/terms/PersonShape",
  shapes: [
    {
      id: "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRuleDocumentShape",
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
                  "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistic-access-rule#dataSchema",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistic-access-rule#hasStatisticPolicy",
              valueExpr:
                "https://oxfordia.setmeld.com/statistic-access-rule#StatisticPolicyShape",
              min: 0,
              max: -1,
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistic-access-rule#StatisticPolicyShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate:
            "https://oxfordia.setmeld.com/statistic-access-rule#statisticName",
          valueExpr: {
            type: "NodeConstraint",
            datatype: "http://www.w3.org/2001/XMLSchema#string",
          },
        },
      },
    },
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
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_1",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_2",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Cluster_3",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant1",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant2",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticGroup_Variant3",
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
                  "https://paediatrics.ox.ac.uk/terms/LeftHanded",
                  "https://paediatrics.ox.ac.uk/terms/RightHanded",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_Ambulant",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Status_NonAmbulant",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Performance_BelowAverage",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/terms/BaselineAgeMagnitude",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr: "https://paediatrics.ox.ac.uk/terms/LoAAgeMagnitude",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr: "https://paediatrics.ox.ac.uk/terms/TotalMFMMagnitude",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              inverse: true,
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
              valueExpr:
                "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMAssessmentEventShape",
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              inverse: true,
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
              valueExpr:
                "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/KaplanMeierObservationShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMAssessmentEventShape",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_MFM32",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TimeFromBaselineMagnitude",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
              valueExpr: "https://paediatrics.ox.ac.uk/terms/PersonShape",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/produces",
              valueExpr:
                "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentResult",
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/KaplanMeierObservationShape",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant",
              valueExpr: "https://paediatrics.ox.ac.uk/terms/PersonShape",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/terms/KaplanMeierEventMagnitude",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/terms/KaplanMeierTimeMagnitude",
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentResult",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Concept_MotorFunction",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr:
                "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMScoreMagnitude",
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TimeFromBaselineMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DurationSinceStudyEnrollment",
                ],
              },
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
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFMScoreMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_VisitScore",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/terms/TotalMFMMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_AggregateScore",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/terms/KaplanMeierEventMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierEventIndicator",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/terms/KaplanMeierTimeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_KaplanMeierTimeToEvent",
                ],
              },
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
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
            },
          ],
        },
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
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/terms/LoAAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfAmbulation",
                ],
              },
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
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
            },
          ],
        },
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
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#MeanStatisticAccessRuleShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate: "https://oxfordia.setmeld.com/statistics#allowedPath",
          valueExpr:
            "https://oxfordia.setmeld.com/statistics#MeanAllowedPathShape",
          min: 1,
          max: -1,
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#MeanAllowedPathShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#graphPath",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphPathShape",
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#minCount",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#KaplanMeierStatisticAccessRuleShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate: "https://oxfordia.setmeld.com/statistics#allowedPath",
          valueExpr:
            "https://oxfordia.setmeld.com/statistics#KaplanMeierAllowedPathShape",
          min: 1,
          max: -1,
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#KaplanMeierAllowedPathShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistics#timeGraphPath",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphPathShape",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistics#eventGraphPath",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphPathShape",
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://oxfordia.setmeld.com/statistics#groupByGraphPath",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphPathShape",
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#k-anonymity",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#GraphPathShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#name",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#start",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#steps",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#target",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#rdfType",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#iri",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#categories",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#predicates",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
              min: 0,
              max: -1,
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#GraphPredicateFilterShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#predicate",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#inverse",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#boolean",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#some",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#every",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#none",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#GraphTraversalStepShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#via",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#inverse",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#boolean",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#where",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#GraphValueSelectorShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "OneOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#node",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphNodeFilterShape",
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#literal",
              valueExpr:
                "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
            },
          ],
        },
      },
    },
    {
      id: "https://oxfordia.setmeld.com/statistics#GraphLiteralFilterShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#datatype",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#lang",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#equals",
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#oneOf",
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#min",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate: "https://oxfordia.setmeld.com/statistics#max",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
  ],
};
