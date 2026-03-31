import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from 'linked-data-browser';
import { useSolidAuth } from '@ldo/solid-react';
import type { GraphPath } from '@oxfordia/stat-plugin_core';
import {
  findGraphPathShortcutByName,
  getGraphPathShortcutsForDataSchema,
  resolveGraphPathShortcut,
} from '@oxfordia/data-plugin_core';
import { nemalineDataPlugin } from '@oxfordia/data-plugin-nemaline_core';

const DEFAULT_RESOURCE_URI = 'http://localhost:3000/admin/FakeData2.ttl';
const DATA_SCHEMA_NAME = 'nemaline';

type MeanQueryDraft = {
  resourceUri: string;
  graphPath: GraphPath;
};

function isGraphPath(value: unknown): value is GraphPath {
  return (
    typeof value === 'object' &&
    value !== null &&
    'start' in value &&
    'steps' in value
  );
}

function stringifyQuery(query: MeanQueryDraft): string {
  return JSON.stringify(query, null, 2);
}

function parseMeanQueryDraft(queryText: string): {
  draft: MeanQueryDraft | null;
  error: string | null;
} {
  try {
    const parsed = JSON.parse(queryText) as {
      resourceUri?: unknown;
      graphPath?: unknown;
    };
    if (typeof parsed.resourceUri !== 'string') {
      return { draft: null, error: 'Invalid JSON: "resourceUri" must be a string.' };
    }
    if (!isGraphPath(parsed.graphPath)) {
      return { draft: null, error: 'Invalid JSON: "graphPath" is missing or malformed.' };
    }
    return {
      draft: {
        resourceUri: parsed.resourceUri,
        graphPath: parsed.graphPath,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { draft: null, error: `Invalid JSON: ${message}` };
  }
}

function createDefaultMeanQueryDraft(): MeanQueryDraft {
  const baselineAgeShortcut = findGraphPathShortcutByName(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    'BaselineAge',
  );
  if (baselineAgeShortcut) {
    return {
      resourceUri: DEFAULT_RESOURCE_URI,
      graphPath: baselineAgeShortcut.graphPath,
    };
  }
  return {
    resourceUri: DEFAULT_RESOURCE_URI,
    graphPath: {
      start: {
        predicates: [
          {
            predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
            some: {
              node: {
                iri: 'https://w3id.org/semanticarts/ns/ontology/gist/Person',
              },
            },
          },
        ],
      },
      steps: [
        {
          via: 'https://w3id.org/semanticarts/ns/ontology/gist/hasMagnitude',
          where: {
            predicates: [
              {
                predicate: 'https://w3id.org/semanticarts/ns/ontology/gist/hasAspect',
                some: {
                  node: {
                    iri: 'https://w3id.org/semanticarts/ns/ontology/gist/Aspect_Age',
                  },
                },
              },
            ],
          },
        },
        {
          via: 'https://w3id.org/semanticarts/ns/ontology/gist/numericValue',
        },
      ],
    } as unknown as GraphPath,
  };
}

export function MeanQueryTester() {
  const { fetch } = useSolidAuth();
  const graphPathShortcuts = useMemo(
    () => getGraphPathShortcutsForDataSchema([nemalineDataPlugin], DATA_SCHEMA_NAME),
    [],
  );
  const [lastValidDraft, setLastValidDraft] = useState<MeanQueryDraft>(createDefaultMeanQueryDraft);
  const [meanQueryText, setMeanQueryText] = useState<string>(() => stringifyQuery(createDefaultMeanQueryDraft()));
  const [advancedQueryError, setAdvancedQueryError] = useState<string | null>(null);
  const [meanQueryResult, setMeanQueryResult] = useState<string>('');
  const [meanQueryError, setMeanQueryError] = useState<string>('');
  const [isSendingMeanQuery, setIsSendingMeanQuery] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const selectedShortcut = resolveGraphPathShortcut(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    lastValidDraft.graphPath,
  );
  const shortcutLabel = selectedShortcut ? selectedShortcut.name : 'Choose path';

  const updateDraft = useCallback((nextDraft: MeanQueryDraft) => {
    setLastValidDraft(nextDraft);
    setMeanQueryText(stringifyQuery(nextDraft));
    setAdvancedQueryError(null);
  }, []);

  const onResourceUriChange = useCallback((nextResourceUri: string) => {
    updateDraft({
      ...lastValidDraft,
      resourceUri: nextResourceUri,
    });
  }, [lastValidDraft, updateDraft]);

  const onSelectShortcut = useCallback((shortcutName: string) => {
    const shortcut = graphPathShortcuts.find((item) => item.name === shortcutName);
    if (!shortcut) return;
    updateDraft({
      ...lastValidDraft,
      graphPath: shortcut.graphPath,
    });
  }, [graphPathShortcuts, lastValidDraft, updateDraft]);

  const onAdvancedJsonChange = useCallback((nextText: string) => {
    setMeanQueryText(nextText);
    const parsed = parseMeanQueryDraft(nextText);
    if (parsed.draft) {
      setLastValidDraft(parsed.draft);
      setAdvancedQueryError(null);
    } else {
      setAdvancedQueryError(parsed.error);
    }
  }, []);

  const sendMeanQuery = useCallback(async () => {
    if (isSendingMeanQuery) return;

    let parsedQuery: unknown;
    try {
      parsedQuery = JSON.parse(meanQueryText);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMeanQueryError(`Invalid JSON: ${message}`);
      setMeanQueryResult('');
      return;
    }

    setIsSendingMeanQuery(true);
    setMeanQueryError('');
    setMeanQueryResult('');
    try {
      const response = await fetch(`${window.location.origin}/.api/stat/mean`, {
        method: "POST",
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
        typeof responseBody === 'string'
          ? responseBody
          : JSON.stringify(responseBody, null, 2);
      if (!response.ok) {
        setMeanQueryError(renderedResponse || `Request failed with ${response.status}`);
        setMeanQueryResult('');
        return;
      }
      setMeanQueryResult(renderedResponse || '(empty response)');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMeanQueryError(message);
      setMeanQueryResult('');
    } finally {
      setIsSendingMeanQuery(false);
    }
  }, [fetch, isSendingMeanQuery, meanQueryText]);

  return (
    <View style={styles.section}>
      <Text variant="h3" style={styles.title}>
        Mean Query Tester
      </Text>
      <Text style={styles.subtitle}>
        Select a nemaline graph path shortcut and data resource URI, then send an authenticated request to
        {' '}`/.api/stat/mean`.
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
        <Text style={styles.fieldLabel}>Graph path shortcut</Text>
        <View style={styles.shortcutRow}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button text={shortcutLabel} variant="secondary" style={styles.shortcutTrigger} />
            </DropdownMenuTrigger>
            <DropdownMenuContent style={styles.dropdownContent}>
              {graphPathShortcuts.map((shortcut) => (
                <DropdownMenuItem
                  key={shortcut.name}
                  onPress={() => onSelectShortcut(shortcut.name)}
                >
                  <Text>{shortcut.name}</Text>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            text={isAdvancedOpen ? 'Hide advanced' : 'Advanced'}
            variant="secondary"
            style={styles.advancedButton}
            onPress={() => setIsAdvancedOpen((prev) => !prev)}
          />
        </View>
      </View>
      {isAdvancedOpen ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Raw query JSON</Text>
          <TextInput
            value={meanQueryText}
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
          text={isSendingMeanQuery ? 'Sending...' : 'Send'}
          variant="secondary"
          onPress={sendMeanQuery}
        />
      </View>
      {!!meanQueryError && (
        <View style={styles.errorBox}>
          <Text style={styles.codeText}>{meanQueryError}</Text>
        </View>
      )}
      {!!meanQueryResult && (
        <View style={styles.resultBox}>
          <Text style={styles.codeText}>{meanQueryResult}</Text>
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
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
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
