/**
 * Seção S03 · problema-solucao — ProblemaSolucaoStage (client): o slide "How it works / painel lateral" da Superpower
 * Ficha: docs/sections/fichas/problema-solucao.md (revisão de 16/11/2026) · Conteúdo: content.json → secoes.problema_solucao.itens
 * (problema, solucao, icone, ancora, servico, perguntas, imagem, video?); a descrição vem de secoes.servicos e as perguntas de secoes.faq
 * (resolvidas no servidor, em ProblemaSolucao.tsx); `microcopy.acessibilidade` dá os rótulos dos botões
 * Elementos: problema-solucao__stage, __media, __visual, __veu, __lateral, __controles, __passos, __passo, __passo-anel,
 * __passo-numero, __passo-rotulo, __pausa, __copias, __copia, __copia-corpo, __copia-titulo, __copia-texto, __copia-link,
 * __faq, __faq-item, __faq-item-icone, __modal, __modal-corpo, __modal-fechar, __modal-titulo, __modal-texto
 * Slide do usuário (EXCEÇÃO documentada em src/app/stage.css): a pílula tem um anel que enche em 6 s e avança sozinho (autoplay por
 * requestAnimationFrame, volta ao 1º depois do último); clicar num passo vai até ele e reinicia o anel; texto e mídia trocam por
 * crossfade; cada pergunta abre um modal (<dialog>). Acessibilidade: SEM autoplay em reduced-motion; pausa com o mouse ou o foco
 * dentro do painel e com o botão de pausa; a cópia inativa só some por opacity (leitor de tela segue lendo; botões/links saem do Tab).
 * Vídeo de fundo (item.video: src + poster): mudo, em loop, playsinline; só toca quando o passo está ativo, o stage está na tela
 * (um IntersectionObserver), o usuário não pausou e não há reduced-motion (aí só o pôster); recomeça do início a cada visita ao passo.
 * No mobile (revisão de 17/11/2026, referência do usuário) a ordem é: título → pílula dos passos → título e descrição do passo → perguntas → MÍDIA por último,
 * num cartão arredondado 4:3 (order-last; nada de texto sobre a mídia); a partir de 768 ela é o fundo do stage.
 * Chat de vidro (item.chat) como IRMÃO do <video> dentro da camada de mídia (ProblemaSolucaoChat; receitas em src/app/chat.css).
 * Tom da mídia (item.imagem.tom = "escuro"): quando a mídia do passo ativo é escura, o texto do painel vira claro (CSS: stage-raiz[data-tom]).
 * Sem JS: pílula some, as 5 cópias ficam empilhadas e o vídeo mostra só o pôster. Nenhum listener de scroll e nenhum setInterval.
 */
"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { midiaPendente, normalizarSrc } from "@/lib/midia";
import { slug } from "@/lib/slug";
import { ProblemaSolucaoChat, type ConteudoChat } from "./ProblemaSolucaoChat";
import { UiIcone } from "@/ui/UiIcone";
import { UiLink } from "@/ui/UiLink";

type Pergunta = { readonly pergunta: string; readonly resposta: string };
type Item = {
  readonly problema: string;
  readonly solucao: string;
  readonly icone: string;
  readonly ancora: string;
  readonly descricao: string;
  readonly perguntas: readonly Pergunta[];
  readonly imagem: { readonly src: string; readonly alt: string; readonly tom?: string };
  readonly video?: { readonly src: string; readonly poster: string };
  readonly chat?: ConteudoChat;
};

type Props = {
  itens: readonly Item[];
  cabecalho: ReactNode;
  rotuloPassos: string;
  rotuloPausar: string;
  rotuloRetomar: string;
  rotuloFechar: string;
  /** Inicial do nome da clínica (avatar do chat). */
  inicialAvatar: string;
};

/** Tempo de cada passo (a referência mede ~6 s) e circunferência do anel (2π · 10,9). */
const DURACAO_MS = 6000;
/** Passo com chat (e/ou vídeo): dura o ciclo de 8 s do chat (senão a troca cortaria a última mensagem). */
const DURACAO_COM_CHAT_MS = 8000;
const CIRCUNFERENCIA = 68.487;

export function ProblemaSolucaoStage({ itens, cabecalho, rotuloPassos, rotuloPausar, rotuloRetomar, rotuloFechar, inicialAvatar }: Props) {
  const [ativo, setAtivo] = useState(0);
  const [ciclo, setCiclo] = useState(0);
  const [tocando, setTocando] = useState(true);
  const [reduzido, setReduzido] = useState(false);
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const aneis = useRef<Array<SVGCircleElement | null>>([]);
  const pausaPorInteracao = useRef(false);
  const modal = useRef<HTMLDialogElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const [naTela, setNaTela] = useState(false);
  const total = itens.length;
  const estado = (i: number) => (i === ativo ? "ativa" : "inativa");

  // reduced-motion: sem autoplay
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = () => setReduzido(consulta.matches);
    atualizar();
    consulta.addEventListener("change", atualizar);
    return () => consulta.removeEventListener("change", atualizar);
  }, []);

  // autoplay: o anel do passo ativo enche de 68,487 → 0 em 6 s (linear) e avança; pausa soma tempo zero (aba oculta também)
  useEffect(() => {
    if (reduzido || !tocando || total < 2) return;
    let quadro = 0;
    let decorrido = 0;
    let ultimo = performance.now();
    const tique = (agora: number) => {
      const delta = Math.min(agora - ultimo, 100);
      ultimo = agora;
      if (!pausaPorInteracao.current) decorrido += delta;
      const progresso = Math.min(decorrido / (itens[ativo]?.video || itens[ativo]?.chat ? DURACAO_COM_CHAT_MS : DURACAO_MS), 1);
      aneis.current[ativo]?.style.setProperty("stroke-dashoffset", String(CIRCUNFERENCIA * (1 - progresso)));
      if (progresso >= 1) {
        setAtivo((a) => (a + 1) % total);
        return;
      }
      quadro = requestAnimationFrame(tique);
    };
    quadro = requestAnimationFrame(tique);
    return () => cancelAnimationFrame(quadro);
  }, [ativo, ciclo, reduzido, tocando, total, itens]);

  // vídeo: só roda enquanto o stage está na tela (um IntersectionObserver)
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting), { threshold: 0.25 });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // vídeo do passo ativo: toca (mudo, em loop) quando ativo + na tela + sem pausa + sem reduced-motion; recomeça do início a cada visita
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === ativo && naTela && !reduzido && tocando) {
        if (v.paused) {
          v.currentTime = 0;
          v.play().catch(() => {});
        }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, [ativo, naTela, reduzido, tocando]);

  // modal nativo
  useEffect(() => {
    const dialogo = modal.current;
    if (pergunta && dialogo && !dialogo.open) dialogo.showModal();
  }, [pergunta]);

  const ir = (i: number) => {
    setAtivo(i);
    setCiclo((c) => c + 1);
  };
  const deslocamento = (i: number) => (i < ativo || (reduzido && i === ativo) ? { strokeDashoffset: 0 } : undefined);

  return (
    <div ref={raiz} className="problema-solucao__stage relative isolate flex min-h-[var(--altura-stage)] flex-col overflow-hidden bg-surface" data-anim="stage-raiz" data-tom={itens[ativo]?.imagem.tom === "escuro" ? "escuro" : "claro"}>
      <div className="problema-solucao__media relative order-last mx-2 mb-2 aspect-card overflow-hidden rounded-md md:absolute md:inset-0 md:-z-10 md:order-none md:m-0 md:aspect-auto md:rounded-none" aria-hidden="true">
        {itens.map((item, i) => (
          <div key={item.solucao} className="problema-solucao__visual overflow-hidden" data-anim="stage-visual" data-estado={estado(i)}>
            {item.video ? (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className="problema-solucao__video h-full w-full object-cover"
                data-anim="chat-video"
                src={normalizarSrc(item.video.src)}
                poster={normalizarSrc(item.video.poster)}
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
              />
            ) : midiaPendente(item.imagem.src) ? null : (
              <Image src={normalizarSrc(item.imagem.src)} alt="" fill sizes="100vw" className="object-cover" priority={i === 0} />
            )}
            {item.chat ? <ProblemaSolucaoChat chat={item.chat} inicial={inicialAvatar} rodando={i === ativo && naTela && !reduzido && tocando} reduzido={reduzido} /> : null}
          </div>
        ))}
      </div>
      <span className="problema-solucao__veu absolute inset-y-0 left-0 -z-10 hidden w-4/5 md:block lg:w-3/5" data-anim="stage-vidro" aria-hidden="true" />
      <div
        className="problema-solucao__lateral relative flex flex-col gap-6 px-5 py-section md:w-3/5 lg:w-1/2 lg:pl-9"
        data-anim="stage-lateral"
        onMouseEnter={() => (pausaPorInteracao.current = true)}
        onMouseLeave={() => (pausaPorInteracao.current = false)}
        onFocus={() => (pausaPorInteracao.current = true)}
        onBlur={() => (pausaPorInteracao.current = false)}
      >
        {cabecalho}
        <div className="problema-solucao__controles items-center gap-2" data-anim="stage-passos">
          <nav className="problema-solucao__passos flex flex-wrap items-center gap-1" aria-label={rotuloPassos}>
            {itens.map((item, i) => (
              <button
                key={item.solucao}
                type="button"
                className="problema-solucao__passo flex h-touch items-center rounded-full p-2 text-small text-foreground"
                data-anim="stage-passo"
                data-estado={estado(i)}
                aria-pressed={i === ativo}
                onClick={() => ir(i)}
              >
                <span className="problema-solucao__passo-ponto relative flex h-5 w-5 flex-none items-center justify-center">
                  <svg className="problema-solucao__passo-anel" data-anim="stage-anel" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10.9" />
                    <circle
                      cx="12"
                      cy="12"
                      r="10.9"
                      data-anim="stage-anel-fill"
                      ref={(el) => {
                        aneis.current[i] = el;
                      }}
                      style={deslocamento(i)}
                    />
                  </svg>
                  <span className="problema-solucao__passo-numero relative text-micro">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="problema-solucao__passo-rotulo" data-anim="stage-passo-rotulo">
                  {item.problema}
                </span>
              </button>
            ))}
          </nav>
          {reduzido ? null : (
            <button
              type="button"
              className="problema-solucao__pausa inline-flex h-touch w-touch items-center justify-center rounded-full text-foreground"
              aria-label={tocando ? rotuloPausar : rotuloRetomar}
              aria-pressed={!tocando}
              onClick={() => setTocando((t) => !t)}
            >
              <UiIcone nome={tocando ? "pause" : "play"} tamanho={20} />
            </button>
          )}
        </div>
        <div className="problema-solucao__copias" data-anim="stage-copias">
          {itens.map((item, i) => {
            const foco = i === ativo ? undefined : -1;
            return (
              <div
                key={item.solucao}
                className="problema-solucao__copia"
                data-item={slug(item.solucao)}
                data-anim="stage-copia"
                data-estado={estado(i)}
              >
                <div className="problema-solucao__copia-corpo flex flex-col gap-3 md:max-w-measure">
                  <h3 className="problema-solucao__copia-titulo font-title text-h3 font-heading text-foreground">{item.problema}</h3>
                  <p className="problema-solucao__copia-texto text-body-lg text-foreground">{item.descricao}</p>
                  <UiLink href={item.ancora} tom="texto" seta className="problema-solucao__copia-link self-start" tabIndex={foco}>
                    <UiIcone nome={item.icone} contorno tamanho={20} />
                    {item.solucao}
                  </UiLink>
                </div>
                {item.perguntas.length > 0 ? (
                  <div className="problema-solucao__faq mt-auto flex flex-col gap-1 pt-6 md:max-w-measure">
                    {item.perguntas.map((q) => (
                      <button
                        key={q.pergunta}
                        type="button"
                        className="problema-solucao__faq-item flex min-h-touch items-center justify-between gap-3 rounded-md py-2 pl-4 pr-2 text-left text-body text-foreground"
                        data-anim="stage-faq"
                        tabIndex={foco}
                        onClick={() => setPergunta(q)}
                      >
                        {q.pergunta}
                        <span className="problema-solucao__faq-item-icone flex h-6 w-6 flex-none items-center justify-center rounded-sm" data-anim="stage-faq-icone">
                          <UiIcone nome="plus" tamanho={20} />
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <dialog
        ref={modal}
        className="problema-solucao__modal m-auto w-[calc(100%-2*var(--space-4))] max-w-measure rounded-lg bg-surface p-0 text-foreground shadow-4 backdrop:bg-overlay"
        data-anim="stage-modal"
        onClose={() => setPergunta(null)}
        onClick={(e) => {
          if (e.target === modal.current) modal.current?.close();
        }}
      >
        <div className="problema-solucao__modal-corpo relative flex flex-col gap-3 p-6 pr-8 md:p-7">
          <button
            type="button"
            className="problema-solucao__modal-fechar absolute right-3 top-3 inline-flex h-touch w-touch items-center justify-center rounded-full"
            aria-label={rotuloFechar}
            onClick={() => modal.current?.close()}
          >
            <UiIcone nome="x" tamanho={24} />
          </button>
          <h3 className="problema-solucao__modal-titulo pr-7 font-title text-h3 font-heading">{pergunta?.pergunta}</h3>
          <p className="problema-solucao__modal-texto text-body text-muted">{pergunta?.resposta}</p>
        </div>
      </dialog>
    </div>
  );
}
