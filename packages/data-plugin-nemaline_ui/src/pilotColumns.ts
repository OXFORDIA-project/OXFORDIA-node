// Column layout of "Pilot Run NM Data fed XLSX file for pod upload V1.0
// 13Oct2026.xlsx" (sheet "Pilot data"), saved as a plain CSV. Columns are
// addressed by spreadsheet letter because several headers repeat
// (e.g. "Pathogenicity", "Decimal age"). Computed columns (C, V, Z, AC, AH,
// AL, AP, AT, AW) are ignored: decimal ages are recomputed from years + months.

export interface AgeColumnSpec {
  kind: 'age';
  shortcut: string;
  label: string;
  yearsColumn: string;
  monthsColumn: string;
  aspect: string;
  unit: string;
}

export interface NumberColumnSpec {
  kind: 'number';
  shortcut: string;
  label: string;
  column: string;
  aspect: string;
  unit?: string;
}

export type NumericColumnSpec = AgeColumnSpec | NumberColumnSpec;

export interface CategoryOption {
  label: string;
  id: string;
  aliases?: string[];
}

export interface CategoryColumnSpec {
  shortcut: string;
  label: string;
  column: string;
  options: CategoryOption[];
}

export interface VariantCategorySpec {
  key: 'Type' | 'Consequence' | 'LossOfFunction' | 'Pathogenicity';
  label: string;
  options: CategoryOption[];
}

export interface VariantColumnSpec {
  position: 1 | 2;
  positionId: string;
  hgvsColumn: string;
  columns: Record<VariantCategorySpec['key'], string>;
}

export const NUMERIC_COLUMNS: NumericColumnSpec[] = [
  { kind: 'age', shortcut: 'BaselineAge', label: "Age at baseline visit", yearsColumn: 'A', monthsColumn: 'B', aspect: 'AspectAgeAtBaselineVisit', unit: 'UnitYear' },
  { kind: 'number', shortcut: 'NumberOfVariants', label: "Number of variants (0-4)", column: 'G', aspect: 'AspectNumberOfVariants' },
  { kind: 'age', shortcut: 'AgeAtFirstSymptom', label: "Age of first symptom (onset of disease)", yearsColumn: 'T', monthsColumn: 'U', aspect: 'AspectAgeAtFirstSymptom', unit: 'UnitYear' },
  { kind: 'age', shortcut: 'AgeAtPresentation', label: "Age of presentation to medical services", yearsColumn: 'X', monthsColumn: 'Y', aspect: 'AspectAgeAtPresentation', unit: 'UnitYear' },
  { kind: 'age', shortcut: 'AgeAtDiagnosis', label: "Age of diagnosis (usually date of genetic report)", yearsColumn: 'AA', monthsColumn: 'AB', aspect: 'AspectAgeAtDiagnosis', unit: 'UnitYear' },
  { kind: 'age', shortcut: 'AgeAmbulationAchieved', label: "Age ambulation achieved", yearsColumn: 'AF', monthsColumn: 'AG', aspect: 'AspectAgeAtAmbulationAchieved', unit: 'UnitYear' },
  { kind: 'age', shortcut: 'AgeAmbulationLost', label: "Age ambulation lost", yearsColumn: 'AJ', monthsColumn: 'AK', aspect: 'AspectAgeAtLossOfAmbulation', unit: 'UnitYear' },
  { kind: 'age', shortcut: 'AgeIndependentSittingAchieved', label: "Age independent sitting achieved", yearsColumn: 'AN', monthsColumn: 'AO', aspect: 'AspectAgeAtIndependentSittingAchieved', unit: 'UnitYear' },
  { kind: 'age', shortcut: 'AgeIndependentSittingLost', label: "Age independent sitting lost", yearsColumn: 'AR', monthsColumn: 'AS', aspect: 'AspectAgeAtLossOfIndependentSitting', unit: 'UnitYear' },
  { kind: 'number', shortcut: 'VentilationHoursOn', label: "Time on ventilation per day (hours)", column: 'AU', aspect: 'AspectDailyHoursOnVentilation', unit: 'UnitHour' },
  { kind: 'number', shortcut: 'VentilationHoursOff', label: "Time off ventilation per day (hours)", column: 'AV', aspect: 'AspectDailyHoursOffVentilation', unit: 'UnitHour' },
  { kind: 'number', shortcut: 'AgeTubeFeedingCommenced', label: "Age tube feeding commenced (decimal years)", column: 'BA', aspect: 'AspectAgeAtTubeFeedingCommenced', unit: 'UnitYear' },
  { kind: 'number', shortcut: 'CEDASScore', label: "CEDAS/FOIS level (1-6)", column: 'BB', aspect: 'AspectCEDASScore' },
  { kind: 'number', shortcut: 'Weight', label: "Weight at baseline visit (kg)", column: 'BD', aspect: 'AspectWeightAtBaselineVisit', unit: 'UnitKilogram' },
  { kind: 'number', shortcut: 'Height', label: "Height at baseline visit (cm)", column: 'BE', aspect: 'AspectHeightAtBaselineVisit', unit: 'UnitCentimetre' },
  { kind: 'number', shortcut: 'CobbAngle', label: "Cobb angle (degrees)", column: 'BG', aspect: 'AspectCobbAngle', unit: 'UnitDegree' },
  { kind: 'number', shortcut: 'AgeCobbAngleMeasured', label: "Age Cobb angle measured (decimal years)", column: 'BH', aspect: 'AspectAgeAtCobbAngleMeasurement', unit: 'UnitYear' },
  { kind: 'number', shortcut: 'AgeSpinalSurgery', label: "Age of spinal surgery (decimal years)", column: 'BJ', aspect: 'AspectAgeAtSpinalSurgery', unit: 'UnitYear' },
  { kind: 'number', shortcut: 'CHOPINTENDTotal', label: "CHOP INTEND total score of best side (0-64)", column: 'BK', aspect: 'AspectCHOPINTENDTotalBestSide' },
  { kind: 'number', shortcut: 'MFM32Total', label: "MFM32 total raw score (0-96)", column: 'BL', aspect: 'AspectMFM32AggregateScore' },
  { kind: 'number', shortcut: 'MFM32D1', label: "MFM32 D1 raw score (0-39)", column: 'BM', aspect: 'AspectMFM32D1Score' },
  { kind: 'number', shortcut: 'MFM32D2', label: "MFM32 D2 raw score (0-36)", column: 'BN', aspect: 'AspectMFM32D2Score' },
  { kind: 'number', shortcut: 'MFM32D3', label: "MFM32 D3 raw score (0-21)", column: 'BO', aspect: 'AspectMFM32D3Score' },
  { kind: 'number', shortcut: 'GripStrengthRight', label: "Grip strength best valid value, right hand (kg)", column: 'BP', aspect: 'AspectGripStrengthRight', unit: 'UnitKilogram' },
  { kind: 'number', shortcut: 'GripStrengthLeft', label: "Grip strength best valid value, left hand (kg)", column: 'BQ', aspect: 'AspectGripStrengthLeft', unit: 'UnitKilogram' },
  { kind: 'number', shortcut: 'PinchStrengthRight', label: "Pinch strength best valid value, right hand (kg)", column: 'BT', aspect: 'AspectPinchStrengthRight', unit: 'UnitKilogram' },
  { kind: 'number', shortcut: 'PinchStrengthLeft', label: "Pinch strength best valid value, left hand (kg)", column: 'BU', aspect: 'AspectPinchStrengthLeft', unit: 'UnitKilogram' },
];

export const CATEGORY_COLUMNS: CategoryColumnSpec[] = [
  {
    shortcut: 'GenderAssignedAtBirth',
    label: "Gender assigned at birth",
    column: 'D',
    options: [
      { label: "Male", id: 'GenderMale' },
      { label: "Female", id: 'GenderFemale' },
      { label: "Unknown", id: 'GenderUnknown' },
      { label: "Other", id: 'GenderOther' },
    ],
  },
  {
    shortcut: 'CausativeGene',
    label: "Causative gene",
    column: 'E',
    options: [
      { label: "NEB", id: 'GeneNEB' },
      { label: "ACTA1", id: 'GeneACTA1' },
      { label: "TPM2", id: 'GeneTPM2' },
      { label: "TPM3", id: 'GeneTPM3' },
      { label: "KLHL40", id: 'GeneKLHL40' },
      { label: "KLHL41", id: 'GeneKLHL41' },
      { label: "MYPN", id: 'GeneMYPN' },
      { label: "LMOD3", id: 'GeneLMOD3' },
      { label: "CFL2", id: 'GeneCFL2', aliases: ["CFL-2"] },
      { label: "KBTBD13", id: 'GeneKBTBD13', aliases: ["KTBD13"] },
      { label: "TNNT1", id: 'GeneTNNT1' },
      { label: "TNNT3", id: 'GeneTNNT3' },
    ],
  },
  {
    shortcut: 'Zygosity',
    label: "Zygosity",
    column: 'F',
    options: [
      { label: "Homozygous", id: 'ZygosityHomozygous' },
      { label: "Heterozygous", id: 'ZygosityHeterozygous' },
      { label: "Compound Heterozygous", id: 'ZygosityCompoundHeterozygous' },
      { label: "Hemizygous", id: 'ZygosityHemizygous' },
    ],
  },
  {
    shortcut: 'MuscleBiopsy',
    label: "Muscle biopsy performed",
    column: 'R',
    options: [
      { label: "Yes", id: 'MuscleBiopsyYes' },
      { label: "No", id: 'MuscleBiopsyNo' },
      { label: "Unknown", id: 'MuscleBiopsyUnknown' },
    ],
  },
  {
    shortcut: 'BiopsyResult',
    label: "Muscle biopsy result",
    column: 'S',
    options: [
      { label: "Nemaline rods or bodies", id: 'BiopsyResultRodsOrBodies' },
      { label: "Nemaline rods or bodies AND type 1 fibre atrophy", id: 'BiopsyResultRodsOrBodiesAndType1FibreAtrophy' },
      { label: "No rods or bodies but type 1 fibre atrophy", id: 'BiopsyResultNoRodsButType1FibreAtrophy' },
      { label: "Nemaline rods or bodies and other findings", id: 'BiopsyResultRodsOrBodiesAndOtherFindings' },
      { label: "No rods or bodies but Other findings", id: 'BiopsyResultNoRodsButOtherFindings' },
      { label: "No Biopsy done", id: 'BiopsyResultNoBiopsyDone' },
    ],
  },
  {
    shortcut: 'NatureOfFirstSymptoms',
    label: "Nature of first symptom(s)",
    column: 'W',
    options: [
      { label: "Skeletal muscle weakness only", id: 'FirstSymptomSkeletalMuscleOnly' },
      { label: "Respiratory weakness only", id: 'FirstSymptomRespiratoryOnly' },
      { label: "Bulbar dysfunction only", id: 'FirstSymptomBulbarOnly' },
      { label: "Skeletal muscle AND Respiratory", id: 'FirstSymptomSkeletalMuscleAndRespiratory' },
      { label: "Skeletal muscle AND Bulbar", id: 'FirstSymptomSkeletalMuscleAndBulbar' },
      { label: "Respiratory and Bulbar", id: 'FirstSymptomRespiratoryAndBulbar' },
      { label: "All 3: Skeletal Muscle AND Respiratory AND Bulbar", id: 'FirstSymptomSkeletalMuscleRespiratoryAndBulbar' },
      { label: "Family History alone", id: 'FirstSymptomFamilyHistoryAlone' },
      { label: "Other", id: 'FirstSymptomOther' },
    ],
  },
  {
    shortcut: 'FamilyHistory',
    label: "Family history",
    column: 'AD',
    options: [
      { label: "Yes", id: 'FamilyHistoryYes' },
      { label: "No", id: 'FamilyHistoryNo' },
      { label: "Possibly", id: 'FamilyHistoryPossibly' },
      { label: "Unknown", id: 'FamilyHistoryUnknown' },
    ],
  },
  {
    shortcut: 'EverAchievedAmbulation',
    label: "Ever achieved ambulation (walks 10m independently)",
    column: 'AE',
    options: [
      { label: "Yes", id: 'EverAmbulantYes' },
      { label: "No", id: 'EverAmbulantNo' },
      { label: "Not applicable", id: 'EverAmbulantNotApplicable' },
    ],
  },
  {
    shortcut: 'AmbulantAtBaseline',
    label: "Ambulant at baseline visit",
    column: 'AI',
    options: [
      { label: "Yes", id: 'AmbulantAtBaselineYes' },
      { label: "No", id: 'AmbulantAtBaselineNo' },
    ],
  },
  {
    shortcut: 'EverAchievedIndependentSitting',
    label: "Ever achieved independent sitting",
    column: 'AM',
    options: [
      { label: "Yes", id: 'EverSatIndependentlyYes' },
      { label: "No", id: 'EverSatIndependentlyNo' },
      { label: "Not applicable", id: 'EverSatIndependentlyNotApplicable' },
    ],
  },
  {
    shortcut: 'IndependentSittingAtBaseline',
    label: "Independently sitting at baseline visit",
    column: 'AQ',
    options: [
      { label: "Yes", id: 'SittingAtBaselineYes' },
      { label: "No", id: 'SittingAtBaselineNo' },
    ],
  },
  {
    shortcut: 'VentilationType',
    label: "Type of ventilation",
    column: 'AX',
    options: [
      { label: "None", id: 'VentilationNone' },
      { label: "Non-Invasive ventilation", id: 'VentilationNonInvasive' },
      { label: "Invasive ventilation", id: 'VentilationInvasive' },
    ],
  },
  {
    shortcut: 'PreviousVentilation',
    label: "Previously required ventilation",
    column: 'AY',
    options: [
      { label: "Yes", id: 'PreviousVentilationYes' },
      { label: "No", id: 'PreviousVentilationNo' },
    ],
  },
  {
    shortcut: 'TubeFeedingAtBaseline',
    label: "Requirement for tube feeding at baseline visit",
    column: 'AZ',
    options: [
      { label: "Yes", id: 'TubeFedAtBaselineYes' },
      { label: "No", id: 'TubeFedAtBaselineNo' },
    ],
  },
  {
    shortcut: 'PreviousTubeFeeding',
    label: "Previously tube fed",
    column: 'BC',
    options: [
      { label: "Yes", id: 'PreviousTubeFeedingYes' },
      { label: "No", id: 'PreviousTubeFeedingNo' },
    ],
  },
  {
    shortcut: 'ScoliosisAtBaseline',
    label: "Presence of scoliosis at baseline visit",
    column: 'BF',
    options: [
      { label: "Yes", id: 'ScoliosisAtBaselineYes' },
      { label: "No", id: 'ScoliosisAtBaselineNo' },
    ],
  },
  {
    shortcut: 'EverHadSpinalSurgery',
    label: "Ever had spinal surgery",
    column: 'BI',
    options: [
      { label: "Yes", id: 'SpinalSurgeryYes' },
      { label: "No", id: 'SpinalSurgeryNo' },
    ],
  },
  {
    shortcut: 'GripDeviceMake',
    label: "Make of grip dynamometer",
    column: 'BR',
    options: [
      { label: "Jamar/Performance Health", id: 'GripDeviceMakeJamarPerformanceHealth' },
      { label: "Biometrics Ltd", id: 'GripDeviceMakeBiometricsLtd' },
      { label: "North coast medical", id: 'GripDeviceMakeNorthCoastMedical' },
      { label: "Fabrication Enterprises (FEI)", id: 'GripDeviceMakeFabricationEnterprises' },
      { label: "Takei Scientific Instruments", id: 'GripDeviceMakeTakeiScientificInstruments' },
      { label: "KERN", id: 'GripDeviceMakeKERN' },
      { label: "MIE Medical Research", id: 'GripDeviceMakeMIEMedicalResearch' },
      { label: "Myogrip/Ateliers Laumonier", id: 'GripDeviceMakeMyogripAteliersLaumonier' },
      { label: "Citec", id: 'GripDeviceMakeCitec' },
      { label: "MicroFET/Hoggan Scientific", id: 'GripDeviceMakeMicroFETHogganScientific' },
      { label: "Other", id: 'GripDeviceMakeOther' },
    ],
  },
  {
    shortcut: 'GripDeviceModel',
    label: "Model of grip dynamometer",
    column: 'BS',
    options: [
      { label: "Hydraulic Hand Dynamometer", id: 'GripDeviceModelHydraulicHandDynamometer' },
      { label: "Smart Hand Dynamometer", id: 'GripDeviceModelSmartHandDynamometer' },
      { label: "G200 Hand grip", id: 'GripDeviceModelG200HandGrip' },
      { label: "G100 Hand grip", id: 'GripDeviceModelG100HandGrip' },
      { label: "Baseline hydraulic hand dynamometer", id: 'GripDeviceModelBaselineHydraulicHandDynamometer' },
      { label: "Baseline digital smedley dynamometer", id: 'GripDeviceModelBaselineDigitalSmedleyDynamometer' },
      { label: "5401 Grip-D", id: 'GripDeviceModel5401GripD' },
      { label: "5001 Grip-A", id: 'GripDeviceModel5001GripA' },
      { label: "MAP hand grip", id: 'GripDeviceModelMAPHandGrip' },
      { label: "MIE digital grip analyser", id: 'GripDeviceModelMIEDigitalGripAnalyser' },
      { label: "CITEC hand held", id: 'GripDeviceModelCITECHandHeld' },
      { label: "Other", id: 'GripDeviceModelOther' },
    ],
  },
  {
    shortcut: 'PinchDeviceMake',
    label: "Make of pinch dynamometer",
    column: 'BV',
    options: [
      { label: "Jamar/Performance Health", id: 'PinchDeviceMakeJamarPerformanceHealth' },
      { label: "Biometrics Ltd", id: 'PinchDeviceMakeBiometricsLtd' },
      { label: "North Coast Medical", id: 'PinchDeviceMakeNorthCoastMedical' },
      { label: "Fabrication Enterprises (FEI)/Baseline", id: 'PinchDeviceMakeFabricationEnterprisesBaseline' },
      { label: "Takei Scientific Instruments", id: 'PinchDeviceMakeTakeiScientificInstruments' },
      { label: "MIE Medical Research", id: 'PinchDeviceMakeMIEMedicalResearch' },
      { label: "Ateliers Laumonier", id: 'PinchDeviceMakeAteliersLaumonier' },
      { label: "CITEC", id: 'PinchDeviceMakeCITEC' },
      { label: "B&L Engineering", id: 'PinchDeviceMakeBLEngineering' },
      { label: "MicroFET/Hoggan Scientific", id: 'PinchDeviceMakeMicroFETHogganScientific' },
      { label: "Other", id: 'PinchDeviceMakeOther' },
    ],
  },
  {
    shortcut: 'PinchDeviceModel',
    label: "Model of pinch dynamometer",
    column: 'BW',
    options: [
      { label: "Hydraulic Pinch Gauge", id: 'PinchDeviceModelHydraulicPinchGauge' },
      { label: "Digital Pinch Gauge", id: 'PinchDeviceModelDigitalPinchGauge' },
      { label: "Mechanical Pinch Gauge", id: 'PinchDeviceModelMechanicalPinchGauge' },
      { label: "Pinchmeter", id: 'PinchDeviceModelPinchmeter' },
      { label: "Pinch Analyser", id: 'PinchDeviceModelPinchAnalyser' },
      { label: "MyoPinch", id: 'PinchDeviceModelMyoPinch' },
      { label: "Pinch Strength Meter", id: 'PinchDeviceModelPinchStrengthMeter' },
      { label: "CITEC Hand Held", id: 'PinchDeviceModelCITECHandHeld' },
      { label: "Other", id: 'PinchDeviceModelOther' },
    ],
  },
];

export const VARIANT_CATEGORIES: VariantCategorySpec[] = [
  {
    key: 'Type',
    label: "Variant type",
    options: [
      { label: "Single Nucleotide Variant (SNV)", id: 'VariantTypeSNV', aliases: ["SNV"] },
      { label: "Insertion", id: 'VariantTypeInsertion' },
      { label: "Deletion", id: 'VariantTypeDeletion' },
      { label: "Duplication", id: 'VariantTypeDuplication' },
      { label: "Copy Number Variant (CNV)", id: 'VariantTypeCNV', aliases: ["CNV"] },
      { label: "Unknown", id: 'VariantTypeUnknown' },
    ],
  },
  {
    key: 'Consequence',
    label: "Variant consequence",
    options: [
      { label: "Missense", id: 'VariantConsequenceMissense' },
      { label: "Nonsense", id: 'VariantConsequenceNonsense' },
      { label: "Frameshift", id: 'VariantConsequenceFrameshift' },
      { label: "In-frame", id: 'VariantConsequenceInFrame' },
      { label: "Splice-altering", id: 'VariantConsequenceSpliceAltering' },
      { label: "Synonymous", id: 'VariantConsequenceSynonymous' },
      { label: "Splice", id: 'VariantConsequenceSplice' },
      { label: "Unknown", id: 'VariantConsequenceUnknown' },
    ],
  },
  {
    key: 'LossOfFunction',
    label: "Loss of function predicted",
    options: [
      { label: "Yes", id: 'LossOfFunctionYes' },
      { label: "No", id: 'LossOfFunctionNo' },
      { label: "Unknown", id: 'LossOfFunctionUnknown' },
      { label: "Other", id: 'LossOfFunctionOther' },
    ],
  },
  {
    key: 'Pathogenicity',
    label: "Pathogenicity",
    options: [
      { label: "Pathogenic", id: 'PathogenicityPathogenic' },
      { label: "Likely Pathogenic", id: 'PathogenicityLikelyPathogenic' },
      { label: "Uncertain significance", id: 'PathogenicityUncertainSignificance' },
      { label: "Likely Benign", id: 'PathogenicityLikelyBenign' },
      { label: "Benign", id: 'PathogenicityBenign' },
      { label: "Unknown", id: 'PathogenicityUnknown' },
    ],
  },
];

export const VARIANT_COLUMNS: VariantColumnSpec[] = [
  { position: 1, positionId: 'VariantPosition1', hgvsColumn: 'H', columns: { Type: 'I', Consequence: 'J', LossOfFunction: 'K', Pathogenicity: 'L' } },
  { position: 2, positionId: 'VariantPosition2', hgvsColumn: 'M', columns: { Type: 'N', Consequence: 'O', LossOfFunction: 'P', Pathogenicity: 'Q' } },
];

// Fields computed by the CSV importer from other columns (see derivedFields.ts).

export interface DerivedNumericSpec {
  shortcut: string;
  label: string;
  aspect: string;
  unit?: string;
}

export interface DerivedCategorySpec {
  shortcut: string;
  label: string;
  options: CategoryOption[];
}

export const DERIVED_NUMERIC_FIELDS: DerivedNumericSpec[] = [
  { shortcut: 'ZScoreH', label: "Height-for-age Z-score at baseline (UK-WHO reference)", aspect: 'AspectHeightForAgeZScoreUKWHO' },
  { shortcut: 'ZScoreW', label: "Weight-for-age Z-score at baseline (UK-WHO reference)", aspect: 'AspectWeightForAgeZScoreUKWHO' },
  { shortcut: 'AmbGainEvent', label: "Attaining ambulation: Kaplan-Meier event indicator (1 = achieved, 0 = censored)", aspect: 'AspectAmbulationGainEvent' },
  { shortcut: 'AmbGainTime', label: "Attaining ambulation: Kaplan-Meier time (years)", aspect: 'AspectAmbulationGainTime', unit: 'UnitYear' },
];

export const DERIVED_CATEGORY_FIELDS: DerivedCategorySpec[] = [
  {
    shortcut: 'CurrentFN',
    label: "Functional status at baseline visit",
    options: [
      { label: "Walker", id: 'CurrentFunctionWalker' },
      { label: "Sitter", id: 'CurrentFunctionSitter' },
      { label: "Non-Sitter", id: 'CurrentFunctionNonSitter' },
    ],
  },
];
