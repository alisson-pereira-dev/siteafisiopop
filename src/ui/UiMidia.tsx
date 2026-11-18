/**
 * Compartilhado · UiMidia (imagem com proporção reservada)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: *.midia (src, alt) · site.logo
 * Elementos: ui-midia (a classe-nome da seção entra primeiro via `className`)
 * `src = "pendente"`: NUNCA vira imagem inventada. Hero: bloco bg-bg-alt com a proporção reservada (CLS 0);
 * `cartao` (hero em cartão arredondado, estrutura da Superpower): <768 faixa 4/3 no topo do cartão; ≥768 preenche o cartão
 * inteiro (absoluta, `object-cover`), sem raio próprio (o cartão corta) e, pendente, com o degradê de marca `bg-grad-soft`;
 * card (`ocultarSePendente`): não renderiza. Imagem real: next/image com width/height da proporção,
 * `sizes`, `alt` do conteúdo; `priority` só no hero (LCP). Normalização do caminho: src/lib/midia.ts.
 */
import Image from "next/image";
import type { ReactNode } from "react";
import { juntar } from "@/lib/classes";
import { midiaPendente, normalizarSrc } from "@/lib/midia";

const PROPORCAO = {
  hero: { classe: "aspect-hero", largura: 800, altura: 1000 },
  cartao: { classe: "aspect-card md:absolute md:inset-0 md:aspect-auto md:h-full", largura: 2752, altura: 1536 }, // hero-site.avif (16:9)
  card: { classe: "aspect-card", largura: 800, altura: 600 },
  square: { classe: "aspect-square", largura: 800, altura: 800 },
  wide: { classe: "aspect-wide", largura: 1280, altura: 720 },
} as const;

type Props = {
  src: string;
  alt: string;
  proporcao: keyof typeof PROPORCAO;
  priority?: boolean;
  /** Atributo `sizes` do next/image (por breakpoint). */
  sizes?: string;
  /** Pendente: não renderiza nada (cards de serviço). Sem isso, reserva o bloco neutro (hero). */
  ocultarSePendente?: boolean;
  /** Só com `pendente`: conteúdo decorativo no centro de um ladrilho de marca (`bg-grad-soft`, ex.: ícone do serviço). Sem foto inventada. */
  ocupante?: ReactNode;
  /** Só com imagem real: elemento por cima da foto (ex.: número do passo). */
  sobreposto?: ReactNode;
  /** Utilitários da <img> (ex.: `object-right` para enquadrar o assunto). */
  classesImagem?: string;
  /** Classe-nome da seção (vem primeiro). */
  className?: string;
  /** Utilitários extras (entram depois de `ui-midia`; ex.: limite de altura no desktop). */
  classes?: string;
};

export function UiMidia({ src, alt, proporcao, priority = false, sizes = "100vw", ocultarSePendente = false, ocupante, sobreposto, classesImagem, className, classes }: Props) {
  const p = PROPORCAO[proporcao];
  const cartao = proporcao === "cartao";
  const base = cartao ? "ui-midia relative w-full overflow-hidden" : "ui-midia relative w-full overflow-hidden rounded-lg bg-bg-alt";
  const fundoPendente = cartao ? "bg-grad-soft" : "";
  if (midiaPendente(src)) {
    if (ocupante) {
      return (
        <div className={juntar(className, "ui-midia relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-grad-soft", p.classe, classes)} aria-hidden="true">
          {ocupante}
        </div>
      );
    }
    if (ocultarSePendente) return null;
    return <div className={juntar(className, base, fundoPendente, p.classe, classes)} aria-hidden="true" />;
  }
  return (
    <div className={juntar(className, base, p.classe, classes)}>
      <Image
        src={normalizarSrc(src)}
        alt={alt}
        width={p.largura}
        height={p.altura}
        sizes={sizes}
        priority={priority}
        className={juntar("h-full w-full object-cover", classesImagem)}
      />
      {sobreposto}
    </div>
  );
}
