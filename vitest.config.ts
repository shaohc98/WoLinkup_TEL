import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "apps/**/*.{test,spec}.{ts,tsx}",
      "integrations/**/*.{test,spec}.ts",
      "modules/**/*.{test,spec}.ts",
      "packages/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.ts",
      "tools/**/*.{test,spec}.ts",
    ],
    exclude: ["archive/**", "**/.next/**", "**/dist/**", "**/node_modules/**"],
  },
});
