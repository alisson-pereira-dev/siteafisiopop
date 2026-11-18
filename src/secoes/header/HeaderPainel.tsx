/**
 * Seção S00 · header — HeaderPainel (client): botão de menu (grade de pontos) + gaveta lateral
 * Ficha: docs/sections/fichas/header.md (S00; campos 4, 7, 8, 9) · Conteúdo: content.json → site.menu,
 * microcopy.acessibilidade (titulo_menu, abrir_menu, fechar_menu, navegacao_principal)
 * Elementos: header__botao-menu (+ __botao-menu-pontos, __botao-menu-ponto), header__painel-fundo, header__painel
 * (+ __painel-cabecalho, __painel-titulo, __painel-fechar, __painel-link; __painel-cta vem por `children`)
 * Comportamento: aria-expanded/aria-controls; foco entra na gaveta (no botão de fechar), fica preso (Tab/Shift+Tab) e volta ao botão;
 * fecha com Esc, toque no fundo escurecido, no X ou num link; o resto da página e da barra fica `inert`; rolagem do fundo travada
 * (overflow no body); avisa o CtaObservador (barra inferior fica inert). Receitas `painel`, `painel-fundo`, `header-menu`: src/app/header.css.
 * O botão aparece em todas as larguras (os links só ficam inline a partir de 1280px). Sem JS o botão fica escondido e o Header
 * mostra os links como lista simples (`noscript`).
 */
"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { hrefDaHome } from "@/lib/ancora";
import { avisarPainelMenu } from "@/lib/eventos";

type Link = { readonly rotulo: string; readonly destino: string };

type Props = {
  links: readonly Link[];
  titulo: string;
  rotuloAbrir: string;
  rotuloFechar: string;
  rotuloNavegacao: string;
  /** CTA principal da gaveta (server component, `local="header-painel"`). */
  children: ReactNode;
};

const FOCAVEIS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Grade 3×3; o "X" é a mesma grade com os pontos 2, 4, 6 e 8 invisíveis. */
const PONTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const PONTOS_DO_X_OCULTOS: readonly number[] = [2, 4, 6, 8];

function Pontos({ forma }: { forma: "grade" | "x" }) {
  return (
    <span className="header__botao-menu-pontos grid grid-cols-3 gap-1" aria-hidden="true">
      {PONTOS.map((n) => (
        <span
          key={n}
          className="header__botao-menu-ponto h-1 w-1 rounded-full [background-color:currentColor]"
          style={forma === "x" && PONTOS_DO_X_OCULTOS.includes(n) ? { visibility: "hidden" } : undefined}
        />
      ))}
    </span>
  );
}

export function HeaderPainel({ links, titulo, rotuloAbrir, rotuloFechar, rotuloNavegacao, children }: Props) {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLElement>(null);

  const fechar = useCallback(() => setAberto(false), []);

  // Efeitos do estado aberto: inert no resto, rolagem travada, foco preso, Esc, toque fora.
  useEffect(() => {
    if (!aberto) return;

    const botaoEl = botao.current;
    const raiz = painel.current?.closest<HTMLElement>('[data-section="header"]') ?? null;
    const barra = painel.current?.parentElement ?? null;
    const marcados: HTMLElement[] = [];
    const marcar = (el: Element) => {
      if (el instanceof HTMLElement && !el.inert) {
        el.inert = true;
        marcados.push(el);
      }
    };
    for (const filho of Array.from(document.body.children)) {
      // O header continua ativo; a barra inferior é cuidada pelo CtaObservador (estado calculado + painel).
      if (filho === raiz || filho.tagName === "SCRIPT" || filho.matches('[data-anim="barra-cta"]')) continue;
      marcar(filho);
    }
    // Dentro do header, só a gaveta (e o fundo escurecido) ficam ativos: logo, links, CTA e botão de menu ficam inert.
    for (const irmao of Array.from(barra?.children ?? [])) {
      if (irmao === painel.current || irmao.matches('[data-anim~="painel-fundo"]')) continue;
      marcar(irmao);
    }
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    avisarPainelMenu(true);

    painel.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setAberto(false);
        return;
      }
      if (e.key !== "Tab") return;
      const itens = Array.from(painel.current?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []);
      if (itens.length === 0) return;
      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];
      const ativo = document.activeElement;
      if (e.shiftKey && ativo === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && ativo === ultimo) {
        e.preventDefault();
        primeiro.focus();
      } else if (!itens.includes(ativo as HTMLElement)) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    const aoTocarFora = (e: PointerEvent) => {
      const alvo = e.target as Node | null;
      if (alvo && !painel.current?.contains(alvo) && !botao.current?.contains(alvo)) setAberto(false);
    };

    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("pointerdown", aoTocarFora);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("pointerdown", aoTocarFora);
      for (const el of marcados) el.inert = false;
      document.body.style.overflow = overflowAnterior;
      avisarPainelMenu(false);
      botaoEl?.focus({ preventScroll: true }); // o foco volta ao botão que abriu (já sem inert)
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={botao}
        type="button"
        className="header__botao-menu inline-flex h-touch w-touch shrink-0 items-center justify-center rounded-full [html:not([data-js])_&]:hidden"
        aria-expanded={aberto}
        aria-controls="header-painel"
        aria-label={aberto ? rotuloFechar : rotuloAbrir}
        data-anim="header-menu"
        onClick={() => setAberto((v) => !v)}
      >
        <Pontos forma="grade" />
      </button>
      <div className="header__painel-fundo" data-anim="painel-fundo" data-estado={aberto ? "aberto" : undefined} aria-hidden="true" />
      <nav
        ref={painel}
        id="header-painel"
        className="header__painel z-overlay flex flex-col overflow-y-auto rounded-l-lg bg-bg p-5 shadow-4"
        aria-label={rotuloNavegacao}
        data-anim="painel"
        data-estado={aberto ? "aberto" : undefined}
        inert={!aberto}
      >
        <div className="header__painel-cabecalho flex items-center justify-between">
          <p className="header__painel-titulo font-title text-h2 font-heading text-foreground">{titulo}</p>
          <button
            type="button"
            className="header__painel-fechar inline-flex h-touch w-touch items-center justify-center rounded-full text-foreground"
            aria-label={rotuloFechar}
            data-anim="botao"
            onClick={fechar}
          >
            <Pontos forma="x" />
          </button>
        </div>
        <div className="header__painel-lista flex flex-col gap-2 py-5">
          {links.map((link) => (
            <a
              key={link.destino}
              href={hrefDaHome(link.destino)}
              className="header__painel-link flex min-h-touch items-center font-title text-h2 font-heading text-foreground"
              onClick={fechar}
            >
              {link.rotulo}
            </a>
          ))}
        </div>
        {children}
      </nav>
    </>
  );
}
