/**
 * Testes · UiIcone (T2.3). Ficha: docs/sections/componentes.md §1 · Conteúdo: content.json (todo `icone`)
 * Rodar: npm test
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { conteudo } from "@/lib/conteudo";
import { REGISTRO_ICONES, UiIcone } from "./UiIcone";

function iconesDoConteudo(): string[] {
  const achados = new Set<string>();
  const visitar = (no: unknown) => {
    if (Array.isArray(no)) no.forEach(visitar);
    else if (no && typeof no === "object") {
      for (const [chave, valor] of Object.entries(no)) {
        if (chave === "icone" && typeof valor === "string") achados.add(valor);
        else visitar(valor);
      }
    }
  };
  visitar(conteudo);
  return [...achados];
}

describe("UiIcone", () => {
  it("todo `icone` do content.json está no registro", () => {
    const usados = iconesDoConteudo();
    expect(usados.length).toBeGreaterThan(0);
    for (const nome of usados) expect(Object.keys(REGISTRO_ICONES)).toContain(nome);
  });

  it("o registro tem exatamente os 19 nomes fechados", () => {
    expect(Object.keys(REGISTRO_ICONES).sort()).toEqual(
      [
        "activity", "droplets", "moon", "ruler", "circle-dot", "sparkles", "bone", "stethoscope",
        "menu", "x", "check", "arrow-right", "arrow-down", "chevron-down", "plus", "pause", "play", "map-pin", "message-circle",
      ].sort(),
    );
  });

  it("nome desconhecido lança erro (inclusive nomes herdados do Object)", () => {
    expect(() => renderToStaticMarkup(<UiIcone nome="nao-existe" />)).toThrow(/fora do registro/);
    expect(() => renderToStaticMarkup(<UiIcone nome="toString" />)).toThrow();
  });

  it("decorativo = aria-hidden; com rótulo = role=img + aria-label", () => {
    const deco = renderToStaticMarkup(<UiIcone nome="check" />);
    expect(deco).toContain('aria-hidden="true"');
    expect(deco).not.toContain("role=");
    const com = renderToStaticMarkup(<UiIcone nome="check" rotulo="Incluído" />);
    expect(com).toContain('role="img"');
    expect(com).toContain('aria-label="Incluído"');
  });

  it("contorno usa rounded-icon; a classe-nome da seção vem primeiro; tamanho vira width/height", () => {
    const html = renderToStaticMarkup(<UiIcone nome="droplets" contorno tamanho={32} className="servicos__card-icone" />);
    expect(html).toMatch(/class="servicos__card-icone ui-icone[^"]*rounded-icon/);
    expect(html).toContain('width="32"');
  });
});
