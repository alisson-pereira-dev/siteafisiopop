/**
 * Helper · resolução de CTA (ÚNICO lugar que transforma `@ctas.*` em texto + link)
 * Conteúdo: content/content.json → site.ctas.principal | site.ctas.secundario
 * Uso: const cta = resolverCta(secao.cta)  // secao.cta === "@ctas.principal"
 * O CTA principal é sempre o mesmo botão, texto e destino em todo o site.
 */
import { obterCtaBruto } from "./conteudo";
import { linkWhatsApp } from "./whatsapp";

export type CtaResolvido = {
  /** Chave em site.ctas ("principal" | "secundario") */
  readonly chave: string;
  readonly texto: string;
  readonly tipo: "whatsapp" | "ancora";
  /** Link pronto para o `href`. */
  readonly href: string;
};

export function resolverCta(referencia: string): CtaResolvido {
  const bruto = obterCtaBruto(referencia);
  const chave = referencia.slice("@ctas.".length);

  if (bruto.tipo === "whatsapp") {
    return { chave, texto: bruto.texto, tipo: "whatsapp", href: linkWhatsApp() };
  }
  if (bruto.tipo === "ancora") {
    return { chave, texto: bruto.texto, tipo: "ancora", href: bruto.destino };
  }
  throw new Error(`Tipo de CTA desconhecido em site.ctas.${chave}: "${bruto.tipo}"`);
}
