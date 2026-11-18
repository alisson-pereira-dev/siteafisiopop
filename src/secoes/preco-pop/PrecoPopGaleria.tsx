/**
 * Seção S12 · preco-pop — PrecoPopGaleria: a imagem FIXA à esquerda (uma só: o cartaz do Preço POP)
 * Ficha: docs/sections/fichas/preco-pop.md (revisão de 18/11/2026) · Conteúdo: content.json → secoes.preco_pop.imagem {src, alt}
 * Elementos: preco-pop__galeria, __palco
 * Modelo do usuário (galeria sticky + coluna de compra que rola), agora com UMA imagem (assets/preco_pop.jpg → preco_pop-site.webp, 3:4, com o texto
 * dentro da arte): sem miniaturas, sem troca, sem JS. A imagem é `aspect-hero` (4:5, corte de ~4% em cima e embaixo; o texto da arte fica a mais de 3% das
 * bordas) e, a partir de 1024, a largura é limitada para a altura caber na tela abaixo do header (--topo-sticky). O sticky é CSS (wrapper) e exige
 * `items-start` na grade e nenhum ancestral com overflow (ver PrecoPop). Sem a imagem, não renderiza.
 */
import Image from "next/image";
import { midiaPendente, normalizarSrc } from "@/lib/midia";

type Props = { imagem: { readonly src: string; readonly alt: string } };

export function PrecoPopGaleria({ imagem }: Props) {
  if (midiaPendente(imagem.src)) return null;
  return (
    <div className="preco-pop__galeria lg:sticky lg:top-[var(--topo-sticky)] lg:col-span-7">
      <div className="preco-pop__palco relative mx-auto aspect-hero w-full overflow-hidden rounded-md bg-inverse lg:max-w-[calc((100svh-var(--topo-sticky)-var(--space-5))*0.8)]">
        <Image src={normalizarSrc(imagem.src)} alt={imagem.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" priority={false} />
      </div>
    </div>
  );
}
