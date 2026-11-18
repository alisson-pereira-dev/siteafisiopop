/**
 * Compartilhado · UiSelo (valor + rótulo em destaque)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: hero.selo (valor, rotulo) · depoimentos.rotulo_provisorio
 * Elementos: ui-selo (a classe-nome da seção entra primeiro via `className`)
 * Tom: destaque (bg-primary-soft + tinta, 12,95:1) · aviso (bg-warning-bg + text-warning, 4,96:1).
 * Estático (N0): é conteúdo do 1º viewport, não tem data-anim (decisão M10).
 */
import { juntar } from "@/lib/classes";

const TOM = {
  destaque: "bg-primary-soft text-foreground",
  aviso: "bg-warning-bg text-warning",
} as const;

type Props = {
  valor: string;
  rotulo?: string;
  tom?: keyof typeof TOM;
  className?: string;
};

export function UiSelo({ valor, rotulo, tom = "destaque", className }: Props) {
  return (
    <div className={juntar(className, "ui-selo rounded-lg px-4 py-3 text-center shadow-2", TOM[tom])}>
      <strong className="block font-title text-h3 font-heading">{valor}</strong>
      {rotulo ? <small className="block text-small">{rotulo}</small> : null}
    </div>
  );
}
