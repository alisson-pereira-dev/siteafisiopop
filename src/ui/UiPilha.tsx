/**
 * Compartilhado · UiPilha (client): empilha seções vizinhas; as de cima SOBREPÕEM a primeira (a base) ao rolar (N2: `position: sticky` nativo)
 * Ficha: docs/sections/componentes.md §1 · Receitas: src/app/pilha.css (pilha, pilha-base, pilha-topo) · Conteúdo: nenhum
 * Elementos: ui-pilha (raiz; é ela que limita o sticky: a base solta quando a seção de cima termina)
 * Uso: <UiPilha> <Base (anim="pilha-base") /> <Topo (anim="pilha-topo") /> … </UiPilha> (hoje: hero = base; como-funciona = topo, para o hero
 * ficar coberto por inteiro). Parallax leve do hero: só CSS (animation-timeline: scroll), em src/app/pilha.css.
 * A base é mais alta que a tela em muitos tamanhos; um sticky com `top: 0` esconderia o rodapé dela. Por isso um ResizeObserver (+ resize
 * da janela) escreve `--pilha-topo` = min(0, altura da tela − altura da base) na raiz: a base trava quando o FIM dela encosta no fim da
 * tela (já foi vista inteira) e só então a seção de cima passa por cima. Sem listener de scroll, sem JS de animação, só CSS sticky.
 * Só vale com JS de movimento pronto (data-motion="on", já exclui reduced-motion) e a partir de 768px; fora disso é fluxo normal.
 */
"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function UiPilha({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const no = raiz.current;
    const base = no?.querySelector<HTMLElement>('[data-anim~="pilha-base"]');
    if (!no || !base) return;
    const medir = () => no.style.setProperty("--pilha-topo", `${Math.min(0, window.innerHeight - base.getBoundingClientRect().height)}px`);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(base);
    window.addEventListener("resize", medir);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", medir);
      no.style.removeProperty("--pilha-topo");
    };
  }, []);

  return (
    <div ref={raiz} className="ui-pilha relative" data-anim="pilha">
      {children}
    </div>
  );
}
