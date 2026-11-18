/**
 * Testes [auto] · S23 footer com registro profissional preenchido (T3.11) — campo 9: "renderiza quando preenchido"
 * Ficha: docs/sections/fichas/footer.md · Conteúdo: secoes.footer.registro_profissional.texto (substituído por um texto de teste)
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/conteudo", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/conteudo")>();
  const footer = original.conteudo.secoes.footer;
  return {
    ...original,
    conteudo: {
      ...original.conteudo,
      secoes: { ...original.conteudo.secoes, footer: { ...footer, registro_profissional: { ...footer.registro_profissional, texto: "Registro de teste 123" } } },
    },
  };
});

import { renderizar, tagsCom } from "@/test/render";
import { Footer } from "./Footer";

describe("Footer com registro preenchido", () => {
  it("renderiza o registro e só quando há texto", () => {
    const html = renderizar(<Footer />);
    expect(tagsCom(html, "footer__registro")).toHaveLength(1);
    expect(html).toContain(">Registro de teste 123</p>");
  });
});
