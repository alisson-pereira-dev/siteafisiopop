# Design System — A.FISIO POP (v1.2)

> Evolução do Design System v1.1 do cliente. Mantém a identidade (rosa + teal, Sora + Instrument Serif + Inter, raios generosos, selo POP, WhatsApp flutuante) e corrige o que não passava em acessibilidade. Fonte de verdade: `design-tokens.json` e `design-tokens.css` (valores idênticos). **Nenhum componente usa hex solto.**

## Direção resumida
Premium acessível: editorial claro e arejado, com a estrutura de confiança da Superpower e o calor POP da marca. Rosa chama para a ação, teal apoia a confiança, tinta dá peso nos momentos escuros.

## Decisões e justificativas
| Decisão | Por quê |
|---|---|
| **`--color-primary` = `#D6145F`** (CTA, links, preço) no lugar do `#E92E7A` | O rosa do DS dava 4,09:1 com texto branco (AA exige 4,5:1). O `#D6145F` dá **5,09:1**, fica entre o rosa do DS e o carmim do **logo real** (≈ `#DE0050`), então o site conversa melhor com o logo. Hover: `#B8104F` (6,51:1) |
| **`#E92E7A` vira `--color-brand-pink`**, só para destaque serifado grande (≥ 32px), gradientes e decoração | Dá 4,04:1 sobre o fundo: passa como texto grande (3:1), não como texto pequeno |
| **Botão teal usa `--color-secondary` `#007E78`** com texto branco (4,93:1). O teal vivo `#00B4AB` fica só para decoração, preenchimentos e ícones grandes | Branco sobre `#00B4AB` dava 2,59:1 |
| **Texto de apoio em `--color-text-subtle` `#6B6572`** (5,56:1) no lugar do cinza `#8A8490` (3,58:1) | O cinza antigo reprovava como texto. Fica só como borda de controle (3:1) |
| **WhatsApp flutuante: verde `#25D366` com ícone em tinta** (8,55:1) | O ícone branco dava 1,98:1 |
| **Sobre fundo escuro**: rosa `#FF6AA5` (6,35:1) e teal `#00E6D8` (10,75:1) | Já usados no DS; agora são tokens (`on-inverse-*`) |
| **Cards `--radius-lg` 24px**, controles e cards pequenos 16px, container de ícone 12px | O DS tinha 16px nos tokens mas 24px nas páginas. Fica o 24px, mais acolhedor e premium |
| **3 famílias tipográficas** (exceção ao limite de 2 do framework) | O DS oficial define o trio. A serifada aparece só em 1–2 palavras por título, então funciona como um *papel* (destaque), não como terceira fonte de texto |
| **Sombra de card rosada no hover** (`shadow-2`) | Mantém a assinatura do DS (sombra rosa suave), com camada curta e definida |
| **Tema claro + seções escuras** (`--color-bg-inverse`), sem tema escuro completo | A Direção de Arte pede alternância claro/rosa/escuro, não modo escuro |
| **Logo real, não o redesenho do DS** | O logo enviado tem uma figura pink/teal de braços abertos e dois swooshes; o DS mostrava duas figuras. O PNG vai em `assets/logo-afisiopop.png` |

## Cores
Proporção guia: ~60% neutro (papel e rosa fundo), ~30% superfícies e tinta, ~10% rosa de ação.

| Grupo | Tokens |
|---|---|
| Fundo | `bg` #FFFDFE · `bg-alt` #FFF2F7 · `bg-teal` #D6F5F2 · `bg-inverse` #1F1B22 · `surface` #FFFFFF · `overlay` |
| Texto | `text` #1F1B22 · `text-muted` #4A4450 · `text-subtle` #6B6572 · `text-inverse` #FFFFFF · `link` #D6145F |
| Marca | `primary` #D6145F · `primary-hover` #B8104F · `primary-contrast` #FFFFFF · `primary-soft` #FFD6E8 · `secondary` #007E78 · `secondary-hover` #00665F · `brand-pink` #E92E7A · `brand-teal` #00B4AB |
| Sobre escuro | `on-inverse-primary` #FF6AA5 · `on-inverse-accent` #00E6D8 |
| Borda e foco | `border` #EEE8EE (decorativa) · `border-strong` #8A8490 (controles) · `focus-ring` #1F1B22 |
| Feedback | `success` #0F7A57 · `warning` #9A5B00 · `danger` #B3261E · `info` #007E78 (+ `*-bg`) |
| Canal | `whatsapp` #25D366 · `whatsapp-contrast` #1F1B22 |

**Regras de uso**
- O CTA principal usa **sempre** `primary` + `primary-contrast`. Nenhum outro botão repete esse estilo; o secundário é contorno em `text`.
- Rosa não vira fundo grande. Teal não leva texto branco, a não ser `secondary` (#007E78).
- Sobre `bg-teal` (#D6F5F2) o texto é sempre `text` (tinta); `secondary` sobre teal claro dá só 4,28:1 e **não é permitido**.
- Ícone com significado (não decorativo) em teal usa `secondary`, nunca `brand-teal`.
- Logo sobre foto sempre com véu (regra do DS).

### Contraste verificado (WCAG AA)
| Par | Cores | Razão | Exigência | OK |
|---|---|---|---|---|
| Texto principal | `#1F1B22` sobre `#FFFDFE` | 16.75:1 | texto normal (4.5:1) | ✅ |
| Texto secundário | `#4A4450` sobre `#FFFDFE` | 9.28:1 | texto normal (4.5:1) | ✅ |
| Texto de apoio/legenda | `#6B6572` sobre `#FFFDFE` | 5.56:1 | texto normal (4.5:1) | ✅ |
| Texto de apoio sobre rosa fundo | `#6B6572` sobre `#FFF2F7` | 5.17:1 | texto normal (4.5:1) | ✅ |
| Texto principal sobre rosa fundo | `#1F1B22` sobre `#FFF2F7` | 15.58:1 | texto normal (4.5:1) | ✅ |
| Botão principal (texto) | `#FFFFFF` sobre `#D6145F` | 5.09:1 | texto normal (4.5:1) | ✅ |
| Botão principal hover | `#FFFFFF` sobre `#B8104F` | 6.51:1 | texto normal (4.5:1) | ✅ |
| Link / texto rosa sobre fundo | `#D6145F` sobre `#FFFDFE` | 5.03:1 | texto normal (4.5:1) | ✅ |
| Texto rosa sobre rosa fundo | `#D6145F` sobre `#FFF2F7` | 4.68:1 | texto normal (4.5:1) | ✅ |
| Botão teal (texto) | `#FFFFFF` sobre `#007E78` | 4.93:1 | texto normal (4.5:1) | ✅ |
| Texto teal sobre fundo | `#007E78` sobre `#FFFDFE` | 4.87:1 | texto normal (4.5:1) | ✅ |
| Texto tinta sobre teal claro | `#1F1B22` sobre `#D6F5F2` | 14.7:1 | texto normal (4.5:1) | ✅ |
| Texto tinta sobre rosa claro (selo) | `#1F1B22` sobre `#FFD6E8` | 12.95:1 | texto normal (4.5:1) | ✅ |
| Texto branco sobre faixa escura | `#FFFFFF` sobre `#1F1B22` | 16.96:1 | texto normal (4.5:1) | ✅ |
| Rosa de destaque sobre escuro | `#FF6AA5` sobre `#1F1B22` | 6.35:1 | texto normal (4.5:1) | ✅ |
| Teal vivo sobre escuro | `#00E6D8` sobre `#1F1B22` | 10.75:1 | texto normal (4.5:1) | ✅ |
| Destaque serifado rosa #E92E7A sobre fundo (≥ 32px) | `#E92E7A` sobre `#FFFDFE` | 4.04:1 | texto grande (3.0:1) | ✅ |
| Destaque serifado rosa #E92E7A sobre rosa fundo (≥ 32px) | `#E92E7A` sobre `#FFF2F7` | 3.76:1 | texto grande (3.0:1) | ✅ |
| Ícone WhatsApp (tinta) sobre verde | `#1F1B22` sobre `#25D366` | 8.55:1 | componente (3.0:1) | ✅ |
| Borda de campo/controle | `#8A8490` sobre `#FFFDFE` | 3.58:1 | componente (3.0:1) | ✅ |
| Anel de foco | `#1F1B22` sobre `#FFFDFE` | 16.75:1 | componente (3.0:1) | ✅ |
| Sucesso | `#0F7A57` sobre `#E3F6EE` | 4.74:1 | texto normal (4.5:1) | ✅ |
| Atenção | `#9A5B00` sobre `#FFF4DB` | 4.96:1 | texto normal (4.5:1) | ✅ |
| Erro | `#B3261E` sobre `#FDECEA` | 5.72:1 | texto normal (4.5:1) | ✅ |

## Tipografia
- **Títulos:** Sora 600, `letter-spacing -0.02em`, `line-height 1.1`.
- **Destaque editorial:** Instrument Serif itálico (classe `.accent-serif`), **1–2 palavras por título**, em `brand-pink`, só em tamanho grande. No `content.json`, a palavra vem entre `**asteriscos**`; o componente aplica o estilo.
- **Corpo e UI:** Inter 400/600, sem caixa alta, mínimo 16px, `line-height 1.6`, medida até 65ch.
- **Carregamento:** `next/font` com self-host e `display: swap` (não usar o `@import` do DS).
- **Escala fluida:** `display` clamp(2.5rem…5.5rem) · `h1` clamp(2.25rem…4rem) · `h2` clamp(1.75rem…2.75rem) · `h3` clamp(1.25rem…1.625rem) · `body-lg` clamp(1.125rem…1.25rem) · `body` 1rem · `small` 0.875rem. Um só `h1` por página (o do hero).

## Espaçamento, grid e breakpoints
- Base 4px: `space-1…10` = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- `space-section`: `clamp(4rem, 3rem + 5vw, 8rem)`. Container 1200px, padding lateral 16px (mobile) e 32px (≥768px).
- Grid 4 colunas (mobile) → 8 (tablet) → 12 (desktop). Breakpoints `min-width`: 480 · 768 · 1024 · 1280 · 1536.
- Alvo de toque mínimo `48px`. Header 64px (mobile) e 72px (≥768px).

## Forma e elevação
- Raios: `sm` 6 · `icon` 12 · `md` 16 · `lg` 24 · `full` pílula (botões e chips).
- Sombras: `0` nenhuma · `1` card em repouso · `2` card em hover (sombra rosada) · `3` menu/popover/WhatsApp · `4` modal · `cta` sombra do botão principal.
- Borda de 1px `border`. `backdrop-filter` apenas no header, com fundo sólido de fallback.
- Proporções de mídia: `hero` 4/5 (mobile, vertical como o Instagram) · `card` 4/3 · `square` 1/1 · `wide` 16/9.
- Gradientes: `hero` (rosa → teal), `soft` (rosa claro → branco → teal claro), `price` (rosa → rosa vivo). Só decorativos; nunca atrás de texto sem checar contraste.

## Movimento
Tokens do framework: `dur` 100 / 180 / 300 / 500 / 800ms · `ease-standard`, `ease-out`, `ease-in`, `ease-in-out` · `stagger-step` 60ms · `reveal-distance` 24px. Em `prefers-reduced-motion` as durações caem a 0 e a distância a 0. Nível geral: **N1, com 1 momento N2** ("Um problema, uma solução"). Receitas, as 3 versões e o mapeamento dos tokens por uso: `docs/jornada-e-motion.md`. Escalas de hover/press (1,02 e 0,98) e `--safe-bottom`, `--barra-cta-altura` ficam em `globals.css`, não em `design-tokens.css`.

## Camadas
`z-base` 0 · `z-sticky` 100 · `z-dropdown` 200 · `z-overlay` 300 · `z-modal` 400 · `z-toast` 500. O header, a barra inferior de CTA (`ui-barra-cta`, só <768px) e o WhatsApp flutuante (só ≥768px) usam `z-sticky`; barra e flutuante nunca coexistem. O menu mobile (painel) usa `z-overlay` e cobre a barra.

## Estados interativos
Foco visível com anel de 3px em `focus-ring` (em `bg-inverse`, branco) · hover sutil, nunca a única informação · active `scale(.98)` · disabled com opacidade, `not-allowed` e semântica correta · loading com bloqueio de duplo clique. Tudo que muda no hover tem equivalente em toque e foco.

## Ícones
Somente **Lucide**, dentro de container de 12px de raio (`radius-icon`), tamanhos 16/20/24/32. Decorativos com `aria-hidden`. Ícones por serviço no `content.json`: activity, droplets, moon, ruler, circle-dot, sparkles, bone, stethoscope.

## Verificações
- [x] Todos os pares de cor passam AA (a combinação proibida está listada nas regras)
- [x] Corpo ≥ 16px no mobile
- [x] Fontes com acentos pt-BR (Sora, Instrument Serif, Inter)
- [x] Tokens em CSS e JSON gerados do mesmo script, idênticos
- [x] Paleta: 1 primária + 1 secundária + neutros; `brand-pink` e `brand-teal` só decorativos
- [x] Tokens de movimento coerentes com N1/N2
- [ ] Reconferir os contrastes depois de aplicar fotos reais com texto sobreposto (Fase 12)
