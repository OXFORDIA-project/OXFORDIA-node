import { Schema } from "shexj";

/**
 * =============================================================================
 * nemaline_dataSchemaSchema: ShexJ Schema for nemaline_dataSchema
 * =============================================================================
 */
export const nemaline_dataSchemaSchema: Schema = {
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
  ],
};
