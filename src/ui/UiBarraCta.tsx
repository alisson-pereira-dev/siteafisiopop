/**
 * Compartilhado · UiBarraCta (barra inferior fixa do mobile, <768px) — SERVER
 * Ficha: docs/sections/fichas/global-acesso-fixo.md (campos 4a, 5, 7, 8) · Conteúdo: content.json → site.ctas.principal
 * Elementos: ui-barra-cta (raiz, sem elementos próprios); o botão dentro é o UiCtaPrincipal (`data-cta-local="barra"`)
 * Montada uma vez no layout, fora de qualquer seção. Nasce `data-estado="pendente"`: sem JS fica visível; com JS o
 * CtaObservador resolve para `visivel`/`oculta` (+ `inert`). Receita `barra-cta` em globals.css. Só <768px (`md:hidden`).
 * Respeita a área segura do iOS (`--safe-bottom`, exige viewportFit: "cover" no layout).
 */
import { UiCtaPrincipal } from "./UiCtaPrincipal";

export function UiBarraCta() {
  return (
    <div
      className="ui-barra-cta fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-bg px-pad pt-3 pb-[calc(var(--space-3)_+_var(--safe-bottom))] shadow-3 md:hidden"
      data-anim="barra-cta"
      data-estado="pendente"
    >
      <UiCtaPrincipal local="barra" cheio="sempre" />
    </div>
  );
}
