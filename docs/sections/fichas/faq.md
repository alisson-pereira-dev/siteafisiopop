> **FUNDIDA NO S12 (17/11/2026):** esta seção deixou de existir como seção própria; as dúvidas moram dentro de `preco-pop` (ver `docs/sections/fichas/preco-pop.md`). O texto abaixo é histórico.

<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S16 FAQ

## 1. Identificação
- slug: `faq` · Ordem: 10 · Nível: completo · Âncora: `#faq`

## 2. Função na narrativa
- Quebrar as objeções finais (preço, avaliação, dor, pós-operatório).
- Papel na jornada: conversão
- Relação com o CTA principal: remove a última objeção antes do CTA final

## 3. Conteúdo
- Chave: `secoes.faq`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: preço e avaliação incluída
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (accordion). Dados estruturados de FAQ só depois de validar as respostas.

## 4. Layout (Fase 6)
- **Variação:** V1, accordion de 7 perguntas, vários itens podem ficar abertos.
- **Fundo:** `bg-bg-alt`.
- **Estrutura:** `cabecalho` (`titulo`) → `lista` → 7 × `item` { `pergunta` (botão/summary, com `pergunta-icone`) · `resposta` }.
- **Item (`UiAccordion`):** linha com `border-b border-border`; `pergunta` `text-body-lg font-strong text-foreground`, `min-h-touch`, `py-4`, ícone ChevronDown à direita que gira quando aberto (`data-estado="aberto"`); `resposta` `text-body text-muted`, `pb-5`, `max-w-measure`. Construído sobre `<details>/<summary>` (funciona sem JS e no teclado).
- **Mobile:** 1 coluna; `titulo` acima da lista.
- **Tablet (≥768):** 1 coluna com `max-w-measure` ampliado para ~2/3 da largura, centralizada.
- **Desktop (≥1024):** grid 12: `titulo` nas colunas 1–4 (`sticky`, `top` = `h-header` + `space-6`), `lista` nas colunas 5–12.
- **Tokens:** `bg-bg-alt`, `text-foreground`, `text-muted`, `border-border`, `min-h-touch`.
- **Não fazer:** primeiro item aberto à força; schema `FAQPage` antes de validar as respostas (`validar: true` em duas); CTA principal aqui (o CTA final fecha a página).

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` · `UiAccordion` (`<details>`) · `UiIcone` (ChevronDown).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** remover a última objeção antes do CTA final (preço, avaliação, dor, pós-operatório).
- **Vê:** título e 7 perguntas, todas fechadas.
- **Faz:** abre 1–2 perguntas; vários podem ficar abertos.
- **Reage:** o `summary` abre na hora (Enter/Espaço ou toque), o chevron gira e a resposta entra por `opacity`; a altura não anima.
- **Sente/entende:** tranquilidade; "era só isso".
- **Atrito → mitigação:** "a avaliação é cobrada?" / "qualquer serviço é R$ 49,99?" → respostas diretas (mantidas `validar`) · "não achei minha dúvida" → a pergunta "Como faço para agendar?" e a barra/flutuante levam ao WhatsApp, sem CTA principal duplicado aqui.
- **Saída:** descer ao CTA final (S19). Sem beco.
- **Evento de analytics:** `faq_open` (`pergunta` = `data-item`, `pergunta-1`…`pergunta-7`); `scroll_depth`.
- **Mobile:** `summary` com ≥ 48px em toda a linha (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS).
- **Alvos `[data-anim]`:** `lista` com `reveal` (um bloco só, não item a item) · `accordion-icone` · `accordion-resposta`.
- **Abrir/fechar:** `<details>` nativo: abre e fecha **instantaneamente** (altura não anima, M5). O chevron gira 180° (`dur-fast`, `ease-standard`) e a `resposta` entra com `opacity 0→1` (`dur-base`, `ease-out`) por keyframe CSS ao abrir. O estado vem de `details[open]` em CSS; `UiAccordion` continua **server**. `data-estado="aberto"` é opcional (só se algum teste precisar).
- **Desktop/tablet e mobile:** iguais. **Reduced-motion:** chevron troca sem transição, resposta aparece direto.
- **Não fazer:** primeiro item aberto à força; animar `height`; um item fechar o outro.

## 8. Mobile (Fase 9)
- `pergunta` com `min-h-touch` e `py-4`, toda a linha é alvo. Funciona sem JS e com teclado (Enter/Espaço do `summary`). Sem gesto.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.9 (`docs/tasks.md`)
- [auto] 7 `details` com `summary` = `pergunta` e `resposta` do conteúdo; **todos fechados** ao carregar; vários podem ficar abertos; `UiAccordion` sem `"use client"`.
- [manual] Funciona **sem JS** e por teclado (Enter e Espaço no `summary`); `summary` com alvo ≥ 48px em toda a linha.
- [manual] Chevron gira 180° (`rotate`); a `resposta` entra por `opacity` (keyframe); a altura **não** anima; em reduced-motion tudo instantâneo.
- [auto] Nenhum JSON-LD `FAQPage` enquanto houver resposta `validar` (2 hoje); nenhum CTA principal na seção.
- [manual 1280] `titulo` `sticky` nas colunas 1–4, lista nas 5–12; 768–1023: coluna única centralizada.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** cada `item` com `data-item="pergunta-1"`…`"pergunta-7"` (para `faq_open`). Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.9 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Novo `subtitulo` sob o título. Perguntas em linhas com **"+"** no lugar do chevron; o ícone gira 45° ao abrir (vira "×"), receita renomeada de `accordion-chevron` para `accordion-icone`. Título e subtítulo à esquerda (sticky ≥1024) e lista à direita, como o bloco de FAQ da Superpower. Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.
