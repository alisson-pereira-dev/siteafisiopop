/**
 * Seção S00 · header — HeaderBarra (client mínimo): a barra sticky + marca "rolado"
 * Ficha: docs/sections/fichas/header.md (campos 4 e 7) · Conteúdo: nenhum (recebe a marcação por `children`)
 * Elementos: header__barra
 * Escreve data-estado="rolado" na raiz do header quando scrollY > 60 e remove quando scrollY ≤ 52 (histerese, sem "pisca"
 * perto do limite). O visual (pílula de vidro) é todo CSS em src/app/header.css.
 * EXCEÇÃO DOCUMENTADA (decisão do usuário, 16/11/2026, referência "pílula de vidro"): único listener de `scroll` do projeto,
 * passivo e coalescido por requestAnimationFrame; antes o gatilho era um observer na faixa de preço.
 * A altura da barra é fixa (h-header): a pílula muda por dentro e não desloca o conteúdo (CLS 0).
 */
"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Limiares medidos na referência: liga acima de 60 px, desliga em 52 px ou menos. */
const LIGA_ACIMA_DE_PX = 60;
const DESLIGA_ATE_PX = 52;

export function HeaderBarra({ children }: { children: ReactNode }) {
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = barra.current?.closest<HTMLElement>('[data-section="header"]');
    if (!raiz) return;
    let rolado = false;
    let agendado = false;

    const atualizar = () => {
      agendado = false;
      const y = window.scrollY;
      if (!rolado && y > LIGA_ACIMA_DE_PX) {
        rolado = true;
        raiz.setAttribute("data-estado", "rolado");
      } else if (rolado && y <= DESLIGA_ATE_PX) {
        rolado = false;
        raiz.removeAttribute("data-estado");
      }
    };
    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizar);
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    atualizar();
    return () => {
      window.removeEventListener("scroll", aoRolar);
      raiz.removeAttribute("data-estado");
    };
  }, []);

  return (
    <div ref={barra} className="header__barra sticky top-0 z-sticky h-header has-[[data-estado=aberto]]:z-overlay">
      {children}
    </div>
  );
}
