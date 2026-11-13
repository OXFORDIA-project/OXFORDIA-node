import type { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for nemaline_dataSchema
 * =============================================================================
 */

/**
 * Person Type
 */
export interface Person {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Person";
  }>;
  isCategorizedBy?: LdSet<
    | {
        "@id": "GenderMale";
      }
    | {
        "@id": "GenderFemale";
      }
    | {
        "@id": "GenderUnknown";
      }
    | {
        "@id": "GenderOther";
      }
    | {
        "@id": "GeneNEB";
      }
    | {
        "@id": "GeneACTA1";
      }
    | {
        "@id": "GeneTPM2";
      }
    | {
        "@id": "GeneTPM3";
      }
    | {
        "@id": "GeneKLHL40";
      }
    | {
        "@id": "GeneKLHL41";
      }
    | {
        "@id": "GeneMYPN";
      }
    | {
        "@id": "GeneLMOD3";
      }
    | {
        "@id": "GeneCFL2";
      }
    | {
        "@id": "GeneKBTBD13";
      }
    | {
        "@id": "GeneTNNT1";
      }
    | {
        "@id": "GeneTNNT3";
      }
    | {
        "@id": "ZygosityHomozygous";
      }
    | {
        "@id": "ZygosityHeterozygous";
      }
    | {
        "@id": "ZygosityCompoundHeterozygous";
      }
    | {
        "@id": "ZygosityHemizygous";
      }
    | {
        "@id": "MuscleBiopsyYes";
      }
    | {
        "@id": "MuscleBiopsyNo";
      }
    | {
        "@id": "MuscleBiopsyUnknown";
      }
    | {
        "@id": "BiopsyResultRodsOrBodies";
      }
    | {
        "@id": "BiopsyResultRodsOrBodiesAndType1FibreAtrophy";
      }
    | {
        "@id": "BiopsyResultNoRodsButType1FibreAtrophy";
      }
    | {
        "@id": "BiopsyResultRodsOrBodiesAndOtherFindings";
      }
    | {
        "@id": "BiopsyResultNoRodsButOtherFindings";
      }
    | {
        "@id": "BiopsyResultNoBiopsyDone";
      }
    | {
        "@id": "FirstSymptomSkeletalMuscleOnly";
      }
    | {
        "@id": "FirstSymptomRespiratoryOnly";
      }
    | {
        "@id": "FirstSymptomBulbarOnly";
      }
    | {
        "@id": "FirstSymptomSkeletalMuscleAndRespiratory";
      }
    | {
        "@id": "FirstSymptomSkeletalMuscleAndBulbar";
      }
    | {
        "@id": "FirstSymptomRespiratoryAndBulbar";
      }
    | {
        "@id": "FirstSymptomSkeletalMuscleRespiratoryAndBulbar";
      }
    | {
        "@id": "FirstSymptomFamilyHistoryAlone";
      }
    | {
        "@id": "FirstSymptomOther";
      }
    | {
        "@id": "FamilyHistoryYes";
      }
    | {
        "@id": "FamilyHistoryNo";
      }
    | {
        "@id": "FamilyHistoryPossibly";
      }
    | {
        "@id": "FamilyHistoryUnknown";
      }
    | {
        "@id": "EverAmbulantYes";
      }
    | {
        "@id": "EverAmbulantNo";
      }
    | {
        "@id": "EverAmbulantNotApplicable";
      }
    | {
        "@id": "AmbulantAtBaselineYes";
      }
    | {
        "@id": "AmbulantAtBaselineNo";
      }
    | {
        "@id": "EverSatIndependentlyYes";
      }
    | {
        "@id": "EverSatIndependentlyNo";
      }
    | {
        "@id": "EverSatIndependentlyNotApplicable";
      }
    | {
        "@id": "SittingAtBaselineYes";
      }
    | {
        "@id": "SittingAtBaselineNo";
      }
    | {
        "@id": "VentilationNone";
      }
    | {
        "@id": "VentilationNonInvasive";
      }
    | {
        "@id": "VentilationInvasive";
      }
    | {
        "@id": "PreviousVentilationYes";
      }
    | {
        "@id": "PreviousVentilationNo";
      }
    | {
        "@id": "TubeFedAtBaselineYes";
      }
    | {
        "@id": "TubeFedAtBaselineNo";
      }
    | {
        "@id": "PreviousTubeFeedingYes";
      }
    | {
        "@id": "PreviousTubeFeedingNo";
      }
    | {
        "@id": "ScoliosisAtBaselineYes";
      }
    | {
        "@id": "ScoliosisAtBaselineNo";
      }
    | {
        "@id": "SpinalSurgeryYes";
      }
    | {
        "@id": "SpinalSurgeryNo";
      }
    | {
        "@id": "GripDeviceMakeJamarPerformanceHealth";
      }
    | {
        "@id": "GripDeviceMakeBiometricsLtd";
      }
    | {
        "@id": "GripDeviceMakeNorthCoastMedical";
      }
    | {
        "@id": "GripDeviceMakeFabricationEnterprises";
      }
    | {
        "@id": "GripDeviceMakeTakeiScientificInstruments";
      }
    | {
        "@id": "GripDeviceMakeKERN";
      }
    | {
        "@id": "GripDeviceMakeMIEMedicalResearch";
      }
    | {
        "@id": "GripDeviceMakeMyogripAteliersLaumonier";
      }
    | {
        "@id": "GripDeviceMakeCitec";
      }
    | {
        "@id": "GripDeviceMakeMicroFETHogganScientific";
      }
    | {
        "@id": "GripDeviceMakeOther";
      }
    | {
        "@id": "GripDeviceModelHydraulicHandDynamometer";
      }
    | {
        "@id": "GripDeviceModelSmartHandDynamometer";
      }
    | {
        "@id": "GripDeviceModelG200HandGrip";
      }
    | {
        "@id": "GripDeviceModelG100HandGrip";
      }
    | {
        "@id": "GripDeviceModelBaselineHydraulicHandDynamometer";
      }
    | {
        "@id": "GripDeviceModelBaselineDigitalSmedleyDynamometer";
      }
    | {
        "@id": "GripDeviceModel5401GripD";
      }
    | {
        "@id": "GripDeviceModel5001GripA";
      }
    | {
        "@id": "GripDeviceModelMAPHandGrip";
      }
    | {
        "@id": "GripDeviceModelMIEDigitalGripAnalyser";
      }
    | {
        "@id": "GripDeviceModelCITECHandHeld";
      }
    | {
        "@id": "GripDeviceModelOther";
      }
    | {
        "@id": "PinchDeviceMakeJamarPerformanceHealth";
      }
    | {
        "@id": "PinchDeviceMakeBiometricsLtd";
      }
    | {
        "@id": "PinchDeviceMakeNorthCoastMedical";
      }
    | {
        "@id": "PinchDeviceMakeFabricationEnterprisesBaseline";
      }
    | {
        "@id": "PinchDeviceMakeTakeiScientificInstruments";
      }
    | {
        "@id": "PinchDeviceMakeMIEMedicalResearch";
      }
    | {
        "@id": "PinchDeviceMakeAteliersLaumonier";
      }
    | {
        "@id": "PinchDeviceMakeCITEC";
      }
    | {
        "@id": "PinchDeviceMakeBLEngineering";
      }
    | {
        "@id": "PinchDeviceMakeMicroFETHogganScientific";
      }
    | {
        "@id": "PinchDeviceMakeOther";
      }
    | {
        "@id": "PinchDeviceModelHydraulicPinchGauge";
      }
    | {
        "@id": "PinchDeviceModelDigitalPinchGauge";
      }
    | {
        "@id": "PinchDeviceModelMechanicalPinchGauge";
      }
    | {
        "@id": "PinchDeviceModelPinchmeter";
      }
    | {
        "@id": "PinchDeviceModelPinchAnalyser";
      }
    | {
        "@id": "PinchDeviceModelMyoPinch";
      }
    | {
        "@id": "PinchDeviceModelPinchStrengthMeter";
      }
    | {
        "@id": "PinchDeviceModelCITECHandHeld";
      }
    | {
        "@id": "PinchDeviceModelOther";
      }
    | {
        "@id": "CurrentFunctionWalker";
      }
    | {
        "@id": "CurrentFunctionSitter";
      }
    | {
        "@id": "CurrentFunctionNonSitter";
      }
  >;
  hasMagnitude?: LdSet<
    | BaselineAgeMagnitude
    | NumberOfVariantsMagnitude
    | FirstSymptomAgeMagnitude
    | PresentationAgeMagnitude
    | DiagnosisAgeMagnitude
    | AmbulationAchievedAgeMagnitude
    | AmbulationLostAgeMagnitude
    | SittingAchievedAgeMagnitude
    | SittingLostAgeMagnitude
    | VentilationHoursOnMagnitude
    | VentilationHoursOffMagnitude
    | TubeFeedingAgeMagnitude
    | CEDASScoreMagnitude
    | WeightMagnitude
    | HeightMagnitude
    | CobbAngleMagnitude
    | CobbAngleAgeMagnitude
    | SpinalSurgeryAgeMagnitude
    | CHOPINTENDTotalMagnitude
    | MFM32TotalMagnitude
    | MFM32D1Magnitude
    | MFM32D2Magnitude
    | MFM32D3Magnitude
    | GripStrengthRightMagnitude
    | GripStrengthLeftMagnitude
    | PinchStrengthRightMagnitude
    | PinchStrengthLeftMagnitude
    | HeightZScoreMagnitude
    | WeightZScoreMagnitude
    | AmbulationGainEventMagnitude
    | AmbulationGainTimeMagnitude
  >;
  hasPart?: LdSet<GeneticVariant>;
}

/**
 * GeneticVariant Type
 */
export interface GeneticVariant {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "GeneticVariant";
  }>;
  isCategorizedBy?: LdSet<
    | {
        "@id": "VariantPosition1";
      }
    | {
        "@id": "VariantPosition2";
      }
    | {
        "@id": "VariantTypeSNV";
      }
    | {
        "@id": "VariantTypeInsertion";
      }
    | {
        "@id": "VariantTypeDeletion";
      }
    | {
        "@id": "VariantTypeDuplication";
      }
    | {
        "@id": "VariantTypeCNV";
      }
    | {
        "@id": "VariantTypeUnknown";
      }
    | {
        "@id": "VariantConsequenceMissense";
      }
    | {
        "@id": "VariantConsequenceNonsense";
      }
    | {
        "@id": "VariantConsequenceFrameshift";
      }
    | {
        "@id": "VariantConsequenceInFrame";
      }
    | {
        "@id": "VariantConsequenceSpliceAltering";
      }
    | {
        "@id": "VariantConsequenceSynonymous";
      }
    | {
        "@id": "VariantConsequenceSplice";
      }
    | {
        "@id": "VariantConsequenceUnknown";
      }
    | {
        "@id": "LossOfFunctionYes";
      }
    | {
        "@id": "LossOfFunctionNo";
      }
    | {
        "@id": "LossOfFunctionUnknown";
      }
    | {
        "@id": "LossOfFunctionOther";
      }
    | {
        "@id": "PathogenicityPathogenic";
      }
    | {
        "@id": "PathogenicityLikelyPathogenic";
      }
    | {
        "@id": "PathogenicityUncertainSignificance";
      }
    | {
        "@id": "PathogenicityLikelyBenign";
      }
    | {
        "@id": "PathogenicityBenign";
      }
    | {
        "@id": "PathogenicityUnknown";
      }
  >;
  containedText?: string;
}

/**
 * BaselineAgeMagnitude Type
 */
export interface BaselineAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtBaselineVisit";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * NumberOfVariantsMagnitude Type
 */
export interface NumberOfVariantsMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectNumberOfVariants";
  };
  numericValue: number;
}

/**
 * FirstSymptomAgeMagnitude Type
 */
export interface FirstSymptomAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtFirstSymptom";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * PresentationAgeMagnitude Type
 */
export interface PresentationAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtPresentation";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * DiagnosisAgeMagnitude Type
 */
export interface DiagnosisAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtDiagnosis";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * AmbulationAchievedAgeMagnitude Type
 */
export interface AmbulationAchievedAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtAmbulationAchieved";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * AmbulationLostAgeMagnitude Type
 */
export interface AmbulationLostAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtLossOfAmbulation";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * SittingAchievedAgeMagnitude Type
 */
export interface SittingAchievedAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtIndependentSittingAchieved";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * SittingLostAgeMagnitude Type
 */
export interface SittingLostAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtLossOfIndependentSitting";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * VentilationHoursOnMagnitude Type
 */
export interface VentilationHoursOnMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectDailyHoursOnVentilation";
  };
  hasUnitOfMeasure: {
    "@id": "UnitHour";
  };
  numericValue: number;
}

/**
 * VentilationHoursOffMagnitude Type
 */
export interface VentilationHoursOffMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectDailyHoursOffVentilation";
  };
  hasUnitOfMeasure: {
    "@id": "UnitHour";
  };
  numericValue: number;
}

/**
 * TubeFeedingAgeMagnitude Type
 */
export interface TubeFeedingAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtTubeFeedingCommenced";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * CEDASScoreMagnitude Type
 */
export interface CEDASScoreMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectCEDASScore";
  };
  numericValue: number;
}

/**
 * WeightMagnitude Type
 */
export interface WeightMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectWeightAtBaselineVisit";
  };
  hasUnitOfMeasure: {
    "@id": "UnitKilogram";
  };
  numericValue: number;
}

/**
 * HeightMagnitude Type
 */
export interface HeightMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectHeightAtBaselineVisit";
  };
  hasUnitOfMeasure: {
    "@id": "UnitCentimetre";
  };
  numericValue: number;
}

/**
 * CobbAngleMagnitude Type
 */
export interface CobbAngleMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectCobbAngle";
  };
  hasUnitOfMeasure: {
    "@id": "UnitDegree";
  };
  numericValue: number;
}

/**
 * CobbAngleAgeMagnitude Type
 */
export interface CobbAngleAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtCobbAngleMeasurement";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * SpinalSurgeryAgeMagnitude Type
 */
export interface SpinalSurgeryAgeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAgeAtSpinalSurgery";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}

/**
 * CHOPINTENDTotalMagnitude Type
 */
export interface CHOPINTENDTotalMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectCHOPINTENDTotalBestSide";
  };
  numericValue: number;
}

/**
 * MFM32TotalMagnitude Type
 */
export interface MFM32TotalMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectMFM32AggregateScore";
  };
  numericValue: number;
}

/**
 * MFM32D1Magnitude Type
 */
export interface MFM32D1Magnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectMFM32D1Score";
  };
  numericValue: number;
}

/**
 * MFM32D2Magnitude Type
 */
export interface MFM32D2Magnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectMFM32D2Score";
  };
  numericValue: number;
}

/**
 * MFM32D3Magnitude Type
 */
export interface MFM32D3Magnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectMFM32D3Score";
  };
  numericValue: number;
}

/**
 * GripStrengthRightMagnitude Type
 */
export interface GripStrengthRightMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectGripStrengthRight";
  };
  hasUnitOfMeasure: {
    "@id": "UnitKilogram";
  };
  numericValue: number;
}

/**
 * GripStrengthLeftMagnitude Type
 */
export interface GripStrengthLeftMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectGripStrengthLeft";
  };
  hasUnitOfMeasure: {
    "@id": "UnitKilogram";
  };
  numericValue: number;
}

/**
 * PinchStrengthRightMagnitude Type
 */
export interface PinchStrengthRightMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectPinchStrengthRight";
  };
  hasUnitOfMeasure: {
    "@id": "UnitKilogram";
  };
  numericValue: number;
}

/**
 * PinchStrengthLeftMagnitude Type
 */
export interface PinchStrengthLeftMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectPinchStrengthLeft";
  };
  hasUnitOfMeasure: {
    "@id": "UnitKilogram";
  };
  numericValue: number;
}

/**
 * HeightZScoreMagnitude Type
 */
export interface HeightZScoreMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectHeightForAgeZScoreUKWHO";
  };
  numericValue: number;
}

/**
 * WeightZScoreMagnitude Type
 */
export interface WeightZScoreMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectWeightForAgeZScoreUKWHO";
  };
  numericValue: number;
}

/**
 * AmbulationGainEventMagnitude Type
 */
export interface AmbulationGainEventMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAmbulationGainEvent";
  };
  numericValue: number;
}

/**
 * AmbulationGainTimeMagnitude Type
 */
export interface AmbulationGainTimeMagnitude {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  type: LdSet<{
    "@id": "Magnitude";
  }>;
  hasAspect: {
    "@id": "AspectAmbulationGainTime";
  };
  hasUnitOfMeasure: {
    "@id": "UnitYear";
  };
  numericValue: number;
}
