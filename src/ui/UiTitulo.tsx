/**
 * Compartilhado · UiTitulo (h1/h2/h3 com destaque serifado)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: texto vem do content.json, com `**palavra**`
 * Elementos: ui-titulo (a classe-nome da seção entra primeiro via `className`)
 * `**palavra**` vira <span class="accent-serif"> (src/lib/destaque.tsx). Em tom inverso o destaque
 * vem de `.section-inverse .accent-serif` em globals.css (rosa claro sobre escuro, 6,35:1). `tamanho` troca a escala sem mudar o nível.
 */
import { juntar } from "@/lib/classes";
import { renderizarDestaque } from "@/lib/destaque";
import type { DadosAttr } from "./tipos";

const TAMANHO = { h1: "text-h1", h2: "text-h2", h3: "text-h3" } as const;
const TOM = {
  claro: "text-foreground",
  inverso: "text-on-inverse",
} as const;

type Props = DadosAttr & {
  nivel: keyof typeof TAMANHO;
  /** Escala visual (padrão: a do nível). */
  tamanho?: keyof typeof TAMANHO;
  id?: string;
  className?: string;
  tom?: keyof typeof TOM;
  /** Texto com `**destaque**`. */
  children: string;
};

export function UiTitulo({ nivel, tamanho, id, className, tom = "claro", children, ...dados }: Props) {
  const Tag = nivel;
  return (
    <Tag id={id} className={juntar(className, "ui-titulo text-balance", TAMANHO[tamanho ?? nivel], TOM[tom])} {...dados}>
      {renderizarDestaque(children)}
    </Tag>
  );
}
