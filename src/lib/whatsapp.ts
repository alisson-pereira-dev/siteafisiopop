/**
 * Helper · link do WhatsApp
 * Conteúdo: content/content.json → site.contato.whatsapp (numero, mensagem_padrao),
 *           secoes.servicos.mensagem_servico (usa o marcador {servico})
 * Formato do link: https://wa.me/{numero}?text={mensagem com encodeURIComponent}
 */
import { conteudo } from "./conteudo";

const MARCADOR_SERVICO = "{servico}";

/** Monta o link a partir de um número (qualquer formato; só os dígitos valem) e de uma mensagem. */
export function montarLinkWhatsApp(numero: string, mensagem: string): string {
  const digitos = numero.replace(/\D/g, "");
  if (!digitos) {
    throw new Error("Número de WhatsApp vazio em content.json → site.contato.whatsapp.numero");
  }
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

/** Link do CTA principal (mensagem padrão do site). */
export function linkWhatsApp(): string {
  const { numero, mensagem_padrao } = conteudo.site.contato.whatsapp;
  return montarLinkWhatsApp(numero, mensagem_padrao);
}

/** Troca `{servico}` em `modelo` pelo nome do serviço. */
export function mensagemDoServico(
  nomeServico: string,
  modelo: string = conteudo.secoes.servicos.mensagem_servico,
): string {
  // Função como 2º argumento: evita que `$&` ou `$1` no nome do serviço seja interpretado.
  return modelo.replaceAll(MARCADOR_SERVICO, () => nomeServico);
}

/** Link contextual de um serviço (card da seção `servicos`). */
export function linkWhatsAppServico(nomeServico: string): string {
  const { numero } = conteudo.site.contato.whatsapp;
  return montarLinkWhatsApp(numero, mensagemDoServico(nomeServico));
}
