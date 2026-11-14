import { SolidContainer, SolidLeafSlug } from '@ldo/connected-solid';
import type { SolidConnectedPlugin } from '@ldo/connected-solid';
import type {
  IConnectedLdoDataset,
  ConnectedLdoTransactionDataset,
} from '@ldo/connected';
import { Stethoscope } from 'lucide-react-native';
import { ResourceCreatorConfig } from 'linked-data-browser';
import { PersonShapeType } from '@oxfordia/data-plugin-nemaline_core';
import {
  createNemalineDefaultStatisticAccessRuleDocument,
  nemalineDefaultStatisticAccessRuleDocumentShapeType,
} from './defaultStatisticAccessRule';
import { convertPilotCsv, PilotCsvFormatError, type PilotCsvConversion } from './nemalinePilotCsv';

type ContainerWithContext = SolidContainer & {
  context: { dataset: IConnectedLdoDataset<SolidConnectedPlugin[]> };
};

const MAX_WARNINGS_SHOWN = 5;

function basename(path: string): string {
  const lastSlash = path.lastIndexOf('/');
  return lastSlash === -1 ? path : path.slice(lastSlash + 1);
}

function summarizeWarnings(warnings: string[]): string {
  if (warnings.length === 0) return '';
  const shown = warnings.slice(0, MAX_WARNINGS_SHOWN).join('\n');
  const more = warnings.length - MAX_WARNINGS_SHOWN;
  return `\n${warnings.length} value(s) skipped:\n${shown}${more > 0 ? `\n…and ${more} more` : ''}`;
}

export const NemalineCsvResourceCreator: ResourceCreatorConfig = {
  name: 'nemalineCsv',
  displayName: 'Nemaline Pilot CSV Upload',
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
      title: 'Upload Nemaline Pilot CSV',
      accept: 'text/csv,.csv',
    });
    if (!file) return;

    const baseName = basename(file.name).replace(/\.csv$/i, '');
    const slug = `${baseName}.ttl` as SolidLeafSlug;
    const statisticAccessRuleSlug = `${baseName}.statistic-access-rule.ttl` as SolidLeafSlug;
    const baseUri = `${container.uri}${slug}`;

    createUtils.loadingMessage('Reading CSV…');
    let conversion: PilotCsvConversion;
    try {
      conversion = convertPilotCsv(await file.text(), baseUri);
    } catch (error) {
      if (!(error instanceof PilotCsvFormatError)) throw error;
      createUtils.toast(error.message, { title: 'Error' });
      return;
    }
    const { persons, warnings } = conversion;
    if (persons.length === 0) {
      createUtils.toast('No participant rows to convert.', { title: 'Error' });
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
    for (const person of persons) {
      transaction.usingType(PersonShapeType).write(childResource.uri).fromJson(person);
    }

    createUtils.loadingMessage(`Writing ${persons.length} participants to ${slug}…`);
    const commitResult = await (
      transaction as ConnectedLdoTransactionDataset<SolidConnectedPlugin[]>
    ).commitToRemote();
    if (commitResult.isError) {
      createUtils.toast(commitResult.message, { title: 'Error' });
      return;
    }

    const created = `${slug} created (${persons.length} participants)`;
    const statisticAccessRuleResource = container.child(statisticAccessRuleSlug);
    let defaultStatisticAccessRule;
    try {
      defaultStatisticAccessRule = createNemalineDefaultStatisticAccessRuleDocument(
        statisticAccessRuleResource.uri,
      );
    } catch (error) {
      createUtils.toast(
        `${created}, but failed to build the default statistic access rule: ${
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
        `${created}, but failed to initialize ${statisticAccessRuleSlug}: ${
          createStatisticAccessRuleResult.message
        }`,
        { title: 'Error' },
      );
      return;
    }

    const statisticAccessRuleTransaction = dataset.startTransaction();
    statisticAccessRuleTransaction
      .usingType(nemalineDefaultStatisticAccessRuleDocumentShapeType)
      .write(createStatisticAccessRuleResult.resource.uri)
      .fromJson(defaultStatisticAccessRule);

    const statisticAccessRuleCommitResult = await (
      statisticAccessRuleTransaction as ConnectedLdoTransactionDataset<SolidConnectedPlugin[]>
    ).commitToRemote();
    if (statisticAccessRuleCommitResult.isError) {
      createUtils.toast(
        `${created}, but failed to initialize ${statisticAccessRuleSlug}: ${
          statisticAccessRuleCommitResult.message
        }`,
        { title: 'Error' },
      );
      return;
    }

    createUtils.toast(
      `${created} with ${statisticAccessRuleSlug}.${summarizeWarnings(warnings)}`,
      warnings.length > 0 ? { title: 'Imported with warnings' } : undefined,
    );
  },
};
