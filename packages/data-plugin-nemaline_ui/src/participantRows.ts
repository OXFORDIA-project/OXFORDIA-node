import type { GeneticVariant, Person } from '@oxfordia/data-plugin-nemaline_core';
import {
  CATEGORY_COLUMNS,
  DERIVED_CATEGORY_FIELDS,
  DERIVED_NUMERIC_FIELDS,
  NUMERIC_COLUMNS,
  VARIANT_CATEGORIES,
  type CategoryOption,
} from './pilotColumns';

// Converts LDO Person proxies into plain rows for ParticipantTable.

export interface VariantRow {
  position: number;
  hgvs?: string;
  type?: string;
  consequence?: string;
  lossOfFunction?: string;
  pathogenicity?: string;
}

export interface ParticipantRow {
  id: string;
  row?: number;
  baselineAge?: number;
  gender?: string;
  gene?: string;
  zygosity?: string;
  ambulant?: string;
  sitting?: string;
  currentFunction?: string;
  ventilation?: string;
  tubeFed?: string;
  cedas?: number;
  mfm32?: number;
  chopIntend?: number;
  weight?: number;
  height?: number;
  heightZScore?: number;
  weightZScore?: number;
  ambGainTime?: number;
  ambGainEvent?: number;
  variants: VariantRow[];
}

// ─── ID helpers ───────────────────────────────────────────────────────────────

// LDO may return either the compact term ("GenderMale") or the full IRI
// ("…/terms/Gender_Male"). Reduce both to the compact form.
function normalizeId(id: string | undefined): string {
  if (!id) return '';
  const suffix = id.split('/').pop() ?? id;
  return suffix.replace(/_/g, '');
}

function rowNumber(uri: string | undefined): number {
  const match = uri?.match(/#participant-row-(\d+)$/);
  return match ? Number(match[1]) : Number.NaN;
}

// ─── LdSet helper ─────────────────────────────────────────────────────────────

// LdSet<T> extends Set<T> in the type system but the runtime proxy does not
// reliably implement Symbol.iterator — use .toArray() via this helper.
type Inner<S> = S extends { toArray(): (infer T)[] } ? T : S;

export function ldArr<S>(val: S | null | undefined): Inner<S>[] {
  if (val == null) return [];
  const asSet = val as { toArray?: () => Inner<S>[] };
  if (typeof asSet.toArray === 'function') return asSet.toArray();
  if (Array.isArray(val)) return val as unknown as Inner<S>[];
  return [val as unknown as Inner<S>];
}

// ─── Lookups ──────────────────────────────────────────────────────────────────

function categoryLabel(ids: string[], options: CategoryOption[]): string | undefined {
  return options.find((option) => ids.includes(option.id))?.label;
}

function personCategory(ids: string[], shortcut: string): string | undefined {
  const spec = [...CATEGORY_COLUMNS, ...DERIVED_CATEGORY_FIELDS].find(
    (field) => field.shortcut === shortcut,
  );
  return spec && categoryLabel(ids, spec.options);
}

function variantCategory(
  ids: string[],
  key: (typeof VARIANT_CATEGORIES)[number]['key'],
): string | undefined {
  const spec = VARIANT_CATEGORIES.find((category) => category.key === key);
  return spec && categoryLabel(ids, spec.options);
}

function magnitude(person: Person, shortcut: string): number | undefined {
  const aspect = [...NUMERIC_COLUMNS, ...DERIVED_NUMERIC_FIELDS].find(
    (field) => field.shortcut === shortcut,
  )?.aspect;
  // The 27 magnitude shapes share rdf:type gist:Magnitude, so LDO's merged
  // context reads hasAspect back as a collection despite the singular typing.
  return ldArr(person.hasMagnitude).find((m) =>
    ldArr(m.hasAspect as unknown as { '@id'?: string }).some((a) => normalizeId(a['@id']) === aspect),
  )?.numericValue;
}

// ─── Row builders ─────────────────────────────────────────────────────────────

function toVariantRow(variant: GeneticVariant): VariantRow {
  const ids = ldArr(variant.isCategorizedBy).map((c) => normalizeId(c['@id']));
  return {
    position: ids.includes('VariantPosition2') ? 2 : 1,
    hgvs: variant.containedText,
    type: variantCategory(ids, 'Type'),
    consequence: variantCategory(ids, 'Consequence'),
    lossOfFunction: variantCategory(ids, 'LossOfFunction'),
    pathogenicity: variantCategory(ids, 'Pathogenicity'),
  };
}

export function toParticipantRow(person: Person, index: number): ParticipantRow {
  const ids = ldArr(person.isCategorizedBy).map((c) => normalizeId(c['@id']));
  const n = rowNumber(person['@id']);
  return {
    id: person['@id'] ?? String(index),
    row: Number.isNaN(n) ? undefined : n,
    baselineAge: magnitude(person, 'BaselineAge'),
    gender: personCategory(ids, 'GenderAssignedAtBirth'),
    gene: personCategory(ids, 'CausativeGene'),
    zygosity: personCategory(ids, 'Zygosity'),
    ambulant: personCategory(ids, 'AmbulantAtBaseline'),
    sitting: personCategory(ids, 'IndependentSittingAtBaseline'),
    currentFunction: personCategory(ids, 'CurrentFN'),
    ventilation: personCategory(ids, 'VentilationType'),
    tubeFed: personCategory(ids, 'TubeFeedingAtBaseline'),
    cedas: magnitude(person, 'CEDASScore'),
    mfm32: magnitude(person, 'MFM32Total'),
    chopIntend: magnitude(person, 'CHOPINTENDTotal'),
    weight: magnitude(person, 'Weight'),
    height: magnitude(person, 'Height'),
    heightZScore: magnitude(person, 'ZScoreH'),
    weightZScore: magnitude(person, 'ZScoreW'),
    ambGainTime: magnitude(person, 'AmbGainTime'),
    ambGainEvent: magnitude(person, 'AmbGainEvent'),
    variants: ldArr(person.hasPart)
      .map(toVariantRow)
      .sort((a, b) => a.position - b.position),
  };
}
