import type { LdoJsonldContext } from "@ldo/ldo";

/**
 * =============================================================================
 * nemalineDataSchemaContext: JSONLD Context for nemaline_dataSchema
 * =============================================================================
 */
export const nemalineDataSchemaContext: LdoJsonldContext = {
  type: {
    "@id": "@type",
    "@isCollection": true,
  },
  Person: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/Person",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      isCategorizedBy: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
      hasMagnitude: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
        "@type": "@id",
        "@isCollection": true,
      },
      hasPart: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasPart",
        "@type": "@id",
        "@isCollection": true,
      },
    },
  },
  isCategorizedBy: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
    "@isCollection": true,
  },
  GenderMale:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Male",
  GenderFemale:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Female",
  GenderUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Unknown",
  GenderOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gender_Other",
  GeneNEB: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_NEB",
  GeneACTA1: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_ACTA1",
  GeneTPM2: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TPM2",
  GeneTPM3: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TPM3",
  GeneKLHL40:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_KLHL40",
  GeneKLHL41:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_KLHL41",
  GeneMYPN: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_MYPN",
  GeneLMOD3: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_LMOD3",
  GeneCFL2: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_CFL2",
  GeneKBTBD13:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_KBTBD13",
  GeneTNNT1: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TNNT1",
  GeneTNNT3: "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Gene_TNNT3",
  ZygosityHomozygous:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_Homozygous",
  ZygosityHeterozygous:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_Heterozygous",
  ZygosityCompoundHeterozygous:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_CompoundHeterozygous",
  ZygosityHemizygous:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Zygosity_Hemizygous",
  MuscleBiopsyYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MuscleBiopsy_Yes",
  MuscleBiopsyNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MuscleBiopsy_No",
  MuscleBiopsyUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/MuscleBiopsy_Unknown",
  BiopsyResultRodsOrBodies:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_RodsOrBodies",
  BiopsyResultRodsOrBodiesAndType1FibreAtrophy:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_RodsOrBodiesAndType1FibreAtrophy",
  BiopsyResultNoRodsButType1FibreAtrophy:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_NoRodsButType1FibreAtrophy",
  BiopsyResultRodsOrBodiesAndOtherFindings:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_RodsOrBodiesAndOtherFindings",
  BiopsyResultNoRodsButOtherFindings:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_NoRodsButOtherFindings",
  BiopsyResultNoBiopsyDone:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/BiopsyResult_NoBiopsyDone",
  FirstSymptomSkeletalMuscleOnly:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleOnly",
  FirstSymptomRespiratoryOnly:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_RespiratoryOnly",
  FirstSymptomBulbarOnly:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_BulbarOnly",
  FirstSymptomSkeletalMuscleAndRespiratory:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleAndRespiratory",
  FirstSymptomSkeletalMuscleAndBulbar:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleAndBulbar",
  FirstSymptomRespiratoryAndBulbar:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_RespiratoryAndBulbar",
  FirstSymptomSkeletalMuscleRespiratoryAndBulbar:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_SkeletalMuscleRespiratoryAndBulbar",
  FirstSymptomFamilyHistoryAlone:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_FamilyHistoryAlone",
  FirstSymptomOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FirstSymptom_Other",
  FamilyHistoryYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_Yes",
  FamilyHistoryNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_No",
  FamilyHistoryPossibly:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_Possibly",
  FamilyHistoryUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/FamilyHistory_Unknown",
  EverAmbulantYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverAmbulant_Yes",
  EverAmbulantNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverAmbulant_No",
  EverAmbulantNotApplicable:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverAmbulant_NotApplicable",
  AmbulantAtBaselineYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulantAtBaseline_Yes",
  AmbulantAtBaselineNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AmbulantAtBaseline_No",
  EverSatIndependentlyYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverSatIndependently_Yes",
  EverSatIndependentlyNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverSatIndependently_No",
  EverSatIndependentlyNotApplicable:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/EverSatIndependently_NotApplicable",
  SittingAtBaselineYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAtBaseline_Yes",
  SittingAtBaselineNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SittingAtBaseline_No",
  VentilationNone:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Ventilation_None",
  VentilationNonInvasive:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Ventilation_NonInvasive",
  VentilationInvasive:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Ventilation_Invasive",
  PreviousVentilationYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousVentilation_Yes",
  PreviousVentilationNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousVentilation_No",
  TubeFedAtBaselineYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFedAtBaseline_Yes",
  TubeFedAtBaselineNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/TubeFedAtBaseline_No",
  PreviousTubeFeedingYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousTubeFeeding_Yes",
  PreviousTubeFeedingNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PreviousTubeFeeding_No",
  ScoliosisAtBaselineYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/ScoliosisAtBaseline_Yes",
  ScoliosisAtBaselineNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/ScoliosisAtBaseline_No",
  SpinalSurgeryYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgery_Yes",
  SpinalSurgeryNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/SpinalSurgery_No",
  GripDeviceMakeJamarPerformanceHealth:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_JamarPerformanceHealth",
  GripDeviceMakeBiometricsLtd:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_BiometricsLtd",
  GripDeviceMakeNorthCoastMedical:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_NorthCoastMedical",
  GripDeviceMakeFabricationEnterprises:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_FabricationEnterprises",
  GripDeviceMakeTakeiScientificInstruments:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_TakeiScientificInstruments",
  GripDeviceMakeKERN:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_KERN",
  GripDeviceMakeMIEMedicalResearch:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_MIEMedicalResearch",
  GripDeviceMakeMyogripAteliersLaumonier:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_MyogripAteliersLaumonier",
  GripDeviceMakeCitec:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_Citec",
  GripDeviceMakeMicroFETHogganScientific:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_MicroFETHogganScientific",
  GripDeviceMakeOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceMake_Other",
  GripDeviceModelHydraulicHandDynamometer:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_HydraulicHandDynamometer",
  GripDeviceModelSmartHandDynamometer:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_SmartHandDynamometer",
  GripDeviceModelG200HandGrip:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_G200HandGrip",
  GripDeviceModelG100HandGrip:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_G100HandGrip",
  GripDeviceModelBaselineHydraulicHandDynamometer:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_BaselineHydraulicHandDynamometer",
  GripDeviceModelBaselineDigitalSmedleyDynamometer:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_BaselineDigitalSmedleyDynamometer",
  GripDeviceModel5401GripD:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_5401GripD",
  GripDeviceModel5001GripA:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_5001GripA",
  GripDeviceModelMAPHandGrip:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_MAPHandGrip",
  GripDeviceModelMIEDigitalGripAnalyser:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_MIEDigitalGripAnalyser",
  GripDeviceModelCITECHandHeld:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_CITECHandHeld",
  GripDeviceModelOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GripDeviceModel_Other",
  PinchDeviceMakeJamarPerformanceHealth:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_JamarPerformanceHealth",
  PinchDeviceMakeBiometricsLtd:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_BiometricsLtd",
  PinchDeviceMakeNorthCoastMedical:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_NorthCoastMedical",
  PinchDeviceMakeFabricationEnterprisesBaseline:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_FabricationEnterprisesBaseline",
  PinchDeviceMakeTakeiScientificInstruments:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_TakeiScientificInstruments",
  PinchDeviceMakeMIEMedicalResearch:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_MIEMedicalResearch",
  PinchDeviceMakeAteliersLaumonier:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_AteliersLaumonier",
  PinchDeviceMakeCITEC:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_CITEC",
  PinchDeviceMakeBLEngineering:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_BLEngineering",
  PinchDeviceMakeMicroFETHogganScientific:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_MicroFETHogganScientific",
  PinchDeviceMakeOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceMake_Other",
  PinchDeviceModelHydraulicPinchGauge:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_HydraulicPinchGauge",
  PinchDeviceModelDigitalPinchGauge:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_DigitalPinchGauge",
  PinchDeviceModelMechanicalPinchGauge:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_MechanicalPinchGauge",
  PinchDeviceModelPinchmeter:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_Pinchmeter",
  PinchDeviceModelPinchAnalyser:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_PinchAnalyser",
  PinchDeviceModelMyoPinch:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_MyoPinch",
  PinchDeviceModelPinchStrengthMeter:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_PinchStrengthMeter",
  PinchDeviceModelCITECHandHeld:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_CITECHandHeld",
  PinchDeviceModelOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/PinchDeviceModel_Other",
  CurrentFunctionWalker:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_Walker",
  CurrentFunctionSitter:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_Sitter",
  CurrentFunctionNonSitter:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/CurrentFunction_NonSitter",
  hasMagnitude: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude",
    "@type": "@id",
    "@isCollection": true,
  },
  Magnitude: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/Magnitude",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      hasAspect: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
        "@isCollection": true,
      },
      hasUnitOfMeasure: {
        "@id":
          "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
        "@isCollection": true,
      },
      numericValue: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
        "@type": "http://www.w3.org/2001/XMLSchema#decimal",
      },
    },
  },
  hasAspect: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasAspect",
    "@isCollection": true,
  },
  AspectAgeAtBaselineVisit:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtBaselineVisit",
  hasUnitOfMeasure: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasUnitOfMeasure",
    "@isCollection": true,
  },
  UnitYear: "https://w3id.org/semanticarts/ns/ontology/gist/Unit_Year",
  numericValue: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/numericValue",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  AspectNumberOfVariants:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_NumberOfVariants",
  AspectAgeAtFirstSymptom:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtFirstSymptom",
  AspectAgeAtPresentation:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtPresentation",
  AspectAgeAtDiagnosis:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtDiagnosis",
  AspectAgeAtAmbulationAchieved:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtAmbulationAchieved",
  AspectAgeAtLossOfAmbulation:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfAmbulation",
  AspectAgeAtIndependentSittingAchieved:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtIndependentSittingAchieved",
  AspectAgeAtLossOfIndependentSitting:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtLossOfIndependentSitting",
  AspectDailyHoursOnVentilation:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DailyHoursOnVentilation",
  UnitHour: "https://paediatrics.ox.ac.uk/terms/Unit_Hour",
  AspectDailyHoursOffVentilation:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_DailyHoursOffVentilation",
  AspectAgeAtTubeFeedingCommenced:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtTubeFeedingCommenced",
  AspectCEDASScore:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_CEDASScore",
  AspectWeightAtBaselineVisit:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_WeightAtBaselineVisit",
  UnitKilogram: "https://paediatrics.ox.ac.uk/terms/Unit_Kilogram",
  AspectHeightAtBaselineVisit:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_HeightAtBaselineVisit",
  UnitCentimetre: "https://paediatrics.ox.ac.uk/terms/Unit_Centimetre",
  AspectCobbAngle:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_CobbAngle",
  UnitDegree: "https://paediatrics.ox.ac.uk/terms/Unit_Degree",
  AspectAgeAtCobbAngleMeasurement:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtCobbAngleMeasurement",
  AspectAgeAtSpinalSurgery:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AgeAtSpinalSurgery",
  AspectCHOPINTENDTotalBestSide:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_CHOPINTEND_TotalBestSide",
  AspectMFM32AggregateScore:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_AggregateScore",
  AspectMFM32D1Score:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_D1Score",
  AspectMFM32D2Score:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_D2Score",
  AspectMFM32D3Score:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_MFM32_D3Score",
  AspectGripStrengthRight:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_GripStrengthRight",
  AspectGripStrengthLeft:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_GripStrengthLeft",
  AspectPinchStrengthRight:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_PinchStrengthRight",
  AspectPinchStrengthLeft:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_PinchStrengthLeft",
  AspectHeightForAgeZScoreUKWHO:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_HeightForAgeZScore_UKWHO",
  AspectWeightForAgeZScoreUKWHO:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_WeightForAgeZScore_UKWHO",
  AspectAmbulationGainEvent:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AmbulationGainEvent",
  AspectAmbulationGainTime:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Aspect_AmbulationGainTime",
  hasPart: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/hasPart",
    "@type": "@id",
    "@isCollection": true,
  },
  GeneticVariant: {
    "@id":
      "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/GeneticVariant",
    "@context": {
      type: {
        "@id": "@type",
        "@isCollection": true,
      },
      isCategorizedBy: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy",
        "@isCollection": true,
      },
      containedText: {
        "@id": "https://w3id.org/semanticarts/ns/ontology/gist/containedText",
        "@type": "http://www.w3.org/2001/XMLSchema#string",
      },
    },
  },
  VariantPosition1:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantPosition_1",
  VariantPosition2:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantPosition_2",
  containedText: {
    "@id": "https://w3id.org/semanticarts/ns/ontology/gist/containedText",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  VariantTypeSNV:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_SNV",
  VariantTypeInsertion:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Insertion",
  VariantTypeDeletion:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Deletion",
  VariantTypeDuplication:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Duplication",
  VariantTypeCNV:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_CNV",
  VariantTypeUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantType_Unknown",
  VariantConsequenceMissense:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Missense",
  VariantConsequenceNonsense:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Nonsense",
  VariantConsequenceFrameshift:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Frameshift",
  VariantConsequenceInFrame:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_InFrame",
  VariantConsequenceSpliceAltering:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_SpliceAltering",
  VariantConsequenceSynonymous:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Synonymous",
  VariantConsequenceSplice:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Splice",
  VariantConsequenceUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/VariantConsequence_Unknown",
  LossOfFunctionYes:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_Yes",
  LossOfFunctionNo:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_No",
  LossOfFunctionUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_Unknown",
  LossOfFunctionOther:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/LossOfFunction_Other",
  PathogenicityPathogenic:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_Pathogenic",
  PathogenicityLikelyPathogenic:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_LikelyPathogenic",
  PathogenicityUncertainSignificance:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_UncertainSignificance",
  PathogenicityLikelyBenign:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_LikelyBenign",
  PathogenicityBenign:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_Benign",
  PathogenicityUnknown:
    "https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/Pathogenicity_Unknown",
};
