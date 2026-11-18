import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents e partialPrefetching foram DESLIGADOS (18/11/2026): nenhuma página usa `use cache`/Suspense e o Cache Components trava no
  // Cloudflare Workers (o Worker "hung": o runtime não implementa o setTimeout() que ele exige) → Internal Server Error. Todas as rotas seguem estáticas.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
