import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from 'linked-data-browser';
import { useSolidAuth } from '@ldo/solid-react';
import type { GraphPath } from '@oxfordia/types';
import {
  findGraphPathShortcutByName,
  getGraphPathShortcutsForDataSchema,
  instantiateGraphPathShortcut,
  resolveGraphPathShortcut,
} from '../../graphPathShortcuts';

const DEFAULT_RESOURCE_URI = 'http://localhost:3000/admin/FakeData2.ttl';
const DATA_SCHEMA_NAME = 'nemaline';

type KaplanMeierQueryDraft = {
  resourceUri: string;
  timePath: GraphPath;
  eventPath: GraphPath;
  groupByPath?: GraphPath;
};

function isGraphPath(value: unknown): value is GraphPath {
  return typeof value === 'object' && value !== null && 'start' in value && 'steps' in value;
}

function stringifyQuery(query: KaplanMeierQueryDraft): string {
  return JSON.stringify(query, null, 2);
}

function parseKaplanMeierQueryDraft(queryText: string): {
  draft: KaplanMeierQueryDraft | null;
  error: string | null;
} {
  try {
    const parsed = JSON.parse(queryText) as {
      resourceUri?: unknown;
      timePath?: unknown;
      eventPath?: unknown;
      groupByPath?: unknown;
    };
    if (typeof parsed.resourceUri !== 'string') {
      return { draft: null, error: 'Invalid JSON: "resourceUri" must be a string.' };
    }
    if (!isGraphPath(parsed.timePath)) {
      return { draft: null, error: 'Invalid JSON: "timePath" is missing or malformed.' };
    }
    if (!isGraphPath(parsed.eventPath)) {
      return { draft: null, error: 'Invalid JSON: "eventPath" is missing or malformed.' };
    }
    if (parsed.groupByPath !== undefined && !isGraphPath(parsed.groupByPath)) {
      return { draft: null, error: 'Invalid JSON: "groupByPath" must be a graph path when provided.' };
    }
    return {
      draft: {
        resourceUri: parsed.resourceUri,
        timePath: parsed.timePath,
        eventPath: parsed.eventPath,
        groupByPath: parsed.groupByPath,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { draft: null, error: `Invalid JSON: ${message}` };
  }
}

function createDefaultKaplanMeierQueryDraft(): KaplanMeierQueryDraft {
  const timeShortcut = findGraphPathShortcutByName(DATA_SCHEMA_NAME, 'KaplanMeierTime');
  const eventShortcut = findGraphPathShortcutByName(DATA_SCHEMA_NAME, 'KaplanMeierEvent');
  return {
    resourceUri: DEFAULT_RESOURCE_URI,
    timePath: timeShortcut
      ? instantiateGraphPathShortcut(timeShortcut)
      : ({ start: {}, steps: [] } as unknown as GraphPath),
    eventPath: eventShortcut
      ? instantiateGraphPathShortcut(eventShortcut)
      : ({ start: {}, steps: [] } as unknown as GraphPath),
    groupByPath: undefined,
  };
}

export function KaplanMeierQueryTester() {
  const { fetch } = useSolidAuth();
  const graphPathShortcuts = useMemo(
    () => getGraphPathShortcutsForDataSchema(DATA_SCHEMA_NAME),
    [],
  );
  const [lastValidDraft, setLastValidDraft] = useState<KaplanMeierQueryDraft>(
    createDefaultKaplanMeierQueryDraft,
  );
  const [queryText, setQueryText] = useState<string>(() =>
    stringifyQuery(createDefaultKaplanMeierQueryDraft()),
  );
  const [advancedQueryError, setAdvancedQueryError] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<string>('');
  const [queryError, setQueryError] = useState<string>('');
  const [isSendingQuery, setIsSendingQuery] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const selectedTimeShortcut = resolveGraphPathShortcut(DATA_SCHEMA_NAME, lastValidDraft.timePath);
  const selectedEventShortcut = resolveGraphPathShortcut(DATA_SCHEMA_NAME, lastValidDraft.eventPath);
  const selectedGroupByShortcut = lastValidDraft.groupByPath
    ? resolveGraphPathShortcut(DATA_SCHEMA_NAME, lastValidDraft.groupByPath)
    : null;

  const updateDraft = useCallback((nextDraft: KaplanMeierQueryDraft) => {
    setLastValidDraft(nextDraft);
    setQueryText(stringifyQuery(nextDraft));
    setAdvancedQueryError(null);
  }, []);

  const onResourceUriChange = useCallback((nextResourceUri: string) => {
    updateDraft({
      ...lastValidDraft,
      resourceUri: nextResourceUri,
    });
  }, [lastValidDraft, updateDraft]);

  const onSelectTimeShortcut = useCallback((shortcutName: string) => {
    const shortcut = graphPathShortcuts.find((item) => item.name === shortcutName);
    if (!shortcut) return;
    updateDraft({
      ...lastValidDraft,
      timePath: instantiateGraphPathShortcut(shortcut),
    });
  }, [graphPathShortcuts, lastValidDraft, updateDraft]);

  const onSelectEventShortcut = useCallback((shortcutName: string) => {
    const shortcut = graphPathShortcuts.find((item) => item.name === shortcutName);
    if (!shortcut) return;
    updateDraft({
      ...lastValidDraft,
      eventPath: instantiateGraphPathShortcut(shortcut),
    });
  }, [graphPathShortcuts, lastValidDraft, updateDraft]);

  const onSelectGroupByShortcut = useCallback((shortcutName: string) => {
    if (shortcutName === '__none__') {
      updateDraft({
        ...lastValidDraft,
        groupByPath: undefined,
      });
      return;
    }
    const shortcut = graphPathShortcuts.find((item) => item.name === shortcutName);
    if (!shortcut) return;
    updateDraft({
      ...lastValidDraft,
      groupByPath: instantiateGraphPathShortcut(shortcut),
    });
  }, [graphPathShortcuts, lastValidDraft, updateDraft]);

  const onAdvancedJsonChange = useCallback((nextText: string) => {
    setQueryText(nextText);
    const parsed = parseKaplanMeierQueryDraft(nextText);
    if (parsed.draft) {
      setLastValidDraft(parsed.draft);
      setAdvancedQueryError(null);
    } else {
      setAdvancedQueryError(parsed.error);
    }
  }, []);

  const sendQuery = useCallback(async () => {
    if (isSendingQuery) return;

    let parsedQuery: unknown;
    try {
      parsedQuery = JSON.parse(queryText);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setQueryError(`Invalid JSON: ${message}`);
      setQueryResult('');
      return;
    }

    setIsSendingQuery(true);
    setQueryError('');
    setQueryResult('');
    try {
      const response = await fetch(`${window.location.origin}/.api/stat/kaplan-meier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(parsedQuery),
      });
      const responseText = await response.text();
      let responseBody: unknown = responseText;
      if (responseText) {
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          // Keep raw text response when body is not JSON.
        }
      }
      const renderedResponse =
        typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody, null, 2);
      if (!response.ok) {
        setQueryError(renderedResponse || `Request failed with ${response.status}`);
        setQueryResult('');
        return;
      }
      setQueryResult(renderedResponse || '(empty response)');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setQueryError(message);
      setQueryResult('');
    } finally {
      setIsSendingQuery(false);
    }
  }, [fetch, isSendingQuery, queryText]);

  return (
    <View style={styles.section}>
      <Text variant="h3" style={styles.title}>
        Kaplan-Meier Query Tester
      </Text>
      <Text style={styles.subtitle}>
        Select time/event/group-by graph path shortcuts and a data resource URI, then send an authenticated request to
        {' '}`/.api/stat/kaplan-meier`.
      </Text>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Resource URI</Text>
        <TextInput
          value={lastValidDraft.resourceUri}
          onChangeText={onResourceUriChange}
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
              text={selectedTimeShortcut ? selectedTimeShortcut.name : 'Choose time path'}
              variant="secondary"
              style={styles.shortcutTrigger}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={`time-${shortcut.name}`}
                  onPress={() => onSelectTimeShortcut(shortcut.name)}
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
              text={selectedEventShortcut ? selectedEventShortcut.name : 'Choose event path'}
              variant="secondary"
              style={styles.shortcutTrigger}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={`event-${shortcut.name}`}
                  onPress={() => onSelectEventShortcut(shortcut.name)}
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
              text={selectedGroupByShortcut ? selectedGroupByShortcut.name : 'None'}
              variant="secondary"
              style={styles.shortcutTrigger}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent style={styles.dropdownContent}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              <DropdownMenuItem onPress={() => onSelectGroupByShortcut('__none__')}>
                <Text>None</Text>
              </DropdownMenuItem>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={`group-${shortcut.name}`}
                  onPress={() => onSelectGroupByShortcut(shortcut.name)}
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
          text={isAdvancedOpen ? 'Hide advanced' : 'Advanced'}
          variant="secondary"
          style={styles.advancedButton}
          onPress={() => setIsAdvancedOpen((prev) => !prev)}
        />
      </View>
      {isAdvancedOpen ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Raw query JSON</Text>
          <TextInput
            value={queryText}
            onChangeText={onAdvancedJsonChange}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={styles.input}
          />
        </View>
      ) : null}
      {!!advancedQueryError && (
        <View style={styles.errorBox}>
          <Text style={styles.codeText}>{advancedQueryError}</Text>
        </View>
      )}
      <View style={styles.actions}>
        <Button
          text={isSendingQuery ? 'Sending...' : 'Send'}
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
    borderColor: 'hsl(var(--border))',
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'hsl(var(--card))',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 10,
    color: 'hsl(var(--muted-foreground))',
    fontSize: 13,
  },
  field: {
    marginBottom: 10,
  },
  fieldLabel: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  resourceInput: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'hsl(var(--background))',
    fontSize: 12,
  },
  shortcutTrigger: {
    minWidth: 220,
    maxWidth: 460,
  },
  advancedButton: {
    minWidth: 120,
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
  input: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'hsl(var(--background))',
    fontFamily: 'monospace',
    fontSize: 12,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  errorBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'hsl(0 75% 60%)',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'hsl(0 75% 60% / 0.12)',
  },
  resultBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'hsl(var(--muted) / 0.35)',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
