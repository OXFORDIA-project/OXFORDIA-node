import { set } from '@ldo/ldo';
import { SolidContainer, SolidLeafSlug } from '@ldo/connected-solid';
import type { SolidConnectedPlugin } from '@ldo/connected-solid';
import type {
  IConnectedLdoDataset,
  ConnectedLdoTransactionDataset,
} from '@ldo/connected';
import { Stethoscope } from 'lucide-react-native';
import { ResourceCreatorConfig } from 'linked-data-browser';
import { PersonShapeType } from '@oxfordia/data-plugin-angelman_core';
import type { Person, ID, BaselineAgeMagnitude } from '@oxfordia/data-plugin-angelman_core';
import {
  createAngelmanDefaultStatisticAccessRuleDocument,
  angelmanDefaultStatisticAccessRuleDocumentShapeType,
} from './defaultStatisticAccessRule';

type ContainerWithContext = SolidContainer & {
  context: { dataset: IConnectedLdoDataset<SolidConnectedPlugin[]> };
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

/**
 * CSV columns: record_id, gender, dominant_hand, baseline_age
 *
 * gender: 1=Male, 2=Female, 3=Other
 * dominant_hand: 1=Left, 2=Right, 3=Mixed, 4=Unknown
 */
function rowToPerson(row: string[], baseUri: string): Omit<Person, '@context'> {
  const id = row[0]?.trim() ?? '';
  const genderCode = row[1]?.trim() ?? '';
  const handCode = row[2]?.trim() ?? '';
  const baselineAge = parseNum(row[3]);

  const personUri = `${baseUri}#person-${id}`;
  const idUri = `${baseUri}#id-${id}`;

  const categories = set<
    | { '@id': 'GenderMale' }
    | { '@id': 'GenderFemale' }
    | { '@id': 'GenderOther' }
    | { '@id': 'DominantHandLeft' }
    | { '@id': 'DominantHandRight' }
    | { '@id': 'DominantHandMixed' }
    | { '@id': 'DominantHandUnknown' }
  >();

  if (genderCode === '1' || genderCode.toLowerCase() === 'male') categories.add({ '@id': 'GenderMale' });
  else if (genderCode === '2' || genderCode.toLowerCase() === 'female') categories.add({ '@id': 'GenderFemale' });
  else if (genderCode === '3' || genderCode.toLowerCase() === 'other') categories.add({ '@id': 'GenderOther' });

  if (handCode === '1' || handCode.toLowerCase() === 'left') categories.add({ '@id': 'DominantHandLeft' });
  else if (handCode === '2' || handCode.toLowerCase() === 'right') categories.add({ '@id': 'DominantHandRight' });
  else if (handCode === '3' || handCode.toLowerCase() === 'mixed') categories.add({ '@id': 'DominantHandMixed' });
  else if (handCode === '4' || handCode.toLowerCase() === 'unknown') categories.add({ '@id': 'DominantHandUnknown' });

  let ageAtScreening: BaselineAgeMagnitude | undefined;
  if (!Number.isNaN(baselineAge)) {
    ageAtScreening = {
      '@id': `${baseUri}#baseline-age-${id}`,
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': 'AspectAge' },
      hasUnitOfMeasure: { '@id': 'UnitYear' },
      'Age(years,1D.p.)': baselineAge,
    } as BaselineAgeMagnitude;
  }

  const person: Omit<Person, '@context'> = {
    '@id': personUri,
    type: set({ '@id': 'Person' }),
    RecordID: {
      '@id': idUri,
      type: set({ '@id': 'ID' }),
      IDString: id,
    } as ID,
    isCategorizedBy: categories,
    ...(ageAtScreening ? { AgeAtScreening: ageAtScreening } : {}),
  };

  return person;
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
      const statisticAccessRuleResource = container.child(statisticAccessRuleSlug);
      let defaultStatisticAccessRule;
      try {
        defaultStatisticAccessRule = createAngelmanDefaultStatisticAccessRuleDocument(
          statisticAccessRuleResource.uri,
        );
      } catch (error) {
        createUtils.toast(
          `${slug} created (${dataRows.length} persons), but failed to build the default statistic access rule: ${
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
          `${slug} created (${dataRows.length} persons), but failed to initialize ${statisticAccessRuleSlug}: ${
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
          `${slug} created (${dataRows.length} persons), but failed to initialize ${statisticAccessRuleSlug}: ${
            statisticAccessRuleCommitResult.message
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
