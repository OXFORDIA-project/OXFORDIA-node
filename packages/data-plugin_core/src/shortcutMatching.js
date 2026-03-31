"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGraphPathShortcut = resolveGraphPathShortcut;
const index_1 = require("./index");
const STATP_PREFIX = "https://oxfordia.setmeld.com/statistics#";
function toCollectionArray(value) {
    if (value === undefined || value === null)
        return [];
    if (Array.isArray(value))
        return value;
    if (typeof value === "string")
        return [value];
    if (typeof value === "object" && Symbol.iterator in value) {
        return Array.from(value);
    }
    return [value];
}
function readStatpField(record, local) {
    if (!record)
        return undefined;
    return record[local] ?? record[`${STATP_PREFIX}${local}`];
}
function getIriValue(value) {
    if (typeof value === "string")
        return value;
    if (value && typeof value === "object" && typeof value["@id"] === "string") {
        return value["@id"];
    }
    return undefined;
}
function getSingleIriValue(nodeFilter) {
    if (!nodeFilter)
        return undefined;
    const record = nodeFilter;
    const raw = readStatpField(record, "iri");
    const iriValues = toCollectionArray(raw);
    if (iriValues.length !== 1)
        return undefined;
    return iriValues[0];
}
function toComparableFilter(filterValue) {
    if (!filterValue || typeof filterValue !== "object")
        return null;
    const filter = filterValue;
    const predicate = getIriValue(readStatpField(filter, "predicate"));
    const someRaw = readStatpField(filter, "some");
    if (!someRaw || typeof someRaw !== "object")
        return null;
    const someRecord = someRaw;
    const nodeRaw = readStatpField(someRecord, "node");
    const iriValue = nodeRaw && typeof nodeRaw === "object"
        ? getSingleIriValue(nodeRaw)
        : undefined;
    if (!predicate || !iriValue)
        return null;
    return { predicate, value: iriValue };
}
function toComparableWhereFilters(nodeFilter) {
    return toCollectionArray(readStatpField(nodeFilter, "predicates"))
        .map((filter) => toComparableFilter(filter))
        .filter((value) => Boolean(value))
        .sort((a, b) => {
        const aKey = `${a.predicate}|${a.value}`;
        const bKey = `${b.predicate}|${b.value}`;
        return aKey.localeCompare(bKey);
    });
}
function readGraphPathStart(graphPath) {
    const record = graphPath;
    return (record.start ?? record[`${STATP_PREFIX}start`]);
}
function readGraphPathSteps(graphPath) {
    const record = graphPath;
    return (record.steps ?? record[`${STATP_PREFIX}steps`]);
}
function readStepVia(step) {
    const record = step;
    return (record.via ?? record[`${STATP_PREFIX}via`]);
}
function readStepInverse(step) {
    const record = step;
    return Boolean(record.inverse ?? record[`${STATP_PREFIX}inverse`]);
}
function readStepWhere(step) {
    const record = step;
    return (record.where ?? record[`${STATP_PREFIX}where`]);
}
function toComparableGraphPath(graphPath) {
    const steps = toCollectionArray(readGraphPathSteps(graphPath))
        .map((step) => {
        const predicate = getIriValue(readStepVia(step));
        if (!predicate)
            return null;
        return {
            predicate,
            inverse: readStepInverse(step),
            where: toComparableWhereFilters(readStepWhere(step)),
        };
    })
        .filter((value) => Boolean(value))
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
function resolveGraphPathShortcut(dataPlugins, dataSchemaName, graphPath) {
    if (graphPath.name) {
        return ((0, index_1.getGraphPathShortcutsForDataSchema)(dataPlugins, dataSchemaName).find((shortcut) => shortcut.name === graphPath.name) ?? null);
    }
    const normalizedPath = JSON.stringify(toComparableGraphPath(graphPath));
    return ((0, index_1.getGraphPathShortcutsForDataSchema)(dataPlugins, dataSchemaName).find((shortcut) => {
        const shortcutPath = JSON.stringify(toComparableGraphPath(shortcut.graphPath));
        return shortcutPath === normalizedPath;
    }) ?? null);
}
//# sourceMappingURL=shortcutMatching.js.map