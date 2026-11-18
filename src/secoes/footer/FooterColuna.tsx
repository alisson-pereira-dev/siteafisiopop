/**
 * Seção S23 · footer — FooterColuna (uma coluna de links)
 * Ficha: docs/sections/fichas/footer.md (S23) · Conteúdo: content.json → secoes.footer.colunas[] (titulo, links[]: rotulo, destino)
 * Elementos: footer__coluna, __coluna-titulo, __link (FooterLink)
 * Links de texto (nunca botão): âncora interna, Instagram (externo, rel seguro) e WhatsApp (`destino: "whatsapp"` vira o
 * link wa.me com a mensagem padrão — é link de texto, NÃO é o CTA principal e não tem data-cta="principal"). Alvo ≥ 48px.
 */
import { hrefDaHome } from "@/lib/ancora";
import { linkWhatsApp } from "@/lib/whatsapp";
import { FooterLink } from "./FooterLink";

type LinkColuna = { readonly rotulo: string; readonly destino: string };
type Props = { titulo: string; links: readonly LinkColuna[] };

const DESTINO_WHATSAPP = "whatsapp";

export function FooterColuna({ titulo, links }: Props) {
  return (
    <div className="footer__coluna flex flex-col gap-2">
      {/* <p role=heading>: o h2 herda Sora em negrito do CSS global; o rótulo da coluna é leve (Inter regular, cinza) e segue sendo título de nível 2 para leitores de tela */}
      <p role="heading" aria-level={2} className="footer__coluna-titulo font-body text-small font-regular text-subtle">
        {titulo}
      </p>
      <ul className="flex flex-col">
        {links.map((link) => {
          const whatsapp = link.destino === DESTINO_WHATSAPP;
          const externo = whatsapp || /^https?:\/\//.test(link.destino);
          return (
            <li key={`${link.rotulo}-${link.destino}`}>
              <FooterLink href={whatsapp ? linkWhatsApp() : hrefDaHome(link.destino)} externo={externo}>
                {link.rotulo}
              </FooterLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
