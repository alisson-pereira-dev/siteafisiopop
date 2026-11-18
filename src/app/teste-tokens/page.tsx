/**
 * Página interna · teste-tokens (T1.1) · rota /teste-tokens
 * Ficha: n/a (não é seção do site; fica fora do mapa e com noindex) · Conteúdo: rótulos de verificação, não são texto do site
 * Elementos: teste-tokens__cabecalho, __titulo, __intro, __secao, __secao-titulo, __escala, __escala-linha,
 *   __escala-nome, __escala-amostra, __escala-valor, __destaque, __paleta, __grupo, __grupo-titulo, __swatches,
 *   __swatch, __swatch-cor, __swatch-nome, __swatch-hex, __pares, __par, __par-amostra, __par-nome,
 *   __par-tokens, __par-razao, __par-status
 * Serve para conferir a escala tipográfica, a paleta e os pares de contraste contra docs/design-system.md.
 * dados.test.ts (npm test) faz a mesma conferência de forma automática.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { conteudo } from "@/lib/conteudo";
import { renderizarDestaque } from "@/lib/destaque";
import {
  ESCALA,
  MINIMO,
  PALETA,
  PARES,
  PAR_PROIBIDO,
  razaoContraste,
  tokens,
  type ParContraste,
} from "./dados";

export const metadata: Metadata = {
  title: "Teste de tokens · A.FISIO POP",
  robots: { index: false, follow: false },
};

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

function avaliar(par: ParContraste) {
  const calculada = razaoContraste(tokens[par.frente], tokens[par.fundo]);
  const bateComDoc = Math.abs(calculada - par.doc) <= 0.011;
  if (par.tipo === "proibido") {
    const reprova = calculada < MINIMO.texto;
    return { calculada, bateComDoc, ok: reprova, rotulo: reprova ? "Reprova, uso proibido (correto)" : "Passou: revisar a regra" };
  }
  const minimo = MINIMO[par.tipo];
  const passa = calculada >= minimo;
  return { calculada, bateComDoc, ok: passa, rotulo: passa ? `Passa AA (mín. ${fmt(minimo)}:1)` : `Reprova (mín. ${fmt(minimo)}:1)` };
}

function Par({ par }: { par: ParContraste }) {
  const { calculada, bateComDoc, ok, rotulo } = avaliar(par);
  const grande = par.tipo === "texto-grande";
  return (
    <li
      className="teste-tokens__par flex flex-col gap-3 rounded-md border border-border bg-surface p-4 md:flex-row md:items-center"
      data-item={par.frente.replace("--color-", "") + "-sobre-" + par.fundo.replace("--color-", "")}
    >
      <p
        className={
          grande
            ? "teste-tokens__par-amostra rounded-sm p-4 font-serif text-h2 italic md:w-1/4"
            : "teste-tokens__par-amostra rounded-sm p-4 text-body font-strong md:w-1/4"
        }
        style={{ color: `var(${par.frente})`, backgroundColor: `var(${par.fundo})` }}
      >
        {grande ? "Aa caro" : "Aa Texto de exemplo"}
      </p>
      <div className="teste-tokens__par-nome flex-1">
        <p className="font-strong text-body">{par.nome}</p>
        <p className="teste-tokens__par-tokens text-small text-subtle">
          {par.frente} ({tokens[par.frente]}) sobre {par.fundo} ({tokens[par.fundo]})
        </p>
      </div>
      <p className="teste-tokens__par-razao text-small text-muted md:text-right">
        Calculado {fmt(calculada)}:1 · Doc {fmt(par.doc)}:1
        <br />
        {bateComDoc ? "Bate com o doc" : "NÃO bate com o doc"}
      </p>
      <p
        className={
          ok
            ? "teste-tokens__par-status rounded-full bg-success-bg px-4 py-2 text-small font-strong text-success"
            : "teste-tokens__par-status rounded-full bg-danger-bg px-4 py-2 text-small font-strong text-danger"
        }
      >
        {ok ? "✓ " : "✗ "}
        {rotulo}
      </p>
    </li>
  );
}

export default function TesteTokens() {
  // T5.5: página interna. Em produção (build e `next start`) responde 404; segue disponível em `next dev`.
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div
      id="teste-tokens"
      className="teste-tokens mx-auto flex max-w-container flex-col gap-8 px-pad py-section"
      data-section="teste-tokens"
    >
      <header className="teste-tokens__cabecalho flex flex-col gap-3">
        <h1 className="teste-tokens__titulo text-h1">
          {renderizarDestaque(`Tokens do **${conteudo.site.nome}**`)}
        </h1>
        <p className="teste-tokens__intro max-w-measure text-body-lg text-muted">
          Página interna de verificação (T1.1). Valores lidos de styles/design-tokens.css e
          comparados com docs/design-system.md. Não faz parte do site e não é indexada.
        </p>
      </header>

      <section className="teste-tokens__secao flex flex-col gap-5" aria-labelledby="teste-tokens__escala-titulo">
        <h2 id="teste-tokens__escala-titulo" className="teste-tokens__secao-titulo text-h2">
          Escala tipográfica
        </h2>
        <ul className="teste-tokens__escala flex flex-col gap-4">
          {ESCALA.map((d) => (
            <li
              key={d.nome}
              className="teste-tokens__escala-linha flex flex-col gap-2 border-b border-border pb-4"
              data-item={d.nome}
            >
              <p className="teste-tokens__escala-nome text-small text-subtle">
                {d.nome} · {d.uso}
              </p>
              <p className={`teste-tokens__escala-amostra ${d.classe}`}>{conteudo.site.slogan}</p>
              <p className="teste-tokens__escala-valor text-micro text-subtle">
                {d.token}: {tokens[d.token]}
              </p>
            </li>
          ))}
        </ul>
        <div className="teste-tokens__destaque flex flex-col gap-2 rounded-lg bg-bg-alt p-5">
          <p className="text-small text-subtle">
            Destaque serifado (Instrument Serif itálico, brand-pink, só ≥ 32px): vem de **palavra** no content.json
          </p>
          <p className="text-display font-title">{renderizarDestaque(conteudo.secoes.hero.headline)}</p>
        </div>
      </section>

      <section className="teste-tokens__secao flex flex-col gap-5" aria-labelledby="teste-tokens__paleta-titulo">
        <h2 id="teste-tokens__paleta-titulo" className="teste-tokens__secao-titulo text-h2">
          Paleta
        </h2>
        <div className="teste-tokens__paleta flex flex-col gap-6">
          {PALETA.map((g) => (
            <div key={g.grupo} className="teste-tokens__grupo flex flex-col gap-3" data-item={g.grupo}>
              <h3 className="teste-tokens__grupo-titulo text-h3">{g.grupo}</h3>
              <ul className="teste-tokens__swatches grid grid-cols-2 gap-4 md:grid-cols-4">
                {g.itens.map((s) => (
                  <li key={s.token} className="teste-tokens__swatch flex flex-col gap-2" data-item={s.token}>
                    <span
                      className={`teste-tokens__swatch-cor block aspect-wide rounded-md border border-border-strong ${s.classe}`}
                      aria-hidden="true"
                    />
                    <span className="teste-tokens__swatch-nome text-small font-strong">{s.token.replace("--color-", "")}</span>
                    <span className="teste-tokens__swatch-hex text-micro text-subtle">{tokens[s.token]} · {s.classe}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="teste-tokens__secao flex flex-col gap-5" aria-labelledby="teste-tokens__pares-titulo">
        <h2 id="teste-tokens__pares-titulo" className="teste-tokens__secao-titulo text-h2">
          Pares de contraste (WCAG AA)
        </h2>
        <ul className="teste-tokens__pares flex flex-col gap-3">
          {PARES.map((p) => (
            <Par key={p.nome} par={p} />
          ))}
        </ul>
        <h3 className="text-h3">Combinação proibida</h3>
        <ul className="teste-tokens__pares flex flex-col gap-3">
          <Par par={PAR_PROIBIDO} />
        </ul>
      </section>
    </div>
  );
}
