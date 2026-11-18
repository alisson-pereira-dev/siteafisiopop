/**
 * Testes [auto] · acesso fixo ao WhatsApp (T2.1 e T2.7) — campo 9 da ficha global
 * Ficha: docs/sections/fichas/global-acesso-fixo.md · Conteúdo: content.json → site.ctas.principal, microcopy.acessibilidade
 * Marcação (server) + verificações estáticas de layout.tsx, globals.css e do código de motion.
 * Observer, foco, inert e watchdog no navegador são [manual] (registrados no estado do projeto).
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { conteudo } from "@/lib/conteudo";
import { resolverCta } from "@/lib/cta";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import { UiBarraCta } from "./UiBarraCta";
import { WhatsappFloat } from "./WhatsappFloat";

const raiz = path.resolve(__dirname, "..", "..");
const ler = (relativo: string) => fs.readFileSync(path.join(raiz, relativo), "utf8");

describe("UiBarraCta", () => {
  const html = renderizar(<UiBarraCta />);
  const [barra] = tagsCom(html, "ui-barra-cta");
  const [botao] = tagsCom(html, 'data-cta="principal"');

  it("só <768px (md:hidden), fixa embaixo, com pb somando a área segura do iOS", () => {
    const classe = valorDe(barra, "class")!;
    expect(classe).toMatch(/^ui-barra-cta /);
    expect(classe).toContain("md:hidden");
    expect(classe).toContain("fixed inset-x-0 bottom-0");
    expect(classe).toContain("var(--safe-bottom)");
  });

  it("embrulha UiCtaPrincipal (local barra): mesmo texto, mesmo destino, alvo ≥ 48px", () => {
    expect(valorDe(botao, "data-cta-local")).toBe("barra");
    expect(valorDe(botao, "href")).toBe(resolverCta("@ctas.principal").href.replaceAll("&", "&amp;"));
    expect(valorDe(botao, "class")).toContain("min-h-touch");
    expect(html).toContain(`>${conteudo.site.ctas.principal.texto}</a>`);
    expect(contar(html, 'data-cta="principal"')).toBe(1);
  });

  it("nasce pendente (sem JS fica visível; o CtaObservador resolve), com a receita barra-cta", () => {
    expect(valorDe(barra, "data-estado")).toBe("pendente");
    expect(valorDe(barra, "data-anim")).toBe("barra-cta");
  });
});

describe("WhatsappFloat", () => {
  const html = renderizar(<WhatsappFloat />);
  const [link] = tagsCom(html, "whatsapp-float ");

  it("só ≥768px (hidden md:flex), 56px, bg-whatsapp e ícone em tinta", () => {
    const classe = valorDe(link, "class")!;
    expect(classe).toContain("hidden");
    expect(classe).toContain("md:flex");
    expect(classe).toContain("h-[var(--tamanho-float)]");
    expect(classe).toContain("bg-whatsapp");
    expect(classe).toContain("text-whatsapp-contrast");
  });

  it("data-cta=flutuante, aria-label = abrir_whatsapp, mesmo destino; não é o primário", () => {
    expect(valorDe(link, "data-cta")).toBe("flutuante");
    expect(valorDe(link, "aria-label")).toBe(conteudo.microcopy.acessibilidade.abrir_whatsapp);
    expect(valorDe(link, "href")).toBe(resolverCta("@ctas.principal").href.replaceAll("&", "&amp;"));
    expect(html).not.toContain("ui-botao--primario");
    expect(html).not.toContain('data-cta="principal"');
  });

  it("pulso decorativo aria-hidden, nasce inativo; estado inicial pendente", () => {
    const [pulso] = tagsCom(html, 'data-anim="float-pulso"');
    expect(valorDe(pulso, "aria-hidden")).toBe("true");
    expect(valorDe(pulso, "data-estado")).toBe("inativa");
    expect(valorDe(link, "data-estado")).toBe("pendente");
  });
});

describe("layout.tsx e script inline (T2.1)", () => {
  const layout = ler("src/app/layout.tsx");

  it("viewport com viewportFit: cover", () => {
    expect(layout).toMatch(/viewportFit:\s*"cover"/);
  });

  it("o script inline põe só data-js (não data-motion) e arma o watchdog de 4 s com constante nomeada", () => {
    const script = layout.match(/const SCRIPT_INICIAL = `([^`]*)`/)![1];
    expect(script).toContain('setAttribute("data-js","")');
    expect(script).not.toContain("data-motion");
    expect(script).toContain('hasAttribute("data-js-pronto")');
    expect(script).toContain('setAttribute("data-js-falhou","")');
    expect(layout).toContain("const PRAZO_WATCHDOG_MS = 4000;");
    expect(script).toContain("${PRAZO_WATCHDOG_MS}");
  });

  it("html com suppressHydrationWarning e <main id=conteudo>", () => {
    expect(layout).toContain("suppressHydrationWarning");
    expect(layout).toContain('<main id="conteudo">');
  });
});

describe("globals.css (T2.1)", () => {
  const css = ler("src/app/globals.css");

  it("variáveis do app", () => {
    for (const v of ["--safe-bottom: env(safe-area-inset-bottom", "--barra-cta-altura: 0px", "--scale-hover: 1.02", "--scale-press: 0.98"]) {
      expect(css).toContain(v);
    }
    expect(css).toContain("scroll-padding-top: calc(var(--header-height) + var(--space-4))");
    expect(css).toContain("scroll-padding-bottom: var(--barra-cta-altura)");
  });

  it("rolagem suave só com mouse e sem reduced-motion (desligada no toque)", () => {
    const bloco = css.match(/@media \(prefers-reduced-motion: no-preference\) and \(hover: hover\) and \(pointer: fine\) \{\s*html \{\s*scroll-behavior: smooth;/);
    expect(bloco).not.toBeNull();
    expect(contar(css, "scroll-behavior")).toBe(1);
  });

  it("estado inicial oculto dos reveal só com data-motion=on (nunca sem JS pronto)", () => {
    expect(css).toMatch(/\[data-motion="on"\] \[data-anim~="reveal"\]:not\(\[data-estado="visto"\]\)/);
    expect(css).not.toMatch(/(^|\n)\[data-anim~="reveal"\]\s*\{/);
  });

  it("stage do S03 (stage.css): pílula só com html[data-js] pronto; sem JS as cópias ficam empilhadas; sem data-motion", () => {
    const stage = ler("src/app/stage.css");
    expect(stage).toMatch(/\[data-anim~="stage-passos"\] \{\s*display: none;/);
    expect(stage).toMatch(/html\[data-js\]:not\(\[data-js-falhou\]\) \[data-anim~="stage-copias"\] \{\s*display: grid;/);
    expect(stage).not.toContain("data-motion");
  });

  it("falha segura: data-js-falhou mostra barra e flutuante", () => {
    expect(css).toMatch(/html\[data-js-falhou\] \[data-anim~="barra-cta"\],\s*html\[data-js-falhou\] \[data-anim~="float"\]/);
  });

  it("transições e animações só tocam transform, opacity (e visibility, que só alterna o que já está escondido)", () => {
    const permitidas = new Set(["opacity", "transform", "visibility"]);
    const usos = [...css.matchAll(/transition:\s*([^;]+);/g)].map((m) => m[1]);
    for (const uso of usos) {
      if (uso.trim() === "none") continue;
      for (const parte of uso.split(",")) {
        const propriedade = parte.trim().split(/\s+/)[0];
        expect(permitidas.has(propriedade), `transition em "${propriedade}"`).toBe(true);
      }
    }
    for (const m of css.matchAll(/transition-property:\s*([^;]+);/g)) expect(m[1]).toMatch(/transform|opacity/);
  });

  it("durações e curvas só dos tokens (nenhuma duração literal em ms/s)", () => {
    const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const literais = [...semComentarios.matchAll(/(?:transition|animation)[a-z-]*:[^;]*\b\d+(?:\.\d+)?m?s\b[^;]*;/g)].filter((m) => !/(visibility|transform) 0s linear var\(--dur-(fast|base)\)/.test(m[0]));
    expect(literais.map((m) => m[0])).toEqual([]);
  });
});

describe("destaque sobre faixa escura", () => {
  it("globals.css pinta o accent-serif de rosa claro dentro de .section-inverse (sem camada)", () => {
    expect(ler("src/app/globals.css")).toMatch(/\.section-inverse \.accent-serif \{\s*color: var\(--color-on-inverse-primary\);/);
  });
});

describe("código de motion", () => {
  const fontes = ["src/ui/CtaObservador.tsx", "src/ui/MotionInit.tsx", "src/secoes/header/HeaderPainel.tsx"].map(ler);

  it("nenhum listener de scroll, wheel ou touchmove", () => {
    for (const f of fontes) expect(f).not.toMatch(/addEventListener\(\s*["'](scroll|wheel|touchmove)["']/);
  });

  it("CtaObservador e MotionInit marcam data-js-pronto e tratam falha com data-js-falhou", () => {
    for (const f of [fontes[0], fontes[1]]) {
      expect(f).toContain('setAttribute("data-js-pronto"');
      expect(f).toContain('setAttribute("data-js-falhou"');
      expect(f).toContain('removeAttribute("data-motion")');
    }
  });

  it("MotionInit põe data-motion só depois de marcar `visto` o que já está na tela", () => {
    const f = fontes[1];
    expect(f.indexOf('setAttribute("data-estado", "visto")')).toBeGreaterThan(-1);
    expect(f.indexOf('setAttribute("data-estado", "visto")')).toBeLessThan(f.indexOf('setAttribute("data-motion", "on")'));
    expect(f).toContain("matchMedia(\"(prefers-reduced-motion: reduce)\")");
  });

  it("globals não tem scroll-snap nem backdrop-filter", () => {
    const css = ler("src/app/globals.css").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).not.toMatch(/scroll-snap|backdrop-filter/);
  });
});

describe("botão flutuante do WhatsApp (removido do layout em 18/11/2026, pedido do usuário)", () => {
  it("o layout não monta mais o WhatsappFloat; o acesso fixo ≥768px é só o CTA do header; a barra inferior do mobile segue", () => {
    const layout = ler("src/app/layout.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(layout).not.toMatch(/WhatsappFloat/);
    expect(layout).toContain("<UiBarraCta />");
    expect(layout).toContain("<CtaObservador />");
  });

  it("o observador tolera a ausência do flutuante (nenhum erro quando não há [data-anim=float])", () => {
    const codigo = ler("src/ui/CtaObservador.tsx");
    expect(codigo).toMatch(/flutuante\?\.querySelector/);
    expect(codigo).toMatch(/if \(flutuante\) \{/);
  });
});
