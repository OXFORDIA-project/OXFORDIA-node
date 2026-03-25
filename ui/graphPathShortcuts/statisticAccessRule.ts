import { getGraphPathShortcutsForDataSchema } from "./registry";
import type { GraphNodeFilter, GraphPath, GraphTraversalStep } from "@oxfordia/types";
import type { GraphPathShortcut } from "./types";

const STATP_PREFIX = "https://oxfordia.setmeld.com/statistics#";

type IriObject = { "@id": string };
type ComparableWhereFilter = { predicate: string; value: string };
type ComparableStep = {
  predicate: string;
  inverse: boolean;
  where: ComparableWhereFilter[];
};
type ComparableGraphPath = {
  where: ComparableWhereFilter[];
  steps: ComparableStep[];
};

function toCollectionArray<T>(value: T | T[] | Iterable<T> | undefined): T[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return [value as T];
  }
  if (typeof value === "object" && Symbol.iterator in (value as object)) {
    return Array.from(value as Iterable<T>);
  }
  return [value as T];
}

function readStatpField(
  record: Record<string, unknown> | undefined,
  local: string,
): unknown {
  if (!record) return undefined;
  return record[local] ?? record[`${STATP_PREFIX}${local}`];
}

function getIriValue(value: string | IriObject | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value["@id"] === "string") {
    return value["@id"];
  }
  return undefined;
}

function getSingleIriValue(nodeFilter: GraphNodeFilter | undefined): string | undefined {
  if (!nodeFilter) return undefined;
  const record = nodeFilter as unknown as Record<string, unknown>;
  const raw = readStatpField(record, "iri");
  const iriValues = toCollectionArray(
    raw as string | string[] | Iterable<string> | undefined,
  );
  if (iriValues.length !== 1) return undefined;
  return iriValues[0];
}

function toComparableFilter(filterValue: unknown): ComparableWhereFilter | null {
  if (!filterValue || typeof filterValue !== "object") return null;
  const filter = filterValue as Record<string, unknown>;
  const predicate = getIriValue(
    readStatpField(filter, "predicate") as string | IriObject | undefined,
  );
  const someRaw = readStatpField(filter, "some");
  if (!someRaw || typeof someRaw !== "object") {
    return null;
  }
  const someRecord = someRaw as Record<string, unknown>;
  const nodeRaw = readStatpField(someRecord, "node");
  const iriValue =
    nodeRaw && typeof nodeRaw === "object"
      ? getSingleIriValue(nodeRaw as GraphNodeFilter)
      : undefined;
  if (!predicate || !iriValue) {
    return null;
  }
  return { predicate, value: iriValue };
}

function toComparableWhereFilters(nodeFilter: GraphNodeFilter | undefined): ComparableWhereFilter[] {
  return toCollectionArray(
    readStatpField(
      nodeFilter as unknown as Record<string, unknown> | undefined,
      "predicates",
    ),
  )
    .map((filter) => toComparableFilter(filter))
    .filter((value): value is ComparableWhereFilter => Boolean(value))
    .sort((a, b) => {
      const aKey = `${a.predicate}|${a.value}`;
      const bKey = `${b.predicate}|${b.value}`;
      return aKey.localeCompare(bKey);
    });
}

function readGraphPathStart(graphPath: GraphPath): GraphNodeFilter | undefined {
  const record = graphPath as unknown as Record<string, unknown>;
  const start = record.start ?? record[`${STATP_PREFIX}start`];
  return start as GraphNodeFilter | undefined;
}

function readGraphPathSteps(graphPath: GraphPath): GraphPath["steps"] | undefined {
  const record = graphPath as unknown as Record<string, unknown>;
  return (record.steps ?? record[`${STATP_PREFIX}steps`]) as GraphPath["steps"] | undefined;
}

function readStepVia(step: GraphTraversalStep): string | IriObject | undefined {
  const record = step as unknown as Record<string, unknown>;
  return (record.via ?? record[`${STATP_PREFIX}via`]) as string | IriObject | undefined;
}

function readStepInverse(step: GraphTraversalStep): boolean {
  const record = step as unknown as Record<string, unknown>;
  const v = record.inverse ?? record[`${STATP_PREFIX}inverse`];
  return Boolean(v);
}

function readStepWhere(step: GraphTraversalStep): GraphNodeFilter | undefined {
  const record = step as unknown as Record<string, unknown>;
  return (record.where ?? record[`${STATP_PREFIX}where`]) as GraphNodeFilter | undefined;
}

function toComparableGraphPath(graphPath: GraphPath): ComparableGraphPath {
  const steps = toCollectionArray(readGraphPathSteps(graphPath))
    .map((step): ComparableStep | null => {
      const predicate = getIriValue(readStepVia(step));
      if (!predicate) return null;
      const where = toComparableWhereFilters(readStepWhere(step));
      return {
        predicate,
        inverse: readStepInverse(step),
        where,
      };
    })
    .filter((value): value is ComparableStep => Boolean(value))
    .sort((a, b) => {
      const aKey = `${a.predicate}|${a.inverse ? "1" : "0"}|${JSON.stringify(a.where)}`;
      const bKey = `${b.predicate}|${b.inverse ? "1" : "0"}|${JSON.stringify(b.where)}`;
      return aKey.localeCompare(bKey);
    });

  return {
    where: toComparableWhereFilters(readGraphPathStart(graphPath)),
    steps,
  };
}

export function instantiateGraphPathShortcut(
  shortcut: GraphPathShortcut,
): GraphPath {
  return shortcut.graphPath;
}

export function resolveGraphPathShortcut(
  dataSchemaName: string | null | undefined,
  graphPath: GraphPath,
): GraphPathShortcut | null {
  const normalizedPath = JSON.stringify(toComparableGraphPath(graphPath));
  const shortcuts = getGraphPathShortcutsForDataSchema(dataSchemaName);
  return (
    shortcuts.find((shortcut) => {
      const shortcutPath = JSON.stringify(
        toComparableGraphPath(shortcut.graphPath),
      );
      return shortcutPath === normalizedPath;
    }) ?? null
  );
}
