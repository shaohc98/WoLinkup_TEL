import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];

const requiredFiles = [
  "README.md",
  "docs/README.md",
  "docs/00-governance/document-review-and-project-structure.md",
  "docs/01-requirements/WoLinkup_TEL需求规格说明书_V1.0.docx",
  "docs/02-product-design/prototypes/analysis.md",
  "docs/03-system-architecture/WoLinkup_TEL总体架构设计说明书_V1.0.docx",
  "docs/04-technical-architecture/WoLinkup_TEL技术架构设计说明书_V1.0.docx",
  "docs/05-domain-design/WoLinkup_TEL详细设计说明书_V1.0.docx",
  "database/migrations/README.md",
  "integrations/payment-platform/README.md",
  "integrations/suppliers/supplier-spi/README.md",
  "packages/api-contracts/README.md",
  "packages/event-contracts/README.md",
];

for (const path of requiredFiles) {
  try {
    const contents = await readFile(join(root, path));
    if (contents.length === 0) failures.push(`${path} is empty`);
  } catch {
    failures.push(`${path} is missing`);
  }
}

async function verifyChecksums(relativeSumsPath, label) {
  const sumsPath = join(root, relativeSumsPath);
  const sums = (await readFile(sumsPath, "utf8"))
    .trim()
    .split("\n")
    .filter(Boolean);

  for (const line of sums) {
    const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
    if (!match) {
      failures.push(`Invalid checksum line in ${relativeSumsPath}: ${line}`);
      continue;
    }

    const [, expected, asset] = match;
    try {
      const content = await readFile(join(dirname(sumsPath), asset));
      const actual = createHash("sha256").update(content).digest("hex");
      if (actual !== expected) failures.push(`${label} changed: ${asset}`);
    } catch {
      failures.push(`${label} is missing: ${asset}`);
    }
  }

  return sums.length;
}

const documentCount = await verifyChecksums(
  "docs/SHA256SUMS",
  "Formal document baseline",
);
const prototypeCount = await verifyChecksums(
  "docs/02-product-design/prototypes/legacy/SHA256SUMS",
  "Prototype baseline",
);

const packagePatterns = [
  ["apps", 1],
  ["modules", 1],
  ["integrations/payment-platform", 0],
  ["integrations/suppliers", 1],
  ["packages", 1],
  ["tests", 0],
  ["tools", 1],
];
const packageNames = new Map();

for (const [packageRoot, depth] of packagePatterns) {
  const base = join(root, packageRoot);
  const candidates = depth === 0 ? [base] : [];
  if (depth === 1) {
    for (const entry of await readdir(base, { withFileTypes: true })) {
      if (entry.isDirectory()) candidates.push(join(base, entry.name));
    }
  }

  for (const candidate of candidates) {
    const packagePath = join(candidate, "package.json");
    let manifest;
    try {
      manifest = JSON.parse(await readFile(packagePath, "utf8"));
    } catch {
      failures.push(
        `${relative(root, packagePath)} is missing or invalid JSON`,
      );
      continue;
    }
    if (!manifest.name) {
      failures.push(`${relative(root, packagePath)} has no package name`);
      continue;
    }
    const previous = packageNames.get(manifest.name);
    if (previous) {
      failures.push(
        `Duplicate package name ${manifest.name}: ${previous} and ${relative(root, packagePath)}`,
      );
    }
    packageNames.set(manifest.name, relative(root, packagePath));
  }
}

async function collectMarkdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (
      [
        "node_modules",
        ".pnpm-store",
        ".git",
        ".turbo",
        "archive",
        "dist",
      ].includes(entry.name)
    ) {
      continue;
    }
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdownFiles(path)));
    else if (entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

for (const markdownPath of await collectMarkdownFiles(root)) {
  const markdown = await readFile(markdownPath, "utf8");
  for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (!target || /^(?:https?:|mailto:|#)/.test(target)) continue;
    const localTarget = target.split("#", 1)[0];
    if (!localTarget) continue;
    try {
      await stat(join(dirname(markdownPath), decodeURIComponent(localTarget)));
    } catch {
      failures.push(
        `Broken Markdown link in ${relative(root, markdownPath)}: ${target}`,
      );
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`ERROR: ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `WoLinkup TEL repository verified: ${documentCount} formal documents, ${prototypeCount} prototype assets, ${packageNames.size} workspace packages.`,
  );
}
