/**
 * Helper · eventos internos do DOM (sem biblioteca)
 * Ficha: docs/sections/fichas/header.md (painel) e global-acesso-fixo.md (barra inert com o menu aberto)
 * Conteúdo: nenhum.
 * `HeaderPainel` avisa abertura/fechamento; `CtaObservador` escuta e deixa a barra inferior `inert`.
 * (Evento do documento, não de rolagem: nenhum listener de scroll/wheel no projeto.)
 */

export const EVENTO_PAINEL_MENU = "afisiopop:painel-menu";

export type DetalhePainelMenu = { readonly aberto: boolean };

export function avisarPainelMenu(aberto: boolean): void {
  document.dispatchEvent(new CustomEvent<DetalhePainelMenu>(EVENTO_PAINEL_MENU, { detail: { aberto } }));
}
