/**
 * Teste · mock de next/image (alias em vitest.config.ts)
 * Conteúdo: nenhum. Renderiza um <img> simples com os mesmos atributos relevantes (src, width, height,
 * alt, sizes) e marca o que o next/image faria: `priority` → fetchPriority="high" sem lazy; senão lazy.
 */
import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string;
  width: number;
  height: number;
  priority?: boolean;
};

export default function Image({ priority, ...props }: Props) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} data-next-image="" loading={priority ? undefined : "lazy"} fetchPriority={priority ? "high" : undefined} />;
}
