#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SRC = path.join(process.cwd(), "src");

const report = {
  generatedAt: new Date().toISOString(),
  zeroByteFiles: [],
  tinyFiles: [],
  duplicateNames: {},
  legacyServices: [],
  legacyTypes: [],
  barrelFiles: [],
  emptyDirectories: [],
  todoFiles: []
};

const filenameMap = new Map();

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  if (entries.length === 0) {
    report.emptyDirectories.push(path.relative(process.cwd(), dir));
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const rel = path.relative(process.cwd(), full);

    const stat = fs.statSync(full);

    if (stat.size === 0) {
      report.zeroByteFiles.push(rel);
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");

      const lines = text.split(/\r?\n/);

      if (lines.length <= 5) {
        report.tinyFiles.push(rel);
      }

      if (/TODO|FIXME/.test(text)) {
        report.todoFiles.push(rel);
      }

      if (entry.name === "index.ts") {
        report.barrelFiles.push(rel);
      }
    }

    if (rel.startsWith("src/services")) {
      report.legacyServices.push(rel);
    }

    if (rel.startsWith("src/types")) {
      report.legacyTypes.push(rel);
    }

    if (!filenameMap.has(entry.name)) {
      filenameMap.set(entry.name, []);
    }

    filenameMap.get(entry.name).push(rel);
  }
}

walk(SRC);

for (const [name, files] of filenameMap.entries()) {
  if (files.length > 1) {
    report.duplicateNames[name] = files;
  }
}

const outDir = path.join(process.cwd(), "migration-report");

fs.mkdirSync(outDir, { recursive: true });

const output = path.join(outDir, "migration-audit.json");

fs.writeFileSync(output, JSON.stringify(report, null, 2));

console.log("");
console.log("======================================");
console.log("Migration Audit Complete");
console.log("======================================");
console.log("Zero-byte files :", report.zeroByteFiles.length);
console.log("Tiny files      :", report.tinyFiles.length);
console.log("Legacy services :", report.legacyServices.length);
console.log("Legacy types    :", report.legacyTypes.length);
console.log("Barrel files    :", report.barrelFiles.length);
console.log("Empty folders   :", report.emptyDirectories.length);
console.log("Duplicate names :", Object.keys(report.duplicateNames).length);
console.log("TODO files      :", report.todoFiles.length);
console.log("");
console.log("Report:");
console.log(output);