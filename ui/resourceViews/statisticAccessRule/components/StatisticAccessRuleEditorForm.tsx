import React from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "linked-data-browser";
import { Trash2 } from "lucide-react-native";
import type { GraphPath } from "@oxfordia/types";
import type {
  StatisticPolicy,
  StatisticAccessRuleObjectValue,
  StatisticAccessRuleScalarValue,
  StatisticAccessRuleSchemas,
} from "../types";
import { createEmptyGraphPath, makeId } from "../types";
import type {
  StartPredicateOptionGetter,
  StartValueOptionGetter,
  StepPredicateOptionGetter,
  StepTargetShapeNameGetter,
  StepWherePredicateOptionGetter,
  StepWhereValueOptionGetter,
} from "../utils/graphPathOptionResolver";
import {
  getGraphPathFromValue,
  getPolicyFieldDefinitions,
  type SchemaFieldDefinition,
} from "../utils/statisticAccessRuleSchemaForm";
import { GraphPathBuilder } from "./GraphPathBuilder";
import {
  instantiateGraphPathShortcut,
  resolveGraphPathShortcut,
  type GraphPathShortcut,
} from "../../../graphPathShortcuts";

type Props = {
  error: string | null;
  dataSchemaName: string | null;
  statisticAccessRuleSchemas: StatisticAccessRuleSchemas;
  statisticPolicies: StatisticPolicy[];
  setStatisticPolicies: React.Dispatch<React.SetStateAction<StatisticPolicy[]>>;
  statisticNames: string[];
  addStatisticPolicyByName: (name: string) => void;
  predicateOptions: string[];
  graphPathShortcuts: GraphPathShortcut[];
  getStartPredicateOptions: StartPredicateOptionGetter;
  getStartValueOptions: StartValueOptionGetter;
  getStepPredicateOptions: StepPredicateOptionGetter;
  getStepWherePredicateOptions: StepWherePredicateOptionGetter;
  getStepWhereValueOptions: StepWhereValueOptionGetter;
  getStepTargetShapeNames: StepTargetShapeNameGetter;
};

type GraphPathFieldEditorProps = {
  dataSchemaName: string | null;
  graphPathValue: GraphPath;
  graphPathShortcuts: GraphPathShortcut[];
  predicateOptions: string[];
  getStartPredicateOptions: StartPredicateOptionGetter;
  getStartValueOptions: StartValueOptionGetter;
  getStepPredicateOptions: StepPredicateOptionGetter;
  getStepWherePredicateOptions: StepWherePredicateOptionGetter;
  getStepWhereValueOptions: StepWhereValueOptionGetter;
  getStepTargetShapeNames: StepTargetShapeNameGetter;
  onChange: (nextGraphPath: GraphPath) => void;
};

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: {
      gap: 14,
    },
    banner: {
      borderWidth: 1,
      borderColor: colors.notification,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    error: { color: colors.notification },
    policyList: {
      gap: 14,
    },
    policyCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 16,
      backgroundColor: colors.card,
    },
    policyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      minHeight: 32,
    },
    policyTitle: { fontWeight: "700", fontSize: 16, flexShrink: 1, paddingRight: 8 },
    policyActions: { alignItems: "center", justifyContent: "center" },
    policyBody: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 14,
      paddingTop: 14,
      gap: 12,
    },
    block: { gap: 10 },
    sectionLabel: { fontWeight: "700", marginBottom: 2, fontSize: 14 },
    fieldWrapper: { gap: 6 },
    fieldLabel: { fontWeight: "600", fontSize: 13, opacity: 0.92 },
    nestedCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      backgroundColor: colors.background,
      gap: 10,
    },
    nestedHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    nestedHeaderSpacer: { flex: 1 },
    nestedTitle: { fontWeight: "600", fontSize: 13 },
    input: {
      minHeight: 40,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: 14,
    },
    switchRow: { alignSelf: "flex-start" },
    repeatedItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    repeatedInputWrap: {
      flex: 1,
    },
    nestedItemsList: {
      gap: 10,
    },
    repeatedList: {
      gap: 8,
    },
    addPolicyRow: {
      marginTop: 4,
      alignItems: "center",
      width: "100%",
    },
    addPolicyButton: {
      minWidth: 260,
      alignSelf: "center",
    },
    addItemButton: {
      alignSelf: "flex-start",
    },
    inlineRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 8,
      justifyContent: "flex-start",
    },
    secondaryActionButton: {
      minWidth: 120,
    },
    graphPathBuilderWrap: {
      marginTop: 8,
    },
    dropdownTriggerButton: {
      minWidth: 240,
      maxWidth: 460,
    },
    dropdownContent: {
      maxHeight: 320,
      minWidth: 280,
      paddingVertical: 8,
      paddingHorizontal: 6,
    },
    iconButton: {
      width: 32,
      height: 32,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
  });
}

type RemoveIconButtonProps = {
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  color: string;
};

function RemoveIconButton({ onPress, styles, color }: RemoveIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.iconButton}
      accessibilityRole="button"
      accessibilityLabel="Remove"
    >
      <Trash2 size={16} color={color} />
    </Pressable>
  );
}

function renderScalarInput(
  value: StatisticAccessRuleScalarValue,
  field: SchemaFieldDefinition,
  onChange: (next: StatisticAccessRuleScalarValue) => void,
  styles: ReturnType<typeof createStyles>,
) {
  if (field.type === "integer") {
    return (
      <TextInput
        value={String(typeof value === "number" ? value : Number(value || 1))}
        onChangeText={(nextValue) => {
          const asNumber = Math.max(1, Number(nextValue || "1"));
          onChange(Number.isFinite(asNumber) ? asNumber : 1);
        }}
        keyboardType="numeric"
        style={styles.input}
      />
    );
  }
  if (field.type === "boolean") {
    return (
      <View style={styles.switchRow}>
        <Switch value={Boolean(value)} onValueChange={(nextValue) => onChange(nextValue)} />
      </View>
    );
  }
  return (
    <TextInput
      value={typeof value === "string" ? value : String(value ?? "")}
      onChangeText={(nextValue) => onChange(nextValue)}
      style={styles.input}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

function GraphPathFieldEditor({
  dataSchemaName,
  graphPathValue,
  graphPathShortcuts,
  predicateOptions,
  getStartPredicateOptions,
  getStartValueOptions,
  getStepPredicateOptions,
  getStepWherePredicateOptions,
  getStepWhereValueOptions,
  getStepTargetShapeNames,
  onChange,
}: GraphPathFieldEditorProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  const matchedShortcut = resolveGraphPathShortcut(dataSchemaName, graphPathValue);
  const choosePathLabel = matchedShortcut ? matchedShortcut.name : "Choose path";

  return (
    <View style={styles.fieldWrapper}>
      <View style={styles.inlineRow}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button text={choosePathLabel} variant="secondary" style={styles.dropdownTriggerButton} />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            {graphPathShortcuts.map((shortcut) => (
              <DropdownMenuItem
                key={shortcut.name}
                onPress={() => onChange(instantiateGraphPathShortcut(shortcut))}
              >
                <Text>{shortcut.name}</Text>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          text={isAdvancedOpen ? "Hide advanced" : "Advanced"}
          variant="secondary"
          style={styles.secondaryActionButton}
          onPress={() => setIsAdvancedOpen((prev) => !prev)}
        />
      </View>

      {isAdvancedOpen ? (
        <View style={styles.graphPathBuilderWrap}>
          <GraphPathBuilder
            value={graphPathValue}
            predicateOptions={predicateOptions}
            getStartPredicateOptions={getStartPredicateOptions}
            getStartValueOptions={getStartValueOptions}
            getStepPredicateOptions={getStepPredicateOptions}
            getStepWherePredicateOptions={getStepWherePredicateOptions}
            getStepWhereValueOptions={getStepWhereValueOptions}
            getStepTargetShapeNames={getStepTargetShapeNames}
            onChange={onChange}
          />
        </View>
      ) : null}
    </View>
  );
}

export function StatisticAccessRuleEditorForm({
  error,
  dataSchemaName,
  statisticAccessRuleSchemas,
  statisticPolicies,
  setStatisticPolicies,
  statisticNames,
  addStatisticPolicyByName,
  predicateOptions,
  graphPathShortcuts,
  getStartPredicateOptions,
  getStartValueOptions,
  getStepPredicateOptions,
  getStepWherePredicateOptions,
  getStepWhereValueOptions,
  getStepTargetShapeNames,
}: Props) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const updatePolicy = (id: string, updater: (policy: StatisticPolicy) => StatisticPolicy) =>
    setStatisticPolicies((prev) => prev.map((policy) => (policy.id === id ? updater(policy) : policy)));

  return (
    <View style={styles.root}>
      {error ? (
        <View style={styles.banner}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.policyList}>
        {statisticPolicies.map((policy, policyIndex) => {
          const schema = statisticAccessRuleSchemas[policy.statisticName];
          const fields = schema ? getPolicyFieldDefinitions(schema, policy.statisticName) : [];

          return (
            <View key={policy.id} style={styles.policyCard}>
              <View style={styles.policyHeader}>
                <Text style={styles.policyTitle}>{policyIndex + 1}. {policy.statisticName}</Text>
                <View style={styles.policyActions}>
                  <RemoveIconButton
                    styles={styles}
                    color={colors.text}
                    onPress={() =>
                      setStatisticPolicies((prev) => prev.filter((entry) => entry.id !== policy.id))
                    }
                  />
                </View>
              </View>

              <View style={styles.policyBody}>
                {fields.map((field) => {
                  const fieldValue = policy.values[field.key];
                  const normalizedFieldName = `${field.key} ${field.label}`.replace(/\s+/g, "").toLowerCase();
                  const isAllowedPathField = normalizedFieldName.includes("allowedpath");

                  if (field.type === "object") {
                    const objects = Array.isArray(fieldValue)
                      ? (fieldValue as StatisticAccessRuleObjectValue[])
                      : [];
                    return (
                      <View key={field.key} style={styles.block}>
                        {isAllowedPathField ? null : <Text style={styles.sectionLabel}>{field.label}</Text>}
                        <View style={styles.nestedItemsList}>
                          {objects.map((item, itemIndex) => (
                            <View key={item.id} style={styles.nestedCard}>
                              <View style={styles.nestedHeader}>
                                {isAllowedPathField ? (
                                  <View style={styles.nestedHeaderSpacer} />
                                ) : (
                                  <Text style={styles.nestedTitle}>{field.label} {itemIndex + 1}</Text>
                                )}
                                <RemoveIconButton
                                  styles={styles}
                                  color={colors.text}
                                  onPress={() =>
                                    updatePolicy(policy.id, (entry) => ({
                                      ...entry,
                                      values: { ...entry.values, [field.key]: objects.filter((x) => x.id !== item.id) },
                                    }))
                                  }
                                />
                              </View>
                              {(field.nestedFields ?? []).map((nestedField) => {
                                const nestedValue = item.values[nestedField.key];
                                if (nestedField.type === "graphPath") {
                                  return (
                                    <View key={nestedField.key} style={styles.fieldWrapper}>
                                      <Text style={styles.fieldLabel}>{nestedField.label}</Text>
                                      <GraphPathFieldEditor
                                        dataSchemaName={dataSchemaName}
                                        graphPathValue={getGraphPathFromValue(nestedValue)}
                                        graphPathShortcuts={graphPathShortcuts}
                                        predicateOptions={predicateOptions}
                                        getStartPredicateOptions={getStartPredicateOptions}
                                        getStartValueOptions={getStartValueOptions}
                                        getStepPredicateOptions={getStepPredicateOptions}
                                        getStepWherePredicateOptions={getStepWherePredicateOptions}
                                        getStepWhereValueOptions={getStepWhereValueOptions}
                                        getStepTargetShapeNames={getStepTargetShapeNames}
                                        onChange={(nextGraphPath: GraphPath) =>
                                          updatePolicy(policy.id, (entry) => ({
                                            ...entry,
                                            values: {
                                              ...entry.values,
                                              [field.key]: objects.map((x) =>
                                                x.id !== item.id
                                                  ? x
                                                  : {
                                                      ...x,
                                                      values: { ...x.values, [nestedField.key]: nextGraphPath },
                                                    },
                                              ),
                                            },
                                          }))
                                        }
                                      />
                                    </View>
                                  );
                                }
                                if (nestedField.type === "object") return null;
                                return (
                                  <View key={nestedField.key} style={styles.fieldWrapper}>
                                    <Text style={styles.fieldLabel}>{nestedField.label}</Text>
                                    {renderScalarInput(
                                      (nestedValue as StatisticAccessRuleScalarValue) ?? "",
                                      nestedField,
                                      (nextValue) =>
                                        updatePolicy(policy.id, (entry) => ({
                                          ...entry,
                                          values: {
                                            ...entry.values,
                                            [field.key]: objects.map((x) =>
                                              x.id !== item.id
                                                ? x
                                                : { ...x, values: { ...x.values, [nestedField.key]: nextValue } },
                                            ),
                                          },
                                        })),
                                      styles,
                                    )}
                                  </View>
                                );
                              })}
                            </View>
                          ))}
                        </View>
                        <Button
                          text={`Add ${field.label}`}
                          variant="secondary"
                          style={styles.addItemButton}
                          onPress={() =>
                            updatePolicy(policy.id, (entry) => ({
                              ...entry,
                              values: {
                                ...entry.values,
                                [field.key]: [
                                  ...objects,
                                  {
                                    id: makeId("item"),
                                    values: Object.fromEntries(
                                      (field.nestedFields ?? []).map((nestedField) => [
                                        nestedField.key,
                                        nestedField.type === "graphPath"
                                          ? createEmptyGraphPath()
                                          : nestedField.type === "integer"
                                            ? 1
                                            : nestedField.type === "boolean"
                                              ? false
                                              : "",
                                      ]),
                                    ),
                                  },
                                ],
                              },
                            }))
                          }
                        />
                      </View>
                    );
                  }

                  if (field.type === "graphPath") {
                    return (
                      <View key={field.key} style={styles.fieldWrapper}>
                        <Text style={styles.fieldLabel}>{field.label}</Text>
                        <GraphPathFieldEditor
                          dataSchemaName={dataSchemaName}
                          graphPathValue={getGraphPathFromValue(fieldValue)}
                          graphPathShortcuts={graphPathShortcuts}
                          predicateOptions={predicateOptions}
                          getStartPredicateOptions={getStartPredicateOptions}
                          getStartValueOptions={getStartValueOptions}
                          getStepPredicateOptions={getStepPredicateOptions}
                          getStepWherePredicateOptions={getStepWherePredicateOptions}
                          getStepWhereValueOptions={getStepWhereValueOptions}
                          getStepTargetShapeNames={getStepTargetShapeNames}
                          onChange={(nextGraphPath: GraphPath) =>
                            updatePolicy(policy.id, (entry) => ({
                              ...entry,
                              values: { ...entry.values, [field.key]: nextGraphPath },
                            }))
                          }
                        />
                      </View>
                    );
                  }

                  if (field.repeated) {
                    const values = Array.isArray(fieldValue)
                      ? (fieldValue as StatisticAccessRuleScalarValue[])
                      : [];
                    return (
                      <View key={field.key} style={styles.block}>
                        <Text style={styles.sectionLabel}>{field.label}</Text>
                        <View style={styles.repeatedList}>
                          {values.map((itemValue, itemIndex) => (
                            <View key={`${field.key}-${itemIndex}`} style={styles.repeatedItem}>
                              <View style={styles.repeatedInputWrap}>
                                {renderScalarInput(
                                  itemValue,
                                  field,
                                  (nextValue) =>
                                    updatePolicy(policy.id, (entry) => ({
                                      ...entry,
                                      values: {
                                        ...entry.values,
                                        [field.key]: values.map((v, idx) => (idx === itemIndex ? nextValue : v)),
                                      },
                                    })),
                                  styles,
                                )}
                              </View>
                              <RemoveIconButton
                                styles={styles}
                                color={colors.text}
                                onPress={() =>
                                  updatePolicy(policy.id, (entry) => ({
                                    ...entry,
                                    values: {
                                      ...entry.values,
                                      [field.key]: values.filter((_, idx) => idx !== itemIndex),
                                    },
                                  }))
                                }
                              />
                            </View>
                          ))}
                        </View>
                        <Button
                          text={`Add ${field.label}`}
                          variant="secondary"
                          style={styles.addItemButton}
                          onPress={() =>
                            updatePolicy(policy.id, (entry) => ({
                              ...entry,
                              values: {
                                ...entry.values,
                                [field.key]: [...values, field.type === "integer" ? 1 : field.type === "boolean" ? false : ""],
                              },
                            }))
                          }
                        />
                      </View>
                    );
                  }

                  return (
                    <View key={field.key} style={styles.fieldWrapper}>
                      <Text style={styles.fieldLabel}>{field.label}</Text>
                      {renderScalarInput(
                        (fieldValue as StatisticAccessRuleScalarValue) ?? "",
                        field,
                        (nextValue) =>
                          updatePolicy(policy.id, (entry) => ({
                            ...entry,
                            values: { ...entry.values, [field.key]: nextValue },
                          })),
                        styles,
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.addPolicyRow}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              text="Add statistic plugin policy"
              variant="secondary"
              style={styles.addPolicyButton}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            {statisticNames.map((name) => (
              <DropdownMenuItem key={name} onPress={() => addStatisticPolicyByName(name)}>
                <Text>{name}</Text>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </View>
  );
}
