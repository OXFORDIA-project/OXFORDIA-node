import React from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
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
import { set } from "@ldo/ldo";
import type {
  GraphPath,
  KaplanMeierAllowedPath,
  MeanAllowedPath,
} from "@oxfordia/plugins";
import type { GraphPathShortcut } from "@oxfordia/plugins/dataPlugin";
import { resolveGraphPathShortcut } from "@oxfordia/plugins/dataPlugin";
import type { EditorPolicy } from "../hooks/useStatisticAccessRuleEditorData";
import {
  createEmptyGraphPath,
  ensureGraphPathIds,
} from "../hooks/useStatisticAccessRuleEditorData";
import type {
  StartPredicateOptionGetter,
  StartValueOptionGetter,
  StepPredicateOptionGetter,
  StepTargetShapeNameGetter,
  StepWherePredicateOptionGetter,
  StepWhereValueOptionGetter,
} from "../utils/graphPathOptionResolver";
import { GraphPathBuilder } from "./GraphPathBuilder";

type GraphPathOptions = {
  dataSchemaName: string | null;
  predicateOptions: string[];
  graphPathShortcuts: GraphPathShortcut[];
  getStartPredicateOptions: StartPredicateOptionGetter;
  getStartValueOptions: StartValueOptionGetter;
  getStepPredicateOptions: StepPredicateOptionGetter;
  getStepWherePredicateOptions: StepWherePredicateOptionGetter;
  getStepWhereValueOptions: StepWhereValueOptionGetter;
  getStepTargetShapeNames: StepTargetShapeNameGetter;
};

type Props = {
  error: string | null;
  policies: EditorPolicy[];
  statisticNames: string[];
  addPolicy: (name: string) => void;
  removePolicy: (policyId: string) => void;
  addMeanAllowedPath: (policyId: string) => void;
  updateMeanAllowedPath: (
    policyId: string,
    pathIndex: number,
    nextPath: MeanAllowedPath,
  ) => void;
  removeMeanAllowedPath: (policyId: string, pathIndex: number) => void;
  addKaplanMeierAllowedPath: (policyId: string) => void;
  updateKaplanMeierAllowedPath: (
    policyId: string,
    pathIndex: number,
    nextPath: KaplanMeierAllowedPath,
  ) => void;
  removeKaplanMeierAllowedPath: (policyId: string, pathIndex: number) => void;
  gpOptions: GraphPathOptions;
};

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    root: { gap: 14 },
    banner: {
      borderWidth: 1,
      borderColor: colors.notification,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    error: { color: colors.notification },
    policyCard: {
      position: "relative",
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
    policyBody: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 14,
      paddingTop: 14,
      gap: 12,
    },
    pathCard: {
      position: "relative",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      backgroundColor: colors.background,
      gap: 10,
    },
    fieldWrapper: { gap: 6 },
    fieldLabel: { fontWeight: "600", fontSize: 13, opacity: 0.92 },
    sectionLabel: { fontWeight: "700", marginBottom: 2, fontSize: 14 },
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
    inlineRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 8,
    },
    addBtn: { alignSelf: "flex-start" },
    addPolicyRow: { marginTop: 4, alignItems: "center", width: "100%" },
    addPolicyButton: { minWidth: 260, alignSelf: "center" },
    dropdownTriggerButton: { minWidth: 240, maxWidth: 460 },
    dropdownContent: { maxHeight: 320, minWidth: 280, paddingVertical: 8, paddingHorizontal: 6 },
    dropdownScroll: { maxHeight: 304 },
    secondaryActionButton: { minWidth: 120 },
    graphPathBuilderWrap: { marginTop: 8 },
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
    cornerRemoveButton: {
      position: "absolute",
      top: -10,
      right: -10,
      zIndex: 2,
    },
  });
}

function RemoveButton({
  onPress,
  styles,
  color,
  style,
}: {
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconButton, style]}
      accessibilityRole="button"
      accessibilityLabel="Remove"
    >
      <Trash2 size={16} color={color} />
    </Pressable>
  );
}

function GraphPathFieldEditor({
  value,
  onChange,
  gpOptions,
}: {
  value: GraphPath;
  onChange: (next: GraphPath) => void;
  gpOptions: GraphPathOptions;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const matched = resolveGraphPathShortcut(gpOptions.dataSchemaName, value);
  const selectedName = value.name ?? matched?.name ?? "Choose path";

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

function MeanPolicyEditor({
  policy,
  gpOptions,
  styles,
  removeColor,
  addMeanAllowedPath,
  updateMeanAllowedPath,
  removeMeanAllowedPath,
}: {
  policy: Extract<EditorPolicy, { statisticName: "mean" }>;
  gpOptions: GraphPathOptions;
  styles: ReturnType<typeof createStyles>;
  removeColor: string;
  addMeanAllowedPath: (policyId: string) => void;
  updateMeanAllowedPath: (
    policyId: string,
    pathIndex: number,
    nextPath: MeanAllowedPath,
  ) => void;
  removeMeanAllowedPath: (policyId: string, pathIndex: number) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      {policy.allowedPaths.map((path, idx) => (
        <View key={path["@id"] ?? idx} style={styles.pathCard}>
          <RemoveButton
            onPress={() => removeMeanAllowedPath(policy.key, idx)}
            styles={styles}
            color={removeColor}
            style={styles.cornerRemoveButton}
          />
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Graph Path</Text>
            <GraphPathFieldEditor
              value={path.graphPath}
              onChange={(next) =>
                updateMeanAllowedPath(policy.key, idx, {
                  ...path,
                  graphPath: ensureGraphPathIds(next),
                })
              }
              gpOptions={gpOptions}
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Min Count</Text>
            <TextInput
              value={String(path.minCount)}
              onChangeText={(value) => {
                const minCount = Math.max(1, Number(value || "1"));
                updateMeanAllowedPath(policy.key, idx, {
                  ...path,
                  minCount: Number.isFinite(minCount) ? minCount : 1,
                });
              }}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>
      ))}
      <Button
        text="Add Allowed Path"
        variant="secondary"
        style={styles.addBtn}
        onPress={() => addMeanAllowedPath(policy.key)}
      />
    </View>
  );
}

function KaplanMeierPolicyEditor({
  policy,
  gpOptions,
  styles,
  removeColor,
  addKaplanMeierAllowedPath,
  updateKaplanMeierAllowedPath,
  removeKaplanMeierAllowedPath,
}: {
  policy: Extract<EditorPolicy, { statisticName: "kaplan-meier" }>;
  gpOptions: GraphPathOptions;
  styles: ReturnType<typeof createStyles>;
  removeColor: string;
  addKaplanMeierAllowedPath: (policyId: string) => void;
  updateKaplanMeierAllowedPath: (
    policyId: string,
    pathIndex: number,
    nextPath: KaplanMeierAllowedPath,
  ) => void;
  removeKaplanMeierAllowedPath: (policyId: string, pathIndex: number) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      {policy.allowedPaths.map((path, idx) => (
        <View key={path["@id"] ?? idx} style={styles.pathCard}>
          <RemoveButton
            onPress={() => removeKaplanMeierAllowedPath(policy.key, idx)}
            styles={styles}
            color={removeColor}
            style={styles.cornerRemoveButton}
          />

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Time Graph Path</Text>
            <GraphPathFieldEditor
              value={path.timeGraphPath}
              onChange={(next) =>
                updateKaplanMeierAllowedPath(policy.key, idx, {
                  ...path,
                  timeGraphPath: ensureGraphPathIds(next),
                })
              }
              gpOptions={gpOptions}
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Event Graph Path</Text>
            <GraphPathFieldEditor
              value={path.eventGraphPath}
              onChange={(next) =>
                updateKaplanMeierAllowedPath(policy.key, idx, {
                  ...path,
                  eventGraphPath: ensureGraphPathIds(next),
                })
              }
              gpOptions={gpOptions}
            />
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.sectionLabel}>Group By Graph Paths</Text>
            {(path.groupByGraphPath ? Array.from(path.groupByGraphPath) : []).map(
              (groupByPath, groupByIndex) => (
                <View
                  key={groupByPath["@id"] ?? groupByIndex}
                  style={styles.pathCard}
                >
                  <RemoveButton
                    onPress={() =>
                      updateKaplanMeierAllowedPath(policy.key, idx, {
                        ...path,
                        groupByGraphPath: set(
                          ...(path.groupByGraphPath
                            ? Array.from(path.groupByGraphPath).filter(
                                (_, currentIndex) => currentIndex !== groupByIndex,
                              )
                            : []),
                        ),
                      })
                    }
                    styles={styles}
                    color={removeColor}
                    style={styles.cornerRemoveButton}
                  />
                  <GraphPathFieldEditor
                    value={groupByPath}
                    onChange={(next) =>
                      updateKaplanMeierAllowedPath(policy.key, idx, {
                        ...path,
                        groupByGraphPath: set(
                          ...(path.groupByGraphPath
                            ? Array.from(path.groupByGraphPath).map((currentPath, currentIndex) =>
                                currentIndex === groupByIndex
                                  ? ensureGraphPathIds(next)
                                  : currentPath,
                              )
                            : []),
                        ),
                      })
                    }
                    gpOptions={gpOptions}
                  />
                </View>
              ),
            )}
            <Button
              text="Add Group By Path"
              variant="secondary"
              style={styles.addBtn}
              onPress={() =>
                updateKaplanMeierAllowedPath(policy.key, idx, {
                  ...path,
                  groupByGraphPath: set(
                    ...(path.groupByGraphPath
                      ? Array.from(path.groupByGraphPath)
                      : []),
                    ensureGraphPathIds(createEmptyGraphPath()),
                  ),
                })
              }
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>k-Anonymity</Text>
            <TextInput
              value={String(path.kAnonymity)}
              onChangeText={(value) => {
                const kAnonymity = Math.max(1, Number(value || "1"));
                updateKaplanMeierAllowedPath(policy.key, idx, {
                  ...path,
                  kAnonymity: Number.isFinite(kAnonymity) ? kAnonymity : 1,
                });
              }}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>
      ))}
      <Button
        text="Add Allowed Path"
        variant="secondary"
        style={styles.addBtn}
        onPress={() => addKaplanMeierAllowedPath(policy.key)}
      />
    </View>
  );
}

export function StatisticAccessRuleEditorForm({
  error,
  policies,
  statisticNames,
  addPolicy,
  removePolicy,
  addMeanAllowedPath,
  updateMeanAllowedPath,
  removeMeanAllowedPath,
  addKaplanMeierAllowedPath,
  updateKaplanMeierAllowedPath,
  removeKaplanMeierAllowedPath,
  gpOptions,
}: Props) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      {error ? (
        <View style={styles.banner}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      <View style={{ gap: 14 }}>
        {policies.map((policy, idx) => (
          <View key={policy.key} style={styles.policyCard}>
            <RemoveButton
              onPress={() => removePolicy(policy.key)}
              styles={styles}
              color={colors.text}
              style={styles.cornerRemoveButton}
            />
            <View style={styles.policyHeader}>
              <Text style={styles.policyTitle}>
                {idx + 1}. {policy.statisticName}
              </Text>
            </View>

            <View style={styles.policyBody}>
              {policy.statisticName === "mean" ? (
                <MeanPolicyEditor
                  policy={policy}
                  gpOptions={gpOptions}
                  styles={styles}
                  removeColor={colors.text}
                  addMeanAllowedPath={addMeanAllowedPath}
                  updateMeanAllowedPath={updateMeanAllowedPath}
                  removeMeanAllowedPath={removeMeanAllowedPath}
                />
              ) : null}
              {policy.statisticName === "kaplan-meier" ? (
                <KaplanMeierPolicyEditor
                  policy={policy}
                  gpOptions={gpOptions}
                  styles={styles}
                  removeColor={colors.text}
                  addKaplanMeierAllowedPath={addKaplanMeierAllowedPath}
                  updateKaplanMeierAllowedPath={updateKaplanMeierAllowedPath}
                  removeKaplanMeierAllowedPath={removeKaplanMeierAllowedPath}
                />
              ) : null}
            </View>
          </View>
        ))}
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
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {statisticNames.map((name) => (
                <DropdownMenuItem key={name} onPress={() => addPolicy(name)}>
                  <Text>{name}</Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </View>
  );
}
