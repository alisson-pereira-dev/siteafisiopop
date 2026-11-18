/**
 * Página global · pagina-404 (T5.3)
 * Ficha: docs/tasks.md T5.3 (sem ficha própria; fora das 13 seções) · Conteúdo: content.json → microcopy.pagina_404 (titulo, texto, cta)
 * Elementos: pagina-404 (raiz), __conteudo, __titulo, __texto, __cta
 * N0: nenhum data-anim. O botão "Voltar ao início" é `ui-botao--secundario`: NÃO cria um segundo CTA principal; o WhatsApp
 * já está na barra (mobile) e no flutuante (≥768) do layout. O Next já injeta `noindex` em páginas 404.
 */
import type { Metadata } from "next";
import { conteudo } from "@/lib/conteudo";
import { UiBotao } from "@/ui/UiBotao";
import { UiContainer } from "@/ui/UiContainer";
import { UiTitulo } from "@/ui/UiTitulo";

export const metadata: Metadata = { title: `${conteudo.microcopy.pagina_404.titulo} | ${conteudo.site.nome}` };

export default function NotFound() {
  const pagina = conteudo.microcopy.pagina_404;
  return (
    <div className="pagina-404 bg-bg py-section" data-section="pagina-404" data-conteudo="microcopy.pagina_404">
      <UiContainer className="pagina-404__conteudo" classes="flex max-w-measure flex-col items-start gap-5">
        <UiTitulo nivel="h1" className="pagina-404__titulo">
          {pagina.titulo}
        </UiTitulo>
        <p className="pagina-404__texto text-body text-foreground">{pagina.texto}</p>
        <UiBotao href={pagina.cta.destino} variante="secundario" cheio="mobile" className="pagina-404__cta">
          {pagina.cta.texto}
        </UiBotao>
      </UiContainer>
    </div>
  );
}
