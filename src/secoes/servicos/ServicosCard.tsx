/**
 * Seção S06 · servicos — ServicosCard (uma linha da tabela de valor)
 * Ficha: docs/sections/fichas/servicos.md (S06; revisão de 16/11/2026) · Conteúdo: content.json → secoes.servicos.itens
 * (nome, descricao, icone, imagem, validar) (link_texto = texto curto de benefício, diferente em cada linha) e secoes.servicos.mensagem_servico (a mensagem pré-preenchida leva o nome do serviço)
 * Elementos: servicos__card (a linha), __card-nome, __card-descricao, __card-link
 * Wireframe da Superpower ("tabela de valor"): linhas zebradas com o rótulo (nome do serviço), o detalhe (descrição, em cinza) e,
 * aqui, o link de WhatsApp daquele serviço (`data-cta="servico"`, só ele é clicável). Sem mídia por linha nem ícone.
 */
import { slug } from "@/lib/slug";
import { linkWhatsAppServico } from "@/lib/whatsapp";
import { UiLink } from "@/ui/UiLink";

type Props = {
  nome: string;
  descricao: string;
  textoLink: string;
};

export function ServicosCard({ nome, descricao, textoLink }: Props) {
  return (
    <li
      className="servicos__card flex flex-col gap-2 rounded-sm px-4 py-3 odd:bg-bg-alt md:flex-row md:items-center md:gap-6"
      data-item={slug(nome)}
      data-anim="stagger-item"
    >
      <h3 className="servicos__card-nome font-title text-body-lg font-heading text-foreground md:w-1/4">{nome}</h3>
      <p className="servicos__card-descricao text-body text-muted md:flex-1">{descricao}</p>
      <UiLink
        href={linkWhatsAppServico(nome)}
        externo
        seta
        ariaLabel={`${textoLink}: ${nome}`}
        className="servicos__card-link self-start"
        data-cta="servico"
      >
        {textoLink}
      </UiLink>
    </li>
  );
}
