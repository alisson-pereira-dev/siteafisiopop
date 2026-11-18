/**
 * Helper · âncora da home
 * Conteúdo: destinos `#servicos`, `#faq`… de content.json (site.navegacao, secoes.footer.colunas)
 * Em subpáginas (/privacidade, /termos, 404) o header e o footer continuam no layout: `#faq` ali só rolaria a própria
 * página. `hrefDaHome("#faq")` devolve `/#faq`, que na home é a mesma página e nas outras leva de volta à home.
 * Qualquer outro destino (rota, https, whatsapp) passa sem mudar.
 */
export function hrefDaHome(destino: string): string {
  return destino.startsWith("#") ? `/${destino}` : destino;
}
