"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDataPlugin = findDataPlugin;
exports.findDataSchema = findDataSchema;
exports.getGraphPathShortcutMapForDataSchema = getGraphPathShortcutMapForDataSchema;
exports.getGraphPathShortcutsForDataSchema = getGraphPathShortcutsForDataSchema;
exports.findGraphPathShortcutByName = findGraphPathShortcutByName;
function normalizeSchemaName(value) {
    return (value ?? "").trim().toLowerCase();
}
function findDataPlugin(dataPlugins, name) {
    return dataPlugins.find((plugin) => plugin.name === normalizeSchemaName(name));
}
function findDataSchema(dataPlugins, name) {
    return findDataPlugin(dataPlugins, name)?.schema;
}
function getGraphPathShortcutMapForDataSchema(dataPlugins, dataSchemaName) {
    return findDataPlugin(dataPlugins, dataSchemaName)?.graphPathShortcuts ?? {};
}
function getGraphPathShortcutsForDataSchema(dataPlugins, dataSchemaName) {
    const shortcutMap = getGraphPathShortcutMapForDataSchema(dataPlugins, dataSchemaName);
    return Object.entries(shortcutMap).map(([name, createGraphPath]) => ({
        name,
        graphPath: (() => {
            const graphPath = createGraphPath();
            return graphPath.name ? graphPath : { ...graphPath, name };
        })(),
    }));
}
function findGraphPathShortcutByName(dataPlugins, dataSchemaName, shortcutName) {
    const shortcutMap = getGraphPathShortcutMapForDataSchema(dataPlugins, dataSchemaName);
    const createGraphPath = shortcutMap[shortcutName];
    return createGraphPath
        ? {
            name: shortcutName,
            graphPath: (() => {
                const graphPath = createGraphPath();
                return graphPath.name ? graphPath : { ...graphPath, name: shortcutName };
            })(),
        }
        : null;
}
__exportStar(require("./shortcutMatching"), exports);
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map