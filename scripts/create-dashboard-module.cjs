#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "src", "modules", "dashboard");

const dirs = [
    "api",
    "components",
    "hooks",
    "mappers",
    "repositories",
    "services",
    "types",
    "utils"
];

fs.mkdirSync(root, { recursive: true });

for (const dir of dirs) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
}

const indexFile = path.join(root, "index.ts");

if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(
        indexFile,
`export * from "./components";
export * from "./hooks";
export * from "./services";
export * from "./types";
`
    );
}

console.log("Dashboard module scaffold created.");