/**
 * Compartilhado · UiBotao (link com cara de botão)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: o texto vem de quem usa (content.json)
 * Elementos: ui-botao--primario (SÓ via UiCtaPrincipal) · ui-botao--secundario (contorno em text-foreground)
 * Receita `botao` (data-anim): hover/foco/toque em globals.css. Alvo ≥ 48px (min-h-touch).
 */
import type { ComponentPropsWithoutRef } from "react";
import { juntar } from "@/lib/classes";

const VARIANTE = {
  primario: "ui-botao--primario bg-primary text-primary-contrast shadow-cta hover:bg-primary-hover",
  secundario: "ui-botao--secundario border border-border-strong text-foreground",
} as const;

const LARGURA = {
  /** Largura total no mobile; automática a partir de 768px. */
  mobile: "w-full md:w-auto",
  sempre: "w-full",
} as const;

type Props = Omit<ComponentPropsWithoutRef<"a">, "className" | "href"> & {
  href: string;
  variante?: keyof typeof VARIANTE;
  cheio?: keyof typeof LARGURA;
  /** Abre em outra aba com rel="noopener noreferrer" (WhatsApp, redes). */
  externo?: boolean;
  className?: string;
  /** Outras receitas `data-anim` do mesmo elemento (ex.: "stagger-item"); `botao` fica sempre. */
  animExtra?: string;
};

export function UiBotao({ href, variante = "secundario", cheio, externo = false, className, animExtra, children, ...resto }: Props) {
  return (
    <a
      href={href}
      className={juntar(
        className,
        "ui-botao inline-flex min-h-touch items-center justify-center rounded-full px-5 py-3 text-center text-body font-strong",
        VARIANTE[variante],
        cheio && LARGURA[cheio],
      )}
      data-anim={juntar("botao", animExtra)}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...resto}
    >
      {children}
    </a>
  );
}
