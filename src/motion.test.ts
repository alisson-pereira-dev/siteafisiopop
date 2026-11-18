/**
 * Testes [auto] · conferência final de motion (T4.2)
 * Ficha: docs/tasks.md T4.2 · Regras: CLAUDE.md (Motion) e docs/jornada-e-motion.md §3 (catálogo) · Conteúdo: nenhum
 * Varre TODO o código de src/ (exceto testes): propriedades animadas só transform/opacity, nenhum listener de
 * scroll/wheel/touchmove, nenhum preventDefault fora do teclado do painel, nenhum scroll-snap, nenhum will-change permanente,
 * nenhuma biblioteca de motion, toda receita `data-anim` do catálogo com as 3 versões declaradas, peso < 5 KB gzip.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ARQUIVOS, LIMITE_BYTES, medirMotion } from "../scripts/check-motion.mjs";

const raiz = path.resolve(__dirname, "..");
const ler = (relativo: string) => fs.readFileSync(path.join(raiz, relativo), "utf8");
const semComentarios = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");

function listar(pasta: string): string[] {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((e) => {
    const cheio = path.join(pasta, e.name);
    if (e.isDirectory()) return e.name === "test" ? [] : listar(cheio);
    return /\.(ts|tsx|css)$/.test(e.name) && !/\.test\./.test(e.name) ? [cheio] : [];
  });
}
const fontes = listar(path.join(raiz, "src")).map((f) => ({ arquivo: path.relative(raiz, f).replaceAll("\\", "/"), codigo: semComentarios(fs.readFileSync(f, "utf8")) }));
const css = semComentarios(ler("src/app/globals.css"));

describe("CSS de motion: só transform e opacity", () => {
  it("toda transition lista só transform, opacity (e visibility com atraso, para sair da ordem de Tab)", () => {
    const permitidas = new Set(["opacity", "transform", "visibility"]);
    for (const m of css.matchAll(/transition:\s*([^;]+);/g)) {
      if (m[1].trim() === "none") continue;
      for (const parte of m[1].split(",")) expect(permitidas.has(parte.trim().split(/\s+/)[0]), `transition: ${parte.trim()}`).toBe(true);
    }
  });

  it("os @keyframes só mexem em opacity e transform", () => {
    const blocos = [...css.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?\})\s*\}/g)];
    expect(blocos.length).toBeGreaterThanOrEqual(2);
    for (const [, nome, corpo] of blocos) {
      const props = [...corpo.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      for (const p of props) expect(["opacity", "transform"], `@keyframes ${nome}: ${p}`).toContain(p);
    }
  });

  it("nenhuma propriedade de layout em transition/animation (width, height, top, left, margin, color, background, box-shadow)", () => {
    const linhas = css.split("\n").filter((l) => /transition|animation/.test(l));
    for (const l of linhas) expect(l).not.toMatch(/\b(width|height|top|left|right|bottom|margin|padding|color|background|box-shadow)\b/);
  });

  it("durações e curvas só de tokens: nenhum valor de tempo literal fora do atraso 0s", () => {
    const literal = [...css.matchAll(/(?:transition|animation)[a-z-]*:[^;]*\b\d+(?:\.\d+)?m?s\b[^;]*;/g)].filter((m) => !/\b0s linear var\(--dur-(fast|base)\)/.test(m[0]));
    expect(literal.map((m) => m[0])).toEqual([]);
    expect(css).not.toMatch(/cubic-bezier\(/);
  });

  it("sem scroll-snap, sem backdrop-filter, sem will-change permanente, sem animação por classe", () => {
    expect(css).not.toMatch(/scroll-snap|backdrop-filter|will-change/);
    // toda regra de motion seleciona por [data-anim] (ou por estado do <html>), nunca por classe
    const motion = css.slice(css.indexOf("Receitas de motion"));
    expect(motion.replace(/@media[^{]*\{/g, "")).not.toMatch(/(^|\n)\.[a-z][\w-]*\s*[{,]/);
  });
});

describe("código: sem listener de scroll, sem scroll-jacking, sem biblioteca", () => {
  it("nenhum listener de scroll, wheel ou touchmove em src/ (única exceção: HeaderBarra, decisão do usuário de 16/11/2026)", () => {
    for (const { arquivo, codigo } of fontes.filter((f) => f.arquivo !== "src/secoes/header/HeaderBarra.tsx")) expect(codigo, arquivo).not.toMatch(/addEventListener\(\s*["'`](scroll|wheel|touchmove|touchstart)["'`]|onScroll|onWheel|onTouchMove|scrollTo\(|scrollIntoView/);
  });

  it("HeaderBarra: único listener de scroll (passivo, coalescido por rAF, histerese 60/52); nunca wheel/touchmove, preventDefault ou scrollTo", () => {
    const h = fontes.find((f) => f.arquivo === "src/secoes/header/HeaderBarra.tsx")!.codigo;
    expect(h.split("addEventListener(").length - 1).toBe(1);
    expect(h).toContain('addEventListener("scroll", aoRolar, { passive: true })');
    expect(h).toContain("requestAnimationFrame");
    expect(h).toContain("LIGA_ACIMA_DE_PX = 60");
    expect(h).toContain("DESLIGA_ATE_PX = 52");
    expect(h).not.toMatch(/wheel|touchmove|preventDefault|scrollTo|scrollIntoView/);
    const comScroll = fontes.filter((f) => f.codigo.includes('addEventListener("scroll"')).map((f) => f.arquivo);
    expect(comScroll).toEqual(["src/secoes/header/HeaderBarra.tsx"]);
  });

  it("preventDefault só no teclado do painel do menu (Esc e Tab); nunca em wheel/touch/scroll", () => {
    const usos = fontes.filter((f) => /preventDefault/.test(f.codigo)).map((f) => f.arquivo);
    expect(usos).toEqual(["src/secoes/header/HeaderPainel.tsx"]);
    const trechos = [...fontes.find((f) => f.arquivo.endsWith("HeaderPainel.tsx"))!.codigo.matchAll(/preventDefault\(\)/g)];
    expect(trechos.length).toBe(4); // Esc + 3 ramos do Tab (foco preso)
  });

  it("nenhuma biblioteca de motion e nenhum Lenis/GSAP/ScrollTrigger", () => {
    const pkg = ler("package.json");
    expect(pkg).not.toMatch(/gsap|lenis|framer-motion|"motion"|scrolltrigger|react-spring|anime/i);
    for (const { arquivo, codigo } of fontes) expect(codigo, arquivo).not.toMatch(/from ["'](gsap|motion|framer-motion|lenis)/);
  });

  it("os observers são os previstos (um por finalidade): CtaObservador, MotionInit e o stage do S03 (só para tocar o vídeo na tela; o HeaderBarra usa scroll)", () => {
    const com = fontes.filter((f) => /new IntersectionObserver/.test(f.codigo)).map((f) => f.arquivo).sort();
    expect(com).toEqual(["src/secoes/problema-solucao/ProblemaSolucaoStage.tsx", "src/ui/CtaObservador.tsx", "src/ui/MotionInit.tsx"]);
  });
});

describe("catálogo de receitas data-anim (jornada-e-motion.md §3.4)", () => {
  const doc = ler("docs/jornada-e-motion.md");
  const linhasCatalogo = doc.split("\n").filter((l) => /^\| `[a-z-]+`/.test(l) && l.split("|").length >= 8 && !l.includes("| Nível |"));

  it("toda receita do catálogo declara nível e as 3 versões (nenhuma coluna em branco)", () => {
    expect(linhasCatalogo.length).toBeGreaterThanOrEqual(13);
    for (const l of linhasCatalogo) {
      const colunas = l.split("|").slice(1, -1).map((c) => c.trim());
      expect(colunas.length, l).toBe(7);
      expect(colunas[1], l).toMatch(/^(N0|N1|\*\*N2\*\*|N2)/);
      for (const c of colunas.slice(4)) expect(c.length, l).toBeGreaterThan(0);
    }
  });

  it("todo valor de data-anim usado no código existe no catálogo", () => {
    const catalogo = new Set([...doc.matchAll(/^\| `([a-z-]+)`/gm)].map((m) => m[1]).concat(["pilha-parallax", "desce", "accordion", "carrossel-fundo", "carrossel-vidro", "pilha", "pilha-base", "pilha-topo", "stage-raiz", "stage-lateral", "stage-vidro", "chat", "chat-video", "chat-mensagem", "chat-vidro", "chat-usuario", "chat-avatar", "chat-palavra", "chat-ponto", "carrossel-faixa", "carrossel-slide", "carrossel-navegacao", "carrossel-segmento", "carrossel-progresso", "stage-passos", "stage-passo", "stage-passo-rotulo", "stage-anel", "stage-anel-fill", "stage-copias", "stage-copia", "stage-visual", "stage-vidro", "stage-raiz", "stage-lateral", "stage-faq", "stage-faq-icone", "stage-modal"]));
    const usados = new Set<string>();
    for (const { codigo } of fontes) for (const m of codigo.matchAll(/data-anim=["{]+([a-z -]+)["}]/g)) m[1].split(/\s+/).filter(Boolean).forEach((v) => usados.add(v));
    for (const v of usados) expect(catalogo.has(v), `data-anim="${v}"`).toBe(true);
    expect(usados.size).toBeGreaterThanOrEqual(12);
  });

  it("toda receita usada tem CSS em globals.css (exceto as de estado puro como reveal/stagger, que também têm)", () => {
    const receitas = ["reveal", "stagger-item", "barra-cta", "float", "float-pulso", "botao", "card-realce", "accordion-icone", "accordion-resposta", "mapa-embed"];
    for (const r of receitas) expect(css, r).toContain(`[data-anim~="${r}"]`);
    const cssHeader = semComentarios(ler("src/app/header.css"));
    for (const r of ["header-pilula", "header-logo", "header-link", "header-menu", "painel", "painel-fundo"]) expect(cssHeader, r).toContain(`[data-anim~="${r}"]`);
    expect(css).not.toContain("header-fundo");
  });
});

describe("reduced-motion e versões", () => {
  it("reduced-motion: tokens caem para ~0; pulso não existe", () => {
    expect(ler("styles/design-tokens.css")).toMatch(/prefers-reduced-motion: reduce\) \{\s*:root \{ --dur-fast: 0.01ms/);
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\s*\[data-anim~="float-pulso"\] \{\s*display: none/);
  });

  it("desktop/tablet (≥768) usa dur-slow + stagger; mobile (<768) dur-base e sem stagger", () => {
    expect(css).toMatch(/\[data-motion="on"\] \[data-anim~="reveal"\]\[data-estado="visto"\],[\s\S]*?transition:\s*opacity var\(--dur-base\)/);
    expect(css).toMatch(/@media \(min-width: 768px\) \{[\s\S]*?transition-duration: var\(--dur-slow\)[\s\S]*?transition-delay: calc\(var\(--stagger-step\) \* var\(--stagger-i, 0\)\)/);
    // atraso por posição, com teto de 3 passos, em CSS (o JS não escreve style nos itens: evita o aviso de hidratação do modo dev)
    expect(css).toMatch(/stagger-item"\]:nth-child\(2\) \{\s*--stagger-i: 1;[\s\S]*nth-child\(3\) \{\s*--stagger-i: 2;[\s\S]*nth-child\(n \+ 4\) \{\s*--stagger-i: 3;/);
    expect(fontes.find((f) => f.arquivo === "src/ui/MotionInit.tsx")!.codigo).not.toContain("--stagger-i");
  });
});

describe("peso do código próprio de motion", () => {
  it("< 5 KB gzip (todos os arquivos client de movimento juntos)", async () => {
    const r = await medirMotion();
    expect(ARQUIVOS.length).toBeGreaterThanOrEqual(7);
    expect(r.gzipBytes).toBeGreaterThan(1000);
    expect(r.gzipBytes).toBeLessThan(LIMITE_BYTES);
  });
});

describe("header.css: exceção documentada do header (decisão do usuário, 16/11/2026)", () => {
  const bruto = ler("src/app/header.css");
  const cssHeader = semComentarios(bruto);

  it("declara a exceção e é importado pelo layout", () => {
    expect(bruto).toMatch(/EXCEÇÃO DOCUMENTADA/);
    expect(ler("src/app/layout.tsx")).toContain('import "./header.css"');
  });

  it("todo seletor é por [data-anim] (nunca por classe-nome) e o estado vem de [data-section=header]", () => {
    const seletores = [...cssHeader.replace(/@media[^{]*\{/g, "").matchAll(/(^|\})\s*([^{}]+)\{/g)].map((m) => m[2].trim());
    expect(seletores.length).toBeGreaterThan(10);
    for (const s of seletores) {
      expect(s, s).toContain('[data-anim~="');
      expect(s, s).not.toMatch(/(^|[\s>+~,])\.[a-z]/);
    }
  });

  it("transições só de propriedades previstas, com durações e curvas dos tokens", () => {
    const permitidas = new Set(["transform", "opacity", "visibility", "max-width", "padding", "gap", "background-color", "border-color", "box-shadow", "backdrop-filter", "-webkit-backdrop-filter", "color", "filter"]);
    for (const m of cssHeader.matchAll(/transition:\s*([^;]+);/g)) {
      for (const parte of m[1].split(",")) {
        expect(permitidas.has(parte.trim().split(/\s+/)[0]), `transition: ${parte.trim()}`).toBe(true);
        expect(parte, parte).toMatch(/var\(--dur-(fast|base)\)/);
      }
    }
    const literal = [...cssHeader.matchAll(/(?:transition|animation)[a-z-]*:[^;]*\b\d+(?:\.\d+)?m?s\b[^;]*;/g)].filter((m) => !/\b0s linear var\(--dur-base\)/.test(m[0]));
    expect(literal.map((m) => m[0])).toEqual([]);
    expect(cssHeader).not.toMatch(/cubic-bezier\(|will-change|scroll-snap/);
  });

  it("sem cor ou medida literal: só tokens e variáveis (--pilula-*, --gaveta-largura, --logo-escala-rolado)", () => {
    expect(cssHeader).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
    for (const v of ["--pilula-largura", "--pilula-vidro", "--logo-escala-rolado", "--gaveta-largura"]) expect(css, v).toContain(`${v}:`);
    expect(css).toMatch(/--pilula-vidro: color-mix\(in srgb, var\(--color-surface\) 45%, transparent\)/); // vidro claro, não preto
    expect(css).toMatch(/--pilula-borda: color-mix\(in srgb, var\(--color-surface\) 80%, transparent\)/);
    expect(cssHeader).not.toMatch(/brightness\(0\)|invert\(/); // o logo não vira mais silhueta branca
  });

  it("o visual base é o 'rolado' (sem JS ou com falha o header nunca fica transparente); o do topo só com JS pronto e sem `rolado`", () => {
    const base = cssHeader.match(/\[data-anim~="header-pilula"\]\s*\{([^}]*)\}/)![1];
    expect(base).toContain("background-color: var(--pilula-vidro)");
    expect(base).toMatch(/backdrop-filter: blur\(var\(--space-5\)\) saturate\(1\.6\)/);
    expect(base).toContain("-webkit-backdrop-filter");
    expect(base).toContain("border: 1px solid var(--pilula-borda)");
    expect(cssHeader).toMatch(/\[data-anim~="header-link"\] \{\s*color: var\(--color-text\)/); // texto escuro sobre o vidro claro
    const topo = 'html[data-js]:not([data-js-falhou]) [data-section="header"]:not([data-estado="rolado"])';
    for (const r of ["header-pilula", "header-logo", "header-menu"]) expect(cssHeader, r).toContain(`${topo} [data-anim~="${r}"]`);
  });

  it("a gaveta nunca usa display:none (fechada = translateX + visibility hidden) e o fundo escurecido usa o token de overlay", () => {
    expect(cssHeader).not.toMatch(/display:\s*none/);
    expect(cssHeader).toMatch(/\[data-anim~="painel"\]:not\(\[data-estado="aberto"\]\)\s*\{[^}]*translateX\(100%\)[^}]*visibility: hidden/);
    expect(cssHeader).toContain("background-color: var(--color-overlay)");
  });
});

describe("stage.css: exceção documentada do stage do S03 (slide do usuário, 16/11/2026)", () => {
  const bruto = ler("src/app/stage.css");
  const cssStage = semComentarios(bruto);

  it("declara a exceção, é importado pelo layout e cobre todas as receitas stage-*", () => {
    expect(bruto).toMatch(/EXCEÇÃO DOCUMENTADA/);
    expect(ler("src/app/layout.tsx")).toContain('import "./stage.css"');
    for (const r of ["stage-passos","stage-passo","stage-passo-rotulo","stage-anel","stage-anel-fill","stage-copias","stage-copia","stage-visual","stage-faq","stage-faq-icone","stage-modal"]) expect(cssStage, r).toContain(`[data-anim~="${r}"]`);
  });

  it("todo seletor é por [data-anim] (nunca por classe-nome); durações e curvas só de tokens", () => {
    const seletores = [...cssStage.replace(/@media[^{]*\{/g, "").replace(/@starting-style\s*\{/g, "").matchAll(/(^|\})\s*([^{}]+)\{/g)].map((m) => m[2].trim()).filter((s) => !s.startsWith(":root"));
    expect(seletores.length).toBeGreaterThan(15);
    for (const s of seletores) {
      expect(s, s).toContain('[data-anim~="');
      expect(s, s).not.toMatch(/(^|[\s>+~,])\.[a-z]/);
    }
    const literal = [...cssStage.matchAll(/(?:transition|animation)[a-z-]*:[^;]*\b\d+(?:\.\d+)?m?s\b[^;]*;/g)];
    expect(literal.map((m) => m[0])).toEqual([]);
    expect(cssStage).not.toMatch(/cubic-bezier\(|will-change|scroll-snap/);
  });

  it("sem cor literal; a cópia inativa só some por opacity (nunca display:none nem visibility:hidden)", () => {
    expect(cssStage).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
    const inativa = cssStage.match(/\[data-anim~="stage-copia"\]\[data-estado="inativa"\]\s*\{([^}]*)\}/)![1];
    expect(inativa).toContain("opacity: 0");
    expect(inativa).not.toMatch(/display:\s*none|visibility:\s*hidden/);
    expect(cssStage).not.toMatch(/visibility:\s*hidden/);
  });

  it("sem JS: pílula escondida e cópias empilhadas (flex); com JS pronto: pílula visível e cópias na mesma célula", () => {
    expect(cssStage).toMatch(/\[data-anim~="stage-passos"\] \{\s*display: none;/);
    expect(cssStage).toMatch(/html\[data-js\]:not\(\[data-js-falhou\]\) \[data-anim~="stage-copias"\] \{\s*display: grid;/);
    expect(cssStage).toMatch(/\[data-anim~="stage-copias"\] \{\s*display: flex;\s*flex-direction: column;/);
  });
});

describe("carrossel.css: exceção documentada do carrossel de depoimentos (slide do usuário, 16/11/2026)", () => {
  const bruto = ler("src/app/carrossel.css");
  const cssCarrossel = semComentarios(bruto);

  it("declara a exceção, é importado pelo layout e cobre todas as receitas carrossel-*", () => {
    expect(bruto).toMatch(/EXCEÇÃO DOCUMENTADA/);
    expect(ler("src/app/layout.tsx")).toContain('import "./carrossel.css"');
    for (const r of ["carrossel-faixa", "carrossel-slide", "carrossel-navegacao", "carrossel-segmento", "carrossel-progresso"]) expect(cssCarrossel, r).toContain(`[data-anim~="${r}"]`);
  });

  it("todo seletor é por [data-anim]; durações e curvas só de tokens; sem cor literal nem will-change", () => {
    const seletores = [...cssCarrossel.replace(/@media[^{]*\{/g, "").matchAll(/(^|\})\s*([^{}]+)\{/g)].map((m) => m[2].trim()).filter((s) => !s.startsWith(":root"));
    expect(seletores.length).toBeGreaterThan(8);
    for (const s of seletores) {
      expect(s, s).toContain('[data-anim~="');
      expect(s, s).not.toMatch(/(^|[\s>+~,])\.[a-z]/);
    }
    expect([...cssCarrossel.matchAll(/(?:transition|animation)[a-z-]*:[^;]*\b\d+(?:\.\d+)?m?s\b[^;]*;/g)].map((m) => m[0])).toEqual([]);
    expect(cssCarrossel).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|cubic-bezier\(|will-change|scroll-snap/);
  });

  it("sem JS: faixa em coluna e barra escondida; com JS pronto: faixa em linha deslocada por transform (--carrossel-pos) e barra visível", () => {
    expect(cssCarrossel).toMatch(/\[data-anim~="carrossel-faixa"\] \{\s*display: flex;\s*flex-direction: column;/);
    expect(cssCarrossel).toMatch(/html\[data-js\]:not\(\[data-js-falhou\]\) \[data-anim~="carrossel-faixa"\] \{\s*flex-direction: row;[^}]*translateX\(calc\(var\(--carrossel-pos, 0\)/);
    expect(cssCarrossel).toMatch(/\[data-anim~="carrossel-navegacao"\] \{\s*display: none;/);
    expect(cssCarrossel).toMatch(/\[data-estado="salto"\] \{\s*transition: none;/);
  });
});

describe("chat.css: chat de vidro sobre o vídeo (prompt do usuário, 17/11/2026)", () => {
  const bruto = ler("src/app/chat.css");
  const cssChat = semComentarios(bruto);
  const bloco = (seletor: string) => cssChat.match(new RegExp(seletor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}"))?.[1] ?? "";

  it("declara a exceção e é importado pelo layout; todo seletor é por [data-anim]", () => {
    expect(bruto).toMatch(/EXCEÇÃO DOCUMENTADA/);
    expect(ler("src/app/layout.tsx")).toContain('import "./chat.css"');
    const seletores = [...cssChat.replace(/@media[^{]*\{/g, "").replace(/@keyframes[^{]*\{/g, "").matchAll(/(^|\})\s*([^{}]+)\{/g)].map((m) => m[2].trim()).filter((s) => !s.startsWith(":root") && !/^(from|to)$/.test(s));
    expect(seletores.length).toBeGreaterThan(8);
    for (const s of seletores) {
      expect(s, s).toContain('[data-anim~="');
      expect(s, s).not.toMatch(/(^|[\s>+~,])\.[a-z]/);
    }
  });

  it("contêiner: absolute, right 2rem, bottom 5rem, width 22rem, max-width 64%, z-index 3, pointer-events none, flex column, gap .625rem", () => {
    const b = bloco('[data-anim~="chat"]');
    for (const d of ["position: absolute", "right: 2rem", "bottom: 5rem", "width: 22rem", "max-width: 64%", "z-index: 3", "pointer-events: none", "display: flex", "flex-direction: column", "gap: 0.625rem"]) expect(b, d).toContain(d);
  });

  it("bolhas escuras: rgba(20,18,16,.42), borda 1px rgba(255,255,255,.16), blur(20px) saturate(1.3) com e sem prefixo; bolhas do usuário sólidas #fff, SEM blur, sombra 0 10px 30px -10px rgba(0,0,0,.35)", () => {
    expect(cssChat).toContain("--chat-vidro: rgba(20, 18, 16, 0.42)");
    expect(cssChat).toContain("--chat-borda: rgba(255, 255, 255, 0.16)");
    const vidro = bloco('[data-anim~="chat-vidro"]');
    expect(vidro).toContain("border: 1px solid var(--chat-borda)");
    expect(vidro).toContain("-webkit-backdrop-filter: blur(20px) saturate(1.3)");
    expect(vidro).toMatch(/(^|\s)backdrop-filter: blur\(20px\) saturate\(1\.3\)/);
    const usuario = bloco('[data-anim~="chat-usuario"]');
    expect(usuario).not.toMatch(/blur|backdrop/);
    expect(cssChat).toContain("--chat-branco: #fff");
    expect(cssChat).toContain("--chat-sombra-usuario: 0 10px 30px -10px rgba(0, 0, 0, 0.35)");
    expect(bloco('[data-anim~="chat-video"]')).toContain("filter: brightness(0.86)");
  });

  it("mensagens ocultas = display:none (nunca opacity:0); visível liga o display e dispara o pop .55s cubic-bezier(.22,1,.36,1) both", () => {
    expect(bloco('[data-anim~="chat-mensagem"]')).toContain("display: none");
    expect(bloco('[data-anim~="chat-mensagem"]')).not.toContain("opacity");
    const visivel = bloco('[data-anim~="chat-mensagem"][data-estado="visivel"]');
    expect(visivel).toContain("display: flex");
    expect(visivel).toContain("animation: chat-pop var(--chat-pop-duracao) var(--chat-pop-curva) both");
    expect(cssChat).toContain("--chat-pop-duracao: 0.55s");
    expect(cssChat).toContain("--chat-pop-curva: cubic-bezier(0.22, 1, 0.36, 1)");
    const pop = cssChat.match(/@keyframes chat-pop\s*\{([\s\S]*?\})\s*\}/)![1];
    expect(pop).toMatch(/from\s*\{\s*opacity: 0;\s*transform: translateY\(0\.5rem\);\s*filter: blur\(6px\);/);
    expect(pop).toMatch(/to\s*\{\s*opacity: 1;\s*transform: none;\s*filter: none;/);
  });

  it("palavras: opacity 0→1 em .25s; \"digitando\": 3 pontos que pulam (0,6 s alternando, infinito, só opacity/transform); reduced-motion sem animação", () => {
    expect(bloco('[data-anim~="chat-palavra"]')).toMatch(/opacity: 0;[\s\S]*transition: opacity 0\.25s/);
    expect(bloco('[data-anim~="chat-palavra"][data-estado="ativa"]')).toContain("opacity: 1");
    expect(bloco('[data-anim~="chat-ponto"]')).toContain("animation: chat-ponto 0.6s ease-in-out infinite alternate");
    const quadros = cssChat.match(/@keyframes chat-ponto\s*\{([\s\S]*?\})\s*\}/)![1];
    expect([...quadros.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]).every((p) => ["opacity", "transform"].includes(p))).toBe(true);
    expect(cssChat).toMatch(/prefers-reduced-motion: reduce\) \{[\s\S]*animation: none/);
  });
});
