/**
 * Helper · destaque serifado
 * Conteúdo: qualquer texto do content.json que traga `**palavra**` (headlines e títulos).
 * `**palavra**` vira <span class="accent-serif"> (estilo definido em styles/design-tokens.css).
 * Use 1–2 palavras por título e só em tamanho grande (regra de contraste do design system).
 */
import { Fragment, type ReactNode } from "react";

export type TrechoDestaque = { readonly texto: string; readonly destaque: boolean };

const MARCACAO = /\*\*(.+?)\*\*/g;

/** Divide o texto em trechos normais e em destaque. Marcação sem par (`**`) fica como texto. */
export function dividirDestaque(texto: string): TrechoDestaque[] {
  const trechos: TrechoDestaque[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(MARCACAO)) {
    const inicio = m.index ?? 0;
    if (inicio > ultimo) trechos.push({ texto: texto.slice(ultimo, inicio), destaque: false });
    trechos.push({ texto: m[1], destaque: true });
    ultimo = inicio + m[0].length;
  }
  if (ultimo < texto.length) trechos.push({ texto: texto.slice(ultimo), destaque: false });
  return trechos;
}

/** Renderiza o texto com os destaques como <span class="accent-serif">. */
export function renderizarDestaque(texto: string): ReactNode {
  return dividirDestaque(texto).map((t, i) =>
    t.destaque ? (
      <span key={i} className="accent-serif">
        {t.texto}
      </span>
    ) : (
      <Fragment key={i}>{t.texto}</Fragment>
    ),
  );
}
