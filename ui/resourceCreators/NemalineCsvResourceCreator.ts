import { set } from '@ldo/ldo';
import { SolidContainer, SolidLeafSlug } from '@ldo/connected-solid';
import type { SolidConnectedPlugin } from '@ldo/connected-solid';
import type {
  IConnectedLdoDataset,
  ConnectedLdoTransactionDataset,
} from '@ldo/connected';
import { Stethoscope } from 'lucide-react-native';
import { ResourceCreatorConfig } from 'linked-data-browser';
import { PersonShapeType } from '@fedresda/types';
import type {
  Person,
  MFMAssessmentEvent,
  KaplanMeierObservation,
  AssessmentResult,
  ID,
  BaselineAgeMagnitude,
  LoAAgeMagnitude,
  KaplanMeierEventMagnitude,
  KaplanMeierTimeMagnitude,
  TotalMFMMagnitude,
  TimeFromBaselineMagnitude,
  MFMScoreMagnitude,
} from '@fedresda/types';

/** Container with context exposed so we can get the dataset for createData/commitToRemote. */
type ContainerWithContext = SolidContainer & {
  context: { dataset: IConnectedLdoDataset<SolidConnectedPlugin[]> };
};

/** Basename of a path or file name (handles forward slashes). */
function basename(path: string): string {
  const lastSlash = path.lastIndexOf('/');
  return lastSlash === -1 ? path : path.slice(lastSlash + 1);
}

/** Parse CSV text into rows (arrays of column values). */
function parseCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(',').map((c) => c.trim()));
}

/** Parse a numeric cell; returns NaN for "NA" or empty. */
function parseNum(s: string): number {
  const t = s?.trim() ?? '';
  if (t === '' || t.toUpperCase() === 'NA') return NaN;
  return Number(t);
}

/** Parse ambulation status into a normalized boolean. */
function isAmbulantStatus(status: string): boolean {
  return status.trim().toLowerCase() === 'ambulant';
}

/** Last valid visit time from V1..V5; NaN when none are present. */
function getLastObservedVisitTime(visitTimes: number[]): number {
  const valid = visitTimes.filter((t) => !Number.isNaN(t));
  if (valid.length === 0) return NaN;
  return valid.reduce((max, t) => (t > max ? t : max), valid[0]);
}

/** CSV columns: row#, Id, Cluster, Baseline_Age, Genetic_Group, Baseline_loA_status,
 * LoA Age, Time_V1-5, MFM_V1-5, Dominant hand, total MFM, Below average */
function rowToPerson(row: string[], baseUri: string): Omit<Person, '@context'> {
  const id = row[1] ?? '';
  const cluster = row[2] ?? '';
  const baselineAge = parseNum(row[3]);
  const geneticGroup = (row[4] ?? '').toLowerCase();
  const loaStatus = row[5] ?? '';
  const loaAge = parseNum(row[6]);
  const timeV1 = parseNum(row[7]);
  const timeV2 = parseNum(row[8]);
  const timeV3 = parseNum(row[9]);
  const timeV4 = parseNum(row[10]);
  const timeV5 = parseNum(row[11]);
  const mfmV1 = parseNum(row[12]);
  const mfmV2 = parseNum(row[13]);
  const mfmV3 = parseNum(row[14]);
  const mfmV4 = parseNum(row[15]);
  const mfmV5 = parseNum(row[16]);
  const dominantHand = row[17]?.trim() ?? '';
  const totalMfm = parseNum(row[18]);
  const belowAverage = (row[19] ?? '').toLowerCase();

  const personUri = `${baseUri}#person-${id}`;
  const idUri = `${baseUri}#id-${id}`;

  const ambulant = isAmbulantStatus(loaStatus);
  const categories = set<
    | { '@id': 'Cluster1' }
    | { '@id': 'Cluster2' }
    | { '@id': 'Cluster3' }
    | { '@id': 'GeneticGroupVariant1' }
    | { '@id': 'GeneticGroupVariant2' }
    | { '@id': 'GeneticGroupVariant3' }
    | { '@id': 'LeftHanded' }
    | { '@id': 'RightHanded' }
    | { '@id': 'StatusAmbulant' }
    | { '@id': 'StatusNonAmbulant' }
    | { '@id': 'PerformanceBelowAverage' }
  >();
  if (cluster === 'C1') categories.add({ '@id': 'Cluster1' });
  else if (cluster === 'C2') categories.add({ '@id': 'Cluster2' });
  else if (cluster === 'C3') categories.add({ '@id': 'Cluster3' });
  if (geneticGroup === 'variant1') categories.add({ '@id': 'GeneticGroupVariant1' });
  else if (geneticGroup === 'variant2') categories.add({ '@id': 'GeneticGroupVariant2' });
  else if (geneticGroup === 'variant3') categories.add({ '@id': 'GeneticGroupVariant3' });
  categories.add(ambulant ? { '@id': 'StatusAmbulant' } : { '@id': 'StatusNonAmbulant' });
  if (dominantHand === 'Left') categories.add({ '@id': 'LeftHanded' });
  if (dominantHand === 'Right') categories.add({ '@id': 'RightHanded' });
  if (belowAverage === 'below') categories.add({ '@id': 'PerformanceBelowAverage' });

  const lastVisitTime = getLastObservedVisitTime([timeV1, timeV2, timeV3, timeV4, timeV5]);
  const fallbackBaselineAge = Number.isNaN(baselineAge) ? 0 : baselineAge;
  const kmEvent = ambulant ? 0 : 1;
  const kmTime = ambulant
    ? fallbackBaselineAge + (Number.isNaN(lastVisitTime) ? 0 : lastVisitTime)
    : (Number.isNaN(loaAge) ? fallbackBaselineAge : loaAge);

  const magnitudes = set<
    BaselineAgeMagnitude |
    LoAAgeMagnitude |
    TotalMFMMagnitude
  >();
  magnitudes.add({
    '@id': `${baseUri}#baseline-age-${id}`,
    type: set({ '@id': 'Magnitude' }),
    hasAspect: { '@id': 'AspectAge' },
    hasUnitOfMeasure: { '@id': 'UnitYear' },
    numericValue: Number.isNaN(baselineAge) ? 0 : baselineAge,
  } as BaselineAgeMagnitude);
  if (!Number.isNaN(loaAge)) {
    magnitudes.add({
      '@id': `${baseUri}#loa-age-${id}`,
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': 'AspectAgeAtLossOfAmbulation' },
      hasUnitOfMeasure: { '@id': 'UnitYear' },
      numericValue: loaAge,
    } as LoAAgeMagnitude);
  }
  if (!Number.isNaN(totalMfm)) {
    magnitudes.add({
      '@id': `${baseUri}#total-mfm-${id}`,
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': 'AspectMFM32AggregateScore' },
      numericValue: totalMfm,
    } as TotalMFMMagnitude);
  }

  const visits: [number, number][] = [
    [timeV1, mfmV1],
    [timeV2, mfmV2],
    [timeV3, mfmV3],
    [timeV4, mfmV4],
    [timeV5, mfmV5],
  ];

  const hasParticipants = set<MFMAssessmentEvent | KaplanMeierObservation>();
  for (let v = 0; v < visits.length; v++) {
    const [time, mfm] = visits[v];
    const eventUri = `${baseUri}#assessment-${id}-v${v + 1}`;
    const resultUri = `${baseUri}#result-${id}-v${v + 1}`;

    const timeMag: TimeFromBaselineMagnitude = {
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': 'AspectDurationSinceStudyEnrollment' },
      hasUnitOfMeasure: { '@id': 'UnitYear' },
      numericValue: Number.isNaN(time) ? 0 : time,
    };

    const mfmMag: MFMScoreMagnitude = {
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': 'AspectMFM32VisitScore' },
      numericValue: Number.isNaN(mfm) ? 0 : mfm,
    };

    const result: AssessmentResult = {
      '@id': resultUri,
      type: set({ '@id': 'Content' }),
      isAbout: { '@id': 'ConceptMotorFunction' },
      hasMagnitude: mfmMag,
    };

    const event: MFMAssessmentEvent = {
      '@id': eventUri,
      type: set({ '@id': 'Determination' }),
      isCategorizedBy: { '@id': 'AssessmentTypeMFM32' },
      hasMagnitude: timeMag,
      hasParticipant: { '@id': personUri } as Person,
      produces: result,
    };
    hasParticipants.add(event);
  }

  const kmObservation: KaplanMeierObservation = {
    '@id': `${baseUri}#km-observation-${id}`,
    type: set({ '@id': 'Determination' }),
    isCategorizedBy: { '@id': 'AssessmentTypeKaplanMeier' },
    hasParticipant: { '@id': personUri } as Person,
    hasMagnitude: set<KaplanMeierEventMagnitude | KaplanMeierTimeMagnitude>(
      {
        '@id': `${baseUri}#km-event-${id}`,
        type: set({ '@id': 'Magnitude' }),
        hasAspect: { '@id': 'AspectKaplanMeierEventIndicator' },
        numericValue: kmEvent,
      } as KaplanMeierEventMagnitude,
      {
        '@id': `${baseUri}#km-time-${id}`,
        type: set({ '@id': 'Magnitude' }),
        hasAspect: { '@id': 'AspectKaplanMeierTimeToEvent' },
        hasUnitOfMeasure: { '@id': 'UnitYear' },
        numericValue: kmTime,
      } as KaplanMeierTimeMagnitude,
    ),
  };
  hasParticipants.add(kmObservation);

  const person: Omit<Person, '@context'> = {
    '@id': personUri,
    type: set({ '@id': 'Person' }),
    isIdentifiedBy: {
      '@id': idUri,
      type: set({ '@id': 'ID' }),
      uniqueText: id,
    } as ID,
    isCategorizedBy: categories,
    hasMagnitude: magnitudes,
    hasParticipant: hasParticipants,
  };

  return person;
}

export const NemalineCsvResourceCreator: ResourceCreatorConfig = {
  name: 'nemalineCsv',
  displayName: 'Nemaline CSV Upload',
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
      title: 'Upload Nemaline CSV',
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

    const dataRows = rows.slice(1).filter((row) => row.some((c) => c.trim()));

    createUtils.loadingMessage(`Converting ${dataRows.length} rows to RDF…`);

    const baseName = basename(file.name).replace(/\.csv$/i, '');
    const slug = `${baseName}.ttl` as SolidLeafSlug;
    const statisticAccessRuleSlug = `${baseName}.statistic-access-rule.ttl` as SolidLeafSlug;
    const baseUri = `${container.uri}${slug}`;

    if (dataRows.length === 0) {
      createUtils.toast('No valid data rows to convert.', { title: 'Error' });
      return;
    }

    createUtils.loadingMessage(`Creating ${slug}…`);
    const createResult = await container.createChildAndOverwrite(slug);
    if (createResult.isError) {
      createUtils.toast(createResult.message, { title: 'Error' });
      return;
    }
    const childResource = createResult.resource;

    const dataset = (container as ContainerWithContext).context.dataset;
    const transaction = dataset.startTransaction();

    for (const row of dataRows) {
      const personData = rowToPerson(row, baseUri);
      transaction
        .usingType(PersonShapeType)
        .write(childResource.uri)
        .fromJson(personData as Person);
    }

    createUtils.loadingMessage(`Writing content to ${slug}…`);
    const commitResult = await (
      transaction as ConnectedLdoTransactionDataset<SolidConnectedPlugin[]>
    ).commitToRemote();

    if (commitResult.isError) {
      createUtils.toast(commitResult.message, { title: 'Error' });
    } else {
      createUtils.loadingMessage(`Initializing ${statisticAccessRuleSlug}…`);
      const statisticAccessRuleResource = container.child(statisticAccessRuleSlug);
      const initialStatisticAccessRuleContent = [
        '@prefix sar: <https://fedresda.setmeld.com/statistic-access-rule#> .',
        '',
        '<#policy> a sar:StatisticAccessRule ;',
        '  sar:dataSchema "nemaline" .',
        '',
      ].join('\n');
      const uploadResult = await statisticAccessRuleResource.uploadAndOverwrite(
        new Blob([initialStatisticAccessRuleContent], { type: 'text/turtle' }),
        'text/turtle',
      );
      if (uploadResult.isError) {
        createUtils.toast(
          `${slug} created (${dataRows.length} persons), but failed to initialize ${statisticAccessRuleSlug}: ${
            uploadResult.message
          }`,
          { title: 'Error' },
        );
        return;
      }

      createUtils.toast(
        `${slug} created (${dataRows.length} persons) with ${statisticAccessRuleSlug}.`,
      );
    }
  },
};
