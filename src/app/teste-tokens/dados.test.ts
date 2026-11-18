/**
 * Confere a página teste-tokens (T1.1) contra docs/design-system.md e styles/design-tokens.css.
 * Rodar: npm test
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import tema from "../../../tailwind.config";
import {
  ESCALA,
  MINIMO,
  PALETA,
  PARES,
  PAR_PROIBIDO,
  razaoContraste,
  tokens,
} from "./dados";

const doc = readFileSync(join(process.cwd(), "docs", "design-system.md"), "utf8");

/** Linhas da tabela "Contraste verificado": nome, #frente, #fundo, razão. */
const linhasDoc = [
  ...doc.matchAll(/^\|\s*([^|]+?)\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*sobre\s*`(#[0-9A-Fa-f]{6})`\s*\|\s*([\d.]+):1\s*\|/gm),
].map((m) => ({ nome: m[1], frente: m[2].toUpperCase(), fundo: m[3].toUpperCase(), razao: Number(m[4]) }));

describe("contraste", () => {
  it("calcula valores conhecidos", () => {
    expect(razaoContraste("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(razaoContraste("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("pares de contraste × docs/design-system.md", () => {
  it("a tabela do doc foi lida (24 pares)", () => {
    expect(linhasDoc).toHaveLength(24);
    expect(PARES).toHaveLength(linhasDoc.length);
  });

  PARES.forEach((par, i) => {
    it(`${i + 1}. ${par.nome}: mesmas cores e mesma razão do doc`, () => {
      const linha = linhasDoc[i];
      const frente = tokens[par.frente];
      const fundo = tokens[par.fundo];
      expect(frente, `token ${par.frente}`).toBeDefined();
      expect(fundo, `token ${par.fundo}`).toBeDefined();
      // cores dos tokens = cores citadas no doc
      expect(frente.toUpperCase()).toBe(linha.frente);
      expect(fundo.toUpperCase()).toBe(linha.fundo);
      // razão documentada = razão da página = razão calculada dos tokens (tolerância de arredondamento)
      expect(par.doc).toBe(linha.razao);
      expect(Math.abs(razaoContraste(frente, fundo) - linha.razao)).toBeLessThanOrEqual(0.011);
    });

    it(`${i + 1}. ${par.nome}: atinge o mínimo AA`, () => {
      const minimo = MINIMO[par.tipo as keyof typeof MINIMO];
      expect(razaoContraste(tokens[par.frente], tokens[par.fundo])).toBeGreaterThanOrEqual(minimo);
    });
  });

  it("par proibido (secondary sobre bg-teal) reprova AA para texto e bate com o doc (4,28:1)", () => {
    const r = razaoContraste(tokens[PAR_PROIBIDO.frente], tokens[PAR_PROIBIDO.fundo]);
    expect(r).toBeLessThan(MINIMO.texto);
    expect(Math.abs(r - PAR_PROIBIDO.doc)).toBeLessThanOrEqual(0.011);
    expect(doc).toContain("4,28:1");
  });
});

describe("paleta", () => {
  const naPagina = PALETA.flatMap((g) => g.itens);

  it("mostra todos os tokens --color-* do CSS", () => {
    const todos = Object.keys(tokens).filter((t) => t.startsWith("--color-"));
    expect(naPagina.map((i) => i.token).sort()).toEqual(todos.sort());
  });

  it("toda amostra aponta para um token existente e tem classe do tema (T0.3)", () => {
    const cores = tema.theme?.colors as Record<string, string>;
    for (const { token, classe } of naPagina) {
      expect(tokens[token], token).toBeDefined();
      const chave = classe.replace(/^bg-/, "");
      expect(cores[chave], `${classe} deve existir no tailwind.config.ts`).toBe(`var(${token})`);
    }
  });

  it("os grupos citados no doc existem", () => {
    for (const g of ["Fundo", "Texto", "Marca", "Sobre escuro", "Borda e foco", "Feedback", "Canal"]) {
      expect(PALETA.map((p) => p.grupo)).toContain(g);
    }
  });
});

describe("escala tipográfica × docs/design-system.md", () => {
  it("os degraus têm token no CSS", () => {
    for (const d of ESCALA) expect(tokens[d.token], d.token).toBeDefined();
  });

  it("clamp(min…max) do doc = clamp dos tokens", () => {
    const doc_clamps = [...doc.matchAll(/`([a-z0-9-]+)`\s+clamp\(([\d.]+rem)…([\d.]+rem)\)/g)];
    expect(doc_clamps.length).toBeGreaterThanOrEqual(5);
    for (const [, nome, min, max] of doc_clamps) {
      const css = tokens[`--text-${nome}`];
      expect(css, `--text-${nome}`).toBeDefined();
      const m = /^clamp\(\s*([\d.]+rem)\s*,[^,]+,\s*([\d.]+rem)\s*\)$/.exec(css);
      expect(m, css).not.toBeNull();
      expect([m![1], m![2]]).toEqual([min, max]);
    }
  });

  it("body = 1rem e small = 0.875rem", () => {
    expect(tokens["--text-body"]).toBe("1rem");
    expect(tokens["--text-small"]).toBe("0.875rem");
    expect(doc).toContain("`body` 1rem");
    expect(doc).toContain("`small` 0.875rem");
  });
});
