/**
 * Compartilhado · UiContainer
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: nenhum (casca de largura)
 * Elementos: ui-container (a classe-nome do elemento da seção, quando houver, entra primeiro via `className`)
 * Largura máxima do container, centralizado, com o padding lateral do tema (16px mobile, 32px ≥768).
 * `classes` = utilitários de layout da seção (grid, flex, gap) depois de `ui-container`.
 */
import type { ReactNode } from "react";
import { juntar } from "@/lib/classes";

type Props = { className?: string; classes?: string; children: ReactNode };

export function UiContainer({ className, classes, children }: Props) {
  return <div className={juntar(className, "ui-container mx-auto w-full max-w-container px-pad", classes)}>{children}</div>;
}
