import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button, Text } from "linked-data-browser";
import type { GraphNodeFilter, GraphPath } from "@oxfordia/plugins";
import type {
  StartPredicateOptionGetter,
  StartValueOptionGetter,
  StepPredicateOptionGetter,
  StepTargetShapeNameGetter,
  StepWherePredicateOptionGetter,
  StepWhereValueOptionGetter,
} from "../utils/graphPathOptionResolver";

type Props = {
  value: GraphPath;
  predicateOptions: string[];
  getStartPredicateOptions: StartPredicateOptionGetter;
  getStartValueOptions: StartValueOptionGetter;
  getStepPredicateOptions: StepPredicateOptionGetter;
  getStepWherePredicateOptions: StepWherePredicateOptionGetter;
  getStepWhereValueOptions: StepWhereValueOptionGetter;
  getStepTargetShapeNames: StepTargetShapeNameGetter;
  onChange: (next: GraphPath) => void;
};

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

function getSimpleWhereFilters(nodeFilter: GraphNodeFilter | undefined): Array<{ predicate: string }> {
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
}: Props) {
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
