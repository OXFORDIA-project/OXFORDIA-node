import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from 'linked-data-browser';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
} from 'lucide-react-native';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext,
  type ExpandedState,
  type Header,
  type SortingState,
} from '@tanstack/react-table';
import type { ParticipantRow, VariantRow } from './participantRows';

// Colours come from the navigation theme (as linked-data-browser does), so the
// table follows light/dark mode. CSS variables such as hsl(var(--border)) can't
// be used here: react-native-web's StyleSheet drops them. Columns have fixed
// widths and the table scrolls horizontally, so cell text wraps inside its
// column instead of overlapping its neighbours.

type ColumnMeta = { numeric?: boolean };

const EMPTY = '–';
const EXPANDER_WIDTH = 76;

function formatNumber(digits: number) {
  return ({ getValue }: CellContext<ParticipantRow, number | undefined>) => {
    const value = getValue();
    return value == null ? EMPTY : value.toFixed(digits);
  };
}

function formatText({ getValue }: CellContext<ParticipantRow, string | undefined>) {
  return getValue() ?? EMPTY;
}

const column = createColumnHelper<ParticipantRow>();

const COLUMNS = [
  column.display({
    id: 'expand',
    size: EXPANDER_WIDTH,
    enableSorting: false,
  }),
  column.accessor('row', { header: 'Row', size: 72, meta: { numeric: true }, cell: formatNumber(0) }),
  column.accessor('baselineAge', {
    header: 'Baseline age (yr)',
    size: 128,
    meta: { numeric: true },
    cell: formatNumber(2),
  }),
  column.accessor('gender', { header: 'Gender', size: 104, cell: formatText }),
  column.accessor('gene', { header: 'Gene', size: 104, cell: formatText }),
  column.accessor('zygosity', { header: 'Zygosity', size: 184, cell: formatText }),
  column.accessor('ambulant', { header: 'Ambulant', size: 108, cell: formatText }),
  column.accessor('sitting', { header: 'Sitting', size: 100, cell: formatText }),
  column.accessor('currentFunction', { header: 'Function', size: 116, cell: formatText }),
  column.accessor('ventilation', { header: 'Ventilation', size: 196, cell: formatText }),
  column.accessor('tubeFed', { header: 'Tube fed', size: 104, cell: formatText }),
  column.accessor('cedas', { header: 'CEDAS', size: 92, meta: { numeric: true }, cell: formatNumber(0) }),
  column.accessor('mfm32', { header: 'MFM32', size: 92, meta: { numeric: true }, cell: formatNumber(0) }),
  column.accessor('chopIntend', {
    header: 'CHOP INTEND',
    size: 124,
    meta: { numeric: true },
    cell: formatNumber(0),
  }),
  column.accessor('weight', { header: 'Weight (kg)', size: 116, meta: { numeric: true }, cell: formatNumber(1) }),
  column.accessor('height', { header: 'Height (cm)', size: 116, meta: { numeric: true }, cell: formatNumber(1) }),
  // UK-WHO Z-scores derived at upload; blank over 20 years old.
  column.accessor('heightZScore', { header: 'Height Z', size: 104, meta: { numeric: true }, cell: formatNumber(2) }),
  column.accessor('weightZScore', { header: 'Weight Z', size: 104, meta: { numeric: true }, cell: formatNumber(2) }),
  // Kaplan-Meier inputs for attaining ambulation, derived at upload.
  column.accessor('ambGainTime', {
    header: 'Walking KM time (yr)',
    size: 132,
    meta: { numeric: true },
    cell: formatNumber(2),
  }),
  column.accessor('ambGainEvent', {
    header: 'Walking KM event',
    size: 140,
    cell: ({ getValue }) => {
      const value = getValue();
      return value == null ? EMPTY : value === 1 ? 'Achieved (1)' : 'Censored (0)';
    },
  }),
];

const VARIANT_COLUMNS: { key: keyof VariantRow; label: string; width: number; numeric?: boolean }[] = [
  { key: 'position', label: 'Variant', width: 88, numeric: true },
  { key: 'hgvs', label: 'HGVS nomenclature', width: 320 },
  { key: 'type', label: 'Type', width: 228 },
  { key: 'consequence', label: 'Consequence', width: 148 },
  { key: 'lossOfFunction', label: 'Loss of function', width: 140 },
  { key: 'pathogenicity', label: 'Pathogenicity', width: 180 },
];
const VARIANT_TABLE_WIDTH = VARIANT_COLUMNS.reduce((sum, c) => sum + c.width, 0);

// ─── Theme ────────────────────────────────────────────────────────────────────

/** "hsl(220 15% 12%)" → "hsla(220, 15%, 12%, alpha)"; other formats unchanged. */
function withAlpha(color: string, alpha: number): string {
  const match = color.match(/^hsla?\(\s*([\d.]+)[\s,]+([\d.]+%)[\s,]+([\d.]+%)/);
  return match ? `hsla(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})` : color;
}

function themeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return {
    frame: { borderColor: colors.border, backgroundColor: colors.background },
    header: { backgroundColor: withAlpha(colors.text, 0.04), borderBottomColor: colors.border },
    row: { borderBottomColor: colors.border, backgroundColor: colors.background },
    striped: { backgroundColor: withAlpha(colors.text, 0.025) },
    hovered: { backgroundColor: withAlpha(colors.text, 0.06) },
    nestedRow: { backgroundColor: withAlpha(colors.text, 0.035), borderBottomColor: colors.border },
    nestedFrame: { borderColor: colors.border, backgroundColor: colors.background },
    badge: { backgroundColor: withAlpha(colors.text, 0.08) },
    badgeText: { color: colors.text },
    // TableHead's own text colour is a CSS variable, so set header colours explicitly.
    headText: { color: withAlpha(colors.text, 0.62) },
    headTextActive: { color: colors.text },
    iconButtonHovered: { backgroundColor: withAlpha(colors.text, 0.08) },
  } satisfies Record<string, ViewStyle | { color: string }>;
}

type ThemeStyles = ReturnType<typeof themeStyles>;

// ─── Cells ────────────────────────────────────────────────────────────────────

function CellText({ value, numeric }: { value: ReactNode; numeric?: boolean }) {
  const empty = value === EMPTY;
  return (
    <Text size="sm" muted={empty} style={numeric ? styles.numericText : undefined}>
      {value}
    </Text>
  );
}

function SortableHead({ header, theme }: { header: Header<ParticipantRow, unknown>; theme: ThemeStyles }) {
  const numeric = (header.column.columnDef.meta as ColumnMeta | undefined)?.numeric;
  const sorted = header.column.getIsSorted();
  const label = header.column.columnDef.header as string;
  return (
    <Pressable
      onPress={header.column.getToggleSortingHandler()}
      accessibilityRole="button"
      accessibilityLabel={`Sort by ${label}`}
      style={[styles.sortButton, numeric && styles.sortButtonEnd]}
    >
      <Text size="sm" style={StyleSheet.flatten([styles.headText, sorted ? theme.headTextActive : theme.headText])}>
        {label}
      </Text>
      <Icon
        icon={sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown}
        size={14}
        style={StyleSheet.flatten([sorted ? theme.headTextActive : theme.headText, !sorted && styles.sortIdle])}
      />
    </Pressable>
  );
}

function VariantsTable({ variants, theme }: { variants: VariantRow[]; theme: ThemeStyles }) {
  return (
    <View style={[styles.nestedFrame, theme.nestedFrame, { width: VARIANT_TABLE_WIDTH }]}>
      <Table style={{ width: VARIANT_TABLE_WIDTH }}>
        <TableHeader style={[styles.header, theme.header]}>
          <TableRow style={styles.headerRow}>
            {VARIANT_COLUMNS.map((c) => (
              <TableHead
                key={c.key}
                style={[styles.head, { width: c.width }, c.numeric ? styles.alignEnd : styles.alignStart]}
              >
                <Text size="sm" style={StyleSheet.flatten([styles.headText, theme.headText])}>{c.label}</Text>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody style={styles.body}>
          {variants.map((variant, i) => (
            <TableRow
              key={variant.position}
              style={[styles.row, theme.row, i === variants.length - 1 && styles.lastRow]}
            >
              {VARIANT_COLUMNS.map((c) => (
                <TableCell
                  key={c.key}
                  style={[styles.cell, { width: c.width }, c.numeric ? styles.alignEnd : styles.alignStart]}
                >
                  <CellText value={variant[c.key] ?? EMPTY} numeric={c.numeric} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </View>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

export function ParticipantTable({ rows }: { rows: ParticipantRow[] }) {
  const { colors } = useTheme();
  const theme = useMemo(() => themeStyles(colors), [colors]);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'row', desc: false }]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const table = useReactTable({
    data: rows,
    columns: COLUMNS,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowId: (row) => row.id,
    getRowCanExpand: (row) => row.original.variants.length > 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: { sortUndefined: 'last' },
  });

  const totalWidth = table.getTotalSize();
  const tableRows = table.getRowModel().rows;
  const anyExpandable = useMemo(() => rows.some((r) => r.variants.length > 0), [rows]);
  const allExpanded = table.getIsAllRowsExpanded();

  return (
    <View style={[styles.frame, theme.frame]}>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scrollContent}>
        <Table style={{ width: totalWidth }}>
          <TableHeader style={[styles.header, theme.header]}>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} style={styles.headerRow}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={[styles.head, styles.alignStart, { width: header.getSize() }]}
                  >
                    {header.column.id === 'expand' ? (
                      anyExpandable ? (
                        <Pressable
                          onPress={() => table.toggleAllRowsExpanded(!allExpanded)}
                          accessibilityRole="button"
                          accessibilityLabel={allExpanded ? 'Collapse all variants' : 'Expand all variants'}
                          // react-native-web adds `hovered` to the Pressable state.
                          style={(state) => [
                            styles.iconButton,
                            (state as { hovered?: boolean }).hovered && theme.iconButtonHovered,
                          ]}
                        >
                          <Icon icon={allExpanded ? ChevronsDownUp : ChevronsUpDown} size={16} style={theme.headText} />
                        </Pressable>
                      ) : null
                    ) : (
                      <SortableHead header={header} theme={theme} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody style={styles.body}>
            {tableRows.length === 0 ? (
              <TableRow style={[styles.row, theme.row, styles.lastRow]}>
                <TableCell style={[styles.cell, styles.alignStart, { width: totalWidth }]}>
                  <Text size="sm" muted>No participants in this resource.</Text>
                </TableCell>
              </TableRow>
            ) : (
              tableRows.map((row, index) => {
                const isLast = index === tableRows.length - 1;
                const isExpanded = row.getIsExpanded();
                const canExpand = row.getCanExpand();
                return (
                  <Fragment key={row.id}>
                    <TableRow
                      style={[
                        styles.row,
                        theme.row,
                        index % 2 === 1 && theme.striped,
                        hoveredId === row.id && theme.hovered,
                        canExpand && styles.clickableRow,
                        isLast && !isExpanded && styles.lastRow,
                      ]}
                      onPress={canExpand ? row.getToggleExpandedHandler() : undefined}
                      onHoverIn={() => setHoveredId(row.id)}
                      onHoverOut={() => setHoveredId((id) => (id === row.id ? null : id))}
                      accessibilityState={canExpand ? { expanded: isExpanded } : undefined}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const numeric = (cell.column.columnDef.meta as ColumnMeta | undefined)?.numeric;
                        return (
                          <TableCell
                            key={cell.id}
                            style={[
                              styles.cell,
                              { width: cell.column.getSize() },
                              numeric ? styles.alignEnd : styles.alignStart,
                            ]}
                          >
                            {cell.column.id === 'expand' ? (
                              canExpand ? (
                                <View style={styles.expander}>
                                  <Icon icon={isExpanded ? ChevronDown : ChevronRight} size={16} muted />
                                  <View style={[styles.countBadge, theme.badge]}>
                                    <Text size="xs" style={StyleSheet.flatten([styles.countText, theme.badgeText])}>
                                      {row.original.variants.length}
                                    </Text>
                                  </View>
                                </View>
                              ) : null
                            ) : (
                              <CellText
                                value={(cell.column.columnDef.cell as (c: unknown) => string)(cell.getContext())}
                                numeric={numeric}
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {isExpanded && (
                      <TableRow style={[styles.row, theme.nestedRow, isLast && styles.lastRow]}>
                        <View style={[styles.nestedContainer, { width: totalWidth }]}>
                          <Text size="xs" muted style={styles.nestedTitle}>
                            Genetic variants
                          </Text>
                          <VariantsTable variants={row.original.variants} theme={theme} />
                        </View>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollContent: { flexGrow: 1 },
  header: { borderBottomWidth: 1 },
  headerRow: { borderBottomWidth: 0 },
  head: {
    height: undefined,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexShrink: 0,
  },
  headText: { fontWeight: '500' },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'stretch',
  },
  sortButtonEnd: { justifyContent: 'flex-end' },
  sortIdle: { opacity: 0.4 },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { borderBottomWidth: 0 },
  row: { borderBottomWidth: 1 },
  clickableRow: { cursor: 'pointer' } as ViewStyle,
  lastRow: { borderBottomWidth: 0 },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Override the base TableCell/TableHead alignItems: 'center'.
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
  numericText: { fontVariant: ['tabular-nums'], textAlign: 'right' },
  expander: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countBadge: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    alignItems: 'center',
  },
  countText: { fontWeight: '600' },
  nestedContainer: {
    paddingLeft: EXPANDER_WIDTH,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  nestedTitle: {
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  nestedFrame: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
