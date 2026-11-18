/**
 * Verificação · peso do código próprio de motion (T4.2)
 * Fonte: CLAUDE.md ("código próprio de motion < 5 KB gzip") e docs/jornada-e-motion.md §3.3 item 6
 * Uso: node scripts/check-motion.mjs · npm run check:motion (também no `build`)
 * Empacota (esbuild, minificado) TODO o JS próprio de movimento/interação num só pacote e mede o gzip: CtaObservador,
 * MotionInit, a regra pura da barra (cta-visibilidade), HeaderBarra, HeaderPainel, ProblemaSolucaoPalco, UnidadesMapa.
 * React, lucide-react e next ficam de fora (não são código próprio). Falha (exit 1) acima do limite.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/** 5 KB gzip (CLAUDE.md). */
export const LIMITE_BYTES = 5 * 1024;
export const ARQUIVOS = [
  "src/ui/CtaObservador.tsx",
  "src/ui/MotionInit.tsx",
  "src/lib/cta-visibilidade.ts",
  "src/lib/eventos.ts",
  "src/secoes/header/HeaderBarra.tsx",
  "src/secoes/header/HeaderPainel.tsx",
  "src/secoes/unidades/UnidadesMapa.tsx",
];

/** @returns {Promise<{ brutoBytes: number, gzipBytes: number, porArquivo: { arquivo: string, gzipBytes: number }[] }>} */
export async function medirMotion() {
  const empacotar = async (entradas) => {
    const r = await build({
      stdin: { contents: entradas.map((a) => `export * from "./${a.replace(/\.tsx?$/, "")}";`).join("\n"), resolveDir: path.join(RAIZ), loader: "ts" },
      bundle: true,
      minify: true,
      format: "esm",
      jsx: "automatic",
      write: false,
      logLevel: "silent",
      alias: { "@": path.join(RAIZ, "src") },
      external: ["react", "react/jsx-runtime", "react-dom", "lucide-react", "next", "next/*"],
    });
    return r.outputFiles[0].contents;
  };
  const todo = await empacotar(ARQUIVOS);
  const porArquivo = [];
  for (const arquivo of ARQUIVOS) porArquivo.push({ arquivo, gzipBytes: gzipSync(await empacotar([arquivo])).length });
  return { brutoBytes: todo.length, gzipBytes: gzipSync(todo).length, porArquivo };
}

const executadoDiretamente = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (executadoDiretamente) {
  const r = await medirMotion();
  for (const p of r.porArquivo) console.log(`  ${p.arquivo}: ${p.gzipBytes} B gzip (isolado)`);
  const kb = (r.gzipBytes / 1024).toFixed(2);
  console.log(`check-motion: ${r.gzipBytes} B gzip (${kb} KB; bruto minificado ${r.brutoBytes} B) · limite ${LIMITE_BYTES} B`);
  if (r.gzipBytes > LIMITE_BYTES) {
    console.error("check-motion: código próprio de motion acima de 5 KB gzip.");
    process.exit(1);
  }
}
