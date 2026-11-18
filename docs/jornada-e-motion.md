# Jornada e Motion — A.FISIO POP (Fases 8 e 9)

> Mapa macro de scroll + regras e receitas de movimento comuns a todas as seções. As fichas (`sections/fichas-secoes.md`, campos 6, 7 e 8) só apontam para as receitas daqui e dizem o que muda em cada seção. Nível: **N1, com 1 momento N2** (`ProblemaSolucaoPalco`). Sem N3.
>
> **Conferido com o framework (Fase 10, 2ª passada):** as regras originais do `09-MOTION` e do `08-JORNADA-UX` foram recebidas e este documento foi conferido e corrigido contra elas. Relatório, divergências e o que mudou: **`docs/conferencia-jornada-motion.md`**. Mudanças desta passada neste arquivo: §1 (estágios do framework, **mapa de eventos**, verificação), §2 (M8 e M9 reescritas), §3.1–§3.6 (mecanismo `data-js`/`data-motion`, catálogo com **nível** e faixa de duração, rolagem suave só com mouse, **um destaque por tela**), §4, §5.

## 1. Mapa macro de scroll (entrada → confiança → interesse → decisão → conversão → fecho)

Leitura típica: mulher, 25–55, vem do story/reel do Instagram, celular em 360–430px, polegar, uma mão, atenção curta. A página é longa no mobile; a decisão tende a acontecer cedo (hero a preço), por isso o CTA aparece desde a 1ª tela.

| # | Seção | Intenção | A pessoa pensa | Sente | Faz | CTA principal na tela | Barra (mobile) |
|---|---|---|---|---|---|---|---|
| 0 | Faixa + header | entrada | "É isso mesmo que o anúncio disse?" | curiosidade | lê a faixa, vê o preço | — (header ≥768) | oculta até o hero resolver |
| 1 | Hero | entrada | "Perto de mim, R$ 49,99, é pra mim?" | acolhida | toca no CTA **ou** rola | **sim** (1) | oculta |
| 2 | Prova rápida | confiança | "Existe de verdade? Desde quando?" | segurança | passa batido (2 s) | — | visível |
| 3 | Problema/solução | interesse | "Esse sou eu" | reconhecimento (o "wow") | lê as queixas; toca na solução ou segue | **sim** (2, ao fim) | visível → oculta no CTA |
| 4 | Serviços | interesse | "Qual serve pra mim? Quanto é cada um?" | clareza | lê 1–3 cards; toca em "Chamar sobre este serviço" | não (link `servico`) | visível |
| 5 | Como funciona | decisão | "É complicado? E se eu não souber o que tenho?" | alívio | entende 3 passos | **sim** (3) | oculta no CTA |
| 6 | Preço POP | decisão | "Tem pegadinha?" | confiança no preço | confere o que inclui | **sim** (4) | oculta no CTA |
| 7 | Para quem é | decisão | "Isso vale pro meu caso?" | pertencimento, honestidade | se reconhece | — | visível |
| 8 | Depoimentos | confiança | "Alguém como eu já foi?" | validação social | lê | — | visível |
| 9 | Unidades | conversão | "Qual fica mais perto?" | praticidade | escolhe a unidade | **sim** (5) | oculta no CTA |
| 10 | FAQ | conversão | "Última dúvida" | tranquilidade | abre 1–2 perguntas | — | visível |
| 11 | CTA final | conversão | "Ok, vou chamar" | decisão | toca no CTA | **sim** (6) | oculta no CTA |
| 12 | Footer | fecho | "Tem CREFITO? Onde achar de novo?" | confiança final | lê contatos/legal | — | visível |

**Objeções e onde caem:** "tem pegadinha no preço?" → S12 e FAQ · "não sei qual serviço" → S03 (5º par, avaliação) e S07 · "é confiável?" → S02, S10, footer (registro só quando preenchido) · "fica longe?" → S17 · "e se doer/pós-operatório?" → FAQ · "é só promoção?" → tom sem urgência em toda a página (nada de contagem regressiva).

**Pontos de atenção da jornada**
- O 1º CTA aparece sem rolar em 360×640 (hero texto primeiro). A barra inferior fica **oculta** nesse momento, para não haver dois botões idênticos na tela.
- Entre S02 e S03 não há CTA principal: é onde a barra aparece pela primeira vez. É esperado.
- Depoimentos (confiança) vêm depois da decisão de preço de propósito: reforçam antes de escolher a unidade. Enquanto forem provisórios, o selo avisa.
- Nenhum pop-up, modal automático, contagem regressiva ou "últimas vagas".

### 1a. Estágios do macro (08-JORNADA-UX: descoberta → ação)
| Estágio do framework | Nossa intenção (coluna acima) | Seções | Pergunta que a página responde |
|---|---|---|---|
| Descoberta | entrada | 0 Header, 1 Hero | "Do que se trata, quanto custa?" |
| Consideração | confiança + interesse | 2 Prova rápida, 3 Problema/solução, 4 Serviços, 8 Depoimentos | "É pra mim? É confiável? Qual serviço?" |
| Decisão | decisão | 5 Como funciona, 6 Preço POP, 7 Para quem é | "É simples? Tem pegadinha? Vale pro meu caso?" |
| Ação | conversão + fecho | 9 Unidades, 10 FAQ, 11 CTA final, 12 Footer | "Onde? Última dúvida. Vou chamar." |

CTA no **início** (hero), no **meio** (S03, S07, S12) e no **fim** (S17, S19), mais o acesso fixo.

### 1b. Mapa de eventos de analytics (08-JORNADA-UX)
Os eventos são o **contrato**; a v1 não tem analytics (decisão do projeto). A marcação já existe (`data-cta`, `data-cta-local`, `data-item`, `data-section`) e só é lida depois que houver consentimento (T5.2/T6.5). **Nenhum pixel ou script de medição carrega sem consentimento.**

| Evento | Gatilho (seletor) | Parâmetros | Onde |
|---|---|---|---|
| `cta_principal_click` | clique em `[data-cta="principal"]` | `local` = `data-cta-local` | header, header-painel, hero, problema-solucao, como-funciona, preco-pop, unidades, cta-final, barra |
| `whatsapp_click` | clique em qualquer link que abre `wa.me` (`principal`, `servico`, `flutuante`, link `whatsapp` do footer) | `tipo` = `data-cta` (ou `footer`), `local`, `servico` (se houver) | todas as acima + serviços, flutuante, footer |
| `servico_click` | clique em `[data-cta="servico"]` | `servico` = `data-item` do card | S06 |
| `faq_open` | `toggle` aberto de um `<details>` do FAQ | `pergunta` = `data-item` (`pergunta-1`…`pergunta-7`) | S16 |
| `scroll_depth` | `IntersectionObserver` em sentinelas (sem listener de `scroll`) | `percentual` = 25, 50, 75, 100 | página inteira |
| *(extra)* `menu_open` | abertura do painel do menu | — | header |
| *(extra)* `mapa_open` | toque em "Ver no mapa" | `unidade` = `data-item` | S17 |
| *(extra)* `solucao_click` | clique no link da solução | `solucao` = `data-item` do par | S03 |

Um clique no CTA principal dispara **dois** eventos (`cta_principal_click` e `whatsapp_click`), de propósito: um mede o botão, o outro mede a intenção de conversa. Os extras são permitidos porque não substituem nenhum da lista.

### 1c. Verificação do 08-JORNADA-UX (feita na Fase 10)
- [x] Macro cobre descoberta → ação (§1 e §1a).
- [x] Toda seção tem o micro completo (**8 campos + objetivo único**) no campo 6 da sua ficha (inclusive Saída e Evento).
- [x] Todo hover tem equivalente no toque e no foco (`botao`, `card-realce`: ver §3.4).
- [x] CTA no início, no meio e no fim.
- [x] Nenhuma seção com dois objetivos (cada ficha declara o **Objetivo único**).
- [x] Eventos definidos (§1b).
- Regras de jornada: toda interação tem propósito (nada decorativo clicável); **feedback < 100 ms** (`:active` usa `dur-instant` = 100 ms); **sem becos sem saída** (toda página interna, inclusive 404, `/privacidade` e `/termos`, leva ao início e tem o WhatsApp pela barra/flutuante do layout); sem scroll-jacking; sem autoplay que roube foco (vídeo mudo, sem foco, só `poster` em reduced-motion); sem pop-ups; o conteúdo vem antes da animação.

## 2. Decisões de movimento (Sessão 3)

| # | Decisão | Motivo | Reverter se |
|---|---|---|---|
| M1 | **Motion, GSAP e Lenis não entram na v1.** N1 = CSS (transições/keyframes com tokens) + `IntersectionObserver`s próprios, **um por finalidade** (reveal em `MotionInit`, CTAs em `CtaObservador`, faixa do header em `HeaderBarra`, palco em `ProblemaSolucaoPalco`; nenhum listener de `scroll`). O momento N2 usa `position: sticky` nativo + `IntersectionObserver`; não há pin com ScrollTrigger. | Tráfego mobile do Instagram: cada KB pesa em LCP/INP. Tudo o que foi definido cabe em `transform`/`opacity`, sem animação encadeada nem scrub. Sem pin = sem *spacer*, sem CLS, sem scroll-jacking nem no desktop. | O usuário quiser progresso scrubbed (ex.: linha que acompanha a rolagem): aí entra GSAP + ScrollTrigger só no palco, carregado sob demanda em ≥1024. Lenis só se pedirem rolagem suave, e então apenas `(hover: hover) and (pointer: fine)`, ≥1024, sem reduced-motion |
| M2 | **Marquee dos serviços: não entra.** | Movimento contínuo vai contra a direção calma, atrapalha a leitura no celular e exige controle de pausa (WCAG 2.2.2). Os 7 serviços já estão em grade. | — |
| M3 | **Contagem numérica na S02: não entra.** | Só há um número contável ("+14 mil") e ele é `validar`; contador animado sem fonte é proibido. Os demais valores são texto. | O número ganhar fonte confirmada |
| M4 | **Pulso do flutuante: 2 pulsos na primeira aparição, depois estático.** | Pulso infinito lembra "promoção" e viola 2.2.2. | — |
| M5 | **Só `transform` e `opacity` mesmo para estados** (fundo do header, realce de card, queixa ativa): cada um vira uma camada/pseudo-elemento cuja `opacity` ou `transform` anima. Nada anima `color`, `background`, `box-shadow`, `height`. | Regra inegociável do `CLAUDE.md`. | — |
| M6 | **Header sem `backdrop-blur`.** O fundo ao rolar é sólido `bg-bg`, então o blur não tem efeito visível e custa GPU no mobile. | Regra M5 + desempenho. (A ficha antiga citava blur leve; sai.) | Fundo semitransparente com token próprio |
| M7 | **Nada acima da dobra começa escondido** (h1, subtítulo, CTA, imagem do hero). | LCP < 2,5s; o CTA do hero tem de existir no primeiro quadro. | — |
| M8 | **Layout do palco (≥1024) decidido antes da primeira pintura** por `html[data-js]` (posto pelo script inline) combinado com `@media (min-width: 1024px) and (prefers-reduced-motion: no-preference)` e `:not([data-js-falhou])`; nunca depois da hidratação. **Não** usa `data-motion` (que só existe depois que o JS de animação está pronto, regra 5 do `09-MOTION`). | Trocar a grade pelo palco após hidratar causaria CLS. O palco **não esconde conteúdo**: a lista de queixas fica inteira visível, e o `palco-painel` ativo já vem do HTML (1º par `ativa`). | — |
| M9 | **Falha segura global:** o script inline arma um *watchdog* de 4 s **só quando há JS** (sem JS não há temporizador: tudo já está visível). O primeiro componente client que iniciar (`CtaObservador` ou `MotionInit`) marca `data-js-pronto` no `<html>`. Se o prazo vencer sem a marca, ou se um deles lançar erro, o `<html>` ganha `data-js-falhou`: o CSS mostra barra e flutuante, desliga o layout do palco e o `MotionInit` (se já tiver posto) remove `data-motion`. | `pendente` (barra e flutuante escondidos) e o layout do palco dependem do script inline; se a hidratação nunca vier, a página perderia o CTA fixo. O `catch` sozinho não cobre "o JS nunca rodou". Os `reveal` **não** dependem do watchdog: só ficam escondidos depois que `data-motion` é posto pelo JS já pronto (§3.3). | Nunca |
| M10 | **O estado oculto dos `reveal` só existe depois que o JS de animação está pronto** (`data-motion="on"` é posto por `MotionInit`, **não** pelo script inline) e nunca vale para nada que já esteja na tela nesse instante (regra 5 do `09-MOTION`). **Sem entrada animada para o selo do hero** (ele é conteúdo do 1º viewport): `selo` fica N0, estático. | O texto do hero e a mídia candidata a LCP não podem nascer ocultos nem esperar temporizador. | Nunca |

## 3. Regras de motion comuns

### 3.1 Tokens (só estes; nenhum valor solto)
`--dur-instant` 100 · `--dur-fast` 180 · `--dur-base` 300 · `--dur-slow` 500 · `--dur-slower` 800 · `--ease-standard` · `--ease-out` (entradas) · `--ease-in` (saídas) · `--ease-in-out` · `--stagger-step` 60ms · `--reveal-distance` 24px. Em `prefers-reduced-motion` os tokens já caem (`dur-* = 0,01ms`, distância 0).

**Faixas do framework (complementares do `09-MOTION`):** microinteração **100–250 ms** (`dur-instant` 100, `dur-fast` 180) · reveal **300–600 ms** (`dur-base` 300, `dur-slow` 500) · transição de seção/painel **até ~800 ms** (`dur-slower` 800 só em decoração). Toda receita do §3.4 declara a faixa em que cai. Durações **só dos tokens**. Reveals disparam **uma vez** por elemento. `will-change` **só durante a animação** e em **poucos elementos** (no máximo os que animam ao mesmo tempo, na prática ≤ 6); nunca permanente. Escalas de press/hover (1,02 e 0,98) ficam como variáveis em `globals.css` (`--scale-hover`, `--scale-press`), sem editar `design-tokens.css`.

### 3.2 As 3 versões (valem para toda receita, salvo indicação)
| Versão | Quando | Regra geral |
|---|---|---|
| **Desktop/tablet** | `≥768px`, sem reduced-motion | durações `slow`; stagger de 60ms; entradas com `reveal-distance` |
| **Mobile** | `<768px`, sem reduced-motion | durações `base` (mais seco); **sem stagger** (1 coluna: cada item entra quando é visto); mesma distância |
| **Reduced-motion** | `prefers-reduced-motion: reduce` | **não é "sem animação"** (regra do `09-MOTION`): o movimento é trocado por **estado instantâneo** (os tokens de duração caem para ~0): tudo visível e no lugar final; estados trocam de uma vez. Sem parallax, zoom, rotação, pulso, loop, autoplay nem palco. (Uma troca de opacidade curta é permitida pelo framework; a v1 usa a instantânea, que é a mais simples e segura) |

Cada receita do §3.4 declara **as três versões** (nenhuma coluna fica em branco) e o **nível** (N0–N3). Onde o mobile é "igual" ao desktop, isso é uma versão declarada, não omissão.

### 3.3 Mecanismo (um só, em `src/lib/` e `src/ui/MotionInit.tsx`)
1. **Sem JS ou reduced-motion:** o HTML já vem no estado final. Nada fica escondido.
2. **Script inline (só com JS), antes da primeira pintura:** põe apenas `data-js` no `<html>` e arma o watchdog (item 4b). **Não** põe `data-motion` e **não esconde nada**. `data-js` serve a duas coisas que não escondem conteúdo: o layout do palco (M8) e o estado `pendente` da barra e do flutuante (§5).
3. **`MotionInit` (client, 1 por página), quando o JS de animação está pronto e sem `prefers-reduced-motion`**, nesta ordem: (a) marca `data-js-pronto`; (b) marca `data-estado="visto"` em **todo** `reveal`/`stagger-item` que já intersecta a viewport (sem margem), **sem animar**; (c) só então põe `data-motion="on"` no `<html>` (regra 5 do `09-MOTION`: estado oculto só depois do JS pronto); (d) cria **um** `IntersectionObserver` para o resto (`threshold` 0,15; `rootMargin` inferior `-10%`): ao entrar marca `visto` e **para de observar** (uma vez por elemento). Assim nada que o visitante já vê chega a ficar oculto, e nada acima da dobra tem `data-anim="reveal"` de qualquer forma (M7).
4. **Falha segura:** se a inicialização lançar erro, o `catch` remove `data-motion` e põe `data-js-falhou`; tudo aparece. Sem `will-change` permanente (só durante a transição).
4b. **Watchdog (M9):** o script inline arma um `setTimeout` de 4 s (constante nomeada no script; não é token CSS) **apenas quando há JS**. Se vencer sem `data-js-pronto`: põe `data-js-falhou`. CSS: `html[data-js-falhou]` mostra `ui-barra-cta` (<768) e `whatsapp-float` (≥768) e desliga o layout do palco (grade estática). Sem JS **não existe temporizador**: o HTML já está no estado final. Teste: bloquear o bundle JS e conferir CTA fixo e conteúdo todo visíveis (sem JS: de imediato; JS lento: após 4 s).
5. Só `[data-anim]` é seletor. CSS usa `[data-motion="on"] [data-anim="reveal"]:not([data-estado="visto"])` (e o equivalente de `stagger-item`).
6. Alvo de peso: código próprio de motion < 5 KB gzip (verificar no build).

### 3.4 Catálogo de receitas (`data-anim`)
Todas só com `transform`/`opacity` (regra 4 do `09-MOTION`). Nível: N0 estático · N1 CSS leve (microinteração, reveal) · N2 momento de rolagem (só ≥1024; no mobile cai para N1) · N3 não existe na v1. **Faixa** = categoria do framework em que a duração cai.

| `data-anim` | Nível | Receita | Faixa | Desktop/tablet (≥768) | Mobile (<768) | Reduced-motion |
|---|---|---|---|---|---|---|
| `reveal` | N1 | `opacity 0→1` + `translateY(reveal-distance → 0)`, uma vez | reveal | `dur-slow` (500), `ease-out` | `dur-base` (300), `ease-out` | estado final instantâneo |
| `stagger-item` | N1 | `reveal` em filhos do mesmo pai, atraso `stagger-step × índice`, **teto de 3 passos** (180 ms) | reveal | sim | **não** (cada um como `reveal`) | estado final instantâneo |
| `header-pilula` | N1 | **exceção do header (decisão do usuário, 16/11/2026, referência "pílula de vidro")**: a barra (transparente no topo) vira pílula de vidro escuro ao rolar > 60 px (volta ≤ 52 px): `max-width`, `padding`, `gap`, fundo e `backdrop-filter` (blur). Gatilho: listener de scroll passivo + rAF no `HeaderBarra`; CSS em `src/app/header.css`; altura da barra fixa (CLS 0) | transição | `dur-base` (300), `ease-out` | igual (declarada) | troca instantânea |
| `header-logo` | N1 | **exceção do header:** `scale(1 → 0,75)` (centrado a partir de 1280 px) e `filter` colorido → silhueta branca (provisório até haver logo branco) | transição | `dur-base`, `ease-out` | igual (declarada) | troca instantânea |
| `header-link` | N1 | **exceção do header:** cor escura → branca com a pílula; hover `opacity .6` só em `(hover: hover)` | micro | `dur-base` (cor) e `dur-fast` (opacity) | igual (declarada; sem hover no toque) | troca instantânea |
| `header-menu` | N1 | **exceção do header:** botão de menu (grade de pontos) ganha círculo de vidro com blur e cor branca com a pílula | transição | `dur-base`, `ease-out` | igual (declarada) | troca instantânea |
| `painel` | N1 | gaveta lateral (menu): `translateX(100% → 0)`; fechada = `visibility: hidden` depois da saída | transição | `dur-base`, `ease-out` | igual (declarada; largura 100% abaixo de 32rem) | troca instantânea |
| `painel-fundo` | N1 | fundo escurecido da gaveta (`--color-overlay`): `opacity 0→1`; toque nele fecha | micro | `dur-base`, `ease-out` | igual (declarada) | troca instantânea |
| `barra-cta` | N1 | `translateY(100% → 0)` + `opacity` | transição | não existe (≥768 não há barra) | entra `dur-base` `ease-out`; sai `dur-fast` `ease-in` | troca instantânea |
| `float` | N1 | `scale(0,8 → 1)` + `opacity` | transição | entra `dur-base` `ease-out`; sai `dur-fast` `ease-in` | não existe | troca instantânea |
| `float-pulso` | N1 | anel (pseudo-elemento) `scale(1 → 1,4)` + `opacity .. → 0`, **2 vezes** na 1ª aparição; **cancelado** se o palco estiver na tela (§3.6) | decoração (≤ 800 por pulso) | `dur-slower` (800) × 2 | não existe | nenhum |
| `botao` | N1 | **hover e foco:** `scale(--scale-hover)` (hover só em `(hover: hover)`; foco em `:focus-visible`, além do anel); **toque:** `:active` `scale(--scale-press)` | micro | `dur-fast`, `ease-standard`; `:active` com `dur-instant` (100 ms, feedback < 100 ms) | só `:focus-visible` e `:active` (`dur-instant`) | `:active` e foco sem transição |
| `card-realce` | N1 | pseudo-elemento com `shadow-2` cuja `opacity 0→1`; **hover** (`(hover: hover)`) **ou** `:focus-within` (equivalente no foco/teclado) | micro | `dur-fast` | `:focus-within` e `:active` do link, `dur-fast` | sem transição |
| `accordion-icone` | N1 | `rotate(0 → 45deg)` com `[open]` ("+" vira "×", como a Superpower) (estado; a transição é `transform`) | micro | `dur-fast` `ease-standard` | igual (declarada) | instantâneo |
| `accordion-resposta` | N1 | `opacity 0→1` ao abrir (keyframe CSS; altura **não** anima) | reveal | `dur-base` `ease-out` | igual (declarada) | instantâneo |
| `pin-palco`, `palco-painel`, `queixa`, `queixa-marca` | **N2** (≥1024) | momento "Um problema, uma solução" (§4). `palco-painel`: entra `opacity`+`translateY`, sai `opacity`; `queixa-marca`: `scaleY 0→1`; `queixa`: `translateX` | reveal (entra 500) / transição (sai 300; marca 300) | só ≥1024 com `data-js` e sem reduced-motion | **N1**: lista de pares com `reveal` (teto N2 simplificado: sem palco, sem pin) | grade estática (sem palco) |
| `mapa-embed` | N1 | iframe do mapa `opacity 0→1` depois do clique | reveal | `dur-base` | igual (declarada) | instantâneo |

`selo` **saiu do catálogo** (M10): o selo R$ 49,99 do hero é N0, estático. `will-change` só durante a animação e nos poucos elementos que animam juntos.

**Mapeamento dos tokens de duração:** feedback de toque/hover/foco = `instant`/`fast`; entrada de elemento = `slow` (desktop) / `base` (mobile); saída = sempre `fast` e `ease-in`; decoração longa (pulso) = `slower`.

### 3.5 Anchor, foco e rolagem (globais, em `globals.css`)
- `scroll-behavior: smooth` **só** dentro de `@media (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)`: a rolagem suave fica **desligada no toque** (regra 7 do `09-MOTION`) e em reduced-motion. No toque a âncora salta direto, respeitando o `scroll-padding`.
- `html { scroll-padding-top: calc(var(--header-height) + var(--space-4)); }` — âncoras (`#servicos` etc.) não ficam sob o header sticky. No mobile, `scroll-padding-bottom: var(--barra-cta-altura)` evita que a barra cubra o elemento focado (WCAG 2.4.11).
- Nenhum `scroll-snap`, nenhum `wheel`/`touchmove` com `preventDefault`, nenhum listener de `scroll` (tudo por `IntersectionObserver`), para proteger o INP.

### 3.6 Um efeito de destaque por tela (regra 8 do `09-MOTION`)
**Destaque** = o único efeito que chama o olhar; **segundo plano** = o que acompanha sem disputar (reveal/stagger discretos, estados de interface). Só dois efeitos podem ser destaque na v1:
| Destaque | Onde | Regra de convivência |
|---|---|---|
| **Palco do S03** | ≥1024, seção S03 | Enquanto o palco está na tela, **nada mais é destaque**: o `float-pulso` é cancelado (`CtaObservador` consulta se `pin-palco` intersecta) e os `par` da lista **não** usam `reveal`/`stagger-item` no modo palco (só `queixa-marca` e `palco-painel`); o `cabecalho` pode ter `reveal` (segundo plano) |
| **`float-pulso`** | ≥768, 1ª aparição do flutuante | Só roda se o palco **não** estiver na tela; roda 2× e nunca mais |

Tudo o mais é segundo plano: `reveal`/`stagger-item` das seções, `header-*`, `painel`, `painel-fundo`, `botao`, `card-realce`, `accordion-*`. **A barra inferior (`barra-cta`) é feedback funcional de estado** (entra e sai conforme há ou não CTA na tela), não destaque; ela só existe <768, onde não há palco nem pulso. O hero não tem destaque animado (M10). No mobile cada tela tem no máximo o `reveal` da seção que entra.

## 4. Momento N2 — "Um problema, uma solução" (`ProblemaSolucaoPalco`, só S03)

**Princípio:** a lista de pares (S03) é a base. O palco é um aprimoramento que **só existe em ≥1024, com `data-js` (script inline) e sem reduced-motion** (M8). Ele **não esconde conteúdo**: a lista inteira fica visível e o 1º `par` já nasce `ativa` no HTML; o JS só troca o estado.

**Percurso (desktop):**
1. A `lista` ocupa as colunas 1–6; cada `par` é uma etapa com `py-9` (altura da etapa ≈ o texto da queixa + respiro; 5 etapas ≈ 2 telas de rolagem). O `palco` (colunas 8–12) é `sticky` abaixo do header: **o pin é CSS nativo**, sem *spacer*, sem biblioteca.
2. Uma faixa fina no **centro da viewport** (`rootMargin: -45% 0 -45% 0`) define a etapa ativa: o `par` que a cruza vira `data-estado="ativa"`; os demais `inativa`. Primeiro `par` ativo ao carregar (palco nunca vazio).
3. **Troca:** o `palco-painel` da queixa ativa entra (`opacity 0→1` + `translateY(reveal-distance → 0)`, `dur-slow`, `ease-out`); o anterior sai (`opacity 1→0`, `dur-base`, `ease-in`) ao mesmo tempo, sobrepostos na mesma célula. Nenhum scrub: a rolagem só dispara a troca, não a conduz.
4. **Queixa ativa:** todas ficam em `text-foreground` (contraste cheio, sem opacidade). A ativa ganha `queixa-marca` (barra decorativa `brand-pink`, `scaleY 0→1`, `dur-base`) e desloca `translateX(var(--space-3))`. Nada de trocar a cor (M5).
5. Saída do palco: quando a seção termina, o `sticky` solta sozinho com a rolagem normal.

**Acessibilidade e teclado (decisão para o usuário confirmar):** o `palco` é um espelho visual (`aria-hidden`, `inert`, sem link). A `solucao` de cada `par` continua no DOM e é lida por leitores de tela; no modo palco ela fica `sr-only` e **aparece ao receber foco** (`focus-within:not-sr-only`), mostrando o link na própria lista. `focusin` num `par` o torna ativo. Mouse: o nome da solução no palco **não** é clicável; quem quer ir ao serviço usa o CTA do fim da seção ou a seção Serviços logo abaixo.

**Mobile/tablet:** lista de pares empilhada (mobile) ou em 2 colunas (tablet), cada par com `reveal`; sem pin, sem gestos, sem palco.
**Reduced-motion:** o desktop usa a grade estática do tablet.
**Teste:** sem JS, com reduced-motion e com `data-js-falhou` (erro ou watchdog), a seção mostra as 5 queixas e as 5 soluções na grade estática.

## 5. Visibilidade da barra inferior e do flutuante (`CtaObservador`)

Substitui o "hook provisório" `useCtaPrincipalVisivel`. **Decisão de arquitetura:** não é hook com estado React. É um **`IntersectionObserver` único**, criado por um componente client sem saída visual (`CtaObservador`, no layout), que **escreve atributos direto no DOM** (`data-estado`, `inert`). Assim a barra (`UiBarraCta`) e o `WhatsappFloat` continuam **server** e nada re-renderiza ao rolar. A regra vive em função pura em `src/lib/cta-visibilidade.ts` (testável no Vitest, com timers falsos).

**O que observa:** todos os `[data-cta="principal"]` **menos** `data-cta-local` `barra`, `header` e `header-painel` (um CTA novo entra na regra sozinho).

**Margens e limiar**
- `rootMargin`: topo `-var(--header-height)` (o header sticky cobre o topo) · base `-(altura da barra)`, medida por `ResizeObserver` e publicada em `--barra-cta-altura` (0 em ≥768, onde a barra não existe).
- "Visível" = `intersectionRatio ≥ 0,5` (`threshold: [0, 0.5, 1]`). Um CTA metade escondido atrás do header ou da barra **não** conta.

**Sinais e regras**
| Sinal | Quem usa | Regra |
|---|---|---|
| `algumCtaVisivel` | `UiBarraCta` | `true` → barra `oculta` **imediatamente**; `false` → barra `visivel` **após `dur-base` (300 ms) contínuos sem nenhum CTA visível** |
| `heroVisivel` (CTA `hero`) | `WhatsappFloat` | `true` → flutuante `oculto`; `false` → `visivel` após os mesmos 300 ms |

- **Histerese:** o atraso de 300 ms só vale para **mostrar**; esconder é imediato. Se dois CTAs estão separados por pouca rolagem (o intervalo sem CTA dura < 300 ms), a barra nem reaparece. Evita piscar.
- **Foco:** enquanto o foco estiver dentro da barra (`:focus-within`), ela **não** esconde.
- **Escondida =** `inert` + `data-estado="oculta"` + `translateY(100%)` e `opacity 0` (não só transparente).
- **Estado inicial:** sem JS, `visivel`. Com JS (`data-js`, posto pelo script inline), ambos nascem `pendente` (escondidos, sem transição) e são resolvidos no 1º callback do observer (≈1 quadro), sem animar. Assim a barra não pisca no hero e o flutuante não pisca no topo. **`pendente` tem prazo:** o watchdog de 4 s (M9, §3.3 item 4b) mostra os dois se o observador nunca iniciar. **Divergência da regra 5 do `09-MOTION` ACEITA pelo usuário (16/11/2026):** `pendente` é aplicado pelo script inline (`data-js`), não pelo JS de animação pronto. Justificativa: é um controle fixo, **não** conteúdo do 1º viewport nem candidato a LCP; o conteúdo e os CTAs inline continuam visíveis; sem JS não há temporizador (fica visível); e sem isso a barra apareceria por cima do CTA do hero até a hidratação (dois botões idênticos).
- **Transições:** `barra-cta` e `float` (seção 3.4). `float-pulso` roda 2 vezes na 1ª vez que o flutuante vira `visivel`, **exceto** se o palco do S03 estiver na tela (§3.6: um destaque por tela).
- **Painel do menu aberto:** barra recebe `inert` (o painel `z-overlay` já a cobre) e volta ao estado calculado ao fechar.
- **Reduced-motion:** a lógica de esconder/mostrar continua; só a transição some.
- **Teste de aceite (390×844, 1280×800):** varredura do topo ao rodapé; no mobile a barra muda de estado no máximo 1 vez por CTA de conteúdo (≈ 6 ciclos esconde/mostra na página inteira); nunca há 2 botões "Agendar meu horário no WhatsApp" visíveis ao mesmo tempo; Tab nunca para num controle escondido.

## 6. Regras de mobile (campo 8, comuns)
- **Alvos de toque** ≥ `min-h-touch` (48px); espaço entre alvos ≥ `space-2`.
- **Gestos:** nenhum gesto horizontal (sem carrossel, sem swipe); a rolagem vertical nativa é a única interação de conteúdo. Sem pinça/zoom bloqueado; sem `touch-action` restritivo.
- **Lenis:** não existe na v1 (M1); se vier, desligado no toque.
- **Barra fixa:** `fixed` + `--safe-bottom` + `viewportFit: "cover"`. O site **não tem campo de texto**, então o teclado virtual do iOS não aparece e não desloca a barra. Se um campo entrar (cookie, formulário), reavaliar com `visualViewport`.
- **Altura de viewport:** nada usa `100vh`; quando precisar, `svh` (barra do navegador no iOS/Android muda de altura ao rolar).
- **Painel do menu:** cobre a barra (`z-overlay`), trava a rolagem do fundo (`overflow: hidden` no `body` + `inert` no resto), fecha com Esc, toque num link, toque fora do botão ou ao passar de 1024px de largura.
- **Rodapé:** `pb` reserva a barra; a barra nunca fica sobre o último link.
- **Vídeo (quando houver):** `muted`, `playsinline`, `loop`, `poster`, `preload="metadata"`, inicia só ao entrar na tela (IO) e pausa ao sair; em reduced-motion mostra só o `poster`; sem som, sem controle automático.
- **Desempenho:** sem animação em imagem LCP; `content-visibility: auto` só em seções abaixo da 3ª tela (avaliar no build; não reserva altura errada).

## 6b. Cabeçalho do menu sem JS (registrado na Fase 10)
Sem JS o `botao-menu` do mobile não abre o painel, então a navegação por âncora do header fica indisponível. É aceito porque a página é de uma coluna só (tudo alcançável por rolagem) e o `footer` repete os links de navegação; o CTA continua acessível pela barra inferior e pelos CTAs de conteúdo.

## 7. O que muda nos outros documentos
- `fichas-secoes.md`: campos 6, 7 e 8 preenchidos (13 fichas + ficha global do acesso fixo); campo 4 de S03 e do header ajustados (queixa inativa e `backdrop-blur`).
- `componentes.md`: `CtaObservador` e `MotionInit` (client) no lugar do hook; `UiBarraCta` e `WhatsappFloat` ficam **server**; `UiAccordion` não precisa de JS.
- `convencao-de-nomes.md`: lista de valores de `data-anim` e `data-estado`.
- `direcao-de-arte.md` (Movimento): marquee e contagem saem; pulso limitado.
