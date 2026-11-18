/**
 * Compartilhado · UiCtaPrincipal (ÚNICO emissor de data-cta="principal")
 * Ficha: docs/sections/componentes.md §1 e §4 · Conteúdo: content.json → site.ctas.principal (texto, destino, mensagem)
 * Elementos: ui-botao--primario (via UiBotao), data-cta-local = `local` (header, header-painel, hero, …, barra)
 * Mesmo botão (estilo) e mesmo destino em todo o site. O TEXTO varia por contexto (decisão do usuário, 18/11/2026): site.cta_texto_por_local[local];
 * sem entrada vale o canônico site.ctas.principal.texto (hero, barra do mobile, painel do menu). Alimenta o CtaObservador (esconde a barra).
 */
import { conteudo } from "@/lib/conteudo";
import { resolverCta } from "@/lib/cta";
import { UiBotao } from "./UiBotao";

type Props = {
  /** Vira `data-cta-local`. Valores fechados em docs/convencao-de-nomes.md §3. */
  local: string;
  className?: string;
  cheio?: "mobile" | "sempre";
  /** Outra receita `data-anim` junto com `botao` (ex.: "stagger-item" no CTA final). */
  animExtra?: string;
};

export function UiCtaPrincipal({ local, className, cheio, animExtra }: Props) {
  const cta = resolverCta("@ctas.principal");
  // texto por contexto (site.cta_texto_por_local); sem entrada, o canônico (principal.texto)
  const texto = (conteudo.site.cta_texto_por_local as Record<string, string>)[local] ?? cta.texto;
  return (
    <UiBotao
      href={cta.href}
      variante="primario"
      cheio={cheio}
      externo
      className={className}
      animExtra={animExtra}
      data-cta="principal"
      data-cta-local={local}
    >
      {texto}
    </UiBotao>
  );
}
