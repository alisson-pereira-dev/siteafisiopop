<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S06 Serviços

## 1. Identificação
- slug: `servicos` · Ordem: 4 · Nível: completo · Âncora: `#servicos`

## 2. Função na narrativa
- Ver os 7 serviços em linguagem de benefício. Cada um leva ao WhatsApp com o serviço já escolhido.
- Papel na jornada: interesse
- Relação com o CTA principal: cada card tem link contextual para o mesmo WhatsApp (não compete com o CTA principal)

## 3. Conteúdo
- Chave: `secoes.servicos`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: Drenagem, Massagem Modeladora, Ventosaterapia, Ortopédica (validar); imagens pendentes
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (cards com ícone Lucide), com foto/vídeo por serviço quando houver.

## 4. Layout (Fase 6)
- **Variação:** V1, grade de cards com ícone; a mídia por serviço entra no topo do card quando existir.
- **Fundo:** `bg-bg-alt`; cards `bg-surface` (contraste de superfície sem sombra pesada).
- **Estrutura:** `cabecalho` { `titulo` (com `**R$ 49,99**` em destaque) · `subtitulo` } → `grade` → 7 × `card` { `card-midia` (opcional) · `card-icone` · `card-nome` · `card-descricao` · `card-link` }.
- **Card (`UiCard`):** `rounded-lg bg-surface border border-border p-5 shadow-1`; `card-icone` é `UiIcone` 24px em contêiner `rounded-icon bg-bg-teal` com ícone em tinta; `card-nome` `text-h3`; `card-descricao` `text-body text-muted`; `card-link` `UiLink` ("Chamar sobre este serviço" + ArrowRight), `min-h-touch`, `text-link`, sublinhado. **O card inteiro não é clicável**; só o link (não compete com o CTA principal).
- **Mobile:** 1 coluna (`gap-4`). No card, ícone e nome na mesma linha (`flex items-center gap-3`), descrição e link abaixo. `card-midia` (se existir) no topo, `aspect-card`.
- **Tablet (≥768):** 2 colunas (`gap-5`). O 7º card (Fisioterapia Ortopédica) ocupa as 2 colunas (`card--largo`, `col-span-2`): texto à esquerda, mídia à direita quando houver.
- **Desktop (≥1024):** 3 colunas (`gap-6`); o 7º card ocupa a linha inteira (`col-span-3`, `card--largo`).
- **Hover:** realce decorativo por `card-realce` (camada com `shadow-2` cuja `opacity` sobe; `box-shadow` não anima, decisão M5); nada depende dele.
- **Sem CTA principal nesta seção.**
- **Tokens:** `bg-bg-alt`, `bg-surface`, `bg-bg-teal`, `rounded-lg`, `rounded-icon`, `shadow-1/2`, `aspect-card`.
- **Não fazer:** inventar imagem; ícone teal vivo como significado; mostrar preço individual por card (o preço único está no título e na S12).

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` · `UiCard` · `UiIcone` · `UiMidia` (omitida se `pendente`) · `UiLink` (link de serviço, link WhatsApp com `{servico}`) · `ServicosCard`. Nome acessível do link: "texto do link + nome do serviço" (gerado do conteúdo, sem chave nova).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** escolher um serviço e abrir a conversa **já com ele escolhido**.
- **Vê:** título com R$ 49,99, subtítulo e 7 cards (ícone, nome, descrição, link); mídia só quando existir.
- **Faz:** lê 1–3 cards; toca em "Chamar sobre este serviço".
- **Reage:** link com `:active` imediato; abre o WhatsApp com `{servico}` na mensagem; o `card-realce` aparece no hover e no foco (nada depende dele).
- **Sente/entende:** clareza e liberdade de escolha; tudo no mesmo preço.
- **Atrito → mitigação:** "o que cada um faz?" → benefício em linguagem simples · "quanto é cada um?" → preço único no título, nenhum preço por card · "e se eu quiser outro / não sei?" → o link abre a conversa e o S03 tem o caminho da avaliação.
- **Saída:** WhatsApp (link contextual) ou seguir para "como funciona". Sem beco.
- **Evento de analytics:** `servico_click` (`servico` = `data-item`) + `whatsapp_click` (`tipo` = `servico`); `scroll_depth`.
- **Mobile:** 1 coluna; só o `card-link` é alvo, com ≥ 48px (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `cabecalho` com `reveal` · os 7 `card` com `stagger-item` · `card-realce` (realce no hover **e** no `:focus-within`) · `botao`/link sem animação própria.
- **Desktop/tablet:** cards entram com `stagger-item` (teto de 3 passos, então do 4º ao 7º usam 3×60ms). **Mobile:** 1 coluna, cada card como `reveal` (`dur-base`), sem stagger. **Reduced-motion:** estático.
- **Hover e equivalente:** `card-realce` (pseudo-elemento com `shadow-2`, `opacity 0→1`, `dur-fast`) no hover (`(hover: hover)`) **e** no `:focus-within` do card (equivalente por teclado/toque: o link do card); **nada** depende do hover (decisão M5: não se anima `box-shadow`).
- **Marquee: não entra** (M2).
- **Não fazer:** card inteiro clicável; ícone que gira; imagem inventada; zoom na foto.

## 8. Mobile (Fase 9)
- Só o `card-link` é alvo (`min-h-touch`, largura do card). Sem gestos. O 7º card (largo) vira 1 coluna.
- O link usa o texto "Chamar sobre este serviço" + nome do serviço no `aria-label`. Mídia (quando vier) com `aspect-card` e dimensões declaradas, `lazy`.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.3 (`docs/tasks.md`)
- [auto] 7 `card` na ordem de `secoes.servicos.itens`; cada ícone existe no registro de `UiIcone` (nome fora do registro **quebra o build**).
- [auto] Só o `card-link` é link (o card inteiro não é). Texto = `link_servico_texto`; `aria-label` = texto + nome do serviço; `href` = `wa.me` com `mensagem_servico` (`{servico}` trocado) passada por `encodeURIComponent`; `data-cta="servico"`; nenhuma classe `ui-botao--primario` nesta seção.
- [auto] Com `imagem.src = "pendente"` o `card-midia` **não** renderiza e não deixa espaço vazio.
- [manual] 1 coluna (360–767), 2 colunas (768–1023), 3 colunas (≥1024); o 7º card ocupa a linha inteira em 2 e 3 colunas (`card--largo`).
- [auto] O título tem `**R$ 49,99**` em `accent-serif`; nenhum preço por card.
- [manual] Realce só por `card-realce` (camada com `opacity`): no hover (`(hover: hover)`) **e** no `:focus-within`/`:active` do link; nada depende do hover; `box-shadow` não anima.
- [manual] Motion: `stagger-item` (teto de 3 passos) ≥768; `reveal` no mobile; estático em reduced-motion.
- [auto] Os 5 itens `validar` seguem marcados no `content.json`.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** cada `card` com `data-item` e o link com `data-cta="servico"` (para `servico_click`). Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.3 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Cabeçalho centralizado (título + subtítulo). Grade de **4 colunas** a partir de 1024 (4 + 3 cards; 2 colunas no tablet com o 7º ocupando a linha; 1 no mobile). Cada cartão: **mídia 4/3 no topo** e, enquanto `imagem.src` for `pendente`, um **ladrilho de marca** (`bg-grad-soft`) com o ícone do serviço (48 px, `text-primary`, `aria-hidden`), nunca foto inventada; depois nome, descrição e o link de WhatsApp (`data-cta="servico"`). O ícone saiu do título. Substitui "card sem mídia enquanto pendente". Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Vira a **tabela de valor**: título centralizado e **7 linhas zebradas** (nome · descrição em cinza · link de WhatsApp do serviço, `data-cta="servico"`). Sem cartões, sem ícone, sem mídia por linha. **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

**Revisão de 18/11/2026:** o link de cada linha tem texto curto de benefício próprio (`itens[].link_texto`); mensagem do WhatsApp inalterada.
