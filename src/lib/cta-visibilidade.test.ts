/**
 * Testes · regra da barra e do flutuante (T2.2). Ficha: docs/sections/fichas/global-acesso-fixo.md (campo 9)
 * Conteúdo: nenhum. Timers falsos do Vitest. Rodar: npm test
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ATRASO_MOSTRAR_MS,
  LIMIAR_VISIVEL,
  criarRegraCta,
  type EstadoAcessoFixo,
} from "./cta-visibilidade";

function montar() {
  const mudancas: EstadoAcessoFixo[] = [];
  const regra = criarRegraCta((e) => mudancas.push(e));
  return { regra, mudancas };
}

/** 1ª rodada do observer: `hero` visível, `preco-pop` fora. */
function comeco(regra: ReturnType<typeof criarRegraCta>, heroRatio = 1) {
  regra.observar("hero", "hero", heroRatio);
  regra.observar("preco", "preco-pop", 0);
  regra.iniciar();
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("cta-visibilidade: estado inicial e 1ª resolução", () => {
  it("nasce pendente (barra e flutuante), sem emitir", () => {
    const { regra, mudancas } = montar();
    expect(regra.estado()).toMatchObject({ barra: "pendente", flutuante: "pendente", barraInert: false });
    regra.observar("hero", "hero", 1);
    expect(regra.estado().barra).toBe("pendente");
    expect(mudancas).toHaveLength(0);
  });

  it("iniciar resolve na hora (sem esperar 300 ms) e marca resolucaoInicial", () => {
    const { regra, mudancas } = montar();
    comeco(regra);
    expect(mudancas).toHaveLength(1);
    expect(mudancas[0]).toMatchObject({
      barra: "oculta",
      barraInert: true,
      flutuante: "oculta",
      resolucaoInicial: true,
    });
  });

  it("sem CTA na tela, a 1ª resolução já mostra barra e flutuante (sem atraso)", () => {
    const { regra, mudancas } = montar();
    regra.observar("hero", "hero", 0);
    regra.iniciar();
    expect(mudancas[0]).toMatchObject({ barra: "visivel", flutuante: "visivel", barraInert: false });
  });

  it("sem nenhum CTA observado, iniciar tira do pendente", () => {
    const { regra } = montar();
    regra.iniciar();
    expect(regra.estado()).toMatchObject({ barra: "visivel", flutuante: "visivel" });
  });
});

describe("cta-visibilidade: histerese da barra", () => {
  it("esconde imediatamente quando algum CTA chega a 0,5", () => {
    const { regra } = montar();
    regra.observar("preco", "preco-pop", 0);
    regra.iniciar();
    expect(regra.estado().barra).toBe("visivel");
    regra.observar("preco", "preco-pop", LIMIAR_VISIVEL);
    expect(regra.estado()).toMatchObject({ barra: "oculta", barraInert: true });
  });

  it("0,49 não conta como visível", () => {
    const { regra } = montar();
    regra.observar("preco", "preco-pop", 0.49);
    regra.iniciar();
    expect(regra.estado().barra).toBe("visivel");
  });

  it("mostra só depois de 300 ms contínuos sem CTA visível", () => {
    const { regra } = montar();
    comeco(regra);
    expect(regra.estado().barra).toBe("oculta");
    regra.observar("hero", "hero", 0);
    vi.advanceTimersByTime(ATRASO_MOSTRAR_MS - 1);
    expect(regra.estado().barra).toBe("oculta");
    vi.advanceTimersByTime(1);
    expect(regra.estado()).toMatchObject({ barra: "visivel", barraInert: false });
  });

  it("dois CTAs separados por menos de 300 ms não reexibem a barra", () => {
    const { regra, mudancas } = montar();
    comeco(regra); // hero visível: barra oculta
    regra.observar("hero", "hero", 0); // hero sai: começa a contar
    vi.advanceTimersByTime(100);
    regra.observar("preco", "preco-pop", 1); // o próximo CTA entra antes dos 300 ms
    vi.advanceTimersByTime(1000);
    expect(regra.estado().barra).toBe("oculta");
    // nunca emitiu "visivel" depois da 1ª resolução
    expect(mudancas.filter((m) => m.barra === "visivel")).toHaveLength(0);
  });

  it("CTA que volta durante a contagem cancela o reexibir", () => {
    const { regra } = montar();
    comeco(regra);
    regra.observar("hero", "hero", 0);
    vi.advanceTimersByTime(200);
    regra.observar("hero", "hero", 0.6);
    vi.advanceTimersByTime(500);
    expect(regra.estado().barra).toBe("oculta");
  });

  it("ignora os CTAs barra, header e header-painel", () => {
    const { regra } = montar();
    regra.observar("b", "barra", 1);
    regra.observar("h", "header", 1);
    regra.observar("hp", "header-painel", 1);
    regra.iniciar();
    expect(regra.estado().barra).toBe("visivel");
  });

  it("remover um CTA visível libera a barra após 300 ms", () => {
    const { regra } = montar();
    comeco(regra);
    regra.remover("hero");
    vi.advanceTimersByTime(ATRASO_MOSTRAR_MS);
    expect(regra.estado().barra).toBe("visivel");
  });
});

describe("cta-visibilidade: foco e painel", () => {
  it(":focus-within impede esconder; ao perder o foco esconde na hora", () => {
    const { regra } = montar();
    regra.observar("preco", "preco-pop", 0);
    regra.iniciar();
    regra.definirFocoNaBarra(true);
    regra.observar("preco", "preco-pop", 1);
    expect(regra.estado().barra).toBe("visivel");
    regra.definirFocoNaBarra(false);
    expect(regra.estado().barra).toBe("oculta");
  });

  it("painel aberto deixa a barra inert e, ao fechar, volta ao estado calculado", () => {
    const { regra } = montar();
    regra.observar("preco", "preco-pop", 0);
    regra.iniciar();
    expect(regra.estado()).toMatchObject({ barra: "visivel", barraInert: false });
    regra.definirPainelAberto(true);
    expect(regra.estado()).toMatchObject({ barra: "visivel", barraInert: true });
    regra.observar("preco", "preco-pop", 1); // calculado muda com o painel aberto
    regra.definirPainelAberto(false);
    expect(regra.estado()).toMatchObject({ barra: "oculta", barraInert: true });
  });
});

describe("cta-visibilidade: flutuante (só o hero)", () => {
  it("outro CTA na tela não esconde o flutuante; o hero sim", () => {
    const { regra } = montar();
    regra.observar("hero", "hero", 0);
    regra.observar("preco", "preco-pop", 1);
    regra.iniciar();
    expect(regra.estado()).toMatchObject({ flutuante: "visivel", barra: "oculta" });
    regra.observar("hero", "hero", 1);
    expect(regra.estado().flutuante).toBe("oculta");
  });

  it("reaparece só depois de 300 ms sem o hero", () => {
    const { regra } = montar();
    comeco(regra);
    regra.observar("hero", "hero", 0);
    vi.advanceTimersByTime(ATRASO_MOSTRAR_MS - 1);
    expect(regra.estado().flutuante).toBe("oculta");
    vi.advanceTimersByTime(1);
    expect(regra.estado().flutuante).toBe("visivel");
  });

  it("foco na barra não segura o flutuante", () => {
    const { regra } = montar();
    comeco(regra);
    regra.definirFocoNaBarra(true);
    expect(regra.estado().flutuante).toBe("oculta");
  });
});

describe("cta-visibilidade: limpeza", () => {
  it("destruir cancela a contagem pendente", () => {
    const { regra } = montar();
    comeco(regra);
    regra.observar("hero", "hero", 0);
    regra.destruir();
    vi.advanceTimersByTime(1000);
    expect(regra.estado().barra).toBe("oculta");
  });
});
