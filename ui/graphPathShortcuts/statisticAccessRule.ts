import { getGraphPathShortcutsForDataSchema } from "./registry";
import type { GraphNodeFilter, GraphPath } from "@oxfordia/types";
import type { GraphPathShortcut } from "./types";

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

function getIriValue(value: string | IriObject | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value["@id"] === "string") {
    return value["@id"];
  }
  return undefined;
}

function getSingleIriValue(nodeFilter: GraphNodeFilter | undefined): string | undefined {
  const iriValues = toCollectionArray(nodeFilter?.iri);
  if (iriValues.length !== 1) return undefined;
  return iriValues[0];
}

function toComparableFilter(filterValue: unknown): ComparableWhereFilter | null {
  if (!filterValue || typeof filterValue !== "object") return null;
  const filter = filterValue as Record<string, unknown>;
  const iriValue =
    filter.some && typeof filter.some === "object" && "node" in filter.some
      ? getSingleIriValue((filter.some as Record<string, unknown>).node as GraphNodeFilter)
      : undefined;
  const predicate = getIriValue(filter.predicate as string | IriObject | undefined);
  if (!iriValue || !predicate) {
    return null;
  }
  return { predicate, value: iriValue };
}

function toComparableWhereFilters(nodeFilter: GraphNodeFilter | undefined): ComparableWhereFilter[] {
  return toCollectionArray(nodeFilter?.predicates)
    .map((filter) => toComparableFilter(filter))
    .filter((value): value is ComparableWhereFilter => Boolean(value))
    .sort((a, b) => {
      const aKey = `${a.predicate}|${a.value}`;
      const bKey = `${b.predicate}|${b.value}`;
      return aKey.localeCompare(bKey);
    });
}

function toComparableGraphPath(graphPath: GraphPath): ComparableGraphPath {
  const steps = toCollectionArray(graphPath.steps)
    .map((step): ComparableStep | null => {
      const predicate = getIriValue(step.via as string | IriObject | undefined);
      if (!predicate) return null;
      const where = toComparableWhereFilters(step.where as GraphNodeFilter | undefined);
      return {
        predicate,
        inverse: Boolean(step.inverse),
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
    where: toComparableWhereFilters(graphPath.start),
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
