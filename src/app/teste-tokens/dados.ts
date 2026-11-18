/**
 * Página interna · teste-tokens (T1.1)
 * Ficha: n/a (página de verificação, não é seção do site) · Conteúdo: não usa content.json
 * Fonte dos dados: styles/design-tokens.css (valores) e docs/design-system.md (razões de contraste documentadas)
 * Elementos: ver page.tsx
 *
 * Este arquivo lê os tokens do CSS e calcula o contraste WCAG, para a página comparar
 * "o que o design system documenta" com "o que os tokens realmente dão".
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ------------------------------------------------------------------ tokens */

/** Lê as variáveis do primeiro bloco `:root { ... }` de um CSS de tokens. */
export function lerTokens(css: string): Record<string, string> {
  const bloco = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const tokens: Record<string, string> = {};
  for (const m of bloco.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

export const CAMINHO_TOKENS = join(process.cwd(), "styles", "design-tokens.css");
export const tokens = lerTokens(readFileSync(CAMINHO_TOKENS, "utf8"));

/* ---------------------------------------------------------------- contraste */

function canal(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminância relativa WCAG de uma cor `#RRGGBB`. */
export function luminancia(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Cor hexadecimal #RRGGBB esperada, recebi "${hex}"`);
  const n = parseInt(m[1], 16);
  return 0.2126 * canal((n >> 16) & 255) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
}

/** Razão de contraste WCAG entre duas cores `#RRGGBB` (1 a 21). */
export function razaoContraste(a: string, b: string): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

/* ------------------------------------------------- pares de contraste (doc) */

export type TipoPar = "texto" | "texto-grande" | "componente" | "proibido";

export type ParContraste = {
  nome: string;
  /** token do primeiro plano e do fundo (ver styles/design-tokens.css) */
  frente: string;
  fundo: string;
  /** razão documentada em docs/design-system.md */
  doc: number;
  tipo: TipoPar;
};

export const MINIMO: Record<Exclude<TipoPar, "proibido">, number> = {
  texto: 4.5,
  "texto-grande": 3,
  componente: 3,
};

/**
 * Mesma ordem da tabela "Contraste verificado (WCAG AA)" de docs/design-system.md.
 * O teste dados.test.ts confere ordem, cores e razões contra o .md.
 */
export const PARES: ParContraste[] = [
  { nome: "Texto principal", frente: "--color-text", fundo: "--color-bg", doc: 16.75, tipo: "texto" },
  { nome: "Texto secundário", frente: "--color-text-muted", fundo: "--color-bg", doc: 9.28, tipo: "texto" },
  { nome: "Texto de apoio/legenda", frente: "--color-text-subtle", fundo: "--color-bg", doc: 5.56, tipo: "texto" },
  { nome: "Texto de apoio sobre rosa fundo", frente: "--color-text-subtle", fundo: "--color-bg-alt", doc: 5.17, tipo: "texto" },
  { nome: "Texto principal sobre rosa fundo", frente: "--color-text", fundo: "--color-bg-alt", doc: 15.58, tipo: "texto" },
  { nome: "Botão principal (texto)", frente: "--color-primary-contrast", fundo: "--color-primary", doc: 5.09, tipo: "texto" },
  { nome: "Botão principal hover", frente: "--color-primary-contrast", fundo: "--color-primary-hover", doc: 6.51, tipo: "texto" },
  { nome: "Link / texto rosa sobre fundo", frente: "--color-primary", fundo: "--color-bg", doc: 5.03, tipo: "texto" },
  { nome: "Texto rosa sobre rosa fundo", frente: "--color-primary", fundo: "--color-bg-alt", doc: 4.68, tipo: "texto" },
  { nome: "Botão teal (texto)", frente: "--color-secondary-contrast", fundo: "--color-secondary", doc: 4.93, tipo: "texto" },
  { nome: "Texto teal sobre fundo", frente: "--color-secondary", fundo: "--color-bg", doc: 4.87, tipo: "texto" },
  { nome: "Texto tinta sobre teal claro", frente: "--color-text", fundo: "--color-bg-teal", doc: 14.7, tipo: "texto" },
  { nome: "Texto tinta sobre rosa claro (selo)", frente: "--color-text", fundo: "--color-primary-soft", doc: 12.95, tipo: "texto" },
  { nome: "Texto branco sobre faixa escura", frente: "--color-text-inverse", fundo: "--color-bg-inverse", doc: 16.96, tipo: "texto" },
  { nome: "Rosa de destaque sobre escuro", frente: "--color-on-inverse-primary", fundo: "--color-bg-inverse", doc: 6.35, tipo: "texto" },
  { nome: "Teal vivo sobre escuro", frente: "--color-on-inverse-accent", fundo: "--color-bg-inverse", doc: 10.75, tipo: "texto" },
  { nome: "Destaque serifado rosa sobre fundo (≥ 32px)", frente: "--color-brand-pink", fundo: "--color-bg", doc: 4.04, tipo: "texto-grande" },
  { nome: "Destaque serifado rosa sobre rosa fundo (≥ 32px)", frente: "--color-brand-pink", fundo: "--color-bg-alt", doc: 3.76, tipo: "texto-grande" },
  { nome: "Ícone WhatsApp (tinta) sobre verde", frente: "--color-whatsapp-contrast", fundo: "--color-whatsapp", doc: 8.55, tipo: "componente" },
  { nome: "Borda de campo/controle", frente: "--color-border-strong", fundo: "--color-bg", doc: 3.58, tipo: "componente" },
  { nome: "Anel de foco", frente: "--color-focus-ring", fundo: "--color-bg", doc: 16.75, tipo: "componente" },
  { nome: "Sucesso", frente: "--color-success", fundo: "--color-success-bg", doc: 4.74, tipo: "texto" },
  { nome: "Atenção", frente: "--color-warning", fundo: "--color-warning-bg", doc: 4.96, tipo: "texto" },
  { nome: "Erro", frente: "--color-danger", fundo: "--color-danger-bg", doc: 5.72, tipo: "texto" },
];

/** Combinação PROIBIDA (regra de uso em docs/design-system.md): deve reprovar. */
export const PAR_PROIBIDO: ParContraste = {
  nome: "Teal de ação sobre teal claro (uso proibido)",
  frente: "--color-secondary",
  fundo: "--color-bg-teal",
  doc: 4.28,
  tipo: "proibido",
};

/* ----------------------------------------------------------------- paleta */

export type Amostra = { token: string; classe: string };
export type GrupoPaleta = { grupo: string; itens: Amostra[] };

/** Classes escritas por extenso para o Tailwind detectá-las (e para provar o mapa do tema). */
export const PALETA: GrupoPaleta[] = [
  {
    grupo: "Fundo",
    itens: [
      { token: "--color-bg", classe: "bg-bg" },
      { token: "--color-bg-alt", classe: "bg-bg-alt" },
      { token: "--color-bg-teal", classe: "bg-bg-teal" },
      { token: "--color-bg-inverse", classe: "bg-inverse" },
      { token: "--color-surface", classe: "bg-surface" },
      { token: "--color-surface-raised", classe: "bg-surface-raised" },
      { token: "--color-overlay", classe: "bg-overlay" },
    ],
  },
  {
    grupo: "Texto",
    itens: [
      { token: "--color-text", classe: "bg-foreground" },
      { token: "--color-text-muted", classe: "bg-muted" },
      { token: "--color-text-subtle", classe: "bg-subtle" },
      { token: "--color-text-inverse", classe: "bg-on-inverse" },
      { token: "--color-text-inverse-muted", classe: "bg-on-inverse-muted" },
      { token: "--color-link", classe: "bg-link" },
    ],
  },
  {
    grupo: "Marca",
    itens: [
      { token: "--color-primary", classe: "bg-primary" },
      { token: "--color-primary-hover", classe: "bg-primary-hover" },
      { token: "--color-primary-contrast", classe: "bg-primary-contrast" },
      { token: "--color-primary-soft", classe: "bg-primary-soft" },
      { token: "--color-primary-bg", classe: "bg-primary-bg" },
      { token: "--color-secondary", classe: "bg-secondary" },
      { token: "--color-secondary-hover", classe: "bg-secondary-hover" },
      { token: "--color-secondary-contrast", classe: "bg-secondary-contrast" },
      { token: "--color-secondary-soft", classe: "bg-secondary-soft" },
      { token: "--color-brand-pink", classe: "bg-brand-pink" },
      { token: "--color-brand-teal", classe: "bg-brand-teal" },
    ],
  },
  {
    grupo: "Sobre escuro",
    itens: [
      { token: "--color-on-inverse-primary", classe: "bg-on-inverse-primary" },
      { token: "--color-on-inverse-accent", classe: "bg-on-inverse-accent" },
    ],
  },
  {
    grupo: "Borda e foco",
    itens: [
      { token: "--color-border", classe: "bg-border" },
      { token: "--color-border-strong", classe: "bg-border-strong" },
      { token: "--color-focus-ring", classe: "bg-focus-ring" },
    ],
  },
  {
    grupo: "Feedback",
    itens: [
      { token: "--color-success", classe: "bg-success" },
      { token: "--color-success-bg", classe: "bg-success-bg" },
      { token: "--color-warning", classe: "bg-warning" },
      { token: "--color-warning-bg", classe: "bg-warning-bg" },
      { token: "--color-danger", classe: "bg-danger" },
      { token: "--color-danger-bg", classe: "bg-danger-bg" },
      { token: "--color-info", classe: "bg-info" },
    ],
  },
  {
    grupo: "Canal",
    itens: [
      { token: "--color-whatsapp", classe: "bg-whatsapp" },
      { token: "--color-whatsapp-contrast", classe: "bg-whatsapp-contrast" },
    ],
  },
];

/* ------------------------------------------------------------- tipografia */

export type DegrauTipografico = {
  nome: string;
  token: string;
  classe: string;
  /** o que o design system pede para este degrau */
  uso: string;
};

export const ESCALA: DegrauTipografico[] = [
  { nome: "display", token: "--text-display", classe: "text-display font-title", uso: "título de impacto (Sora 600)" },
  { nome: "h1", token: "--text-h1", classe: "text-h1 font-title", uso: "único h1 da página (hero)" },
  { nome: "h2", token: "--text-h2", classe: "text-h2 font-title", uso: "título de seção" },
  { nome: "h3", token: "--text-h3", classe: "text-h3 font-title", uso: "título de card/passo" },
  { nome: "body-lg", token: "--text-body-lg", classe: "text-body-lg font-body", uso: "subtítulo e texto de destaque (Inter)" },
  { nome: "body", token: "--text-body", classe: "text-body font-body", uso: "corpo, mínimo 16px" },
  { nome: "small", token: "--text-small", classe: "text-small font-body", uso: "legenda e apoio" },
  { nome: "micro", token: "--text-micro", classe: "text-micro font-body", uso: "rótulo mínimo" },
];
