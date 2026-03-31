import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
  StatisticAccessRuleEditorGraphPathOptions,
  StatisticPluginUi,
} from "@oxfordia/stat-plugin_ui";
import type { StatisticPolicy } from "@oxfordia/stat-plugin_core";

type Props = {
  error: string | null;
  policies: StatisticPolicy[];
  statisticPlugins: StatisticPluginUi[];
  addPolicy: (name: string) => void;
  removePolicy: (policyId: string) => void;
  updatePolicy: (policyId: string, nextPolicy: StatisticPolicy) => void;
  gpOptions: StatisticAccessRuleEditorGraphPathOptions;
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
    addPolicyRow: { marginTop: 4, alignItems: "center", width: "100%" },
    addPolicyButton: { minWidth: 260, alignSelf: "center" },
    dropdownTriggerButton: { minWidth: 240, maxWidth: 460 },
    dropdownContent: { maxHeight: 320, minWidth: 280, paddingVertical: 8, paddingHorizontal: 6 },
    dropdownScroll: { maxHeight: 304 },
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

export function StatisticAccessRuleEditorForm({
  error,
  policies,
  statisticPlugins,
  addPolicy,
  removePolicy,
  updatePolicy,
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
          <View
            key={policy["@id"] ?? `${policy.statisticName}-${idx}`}
            style={styles.policyCard}
          >
            <View style={styles.policyHeader}>
              <Text style={styles.policyTitle}>
                {idx + 1}. {policy.statisticName}
              </Text>
              <Button
                text="Remove"
                variant="secondary"
                onPress={() => policy["@id"] && removePolicy(policy["@id"])}
              />
            </View>

            <View style={styles.policyBody}>
              {(() => {
                const plugin = statisticPlugins.find((candidate) =>
                  candidate.isPolicy(policy),
                );
                if (!plugin || !policy["@id"]) {
                  return (
                    <Text>
                      No statistic plugin UI is registered for `{policy.statisticName}`.
                    </Text>
                  );
                }
                const Editor = plugin.Editor as React.ComponentType<{
                  policy: StatisticPolicy;
                  onChange: (nextPolicy: StatisticPolicy) => void;
                  gpOptions: StatisticAccessRuleEditorGraphPathOptions;
                }>;
                return (
                  <Editor
                    policy={policy}
                    onChange={(nextPolicy) =>
                      updatePolicy(policy["@id"]!, nextPolicy)
                    }
                    gpOptions={gpOptions}
                  />
                );
              })()}
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
              {statisticPlugins.map((plugin) => (
                <DropdownMenuItem
                  key={plugin.name}
                  onPress={() => addPolicy(plugin.name)}
                >
                  <Text>{plugin.displayName}</Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </View>
  );
}
