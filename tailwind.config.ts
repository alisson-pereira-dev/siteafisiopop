/**
 * Tema do Tailwind · A.FISIO POP
 * Fonte dos valores: styles/design-tokens.css (nada literal aqui, só var(--...)).
 * Regra: `theme` (não `extend`) para que as escalas padrão do Tailwind (cores, espaço,
 * raios, sombras) deixem de existir e só reste o que está nos tokens.
 * Única exceção: `screens`, porque variável CSS não funciona em @media
 * (valores iguais aos breakpoints documentados em docs/design-system.md).
 */
import type { Config } from "tailwindcss";

const v = (nome: string) => `var(--${nome})`;

/** Escala numérica de espaço: space-1…space-10 → p-1…p-10, gap-5, mt-8 etc. */
const espaco = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [String(i + 1), v(`space-${i + 1}`)]),
);

const config: Config = {
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Fundos
      bg: v("color-bg"), // bg-bg
      "bg-alt": v("color-bg-alt"),
      "bg-teal": v("color-bg-teal"),
      inverse: v("color-bg-inverse"), // bg-inverse (seção escura)
      surface: v("color-surface"),
      "surface-raised": v("color-surface-raised"),
      overlay: v("color-overlay"),
      // Texto
      foreground: v("color-text"), // text-foreground
      muted: v("color-text-muted"), // text-muted
      subtle: v("color-text-subtle"), // text-subtle
      "on-inverse": v("color-text-inverse"), // text-on-inverse (sobre bg-inverse)
      "on-inverse-muted": v("color-text-inverse-muted"),
      "on-inverse-primary": v("color-on-inverse-primary"),
      "on-inverse-accent": v("color-on-inverse-accent"),
      link: v("color-link"),
      // Marca
      primary: v("color-primary"),
      "primary-hover": v("color-primary-hover"),
      "primary-contrast": v("color-primary-contrast"),
      "primary-soft": v("color-primary-soft"),
      "primary-bg": v("color-primary-bg"),
      secondary: v("color-secondary"),
      "secondary-hover": v("color-secondary-hover"),
      "secondary-contrast": v("color-secondary-contrast"),
      "secondary-soft": v("color-secondary-soft"),
      "brand-pink": v("color-brand-pink"), // só decoração e destaque serifado grande
      "brand-teal": v("color-brand-teal"), // só decoração
      // Borda e foco
      border: v("color-border"),
      "border-strong": v("color-border-strong"),
      "focus-ring": v("color-focus-ring"),
      // Feedback
      success: v("color-success"),
      "success-bg": v("color-success-bg"),
      warning: v("color-warning"),
      "warning-bg": v("color-warning-bg"),
      danger: v("color-danger"),
      "danger-bg": v("color-danger-bg"),
      info: v("color-info"),
      // Canal
      whatsapp: v("color-whatsapp"),
      "whatsapp-contrast": v("color-whatsapp-contrast"),
    },

    fontFamily: {
      title: v("font-title"),
      serif: v("font-serif"),
      body: v("font-body"),
    },
    fontWeight: {
      regular: v("weight-body"),
      strong: v("weight-strong"),
      heading: v("weight-title"),
    },
    fontSize: {
      display: [v("text-display"), { lineHeight: v("leading-title") }],
      h1: [v("text-h1"), { lineHeight: v("leading-title") }],
      h2: [v("text-h2"), { lineHeight: v("leading-title") }],
      h3: [v("text-h3"), { lineHeight: v("leading-title") }],
      "body-lg": [v("text-body-lg"), { lineHeight: v("leading-body") }],
      body: [v("text-body"), { lineHeight: v("leading-body") }],
      small: [v("text-small"), { lineHeight: v("leading-body") }],
      micro: [v("text-micro"), { lineHeight: v("leading-body") }],
    },
    lineHeight: {
      title: v("leading-title"),
      body: v("leading-body"),
    },
    letterSpacing: {
      title: v("tracking-title"),
    },

    spacing: {
      0: "0",
      ...espaco,
      section: v("space-section"),
      touch: v("touch-target"),
      header: v("header-height"),
      container: v("container"),
      pad: v("container-pad"), // px-pad: 16px no mobile, 32px a partir de 768px
    },
    maxWidth: {
      none: "none",
      full: "100%",
      container: v("container"),
      measure: v("measure"),
    },

    borderRadius: {
      none: "0",
      sm: v("radius-sm"),
      icon: v("radius-icon"),
      md: v("radius-md"),
      lg: v("radius-lg"),
      full: v("radius-full"),
    },
    boxShadow: {
      0: v("shadow-0"),
      1: v("shadow-1"),
      2: v("shadow-2"),
      3: v("shadow-3"),
      4: v("shadow-4"),
      cta: v("shadow-cta"),
    },
    backgroundImage: {
      "grad-hero": v("gradient-hero"),
      "grad-soft": v("gradient-soft"),
      "grad-price": v("gradient-price"),
    },
    aspectRatio: {
      auto: "auto",
      hero: v("ratio-hero"),
      card: v("ratio-card"),
      square: v("ratio-square"),
      wide: v("ratio-wide"),
    },

    transitionDuration: {
      instant: v("dur-instant"),
      fast: v("dur-fast"),
      base: v("dur-base"),
      slow: v("dur-slow"),
      slower: v("dur-slower"),
    },
    transitionTimingFunction: {
      standard: v("ease-standard"),
      out: v("ease-out"),
      in: v("ease-in"),
      "in-out": v("ease-in-out"),
    },
    zIndex: {
      base: v("z-base"),
      sticky: v("z-sticky"),
      dropdown: v("z-dropdown"),
      overlay: v("z-overlay"),
      modal: v("z-modal"),
      toast: v("z-toast"),
    },
  },
};

export default config;
