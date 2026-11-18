/**
 * Página global · pagina-legal (/privacidade e /termos) — RASCUNHO TÉCNICO
 * Ficha: docs/tasks.md T5.1 (sem ficha própria; fora das 13 seções) · Conteúdo: content.json → paginas.privacidade | paginas.termos
 * (faixa_rascunho, rascunho_data, titulo, intro, blocos[] {titulo, paragrafos, itens}, voltar)
 * Elementos: pagina-legal (raiz), __faixa-rascunho, __conteudo, __cabecalho, __titulo, __data, __intro, __bloco, __bloco-titulo,
 * __paragrafo, __lista, __lista-item, __voltar
 * N0: nenhum data-anim. A faixa "Rascunho técnico: precisa de revisão jurídica (LGPD)" é sempre visível. Este texto NÃO afirma
 * conformidade legal e bloqueia o lançamento (check-pendencias: `paginas.privacidade`/`paginas.termos`). `noindex` está na rota.
 * Lista vazia não renderiza. Nenhum CTA principal aqui: o WhatsApp está na barra/flutuante do layout.
 */
import { conteudo } from "@/lib/conteudo";
import { UiBotao } from "@/ui/UiBotao";
import { UiContainer } from "@/ui/UiContainer";
import { UiTitulo } from "@/ui/UiTitulo";

export type ChavePaginaLegal = "privacidade" | "termos";

type Props = { chave: ChavePaginaLegal };

export function PaginaLegal({ chave }: Props) {
  const pagina = conteudo.paginas[chave];
  const idTitulo = `pagina-legal-titulo-${chave}`;

  return (
    <article className="pagina-legal bg-bg" data-section="pagina-legal" data-conteudo={`paginas.${chave}`} aria-labelledby={idTitulo}>
      <p className="pagina-legal__faixa-rascunho bg-warning-bg px-pad py-3 text-center text-small font-strong text-warning">
        {pagina.faixa_rascunho}
      </p>
      <UiContainer className="pagina-legal__conteudo" classes="flex flex-col gap-7 py-section">
        <header className="pagina-legal__cabecalho flex max-w-measure flex-col gap-3">
          <UiTitulo nivel="h1" id={idTitulo} className="pagina-legal__titulo">
            {pagina.titulo}
          </UiTitulo>
          <p className="pagina-legal__data text-small text-muted">{pagina.rascunho_data}</p>
          <p className="pagina-legal__intro text-body text-foreground">{pagina.intro}</p>
        </header>
        {pagina.blocos.map((bloco) => (
          <div key={bloco.titulo} className="pagina-legal__bloco flex max-w-measure flex-col gap-3">
            <h2 className="pagina-legal__bloco-titulo font-title text-h3 font-heading text-foreground">{bloco.titulo}</h2>
            {bloco.paragrafos.map((texto) => (
              <p key={texto} className="pagina-legal__paragrafo text-body text-foreground">
                {texto}
              </p>
            ))}
            {bloco.itens.length > 0 ? (
              <ul className="pagina-legal__lista flex list-disc flex-col gap-2 pl-5 text-body text-foreground">
                {bloco.itens.map((item) => (
                  <li key={item} className="pagina-legal__lista-item">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
        <UiBotao href="/" variante="secundario" cheio="mobile" className="pagina-legal__voltar self-start">
          {pagina.voltar}
        </UiBotao>
      </UiContainer>
    </article>
  );
}
