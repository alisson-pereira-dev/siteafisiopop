/**
 * Compartilhado · UiSecao (raiz de toda seção, exceto header e footer)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: nenhum (a seção passa a chave em `conteudo`)
 * Elementos: ui-secao (classe-nome = `bloco`, sempre a primeira)
 * Emite id, data-section, data-ficha, data-conteudo e aria-labelledby (prova-rapida usa `ariaLabel`).
 * Tom: base (bg-bg) · alt (bg-bg-alt) · inverse (bg-inverse, texto claro).
 */
import type { ReactNode } from "react";
import { juntar } from "@/lib/classes";

const TOM = {
  base: "bg-bg",
  alt: "bg-bg-alt",
  inverse: "section-inverse bg-inverse text-on-inverse",
} as const;

type Props = {
  id: string;
  /** Slug do bloco (`hero`, `servicos`…): vira a classe-nome da raiz e o `data-section`. */
  bloco: string;
  /** Código da ficha (`S06`). */
  ficha: string;
  /** Chave do content.json (`secoes.servicos`). */
  conteudo: string;
  /** `id` do título da seção (aria-labelledby). */
  labelledby?: string;
  /** Só para seções sem título visível (prova-rapida). */
  ariaLabel?: string;
  tom?: keyof typeof TOM;
  /** Troca `py-section` por `py-7`. */
  compacta?: boolean;
  /** Sem padding vertical (seção de largura total, ex.: o stage do S03). */
  semPadding?: boolean;
  /** Receita `data-anim` da raiz (ex.: `pilha-base` / `pilha-topo`, ver UiPilha). */
  anim?: string;
  /** Utilitários extras da raiz (entram DEPOIS da classe-nome; ex.: `pt-6` no hero). */
  className?: string;
  children: ReactNode;
};

export function UiSecao({ id, bloco, ficha, conteudo, labelledby, ariaLabel, tom = "base", compacta = false, semPadding = false, anim, className, children }: Props) {
  return (
    <section
      id={id}
      className={juntar(bloco, "ui-secao relative", TOM[tom], semPadding ? "" : compacta ? "py-7" : "py-section", className)}
      data-section={bloco}
      data-ficha={ficha}
      data-conteudo={conteudo}
      {...(anim ? { "data-anim": anim } : {})}
      aria-labelledby={labelledby}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}
