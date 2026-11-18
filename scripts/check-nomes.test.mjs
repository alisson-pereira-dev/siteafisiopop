/**
 * Testes de scripts/check-nomes.mjs (T2.0). Rodar: npm test
 * Fixtures boas passam; uma fixture ruim por regra (a–h) + unidades-* (reservado) falha.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { lerListaOficial, nomeValido, verificarArquivo, verificarPasta } from "./check-nomes.mjs";

const lista = lerListaOficial();
const CAB = "/**\n * Seção S01 · hero\n * Ficha: docs/sections/fichas/hero.md · Conteúdo: content.json → secoes.hero\n */\n";
const verificar = (arquivo, corpo, comCabecalho = true) =>
  verificarArquivo(arquivo, (comCabecalho ? CAB : "") + corpo, lista);
const regras = (erros) => [...new Set(erros.map((e) => e.regra))];

describe("lista oficial (§5 da convenção)", () => {
  it("lê os 13 blocos, com elementos conhecidos", () => {
    expect(lista.size).toBeGreaterThanOrEqual(13);
    expect(lista.get("hero")?.has("selo")).toBe(true);
    expect(lista.get("problema-solucao")?.has("passo-numero")).toBe(true);
    // texto entre parênteses da tabela não vira elemento
    expect(lista.get("problema-solucao")?.has("data-estado")).toBe(false);
  });

  it("valida nomes", () => {
    expect(nomeValido("hero__selo", lista)).toBe(true);
    expect(nomeValido("servicos__card--destaque", lista)).toBe(true);
    expect(nomeValido("servicos__card-icone", lista)).toBe(true);
    expect(nomeValido("ui-botao--primario", lista)).toBe(true);
    expect(nomeValido("whatsapp-float", lista)).toBe(true);
    expect(nomeValido("hero", lista)).toBe(true);
    expect(nomeValido("hero__circulo-rosa", lista)).toBe(false);
    expect(nomeValido("hero__selo__texto", lista)).toBe(false);
    expect(nomeValido("wrapper", lista)).toBe(false);
  });
});

describe("fixtures boas", () => {
  it("elemento com classe-nome, accent-serif e UiSecao completo", () => {
    const boa = `
      export function X() {
        return (
          <UiSecao id="inicio" bloco="hero" ficha="S01" conteudo="secoes.hero" labelledby="hero__titulo">
            <div className="hero__conteudo flex" data-anim="reveal">
              <span className="accent-serif">caro</span>
              <UiCtaPrincipal local="hero" className="hero__cta" />
            </div>
          </UiSecao>
        );
      }`;
    expect(verificar("src/secoes/hero/Hero.tsx", boa)).toEqual([]);
  });

  it("raízes de header e footer com raiz própria; prova-rapida com aria-label", () => {
    const boa = `
      export const A = () => <header className="header sticky" data-section="header" data-ficha="S00" data-conteudo="site.menu" />;
      export const B = () => <UiSecao id="prova" bloco="prova-rapida" ficha="S02" conteudo="secoes.prova_rapida" ariaLabel="x" />;`;
    expect(verificar("src/secoes/header/Header.tsx", boa)).toEqual([]);
  });

  it("UiCtaPrincipal pode emitir data-cta=principal; layout pode pôr data-js no html", () => {
    expect(
      verificar(
        "src/ui/UiCtaPrincipal.tsx",
        `export const C = ({ className, local }) => <a className={\`\${className} ui-botao--primario\`} data-cta="principal" data-cta-local={local} />;`,
      ),
    ).toEqual([]);
    expect(
      verificar("src/app/layout.tsx", `export const L = () => <html lang="pt-BR" data-js="" />;`),
    ).toEqual([]);
  });

  it("src/ui pode delegar a classe-nome com juntar(className, ...)", () => {
    expect(
      verificar(
        "src/ui/UiChip.tsx",
        `export const C = ({ className }) => <span className={juntar(className, "ui-chip rounded-full")} />;`,
      ),
    ).toEqual([]);
    expect(
      verificar("src/secoes/hero/Hero.tsx", `export const C = () => <span className={juntar("hero__selo", "p-3")} />;`),
    ).toEqual([]);
    expect(
      verificar("src/secoes/hero/Hero.tsx", `export const C = () => <span className={juntar("hero__bolinha", "p-3")} />;`),
    ).not.toEqual([]);
  });

  it("src/ui pode delegar a classe-nome com ${className}", () => {
    expect(
      verificar(
        "src/ui/UiContainer.tsx",
        "export const C = ({ className }) => <div className={`${className} ui-container mx-auto`} />;",
      ),
    ).toEqual([]);
  });
});

describe("fixtures ruins (uma por regra)", () => {
  const casos = [
    ["a: div sem className", "src/secoes/hero/Hero.tsx", `export const X = () => <div>oi</div>;`, "a"],
    [
      "a: 1ª classe fora da lista oficial",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <div className="hero__circulo-rosa p-5" />;`,
      "a",
    ],
    ["b: nome proibido", "src/secoes/hero/Hero.tsx", `export const X = () => <div className="hero__conteudo wrapper" />;`, "b"],
    [
      "c: section sem data-ficha",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <section id="a" data-section="hero" data-conteudo="x" aria-labelledby="t" />;`,
      "c",
    ],
    [
      "c: UiSecao sem ficha",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <UiSecao id="a" bloco="hero" conteudo="x" labelledby="t" />;`,
      "c",
    ],
    [
      "d: data-cta fora dos valores",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <a className="hero__cta" data-cta="outro" />;`,
      "d",
    ],
    [
      "d: data-cta=principal fora de UiCtaPrincipal",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <a className="hero__cta" data-cta="principal" data-cta-local="hero" />;`,
      "d",
    ],
    [
      "d: data-cta-local fora da lista",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <a className="hero__cta" data-cta="servico" data-cta-local="rodape" />;`,
      "d",
    ],
    [
      "d: data-cta-local unidades-* (reservado)",
      "src/secoes/unidades/UnidadesCard.tsx",
      `export const X = () => <a className="unidades__card-cta" data-cta="servico" data-cta-local="unidades-lauro" />;`,
      "d",
    ],
    [
      "e: data-anim fora do catálogo",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <div className="hero__midia" data-anim="selo" />;`,
      "e",
    ],
    [
      "e: data-estado fora dos valores",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <div className="hero__midia" data-estado="fechado" />;`,
      "e",
    ],
    [
      "f: data-motion fora do html",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <div className="hero__midia" data-motion="on" />;`,
      "f",
    ],
    [
      "f: setAttribute data-js-falhou fora de MotionInit/CtaObservador",
      "src/secoes/hero/Hero.tsx",
      `export const x = () => document.documentElement.setAttribute("data-js-falhou", "");`,
      "f",
    ],
    [
      "h: UiBotao primario fora de UiCtaPrincipal",
      "src/secoes/hero/Hero.tsx",
      `export const X = () => <UiBotao variante="primario" className="hero__cta" />;`,
      "h",
    ],
  ];
  it.each(casos)("%s", (_nome, arquivo, corpo, regra) => {
    expect(regras(verificar(arquivo, corpo))).toContain(regra);
  });

  it("g: arquivo sem cabeçalho de localização", () => {
    const erros = verificar("src/secoes/hero/Hero.tsx", `export const X = () => <div className="hero__conteudo" />;`, false);
    expect(regras(erros)).toEqual(["g"]);
  });

  it("g: comentário que não é de localização não vale", () => {
    const erros = verificarArquivo("src/x.tsx", "/** só um comentário */\nexport const x = 1;", lista);
    expect(regras(erros)).toEqual(["g"]);
  });
});

describe("projeto", () => {
  it("src atual passa", () => {
    const erros = verificarPasta(fileURLToPath(new URL("../src", import.meta.url)));
    expect(erros).toEqual([]);
  });

  it("a CLI sai com 0 no src atual", () => {
    const script = fileURLToPath(new URL("./check-nomes.mjs", import.meta.url));
    const ok = spawnSync(process.execPath, [script], { encoding: "utf8" });
    expect(ok.status).toBe(0);
  });
});
