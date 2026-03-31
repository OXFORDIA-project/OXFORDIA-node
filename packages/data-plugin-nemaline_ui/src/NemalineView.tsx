import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  LoadingBar,
  useViewContext,
} from 'linked-data-browser';
import { useResource, useMatchSubject } from '@ldo/solid-react';
import { getDataset } from '@ldo/ldo';
import { namedNode } from '@ldo/rdf-utils';
import { PersonShapeType } from '@oxfordia/data-plugin-nemaline_core';
import type { Person } from '@oxfordia/data-plugin-nemaline_core';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';
const HAS_MAGNITUDE = 'https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude';
const HAS_ASPECT = 'https://w3id.org/semanticarts/ns/ontology/gist/hasAspect';
const NUMERIC_VALUE = 'https://w3id.org/semanticarts/ns/ontology/gist/numericValue';

/** Get the aspect @id from a magnitude (hasAspect can be a single object or an LdSet). */
function getAspectId(m: unknown): string | undefined {
  const hasAspect = (m as { hasAspect?: { '@id'?: string } | { toArray?: () => Array<{ '@id'?: string }> } }).hasAspect;
  if (hasAspect == null) return undefined;
  const first = typeof (hasAspect as { toArray?: () => unknown[] }).toArray === 'function'
    ? (hasAspect as { toArray: () => Array<{ '@id'?: string }> }).toArray()?.[0]
    : (hasAspect as { '@id'?: string });
  return (first as { '@id'?: string })?.['@id'];
}

/** Extract a magnitude value by aspect from Person.hasMagnitude. */
function getMagnitude(
  person: Person,
  aspectMatch: (aspect: string) => boolean,
): number | undefined {
  const mags = person.hasMagnitude;
  if (!mags) return undefined;
  const raw = mags.toArray?.() ?? mags;
  const arr = Array.isArray(raw) ? raw : [mags];
  for (const m of arr) {
    const aspect = getAspectId(m);
    if (aspect && aspectMatch(aspect)) {
      const v = (m as { numericValue?: number })?.numericValue;
      return typeof v === 'number' ? v : undefined;
    }
  }
  return undefined;
}

/** Get category IDs from Person.isCategorizedBy. */
function getCategories(person: Person): string[] {
  const cats = person.isCategorizedBy;
  if (!cats) return [];
  const raw = cats.toArray?.() ?? cats;
  const arr = Array.isArray(raw) ? raw : [cats];
  return arr
    .map((c) => (c as { '@id'?: string })?.['@id'])
    .filter((id): id is string => typeof id === 'string');
}

/** Human-readable label for category/aspect IDs. */
function labelFromId(id: string): string {
  const last = (id.split('/').pop() ?? id).replace(/_/g, ' ');
  if (/^Status\s+Non\s*Ambulant$/i.test(last) || /StatusNonAmbulant/i.test(id)) return 'Non Ambulant';
  if (/^Status\s+Ambulant$/i.test(last) || /StatusAmbulant/i.test(id)) return 'Ambulant';
  const variantMatch = last.match(/Genetic\s*Group\s*Variant\s*(\d)|Variant\s*(\d)|^Variant(\d)$/i) || id.match(/Variant\s*(\d)|Variant(\d)/i);
  if (variantMatch) return `Variant ${variantMatch[1] ?? variantMatch[2] ?? variantMatch[3] ?? ''}`;
  return last.replace(/([a-z])([A-Z])/g, '$1 $2');
}

/** Match cluster category (compact Cluster1/2/3 or full IRI Cluster_1/2/3 or C1/2/3). */
function isClusterId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /^Cluster[123]$|^Cluster_[123]$|^C[123]$/.test(last);
}

/** Match genetic group category. */
function isGeneticId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /GeneticGroup|Variant[123]|variant[123]/.test(last);
}

/** Match ambulation status. */
function isAmbulationId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /Ambulant|Non.*Ambulant/.test(last);
}

/** Match dominant hand. */
function isDominantHandId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /^LeftHanded$|^RightHanded$|Left|Right/.test(last);
}

/** Match baseline age magnitude aspect (AspectAge or .../Aspect_Age, excluding LoA). */
function isBaselineAgeAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return (last === 'AspectAge' || last.endsWith('Aspect_Age')) && !last.includes('AgeAtLossOfAmbulation') && !last.includes('LossOfAmbulation');
}

/** Match LoA age magnitude aspect. */
function isLoAAgeAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return last.includes('AgeAtLossOfAmbulation') || last.includes('LossOfAmbulation');
}

/** Match total MFM aggregate magnitude aspect. */
function isTotalMFMAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return last.includes('AggregateScore') || last.includes('MFM32_Aggregate');
}

/** Read all magnitudes for a person from the raw graph (fallback when LDO returns only one). */
function getMagnitudesFromGraph(
  dataset: { match: (s: unknown, p: unknown, o: unknown, g?: unknown) => { toArray?: () => unknown[] } },
  personUri: string | undefined,
): Array<{ aspect: string; numericValue: number }> {
  if (!personUri) return [];
  const personNode = namedNode(personUri);
  const hasMagNode = namedNode(HAS_MAGNITUDE);
  const hasAspectNode = namedNode(HAS_ASPECT);
  const numericValueNode = namedNode(NUMERIC_VALUE);
  const magQuads = dataset.match(personNode, hasMagNode, null);
  const toArray = (m: { toArray?: () => unknown[] }) => (m && typeof m.toArray === 'function' ? m.toArray() : []);
  const quads = toArray(magQuads as { toArray?: () => unknown[] });
  const out: Array<{ aspect: string; numericValue: number }> = [];
  for (const q of quads as Array<{ object?: { value?: string } }>) {
    const magNode = q?.object;
    if (!magNode) continue;
    const aspectQuads = dataset.match(magNode, hasAspectNode, null);
    const aArr = toArray(aspectQuads as { toArray?: () => unknown[] });
    const aspectQuad = (aArr as Array<{ object?: { value?: string } }>)[0];
    const aspect = aspectQuad?.object?.value ?? '';
    const valQuads = dataset.match(magNode, numericValueNode, null);
    const vArr = toArray(valQuads as { toArray?: () => unknown[] });
    const valQuad = (vArr as Array<{ object?: { value?: string } }>)[0];
    const numStr = valQuad?.object?.value;
    const numericValue = numStr != null ? Number(numStr) : NaN;
    if (aspect && !Number.isNaN(numericValue)) out.push({ aspect, numericValue });
  }
  return out;
}

/** Normalize Person.hasParticipant to an array of MFMAssessmentEvent (handles LdSet or single object). */
function getAssessmentEvents(person: Person): Array<{ timeFromBaseline: number; mfmScore: number }> {
  const part = person.hasParticipant;
  if (!part) return [];
  const raw = part.toArray?.() ?? part;
  const events = Array.isArray(raw) ? raw : [raw];
  return events
    .filter((e) => e && typeof (e as { hasMagnitude?: unknown }).hasMagnitude !== 'undefined' && typeof (e as { produces?: { hasMagnitude?: { numericValue?: number } } }).produces?.hasMagnitude !== 'undefined')
    .map((e) => {
      const ev = e as { hasMagnitude?: { numericValue?: number }; produces?: { hasMagnitude?: { numericValue?: number } } };
      const time = ev.hasMagnitude?.numericValue;
      const score = ev.produces?.hasMagnitude?.numericValue;
      return {
        timeFromBaseline: typeof time === 'number' ? time : 0,
        mfmScore: typeof score === 'number' ? score : 0,
      };
    })
    .sort((a, b) => a.timeFromBaseline - b.timeFromBaseline);
}

type Align = 'left' | 'right' | 'center';

/** Column definitions: widths chosen so header labels stay on one line; alignment matches data. */
const COLUMNS: ReadonlyArray<{
  key: string;
  label: string;
  width: number;
  align: Align;
}> = [
  { key: 'id', label: 'ID', width: 52, align: 'right' },
  { key: 'cluster', label: 'Cluster', width: 72, align: 'left' },
  { key: 'genetic', label: 'Genetic group', width: 112, align: 'left' },
  { key: 'baselineAge', label: 'Baseline age', width: 104, align: 'right' },
  { key: 'ambulation', label: 'Ambulation', width: 104, align: 'left' },
  { key: 'loaAge', label: 'LoA age', width: 80, align: 'right' },
  { key: 'dominantHand', label: 'Dominant hand', width: 112, align: 'left' },
  { key: 'totalMfm', label: 'Total MFM', width: 88, align: 'right' },
  { key: 'belowAvg', label: 'Below avg.', width: 92, align: 'center' },
];

const cellStyle = (width: number, align: Align): { minWidth: number; width: number; alignItems: 'flex-start' | 'flex-end' | 'center'; justifyContent: 'flex-start' | 'flex-end' | 'center' } => ({
  minWidth: width,
  width,
  alignItems: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
  justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
});

export function NemalineView() {
  const { targetUri } = useViewContext();
  const resource = useResource(targetUri);
  const persons = useMatchSubject(
    PersonShapeType,
    RDF_TYPE,
    GIST_PERSON,
  );

  const sortedPersons = useMemo(() => {
    const arr = persons?.toArray?.() ?? (persons ? [...persons] : []);
    return (arr as Person[]).sort((a, b) => {
      const idA = a.isIdentifiedBy?.uniqueText ?? '';
      const idB = b.isIdentifiedBy?.uniqueText ?? '';
      return Number(idA) - Number(idB) || String(idA).localeCompare(String(idB));
    });
  }, [persons]);

  const graphDataset = useMemo(() => {
    if (sortedPersons.length === 0) return null;
    try {
      const ds = getDataset(sortedPersons[0] as Parameters<typeof getDataset>[0]);
      return ds as Parameters<typeof getMagnitudesFromGraph>[0];
    } catch {
      return null;
    }
  }, [sortedPersons]);

  const isLoading = resource?.isLoading?.() ?? resource?.status?.type === 'unfetched';

  if (!targetUri || !resource) {
    return null;
  }

  if (resource.type === 'InvalidIdentifierResource') {
    return (
      <View style={styles.container}>
        <Text>Invalid resource.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoadingBar isLoading={!!isLoading} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="h1" style={styles.title}>
          Not supported on mobile
        </Text>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 24,
  },
  tableWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    backgroundColor: 'hsl(var(--card))',
    alignSelf: 'flex-start',
  },
  table: {
    width: '100%',
    flex: 0,
    flexGrow: 0,
  },
  tableHeader: {
    backgroundColor: 'hsl(var(--muted))',
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  headerRow: {
    borderBottomWidth: 0,
  },
  tableHead: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  tableBody: {
    borderBottomWidth: 0,
    flex: 0,
    flexGrow: 0,
  },
  headerLabel: {
    fontWeight: '600',
  },
  bodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  bodyRowStriped: {
    backgroundColor: 'hsl(var(--muted) / 0.35)',
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cellText: {
    fontSize: 13,
  },
  badge: {
    alignSelf: 'center',
  },
  nestedRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
    backgroundColor: 'hsl(var(--muted) / 0.25)',
  },
  nestedCell: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingLeft: 28,
  },
  nestedWrapper: {
    marginTop: 2,
  },
  nestedTitle: {
    marginBottom: 8,
  },
  nestedTable: {
    width: '100%',
    maxWidth: 420,
  },
  nestedTableHeader: {
    backgroundColor: 'hsl(var(--muted))',
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  nestedTableHead: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  nestedBodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  nestedTableCell: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
