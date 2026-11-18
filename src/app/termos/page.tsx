/**
 * Rota · /termos — RASCUNHO TÉCNICO (T5.1), noindex
 * Ficha: docs/tasks.md T5.1 · Conteúdo: content.json → paginas.termos (seo, texto)
 * Precisa de revisão jurídica (LGPD); bloqueia o lançamento. Elementos: ver src/secoes/pagina-legal/PaginaLegal.tsx
 */
import type { Metadata } from "next";
import { conteudo } from "@/lib/conteudo";
import { PaginaLegal } from "@/secoes/pagina-legal/PaginaLegal";

const { seo } = conteudo.paginas.termos;

export const metadata: Metadata = {
  title: seo.titulo,
  description: seo.descricao,
  robots: { index: false, follow: false },
};

export default function Termos() {
  return <PaginaLegal chave="termos" />;
}
