/**
 * Seção S19 · cta-final (CTA final do wireframe da Superpower: faixa escura de largura total, texto à esquerda, 3 selos, 2 botões)
 * Ficha: docs/sections/fichas/cta-final.md (S19; revisão de 16/11/2026) · Conteúdo: content.json → secoes.cta_final
 * (headline, subtexto, selos[], cta, cta_secundario)
 * Elementos: cta-final__conteudo, __titulo, __subtexto, __selos, __selo, __acoes, __cta, __cta-secundario
 * A foto full-bleed da referência é mídia pendente: aqui a faixa é `bg-inverse` e o rodapé (cartão claro) vem logo embaixo, no mesmo
 * fundo escuro. Os 3 selos repetem fatos de preco_pop.inclui (nada novo). O botão secundário é o link "Ver serviços"
 * (ctas.secundario), contorno claro: NÃO é um segundo CTA principal (data-cta só no principal).
 */
import { conteudo } from "@/lib/conteudo";
import { resolverCta } from "@/lib/cta";
import { UiBotao } from "@/ui/UiBotao";
import { UiContainer } from "@/ui/UiContainer";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { UiIcone } from "@/ui/UiIcone";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";

export function CtaFinal() {
  const secao = conteudo.secoes.cta_final;
  const secundario = resolverCta(secao.cta_secundario);

  return (
    <UiSecao id="agendar" bloco="cta-final" ficha="S19" conteudo="secoes.cta_final" labelledby="cta-final__titulo" tom="inverse" className="md:flex md:min-h-[var(--altura-hero-midia)] md:items-center">
      <UiContainer classes="w-full">
        <div className="cta-final__conteudo flex flex-col items-start gap-5 md:max-w-measure">
          <UiTitulo nivel="h2" tamanho="h1" tom="inverso" id="cta-final__titulo" className="cta-final__titulo" data-anim="stagger-item">
            {secao.headline}
          </UiTitulo>
          <p className="cta-final__subtexto text-body-lg text-on-inverse" data-anim="stagger-item">
            {secao.subtexto}
          </p>
          <ul className="cta-final__selos flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-on-inverse">
            {secao.selos.map((selo) => (
              <li key={selo} className="cta-final__selo flex items-center gap-2">
                <UiIcone nome="check" tamanho={16} />
                {selo}
              </li>
            ))}
          </ul>
          <div className="cta-final__acoes flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <UiCtaPrincipal local="cta-final" className="cta-final__cta" cheio="mobile" animExtra="stagger-item" />
            <UiBotao href={secundario.href} variante="secundario" cheio="mobile" className="cta-final__cta-secundario border-on-inverse text-on-inverse">
              {secundario.texto}
            </UiBotao>
          </div>
        </div>
      </UiContainer>
    </UiSecao>
  );
}
