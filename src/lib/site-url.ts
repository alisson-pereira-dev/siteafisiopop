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

/**
 * Modo AMOSTRA (publicação de teste, ex.: Cloudflare): com `SITE_AMOSTRA=1` o site pede aos buscadores para NÃO indexar nem seguir
 * (meta robots + robots.txt com disallow). Existe porque a amostra traz depoimentos fictícios e dados ainda `validar`.
 * Desligado por padrão; no lançamento, não definir a variável.
 */
export function modoAmostra(bruto: string | undefined = process.env.SITE_AMOSTRA): boolean {
  const v = bruto?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "sim";
}
