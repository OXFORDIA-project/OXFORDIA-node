const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// linked-data-browser ships its own nested node_modules (no peerDependencies),
// so without this redirect Metro would bundle two copies of React, React Native, etc.
// React requires a singleton — a second copy causes "H.H is null" dispatcher errors.
// Redirect all resolutions from ldb to the workspace root; fall back to ldb's nested
// copy only for packages the workspace doesn't have (e.g. react-native-notifier).
// Use projectRoot as the fake origin so ldb deps resolve through packages/pod-ui/
// (where react@19.1.0 lives) rather than the workspace root (which has react@19.0.0).
const LDB_PATH_FRAGMENT = `${path.sep}node_modules${path.sep}linked-data-browser${path.sep}`;
const podUiOrigin = path.resolve(projectRoot, "package.json");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (context.originModulePath.includes(LDB_PATH_FRAGMENT)) {
    try {
      return context.resolveRequest(
        { ...context, originModulePath: podUiOrigin },
        moduleName,
        platform,
      );
    } catch {
      // Package not in pod-ui — fall through to the nested copy
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
