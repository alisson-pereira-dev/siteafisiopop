/**
 * Regra · visibilidade da barra inferior e do botão flutuante (T2.2)
 * Ficha: docs/sections/fichas/global-acesso-fixo.md (campos 4, 7 e 9) · Regra: docs/jornada-e-motion.md §5
 * Conteúdo: nenhum (só estado). Consumidor: src/ui/CtaObservador.tsx (escreve data-estado/inert no DOM).
 *
 * Máquina PURA (sem DOM, sem React): entra o que o IntersectionObserver viu de cada CTA principal,
 * o foco na barra e o painel do menu; sai o estado da barra e do flutuante.
 *  - "Visível" = intersectionRatio ≥ 0,5 (LIMIAR_VISIVEL).
 *  - Esconder é IMEDIATO; mostrar só depois de 300 ms contínuos sem CTA visível (histerese, ATRASO_MOSTRAR_MS).
 *  - Dois CTAs separados por menos de 300 ms de rolagem não reexibem a barra.
 *  - Foco dentro da barra impede que ela esconda; painel aberto = barra `inert` (estado calculado preservado).
 *  - A barra segue "algum CTA visível"; o flutuante segue só o CTA `hero` (`heroVisivel`).
 *  - Estado inicial `pendente`; a 1ª resolução é imediata (≈1 quadro) e marcada em `resolucaoInicial`.
 */

/** Fração mínima do CTA dentro da área útil para contar como visível. */
export const LIMIAR_VISIVEL = 0.5;
/** Tempo contínuo sem CTA visível antes de mostrar de novo (igual a `--dur-base`). */
export const ATRASO_MOSTRAR_MS = 300;
/** CTAs que não contam como "outro CTA na tela" (a barra e o header; ver jornada-e-motion.md §5). */
export const LOCAIS_IGNORADOS: readonly string[] = ["barra", "header", "header-painel"];
/** `data-cta-local` do CTA cujo sinal governa o flutuante. */
export const LOCAL_HERO = "hero";

export type EstadoFixo = "pendente" | "visivel" | "oculta";

export type EstadoAcessoFixo = {
  readonly barra: EstadoFixo;
  /** Barra fora da ordem de Tab e da árvore de acessibilidade: escondida ou com o painel do menu aberto. */
  readonly barraInert: boolean;
  readonly flutuante: EstadoFixo;
  /** `true` só na atualização que tirou os dois do `pendente` (a UI não anima essa troca). */
  readonly resolucaoInicial: boolean;
};

export type RegraCta = {
  /** Registra/atualiza um CTA observado (`id` único por elemento). Ignora os locais de LOCAIS_IGNORADOS. */
  observar(id: string, local: string, ratio: number): void;
  /** Esquece um CTA (elemento saiu do DOM). */
  remover(id: string): void;
  /** Termina a 1ª rodada do observer: tira barra e flutuante do `pendente`, sem atraso. */
  iniciar(): void;
  definirFocoNaBarra(dentro: boolean): void;
  definirPainelAberto(aberto: boolean): void;
  estado(): EstadoAcessoFixo;
  /** Cancela os temporizadores pendentes. */
  destruir(): void;
};

type Alvo = {
  atual: EstadoFixo;
  timer: ReturnType<typeof setTimeout> | null;
};

export function criarRegraCta(aoMudar: (estado: EstadoAcessoFixo) => void): RegraCta {
  const ctas = new Map<string, { local: string; ratio: number }>();
  const barra: Alvo = { atual: "pendente", timer: null };
  const flutuante: Alvo = { atual: "pendente", timer: null };
  let iniciado = false;
  let focoNaBarra = false;
  let painelAberto = false;
  let ultimo: EstadoAcessoFixo | null = null;
  let resolucaoInicialPendente = false;

  const visivel = (ratio: number) => ratio >= LIMIAR_VISIVEL;
  const algumCtaVisivel = () => [...ctas.values()].some((c) => visivel(c.ratio));
  const heroVisivel = () => [...ctas.values()].some((c) => c.local === LOCAL_HERO && visivel(c.ratio));

  const cancelar = (alvo: Alvo) => {
    if (alvo.timer !== null) {
      clearTimeout(alvo.timer);
      alvo.timer = null;
    }
  };

  const instantaneo = (): EstadoAcessoFixo => ({
    barra: barra.atual,
    barraInert: barra.atual === "oculta" || painelAberto,
    flutuante: flutuante.atual,
    resolucaoInicial: resolucaoInicialPendente,
  });

  const emitir = () => {
    if (!iniciado) return;
    const novo = instantaneo();
    if (
      ultimo &&
      ultimo.barra === novo.barra &&
      ultimo.barraInert === novo.barraInert &&
      ultimo.flutuante === novo.flutuante
    ) {
      return;
    }
    ultimo = novo;
    resolucaoInicialPendente = false;
    aoMudar(novo);
  };

  /** Esconde na hora; mostra só depois de ATRASO_MOSTRAR_MS contínuos sem motivo para esconder. */
  const aplicar = (alvo: Alvo, deveEsconder: () => boolean) => {
    if (!iniciado) return;
    if (alvo.atual === "pendente") {
      alvo.atual = deveEsconder() ? "oculta" : "visivel";
      return;
    }
    if (deveEsconder()) {
      cancelar(alvo);
      alvo.atual = "oculta";
      return;
    }
    if (alvo.atual === "visivel") {
      cancelar(alvo);
      return;
    }
    if (alvo.timer !== null) return; // já contando os 300 ms contínuos
    alvo.timer = setTimeout(() => {
      alvo.timer = null;
      if (!deveEsconder()) {
        alvo.atual = "visivel";
        emitir();
      }
    }, ATRASO_MOSTRAR_MS);
  };

  const deveEsconderBarra = () => algumCtaVisivel() && !focoNaBarra;
  const deveEsconderFlutuante = () => heroVisivel();

  const reavaliar = () => {
    aplicar(barra, deveEsconderBarra);
    aplicar(flutuante, deveEsconderFlutuante);
    emitir();
  };

  return {
    observar(id, local, ratio) {
      if (LOCAIS_IGNORADOS.includes(local)) return;
      ctas.set(id, { local, ratio });
      reavaliar();
    },
    remover(id) {
      if (ctas.delete(id)) reavaliar();
    },
    iniciar() {
      if (iniciado) return;
      iniciado = true;
      resolucaoInicialPendente = true;
      reavaliar();
    },
    definirFocoNaBarra(dentro) {
      focoNaBarra = dentro;
      reavaliar();
    },
    definirPainelAberto(aberto) {
      painelAberto = aberto;
      emitir();
    },
    estado: instantaneo,
    destruir() {
      cancelar(barra);
      cancelar(flutuante);
    },
  };
}
