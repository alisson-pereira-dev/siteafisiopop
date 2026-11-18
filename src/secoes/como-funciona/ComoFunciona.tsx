/**
 * Seção S07 · como-funciona (estrutura "How it works" da Superpower)
 * Ficha: docs/sections/fichas/como-funciona.md (S07; revisão de 16/11/2026) · Conteúdo: content.json → secoes.como_funciona
 * (titulo, subtitulo, passos[] {numero, titulo, descricao, imagem}, cta)
 * Elementos: como-funciona__cabecalho, __titulo, __subtitulo, __grade, __passo (ComoFuncionaPasso), __cta
 * Cabeçalho centralizado e os passos em 4 colunas (2 no tablet, 1 no mobile; gap de .5rem, como o wireframe), cada um com mídia no topo; 1 CTA principal depois da grade.
 */
import { conteudo } from "@/lib/conteudo";
import { UiContainer } from "@/ui/UiContainer";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { ComoFuncionaPasso } from "./ComoFuncionaPasso";

export function ComoFunciona() {
  const secao = conteudo.secoes.como_funciona;

  return (
    <UiSecao id="como-funciona" bloco="como-funciona" ficha="S07" conteudo="secoes.como_funciona" labelledby="como-funciona__titulo" anim="pilha-topo">
      <UiContainer classes="flex flex-col gap-7">
        <div className="como-funciona__cabecalho mx-auto flex max-w-measure flex-col items-center gap-3 text-center" data-anim="reveal">
          <UiTitulo nivel="h2" id="como-funciona__titulo" className="como-funciona__titulo">
            {secao.titulo}
          </UiTitulo>
          <p className="como-funciona__subtitulo text-body-lg text-muted">{secao.subtitulo}</p>
        </div>
        <ol className="como-funciona__grade grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {secao.passos.map((passo) => (
            <ComoFuncionaPasso key={passo.numero} numero={passo.numero} titulo={passo.titulo} descricao={passo.descricao} imagem={passo.imagem} />
          ))}
        </ol>
        <UiCtaPrincipal local="como-funciona" className="como-funciona__cta mx-auto" cheio="mobile" />
      </UiContainer>
    </UiSecao>
  );
}
