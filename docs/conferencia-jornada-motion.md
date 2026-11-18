# Conferência: `jornada-e-motion.md` e fichas × `09-MOTION` e `08-JORNADA-UX` (2ª passada, Fase 10)

> **Esta versão substitui a anterior.** A 1ª passada foi feita **sem** os arquivos do framework (só contra as 7 regras que o `CLAUDE.md` v0 resumia). Esta usa as **regras originais** do `09-MOTION` (10 regras + complementares) e do `08-JORNADA-UX` (micro de 8 campos, macro, mapa de eventos, regras e verificação), recebidas na Sessão 4. Só documentos foram alterados; nenhum código.
> Legenda: ✔ **compatível** · ◐ **divergência aceitável** (mantida, com justificativa) · ✖ **corrigir** (corrigido nesta passada; o que mudou está na seção 6).

## 1. `09-MOTION`: regra por regra
| # | Regra | Situação encontrada | Veredito |
|---|---|---|---|
| 1 | Toda animação tem 3 versões | O catálogo tinha as 3 colunas, mas várias linhas diziam só "igual" e `barra-cta`/`float` não deixavam claro onde não existem | ✔ O catálogo (§3.4) agora declara as 3 versões em **todas** as linhas; "igual (declarada)" é uma versão; "não existe" só onde o elemento não existe naquela largura (barra <768, flutuante e pulso ≥768) |
| 2 | Toda animação declara nível (N0–N3) | As fichas declaravam o nível por **seção** (campo 7), mas o catálogo de receitas **não** tinha nível | ✖ Coluna **Nível** no catálogo (todas N1; palco = N2 só ≥1024; selo = N0). As 14 fichas já declaram o nível (conferido) |
| 3 | Teto mobile N2 simplificado; N3 só no hero, tardio, com fallback estático | N2 só existia ≥1024 e o mobile ficava em lista com `reveal`; N3 não existe | ✔ Escrito explicitamente na ficha S03 e no catálogo: mobile = N1 (teto N2 simplificado), sem N3 |
| 4 | Só `transform`/`opacity` (filter com moderação); nunca `width`/`height`/`top`/`left`/`margin` | Todas as receitas já usam só `transform` e `opacity` (M5); `top` só aparece no `sticky` (posição, não animada). 1ª passada achou uma sobra (hover de sombra no S06), já corrigida | ✔ Nenhum `filter`. Regra reforçada no `CLAUDE.md` com a lista proibida |
| 5 | Conteúdo nunca invisível esperando animação; estado oculto só com JS pronto (classe no html) e nunca no 1º viewport | **Divergência real:** o script inline punha `data-motion="on"` **antes da hidratação**, ou seja, o estado oculto dos `reveal` valia **antes** de o JS de animação estar pronto (e dependia do watchdog de 4 s para reverter). Além disso o `selo` do hero (1º viewport) tinha entrada com `opacity 0` | ✖ **M10**: `data-motion="on"` passa a ser posto por `MotionInit` **quando o JS está pronto**, depois de marcar `visto` o que já está na tela; o script inline põe só `data-js`. **Selo do hero vira estático (N0)**. Sem JS não há temporizador. Detalhe na seção 2a |
| 6 | Nada depende de hover; todo hover tem equivalente no toque/foco | `botao` tinha hover + `:active` (sem foco); `card-realce` só no hover | ✖ `botao`: hover **e** `:focus-visible`, toque `:active`. `card-realce`: hover **ou** `:focus-within`. Registrado no catálogo e nas fichas S06 |
| 7 | Sem scroll-jacking no mobile; scroll suave desligado no toque | Sem scroll-jacking ✔. Mas `scroll-behavior: smooth` valia em **toda** tela sem reduced-motion, inclusive toque | ✖ Rolagem suave só em `(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)`; no toque a âncora salta (§3.5, `CLAUDE.md`, T2.1) |
| 8 | Um efeito de destaque por tela | Palco do S03 (≥1024) e `float-pulso` (≥768) podiam coincidir; nada dizia quem manda | ✖ **§3.6** (novo): só palco e pulso podem ser destaque; o pulso é **cancelado** com o palco na tela; os `par` não têm `reveal` no modo palco. Seção 2e |
| 9 | Uma biblioteca por elemento animado | Nenhuma biblioteca na v1 | ✔ |
| 10 | LCP < 2,5 s · INP < 200 ms · CLS < 0,1 | Alvos já nas fichas, no PRD e no `CLAUDE.md`; verificações em T2.6, T4.1, T4.2 e T6.2 | ✔ |

### Complementares
| Regra | Situação | Veredito |
|---|---|---|
| Durações vêm dos tokens | Só `dur-*`/`ease-*` | ✔ |
| Micro 100–250 ms · reveal 300–600 ms · transição até ~800 ms | Nenhuma receita declarava a faixa | ✖ Coluna **Faixa** no catálogo e parágrafo em §3.1; todas as durações caem na faixa (`fast` 180 e `instant` 100 = micro; `base` 300 e `slow` 500 = reveal; `slower` 800 = decoração do pulso, 1 pulso ≤ 800) |
| Reveals disparam **uma vez** | `unobserve` após `visto` | ✔ |
| `will-change` só durante a animação e em poucos elementos | Só dizia "sem `will-change` permanente" | ✖ Acrescentado "poucos elementos (≤ 6 simultâneos)" (§3.1) |
| Reduced-motion **não é "sem animação"**: troca movimento por mudança simples de opacidade ou estado instantâneo, sem parallax/zoom/rotação/autoplay | O texto dizia "sem animação" | ✖ Texto corrigido (§3.2): estado **instantâneo** (permitido pelo framework); sem parallax, zoom, rotação, pulso, loop, autoplay; vídeo só `poster` |

## 2. Conferências pedidas

### a) Regra 5 no hero
- **Texto do hero (h1, subtítulo, CTA) e mídia candidata a LCP:** nenhum tem `data-anim` de reveal (M7); aparecem no 1º quadro **com e sem JS**. A ficha S01 (campos 7 e 9) agora diz isso e tem teste manual com CPU limitada e `grep` por `data-anim`.
- **O estado oculto só vale com JS pronto:** corrigido (M10, §3.3). Ordem em `MotionInit`: `data-js-pronto` → marca `visto` o que intersecta a viewport (sem animar) → põe `data-motion="on"` → observa o resto. O script inline **não** põe `data-motion`.
- **Sem JS, tudo visível sem temporizador:** ✔. O watchdog de 4 s só é armado **quando há JS** e só serve à barra, ao flutuante e ao layout do palco (M9).
- **Residual aceito (◐) — DECISÃO DO USUÁRIO (16/11/2026, início do build): mantido.** `pendente` da barra e do flutuante é aplicado por `data-js` (inline), não pelo JS de animação pronto. Implementado assim na T2.1/T2.7 (HTML nasce `pendente`; o CSS só o esconde sob `html[data-js]:not([data-js-falhou])`). Justificativa (§5 de `jornada-e-motion.md`): é um controle fixo, não conteúdo do 1º viewport nem candidato a LCP; os CTAs inline seguem visíveis; sem JS fica visível; e sem isso a barra apareceria sobre o CTA do hero até a hidratação (dois botões iguais).
- **Selo R$ 49,99:** deixou de ter entrada animada (era a única peça do 1º viewport com `opacity 0` inicial). Isso também elimina o bug de gatilho que a 1ª passada achou (mídia `pendente`).

### b) As 13 seções têm os 8 campos da jornada
**Antes:** o campo 6 tinha Pensa · Sente · Faz · Próximo passo · Objeção · CTA, ou seja, faltavam **Vê, Reage, Saída e Evento de analytics**, e "Mobile" só existia como campo 8 separado. **Agora:** as 13 fichas + a ficha global têm, no campo 6, **Objetivo único + Vê · Faz · Reage · Sente/entende · Atrito → mitigação · Saída · Evento de analytics · Mobile** (conferido por contagem nos 14 arquivos). Cada campo 9 ganhou um critério `[auto]` de que a marcação do evento existe.

| Seção | Objetivo único | Saída | Evento |
|---|---|---|---|
| Header | orientar + preço | hero · WhatsApp · âncora | `cta_principal_click` (header) · `menu_open` |
| Hero | entender em 5 s e decidir | WhatsApp · S02/S03 | `cta_principal_click` (hero) |
| Prova rápida | reduzir a dúvida de existência | S03 | `scroll_depth` |
| Problema/solução | reconhecer-se | S06 · WhatsApp | `cta_principal_click` · `solucao_click` |
| Serviços | escolher serviço | WhatsApp (servico) · S07 | `servico_click` |
| Como funciona | provar que é simples | WhatsApp · S12 | `cta_principal_click` |
| Preço POP | confirmar preço único | WhatsApp · S05 | `cta_principal_click` |
| Para quem | reconhecer-se/alinhar | S10 | `scroll_depth` |
| Depoimentos | validação social (provisória) | S17 | `scroll_depth` |
| Unidades | achar a unidade e chamar | WhatsApp · S16 | `cta_principal_click` · `mapa_open` |
| FAQ | última objeção | S19 | `faq_open` |
| CTA final | último convite | WhatsApp · footer | `cta_principal_click` |
| Footer | contatos e legitimidade | WhatsApp · Instagram · legais | `whatsapp_click` (footer) |
| Global (barra/flutuante) | acesso fixo sem duplicar | WhatsApp | `cta_principal_click` (barra) · `whatsapp_click` (flutuante) |

**Nenhuma seção tem dois objetivos:** o hero e o S03 têm duas saídas, mas um objetivo (decidir / reconhecer-se).

### c) Macro e mapa de eventos
- **Macro:** já existia (`jornada-e-motion.md` §1), com intenção, pensa, sente, faz e CTA por seção. Faltava ligá-lo aos estágios do framework → **§1a** (descoberta → consideração → decisão → ação) cobre os 4 estágios.
- **Mapa de eventos:** **não existia.** Criado em **§1b**: `cta_principal_click`, `whatsapp_click`, `servico_click`, `faq_open`, `scroll_depth` (25/50/75/100 por `IntersectionObserver`, sem listener de scroll) + extras `menu_open`, `mapa_open`, `solucao_click`. Gatilhos por seletor (`data-cta`, `data-cta-local`, `data-item`), parâmetros e seções. **Sem consentimento nada carrega** (a v1 não tem analytics); a implementação é a T6.5.
- **Verificação do `08-JORNADA-UX`** (§1c): macro descoberta→ação ✔ · micro completo ✔ · hover com equivalente ✔ · CTA início/meio/fim ✔ · um objetivo por seção ✔ · eventos definidos ✔. Regras: feedback < 100 ms (`:active` com `dur-instant`) ✔ · sem becos (404, `/privacidade`, `/termos` levam ao início e herdam barra/flutuante) ✔ · sem pop-up ✔ · sem autoplay que roube foco (vídeo mudo, sem foco; só `poster` em reduced-motion) ✔ · conteúdo antes da animação ✔.

### d) Cada receita `data-anim`: nível, 3 versões, só `transform`/`opacity`
Todas as 13 linhas do catálogo (§3.4) passam: `reveal`, `stagger-item`, `header-fundo`, `painel`, `barra-cta`, `float`, `float-pulso`, `botao`, `card-realce`, `accordion-icone`, `accordion-resposta`, `pin-palco`/`palco-painel`/`queixa`/`queixa-marca` (um grupo), `mapa-embed`. Cada uma tem nível, faixa de duração, as 3 versões e só `transform`/`opacity` (a troca de estado do `<details>` é instantânea; a altura não anima). `selo` foi **removida** do catálogo e do `data-anim` da convenção (M10).

### e) No máximo um destaque por tela
- **Candidatos:** palco do S03 (≥1024), `float-pulso` (≥768, 1ª aparição) e `barra-cta` (<768).
- **Barra:** é feedback funcional de estado (entra/sai conforme há CTA na tela), não efeito de destaque; só existe <768, onde não há palco nem pulso.
- **Palco × pulso:** podiam coincidir ao rolar em desktop. **Regra (§3.6):** o pulso é cancelado se o palco estiver na tela (`CtaObservador` consulta `pin-palco`); no modo palco os `par` não usam `reveal`/`stagger-item` (só `queixa-marca` e `palco-painel`); `cabecalho` pode ter `reveal` como segundo plano.
- **Hero:** sem destaque animado. Demais seções: `reveal`/`stagger-item` é segundo plano; uma seção por vez.

## 3. `08-JORNADA-UX`: cobertura antes e depois
| Item do framework | Antes | Agora |
|---|---|---|
| Micro por seção: Vê · Faz · Reage · Sente/entende · Atrito→mitigação · Saída · Evento · Mobile | 4 dos 8 faltavam (Vê, Reage, Saída, Evento); Atrito = "Objeção que quebra" | ✔ 13 fichas + global completas, com **Objetivo único** |
| Macro descoberta → ação | ✔ em outro vocabulário | ✔ + §1a mapeia os estágios |
| Mapa de eventos | ✖ inexistente | ✔ §1b |
| Um objetivo por seção | implícito | ✔ declarado no campo 6 |
| Toda interação tem propósito; feedback < 100 ms | feedback não especificado | ✔ `:active` com `dur-instant` (100 ms) |
| Sem becos sem saída | implícito | ✔ declarado (campo "Saída" e §1c) |
| Sem scroll-jacking / popups / autoplay que roube foco | ✔ | ✔ |
| Conteúdo antes da animação | ✔ (M7) | ✔ (M7 + M10) |

## 4. F1–F7 da 1ª passada, reclassificados
| # | Decisão do projeto | Veredito | Por quê |
|---|---|---|---|
| F1 | M1: nenhuma biblioteca (sem Motion, GSAP, Lenis) | ✔ compatível | A regra 9 só exige **uma biblioteca por elemento**; nenhuma regra obriga ter biblioteca. Pergunta aberta 3 (scrub) continua do usuário |
| F2 | N2 = `sticky` + `IntersectionObserver`, sem pin de lib nem scrub | ✔ compatível | O framework não define N2 como scroll-linked; define teto mobile "N2 simplificado" e N3 só no hero. O palco é N2 ≥1024 e N1 no mobile |
| F3 | Reduced-motion = "sem animação" | ✖ corrigido | O framework diz que reduced-motion **não** é "sem animação": é troca por opacidade simples ou estado instantâneo. O comportamento (instantâneo) já era permitido; o **texto** foi corrigido (§3.2, `CLAUDE.md`) |
| F4 | Durações só pelos tokens | ✔ compatível | Coincide com "durações vêm dos tokens"; faixas agora declaradas |
| F5 | Orçamento próprio de 5 KB gzip de motion | ◐ divergência aceitável | O framework só fixa LCP/INP/CLS; o limite de 5 KB é restrição **extra** do projeto, mais estrita, mantida |
| F6 | Pulso do flutuante 2× (M4) | ✖ corrigido | Violava a regra 8 se coincidisse com o palco: agora cancelado com o palco na tela (§3.6) |
| F7 | 3 das 10 regras desconhecidas | ✔ resolvido | Eram: nível declarado (2), teto mobile N2 / N3 só no hero (3) e um destaque por tela (8). A 5 (estado oculto só com JS pronto) também estava resumida de forma incompleta no `CLAUDE.md`. Todas aplicadas |

## 5. Pontos que seguem em aberto
1. Perguntas 1–4 do estado (WhatsApp oficial, endereço, motion sem biblioteca/scrub, barra do mobile em ~6 trechos). A pergunta 6 (anexar o framework) está **respondida**.
2. ~~Residual ◐ da regra 5 (`pendente` por `data-js`)~~ **Fechado pelo usuário em 16/11/2026: divergência ACEITA, mantém-se `pendente` por `data-js`** (a alternativa estrita — barra nascer visível e esconder após hidratar — foi recusada: custaria dois botões iguais na tela durante a hidratação no hero). Mitigações vigentes: sem JS fica visível, sem temporizador; watchdog de 4 s (M9) devolve a barra/flutuante; verificado no build (JS bloqueado → `data-js-falhou` aos 4 s e barra visível).
3. As afirmações de saúde `validar` e o depoimento provisório com promessa de resultado continuam para a revisão da responsável técnica (T6.4).

## 6. O que mudou nesta passada (só documentos)
| Arquivo | Mudança |
|---|---|
| `docs/jornada-e-motion.md` | Cabeçalho; **§1a** estágios; **§1b** mapa de eventos; **§1c** verificação do 08; **M8** reescrita; **M9** reescrita (watchdog só com JS); **M10** nova; §3.1 faixas de duração e `will-change`; §3.2 reduced-motion; §3.3 mecanismo (`data-js` inline, `data-motion` por `MotionInit`); §3.4 catálogo com **Nível**, **Faixa** e 3 versões, `selo` removida, `botao`/`card-realce` com foco/toque; §3.5 rolagem suave só com mouse; **§3.6** um destaque por tela; §4 palco por `data-js`; §5 `pendente` (divergência aceita) e pulso |
| `docs/sections/fichas/*.md` (14) | **Campo 6 reescrito** com Objetivo + 8 campos; campo 9 com critério de evento; **hero**: selo estático, regra 5, nível; **problema-solucao**: `data-js`, 1º par `ativa` no HTML, sem `reveal` no modo palco, falha segura; **servicos**: `card-realce` com `:focus-within`; **global**: watchdog, pulso cancelado com palco |
| `docs/convencao-de-nomes.md` | `data-js`/`data-motion`/`data-js-pronto`/`data-js-falhou` com a nova semântica; `selo` removido de `data-anim`; `data-item` do FAQ |
| `docs/sections/componentes.md` | `MotionInit` e script inline com a nova ordem |
| `docs/sections/fichas-secoes.md` | "M1–M10" |
| `CLAUDE.md` | Bloco de Motion reescrito (níveis, regra 5, reduced-motion, rolagem suave, um destaque, hover/foco, proibidos) |
| `docs/tasks.md` | T2.1, T2.6, T2.7, T4.1 e T6.5 ajustadas |
| `docs/PRD.md` | Mapa de eventos, motion, decisões da Fase 10 |
| `docs/00-ESTADO-DO-PROJETO.md` | Decisões, perguntas, log |
