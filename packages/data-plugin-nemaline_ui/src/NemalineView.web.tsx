import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, LoadingBar, useTargetResource, useViewContext } from 'linked-data-browser';
import { useResource, useMatchSubject, useSolidAuth } from '@ldo/solid-react';
import { SimpleTable, type CellRendererProps } from '@simple-table/react';
import {
  PersonShapeType,
  MFMAssessmentEventShapeType,
  type Person,
  type KaplanMeierObservation,
  type MFMAssessmentEvent,
} from '@oxfordia/data-plugin-nemaline_core';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';
const GIST_DETERMINATION = 'https://w3id.org/semanticarts/ns/ontology/gist/Determination';

const CATEGORY_LABELS: Record<string, string> = {
  Cluster1: 'Cluster 1', Cluster2: 'Cluster 2', Cluster3: 'Cluster 3',
  GeneticGroupVariant1: 'Variant 1', GeneticGroupVariant2: 'Variant 2', GeneticGroupVariant3: 'Variant 3',
  StatusAmbulant: 'Ambulant', StatusNonAmbulant: 'Non Ambulant',
  LeftHanded: 'Left', RightHanded: 'Right',
};

// ─── data ─────────────────────────────────────────────────────────────────────

// LdSet<T> extends Set<T> in the type system but the runtime proxy does not
// reliably implement Symbol.iterator — use .toArray() via this helper.
type Inner<S> = S extends { toArray(): (infer T)[] } ? T : S;

function ldArr<S>(val: S | null | undefined): Inner<S>[] {
  if (val == null) return [];
  const asSet = val as { toArray?: () => Inner<S>[] };
  if (typeof asSet.toArray === 'function') return asSet.toArray();
  if (Array.isArray(val)) return val as unknown as Inner<S>[];
  return [val as unknown as Inner<S>];
}

interface AssessmentRow {
  visit: string;
  timeFromBaseline: string;
  mfmScore: string;
}

interface PersonRow {
  _id: string;
  _assessments: AssessmentRow[];
  id: string;
  cluster: string;
  genetic: string;
  baselineAge: string;
  ambulation: string;
  loaAge: string;
  dominantHand: string;
  totalMfm: string;
  kmEvent: string;
  kmTime: string;
  belowAvg: string;
}

function toPersonRow(person: Person, index: number, assessments: AssessmentRow[]): PersonRow {
  const cats = ldArr(person.isCategorizedBy);
  const cat = (pred: (id: string) => boolean): string => {
    const id = cats.find(c => pred(c['@id'] ?? ''))?.['@id'];
    return CATEGORY_LABELS[id ?? ''] ?? '–';
  };

  const mags = ldArr(person.hasMagnitude);
  const mag = (aspectId: string) =>
    mags.find(m => (m.hasAspect as { '@id'?: string } | undefined)?.['@id'] === aspectId)?.numericValue;

  const participants = ldArr(person.hasParticipant);
  const kmObs = participants.find(
    p => p.isCategorizedBy?.['@id'] === 'AssessmentTypeKaplanMeier',
  ) as KaplanMeierObservation | undefined;
  const kmMags = ldArr(kmObs?.hasMagnitude);

  const baselineAge = mag('AspectAge');
  const loaAge = mag('AspectAgeAtLossOfAmbulation');
  const totalMfm = mag('AspectMFM32AggregateScore');
  const kmEvent = kmMags.find(m => m.hasAspect?.['@id'] === 'AspectKaplanMeierEventIndicator')?.numericValue;
  const kmTime = kmMags.find(m => m.hasAspect?.['@id'] === 'AspectKaplanMeierTimeToEvent')?.numericValue;

  return {
    _id: person['@id'] ?? String(index),
    _assessments: assessments,
    id: person.isIdentifiedBy?.uniqueText ?? '–',
    cluster: cat(id => id.startsWith('Cluster')),
    genetic: cat(id => id.startsWith('GeneticGroup')),
    ambulation: cat(id => id === 'StatusAmbulant' || id === 'StatusNonAmbulant'),
    dominantHand: cat(id => id === 'LeftHanded' || id === 'RightHanded'),
    baselineAge: baselineAge != null ? baselineAge.toFixed(2) : '–',
    loaAge: loaAge != null ? loaAge.toFixed(2) : '–',
    totalMfm: totalMfm != null ? String(totalMfm) : '–',
    kmEvent: kmEvent != null ? String(Math.round(kmEvent)) : '–',
    kmTime: kmTime != null ? kmTime.toFixed(2) : '–',
    belowAvg: cats.some(c => c['@id'] === 'PerformanceBelowAverage') ? 'below' : '–',
  };
}

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

// ─── view ─────────────────────────────────────────────────────────────────────

// simple-table reads row['_assessments'] as sub-rows when rowGrouping includes
// '_assessments' — the column's nestedTable config defines the sub-table headers.
const HEADERS = [
  {
    accessor: '_assessments',
    label: 'Visits',
    width: 70,
    expandable: true,
    cellRenderer: ({ row }: CellRendererProps) => {
      const count = ((row as unknown as PersonRow)._assessments ?? []).length;
      return count > 0 ? count : '–';
    },
    nestedTable: {
      defaultHeaders: [
        { accessor: 'visit',            label: 'Visit',                   width: 60  },
        { accessor: 'timeFromBaseline', label: 'Time from baseline (yr)', width: 200 },
        { accessor: 'mfmScore',         label: 'MFM score',               width: 100 },
      ],
    },
  },
  { accessor: 'id',           label: 'ID',            width: 70  },
  { accessor: 'cluster',      label: 'Cluster',       width: 100 },
  { accessor: 'genetic',      label: 'Genetic group', width: 120 },
  { accessor: 'baselineAge',  label: 'Baseline age',  width: 120 },
  { accessor: 'ambulation',   label: 'Ambulation',    width: 120 },
  { accessor: 'loaAge',       label: 'LoA age',       width: 100 },
  { accessor: 'dominantHand', label: 'Dominant hand', width: 120 },
  { accessor: 'totalMfm',     label: 'Total MFM',     width: 100 },
  { accessor: 'kmEvent',      label: 'KM event',      width: 90  },
  { accessor: 'kmTime',       label: 'KM time (yr)',  width: 110 },
  { accessor: 'belowAvg',     label: 'Below avg.',    width: 100 },
];

export function NemalineView() {
  const { targetUri } = useViewContext();
  const { navigateTo } = useTargetResource();
  const { fetch } = useSolidAuth();
  const resource = useResource(targetUri);
  const persons = useMatchSubject(PersonShapeType, RDF_TYPE, GIST_PERSON, targetUri);
  const mfmEvents = useMatchSubject(MFMAssessmentEventShapeType, RDF_TYPE, GIST_DETERMINATION, targetUri);

  const assessmentsByPerson = useMemo<Map<string, AssessmentRow[]>>(() => {
    type EventEntry = { time: number; score: number | undefined };
    const groups = new Map<string, EventEntry[]>();
    ldArr(mfmEvents).forEach(e => {
      const event = e as MFMAssessmentEvent;
      const personId = event.hasParticipant?.['@id'];
      if (!personId) return;
      const time = event.hasMagnitude?.numericValue ?? 0;
      const score = event.produces?.hasMagnitude?.numericValue;
      const bucket = groups.get(personId) ?? [];
      bucket.push({ time, score });
      groups.set(personId, bucket);
    });
    const result = new Map<string, AssessmentRow[]>();
    groups.forEach((events, personId) => {
      result.set(personId, events
        .sort((a, b) => a.time - b.time)
        .map((ev, i) => ({
          visit: `V${i + 1}`,
          timeFromBaseline: ev.time.toFixed(3),
          mfmScore: ev.score != null ? String(ev.score) : '–',
        })));
    });
    return result;
  }, [mfmEvents]);

  const rows = useMemo<PersonRow[]>(() => {
    return ldArr(persons)
      .sort((a, b) => {
        const idA = (a as Person).isIdentifiedBy?.uniqueText ?? '';
        const idB = (b as Person).isIdentifiedBy?.uniqueText ?? '';
        return Number(idA) - Number(idB) || idA.localeCompare(idB);
      })
      .map((p, i) => toPersonRow(
        p as Person,
        i,
        assessmentsByPerson.get((p as Person)['@id'] ?? '') ?? [],
      ));
  }, [persons, assessmentsByPerson]);

  const isLoading = resource?.isLoading?.() ?? resource?.status?.type === 'unfetched';

  if (!targetUri || !resource) return null;
  if (resource.type === 'InvalidIdentifierResource') {
    return <View style={styles.container}><Text>Invalid resource.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <LoadingBar isLoading={!!isLoading} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="h1" style={styles.title}>Nemaline Myopathy Assessments</Text>
        <Text style={styles.subtitle}>{rows.length} participant{rows.length === 1 ? '' : 's'}</Text>
        <View style={styles.actionsRow}>
          <Button
            text="Edit Statistic Access Rule"
            variant="secondary"
            onPress={async () => navigateTo(await findStatisticAccessRuleUri(fetch, targetUri))}
          />
        </View>
        <SimpleTable
          defaultHeaders={HEADERS}
          rows={rows}
          rowGrouping={['_assessments']}
          animations={{ enabled: false }}
          getRowId={({ row }) => (row as unknown as PersonRow)._id}
        />
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
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 20, color: 'hsl(var(--muted-foreground))', fontSize: 14 },
  actionsRow: { marginBottom: 16, alignSelf: 'flex-start' },
});
