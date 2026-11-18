/**
 * Testes [auto] · T5 (sistema e SEO): /privacidade, /termos, 404, robots, sitemap, JSON-LD, metadados e /teste-tokens em produção
 * Ficha: docs/tasks.md T5.1–T5.5 · Conteúdo: content.json → paginas.*, microcopy.pagina_404, seo.home
 * Marcação via renderToStaticMarkup (sem JSDOM). Largura e navegador: [manual] (registrados no estado).
 */
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { conteudo } from "@/lib/conteudo";
import { jsonLd, schemaLocalBusiness } from "@/lib/schema";
import { urlDoSite } from "@/lib/site-url";
import { Footer } from "@/secoes/footer/Footer";
import { contar, renderizar, tagsCom, valorDe } from "@/test/render";
import NotFound from "./not-found";
import Privacidade, { metadata as metaPrivacidade } from "./privacidade/page";
import robots from "./robots";
import sitemap from "./sitemap";
import TesteTokens from "./teste-tokens/page";
import Termos, { metadata as metaTermos } from "./termos/page";

const raiz = path.resolve(__dirname, "..", "..");
const fonte = (relativo: string) => fs.readFileSync(path.join(raiz, relativo), "utf8");
const textoDe = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ");

afterEach(() => vi.unstubAllEnvs());

describe("T5.1 · /privacidade e /termos (rascunho técnico)", () => {
  const paginas = [
    { chave: "privacidade", pagina: <Privacidade />, meta: metaPrivacidade },
    { chave: "termos", pagina: <Termos />, meta: metaTermos },
  ] as const;

  for (const { chave, pagina, meta } of paginas) {
    const c = conteudo.paginas[chave];
    const html = renderizar(pagina);

    it(`${chave}: faixa "revisão jurídica (LGPD)" visível, h1 único e raiz com data-*`, () => {
      expect(textoDe(html)).toContain(c.faixa_rascunho);
      expect(c.faixa_rascunho).toMatch(/revisão jurídica \(LGPD\)/);
      expect(contar(html, "<h1")).toBe(1);
      const [raizTag] = tagsCom(html, "pagina-legal ");
      expect(valorDe(raizTag, "data-section")).toBe("pagina-legal");
      expect(valorDe(raizTag, "data-conteudo")).toBe(`paginas.${chave}`);
      expect(html).toContain(`id="pagina-legal-titulo-${chave}"`);
    });

    it(`${chave}: noindex e título/descrição vêm do content.json`, () => {
      expect(meta.robots).toEqual({ index: false, follow: false });
      expect(meta.title).toBe(c.seo.titulo);
      expect(meta.description).toBe(c.seo.descricao);
    });

    it(`${chave}: todo bloco aparece; lista vazia não renderiza; sem CTA principal, sem data-anim`, () => {
      expect(contar(html, "pagina-legal__bloco ")).toBe(c.blocos.length);
      expect(contar(html, "pagina-legal__lista ")).toBe(c.blocos.filter((b) => b.itens.length > 0).length);
      expect(html).not.toContain('data-cta="principal"');
      expect([...html.matchAll(/data-anim="([^"]*)"/g)].map((m) => m[1])).toEqual(["botao"]); // só o botão "Voltar"; nada de reveal
      expect(valorDe(tagsCom(html, "pagina-legal__voltar")[0], "href")).toBe("/");
    });

    it(`${chave}: marcado validar+provisorio e NÃO afirma conformidade legal`, () => {
      expect(c).toMatchObject({ validar: true, provisorio: true });
      const texto = textoDe(html).toLowerCase();
      expect(texto).not.toMatch(
        /em conformidade|estamos conformes|totalmente conforme|100% seguro|garantimos|compatível com a lgpd|de acordo com a lgpd/,
      );
    });

    it(`${chave}: cada texto da página vem do content.json (nenhum texto fixo no componente)`, () => {
      const trechos = [c.titulo.replaceAll("**", ""), c.intro, c.rascunho_data, c.voltar, ...c.blocos.flatMap((b) => [b.titulo, ...b.paragrafos, ...b.itens])];
      const texto = textoDe(html);
      for (const t of trechos) expect(texto).toContain(t);
      // o que sobra depois de tirar o conteúdo e a faixa são só espaços
      let resto = texto.replace(c.faixa_rascunho, "");
      for (const t of trechos) resto = resto.replace(t, "");
      expect(resto.trim()).toBe("");
    });
  }

  it("o conteúdo só afirma fatos do site: sem formulário, sem cookies não essenciais, WhatsApp e Instagram", () => {
    const priv = JSON.stringify(conteudo.paginas.privacidade);
    expect(priv).toMatch(/não tem formulário, cadastro nem login/);
    expect(priv).toMatch(/não usa cookies de publicidade, pixel nem ferramentas de análise/);
    expect(priv).toMatch(/WhatsApp/);
    expect(priv).toMatch(/Instagram/);
  });

  it("os links legais do footer apontam para rotas que existem", () => {
    const html = renderizar(<Footer />);
    const hrefs = tagsCom(html, "footer__link").map((t) => valorDe(t, "href"));
    for (const destino of conteudo.secoes.footer.links_legais.map((l) => l.destino)) {
      expect(hrefs).toContain(destino);
      expect(fs.existsSync(path.join(raiz, "src", "app", destino.slice(1), "page.tsx"))).toBe(true);
    }
  });

  it("âncoras do footer passam pela home (`/#faq`): em subpáginas levam de volta à home", () => {
    const html = renderizar(<Footer />);
    const hrefs = tagsCom(html, "footer__link").map((t) => valorDe(t, "href"));
    expect(hrefs.some((h) => h?.startsWith("#"))).toBe(false);
    expect(hrefs).toContain("/#faq");
  });
});

describe("T5.3 · página 404", () => {
  const html = renderizar(<NotFound />);
  const c = conteudo.microcopy.pagina_404;

  it("título, texto e botão vêm do content.json; botão secundário para a home", () => {
    expect(contar(html, "<h1")).toBe(1);
    expect(html).toContain(c.titulo);
    expect(html).toContain(c.texto);
    const [botao] = tagsCom(html, "pagina-404__cta");
    expect(valorDe(botao, "href")).toBe(c.cta.destino);
    expect(valorDe(botao, "class")).toContain("ui-botao--secundario");
    expect(html).toContain(`>${c.cta.texto}</a>`);
  });

  it("não cria segundo CTA principal nem link de WhatsApp", () => {
    expect(html).not.toContain('data-cta="principal"');
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("ui-botao--primario");
  });
});

describe("T5.4 · SEO", () => {
  it("urlDoSite: só http(s) válido; vazio ou inválido = sem URL (nada de endereço falso)", () => {
    expect(urlDoSite("")).toBeUndefined();
    expect(urlDoSite(undefined)).toBeUndefined();
    expect(urlDoSite("   ")).toBeUndefined();
    expect(urlDoSite("não é url")).toBeUndefined();
    expect(urlDoSite("ftp://exemplo.com")).toBeUndefined();
    expect(urlDoSite("https://exemplo.com")?.origin).toBe("https://exemplo.com");
  });

  it("sem SITE_URL: robots libera a home e não declara sitemap; sitemap sai vazio", () => {
    vi.stubEnv("SITE_URL", "");
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBeUndefined();
    expect(sitemap()).toEqual([]);
  });

  it("com SITE_URL: robots aponta o sitemap e o sitemap lista só a home (rascunhos noindex ficam fora)", () => {
    vi.stubEnv("SITE_URL", "https://exemplo.com");
    expect(robots().sitemap).toBe("https://exemplo.com/sitemap.xml");
    expect(sitemap()).toEqual([{ url: "https://exemplo.com/" }]);
  });

  it("robots não bloqueia /privacidade nem /termos (o robô precisa ler o noindex)", () => {
    const r = JSON.stringify(robots());
    expect(r).not.toMatch(/privacidade|termos|disallow/);
  });

  it("JSON-LD LocalBusiness usa só os campos de seo.home.schema.campos, sem endereço, telefone ou horário", () => {
    vi.stubEnv("SITE_URL", "");
    const s = schemaLocalBusiness();
    expect(s["@type"]).toBe("LocalBusiness");
    const { campos } = conteudo.seo.home.schema;
    expect(s).toMatchObject({ name: campos.name, description: campos.description, sameAs: campos.sameAs, areaServed: campos.areaServed });
    expect(Object.keys(s).sort()).toEqual(["@context", "@type", "areaServed", "description", "name", "sameAs"]);
    for (const proibida of ["address", "telephone", "openingHours", "openingHoursSpecification", "url", "nota", "geo"]) expect(s).not.toHaveProperty(proibida);
    expect(JSON.stringify(s)).not.toContain("FAQPage");
  });

  it("JSON-LD ganha `url` só com SITE_URL, e o JSON nunca fecha a tag <script>", () => {
    expect(schemaLocalBusiness(new URL("https://exemplo.com"))).toHaveProperty("url", "https://exemplo.com/");
    expect(jsonLd({ a: "</script><b>" })).not.toContain("<");
  });

  it("layout: metadataBase/canonical só com domínio; Open Graph sem imagem enquanto og_imagem = pendente", () => {
    const layout = fonte("src/app/layout.tsx");
    expect(layout).toMatch(/baseDoSite \? \{ metadataBase: baseDoSite, alternates: \{ canonical: "\/" \} \} : \{\}/);
    expect(layout).toMatch(/ogImagem\.src !== "pendente" \? \{ images:/);
    expect(conteudo.seo.home.og_imagem.src).toBe("pendente");
    expect(layout).not.toMatch(/https?:\/\//); // nenhuma URL absoluta fixa
  });

  it("home emite o JSON-LD e nenhum FAQPage no código", () => {
    expect(fonte("src/app/page.tsx")).toContain("application/ld+json");
    for (const arquivo of ["src/app/page.tsx", "src/lib/schema.ts", "src/secoes/preco-pop/PrecoPop.tsx"]) expect(fonte(arquivo)).not.toMatch(/FAQPage"/);
  });
});

describe("T5.5 · /teste-tokens fora da produção", () => {
  it("em produção responde notFound()", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => TesteTokens()).toThrow();
  });

  it("fora da produção (next dev) a página renderiza", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(renderizar(<TesteTokens />)).toContain('data-section="teste-tokens"');
  });
});
