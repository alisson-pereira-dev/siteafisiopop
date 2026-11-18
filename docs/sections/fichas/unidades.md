<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S17 Unidades

## 1. Identificação
- slug: `unidades` · Ordem: 9 · Nível: completo · Âncora: `#unidades`

## 2. Função na narrativa
- Escolher a unidade mais perto e agendar.
- Papel na jornada: conversão
- Relação com o CTA principal: CTA após escolher a unidade

## 3. Conteúdo
- Chave: `secoes.unidades`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: 3 unidades; endereços/horários pendentes; endereço de Lauro de Freitas provisório
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V3 (lista por unidade). Mapa só ao tocar.

## 4. Layout (Fase 6)
- **Variação:** V3, uma lista de cartões por unidade; mapa carregado só ao tocar (nenhum iframe no carregamento).
- **Fundo:** `bg-bg`; cards `bg-surface` com borda.
- **Estrutura:** `cabecalho` { `titulo` · `texto` } → `lista` → 3 × `card` { `card-nome` · `card-local` · `card-endereco` · `card-horarios` · `card-mapa` · `card-cta` } → `cta` (um CTA principal depois da lista).
- **Card (`UiCard`):** `card-nome` `text-h3`; `card-local` com ícone MapPin (`text-secondary`) `text-body font-strong`; `card-endereco` e `card-horarios` `text-body text-muted`. **Só renderiza o que estiver preenchido** (hoje: nome e local nas 3; endereço só em Lauro de Freitas, ainda `validar`; horários e mapa vazios). `card-mapa` = botão/`details` "ver no mapa" (rótulo em `secoes.unidades.mapa_rotulo`) que só então carrega o mapa; **não aparece sem `mapa_url`**. `card-cta`: **reservado, não renderizado** enquanto o WhatsApp for único; se a pergunta aberta 1 mudar (número por unidade), cada card ganha o CTA principal com `data-cta-local="unidades-{slug}"`.
- **Mobile:** 1 coluna (`gap-4`), cards empilhados; `cta` largura total depois da lista.
- **Tablet (≥768):** 1 coluna com card em duas colunas internas (nome/local à esquerda, endereço/horários à direita).
- **Desktop (≥1024):** 3 colunas (`gap-6`), cards de altura igual; `cta` centralizado abaixo, largura automática.
- **Tokens:** `bg-surface`, `border-border`, `rounded-lg`, `text-secondary`, `shadow-1`.
- **Não fazer:** endereço, horário ou mapa inventado; apresentar o endereço provisório como definitivo (a marcação `validar` permanece e o build de lançamento barra); iframe de mapa no load (LCP/INP).

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` · `UiCard` · `UiIcone` (MapPin) · `UiLink` · `UiCtaPrincipal` (local `unidades`) · `UnidadesCard` · `UnidadesMapa` (client, carrega o mapa ao tocar).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** achar a unidade mais perto e chamar para agendar.
- **Vê:** título, texto, 3 cards (nome, local; endereço, horários e "Ver no mapa" **só se houver dado**) e o CTA principal depois da lista.
- **Faz:** acha a sua unidade; abre o mapa só se quiser; toca no CTA.
- **Reage:** "Ver no mapa" carrega o iframe só no toque (fade de opacidade, sem CLS); CTA com `:active` imediato; campo sem dado simplesmente não aparece.
- **Sente/entende:** praticidade; a dúvida aqui é logística, não de confiança.
- **Atrito → mitigação:** "fica longe / onde é?" → nome e local de cada unidade (endereço só quando confirmado, nunca inventado) · mapa pesado/armadilha de rolagem → só ao toque, sem gesto horizontal · número por unidade (pergunta aberta 1) → `card-cta` reservado.
- **Saída:** WhatsApp (a unidade se escolhe na conversa), ou seguir para o FAQ. Sem beco.
- **Evento de analytics:** `cta_principal_click` (`local` = `unidades`) + `whatsapp_click`; `mapa_open` (extra, `unidade` = `data-item`); `scroll_depth`.
- **Mobile:** 1 coluna; botão do mapa ≥ 48px; CTA esconde a barra (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N0–N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `cabecalho` com `reveal` · os 3 `card` com `stagger-item` · `mapa-embed` · `botao` no CTA.
- **Mapa:** nenhum `iframe` no carregamento. Ao tocar em "ver no mapa" o iframe entra com `opacity 0→1` (`dur-base`) dentro de uma caixa com proporção reservada (`aspect-wide`, sem CLS). Só existe com `mapa_url` preenchido. `UnidadesMapa` (client) controla só esse clique.
- **Desktop/tablet:** cards com `stagger-item`. **Mobile:** cada card como `reveal`, sem stagger. **Reduced-motion:** estático; o mapa abre sem fade.
- **Não fazer:** pin que pisca no mapa, mapa no load, endereço inventado.

## 8. Mobile (Fase 9)
- `card-mapa` (botão) com `min-h-touch`. O iframe de mapa rola junto com a página: é preciso evitar a "armadilha de rolagem" (mapa que captura o gesto vertical); usar o mapa estático/clique ou `touch-action` padrão da página, sem gesto horizontal.
- `cta` largura total; esconde a barra enquanto visível.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.8 (`docs/tasks.md`)
- [auto] 3 `card` na ordem do conteúdo; **campo vazio não renderiza** (`endereco`, `horarios`, `mapa_url`). Teste unitário: hoje só nome e local nas 3 e endereço em Lauro de Freitas; com `endereco` vazio nada de texto de substituição.
- [auto] **Nenhum** `iframe` no HTML inicial. `card-mapa` só existe com `mapa_url` preenchido; ao tocar, o iframe entra com `title`, `loading="lazy"` e caixa `aspect-wide` reservada (CLS 0).
- [manual 390] O mapa não prende a rolagem vertical (sem "armadilha de rolagem"); sem gesto horizontal.
- [auto] Exatamente 1 CTA `unidades`, depois da lista; **nenhum** `card-cta` nem `data-cta-local="unidades-*"` enquanto o WhatsApp for único.
- [auto] O endereço provisório de Lauro de Freitas não vira "definitivo": a marca `validar` permanece e o `build:launch` bloqueia.
- [manual] 1 coluna (mobile); card em 2 colunas internas (768–1023); 3 colunas de altura igual (≥1024).
- [manual] O CTA esconde a barra enquanto visível; motion: `stagger-item` ≥768, `reveal` no mobile; o mapa abre sem fade em reduced-motion.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** CTA com `data-cta-local="unidades"`; cada `card` com `data-item` (para `mapa_open`). Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.8 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
Cabeçalho centralizado; **ladrilho de mídia no topo de cada cartão** (`unidades[].imagem`, hoje `pendente`: gradiente de marca com o ícone de pino, `aria-hidden`). O subtítulo deixou de repetir o título ("Agende pelo WhatsApp. Todas com o mesmo preço, o mesmo cuidado."). Campo vazio continua sem renderizar. Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.

**Revisão de 18/11/2026:** fotos das fachadas nos 3 cards; "Ver no mapa" = link do Google Maps (nova aba, sem iframe); cantos do card e da foto de 8px (`--raio-cartao`). Endereços de Salvador seguem pendentes (campo vazio não renderiza).

**Sobreposição (18/11/2026):** a seção sobe por cima dos depoimentos ao rolar (`pilha-topo`, `UiPilha`) e os cards entram de cima (`stagger-item desce`). Só ≥768 e com movimento ligado.

**Cards (revisão):** entram ligados à rolagem (`view()`, de cima, enquanto sobem na tela); fallback = reveal único.
