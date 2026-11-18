/**
 * Seção S03 · problema-solucao (slide "How it works / painel lateral" da Superpower)
 * Ficha: docs/sections/fichas/problema-solucao.md (revisão de 16/11/2026) · Conteúdo: content.json → secoes.problema_solucao
 * (titulo, subtitulo, rotulo_passos, itens[] {problema, solucao, icone, ancora, servico, perguntas, imagem, video?, chat?}, texto_apoio, cta),
 * com a descrição de cada passo vinda de secoes.servicos.itens[].descricao (pelo nome em `servico`) e as perguntas de
 * secoes.faq.perguntas[] (pelo texto em `perguntas`): nada duplicado no conteúdo. Rótulos dos botões: microcopy.acessibilidade
 * Elementos: problema-solucao__cabecalho, __titulo, __subtitulo, __stage (ProblemaSolucaoStage), __apoio, __cta
 * O stage ocupa a largura toda (sem padding vertical da seção); embaixo, o texto de apoio e o CTA principal.
 */
import { conteudo } from "@/lib/conteudo";
import { UiContainer } from "@/ui/UiContainer";
import { UiCtaPrincipal } from "@/ui/UiCtaPrincipal";
import { UiSecao } from "@/ui/UiSecao";
import { UiTitulo } from "@/ui/UiTitulo";
import { ProblemaSolucaoStage } from "./ProblemaSolucaoStage";

export function ProblemaSolucao() {
  const secao = conteudo.secoes.problema_solucao;
  const acessibilidade = conteudo.microcopy.acessibilidade;

  const itens = secao.itens.map((item) => {
    const servico = conteudo.secoes.servicos.itens.find((s) => s.nome === item.servico);
    if (!servico) throw new Error(`problema_solucao: serviço não encontrado em secoes.servicos: "${item.servico}"`);
    const perguntas = item.perguntas.map((texto) => {
      const q = conteudo.secoes.faq.perguntas.find((p) => p.pergunta === texto);
      if (!q) throw new Error(`problema_solucao: pergunta não encontrada em secoes.faq: "${texto}"`);
      return { pergunta: q.pergunta, resposta: q.resposta };
    });
    return { problema: item.problema, solucao: item.solucao, icone: item.icone, ancora: item.ancora, descricao: servico.descricao, perguntas, imagem: item.imagem, video: (item as { video?: { src: string; poster: string } }).video, chat: "chat" in item ? item.chat : undefined };
  });

  return (
    <UiSecao
      id="problema-solucao"
      bloco="problema-solucao"
      ficha="S03"
      conteudo="secoes.problema_solucao"
      labelledby="problema-solucao__titulo"
      semPadding
    >
      <ProblemaSolucaoStage
        itens={itens}
        rotuloPassos={secao.rotulo_passos}
        rotuloPausar={acessibilidade.pausar_passos}
        rotuloRetomar={acessibilidade.retomar_passos}
        rotuloFechar={acessibilidade.fechar_pergunta}
        inicialAvatar={conteudo.site.nome.charAt(0)}
        cabecalho={
          <div className="problema-solucao__cabecalho flex flex-col gap-3">
            <UiTitulo nivel="h2" id="problema-solucao__titulo" className="problema-solucao__titulo">
              {secao.titulo}
            </UiTitulo>
            <p className="problema-solucao__subtitulo text-body-lg text-foreground">{secao.subtitulo}</p>
          </div>
        }
      />
      <UiContainer classes="flex flex-col items-center gap-5 py-7 text-center">
        <p className="problema-solucao__apoio max-w-measure text-body-lg text-muted" data-anim="reveal">
          {secao.texto_apoio}
        </p>
        <UiCtaPrincipal local="problema-solucao" className="problema-solucao__cta" cheio="mobile" />
      </UiContainer>
    </UiSecao>
  );
}
