/**
 * Compartilhado · UiChip (etiqueta curta)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: o texto vem de quem usa (content.json)
 * Elementos: ui-chip (a classe-nome da seção entra primeiro via `className`)
 * Tom: claro (bg-primary-soft + tinta, 12,95:1) · inverso (borda + text-on-inverse-accent sobre bg-inverse).
 */
import type { ReactNode } from "react";
import { juntar } from "@/lib/classes";

const TOM = {
  claro: "bg-primary-soft text-foreground",
  inverso: "border border-on-inverse-accent text-on-inverse-accent",
} as const;

type Props = { tom?: keyof typeof TOM; className?: string; children: ReactNode };

export function UiChip({ tom = "claro", className, children }: Props) {
  return (
    <span className={juntar(className, "ui-chip inline-flex items-center rounded-full px-3 py-1 text-small font-strong", TOM[tom])}>
      {children}
    </span>
  );
}
