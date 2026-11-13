import type { Schema } from "shexj";

/**
 * =============================================================================
 * nemalineDataSchemaSchema: ShexJ Schema for nemaline_dataSchema
 * =============================================================================
 */
export const nemalineDataSchemaSchema: Schema = {
  type: "Schema",
  start: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PersonShape",
  shapes: [
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PersonShape",
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
                "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
              valueExpr: {
                type: "NodeConstraint",
                values: [
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Male",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Female",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Unknown",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_NEB",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_ACTA1",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TPM2",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TPM3",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_KLHL40",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_KLHL41",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_MYPN",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_LMOD3",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_CFL2",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_KBTBD13",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TNNT1",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TNNT3",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_Homozygous",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_Heterozygous",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_CompoundHeterozygous",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_Hemizygous",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MuscleBiopsy_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MuscleBiopsy_No",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MuscleBiopsy_Unknown",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_RodsOrBodies",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_RodsOrBodiesAndType1FibreAtrophy",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_NoRodsButType1FibreAtrophy",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_RodsOrBodiesAndOtherFindings",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_NoRodsButOtherFindings",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_NoBiopsyDone",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleOnly",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_RespiratoryOnly",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_BulbarOnly",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleAndRespiratory",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleAndBulbar",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_RespiratoryAndBulbar",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleRespiratoryAndBulbar",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_FamilyHistoryAlone",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_No",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_Possibly",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_Unknown",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverAmbulant_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverAmbulant_No",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverAmbulant_NotApplicable",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulantAtBaseline_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulantAtBaseline_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverSatIndependently_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverSatIndependently_No",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverSatIndependently_NotApplicable",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAtBaseline_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAtBaseline_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Ventilation_None",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Ventilation_NonInvasive",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Ventilation_Invasive",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousVentilation_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousVentilation_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFedAtBaseline_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFedAtBaseline_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousTubeFeeding_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousTubeFeeding_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/ScoliosisAtBaseline_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/ScoliosisAtBaseline_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgery_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgery_No",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_JamarPerformanceHealth",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_BiometricsLtd",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_NorthCoastMedical",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_FabricationEnterprises",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_TakeiScientificInstruments",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_KERN",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_MIEMedicalResearch",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_MyogripAteliersLaumonier",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_Citec",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_MicroFETHogganScientific",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_HydraulicHandDynamometer",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_SmartHandDynamometer",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_G200HandGrip",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_G100HandGrip",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_BaselineHydraulicHandDynamometer",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_BaselineDigitalSmedleyDynamometer",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_5401GripD",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_5001GripA",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_MAPHandGrip",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_MIEDigitalGripAnalyser",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_CITECHandHeld",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_JamarPerformanceHealth",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_BiometricsLtd",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_NorthCoastMedical",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_FabricationEnterprisesBaseline",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_TakeiScientificInstruments",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_MIEMedicalResearch",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_AteliersLaumonier",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_CITEC",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_BLEngineering",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_MicroFETHogganScientific",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_HydraulicPinchGauge",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_DigitalPinchGauge",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_MechanicalPinchGauge",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_Pinchmeter",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_PinchAnalyser",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_MyoPinch",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_PinchStrengthMeter",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_CITECHandHeld",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_Walker",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_Sitter",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_NonSitter",
                ],
              },
              min: 0,
              max: 1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
              valueExpr: {
                type: "ShapeOr",
                shapeExprs: [
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BaselineAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/NumberOfVariantsMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptomAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PresentationAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/DiagnosisAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationAchievedAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationLostAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAchievedAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingLostAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VentilationHoursOnMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VentilationHoursOffMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFeedingAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CEDASScoreMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/WeightMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/HeightMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CobbAngleMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CobbAngleAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgeryAgeMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CHOPINTENDTotalMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32TotalMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D1Magnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D2Magnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D3Magnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripStrengthRightMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripStrengthLeftMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchStrengthRightMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchStrengthLeftMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/HeightZScoreMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/WeightZScoreMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationGainEventMagnitude",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationGainTimeMagnitude",
                ],
              },
              min: 0,
              max: -1,
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasPart",
              valueExpr:
                "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticVariantShape",
              min: 0,
              max: 2,
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticVariantShape",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticVariant",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantPosition_1",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantPosition_2",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/containedText",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_SNV",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Insertion",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Deletion",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Duplication",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_CNV",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Unknown",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Missense",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Nonsense",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Frameshift",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_InFrame",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_SpliceAltering",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Synonymous",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Splice",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Unknown",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_Yes",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_No",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_Unknown",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_Other",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_Pathogenic",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_LikelyPathogenic",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_UncertainSignificance",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_LikelyBenign",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_Benign",
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_Unknown",
                ],
              },
              min: 0,
              max: 1,
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BaselineAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtBaselineVisit",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/NumberOfVariantsMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_NumberOfVariants",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptomAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtFirstSymptom",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PresentationAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtPresentation",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/DiagnosisAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtDiagnosis",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationAchievedAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtAmbulationAchieved",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationLostAgeMagnitude",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAchievedAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtIndependentSittingAchieved",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingLostAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfIndependentSitting",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VentilationHoursOnMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DailyHoursOnVentilation",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Hour"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VentilationHoursOffMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DailyHoursOffVentilation",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Hour"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFeedingAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtTubeFeedingCommenced",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CEDASScoreMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_CEDASScore",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/WeightMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_WeightAtBaselineVisit",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Kilogram"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/HeightMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_HeightAtBaselineVisit",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Centimetre"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CobbAngleMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_CobbAngle",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Degree"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CobbAngleAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtCobbAngleMeasurement",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgeryAgeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtSpinalSurgery",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CHOPINTENDTotalMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_CHOPINTEND_TotalBestSide",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32TotalMagnitude",
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
                datatype: "http://www.w3.org/2001/XMLSchema#decimal",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D1Magnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_D1Score",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D2Magnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_D2Score",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MFM32D3Magnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_D3Score",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripStrengthRightMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_GripStrengthRight",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Kilogram"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripStrengthLeftMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_GripStrengthLeft",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Kilogram"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchStrengthRightMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_PinchStrengthRight",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Kilogram"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchStrengthLeftMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_PinchStrengthLeft",
                ],
              },
            },
            {
              type: "TripleConstraint",
              predicate:
                "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
              valueExpr: {
                type: "NodeConstraint",
                values: ["https://paediatrics.ox.ac.uk/terms/Unit_Kilogram"],
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/HeightZScoreMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_HeightForAgeZScore_UKWHO",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/WeightZScoreMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_WeightForAgeZScore_UKWHO",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationGainEventMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AmbulationGainEvent",
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
      id: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulationGainTimeMagnitude",
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
                  "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AmbulationGainTime",
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
  ],
};
