> **REMOVIDA DA PÁGINA (18/11/2026):** a seção deixou de ser renderizada a pedido do usuário; o conteúdo `secoes.prova_rapida` foi mantido. O texto abaixo é histórico.

<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S02 Barra de confiança

## 1. Identificação
- slug: `prova_rapida` · Ordem: 2 · Nível: completo · Âncora: `#confianca`

## 2. Função na narrativa
- Reduzir a dúvida logo abaixo do hero com 4 indicadores reais.
- Papel na jornada: confiança
- Relação com o CTA principal: apoia o CTA do hero com confiança

## 3. Conteúdo
- Chave: `secoes.prova_rapida`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: '+14 mil', '3 unidades', 'Avaliação incluída'
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V2 (4 indicadores curtos). Sem logos inventados; CREFITO entra quando chegar.

## 4. Layout (Fase 6)
- **Variação:** V2, faixa plana de 4 indicadores (sem cards, sem ícones, sem logos). Se o CREFITO chegar, vira o 5º indicador textual, não logo.
- **Fundo:** `bg-bg-alt`, seção compacta (`py-7`, não `py-section`).
- **Estrutura:** `lista` (`ul`) → 4 × `item` { `valor` · `rotulo` }.
- **Mobile:** grade 2×2 (`grid-cols-2 gap-x-4 gap-y-5`); `valor` `text-body-lg font-heading text-foreground` (pode quebrar em 2 linhas: "Avaliação incluída"); `rotulo` `text-small text-muted`. Texto alinhado à esquerda.
- **Tablet/Desktop (≥768):** 1 linha com 4 colunas (`grid-cols-4`), `valor` em `text-h3`; divisores verticais `border-l border-border` entre itens (decorativo), `pl-5` nos itens 2–4.
- **Tokens:** `bg-bg-alt`, `text-foreground` (15,58:1 sobre `bg-alt`), `text-muted` (`#4A4450` é mais escuro que `text-subtle`, que já dá 5,17:1 sobre `bg-alt`; passa folgado).
- **Não fazer:** contador animado de número sem fonte; rosa no texto pequeno; marcar como "verificado".

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `ProvaRapidaItem` (valor + rótulo). Sem `UiCard`, sem `UiIcone`. Rótulo acessível da seção (`aria-label`, pois não há título visível) vem de `secoes.prova_rapida.rotulo_acessivel`.

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** reduzir a dúvida "isso existe de verdade?" logo abaixo do hero.
- **Vê:** 4 indicadores curtos (desde 2024, +14 mil seguidores, 3 unidades, avaliação incluída).
- **Faz:** passa os olhos em ~2 segundos; **não há interação**.
- **Reage:** nada é interativo; os itens entram por `reveal`/`stagger-item` discreto (segundo plano).
- **Sente/entende:** segurança leve, sem peso.
- **Atrito → mitigação:** "será que é confiável / é nova?" → "desde 2024", 3 unidades, avaliação incluída · números sem fonte → mantidos `validar`, sem contador animado.
- **Saída:** continuar rolando para o reconhecimento (S03); no mobile a barra inferior está visível aqui. Sem beco.
- **Evento de analytics:** apenas `scroll_depth` (seção sem interação).
- **Mobile:** grade 2×2; sem alvo de toque (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** os 4 `item` com `stagger-item`.
- **Contagem numérica: não entra** (M3): "+14 mil" é `validar`; os outros valores são texto.
- **Desktop/tablet (≥768):** os 4 itens entram em uma linha com `stagger-item` (60ms, `dur-slow`). **Mobile:** grade 2×2; cada item como `reveal` (`dur-base`), sem stagger. **Reduced-motion:** estático.
- **Não fazer:** contador, marquee de logos, selo "verificado".

## 8. Mobile (Fase 9)
- Sem alvo de toque (conteúdo não interativo). Sem gesto. Os rótulos não podem ser cortados em 360px (quebram em 2 linhas).

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.1 (`docs/tasks.md`)
- [auto] `ul` com 4 `item` na ordem de `secoes.prova_rapida.itens`; a raiz tem `aria-label` = `secoes.prova_rapida.rotulo_acessivel` (não há título visível).
- [manual 360] Grade 2×2; rótulos quebram em 2 linhas, nada é cortado. [manual ≥768] 4 colunas com divisores decorativos.
- [auto] Sem ícone, sem card, sem contador, sem selo "verificado"; "+14 mil" é texto estático.
- [manual] Contraste: `text-foreground` e `text-muted` sobre `bg-bg-alt` (pares de `docs/design-system.md`).
- [manual] Motion: `stagger-item` ≥768; `reveal` sem stagger <768; estático em reduced-motion e sem JS.
- [auto] Nenhum CTA na seção; itens `validar` continuam marcados no `content.json`.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** seção só com `scroll_depth`: nada a marcar além do `data-section`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.1 em `docs/tasks.md` · build: pendente


## Revisão: faixa de confiança da Superpower (16/11/2026, pedido do usuário)
Na Superpower a 2ª seção é uma faixa com **uma frase centralizada e, embaixo, uma linha de logos**; os 3 indicadores ("Whole body check", "Accessible", "Trusted") ficam **dentro da hero**. Aqui: (1) os 4 indicadores antigos (**Desde 2024 · +14 mil seguidores · 3 unidades · Avaliação incluída**, com as marcas `validar`) foram para `secoes.hero.indicadores` e aparecem embaixo à esquerda do cartão da hero (ver a revisão da ficha da hero); (2) esta seção mostra `secoes.prova_rapida.legenda` ("Cuidado de verdade, pertinho de você") e uma linha centralizada com os **locais das unidades** (`secoes.unidades.itens[].local` + `cidade`, em Sora, tom `text-muted`), no lugar dos logos de universidades; as marcas `validar` dos locais continuam no conteúdo das unidades (nada duplicado). Não há logos nem fotos de pessoas (a referência tem 3 avatares): nada inventado. Sem grade, sem fundo colorido, sem divisores. `rotulo_acessivel` = "Onde a A.FISIO POP atende". Onde o campo 4 deste arquivo disser o contrário, vale esta revisão.
