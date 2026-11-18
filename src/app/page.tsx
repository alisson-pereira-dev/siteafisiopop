/**
 * Home · todas as seções na ordem do mapa (T3.1–T3.11), sem o palco N2 (T4.1)
 * Ficha: docs/sections/fichas-secoes.md (índice) · Conteúdo: content/content.json → secoes.*
 * O Header, o <main id="conteudo">, o Footer, a barra e o flutuante ficam no layout; aqui só as seções.
 * Ordem (a da Superpower, 16/11/2026): hero · como-funciona (a faixa prova-rapida foi REMOVIDA em 18/11/2026) · problema-solucao(stage) · servicos(tabela) · para-quem · depoimentos(histórias) · unidades · preco-pop(compra) ·
 * unidades · faq · cta-final. Página de verificação dos tokens: /teste-tokens
 */
import { jsonLd, schemaLocalBusiness } from "@/lib/schema";
import { CtaFinal } from "@/secoes/cta-final/CtaFinal";
import { ComoFunciona } from "@/secoes/como-funciona/ComoFunciona";
import { Depoimentos } from "@/secoes/depoimentos/Depoimentos";
import { Hero } from "@/secoes/hero/Hero";
import { ParaQuem } from "@/secoes/para-quem/ParaQuem";
import { PrecoPop } from "@/secoes/preco-pop/PrecoPop";
import { ProblemaSolucao } from "@/secoes/problema-solucao/ProblemaSolucao";
import { Servicos } from "@/secoes/servicos/Servicos";
import { Unidades } from "@/secoes/unidades/Unidades";
import { UiPilha } from "@/ui/UiPilha";

export default function Home() {
  return (
    <>
      {/* JSON-LD LocalBusiness só com os campos confirmados de seo.home.schema (T5.4); sem FAQPage */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schemaLocalBusiness()) }} />
      <UiPilha>
        <Hero />
        <ComoFunciona />
      </UiPilha>
      <ProblemaSolucao />
      <Servicos />
      <ParaQuem />
      <UiPilha>
        <Depoimentos />
        <Unidades />
      </UiPilha>
      <PrecoPop />
      <CtaFinal />
    </>
  );
}
