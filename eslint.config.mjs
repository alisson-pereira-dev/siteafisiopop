import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Valor arbitrário com cor ou medida literal dentro de className: bg-[#fff], p-[13px], w-[2rem]...
// Só tokens (docs/design-system.md). Ver tailwind.config.ts.
const LITERAL = String.raw`\[[^\]]*(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|\d(px|rem|em|vh|vw|%|ch|ms)\b)`;
const mensagem =
  "Valor literal de cor/medida em className. Use só tokens (classes do tailwind.config.ts).";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `JSXAttribute[name.name='className'] Literal[value=/${LITERAL}/]`, message: mensagem },
        { selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=/${LITERAL}/]`, message: mensagem },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
