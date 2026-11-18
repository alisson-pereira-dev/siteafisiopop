<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S05 Para quem é

## 1. Identificação
- slug: `para_quem` · Ordem: 7 · Nível: completo · Âncora: `#para-quem`

## 2. Função na narrativa
- Reconhecer-se (ou não) no público; alinhar expectativa honesta.
- Papel na jornada: decisão
- Relação com o CTA principal: filtra e aquece quem vai chamar

## 3. Conteúdo
- Chave: `secoes.para_quem`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: —
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Adaptação: lista 'é para você' + bloco 'não é para'.

## 4. Layout (Fase 6)
- **Variação:** lista de reconhecimento + bloco de expectativa honesta.
- **Fundo:** `bg-bg`; o bloco `nao-e-para` em `bg-bg-teal` (texto em tinta).
- **Estrutura:** `titulo` → `lista-voce` (`ul`, 6 × `item` com ícone Check) → `nao-e-para` { `nao-e-para-titulo` · `nao-e-para-texto` }.
- **Mobile:** 1 coluna: `titulo` `text-h2`; `lista-voce` com `gap-4`, cada `item` em linha (Check `text-secondary` + texto `text-body-lg text-foreground`), alvo de leitura confortável; `nao-e-para` logo abaixo (`mt-7`): `UiCard` tom teal, `rounded-lg p-5`, `nao-e-para-titulo` `text-h3`, `nao-e-para-texto` `text-body`.
- **Tablet (≥768):** `lista-voce` em 2 colunas (3 + 3); `nao-e-para` embaixo em largura total.
- **Desktop (≥1024):** grid 12: `titulo` nas colunas 1–12; `lista-voce` nas colunas 1–7 (2 colunas internas); `nao-e-para` nas colunas 8–12, alinhado ao topo da lista.
- **Tokens:** `bg-bg-teal`, `text-foreground`, `text-secondary` (ícone, sobre `bg`), `rounded-lg`, `text-body-lg`.
- **Não fazer:** ícone `secondary` sobre `bg-bg-teal` (4,28:1); tom de "aviso" vermelho no `nao-e-para` (é honestidade, não alerta).

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` · `UiCard` (tom `teal`) · `UiIcone` (Check) · `ParaQuemItem`.

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** a pessoa se reconhecer (ou não) e alinhar expectativa com honestidade.
- **Vê:** título, 6 itens "é para você" e o bloco "não é para quem procura milagre em uma sessão".
- **Faz:** se reconhece em itens da lista; lê o bloco "não é para".
- **Reage:** nada interativo; itens por `reveal`/`stagger-item` (segundo plano).
- **Sente/entende:** pertencimento e honestidade (confia mais porque o "não é para" existe).
- **Atrito → mitigação:** "é só pra quem tem diagnóstico?" / "vão me vender o que não preciso?" → lista ampla + expectativa honesta, sem tom de alerta.
- **Saída:** seguir para a prova social (S10); no mobile a barra inferior está visível. Sem beco.
- **Evento de analytics:** apenas `scroll_depth`.
- **Mobile:** itens em `text-body-lg`, sem alvo de toque (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `titulo` com `reveal` · 6 `item` com `stagger-item` · `nao-e-para` com `reveal`.
- **Desktop/tablet:** itens com `stagger-item` (teto de 3 passos); bloco "não é para" entra junto da lista. **Mobile:** cada item como `reveal` (`dur-base`), sem stagger. **Reduced-motion:** estático.
- **Não fazer:** check que "se marca" animado; tom de alerta no bloco "não é para".

## 8. Mobile (Fase 9)
- Itens não interativos. Texto `text-body-lg`; bloco `nao-e-para` logo abaixo, sem gesto.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.6 (`docs/tasks.md`)
- [auto] 6 `item` de `secoes.para_quem.para_voce` + bloco `nao-e-para` com `nao-e-para-titulo` e `nao-e-para-texto` do conteúdo.
- [manual] Ícone Check em `text-secondary` sobre `bg` (nunca sobre `bg-bg-teal`, 4,28:1); texto do bloco em tinta.
- [manual] 1 coluna (mobile), lista em 2 colunas (768–1023), lista nas colunas 1–7 e bloco nas 8–12 (≥1024).
- [manual] Tom do `nao-e-para`: teal, sem vermelho nem ícone de alerta.
- [auto] Nenhum CTA na seção. Motion: `stagger-item` ≥768, `reveal` no mobile, estático em reduced-motion; check que "se marca" fica de fora.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** seção só com `scroll_depth`: nada a marcar além do `data-section`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.6 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Cabeçalho à esquerda com novo `subtitulo`; a lista `para_voce` vira **uma coluna de linhas listradas** (`odd:bg-bg-alt`) nas colunas 1–7 e o bloco teal "não é para" nas colunas 8–12 (≥1024). Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.
