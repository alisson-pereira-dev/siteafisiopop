/**
 * Helper · domínio do site (SEO)
 * Conteúdo: variável de ambiente SITE_URL (o domínio ainda não existe; definir na T6.5)
 * `urlDoSite()` devolve a URL base só quando SITE_URL é um http(s) válido; senão `undefined`. Sem domínio NÃO se gera URL
 * absoluta (canonical, Open Graph url, sitemap, `url` do JSON-LD): nada de endereço falso.
 */
export function urlDoSite(bruto: string | undefined = process.env.SITE_URL): URL | undefined {
  const texto = bruto?.trim();
  if (!texto) return undefined;
  try {
    const url = new URL(texto);
    return url.protocol === "https:" || url.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}
