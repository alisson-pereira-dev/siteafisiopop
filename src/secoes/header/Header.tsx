/**
 * Seção S00 · header (faixa de preço + barra sticky "pílula de vidro")
 * Ficha: docs/sections/fichas/header.md (S00) · Conteúdo: content.json → site.menu, site.faixa_topo, site.logo,
 * site.ctas.principal, microcopy.acessibilidade
 * Elementos: header (raiz própria), header__pular-conteudo, __faixa-preco, __barra, __barra-conteudo, __pilula,
 * __logo, __nav, __nav-link, __nav-simples, __nav-simples-link, __cta, __botao-menu (+ pontos), __painel-fundo, __painel (+ cabecalho,
 * titulo, fechar), __painel-link, __painel-cta
 * Modelo visual: referência "pílula de vidro" (decisão do usuário, 16/11/2026): no topo a barra é transparente (logo colorido, links
 * escuros); ao rolar (> 60 px; HeaderBarra) vira uma pílula de vidro escuro com logo branco menor, e o menu abre numa gaveta lateral.
 * Os links ficam inline só a partir de 1280px (cinco links + CTA não cabem antes); abaixo disso ficam na gaveta.
 * A raiz é `contents`: a faixa rola e sai e só a barra fica sticky (o bloco de contenção do sticky vira o body).
 * Sem JS: `noscript` com a lista simples de links (header__nav-simples) e o botão de menu escondido (HeaderPainel).
 * CTA principal no header só a partir de 768px (`header`) e no painel (`header-painel`); no mobile o acesso fixo é a barra inferior.
 */
import Image from "next/image";
import { conteudo } from "@/lib/conteudo";
import { hrefDaHome } from "@/lib/ancora";
import { LOGO } from "@/lib/midia";
import { UiContainer } from "@/ui/UiContainer";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { HeaderBarra } from "./HeaderBarra";
import { HeaderPainel } from "./HeaderPainel";

export function Header() {
  const { menu, faixa_topo: faixa } = conteudo.site;
  const acessibilidade = conteudo.microcopy.acessibilidade;

  return (
    <header className="header contents" data-section="header" data-ficha="S00" data-conteudo="site.menu">
      <a
        href="#conteudo"
        className="header__pular-conteudo sr-only rounded-full bg-bg px-5 py-3 font-strong text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-modal"
      >
        {acessibilidade.pular_para_conteudo}
      </a>
      <p className="header__faixa-preco bg-inverse px-pad py-2 text-center text-small text-on-inverse">
        {faixa.texto}
      </p>
      <HeaderBarra>
        <UiContainer className="header__barra-conteudo" classes="flex h-full items-center justify-center gap-2">
          <div className="header__pilula" data-anim="header-pilula">
            <a
              href={hrefDaHome("#inicio")}
              className="header__logo flex min-h-touch shrink-0 items-center xl:absolute xl:left-1/2 xl:top-1/2"
              data-anim="header-logo"
            >
              <Image
                src={LOGO.src}
                alt={LOGO.alt}
                width={LOGO.largura}
                height={LOGO.altura}
                sizes="144px"
                priority
                className="h-7 w-auto"
              />
            </a>
            <nav className="header__nav hidden items-center gap-4 xl:flex" aria-label={acessibilidade.navegacao_principal}>
              {menu.map((item) => (
                <a
                  key={item.destino}
                  href={hrefDaHome(item.destino)}
                  className="header__nav-link inline-flex min-h-touch items-center text-small"
                  data-anim="header-link"
                >
                  {item.rotulo}
                </a>
              ))}
            </nav>
            <UiCtaPrincipal local="header" className="header__cta max-md:hidden" />
          </div>
          <HeaderPainel
            links={menu}
            titulo={acessibilidade.titulo_menu}
            rotuloAbrir={acessibilidade.abrir_menu}
            rotuloFechar={acessibilidade.fechar_menu}
            rotuloNavegacao={acessibilidade.navegacao_principal}
          >
            <UiCtaPrincipal local="header-painel" className="header__painel-cta mt-5" cheio="sempre" />
          </HeaderPainel>
        </UiContainer>
      </HeaderBarra>
      {/* Sem JS o botão de menu some e os links aparecem como lista simples (a página é de uma coluna só). */}
      <noscript>
        <nav className="header__nav-simples bg-bg-alt px-pad py-2 xl:hidden" aria-label={acessibilidade.navegacao_principal}>
          <ul className="mx-auto flex max-w-container flex-wrap gap-x-5">
            {menu.map((item) => (
              <li key={item.destino}>
                <a
                  href={hrefDaHome(item.destino)}
                  className="header__nav-simples-link inline-flex min-h-touch items-center text-body text-foreground underline"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </header>
  );
}
