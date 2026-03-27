import { set } from "@ldo/ldo";
import { useEffect, useMemo, useState } from "react";
import { useChangeSubject, useMatchSubject, useResource } from "@ldo/solid-react";
import {
  KaplanMeierStatisticAccessRuleShapeType,
  MeanStatisticAccessRuleShapeType,
  StatisticAccessRuleDocumentShapeType,
  type GraphLiteralFilter,
  type GraphPath,
  type GraphPredicateFilter,
  type GraphNodeFilter,
  type GraphTraversalStep,
  type GraphValueSelector,
  type KaplanMeierStatisticAccessRule,
  type MeanStatisticAccessRule,
  type StatisticAccessRuleDocument,
  type StatisticPolicy as LdoStatisticPolicy,
} from "@oxfordia/plugins";
import { findDataSchema } from "@oxfordia/plugins/dataPlugin";
import {
  getGraphPathShortcutsForDataSchema,
} from "@oxfordia/plugins/dataPlugin";
import { statisticPlugins } from "@oxfordia/plugins/statisticPlugin";
import type { DataSchemaJsonView } from "../dataSchemas";
import { asJsonDataSchema } from "../dataSchemas";
import {
  createEmptyGraphPathOptionGetters,
  createGraphPathOptionGetters,
  extractPredicateOptions,
} from "../utils/graphPathOptionResolver";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SAR_TYPE =
  "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule";

export type MeanAllowedPathForm = {
  graphPath: GraphPath;
  minCount: number;
};

export type KmAllowedPathForm = {
  timeGraphPath: GraphPath;
  eventGraphPath: GraphPath;
  groupByGraphPaths: GraphPath[];
  kAnonymity: number;
};

export type PolicyFormState =
  | {
      key: string;
      statisticName: "mean";
      allowedPaths: MeanAllowedPathForm[];
    }
  | {
      key: string;
      statisticName: "kaplan-meier";
      allowedPaths: KmAllowedPathForm[];
    };

function toArray<T>(value: Iterable<T> | undefined): T[] {
  if (!value) return [];
  return Array.from(value);
}

export function createEmptyGraphPath(): GraphPath {
  return { start: {} as GraphNodeFilter } as GraphPath;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeNodeId(baseUri: string, prefix: string): string {
  return `${baseUri}#${prefix}-${uid()}`;
}

function ensureGraphPathId(
  baseUri: string,
  graphPath: GraphPath,
  prefix: string,
): GraphPath {
  if (graphPath["@id"]) return graphPath;
  return { ...graphPath, "@id": makeNodeId(baseUri, prefix) };
}

function ensureGraphLiteralFilterIds(
  baseUri: string,
  filter: GraphLiteralFilter,
  prefix: string,
): GraphLiteralFilter {
  return filter["@id"]
    ? filter
    : { ...filter, "@id": makeNodeId(baseUri, prefix) };
}

function ensureGraphValueSelectorIds(
  baseUri: string,
  selector: GraphValueSelector,
  prefix: string,
): GraphValueSelector {
  const selectorWithId = selector["@id"]
    ? selector
    : { ...selector, "@id": makeNodeId(baseUri, prefix) };
  const record = selectorWithId as GraphValueSelector & {
    node?: GraphNodeFilter;
    literal?: GraphLiteralFilter;
  };

  if (record.node) {
    record.node = ensureGraphNodeFilterIds(
      baseUri,
      record.node,
      `${prefix}-node`,
    );
  }
  if (record.literal) {
    record.literal = ensureGraphLiteralFilterIds(
      baseUri,
      record.literal,
      `${prefix}-literal`,
    );
  }

  return record;
}

function ensureGraphPredicateFilterIds(
  baseUri: string,
  filter: GraphPredicateFilter,
  prefix: string,
): GraphPredicateFilter {
  const filterWithId = filter["@id"]
    ? filter
    : { ...filter, "@id": makeNodeId(baseUri, prefix) };
  const record = filterWithId as GraphPredicateFilter & {
    some?: GraphValueSelector;
    every?: GraphValueSelector;
    none?: GraphValueSelector;
  };

  if (record.some) {
    record.some = ensureGraphValueSelectorIds(
      baseUri,
      record.some,
      `${prefix}-some`,
    );
  }
  if (record.every) {
    record.every = ensureGraphValueSelectorIds(
      baseUri,
      record.every,
      `${prefix}-every`,
    );
  }
  if (record.none) {
    record.none = ensureGraphValueSelectorIds(
      baseUri,
      record.none,
      `${prefix}-none`,
    );
  }

  return record;
}

function ensureGraphNodeFilterIds(
  baseUri: string,
  nodeFilter: GraphNodeFilter,
  prefix: string,
): GraphNodeFilter {
  const nodeFilterWithId = nodeFilter["@id"]
    ? nodeFilter
    : { ...nodeFilter, "@id": makeNodeId(baseUri, prefix) };
  const predicates = toArray(nodeFilterWithId.predicates);

  return {
    ...nodeFilterWithId,
    predicates:
      predicates.length > 0
        ? set(
            ...predicates.map((predicate, index) =>
              ensureGraphPredicateFilterIds(
                baseUri,
                predicate,
                `${prefix}-predicate-${index}`,
              ),
            ),
          )
        : nodeFilterWithId.predicates,
  };
}

function ensureGraphTraversalStepIds(
  baseUri: string,
  step: GraphTraversalStep,
  prefix: string,
): GraphTraversalStep {
  const stepWithId = step["@id"]
    ? step
    : { ...step, "@id": makeNodeId(baseUri, prefix) };

  return {
    ...stepWithId,
    where: stepWithId.where
      ? ensureGraphNodeFilterIds(baseUri, stepWithId.where, `${prefix}-where`)
      : stepWithId.where,
  };
}

function ensureGraphPathTreeIds(
  baseUri: string,
  graphPath: GraphPath,
  prefix: string,
): GraphPath {
  const graphPathWithId = ensureGraphPathId(baseUri, graphPath, prefix);
  const steps = toArray(graphPathWithId.steps);

  return {
    ...graphPathWithId,
    start: ensureGraphNodeFilterIds(
      baseUri,
      graphPathWithId.start,
      `${prefix}-start`,
    ),
    steps:
      steps.length > 0
        ? set(
            ...steps.map((step, index) =>
              ensureGraphTraversalStepIds(
                baseUri,
                step,
                `${prefix}-step-${index}`,
              ),
            ),
          )
        : graphPathWithId.steps,
    target: graphPathWithId.target
      ? ensureGraphValueSelectorIds(
          baseUri,
          graphPathWithId.target,
          `${prefix}-target`,
        )
      : graphPathWithId.target,
  };
}

function readPoliciesFromLdo(
  document: StatisticAccessRuleDocument | undefined,
  meanMap: Map<string, MeanStatisticAccessRule>,
  kmMap: Map<string, KaplanMeierStatisticAccessRule>,
): PolicyFormState[] {
  if (!document?.hasStatisticPolicy) return [];
  return toArray(document.hasStatisticPolicy)
    .map((policy): PolicyFormState | null => {
      const id = policy["@id"] ?? uid();
      const name = policy.statisticName;

      if (name === "mean") {
        const mean = meanMap.get(id);
        return {
          key: id,
          statisticName: "mean",
          allowedPaths: mean
            ? toArray(mean.allowedPath).map((p) => ({
                graphPath: p.graphPath ?? createEmptyGraphPath(),
                minCount: p.minCount ?? 1,
              }))
            : [],
        };
      }

      if (name === "kaplan-meier") {
        const km = kmMap.get(id);
        return {
          key: id,
          statisticName: "kaplan-meier",
          allowedPaths: km
            ? toArray(km.allowedPath).map((p) => ({
                timeGraphPath: p.timeGraphPath ?? createEmptyGraphPath(),
                eventGraphPath: p.eventGraphPath ?? createEmptyGraphPath(),
                groupByGraphPaths: p.groupByGraphPath
                  ? toArray(p.groupByGraphPath)
                  : [],
                kAnonymity: p.kAnonymity ?? 1,
              }))
            : [],
        };
      }

      return null;
    })
    .filter((p): p is PolicyFormState => p !== null);
}

function buildPoliciesForWrite(
  baseUri: string,
  policies: PolicyFormState[],
): LdoStatisticPolicy[] {
  return policies.map((policy) => {
    const policyId = policy.key.startsWith("http")
      ? policy.key
      : `${baseUri}#${policy.key}`;

    if (policy.statisticName === "mean") {
      return {
        "@id": policyId,
        statisticName: "mean",
        allowedPath: set(
          ...policy.allowedPaths.map((p) => ({
            "@id": makeNodeId(baseUri, "mean-allowed-path"),
            graphPath: ensureGraphPathTreeIds(
              baseUri,
              p.graphPath,
              "mean-allowed-path-graph-path",
            ),
            minCount: p.minCount,
          })),
        ),
      } as unknown as LdoStatisticPolicy;
    }

    return {
      "@id": policyId,
      statisticName: "kaplan-meier",
      allowedPath: set(
        ...policy.allowedPaths.map((p) => ({
          "@id": makeNodeId(baseUri, "km-allowed-path"),
          timeGraphPath: ensureGraphPathTreeIds(
            baseUri,
            p.timeGraphPath,
            "km-time-graph-path",
          ),
          eventGraphPath: ensureGraphPathTreeIds(
            baseUri,
            p.eventGraphPath,
            "km-event-graph-path",
          ),
          groupByGraphPath:
            p.groupByGraphPaths.length > 0
              ? set(
                  ...p.groupByGraphPaths.map((groupByPath) =>
                    ensureGraphPathTreeIds(
                      baseUri,
                      groupByPath,
                      "km-group-by-graph-path",
                    ),
                  ),
                )
              : undefined,
          kAnonymity: p.kAnonymity,
        })),
      ),
    } as unknown as LdoStatisticPolicy;
  });
}

export function useStatisticAccessRuleEditorData(
  targetUri: string | undefined,
) {
  const resource = useResource(targetUri);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<PolicyFormState[]>([]);
  const [initialJson, setInitialJson] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const matchedDocs = useMatchSubject(
    StatisticAccessRuleDocumentShapeType,
    RDF_TYPE,
    SAR_TYPE,
  );
  const document = useMemo(
    () => toArray(matchedDocs as Iterable<StatisticAccessRuleDocument>)[0],
    [matchedDocs],
  );

  const rootId = useMemo(
    () =>
      document?.["@id"] ?? (targetUri ? `${targetUri}#policy` : undefined),
    [document, targetUri],
  );

  const meanSubjects = useMatchSubject(
    MeanStatisticAccessRuleShapeType,
    undefined,
    undefined,
  );
  const kmSubjects = useMatchSubject(
    KaplanMeierStatisticAccessRuleShapeType,
    undefined,
    undefined,
  );

  const meanMap = useMemo(() => {
    const map = new Map<string, MeanStatisticAccessRule>();
    for (const s of meanSubjects) if (s["@id"]) map.set(s["@id"], s);
    return map;
  }, [meanSubjects]);

  const kmMap = useMemo(() => {
    const map = new Map<string, KaplanMeierStatisticAccessRule>();
    for (const s of kmSubjects) if (s["@id"]) map.set(s["@id"], s);
    return map;
  }, [kmSubjects]);

  const loadedPolicies = useMemo(
    () => readPoliciesFromLdo(document, meanMap, kmMap),
    [document, meanMap, kmMap],
  );

  const dataSchemaName = document?.dataSchema ?? null;
  const dataSchema = useMemo<DataSchemaJsonView | null>(() => {
    if (!dataSchemaName) return null;
    const raw = findDataSchema(dataSchemaName);
    return raw ? asJsonDataSchema(dataSchemaName, raw) : null;
  }, [dataSchemaName]);

  useEffect(() => {
    if (!targetUri) return;
    const snapshot = JSON.stringify(loadedPolicies);
    if (isHydrated && initialJson === snapshot) return;
    setPolicies(loadedPolicies);
    setInitialJson(snapshot);
    setIsHydrated(true);
  }, [initialJson, isHydrated, loadedPolicies, targetUri]);

  const isLoading = !isHydrated;
  const isDirty =
    initialJson !== null && JSON.stringify(policies) !== initialJson;

  const predicateOptions = useMemo(
    () => extractPredicateOptions(dataSchema),
    [dataSchema],
  );
  const graphPathShortcuts = useMemo(
    () => getGraphPathShortcutsForDataSchema(dataSchemaName),
    [dataSchemaName],
  );
  const emptyGetters = useMemo(
    () => createEmptyGraphPathOptionGetters(),
    [],
  );
  const [graphPathGetters, setGraphPathGetters] = useState(emptyGetters);
  useEffect(() => {
    let cancelled = false;
    setGraphPathGetters(emptyGetters);
    createGraphPathOptionGetters(dataSchema)
      .then((getters) => {
        if (!cancelled) setGraphPathGetters(getters);
      })
      .catch(() => {
        if (!cancelled) setGraphPathGetters(emptyGetters);
      });
    return () => {
      cancelled = true;
    };
  }, [dataSchema, emptyGetters]);

  const statisticNames = useMemo(
    () => statisticPlugins.map((p) => p.name).sort(),
    [],
  );

  const [, setDoc, commitDoc] = useChangeSubject(
    StatisticAccessRuleDocumentShapeType,
    rootId,
  );

  const addPolicy = (name: string) => {
    if (name === "mean") {
      setPolicies((prev) => [
        ...prev,
        { key: uid(), statisticName: "mean", allowedPaths: [] },
      ]);
    } else if (name === "kaplan-meier") {
      setPolicies((prev) => [
        ...prev,
        { key: uid(), statisticName: "kaplan-meier", allowedPaths: [] },
      ]);
    }
  };

  const save = async () => {
    if (!targetUri || !rootId || !resource) return;
    setIsSaving(true);
    setError(null);
    try {
      const policyData = buildPoliciesForWrite(targetUri, policies);
      setDoc(
        resource,
        (doc: StatisticAccessRuleDocument) => {
          doc.type = set({ "@id": "StatisticAccessRule" });
          doc.dataSchema = dataSchemaName ?? "nemaline";
          doc.hasStatisticPolicy = set(...policyData);
        },
        document ??
          ({
            "@id": rootId,
            type: set({ "@id": "StatisticAccessRule" }),
            dataSchema: dataSchemaName ?? "nemaline",
          } as StatisticAccessRuleDocument),
      );

      const result = await commitDoc();
      if (result.isError) throw new Error(result.message);
      setInitialJson(JSON.stringify(policies));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    error,
    isDirty,
    dataSchemaName,
    policies,
    setPolicies,
    statisticNames,
    addPolicy,
    save,
    predicateOptions,
    graphPathShortcuts,
    ...graphPathGetters,
  };
}
