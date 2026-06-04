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
  LoadingBar,
  useViewContext,
} from 'linked-data-browser';
import { useResource, useMatchSubject } from '@ldo/solid-react';
import { PersonShapeType } from '@oxfordia/data-plugin-angelman_core';
import type { Person } from '@oxfordia/data-plugin-angelman_core';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';

/** Extract category IDs from Person.isCategorizedBy. */
function getCategories(person: Person): string[] {
  const cats = person.isCategorizedBy;
  if (!cats) return [];
  const raw = cats.toArray?.() ?? cats;
  const arr = Array.isArray(raw) ? raw : [cats];
  return arr
    .map((c) => (c as { '@id'?: string })?.['@id'])
    .filter((id): id is string => typeof id === 'string');
}

/** Human-readable label from a category/aspect IRI terminal segment. */
function labelFromId(id: string): string {
  return (id.split('/').pop() ?? id)
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
}

function getGender(person: Person): string {
  const cats = getCategories(person);
  const g = cats.find((id) => {
    const last = id.split('/').pop() ?? id;
    return /^Gender/i.test(last);
  });
  if (!g) return '—';
  const last = g.split('/').pop() ?? g;
  if (/Male/i.test(last) && !/Fe/i.test(last)) return 'Male';
  if (/Female/i.test(last)) return 'Female';
  if (/Other/i.test(last)) return 'Other';
  return labelFromId(g);
}

function getDominantHand(person: Person): string {
  const cats = getCategories(person);
  const h = cats.find((id) => {
    const last = id.split('/').pop() ?? id;
    return /^DominantHand/i.test(last);
  });
  if (!h) return '—';
  const last = h.split('/').pop() ?? h;
  if (/Right/i.test(last)) return 'Right';
  if (/Left/i.test(last)) return 'Left';
  if (/Mixed/i.test(last)) return 'Mixed';
  if (/Unknown/i.test(last)) return 'Unknown';
  return labelFromId(h);
}

function getBaselineAge(person: Person): number | undefined {
  const mag = person.AgeAtScreening;
  if (!mag) return undefined;
  const v = (mag as { 'Age(years,1D.p.)'?: number })['Age(years,1D.p.)'];
  return typeof v === 'number' ? v : undefined;
}

function getVisitCount(person: Person): number {
  const visits = person.StudyVisits;
  if (!visits) return 0;
  if (typeof (visits as { size?: number }).size === 'number')
    return (visits as { size: number }).size;
  const raw = visits.toArray?.() ?? visits;
  return Array.isArray(raw) ? raw.length : 0;
}

type Align = 'left' | 'right' | 'center';

const COLUMNS: ReadonlyArray<{ key: string; label: string; width: number; align: Align }> = [
  { key: 'id', label: 'Record ID', width: 96, align: 'right' },
  { key: 'gender', label: 'Gender', width: 88, align: 'left' },
  { key: 'dominantHand', label: 'Dominant hand', width: 128, align: 'left' },
  { key: 'baselineAge', label: 'Age at screening', width: 136, align: 'right' },
  { key: 'visits', label: 'Visits', width: 72, align: 'right' },
];

const cellStyle = (
  width: number,
  align: Align,
): {
  minWidth: number;
  width: number;
  alignItems: 'flex-start' | 'flex-end' | 'center';
  justifyContent: 'flex-start' | 'flex-end' | 'center';
} => ({
  minWidth: width,
  width,
  alignItems: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
  justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
});

export function AngelmanView() {
  const { targetUri } = useViewContext();
  const resource = useResource(targetUri);
  const persons = useMatchSubject(PersonShapeType, RDF_TYPE, GIST_PERSON);

  const sortedPersons = useMemo(() => {
    const arr = persons?.toArray?.() ?? (persons ? [...persons] : []);
    return (arr as Person[]).sort((a, b) => {
      const idA = a.RecordID?.IDString ?? '';
      const idB = b.RecordID?.IDString ?? '';
      return Number(idA) - Number(idB) || String(idA).localeCompare(String(idB));
    });
  }, [persons]);

  const isLoading = resource?.isLoading?.() ?? resource?.status?.type === 'unfetched';

  if (!targetUri || !resource) return null;

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
          Angelman Study Participants
        </Text>
        <Text style={styles.subtitle}>
          {sortedPersons.length} participant{sortedPersons.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.tableWrapper}>
          <Table style={styles.table}>
            <TableHeader style={styles.tableHeader}>
              <TableRow style={styles.headerRow}>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    style={[styles.tableHead, cellStyle(col.width, col.align)]}
                  >
                    <Text style={styles.headerLabel}>{col.label}</Text>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody style={styles.tableBody}>
              {sortedPersons.map((person, idx) => {
                const id = person.RecordID?.IDString ?? '—';
                const baselineAge = getBaselineAge(person);
                const visitCount = getVisitCount(person);
                return (
                  <TableRow
                    key={person['@id'] ?? idx}
                    style={[
                      styles.bodyRow,
                      idx % 2 === 1 ? styles.bodyRowStriped : undefined,
                    ]}
                  >
                    <TableCell style={[styles.tableCell, cellStyle(COLUMNS[0].width, COLUMNS[0].align)]}>
                      <Text style={styles.cellText}>{id}</Text>
                    </TableCell>
                    <TableCell style={[styles.tableCell, cellStyle(COLUMNS[1].width, COLUMNS[1].align)]}>
                      <Text style={styles.cellText}>{getGender(person)}</Text>
                    </TableCell>
                    <TableCell style={[styles.tableCell, cellStyle(COLUMNS[2].width, COLUMNS[2].align)]}>
                      <Text style={styles.cellText}>{getDominantHand(person)}</Text>
                    </TableCell>
                    <TableCell style={[styles.tableCell, cellStyle(COLUMNS[3].width, COLUMNS[3].align)]}>
                      <Text style={styles.cellText}>
                        {baselineAge != null ? baselineAge.toFixed(1) : '—'}
                      </Text>
                    </TableCell>
                    <TableCell style={[styles.tableCell, cellStyle(COLUMNS[4].width, COLUMNS[4].align)]}>
                      <Text style={styles.cellText}>{visitCount}</Text>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 24,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 24 },
  tableWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    backgroundColor: 'hsl(var(--card))',
    alignSelf: 'flex-start',
  },
  table: { width: '100%', flex: 0, flexGrow: 0 },
  tableHeader: {
    backgroundColor: 'hsl(var(--muted))',
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  headerRow: { borderBottomWidth: 0 },
  tableHead: { paddingVertical: 14, paddingHorizontal: 14, height: 48 },
  tableBody: { borderBottomWidth: 0, flex: 0, flexGrow: 0 },
  headerLabel: { fontWeight: '600' },
  bodyRow: { borderBottomWidth: 1, borderBottomColor: 'hsl(var(--border))' },
  bodyRowStriped: { backgroundColor: 'hsl(var(--muted) / 0.35)' },
  tableCell: { paddingVertical: 12, paddingHorizontal: 14 },
  cellText: { fontSize: 13 },
});
