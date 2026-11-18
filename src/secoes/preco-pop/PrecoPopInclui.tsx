/**
 * Seção S12 · preco-pop — PrecoPopInclui (lista do que está incluso)
 * Ficha: docs/sections/fichas/preco-pop.md (S12) · Conteúdo: content.json → secoes.preco_pop.inclui[]
 * Elementos: preco-pop__inclui, preco-pop__inclui-item
 * Lista de checks do wireframe (círculo escuro com ✓ + texto), sem card e sem preço por item.
 */
import { UiIcone } from "@/ui/UiIcone";

type Props = { itens: readonly string[] };

export function PrecoPopInclui({ itens }: Props) {
  return (
    <ul className="preco-pop__inclui flex flex-col gap-3">
      {itens.map((item) => (
        <li key={item} className="preco-pop__inclui-item flex items-center gap-3 text-body text-foreground" data-anim="stagger-item">
          <span className="preco-pop__inclui-marca flex h-6 w-6 flex-none items-center justify-center rounded-full bg-inverse text-on-inverse" aria-hidden="true">
            <UiIcone nome="check" tamanho={16} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
