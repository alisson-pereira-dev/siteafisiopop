/**
 * Testes [auto] · UiPilha: o como-funciona sobrepõe o hero ao rolar, com parallax leve do hero
 * Ficha: docs/sections/fichas/hero.md (revisão de 17/11/2026) · Código: src/ui/UiPilha.tsx, src/app/pilha.css, src/app/page.tsx
 * Marcação (server) + verificação estática do CSS e do código. O comportamento de rolagem é [manual 1280/768] (conferido no navegador).
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ComoFunciona } from "@/secoes/como-funciona/ComoFunciona";
import { Depoimentos } from "@/secoes/depoimentos/Depoimentos";
import { Unidades } from "@/secoes/unidades/Unidades";
import { Hero } from "@/secoes/hero/Hero";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import { UiPilha } from "./UiPilha";

const raiz = path.resolve(__dirname, "..", "..");
const ler = (relativo: string) => fs.readFileSync(path.join(raiz, relativo), "utf8");

describe("UiPilha", () => {
  const html = renderizar(
    <UiPilha>
      <Hero />
      <ComoFunciona />
    </UiPilha>,
  );

  it("raiz ui-pilha (data-anim=pilha) com hero (base) e como-funciona (topo) dentro, nessa ordem", () => {
    const [pilha] = tagsCom(html, "ui-pilha");
    expect(valorDe(pilha, "data-anim")).toBe("pilha");
    expect(contar(html, "ui-pilha")).toBe(1);
    expect(valorDe(tagsCom(html, 'data-section="hero"')[0], "data-anim")).toBe("pilha-base pilha-parallax");
    expect(valorDe(tagsCom(html, 'data-section="como-funciona"')[0], "data-anim")).toBe("pilha-topo");
    const ordem = ["hero", "como-funciona"].map((s) => html.indexOf(`data-section="${s}"`));
    expect(ordem[0]).toBeGreaterThan(-1);
    expect(ordem).toEqual([...ordem].sort((a, b) => a - b));
  });

  it("a página monta as duas seções dentro da pilha e o problema-solucao logo depois, sem mudar a ordem das seções", () => {
    const page = ler("src/app/page.tsx");
    expect(page).toMatch(/<UiPilha>\s*<Hero \/>\s*<ComoFunciona \/>\s*<\/UiPilha>\s*<ProblemaSolucao \/>/);
  });

  it("CSS: sticky só ≥768 e só com JS de movimento pronto (data-motion=on, que exclui reduced-motion); topo vem de --pilha-topo; cantos arredondados só na 1ª seção de cima", () => {
    const css = ler("src/app/pilha.css").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).toMatch(/@media \(min-width: 768px\)/);
    expect(css).toContain('html[data-motion="on"] [data-anim~="pilha-base"]');
    expect(css).toMatch(/position: sticky;\s*top: var\(--pilha-topo, auto\)/);
    expect(css).toMatch(/\[data-anim~="pilha-topo"\] \{\s*z-index: 1;/);
    expect(css).toContain('[data-anim~="pilha-base"] + [data-anim~="pilha-topo"]');
    expect(css.replace(/transition: none;/g, "")).not.toContain("transition");
    expect(css).toContain("overflow: clip"); // hidden criaria contêiner de rolagem e quebraria o view() dos cards
    expect(ler("src/app/layout.tsx")).toContain('import "./pilha.css"');
  });

  it("2ª pilha: depoimentos (base) + unidades (topo), logo depois de para-quem; cards da unidade entram de cima (desce)", () => {
    const page = ler("src/app/page.tsx");
    expect(page).toMatch(/<ParaQuem \/>\s*<UiPilha>\s*<Depoimentos \/>\s*<Unidades \/>\s*<\/UiPilha>\s*<PrecoPop \/>/);
    const dep = renderizar(<Depoimentos />);
    const uni = renderizar(<Unidades />);
    expect(valorDe(tagsCom(dep, 'data-section="depoimentos"')[0], "data-anim")).toBe("pilha-base");
    expect(valorDe(tagsCom(uni, 'data-section="unidades"')[0], "data-anim")).toBe("pilha-topo");
    for (const c of tagsCom(uni, "unidades__card ")) expect(valorDe(c, "data-anim")).toBe("stagger-item desce");
    const css = ler("src/app/pilha.css").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).toMatch(/\[data-anim~="desce"\]:not\(\[data-estado="visto"\]\) \{\s*transform: translateY\(calc\(var\(--reveal-distance\) \* -3\)\)/);
    expect(css).toContain('html[data-motion="on"] [data-anim~="desce"]'); // só com movimento ligado: nunca esconde nada sem JS
    // versão ligada à rolagem (CSS puro, atrás de @supports): desce de cima acompanhando o scroll, só opacity + transform
    expect(css).toMatch(/@supports \(animation-timeline: view\(\)\)[\s\S]*animation: desce-rolagem linear both;\s*animation-timeline: view\(\);\s*animation-range: entry 0% entry 70%/);
    const quadros = css.match(/@keyframes desce-rolagem\s*\{([\s\S]*?\})\s*\}/)![1];
    expect([...quadros.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]).filter((p) => p !== "from" && p !== "to")).toEqual(["opacity", "transform", "opacity", "transform"]);
    expect(quadros).toContain("translateY(calc(var(--space-6) * -3))");
    // em cadeia (≥1024): janelas de rolagem defasadas, um card por vez
    const faixas = [1, 2, 3].map((n) => css.match(new RegExp(`\\[data-anim~="desce"\\]:nth-child\\(${n}\\) \\{\\s*animation-range: ([^;]+);`))![1]);
    expect(faixas).toEqual(["entry 0% entry 45%", "entry 27% entry 72%", "entry 54% entry 100%"]);
    expect(css).toMatch(/@media \(min-width: 1024px\) \{\s*@supports \(animation-timeline: view\(\)\)/);
  });

  it("parallax leve do hero: CSS scroll-driven (sem listener), atrás de @supports, só transform (-20%)", () => {
    const css = ler("src/app/pilha.css").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).toContain("@supports (animation-timeline: scroll())");
    expect(css).toMatch(/\[data-anim~="pilha-parallax"\] \{\s*animation: pilha-parallax/); // só o hero (a 2ª pilha não tem parallax)
    expect(css).toMatch(/animation-timeline: scroll\(root block\)/);
    const quadros = css.match(/@keyframes pilha-parallax\s*\{([\s\S]*?\})\s*\}/)![1];
    const props = [...quadros.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
    expect(props).toEqual(["transform", "transform"]);
    expect(quadros).toContain("translateY(-20%)");
  });

  it("componente: mede a base com ResizeObserver + resize da janela (nunca scroll), limpa tudo ao sair e grava só --pilha-topo", () => {
    const codigo = ler("src/ui/UiPilha.tsx");
    expect(codigo).toContain('"use client"');
    expect(codigo).toContain("new ResizeObserver");
    expect(codigo).toContain('addEventListener("resize"');
    expect(codigo).not.toMatch(/addEventListener\(\s*["'](scroll|wheel|touchmove)/);
    expect(codigo).toContain("Math.min(0, window.innerHeight - base.getBoundingClientRect().height)");
    expect(codigo).toContain("observador.disconnect()");
    expect(codigo).toContain('removeProperty("--pilha-topo")');
  });
});
