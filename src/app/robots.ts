/**
 * Rota · robots.txt (T5.4)
 * Conteúdo: SITE_URL (src/lib/site-url.ts). `/privacidade` e `/termos` são `noindex` por meta (rascunho): NÃO entram em
 * `disallow`, para o robô conseguir ler o `noindex`. A linha `Sitemap` só existe com domínio definido.
 */
import type { MetadataRoute } from "next";
import { modoAmostra, urlDoSite } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // amostra publicada: ninguém indexa (SITE_AMOSTRA=1)
  if (modoAmostra()) return { rules: { userAgent: "*", disallow: "/" } };
  const base = urlDoSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(base ? { sitemap: new URL("/sitemap.xml", base).toString() } : {}),
  };
}
