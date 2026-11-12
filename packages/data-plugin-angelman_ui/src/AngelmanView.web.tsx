import { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, LoadingBar, useViewContext } from 'linked-data-browser';
import { useResource, useMatchSubject } from '@ldo/solid-react';
import { SimpleTable, type CellRendererProps } from '@simple-table/react';
import {
  PersonShapeType,
  StudyVisitShapeType,
  PedsQLFIMYoungResultShapeType,
  PedsQLFIM7PlusResultShapeType,
  PedsQLAdultResultShapeType,
  type Person,
  type StudyVisit,
  type PedsQLFIMYoungResult,
  type PedsQLFIM7PlusResult,
  type PedsQLAdultResult,
} from '@oxfordia/data-plugin-angelman_core';

const RDF_TYPE        = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON     = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';
const GIST_DETERMINATION = 'https://w3id.org/semanticarts/ns/ontology/gist/Determination';
// Query each instrument result type directly via gist:isAbout to avoid the
// missing @isCollection on "PedsQLFIM—YoungChild(1Month)" in the generated
// Determination context, which causes LDO to return only one result per visit.
const GIST_ISABOUT    = 'https://w3id.org/semanticarts/ns/ontology/gist/isAbout';
const IRI_FIM_YOUNG   = 'https://paediatrics.ox.ac.uk/angelman/terms/Concept_FIM_YoungChild';
const IRI_FIM_7       = 'https://paediatrics.ox.ac.uk/angelman/terms/Concept_FIM_7Plus';
const IRI_ADULT_QOL   = 'https://paediatrics.ox.ac.uk/angelman/terms/Concept_AdultQoL';

// ─── ID helpers ───────────────────────────────────────────────────────────────

// LDO may return either the compact term ("GenderMale") or the full IRI suffix
// ("Gender_Male"). Strip the path prefix and underscores so both resolve to the
// same map key.
function normalizeId(id: string | undefined): string {
  if (!id) return '';
  const suffix = id.split('/').pop() ?? id;
  return suffix.replace(/_/g, '');
}

// Extract the "personId-visitKey" suffix after a known URI fragment prefix.
// e.g. visitSuffix("#visit-OX-AS-001-visit3", "visit-")      → "OX-AS-001-visit3"
//      visitSuffix("#fim-young-result-OX-AS-001-visit3", "fim-young-result-") → same
function visitSuffix(uri: string | undefined, fragmentPrefix: string): string | undefined {
  if (!uri) return undefined;
  const frag = uri.split('#')[1] ?? '';
  return frag.startsWith(fragmentPrefix) ? frag.slice(fragmentPrefix.length) : undefined;
}

// ─── Label maps ───────────────────────────────────────────────────────────────

const VISIT_LABELS: Record<string, string> = {
  VisitTypeBaseline: 'Baseline',
  VisitTypeVisit2:   'Visit 2',
  VisitTypeVisit3:   'Visit 3',
  VisitTypeVisit4:   'Visit 4',
  VisitTypeVisit5:   'Visit 5',
  VisitTypeVisit6:   'Visit 6',
};

const AGE_BAND_LABELS: Record<string, string> = {
  AgeBand2to4:   '2–4 yr',
  AgeBand5to7:   '5–7 yr',
  AgeBand8to12:  '8–12 yr',
  AgeBand13to17: '13–17 yr',
  AgeBand18to25: '18–25 yr',
  AgeBand26Plus: '26+ yr',
};

const GENDER_LABELS: Record<string, string> = {
  GenderMale:   'Male',
  GenderFemale: 'Female',
  GenderOther:  'Other',
};

const HAND_LABELS: Record<string, string> = {
  DominantHandRight:   'Right',
  DominantHandLeft:    'Left',
  DominantHandMixed:   'Mixed',
  DominantHandUnknown: 'Unknown',
};

// ─── LdSet helper ─────────────────────────────────────────────────────────────

type Inner<S> = S extends { toArray(): (infer T)[] } ? T : S;
type LdSet<T> = { toArray(): T[] };

function ldArr<S>(val: S | null | undefined): Inner<S>[] {
  if (val == null) return [];
  const asSet = val as { toArray?: () => Inner<S>[] };
  if (typeof asSet.toArray === 'function') return asSet.toArray();
  if (Array.isArray(val)) return val as unknown as Inner<S>[];
  return [val as unknown as Inner<S>];
}

// ─── Row types ────────────────────────────────────────────────────────────────

interface VisitRow {
  _key: string;
  visitType: string;
  ageAtVisit: string;
  fimYoung: string;
  fim7: string;
  pedsqlAdult: string;
}

interface PersonRow {
  _id: string;
  _visits: VisitRow[];
  id: string;
  gender: string;
  dominantHand: string;
  ageAtScreening: string;
}

// ─── Data transformers ────────────────────────────────────────────────────────

const VISIT_ORDER = ['Baseline', 'Visit 2', 'Visit 3', 'Visit 4', 'Visit 5', 'Visit 6'];

function toVisitRow(
  visit: StudyVisit,
  fimYoungByKey: Map<string, PedsQLFIMYoungResult>,
  fim7ByKey: Map<string, PedsQLFIM7PlusResult>,
  adultByKey: Map<string, PedsQLAdultResult>,
): VisitRow {
  // VisitType has @isCollection: true in context even though the TypeScript
  // union type models it as a single value — ldArr handles both.
  const visitTypeRaw = ldArr(visit.VisitType as unknown as LdSet<{ '@id'?: string }>)[0]?.['@id'];
  const visitType = VISIT_LABELS[normalizeId(visitTypeRaw)] ?? '–';

  const ageAtVisit = visit.AgeAtVisit?.['Age(years,1D.p.)'];

  // Look up precomputed result maps by the shared "personId-visitKey" URI suffix.
  const vKey = visitSuffix(visit['@id'], 'visit-');
  const fimYoung = vKey ? fimYoungByKey.get(vKey) : undefined;
  const fim7     = vKey ? fim7ByKey.get(vKey)     : undefined;
  const adult    = vKey ? adultByKey.get(vKey)    : undefined;

  // PhysicalFunctioningQ1 is the LdSet of all items on a result node.
  const fimYoungCount = ldArr(fimYoung?.PhysicalFunctioningQ1).length;
  const fim7Count     = ldArr(fim7?.PhysicalFunctioningQ1).length;
  const adultCount    = ldArr(adult?.PhysicalFunctioningQ1).length;

  // AgeBand has @isCollection: true in context, so ldArr is required even
  // though the TypeScript type models it as a single union value.
  const ageBandId = normalizeId(
    ldArr(adult?.AgeBand as unknown as LdSet<{ '@id'?: string }>)[0]?.['@id'],
  );
  const adultBand   = AGE_BAND_LABELS[ageBandId] ?? '';
  const pedsqlAdult = adult
    ? (adultBand
        ? `${adultBand} · ${adultCount > 0 ? adultCount : '–'}`
        : (adultCount > 0 ? String(adultCount) : '–'))
    : '–';

  return {
    _key:      visit['@id'] ?? visitType,
    visitType,
    ageAtVisit: ageAtVisit != null ? ageAtVisit.toFixed(2) : '–',
    fimYoung:   fimYoungCount > 0 ? String(fimYoungCount) : '–',
    fim7:       fim7Count     > 0 ? String(fim7Count)     : '–',
    pedsqlAdult,
  };
}

function toPersonRow(person: Person, index: number, visitRows: VisitRow[]): PersonRow {
  const cats = ldArr(person.isCategorizedBy);

  const findCat = (prefix: string) =>
    cats.find(c => normalizeId(c['@id']).startsWith(prefix))?.['@id'];

  const genderKey = normalizeId(findCat('Gender'));
  const handKey   = normalizeId(findCat('DominantHand'));

  // AgeAtScreening may be a collection or single value depending on the LDO
  // context resolution path — ldArr handles both.
  const screeningMag = ldArr(
    person.AgeAtScreening as unknown as LdSet<{ 'Age(years,1D.p.)'?: number }>,
  )[0] ?? (person.AgeAtScreening as { 'Age(years,1D.p.)'?: number } | undefined);
  const ageAtScreening = screeningMag?.['Age(years,1D.p.)'];

  const sortedVisits = [...visitRows].sort(
    (a, b) => VISIT_ORDER.indexOf(a.visitType) - VISIT_ORDER.indexOf(b.visitType),
  );

  return {
    _id:          person['@id'] ?? String(index),
    _visits:      sortedVisits,
    id:           person.RecordID?.IDString ?? '–',
    gender:       GENDER_LABELS[genderKey] ?? '–',
    dominantHand: HAND_LABELS[handKey] ?? '–',
    ageAtScreening: ageAtScreening != null ? ageAtScreening.toFixed(2) : '–',
  };
}

// ─── Table headers ────────────────────────────────────────────────────────────

const HEADERS = [
  {
    accessor: '_visits',
    label: 'Visits',
    width: 70,
    expandable: true,
    cellRenderer: ({ row }: CellRendererProps) => {
      const count = ((row as unknown as PersonRow)._visits ?? []).length;
      return count > 0 ? count : '–';
    },
    nestedTable: {
      defaultHeaders: [
        { accessor: 'visitType',   label: 'Visit',             width: 110 },
        { accessor: 'ageAtVisit',  label: 'Age at visit (yr)', width: 130 },
        { accessor: 'fimYoung',    label: 'FIM 1-mo (items)',  width: 130 },
        { accessor: 'fim7',        label: 'FIM 7-day (items)', width: 130 },
        { accessor: 'pedsqlAdult', label: 'PedsQL Adult',      width: 170 },
      ],
    },
  },
  { accessor: 'id',             label: 'Record ID',             width: 110 },
  { accessor: 'gender',         label: 'Gender',                width: 88  },
  { accessor: 'dominantHand',   label: 'Dominant hand',         width: 130 },
  { accessor: 'ageAtScreening', label: 'Age at screening (yr)', width: 170 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AngelmanView() {
  const { targetUri } = useViewContext();
  const resource = useResource(targetUri);

  // Persons and visits matched by rdf:type so each proxy has its full shape context.
  const persons = useMatchSubject(PersonShapeType, RDF_TYPE, GIST_PERSON, targetUri);
  const visits  = useMatchSubject(StudyVisitShapeType, RDF_TYPE, GIST_DETERMINATION, targetUri);

  // Query each instrument result type via gist:isAbout rather than traversing
  // visit→result, because "PedsQLFIM—YoungChild(1Month)" lacks @isCollection in
  // the generated context and would therefore only return one result per visit.
  const fimYoungAll = useMatchSubject(PedsQLFIMYoungResultShapeType, GIST_ISABOUT, IRI_FIM_YOUNG, targetUri);
  const fim7All     = useMatchSubject(PedsQLFIM7PlusResultShapeType,  GIST_ISABOUT, IRI_FIM_7,    targetUri);
  const adultAll    = useMatchSubject(PedsQLAdultResultShapeType,     GIST_ISABOUT, IRI_ADULT_QOL, targetUri);

  // Build maps from "personId-visitKey" suffix → result, matching the URI
  // naming convention in AngelmanCsvResourceCreator (e.g. #fim-young-result-OX-AS-001-visit3).
  const fimYoungByKey = useMemo<Map<string, PedsQLFIMYoungResult>>(() => {
    const map = new Map<string, PedsQLFIMYoungResult>();
    ldArr(fimYoungAll).forEach(r => {
      const key = visitSuffix((r as PedsQLFIMYoungResult)['@id'], 'fim-young-result-');
      if (key) map.set(key, r as PedsQLFIMYoungResult);
    });
    return map;
  }, [fimYoungAll]);

  const fim7ByKey = useMemo<Map<string, PedsQLFIM7PlusResult>>(() => {
    const map = new Map<string, PedsQLFIM7PlusResult>();
    ldArr(fim7All).forEach(r => {
      const key = visitSuffix((r as PedsQLFIM7PlusResult)['@id'], 'fim7-result-');
      if (key) map.set(key, r as PedsQLFIM7PlusResult);
    });
    return map;
  }, [fim7All]);

  const adultByKey = useMemo<Map<string, PedsQLAdultResult>>(() => {
    const map = new Map<string, PedsQLAdultResult>();
    ldArr(adultAll).forEach(r => {
      const key = visitSuffix((r as PedsQLAdultResult)['@id'], 'adult-result-');
      if (key) map.set(key, r as PedsQLAdultResult);
    });
    return map;
  }, [adultAll]);

  const visitsByPerson = useMemo<Map<string, VisitRow[]>>(() => {
    const map = new Map<string, VisitRow[]>();
    ldArr(visits).forEach(v => {
      const visit = v as StudyVisit;
      const personId = visit.Participant?.['@id'];
      if (!personId) return;
      const arr = map.get(personId) ?? [];
      arr.push(toVisitRow(visit, fimYoungByKey, fim7ByKey, adultByKey));
      map.set(personId, arr);
    });
    return map;
  }, [visits, fimYoungByKey, fim7ByKey, adultByKey]);

  const rows = useMemo<PersonRow[]>(() => {
    return ldArr(persons)
      .sort((a, b) => {
        const idA = (a as Person).RecordID?.IDString ?? '';
        const idB = (b as Person).RecordID?.IDString ?? '';
        return Number(idA) - Number(idB) || idA.localeCompare(idB);
      })
      .map((p, i) =>
        toPersonRow(
          p as Person,
          i,
          visitsByPerson.get((p as Person)['@id'] ?? '') ?? [],
        ),
      );
  }, [persons, visitsByPerson]);

  const isLoading = resource?.isLoading?.() ?? resource?.status?.type === 'unfetched';

  if (!targetUri || !resource) return null;
  if (resource.type === 'InvalidIdentifierResource') {
    return <View style={styles.container}><Text>Invalid resource.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <LoadingBar isLoading={!!isLoading} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="h1" style={styles.title}>Angelman Study Participants</Text>
        <Text style={styles.subtitle}>{rows.length} participant{rows.length === 1 ? '' : 's'}</Text>
        <SimpleTable
          defaultHeaders={HEADERS}
          rows={rows}
          rowGrouping={['_visits']}
          animations={{ enabled: false }}
          getRowId={({ row }) => (row as unknown as PersonRow)._id}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title:    { marginBottom: 4 },
  subtitle: { marginBottom: 20, color: 'hsl(var(--muted-foreground))', fontSize: 14 },
});
