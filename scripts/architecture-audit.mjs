#!/usr/bin/env node

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const WEBSITE = [
  "src/app",
  "src/components",
];

const WEBSITE_KEYWORDS = [
  "/crm/",
  "/admin/",
  "/dashboard/",
  "/platform/",
  "/enterprise/",
];

const IGNORE = [
  "node_modules",
  ".next",
  "dist",
  "build",
];

const exts = [".ts", ".tsx", ".js", ".jsx"];

const findings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    if (IGNORE.includes(item)) continue;

    const full = path.join(dir, item);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (!exts.includes(path.extname(full))) continue;

    const text = fs.readFileSync(full, "utf8");

    for (const keyword of WEBSITE_KEYWORDS) {
      if (text.includes(keyword)) {
        findings.push({
          file: full.replace(ROOT + path.sep, ""),
          keyword,
        });
      }
    }
  }
}

for (const dir of WEBSITE) {
  walk(path.join(ROOT, dir));
}

console.log("");
console.log("=======================================");
console.log(" WEBSITE → ENTERPRISE COUPLING REPORT");
console.log("=======================================");
console.log("");

if (!findings.length) {
  console.log("✔ No direct coupling found.");
  process.exit(0);
}

for (const f of findings) {
  console.log(`${f.file}`);
  console.log(`   -> ${f.keyword}`);
}

console.log("");
console.log(`Total Findings : ${findings.length}`);