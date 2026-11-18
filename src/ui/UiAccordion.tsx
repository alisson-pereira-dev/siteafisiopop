/**
 * Compartilhado · UiAccordion (item de FAQ sobre <details>/<summary>) — SERVER, sem JS
 * Ficha: docs/sections/componentes.md §1 · docs/sections/fichas/faq.md · Conteúdo: pergunta/resposta vêm de quem usa
 * Elementos: ui-accordion (a classe-nome da seção entra primeiro via `className`); classePergunta, classeIcone e
 * classeResposta recebem os nomes `faq__pergunta`, `faq__pergunta-icone` e `faq__resposta`.
 * Abre e fecha SUAVE (18/11/2026: a altura anima onde o navegador suporta ::details-content; resposta entra por opacity + translateY; receitas em src/app/accordion.css); chevron gira e resposta entra por `opacity` (receitas em globals.css,
 * por details[open]). Vários itens podem ficar abertos; nenhum nasce aberto. Toda a linha do `summary` é alvo ≥ 48px.
 */
import { juntar } from "@/lib/classes";
import { UiIcone } from "./UiIcone";
import type { DadosAttr } from "./tipos";

type Props = DadosAttr & {
  pergunta: string;
  resposta: string;
  className?: string;
  classePergunta?: string;
  classeIcone?: string;
  classeResposta?: string;
};

export function UiAccordion({ pergunta, resposta, className, classePergunta, classeIcone, classeResposta, ...dados }: Props) {
  return (
    <details className={juntar(className, "ui-accordion border-b border-border")} data-anim="accordion" {...dados}>
      <summary
        className={juntar(
          classePergunta,
          "flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-4 text-body-lg font-strong text-foreground [&::-webkit-details-marker]:hidden",
        )}
      >
        {pergunta}
        <UiIcone nome="plus" tamanho={24} className={classeIcone} data-anim="accordion-icone" />
      </summary>
      <p className={juntar(classeResposta, "max-w-measure pb-5 text-body text-muted")} data-anim="accordion-resposta">
        {resposta}
      </p>
    </details>
  );
}
