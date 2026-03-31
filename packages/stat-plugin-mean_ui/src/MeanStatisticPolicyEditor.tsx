import { set } from "@ldo/ldo";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button, Text } from "linked-data-browser";
import { Trash2 } from "lucide-react-native";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";
import type { MeanAllowedPath } from "@oxfordia/stat-plugin-mean_core";
import type { StatisticPolicyEditorProps } from "@oxfordia/stat-plugin_ui";
import {
  createEmptyGraphPath,
  ensureGraphPathIds,
  GraphPathFieldEditor,
} from "@oxfordia/stat-plugin_ui";

type MeanStatisticPolicy = StatisticPolicy & {
  allowedPath?: MeanAllowedPath | Iterable<MeanAllowedPath>;
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

function createMeanAllowedPath(): MeanAllowedPath {
  return {
    "@id": `#${createId("mean-allowed-path")}`,
    graphPath: ensureGraphPathIds(createEmptyGraphPath()),
    minCount: 1,
  };
}

export function MeanStatisticPolicyEditor({
  policy,
  onChange,
  gpOptions,
}: StatisticPolicyEditorProps<MeanStatisticPolicy>) {
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
      {allowedPaths.map((path, index) => (
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
            <Text style={styles.fieldLabel}>Graph Path</Text>
            <GraphPathFieldEditor
              value={path.graphPath}
              onChange={(next) =>
                onChange({
                  ...policy,
                  allowedPath: set(
                    ...allowedPaths.map((currentPath, currentIndex) =>
                      currentIndex === index
                        ? {
                            ...currentPath,
                            graphPath: ensureGraphPathIds(next),
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
            <Text style={styles.fieldLabel}>Min Count</Text>
            <TextInput
              value={String(path.minCount)}
              onChangeText={(value) => {
                const minCount = Math.max(1, Number(value || "1"));
                onChange({
                  ...policy,
                  allowedPath: set(
                    ...allowedPaths.map((currentPath, currentIndex) =>
                      currentIndex === index
                        ? {
                            ...currentPath,
                            minCount: Number.isFinite(minCount) ? minCount : 1,
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
      ))}

      <Button
        text="Add Allowed Path"
        variant="secondary"
        onPress={() =>
          onChange({
            ...policy,
            allowedPath: set(...allowedPaths, createMeanAllowedPath()),
          })
        }
      />
    </View>
  );
}
