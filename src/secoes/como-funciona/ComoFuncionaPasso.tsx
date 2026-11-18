/**
 * Seção S07 · como-funciona — ComoFuncionaPasso (um passo)
 * Ficha: docs/sections/fichas/como-funciona.md (S07) · Conteúdo: content.json → secoes.como_funciona.passos[] (numero, titulo,
 * descricao, imagem {src, alt}; `validar` fica no conteúdo)
 * Elementos: como-funciona__passo, __passo-midia, __passo-numero, __passo-titulo, __passo-descricao
 * Wireframe da Superpower: imagem QUADRADA com raio, etiqueta numerada pequena no canto superior esquerdo, título e texto cinza
 * embaixo (recuados à direita). Mídia `pendente` = ladrilho de marca (`bg-grad-soft`); nada de foto inventada.
 */
import { UiMidia } from "@/ui/UiMidia";

type Props = { numero: number; titulo: string; descricao: string; imagem: { readonly src: string; readonly alt: string } };

export function ComoFuncionaPasso({ numero, titulo, descricao, imagem }: Props) {
  const etiqueta = (
    <span className="como-funciona__passo-numero absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm bg-surface text-small text-foreground">
      {numero}
    </span>
  );
  return (
    <li className="como-funciona__passo flex flex-col" data-item={`passo-${numero}`} data-anim="stagger-item">
      <UiMidia
        src={imagem.src}
        alt={imagem.alt}
        proporcao="square"
        sizes="(min-width: 1024px) 300px, (min-width: 480px) 50vw, 100vw"
        className="como-funciona__passo-midia"
        ocupante={etiqueta}
        sobreposto={etiqueta}
      />
      <div className="como-funciona__passo-corpo flex max-w-measure flex-col gap-2 py-5 pr-5">
        <h3 className="como-funciona__passo-titulo font-title text-h3 font-heading text-foreground">{titulo}</h3>
        <p className="como-funciona__passo-descricao text-body text-muted">{descricao}</p>
      </div>
    </li>
  );
}
