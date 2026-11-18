<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S00 Faixa de preço + Header

> **REVISÃO DE 16/11/2026 (decisão do usuário: "navbar como a referência"): vale a seção "Revisão: pílula de vidro" no FIM deste arquivo.** Onde os campos 4, 6, 7, 8 e 9 abaixo falarem de `header-fundo`, "sem `backdrop-blur`", "IntersectionObserver na faixa", painel `translateY` abaixo da barra, "≥1024 sem `botao-menu`" ou links inline a partir de 1024px, **a revisão substitui**. O resto (faixa de preço, CTA ≥768, `pular-conteudo`, `inert`, foco preso) continua.

## 1. Identificação
- slug: `header` · Ordem: 0 · Nível: completo · Âncora: `(topo)`

## 2. Função na narrativa
- Orientar e manter o CTA principal sempre à mão. Mostrar o preço único antes de qualquer rolagem.
- Papel na jornada: entrada
- Relação com o CTA principal: é o CTA fixo a partir de 768px; no mobile o CTA fixo é a barra inferior `UiBarraCta` (ficha global abaixo)

## 3. Conteúdo
- Chave: `header / site.menu / site.ctas / site.faixa_topo / site.logo`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: faixa_topo (preço, avaliação incluída)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Variação sugerida: V1 fixo que ganha fundo ao rolar. Logo REAL (PNG), não o redesenho do DS.

## 4. Layout (Fase 6)
- **Variação:** V1, header fixo (`sticky top-0 z-sticky`) que ganha fundo sólido `bg-bg`, borda e `shadow-1` ao rolar (camada decorativa que faz fade; **sem `backdrop-blur`**, decisão M6). Faixa de preço **não** fica fixa: rola e sai.
- **Fundo:** faixa `bg-inverse text-on-inverse`; barra `bg-bg` (o hero também é `bg-bg`, então no topo a barra fica sem camada própria; a camada `header-fundo` entra quando a faixa sai, ver campo 7).
- **Estrutura:** `faixa-preco` (texto de `site.faixa_topo`, `text-small`, centralizado, `py-2`, pode quebrar em 2 linhas a 360px) → `barra` (`h-header`, `UiContainer`, flex entre) → `logo` · `nav` · `cta` · `botao-menu` · `painel`.
- **Mobile (<768):** `logo` à esquerda (PNG real com altura dentro de `h-header`, proporção intacta; link para `#inicio`) + `botao-menu` à direita (alvo `min-h-touch min-w-touch`, ícone Menu/X). **O CTA principal não cabe na barra do header** (texto longo): no mobile ele fica no hero, no `painel` e na **barra inferior fixa `UiBarraCta`** (decisão do usuário), que é montada no layout da página, não dentro do header. Não há `whatsapp-float` no mobile.
- **`painel` (<1024):** folha abaixo da barra (`z-overlay`), `bg-bg`, `px-pad py-6`; lista de `nav-link` em coluna (`text-h3`, `min-h-touch`, separados por `border-border`), e no fim o CTA principal em largura total. Rolagem do fundo travada enquanto aberto.
- **Tablet (768–1023):** `logo` · `botao-menu` · `cta` (CTA principal visível na barra; links no painel). A barra inferior some a partir de 768px; entra o `WhatsappFloat`.
- **Painel aberto (mobile):** cobre a `UiBarraCta` (`z-overlay` acima de `z-sticky`); o CTA do `painel-cta` garante o acesso enquanto o menu está aberto.
- **Desktop (≥1024):** `logo` · `nav` (5 links, `text-body`, `gap-6`) · `cta` à direita; sem `botao-menu` nem `painel`.
- **Tokens:** `h-header`, `z-sticky`, `z-overlay`, `shadow-1` (só quando rolado), `bg-inverse`, `border-border`.
- **Não fazer:** segundo botão rosa; menu que dependa de hover; logo em branco (versão branca pendente).

## 5. Componentes (Fase 7)
`UiSecao` não (header tem raiz própria) · `UiContainer` · `UiCtaPrincipal` (local `header` em ≥768px e `header-painel`) · `UiIcone` (menu, x) · **`HeaderPainel`** (client: abre/fecha, foco preso, Esc) · `HeaderBarra` (client mínimo: marca "rolado") · `logo` com `next/image` (`priority`).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** orientar e mostrar o preço único antes de qualquer rolagem, mantendo o caminho do WhatsApp à mão.
- **Vê:** faixa de preço (`site.faixa_topo`), logo; ≥1024 os 5 links do menu e o CTA; 768–1023 o botão de menu e o CTA; <768 só logo e botão de menu.
- **Faz:** lê o preço; rola; abre o menu (mobile/tablet) só para pular a um ponto da página; toca no CTA (≥768).
- **Reage:** a camada `header-fundo` sobe quando a faixa sai da tela; o painel abre/fecha com `aria-expanded` e troca do ícone na hora (feedback < 100 ms); link do menu rola até a âncora e fecha o painel; CTA com `:active` imediato.
- **Sente/entende:** "é isso que o anúncio disse, e custa R$ 49,99"; curiosidade, sem pressa.
- **Atrito → mitigação:** "será caro?" → preço na faixa antes de rolar · menu demorado no celular → 5 links, alvos de 48px · sem JS o menu não abre → a página é de uma coluna e o footer repete os links · âncora sob o header → `scroll-padding-top`.
- **Saída:** rolar até o hero; CTA → WhatsApp; link do menu → âncora. Sem beco: o logo leva a `#inicio`.
- **Evento de analytics:** `cta_principal_click` (`local` = `header` ou `header-painel`) + `whatsapp_click`; `menu_open` (extra); `scroll_depth` (global).
- **Mobile:** o CTA não cabe na barra do header; fica no hero, no painel e na barra inferior (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1 (mínimo). Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + `IntersectionObserver`).
- **Alvos `[data-anim]`:** `header-fundo` (camada decorativa atrás da barra) · `painel` · `botao` (CTA do header e do painel).
- **Faixa de preço:** sem animação; rola e sai.
- **`header-fundo`:** a camada (`bg-bg` + `border-b` + `shadow-1`) sobe de `opacity 0→1` quando a **faixa de preço sai da tela** (IO na faixa; sem listener de scroll). `HeaderBarra` (client mínimo) só escreve `data-estado="rolado"` na raiz do header. Sem `backdrop-blur` (decisão M6).
- **`painel`:** abre com `opacity 0→1` + `translateY(-reveal-distance→0)`; fecha com `opacity 1→0`. Fecha com Esc, toque num link, ou ao passar de 1024px. Foco preso e devolvido ao `botao-menu`; `inert` no resto da página; `aria-expanded` no botão. Ícone Menu↔X troca sem animação.
- **Desktop/tablet:** `header-fundo` e `painel` em `dur-fast`/`dur-base`. **Mobile:** igual (não varia). **Reduced-motion:** fundo e painel trocam instantaneamente; o fundo ao rolar continua aparecendo (é informação de estado, não movimento).
- **Não fazer:** esconder o header ao rolar para baixo; menu que dependa de hover; animar `height` do painel.

## 8. Mobile (Fase 9)
- Alvos: `botao-menu` `min-h-touch min-w-touch`; cada `nav-link` do painel `min-h-touch`. Sem gestos (o painel não fecha por arrastar).
- Painel aberto cobre a `UiBarraCta` (que fica `inert`); `overflow: hidden` no `body` enquanto aberto. Logo link para `#inicio`.
- `scroll-padding-top` global garante que `#servicos` etc. não fiquem sob o header.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T2.5 (`docs/tasks.md`)
- [auto] A marcação do header traz `data-cta="principal"` **só** com `data-cta-local` `header` e `header-painel`; os 5 `nav-link` (e os do painel) são idênticos a `site.menu`.
- [auto] Faixa de preço renderiza `site.faixa_topo.texto`; **não** é `sticky`. Nenhum `backdrop-blur` no arquivo (`grep`) e nenhum `addEventListener("scroll"` (o gatilho é `IntersectionObserver` na faixa).
- [manual 360 e 390] Faixa quebra em no máximo 2 linhas sem rolagem lateral; `logo` + `botao-menu` (alvo ≥ 48px); nenhum CTA `header` visível.
- [manual 768 e 1280] CTA `header` visível com o texto de `site.ctas.principal`; ≥1024 sem `botao-menu` e sem `painel`; 768–1023 com `botao-menu` + CTA.
- [manual] `header-fundo`: sobe de `opacity` só depois que a faixa sai da tela e some ao voltar ao topo; em reduced-motion troca sem transição.
- [manual] Painel: abre/fecha por toque no botão, Esc, toque em link e ao passar de 1024px; foco entra no painel, fica preso e volta ao `botao-menu`; `aria-expanded` correto; resto da página `inert`; `body` sem rolagem; a `UiBarraCta` fica `inert` e volta ao estado calculado ao fechar.
- [manual] Sem JS: a página rola normalmente, o painel nasce fechado e nenhum conteúdo some (os links de navegação continuam no footer).
- [auto] O 1º elemento focável é `pular-conteudo` (`microcopy.acessibilidade.pular_para_conteudo`), que leva a `#conteudo` (`<main>`); `nav` com `aria-label` = `navegacao_principal`.
- [auto] Logo via `next/image` com `priority`, dimensões declaradas e `alt` de `site.logo.alt`; link para `#inicio`.
- [manual] Âncoras (`#servicos`, `#faq`…) não ficam sob o header (`scroll-padding-top`).
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** `data-cta="principal"` com `data-cta-local` `header` e `header-painel` (alimenta `cta_principal_click`/`whatsapp_click`); o botão de menu é identificável para `menu_open`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T2.5 em `docs/tasks.md` · build: pendente


## Revisão: pílula de vidro (16/11/2026, decisão do usuário)
Modelo: a página HTML "navbar pílula de vidro" enviada pelo usuário (barra transparente que vira pílula de vidro ao rolar + gaveta lateral). **Libera para o header, e só para ele,** o que o `CLAUDE.md` proibia: listener de scroll, `backdrop-filter` e animação de `padding`/`max-width`/`gap`/cor/fundo/filtro. O resto do site segue as regras antigas.
- **Estados.** Topo (`scrollY ≤ 52`): barra transparente de largura total, logo colorido (48 px), links escuros, botão de menu sem fundo. Rolado (`scrollY > 60`, histerese 60/52; `data-estado="rolado"` na raiz, escrito por `HeaderBarra`): pílula de vidro escuro (`--pilula-vidro` = `bg-inverse` a 75%, blur 1,5rem, `max-width` 64rem, padding `.25rem` e `1,5rem` à esquerda, gap `4rem`), logo em silhueta branca a 0,75, links brancos, botão de menu em círculo de vidro 48×48.
- **Sem JS ou com falha:** o visual base é o rolado (o header sticky nunca fica transparente sobre o conteúdo); o do topo só vale com `html[data-js]` e sem `data-js-falhou`. Botão de menu escondido sem JS (links no `noscript`, `xl:hidden`).
- **Estrutura.** `barra` (sticky, altura fixa `h-header`: a pílula muda por dentro, sem deslocar o conteúdo) → `barra-conteudo` (flex centralizado, gap `space-2`) → `pilula` [`logo` · `nav` (5 links, só ≥1280) · `cta` (só ≥768)] + `botao-menu` + `painel-fundo` + `painel`. A partir de 1280 o logo fica no centro da pílula (absoluto, `translate(-50%,-50%)`); abaixo disso fica à esquerda. Cinco links + CTA não cabem antes de 1280, por isso 768–1279 têm logo + CTA + botão de menu, e <768 só logo + botão de menu (a pílula vale em todas as larguras).
- **Botão de menu:** grade 3×3 de pontos (`botao-menu-ponto`), 48×48, em todas as larguras; `aria-expanded`, `aria-controls`, rótulo `abrir_menu`/`fechar_menu`.
- **Gaveta (`painel`):** fixa à direita, `32rem` (100% abaixo disso), altura `100dvh`, `bg-bg`, raio à esquerda, `translateX(100% → 0)` em `dur-base`. Cabeçalho: título (`microcopy.acessibilidade.titulo_menu`) + botão fechar (X de 5 pontos); depois os 5 links (`text-h2`) e o CTA principal em largura total (`header-painel`). `painel-fundo`: `--color-overlay` com `opacity 0→1`. Abre pelo botão; fecha por Esc, X, toque no fundo ou num link. Foco entra no X, fica preso na gaveta e volta ao botão; o resto da página e o resto do header ficam `inert`; `body` sem rolagem.
- **Receitas** (`src/app/header.css`, catálogo em `jornada-e-motion.md` §3.4): `header-pilula`, `header-logo`, `header-link`, `header-menu`, `painel`, `painel-fundo`; todas N1, `dur-base`/`ease-out`, reduced-motion = troca instantânea. `header-fundo` foi removida.
- **Desvios da referência (todos por regra do projeto):** vidro a 75% (a referência usa 60%: com `bg-inverse` o texto branco ficaria em ~4,4:1 sobre fundo claro; a 75% passa de 7:1); botão CTA continua rosa (`ui-botao--primario`, mesmo botão em todo o site) e não vira branco; logo vira silhueta branca por `filter` até haver a versão branca (pendente do cliente); altura da barra fixa (72 px) em vez de animar o padding vertical; botão de menu sempre 48 px (alvo de toque); faixa de preço continua rolando (não fica fixa); gaveta sem as colunas "Compare/Company" (nada inventado).
- **Critérios de aceite (substituem os de `header-fundo`, `backdrop-blur` e listener):**
  - [auto] `HeaderBarra` tem um único listener, `scroll`, passivo, com rAF e limiares 60/52; nenhum `IntersectionObserver` no header; `backdrop-filter` só em `header.css`; todo seletor de `header.css` é `[data-anim]`; transições só de propriedades previstas e durações/curvas de tokens (`motion.test.ts`, `header.test.tsx`).
  - [auto] Botão de menu `data-anim="header-menu"` com 9 pontos; X com 4 pontos ocultos; gaveta com título, X e fundo `aria-hidden`.
  - [manual 390, 768, 1280] Topo: barra transparente; rolando acima de 60 px vira pílula em ~300 ms e volta abaixo de 52 px (sem piscar entre 52 e 60); links inline só a 1280; logo centrado a 1280; barra com 72/64 px de altura nos dois estados; CLS do header < 0,02.
  - [manual] Gaveta: abre/fecha com botão, X, Esc, fundo e link; foco no X, preso, volta ao botão; `inert` no resto; barra inferior (mobile) `inert`.
  - [manual] Sem JS: pílula sempre visível; links como lista simples abaixo de 1280.

## Revisão 2: vidro CLARO — glassmorphism (17/11/2026, pedido do usuário)
O fundo **preto/cinza-escuro** da pílula (e do círculo do botão de menu) virou **vidro claro**: `--pilula-vidro` = `--color-surface` a **45%** (era `bg-inverse` a 75%), `backdrop-filter: blur(1,5rem) saturate(1.6)`, fio de luz `1px` (`--pilula-borda`, surface a 80%) e `--shadow-2`; no topo (sem rolar) tudo isso vai a transparente/zero. Como o vidro agora é claro: **links e pontos do menu em `--color-text` (escuros) nos dois estados** e o **logo fica colorido** (sem o `filter` de silhueta branca; só encolhe a 0,75 ao rolar). O CTA continua rosa. Contraste: sobre a faixa escura do CTA final o vidro a 45% fica ~`#87` e o texto escuro passa de AA; sobre fundo claro o desfoque mostra o conteúdo por baixo. Ajuste fino em `src/app/globals.css` (`--pilula-vidro` / `--pilula-borda`). Onde esta ficha falar de "vidro escuro", "logo branco" ou "links brancos", vale esta revisão.

## Vídeo "Dor nas costas" substituído (17/11/2026)
O usuário trocou `public/assets/dor_nas_costas.mp4` (agora 1920×1080, 3,9 s, com áudio e **moldura preta de filme nas bordas**). Regerados (original mantido): `dor_nas_costas-site.mp4` (sem áudio, **cortado a 74% e deslocado para manter a pessoa à direita**, sem a moldura, 1280×720, 310 KB) e `dor_nas_costas-poster.webp` (14 KB). Os nomes não mudaram, então o conteúdo não precisou mudar. O clipe (3,9 s) agora é mais curto que o passo (8 s): fica em loop. O chat de vidro cai sobre o tronco da pessoa (canto inferior direito): reconferir o enquadramento se o clipe mudar de novo.
