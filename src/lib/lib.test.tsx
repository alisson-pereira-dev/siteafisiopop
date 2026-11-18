/**
 * Testes simples dos helpers de src/lib (T0.5).
 * Rodar: npm test
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { conteudo, ehReferenciaCta, obterCtaBruto } from "./conteudo";
import { resolverCta } from "./cta";
import { dividirDestaque, renderizarDestaque } from "./destaque";
import {
  linkWhatsApp,
  linkWhatsAppServico,
  mensagemDoServico,
  montarLinkWhatsApp,
} from "./whatsapp";

describe("conteudo / @ctas", () => {
  it("reconhece referências @ctas.*", () => {
    expect(ehReferenciaCta("@ctas.principal")).toBe(true);
    expect(ehReferenciaCta("Agendar")).toBe(false);
    expect(ehReferenciaCta(undefined)).toBe(false);
  });

  it("resolve @ctas.principal para site.ctas.principal", () => {
    expect(obterCtaBruto("@ctas.principal")).toEqual(conteudo.site.ctas.principal);
  });

  it("falha com chave inexistente ou referência inválida", () => {
    expect(() => obterCtaBruto("@ctas.nao-existe")).toThrow();
    expect(() => obterCtaBruto("@ctas.toString")).toThrow();
    expect(() => obterCtaBruto("principal")).toThrow();
  });
});

describe("whatsapp", () => {
  it("monta o link com número só em dígitos e mensagem codificada", () => {
    expect(montarLinkWhatsApp("+55 (71) 98865-6153", "Olá! Quero agendar & ver")).toBe(
      "https://wa.me/5571988656153?text=Ol%C3%A1!%20Quero%20agendar%20%26%20ver",
    );
  });

  it("falha com número vazio", () => {
    expect(() => montarLinkWhatsApp("", "oi")).toThrow();
  });

  it("linkWhatsApp usa número e mensagem padrão do content.json", () => {
    const { numero, mensagem_padrao } = conteudo.site.contato.whatsapp;
    expect(linkWhatsApp()).toBe(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem_padrao)}`);
  });

  it("troca {servico} em mensagem_servico", () => {
    expect(mensagemDoServico("Drenagem Linfática")).toBe(
      "Olá! Vim pelo site da A.FISIO POP e quero agendar Drenagem Linfática.",
    );
    expect(mensagemDoServico("A $& B", "x {servico} y")).toBe("x A $& B y");
  });

  it("linkWhatsAppServico codifica o nome do serviço", () => {
    const url = linkWhatsAppServico("Drenagem Linfática");
    expect(url.startsWith("https://wa.me/")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1])).toContain("Drenagem Linfática");
    expect(url).not.toContain("{servico}");
  });
});

describe("resolverCta", () => {
  it("principal: texto do JSON + link do WhatsApp", () => {
    const cta = resolverCta("@ctas.principal");
    expect(cta.texto).toBe("Agendar meu horário no WhatsApp");
    expect(cta.tipo).toBe("whatsapp");
    expect(cta.href).toBe(linkWhatsApp());
  });

  it("secundário: âncora", () => {
    const cta = resolverCta("@ctas.secundario");
    expect(cta.tipo).toBe("ancora");
    expect(cta.href).toBe("#servicos");
  });
});

describe("destaque **palavra**", () => {
  it("divide em trechos", () => {
    expect(dividirDestaque("Cuidar de você não precisa ser **caro**.")).toEqual([
      { texto: "Cuidar de você não precisa ser ", destaque: false },
      { texto: "caro", destaque: true },
      { texto: ".", destaque: false },
    ]);
  });

  it("aceita mais de um destaque e destaque com várias palavras", () => {
    const t = dividirDestaque("**Sem** letra **miúda.**");
    expect(t.filter((x) => x.destaque).map((x) => x.texto)).toEqual(["Sem", "miúda."]);
  });

  it("texto sem marcação ou com ** sem par fica intacto", () => {
    expect(dividirDestaque("Simples")).toEqual([{ texto: "Simples", destaque: false }]);
    expect(dividirDestaque("a ** b")).toEqual([{ texto: "a ** b", destaque: false }]);
    expect(dividirDestaque("")).toEqual([]);
  });

  it("renderiza <span class=\"accent-serif\">", () => {
    expect(renderToStaticMarkup(<p>{renderizarDestaque("Um **caro** teste")}</p>)).toBe(
      '<p>Um <span class="accent-serif">caro</span> teste</p>',
    );
  });

  it("todo texto do content.json com ** vira destaque sem sobrar asterisco", () => {
    const textos: string[] = [];
    JSON.stringify(conteudo, (_k, v) => {
      if (typeof v === "string" && v.includes("**")) textos.push(v);
      return v;
    });
    expect(textos.length).toBeGreaterThan(0);
    for (const t of textos) {
      const html = renderToStaticMarkup(<p>{renderizarDestaque(t)}</p>);
      expect(html).not.toContain("**");
    }
  });
});
