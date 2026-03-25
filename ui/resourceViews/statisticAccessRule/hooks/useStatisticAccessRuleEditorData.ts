import { useEffect, useMemo, useState } from "react";
import { parseRdf } from "@ldo/ldo";
import { defaultGraph, namedNode, quad } from "@ldo/rdf-utils";
import { useChangeDataset, useResource } from "@ldo/solid-react";
import type {
  DataSchemaJsonView,
  StatisticPolicy,
  StatisticAccessRuleSchemas,
} from "../types";
import {
  buildStatisticAccessRuleTurtle,
  getStatisticAccessRuleTtlUri,
  loadStatisticAccessRule,
} from "../utils/statisticAccessRuleRdf";
import {
  extractPredicateOptions,
} from "../utils/schemaOptions";
import {
  createEmptyGraphPathOptionGetters,
  createGraphPathOptionGetters,
} from "../utils/graphPathOptionResolver";
import { asJsonDataSchema, findDataSchema } from "../dataSchemas";
import { getGraphPathShortcutsForDataSchema } from "../../../graphPathShortcuts";
import { getStatisticAccessRuleSchemasByStatisticPlugin } from "../../../plugin";
import { createDefaultStatisticPolicy } from "../utils/statisticAccessRuleSchemaForm";

function createSnapshot(
  dataSchemaName: string | null,
  statisticPolicies: StatisticPolicy[],
): string {
  return JSON.stringify({ dataSchemaName, statisticPolicies });
}

function getDataSchema(schemaName: string): DataSchemaJsonView {
  const schema = findDataSchema(schemaName);
  if (!schema) {
    throw new Error(`Unknown data schema: ${schemaName}`);
  }
  return asJsonDataSchema(schemaName, schema);
}

export function useStatisticAccessRuleEditorData(
  authFetch: typeof fetch,
  targetUri: string | undefined,
) {
  const statisticAccessRuleUri = useMemo(
    () => (targetUri ? getStatisticAccessRuleTtlUri(targetUri) : undefined),
    [targetUri],
  );
  const statisticAccessRuleResource = useResource(statisticAccessRuleUri);
  const [, setDataset, commitDataset] = useChangeDataset();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statisticAccessRuleSchemas, setStatisticAccessRuleSchemas] =
    useState<StatisticAccessRuleSchemas>(
    {},
  );
  const [dataSchemaName, setDataSchemaName] = useState<string | null>(null);
  const [dataSchema, setDataSchema] = useState<DataSchemaJsonView | null>(null);
  const [statisticPolicies, setStatisticPolicies] = useState<StatisticPolicy[]>([]);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUri) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setInitialSnapshot(null);
    const schemas = getStatisticAccessRuleSchemasByStatisticPlugin();
    setStatisticAccessRuleSchemas(schemas);

    Promise.resolve(loadStatisticAccessRule(authFetch, targetUri, schemas))
      .then((statisticAccessRule) => {
        let loadedDataSchema: DataSchemaJsonView | null = null;
        if (statisticAccessRule.dataSchemaName) {
          loadedDataSchema = getDataSchema(statisticAccessRule.dataSchemaName);
        }
        if (cancelled) return;
        setDataSchemaName(statisticAccessRule.dataSchemaName);
        setDataSchema(loadedDataSchema);
        setStatisticPolicies(statisticAccessRule.statisticPolicies);
        setInitialSnapshot(
          createSnapshot(
            statisticAccessRule.dataSchemaName,
            statisticAccessRule.statisticPolicies,
          ),
        );
        setIsLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authFetch, targetUri]);

  const predicateOptions = useMemo(
    () => extractPredicateOptions(dataSchema),
    [dataSchema],
  );
  const graphPathShortcuts = useMemo(
    () => getGraphPathShortcutsForDataSchema(dataSchemaName),
    [dataSchemaName],
  );
  const emptyGetters = useMemo(() => createEmptyGraphPathOptionGetters(), []);
  const [graphPathGetters, setGraphPathGetters] = useState(emptyGetters);
  useEffect(() => {
    let cancelled = false;
    setGraphPathGetters(emptyGetters);
    Promise.resolve(createGraphPathOptionGetters(dataSchema))
      .then((getters) => {
        if (cancelled) return;
        setGraphPathGetters(getters);
      })
      .catch(() => {
        if (cancelled) return;
        setGraphPathGetters(emptyGetters);
      });
    return () => {
      cancelled = true;
    };
  }, [dataSchema, emptyGetters]);
  const statisticNames = useMemo(
    () => Object.keys(statisticAccessRuleSchemas).sort(),
    [statisticAccessRuleSchemas],
  );
  const currentSnapshot = useMemo(
    () => createSnapshot(dataSchemaName, statisticPolicies),
    [dataSchemaName, statisticPolicies],
  );
  const isDirty = useMemo(
    () => initialSnapshot !== null && currentSnapshot !== initialSnapshot,
    [currentSnapshot, initialSnapshot],
  );

  const addStatisticPolicy = (selectedName?: string) => {
    const selected = selectedName || statisticNames[0];
    if (!selected) return;
    const schema = statisticAccessRuleSchemas[selected];
    if (!schema) return;
    setStatisticPolicies((prev) => [
      ...prev,
      createDefaultStatisticPolicy(selected, schema),
    ]);
  };

  const save = async () => {
    if (!statisticAccessRuleUri) return;
    setIsSaving(true);
    setError(null);
    try {
      const ttl = buildStatisticAccessRuleTurtle(
        dataSchemaName,
        statisticPolicies,
        statisticAccessRuleSchemas,
      );
      const readResult = await statisticAccessRuleResource.read();
      if (readResult.isError) {
        throw new Error(readResult.message);
      }

      const parsedDataset = await parseRdf(ttl, {
        baseIRI: statisticAccessRuleUri,
        format: "Turtle",
      });
      const graph = namedNode(statisticAccessRuleUri);
      const parsedQuads = Array.from(parsedDataset).map((q) =>
        quad(q.subject, q.predicate, q.object, graph),
      );

      setDataset((dataset: {
        deleteMatches: (
          subject?: unknown,
          predicate?: unknown,
          object?: unknown,
          graph?: unknown,
        ) => unknown;
        addAll: (quads: unknown[]) => unknown;
      }) => {
        // Keep non-resource graphs untouched while replacing this resource graph.
        dataset.deleteMatches(undefined, undefined, undefined, graph);
        dataset.deleteMatches(undefined, undefined, undefined, defaultGraph());
        dataset.addAll(parsedQuads);
      });

      const commitResult = await commitDataset();
      if (commitResult.isError) {
        throw new Error(commitResult.message);
      }

      setInitialSnapshot(currentSnapshot);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    statisticAccessRuleUri,
    isLoading,
    isSaving,
    error,
    statisticAccessRuleSchemas,
    dataSchemaName,
    dataSchema,
    statisticPolicies,
    setStatisticPolicies,
    statisticNames,
    predicateOptions,
    graphPathShortcuts,
    getStartPredicateOptions: graphPathGetters.getStartPredicateOptions,
    getStartValueOptions: graphPathGetters.getStartValueOptions,
    getStepPredicateOptions: graphPathGetters.getStepPredicateOptions,
    getStepWherePredicateOptions: graphPathGetters.getStepWherePredicateOptions,
    getStepWhereValueOptions: graphPathGetters.getStepWhereValueOptions,
    getStepTargetShapeNames: graphPathGetters.getStepTargetShapeNames,
    isDirty,
    addStatisticPolicyByName: addStatisticPolicy,
    save,
  };
}

