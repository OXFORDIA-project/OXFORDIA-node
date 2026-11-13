import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, LoadingBar, useTargetResource, useViewContext } from 'linked-data-browser';
import { useResource, useMatchSubject, useSolidAuth } from '@ldo/solid-react';
import { PersonShapeType, type Person } from '@oxfordia/data-plugin-nemaline_core';
import { ParticipantTable } from './ParticipantTable';
import { ldArr, toParticipantRow, type ParticipantRow } from './participantRows';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';

async function findStatisticAccessRuleUri(authFetch: typeof fetch, dataUri: string): Promise<string> {
  const base = dataUri.replace(/\.ttl$/i, '');
  for (const uri of [
    `${base}.statistic-access-rule.ttl`,
    `${base}.statistic-access-rule.jsonld`,
    `${base}.statistic-access-rule.json`,
  ]) {
    if ((await authFetch(uri, { method: 'GET' })).ok) return uri;
  }
  return `${base}.statistic-access-rule.jsonld`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NemalineView() {
  const { targetUri } = useViewContext();
  const { navigateTo } = useTargetResource();
  const { fetch } = useSolidAuth();
  const resource = useResource(targetUri);
  const persons = useMatchSubject(PersonShapeType, RDF_TYPE, GIST_PERSON, targetUri);

  const rows = useMemo<ParticipantRow[]>(
    () => ldArr(persons).map((p, i) => toParticipantRow(p as Person, i)),
    [persons],
  );

  const isLoading = resource?.isLoading?.() ?? resource?.status?.type === 'unfetched';

  if (!targetUri || !resource) return null;
  if (resource.type === 'InvalidIdentifierResource') {
    return <View style={styles.container}><Text>Invalid resource.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <LoadingBar isLoading={!!isLoading} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="h1" style={styles.title}>Nemaline Myopathy Pilot Participants</Text>
        <Text size="sm" muted style={styles.subtitle}>
          {rows.length} participant{rows.length === 1 ? '' : 's'} · baseline visit
        </Text>
        <View style={styles.actionsRow}>
          <Button
            text="Edit Statistic Access Rule"
            variant="secondary"
            onPress={async () => navigateTo(await findStatisticAccessRuleUri(fetch, targetUri))}
          />
        </View>
        <ParticipantTable rows={rows} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 20 },
  actionsRow: { marginBottom: 16, alignSelf: 'flex-start' },
});
