import React, { FunctionComponent } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Button, LoadingBar, Text, useViewContext } from "linked-data-browser";
import { useStatisticAccessRuleEditorData } from "./hooks/useStatisticAccessRuleEditorData";
import { StatisticAccessRuleEditorForm } from "./components/StatisticAccessRuleEditorForm";

function getDataDocumentUri(uri: string | undefined): string | undefined {
  if (!uri) return undefined;
  return uri.replace(".statistic-access-rule.", ".");
}

export const StatisticAccessRuleView: FunctionComponent = () => {
  const { targetUri } = useViewContext();
  const { colors } = useTheme();
  const editor = useStatisticAccessRuleEditorData(targetUri);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: {
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        },
        headerTextWrap: { flexShrink: 1 },
        titleRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        },
        title: { fontWeight: "700", letterSpacing: 0.2 },
        documentLink: { paddingVertical: 2, alignSelf: "flex-start" },
        documentLinkText: {
          color: colors.primary,
          textDecorationLine: "underline",
          fontWeight: "700",
        },
        dataType: { marginTop: 8, opacity: 0.75, fontSize: 13 },
        actionsWrap: { alignItems: "flex-end", gap: 8, minWidth: 210 },
        saveButton: { alignSelf: "stretch" },
        saveButtonDisabled: { opacity: 0.5 },
        scroll: { flex: 1 },
        content: {
          padding: 20,
          paddingBottom: 44,
          width: "100%",
          maxWidth: 1120,
          alignSelf: "center",
          gap: 14,
        },
      }),
    [colors],
  );

  if (editor.isLoading) {
    return (
      <View style={styles.container}>
        <LoadingBar isLoading />
      </View>
    );
  }

  const dataDocumentUri = getDataDocumentUri(targetUri);
  const dataDocumentName = dataDocumentUri?.split("/").pop() ?? "document.ttl";
  const isSaveDisabled = editor.isSaving;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <View style={styles.titleRow}>
            <Text variant="h2" style={styles.title}>
              Statistic Access Rule for
            </Text>
            <Pressable
              style={styles.documentLink}
              onPress={() => {
                if (dataDocumentUri) Linking.openURL(dataDocumentUri);
              }}
            >
              <Text
                variant="h2"
                style={{ ...styles.title, ...styles.documentLinkText }}
              >
                {dataDocumentName}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.dataType}>
            Data Type: {editor.dataSchemaName ?? "Unknown"}
          </Text>
        </View>
        <View style={styles.actionsWrap}>
          <Button
            text={editor.isSaving ? "Saving..." : "Save Changes"}
            variant="default"
            style={[
              styles.saveButton,
              isSaveDisabled ? styles.saveButtonDisabled : undefined,
            ]}
            onPress={() => {
              if (!isSaveDisabled) void editor.save();
            }}
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <StatisticAccessRuleEditorForm
          error={editor.error}
          policies={editor.policies}
          statisticNames={editor.statisticNames}
          addPolicy={editor.addPolicy}
          removePolicy={editor.removePolicy}
          addMeanAllowedPath={editor.addMeanAllowedPath}
          updateMeanAllowedPath={editor.updateMeanAllowedPath}
          removeMeanAllowedPath={editor.removeMeanAllowedPath}
          addKaplanMeierAllowedPath={editor.addKaplanMeierAllowedPath}
          updateKaplanMeierAllowedPath={editor.updateKaplanMeierAllowedPath}
          removeKaplanMeierAllowedPath={editor.removeKaplanMeierAllowedPath}
          gpOptions={{
            dataSchemaName: editor.dataSchemaName,
            predicateOptions: editor.predicateOptions,
            graphPathShortcuts: editor.graphPathShortcuts,
            getStartPredicateOptions: editor.getStartPredicateOptions,
            getStartValueOptions: editor.getStartValueOptions,
            getStepPredicateOptions: editor.getStepPredicateOptions,
            getStepWherePredicateOptions: editor.getStepWherePredicateOptions,
            getStepWhereValueOptions: editor.getStepWhereValueOptions,
            getStepTargetShapeNames: editor.getStepTargetShapeNames,
          }}
        />
      </ScrollView>
    </View>
  );
};
