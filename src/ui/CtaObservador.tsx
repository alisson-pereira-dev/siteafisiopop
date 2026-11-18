/**
 * Global · CtaObservador (client, sem saída visual, montado uma vez no layout)
 * Ficha: docs/sections/fichas/global-acesso-fixo.md (campos 5, 7, 9) · Regra: docs/jornada-e-motion.md §5
 * Conteúdo: nenhum. Regra pura em src/lib/cta-visibilidade.ts.
 * Um IntersectionObserver observa todo [data-cta="principal"] (exceto barra, header, header-painel) e a regra decide
 * `algumCtaVisivel` (barra) e `heroVisivel` (flutuante). O resultado é escrito direto no DOM (data-estado, inert):
 * UiBarraCta e WhatsappFloat continuam server e nada re-renderiza ao rolar. Margens do observer: topo = altura do
 * header, base = altura da barra (medida por ResizeObserver e publicada em --barra-cta-altura).
 * Falha segura (M9): marca data-js-pronto ao iniciar; qualquer erro põe data-js-falhou e devolve os controles.
 * Um destaque por tela: o pulso do flutuante não roda com o palco (pin-palco) na tela. Nenhum listener de scroll.
 */
"use client";
import { useEffect } from "react";
import { EVENTO_PAINEL_MENU, type DetalhePainelMenu } from "@/lib/eventos";
import { criarRegraCta, LOCAIS_IGNORADOS, type EstadoAcessoFixo, type EstadoFixo } from "@/lib/cta-visibilidade";

const LIMIARES = [0, 0.5, 1];
const TELA_MD = "(min-width: 768px)";
const REDUZIR_MOVIMENTO = "(prefers-reduced-motion: reduce)";

/** Escreve o estado e, na 1ª resolução, troca sem animar (transição desligada por 1 quadro). */
function escreverEstado(el: HTMLElement, estado: EstadoFixo, semTransicao: boolean) {
  if (el.getAttribute("data-estado") === estado) return;
  if (!semTransicao) {
    el.setAttribute("data-estado", estado);
    return;
  }
  el.style.transition = "none";
  el.setAttribute("data-estado", estado);
  void el.offsetHeight; // aplica o estado sem transição
  requestAnimationFrame(() => el.style.removeProperty("transition"));
}

export function CtaObservador() {
  useEffect(() => {
    const html = document.documentElement;
    const limpezas: Array<() => void> = [];
    try {
      html.setAttribute("data-js-pronto", "");

      const barra = document.querySelector<HTMLElement>('[data-anim="barra-cta"]');
      const flutuante = document.querySelector<HTMLElement>('[data-anim="float"]');
      const pulso = flutuante?.querySelector<HTMLElement>('[data-anim="float-pulso"]') ?? null;
      const ctas = Array.from(document.querySelectorAll<HTMLElement>('[data-cta="principal"]')).filter(
        (el) => !LOCAIS_IGNORADOS.includes(el.getAttribute("data-cta-local") ?? ""),
      );
      const reduzir = window.matchMedia(REDUZIR_MOVIMENTO).matches;

      // --- palco na tela (um destaque por tela) ---
      let palcoNaTela = false;
      const palcos = Array.from(document.querySelectorAll<HTMLElement>('[data-anim="pin-palco"]'));
      if (palcos.length) {
        const ioPalco = new IntersectionObserver((entradas) => {
          for (const e of entradas) palcoNaTela = e.isIntersecting;
          if (palcoNaTela) pulso?.setAttribute("data-estado", "inativa");
        });
        palcos.forEach((p) => ioPalco.observe(p));
        limpezas.push(() => ioPalco.disconnect());
      }

      // --- pulso: 2 vezes na 1ª aparição, uma só vez, nunca com o palco na tela ---
      let pulsoConsumido = reduzir;
      let anterior: EstadoAcessoFixo | null = null;
      const aplicar = (e: EstadoAcessoFixo) => {
        if (barra) {
          escreverEstado(barra, e.barra, e.resolucaoInicial);
          barra.inert = e.barraInert;
        }
        if (flutuante) {
          escreverEstado(flutuante, e.flutuante, e.resolucaoInicial);
          flutuante.inert = e.flutuante === "oculta";
          if (e.flutuante === "visivel" && anterior?.flutuante === "oculta" && !pulsoConsumido && !palcoNaTela) {
            pulsoConsumido = true;
            pulso?.setAttribute("data-estado", "ativa");
          }
        }
        anterior = e;
      };

      const regra = criarRegraCta(aplicar);
      limpezas.push(() => regra.destruir());

      const idDe = new Map<Element, string>();
      ctas.forEach((el, i) => idDe.set(el, `cta-${i}`));

      // --- observer dos CTAs (recriado quando a altura da barra ou do header muda) ---
      let observador: IntersectionObserver | null = null;
      const montarObservador = () => {
        observador?.disconnect();
        const alturaHeader = parseFloat(getComputedStyle(html).getPropertyValue("--header-height")) || 0;
        const alturaBarra = barra ? barra.getBoundingClientRect().height : 0;
        html.style.setProperty("--barra-cta-altura", `${alturaBarra}px`);
        observador = new IntersectionObserver(
          (entradas) => {
            for (const e of entradas) {
              regra.observar(idDe.get(e.target) ?? "", e.target.getAttribute("data-cta-local") ?? "", e.intersectionRatio);
            }
            regra.iniciar();
          },
          { rootMargin: `-${alturaHeader}px 0px -${alturaBarra}px 0px`, threshold: LIMIARES },
        );
        ctas.forEach((el) => observador?.observe(el));
        if (ctas.length === 0) regra.iniciar();
      };
      montarObservador();
      limpezas.push(() => observador?.disconnect());

      if (barra) {
        let ultimaAltura = barra.getBoundingClientRect().height;
        const medidor = new ResizeObserver(() => {
          const altura = barra.getBoundingClientRect().height;
          if (altura !== ultimaAltura) {
            ultimaAltura = altura;
            montarObservador();
          }
        });
        medidor.observe(barra);
        limpezas.push(() => medidor.disconnect());
      }
      const consultaMd = window.matchMedia(TELA_MD);
      consultaMd.addEventListener("change", montarObservador); // --header-height muda em 768px
      limpezas.push(() => consultaMd.removeEventListener("change", montarObservador));

      // --- foco dentro da barra e painel do menu aberto ---
      if (barra) {
        const aoFocar = () => regra.definirFocoNaBarra(true);
        const aoDesfocar = (e: FocusEvent) => regra.definirFocoNaBarra(barra.contains(e.relatedTarget as Node | null));
        barra.addEventListener("focusin", aoFocar);
        barra.addEventListener("focusout", aoDesfocar);
        limpezas.push(() => {
          barra.removeEventListener("focusin", aoFocar);
          barra.removeEventListener("focusout", aoDesfocar);
        });
      }
      const aoMudarPainel = (e: Event) => regra.definirPainelAberto((e as CustomEvent<DetalhePainelMenu>).detail.aberto);
      document.addEventListener(EVENTO_PAINEL_MENU, aoMudarPainel);
      limpezas.push(() => document.removeEventListener(EVENTO_PAINEL_MENU, aoMudarPainel));
    } catch {
      // Falha segura: CSS mostra barra e flutuante e desliga o palco; devolve também o foco/inert.
      html.removeAttribute("data-motion");
      html.setAttribute("data-js-falhou", "");
      document.querySelectorAll<HTMLElement>('[data-anim="barra-cta"], [data-anim="float"]').forEach((el) => {
        el.inert = false;
      });
    }
    return () => limpezas.forEach((limpar) => limpar());
  }, []);

  return null;
}
