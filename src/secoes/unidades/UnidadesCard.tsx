/**
 * Seção S17 · unidades — UnidadesCard (uma unidade)
 * Ficha: docs/sections/fichas/unidades.md (S17) · Conteúdo: content.json → secoes.unidades.itens (nome, local, endereco,
 * horarios, mapa_url) e secoes.unidades.mapa_rotulo
 * Elementos: unidades__card, __card-midia, __card-nome, __card-local, __card-endereco, __card-horarios, __card-mapa (UnidadesMapa)
 * Cantos do card e da foto: 8px (--raio-cartao, raios.css; pedido do usuário, 18/11/2026). Foto da fachada (imagem.src real) ou, se pendente, o ícone de pino.
 * CAMPO VAZIO NÃO RENDERIZA (endereço, horários, mapa), sem texto de substituição. `card-cta` é RESERVADO e não é renderizado (o botão por unidade foi testado em 18/11/2026 e REMOVIDO a pedido do usuário; só o CTA do bloco, depois da lista). O endereço provisório de Lauro de
 * Freitas continua marcado `validar` no conteúdo. Tablet: 2 colunas internas; desktop: 1 coluna dentro de cada card.
 */
import Image from "next/image";
import { midiaPendente, normalizarSrc } from "@/lib/midia";
import { slug } from "@/lib/slug";
import { UiCard } from "@/ui/UiCard";
import { UiIcone } from "@/ui/UiIcone";
import { UiMidia } from "@/ui/UiMidia";
import { UnidadesMapa } from "./UnidadesMapa";

export type Unidade = {
  readonly nome: string;
  readonly local: string;
  readonly imagem?: { readonly src: string; readonly alt: string };
  readonly endereco?: string;
  readonly horarios?: readonly string[];
  readonly mapa_url?: string;
};

type Props = { unidade: Unidade; mapaRotulo: string };

export function UnidadesCard({ unidade, mapaRotulo }: Props) {
  const { nome, local, endereco, horarios, mapa_url: mapaUrl, imagem } = unidade;

  return (
    <UiCard
      as="li"
      raio="cartao"
      className="unidades__card grid content-start gap-x-5 gap-y-2 md:grid-cols-2 lg:grid-cols-1"
      data-item={slug(local)}
      data-anim="stagger-item desce"
    >
      {imagem && !midiaPendente(imagem.src) ? (
        <div className="unidades__card-midia relative aspect-card w-full overflow-hidden rounded-[var(--raio-cartao)] bg-bg-alt md:col-span-2 lg:col-span-1">
          <Image src={normalizarSrc(imagem.src)} alt={imagem.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : (
        <UiMidia
          src="pendente"
          alt={local}
          proporcao="card"
          className="unidades__card-midia md:col-span-2 lg:col-span-1"
          ocupante={<UiIcone nome="map-pin" tamanho={48} className="text-primary" />}
        />
      )}
      <h3 className="unidades__card-nome font-title text-h3 font-heading text-foreground md:col-start-1">{nome}</h3>
      <p className="unidades__card-local flex items-center gap-2 text-body font-strong text-foreground md:col-start-1">
        <UiIcone nome="map-pin" tamanho={20} className="text-secondary" />
        {local}
      </p>
      {endereco ? (
        <p className="unidades__card-endereco text-body text-muted md:col-start-2 md:row-start-1 lg:col-start-1 lg:row-start-auto">{endereco}</p>
      ) : null}
      {horarios && horarios.length > 0 ? (
        <p className="unidades__card-horarios text-body text-muted md:col-start-2 lg:col-start-1">{horarios.join(" · ")}</p>
      ) : null}
      {mapaUrl ? <UnidadesMapa url={mapaUrl} rotulo={mapaRotulo} titulo={`${mapaRotulo}: ${local}`} /> : null}
    </UiCard>
  );
}
