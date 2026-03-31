import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "linked-data-browser";
import { useSolidAuth } from "@ldo/solid-react";
import type { GraphPath } from "@oxfordia/stat-plugin_core";
import {
  findGraphPathShortcutByName,
  getGraphPathShortcutsForDataSchema,
  resolveGraphPathShortcut,
} from "@oxfordia/data-plugin_core";
import { nemalineDataPlugin } from "@oxfordia/data-plugin-nemaline_core";

const DEFAULT_RESOURCE_URI = "http://localhost:3000/admin/FakeData2.ttl";
const DATA_SCHEMA_NAME = "nemaline";

type KaplanMeierQueryDraft = {
  resourceUri: string;
  timePath: GraphPath;
  eventPath: GraphPath;
  groupByPath?: GraphPath;
};

function createDefaultKaplanMeierQueryDraft(): KaplanMeierQueryDraft {
  const timeShortcut = findGraphPathShortcutByName(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    "KaplanMeierTime",
  );
  const eventShortcut = findGraphPathShortcutByName(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    "KaplanMeierEvent",
  );
  return {
    resourceUri: DEFAULT_RESOURCE_URI,
    timePath: timeShortcut
      ? timeShortcut.graphPath
      : ({ start: {}, steps: [] } as unknown as GraphPath),
    eventPath: eventShortcut
      ? eventShortcut.graphPath
      : ({ start: {}, steps: [] } as unknown as GraphPath),
  };
}

export function KaplanMeierObservationsTester() {
  const { fetch } = useSolidAuth();
  const graphPathShortcuts = useMemo(
    () => getGraphPathShortcutsForDataSchema([nemalineDataPlugin], DATA_SCHEMA_NAME),
    [],
  );
  const [queryDraft, setQueryDraft] = useState<KaplanMeierQueryDraft>(
    createDefaultKaplanMeierQueryDraft,
  );
  const [queryResult, setQueryResult] = useState<string>("");
  const [queryError, setQueryError] = useState<string>("");
  const [isSendingQuery, setIsSendingQuery] = useState<boolean>(false);

  const selectedTimeShortcut = resolveGraphPathShortcut(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    queryDraft.timePath,
  );
  const selectedEventShortcut = resolveGraphPathShortcut(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    queryDraft.eventPath,
  );
  const selectedGroupByShortcut = queryDraft.groupByPath
    ? resolveGraphPathShortcut(
        [nemalineDataPlugin],
        DATA_SCHEMA_NAME,
        queryDraft.groupByPath,
      )
    : null;

  const onSelectShortcut = useCallback(
    (field: "timePath" | "eventPath" | "groupByPath", shortcutName: string) => {
      if (field === "groupByPath" && shortcutName === "__none__") {
        setQueryDraft((prev) => ({ ...prev, groupByPath: undefined }));
        return;
      }
      const shortcut = graphPathShortcuts.find((item) => item.name === shortcutName);
      if (!shortcut) return;
      setQueryDraft((prev) => ({
        ...prev,
        [field]: shortcut.graphPath,
      }));
    },
    [graphPathShortcuts],
  );

  const sendQuery = useCallback(async () => {
    if (isSendingQuery) return;
    setIsSendingQuery(true);
    setQueryError("");
    setQueryResult("");
    try {
      const response = await fetch(`${window.location.origin}/.api/stat/kaplan-meier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(queryDraft),
      });
      const responseText = await response.text();
      let responseBody: unknown = responseText;
      if (responseText) {
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          // Keep plain text response.
        }
      }
      const rendered =
        typeof responseBody === "string"
          ? responseBody
          : JSON.stringify(responseBody, null, 2);
      if (!response.ok) {
        setQueryError(rendered || `Request failed with ${response.status}`);
        return;
      }
      setQueryResult(rendered || "(empty response)");
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSendingQuery(false);
    }
  }, [fetch, isSendingQuery, queryDraft]);

  return (
    <View style={styles.section}>
      <Text variant="h3" style={styles.title}>
        Kaplan-Meier Observations Tester
      </Text>
      <Text style={styles.subtitle}>
        Sends only `timePath`, `eventPath`, and optional `groupByPath`; response is raw observations.
      </Text>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Resource URI</Text>
        <TextInput
          value={queryDraft.resourceUri}
          onChangeText={(resourceUri) =>
            setQueryDraft((prev) => ({ ...prev, resourceUri }))
          }
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          style={styles.resourceInput}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Time path shortcut</Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              text={selectedTimeShortcut ? selectedTimeShortcut.name : "Choose time path"}
              variant="secondary"
              style={styles.shortcutTrigger}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={`time-${shortcut.name}`}
                  onPress={() => onSelectShortcut("timePath", shortcut.name)}
                >
                  <Text>{shortcut.name}</Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Event path shortcut</Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              text={selectedEventShortcut ? selectedEventShortcut.name : "Choose event path"}
              variant="secondary"
              style={styles.shortcutTrigger}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={`event-${shortcut.name}`}
                  onPress={() => onSelectShortcut("eventPath", shortcut.name)}
                >
                  <Text>{shortcut.name}</Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Group-by path shortcut (optional)</Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              text={selectedGroupByShortcut ? selectedGroupByShortcut.name : "None"}
              variant="secondary"
              style={styles.shortcutTrigger}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              <DropdownMenuItem onPress={() => onSelectShortcut("groupByPath", "__none__")}>
                <Text>None</Text>
              </DropdownMenuItem>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={`group-${shortcut.name}`}
                  onPress={() => onSelectShortcut("groupByPath", shortcut.name)}
                >
                  <Text>{shortcut.name}</Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
      <View style={styles.actions}>
        <Button
          text={isSendingQuery ? "Sending..." : "Send"}
          variant="secondary"
          onPress={sendQuery}
        />
      </View>
      {!!queryError && (
        <View style={styles.errorBox}>
          <Text style={styles.codeText}>{queryError}</Text>
        </View>
      )}
      {!!queryResult && (
        <View style={styles.resultBox}>
          <Text style={styles.codeText}>{queryResult}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "hsl(var(--border))",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "hsl(var(--card))",
  },
  title: { marginBottom: 4 },
  subtitle: {
    marginBottom: 10,
    color: "hsl(var(--muted-foreground))",
    fontSize: 13,
  },
  field: { marginBottom: 10 },
  fieldLabel: {
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  resourceInput: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "hsl(var(--border))",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "hsl(var(--background))",
    fontSize: 12,
  },
  shortcutTrigger: {
    minWidth: 220,
    maxWidth: 460,
  },
  dropdownContent: {
    maxHeight: 320,
    minWidth: 280,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  dropdownScroll: {
    maxHeight: 304,
  },
  actions: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  errorBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "hsl(0 75% 60%)",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "hsl(0 75% 60% / 0.12)",
  },
  resultBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "hsl(var(--border))",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "hsl(var(--muted) / 0.35)",
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
});
