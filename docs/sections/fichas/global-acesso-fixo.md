<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — Global · Acesso fixo ao WhatsApp (barra no mobile, botão flutuante no desktop)

> Não é uma das 13 seções, mas decide o CTA fixo. **Decisão do usuário:** no mobile, barra inferior fixa com o texto completo, **no lugar** do botão flutuante; no desktop, CTA no header + botão flutuante.
> Corte entre os dois: **768px** (`md`). Barra: `md:hidden`. Flutuante: `hidden md:flex`.

## 4. Layout (Fase 6)

### 4a. Barra inferior `UiBarraCta` (<768px)
- **Posição:** `fixed inset-x-0 bottom-0 z-sticky`, largura total, `bg-bg`, `border-t border-border`, `shadow-3`.
- **Conteúdo:** só o CTA principal (`UiCtaPrincipal`, `data-cta-local="barra"`), **texto completo** "Agendar meu horário no WhatsApp", largura total, `min-h-touch` (**48px mínimo**), sem ícone extra que force quebra de linha. O texto cabe em 360px (largura útil = 360 − 2 × `px-pad`); se quebrar em 2 linhas, o botão cresce (altura `min-h-touch`, não fixa).
- **Respiro:** `px-pad pt-3`; `pb-3` **somado à área segura inferior do iOS** (`safe-area-inset-bottom`), para o botão não encostar na barra do sistema. A área segura entra por uma variável (`--safe-bottom: env(safe-area-inset-bottom)`) declarada em `globals.css`, não em `design-tokens.css`, e usada como `var(--safe-bottom)` (o ESLint aceita `var(...)`; `env(...)` direto em `className` não). Exige `viewportFit: "cover"` no `viewport` do `layout.tsx`.
- **Visibilidade (regra, decisão do usuário; detalhe de animação na Fase 9):** a barra **fica escondida sempre que qualquer outro `[data-cta="principal"]` estiver visível na tela**: hoje hero, problema/solução, como funciona, preço, unidades e CTA final. **Nos trechos sem CTA principal visível, a barra fica visível** (ex.: serviços, para quem, depoimentos, FAQ, footer). Não há lista fixa de seções: vale o seletor, então um CTA novo entra na regra sozinho.
  - **O que conta como "outro":** todo `[data-cta="principal"]` **menos** o da própria barra (`data-cta-local="barra"`) e os do header (`header`, `header-painel`), que não representam um CTA de conteúdo na tela (no mobile o do header nem é renderizado visível; o do painel só aparece com o menu aberto, que já cobre a barra).
  - **O que conta como "visível":** dentro da área de visualização **acima da barra** (a margem inferior do observador desconta a altura da barra, para um CTA escondido atrás dela não contar como visível). Valores exatos de margem e limiar: Fase 9.
  - Sem JS, ou antes de o observador carregar, **fica visível** (conteúdo e CTA nunca dependem de JS). Escondida = fora da ordem de Tab e da árvore de acessibilidade (`inert`/`aria-hidden`), não só transparente.
- **Painel do menu aberto:** o painel (`z-overlay`) cobre a barra.
- **Reserva de espaço:** o footer reserva `pb` para a barra (ver ficha S23). Nenhuma seção posiciona controle fixo na faixa inferior.
- **Não fazer:** segundo texto de CTA (é o mesmo botão, texto e destino); ícone flutuante junto com a barra; sombra rosa; cobrir o rodapé do iOS; esconder só por `opacity` (continuaria focável).

### 4b. Botão flutuante `WhatsappFloat` (≥768px)
- Botão circular fixo no canto inferior direito: `right-4 bottom-4`, `z-sticky`, 56px (acima do alvo de toque), `bg-whatsapp`, ícone em `text-whatsapp-contrast` (8,55:1), `shadow-3`.
- Mesmo destino do CTA principal (`mensagem_padrao`); rótulo acessível = `microcopy.acessibilidade.abrir_whatsapp`. **Não usa o estilo `ui-botao--primario`**: é ícone, não substitui nem imita o CTA principal.
- Aparece depois que o CTA do hero sai da tela (regra do flutuante **não mudou**: segue só o hero; a regra "qualquer CTA principal visível" vale para a barra, não para ele; comportamento na Fase 9); sem JS, fica visível. No ≥768px o CTA do header já é fixo, então o flutuante é reforço.
- Cobre conteúdo no canto: o footer reserva `pb`; nenhuma seção coloca controle no canto inferior direito.

## 5. Componentes (Fase 7)
- **`UiBarraCta`** (`src/ui/UiBarraCta.tsx`): casca da barra; **embrulha `UiCtaPrincipal`** (local `barra`), não cria outro botão. **Server** (Fase 9): o estado vem do `CtaObservador`, que escreve `data-estado`/`inert` no DOM; a marcação e o estilo funcionam sem JS. Montada uma vez no layout da página, fora de qualquer seção.
- **`WhatsappFloat`** (`src/ui/WhatsappFloat.tsx`): server; o "aparece depois do hero" é o sinal `heroVisivel` do `CtaObservador` · `UiIcone` (MessageCircle) · `data-cta="flutuante"`.
- Os dois compartilham **um** observador (`CtaObservador`, client sem saída visual, no layout; substitui o hook provisório `useCtaPrincipalVisivel`), que observa todos os `[data-cta="principal"]` (exceto `barra`, `header`, `header-painel`) e aplica **duas regras**: `algumCtaVisivel` (`UiBarraCta`: esconde quando é `true`) e `heroVisivel` (`WhatsappFloat`: aparece quando é `false`). Um só `IntersectionObserver`, para as duas regras não divergirem.
- Consequência para as seções: **toda seção com CTA principal precisa emitir `data-cta="principal"` via `UiCtaPrincipal`** (é o que alimenta o observador); nenhum botão com o mesmo estilo fora dele.

## Campos 6, 7 e 8 (Fases 8 e 9)

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** manter o acesso ao WhatsApp sempre à mão **sem duplicar** o CTA na tela.
- **Vê:** <768 a barra inferior com o texto completo (some quando outro CTA principal está na tela); ≥768 o CTA do header e, depois do hero, o botão flutuante.
- **Faz:** toca na barra ou no flutuante quando decide chamar fora dos pontos com CTA.
- **Reage:** a barra entra e sai (`barra-cta`) conforme há ou não CTA na tela, com histerese de 300 ms; o flutuante aparece depois do hero (`float`, pulso 2× só se o palco não estiver na tela); `:active` imediato em ambos; painel do menu aberto cobre a barra.
- **Sente/entende:** o caminho para agendar está sempre à mão, sem insistência.
- **Atrito → mitigação:** muito liga/desliga cansa → histerese e limiar 0,5 · cobrir conteúdo → `pb` do footer e `scroll-padding-bottom` · dois botões iguais na tela → a barra esconde quando outro CTA principal está visível · JS falhar → watchdog (M9).
- **Saída:** WhatsApp. Sem beco.
- **Evento de analytics:** barra → `cta_principal_click` (`local` = `barra`) + `whatsapp_click`; flutuante → `whatsapp_click` (`tipo` = `flutuante`).
- **Mobile:** é o caso principal da barra (campo 8).

## 7. Motion (Fase 9)
Especificação completa em `docs/jornada-e-motion.md` §5 (visibilidade) e §3.4 (receitas).
- **Nível:** N1. **Biblioteca:** nenhuma. Um único `IntersectionObserver` em `CtaObservador` (client, sem saída visual, no layout) escreve `data-estado` e `inert` direto no DOM; `UiBarraCta` e `WhatsappFloat` ficam **server**. Regra em `src/lib/cta-visibilidade.ts` (função pura, testada com timers falsos).
- **Observa:** `[data-cta="principal"]`, exceto `barra`, `header`, `header-painel`. **Visível** = `intersectionRatio ≥ 0,5` com `rootMargin` de topo = `--header-height` e de base = altura da barra (`--barra-cta-altura`, medida por `ResizeObserver`; 0 em ≥768).
- **Barra (`algumCtaVisivel`):** esconde **imediatamente**; mostra após `dur-base` (300 ms) sem CTA visível. Não esconde com `:focus-within`. Escondida = `inert` + `data-estado="oculta"`. Receita `barra-cta`: entra `translateY(100%→0)` + `opacity` em `dur-base` `ease-out`; sai em `dur-fast` `ease-in`.
- **Flutuante (`heroVisivel`):** aparece quando o CTA `hero` **não** está visível (mesmos 300 ms). Receita `float` (N1): `scale(0,8→1)` + `opacity`. `float-pulso` (N1): 2 pulsos na 1ª aparição, depois estático, **cancelado se o palco do S03 estiver na tela** (um destaque por tela, §3.6). A `barra-cta` é feedback funcional de estado, não destaque.
- **Estados iniciais:** sem JS = `visivel`. Com JS = `pendente` (escondidos, sem transição) até o 1º callback (≈1 quadro), para não piscar no hero.
- **Falha segura (M9):** `pendente` nunca pode ficar para sempre. O script inline arma o *watchdog* de 4 s **só quando há JS** (sem JS não há temporizador: a barra e o flutuante já são visíveis). Se `CtaObservador`/`MotionInit` não marcarem `data-js-pronto`, ou um deles lançar erro, o `<html>` ganha `data-js-falhou` e o CSS mostra barra e flutuante (`jornada-e-motion.md` §3.3). **Divergência aceitável da regra 5 do `09-MOTION`:** `pendente` é aplicado por `data-js` (inline), não pelo JS de animação pronto; justificativa em `jornada-e-motion.md` §5.
- **Painel do menu aberto:** barra `inert`; ao fechar, volta ao estado calculado.
- **Reduced-motion:** a lógica de esconder/mostrar fica; as transições e o pulso saem.
- **Testes de aceite:** unitário da função de regra (histerese, foco, 2 CTAs próximos); manual em 390×844 e 1280×800 (varredura completa; nunca 2 botões iguais visíveis; Tab nunca para em controle escondido).

## 8. Mobile (Fase 9)
- **Barra:** `fixed inset-x-0 bottom-0`, `min-h-touch`, `pb` com `var(--safe-bottom)`, `viewportFit: "cover"`. Sem campo de texto no site, então o teclado virtual do iOS não interfere. `scroll-padding-bottom: var(--barra-cta-altura)` mantém o elemento focado fora da barra (WCAG 2.4.11).
- **Sobre o rodapé:** o footer reserva `pb`; a barra nunca cobre o último link. **Painel aberto** cobre a barra (`z-overlay`).
- **Gestos:** nenhum. **Lenis:** não existe na v1; se entrar, desligado no toque. Nada usa `100vh` (`svh` quando preciso).
- **Flutuante (≥768):** 56px, canto inferior direito, `right-4 bottom-4`; footer reserva `pb-8`. Não aparece no mobile.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefas: T2.2 (regra), T2.7 (componentes) e T2.1 (`globals.css`, script inline) (`docs/tasks.md`)
- [auto] **Regra pura** (`src/lib/cta-visibilidade.ts`, Vitest com timers falsos): esconde imediatamente quando algum CTA tem `ratio ≥ 0,5`; mostra só após 300 ms contínuos sem CTA; não esconde com `:focus-within`; dois CTAs separados por menos de 300 ms **não** reexibem a barra; `heroVisivel` governa o flutuante; painel aberto = `inert`.
- [auto] A barra é `md:hidden` e o flutuante `hidden md:flex`: nunca os dois visíveis (conferir `display` computado em 767 e 768).
- [auto] A barra embrulha `UiCtaPrincipal` (`data-cta-local="barra"`), texto igual ao principal, alvo ≥ 48px, `pb` com `var(--safe-bottom)`; `viewport` com `viewportFit: "cover"`.
- [auto] O flutuante usa `data-cta="flutuante"`, 56px, `bg-whatsapp`, `aria-label` = `microcopy.acessibilidade.abrir_whatsapp` e **não** usa `ui-botao--primario`.
- [auto] Escondida = `data-estado="oculta"` + `inert` (não só transparente); `Tab` nunca para em controle escondido.
- [manual 390×844] Varredura do topo ao rodapé: nunca 2 botões "Agendar meu horário no WhatsApp" visíveis ao mesmo tempo; a barra muda de estado no máximo 1 vez por CTA de conteúdo (≈ 6 ciclos). [manual 1280×800] O flutuante só aparece depois do CTA do hero.
- [manual] **Sem JS:** barra visível <768 e flutuante visível ≥768. **Com JS:** nascem `pendente` e resolvem em ≈ 1 quadro, **sem animar** e sem piscar no hero.
- [manual] **Falha segura:** com o bundle JS bloqueado ou lento, até 4 s depois o `html` ganha `data-js-falhou` e a barra/flutuante ficam visíveis; sem JS nenhum, ficam visíveis de imediato e **sem temporizador**; um erro em `CtaObservador` põe `data-js-falhou` na hora (ver `docs/jornada-e-motion.md` §3.3).
- [manual] `float-pulso` roda 2 vezes na 1ª aparição e depois fica estático; **não roda se o palco do S03 estiver na tela**; em reduced-motion não existe.
- [manual] Painel do menu aberto cobre a barra; ao fechar, a barra volta ao estado calculado.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** barra com `data-cta-local="barra"` e flutuante com `data-cta="flutuante"`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 4–9 definidos (Fases 6–10) · construção: T2.1, T2.2 e T2.7 em `docs/tasks.md` · build: pendente

**Revisão de 18/11/2026:** o botão flutuante (≥768) foi removido do layout a pedido do usuário. Acesso fixo: mobile = barra inferior; ≥768 = CTA do header.
