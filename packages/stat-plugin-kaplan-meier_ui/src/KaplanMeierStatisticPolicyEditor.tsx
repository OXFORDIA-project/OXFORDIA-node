import { set } from "@ldo/ldo";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button, Text } from "linked-data-browser";
import { Trash2 } from "lucide-react-native";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";
import type { KaplanMeierAllowedPath } from "@oxfordia/stat-plugin-kaplan-meier_core";
import type { StatisticPolicyEditorProps } from "@oxfordia/stat-plugin_ui";
import {
  createEmptyGraphPath,
  ensureGraphPathIds,
  GraphPathFieldEditor,
} from "@oxfordia/stat-plugin_ui";

type KaplanMeierStatisticPolicy = StatisticPolicy & {
  allowedPath?: KaplanMeierAllowedPath | Iterable<KaplanMeierAllowedPath>;
};

function toArray<T>(value: T | Iterable<T> | undefined): T[] {
  if (value === undefined) return [];
  if (typeof value === "object" && value !== null && Symbol.iterator in value) {
    return Array.from(value as Iterable<T>);
  }
  return [value as T];
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createKaplanMeierAllowedPath(): KaplanMeierAllowedPath {
  return {
    "@id": `#${createId("kaplan-meier-allowed-path")}`,
    timeGraphPath: ensureGraphPathIds(createEmptyGraphPath()),
    eventGraphPath: ensureGraphPathIds(createEmptyGraphPath()),
    groupByGraphPath: set(),
    kAnonymity: 1,
  };
}

export function KaplanMeierStatisticPolicyEditor({
  policy,
  onChange,
  gpOptions,
}: StatisticPolicyEditorProps<KaplanMeierStatisticPolicy>) {
  const { colors } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        root: { gap: 12 },
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
      }),
    [colors.background, colors.border, colors.text],
  );

  const allowedPaths = toArray(policy.allowedPath);

  return (
    <View style={styles.root}>
      {allowedPaths.map((path, index) => {
        const groupByPaths = toArray(path.groupByGraphPath);

        return (
          <View key={path["@id"] ?? index} style={styles.pathCard}>
            <Pressable
              onPress={() =>
                onChange({
                  ...policy,
                  allowedPath: set(
                    ...allowedPaths.filter((_, currentIndex) => currentIndex !== index),
                  ),
                })
              }
              style={[styles.iconButton, styles.cornerRemoveButton]}
              accessibilityRole="button"
              accessibilityLabel="Remove"
            >
              <Trash2 size={16} color={colors.text} />
            </Pressable>

            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Time Graph Path</Text>
              <GraphPathFieldEditor
                value={path.timeGraphPath}
                onChange={(next) =>
                  onChange({
                    ...policy,
                    allowedPath: set(
                      ...allowedPaths.map((currentPath, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...currentPath,
                              timeGraphPath: ensureGraphPathIds(next),
                            }
                          : currentPath,
                      ),
                    ),
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
                  onChange({
                    ...policy,
                    allowedPath: set(
                      ...allowedPaths.map((currentPath, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...currentPath,
                              eventGraphPath: ensureGraphPathIds(next),
                            }
                          : currentPath,
                      ),
                    ),
                  })
                }
                gpOptions={gpOptions}
              />
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.sectionLabel}>Group By Graph Paths</Text>
              {groupByPaths.map((groupByPath, groupByIndex) => (
                <View key={groupByPath["@id"] ?? groupByIndex} style={styles.pathCard}>
                  <Pressable
                    onPress={() =>
                      onChange({
                        ...policy,
                        allowedPath: set(
                          ...allowedPaths.map((currentPath, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...currentPath,
                                  groupByGraphPath: set(
                                    ...groupByPaths.filter(
                                      (_, currentGroupIndex) =>
                                        currentGroupIndex !== groupByIndex,
                                    ),
                                  ),
                                }
                              : currentPath,
                          ),
                        ),
                      })
                    }
                    style={[styles.iconButton, styles.cornerRemoveButton]}
                    accessibilityRole="button"
                    accessibilityLabel="Remove"
                  >
                    <Trash2 size={16} color={colors.text} />
                  </Pressable>

                  <GraphPathFieldEditor
                    value={groupByPath}
                    onChange={(next) =>
                      onChange({
                        ...policy,
                        allowedPath: set(
                          ...allowedPaths.map((currentPath, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...currentPath,
                                  groupByGraphPath: set(
                                    ...groupByPaths.map((currentGroupPath, currentGroupIndex) =>
                                      currentGroupIndex === groupByIndex
                                        ? ensureGraphPathIds(next)
                                        : currentGroupPath,
                                    ),
                                  ),
                                }
                              : currentPath,
                          ),
                        ),
                      })
                    }
                    gpOptions={gpOptions}
                  />
                </View>
              ))}

              <Button
                text="Add Group By Path"
                variant="secondary"
                onPress={() =>
                  onChange({
                    ...policy,
                    allowedPath: set(
                      ...allowedPaths.map((currentPath, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...currentPath,
                              groupByGraphPath: set(
                                ...groupByPaths,
                                ensureGraphPathIds(createEmptyGraphPath()),
                              ),
                            }
                          : currentPath,
                      ),
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
                  onChange({
                    ...policy,
                    allowedPath: set(
                      ...allowedPaths.map((currentPath, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...currentPath,
                              kAnonymity: Number.isFinite(kAnonymity) ? kAnonymity : 1,
                            }
                          : currentPath,
                      ),
                    ),
                  });
                }}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>
        );
      })}

      <Button
        text="Add Allowed Path"
        variant="secondary"
        onPress={() =>
          onChange({
            ...policy,
            allowedPath: set(...allowedPaths, createKaplanMeierAllowedPath()),
          })
        }
      />
    </View>
  );
}
