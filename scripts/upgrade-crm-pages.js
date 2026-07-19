#!/usr/bin/env node

/**
 * ============================================================
 * Abhimaan CRM Automatic UI Upgrade
 * Safe Refactoring Tool
 * ------------------------------------------------------------
 * ✔ Creates backup
 * ✔ Normalizes imports
 * ✔ Upgrades page wrapper
 * ✔ Never touches business logic
 * ✔ Never touches forms
 * ✔ Never touches repositories
 * ✔ Never touches services
 * ✔ Never touches actions
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src", "app", "crm");

const BACKUP = path.join(__dirname, "..", ".backup-ui");

if (!fs.existsSync(BACKUP))
    fs.mkdirSync(BACKUP, { recursive: true });

function walk(dir) {

    const entries = fs.readdirSync(dir);

    for (const entry of entries) {

        const full = path.join(dir, entry);

        const stat = fs.statSync(full);

        if (stat.isDirectory())
            walk(full);

        if (entry !== "page.tsx")
            continue;

        processPage(full);

    }

}

function backup(file) {

    const relative = path.relative(ROOT, file);

    const target = path.join(BACKUP, relative);

    fs.mkdirSync(path.dirname(target), { recursive: true });

    fs.copyFileSync(file, target);

}

function processPage(file) {

    backup(file);

    let code = fs.readFileSync(file, "utf8");

    if (code.includes("CRMPageLayout"))
        return;

    let changed = false;

    if (
        !code.includes("@/components/crm/shared/layout/CRMPageLayout")
    ) {

        code =
            `import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";\n` +
            code;

        changed = true;

    }

    code = code.replace(
        /<main[^>]*>/g,
        "<CRMPageLayout>"
    );

    code = code.replace(
        /<\/main>/g,
        "</CRMPageLayout>"
    );

    code = code.replace(
        /className="p-6"/g,
        `className=""`
    );

    code = code.replace(
        /className="space-y-6"/g,
        `className=""`
    );

    code = code.replace(
        /className="container.*?"/g,
        `className=""`
    );

    if (changed)
        fs.writeFileSync(file, code);

    console.log("✓", path.relative(ROOT, file));

}

console.log("");

console.log("==========================================");

console.log(" ABHIMAAN CRM UI UPGRADE ");

console.log("==========================================");

console.log("");

walk(ROOT);

console.log("");

console.log("Completed Successfully.");

console.log("");

console.log("Backup:");

console.log(BACKUP);

console.log("");