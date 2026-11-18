/**
 * Helper · JSON-LD LocalBusiness da home (T5.4)
 * Conteúdo: content.json → seo.home.schema.campos (name, description, sameAs, areaServed). `nota` NÃO vai para o JSON-LD.
 * Endereço, telefone e horário ficam FORA até a clínica confirmar (itens `validar`). `url` só com SITE_URL. Nenhum FAQPage.
 */
import { conteudo } from "./conteudo";
import { urlDoSite } from "./site-url";

export function schemaLocalBusiness(base: URL | undefined = urlDoSite()) {
  const { tipo, campos } = conteudo.seo.home.schema;
  return {
    "@context": "https://schema.org",
    "@type": tipo,
    name: campos.name,
    description: campos.description,
    sameAs: [...campos.sameAs],
    areaServed: [...campos.areaServed],
    ...(base ? { url: base.toString() } : {}),
  };
}

/** Escape unicode do caractere "menor que": barra invertida, "u", "003c" (montado por código para não ser reinterpretado). */
const MENOR_QUE_ESCAPADO = String.fromCharCode(92, 117, 48, 48, 51, 99);

/** JSON seguro para `<script type="application/ld+json">`: nenhum "menor que" cru, então nada fecha a tag. */
export function jsonLd(dados: unknown): string {
  return JSON.stringify(dados).replaceAll("<", MENOR_QUE_ESCAPADO);
}
