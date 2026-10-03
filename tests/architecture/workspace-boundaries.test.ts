import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const moduleNames = [
  "catalog",
  "customer",
  "finance",
  "foundation",
  "fulfillment",
  "marketing",
  "order",
  "pricing",
  "procurement",
  "risk",
  "site",
];

const prohibitedRuntimePackages = [
  "@adyen/api-library",
  "@paypal/checkout-server-sdk",
  "@stripe/stripe-js",
  "bullmq",
  "ioredis",
  "redis",
  "stripe",
];

function collectPackageManifests(directory: string): string[] {
  const manifests: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (
      [".git", ".next", "archive", "dist", "node_modules"].includes(entry.name)
    ) {
      continue;
    }
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...collectPackageManifests(path));
    } else if (entry.name === "package.json") {
      manifests.push(path);
    }
  }
  return manifests;
}

describe("workspace architecture", () => {
  it("keeps all formal domain module layer boundaries present", () => {
    for (const moduleName of moduleNames) {
      for (const layer of [
        "api",
        "application",
        "domain",
        "infrastructure",
        "ports",
      ]) {
        expect(
          existsSync(
            join(
              repositoryRoot,
              "modules",
              moduleName,
              "src",
              layer,
              "index.ts",
            ),
          ),
          `${moduleName}/${layer} is missing`,
        ).toBe(true);
      }
    }
  });

  it("keeps Redis, BullMQ and payment-provider SDKs outside TEL", () => {
    const violations: string[] = [];

    for (const manifestPath of collectPackageManifests(repositoryRoot)) {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const dependencyNames = Object.keys({
        ...manifest.dependencies,
        ...manifest.devDependencies,
      });
      for (const packageName of prohibitedRuntimePackages) {
        if (dependencyNames.includes(packageName)) {
          violations.push(`${manifestPath}: ${packageName}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
