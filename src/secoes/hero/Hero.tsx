/**
 * Seção S01 · hero (wireframe da Superpower: cartão com mídia de fundo, texto à esquerda, mini-stats embaixo)
 * Ficha: docs/sections/fichas/hero.md (S01; revisão de 16/11/2026) · Conteúdo: content.json → secoes.hero (etiqueta, headline,
 * subheadline, cta, midia, indicadores[] {valor, rotulo}). `cta_secundario`, `microcopy` e `selo` seguem no conteúdo, mas o
 * wireframe tem 1 só botão e nenhum selo: o botão "Ver serviços" aparece no CTA final e o preço já está no subtítulo.
 * Elementos: hero__cartao, __midia, __veu, __conteudo, __etiqueta, __titulo, __subtitulo, __acoes, __cta, __indicadores,
 * __indicador, __indicador-valor, __indicador-rotulo
 * Faixa de largura quase total (px-2) com UM cartão arredondado. <768: foto no topo, texto e indicadores embaixo (nada de texto sobre
 * a foto). ≥768: a mídia preenche o cartão, véu claro à esquerda, conteúdo à esquerda na vertical central e os indicadores
 * absolutos embaixo à esquerda, separados por um fio (como as 3 mini-métricas da referência). Mídia `pendente` = degradê de marca.
 * Nada acima da dobra tem data-anim de reveal (M7/M10): só `botao` no CTA.
 */
import { conteudo } from "@/lib/conteudo";
import { UiChip } from "@/ui/UiChip";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { UiMidia } from "@/ui/UiMidia";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";

/** `sizes`: o cartão ocupa quase a largura toda da tela. */
const SIZES_MIDIA = "100vw";

export function Hero() {
  const hero = conteudo.secoes.hero;

  return (
    <UiSecao id="inicio" bloco="hero" ficha="S01" conteudo="secoes.hero" labelledby="hero__titulo" semPadding anim="pilha-base pilha-parallax" className="px-2 pb-2 pt-2">
      <div className="hero__cartao relative isolate flex flex-col overflow-hidden rounded-md bg-surface shadow-2 md:min-h-[var(--altura-hero-midia)] md:justify-center">
        <UiMidia src={hero.midia.src} alt={hero.midia.alt} proporcao="cartao" priority sizes={SIZES_MIDIA} classesImagem="object-right" className="hero__midia" />
        <span className="hero__veu absolute inset-y-0 left-0 hidden w-4/5 md:block lg:w-3/5" data-anim="stage-vidro" aria-hidden="true" />
        <div className="hero__conteudo relative flex flex-col items-start gap-5 p-5 md:w-3/5 md:px-7 md:py-8 lg:w-1/2">
          <UiChip className="hero__etiqueta">{hero.etiqueta}</UiChip>
          <UiTitulo nivel="h1" tamanho="h2" id="hero__titulo" className="hero__titulo">
            {hero.headline}
          </UiTitulo>
          <p className="hero__subtitulo text-body text-muted md:max-w-measure">{hero.subheadline}</p>
          <div className="hero__acoes">
            <UiCtaPrincipal local="hero" className="hero__cta" cheio="mobile" />
          </div>
        </div>
        <ul className="hero__indicadores relative grid grid-cols-2 gap-x-5 gap-y-3 px-5 pb-5 md:absolute md:bottom-6 md:left-7 md:flex md:gap-0 md:p-0">
          {hero.indicadores.map((item, i) => (
            <li
              key={item.valor}
              className={i === 0 ? "hero__indicador flex flex-col md:min-w-touch" : "hero__indicador flex flex-col md:ml-4 md:border-l md:border-border md:pl-4"}
            >
              <p className="hero__indicador-valor text-small font-strong text-foreground">{item.valor}</p>
              <p className="hero__indicador-rotulo text-small text-muted">{item.rotulo}</p>
            </li>
          ))}
        </ul>
      </div>
    </UiSecao>
  );
}
