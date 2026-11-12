module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          unstable_transformProfile: "hermes-canary",
          unstable_transformImportMeta: true,
        },
      ],
      "nativewind/babel",
    ],
  };
};
