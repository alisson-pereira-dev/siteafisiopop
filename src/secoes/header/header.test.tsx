/**
 * Testes [auto] · S00 header (T2.5) — campo 9 da ficha
 * Ficha: docs/sections/fichas/header.md · Conteúdo: content.json → site.menu, site.faixa_topo, site.logo, microcopy.acessibilidade
 * Marcação via renderToStaticMarkup (sem JSDOM). O que exige navegador (foco preso, inert, rolagem, IO) é [manual].
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hrefDaHome } from "@/lib/ancora";
import { conteudo } from "@/lib/conteudo";
import { LOGO } from "@/lib/midia";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import { Header } from "./Header";

const html = renderizar(<Header />);
const { menu, faixa_topo: faixa, ctas } = conteudo.site;
const acess = conteudo.microcopy.acessibilidade;

describe("Header: CTA principal e menu", () => {
  it("data-cta=principal só com data-cta-local header e header-painel", () => {
    const tags = tagsCom(html, 'data-cta="principal"');
    expect(tags.map((t) => valorDe(t, "data-cta-local")).sort()).toEqual(["header", "header-painel"]);
    // texto por contexto (18/11/2026): o header compacto encurta a pílula; o painel do menu mantém o texto canônico
    expect(contar(html, `>${conteudo.site.cta_texto_por_local.header}</a>`)).toBe(1);
    expect(conteudo.site.cta_texto_por_local.header).toBe("Agendar no WhatsApp");
    expect(contar(html, `>${ctas.principal.texto}</a>`)).toBe(1);
  });

  it("os 5 nav-link e os 5 links do painel são idênticos a site.menu", () => {
    const nav = tagsCom(html, "header__nav-link");
    const painel = tagsCom(html, "header__painel-link");
    expect(nav).toHaveLength(menu.length);
    expect(painel).toHaveLength(menu.length);
    // âncoras vão pela home (`/#faq`): em /privacidade, /termos e 404 o header leva de volta à home
    expect(nav.map((t) => valorDe(t, "href"))).toEqual(menu.map((m) => hrefDaHome(m.destino)));
    expect(painel.map((t) => valorDe(t, "href"))).toEqual(menu.map((m) => hrefDaHome(m.destino)));
    // 2 (nav + painel) + 1 (lista simples do noscript)
    for (const item of menu) expect(contar(html, `>${item.rotulo}</a>`)).toBe(3);
  });

  it("nav tem aria-label = navegacao_principal; CTA do header só aparece a partir de 768px", () => {
    const [nav] = tagsCom(html, "header__nav ");
    expect(valorDe(nav, "aria-label")).toBe(acess.navegacao_principal);
    const [cta] = tagsCom(html, 'data-cta-local="header"');
    expect(valorDe(cta, "class")).toContain("max-md:hidden");
  });
});

describe("Header: faixa de preço e logo", () => {
  it("renderiza site.faixa_topo.texto e não é sticky", () => {
    const [tag] = tagsCom(html, "header__faixa-preco");
    expect(html).toContain(faixa.texto);
    expect(valorDe(tag, "class")).not.toMatch(/sticky|fixed/);
  });

  it("só a barra é sticky (z-sticky) e de altura fixa (CLS 0); a pílula, o logo, os links e o botão de menu têm receita data-anim", () => {
    const [barra] = tagsCom(html, "header__barra ");
    expect(valorDe(barra, "class")).toMatch(/sticky top-0 z-sticky h-header/);
    expect(valorDe(tagsCom(html, "header__pilula")[0], "data-anim")).toBe("header-pilula");
    expect(valorDe(tagsCom(html, "header__logo")[0], "data-anim")).toBe("header-logo");
    const links = tagsCom(html, "header__nav-link");
    expect(links).toHaveLength(menu.length);
    for (const l of links) expect(valorDe(l, "data-anim")).toBe("header-link");
    expect(valorDe(tagsCom(html, "header__botao-menu ")[0], "data-anim")).toBe("header-menu");
    expect(html).not.toContain("header-fundo");
  });

  it("links inline só a partir de 1280px (hidden xl:flex); abaixo disso ficam na gaveta; logo centrado na pílula só ≥1280", () => {
    const [nav] = tagsCom(html, "header__nav ");
    expect(valorDe(nav, "class")).toContain("hidden");
    expect(valorDe(nav, "class")).toContain("xl:flex");
    expect(valorDe(tagsCom(html, "header__logo")[0], "class")).toContain("xl:absolute");
  });

  it("gaveta lateral: título do conteúdo, botão de fechar, fundo escurecido aria-hidden; grade 3x3 e X de 5 pontos", () => {
    expect(html).toContain(`>${acess.titulo_menu}</p>`);
    const [fechar] = tagsCom(html, "header__painel-fechar");
    expect(valorDe(fechar, "aria-label")).toBe(acess.fechar_menu);
    const [fundo] = tagsCom(html, "header__painel-fundo");
    expect(valorDe(fundo, "aria-hidden")).toBe("true");
    expect(valorDe(fundo, "data-anim")).toBe("painel-fundo");
    expect(valorDe(fundo, "data-estado")).toBeNull();
    expect(contar(html, "header__botao-menu-ponto ")).toBe(18);
    expect(contar(html, "visibility:hidden")).toBe(4); // o X esconde os pontos 2, 4, 6 e 8
  });

  it("logo com next/image priority, dimensões declaradas e alt do conteúdo; link para #inicio", () => {
    const [link] = tagsCom(html, "header__logo");
    expect(valorDe(link, "href")).toBe("/#inicio"); // pela home: em subpáginas leva de volta à home
    const [img] = tagsCom(html, "<img");
    expect(valorDe(img, "src")).toBe("/assets/logo-afisiopop.png");
    expect(valorDe(img, "alt")).toBe(conteudo.site.logo.alt);
    expect(valorDe(img, "width")).toBe(String(LOGO.largura));
    expect(valorDe(img, "height")).toBe(String(LOGO.altura));
    expect(valorDe(img, "fetchPriority")).toBe("high");
  });
});

describe("Header: acessibilidade", () => {
  it("o 1º elemento focável é 'Pular para o conteúdo', que leva a #conteudo", () => {
    const primeiro = html.match(/<(a|button)\b[^>]*>/);
    expect(primeiro?.[0]).toContain("header__pular-conteudo");
    expect(valorDe(primeiro![0], "href")).toBe("#conteudo");
    expect(html).toContain(`>${acess.pular_para_conteudo}</a>`);
  });

  it("botão de menu: aria-expanded=false, aria-controls e rótulo abrir_menu; painel nasce fechado e inert", () => {
    const [botao] = tagsCom(html, "header__botao-menu");
    expect(valorDe(botao, "aria-expanded")).toBe("false");
    expect(valorDe(botao, "aria-controls")).toBe("header-painel");
    expect(valorDe(botao, "aria-label")).toBe(acess.abrir_menu);
    const [painel] = tagsCom(html, "header__painel ");
    expect(painel).toMatch(/\sinert(=""|\s|>)/);
    expect(valorDe(painel, "data-estado")).toBeNull();
    expect(valorDe(painel, "data-anim")).toBe("painel");
    expect(valorDe(painel, "aria-label")).toBe(acess.navegacao_principal);
  });

  it("raiz própria com data-section, data-ficha e data-conteudo", () => {
    const [raiz] = tagsCom(html, "<header");
    expect(valorDe(raiz, "data-section")).toBe("header");
    expect(valorDe(raiz, "data-ficha")).toBe("S00");
    expect(valorDe(raiz, "data-conteudo")).toBe("site.menu");
  });
});

describe("Header: sem JS (ajuste da T2.8)", () => {
  it("o noscript traz os links do menu como lista simples e o botão de menu se esconde sem data-js", () => {
    const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";
    expect(noscript).toContain("header__nav-simples");
    expect(contar(noscript, "<li>")).toBe(menu.length);
    expect(contar(noscript, "<ul")).toBe(1);
    const [botao] = tagsCom(html, "header__botao-menu");
    expect(valorDe(botao, "class")).toContain("[html:not([data-js])_&]:hidden");
  });
});

describe("Header: código", () => {
  const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  const fontes = ["Header.tsx", "HeaderBarra.tsx", "HeaderPainel.tsx"].map((f) => fs.readFileSync(path.join(dir, f), "utf8"));
  const codigo = fontes.join("\n");

  it("exceção documentada do header: gatilho por listener de scroll passivo com histerese 60/52 (sem IntersectionObserver); o blur vive em header.css, não nos componentes", () => {
    expect(fontes[1]).toContain('addEventListener("scroll", aoRolar, { passive: true })');
    expect(fontes[1]).not.toContain("IntersectionObserver");
    expect(fontes[1]).toContain("EXCEÇÃO DOCUMENTADA");
    expect(codigo).not.toMatch(/backdrop-/);
    expect(codigo).not.toMatch(/addEventListener\(\s*["'](wheel|touchmove)["']/);
  });

  it("gaveta: o foco volta ao botão que abriu e o botão de menu existe em todas as larguras (sem matchMedia)", () => {
    expect(fontes[2]).toContain("botaoEl?.focus({ preventScroll: true })");
    expect(fontes[2]).not.toContain("matchMedia");
  });
});
