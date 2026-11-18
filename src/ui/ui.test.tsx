/**
 * Testes de marcação · componentes ui-* base (T2.4)
 * Ficha: docs/sections/componentes.md §1 e §4 · Conteúdo: content.json → site.ctas.principal, site.logo
 * Server components via renderToStaticMarkup (sem JSDOM). Rodar: npm test
 */
import { describe, expect, it } from "vitest";
import { resolverCta } from "@/lib/cta";
import { conteudo } from "@/lib/conteudo";
import { LOGO } from "@/lib/midia";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import { UiBotao } from "./UiBotao";
import { UiCard } from "./UiCard";
import { UiChip } from "./UiChip";
import { UiContainer } from "./UiContainer";
import { UiCtaPrincipal } from "./UiCtaPrincipal";
import { UiLink } from "./UiLink";
import { UiMidia } from "./UiMidia";
import { UiSecao } from "./UiSecao";
import { UiSelo } from "./UiSelo";
import { UiTitulo } from "./UiTitulo";

describe("UiCtaPrincipal", () => {
  const cta = resolverCta("@ctas.principal");

  it("devolve texto e href de site.ctas.principal, com data-cta e data-cta-local", () => {
    const html = renderizar(<UiCtaPrincipal local="hero" className="hero__cta" />);
    expect(html).toContain(`>${conteudo.site.ctas.principal.texto}</a>`);
    const [tag] = tagsCom(html, 'data-cta="principal"');
    expect(valorDe(tag, "href")).toBe(cta.href.replaceAll("&", "&amp;"));
    expect(valorDe(tag, "data-cta-local")).toBe("hero");
    expect(valorDe(tag, "rel")).toBe("noopener noreferrer");
    expect(valorDe(tag, "data-anim")).toBe("botao");
  });

  it("a classe-nome da seção vem primeiro e o estilo é o do primário", () => {
    const html = renderizar(<UiCtaPrincipal local="header" className="header__cta" />);
    const [tag] = tagsCom(html, 'data-cta="principal"');
    expect(valorDe(tag, "class")).toMatch(/^header__cta ui-botao /);
    expect(valorDe(tag, "class")).toContain("ui-botao--primario");
    expect(valorDe(tag, "class")).toContain("min-h-touch");
  });

  it("o mesmo texto e destino em qualquer local (barra, painel…)", () => {
    const locais = ["header", "header-painel", "hero", "barra", "cta-final"];
    const hrefs = new Set(locais.map((l) => valorDe(tagsCom(renderizar(<UiCtaPrincipal local={l} />), "data-cta")[0], "href")));
    expect(hrefs.size).toBe(1);
  });
});

describe("UiBotao", () => {
  it("secundário usa o contorno e nunca a classe do primário", () => {
    const html = renderizar(<UiBotao href="#servicos">Ver serviços</UiBotao>);
    expect(html).toContain("ui-botao--secundario");
    expect(html).not.toContain("ui-botao--primario");
    expect(html).not.toContain("data-cta");
  });

  it("externo traz target e rel seguros", () => {
    const html = renderizar(<UiBotao href="https://exemplo.com" externo>Ir</UiBotao>);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe("UiLink", () => {
  it("externo com rel seguro; seta é decorativa", () => {
    const html = renderizar(<UiLink href="https://exemplo.com" externo seta>Saiba mais</UiLink>);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("UiSecao", () => {
  it("emite id, data-section, data-ficha, data-conteudo e aria-labelledby; classe-nome = bloco", () => {
    const html = renderizar(
      <UiSecao id="servicos" bloco="servicos" ficha="S06" conteudo="secoes.servicos" labelledby="servicos__titulo" tom="alt">
        <p>x</p>
      </UiSecao>,
    );
    const [tag] = tagsCom(html, "<section");
    expect(valorDe(tag, "id")).toBe("servicos");
    expect(valorDe(tag, "data-section")).toBe("servicos");
    expect(valorDe(tag, "data-ficha")).toBe("S06");
    expect(valorDe(tag, "data-conteudo")).toBe("secoes.servicos");
    expect(valorDe(tag, "aria-labelledby")).toBe("servicos__titulo");
    expect(valorDe(tag, "class")).toMatch(/^servicos ui-secao /);
    expect(valorDe(tag, "class")).toContain("bg-bg-alt");
  });

  it("prova-rapida usa aria-label; inverse usa bg-inverse; compacta troca o padding", () => {
    const html = renderizar(
      <UiSecao id="prova" bloco="prova-rapida" ficha="S02" conteudo="secoes.prova_rapida" ariaLabel="Por que confiar" tom="inverse" compacta>
        <p>x</p>
      </UiSecao>,
    );
    const [tag] = tagsCom(html, "<section");
    expect(valorDe(tag, "aria-label")).toBe("Por que confiar");
    expect(valorDe(tag, "aria-labelledby")).toBeNull();
    expect(valorDe(tag, "class")).toContain("bg-inverse");
    expect(valorDe(tag, "class")).toContain("py-7");
    expect(valorDe(tag, "class")).not.toContain("py-section");
  });
});

describe("UiContainer", () => {
  it("classe-nome do elemento primeiro, depois ui-container", () => {
    const html = renderizar(<UiContainer className="hero__conteudo">x</UiContainer>);
    expect(html).toMatch(/class="hero__conteudo ui-container /);
  });
  it("sem className não escreve undefined", () => {
    expect(renderizar(<UiContainer>x</UiContainer>)).not.toContain("undefined");
  });
});

describe("UiTitulo", () => {
  it("transforma **x** em accent-serif e usa o nível pedido", () => {
    const html = renderizar(<UiTitulo nivel="h1" className="hero__titulo">{conteudo.secoes.hero.headline}</UiTitulo>);
    expect(html).toMatch(/^<h1 class="hero__titulo ui-titulo /);
    expect(html).toContain('<span class="accent-serif">caro</span>');
    expect(html).not.toContain("**");
    expect(html).toContain("text-h1");
  });

  it("tom inverso usa o destaque rosa claro", () => {
    const html = renderizar(<UiTitulo nivel="h2" tom="inverso">Um **título**</UiTitulo>);
    expect(html).toContain("text-on-inverse");
    expect(html).toContain("accent-serif");
  });
});

describe("UiMidia", () => {
  it("hero com src pendente: nenhum <img>, bloco bg-bg-alt com aspect-hero", () => {
    const html = renderizar(<UiMidia src="pendente" alt="x" proporcao="hero" className="hero__midia" priority />);
    expect(html).not.toContain("<img");
    expect(html).toContain("bg-bg-alt");
    expect(html).toContain("aspect-hero");
    expect(html).toMatch(/^<div class="hero__midia ui-midia /);
  });

  it("card com src pendente e ocultarSePendente: não renderiza nada", () => {
    expect(renderizar(<UiMidia src="pendente" alt="x" proporcao="card" ocultarSePendente />)).toBe("");
  });

  it("src real: <img> com alt, width/height, sizes e prioridade só quando pedida", () => {
    const html = renderizar(<UiMidia src="assets/foto.jpg" alt="Atendimento" proporcao="hero" priority sizes="(min-width: 1024px) 50vw, 100vw" />);
    const [img] = tagsCom(html, "<img");
    expect(valorDe(img, "src")).toBe("/assets/foto.jpg");
    expect(valorDe(img, "alt")).toBe("Atendimento");
    expect(valorDe(img, "width")).toBe("800");
    expect(valorDe(img, "height")).toBe("1000");
    expect(valorDe(img, "sizes")).toBe("(min-width: 1024px) 50vw, 100vw");
    expect(valorDe(img, "fetchPriority")).toBe("high");
    const lazy = renderizar(<UiMidia src="assets/foto.jpg" alt="x" proporcao="card" />);
    expect(lazy).toContain('loading="lazy"');
  });

  it("o logo é normalizado para /assets/logo-afisiopop.png em um só lugar", () => {
    expect(conteudo.site.logo.src).toBe("assets/logo-afisiopop.png");
    expect(LOGO.src).toBe("/assets/logo-afisiopop.png");
  });
});

describe("UiSelo, UiChip e UiCard", () => {
  it("selo mostra valor e rótulo do conteúdo, sem data-anim (N0)", () => {
    const { valor, rotulo } = conteudo.secoes.hero.selo;
    const html = renderizar(<UiSelo valor={valor} rotulo={rotulo} className="hero__selo" />);
    expect(html).toContain(valor);
    expect(html).toContain(rotulo);
    expect(html).not.toContain("data-anim");
    expect(html).toContain("bg-primary-soft");
  });

  it("selo aviso usa o par warning; chip e card respeitam o tom", () => {
    expect(renderizar(<UiSelo valor="x" tom="aviso" />)).toContain("bg-warning-bg");
    expect(renderizar(<UiChip tom="inverso">a</UiChip>)).toContain("text-on-inverse-accent");
    expect(renderizar(<UiChip>a</UiChip>)).toContain("bg-primary-soft");
    expect(renderizar(<UiCard tom="teal">a</UiCard>)).toContain("bg-bg-teal");
    expect(renderizar(<UiCard as="article" className="servicos__card">a</UiCard>)).toMatch(/^<article class="servicos__card ui-card /);
  });
});

describe("regra global do CTA", () => {
  it("só UiCtaPrincipal emite data-cta=principal (os demais componentes não)", () => {
    const outros = [
      renderizar(<UiBotao href="#a">a</UiBotao>),
      renderizar(<UiLink href="#a">a</UiLink>),
      renderizar(<UiCard>a</UiCard>),
    ].join("");
    expect(contar(outros, 'data-cta="principal"')).toBe(0);
  });
});
