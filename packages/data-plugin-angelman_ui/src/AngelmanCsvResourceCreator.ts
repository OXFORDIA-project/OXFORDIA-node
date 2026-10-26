import { set } from '@ldo/ldo';
import { SolidContainer, SolidLeafSlug } from '@ldo/connected-solid';
import type { SolidConnectedPlugin } from '@ldo/connected-solid';
import type {
  IConnectedLdoDataset,
  ConnectedLdoTransactionDataset,
} from '@ldo/connected';
import { Stethoscope } from 'lucide-react-native';
import { ResourceCreatorConfig } from 'linked-data-browser';
import { PersonShapeType, StudyVisitShapeType } from '@oxfordia/data-plugin-angelman_core';
import type {
  Person,
  ID,
  BaselineAgeMagnitude,
  StudyVisit,
  VisitAgeMagnitude,
  PedsQLFIMYoungResult,
  PedsQLFIM7PlusResult,
  PedsQLAdultResult,
  AdultItemMagnitude,
} from '@oxfordia/data-plugin-angelman_core';
import {
  createAngelmanDefaultStatisticAccessRuleDocument,
  angelmanDefaultStatisticAccessRuleDocumentShapeType,
} from './defaultStatisticAccessRule';

type ContainerWithContext = SolidContainer & {
  context: { dataset: IConnectedLdoDataset<SolidConnectedPlugin[]> };
};

type ColumnMap = Record<string, number>;

type AnyMagnitude = {
  '@id': string;
  type: ReturnType<typeof set<{ '@id': 'Magnitude' }>>;
  hasAspect?: { '@id': string };
  hasUnitOfMeasure?: { '@id': 'UnitYear' };
  'Age(years,1D.p.)'?: number;
};

function basename(path: string): string {
  const lastSlash = path.lastIndexOf('/');
  return lastSlash === -1 ? path : path.slice(lastSlash + 1);
}

function parseCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(',').map((c) => c.trim()));
}

function parseNum(s: string): number {
  const t = s?.trim() ?? '';
  if (t === '' || t.toUpperCase() === 'NA') return NaN;
  return Number(t);
}

function buildColumnMap(headers: string[]): ColumnMap {
  const map: ColumnMap = {};
  for (let i = 0; i < headers.length; i++) {
    map[headers[i].trim().toLowerCase()] = i;
  }
  return map;
}

function getCol(row: string[], cols: ColumnMap, name: string): string {
  const idx = cols[name.toLowerCase()];
  return idx !== undefined ? (row[idx] ?? '').trim() : '';
}

function getNumCol(row: string[], cols: ColumnMap, name: string): number {
  return parseNum(getCol(row, cols, name));
}

function determineVisitType(eventName: string): StudyVisit['VisitType'] | undefined {
  const lower = eventName.toLowerCase().replace(/[\s-]+/g, '_');
  // "before_baseline" must not match as a baseline visit
  if (lower.includes('baseline') && !lower.startsWith('before')) return { '@id': 'VisitTypeBaseline' };
  if (lower.includes('visit_2') || lower.includes('visit2')) return { '@id': 'VisitTypeVisit2' };
  if (lower.includes('visit_3') || lower.includes('visit3')) return { '@id': 'VisitTypeVisit3' };
  if (lower.includes('visit_4') || lower.includes('visit4')) return { '@id': 'VisitTypeVisit4' };
  if (lower.includes('visit_5') || lower.includes('visit5')) return { '@id': 'VisitTypeVisit5' };
  if (lower.includes('visit_6') || lower.includes('visit6')) return { '@id': 'VisitTypeVisit6' };
  return undefined;
}

function makeMag(uri: string, aspect: string, value: number, includeUnit = false): AnyMagnitude {
  return {
    '@id': uri,
    type: set({ '@id': 'Magnitude' }),
    hasAspect: { '@id': aspect },
    ...(includeUnit ? { hasUnitOfMeasure: { '@id': 'UnitYear' } } : {}),
    'Age(years,1D.p.)': value,
  };
}

const FIM_YOUNG_COLS: [string, string][] = [
  ['fim_functioning_q1', 'AspectFIMFunctioningQ1'],
  ['fim_functioning_q2', 'AspectFIMFunctioningQ2'],
  ['fim_functioning_q3', 'AspectFIMFunctioningQ3'],
  ['fim_functioning_q4', 'AspectFIMFunctioningQ4'],
  ['fim_functioning_q5', 'AspectFIMFunctioningQ5'],
  ['fim_functioning_q6', 'AspectFIMFunctioningQ6'],
  ['fim_meotional_q1', 'AspectFIMEmotionalQ1'],
  ['fim_meotional_q2', 'AspectFIMEmotionalQ2'],
  ['fim_meotional_q3', 'AspectFIMEmotionalQ3'],
  ['fim_meotional_q4', 'AspectFIMEmotionalQ4'],
  ['fim_meotional_q5', 'AspectFIMEmotionalQ5'],
  ['fim_social_q1', 'AspectFIMSocialQ1'],
  ['fim_social_q2', 'AspectFIMSocialQ2'],
  ['fim_social_q3', 'AspectFIMSocialQ3'],
  ['fim_social_q4', 'AspectFIMSocialQ4'],
  ['fim_cognitive_q1', 'AspectFIMCognitiveQ1'],
  ['fim_cognitive_q2', 'AspectFIMCognitiveQ2'],
  ['fim_cognitive_q3', 'AspectFIMCognitiveQ3'],
  ['fim_cognitive_q4', 'AspectFIMCognitiveQ4'],
  ['fim_cognitive_q5', 'AspectFIMCognitiveQ5'],
  ['fim_communication_q1', 'AspectFIMCommunicationQ1'],
  ['fim_communication_q2', 'AspectFIMCommunicationQ2'],
  ['fim_communication_q3', 'AspectFIMCommunicationQ3'],
  ['fim_worry_q1', 'AspectFIMWorryQ1'],
  ['fim_worry_q2', 'AspectFIMWorryQ2'],
  ['fim_worry_q3', 'AspectFIMWorryQ3'],
  ['fim_worry_q4', 'AspectFIMWorryQ4'],
  ['fim_worry_q5', 'AspectFIMWorryQ5'],
  ['fim_activities_q1', 'AspectFIMActivitiesQ1'],
  ['fim_activities_q2', 'AspectFIMActivitiesQ2'],
  ['fim_activities_q3', 'AspectFIMActivitiesQ3'],
  ['fim_relationship_q1', 'AspectFIMRelationshipsQ1'],
  ['fim_relationship_q2', 'AspectFIMRelationshipsQ2'],
  ['fim_relationship_q3', 'AspectFIMRelationshipsQ3'],
  ['fim_relationship_q4', 'AspectFIMRelationshipsQ4'],
  ['fim_relationship_q5', 'AspectFIMRelationshipsQ5'],
];

const FIM_7_COLS: [string, string][] = [
  ['fim_physical_7_q1', 'AspectFIM7PhysicalQ1'],
  ['fim_physical_7_q2', 'AspectFIM7PhysicalQ2'],
  ['fim_physical_7_q3', 'AspectFIM7PhysicalQ3'],
  ['fim_physical_7_q4', 'AspectFIM7PhysicalQ4'],
  ['fim_physical_7_q5', 'AspectFIM7PhysicalQ5'],
  ['fim_physical_7_q6', 'AspectFIM7PhysicalQ6'],
  ['fim_emotional_7_q1', 'AspectFIM7EmotionalQ1'],
  ['fim_emotional_7_q2', 'AspectFIM7EmotionalQ2'],
  ['fim_emotional_7_q3', 'AspectFIM7EmotionalQ3'],
  ['fim_emotional_7_q4', 'AspectFIM7EmotionalQ4'],
  ['fim_emotional_7_q5', 'AspectFIM7EmotionalQ5'],
  ['fim_social_7_q1', 'AspectFIM7SocialQ1'],
  ['fim_social_7_q2', 'AspectFIM7SocialQ2'],
  ['fim_social_7_q3', 'AspectFIM7SocialQ3'],
  ['fim_social_7_q4', 'AspectFIM7SocialQ4'],
  ['fim_cognitive_7_q1', 'AspectFIM7CognitiveQ1'],
  ['fim_cognitive_7_q2', 'AspectFIM7CognitiveQ2'],
  ['fim_cognitive_7_q3', 'AspectFIM7CognitiveQ3'],
  ['fim_cognitive_7_q4', 'AspectFIM7CognitiveQ4'],
  ['fim_cognitive_7_q5', 'AspectFIM7CognitiveQ5'],
  ['fim_communication_7_q6', 'AspectFIM7CommunicationQ6'],
  ['fim_communication_7_q7', 'AspectFIM7CommunicationQ7'],
  ['fim_communication_7_q8', 'AspectFIM7CommunicationQ8'],
  ['fim_worry_7_q1', 'AspectFIM7WorryQ1'],
  ['fim_worry_7_q2', 'AspectFIM7WorryQ2'],
  ['fim_worry_7_q3', 'AspectFIM7WorryQ3'],
  ['fim_worry_7_q4', 'AspectFIM7WorryQ4'],
  ['fim_worry_7_q5', 'AspectFIM7WorryQ5'],
  ['fim_daily_activ_7_q1', 'AspectFIM7DailyActivitiesQ1'],
  ['fim_daily_activ_7_q2', 'AspectFIM7DailyActivitiesQ2'],
  ['fim_daily_activ_7_q3', 'AspectFIM7DailyActivitiesQ3'],
  ['fim_f_relationship_7_q4', 'AspectFIM7FamilyRelationshipsQ4'],
  ['fim_f_relationship_7_q5', 'AspectFIM7FamilyRelationshipsQ5'],
  ['fim_f_relationship_7_q6', 'AspectFIM7FamilyRelationshipsQ6'],
  ['fim_f_relationship_7_q7', 'AspectFIM7FamilyRelationshipsQ7'],
  ['fim_f_relationship_7_q8', 'AspectFIM7FamilyRelationshipsQ8'],
];

// All adult item column numbers, grouped by age band code
const ADULT_COLS_BY_BAND: Record<string, [string, string][]> = {
  '2': [
    ['adult_107', 'AspectAdultQ107'], ['adult_108', 'AspectAdultQ108'], ['adult_109', 'AspectAdultQ109'],
    ['adult_110', 'AspectAdultQ110'], ['adult_111', 'AspectAdultQ111'], ['adult_112', 'AspectAdultQ112'],
    ['adult_113', 'AspectAdultQ113'], ['adult_114', 'AspectAdultQ114'], ['adult_115', 'AspectAdultQ115'],
    ['adult_116', 'AspectAdultQ116'], ['adult_117', 'AspectAdultQ117'], ['adult_118', 'AspectAdultQ118'],
    ['adult_119', 'AspectAdultQ119'], ['adult_120', 'AspectAdultQ120'], ['adult_121', 'AspectAdultQ121'],
    ['adult_122', 'AspectAdultQ122'], ['adult_123', 'AspectAdultQ123'], ['adult_124', 'AspectAdultQ124'],
    ['adult_125', 'AspectAdultQ125'], ['adult_126', 'AspectAdultQ126'], ['adult_127', 'AspectAdultQ127'],
    ['adult_128', 'AspectAdultQ128'], ['adult_129', 'AspectAdultQ129'],
  ],
  '4': [
    ['adult_137', 'AspectAdultQ137'], ['adult_138', 'AspectAdultQ138'], ['adult_139', 'AspectAdultQ139'],
    ['adult_140', 'AspectAdultQ140'], ['adult_141', 'AspectAdultQ141'], ['adult_142', 'AspectAdultQ142'],
    ['adult_143', 'AspectAdultQ143'], ['adult_144', 'AspectAdultQ144'], ['adult_145', 'AspectAdultQ145'],
    ['adult_146', 'AspectAdultQ146'], ['adult_147', 'AspectAdultQ147'], ['adult_148', 'AspectAdultQ148'],
    ['adult_149', 'AspectAdultQ149'], ['adult_150', 'AspectAdultQ150'], ['adult_151', 'AspectAdultQ151'],
    ['adult_152', 'AspectAdultQ152'], ['adult_153', 'AspectAdultQ153'], ['adult_154', 'AspectAdultQ154'],
    ['adult_155', 'AspectAdultQ155'], ['adult_156', 'AspectAdultQ156'], ['adult_157', 'AspectAdultQ157'],
    ['adult_158', 'AspectAdultQ158'], ['adult_159', 'AspectAdultQ159'],
  ],
  '6': [
    ['adult_166', 'AspectAdultQ166'], ['adult_167', 'AspectAdultQ167'], ['adult_168', 'AspectAdultQ168'],
    ['adult_169', 'AspectAdultQ169'], ['adult_170', 'AspectAdultQ170'], ['adult_171', 'AspectAdultQ171'],
    ['adult_172', 'AspectAdultQ172'], ['adult_173', 'AspectAdultQ173'], ['adult_174', 'AspectAdultQ174'],
    ['adult_175', 'AspectAdultQ175'], ['adult_176', 'AspectAdultQ176'], ['adult_177', 'AspectAdultQ177'],
    ['adult_178', 'AspectAdultQ178'], ['adult_179', 'AspectAdultQ179'], ['adult_180', 'AspectAdultQ180'],
    ['adult_181', 'AspectAdultQ181'], ['adult_182', 'AspectAdultQ182'], ['adult_183', 'AspectAdultQ183'],
    ['adult_184', 'AspectAdultQ184'], ['adult_185', 'AspectAdultQ185'], ['adult_186', 'AspectAdultQ186'],
    ['adult_187', 'AspectAdultQ187'], ['adult_188', 'AspectAdultQ188'],
  ],
  '8': [
    ['adult_193', 'AspectAdultQ193'], ['adult_194', 'AspectAdultQ194'], ['adult_195', 'AspectAdultQ195'],
    ['adult_196', 'AspectAdultQ196'], ['adult_197', 'AspectAdultQ197'], ['adult_198', 'AspectAdultQ198'],
    ['adult_199', 'AspectAdultQ199'], ['adult_200', 'AspectAdultQ200'], ['adult_201', 'AspectAdultQ201'],
    ['adult_202', 'AspectAdultQ202'], ['adult_203', 'AspectAdultQ203'], ['adult_204', 'AspectAdultQ204'],
    ['adult_205', 'AspectAdultQ205'], ['adult_206', 'AspectAdultQ206'], ['adult_207', 'AspectAdultQ207'],
    ['adult_208', 'AspectAdultQ208'], ['adult_209', 'AspectAdultQ209'], ['adult_210', 'AspectAdultQ210'],
    ['adult_211', 'AspectAdultQ211'], ['adult_212', 'AspectAdultQ212'], ['adult_213', 'AspectAdultQ213'],
    ['adult_214', 'AspectAdultQ214'], ['adult_215', 'AspectAdultQ215'],
  ],
  '10': [
    ['adult_340', 'AspectAdultQ340'], ['adult_342', 'AspectAdultQ342'], ['adult_343', 'AspectAdultQ343'],
    ['adult_344', 'AspectAdultQ344'], ['adult_345', 'AspectAdultQ345'], ['adult_346', 'AspectAdultQ346'],
    ['adult_347', 'AspectAdultQ347'], ['adult_348', 'AspectAdultQ348'], ['adult_349', 'AspectAdultQ349'],
    ['adult_350', 'AspectAdultQ350'], ['adult_351', 'AspectAdultQ351'], ['adult_352', 'AspectAdultQ352'],
    ['adult_353', 'AspectAdultQ353'], ['adult_354', 'AspectAdultQ354'], ['adult_355', 'AspectAdultQ355'],
    ['adult_356', 'AspectAdultQ356'], ['adult_357', 'AspectAdultQ357'], ['adult_358', 'AspectAdultQ358'],
    ['adult_359', 'AspectAdultQ359'], ['adult_360', 'AspectAdultQ360'], ['adult_361', 'AspectAdultQ361'],
    ['adult_362', 'AspectAdultQ362'], ['adult_363', 'AspectAdultQ363'],
  ],
  '11': [
    ['adult_77', 'AspectAdultQ77'], ['adult_78', 'AspectAdultQ78'], ['adult_79', 'AspectAdultQ79'],
    ['adult_80', 'AspectAdultQ80'], ['adult_81', 'AspectAdultQ81'], ['adult_82', 'AspectAdultQ82'],
    ['adult_83', 'AspectAdultQ83'], ['adult_84', 'AspectAdultQ84'], ['adult_85', 'AspectAdultQ85'],
    ['adult_86', 'AspectAdultQ86'], ['adult_87', 'AspectAdultQ87'], ['adult_88', 'AspectAdultQ88'],
    ['adult_89', 'AspectAdultQ89'], ['adult_90', 'AspectAdultQ90'], ['adult_91', 'AspectAdultQ91'],
    ['adult_92', 'AspectAdultQ92'], ['adult_93', 'AspectAdultQ93'], ['adult_94', 'AspectAdultQ94'],
    ['adult_95', 'AspectAdultQ95'], ['adult_96', 'AspectAdultQ96'], ['adult_97', 'AspectAdultQ97'],
  ],
};

// Band code → LDO AgeBand IRI key
const AGE_BAND_ID: Record<string, PedsQLAdultResult['AgeBand']> = {
  '2':  { '@id': 'AgeBand26Plus' },
  '4':  { '@id': 'AgeBand18to25' },
  '6':  { '@id': 'AgeBand13to17' },
  '8':  { '@id': 'AgeBand8to12' },
  '10': { '@id': 'AgeBand5to7' },
  '11': { '@id': 'AgeBand2to4' },
};

function buildFimYoungResult(
  row: string[],
  cols: ColumnMap,
  baseUri: string,
  personId: string,
  visitKey: string,
): PedsQLFIMYoungResult | undefined {
  const items = set<Parameters<typeof set>[0]>();
  for (const [colName, aspect] of FIM_YOUNG_COLS) {
    const v = getNumCol(row, cols, colName);
    if (!Number.isNaN(v)) {
      (items as ReturnType<typeof set<AnyMagnitude>>).add(
        makeMag(`${baseUri}#fim-young-${aspect}-${personId}-${visitKey}`, aspect, v) as AnyMagnitude,
      );
    }
  }
  if ((items as Set<unknown>).size === 0) return undefined;
  return {
    '@id': `${baseUri}#fim-young-result-${personId}-${visitKey}`,
    type: set({ '@id': 'Content' }),
    InstrumentConcept: { '@id': 'ConceptFIMYoungChild' },
    PhysicalFunctioningQ1: items as PedsQLFIMYoungResult['PhysicalFunctioningQ1'],
  } as PedsQLFIMYoungResult;
}

function buildFim7Result(
  row: string[],
  cols: ColumnMap,
  baseUri: string,
  personId: string,
  visitKey: string,
): PedsQLFIM7PlusResult | undefined {
  const items = set<Parameters<typeof set>[0]>();
  for (const [colName, aspect] of FIM_7_COLS) {
    const v = getNumCol(row, cols, colName);
    if (!Number.isNaN(v)) {
      (items as ReturnType<typeof set<AnyMagnitude>>).add(
        makeMag(`${baseUri}#fim7-${aspect}-${personId}-${visitKey}`, aspect, v) as AnyMagnitude,
      );
    }
  }
  if ((items as Set<unknown>).size === 0) return undefined;
  return {
    '@id': `${baseUri}#fim7-result-${personId}-${visitKey}`,
    type: set({ '@id': 'Content' }),
    InstrumentConcept: { '@id': 'ConceptFIM7Plus' },
    PhysicalFunctioningQ1: items as PedsQLFIM7PlusResult['PhysicalFunctioningQ1'],
  } as PedsQLFIM7PlusResult;
}

function buildAdultResult(
  row: string[],
  cols: ColumnMap,
  baseUri: string,
  personId: string,
  visitKey: string,
): PedsQLAdultResult | undefined {
  // Determine selected age band from age_calculate___N checkbox columns
  let ageBand: PedsQLAdultResult['AgeBand'] | undefined;
  let activeBandCode: string | undefined;
  for (const code of Object.keys(ADULT_COLS_BY_BAND)) {
    if (getCol(row, cols, `age_calculate___${code}`) === '1') {
      ageBand = AGE_BAND_ID[code];
      activeBandCode = code;
      break;
    }
  }

  const items = set<AdultItemMagnitude>();
  const bandCols = activeBandCode ? ADULT_COLS_BY_BAND[activeBandCode] : [];
  for (const [colName, aspect] of bandCols) {
    const v = getNumCol(row, cols, colName);
    if (!Number.isNaN(v)) {
      items.add(
        makeMag(`${baseUri}#adult-${aspect}-${personId}-${visitKey}`, aspect, v) as unknown as AdultItemMagnitude,
      );
    }
  }

  if (!ageBand && (items as Set<unknown>).size === 0) return undefined;
  return {
    '@id': `${baseUri}#adult-result-${personId}-${visitKey}`,
    type: set({ '@id': 'Content' }),
    InstrumentConcept: { '@id': 'ConceptAdultQoL' },
    ...(ageBand ? { AgeBand: ageBand } : {}),
    PhysicalFunctioningQ1: items,
  } as PedsQLAdultResult;
}

function buildStudyVisit(
  row: string[],
  cols: ColumnMap,
  baseUri: string,
  personId: string,
  personUri: string,
): StudyVisit | undefined {
  const eventName = getCol(row, cols, 'redcap_event_name');
  const visitType = determineVisitType(eventName);
  // Rows that don't map to a clinical visit (before_baseline, conmeds, end_of_study, …) are skipped.
  if (!visitType) return undefined;
  const visitKey = visitType['@id'].replace('VisitType', '').toLowerCase();
  const visitUri = `${baseUri}#visit-${personId}-${visitKey}`;

  const ageAtVisit = getNumCol(row, cols, 'es_age');
  const ageAtVisitMag: VisitAgeMagnitude | undefined = !Number.isNaN(ageAtVisit)
    ? {
        '@id': `${baseUri}#age-at-visit-${personId}-${visitKey}`,
        type: set({ '@id': 'Magnitude' }),
        hasAspect: { '@id': 'AspectAgeAtVisit' },
        hasUnitOfMeasure: { '@id': 'UnitYear' },
        'Age(years,1D.p.)': ageAtVisit,
      }
    : undefined;

  const fimYoung = buildFimYoungResult(row, cols, baseUri, personId, visitKey);
  const fim7 = buildFim7Result(row, cols, baseUri, personId, visitKey);
  const adult = buildAdultResult(row, cols, baseUri, personId, visitKey);

  const produces = set<PedsQLFIMYoungResult | PedsQLFIM7PlusResult | PedsQLAdultResult>();
  if (fimYoung) produces.add(fimYoung);
  if (fim7) produces.add(fim7);
  if (adult) produces.add(adult);

  const visit: StudyVisit = {
    '@id': visitUri,
    type: set({ '@id': 'Determination' }),
    Participant: { '@id': personUri } as Person,
    ...(visitType ? { VisitType: visitType } : {}),
    ...(ageAtVisitMag ? { AgeAtVisit: ageAtVisitMag } : {}),
    ...((produces as Set<unknown>).size > 0
      ? { 'PedsQLFIM—YoungChild(1Month)': produces }
      : {}),
  };

  return visit;
}

function groupById(rows: string[][], cols: ColumnMap): Map<string, string[][]> {
  const groups = new Map<string, string[][]>();
  for (const row of rows) {
    const id = getCol(row, cols, 'record_id');
    if (!id) continue;
    const group = groups.get(id);
    if (group) {
      group.push(row);
    } else {
      groups.set(id, [row]);
    }
  }
  return groups;
}

function buildPerson(
  rows: string[][],
  cols: ColumnMap,
  baseUri: string,
  personId: string,
): Omit<Person, '@context'> {
  const personUri = `${baseUri}#person-${personId}`;
  const idUri = `${baseUri}#id-${personId}`;

  // Demographics come from the baseline row; exclude "before_baseline" rows
  // which contain "baseline" in the name but carry no demographic data.
  const baselineRow =
    rows.find((r) => {
      const event = getCol(r, cols, 'redcap_event_name').toLowerCase();
      return event.includes('baseline') && !event.startsWith('before');
    }) ?? rows[0];

  const genderCode = getCol(baselineRow, cols, 'd_gender');
  const handCode = getCol(baselineRow, cols, 'd_dominant');
  const baselineAge = getNumCol(baselineRow, cols, 'es_age');

  const categories = set<
    | { '@id': 'GenderMale' }
    | { '@id': 'GenderFemale' }
    | { '@id': 'GenderOther' }
    | { '@id': 'DominantHandRight' }
    | { '@id': 'DominantHandLeft' }
    | { '@id': 'DominantHandMixed' }
    | { '@id': 'DominantHandUnknown' }
  >();

  if (genderCode === '1' || genderCode.toLowerCase() === 'male')
    categories.add({ '@id': 'GenderMale' });
  else if (genderCode === '2' || genderCode.toLowerCase() === 'female')
    categories.add({ '@id': 'GenderFemale' });
  else if (genderCode === '3' || genderCode.toLowerCase() === 'other')
    categories.add({ '@id': 'GenderOther' });

  if (handCode === '1' || handCode.toLowerCase() === 'left')
    categories.add({ '@id': 'DominantHandLeft' });
  else if (handCode === '2' || handCode.toLowerCase() === 'right')
    categories.add({ '@id': 'DominantHandRight' });
  else if (handCode === '3' || handCode.toLowerCase() === 'ambidextrous' || handCode.toLowerCase() === 'mixed')
    categories.add({ '@id': 'DominantHandMixed' });
  else if (handCode === '4' || handCode.toLowerCase() === 'unknown')
    categories.add({ '@id': 'DominantHandUnknown' });

  let ageAtScreening: BaselineAgeMagnitude | undefined;
  if (!Number.isNaN(baselineAge)) {
    ageAtScreening = {
      '@id': `${baseUri}#baseline-age-${personId}`,
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': 'AspectAge' },
      hasUnitOfMeasure: { '@id': 'UnitYear' },
      'Age(years,1D.p.)': baselineAge,
    } as BaselineAgeMagnitude;
  }

  const studyVisits = set<StudyVisit>();
  for (const row of rows) {
    const visit = buildStudyVisit(row, cols, baseUri, personId, personUri);
    if (visit) studyVisits.add(visit);
  }

  return {
    '@id': personUri,
    type: set({ '@id': 'Person' }),
    RecordID: {
      '@id': idUri,
      type: set({ '@id': 'ID' }),
      IDString: personId,
    } as ID,
    ...(categories.size > 0 ? { isCategorizedBy: categories } : {}),
    ...(ageAtScreening ? { AgeAtScreening: ageAtScreening } : {}),
    ...(studyVisits.size > 0 ? { StudyVisits: studyVisits } : {}),
  };
}

export const AngelmanCsvResourceCreator: ResourceCreatorConfig = {
  name: 'angelmanCsv',
  displayName: 'Angelman CSV Upload',
  displayIcon: Stethoscope,
  canCreate: (container): container is SolidContainer =>
    container.type === 'SolidContainer',
  create: async ({ container, createUtils }) => {
    if (!createUtils.promptFile) {
      createUtils.toast('File picker is not available.', { title: 'Error' });
      return;
    }
    createUtils.loadingMessage('Choosing file…');
    const file = await createUtils.promptFile({
      title: 'Upload Angelman CSV',
      accept: 'text/csv,.csv',
    });
    if (!file) return;

    createUtils.loadingMessage('Reading CSV…');
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      createUtils.toast('CSV must have a header row and at least one data row.', {
        title: 'Error',
      });
      return;
    }

    const cols = buildColumnMap(rows[0]);
    const dataRows = rows.slice(1).filter((row) => row.some((c) => c.trim()));

    if (dataRows.length === 0) {
      createUtils.toast('No valid data rows to convert.', { title: 'Error' });
      return;
    }

    const groups = groupById(dataRows, cols);
    const personCount = groups.size;

    createUtils.loadingMessage(`Grouped ${dataRows.length} rows into ${personCount} participants…`);

    const baseName = basename(file.name).replace(/\.csv$/i, '');
    const slug = `${baseName}.ttl` as SolidLeafSlug;
    const statisticAccessRuleSlug = `${baseName}.statistic-access-rule.ttl` as SolidLeafSlug;
    const baseUri = `${container.uri}${slug}`;

    createUtils.loadingMessage(`Creating ${slug}…`);
    const createResult = await container.createChildAndOverwrite(slug);
    if (createResult.isError) {
      createUtils.toast(createResult.message, { title: 'Error' });
      return;
    }
    const childResource = createResult.resource;

    const dataset = (container as ContainerWithContext).context.dataset;
    const transaction = dataset.startTransaction();

    for (const [personId, personRows] of groups) {
      const personData = buildPerson(personRows, cols, baseUri, personId);
      transaction
        .usingType(PersonShapeType)
        .write(childResource.uri)
        .fromJson(personData as Person);

      // Write each visit separately with StudyVisitShapeType so LDO applies
      // the Determination context and correctly writes gist:produces → Content
      // → gist:hasMagnitude chains. PersonShapeType alone only writes the
      // person→visit hasParticipant links, leaving the visit internals unwritten.
      for (const visit of personData.StudyVisits ?? []) {
        transaction
          .usingType(StudyVisitShapeType)
          .write(childResource.uri)
          .fromJson(visit);
      }
    }

    createUtils.loadingMessage(`Writing content to ${slug}…`);
    const commitResult = await (
      transaction as ConnectedLdoTransactionDataset<SolidConnectedPlugin[]>
    ).commitToRemote();

    if (commitResult.isError) {
      createUtils.toast(commitResult.message, { title: 'Error' });
      return;
    }

    const statisticAccessRuleResource = container.child(statisticAccessRuleSlug);
    let defaultStatisticAccessRule;
    try {
      defaultStatisticAccessRule = createAngelmanDefaultStatisticAccessRuleDocument(
        statisticAccessRuleResource.uri,
      );
    } catch (error) {
      createUtils.toast(
        `${slug} created (${personCount} persons), but failed to build the default statistic access rule: ${
          error instanceof Error ? error.message : String(error)
        }`,
        { title: 'Error' },
      );
      return;
    }

    createUtils.loadingMessage(`Initializing ${statisticAccessRuleSlug}…`);
    const createStatisticAccessRuleResult =
      await container.createChildAndOverwrite(statisticAccessRuleSlug);
    if (createStatisticAccessRuleResult.isError) {
      createUtils.toast(
        `${slug} created (${personCount} persons), but failed to initialize ${statisticAccessRuleSlug}: ${
          createStatisticAccessRuleResult.message
        }`,
        { title: 'Error' },
      );
      return;
    }

    const statisticAccessRuleTransaction = dataset.startTransaction();
    statisticAccessRuleTransaction
      .usingType(angelmanDefaultStatisticAccessRuleDocumentShapeType)
      .write(createStatisticAccessRuleResult.resource.uri)
      .fromJson(defaultStatisticAccessRule);

    const statisticAccessRuleCommitResult = await (
      statisticAccessRuleTransaction as ConnectedLdoTransactionDataset<SolidConnectedPlugin[]>
    ).commitToRemote();
    if (statisticAccessRuleCommitResult.isError) {
      createUtils.toast(
        `${slug} created (${personCount} persons), but failed to initialize ${statisticAccessRuleSlug}: ${
          statisticAccessRuleCommitResult.message
        }`,
        { title: 'Error' },
      );
      return;
    }

    createUtils.toast(
      `${slug} created (${personCount} persons) with ${statisticAccessRuleSlug}.`,
    );
  },
};
