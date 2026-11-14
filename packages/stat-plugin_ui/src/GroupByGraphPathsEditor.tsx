import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button, Text } from "linked-data-browser";
import { Trash2 } from "lucide-react-native";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import {
  createEmptyGraphPath,
  ensureGraphPathIds,
  GraphPathFieldEditor,
} from "./graphPathEditing";
import type { StatisticAccessRuleEditorGraphPathOptions } from "./types";

/**
 * Editor for an allowed path's groupByGraphPath set: the graph paths a query
 * may group its result by. Controlled; the caller wraps the array in set().
 */
export function GroupByGraphPathsEditor({
  value,
  onChange,
  gpOptions,
}: {
  value: GraphPath[];
  onChange: (next: GraphPath[]) => void;
  gpOptions: StatisticAccessRuleEditorGraphPathOptions;
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        root: { gap: 10 },
        sectionLabel: { fontWeight: "600", fontSize: 13, opacity: 0.92 },
        hint: { fontSize: 12, opacity: 0.7 },
        pathCard: {
          position: "relative",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          backgroundColor: colors.background,
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
    [colors.background, colors.border],
  );

  return (
    <View style={styles.root}>
      <Text style={styles.sectionLabel}>Group By Graph Paths</Text>
      <Text style={styles.hint}>
        Results may be broken down by any one or two of these; each cell must meet the thresholds.
      </Text>
      {value.map((groupByPath, groupByIndex) => (
        <View key={groupByPath["@id"] ?? groupByIndex} style={styles.pathCard}>
          <Pressable
            onPress={() => onChange(value.filter((_, index) => index !== groupByIndex))}
            style={[styles.iconButton, styles.cornerRemoveButton]}
            accessibilityRole="button"
            accessibilityLabel="Remove group by path"
          >
            <Trash2 size={16} color={colors.text} />
          </Pressable>
          <GraphPathFieldEditor
            value={groupByPath}
            onChange={(next) =>
              onChange(
                value.map((current, index) =>
                  index === groupByIndex ? ensureGraphPathIds(next) : current,
                ),
              )
            }
            gpOptions={gpOptions}
          />
        </View>
      ))}
      <Button
        text="Add Group By Path"
        variant="secondary"
        onPress={() => onChange([...value, ensureGraphPathIds(createEmptyGraphPath())])}
      />
    </View>
  );
}
