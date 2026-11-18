/**
 * Layout raiz · A.FISIO POP
 * Ficha: docs/sections/fichas/global-acesso-fixo.md (script inline, viewport) · Conteúdo: content/content.json → seo.home, site.lang
 * Script inline (T2.1, jornada-e-motion.md §3.3 e M9): só quando há JS, põe `data-js` no <html> antes da 1ª
 * pintura e arma o watchdog de 4 s (sem `data-js-pronto` → `data-js-falhou`). NÃO põe `data-motion` (é do
 * MotionInit) e NÃO esconde nada. Sem JS não existe temporizador: tudo já está no estado final.
 * Fontes (self-host via next/font, display swap): Sora 600 · Instrument Serif itálico · Inter 400/600.
 * As variáveis --font-sora/-instrument-serif/-inter são ligadas aos tokens em globals.css.
 */
import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Sora } from "next/font/google";
import "./globals.css";
import "./header.css";
import "./stage.css";
import "./carrossel.css";
import "./chat.css";
import "./pilha.css";
import "./accordion.css";
import "./raios.css";
import { conteudo as content } from "@/lib/conteudo";
import { urlDoSite } from "@/lib/site-url";
import { Footer } from "@/secoes/footer/Footer";
import { Header } from "@/secoes/header/Header";
import { CtaObservador } from "@/ui/CtaObservador";
import { MotionInit } from "@/ui/MotionInit";
import { UiBarraCta } from "@/ui/UiBarraCta";

const sora = Sora({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-sora",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * SEO (T5.4). `metadataBase` e `canonical` só existem com SITE_URL (domínio ainda não definido: nada de URL absoluta falsa).
 * Open Graph sem imagem enquanto `seo.home.og_imagem.src` for "pendente".
 */
const baseDoSite = urlDoSite();
const { og_imagem: ogImagem } = content.seo.home;

export const metadata: Metadata = {
  title: content.seo.home.titulo,
  description: content.seo.home.descricao,
  ...(baseDoSite ? { metadataBase: baseDoSite, alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: content.site.nome,
    title: content.seo.home.titulo,
    description: content.seo.home.descricao,
    ...(ogImagem.src !== "pendente" ? { images: [{ url: ogImagem.src, alt: ogImagem.alt }] } : {}),
  },
};

/** `viewportFit: "cover"` deixa a barra inferior usar a área segura do iOS (`--safe-bottom`). */
export const viewport: Viewport = {
  viewportFit: "cover",
};

/** Prazo do watchdog (M9). Constante nomeada: não é token de CSS. */
const PRAZO_WATCHDOG_MS = 4000;

const SCRIPT_INICIAL = `(function(){var h=document.documentElement;h.setAttribute("data-js","");setTimeout(function(){if(!h.hasAttribute("data-js-pronto"))h.setAttribute("data-js-falhou","")},${PRAZO_WATCHDOG_MS})})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={content.site.lang}
      className={`${sora.variable} ${instrumentSerif.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INICIAL }} />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <UiBarraCta />
        <CtaObservador />
        <MotionInit />
      </body>
    </html>
  );
}
