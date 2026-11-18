/**
 * Helper · caminho de mídia e logo
 * Conteúdo: content/content.json → site.logo (src, alt), secoes.*.midia.src
 * `site.logo.src` vem sem barra inicial ("assets/logo-afisiopop.png") e o arquivo mora em public/assets/;
 * o caminho público (com barra) é montado SÓ aqui. Mídia "pendente" nunca vira imagem inventada.
 */
import { conteudo } from "./conteudo";

/** Valor que o content.json usa quando a foto/vídeo real ainda não chegou. */
export const MIDIA_PENDENTE = "pendente";

export function midiaPendente(src: string | undefined | null): boolean {
  return !src || src === MIDIA_PENDENTE;
}

/** "assets/x.png" → "/assets/x.png"; URL absoluta e caminho com barra ficam como estão. */
export function normalizarSrc(src: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/${src}`;
}

/** Logo real (PNG transparente), com o caminho público normalizado. Dimensões do arquivo: 2172 × 724. */
export const LOGO = {
  src: normalizarSrc(conteudo.site.logo.src),
  alt: conteudo.site.logo.alt,
  largura: 2172,
  altura: 724,
} as const;
