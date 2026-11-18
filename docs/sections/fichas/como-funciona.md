<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S07 Como funciona

## 1. Identificação
- slug: `como_funciona` · Ordem: 5 · Nível: completo · Âncora: `#como-funciona`

## 2. Função na narrativa
- Mostrar que é simples: agenda, avalia, sai mais leve.
- Papel na jornada: decisão
- Relação com o CTA principal: CTA principal (meio)

## 3. Conteúdo
- Chave: `secoes.como_funciona`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: 'na hora' (promessa de prazo)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V2 (timeline vertical), vertical também no desktop se o espaço pedir.

## 4. Layout (Fase 6)
- **Variação:** V2, timeline vertical nos 3 tamanhos.
- **Fundo:** `bg-bg`.
- **Estrutura:** `cabecalho` (`titulo`) → `linha-tempo` (`ol`) → 3 × `passo` { `passo-numero` · `passo-titulo` · `passo-descricao` } → `cta`.
- **Mobile:** `passo` em linha: `passo-numero` à esquerda (círculo `rounded-full`, 48px = `min-h-touch`, `bg-primary-soft text-foreground font-heading`), conteúdo à direita (`passo-titulo` `text-h3`, `passo-descricao` `text-body text-muted`). Linha vertical decorativa ligando os círculos (`border-l border-border-strong`? usar `border-border`; é decoração), `gap-6` entre passos. `cta` largura total abaixo da lista.
- **Tablet (≥768):** igual, com `max-w-measure` e `cta` à esquerda (largura automática).
- **Desktop (≥1024):** grid 12: `cabecalho` nas colunas 1–5 (`sticky`, `top` = `h-header` + `space-6`), `linha-tempo` nas colunas 7–12; `cta` nas colunas 7–12, depois da lista. `passo-titulo` em `text-h3`, mais respiro (`gap-7`).
- **Tokens:** `bg-primary-soft`, `text-foreground`, `rounded-full`, `text-h3`, `border-border`.
- **Não fazer:** número em rosa sobre rosa; passo clicável; imagem ao lado enquanto não houver foto real (quando houver, entra a partir de ≥1024, coluna 1–5, abaixo do título, `UiMidia aspect-card`).

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` · `ComoFuncionaPasso` · `UiCtaPrincipal` (local `como-funciona`).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** provar que é simples (agenda, avalia, sai mais leve).
- **Vê:** título, timeline de 3 passos numerados e o CTA principal.
- **Faz:** lê os passos e decide chamar.
- **Reage:** CTA com `:active` imediato; os passos entram por `reveal`/`stagger-item` (segundo plano).
- **Sente/entende:** alívio; "são só 3 passos".
- **Atrito → mitigação:** "burocracia / e se eu não souber o que tenho?" → "a gente avalia" no passo 2 · "na hora" é promessa de prazo → mantido `validar`.
- **Saída:** WhatsApp pelo CTA, ou seguir para o preço (S12). Sem beco.
- **Evento de analytics:** `cta_principal_click` (`local` = `como-funciona`) + `whatsapp_click`; `scroll_depth`.
- **Mobile:** passos em linha com círculo de 48px; CTA em largura total, esconde a barra (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `cabecalho` com `reveal` · os 3 `passo` com `stagger-item` · `botao` no CTA.
- **Linha da timeline:** estática (decoração); **não** desenha com a rolagem (evita listener de scroll e scrub; M1).
- **Desktop/tablet:** os 3 passos entram em sequência (60ms de passo). `cabecalho` fica `sticky` no desktop, sem animação. **Mobile:** cada passo como `reveal`, sem stagger. **Reduced-motion:** estático.
- **Não fazer:** número que "conta" ou gira; passo clicável; imagem ao lado enquanto não houver foto real.

## 8. Mobile (Fase 9)
- Círculo do número com 48px (`min-h-touch`), só decorativo (não é alvo). `cta` em largura total. Nenhum gesto.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.4 (`docs/tasks.md`)
- [auto] `ol` com 3 `passo` numerados 1–3 (`passo-numero` do conteúdo); 1 CTA `como-funciona` depois da lista.
- [manual 360] Círculo do número com 48px, linha decorativa estática ligando os passos; nenhum passo é clicável.
- [manual 1280] `cabecalho` `sticky` nas colunas 1–5 sem encostar no header; lista e CTA nas colunas 7–12.
- [auto] "na hora" (passo 3) continua no texto e marcado `validar`.
- [manual] A linha da timeline **não** é desenhada pela rolagem (sem listener de scroll); sem imagem enquanto não houver foto real.
- [manual] O CTA esconde a barra enquanto visível; motion: `stagger-item` ≥768, `reveal` no mobile, estático em reduced-motion.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** CTA com `data-cta-local="como-funciona"`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.4 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Estrutura do "How it works": **cabeçalho centralizado** (título + novo `subtitulo`) e **3 cartões lado a lado** a partir de 768 (1 coluna no mobile), cada um com **mídia 4/3 no topo** (`passos[].imagem`, hoje `pendente`), título e descrição cinza; 1 CTA principal centralizado depois da grade. Mídia pendente = ladrilho de marca com o **numeral grande em serifa** (`passo-numero`); com foto real o número vira etiqueta redonda sobre a foto. Some a linha do tempo e o cabeçalho sticky. `validar` do passo 3 intacto. Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Grade de **4 colunas** (`gap-2`; 2 no tablet, 1 no mobile) com imagem **quadrada**, etiqueta numerada pequena no canto e texto cinza embaixo. **Passo 4 novo** ("Você volta quando quiser"), com o texto tirado da resposta do FAQ "Posso voltar todo mês?". Subtítulo: "…em quatro passos". **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

**Revisão de 17/11/2026:** os 4 passos têm foto real quadrada (webp 1200×1200, enviadas pelo usuário); deixam de ser ladrilhos `pendente`. A foto do passo 4 foi recortada para tirar uma faixa inferior emendada do arquivo original.
