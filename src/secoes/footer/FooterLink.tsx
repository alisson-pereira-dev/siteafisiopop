/**
 * Seção S23 · footer — FooterLink (link de texto do rodapé, versão "clean")
 * Ficha: docs/sections/fichas/footer.md (revisão de 18/11/2026) · Conteúdo: o texto e o destino vêm de quem usa (content.json → secoes.footer)
 * Elementos: footer__link
 * Visual limpo (referência do usuário): texto regular, sem sublinhado e sem negrito; ao passar o mouse (ou focar com o teclado) o texto fica ROSA da
 * identidade (`text-primary`, o rosa verificado para texto pequeno), na hora, sem transição de cor. `hover:` só vale em dispositivos com mouse
 * (Tailwind 4); o equivalente no teclado é `focus-visible:`. Alvo ≥ 48px. Externo = nova aba com rel seguro.
 */
import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "className" | "href"> & { href: string; externo?: boolean };

export function FooterLink({ href, externo = false, children, ...resto }: Props) {
  return (
    <a
      href={href}
      className="footer__link inline-flex min-h-touch items-center font-body text-small font-regular text-foreground hover:text-primary focus-visible:text-primary"
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...resto}
    >
      {children}
    </a>
  );
}
