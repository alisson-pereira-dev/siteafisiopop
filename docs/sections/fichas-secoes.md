# Fichas das Seções — A.FISIO POP (índice e regras comuns)

> **Fase 10 (Sessão 4):** cada ficha agora é um **arquivo próprio** em `docs/sections/fichas/{slug}.md`, com os campos 1–9 (o 9 = critérios de aceite testáveis). Este arquivo guarda só o **índice**, o **DoD comum** e as **regras de layout comuns**. No build, ler **só a ficha da seção em que se está trabalhando** (`CLAUDE.md`, "Ordem de trabalho").
>
> O texto vive em `content/content.json`; a ficha só aponta para ele. Componentes: `componentes.md`. Jornada macro e receitas de movimento: `docs/jornada-e-motion.md`. Nomes: `docs/convencao-de-nomes.md`.
>
> **Origem dos layouts (Sessão 2):** o usuário não enviou prints da Superpower; os layouts partem das variações anotadas em cada ficha e da `direcao-de-arte.md`. São **propostas aprovadas por padrão**: se o usuário trouxer um print, ajusta-se só a ficha da seção.
>
> **Campos 6–8 (Sessão 3):** jornada e motion partem das decisões M1–M10 de `jornada-e-motion.md` (sem Motion/GSAP/Lenis na v1; só `transform` e `opacity`; nada acima da dobra começa escondido). `09-MOTION` e `08-JORNADA-UX` do framework não estavam disponíveis: ver `docs/conferencia-jornada-motion.md`.

## Índice

| Ficha | Seção | Arquivo | Tarefa em `docs/tasks.md` |
|---|---|---|---|
| S00 | Faixa de preço + Header | [`fichas/header.md`](fichas/header.md) | T2.5 |
| S01 | Hero | [`fichas/hero.md`](fichas/hero.md) | T2.6 |
| S02 | Barra de confiança | [`fichas/prova-rapida.md`](fichas/prova-rapida.md) | T3.1 |
| S03 | Um problema, uma solução | [`fichas/problema-solucao.md`](fichas/problema-solucao.md) | T3.2 (base) e T4.1 (palco N2) |
| S06 | Serviços | [`fichas/servicos.md`](fichas/servicos.md) | T3.3 |
| S07 | Como funciona | [`fichas/como-funciona.md`](fichas/como-funciona.md) | T3.4 |
| S12 | Preço POP | [`fichas/preco-pop.md`](fichas/preco-pop.md) | T3.5 |
| S05 | Para quem é | [`fichas/para-quem.md`](fichas/para-quem.md) | T3.6 |
| S10 | Depoimentos (provisória) | [`fichas/depoimentos.md`](fichas/depoimentos.md) | T3.7 |
| S17 | Unidades | [`fichas/unidades.md`](fichas/unidades.md) | T3.8 |
| S16 | FAQ | [`fichas/faq.md`](fichas/faq.md) | T3.9 |
| S19 | CTA final | [`fichas/cta-final.md`](fichas/cta-final.md) | T3.10 |
| S23 | Footer | [`fichas/footer.md`](fichas/footer.md) | T3.11 |
| — | Global · Acesso fixo | [`fichas/global-acesso-fixo.md`](fichas/global-acesso-fixo.md) | T2.1, T2.2 e T2.7 |

Ordem na página: header · hero · prova-rapida · problema-solucao · servicos · como-funciona · preco-pop · para-quem · depoimentos · unidades · faq · cta-final · footer (+ barra inferior no mobile e flutuante no desktop).

## DoD comum (vale para toda ficha; o campo 9 de cada uma só acrescenta o que é específico)
- **C1 Conteúdo:** nenhum texto fixo em componente; `data-conteudo` aponta para uma chave existente do `content.json`.
- **C2 Tokens:** só classes do tema; `npm run lint` barra valor literal.
- **C3 Nomes:** `node scripts/check-nomes.mjs` passa (classe-nome, `data-section`, `data-ficha`, `data-conteudo`, `data-cta`, `data-anim`, cabeçalho de localização).
- **C4 Responsivo:** 360, 390, 430, 768, 1024, 1280 e 1440px sem rolagem lateral (`scrollWidth <= clientWidth`).
- **C5 Acessibilidade AA:** só os pares de contraste de `docs/design-system.md`; foco visível; tudo operável por teclado; `alt`; ordem de títulos coerente (1 `h1`, `h2` por seção).
- **C6 Motion:** 3 versões (desktop/tablet, mobile, reduced-motion); sem JS tudo visível; só `transform` e `opacity`; nada depende de hover; nada acima da dobra começa escondido.
- **C7 Performance:** sem regressão de LCP < 2,5 s, INP < 200 ms, CLS < 0,1; imagens com dimensões; lazy fora do hero.
- **C8 Build:** `npm run build`, `npm run lint` e `npm test` passam.
- **C9 Pendências:** itens `validar`/`provisorio` continuam marcados; nada é apresentado como fato definitivo; campo vazio não renderiza.

## Regras de layout comuns a todas as seções
- **Casca:** cada seção usa `UiSecao` (raiz com `id`, `data-section`, `data-ficha`, `data-conteudo`, `aria-labelledby`) com `py-section` e, dentro, `UiContainer` (`max-w-container mx-auto px-pad`). Exceção: o header e as faixas full-bleed (fundo vai até a borda, conteúdo continua no contêiner).
- **Grid:** 1 coluna no mobile; 12 colunas a partir de 1024px. Nada de largura fixa em px; texto corrido com `max-w-measure`.
- **Ritmo de fundos (de cima para baixo):** faixa `bg-inverse` · header `bg-bg` · hero `bg-bg` · prova rápida `bg-bg-alt` · problema/solução `bg-bg` · serviços `bg-bg-alt` · como funciona `bg-bg` · **preço `bg-inverse`** · para quem `bg-bg` · depoimentos `bg-bg-alt` · unidades `bg-bg` · FAQ `bg-bg-alt` · **CTA final `bg-inverse`** · footer `bg-bg-alt`. Rosa nunca vira fundo grande; `bg-bg-teal` só em blocos pequenos, sempre com texto em tinta.
- **Títulos:** um `h1` (hero); `h2` por seção (`text-h2`), `h3` em cards. Destaque serifado via `**palavra**` → `.accent-serif` (em fundo escuro usa `text-on-inverse-primary`).
- **CTA principal:** só `UiCtaPrincipal`. Aparece em: hero, problema/solução, como funciona, preço, unidades, CTA final, painel do menu, **header (≥768px)** e **`UiBarraCta` (barra inferior fixa, <768px)**. Em serviços e unidades aparecem só links contextuais discretos (`UiLink`).
- **Acesso fixo ao WhatsApp (decisão do usuário):** mobile (<768px) = `UiBarraCta` (texto completo, sem botão flutuante); ≥768px = CTA no header + `WhatsappFloat`. Nunca os dois fixos ao mesmo tempo: a barra é `md:hidden` e o flutuante é `hidden md:flex`.
- **Mídia pendente:** enquanto `src` for `"pendente"`, `UiMidia` **não renderiza imagem inventada**. No hero mostra o bloco neutro `bg-bg-alt` com a proporção reservada (evita CLS); nos cards de serviço a mídia simplesmente não aparece.
- **Campo vazio não renderiza** (endereço, horários, mapa, registro profissional), sem texto de substituição.
