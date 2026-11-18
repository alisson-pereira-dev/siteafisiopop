/**
 * Seção S06 · servicos
 * Ficha: docs/sections/fichas/servicos.md (S06) · Conteúdo: content.json → secoes.servicos (titulo, subtitulo, itens,
 * mensagem_servico; itens[].link_texto)
 * Elementos: servicos__cabecalho, __titulo, __subtitulo, __grade, __card (ServicosCard)
 * Fundo bg-bg-alt, cards bg-surface. 1 coluna (mobile), 2 (≥768), 3 (≥1024); o 7º card ocupa a linha inteira.
 * Sem CTA principal aqui (só o link contextual de cada card). Título com **R$ 49,99** em destaque serifado.
 */
import { conteudo } from "@/lib/conteudo";
import { UiContainer } from "@/ui/UiContainer";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { ServicosCard } from "./ServicosCard";

export function Servicos() {
  const secao = conteudo.secoes.servicos;

  return (
    <UiSecao id="servicos" bloco="servicos" ficha="S06" conteudo="secoes.servicos" labelledby="servicos__titulo">
      <UiContainer classes="flex flex-col items-center gap-7">
        <div className="servicos__cabecalho mx-auto flex max-w-measure flex-col items-center gap-3 text-center" data-anim="reveal">
          <UiTitulo nivel="h2" id="servicos__titulo" className="servicos__titulo">
            {secao.titulo}
          </UiTitulo>
          <p className="servicos__subtitulo text-body-lg text-muted">{secao.subtitulo}</p>
        </div>
        <ul className="servicos__grade flex w-full flex-col md:max-w-container">
          {secao.itens.map((item) => (
            <ServicosCard
              key={item.nome}
              nome={item.nome}
              descricao={item.descricao}
              textoLink={item.link_texto}
            />
          ))}
        </ul>
      </UiContainer>
    </UiSecao>
  );
}
