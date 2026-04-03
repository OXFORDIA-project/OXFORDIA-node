import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { QueryTextOutput } from './QueryTextSurface';

const DEFAULT_RESOURCE_URI = 'http://localhost:3000/admin/FakeData2.ttl';
const DATA_SCHEMA_NAME = 'nemaline';
const GROUP_BY_NONE = '__none__';
const KAPLAN_MEIER_ENDPOINT = '/.api/stat/kaplan-meier';

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
    'KaplanMeierTime',
  );
  const eventShortcut = findGraphPathShortcutByName(
    [nemalineDataPlugin],
    DATA_SCHEMA_NAME,
    'KaplanMeierEvent',
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
  const [queryResult, setQueryResult] = useState<string>('');
  const [queryError, setQueryError] = useState<string>('');
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
    (field: 'timePath' | 'eventPath' | 'groupByPath', shortcutName: string) => {
      if (field === 'groupByPath' && shortcutName === GROUP_BY_NONE) {
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
    setQueryError('');
    setQueryResult('');
    try {
      const response = await fetch(`${window.location.origin}${KAPLAN_MEIER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
        typeof responseBody === 'string'
          ? responseBody
          : JSON.stringify(responseBody, null, 2);
      if (!response.ok) {
        setQueryError(rendered || `Request failed with ${response.status}`);
        return;
      }
      setQueryResult(rendered || '(empty response)');
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSendingQuery(false);
    }
  }, [fetch, isSendingQuery, queryDraft]);

  return (
    <Card style={styles.card}>
      <CardHeader style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <CardTitle>Kaplan-Meier Observations Tester</CardTitle>
            <CardDescription>
              Send <Code>timePath</Code>, <Code>eventPath</Code>, and an optional
              <Code> groupByPath</Code> to <Code>{KAPLAN_MEIER_ENDPOINT}</Code>.
            </CardDescription>
          </View>
          <Badge variant="secondary">
            <Text>{graphPathShortcuts.length} shortcuts</Text>
          </Badge>
        </View>
      </CardHeader>
      <CardContent style={styles.content}>
        <View style={styles.field}>
          <Text size="sm" bold>
            Resource URI
          </Text>
          <Input
            value={queryDraft.resourceUri}
            onChangeText={(resourceUri) =>
              setQueryDraft((prev) => ({ ...prev, resourceUri }))
            }
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          <Text size="xs" muted style={styles.helperText}>
            Point this at the nemaline RDF document that should drive the Kaplan-Meier query.
          </Text>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Text size="sm" bold>
              Time path shortcut
            </Text>
            <Badge variant="outline">
              <Text>{selectedTimeShortcut ? selectedTimeShortcut.name : 'Choose time path'}</Text>
            </Badge>
          </View>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                text={selectedTimeShortcut ? selectedTimeShortcut.name : 'Choose time path'}
                variant="secondary"
                style={styles.shortcutTrigger}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent style={styles.dropdownContent}>
              <DropdownMenuLabel>Nemaline shortcuts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                {graphPathShortcuts.map((shortcut) => (
                  <DropdownMenuItem
                    key={`time-${shortcut.name}`}
                    onPress={() => onSelectShortcut('timePath', shortcut.name)}
                  >
                    <Text>{shortcut.name}</Text>
                  </DropdownMenuItem>
                ))}
              </ScrollView>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Text size="sm" bold>
              Event path shortcut
            </Text>
            <Badge variant="outline">
              <Text>{selectedEventShortcut ? selectedEventShortcut.name : 'Choose event path'}</Text>
            </Badge>
          </View>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                text={selectedEventShortcut ? selectedEventShortcut.name : 'Choose event path'}
                variant="secondary"
                style={styles.shortcutTrigger}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent style={styles.dropdownContent}>
              <DropdownMenuLabel>Nemaline shortcuts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                {graphPathShortcuts.map((shortcut) => (
                  <DropdownMenuItem
                    key={`event-${shortcut.name}`}
                    onPress={() => onSelectShortcut('eventPath', shortcut.name)}
                  >
                    <Text>{shortcut.name}</Text>
                  </DropdownMenuItem>
                ))}
              </ScrollView>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Text size="sm" bold>
              Group-by path shortcut
            </Text>
            <Badge variant={selectedGroupByShortcut ? 'outline' : 'secondary'}>
              <Text>{selectedGroupByShortcut ? selectedGroupByShortcut.name : 'Optional'}</Text>
            </Badge>
          </View>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                text={selectedGroupByShortcut ? selectedGroupByShortcut.name : 'None'}
                variant="secondary"
                style={styles.shortcutTrigger}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent style={styles.dropdownContent}>
              <DropdownMenuLabel>Group-by shortcuts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                <DropdownMenuItem onPress={() => onSelectShortcut('groupByPath', GROUP_BY_NONE)}>
                  <Text>None</Text>
                </DropdownMenuItem>
                {graphPathShortcuts.map((shortcut) => (
                  <DropdownMenuItem
                    key={`group-${shortcut.name}`}
                    onPress={() => onSelectShortcut('groupByPath', shortcut.name)}
                  >
                    <Text>{shortcut.name}</Text>
                  </DropdownMenuItem>
                ))}
              </ScrollView>
            </DropdownMenuContent>
          </DropdownMenu>
          <Text size="xs" muted style={styles.helperText}>
            Category-style shortcuts usually make the most sense for grouping, but the tester
            leaves the full shortcut list available.
          </Text>
        </View>

        <Separator style={styles.separator} />

        {!!queryError && (
          <Alert icon={CircleAlert} variant="destructive">
            <AlertTitle>Kaplan-Meier query failed</AlertTitle>
            <AlertDescription>{queryError}</AlertDescription>
          </Alert>
        )}

        {!!queryResult && (
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
              value={queryResult}
              style={styles.outputInput}
              textStyle={styles.codeText}
            />
          </View>
        )}
      </CardContent>
      <CardFooter style={styles.footer}>
        <Button
          text={isSendingQuery ? 'Sending…' : 'Send Kaplan-Meier query'}
          variant="secondary"
          onPress={sendQuery}
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
  separator: {},
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  outputInput: {
    minHeight: 160,
  },
  footer: {
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
});
