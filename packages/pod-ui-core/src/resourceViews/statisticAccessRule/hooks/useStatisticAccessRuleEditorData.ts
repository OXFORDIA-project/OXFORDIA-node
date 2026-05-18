import { set } from "@ldo/ldo";
import { useEffect, useMemo, useState } from "react";
import { useChangeSubject, useMatchSubject, useResource } from "@ldo/solid-react";
import {
  StatisticAccessRuleDocumentShapeType,
  type StatisticAccessRuleDocument,
  type StatisticPolicy,
} from "@oxfordia/stat-plugin_core";
import {
  asJsonDataSchema,
  createEmptyGraphPathOptionGetters,
  createGraphPathOptionGetters,
  extractPredicateOptions,
  type StatisticPluginUi,
} from "@oxfordia/stat-plugin_ui";
import {
  findDataSchema,
  getGraphPathShortcutsForDataSchema,
  type DataPlugin,
} from "@oxfordia/data-plugin_core";
import {
  type DataSchemaJsonView,
} from "@oxfordia/stat-plugin_ui";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SAR_TYPE =
  "https://oxfordia.setmeld.com/statistic-access-rule#StatisticAccessRule";

function toArray<T>(value: Iterable<T> | undefined): T[] {
  if (!value) return [];
  return Array.from(value);
}

function createInitialDocument(
  rootId: string,
  dataSchemaName: string,
): StatisticAccessRuleDocument {
  return {
    "@id": rootId,
    type: set({ "@id": "StatisticAccessRule" }),
    dataSchema: dataSchemaName,
    allowedAgents: set(),
    hasStatisticPolicy: set(),
  };
}

export function useStatisticAccessRuleEditorData(
  targetUri: string | undefined,
  dataPlugins: DataPlugin[],
  statisticPlugins: StatisticPluginUi[],
) {
  const resource = useResource(targetUri);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackRootId = useMemo(
    () => (targetUri ? `${targetUri}#policy` : undefined),
    [targetUri],
  );

  const editorShapeType = useMemo(
    () => ({
      ...StatisticAccessRuleDocumentShapeType,
      context: statisticPlugins.reduce(
        (context, plugin) => ({
          ...context,
          ...plugin.statisticAccessRuleShapeType.context,
        }),
        StatisticAccessRuleDocumentShapeType.context,
      ),
    }),
    [statisticPlugins],
  );

  const matchedDocs = useMatchSubject(
    editorShapeType,
    RDF_TYPE,
    SAR_TYPE,
  );
  const matchedDocument = useMemo(() => {
    const docs = toArray(matchedDocs as Iterable<StatisticAccessRuleDocument>);
    if (!fallbackRootId) return docs[0];
    return docs.find((doc) => doc["@id"] === fallbackRootId);
  }, [fallbackRootId, matchedDocs]);

  const rootId = fallbackRootId ?? matchedDocument?.["@id"];
  const [draftDocument, setDoc, commitDoc] = useChangeSubject(
    editorShapeType,
    rootId,
  );
  const document = draftDocument ?? matchedDocument;

  const dataSchemaName = document?.dataSchema ?? null;
  const dataSchema = useMemo<DataSchemaJsonView | null>(() => {
    if (!dataSchemaName) return null;
    const raw = findDataSchema(dataPlugins, dataSchemaName);
    return raw ? asJsonDataSchema(dataSchemaName, raw) : null;
  }, [dataPlugins, dataSchemaName]);

  const policies = useMemo(
    () => toArray(document?.hasStatisticPolicy as Iterable<StatisticPolicy> | undefined),
    [document],
  );
  const allowedAgents = useMemo(
    () =>
      toArray(document?.allowedAgents as Iterable<{ "@id": string }> | undefined).map(
        (agent) => agent["@id"],
      ),
    [document],
  );

  const predicateOptions = useMemo(
    () => extractPredicateOptions(dataSchema),
    [dataSchema],
  );
  const graphPathShortcuts = useMemo(
    () =>
      getGraphPathShortcutsForDataSchema(dataPlugins, dataSchemaName),
    [dataPlugins, dataSchemaName],
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
    [statisticPlugins],
  );

  const applyDocumentChange = (
    change: (doc: StatisticAccessRuleDocument) => void,
  ) => {
    if (!resource || !rootId || resource.type === "InvalidIdentifierResource") return;

    setError(null);
    setDoc(
      resource,
      (doc: StatisticAccessRuleDocument) => {
        doc.type = set({ "@id": "StatisticAccessRule" });
        doc.dataSchema = doc.dataSchema ?? dataSchemaName ?? "nemaline";
        if (!doc.allowedAgents) doc.allowedAgents = set();
        if (!doc.hasStatisticPolicy) doc.hasStatisticPolicy = set();
        change(doc);
      },
      document ?? createInitialDocument(rootId, dataSchemaName ?? "nemaline"),
    );
  };

  const addAllowedAgent = (agent: string) => {
    const normalizedAgent = agent.trim();
    if (!normalizedAgent) return;

    applyDocumentChange((doc) => {
      const existingAgents = toArray(doc.allowedAgents).map(
        (entry) => entry["@id"],
      );
      if (existingAgents.includes(normalizedAgent)) return;
      doc.allowedAgents = set(
        ...existingAgents.map((existingAgent) => ({ "@id": existingAgent })),
        { "@id": normalizedAgent },
      );
    });
  };

  const removeAllowedAgent = (agent: string) => {
    applyDocumentChange((doc) => {
      doc.allowedAgents = set(
        ...toArray(doc.allowedAgents).filter((entry) => entry["@id"] !== agent),
      );
    });
  };

  const updatePolicy = (
    policyId: string,
    nextPolicy: StatisticPolicy,
  ) => {
    applyDocumentChange((doc) => {
      const policiesToWrite = toArray(doc.hasStatisticPolicy).map((policy) =>
        policy["@id"] === policyId ? nextPolicy : policy,
      );
      doc.hasStatisticPolicy = set(...policiesToWrite);
    });
  };

  const addPolicy = (name: string) => {
    applyDocumentChange((doc) => {
      const existingPolicies = toArray(doc.hasStatisticPolicy);
      const nextPolicy = statisticPlugins.find((plugin) => plugin.name === name)?.createPolicy();
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
    allowedAgents,
    policies,
    statisticPlugins,
    statisticNames,
    addAllowedAgent,
    removeAllowedAgent,
    addPolicy,
    removePolicy,
    updatePolicy,
    save,
    predicateOptions,
    graphPathShortcuts,
    ...graphPathGetters,
  };
}
