/**
 * Rota · sitemap.xml (T5.4)
 * Conteúdo: SITE_URL (src/lib/site-url.ts). Sem domínio, o sitemap sai vazio (nenhuma URL absoluta falsa). Só a home entra:
 * /privacidade e /termos são rascunho `noindex` até a revisão jurídica (T6.4).
 */
import type { MetadataRoute } from "next";
import { urlDoSite } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDoSite();
  return base ? [{ url: new URL("/", base).toString() }] : [];
}
