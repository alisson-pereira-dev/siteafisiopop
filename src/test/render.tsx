/**
 * Teste · helper de renderização de componentes server (sem JSDOM)
 * Conteúdo: nenhum. Usa renderToStaticMarkup; `next/image` vira o mock de src/test/mock-next-image.tsx (alias no vitest).
 * O que exige navegador (observer, foco, layout, CLS) NÃO se testa aqui: é [manual] e vai no estado do projeto.
 */
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** HTML estático do componente. */
export function renderizar(elemento: ReactElement): string {
  return renderToStaticMarkup(elemento);
}

/** Quantas vezes o padrão aparece no HTML. */
export function contar(html: string, padrao: RegExp | string): number {
  const re =
    typeof padrao === "string"
      ? new RegExp(escapar(padrao), "g")
      : new RegExp(padrao.source, padrao.flags.includes("g") ? padrao.flags : `${padrao.flags}g`);
  return (html.match(re) ?? []).length;
}

/** Tags de abertura (`<tag …>`) que contêm o trecho dado. */
export function tagsCom(html: string, trecho: string): string[] {
  return (html.match(/<[a-zA-Z][^>]*>/g) ?? []).filter((t) => t.includes(trecho));
}

const ENTIDADES: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#x27;": "'" };

/** Valor do atributo numa tag de abertura (com as entidades HTML já desfeitas). */
export function valorDe(tag: string, atributo: string): string | null {
  const bruto = tag.match(new RegExp(`\\s${escapar(atributo)}="([^"]*)"`))?.[1];
  return bruto === undefined ? null : bruto.replace(/&(amp|quot|lt|gt|#x27);/g, (e) => ENTIDADES[e]);
}
