/**
 * Verificação · convenção de nomes (T2.0)
 * Fonte das regras: docs/convencao-de-nomes.md (§2, §3, §5, §8, §9). A lista oficial de
 * elementos por bloco é lida da tabela da §5 desse arquivo (uma fonte só).
 * Uso: node scripts/check-nomes.mjs [pasta]   (padrão: src) · npm run check:nomes
 * Varre src/**\/*.ts e *.tsx (ignora testes, src/test e .d.ts) e sai com código 1 se houver violação.
 *
 * Regras (letras da T2.0 em docs/tasks.md):
 *  a  div/span sem className, ou cuja 1ª classe não é nome válido (lista oficial, ui-*, globais)
 *  b  nome proibido (wrapper, container, box, inner, content, item, div1, section2)
 *  c  raiz de seção sem id, data-section, data-ficha, data-conteudo (e aria-labelledby/aria-label)
 *  d  data-cta fora de principal|servico|flutuante; "principal" fora de UiCtaPrincipal.tsx;
 *     data-cta-local fora da lista (unidades-* é RESERVADO)
 *  e  data-anim ou data-estado fora dos valores da convenção
 *  f  data-js, data-motion, data-js-pronto, data-js-falhou fora de layout.tsx / MotionInit / CtaObservador / ProblemaSolucaoPalco
 *  g  arquivo sem cabeçalho de localização
 *  h  UiBotao variante="primario" fora de UiCtaPrincipal.tsx (o botão primário é só o CTA)
 * Exceções: <span className="accent-serif">; <section> do bloco teste-tokens (página interna); header e footer com raiz própria (sem id obrigatório);
 * prova-rapida usa aria-label; UiSecao recebe bloco/ficha/conteudo por props.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONVENCAO = path.join(RAIZ, "docs", "convencao-de-nomes.md");

/* ---------- Valores fechados (convenção §3) ---------- */
export const DATA_CTA = ["principal", "servico", "flutuante"];
export const DATA_CTA_LOCAL = [
  "header",
  "header-painel",
  "hero",
  "problema-solucao",
  "como-funciona",
  "preco-pop",
  "unidades",
  "cta-final",
  "barra",
];
export const DATA_ANIM = [
  "reveal",
  "stagger-item",
  "header-pilula",
  "header-logo",
  "header-link",
  "header-menu",
  "painel",
  "painel-fundo",
  "barra-cta",
  "float",
  "float-pulso",
  "botao",
  "card-realce",
  "accordion-icone",
  "accordion-resposta",
  "stage-passos",
  "stage-passo",
  "stage-passo-rotulo",
  "stage-anel",
  "stage-anel-fill",
  "stage-copias",
  "stage-copia",
  "stage-visual",
  "stage-vidro",
  "stage-raiz",
  "stage-lateral",
  "stage-faq",
  "stage-faq-icone",
  "stage-modal",
  "pilha",
  "pilha-parallax",
  "desce",
  "accordion",
  "carrossel-fundo",
  "carrossel-vidro",
  "pilha-base",
  "pilha-topo",
  "chat",
  "chat-video",
  "chat-mensagem",
  "chat-vidro",
  "chat-usuario",
  "chat-avatar",
  "chat-palavra",
  "chat-ponto",
  "carrossel-faixa",
  "carrossel-slide",
  "carrossel-navegacao",
  "carrossel-segmento",
  "carrossel-progresso",
  "mapa-embed",
];
export const DATA_ESTADO = [
  "aberto",
  "rolado",
  "visivel",
  "oculta",
  "pendente",
  "visto",
  "ativa",
  "inativa",
  "salto",
  "arrastando",
];
const DATA_HTML = ["data-js", "data-motion", "data-js-pronto", "data-js-falhou"];
const ARQUIVOS_DATA_HTML = ["layout.tsx", "MotionInit.tsx", "CtaObservador.tsx"];

const UI = [
  "ui-secao",
  "ui-container",
  "ui-titulo",
  "ui-botao",
  "ui-link",
  "ui-barra-cta",
  "ui-selo",
  "ui-card",
  "ui-icone",
  "ui-chip",
  "ui-accordion",
  "ui-midia",
  "ui-pilha",
];
const GLOBAIS = ["whatsapp-float", "voltar-topo", "cookie-banner", "pagina-404", "pagina-legal"];
/** Bloco de verificação interna (rota /teste-tokens): aceita qualquer elemento kebab-case. */
const BLOCO_LIVRE = "teste-tokens";
const PROIBIDOS = ["wrapper", "container", "box", "inner", "content", "item"];
const PROIBIDOS_REGEX = /^(div|section)\d+$/;
const KEBAB = "[a-z0-9]+(?:-[a-z0-9]+)*";

/* ---------- Lista oficial (tabela da §5) ---------- */
/** Lê `| \`bloco\` | \`a\` · \`b\` |` da convenção. Retorna Map(bloco → Set(elementos)). */
export function lerListaOficial(texto = fs.readFileSync(CONVENCAO, "utf8")) {
  const mapa = new Map();
  const dentro = texto.split(/^## 5\./m)[1]?.split(/^## 6\./m)[0] ?? "";
  for (const linha of dentro.split("\n")) {
    const m = linha.match(/^\|\s*`([a-z0-9-]+)`\s*\|(.*)\|\s*$/); // `pagina-404` tem dígitos
    if (!m) continue;
    const semParenteses = m[2].replace(/\([^)]*\)/g, " ");
    const elementos = [...semParenteses.matchAll(/`([a-z0-9-]+)`/g)].map((x) => x[1]);
    mapa.set(m[1], new Set(elementos));
  }
  return mapa;
}

/** `hero__selo`, `servicos__card--destaque`, `ui-botao--primario`, `hero` (raiz)… */
export function nomeValido(token, lista) {
  if (UI.includes(token)) return true;
  if (GLOBAIS.includes(token)) return true;
  const ui = token.match(new RegExp(`^(ui-${KEBAB})--${KEBAB}$`));
  if (ui && UI.includes(ui[1])) return true;
  const glob = token.match(new RegExp(`^(${GLOBAIS.join("|")})--${KEBAB}$`));
  if (glob) return true;
  if (lista.has(token)) return true; // raiz da seção: `hero`, `header`, `footer`…
  const bem = token.match(new RegExp(`^(${KEBAB})__(${KEBAB})(?:--${KEBAB})?$`));
  if (!bem) return token === BLOCO_LIVRE;
  const [, bloco, elemento] = bem;
  if (bloco === BLOCO_LIVRE) return true;
  return lista.get(bloco)?.has(elemento) ?? false;
}

/* ---------- Auxiliares de AST ---------- */
function nomeDoAtributo(attr) {
  return ts.isJsxAttribute(attr) ? attr.name.getText() : null;
}

/** Textos literais que um valor de atributo pode assumir (strings dentro de qualquer expressão). */
function literaisDoAtributo(attr) {
  const init = attr.initializer;
  if (!init) return [];
  if (ts.isStringLiteral(init)) return [init.text];
  const achados = [];
  const visitar = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) achados.push(n.text);
    ts.forEachChild(n, visitar);
  };
  if (ts.isJsxExpression(init) && init.expression) visitar(init.expression);
  return achados;
}

/**
 * Primeira classe de um className. Retorna { tipo: "literal"|"delegada"|"desconhecida", valor, todas }.
 * "delegada" = `${className}`/`${bloco}` ou juntar(className, …) no início (componente compartilhado; o nome vem do chamador).
 */
function primeiraClasse(attr) {
  const init = attr.initializer;
  if (!init) return { tipo: "desconhecida" };
  const cortar = (s) => s.trim().split(/\s+/).filter(Boolean);
  if (ts.isStringLiteral(init)) {
    const t = cortar(init.text);
    return { tipo: "literal", valor: t[0], todas: t };
  }
  if (ts.isJsxExpression(init) && init.expression) {
    const e = init.expression;
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) {
      const t = cortar(e.text);
      return { tipo: "literal", valor: t[0], todas: t };
    }
    // juntar(className, "ui-x ...") — helper de src/lib/classes.ts (className opcional sem "undefined")
    if (ts.isCallExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === "juntar") {
      const todas = e.arguments.filter((a) => ts.isStringLiteralLike(a)).flatMap((a) => cortar(a.text));
      const primeiro = e.arguments[0];
      if (primeiro && ts.isIdentifier(primeiro) && ["className", "bloco"].includes(primeiro.text)) {
        return { tipo: "delegada", todas };
      }
      if (primeiro && ts.isStringLiteralLike(primeiro)) {
        return { tipo: "literal", valor: cortar(primeiro.text)[0], todas };
      }
    }
    if (ts.isTemplateExpression(e)) {
      const cabeca = cortar(e.head.text);
      const todas = [
        ...cabeca,
        ...e.templateSpans.flatMap((s) => cortar(s.literal.text)),
      ];
      if (cabeca.length) return { tipo: "literal", valor: cabeca[0], todas };
      const primeira = e.templateSpans[0]?.expression;
      if (primeira && ts.isIdentifier(primeira) && ["className", "bloco"].includes(primeira.text)) {
        return { tipo: "delegada", todas };
      }
    }
  }
  return { tipo: "desconhecida" };
}

function linhaDe(sf, no) {
  return sf.getLineAndCharacterOfPosition(no.getStart(sf)).line + 1;
}

/* ---------- Verificação de um arquivo ---------- */
/**
 * @param {string} arquivo caminho (só o nome e a pasta importam para as exceções)
 * @param {string} texto conteúdo do arquivo
 * @param {Map<string, Set<string>>} lista lista oficial de elementos
 * @returns {{ linha: number, regra: string, mensagem: string }[]}
 */
export function verificarArquivo(arquivo, texto, lista = lerListaOficial()) {
  const erros = [];
  const base = path.basename(arquivo);
  const emUi = arquivo.replaceAll("\\", "/").includes("/ui/") || /^ui\//.test(arquivo);
  const erro = (linha, regra, mensagem) => erros.push({ linha, regra, mensagem });

  // g · cabeçalho de localização
  const inicio = texto.replace(/^﻿/, "").trimStart();
  const cab = inicio.match(/^\/\*\*([\s\S]*?)\*\//);
  if (!cab || !/(Ficha|Conteúdo|Seção)/i.test(cab[1])) {
    erro(1, "g", "arquivo sem cabeçalho de localização (/** Seção · Ficha · Conteúdo · Elementos */)");
  }

  const sf = ts.createSourceFile(arquivo, texto, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const verificarAtributos = (no, tag, atributos) => {
    const mapa = new Map();
    for (const a of atributos) {
      const n = nomeDoAtributo(a);
      if (n) mapa.set(n, a);
    }
    const linha = linhaDe(sf, no);
    const ehHtml = tag === "html";

    // d · data-cta
    const cta = mapa.get("data-cta");
    if (cta) {
      for (const v of literaisDoAtributo(cta)) {
        if (!DATA_CTA.includes(v)) erro(linha, "d", `data-cta="${v}" fora de ${DATA_CTA.join("|")}`);
        if (v === "principal" && base !== "UiCtaPrincipal.tsx") {
          erro(linha, "d", 'data-cta="principal" só pode sair de UiCtaPrincipal.tsx');
        }
      }
    }
    const local = mapa.get("data-cta-local");
    if (local) {
      for (const v of literaisDoAtributo(local)) {
        if (/^unidades-/.test(v)) {
          erro(linha, "d", `data-cta-local="${v}" é RESERVADO (só com número de WhatsApp por unidade)`);
        } else if (!DATA_CTA_LOCAL.includes(v)) {
          erro(linha, "d", `data-cta-local="${v}" fora da lista da convenção §3`);
        }
      }
    }
    if (tag === "UiCtaPrincipal") {
      const l = mapa.get("local");
      if (l) {
        for (const v of literaisDoAtributo(l)) {
          if (/^unidades-/.test(v)) erro(linha, "d", `local="${v}" é RESERVADO`);
          else if (!DATA_CTA_LOCAL.includes(v)) erro(linha, "d", `local="${v}" fora da lista da convenção §3`);
        }
      } else {
        erro(linha, "d", "UiCtaPrincipal sem a prop local (vira data-cta-local)");
      }
    }

    // e · data-anim e data-estado
    const anim = mapa.get("data-anim");
    if (anim) {
      for (const v of literaisDoAtributo(anim).flatMap((x) => x.split(/\s+/).filter(Boolean))) {
        if (!DATA_ANIM.includes(v)) erro(linha, "e", `data-anim="${v}" fora do catálogo`);
      }
    }
    const estado = mapa.get("data-estado");
    if (estado) {
      for (const v of literaisDoAtributo(estado)) {
        if (!DATA_ESTADO.includes(v)) erro(linha, "e", `data-estado="${v}" fora dos valores da convenção`);
      }
    }

    // f · data-js* só no <html> de layout.tsx
    for (const nome of DATA_HTML) {
      if (mapa.has(nome) && !(ehHtml && base === "layout.tsx")) {
        erro(linha, "f", `${nome} só pode ser usado no <html> de layout.tsx`);
      }
    }

    // h · botão primário só via UiCtaPrincipal
    if (tag === "UiBotao") {
      const v = mapa.get("variante");
      if (v && literaisDoAtributo(v).includes("primario") && base !== "UiCtaPrincipal.tsx") {
        erro(linha, "h", 'UiBotao variante="primario" só em UiCtaPrincipal.tsx');
      }
    }

    // classes
    const cn = mapa.get("className");
    const info = cn ? primeiraClasse(cn) : null;
    if (info?.todas) {
      for (const t of info.todas) {
        if (PROIBIDOS.includes(t) || PROIBIDOS_REGEX.test(t)) {
          erro(linha, "b", `nome proibido "${t}" (convenção §8)`);
        }
      }
    }

    for (const [nomeAttr, attr] of mapa) {
      if (!/^classe[A-Z]/.test(nomeAttr)) continue;
      const extra = primeiraClasse(attr);
      if (extra.tipo === "literal" && extra.valor && (extra.valor.includes("__") || extra.valor.startsWith("ui-")) && !nomeValido(extra.valor, lista)) {
        erro(linha, "a", `${nomeAttr}="${extra.valor}" fora da lista oficial de nomes`);
      }
    }

    if (tag === "div" || tag === "span") {
      if (!info) {
        erro(linha, "a", `<${tag}> sem className (nenhum elemento anônimo)`);
      } else if (info.tipo === "desconhecida") {
        erro(linha, "a", `<${tag}> com className que não dá para ler (a 1ª classe tem de ser a classe-nome literal)`);
      } else if (info.tipo === "delegada") {
        if (!emUi) erro(linha, "a", `<${tag}> com \${className} fora de src/ui/ (nunca montar classe-nome)`);
      } else if (!(tag === "span" && info.valor === "accent-serif" && info.todas.length === 1)) {
        if (!nomeValido(info.valor, lista)) {
          erro(linha, "a", `<${tag}> com 1ª classe "${info.valor}" fora da lista oficial de nomes`);
        }
      }
    } else if (info?.tipo === "literal" && (info.valor.includes("__") || info.valor.startsWith("ui-"))) {
      if (!nomeValido(info.valor, lista)) {
        erro(linha, "a", `<${tag}> com classe-nome "${info.valor}" fora da lista oficial`);
      }
    }

    // c · raízes
    if (tag === "section" && !info?.valor?.startsWith(`${BLOCO_LIVRE}__`)) {
      for (const a of ["id", "data-section", "data-ficha", "data-conteudo"]) {
        if (!mapa.has(a)) erro(linha, "c", `<section> sem ${a} (raiz de seção)`);
      }
      if (!mapa.has("aria-labelledby") && !mapa.has("aria-label")) {
        erro(linha, "c", "<section> sem aria-labelledby (ou aria-label na prova-rapida)");
      }
    }
    if ((tag === "header" || tag === "footer") && info?.valor === tag) {
      for (const a of ["data-section", "data-ficha", "data-conteudo"]) {
        if (!mapa.has(a)) erro(linha, "c", `<${tag}> (raiz própria) sem ${a}`);
      }
    }
    if (tag === "UiSecao") {
      for (const a of ["id", "bloco", "ficha", "conteudo"]) {
        if (!mapa.has(a)) erro(linha, "c", `<UiSecao> sem a prop ${a}`);
      }
      const bloco = mapa.get("bloco");
      if (!mapa.has("labelledby") && !mapa.has("ariaLabel")) {
        erro(linha, "c", "<UiSecao> sem labelledby (ou ariaLabel na prova-rapida)");
      }
      if (mapa.has("ariaLabel") && bloco && !literaisDoAtributo(bloco).includes("prova-rapida")) {
        erro(linha, "c", "ariaLabel no lugar de labelledby só vale para prova-rapida");
      }
    }
  };

  const visitar = (no) => {
    if (ts.isJsxOpeningElement(no) || ts.isJsxSelfClosingElement(no)) {
      verificarAtributos(no, no.tagName.getText(), no.attributes.properties);
    }
    // setAttribute("data-…", "valor") em código client
    if (
      ts.isCallExpression(no) &&
      ts.isPropertyAccessExpression(no.expression) &&
      no.expression.name.text === "setAttribute" &&
      no.arguments.length >= 1 &&
      ts.isStringLiteralLike(no.arguments[0])
    ) {
      const nome = no.arguments[0].text;
      const valor = no.arguments[1] && ts.isStringLiteralLike(no.arguments[1]) ? no.arguments[1].text : null;
      const linha = linhaDe(sf, no);
      if (DATA_HTML.includes(nome) && !ARQUIVOS_DATA_HTML.includes(base)) {
        erro(linha, "f", `${nome} só pode ser escrito por layout.tsx, MotionInit.tsx ou CtaObservador.tsx`);
      }
      if (nome === "data-estado" && valor !== null && !DATA_ESTADO.includes(valor)) {
        erro(linha, "e", `data-estado="${valor}" fora dos valores da convenção`);
      }
      if (nome === "data-anim" && valor !== null && !valor.split(/\s+/).every((v) => DATA_ANIM.includes(v))) {
        erro(linha, "e", `data-anim="${valor}" fora do catálogo`);
      }
    }
    ts.forEachChild(no, visitar);
  };
  visitar(sf);

  return erros;
}

/* ---------- Varredura do projeto ---------- */
function listar(pasta) {
  const saida = [];
  for (const e of fs.readdirSync(pasta, { withFileTypes: true })) {
    const cheio = path.join(pasta, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "test") continue;
      saida.push(...listar(cheio));
    } else if (/\.(ts|tsx)$/.test(e.name) && !/\.(test|d)\.(ts|tsx)$/.test(e.name)) {
      saida.push(cheio);
    }
  }
  return saida;
}

export function verificarPasta(pasta) {
  const lista = lerListaOficial();
  const resultado = [];
  for (const arquivo of listar(pasta)) {
    const texto = fs.readFileSync(arquivo, "utf8");
    for (const e of verificarArquivo(arquivo, texto, lista)) {
      resultado.push({ arquivo: path.relative(RAIZ, arquivo), ...e });
    }
  }
  return resultado;
}

const executadoDiretamente = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (executadoDiretamente) {
  const pasta = path.resolve(RAIZ, process.argv[2] ?? "src");
  const erros = verificarPasta(pasta);
  if (erros.length) {
    for (const e of erros) console.error(`${e.arquivo}:${e.linha}  [${e.regra}]  ${e.mensagem}`);
    console.error(`\ncheck-nomes: ${erros.length} violação(ões) da convenção de nomes.`);
    process.exit(1);
  }
  console.log(`check-nomes: ok (${listar(pasta).length} arquivos conferidos).`);
}
