/**
 * Compartilhado · UiCard
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: nenhum (casca)
 * Elementos: ui-card (a classe-nome da seção entra primeiro via `className`)
 * Tom: surface (bg-surface + borda + shadow-1) · elevado (bg-surface + shadow-4; cartão claro sobre faixa escura,
 * com o anel de foco escuro) · teal (bg-bg-teal, texto em tinta, sem sombra).
 */
import type { ReactNode } from "react";
import { juntar } from "@/lib/classes";
import type { DadosAttr } from "./tipos";

const TOM = {
  surface: "bg-surface border border-border text-foreground shadow-1",
  elevado: "section-clara bg-surface border border-border text-foreground shadow-4",
  teal: "bg-bg-teal text-foreground",
} as const;

const RAIO = { lg: "rounded-lg", cartao: "rounded-[var(--raio-cartao)]" } as const;

type Props = DadosAttr & {
  tom?: keyof typeof TOM;
  /** Cantos: `lg` (24px, padrão) ou `cartao` (8px, --raio-cartao em raios.css). */
  raio?: keyof typeof RAIO;
  as?: "div" | "article" | "li";
  className?: string;
  /** Utilitários extras (depois de `ui-card`). */
  classes?: string;
  children: ReactNode;
};

export function UiCard({ tom = "surface", as: Tag = "div", raio = "lg", className, classes, children, ...dados }: Props) {
  return (
    <Tag className={juntar(className, "ui-card p-5", RAIO[raio], TOM[tom], classes)} {...dados}>
      {children}
    </Tag>
  );
}
