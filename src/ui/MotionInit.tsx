/**
 * Global · MotionInit (client, sem saída visual, montado uma vez no layout)
 * Ficha: docs/sections/fichas/global-acesso-fixo.md (campo 7) · Regra: docs/jornada-e-motion.md §3.3 (M9, M10)
 * Conteúdo: nenhum.
 * Quando o JS de animação está pronto e SEM prefers-reduced-motion, nesta ordem: (a) marca data-js-pronto;
 * (b) marca data-estado="visto" em todo reveal/stagger-item que já passou do topo da viewport (sem animar);
 * (c) só então põe data-motion="on" no <html> (é o que liga o estado inicial oculto em globals.css);
 * (d) um IntersectionObserver (threshold 0,15; rootMargin inferior -10%) revela o resto, UMA vez por elemento.
 * Falha segura: erro remove data-motion e põe data-js-falhou (tudo aparece). Sem listener de scroll.
 */
"use client";
import { useEffect } from "react";

const SELETOR = '[data-anim~="reveal"], [data-anim~="stagger-item"]';
const LIMIAR_REVELAR = 0.15;
const MARGEM_INFERIOR = "-10%";

export function MotionInit() {
  useEffect(() => {
    const html = document.documentElement;
    let observador: IntersectionObserver | null = null;
    try {
      html.setAttribute("data-js-pronto", "");
      if (html.hasAttribute("data-js-falhou")) return; // outro componente já falhou: nada fica oculto
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // estado final instantâneo

      const alvos = Array.from(document.querySelectorAll<HTMLElement>(SELETOR));
      // O atraso do stagger NÃO é escrito aqui: vem de :nth-child no CSS (globals.css). Escrever `style` em itens que o React ainda não
      // hidratou gerava o aviso de hidratação do modo dev ("1 Issue").

      // (b) o que já passou do topo da viewport nasce `visto`, sem animar.
      const altura = window.innerHeight;
      const pendentes: HTMLElement[] = [];
      for (const el of alvos) {
        if (el.getBoundingClientRect().top < altura) el.setAttribute("data-estado", "visto");
        else pendentes.push(el);
      }

      // (c) só agora vale o estado inicial oculto.
      html.setAttribute("data-motion", "on");

      // (d) o resto entra uma vez, quando visto.
      observador = new IntersectionObserver(
        (entradas, obs) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            e.target.setAttribute("data-estado", "visto");
            obs.unobserve(e.target);
          }
        },
        { threshold: LIMIAR_REVELAR, rootMargin: `0px 0px ${MARGEM_INFERIOR} 0px` },
      );
      pendentes.forEach((el) => observador?.observe(el));
    } catch {
      html.removeAttribute("data-motion");
      html.setAttribute("data-js-falhou", "");
    }
    return () => {
      observador?.disconnect();
      html.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
