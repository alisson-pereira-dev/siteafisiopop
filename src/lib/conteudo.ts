/**
 * Helper · leitura do conteúdo
 * Conteúdo: content/content.json (única fonte de texto do site)
 * Exporta: conteudo, Conteudo, CtaBruto, obterCtaBruto, ehReferenciaCta
 * Referências `@ctas.*` são resolvidas SOMENTE aqui (dado) e em cta.ts (link).
 */
import conteudoJson from "../../content/content.json";

export const conteudo = conteudoJson;
export type Conteudo = typeof conteudo;

/** CTA como está no JSON (antes de virar link). */
export type CtaBruto = {
  readonly texto: string;
  readonly destino: string;
  readonly tipo: string;
};

const PREFIXO_CTA = "@ctas.";

/** `"@ctas.principal"` → true. Qualquer outro valor → false. */
export function ehReferenciaCta(valor: unknown): valor is string {
  return typeof valor === "string" && valor.startsWith(PREFIXO_CTA);
}

/**
 * Resolve `@ctas.principal` / `@ctas.secundario` para o objeto em `site.ctas`.
 * Lança erro se a chave não existir (conteúdo inconsistente deve quebrar o build, não renderizar vazio).
 */
export function obterCtaBruto(referencia: string): CtaBruto {
  if (!ehReferenciaCta(referencia)) {
    throw new Error(`Referência de CTA inválida: "${referencia}" (esperado "@ctas.<chave>")`);
  }
  const chave = referencia.slice(PREFIXO_CTA.length);
  const ctas: Readonly<Record<string, CtaBruto>> = conteudo.site.ctas;
  const cta = Object.hasOwn(ctas, chave) ? ctas[chave] : undefined;
  if (!cta) {
    throw new Error(`CTA não encontrado em content.json → site.ctas: "${chave}"`);
  }
  return cta;
}
