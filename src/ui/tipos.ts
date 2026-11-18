/**
 * Compartilhado · tipos dos componentes ui-*
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: nenhum
 * `DadosAttr`: atributos `data-*` repassados ao elemento raiz do componente (data-item, data-anim…).
 * `data-anim` aceita uma LISTA separada por espaço (ex.: "stagger-item card-realce"); o CSS e o MotionInit
 * usam `[data-anim~="x"]`.
 */
export type DadosAttr = { [K in `data-${string}`]?: string };
