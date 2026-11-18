/**
 * Testes [auto] · S01 hero (T2.6) — campo 9 da ficha
 * Ficha: docs/sections/fichas/hero.md · Conteúdo: content.json → secoes.hero, site.ctas
 * Marcação via renderToStaticMarkup (sem JSDOM). LCP, CLS, INP e as larguras são [manual].
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { conteudo } from "@/lib/conteudo";
import { resolverCta } from "@/lib/cta";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import { UiMidia } from "@/ui/UiMidia";
import { Hero } from "./Hero";

const html = renderizar(<Hero />);
const hero = conteudo.secoes.hero;

describe("Hero: título e CTAs", () => {
  it("um único h1, com o texto de secoes.hero.headline e **caro** em accent-serif", () => {
    expect(contar(html, "<h1")).toBe(1);
    expect(html).toContain('<span class="accent-serif">caro</span>');
    const texto = html.match(/<h1[^>]*>(.*?)<\/h1>/)![1].replace(/<[^>]+>/g, "");
    expect(texto).toBe(hero.headline.replaceAll("**", ""));
  });

  it("um único data-cta-local=hero, com texto e destino de site.ctas.principal", () => {
    const tags = tagsCom(html, 'data-cta-local="hero"');
    expect(tags).toHaveLength(1);
    expect(valorDe(tags[0], "data-cta")).toBe("principal");
    expect(valorDe(tags[0], "href")).toBe(resolverCta("@ctas.principal").href.replaceAll("&", "&amp;"));
    expect(html).toContain(`>${conteudo.site.ctas.principal.texto}</a>`);
  });

  it("wireframe: 1 só botão (o primário); sem botão secundário, sem selo e sem microcopy (seguem no conteúdo)", () => {
    expect(contar(html, "ui-botao--primario")).toBe(1);
    expect(contar(html, "<a ")).toBe(1);
    expect(html).not.toMatch(/hero__cta-secundario|hero__selo|hero__microcopy|ui-botao--secundario/);
    expect(hero.selo.validar).toBe(true); // o conteúdo e a marca validar continuam
    expect(hero.cta_secundario).toBe("@ctas.secundario");
  });
});

describe("Hero: foto real (public/assets/hero-site.avif, gerada de hero.avif)", () => {
  it("o conteúdo aponta para o arquivo que existe; a <img> é priorizada, com dimensões declaradas, alt do conteúdo e enquadramento à direita", () => {
    expect(hero.midia.src).toBe("assets/hero-site.avif");
    expect(fs.existsSync(path.join(process.cwd(), "public", hero.midia.src))).toBe(true);
    const [img] = tagsCom(html, "<img");
    expect(valorDe(img, "alt")).toBe(hero.midia.alt);
    expect(valorDe(img, "fetchPriority")).toBe("high");
    expect(valorDe(img, "class")).toContain("object-right");
    expect(valorDe(img, "width")).toBe("2752");
    expect(valorDe(img, "height")).toBe("1536");
    expect(contar(html, "<img")).toBe(1);
  });
});

describe("Hero: mídia pendente (UiMidia cartão, usado enquanto o conteúdo não tiver foto)", () => {
  it("src=pendente: nenhum <img>; degradê de marca (bg-grad-soft) com a proporção reservada: faixa 4/3 no mobile e o cartão inteiro a partir de 768 (CLS 0)", () => {
    const pendente = renderizar(<UiMidia src="pendente" alt="x" proporcao="cartao" className="hero__midia" />);
    expect(pendente).not.toContain("<img");
    const [bloco] = tagsCom(pendente, "ui-midia");
    const c = valorDe(bloco, "class")!;
    expect(c).toContain("bg-grad-soft");
    expect(c).toContain("aspect-card");
    expect(c).toContain("md:absolute");
    expect(c).toContain("md:inset-0");
    expect(c).not.toContain("bg-bg-alt");
  });
});

describe("Hero: cartão arredondado (estrutura da Superpower)", () => {
  it("um único cartão rounded-md (px-2 na faixa, como o wireframe) com mídia, véu, conteúdo e indicadores dentro", () => {
    const [cartao] = tagsCom(html, "hero__cartao");
    expect(valorDe(cartao, "class")).toContain("rounded-md");
    expect(valorDe(tagsCom(html, "<section")[0], "class")).toContain("px-2");
    expect(valorDe(cartao, "class")).toContain("overflow-hidden");
    expect(valorDe(cartao, "class")).toContain("md:min-h-[var(--altura-hero-midia)]");
    expect(contar(html, "hero__cartao")).toBe(1);
    const dentro = html.slice(html.indexOf("hero__cartao"));
    for (const parte of ["hero__midia", "hero__veu", "hero__conteudo", "hero__indicadores"]) expect(dentro).toContain(parte);
  });

  it("véu = vidro fosco (glassmorphism, receita stage-vidro: só desfoque, sem véu branco) só ≥768 e decorativo (aria-hidden)", () => {
    const [veu] = tagsCom(html, "hero__veu");
    expect(valorDe(veu, "data-anim")).toBe("stage-vidro");
    expect(valorDe(veu, "class")).not.toMatch(/bg-veu-hero|bg-bg|bg-surface/);
    expect(valorDe(veu, "class")!.split(" ")).toEqual(expect.arrayContaining(["hidden", "md:block"]));
    expect(valorDe(veu, "aria-hidden")).toBe("true");
    expect(html).not.toContain("hero__moldura");
  });

  it("conteúdo à esquerda: 3/5 do cartão no tablet e 1/2 a partir de 1024", () => {
    const [c] = tagsCom(html, "hero__conteudo");
    expect(valorDe(c, "class")).toContain("md:w-3/5");
    expect(valorDe(c, "class")).toContain("lg:w-1/2");
  });
});

describe("Hero: indicadores dentro do cartão (como na Superpower)", () => {
  it("4 indicadores do conteúdo, dentro do cartão, depois do conteúdo e estáticos (sem contador nem data-anim)", () => {
    const lista = hero.indicadores;
    expect(lista).toHaveLength(4);
    expect(contar(html, "hero__indicador ")).toBe(4);
    const valores = [...html.matchAll(/hero__indicador-valor[^>]*>([^<]*)</g)].map((m) => m[1]);
    expect(valores).toEqual(lista.map((i) => i.valor));
    const dentro = html.slice(html.indexOf("hero__cartao"));
    expect(dentro.indexOf("hero__conteudo")).toBeLessThan(dentro.indexOf("hero__indicadores"));
    const trecho = html.slice(html.indexOf("hero__indicadores"));
    expect(trecho).not.toContain("data-anim");
    expect(trecho).not.toMatch(/contador|count/i);
  });

  it("itens validar dos indicadores seguem marcados no conteúdo; '+14 mil' é texto", () => {
    expect(hero.indicadores.filter((i) => "validar" in i && i.validar).map((i) => i.valor)).toEqual(["+14 mil", "3 unidades", "Avaliação incluída"]);
    expect(html).toContain(">+14 mil<");
  });

  it("indicadores: 2 colunas no mobile; a partir de 768 absolutos embaixo à esquerda, em linha, com fio entre eles", () => {
    const itens = tagsCom(html, "hero__indicador ");
    expect(valorDe(itens[0], "class")).not.toContain("md:border-l");
    for (const i of itens.slice(1)) expect(valorDe(i, "class")).toContain("md:border-l");
    const c = valorDe(tagsCom(html, "hero__indicadores")[0], "class")!;
    expect(c).toContain("grid-cols-2");
    expect(c).toContain("md:absolute");
    expect(c).toContain("md:flex");
  });
});

describe("Hero: regra 5 (nada acima da dobra começa escondido)", () => {
  it("nenhum reveal/stagger-item no hero; só botao (CTA) e stage-vidro (véu de vidro estático, sem animação)", () => {
    expect(html).not.toMatch(/data-anim="(reveal|stagger-item)"/);
    const anims = [...html.matchAll(/data-anim="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(anims)).toEqual(new Set(["botao", "stage-vidro", "pilha-base pilha-parallax"]));
    expect(anims).toHaveLength(3); // pilha-base = hero fixo atrás do como-funciona (sticky + parallax por CSS, só ≥768; não esconde nada)
  });

  it("etiqueta e subtítulo (com o preço R$ 49,99) vêm do conteúdo", () => {
    for (const t of [hero.etiqueta, hero.subheadline]) expect(html).toContain(t.replaceAll("&", "&amp;"));
    expect(hero.subheadline).toContain("R$ 49,99");
  });
});

describe("Hero: raiz da seção", () => {
  it("id=inicio, data-section, data-ficha=S01, data-conteudo e aria-labelledby apontando para o h1", () => {
    const [raiz] = tagsCom(html, "<section");
    expect(valorDe(raiz, "id")).toBe("inicio");
    expect(valorDe(raiz, "data-section")).toBe("hero");
    expect(valorDe(raiz, "data-ficha")).toBe("S01");
    expect(valorDe(raiz, "data-conteudo")).toBe("secoes.hero");
    expect(valorDe(raiz, "aria-labelledby")).toBe("hero__titulo");
    expect(html).toContain('id="hero__titulo"');
  });

  it("mobile: mídia no topo do cartão e texto embaixo (estrutura da Superpower); CTA em largura total no mobile", () => {
    expect(html.indexOf("hero__midia")).toBeLessThan(html.indexOf("hero__conteudo"));
    const [cta] = tagsCom(html, 'data-cta-local="hero"');
    expect(valorDe(cta, "class")).toContain("w-full");
    expect(valorDe(cta, "class")).toContain("min-h-touch");
  });
});
