/**
 * Seção S05 · para-quem — ParaQuemItem (um "é para você")
 * Ficha: docs/sections/fichas/para-quem.md (S05) · Conteúdo: content.json → secoes.para_quem.para_voce
 * Elementos: para-quem__item
 * Check em text-secondary sobre bg-bg (nunca sobre bg-bg-teal: 4,28:1). Não interativo. Receita `stagger-item`.
 */
import { UiIcone } from "@/ui/UiIcone";

type Props = { texto: string };

export function ParaQuemItem({ texto }: Props) {
  return (
    <li className="para-quem__item flex items-start gap-3 rounded-md px-4 py-3 text-body-lg text-foreground odd:bg-bg-alt" data-anim="stagger-item">
      <UiIcone nome="check" tamanho={24} className="mt-1 text-secondary" />
      {texto}
    </li>
  );
}
