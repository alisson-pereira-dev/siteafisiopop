/**
 * Testes [auto] · seções T3.1–T3.11 — campo 9 das fichas (problema-solucao [base], servicos, como-funciona,
 * preco-pop, para-quem, depoimentos, unidades, faq, cta-final, footer) + conferência da página inteira
 * Ficha: docs/sections/fichas/*.md · Conteúdo: content.json → secoes.*
 * Marcação via renderToStaticMarkup (sem JSDOM). Larguras, motion e a varredura da barra são [manual] (registrados no estado).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { conteudo } from "@/lib/conteudo";
import { resolverCta } from "@/lib/cta";
import { linkWhatsApp, linkWhatsAppServico } from "@/lib/whatsapp";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import { ComoFunciona } from "./como-funciona/ComoFunciona";
import { CtaFinal } from "./cta-final/CtaFinal";
import { Depoimentos } from "./depoimentos/Depoimentos";
import { DepoimentosCard } from "./depoimentos/DepoimentosCard";
import { Footer } from "./footer/Footer";
import { ParaQuem } from "./para-quem/ParaQuem";
import { PrecoPop } from "./preco-pop/PrecoPop";
import { ProblemaSolucao } from "./problema-solucao/ProblemaSolucao";
import { Servicos } from "./servicos/Servicos";
import { Unidades } from "./unidades/Unidades";
import { UnidadesCard } from "./unidades/UnidadesCard";

const s = conteudo.secoes;
const esc = (t: string) => t.replaceAll("&", "&amp;");
const textoDe = (html: string) => html.replace(/<[^>]+>/g, "");
const raiz = path.resolve(__dirname, "..", "..");
const fonte = (relativo: string) => fs.readFileSync(path.join(raiz, relativo), "utf8");

function raizDa(html: string) {
  const [tag] = tagsCom(html, "<section");
  return {
    id: valorDe(tag, "id"),
    section: valorDe(tag, "data-section"),
    ficha: valorDe(tag, "data-ficha"),
    conteudo: valorDe(tag, "data-conteudo"),
    labelledby: valorDe(tag, "aria-labelledby"),
    ariaLabel: valorDe(tag, "aria-label"),
    classe: valorDe(tag, "class") ?? "",
  };
}

describe("S03 problema-solucao, slide do usuário (painel lateral com autoplay)", () => {
  const html = renderizar(<ProblemaSolucao />);
  const ps = s.problema_solucao;
  const stage = fonte("src/secoes/problema-solucao/ProblemaSolucaoStage.tsx").replace(/\/\*[\s\S]*?\*\//g, "");

  it("raiz sem padding vertical; título e subtítulo do conteúdo; 1 h2 da seção e 5 cópias em h3", () => {
    const r = raizDa(html);
    expect(r).toMatchObject({ id: "problema-solucao", ficha: "S03", labelledby: "problema-solucao__titulo" });
    expect(r.classe).not.toContain("py-section");
    expect(contar(html, "<h2")).toBe(1);
    expect(html).toContain('<span class="accent-serif">uma solução</span>');
    expect(html).toContain(`>${ps.subtitulo}</p>`);
    expect(contar(html, "problema-solucao__copia-titulo")).toBe(5);
  });

  it("5 cópias: título = problema; texto = descrição do serviço (secoes.servicos); link para a âncora com a solução; a 1ª nasce ativa", () => {
    const copias = tagsCom(html, 'class="problema-solucao__copia"');
    expect(copias).toHaveLength(5);
    expect(copias.map((c) => valorDe(c, "data-estado"))).toEqual(["ativa", "inativa", "inativa", "inativa", "inativa"]);
    for (const c of copias) expect(valorDe(c, "data-anim")).toBe("stage-copia");
    expect([...html.matchAll(/problema-solucao__copia-titulo[^>]*>([^<]*)</g)].map((m) => m[1])).toEqual(ps.itens.map((i) => i.problema));
    for (const i of ps.itens) {
      const servico = s.servicos.itens.find((x) => x.nome === i.servico)!;
      expect(html).toContain(esc(servico.descricao));
      expect(html).toContain(i.solucao);
    }
    expect(tagsCom(html, "problema-solucao__copia-link").map((l) => valorDe(l, "href"))).toEqual(ps.itens.map((i) => i.ancora));
  });

  it("perguntas vêm do FAQ (nada duplicado); cada uma é um botão que abre o <dialog>; a resposta fica no modal", () => {
    const botoes = tagsCom(html, "problema-solucao__faq-item ");
    expect(botoes).toHaveLength(ps.itens.flatMap((i) => i.perguntas).length);
    for (const i of ps.itens) for (const q of i.perguntas) expect(s.faq.perguntas.some((p) => p.pergunta === q)).toBe(true);
    for (const b of botoes) expect(valorDe(b, "data-anim")).toBe("stage-faq");
    const [dialogo] = tagsCom(html, "<dialog");
    expect(valorDe(dialogo, "data-anim")).toBe("stage-modal");
    expect(html).toContain(conteudo.microcopy.acessibilidade.fechar_pergunta);
    expect(stage).toContain("showModal()");
  });

  it("CONDIÇÃO DO USUÁRIO: cópia inativa só some por opacity (nunca display:none, visibility:hidden, hidden, aria-hidden ou inert); botões e links inativos saem do Tab", () => {
    const css = fonte("src/app/stage.css");
    const regra = css.match(/\[data-anim~="stage-copia"\]\[data-estado="inativa"\]\s*\{([^}]*)\}/)![1];
    expect(regra).toContain("opacity: 0");
    expect(regra).not.toMatch(/display:\s*none|visibility:\s*hidden/);
    for (const c of tagsCom(html, 'class="problema-solucao__copia"')) expect(c).not.toMatch(/\shidden(=|\s|>)|aria-hidden|\sinert/);
    const focaveis = [...tagsCom(html, "problema-solucao__copia-link"), ...tagsCom(html, "problema-solucao__faq-item ")];
    const inativos = focaveis.filter((t) => valorDe(t, "tabindex") === "-1");
    expect(inativos.length).toBe(focaveis.length - 1 - 1); // a cópia ativa tem 1 link e 1 pergunta focáveis
  });

  it("pílula 01–05 (aria-pressed, rótulo do problema em cada botão, anel SVG com progresso) e botão de pausa com rótulo do conteúdo", () => {
    const [controles] = tagsCom(html, "problema-solucao__controles");
    expect(valorDe(controles, "data-anim")).toBe("stage-passos");
    const [nav] = tagsCom(html, "problema-solucao__passos");
    expect(valorDe(nav, "aria-label")).toBe(ps.rotulo_passos);
    const botoes = tagsCom(html, "problema-solucao__passo ");
    expect(botoes.map((b) => valorDe(b, "aria-pressed"))).toEqual(["true", "false", "false", "false", "false"]);
    expect([...html.matchAll(/problema-solucao__passo-numero[^>]*>(\d\d)</g)].map((m) => m[1])).toEqual(["01", "02", "03", "04", "05"]);
    expect(contar(html, 'data-anim="stage-anel-fill"')).toBe(5);
    const [pausa] = tagsCom(html, "problema-solucao__pausa");
    expect(valorDe(pausa, "aria-label")).toBe(conteudo.microcopy.acessibilidade.pausar_passos);
  });

  it("mídia de fundo: 5 camadas em crossfade (fotos reais nos passos 1–4; vídeo no passo 5), vidro fosco e aria-hidden", () => {
    expect(ps.itens.every((i) => i.imagem.src !== "pendente")).toBe(true);
    const camadas = tagsCom(html, "problema-solucao__visual");
    expect(camadas).toHaveLength(5);
    expect(camadas.map((c) => valorDe(c, "data-estado"))).toEqual(["ativa", "inativa", "inativa", "inativa", "inativa"]);
    expect(valorDe(tagsCom(html, "problema-solucao__media")[0], "aria-hidden")).toBe("true");
    // vidro fosco (só desfoque) atrás do texto: NENHUM véu branco/degradê
    const [veu] = tagsCom(html, "problema-solucao__veu");
    expect(valorDe(veu, "data-anim")).toBe("stage-vidro");
    expect(valorDe(veu, "class")).not.toMatch(/bg-veu-hero|bg-bg|bg-surface/);
    const vidro = fonte("src/app/stage.css").match(/\[data-anim~="stage-vidro"\]\s*\{([^}]*)\}/)![1];
    expect(vidro).toContain("backdrop-filter: blur(var(--stage-vidro-desfoque))");
    expect(vidro).toContain("-webkit-backdrop-filter");
    expect(vidro).toContain("mask-image: linear-gradient(90deg, black 0%, black 65%, transparent 100%)");
    expect(fonte("src/app/stage.css")).toContain("--stage-vidro-tinta: color-mix(in srgb, var(--color-surface) 8%, transparent)");
    // passos 1–4 têm foto real (no 1 a imagem trocou o vídeo); o 5 é um vídeo (<video>, não <img>)
    expect(contar(html, "<img")).toBe(6); // 4 fotos de fundo (passos 1–4) + 2 avatares do chat
    expect(contar(html, "<video")).toBe(1);
    for (const i of ps.itens.slice(0, 4)) {
      expect(fs.existsSync(path.join(raiz, "public", i.imagem.src)), i.imagem.src).toBe(true);
      expect("tom" in i.imagem && i.imagem.tom).toBe("escuro");
    }
  });

  it("autoplay de 6 s por requestAnimationFrame (sem setInterval, sem listener de scroll); desligado em reduced-motion; pausa com mouse/foco e por botão", () => {
    expect(stage).toContain("requestAnimationFrame");
    expect(stage).toContain("DURACAO_MS = 6000");
    expect(stage).toContain("CIRCUNFERENCIA = 68.487");
    expect(stage).toContain("DURACAO_COM_CHAT_MS = 8000"); // o passo com chat (ou vídeo) dura o ciclo de 8 s
    expect(stage).toContain("itens[ativo]?.video || itens[ativo]?.chat ? DURACAO_COM_CHAT_MS : DURACAO_MS");
    expect(stage).toContain('(prefers-reduced-motion: reduce)');
    expect(stage).toMatch(/if \(reduzido \|\| !tocando/);
    expect(stage).toContain("onMouseEnter");
    expect(stage).toContain("onFocus");
    expect(stage).not.toMatch(/setInterval|addEventListener\(\s*["']scroll/);
    expect(stage).toContain('"use client"');
  });

  it("passo 1 = IMAGEM (img_dor_costas): next/image priorizada, arquivo existe, tom escuro; passo 5 = VÍDEO (video_dor_n_passa): mudo, loop, pôster, só toca com o passo ativo, na tela, sem pausa e sem reduced-motion", () => {
    const img = ps.itens[0].imagem;
    expect(img.src).toBe("assets/img_dor_costas-site.webp");
    expect(fs.existsSync(path.join(raiz, "public", img.src))).toBe(true);
    expect(fs.existsSync(path.join(raiz, "public", "assets", "img_dor_costas.jpg"))).toBe(true); // original do usuário, mantido
    expect("tom" in img && img.tom).toBe("escuro");
    expect("video" in ps.itens[0]).toBe(false);
    const [tag] = tagsCom(html, "<img");
    expect(valorDe(tag, "fetchPriority")).toBe("high");
    expect(valorDe(tag, "src")).toContain("img_dor_costas-site.webp");
    // o vídeo do passo 5: arquivos existem, mudo, loop, pôster, tom escuro, sem chat
    const v5 = ps.itens[4] as (typeof ps.itens)[number] & { video: { src: string; poster: string } };
    expect(v5.video.src).toBe("assets/video_dor_n_passa-site.mp4");
    for (const f of [v5.video.src, v5.video.poster, "assets/video_dor_n_passa.mp4"]) expect(fs.existsSync(path.join(raiz, "public", f)), f).toBe(true);
    const [tagVideo] = tagsCom(html, "<video");
    expect(valorDe(tagVideo, "src")).toBe("/" + v5.video.src);
    expect(valorDe(tagVideo, "poster")).toBe("/" + v5.video.poster);
    expect(stage).toContain(" muted"); // React não serializa `muted` no HTML estático: confere no fonte do stage
    expect("tom" in v5.imagem && v5.imagem.tom).toBe("escuro");
    expect("chat" in v5).toBe(false); // o chat é só do passo 1
    // o código do vídeo
    expect(stage).toContain("new IntersectionObserver");
    expect(stage).toMatch(/i === ativo && naTela && !reduzido && tocando/);
    expect(stage).not.toMatch(/\bautoPlay\b/);
  });

  it("tom escuro: o painel lê data-tom do stage; com mídia escura o texto vira claro e o vidro escuro (CSS redefine as variáveis; nenhum componente muda de classe)", () => {
    const [raizStage] = tagsCom(html, "problema-solucao__stage ");
    expect(valorDe(raizStage, "data-anim")).toBe("stage-raiz");
    expect(valorDe(raizStage, "data-tom")).toBe("escuro"); // passo 1 ativo
    expect(valorDe(tagsCom(html, "problema-solucao__lateral")[0], "data-anim")).toBe("stage-lateral");
    const css = fonte("src/app/stage.css");
    const bloco = css.match(/\[data-anim~="stage-raiz"\]\[data-tom="escuro"\] \[data-anim~="stage-lateral"\]\s*\{([^}]*)\}/)![1];
    for (const d of ["--color-text: var(--color-text-inverse)", "--color-text-muted: var(--color-text-inverse-muted)", "--color-surface:", "--stage-pilula:", "--stage-vidro:"]) expect(bloco, d).toContain(d);
    expect(stage).toContain('itens[ativo]?.imagem.tom === "escuro" ? "escuro" : "claro"');
    // só ≥768: no mobile a mídia é uma faixa e o texto fica sobre fundo claro (texto claro ali ficaria invisível)
    const iMedia = css.indexOf('@media (min-width: 768px) {\n  [data-anim~="stage-raiz"][data-tom="escuro"] [data-anim~="stage-lateral"]');
    expect(iMedia, "o bloco do tom escuro está dentro de @media (min-width: 768px)").toBeGreaterThan(-1);
  });

  it("chat de vidro: IRMÃO da mídia (imagem) na mesma camada; 4 mensagens nascem ocultas; avatar com a inicial do site; tudo aria-hidden", () => {
    const chat = ps.itens[0].chat!;
    const iVideo = html.indexOf("<img");
    const iChat = html.indexOf('data-anim="chat"');
    expect(iVideo).toBeGreaterThan(-1);
    expect(iChat).toBeGreaterThan(iVideo); // vem depois da mídia, na mesma camada
    const camada = html.slice(html.lastIndexOf("problema-solucao__visual", iVideo), html.indexOf("problema-solucao__visual", iVideo));
    expect(camada).toContain("data-anim=\"chat\"");
    expect(valorDe(tagsCom(html, "problema-solucao__visual")[0], "class")).toContain("overflow-hidden");
    expect(valorDe(tagsCom(html, 'data-anim="chat"')[0], "aria-hidden")).toBe("true");
    const msgs = tagsCom(html, 'data-anim="chat-mensagem"');
    expect(msgs).toHaveLength(4);
    for (const m of msgs) expect(valorDe(m, "data-estado")).toBe("oculta");
    expect(contar(html, 'data-anim="chat-avatar"')).toBe(2);
    // o avatar é a foto de perfil enviada pelo usuário (não mais a inicial); sem foto, volta a inicial
    expect(chat.avatar).toBe("assets/perfil_conversa-site.webp");
    expect(fs.existsSync(path.join(raiz, "public", chat.avatar))).toBe(true);
    expect(fs.existsSync(path.join(raiz, "public", "assets", "perfill_conversa.png"))).toBe(true); // original mantido
    expect(html).toContain("perfil_conversa-site.webp");
    expect(html).toContain(`>${s.footer ? conteudo.site.nome.charAt(0) : ""}</span>`);
    expect(contar(html, 'data-anim="chat-vidro"')).toBe(2);
    expect(contar(html, 'data-anim="chat-usuario"')).toBe(2);
    expect(contar(html, 'data-anim="chat-palavra"')).toBe(chat.assistente.split(" ").length);
    expect(contar(html, 'data-anim="chat-ponto"')).toBe(3); // "digitando": 3 pontinhos animados
    expect(chat.digitando).toBe("Digitando");
    expect("pensando" in chat).toBe(false);
    expect(html).toContain("Digitando");
    expect(html).not.toContain("Pensando");
    expect(contar(html, "<line ")).toBe(0); // sem o spinner antigo
  });

  it("textos do chat vêm do conteúdo, sem promessa nova: o assistente só repete a copy aprovada; linha do tempo 0,5 · 1,3 · 2,7 · 4,2 · 8,0 s", () => {
    const chat = ps.itens[0].chat!;
    for (const t of [chat.usuario, chat.usuario_final]) expect(html).toContain(esc(t));
    expect(chat.assistente.toLowerCase()).toContain(s.servicos.itens.find((x) => x.nome === ps.itens[0].servico)!.descricao.split(". ")[0].replace(/.$/, "").toLowerCase());
    const codigo = fonte("src/secoes/problema-solucao/ProblemaSolucaoChat.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(codigo).toContain("{ m1: 500, m2: 1300, m3: 2700, palavra: 30, m4: 4200, ciclo: 8000 }");
    expect(codigo).toMatch(/agendar\(rodar, T\.ciclo\)/);
    expect(codigo).not.toMatch(/setInterval|addEventListener|IntersectionObserver/);
    expect(codigo).toContain('"use client"');
  });

  it("mídia: no mobile vem POR ÚLTIMO (order-last), num cartão arredondado 4:3 abaixo da pílula, do texto e das perguntas (sem texto sobre ela); fundo do stage a partir de 768; véu só ≥768", () => {
    const [media] = tagsCom(html, "problema-solucao__media");
    const cls = valorDe(media, "class")!.split(" ");
    expect(cls).toEqual(expect.arrayContaining(["order-last", "aspect-card", "rounded-md", "overflow-hidden", "md:absolute", "md:inset-0", "md:order-none", "md:aspect-auto", "md:rounded-none"]));
    expect(valorDe(tagsCom(html, "problema-solucao__veu")[0], "class")!.split(" ")).toEqual(expect.arrayContaining(["hidden", "md:block"]));
  });

  it("texto de apoio e 1 CTA principal (problema-solucao) depois do stage", () => {
    expect(html).toContain(`>${ps.texto_apoio}</p>`);
    const [cta] = tagsCom(html, 'data-cta-local="problema-solucao"');
    expect(valorDe(cta, "data-cta")).toBe("principal");
    expect(contar(html, 'data-cta="principal"')).toBe(1);
    expect(html.indexOf("problema-solucao__stage")).toBeLessThan(html.indexOf("problema-solucao__apoio"));
  });
});

describe("S06 servicos (T3.3)", () => {
  const html = renderizar(<Servicos />);
  const itens = s.servicos.itens;

  it("7 cards na ordem do conteúdo (todos os ícones existem no registro: o render não lança)", () => {
    const cards = tagsCom(html, "servicos__card ");
    expect(cards).toHaveLength(7);
    expect([...html.matchAll(/servicos__card-nome[^>]*>(?:<span[\s\S]*?<\/span>)?([^<]+)</g)].map((m) => m[1])).toEqual(itens.map((i) => esc(i.nome)));
    cards.forEach((c, i) => expect(valorDe(c, "data-item")).toBe(["liberacao-miofascial", "drenagem-linfatica", "massagem-relaxante", "massagem-modeladora", "ventosaterapia", "limpeza-de-pele", "fisioterapia-ortopedica"][i]));
  });

  it("só o card-link é link: texto, aria-label, wa.me com {servico} codificado, data-cta=servico, sem botão primário", () => {
    const links = tagsCom(html, "servicos__card-link");
    expect(contar(html, "<a ")).toBe(7);
    expect(links).toHaveLength(7);
    links.forEach((l, i) => {
      expect(valorDe(l, "data-cta")).toBe("servico");
      expect(valorDe(l, "aria-label")).toBe(`${itens[i].link_texto}: ${itens[i].nome}`);
      expect(html).toContain(`>${itens[i].link_texto}`); // texto curto de benefício, diferente em cada linha
      expect(valorDe(l, "href")).toBe(linkWhatsAppServico(itens[i].nome));
      expect(valorDe(l, "rel")).toBe("noopener noreferrer");
      expect(valorDe(l, "class")).toContain("min-h-touch");
    });
    expect(valorDe(links[0], "href")).toContain(encodeURIComponent("quero agendar Liberação Miofascial.")); // a mensagem pré-preenchida segue com o nome do serviço
    expect(itens.map((i) => i.link_texto)).toEqual(["Aliviar minha dor", "Desinchar agora", "Relaxar de verdade", "Definir o corpo", "Soltar a tensão", "Cuidar da pele", "Voltar a me mover"]);
    expect(new Set(itens.map((i) => i.link_texto)).size).toBe(7);
    expect(html).not.toContain("Chamar sobre este serviço");
    expect(html).not.toContain("ui-botao--primario");
    expect(html).not.toContain('data-cta="principal"');
  });

  it("tabela de valor da Superpower: 7 linhas zebradas (nome, descrição, link); sem mídia, sem ícone, sem <img>", () => {
    const linhas = tagsCom(html, "servicos__card ");
    expect(linhas).toHaveLength(7);
    for (const l of linhas) expect(valorDe(l, "class")).toContain("odd:bg-bg-alt");
    expect(html).not.toMatch(/servicos__card-midia|servicos__card-icone|<img|<svg[^>]*servicos__card-icone/);
    for (const i of itens) expect(html).toContain(esc(i.descricao));
  });

  it("título com **R$ 49,99** em accent-serif; nenhum preço por card; os 5 validar seguem marcados", () => {
    expect(html).toContain('<span class="accent-serif">R$ 49,99</span>');
    expect(contar(html, "R$")).toBe(1);
    expect(itens.filter((i) => i.validar).length).toBe(5);
  });

  it("cabeçalho centralizado e lista em coluna única (zebra), cada linha com stagger-item; fundo claro", () => {
    expect(valorDe(tagsCom(html, "servicos__cabecalho")[0], "class")).toContain("text-center");
    expect(valorDe(tagsCom(html, "servicos__grade")[0], "class")).toContain("flex-col");
    for (const c of tagsCom(html, "servicos__card ")) expect(valorDe(c, "data-anim")).toBe("stagger-item");
    expect(raizDa(html)).toMatchObject({ id: "servicos", ficha: "S06", labelledby: "servicos__titulo" });
    expect(raizDa(html).classe).not.toContain("bg-bg-alt");
  });
});

describe("S07 como-funciona (T3.4)", () => {
  const html = renderizar(<ComoFunciona />);

  it("ol com 4 passos numerados 1–4 (etiqueta no canto da imagem) e 1 CTA depois da lista; passo não é clicável", () => {
    expect(contar(html, "<ol")).toBe(1);
    const nums = [...html.matchAll(/como-funciona__passo-numero[^>]*>(\d)</g)].map((m) => Number(m[1]));
    expect(nums).toEqual([1, 2, 3, 4]);
    expect(html.indexOf("</ol>")).toBeLessThan(html.indexOf('data-cta-local="como-funciona"'));
    expect(tagsCom(html, 'data-cta-local="como-funciona"')).toHaveLength(1);
    expect(contar(html, "<a ")).toBe(1);
    expect(html).not.toContain("<button");
  });

  it("'na hora' segue no texto e marcado validar; 4 fotos reais quadradas (webp existente), com alt descritivo; nada de ladrilho pendente", () => {
    expect(html).toContain("Atendimento na hora");
    expect(s.como_funciona.passos[2].validar).toBe(true);
    expect(contar(html, "<img")).toBe(4);
    const fotos = tagsCom(html, "como-funciona__passo-midia");
    expect(fotos).toHaveLength(4);
    for (const l of fotos) expect(valorDe(l, "class")).toContain("aspect-square");
    s.como_funciona.passos.forEach((passo, i) => {
      expect(passo.imagem.src, "passo " + (i + 1)).toMatch(/^assets\/img_.*-site\.webp$/);
      expect(fs.existsSync(path.join(raiz, "public", passo.imagem.src)), passo.imagem.src).toBe(true);
      expect(passo.imagem.alt.length).toBeGreaterThan(20); // descreve a cena, não é rascunho
    });
  });

  it("cabeçalho centralizado com subtítulo; 4 colunas (2 no tablet) com gap-2; CTA centralizado depois da grade; id e ficha", () => {
    const [cab] = tagsCom(html, "como-funciona__cabecalho");
    expect(valorDe(cab, "class")).toContain("text-center");
    expect(html).toContain(`>${s.como_funciona.subtitulo}</p>`);
    expect(valorDe(tagsCom(html, "como-funciona__grade")[0], "class")).toMatch(/gap-2[^"]*lg:grid-cols-4/);
    expect(valorDe(tagsCom(html, 'data-cta-local="como-funciona"')[0], "class")).toContain("mx-auto");
    expect(raizDa(html)).toMatchObject({ id: "como-funciona", ficha: "S07" });
  });
});

describe("S12 preco-pop (T3.5)", () => {
  const html = renderizar(<PrecoPop />);

  it("tabela listrada: linha do preço + 4 itens do conteúdo; sem comparação, riscado, urgência, gradiente, shimmer, contagem ou pulso", () => {
    expect(contar(html, "preco-pop__inclui-item")).toBe(4);
    for (const item of s.preco_pop.inclui) expect(html).toContain(`${esc(item)}</li>`);
    expect(html).not.toMatch(/line-through|<s>|<del|grad-price|shimmer|animate-|float-pulso/);
    expect(textoDe(html)).not.toMatch(/mercado|últimas vagas|de R\$/i);
    expect(html).not.toContain("data-anim=\"float");
  });

  it("valor e período do conteúdo no cartão da oferta; o preço continua validar", () => {
    expect(html).toContain(`>${s.preco_pop.preco.valor}</p>`);
    expect(html).toContain(`>${s.preco_pop.preco.periodo}</p>`);
    expect(s.preco_pop.preco.validar).toBe(true);
    expect(html.indexOf("preco-pop__galeria ")).toBeLessThan(html.indexOf("preco-pop__conteudo"));
  });

  it("imagem fixa única (assets/preco_pop): webp existe, alt descritivo, 4:5, sem miniaturas nem troca nem JS; original mantido", () => {
    const img = s.preco_pop.imagem;
    expect(img.src).toBe("assets/preco_pop-site.webp");
    expect(fs.existsSync(path.join(raiz, "public", img.src))).toBe(true);
    expect(fs.existsSync(path.join(raiz, "public", "assets", "preco_pop.jpg"))).toBe(true);
    expect(img.alt.length).toBeGreaterThan(60); // a arte tem texto: o alt o transcreve
    expect("galeria" in s.preco_pop).toBe(false);
    const [palco] = tagsCom(html, "preco-pop__palco");
    expect(valorDe(palco, "class")).toContain("aspect-hero");
    expect(contar(html, "<img")).toBe(1);
    expect(html).not.toContain("galeria-miniatura");
    expect(html).not.toContain('data-anim="galeria');
    const codigo = fonte("src/secoes/preco-pop/PrecoPopGaleria.tsx");
    expect(codigo.replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/use client|useState|addEventListener/);
    expect(fs.existsSync(path.join(raiz, "src/app/galeria.css"))).toBe(false);
  });

  it("dúvidas frequentes DENTRO da coluna da direita (id #faq), depois do CTA: 7 details do conteúdo, fechados, data-item pergunta-1…7; sem CTA nem JSON-LD FAQPage", () => {
    expect(html).not.toContain('data-section="faq"');
    expect(contar(html, "<details")).toBe(7);
    expect(html).not.toMatch(/<details[^>]*\sopen/);
    s.faq.perguntas.forEach((p) => {
      expect(html).toContain(esc(p.pergunta));
      expect(html).toContain(`>${esc(p.resposta)}</p>`);
    });
    expect(valorDe(tagsCom(html, "<details")[0], "name")).toBeNull();
    expect(tagsCom(html, "<details").map((x) => valorDe(x, "data-item"))).toEqual(Array.from({ length: 7 }, (_, i) => `pergunta-${i + 1}`));
    for (const x of tagsCom(html, "<summary")) expect(valorDe(x, "class")).toContain("min-h-touch");
    expect(contar(html, 'data-anim="accordion-icone"')).toBe(7);
    const [bloco] = tagsCom(html, "preco-pop__duvidas ");
    expect(valorDe(bloco, "id")).toBe("faq");
    expect(html.indexOf('data-cta-local="preco-pop"')).toBeLessThan(html.indexOf("preco-pop__duvidas "));
    expect(html.indexOf("preco-pop__duvidas ")).toBeGreaterThan(html.indexOf("preco-pop__conteudo"));
    expect(contar(html, 'data-cta="principal"')).toBe(1);
    expect(fonte("src/ui/UiAccordion.tsx")).not.toMatch(/["']use client["']/);
    expect(s.faq.perguntas.filter((p) => p.validar)).toHaveLength(2);
    expect(fonte("src/secoes/preco-pop/PrecoPop.tsx").replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/FAQPage|ld\+json/);
    expect(fs.existsSync(path.join(raiz, "src/secoes/faq"))).toBe(false); // a seção S16 foi fundida aqui
  });

  it("cartão da oferta (referência do usuário): faixa escura + R$ 49,99 em destaque + os 7 serviços; só fatos do conteúdo, sem preço riscado/desconto/prazo; CTA e números depois dele", () => {
    const o = s.preco_pop.oferta;
    expect(html).toContain(`>${esc(o.faixa)}</p>`);
    expect(o.validar).toBe(true);
    const [raizOferta] = tagsCom(html, "preco-pop__oferta ");
    expect(valorDe(raizOferta, "class")).toMatch(/bg-inverse/);
    const [valor] = tagsCom(html, "preco-pop__oferta-valor");
    expect(valorDe(valor, "class")).toMatch(/text-h1[^"]*text-primary/);
    expect(html).toContain(`>${s.preco_pop.preco.valor}</p>`);
    expect(contar(html, "preco-pop__oferta-servico ")).toBe(s.servicos.itens.length);
    for (const i of s.servicos.itens) expect(html).toContain(esc(i.nome));
    expect(html).not.toMatch(/line-through|<s>|<del|últimas vagas|tempo limitado|% off|economi[az]/i);
    expect(textoDe(html)).not.toMatch(/de R\$/i);
    // "a conta do preço": 3 itens do conteúdo, que NÃO repetem os indicadores do hero; só aritmética (49,99 ÷ 30 = 1,67)
    const nums = tagsCom(html, "preco-pop__numero ");
    expect(nums).toHaveLength(3);
    expect(s.preco_pop.conta.validar).toBe(true);
    for (const n of s.preco_pop.conta.itens) expect(html).toContain(`>${esc(n.valor)}</p>`);
    for (const n of s.hero.indicadores) expect(s.preco_pop.conta.itens.some((x) => x.valor === n.valor)).toBe(false);
    expect("nota" in s.preco_pop.conta).toBe(false); // sem nota de rodapé (pedido do usuário)
    expect(html).not.toMatch(/Conta de exemplo/);
    // o R$ 49,99 do texto sai em destaque (marcado com ** no conteúdo)
    expect(s.preco_pop.texto).toContain("**R$ 49,99**");
    expect(html).toMatch(/preco-pop__texto-destaque[^"]*bg-primary-soft[^"]*">R\$ 49,99<\/strong>/);
    expect(html).not.toMatch(/preco-pop__texto-destaque[^"]*text-(h1|h2|h3|display)/); // destaque sem aumentar o tamanho
    expect(Math.round((49.99 / 30) * 100) / 100).toBe(1.67);
    const i = (x: string) => html.indexOf(x);
    expect(i("preco-pop__inclui ")).toBeLessThan(i("preco-pop__oferta "));
    expect(i("preco-pop__oferta ")).toBeLessThan(i('data-cta-local="preco-pop"'));
    expect(i('data-cta-local="preco-pop"')).toBeLessThan(i("preco-pop__numeros"));
    expect(i("preco-pop__numeros")).toBeLessThan(i("preco-pop__duvidas "));
    expect(contar(html, 'data-cta="principal"')).toBe(1);
  });

  it("1 CTA preco-pop na coluna da direita, depois da lista, em largura total", () => {
    const [cta] = tagsCom(html, 'data-cta-local="preco-pop"');
    expect(contar(html, 'data-cta="principal"')).toBe(1);
    expect(html.indexOf("preco-pop__inclui ")).toBeLessThan(html.indexOf('data-cta-local="preco-pop"'));
    expect(valorDe(cta, "class")).toContain("w-full");
  });

  it("seção de compra: fundo bg-alt, âncora #preco, galeria sticky (≥1024) à esquerda e coluna de oferta à direita", () => {
    const r = raizDa(html);
    expect(r).toMatchObject({ id: "preco", ficha: "S12", labelledby: "preco-pop__titulo" });
    expect(r.classe).toContain("bg-bg-alt");
    expect(valorDe(tagsCom(html, "preco-pop__galeria ")[0], "class")).toMatch(/lg:sticky[^"]*lg:col-span-7/);
    expect(html).toMatch(/class="[^"]*\bitems-start\b[^"]*lg:grid-cols-12/); // align-items: start é CRÍTICO para o sticky
    expect(valorDe(r.classe ? tagsCom(html, "<section")[0] : "", "class")).not.toMatch(/overflow/); // nenhum ancestral com overflow
    expect(valorDe(tagsCom(html, "preco-pop__conteudo")[0], "class")).toContain("lg:col-span-5");
  });
});

describe("S05 para-quem (T3.6)", () => {
  const html = renderizar(<ParaQuem />);

  it("6 itens do conteúdo + bloco nao-e-para com título e texto; nenhum CTA", () => {
    expect(contar(html, "para-quem__item")).toBe(6);
    for (const t of s.para_quem.para_voce) expect(html).toContain(t);
    expect(html).toContain(`>${s.para_quem.nao_e_para_titulo}</h3>`);
    expect(html).toContain(`>${s.para_quem.nao_e_para_texto}</p>`);
    expect(html).not.toContain("data-cta");
  });

  it("Check em text-secondary fora do bloco teal; bloco teal sem vermelho nem ícone de alerta", () => {
    expect(contar(html, "text-secondary")).toBe(6);
    const [bloco] = tagsCom(html, "para-quem__nao-e-para ");
    expect(valorDe(bloco, "class")).toContain("bg-bg-teal");
    const depois = html.slice(html.indexOf("para-quem__nao-e-para "));
    expect(depois).not.toContain("<svg");
    expect(depois).not.toMatch(/danger|warning|text-secondary/);
  });

  it("título à esquerda com subtítulo; lista em linhas listradas nas colunas 1–7 e bloco 8–12 no desktop", () => {
    expect(html).toContain(`>${s.para_quem.subtitulo}</p>`);
    expect(valorDe(tagsCom(html, "para-quem__lista-voce")[0], "class")).toMatch(/flex-col[^"]*lg:col-span-7/);
    for (const i of tagsCom(html, "para-quem__item")) expect(valorDe(i, "class")).toContain("odd:bg-bg-alt");
    expect(valorDe(tagsCom(html, "para-quem__nao-e-para ")[0], "class")).toContain("lg:col-span-5");
    expect(raizDa(html)).toMatchObject({ id: "para-quem", ficha: "S05" });
  });
});

describe("S10 depoimentos (T3.7)", () => {
  const html = renderizar(<Depoimentos />);

  it("5 cards com blockquote, autor (nome fictício) e contexto do conteúdo; sem estrela, cidade ou promessa de resultado", () => {
    expect(s.depoimentos.itens).toHaveLength(5);
    expect(contar(html, "<blockquote")).toBe(5);
    for (const i of s.depoimentos.itens) {
      expect(html).toContain(`>${esc(i.citacao)}</blockquote>`);
      expect(html).toContain(`>${esc(i.autor)}</p>`);
      expect(i.provisorio).toBe(true); // fictício = provisório e a validar, nunca apresentado como real
      expect(i.validar).toBe(true);
    }
    expect(s.depoimentos.nota_provisorio).toContain("FICTÍCIOS");
    expect(html).not.toMatch(/★|⭐|estrela/i); // sem estrelas inventadas; as fotos são as enviadas pelo cliente
  });

  it("aviso provisório (texto do conteúdo) em todo card; sem fonte falsa: o contexto é texto, não link para o Instagram", () => {
    expect(contar(html, "depoimentos__selo-provisorio")).toBe(5);
    expect(contar(html, `>${s.depoimentos.rotulo_provisorio}<`)).toBe(5);
    expect(tagsCom(html, "depoimentos__contexto")).toHaveLength(5);
    expect(html).not.toContain("instagram.com");
    expect(contar(html, "<a ")).toBe(0);
  });

  it("sem provisorio o selo some; sem link o contexto é texto", () => {
    const base = { citacao: "x", autor: "Cliente", contexto: "Contexto", rotuloProvisorio: "Provisório" };
    const real = renderizar(<DepoimentosCard {...base} provisorio={false} />);
    expect(real).not.toContain("selo-provisorio");
    expect(real).not.toContain("<a ");
    const prov = renderizar(<DepoimentosCard {...base} provisorio />);
    expect(prov).toContain("depoimentos__selo-provisorio");
  });

  it("selo sem animação; foto 16:9 no topo de cada card (enviada pelo usuário), com alt descritivo; sem foto, ladrilho de marca com aspas ≥ 32px", () => {
    const [selo] = tagsCom(html, "depoimentos__selo-provisorio");
    expect(valorDe(selo, "data-anim")).toBeNull();
    const midias = tagsCom(html, "depoimentos__midia");
    expect(midias).toHaveLength(5);
    for (const m of midias) expect(valorDe(m, "class")).toContain("aspect-wide");
    expect(contar(html, "<img")).toBe(5);
    s.depoimentos.itens.forEach((it, k) => {
      const img = (it as { imagem?: { src: string; alt: string } }).imagem!;
      expect(img.src).toBe(`assets/img_quem_cuida_de_si_0${k + 1}-site.webp`);
      expect(fs.existsSync(path.join(raiz, "public", img.src)), img.src).toBe(true);
      expect(img.alt.length).toBeGreaterThan(20);
      expect(html).toContain(esc(img.alt));
    });
    // sem foto: ladrilho com aspas
    const semFoto = renderizar(<DepoimentosCard citacao="x" autor="y" contexto="z" provisorio rotuloProvisorio="p" />);
    expect(valorDe(tagsCom(semFoto, "depoimentos__aspas")[0], "class")).toMatch(/font-serif[^"]*text-display[^"]*text-brand-pink/);
    expect(valorDe(tagsCom(semFoto, "depoimentos__midia")[0], "class")).toContain("bg-grad-soft");
    expect(semFoto).not.toContain("<img");
  });

  it("carrossel do slide: SSR com os 5 cards originais (as cópias do loop só nascem no cliente), barra e contador, seção com overflow-hidden", () => {
    expect(raizDa(html).classe).toContain("overflow-hidden");
    expect(contar(html, 'data-anim="carrossel-slide"')).toBe(5);
    expect(tagsCom(html, 'data-anim="carrossel-slide"').map((t) => valorDe(t, "data-estado"))).toEqual(["ativa", "inativa", "inativa", "inativa", "inativa"]);
    expect(valorDe(tagsCom(html, "depoimentos__faixa")[0], "data-anim")).toBe("carrossel-faixa");
    const segmentos = tagsCom(html, 'class="depoimentos__segmento"');
    expect(segmentos).toHaveLength(5);
    expect(segmentos.map((b) => valorDe(b, "aria-label"))).toEqual([1, 2, 3, 4, 5].map((n) => `${conteudo.microcopy.acessibilidade.ir_para_depoimento} ${n}`));
    expect(html).toContain("1 / 5");
    expect(valorDe(tagsCom(html, "depoimentos__pausa")[0], "aria-label")).toBe(conteudo.microcopy.acessibilidade.pausar_depoimentos);
    expect(html).toContain("w-11/12"); // card a ~92% do slide, com fio à direita
    expect(valorDe(tagsCom(html, "depoimentos__card ")[0], "class")).toContain("border-r");
  });

  it("código do carrossel: autoplay de 8 s por requestAnimationFrame, loop com 3 cópias e teleporte em transitionend; sem setInterval, sem scroll; sem autoplay em reduced-motion; pausa por mouse/foco/botão", () => {
    const c = fonte("src/secoes/depoimentos/DepoimentosCarrossel.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(c).toContain('"use client"');
    expect(c).toContain("DURACAO_MS = 8000");
    expect(c).toContain("requestAnimationFrame");
    expect(c).toContain("onTransitionEnd");
    expect(c).toContain("barra.style.width = `${p * 100}%`"); // preenchimento linear (regressão: um escape errado deixava a barra em 0)
    expect(c).toContain("[0, 1, 2]");
    expect(c).toContain("useMovimentoReduzido");
    expect(fonte("src/lib/cliente.ts")).toContain("(prefers-reduced-motion: reduce)");
    expect(c).toMatch(/if \(!loop \|\| reduzido \|\| !tocando/);
    for (const e of ["onMouseEnter", "onFocus"]) expect(c).toContain(e);
    expect(c).toMatch(/aria-hidden=\{principal \? undefined : true\}/);
    expect(c).not.toMatch(/setInterval|addEventListener\(\s*["']scroll|IntersectionObserver/);
  });

  it("build:launch continua falhando enquanto houver provisorio", () => {
    const r = spawnSync(process.execPath, [path.join(raiz, "scripts", "check-pendencias.mjs"), "--launch"], { encoding: "utf8" });
    expect(r.status).toBe(1);
    expect(r.stdout + r.stderr).toMatch(/depoimentos/);
  });
});

describe("S17 unidades (T3.8)", () => {
  const html = renderizar(<Unidades />);

  it("3 cards na ordem do conteúdo; só o que está preenchido (3 endereços; horários ainda vazios)", () => {
    expect(contar(html, "unidades__card-nome")).toBe(3);
    expect([...html.matchAll(/unidades__card-local[^>]*>(?:<svg[\s\S]*?<\/svg>)?([^<]+)</g)].map((m) => m[1])).toEqual(s.unidades.itens.map((i) => i.local));
    expect(contar(html, "unidades__card-endereco")).toBe(3);
    for (const u of s.unidades.itens) expect(html).toContain(esc(u.endereco));
    expect(s.unidades.itens[1].endereco).toContain("Antônio Carlos Magalhães, 4591");
    expect(s.unidades.itens[2].endereco).toContain("Estr. do Coqueiro Grande, 1361");
    expect(html).not.toContain("unidades__card-horarios");
    // links do Google Maps enviados pelo usuário: "Ver no mapa" nas 3 unidades, nova aba, rel seguro, aria-label com o local
    const mapas = tagsCom(html, "unidades__card-mapa");
    expect(mapas).toHaveLength(3);
    s.unidades.itens.forEach((u, i) => {
      expect(u.mapa_url).toMatch(/^https:\/\/maps\.app\.goo\.gl\//);
      expect(valorDe(mapas[i], "href")).toBe(u.mapa_url);
      expect(valorDe(mapas[i], "rel")).toBe("noopener noreferrer");
      expect(valorDe(mapas[i], "aria-label")).toBe(`${s.unidades.mapa_rotulo}: ${u.local}`);
      expect(valorDe(mapas[i], "class")).toContain("min-h-touch");
    });
  });

  it("fotos das fachadas (3 webp existentes, com alt descritivo) e cantos de 8px no card e na foto (--raio-cartao)", () => {
    expect(contar(html, "<img")).toBe(3);
    s.unidades.itens.forEach((u) => {
      expect(u.imagem.src).toMatch(/^assets\/edere_spp_.*-site\.webp$/);
      expect(fs.existsSync(path.join(raiz, "public", u.imagem.src)), u.imagem.src).toBe(true);
      expect(u.imagem.alt.length).toBeGreaterThan(30);
    });
    for (const card of tagsCom(html, "unidades__card ")) expect(valorDe(card, "class")).toContain("rounded-[var(--raio-cartao)]");
    for (const m of tagsCom(html, "unidades__card-midia")) expect(valorDe(m, "class")).toContain("rounded-[var(--raio-cartao)]");
    expect(html).not.toMatch(/unidades__card [^"]*rounded-lg/);
    expect(fonte("src/app/raios.css")).toContain("--raio-cartao: 8px");
    expect(fonte("src/app/layout.tsx")).toContain('import "./raios.css"');
  });

  it("nenhum iframe; SEM botão por unidade (testado e removido a pedido do usuário em 18/11/2026); só 1 CTA do bloco, depois da lista", () => {
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("card-cta");
    expect(html).not.toMatch(/data-cta-local="unidades-/);
    expect(Object.keys(conteudo.site.cta_texto_por_local).some((k) => k.startsWith("unidades-"))).toBe(false);
    expect(tagsCom(html, 'data-cta-local="unidades"')).toHaveLength(1);
    expect(contar(html, 'data-cta="principal"')).toBe(1);
    expect(html.indexOf("</ul>")).toBeLessThan(html.indexOf('data-cta-local="unidades"'));
  });

  it("campo vazio não renderiza e não deixa texto de substituição", () => {
    const vazia = renderizar(<UnidadesCard unidade={{ nome: "Salvador", local: "Shopping da Gente", endereco: "", horarios: [], mapa_url: "" }} mapaRotulo="Ver no mapa" />);
    expect(vazia).not.toMatch(/card-endereco|card-horarios|card-mapa|Endereço|pendente|indispon/i);
    expect(vazia).toContain("Shopping da Gente");
  });

  it("com mapa_url o link existe (≥ 48px, nova aba); nunca há iframe (os links curtos do Google Maps não embutem)", () => {
    const comMapa = renderizar(<UnidadesCard unidade={{ nome: "N", local: "L", mapa_url: "https://maps.example/x" }} mapaRotulo="Ver no mapa" />);
    expect(comMapa).toContain("unidades__card-mapa");
    expect(comMapa).toContain(">Ver no mapa<");
    expect(comMapa).toContain("min-h-touch");
    expect(comMapa).toContain('target="_blank"');
    expect(comMapa).not.toContain("<iframe");
    const src = fonte("src/secoes/unidades/UnidadesMapa.tsx").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(src).not.toMatch(/iframe|use client|useState/);
  });

  it("o endereço provisório continua validar; as 3 unidades têm data-item", () => {
    expect(s.unidades.itens.every((i) => i.validar)).toBe(true);
    expect([...html.matchAll(/unidades__card (?:[^"]*)" data-item="([^"]+)"/g)].map((m) => m[1])).toEqual(["shopping-vida-nova", "shopping-da-gente", "cajazeiras-x"]);
    expect(valorDe(tagsCom(html, "unidades__lista")[0], "class")).toContain("lg:grid-cols-3");
  });
});

describe("S19 cta-final (T3.10)", () => {
  const html = renderizar(<CtaFinal />);

  it("h2 com o headline e destaque; subtexto do conteúdo; faixa escura de largura total; exatamente 1 CTA principal", () => {
    expect(contar(html, "<h2")).toBe(1);
    expect(textoDe(html.match(/<h2[\s\S]*?<\/h2>/)![0])).toBe(s.cta_final.headline.replaceAll("**", ""));
    expect(html).toContain('<span class="accent-serif">cuidado</span>');
    const r = raizDa(html);
    expect(r.classe).toContain("section-inverse");
    expect(r.classe).toContain("bg-inverse");
    expect(r).toMatchObject({ id: "agendar", ficha: "S19" });
    expect(html).toContain(`>${esc(s.cta_final.subtexto)}</p>`);
    expect(tagsCom(html, 'data-cta-local="cta-final"')).toHaveLength(1);
    expect(contar(html, 'data-cta="principal"')).toBe(1);
    expect(contar(html, "<a ")).toBe(2); // principal + secundário (ver serviços): só o principal é data-cta
    expect(valorDe(tagsCom(html, "cta-final__conteudo")[0], "class")).toContain("items-start"); // texto à esquerda, como o wireframe
  });

  it("3 selos com fatos que já estão no preço; botão secundário é ui-botao--secundario para #servicos, nunca o primário", () => {
    expect(contar(html, "cta-final__selo ")).toBe(3);
    for (const sel of s.cta_final.selos) expect(s.preco_pop.inclui.some((i) => i.includes(sel) || sel.includes(i))).toBe(true);
    const [sec] = tagsCom(html, "cta-final__cta-secundario");
    expect(valorDe(sec, "href")).toBe("#servicos");
    expect(valorDe(sec, "class")).toContain("ui-botao--secundario");
    expect(valorDe(sec, "data-cta")).toBeNull();
    expect(contar(html, "ui-botao--primario")).toBe(1);
  });

  it("sem informação nova, segundo botão principal, gradiente, pulso ou contagem; os 3 elementos entram em stagger", () => {
    expect(html).not.toMatch(/grad-|float-pulso|<button|contagem|restam|últimas/i);
    expect(contar(html, 'stagger-item"')).toBe(3);
    const [cta] = tagsCom(html, 'data-cta-local="cta-final"');
    expect(valorDe(cta, "data-anim")).toBe("botao stagger-item");
    expect(valorDe(cta, "class")).toContain("w-full");
  });
});

describe("S23 footer (T3.11)", () => {
  const html = renderizar(<Footer />);
  const f = s.footer;

  it("raiz própria footer (sem UiSecao); registro vazio não renderiza", () => {
    const [raizTag] = tagsCom(html, "<footer");
    expect(valorDe(raizTag, "data-section")).toBe("footer");
    expect(valorDe(raizTag, "data-ficha")).toBe("S23");
    expect(valorDe(raizTag, "data-conteudo")).toBe("secoes.footer");
    expect(html).not.toContain("ui-secao");
    expect(f.registro_profissional.texto).toBe("");
    expect(html).not.toContain("footer__registro");
  });

  it("3 colunas do conteúdo; WhatsApp vira link de texto wa.me; nenhum CTA principal nem botão primário", () => {
    expect(contar(html, "footer__coluna ")).toBe(3);
    expect(f.colunas.map((c) => c.titulo).every((t) => html.includes(`>${t}</p>`))).toBe(true);
    expect(contar(html, 'role="heading" aria-level="2"')).toBe(3); // rótulos leves, mas ainda títulos de nível 2 para leitores de tela
    const wa = tagsCom(html, "wa.me");
    expect(wa).toHaveLength(1);
    expect(valorDe(wa[0], "href")).toBe(linkWhatsApp());
    expect(valorDe(wa[0], "class")).toContain("footer__link"); // link de texto do rodapé (FooterLink), sem sublinhado nem negrito
    expect(valorDe(wa[0], "class")).toMatch(/hover:text-primary[^"]*focus-visible:text-primary/); // rosa da identidade ao passar o mouse e ao focar
    expect(valorDe(wa[0], "class")).not.toMatch(/underline|font-strong|transition/);
    expect(html).not.toContain("data-cta");
    expect(html).not.toContain("ui-botao");
  });

  it("Instagram com rel seguro; descrição e copyright do conteúdo; links legais; sem data-anim (N0)", () => {
    const [ig] = tagsCom(html, "instagram.com");
    expect(valorDe(ig, "rel")).toBe("noopener noreferrer");
    expect(valorDe(ig, "target")).toBe("_blank");
    expect(html).toContain(esc(f.descricao_curta));
    expect(html).toContain(esc(f.copyright));
    expect(tagsCom(html, "footer__link").map((t) => valorDe(t, "href"))).toEqual(expect.arrayContaining(["/privacidade", "/termos"]));
    expect(html).not.toContain("data-anim");
  });

  it("pb reserva a barra no mobile (altura + área segura) e pb-8 do flutuante no ≥768", () => {
    const [raizTag] = tagsCom(html, "<footer");
    const c = valorDe(raizTag, "class")!;
    expect(c).toContain("pb-[calc(var(--space-9)_+_var(--safe-bottom))]");
    expect(c).toContain("md:pb-7");
    expect(c).toContain("bg-inverse");
    expect(html).toContain("footer__cartao");
  });

  it("todo link do footer tem alvo ≥ 48px", () => {
    for (const t of tagsCom(html, "footer__link")) expect(valorDe(t, "class")).toContain("min-h-touch");
  });
});

describe("Página inteira (T3.11)", () => {
  const html = renderizar(<Home />);

  it("seções na ordem da Superpower, ids únicos, 1 h1 e h2 por seção", () => {
    const ids = tagsCom(html, "<section").map((t) => valorDe(t, "id"));
    expect(ids).toEqual(["inicio", "como-funciona", "problema-solucao", "servicos", "para-quem", "depoimentos", "unidades", "preco", "agendar"]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(contar(html, "<h1")).toBe(1);
    expect(tagsCom(html, "<section").map((t) => valorDe(t, "data-ficha"))).toEqual(["S01", "S07", "S03", "S06", "S05", "S10", "S17", "S12", "S19"]);
  });

  it("CTAs principais da página (6): mesmo botão e destino, TEXTO por contexto (site.cta_texto_por_local; hero, unidades e barra = canônico)", () => {
    const tags = tagsCom(html, 'data-cta="principal"');
    const locais = tags.map((t) => valorDe(t, "data-cta-local"));
    expect(locais).toEqual(["hero", "como-funciona", "problema-solucao", "unidades", "preco-pop", "cta-final"]);
    expect(contar(html, "ui-botao--primario")).toBe(6);
    const destino = resolverCta("@ctas.principal").href;
    for (const t of tags) expect(valorDe(t, "href")).toBe(destino);
    const textos = Object.fromEntries([...html.matchAll(/data-cta-local="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => [m[1], m[2]]));
    const canonico = resolverCta("@ctas.principal").texto;
    expect(textos["hero"]).toBe(canonico);
    expect(textos["unidades"]).toBe(canonico);
    expect(textos["como-funciona"]).toBe("Começar pelo WhatsApp");
    expect(textos["problema-solucao"]).toBe("Quero minha avaliação");
    expect(textos["preco-pop"]).toBe("Quero agendar por R$ 49,99");
    expect(textos["cta-final"]).toBe("Agendar agora no WhatsApp");
  });

  it("todo destino de âncora do menu e dos links internos existe como id na página", () => {
    const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])); // qualquer elemento (ex.: #faq é o bloco de dúvidas dentro do preço)
    const alvos = [...conteudo.site.menu.map((m) => m.destino), ...conteudo.secoes.problema_solucao.itens.map((i) => i.ancora), conteudo.site.ctas.secundario.destino];
    for (const a of alvos) expect(ids.has(a.replace("#", "")), a).toBe(true);
  });

  it("nenhum iframe, nenhum script de medição; fotos reais só onde o cliente enviou (hero, como-funciona 1–4, S03 1–4); o resto segue pendente: nada inventado", () => {
    expect(html).not.toMatch(/<iframe|gtag|fbq|analytics/);
    expect(contar(html, "<img")).toBe(20); // + 2 avatares do chat do S03; // hero + 4 passos do como-funciona + passos 1–4 do S03 (o 5 é vídeo) + 5 depoimentos + 1 do cartaz do preço + 3 fachadas das unidades + 3 depoimentos; as demais mídias seguem pendentes
    const srcs = tagsCom(html, "<img").map((x) => valorDe(x, "src")!).filter((x) => !x.includes("perfil_conversa"));
    expect(srcs[0]).toBe(`/${conteudo.secoes.hero.midia.src}`);
    for (const [k, nome] of ["img_vc_agenda", "img_agent_avalia", "img_vc_sai_leve", "img_volta_quiser"].entries()) expect(srcs[1 + k]).toContain(nome + "-site.webp");
    for (const [k, nome] of ["img_dor_costas", "img_inchaco", "img_stress", "img_gordura_localizada"].entries()) expect(srcs[5 + k]).toContain(nome + "-site.webp");
  });

  it("motion: nada acima da dobra (hero) tem reveal; as demais seções usam reveal/stagger-item", () => {
    const hero = html.slice(0, html.indexOf('id="como-funciona"'));
    expect(hero).not.toMatch(/reveal|stagger-item/);
    expect(contar(html, "stagger-item")).toBeGreaterThan(20);
  });
});
