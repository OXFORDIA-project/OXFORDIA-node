import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSolidAuth } from '@ldo/solid-react';
import { CircleAlert } from 'lucide-react-native';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Code,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Separator,
  Text,
} from 'linked-data-browser';
import type { GraphPath } from '@oxfordia/stat-plugin_core';
import {
  findGraphPathShortcutByName,
  getGraphPathShortcutsForDataSchema,
  resolveGraphPathShortcut,
} from '@oxfordia/data-plugin_core';
import { nemalineDataPlugin } from '@oxfordia/data-plugin-nemaline_core';
import { QueryTextEditor, QueryTextOutput } from './QueryTextSurface';

const DEFAULT_RESOURCE_URI = 'http://localhost:3000/admin/FakeData2.ttl';
const DATA_SCHEMA_NAME = 'nemaline';
const MEAN_ENDPOINT = '/.api/stat/mean';

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
  const [lastValidDraft, setLastValidDraft] = useState<MeanQueryDraft>(
    createDefaultMeanQueryDraft,
  );
  const [meanQueryText, setMeanQueryText] = useState<string>(() =>
    stringifyQuery(createDefaultMeanQueryDraft()),
  );
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
  const shortcutLabel = selectedShortcut ? selectedShortcut.name : 'Custom path';

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
      const response = await fetch(`${window.location.origin}${MEAN_ENDPOINT}`, {
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
    <Card style={styles.card}>
      <CardHeader style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <CardTitle>Mean Query Tester</CardTitle>
            <CardDescription>
              Send an authenticated request to <Code>{MEAN_ENDPOINT}</Code> using a
              nemaline shortcut or a hand-edited graph path.
            </CardDescription>
          </View>
          <View style={styles.badgeRow}>
            <Badge variant="secondary">
              <Text>{graphPathShortcuts.length} shortcuts</Text>
            </Badge>
            <Badge variant="outline">
              <Text>{shortcutLabel}</Text>
            </Badge>
          </View>
        </View>
      </CardHeader>
      <CardContent style={styles.content}>
        <View style={styles.field}>
          <Text size="sm" bold>
            Resource URI
          </Text>
          <Input
            value={lastValidDraft.resourceUri}
            onChangeText={onResourceUriChange}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          <Text size="xs" muted style={styles.helperText}>
            Target the uploaded nemaline RDF document you want to query.
          </Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Text size="sm" bold>
              Graph path shortcut
            </Text>
            <Badge variant="outline">
              <Text>{shortcutLabel}</Text>
            </Badge>
          </View>
          <View style={styles.shortcutRow}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button text={shortcutLabel} variant="secondary" style={styles.shortcutTrigger} />
              </DropdownMenuTrigger>
              <DropdownMenuContent style={styles.dropdownContent}>
                <DropdownMenuLabel>Nemaline shortcuts</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
              text={isAdvancedOpen ? 'Hide advanced JSON' : 'Edit JSON'}
              variant="outline"
              style={styles.advancedButton}
              onPress={() => setIsAdvancedOpen((prev) => !prev)}
            />
          </View>
          <Text size="xs" muted style={styles.helperText}>
            Shortcut selection keeps the request aligned with the built-in nemaline paths.
          </Text>
        </View>

        {isAdvancedOpen ? (
          <>
            <Separator style={styles.separator} />
            <View style={styles.field}>
              <View style={styles.fieldHeader}>
                <Text size="sm" bold>
                  Raw query JSON
                </Text>
                <Badge variant={advancedQueryError ? 'destructive' : 'outline'}>
                  <Text>{advancedQueryError ? 'Invalid JSON' : 'In sync'}</Text>
                </Badge>
              </View>
              <QueryTextEditor
                value={meanQueryText}
                onChangeText={onAdvancedJsonChange}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                style={styles.codeInput}
              />
              <Text size="xs" muted style={styles.helperText}>
                Edit <Code>resourceUri</Code> and <Code>graphPath</Code> directly when a
                shortcut is not enough.
              </Text>
            </View>
          </>
        ) : null}

        {!!advancedQueryError && (
          <Alert icon={CircleAlert} variant="destructive">
            <AlertTitle>Advanced JSON is invalid</AlertTitle>
            <AlertDescription>{advancedQueryError}</AlertDescription>
          </Alert>
        )}

        <Separator style={styles.separator} />

        {!!meanQueryError && (
          <Alert icon={CircleAlert} variant="destructive">
            <AlertTitle>Mean query failed</AlertTitle>
            <AlertDescription>{meanQueryError}</AlertDescription>
          </Alert>
        )}

        {!!meanQueryResult && (
          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text size="sm" bold>
                Raw response
              </Text>
              <Badge variant="outline">
                <Text>JSON</Text>
              </Badge>
            </View>
            <QueryTextOutput
              value={meanQueryResult}
              style={styles.outputInput}
              textStyle={styles.codeText}
            />
          </View>
        )}
      </CardContent>
      <CardFooter style={styles.footer}>
        <Button
          text={isSendingMeanQuery ? 'Sending…' : 'Send mean query'}
          variant="secondary"
          onPress={sendMeanQuery}
        />
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerCopy: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    gap: 14,
  },
  field: {
    gap: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  helperText: {
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
    minWidth: 148,
  },
  dropdownContent: {
    maxHeight: 320,
    minWidth: 280,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  codeInput: {
    minHeight: 180,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: 'top',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  separator: {},
  outputInput: {
    minHeight: 160,
  },
  footer: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
});
