/**
 * Seção S12 · preco-pop — PrecoPopOferta (cartão da oferta, embaixo da lista "inclui", como a referência do usuário de 17/11/2026)
 * Ficha: docs/sections/fichas/preco-pop.md (revisão de 17/11/2026) · Conteúdo: content.json → secoes.preco_pop (oferta {faixa, titulo, subtitulo,
 * rotulo_servicos}, preco {valor, periodo}, etiqueta), secoes.servicos.itens[].nome (os serviços do preço único)
 * Elementos: preco-pop__oferta, __oferta-faixa, __oferta-cartao, __oferta-cabecalho, __oferta-descricao, __oferta-preco, __oferta-incluso, __oferta-titulo, __oferta-subtitulo, __oferta-valor, __oferta-periodo,
 * __oferta-servicos-rotulo, __oferta-servicos, __oferta-servico
 * Faixa escura no topo (a "chamada" da oferta) com o cartão claro dentro: título e subtítulo à esquerda, o R$ 49,99 GRANDE em rosa à direita
 * (o destaque), e a lista dos serviços incluídos. Só fatos do conteúdo: SEM preço riscado, desconto, prazo ou urgência (não há dado da clínica;
 * regra do projeto). Server, sem animação. O botão de WhatsApp vem logo abaixo (PrecoPop).
 */
import { conteudo } from "@/lib/conteudo";
import { UiIcone } from "@/ui/UiIcone";

export function PrecoPopOferta() {
  const secao = conteudo.secoes.preco_pop;
  const oferta = secao.oferta;
  const servicos = conteudo.secoes.servicos.itens;

  return (
    <div className="preco-pop__oferta flex flex-col gap-1 rounded-md bg-inverse p-1 text-on-inverse">
      <p className="preco-pop__oferta-faixa px-4 py-3 text-center text-small font-strong">{oferta.faixa}</p>
      <div className="preco-pop__oferta-cartao flex flex-col gap-4 rounded-md bg-surface p-5 text-foreground md:p-6">
        <div className="preco-pop__oferta-cabecalho flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="preco-pop__oferta-descricao flex max-w-measure flex-col gap-1">
            <h3 className="preco-pop__oferta-titulo font-title text-h3 font-heading">{oferta.titulo}</h3>
            <p className="preco-pop__oferta-subtitulo text-small text-muted">{oferta.subtitulo}</p>
          </div>
          <div className="preco-pop__oferta-preco flex flex-col items-start">
            <p className="preco-pop__oferta-valor whitespace-nowrap font-title text-h1 font-heading text-primary">{secao.preco.valor}</p>
            <p className="preco-pop__oferta-periodo text-small text-muted">{secao.preco.periodo}</p>
          </div>
        </div>
        <div className="preco-pop__oferta-incluso flex flex-col gap-3 border-t border-border pt-4">
          <p className="preco-pop__oferta-servicos-rotulo text-small font-strong text-muted">{oferta.rotulo_servicos}</p>
          <ul className="preco-pop__oferta-servicos grid gap-x-4 gap-y-2 md:grid-cols-2">
            {servicos.map((servico) => (
              <li key={servico.nome} className="preco-pop__oferta-servico flex items-center gap-2 text-body text-foreground">
                <UiIcone nome="check" tamanho={16} className="flex-none text-primary" />
                {servico.nome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
