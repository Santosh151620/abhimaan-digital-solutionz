#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(process.cwd(), "src");

const exts = [".ts", ".tsx"];

const files = [];
const imports = new Map();
const importedBy = new Map();

function walk(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(full);
            continue;
        }

        if (!exts.includes(path.extname(entry.name))) continue;

        files.push(full);
    }
}

walk(ROOT);

function resolveImport(fromFile, spec) {

    if (!spec.startsWith(".") && !spec.startsWith("@/")) {
        return null;
    }

    let target;

    if (spec.startsWith("@/")) {
        target = path.join(ROOT, spec.substring(2));
    } else {
        target = path.resolve(path.dirname(fromFile), spec);
    }

    const candidates = [
        target,
        target + ".ts",
        target + ".tsx",
        path.join(target, "index.ts"),
        path.join(target, "index.tsx")
    ];

    for (const c of candidates) {
        if (fs.existsSync(c)) return path.normalize(c);
    }

    return null;
}

for (const file of files) {

    const text = fs.readFileSync(file, "utf8");

    const matches = text.matchAll(/from\s+['"]([^'"]+)['"]/g);

    const deps = [];

    for (const m of matches) {

        const resolved = resolveImport(file, m[1]);

        if (!resolved) continue;

        deps.push(resolved);

        if (!importedBy.has(resolved))
            importedBy.set(resolved, []);

        importedBy.get(resolved).push(file);
    }

    imports.set(file, deps);
}

const report = [];

for (const file of files) {

    report.push({
        file: path.relative(process.cwd(), file),
        imports: (imports.get(file) || []).map(f => path.relative(process.cwd(), f)),
        importedBy: (importedBy.get(file) || []).map(f => path.relative(process.cwd(), f)),
        isZeroByte: fs.statSync(file).size === 0
    });
}

const outDir = path.join(process.cwd(), "migration-report");

fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, "import-graph.json");

fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

const zeroUsed = report.filter(f => f.isZeroByte && f.importedBy.length > 0);

const zeroUnused = report.filter(f => f.isZeroByte && f.importedBy.length === 0);

console.log("");
console.log("==================================");
console.log("Import Graph Complete");
console.log("==================================");
console.log("Files:", report.length);
console.log("Zero-byte used:", zeroUsed.length);
console.log("Zero-byte unused:", zeroUnused.length);
console.log("Output:", outFile);