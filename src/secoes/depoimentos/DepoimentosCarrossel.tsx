/**
 * Seção S10 · depoimentos — DepoimentosCarrossel (client): o carrossel "sp2-testimonials2" do slide do usuário
 * Ficha: docs/sections/fichas/depoimentos.md (revisão de 16/11/2026) · Conteúdo: content.json → secoes.depoimentos.itens (via
 * DepoimentosCard) e microcopy.acessibilidade (pausar_depoimentos, retomar_depoimentos, ir_para_depoimento)
 * Elementos: depoimentos__slider, __faixa, __slide, __navegacao, __segmentos, __segmento, __segmento-progresso, __contador, __pausa
 * Faixa com os cards em linha; o ativo alinhado à esquerda e os vizinhos a 50% de opacidade. Loop infinito com 3 cópias (as cópias
 * só existem depois da hidratação, com aria-hidden + inert); ao passar do último para o primeiro a faixa anima até a cópia seguinte e,
 * em transitionend, teleporta sem transição para a cópia do meio. Barra segmentada: o segmento ativo alarga (flex-grow 8) e seu
 * preenchimento cresce de 0 a 100% em 8 s, LINEAR (rAF), e então avança. Clicar num segmento vai ao card e reinicia o relógio.
 * EXCEÇÃO documentada em src/app/carrossel.css. Acessibilidade (acréscimos): sem autoplay em reduced-motion; pausa com mouse ou foco
 * dentro do carrossel e por botão (WCAG 2.2.2). ARRASTAR (17/11/2026): puxar a faixa com mouse ou dedo troca de card (>60 px) ou a devolve ao lugar. Sem JS: os depoimentos ficam empilhados e a barra some. Nenhum setInterval nem scroll.
 */
"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as EventoPonteiro, type ReactNode } from "react";
import { useHidratado, useMovimentoReduzido } from "@/lib/cliente";
import { UiIcone } from "@/ui/UiIcone";

type Props = {
  /** Um nó por depoimento (DepoimentosCard, vindo do servidor). */
  cards: readonly ReactNode[];
  rotuloIrPara: string;
  rotuloPausar: string;
  rotuloRetomar: string;
};

/** Tempo de cada depoimento (a referência mede ~8 s). */
const DURACAO_MS = 8000;
/** Arrastar: distância (px) que separa um clique de um arraste, e a que decide trocar de card ao soltar. */
const LIMIAR_ARRASTE_PX = 6;
const LIMIAR_TROCA_PX = 60;

export function DepoimentosCarrossel({ cards, rotuloIrPara, rotuloPausar, rotuloRetomar }: Props) {
  const n = cards.length;
  const loop = useHidratado(); // cópias do loop só depois da hidratação
  const [atual, setAtual] = useState(0); // card lógico 0..n-1
  const [pos, setPos] = useState(n); // posição absoluta na faixa (cópia do meio = n..2n-1)
  const [salto, setSalto] = useState(true); // sem transição (montagem e teleporte)
  const [aSaltar, setASaltar] = useState(false); // há teleporte pendente para depois da transição
  const [ciclo, setCiclo] = useState(0);
  const [tocando, setTocando] = useState(true);
  const reduzido = useMovimentoReduzido();
  const progresso = useRef<Array<HTMLSpanElement | null>>([]);
  const pausaPorInteracao = useRef(false);
  const faixa = useRef<HTMLDivElement>(null);
  const arraste = useRef<{ id: number; x0: number; dx: number; ativo: boolean } | null>(null);
  const [arrastando, setArrastando] = useState(false);

  // ao soltar, o deslocamento do dedo/mouse sai DEPOIS de a transição voltar (a faixa desliza até o card, não pula)
  useEffect(() => {
    if (!arrastando) faixa.current?.style.removeProperty("--carrossel-arraste");
  }, [arrastando]);

  // na montagem e depois de cada teleporte a faixa é posicionada SEM transição; a transição volta no quadro seguinte
  useEffect(() => {
    if (!salto || !loop) return;
    let q2 = 0;
    const q1 = requestAnimationFrame(() => {
      q2 = requestAnimationFrame(() => setSalto(false));
    });
    return () => {
      cancelAnimationFrame(q1);
      cancelAnimationFrame(q2);
    };
  }, [salto, loop]);

  const ir = (i: number) => {
    const adiante = atual === n - 1 && i === 0;
    const atras = atual === 0 && i === n - 1;
    setAtual(i);
    setPos(adiante ? 2 * n : atras ? n - 1 : n + i);
    setASaltar(adiante || atras);
    setCiclo((c) => c + 1);
  };

  // autoplay: o preenchimento do segmento ativo cresce linear de 0 a 100% em 8 s e então avança
  useEffect(() => {
    if (!loop || reduzido || !tocando || n < 2) return;
    let quadro = 0;
    let decorrido = 0;
    let ultimo = performance.now();
    const tique = (agora: number) => {
      const delta = Math.min(agora - ultimo, 100);
      ultimo = agora;
      if (!pausaPorInteracao.current) decorrido += delta;
      const p = Math.min(decorrido / DURACAO_MS, 1);
      const barra = progresso.current[atual];
      if (barra) barra.style.width = `${p * 100}%`;
      if (p >= 1) {
        const proximo = (atual + 1) % n;
        const adiante = atual === n - 1;
        setAtual(proximo);
        setPos(adiante ? 2 * n : n + proximo);
        setASaltar(adiante);
        return;
      }
      quadro = requestAnimationFrame(tique);
    };
    quadro = requestAnimationFrame(tique);
    return () => cancelAnimationFrame(quadro);
  }, [atual, ciclo, loop, reduzido, tocando, n]);

  // arrastar com mouse, caneta ou dedo (pointer events; `touch-action: pan-y` deixa a rolagem vertical com o navegador, e nenhum evento é cancelado)
  const aoPressionar = (e: EventoPonteiro<HTMLDivElement>) => {
    if (!loop || n < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    arraste.current = { id: e.pointerId, x0: e.clientX, dx: 0, ativo: false };
  };
  const aoMover = (e: EventoPonteiro<HTMLDivElement>) => {
    const a = arraste.current;
    if (!a || a.id !== e.pointerId) return;
    a.dx = e.clientX - a.x0;
    if (!a.ativo) {
      if (Math.abs(a.dx) < LIMIAR_ARRASTE_PX) return;
      a.ativo = true;
      e.currentTarget.setPointerCapture(e.pointerId); // o clique que sobra vai para o slider: soltar sobre um link não o abre
      pausaPorInteracao.current = true;
      setArrastando(true);
    }
    faixa.current?.style.setProperty("--carrossel-arraste", `${a.dx}px`);
  };
  const aoSoltar = (e: EventoPonteiro<HTMLDivElement>) => {
    const a = arraste.current;
    if (!a || a.id !== e.pointerId) return;
    arraste.current = null;
    if (!a.ativo) return;
    if (e.pointerType !== "mouse") pausaPorInteracao.current = false; // o mouse segue por cima: quem solta a pausa é o mouseleave
    setArrastando(false);
    if (a.dx <= -LIMIAR_TROCA_PX) ir((atual + 1) % n);
    else if (a.dx >= LIMIAR_TROCA_PX) ir((atual - 1 + n) % n);
  };

  const aoTerminarTransicao = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform" || !aSaltar) return;
    setASaltar(false);
    setSalto(true);
    setPos(n + atual);
  };

  const copias = loop ? [0, 1, 2] : [1];
  const posicao = loop ? pos : 0;
  const larguraPreenchida = (k: number): CSSProperties | undefined => {
    if (reduzido) return k === atual ? { width: "100%" } : { width: 0 };
    return k === atual ? undefined : { width: 0 };
  };

  return (
    <>
      <div
        className="depoimentos__slider"
        onMouseEnter={() => (pausaPorInteracao.current = true)}
        onMouseLeave={() => (pausaPorInteracao.current = false)}
        onFocus={() => (pausaPorInteracao.current = true)}
        onBlur={() => (pausaPorInteracao.current = false)}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        <div
          ref={faixa}
          className="depoimentos__faixa"
          data-anim="carrossel-faixa"
          data-estado={salto ? "salto" : arrastando ? "arrastando" : undefined}
          style={{ "--carrossel-pos": posicao } as CSSProperties}
          onTransitionEnd={aoTerminarTransicao}
        >
          {copias.map((copia) =>
            cards.map((card, i) => {
              const principal = copia === 1;
              const indice = loop ? (copia === 0 ? 0 : copia === 1 ? n : 2 * n) + i : i;
              return (
                <div
                  key={`${copia}-${i}`}
                  className="depoimentos__slide"
                  data-anim="carrossel-slide"
                  data-estado={indice === posicao ? "ativa" : "inativa"}
                  aria-hidden={principal ? undefined : true}
                  inert={principal ? undefined : true}
                >
                  {card}
                </div>
              );
            }),
          )}
        </div>
      </div>
      <div className="depoimentos__navegacao items-center gap-5 pt-5" data-anim="carrossel-navegacao">
        <div className="depoimentos__segmentos flex w-full max-w-container gap-2 md:w-2/3">
          {cards.map((_, k) => (
            <button
              key={k}
              type="button"
              className="depoimentos__segmento"
              data-anim="carrossel-segmento"
              data-estado={k === atual ? "ativa" : "inativa"}
              aria-label={`${rotuloIrPara} ${k + 1}`}
              aria-current={k === atual}
              onClick={() => ir(k)}
            >
              <span
                className="depoimentos__segmento-progresso"
                data-anim="carrossel-progresso"
                ref={(el) => {
                  progresso.current[k] = el;
                }}
                style={larguraPreenchida(k)}
              />
            </button>
          ))}
        </div>
        <p className="depoimentos__contador text-small text-subtle">
          {atual + 1} / {n}
        </p>
        {reduzido ? null : (
          <button
            type="button"
            className="depoimentos__pausa inline-flex h-touch w-touch items-center justify-center rounded-full text-foreground"
            aria-label={tocando ? rotuloPausar : rotuloRetomar}
            aria-pressed={!tocando}
            onClick={() => setTocando((t) => !t)}
          >
            <UiIcone nome={tocando ? "pause" : "play"} tamanho={20} />
          </button>
        )}
      </div>
    </>
  );
}
