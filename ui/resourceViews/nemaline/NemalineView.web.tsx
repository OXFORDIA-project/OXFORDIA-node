/**
 * Web-only implementation using a semantic HTML table for reliable layout and styling.
 */
import React, { useMemo, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import {
  Text,
  Badge,
  Button,
  LoadingBar,
  useTargetResource,
  useViewContext,
} from 'linked-data-browser';
import { useResource, useMatchSubject, useSolidAuth } from '@ldo/solid-react';
import { getDataset } from '@ldo/ldo';
import { namedNode } from '@ldo/rdf-utils';
import { ChevronDown, ChevronRight, ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { PersonShapeType } from '@oxfordia/types';
import type { Person } from '@oxfordia/types';
import { MeanQueryTester } from './MeanQueryTester';
import { KaplanMeierQueryTester } from './KaplanMeierQueryTester';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';
const HAS_MAGNITUDE = 'https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude';
const HAS_ASPECT = 'https://w3id.org/semanticarts/ns/ontology/gist/hasAspect';
const NUMERIC_VALUE = 'https://w3id.org/semanticarts/ns/ontology/gist/numericValue';
const HAS_PARTICIPANT = 'https://w3id.org/semanticarts/ns/ontology/gist/hasParticipant';
const IS_CATEGORIZED_BY = 'https://w3id.org/semanticarts/ns/ontology/gist/isCategorizedBy';
const KAPLAN_MEIER_ASSESSMENT_TYPE =
  'https://paediatrics.ox.ac.uk/nemaline-myopathy/terms/AssessmentType_KaplanMeier';

function getStatisticAccessRuleUris(dataUri: string): {
  ttl: string;
  jsonld: string;
  legacyJson: string;
} {
  const lastSlash = dataUri.lastIndexOf('/');
  const dir = lastSlash === -1 ? '' : dataUri.slice(0, lastSlash + 1);
  const fileName = lastSlash === -1 ? dataUri : dataUri.slice(lastSlash + 1);
  const baseName = fileName.replace(/\.ttl$/i, '');
  return {
    ttl: `${dir}${baseName}.statistic-access-rule.ttl`,
    jsonld: `${dir}${baseName}.statistic-access-rule.jsonld`,
    legacyJson: `${dir}${baseName}.statistic-access-rule.json`,
  };
}

async function resourceExists(authFetch: typeof fetch, uri: string): Promise<boolean> {
  const response = await authFetch(uri, { method: 'GET' });
  return response.ok;
}

function getAspectId(m: unknown): string | undefined {
  const hasAspect = (m as { hasAspect?: { '@id'?: string } | { toArray?: () => Array<{ '@id'?: string }> } }).hasAspect;
  if (hasAspect == null) return undefined;
  const first = typeof (hasAspect as { toArray?: () => unknown[] }).toArray === 'function'
    ? (hasAspect as { toArray: () => Array<{ '@id'?: string }> }).toArray()?.[0]
    : (hasAspect as { '@id'?: string });
  return (first as { '@id'?: string })?.['@id'];
}

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

function isClusterId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /^Cluster[123]$|^Cluster_[123]$|^C[123]$/.test(last);
}

function isGeneticId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /GeneticGroup|Variant[123]|variant[123]/.test(last);
}

function isAmbulationId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /Ambulant|Non.*Ambulant/.test(last);
}

function isDominantHandId(id: string): boolean {
  const last = id.split('/').pop() ?? id;
  return /^LeftHanded$|^RightHanded$|Left|Right/.test(last);
}

function isBaselineAgeAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return (last === 'AspectAge' || last.endsWith('Aspect_Age')) && !last.includes('AgeAtLossOfAmbulation') && !last.includes('LossOfAmbulation');
}

function isLoAAgeAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return last.includes('AgeAtLossOfAmbulation') || last.includes('LossOfAmbulation');
}

function isTotalMFMAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return last.includes('AggregateScore') || last.includes('MFM32_Aggregate');
}

function isKaplanMeierEventAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return last.includes('KaplanMeierEventIndicator');
}

function isKaplanMeierTimeAspect(aspect: string): boolean {
  const last = (aspect ?? '').split('/').pop() ?? aspect;
  return last.includes('KaplanMeierTimeToEvent');
}

function getCategoryIds(value: unknown): string[] {
  if (!value) return [];
  const raw = (value as { toArray?: () => unknown[] }).toArray?.() ?? value;
  const arr = Array.isArray(raw) ? raw : [value];
  return arr
    .map((c) => (c as { '@id'?: string })?.['@id'])
    .filter((id): id is string => typeof id === 'string');
}

function getMagnitudeFromValue(
  value: unknown,
  aspectMatch: (aspect: string) => boolean,
): number | undefined {
  if (!value) return undefined;
  const raw = (value as { toArray?: () => unknown[] }).toArray?.() ?? value;
  const arr = Array.isArray(raw) ? raw : [value];
  for (const m of arr) {
    const aspect = getAspectId(m);
    if (!aspect || !aspectMatch(aspect)) continue;
    const numericValue = (m as { numericValue?: number }).numericValue;
    if (typeof numericValue === 'number') return numericValue;
  }
  return undefined;
}

function getKaplanMeierValues(person: Person): {
  event?: number;
  time?: number;
} {
  const participants = person.hasParticipant;
  if (!participants) return {};
  const raw = participants.toArray?.() ?? participants;
  const arr = Array.isArray(raw) ? raw : [participants];
  for (const participant of arr) {
    const categoryIds = getCategoryIds(
      (participant as { isCategorizedBy?: unknown }).isCategorizedBy,
    );
    const isKaplanNode = categoryIds.some(
      (id) =>
        id === KAPLAN_MEIER_ASSESSMENT_TYPE ||
        id.split('/').pop() === 'AssessmentType_KaplanMeier',
    );
    if (!isKaplanNode) continue;
    const magnitudes = (participant as { hasMagnitude?: unknown }).hasMagnitude;
    const event = getMagnitudeFromValue(magnitudes, isKaplanMeierEventAspect);
    const time = getMagnitudeFromValue(magnitudes, isKaplanMeierTimeAspect);
    return { event, time };
  }
  return {};
}

function getKaplanMeierValuesFromGraph(
  dataset: { match: (s: unknown, p: unknown, o: unknown, g?: unknown) => { toArray?: () => unknown[] } },
  personUri: string | undefined,
): { event?: number; time?: number } {
  if (!personUri) return {};
  const personNode = namedNode(personUri);
  const hasParticipantNode = namedNode(HAS_PARTICIPANT);
  const isCategorizedByNode = namedNode(IS_CATEGORIZED_BY);
  const hasMagnitudeNode = namedNode(HAS_MAGNITUDE);
  const hasAspectNode = namedNode(HAS_ASPECT);
  const numericValueNode = namedNode(NUMERIC_VALUE);
  const toArray = (m: { toArray?: () => unknown[] }) =>
    m && typeof m.toArray === 'function' ? m.toArray() : [];
  const participantQuads = toArray(dataset.match(null, hasParticipantNode, personNode));

  for (const quad of participantQuads as Array<{ subject?: unknown }>) {
    const observationNode = quad.subject;
    if (!observationNode) continue;
    const categoryQuads = toArray(dataset.match(observationNode, isCategorizedByNode, null));
    const isKaplanNode = (categoryQuads as Array<{ object?: { value?: string } }>).some(
      (cq) => cq.object?.value === KAPLAN_MEIER_ASSESSMENT_TYPE,
    );
    if (!isKaplanNode) continue;

    const magnitudeQuads = toArray(dataset.match(observationNode, hasMagnitudeNode, null));
    let event: number | undefined;
    let time: number | undefined;
    for (const mq of magnitudeQuads as Array<{ object?: unknown }>) {
      const magnitudeNode = mq.object;
      if (!magnitudeNode) continue;
      const aspectQuad = (
        toArray(dataset.match(magnitudeNode, hasAspectNode, null)) as Array<{
          object?: { value?: string };
        }>
      )[0];
      const valueQuad = (
        toArray(dataset.match(magnitudeNode, numericValueNode, null)) as Array<{
          object?: { value?: string };
        }>
      )[0];
      const aspect = aspectQuad?.object?.value ?? '';
      const numStr = valueQuad?.object?.value;
      const numericValue = numStr != null ? Number(numStr) : NaN;
      if (Number.isNaN(numericValue)) continue;
      if (isKaplanMeierEventAspect(aspect)) event = numericValue;
      if (isKaplanMeierTimeAspect(aspect)) time = numericValue;
    }
    return { event, time };
  }

  return {};
}

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

const COLUMNS: ReadonlyArray<{ key: string; label: string; align: Align }> = [
  { key: 'id', label: 'ID', align: 'right' },
  { key: 'cluster', label: 'Cluster', align: 'left' },
  { key: 'genetic', label: 'Genetic group', align: 'left' },
  { key: 'baselineAge', label: 'Baseline age', align: 'right' },
  { key: 'ambulation', label: 'Ambulation', align: 'left' },
  { key: 'loaAge', label: 'LoA age', align: 'right' },
  { key: 'dominantHand', label: 'Dominant hand', align: 'left' },
  { key: 'totalMfm', label: 'Total MFM', align: 'right' },
  { key: 'kmEvent', label: 'KM event', align: 'right' },
  { key: 'kmTime', label: 'KM time (yr)', align: 'right' },
  { key: 'belowAvg', label: 'Below avg.', align: 'center' },
];

export function NemalineView() {
  const { targetUri } = useViewContext();
  const { navigateTo } = useTargetResource();
  const { fetch } = useSolidAuth();
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
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const isRowExpanded = useCallback(
    (key: string) => expandedKeys[key] !== false,
    [expandedKeys],
  );
  const setRowExpanded = useCallback((key: string, value: boolean) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: value }));
  }, []);
  const hasAnyAssessments = useMemo(
    () => sortedPersons.some((p) => getAssessmentEvents(p).length > 0),
    [sortedPersons],
  );
  const allExpanded = useMemo(() => {
    if (!hasAnyAssessments) return true;
    const withAssessments = sortedPersons.filter((p) => getAssessmentEvents(p).length > 0);
    return withAssessments.every((p) => isRowExpanded(p['@id'] ?? p.isIdentifiedBy?.uniqueText ?? ''));
  }, [hasAnyAssessments, sortedPersons, isRowExpanded]);
  const expandOrCollapseAll = useCallback(() => {
    const withAssessments = sortedPersons.filter((p) => getAssessmentEvents(p).length > 0);
    const next = !allExpanded;
    setExpandedKeys((prev) => {
      const out = { ...prev };
      withAssessments.forEach((p) => {
        const k = p['@id'] ?? p.isIdentifiedBy?.uniqueText ?? '';
        if (k) out[k] = next;
      });
      return out;
    });
  }, [allExpanded, sortedPersons]);

  if (!targetUri || !resource) return null;

  if (resource.type === 'InvalidIdentifierResource') {
    return (
      <View style={styles.container}>
        <Text>Invalid resource.</Text>
      </View>
    );
  }

  const thClass = (align: Align) =>
    align === 'right' ? 'nemaline-th-right' : align === 'center' ? 'nemaline-th-center' : 'nemaline-th-left';
  const tdClass = (align: Align) =>
    align === 'right' ? 'nemaline-td-right' : align === 'center' ? 'nemaline-td-center' : 'nemaline-td-left';
  const statisticAccessRuleUris = getStatisticAccessRuleUris(targetUri);

  return (
    <View style={styles.container}>
      <LoadingBar isLoading={!!isLoading} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="h1" style={styles.title}>
          Nemaline Myopathy Assessments
        </Text>
        <Text style={styles.subtitle}>
          {sortedPersons.length} participant{sortedPersons.length === 1 ? '' : 's'}
        </Text>
        <MeanQueryTester />
        <KaplanMeierQueryTester />
        <View style={styles.actionsRow}>
          <Button
            text="Edit Statistic Access Rule"
            variant="secondary"
            onPress={async () => {
              if (await resourceExists(fetch, statisticAccessRuleUris.ttl)) {
                navigateTo(statisticAccessRuleUris.ttl);
                return;
              }
              if (await resourceExists(fetch, statisticAccessRuleUris.jsonld)) {
                navigateTo(statisticAccessRuleUris.jsonld);
                return;
              }
              if (await resourceExists(fetch, statisticAccessRuleUris.legacyJson)) {
                navigateTo(statisticAccessRuleUris.legacyJson);
                return;
              }
              navigateTo(statisticAccessRuleUris.jsonld);
            }}
          />
        </View>
        <View style={styles.tableWrapper} className="nemaline-table-wrapper">
          <table className="nemaline-table">
            <colgroup>
              <col className="col-collapse" />
              {COLUMNS.map((col) => (
                <col
                  key={col.key}
                  className={`col-${col.key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                />
              ))}
            </colgroup>
            <thead className="nemaline-thead-sticky">
              <tr>
                <th className="nemaline-th-collapse" scope="col">
                  {hasAnyAssessments && (
                    <Pressable
                      onPress={expandOrCollapseAll}
                      className="nemaline-expand-collapse-all"
                      aria-label={allExpanded ? 'Collapse all' : 'Expand all'}
                    >
                      {allExpanded ? (
                        <ChevronsUp size={18} color="currentColor" />
                      ) : (
                        <ChevronsDown size={18} color="currentColor" />
                      )}
                    </Pressable>
                  )}
                </th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className={thClass(col.align)} scope="col">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPersons.map((person, rowIndex) => {
                const cats = getCategories(person);
                const cluster = cats.find(isClusterId);
                const genetic = cats.find(isGeneticId);
                const ambulation = cats.find(isAmbulationId);
                const dominantHand = cats.find(isDominantHandId);
                let baselineAge = getMagnitude(person, isBaselineAgeAspect);
                let loaAge = getMagnitude(person, isLoAAgeAspect);
                let totalMfm = getMagnitude(person, isTotalMFMAspect);
                let km = getKaplanMeierValues(person);
                if (graphDataset && (loaAge == null || totalMfm == null)) {
                  const fromGraph = getMagnitudesFromGraph(graphDataset, person['@id']);
                  if (loaAge == null) loaAge = fromGraph.find((m) => isLoAAgeAspect(m.aspect))?.numericValue;
                  if (totalMfm == null) totalMfm = fromGraph.find((m) => isTotalMFMAspect(m.aspect))?.numericValue;
                }
                if (graphDataset && (km.event == null || km.time == null)) {
                  const fromGraph = getKaplanMeierValuesFromGraph(graphDataset, person['@id']);
                  km = {
                    event: km.event ?? fromGraph.event,
                    time: km.time ?? fromGraph.time,
                  };
                }
                const belowAvg = cats.some((c) => /BelowAverage|Below/.test(c));
                const assessmentEvents = getAssessmentEvents(person);

                const personKey = person['@id'] ?? person.isIdentifiedBy?.uniqueText ?? String(rowIndex);
                const rowExpanded = assessmentEvents.length > 0 && isRowExpanded(personKey);
                const cells = [
                  person.isIdentifiedBy?.uniqueText ?? '–',
                  cluster ? labelFromId(cluster) : '–',
                  genetic ? labelFromId(genetic) : '–',
                  baselineAge != null ? baselineAge.toFixed(2) : '–',
                  ambulation ? labelFromId(ambulation) : '–',
                  loaAge != null ? loaAge.toFixed(2) : '–',
                  dominantHand ? labelFromId(dominantHand) : '–',
                  totalMfm != null ? String(totalMfm) : '–',
                  km.event != null ? String(Math.round(km.event)) : '–',
                  km.time != null ? km.time.toFixed(2) : '–',
                  belowAvg ? <Badge key="badge" variant="secondary">below</Badge> : '–',
                ];

                return (
                  <React.Fragment key={personKey}>
                    <tr>
                      <td className="nemaline-td-collapse">
                        {assessmentEvents.length > 0 ? (
                          <Pressable
                            onPress={() => setRowExpanded(personKey, !rowExpanded)}
                            className="nemaline-row-chevron"
                            aria-label={rowExpanded ? 'Collapse' : 'Expand'}
                          >
                            {rowExpanded ? (
                              <ChevronDown size={18} color="currentColor" />
                            ) : (
                              <ChevronRight size={18} color="currentColor" />
                            )}
                          </Pressable>
                        ) : null}
                      </td>
                      {COLUMNS.map((col, i) => (
                        <td key={col.key} className={tdClass(col.align)}>
                          {cells[i]}
                        </td>
                      ))}
                    </tr>
                    {assessmentEvents.length > 0 && rowExpanded && (
                      <tr className="nemaline-nested-row">
                        <td colSpan={COLUMNS.length + 1} className="nemaline-nested-cell">
                          <table className="nemaline-nested-table">
                            <thead>
                              <tr>
                                <th className="nemaline-nested-th">Visit</th>
                                <th className="nemaline-nested-th">Time from baseline (yr)</th>
                                <th className="nemaline-nested-th">MFM score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assessmentEvents.map((ev, i) => (
                                <tr key={i}>
                                  <td className="nemaline-nested-td">V{i + 1}</td>
                                  <td className="nemaline-nested-td">{ev.timeFromBaseline.toFixed(3)}</td>
                                  <td className="nemaline-nested-td">{ev.mfmScore}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
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
    paddingBottom: 48,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: { marginBottom: 4 },
  subtitle: {
    marginBottom: 20,
    color: 'hsl(var(--muted-foreground))',
    fontSize: 14,
  },
  actionsRow: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  tableWrapper: {
    marginHorizontal: 0,
    /* Border, radius, shadow via .nemaline-table-wrapper in global.css for reliable rendering */
  },
});
