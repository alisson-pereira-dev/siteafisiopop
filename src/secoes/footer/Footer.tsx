/**
 * Seção S23 · footer (raiz própria, sem UiSecao)
 * Ficha: docs/sections/fichas/footer.md (S23) · Conteúdo: content.json → secoes.footer (descricao_curta, colunas,
 * registro_profissional, links_legais, copyright), site.logo
 * Elementos: footer (raiz, faixa escura), footer__cartao (cartão claro arredondado, como o rodapé da Superpower), footer__marca, __logo, __descricao, __colunas, __coluna (FooterColuna), __coluna-titulo, __link,
 * __registro, __legal, __copyright
 * N0: nenhum data-anim. `registro` só renderiza quando `registro_profissional.texto` estiver preenchido (hoje vazio:
 * bloqueia o lançamento). `pb` reserva a barra inferior no mobile (altura da barra + área segura) e o flutuante no ≥768.
 * Sem CTA principal aqui (o contato é link de texto). Links legais: /privacidade e /termos entram na T5.1.
 */
import Image from "next/image";
import { conteudo } from "@/lib/conteudo";
import { LOGO } from "@/lib/midia";
import { UiContainer } from "@/ui/UiContainer";
import { FooterColuna } from "./FooterColuna";
import { FooterLink } from "./FooterLink";

export function Footer() {
  const secao = conteudo.secoes.footer;
  const registro = secao.registro_profissional.texto.trim();

  return (
    <footer
      className="footer bg-inverse px-2 pb-[calc(var(--space-9)_+_var(--safe-bottom))] md:pb-7"
      data-section="footer"
      data-ficha="S23"
      data-conteudo="secoes.footer"
    >
      <div className="footer__cartao rounded-md bg-surface py-section">
      <UiContainer classes="flex flex-col gap-7 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="footer__marca flex flex-col gap-3 lg:col-span-4">
          <Image src={LOGO.src} alt={LOGO.alt} width={LOGO.largura} height={LOGO.altura} sizes="144px" loading="lazy" className="footer__logo h-7 w-auto self-start" />
          <p className="footer__descricao max-w-measure font-body text-small text-muted">{secao.descricao_curta}</p>
        </div>
        <div className="footer__colunas grid gap-6 md:grid-cols-3 lg:col-span-7 lg:col-start-6">
          {secao.colunas.map((coluna) => (
            <FooterColuna key={coluna.titulo} titulo={coluna.titulo} links={coluna.links} />
          ))}
        </div>
        {registro ? <p className="footer__registro text-small text-muted lg:col-span-12">{registro}</p> : null}
        <div className="footer__legal flex flex-col border-t border-border pt-5 md:flex-row md:flex-wrap md:items-center md:gap-x-5 lg:col-span-12">
          {secao.links_legais.map((link) => (
            <FooterLink key={link.destino} href={link.destino}>
              {link.rotulo}
            </FooterLink>
          ))}
          <p className="footer__copyright text-small text-subtle md:ml-auto">{secao.copyright}</p>
        </div>
      </UiContainer>
      </div>
    </footer>
  );
}
