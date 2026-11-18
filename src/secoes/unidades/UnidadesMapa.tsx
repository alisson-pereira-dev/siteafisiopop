/**
 * Seção S17 · unidades — UnidadesMapa: link "Ver no mapa" que abre o Google Maps em nova aba
 * Ficha: docs/sections/fichas/unidades.md (S17; revisão de 18/11/2026) · Conteúdo: content.json → secoes.unidades.mapa_rotulo, itens[].mapa_url (link
 * do Google Maps enviado pelo usuário), itens[].local
 * Elementos: unidades__card-mapa (link ≥ 48px, externo com rel seguro)
 * Os links curtos do Google Maps (maps.app.goo.gl) NÃO abrem dentro de iframe (o Google bloqueia), então o botão virou um link de texto para o app/site
 * do Maps: continua sem nenhum iframe e sem JS (server). Só é montado quando há `mapa_url` (campo vazio não renderiza). `titulo` vira o aria-label
 * ("Ver no mapa: <local>") para o leitor de tela distinguir os 3 links.
 */
import { UiLink } from "@/ui/UiLink";

type Props = {
  url: string;
  rotulo: string;
  /** Rótulo acessível do link (inclui o local). */
  titulo: string;
};

export function UnidadesMapa({ url, rotulo, titulo }: Props) {
  return (
    <UiLink href={url} externo ariaLabel={titulo} className="unidades__card-mapa self-start md:col-span-2 lg:col-span-1">
      {rotulo}
    </UiLink>
  );
}
