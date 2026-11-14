import { set, type LdSet } from '@ldo/ldo';
import type { GeneticVariant, Person } from '@oxfordia/data-plugin-nemaline_core';
import { deriveFields } from './derivedFields';
import {
  CATEGORY_COLUMNS,
  DERIVED_NUMERIC_FIELDS,
  NUMERIC_COLUMNS,
  VARIANT_CATEGORIES,
  VARIANT_COLUMNS,
  type CategoryOption,
  type NumericColumnSpec,
} from './pilotColumns';

type ElementOf<S> = NonNullable<S> extends LdSet<infer T> ? T : never;
type PersonCategory = ElementOf<Person['isCategorizedBy']>;
type PersonMagnitude = ElementOf<Person['hasMagnitude']>;
type VariantCategory = ElementOf<GeneticVariant['isCategorizedBy']>;

/** Spreadsheet columns A..BW. */
export const PILOT_COLUMN_COUNT = 75;

/** Formula columns in the template; their exported values are ignored. */
const COMPUTED_COLUMNS = ['C', 'V', 'Z', 'AC', 'AH', 'AL', 'AP', 'AT', 'AW'];

/** A few headers checked to catch a different template or shifted columns. */
const HEADER_ANCHORS: [column: string, expectedPrefix: string][] = [
  ['A', 'age at baseline'],
  ['E', 'causative gene'],
  ['H', 'variant 1 hgvs'],
  ['M', 'variant 2 hgvs'],
  ['R', 'muscle biopsy'],
  ['AE', 'ever achieved ambulation'],
  ['AU', 'time on ventilation'],
  ['BD', 'weight'],
  ['BL', 'mfm32 total'],
  ['BW', 'model of device'],
];

/** "No 2nd Variant" options in columns N-Q mean the variant is absent. */
const NO_SECOND_VARIANT = 'no 2nd variant';

export class PilotCsvFormatError extends Error {}

export interface PilotCsvConversion {
  persons: Person[];
  warnings: string[];
}

/** Zero-based index of a spreadsheet column letter ("A" → 0, "AA" → 26). */
export function columnIndex(letters: string): number {
  let index = 0;
  for (const ch of letters.toUpperCase()) {
    index = index * 26 + (ch.charCodeAt(0) - 64);
  }
  return index - 1;
}

/** RFC 4180 CSV parser: quoted fields may contain commas, quotes and newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Case- and whitespace-insensitive form used to match dropdown values. */
export function normalizeLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function matchOption(raw: string, options: CategoryOption[]): CategoryOption | undefined {
  const value = normalizeLabel(raw);
  return options.find(
    (option) =>
      normalizeLabel(option.label) === value ||
      option.aliases?.some((alias) => normalizeLabel(alias) === value),
  );
}

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function checkHeaders(headers: string[]): void {
  if (headers.length < PILOT_COLUMN_COUNT) {
    throw new PilotCsvFormatError(
      `Expected ${PILOT_COLUMN_COUNT} columns (A–BW) but the header row has ${headers.length}. ` +
        'Use the pilot analysis template and save it as a plain CSV.',
    );
  }
  const mismatched = HEADER_ANCHORS.filter(
    ([column, prefix]) =>
      !normalizeLabel(headers[columnIndex(column)] ?? '').startsWith(prefix),
  );
  if (mismatched.length > 0) {
    throw new PilotCsvFormatError(
      `Header row does not match the pilot analysis template (check columns ${mismatched
        .map(([column]) => column)
        .join(', ')}).`,
    );
  }
}

class RowReader {
  constructor(
    private readonly cells: string[],
    readonly rowNumber: number,
    private readonly warnings: string[],
  ) {}

  text(column: string): string {
    return (this.cells[columnIndex(column)] ?? '').trim();
  }

  warn(column: string, label: string, message: string): void {
    this.warnings.push(`Row ${this.rowNumber}, column ${column} (${label}): ${message}`);
  }

  /** undefined when blank or invalid (invalid values are reported). */
  number(column: string, label: string): number | undefined {
    const raw = this.text(column);
    if (raw === '') return undefined;
    const value = Number(raw);
    if (Number.isNaN(value)) {
      this.warn(column, label, `"${raw}" is not a number`);
      return undefined;
    }
    return value;
  }

  /** undefined when blank or unrecognised (unrecognised values are reported). */
  option(column: string, label: string, options: CategoryOption[]): CategoryOption | undefined {
    const raw = this.text(column);
    if (raw === '') return undefined;
    const option = matchOption(raw, options);
    if (!option) this.warn(column, label, `unrecognised value "${raw}"`);
    return option;
  }
}

function isBlankRow(cells: string[]): boolean {
  const computed = new Set(COMPUTED_COLUMNS.map(columnIndex));
  return cells.every((cell, index) => computed.has(index) || cell.trim() === '');
}

function readNumeric(row: RowReader, spec: NumericColumnSpec): number | undefined {
  if (spec.kind === 'number') return row.number(spec.column, spec.label);
  // Ages are split into whole years and months; either may be left blank
  // (e.g. 0 years 18 months may be entered as just 18 months).
  const yearsRaw = row.text(spec.yearsColumn);
  const monthsRaw = row.text(spec.monthsColumn);
  if (yearsRaw === '' && monthsRaw === '') return undefined;
  const years = row.number(spec.yearsColumn, spec.label);
  const months = row.number(spec.monthsColumn, spec.label);
  if ((yearsRaw !== '' && years === undefined) || (monthsRaw !== '' && months === undefined)) {
    return undefined;
  }
  return (years ?? 0) + (months ?? 0) / 12;
}

function readVariant(
  row: RowReader,
  personUri: string,
  spec: (typeof VARIANT_COLUMNS)[number],
): GeneticVariant | undefined {
  const isAbsent = (column: string) => {
    const value = normalizeLabel(row.text(column));
    return value === '' || value === NO_SECOND_VARIANT;
  };
  const hgvs = row.text(spec.hgvsColumn);
  const categories: VariantCategory[] = [];
  for (const category of VARIANT_CATEGORIES) {
    const column = spec.columns[category.key];
    if (isAbsent(column)) continue;
    const option = row.option(column, `Variant ${spec.position} ${category.label}`, category.options);
    if (option) categories.push({ '@id': option.id } as VariantCategory);
  }
  if (hgvs === '' && categories.length === 0) return undefined;

  return {
    '@id': `${personUri}-variant-${spec.position}`,
    type: set({ '@id': 'GeneticVariant' }),
    isCategorizedBy: set({ '@id': spec.positionId } as VariantCategory, ...categories),
    ...(hgvs !== '' ? { containedText: hgvs } : {}),
  };
}

function rowToPerson(row: RowReader, baseUri: string): Person {
  const personUri = `${baseUri}#participant-row-${row.rowNumber}`;

  const categoryIds = new Map<string, string>();
  for (const spec of CATEGORY_COLUMNS) {
    const option = row.option(spec.column, spec.label, spec.options);
    if (option) categoryIds.set(spec.shortcut, option.id);
  }
  const numbers = new Map<string, number>();
  for (const spec of NUMERIC_COLUMNS) {
    const value = readNumeric(row, spec);
    if (value !== undefined) numbers.set(spec.shortcut, value);
  }
  const derived = deriveFields({ numbers, categories: categoryIds });

  const categories = set<PersonCategory>();
  for (const id of [...categoryIds.values(), ...derived.categories.values()]) {
    categories.add({ '@id': id } as PersonCategory);
  }

  const magnitudes = set<PersonMagnitude>();
  const numericSpecs = [
    ...NUMERIC_COLUMNS.map((spec) => ({ spec, value: numbers.get(spec.shortcut) })),
    ...DERIVED_NUMERIC_FIELDS.map((spec) => ({ spec, value: derived.numbers.get(spec.shortcut) })),
  ];
  for (const { spec, value } of numericSpecs) {
    if (value === undefined) continue;
    magnitudes.add({
      '@id': `${personUri}-${kebab(spec.shortcut)}`,
      type: set({ '@id': 'Magnitude' }),
      hasAspect: { '@id': spec.aspect },
      ...(spec.unit ? { hasUnitOfMeasure: { '@id': spec.unit } } : {}),
      numericValue: value,
    } as PersonMagnitude);
  }

  const variants = set<GeneticVariant>();
  for (const spec of VARIANT_COLUMNS) {
    const variant = readVariant(row, personUri, spec);
    if (variant) variants.add(variant);
  }

  return {
    '@id': personUri,
    type: set({ '@id': 'Person' }),
    ...(categories.size > 0 ? { isCategorizedBy: categories } : {}),
    ...(magnitudes.size > 0 ? { hasMagnitude: magnitudes } : {}),
    ...(variants.size > 0 ? { hasPart: variants } : {}),
  };
}

/**
 * Convert a CSV export of the pilot analysis template into Person objects.
 * Each non-blank row becomes one participant, identified only by its
 * spreadsheet row number (the template deliberately has no participant ID).
 */
export function convertPilotCsv(text: string, baseUri: string): PilotCsvConversion {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    throw new PilotCsvFormatError('CSV must have a header row and at least one data row.');
  }
  checkHeaders(rows[0]);

  const warnings: string[] = [];
  const persons: Person[] = [];
  rows.slice(1).forEach((cells, index) => {
    if (isBlankRow(cells)) return;
    // +2: one for the header row, one because spreadsheet rows start at 1.
    persons.push(rowToPerson(new RowReader(cells, index + 2, warnings), baseUri));
  });
  return { persons, warnings };
}
