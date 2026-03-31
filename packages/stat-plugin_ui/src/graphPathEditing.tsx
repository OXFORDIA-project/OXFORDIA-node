import { set } from "@ldo/ldo";
import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "linked-data-browser";
import type {
  GraphLiteralFilter,
  GraphNodeFilter,
  GraphPath,
  GraphPredicateFilter,
  GraphTraversalStep,
  GraphValueSelector,
} from "@oxfordia/stat-plugin_core";
import type {
  StatisticAccessRuleEditorGraphPathOptions,
} from "./types";

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createLocalNodeId(prefix: string): string {
  return `#${createId(prefix)}`;
}

function toArray<T>(value: Iterable<T> | undefined): T[] {
  if (!value) return [];
  return Array.from(value);
}

export function createEmptyGraphPath(): GraphPath {
  return ensureGraphPathIds({
    "@id": createLocalNodeId("graph-path"),
    start: {
      "@id": createLocalNodeId("graph-node-filter"),
    } as GraphNodeFilter,
  } as GraphPath);
}

function ensureGraphLiteralFilterIds(
  filter: GraphLiteralFilter,
): GraphLiteralFilter {
  filter["@id"] = filter["@id"] ?? createLocalNodeId("graph-literal-filter");
  return filter;
}

function ensureGraphValueSelectorIds(
  selector: GraphValueSelector,
): GraphValueSelector {
  const record = selector as GraphValueSelector & {
    node?: GraphNodeFilter;
    literal?: GraphLiteralFilter;
  };

  record["@id"] = record["@id"] ?? createLocalNodeId("graph-value-selector");
  if (record.node) ensureGraphNodeFilterIds(record.node);
  if (record.literal) ensureGraphLiteralFilterIds(record.literal);
  return selector;
}

function ensureGraphPredicateFilterIds(
  filter: GraphPredicateFilter,
): GraphPredicateFilter {
  filter["@id"] = filter["@id"] ?? createLocalNodeId("graph-predicate-filter");
  if (filter.some) ensureGraphValueSelectorIds(filter.some);
  if (filter.every) ensureGraphValueSelectorIds(filter.every);
  if (filter.none) ensureGraphValueSelectorIds(filter.none);
  return filter;
}

function ensureGraphNodeFilterIds(
  nodeFilter: GraphNodeFilter,
): GraphNodeFilter {
  nodeFilter["@id"] = nodeFilter["@id"] ?? createLocalNodeId("graph-node-filter");
  for (const predicate of toArray(nodeFilter.predicates)) {
    ensureGraphPredicateFilterIds(predicate);
  }
  return nodeFilter;
}

function ensureGraphTraversalStepIds(
  step: GraphTraversalStep,
): GraphTraversalStep {
  step["@id"] = step["@id"] ?? createLocalNodeId("graph-traversal-step");
  if (step.where) ensureGraphNodeFilterIds(step.where);
  return step;
}

export function ensureGraphPathIds(graphPath: GraphPath): GraphPath {
  graphPath["@id"] = graphPath["@id"] ?? createLocalNodeId("graph-path");
  ensureGraphNodeFilterIds(graphPath.start);
  for (const step of toArray(graphPath.steps)) {
    ensureGraphTraversalStepIds(step);
  }
  if (graphPath.target) ensureGraphValueSelectorIds(graphPath.target);
  return graphPath;
}

function parseGraphPath(value: string): GraphPath | null {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    if (!("start" in parsed)) return null;
    return parsed as GraphPath;
  } catch {
    return null;
  }
}

type IriObject = { "@id": string };

function toCollectionArray<T>(value: T | T[] | Iterable<T> | undefined): T[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value as T];
  if (typeof value === "object" && Symbol.iterator in (value as object)) {
    return Array.from(value as Iterable<T>);
  }
  return [value as T];
}

function getIriValue(value: string | IriObject | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value["@id"] === "string") {
    return value["@id"];
  }
  return undefined;
}

function getSimpleWhereFilters(
  nodeFilter: GraphNodeFilter | undefined,
): Array<{ predicate: string }> {
  return toCollectionArray(nodeFilter?.predicates).flatMap((filter) => {
    const predicate = getIriValue(filter.predicate as string | IriObject | undefined);
    return predicate ? [{ predicate }] : [];
  });
}

export function GraphPathBuilder({
  value,
  predicateOptions,
  getStartPredicateOptions,
  getStartValueOptions,
  getStepPredicateOptions,
  getStepWherePredicateOptions,
  getStepWhereValueOptions,
  getStepTargetShapeNames,
  onChange,
}: {
  value: GraphPath;
  predicateOptions: string[];
  getStartPredicateOptions: StatisticAccessRuleEditorGraphPathOptions["getStartPredicateOptions"];
  getStartValueOptions: StatisticAccessRuleEditorGraphPathOptions["getStartValueOptions"];
  getStepPredicateOptions: StatisticAccessRuleEditorGraphPathOptions["getStepPredicateOptions"];
  getStepWherePredicateOptions: StatisticAccessRuleEditorGraphPathOptions["getStepWherePredicateOptions"];
  getStepWhereValueOptions: StatisticAccessRuleEditorGraphPathOptions["getStepWhereValueOptions"];
  getStepTargetShapeNames: StatisticAccessRuleEditorGraphPathOptions["getStepTargetShapeNames"];
  onChange: (next: GraphPath) => void;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          backgroundColor: colors.card,
          gap: 10,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        },
        title: {
          fontWeight: "600",
          fontSize: 14,
          flexShrink: 1,
        },
        codeInput: {
          minHeight: 180,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 18,
          textAlignVertical: "top",
        },
        metricsRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        },
        metricPill: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 4,
          backgroundColor: colors.background,
        },
        metricText: {
          fontSize: 12,
          opacity: 0.85,
        },
        error: {
          color: colors.notification,
          fontSize: 12,
        },
      }),
    [colors.background, colors.border, colors.card, colors.notification, colors.text],
  );

  const [jsonDraft, setJsonDraft] = React.useState(() => JSON.stringify(value, null, 2));
  const [jsonError, setJsonError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setJsonDraft(JSON.stringify(value, null, 2));
  }, [value]);

  const steps = toCollectionArray(value.steps);
  const startWhere = getSimpleWhereFilters(value.start);
  const firstStepWhere = getSimpleWhereFilters(steps[0]?.where as GraphNodeFilter | undefined);
  const startPredicates = getStartPredicateOptions(value).length;
  const firstStepPredicates = steps.length > 0 ? getStepPredicateOptions(value, 0).length : 0;
  const firstStepWherePredicates =
    steps.length > 0 ? getStepWherePredicateOptions(value, 0).length : 0;
  const firstStepWhereValues =
    steps.length > 0 && firstStepWhere[0]?.predicate
      ? getStepWhereValueOptions(value, 0, firstStepWhere[0].predicate).length
      : 0;
  const firstStepShapes = steps.length > 0 ? getStepTargetShapeNames(value, 0).length : 0;
  const firstStartValueOptions =
    startWhere[0]?.predicate
      ? getStartValueOptions(value, startWhere[0].predicate).length
      : 0;
  const metrics = [
    `predicates: ${predicateOptions.length}`,
    `start predicates: ${startPredicates}`,
    `start values: ${firstStartValueOptions}`,
    `step predicates: ${firstStepPredicates}`,
    `step where predicates: ${firstStepWherePredicates}`,
    `step where values: ${firstStepWhereValues}`,
    `step target shapes: ${firstStepShapes}`,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Graph Path (Advanced)</Text>
        <Button
          text="Format JSON"
          variant="secondary"
          onPress={() => {
            const parsed = parseGraphPath(jsonDraft);
            if (!parsed) {
              setJsonError("Invalid graph path JSON");
              return;
            }
            setJsonError(null);
            setJsonDraft(JSON.stringify(parsed, null, 2));
          }}
        />
      </View>
      <TextInput
        value={jsonDraft}
        onChangeText={(nextValue) => {
          setJsonDraft(nextValue);
          const parsed = parseGraphPath(nextValue);
          if (!parsed) {
            setJsonError("Invalid graph path JSON");
            return;
          }
          setJsonError(null);
          onChange(parsed);
        }}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        style={styles.codeInput}
      />
      {jsonError ? <Text style={styles.error}>{jsonError}</Text> : null}
      <View style={styles.metricsRow}>
        {metrics.map((metric) => (
          <View key={metric} style={styles.metricPill}>
            <Text style={styles.metricText}>{metric}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function GraphPathFieldEditor({
  value,
  onChange,
  gpOptions,
}: {
  value: GraphPath;
  onChange: (next: GraphPath) => void;
  gpOptions: StatisticAccessRuleEditorGraphPathOptions;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        fieldWrapper: { gap: 6 },
        inlineRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
        },
        dropdownTriggerButton: { minWidth: 240, maxWidth: 460 },
        dropdownContent: {
          maxHeight: 320,
          minWidth: 280,
          paddingVertical: 8,
          paddingHorizontal: 6,
        },
        dropdownScroll: { maxHeight: 304 },
        secondaryActionButton: { minWidth: 120 },
        graphPathBuilderWrap: { marginTop: 8 },
      }),
    [colors],
  );

  const matched = gpOptions.graphPathShortcuts.find((shortcut) => {
    if (value.name && shortcut.name === value.name) return true;
    return JSON.stringify(shortcut.graphPath) === JSON.stringify(value);
  });
  const selectedName = value.name ?? matched?.name ?? "Choose path";
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <View style={styles.fieldWrapper}>
      <View style={styles.inlineRow}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              text={selectedName}
              variant="secondary"
              style={styles.dropdownTriggerButton}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {gpOptions.graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={shortcut.name}
                  onPress={() => onChange(shortcut.graphPath)}
                >
                  <Text>{shortcut.graphPath.name ?? shortcut.name}</Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          text={showAdvanced ? "Hide advanced" : "Advanced"}
          variant="secondary"
          style={styles.secondaryActionButton}
          onPress={() => setShowAdvanced((prev) => !prev)}
        />
      </View>
      {showAdvanced ? (
        <View style={styles.graphPathBuilderWrap}>
          <GraphPathBuilder
            value={value}
            predicateOptions={gpOptions.predicateOptions}
            getStartPredicateOptions={gpOptions.getStartPredicateOptions}
            getStartValueOptions={gpOptions.getStartValueOptions}
            getStepPredicateOptions={gpOptions.getStepPredicateOptions}
            getStepWherePredicateOptions={gpOptions.getStepWherePredicateOptions}
            getStepWhereValueOptions={gpOptions.getStepWhereValueOptions}
            getStepTargetShapeNames={gpOptions.getStepTargetShapeNames}
            onChange={onChange}
          />
        </View>
      ) : null}
    </View>
  );
}
