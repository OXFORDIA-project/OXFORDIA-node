import { set } from "@ldo/ldo";
import { useEffect, useMemo, useState } from "react";
import { useChangeSubject, useMatchSubject, useResource } from "@ldo/solid-react";
import {
  StatisticAccessRuleDocumentShapeType,
  type GraphLiteralFilter,
  type GraphNodeFilter,
  type GraphPath,
  type GraphPredicateFilter,
  type GraphTraversalStep,
  type GraphValueSelector,
  type KaplanMeierAllowedPath,
  type MeanAllowedPath,
  type StatisticAccessRuleDocument,
  type StatisticPolicy as LdoStatisticPolicy,
} from "@oxfordia/plugins";
import { findDataSchema, getGraphPathShortcutsForDataSchema } from "@oxfordia/plugins/dataPlugin";
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

export type EditorPolicy =
  | {
      key: string;
      statisticName: "mean";
      allowedPaths: MeanAllowedPath[];
    }
  | {
      key: string;
      statisticName: "kaplan-meier";
      allowedPaths: KaplanMeierAllowedPath[];
    };

function toArray<T>(value: Iterable<T> | undefined): T[] {
  if (!value) return [];
  return Array.from(value);
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createLocalNodeId(prefix: string): string {
  return `#${createId(prefix)}`;
}

export function createEmptyGraphPath(): GraphPath {
  return ensureGraphPathIds({
    "@id": createLocalNodeId("graph-path"),
    start: {
      "@id": createLocalNodeId("graph-node-filter"),
    } as GraphNodeFilter,
  } as GraphPath);
}

function ensureGraphLiteralFilterIds(
  filter: GraphLiteralFilter,
): GraphLiteralFilter {
  filter["@id"] = filter["@id"] ?? createLocalNodeId("graph-literal-filter");
  return filter;
}

function ensureGraphValueSelectorIds(
  selector: GraphValueSelector,
): GraphValueSelector {
  const record = selector as GraphValueSelector & {
    node?: GraphNodeFilter;
    literal?: GraphLiteralFilter;
  };

  record["@id"] = record["@id"] ?? createLocalNodeId("graph-value-selector");
  if (record.node) ensureGraphNodeFilterIds(record.node);
  if (record.literal) ensureGraphLiteralFilterIds(record.literal);
  return selector;
}

function ensureGraphPredicateFilterIds(
  filter: GraphPredicateFilter,
): GraphPredicateFilter {
  filter["@id"] = filter["@id"] ?? createLocalNodeId("graph-predicate-filter");
  if (filter.some) ensureGraphValueSelectorIds(filter.some);
  if (filter.every) ensureGraphValueSelectorIds(filter.every);
  if (filter.none) ensureGraphValueSelectorIds(filter.none);
  return filter;
}

function ensureGraphNodeFilterIds(
  nodeFilter: GraphNodeFilter,
): GraphNodeFilter {
  nodeFilter["@id"] = nodeFilter["@id"] ?? createLocalNodeId("graph-node-filter");
  for (const predicate of toArray(nodeFilter.predicates)) {
    ensureGraphPredicateFilterIds(predicate);
  }
  return nodeFilter;
}

function ensureGraphTraversalStepIds(
  step: GraphTraversalStep,
): GraphTraversalStep {
  step["@id"] = step["@id"] ?? createLocalNodeId("graph-traversal-step");
  if (step.where) ensureGraphNodeFilterIds(step.where);
  return step;
}

export function ensureGraphPathIds(graphPath: GraphPath): GraphPath {
  graphPath["@id"] = graphPath["@id"] ?? createLocalNodeId("graph-path");
  ensureGraphNodeFilterIds(graphPath.start);
  for (const step of toArray(graphPath.steps)) {
    ensureGraphTraversalStepIds(step);
  }
  if (graphPath.target) ensureGraphValueSelectorIds(graphPath.target);
  return graphPath;
}

function createInitialDocument(
  rootId: string,
  dataSchemaName: string,
): StatisticAccessRuleDocument {
  return {
    "@id": rootId,
    type: set({ "@id": "StatisticAccessRule" }),
    dataSchema: dataSchemaName,
    hasStatisticPolicy: set(),
  };
}

function createMeanPolicy(): LdoStatisticPolicy {
  return {
    "@id": `#${createId("mean-policy")}`,
    statisticName: "mean",
    allowedPath: set(),
  } as unknown as LdoStatisticPolicy;
}

function createKaplanMeierPolicy(): LdoStatisticPolicy {
  return {
    "@id": `#${createId("kaplan-meier-policy")}`,
    statisticName: "kaplan-meier",
    allowedPath: set(),
  } as unknown as LdoStatisticPolicy;
}

function createMeanAllowedPath(): MeanAllowedPath {
  return {
    "@id": `#${createId("mean-allowed-path")}`,
    graphPath: ensureGraphPathIds(createEmptyGraphPath()),
    minCount: 1,
  };
}

function createKaplanMeierAllowedPath(): KaplanMeierAllowedPath {
  return {
    "@id": `#${createId("kaplan-meier-allowed-path")}`,
    timeGraphPath: ensureGraphPathIds(createEmptyGraphPath()),
    eventGraphPath: ensureGraphPathIds(createEmptyGraphPath()),
    groupByGraphPath: set(),
    kAnonymity: 1,
  };
}

function readPoliciesFromLdo(
  document: StatisticAccessRuleDocument | undefined,
): EditorPolicy[] {
  if (!document?.hasStatisticPolicy) return [];

  return toArray(document.hasStatisticPolicy)
    .map((policy): EditorPolicy | null => {
      const key = policy["@id"];
      if (!key) return null;

      if (policy.statisticName === "mean") {
        const meanPolicy = policy as unknown as {
          allowedPath?: Iterable<MeanAllowedPath>;
        };
        return {
          key,
          statisticName: "mean",
          allowedPaths: toArray(meanPolicy.allowedPath),
        };
      }

      if (policy.statisticName === "kaplan-meier") {
        const kmPolicy = policy as unknown as {
          allowedPath?: Iterable<KaplanMeierAllowedPath>;
        };
        return {
          key,
          statisticName: "kaplan-meier",
          allowedPaths: toArray(kmPolicy.allowedPath),
        };
      }

      return null;
    })
    .filter((policy): policy is EditorPolicy => Boolean(policy));
}

export function useStatisticAccessRuleEditorData(
  targetUri: string | undefined,
) {
  const resource = useResource(targetUri);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackRootId = useMemo(
    () => (targetUri ? `${targetUri}#policy` : undefined),
    [targetUri],
  );

  const matchedDocs = useMatchSubject(
    StatisticAccessRuleDocumentShapeType,
    RDF_TYPE,
    SAR_TYPE,
  );
  const matchedDocument = useMemo(() => {
    const docs = toArray(matchedDocs as Iterable<StatisticAccessRuleDocument>);
    if (!fallbackRootId) return docs[0];
    return docs.find((doc) => doc["@id"] === fallbackRootId) ?? docs[0];
  }, [fallbackRootId, matchedDocs]);

  const rootId = matchedDocument?.["@id"] ?? fallbackRootId;
  const [draftDocument, setDoc, commitDoc] = useChangeSubject(
    StatisticAccessRuleDocumentShapeType,
    rootId,
  );
  const document = draftDocument ?? matchedDocument;

  const dataSchemaName = document?.dataSchema ?? null;
  const dataSchema = useMemo<DataSchemaJsonView | null>(() => {
    if (!dataSchemaName) return null;
    const raw = findDataSchema(dataSchemaName);
    return raw ? asJsonDataSchema(dataSchemaName, raw) : null;
  }, [dataSchemaName]);

  const policies = useMemo(
    () => readPoliciesFromLdo(document),
    [document],
  );

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
    () => statisticPlugins.map((plugin) => plugin.name).sort(),
    [],
  );

  const applyDocumentChange = (
    change: (doc: StatisticAccessRuleDocument) => void,
  ) => {
    if (!resource || !rootId) return;

    setError(null);
    setDoc(
      resource,
      (doc: StatisticAccessRuleDocument) => {
        doc.type = set({ "@id": "StatisticAccessRule" });
        doc.dataSchema = doc.dataSchema ?? dataSchemaName ?? "nemaline";
        if (!doc.hasStatisticPolicy) doc.hasStatisticPolicy = set();
        change(doc);
      },
      document ?? createInitialDocument(rootId, dataSchemaName ?? "nemaline"),
    );
  };

  const updatePolicy = (
    policyId: string,
    change: (policy: LdoStatisticPolicy) => LdoStatisticPolicy,
  ) => {
    applyDocumentChange((doc) => {
      const policiesToWrite = toArray(doc.hasStatisticPolicy).map((policy) =>
        policy["@id"] === policyId ? change(policy as unknown as LdoStatisticPolicy) : policy,
      );
      doc.hasStatisticPolicy = set(...policiesToWrite);
    });
  };

  const addPolicy = (name: string) => {
    applyDocumentChange((doc) => {
      const existingPolicies = toArray(doc.hasStatisticPolicy);
      const nextPolicy =
        name === "mean"
          ? createMeanPolicy()
          : name === "kaplan-meier"
            ? createKaplanMeierPolicy()
            : null;
      if (!nextPolicy) return;
      doc.hasStatisticPolicy = set(...existingPolicies, nextPolicy);
    });
  };

  const removePolicy = (policyId: string) => {
    applyDocumentChange((doc) => {
      doc.hasStatisticPolicy = set(
        ...toArray(doc.hasStatisticPolicy).filter(
          (policy) => policy["@id"] !== policyId,
        ),
      );
    });
  };

  const addMeanAllowedPath = (policyId: string) => {
    updatePolicy(policyId, (policy) => {
      const meanPolicy = policy as unknown as {
        allowedPath?: Iterable<MeanAllowedPath>;
      } & LdoStatisticPolicy;
      return {
        ...meanPolicy,
        allowedPath: set(...toArray(meanPolicy.allowedPath), createMeanAllowedPath()),
      } as unknown as LdoStatisticPolicy;
    });
  };

  const updateMeanAllowedPath = (
    policyId: string,
    pathIndex: number,
    nextPath: MeanAllowedPath,
  ) => {
    updatePolicy(policyId, (policy) => {
      const meanPolicy = policy as unknown as {
        allowedPath?: Iterable<MeanAllowedPath>;
      } & LdoStatisticPolicy;
      return {
        ...meanPolicy,
        allowedPath: set(
          ...toArray(meanPolicy.allowedPath).map((path, index) =>
            index === pathIndex ? nextPath : path,
          ),
        ),
      } as unknown as LdoStatisticPolicy;
    });
  };

  const removeMeanAllowedPath = (policyId: string, pathIndex: number) => {
    updatePolicy(policyId, (policy) => {
      const meanPolicy = policy as unknown as {
        allowedPath?: Iterable<MeanAllowedPath>;
      } & LdoStatisticPolicy;
      return {
        ...meanPolicy,
        allowedPath: set(
          ...toArray(meanPolicy.allowedPath).filter((_, index) => index !== pathIndex),
        ),
      } as unknown as LdoStatisticPolicy;
    });
  };

  const addKaplanMeierAllowedPath = (policyId: string) => {
    updatePolicy(policyId, (policy) => {
      const kmPolicy = policy as unknown as {
        allowedPath?: Iterable<KaplanMeierAllowedPath>;
      } & LdoStatisticPolicy;
      return {
        ...kmPolicy,
        allowedPath: set(
          ...toArray(kmPolicy.allowedPath),
          createKaplanMeierAllowedPath(),
        ),
      } as unknown as LdoStatisticPolicy;
    });
  };

  const updateKaplanMeierAllowedPath = (
    policyId: string,
    pathIndex: number,
    nextPath: KaplanMeierAllowedPath,
  ) => {
    updatePolicy(policyId, (policy) => {
      const kmPolicy = policy as unknown as {
        allowedPath?: Iterable<KaplanMeierAllowedPath>;
      } & LdoStatisticPolicy;
      return {
        ...kmPolicy,
        allowedPath: set(
          ...toArray(kmPolicy.allowedPath).map((path, index) =>
            index === pathIndex ? nextPath : path,
          ),
        ),
      } as unknown as LdoStatisticPolicy;
    });
  };

  const removeKaplanMeierAllowedPath = (
    policyId: string,
    pathIndex: number,
  ) => {
    updatePolicy(policyId, (policy) => {
      const kmPolicy = policy as unknown as {
        allowedPath?: Iterable<KaplanMeierAllowedPath>;
      } & LdoStatisticPolicy;
      return {
        ...kmPolicy,
        allowedPath: set(
          ...toArray(kmPolicy.allowedPath).filter((_, index) => index !== pathIndex),
        ),
      } as unknown as LdoStatisticPolicy;
    });
  };

  const save = async () => {
    if (!resource || !rootId) return;

    setIsSaving(true);
    setError(null);
    try {
      const result = await commitDoc();
      if (result.isError) throw new Error(result.message);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading: false,
    isSaving,
    error,
    dataSchemaName,
    policies,
    statisticNames,
    addPolicy,
    removePolicy,
    addMeanAllowedPath,
    updateMeanAllowedPath,
    removeMeanAllowedPath,
    addKaplanMeierAllowedPath,
    updateKaplanMeierAllowedPath,
    removeKaplanMeierAllowedPath,
    save,
    predicateOptions,
    graphPathShortcuts,
    ...graphPathGetters,
  };
}
