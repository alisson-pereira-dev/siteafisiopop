/**
 * Testes [auto] · S01 hero com mídia real (T2.6) — campo 9: "Com src real: priority, sizes, width/height e alt"
 * Ficha: docs/sections/fichas/hero.md · Conteúdo: secoes.hero.midia (substituída por um src de teste via mock do conteúdo)
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/conteudo", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/conteudo")>();
  const secoes = original.conteudo.secoes;
  return {
    ...original,
    conteudo: {
      ...original.conteudo,
      secoes: { ...secoes, hero: { ...secoes.hero, midia: { src: "assets/hero-teste.jpg", alt: "Atendimento de teste" } } },
    },
  };
});

import { renderizar, tagsCom, valorDe } from "@/test/render";
import { Hero } from "./Hero";

describe("Hero com src real", () => {
  const html = renderizar(<Hero />);
  const [img] = tagsCom(html, "<img");

  it("usa next/image com priority, sizes, width/height e o alt do conteúdo", () => {
    expect(valorDe(img, "src")).toBe("/assets/hero-teste.jpg");
    expect(valorDe(img, "alt")).toBe("Atendimento de teste");
    expect(valorDe(img, "width")).toBe("2752");
    expect(valorDe(img, "height")).toBe("1536");
    expect(valorDe(img, "sizes")).toBe("100vw");
    expect(valorDe(img, "fetchPriority")).toBe("high");
    expect(valorDe(img, "loading")).toBeNull();
  });

  it("a proporção do bloco continua reservada (aspect-card no mobile; preenche o cartão a partir de 768) e o véu cobre o texto", () => {
    const [bloco] = tagsCom(html, "ui-midia");
    expect(valorDe(bloco, "class")).toContain("aspect-card");
    expect(valorDe(bloco, "class")).toContain("md:inset-0");
    expect(tagsCom(html, "hero__veu")).toHaveLength(1);
  });
});
