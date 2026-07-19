const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src", "app", "crm");

function walk(dir) {

    for (const item of fs.readdirSync(dir)) {

        const full = path.join(dir, item);

        if (fs.statSync(full).isDirectory()) {
            walk(full);
            continue;
        }

        if (!full.endsWith(".tsx")) continue;

        let code = fs.readFileSync(full, "utf8");

        // Remove unused CRMPageLayout import
        code = code.replace(
            /import\s+CRMPageLayout\s+from\s+["'][^"']+["'];?\r?\n/g,
            ""
        );

        // Remove accidental BOM
        code = code.replace(/^\uFEFF/, "");

        // Remove stray line containing only a quote
        code = code.replace(/^\s*["']\s*;?\s*$/gm, "");

        fs.writeFileSync(full, code);

        console.log("✓", path.relative(ROOT, full));
    }

}

walk(ROOT);

console.log("\nFinished.");