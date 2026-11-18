/**
 * Seção S17 · unidades
 * Ficha: docs/sections/fichas/unidades.md (S17) · Conteúdo: content.json → secoes.unidades (titulo, texto, mapa_rotulo, itens, cta)
 * Elementos: unidades__cabecalho, __titulo, __texto, __lista, __card (UnidadesCard), __cta
 * Fundo bg-bg, cards bg-surface com borda. 1 coluna (mobile); 768–1023 card em 2 colunas internas; ≥1024 3 colunas de altura
 * igual. Sobreposição (18/11/2026): a seção sobe POR CIMA dos depoimentos ao rolar (pilha-topo; UiPilha no page.tsx) e os cards entram vindo de
 * CIMA (data-anim "stagger-item desce"). Um CTA principal depois da lista; nenhum CTA por unidade (reservado) e nenhum iframe no carregamento.
 */
import { conteudo } from "@/lib/conteudo";
import { UiContainer } from "@/ui/UiContainer";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { UnidadesCard, type Unidade } from "./UnidadesCard";

export function Unidades() {
  const secao = conteudo.secoes.unidades;
  const itens: readonly Unidade[] = secao.itens;

  return (
    <UiSecao id="unidades" bloco="unidades" ficha="S17" conteudo="secoes.unidades" labelledby="unidades__titulo" anim="pilha-topo">
      <UiContainer classes="flex flex-col gap-7">
        <div className="unidades__cabecalho mx-auto flex max-w-measure flex-col items-center gap-3 text-center" data-anim="reveal">
          <UiTitulo nivel="h2" id="unidades__titulo" className="unidades__titulo">
            {secao.titulo}
          </UiTitulo>
          <p className="unidades__texto text-body-lg text-muted">{secao.texto}</p>
        </div>
        <ul className="unidades__lista grid gap-4 md:gap-5 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {itens.map((unidade) => (
            <UnidadesCard key={unidade.local} unidade={unidade} mapaRotulo={secao.mapa_rotulo} />
          ))}
        </ul>
        <UiCtaPrincipal local="unidades" className="unidades__cta lg:mx-auto" cheio="mobile" />
      </UiContainer>
    </UiSecao>
  );
}
