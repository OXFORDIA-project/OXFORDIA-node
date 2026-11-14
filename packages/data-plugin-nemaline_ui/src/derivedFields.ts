import { ukWhoZScore, type GrowthSex } from './lmsZScore';

// Fields computed at upload from other columns. These replace the
// oxfordia_mutate() steps in oxfordiar/scripts/smoke-test-next.R; each rule
// mirrors the R function it replaces, including R's ifelse() turning a
// missing input into a missing output.

/** Values read from the row, keyed by shortcut name. */
export interface RowValues {
  numbers: Map<string, number>;
  /** Selected category option id (compact LDO name) per shortcut. */
  categories: Map<string, string>;
}

export interface DerivedValues {
  numbers: Map<string, number>;
  categories: Map<string, string>;
}

/** AmbGainTime for walkers whose age at ambulation was not recorded. */
export const AMBULATION_AGE_IF_UNKNOWN = 18;

const SEX_BY_GENDER: Record<string, GrowthSex> = {
  GenderMale: 'male',
  GenderFemale: 'female',
};

export function deriveFields({ numbers, categories }: RowValues): DerivedValues {
  const derived: DerivedValues = { numbers: new Map(), categories: new Map() };
  const setNumber = (shortcut: string, value: number | undefined) => {
    if (value !== undefined) derived.numbers.set(shortcut, value);
  };

  // get_ZScoreH / get_ZScoreW:
  //   LMS2z(age, height|weight, sex, "ht"|"wt", "ukwhopt", toz = TRUE)
  const sex = SEX_BY_GENDER[categories.get('GenderAssignedAtBirth') ?? ''];
  const age = numbers.get('BaselineAge');
  const height = numbers.get('Height');
  const weight = numbers.get('Weight');
  if (sex && age !== undefined) {
    if (height !== undefined) setNumber('ZScoreH', ukWhoZScore('ht', sex, age, height));
    if (weight !== undefined) setNumber('ZScoreW', ukWhoZScore('wt', sex, age, weight));
  }

  // get_currentFN:
  //   ifelse(BaseAmb == "Yes", "Walker", ifelse(BaseSit == "Yes", "Sitter", "Non-Sitter"))
  const ambulant = categories.get('AmbulantAtBaseline');
  const sitting = categories.get('IndependentSittingAtBaseline');
  if (ambulant === 'AmbulantAtBaselineYes') {
    derived.categories.set('CurrentFN', 'CurrentFunctionWalker');
  } else if (ambulant !== undefined && sitting !== undefined) {
    derived.categories.set(
      'CurrentFN',
      sitting === 'SittingAtBaselineYes' ? 'CurrentFunctionSitter' : 'CurrentFunctionNonSitter',
    );
  }

  // get_AmbGainEvent: ifelse(EverAmb == "Yes", 1, 0)
  // get_AmbGainTime:  ifelse(EverAmb == "Yes", ifelse(!is.na(AmbAge), AmbAge, 18), BaseAge)
  const everAmbulant = categories.get('EverAchievedAmbulation');
  if (everAmbulant !== undefined) {
    const achieved = everAmbulant === 'EverAmbulantYes';
    setNumber('AmbGainEvent', achieved ? 1 : 0);
    setNumber(
      'AmbGainTime',
      achieved ? (numbers.get('AgeAmbulationAchieved') ?? AMBULATION_AGE_IF_UNKNOWN) : age,
    );
  }

  return derived;
}
