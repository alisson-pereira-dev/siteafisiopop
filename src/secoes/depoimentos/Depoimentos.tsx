/**
 * Seção S10 · depoimentos (carrossel do slide "sp2-testimonials2")
 * Ficha: docs/sections/fichas/depoimentos.md (revisão de 16/11/2026) · Conteúdo: content.json → secoes.depoimentos (titulo, subtitulo,
 * itens[], rotulo_provisorio, provisorio) e microcopy.acessibilidade (pausar_depoimentos, retomar_depoimentos, ir_para_depoimento)
 * Fundo (17/11/2026): vidro fosco (glassmorphism): manchas de marca atrás (__fundo) e uma lâmina de vidro com desfoque por cima (__vidro).
 * Elementos: depoimentos__fundo, __vidro, depoimentos__cabecalho, __titulo, __subtitulo, __slider, __faixa, __slide, __navegacao, __card (DepoimentosCard)
 * Cabeçalho à esquerda (largura máx. do texto); o carrossel (client) sangra para os dois lados e a seção corta o excedente
 * (overflow-hidden). Os cards vêm do servidor, sem duplicar conteúdo.
 */
import { conteudo } from "@/lib/conteudo";
import { UiContainer } from "@/ui/UiContainer";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { DepoimentosCard } from "./DepoimentosCard";
import { DepoimentosCarrossel } from "./DepoimentosCarrossel";

export function Depoimentos() {
  const secao = conteudo.secoes.depoimentos;
  const acessibilidade = conteudo.microcopy.acessibilidade;

  return (
    <UiSecao
      id="depoimentos"
      bloco="depoimentos"
      ficha="S10"
      conteudo="secoes.depoimentos"
      labelledby="depoimentos__titulo"
      anim="pilha-base"
      className="isolate overflow-hidden"
    >
      <span className="depoimentos__fundo" data-anim="carrossel-fundo" aria-hidden="true" />
      <span className="depoimentos__vidro" data-anim="carrossel-vidro" aria-hidden="true" />
      <UiContainer classes="flex flex-col gap-7">
        <div className="depoimentos__cabecalho flex flex-col gap-3 md:max-w-measure" data-anim="reveal">
          <UiTitulo nivel="h2" id="depoimentos__titulo" className="depoimentos__titulo">
            {secao.titulo}
          </UiTitulo>
          <p className="depoimentos__subtitulo text-body-lg text-muted">{secao.subtitulo}</p>
        </div>
        <div className="depoimentos__carrossel flex flex-col">
          <DepoimentosCarrossel
            rotuloIrPara={acessibilidade.ir_para_depoimento}
            rotuloPausar={acessibilidade.pausar_depoimentos}
            rotuloRetomar={acessibilidade.retomar_depoimentos}
            cards={secao.itens.map((item) => (
              <DepoimentosCard
                key={item.citacao}
                citacao={item.citacao}
                autor={item.autor}
                contexto={item.contexto}
                link={"link" in item ? (item.link as string) : undefined}
                imagem={"imagem" in item ? item.imagem : undefined}
                provisorio={item.provisorio === true || secao.provisorio === true}
                rotuloProvisorio={secao.rotulo_provisorio}
              />
            ))}
          />
        </div>
      </UiContainer>
    </UiSecao>
  );
}
