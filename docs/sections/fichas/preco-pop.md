<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S12 Preço POP

## 1. Identificação
- slug: `preco_pop` · Ordem: 6 · Nível: completo · Âncora: `#preco`

## 2. Função na narrativa
- Entender que o preço é único, transparente e cabe todo mês.
- Papel na jornada: decisão
- Relação com o CTA principal: CTA principal (meio), no ponto de maior intenção

## 3. Conteúdo
- Chave: `secoes.preco_pop`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: preço, 'por serviço'
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Faixa escura full-bleed. Sem comparação de mercado inventada.

## 4. Layout (Fase 6)
- **Variação:** faixa escura full-bleed com a "caixa de preço" em card claro (referência: caixa de compra da Superpower), sem comparação de mercado.
- **Fundo:** `bg-inverse` de ponta a ponta; texto `text-on-inverse`; destaque serifado em `text-on-inverse-primary`; checks em `text-on-inverse-accent` quando sobre o escuro.
- **Estrutura:** `conteudo` { `etiqueta` · `titulo` · `texto` } · `preco` (card claro) { `preco-valor` · `preco-periodo` · `inclui` (`ul`) → 4 × `inclui-item` · `cta` }.
- **Mobile:** 1 coluna: `etiqueta` (`UiChip` tom escuro), `titulo` `text-h2`, `texto` `text-body-lg`, depois o card `preco`: `bg-surface text-foreground rounded-lg shadow-4 p-5`; `preco-valor` `text-display font-heading text-primary` (5,09:1 sobre branco; ≥32px), `preco-periodo` `text-body text-muted`; `inclui` em coluna com ícone Check (`text-secondary`, 4,93:1 sobre branco); `cta` largura total dentro do card.
- **Tablet (768–1023):** card `preco` com `max-w-measure` centralizado abaixo do texto (decidido na Fase 10; lado a lado só a partir de 1024).
- **Desktop (≥1024):** grid 12: `conteudo` nas colunas 1–6 (alinhado ao centro vertical), `preco` nas colunas 7–12; `p-6`.
- **Tokens:** `bg-inverse`, `text-on-inverse`, `text-on-inverse-primary`, `bg-surface`, `text-primary`, `text-secondary`, `shadow-4`, `rounded-lg`, `text-display`.
- **Não fazer:** gradiente `grad-price` atrás de texto branco (o trecho claro reprova); riscar "preço de mercado"; "últimas vagas"; adicionar itens ao `inclui` além dos 4 do conteúdo.

## 5. Componentes (Fase 7)
`UiSecao` (tom `inverse`) · `UiContainer` · `UiChip` (tom `inverso`) · `UiTitulo` (tom `inverso`) · `UiCard` · `UiIcone` (Check) · `UiCtaPrincipal` (local `preco-pop`) · `PrecoPopInclui`.

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** confirmar que o preço é único, transparente e cabe todo mês.
- **Vê:** faixa escura com etiqueta, título, texto e o card claro com R$ 49,99 "por serviço", os 4 itens incluídos e o CTA.
- **Faz:** confere o que está incluído; é o ponto de maior intenção; toca no CTA.
- **Reage:** CTA dentro do card com `:active` imediato; conteúdo e card por `reveal` (segundo plano); o preço **não** conta nem pulsa.
- **Sente/entende:** confiança no preço; calma.
- **Atrito → mitigação:** "tem pegadinha / chamariz?" → 4 itens, "sem letra miúda", nenhuma comparação de mercado · "cabe todo mês?" → o texto fala em voltar todo mês.
- **Saída:** WhatsApp pelo CTA, ou seguir para "para quem é". Sem beco.
- **Evento de analytics:** `cta_principal_click` (`local` = `preco-pop`) + `whatsapp_click`; `scroll_depth`.
- **Mobile:** card em largura total, CTA dentro dele; esconde a barra (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `conteudo` com `reveal` · card `preco` com `reveal` · os 4 `inclui-item` com `stagger-item` · `botao` no CTA.
- **Desktop/tablet:** conteúdo e card entram juntos (card com atraso de 1 passo = 60ms); `inclui-item` em `stagger-item`. **Mobile:** texto, depois card (`reveal` `dur-base`); `inclui-item` sem stagger. **Reduced-motion:** estático.
- **Preço:** `preco-valor` **não** conta nem pulsa (nada de urgência).
- **Não fazer:** contagem, riscado de "preço de mercado", brilho/shimmer no card, "últimas vagas".

## 8. Mobile (Fase 9)
- Card em largura total; CTA largura total dentro do card (`min-h-touch`). Sem gestos. Contraste do card (`bg-surface`) conferido sobre `bg-inverse`.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.5 (`docs/tasks.md`)
- [manual] Faixa `bg-inverse` de ponta a ponta; texto em `text-on-inverse`; destaque serifado em `text-on-inverse-primary`; `preco-valor` em `text-primary` sobre `bg-surface` (par 5,09:1).
- [auto] Exatamente 4 `inclui-item`, os de `secoes.preco_pop.inclui`; nenhum item extra, nenhuma comparação de mercado, nenhum preço riscado, nenhum "últimas vagas".
- [auto] `preco-valor` = `preco.valor` e `preco-periodo` = `preco.periodo`; o item `validar` continua marcado.
- [auto] 1 CTA `preco-pop` **dentro** do card; largura total no mobile.
- [auto] Sem `grad-price` atrás de texto branco, sem shimmer, sem contagem, sem pulso.
- [manual] 360: texto e depois o card; ≥1024: texto nas colunas 1–6 e card nas 7–12; 768–1023: card centralizado abaixo do texto.
- [manual] O CTA esconde a barra enquanto visível; motion: `reveal` no conteúdo e no card; `stagger-item` nos 4 itens ≥768.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** CTA com `data-cta-local="preco-pop"`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.5 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Mantém a faixa escura (identidade). **Cabeçalho centralizado** (etiqueta, título, texto) e, abaixo, **um cartão de preço centralizado** (valor + período) com a lista `inclui` em **linhas listradas** (`odd:bg-bg-alt`, como a tabela da Superpower) e o CTA principal. Sem comparação de preço (regra do projeto). Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Vira a **seção de compra**: duas colunas a partir de 1024 — **galeria sticky** à esquerda (quadrado de marca com a etiqueta, o preço R$ 49,99 e "por serviço") e a coluna da direita com título, texto, **lista de checks** (círculo escuro + ✓) e o CTA principal em largura total. Sem comparação, riscado ou urgência. Fundo `bg-alt` (não é mais faixa escura). **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

**Revisão de 17/11/2026 (modelo do usuário):** galeria fixa à esquerda (imagem 1:1 + miniaturas, `PrecoPopGaleria`) e coluna de compra que rola à direita; as dúvidas frequentes (antiga S16) ficam no fim da coluna da direita (`#faq`). Medidas do modelo adaptadas à grade 7/12 + 5/12; sticky ≥1024 (`top: --topo-sticky`), `items-start` obrigatório, sem overflow em ancestral. Sem JSON-LD FAQPage.

**Cartão da oferta (17/11/2026):** ordem da coluna da direita: título, texto, lista, cartão da oferta (faixa escura + R$ 49,99 em destaque + serviços), CTA, caixa de números (indicadores do hero) e dúvidas. A promoção do exemplo (preço riscado, "economize", prazo, estatísticas de pesquisa) NÃO foi reproduzida por falta de dado confirmado; só entra com fonte da clínica.

**Caixa abaixo do botão (revisão):** não repete mais os indicadores do hero; mostra "a conta do preço" (`preco_pop.conta`): 1 serviço, R$ 49,99 por mês, R$ 1,67 por dia (R$ 49,99 ÷ 30), com nota explicando a conta.

**Revisão de 18/11/2026:** R$ 49,99 do texto em destaque (h2, negrito, rosa primário); caixa da conta sem nota de rodapé; dúvidas com abrir/fechar suave (altura animada por `::details-content`, onde suportado; resposta por opacity + translateY). Exceção de motion: só o accordion anima altura (`src/app/accordion.css`).

**Revisão de 18/11/2026 (2):** a galeria tem UMA imagem (cartaz `preco_pop`, texto dentro da arte; sem miniaturas nem JS); o R$ 49,99 do texto é destacado por marca-texto rosa, sem aumentar o tamanho. Substitui a galeria de 5 slides.
