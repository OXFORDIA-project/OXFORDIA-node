// Shim for @ldo/jsonld-dataset-proxy used by Metro bundler.
//
// @ldo/connected's CJS build calls:
//   __toESM(require("@ldo/jsonld-dataset-proxy"), 1 /* isNodeMode */)
//
// rolldown's __toESM with isNodeMode=1 always sets target.default = mod (the whole
// exports object), regardless of mod.__esModule. So calling .default() fails because
// the exports object is not a function.
//
// By making module.exports be the jsonldDatasetProxy function itself, __toESM sets
// target.default = fn (the function), making (0, proxy.default)(dataset, ctx) work.
const real = require("@ldo/jsonld-dataset-proxy");
const fn = real.jsonldDatasetProxy;
Object.assign(fn, real);
module.exports = fn;
