/**
 * Compartilhado · UiLink (link de texto discreto)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: o texto vem de quem usa (content.json)
 * Elementos: ui-link (a classe-nome da seção entra primeiro via `className`)
 * Sublinhado, alvo ≥ 48px. Tom: link (text-link, 5,03:1) · texto (text-foreground). Externo = nova aba com
 * rel="noopener noreferrer". `data-*` (data-cta, data-item…) passam para o <a>.
 */
import type { ComponentPropsWithoutRef } from "react";
import { juntar } from "@/lib/classes";
import { UiIcone } from "./UiIcone";

const TOM = { link: "text-link", texto: "text-foreground" } as const;

type Props = Omit<ComponentPropsWithoutRef<"a">, "className" | "href"> & {
  href: string;
  ariaLabel?: string;
  externo?: boolean;
  /** Ícone ArrowRight depois do texto. */
  seta?: boolean;
  tom?: keyof typeof TOM;
  className?: string;
  /** Utilitários extras (depois de `ui-link`). */
  classes?: string;
};

export function UiLink({ href, ariaLabel, externo = false, seta = false, tom = "link", className, classes, children, ...resto }: Props) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={juntar(className, "ui-link inline-flex min-h-touch items-center gap-2 font-strong underline", TOM[tom], classes)}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...resto}
    >
      {children}
      {seta ? <UiIcone nome="arrow-right" tamanho={16} /> : null}
    </a>
  );
}
