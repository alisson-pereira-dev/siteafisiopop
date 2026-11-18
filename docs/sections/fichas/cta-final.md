<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S19 CTA final

## 1. Identificação
- slug: `cta_final` · Ordem: 11 · Nível: completo · Âncora: `#agendar`

## 2. Função na narrativa
- Último convite, sem informação nova.
- Papel na jornada: conversão
- Relação com o CTA principal: CTA principal (fim)

## 3. Conteúdo
- Chave: `secoes.cta_final`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: —
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (faixa contrastante escura).

## 4. Layout (Fase 6)
- **Variação:** V1, faixa escura full-bleed, conteúdo centralizado.
- **Fundo:** `bg-inverse`, `py-section`; sem imagem (um loop de vídeo curto à la Biograph só entra se houver mídia real e a Fase 9 aprovar).
- **Estrutura:** `conteudo` { `titulo` · `subtexto` · `cta` }.
- **Mobile:** centralizado, `max-w-measure`: `titulo` `text-h1` em `text-on-inverse` com destaque `text-on-inverse-primary`; `subtexto` `text-body-lg text-on-inverse`; `cta` largura total.
- **Tablet/Desktop (≥768):** `titulo` até `text-display`; `cta` com largura automática, centralizado.
- **Tokens:** `bg-inverse`, `text-on-inverse`, `text-on-inverse-primary`, `text-h1/display`.
- **Não fazer:** informação nova, segundo botão, gradiente rosa → rosa vivo atrás do texto.

## 5. Componentes (Fase 7)
`UiSecao` (tom `inverse`) · `UiContainer` · `UiTitulo` (h2, tom `inverso`) · `UiCtaPrincipal` (local `cta-final`).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** o último convite para chamar, **sem informação nova**.
- **Vê:** faixa escura com a frase final ("Seu corpo está pedindo cuidado"), o subtexto e o CTA principal.
- **Faz:** toca no CTA.
- **Reage:** CTA com `:active` imediato e abre o WhatsApp; entrada por `reveal`/`stagger-item` (segundo plano); sem pulso nem brilho.
- **Sente/entende:** decisão sem pressão.
- **Atrito → mitigação:** nenhuma nova (por regra da ficha); qualquer dúvida restante já foi tratada no FAQ.
- **Saída:** WhatsApp aberto com a mensagem padrão, ou o footer. Sem beco.
- **Evento de analytics:** `cta_principal_click` (`local` = `cta-final`) + `whatsapp_click`; `scroll_depth` (100%).
- **Mobile:** CTA em largura total; ao sair para o footer a barra volta (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N1. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS + IO).
- **Alvos `[data-anim]`:** `titulo`, `subtexto` e `cta` com `stagger-item` · `botao`.
- **Desktop/tablet:** os 3 entram em sequência (60ms). **Mobile:** `reveal` simples, sem stagger. **Reduced-motion:** estático.
- Sem loop de vídeo (só entra com mídia real e nova aprovação de motion). CTA **sem pulso** e sem brilho.
- **Não fazer:** segundo botão, gradiente rosa atrás do texto, contagem regressiva.

## 8. Mobile (Fase 9)
- `cta` largura total, `min-h-touch`, centralizado. Nenhum gesto. `pb` normal (a barra inferior reaparece sobre o footer, que reserva espaço).

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.10 (`docs/tasks.md`)
- [auto] `h2` = `secoes.cta_final.headline` com destaque em `text-on-inverse-primary`; `subtexto` do conteúdo; exatamente 1 CTA `cta-final`.
- [auto] Sem informação nova, sem segundo botão, sem gradiente rosa atrás do texto, sem pulso e sem contagem.
- [manual] 360: centralizado, CTA em largura total; ≥768: `titulo` até `text-display`, CTA de largura automática.
- [manual] Ao rolar para o footer, a barra volta (mobile) e não cobre o último link.
- [manual] Motion: `stagger-item` dos 3 elementos ≥768; `reveal` no mobile; estático em reduced-motion.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** CTA com `data-cta-local="cta-final"`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.10 em `docs/tasks.md` · build: pendente


## Revisão: estrutura da Superpower (16/11/2026, pedido do usuário)
A faixa escura de largura total vira um **cartão escuro arredondado** (`cartao`, `rounded-lg`, `bg-inverse`) dentro do contêiner, como a hero. A raiz da seção passa a ser clara; o destaque serifado segue por `.section-inverse` no cartão. Onde o campo 4 (layout) deste arquivo disser o contrário, **vale esta revisão**. Elementos novos na convenção §5.

- **Selos e 2º botão (16/11/2026, mapa do usuário):** 3 selos com check (`secoes.cta_final.selos`, repetem fatos de `preco_pop.inclui`: Avaliação incluída · Mesmo preço em todas as unidades · Sem taxa escondida) e o botão secundário "Ver serviços por R$ 49,99" (`ctas.secundario`, `ui-botao--secundario` com contorno claro, sem `data-cta`). Continua **1 só** CTA principal. Substitui "sem segundo botão" do campo 4.


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Faixa escura **de largura total** com o **texto à esquerda** (título, subtexto, 3 selos, 2 botões); o **rodapé** (cartão claro arredondado) vem logo embaixo, sobre o mesmo fundo escuro. A foto full-bleed da referência é mídia pendente. **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**
