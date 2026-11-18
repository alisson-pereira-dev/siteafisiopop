<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S23 Footer

## 1. Identificação
- slug: `footer` · Ordem: 12 · Nível: completo · Âncora: `(rodapé)`

## 2. Função na narrativa
- Fechar com contatos, unidades, links legais e registro profissional.
- Papel na jornada: fecho
- Relação com o CTA principal: repete o contato

## 3. Conteúdo
- Chave: `secoes.footer`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: registro profissional / CNPJ (bloqueia)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (colunas). Renderizar registro só quando preenchido.

## 4. Layout (Fase 6)
- **Variação:** V1, marca + 3 colunas de links + linha legal.
- **Fundo:** `bg-bg-alt` (o CTA final acima é escuro; o rodapé volta ao claro), borda superior `border-t border-border`.
- **Estrutura:** `marca` { logo · `descricao` } → `colunas` → 3 × `coluna` { `coluna-titulo` · `link`s } → `registro` (só se preenchido) → `legal` (links legais) · `copyright`.
- **Mobile:** tudo em 1 coluna: `marca`, depois as 3 `coluna` empilhadas (`gap-6`), cada `link` com `min-h-touch`; `coluna-titulo` `text-small font-strong text-foreground` (sem caixa alta); `registro` `text-small text-muted`; `legal` e `copyright` `text-small text-subtle`. `pb` extra no mobile para a `UiBarraCta` não cobrir o último link (altura da barra = `min-h-touch` + 2 × `space-3` + área segura; usar `pb-9` somado à área segura). A partir de 768px o `pb` extra é só o do `whatsapp-float` (`pb-8`).
- **Tablet (≥768):** `marca` em linha própria; `colunas` em 3 colunas.
- **Desktop (≥1024):** grid 12: `marca` nas colunas 1–4; `colunas` nas colunas 6–12 (3 colunas); linha final com `legal` à esquerda e `copyright` à direita, separada por `border-t border-border`.
- **Tokens:** `bg-bg-alt`, `text-foreground`, `text-muted`, `text-subtle`, `border-border`, `min-h-touch`.
- **Não fazer:** renderizar `registro` vazio ou com texto de substituição; logo branco; novo botão rosa (o contato é um link de texto, e o CTA principal não se repete aqui).

## 5. Componentes (Fase 7)
`UiContainer` · `UiLink` · `UiMidia`/`next/image` (logo) · `FooterColuna`. Raiz própria (`footer`), sem `UiSecao`.

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** fechar com contatos, legitimidade e links legais.
- **Vê:** marca, descrição, 3 colunas (navegação, unidades, contato), registro profissional (**só se preenchido**), links legais e copyright.
- **Faz:** confere contatos e unidades; abre o Instagram ou os links legais; toca no link de WhatsApp (texto, não botão).
- **Reage:** links com `:active` imediato; âncoras rolam; sem animação (N0).
- **Sente/entende:** confiança final.
- **Atrito → mitigação:** "é legítima? tem registro?" → registro quando houver; vazio **não** renderiza · "onde acho o contato de novo?" → colunas · "como cancelo / o que fazem com meus dados?" → `/privacidade` e `/termos` (rascunho técnico até revisão).
- **Saída:** WhatsApp (link de texto), Instagram, âncoras, `/privacidade` e `/termos` (estas levam de volta ao início). Sem beco.
- **Evento de analytics:** `whatsapp_click` (`tipo` = `footer`); `scroll_depth` (100%).
- **Mobile:** links ≥ 48px; `pb` reserva a barra, que nunca cobre o último link (campo 8).

## 7. Motion (Fase 9)
- **Nível:** N0. Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma.
- **Alvos `[data-anim]`:** nenhum. O footer é estático (sem reveal): é onde a pessoa procura informação objetiva.
- **3 versões:** iguais (nenhuma animação). **Reduced-motion:** igual.
- **Não fazer:** reveal no rodapé, botão "voltar ao topo" animado (`voltar-topo` só na Fase 10, com a mesma regra de visibilidade).

## 8. Mobile (Fase 9)
- Cada `link` com `min-h-touch`; `pb` extra para a `UiBarraCta` (altura da barra + área segura) não cobrir o último link; ≥768px `pb-8` para o flutuante.
- Sem gestos. Nenhum link legal escondido atrás da barra: conferir no iOS com a barra de endereços recolhida e expandida.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T3.11 (`docs/tasks.md`)
- [auto] Raiz própria `footer` (sem `UiSecao`). `registro` **não renderiza** com texto vazio (teste unitário) e renderiza quando preenchido.
- [auto] 3 colunas de `secoes.footer.colunas`; o link `whatsapp` vira link de texto (`UiLink`) com `wa.me`; **nenhum** `data-cta="principal"` e nenhum `ui-botao--primario` no footer.
- [auto] Links externos (Instagram) com `rel="noopener noreferrer"`; `copyright` e `descricao_curta` do conteúdo.
- [auto] `/privacidade` e `/termos` existem (T5.1), sem 404.
- [manual 390×844, iOS Safari ou emulação] Com a barra de endereços recolhida e expandida o último link nunca fica sob a `UiBarraCta`; ≥768 o `pb-8` do flutuante basta.
- [auto] Nenhum `data-anim` no footer (N0).
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** o link de WhatsApp é um `<a>` com `href` `wa.me` dentro de `data-section="footer"` (para `whatsapp_click`, `tipo` = `footer`). Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.11 em `docs/tasks.md` · build: pendente


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Raiz `bg-inverse` com `px-2` e um **cartão claro** `rounded-md` (`footer__cartao`) dentro, como o rodapé da Superpower. Conteúdo, links e regras (registro vazio não renderiza) iguais. **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

**Revisão de 18/11/2026:** rodapé mais clean (links regulares, sem sublinhado; rótulos leves) e hover/foco rosa `text-primary` (`FooterLink`).
