/**
 * Seção S05 · para-quem
 * Ficha: docs/sections/fichas/para-quem.md (S05) · Conteúdo: content.json → secoes.para_quem (titulo, para_voce,
 * nao_e_para_titulo, nao_e_para_texto)
 * Elementos: para-quem__titulo, __lista-voce (ul), __item (ParaQuemItem), __nao-e-para, __nao-e-para-titulo, __nao-e-para-texto
 * Mobile 1 coluna; 768–1023 lista em 2 colunas e bloco embaixo; ≥1024 lista nas colunas 1–7 e bloco nas 8–12.
 * O bloco "não é para" é teal com texto em tinta: honestidade, sem tom de alerta. Nenhum CTA.
 */
import { conteudo } from "@/lib/conteudo";
import { UiCard } from "@/ui/UiCard";
import { UiContainer } from "@/ui/UiContainer";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { ParaQuemItem } from "./ParaQuemItem";

export function ParaQuem() {
  const secao = conteudo.secoes.para_quem;

  return (
    <UiSecao id="para-quem" bloco="para-quem" ficha="S05" conteudo="secoes.para_quem" labelledby="para-quem__titulo">
      <UiContainer classes="grid gap-7 lg:grid-cols-12 lg:gap-x-6">
        <div className="para-quem__cabecalho flex flex-col gap-3 md:max-w-measure lg:col-span-12" data-anim="reveal">
          <UiTitulo nivel="h2" id="para-quem__titulo" className="para-quem__titulo">
            {secao.titulo}
          </UiTitulo>
          <p className="para-quem__subtitulo text-body-lg text-muted">{secao.subtitulo}</p>
        </div>
        <ul className="para-quem__lista-voce flex flex-col md:max-w-measure lg:col-span-7 lg:max-w-none">
          {secao.para_voce.map((texto) => (
            <ParaQuemItem key={texto} texto={texto} />
          ))}
        </ul>
        <UiCard tom="teal" className="para-quem__nao-e-para flex flex-col gap-3 lg:col-span-5 lg:self-start" data-anim="reveal">
          <h3 className="para-quem__nao-e-para-titulo font-title text-h3 font-heading text-foreground">{secao.nao_e_para_titulo}</h3>
          <p className="para-quem__nao-e-para-texto text-body text-foreground">{secao.nao_e_para_texto}</p>
        </UiCard>
      </UiContainer>
    </UiSecao>
  );
}
