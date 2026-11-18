/**
 * Seção S10 · depoimentos — DepoimentosCard (um slide do carrossel)
 * Ficha: docs/sections/fichas/depoimentos.md (S10; revisão de 16/11/2026) · Conteúdo: content.json → secoes.depoimentos.itens
 * (citacao, autor, contexto, link, provisorio) e secoes.depoimentos.rotulo_provisorio / provisorio (bloco)
 * Elementos: depoimentos__card, __midia, __aspas, __citacao (blockquote), __autor, __contexto, __selo-provisorio
 * Card do slide (blocos como na referência do usuário, 17/11/2026): FOTO grande no topo (item.imagem, 16:9, cantos arredondados) e, abaixo, o bloco de texto
 * (nome, citação, legenda). Sem foto (src ausente/pendente) volta o ladrilho de marca com aspas grandes (nada inventado). Nome, citação e
 * legenda em tom apagado (o aviso "provisório" fica DISCRETO na mesma linha da legenda, em texto pequeno apagado, sem selo colorido; segue visível) (o `contexto`, que vira link para `link`), com o fio vertical à direita. O selo "provisório" aparece em todo
 * card com `provisorio: true` no item OU no bloco e some quando deixar de ser; NUNCA é animado.
 */
import Image from "next/image";
import { midiaPendente, normalizarSrc } from "@/lib/midia";
import { UiLink } from "@/ui/UiLink";

type Props = {
  citacao: string;
  autor: string;
  contexto: string;
  link?: string;
  /** Foto do depoimento (opcional; sem ela, ladrilho de marca). */
  imagem?: { readonly src: string; readonly alt: string };
  /** `provisorio` do item ou do bloco. */
  provisorio: boolean;
  rotuloProvisorio: string;
};

export function DepoimentosCard({ citacao, autor, contexto, link, imagem, provisorio, rotuloProvisorio }: Props) {
  return (
    <article className="depoimentos__card flex w-11/12 flex-col gap-5 border-r border-border pr-6 md:pr-7">
      {imagem && !midiaPendente(imagem.src) ? (
        <div className="depoimentos__midia relative aspect-wide w-full overflow-hidden rounded-[var(--depoimentos-raio)] bg-bg-alt">
          <Image src={normalizarSrc(imagem.src)} alt={imagem.alt} fill sizes="(min-width: 1024px) 60vw, 88vw" className="object-cover object-top" draggable={false} />
        </div>
      ) : (
        <div className="depoimentos__midia flex aspect-wide w-full items-center justify-center rounded-[var(--depoimentos-raio)] bg-grad-soft" aria-hidden="true">
          <span className="depoimentos__aspas font-serif text-display leading-none text-brand-pink">“</span>
        </div>
      )}
      <div className="depoimentos__card-corpo flex flex-col gap-2">
        <p className="depoimentos__autor text-body-lg text-foreground">{autor}</p>
        <blockquote className="depoimentos__citacao text-body-lg text-foreground">{citacao}</blockquote>
        <div className="depoimentos__legenda flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {link ? (
            <UiLink href={link} externo tom="texto" className="depoimentos__contexto text-body font-regular text-muted">
              {contexto}
            </UiLink>
          ) : (
            <p className="depoimentos__contexto text-body text-muted">{contexto}</p>
          )}
          {provisorio ? <span className="depoimentos__selo-provisorio text-small text-muted">{rotuloProvisorio}</span> : null}
        </div>
      </div>
    </article>
  );
}
