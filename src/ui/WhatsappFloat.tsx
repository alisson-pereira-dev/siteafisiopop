/**
 * Global · WhatsappFloat (botão flutuante, só ≥768px) — SERVER
 * Ficha: docs/sections/fichas/global-acesso-fixo.md (campos 4b, 5, 7) · Conteúdo: content.json → site.ctas.principal
 * (destino e mensagem), microcopy.acessibilidade.abrir_whatsapp (rótulo)
 * Elementos: whatsapp-float, whatsapp-float__pulso (anel decorativo, data-anim="float-pulso")
 * `data-cta="flutuante"`: NÃO é o CTA principal e não usa o estilo primário (é ícone, 56px, verde com ícone em tinta).
 * Nasce `pendente`: sem JS fica visível; o CtaObservador o mostra depois que o CTA do hero sai da tela.
 */
import { conteudo } from "@/lib/conteudo";
import { resolverCta } from "@/lib/cta";
import { UiIcone } from "./UiIcone";

export function WhatsappFloat() {
  const destino = resolverCta("@ctas.principal").href;

  return (
    <a
      href={destino}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float fixed bottom-4 right-4 z-sticky hidden h-[var(--tamanho-float)] w-[var(--tamanho-float)] items-center justify-center rounded-full bg-whatsapp text-whatsapp-contrast shadow-3 md:flex"
      aria-label={conteudo.microcopy.acessibilidade.abrir_whatsapp}
      data-cta="flutuante"
      data-anim="float"
      data-estado="pendente"
    >
      <span
        className="whatsapp-float__pulso absolute inset-0 rounded-full bg-whatsapp"
        data-anim="float-pulso"
        data-estado="inativa"
        aria-hidden="true"
      />
      <UiIcone nome="message-circle" tamanho={32} className="relative" />
    </a>
  );
}
