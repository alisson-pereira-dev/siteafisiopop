import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mesmo alias do tsconfig ("@/*" → "./src/*")
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // next/image vira um <img> simples nos testes de marcação (src/test/render.tsx)
      "next/image": fileURLToPath(new URL("./src/test/mock-next-image.tsx", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.{ts,mjs}"],
  },
});
