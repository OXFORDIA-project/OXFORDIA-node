import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ["./tsconfig.base.json"] })],
  resolve: {
    // Prefer TypeScript source over stale compiled .js files in src/
    extensions: [".mts", ".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"],
  },
  test: {
    globals: true,
    environment: "node",
    include: ["packages/*/src/**/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**/*.ts"],
      exclude: [
        "packages/*/src/**/__tests__/**",
        "packages/*/src/**/generated/**",
      ],
    },
  },
});
