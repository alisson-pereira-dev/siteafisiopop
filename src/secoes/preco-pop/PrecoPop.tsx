/**
 * Seção S12 · preco-pop ("Preço único") + dúvidas frequentes — modelo do usuário (17/11/2026): galeria FIXA à esquerda + coluna de compra que ROLA à direita
 * Ficha: docs/sections/fichas/preco-pop.md (revisão de 17/11/2026) · Conteúdo: content.json → secoes.preco_pop
 * (etiqueta, titulo, texto, preco {valor, periodo}, inclui[], imagem {src, alt}, oferta, conta, cta) e secoes.faq (titulo, subtitulo, perguntas[]: as dúvidas moram AQUI;
 * a antiga seção S16 `faq` foi fundida nesta)
 * Ordem da coluna da direita (referência do usuário, 17/11/2026): título, texto, lista, CARTÃO DA OFERTA (PrecoPopOferta: faixa escura + R$ 49,99 em destaque +
 * serviços), CTA, caixa de números (PrecoPopNumeros) e as dúvidas.
 * O R$ 49,99 do texto (`**R$ 49,99**` no conteúdo) sai em destaque: marca-texto rosa (bg-primary-soft) com texto negrito escuro, no MESMO tamanho do texto (trechos entre ** no conteúdo).
 * Elementos: preco-pop__conteudo, __titulo, __texto, __inclui (PrecoPopInclui), __inclui-item, __cta, __duvidas (âncora #faq), __duvidas-titulo,
 * __duvidas-subtitulo, __duvidas-lista, __duvida (UiAccordion), __duvida-pergunta, __duvida-pergunta-icone, __duvida-resposta
 * + a imagem fixa (PrecoPopGaleria: __galeria, __palco)
 * Grade de 2 colunas (7/12 + 5/12) com `items-start` (CRÍTICO para o sticky). ≥1024: a galeria é sticky e a coluna da direita (título, texto, lista,
 * CTA e as dúvidas) é bem mais alta, então a galeria fica presa até o fim da seção. <1024: 1 coluna, galeria em cima, sem sticky. NENHUM ancestral com
 * overflow (quebraria o sticky). Sem comparação de preço, riscado, contagem ou urgência. `preco.validar` e as respostas `validar` seguem no conteúdo;
 * sem JSON-LD FAQPage (2 respostas ainda `validar`) e sem CTA principal dentro das dúvidas.
 */
import { conteudo } from "@/lib/conteudo";
import { UiAccordion } from "@/ui/UiAccordion";
import { UiContainer } from "@/ui/UiContainer";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { PrecoPopGaleria } from "./PrecoPopGaleria";
import { PrecoPopInclui } from "./PrecoPopInclui";
import { PrecoPopNumeros } from "./PrecoPopNumeros";
import { PrecoPopOferta } from "./PrecoPopOferta";

export function PrecoPop() {
  const secao = conteudo.secoes.preco_pop;
  const duvidas = conteudo.secoes.faq;

  return (
    <UiSecao id="preco" bloco="preco-pop" ficha="S12" conteudo="secoes.preco_pop" labelledby="preco-pop__titulo" tom="alt">
      <UiContainer classes="grid items-start gap-7 lg:grid-cols-12 lg:gap-x-8">
        <PrecoPopGaleria imagem={secao.imagem} />
        <div className="preco-pop__conteudo flex flex-col gap-5 lg:col-span-5">
          <UiTitulo nivel="h2" id="preco-pop__titulo" className="preco-pop__titulo">
            {secao.titulo}
          </UiTitulo>
          <p className="preco-pop__texto text-body-lg text-muted">
            {secao.texto.split("**").map((trecho, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="preco-pop__texto-destaque box-decoration-clone rounded-sm bg-primary-soft px-2 py-1 font-strong text-foreground">
                  {trecho}
                </strong>
              ) : (
                trecho
              ),
            )}
          </p>
          <PrecoPopInclui itens={secao.inclui} />
          <PrecoPopOferta />
          <UiCtaPrincipal local="preco-pop" className="preco-pop__cta" cheio="sempre" />
          <PrecoPopNumeros />
          <div id="faq" className="preco-pop__duvidas mt-5 flex flex-col gap-3 rounded-md border border-border bg-surface p-5 md:p-6">
            <UiTitulo nivel="h3" id="preco-pop__duvidas-titulo" className="preco-pop__duvidas-titulo">
              {duvidas.titulo}
            </UiTitulo>
            <p className="preco-pop__duvidas-subtitulo text-body text-muted">{duvidas.subtitulo}</p>
            <div className="preco-pop__duvidas-lista">
              {duvidas.perguntas.map((item, i) => (
                <UiAccordion
                  key={item.pergunta}
                  pergunta={item.pergunta}
                  resposta={item.resposta}
                  className="preco-pop__duvida"
                  classePergunta="preco-pop__duvida-pergunta"
                  classeIcone="preco-pop__duvida-pergunta-icone"
                  classeResposta="preco-pop__duvida-resposta"
                  data-item={`pergunta-${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </UiContainer>
    </UiSecao>
  );
}
