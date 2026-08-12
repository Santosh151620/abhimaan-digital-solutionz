import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default defineConfig([
    ...nextVitals,
    ...nextTs,

    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },

        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "react-hooks/set-state-in-effect": "off",
            "react/no-unescaped-entities": "warn",
        },
    },

    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "scripts/**",
        "SprintExports/**",
        "next-env.d.ts",
    ]),
]);