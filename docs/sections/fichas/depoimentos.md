<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S10 Depoimentos (provisória)

## 1. Identificação
- slug: `depoimentos` · Ordem: 8 · Nível: completo · Âncora: `#depoimentos`

## 2. Função na narrativa
- Prova social humana. Hoje com 3 comentários do Instagram, sem autor.
- Papel na jornada: confiança
- Relação com o CTA principal: reforça a confiança antes de decidir

## 3. Conteúdo
- Chave: `secoes.depoimentos`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: TODOS provisórios; trocar antes do lançamento
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (grade de cards). Marca de 'provisório' no build, para não ir ao ar sem revisão.

## 4. Layout (Fase 6)
- **Variação:** V1, grade de cards de citação (sem carrossel: evita gesto horizontal e conteúdo escondido).
- **Fundo:** `bg-bg-alt`; cards `bg-surface`.
- **Estrutura:** `cabecalho` { `titulo` · `subtitulo` } → `grade` → 3 × `card` { `selo-provisorio` · `citacao` · `autor` · `contexto` }.
- **Card (`UiCard`):** `rounded-lg p-5 shadow-1`; aspas grandes decorativas em Instrument Serif `text-brand-pink` (≥32px, `aria-hidden`); `citacao` (`blockquote`) `text-body-lg text-foreground`; `autor` `text-small font-strong`; `contexto` `text-small text-subtle` e, quando houver `link`, é link para a fonte.
- **`selo-provisorio`:** `UiSelo` tom aviso (`text-warning bg-warning-bg`), visível enquanto `provisorio: true` no item ou no bloco, no topo do card. Texto vem de `secoes.depoimentos.rotulo_provisorio`. Some quando o conteúdo deixar de ser provisório.
- **Mobile:** 1 coluna, `gap-4`.
- **Tablet/Desktop (≥768):** 3 colunas (`gap-5`), cards de altura igual (`items-stretch`).
- **Tokens:** `bg-bg-alt`, `bg-surface`, `text-brand-pink` (só aspas decorativas), `text-warning`, `bg-warning-bg`.
- **Não fazer:** nome, cidade, foto ou estrelas inventados; remover o selo antes de os depoimentos serem reais.

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` · `UiCard` · `UiSelo` (tom `aviso`) · `DepoimentosCard`.

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** validação social ("alguém como eu já foi?"), ainda **provisória**.
- **Vê:** título, subtítulo e 3 citações do Instagram, cada uma com o selo "provisório".
- **Faz:** lê 1–3 citações; pode tocar no contexto (link para o Instagram).
- **Reage:** nada interativo além do link de contexto; cards por `reveal`/`stagger-item` (segundo plano); o selo provisório **nunca** é animado nem some por motion.
- **Sente/entende:** validação, ainda sem rosto; a seção **não** se apresenta como prova definitiva.
- **Atrito → mitigação:** "será que funciona de verdade?" → citações reais do Instagram · autor desconhecido → "Cliente da A.FISIO POP", nada inventado · provisório → selo visível e o `build:launch` falha.
- **Saída:** seguir para escolher a unidade (S17); o link de contexto abre o Instagram. Sem beco.
- **Evento de analytics:** apenas `scroll_depth`.
- **Mobile:** 1 coluna, sem carrossel nem swipe; link de contexto com ≥ 48px (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `cabecalho` com `reveal` · os 3 `card` com `stagger-item` · `card-realce`.
- **Desktop/tablet:** 3 colunas com `stagger-item` (60ms). **Mobile:** cada card como `reveal`, sem stagger. **Reduced-motion:** estático.
- `selo-provisorio` **sem animação** (informação de estado, nunca some por motion).
- **Não fazer:** carrossel/auto-rotação; aspas que "digitam"; estrelas ou nomes inventados.

## 8. Mobile (Fase 9)
- Sem carrossel, sem swipe (conteúdo todo visível na rolagem vertical). Link de `contexto` (quando houver) com alvo `min-h-touch`.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.7 (`docs/tasks.md`)
- [auto] 3 `card` com `citacao` em `blockquote`, `autor` e `contexto` do conteúdo; **nenhum** nome, cidade, foto ou estrela inventados.
- [auto] `selo-provisorio` (texto de `secoes.depoimentos.rotulo_provisorio`) aparece em todo card com `provisorio: true` no item **ou** no bloco; teste unitário com conteúdo alterado: sem `provisorio`, o selo some.
- [auto] `contexto` vira link para `link` quando existir, com `rel="noopener noreferrer"` e alvo ≥ 48px.
- [manual] Grade de 1 coluna (mobile) e 3 colunas (≥768) com altura igual; sem carrossel e sem rotação automática.
- [manual] Aspas decorativas em Instrument Serif `text-brand-pink`, ≥32px, `aria-hidden`.
- [manual] `selo-provisorio` **sem animação** em qualquer versão.
- [auto] `npm run build:launch` continua falhando enquanto houver `provisorio`.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** seção só com `scroll_depth`: nada a marcar além do `data-section`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.7 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Citação em `text-h3` (Sora, peso de título) no cartão, como a citação em destaque da Superpower. Sem foto, nome ou estrela inventados; selo "provisório" intacto. Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Viram as **histórias**: 3 colunas separadas por fio, cada uma com **bloco de mídia no topo** (ladrilho de marca com aspas grandes; sem foto, nome ou idade inventados), selo "provisório", citação em `text-h3`, autor e contexto. Sem slider nem paginação (carrossel é vetado). **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

## Revisão 2: carrossel "sp2-testimonials2" (16/11/2026, pedido do usuário) — substitui a revisão anterior (3 colunas)
O usuário enviou o HTML do slide. Implementado em `DepoimentosCarrossel` (client) + `src/app/carrossel.css`: **fila de cards** com o ativo alinhado à esquerda do contêiner e os vizinhos a 50% de opacidade, saindo pelas bordas (a `<section>` tem `overflow-hidden`; o slider não); **loop infinito** com 3 cópias (as cópias só existem depois da hidratação, com `aria-hidden` + `inert`; ao passar do último para o primeiro a faixa anima até a cópia seguinte e teleporta sem transição em `transitionend`); **barra segmentada** (o segmento ativo ~8× mais largo por `flex-grow`, preenchimento linear de 0→100% em **8 s**, que então avança); clique num segmento vai ao card e reinicia o relógio; **contador** "N / 3". O deslocamento é CSS puro: `translateX(calc(var(--carrossel-pos) * -73,14%))` (88% no mobile), sem medir o DOM.
- **Conteúdo:** os 3 comentários provisórios de sempre (o slide tem 5; não inventei dois). Cada card: ladrilho de mídia com aspas (sem foto, nome ou idade), selo "provisório", autor, citação e o contexto (link) como legenda. Marcações `provisorio`/`validar` intactas; `build:launch` segue falhando por elas. Rótulos novos em `microcopy.acessibilidade` (`ir_para_depoimento`, `pausar_depoimentos`, `retomar_depoimentos`).
- **EXCEÇÃO documentada (como o header e o stage do S03):** autoplay por `requestAnimationFrame`, animação de `flex-grow` e `width`, tudo em `carrossel.css` e coberto por testes. O CLAUDE.md vetava carrossel/autoplay: liberado só aqui.
- **Acessibilidade (acréscimos meus):** sem autoplay em reduced-motion; pausa com mouse ou foco dentro do carrossel e **botão de pausa/retomar** (WCAG 2.2.2); cópias do loop fora da árvore de acessibilidade. Sem JS: os 3 depoimentos empilhados e sem barra.
- **Desvios do slide:** card a 11/12 do slide (91,7%, a referência usa 94,6%) e legenda em tom `text-muted`; mídia 16/9 (a referência ~2,16:1); durações e curva dos tokens (`dur-slower`, `ease-in-out`); `useSyncExternalStore` (`src/lib/cliente.ts`) no lugar de setState em efeito (regra do ESLint).
- **Verificado no navegador (1280):** o 2º card entra aos ~8 s, o 3º aos ~16 s, do 3º volta ao 1º sem salto (ativo termina na cópia do meio), clique no 3º segmento vai direto, pausa congela o preenchimento, reduced-motion não avança (barra cheia e sem botão), sem JS mostra os 3 cards.

**Revisão de 17/11/2026:** card com FOTO grande 16:9 no topo (`item.imagem`) e o bloco de texto embaixo (referência do usuário). Fotos 01–03 em uso; 04–05 aguardam depoimentos. Atenção: confirmar autorização de imagem e a correspondência foto ↔ depoimento antes do lançamento.

**Revisão de 17/11/2026 (2):** carrossel arrastável (mouse/dedo); foto com cantos de 8 px; fundo da seção em vidro fosco (manchas + lâmina com desfoque); aviso "provisório" discreto, em texto pequeno apagado ao lado da legenda (não é mais selo colorido; segue visível enquanto `provisorio: true`).

**Revisão de 17/11/2026 (3):** 5 depoimentos fictícios (nome, texto e serviço inventados a pedido do usuário) com as 5 fotos enviadas; sem link/fonte. O aviso "Depoimento fictício" fica visível em todo card. Não publicar assim: o texto não é de quem aparece na foto.

**Sobreposição (18/11/2026):** a seção (`pilha-base`) fica parada enquanto a das unidades passa por cima.
