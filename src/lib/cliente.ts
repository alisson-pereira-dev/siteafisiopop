/**
 * Helper · estado do navegador sem setState em efeito (useSyncExternalStore)
 * Conteúdo: nenhum. Usado por DepoimentosCarrossel.
 * `useMovimentoReduzido()`: `(prefers-reduced-motion: reduce)` (no servidor: false). `useHidratado()`: false no servidor e na
 * 1ª renderização do cliente (mesma marcação, sem erro de hidratação) e true logo depois.
 */
"use client";
import { useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

function assinarMovimento(aoMudar: () => void) {
  const consulta = window.matchMedia(CONSULTA);
  consulta.addEventListener("change", aoMudar);
  return () => consulta.removeEventListener("change", aoMudar);
}

export function useMovimentoReduzido(): boolean {
  return useSyncExternalStore(
    assinarMovimento,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}

const semAssinatura = () => () => {};

export function useHidratado(): boolean {
  return useSyncExternalStore(
    semAssinatura,
    () => true,
    () => false,
  );
}
