# Componentes — A.FISIO POP (Fase 7)

> Só os componentes que as fichas usam (`fichas-secoes.md`, campo 5). Nada além disso entra no build. Nomes seguem `convencao-de-nomes.md`: **classe-nome é sempre a primeira classe**, sem CSS nela; estilo vem só de utilitários do tema do Tailwind (tokens).
>
> **Regra de grep:** o componente compartilhado recebe a classe-nome da seção por `className` (ex.: `<UiTitulo className="servicos__titulo">`), para `grep -rn "servicos__titulo" src/` achar o arquivo da seção. Nunca montar classe-nome por concatenação (`${bloco}__titulo`).
>
> **Server por padrão.** `"use client"` só onde há estado ou observador: `HeaderPainel`, `HeaderBarra`, `ProblemaSolucaoPalco`, `UnidadesMapa`, **`CtaObservador`** e **`MotionInit`** (os dois últimos sem saída visual, montados uma vez no layout). **`UiBarraCta` e `WhatsappFloat` são server** (Fase 9: o observador escreve `data-estado`/`inert` direto no DOM). `UiAccordion` é server (CSS em `details[open]`).
>
> **Dependência a instalar na fatia vertical:** `lucide-react` (ícones; ainda não instalado). **Motion, GSAP e Lenis não entram na v1** (decisão M1, `jornada-e-motion.md`).

## 1. Compartilhados (`src/ui/`, prefixo `ui-`)

| Componente | Arquivo | Props principais | Variantes / tom | Usado em |
|---|---|---|---|---|
| `UiSecao` | `UiSecao.tsx` | `id`, `bloco`, `ficha`, `conteudo`, `labelledby`, `tom`, `children` | tom: `base` (`bg-bg`) · `alt` (`bg-bg-alt`) · `inverse` (`bg-inverse text-on-inverse`); `compacta` troca `py-section` por `py-7` | todas as seções, exceto header e footer |
| `UiPilha` | `UiPilha.tsx` | `children` | **client.** Empilha seções vizinhas: a primeira (`data-anim="pilha-base"`) trava e as seguintes (`pilha-topo`) sobrepõem ao rolar. N2 por `position: sticky`; `--pilha-topo` medido por ResizeObserver; só ≥768 e com `data-motion="on"` (`pilha.css`); a base também ganha parallax leve por CSS scroll-driven. Uso: (1) hero (base) + prova-rapida + como-funciona (topo), com parallax `pilha-parallax` no hero; (2) depoimentos (base) + unidades (topo) |
| `UiContainer` | `UiContainer.tsx` | `className`, `children` | — | todas |
| `UiTitulo` | `UiTitulo.tsx` | `nivel` (`h1`/`h2`/`h3`), `id`, `className`, `children` (texto com `**destaque**`), `tom` | tom: `claro` · `inverso` (destaque em `text-on-inverse-primary`) | hero, S03, S06, S07, S12, S05, S10, S17, S16, S19 |
| `UiCtaPrincipal` | `UiCtaPrincipal.tsx` | `local` (vira `data-cta-local`), `className` | único botão `ui-botao--primario`; texto, destino e mensagem vêm de `src/lib/cta.ts` e `whatsapp.ts` | hero, S03, S07, S12, S17, S19, header (≥768px), painel, `UiBarraCta` |
| `UiBarraCta` (server) | `UiBarraCta.tsx` | `className` | barra inferior fixa **só no mobile** (`md:hidden`): `fixed inset-x-0 bottom-0 z-sticky bg-bg border-t border-border shadow-3`, `px-pad pt-3`, `pb-3` + `var(--safe-bottom)`; embrulha `UiCtaPrincipal` com `local="barra"` (texto completo, `min-h-touch`); `data-estado` `visivel`/`oculta` (escondida = `inert`) | montada uma vez no layout da página |
| `UiBotao` | `UiBotao.tsx` | `href`, `variante`, `tamanho`, `cheio` (largura total no mobile) | `primario` (só via `UiCtaPrincipal`) · `secundario` (contorno em `text-foreground`) | hero (`cta-secundario`) |
| `UiLink` | `UiLink.tsx` | `href`, `ariaLabel`, `externo`, `seta` | texto `text-link`, sublinhado, `min-h-touch`, ícone ArrowRight opcional | S03 (solução), S06 (serviço), S17, footer |
| `UiChip` | `UiChip.tsx` | `tom`, `children` | `claro` (`bg-primary-soft text-foreground`) · `inverso` (`border` + `text-on-inverse-accent`) | hero (etiqueta), S12 (etiqueta) |
| `UiSelo` | `UiSelo.tsx` | `valor`, `rotulo`, `tom` | `destaque` (`bg-primary-soft text-foreground`, 12,95:1) · `aviso` (`bg-warning-bg text-warning`, 4,96:1) | hero (R$ 49,99), S10 (provisório) |
| `UiCard` | `UiCard.tsx` | `tom`, `as`, `className`, `classes`, `data-*`, `children` | `surface` (`bg-surface border border-border rounded-lg p-5 shadow-1`) · `elevado` (`bg-surface` + `shadow-4`, cartão claro sobre faixa escura, anel de foco escuro; usado no preço) · `teal` (`bg-bg-teal`, texto em tinta, sem sombra) | S03, S06, S12, S05, S10, S17 |
| `UiIcone` | `UiIcone.tsx` | `nome` (chave do registro), `tamanho` (16/20/24/32), `contorno` (contêiner `rounded-icon`), `rotulo` | decorativo = `aria-hidden`; com significado = `role="img"` + `aria-label` | S03, S06, S05, S12, S17, S16, header, float |
| `UiMidia` | `UiMidia.tsx` | `src`, `alt`, `proporcao` (`hero`/`card`/`square`/`wide`), `priority`, `sizes`, `ocultarSePendente` | `src === "pendente"` → hero: bloco `bg-bg-alt` com proporção reservada; card: não renderiza | hero, S06, logo |
| `UiAccordion` | `UiAccordion.tsx` | `pergunta`, `resposta`, `className` | `<details>/<summary>`; `data-estado="aberto"` espelha `open` | S16 |

**Props acrescentadas no build:** `UiTitulo tamanho`, `UiLink tom (link|texto) · classes`, `UiContainer classes`, `UiBotao/UiCtaPrincipal animExtra`, `data-*` repassados por `UiCard/UiTitulo/UiIcone/UiAccordion` (`src/ui/tipos.ts`). `UiAccordion` recebe `classePergunta/classeIcone/classeResposta` (nomes `faq__*`).

**Registro de ícones (`UiIcone`):** serviços (`activity`, `droplets`, `moon`, `ruler`, `circle-dot`, `sparkles`, `bone`, `stethoscope`, vindos do `content.json`) + interface (`menu`, `x`, `check`, `arrow-right`, `arrow-down`, `chevron-down`, `map-pin`, `message-circle`). O nome do ícone vem do conteúdo; nome fora do registro **falha no build** (não cai em ícone padrão). Lucide apenas.

## 2. De seção (`src/secoes/{slug}/`)

| Componente | Pasta | Papel | Notas |
|---|---|---|---|
| `Header` · `HeaderBarra` · `HeaderPainel` | `header/` | faixa de preço, barra, menu e painel | `HeaderBarra` marca "rolado"; `HeaderPainel` (client) cuida de abrir/fechar, Esc, foco preso, trava de rolagem. Raiz própria |
| `Hero` · `HeroMoldura` | `hero/` | conteúdo, mídia, selo | `HeroMoldura` só decoração (`aria-hidden`) |
| `ProvaRapida` · `ProvaRapidaItem` | `prova-rapida/` | 4 indicadores | sem ícone, sem card |
| `ProblemaSolucao` · `ProblemaSolucaoPar` · `ProblemaSolucaoPalco` | `problema-solucao/` | lista de pares + palco do desktop | palco é client, só ≥1024 e sem reduced-motion; detalhes na Fase 9 |
| `Servicos` · `ServicosCard` | `servicos/` | grade de 7 cards | card aceita `largo` (`col-span`) e `midia` opcional |
| `ComoFunciona` · `ComoFuncionaPasso` | `como-funciona/` | timeline vertical | — |
| `PrecoPop` · `PrecoPopInclui` | `preco-pop/` | texto no escuro + card de preço | — |
| `ParaQuem` · `ParaQuemItem` | `para-quem/` | lista + bloco "não é para" | — |
| `Depoimentos` · `DepoimentosCard` | `depoimentos/` | grade de citações | selo provisório enquanto `provisorio: true` |
| `Unidades` · `UnidadesCard` · `UnidadesMapa` | `unidades/` | cartões por unidade | `UnidadesMapa` client, carrega ao tocar; campos vazios não renderizam |
| `Faq` | `faq/` | usa `UiAccordion` | sem schema até validar |
| `CtaFinal` | `cta-final/` | faixa escura | — |
| `Footer` · `FooterColuna` | `footer/` | marca, colunas, legal | `registro` só quando preenchido. Raiz própria |

## 3. Globais

| Componente | Arquivo | Papel |
|---|---|---|
| `WhatsappFloat` | `src/ui/WhatsappFloat.tsx` | botão circular fixo **só a partir de 768px** (`hidden md:flex`); `bg-whatsapp`, ícone `text-whatsapp-contrast`; `data-cta="flutuante"`; **não** é `ui-botao--primario`. No mobile quem faz esse papel é a `UiBarraCta`. **Server** |
| `CtaObservador` | `src/ui/CtaObservador.tsx` | client, sem saída visual, montado no layout: cria **um** `IntersectionObserver` e aplica a regra de `src/lib/cta-visibilidade.ts` |
| `MotionInit` | `src/ui/MotionInit.tsx` | client, sem saída visual: quando o JS de animação está pronto e sem reduced-motion, marca `visto` o que já está na tela, **então** põe `data-motion="on"` e observa o resto (observer único dos `reveal`/`stagger-item`); falha segura remove `data-motion` e põe `data-js-falhou` |
| script inline | `src/app/layout.tsx` | antes da 1ª pintura, só com JS: `data-js` no `<html>` e o watchdog de 4 s. **Não** põe `data-motion` |

**Visibilidade (um observador, duas regras).** O `CtaObservador` (substitui o hook provisório `useCtaPrincipalVisivel`) observa todos os `[data-cta="principal"]`, **exceto** `data-cta-local` `barra`, `header` e `header-painel`, e **escreve atributos no DOM** (sem estado React, sem re-render):
- `algumCtaVisivel` → `UiBarraCta`: `data-estado="oculta"` + `inert` enquanto for `true` (imediato); `visivel` após 300 ms sem CTA na tela (decisão do usuário + histerese da Fase 9).
- `heroVisivel` → `WhatsappFloat`: `data-estado="visivel"` quando for `false` (regra do flutuante inalterada).
"Visível" = `intersectionRatio ≥ 0,5` dentro da área acima da barra e abaixo do header (valores completos em `jornada-e-motion.md` §5). Sem JS, os dois ficam visíveis. Como o observador enxerga qualquer `data-cta="principal"`, **toda seção nova com CTA principal entra na regra sozinha**, desde que use `UiCtaPrincipal`. A variável `--safe-bottom` (`env(safe-area-inset-bottom)`) fica em `globals.css`, e o `viewport` do `layout.tsx` precisa de `viewportFit: "cover"`.

**Falha segura (M9):** `CtaObservador` e `MotionInit` marcam `data-js-pronto` no `<html>` na 1ª linha da inicialização; sem isso, o *watchdog* de 4 s do script inline põe `data-js-falhou` e o CSS mostra barra, flutuante e os `reveal` (`jornada-e-motion.md` §3.3).

**Logo:** `site.logo.src` no `content.json` é `assets/logo-afisiopop.png` (sem barra inicial) e o arquivo mora em `public/assets/`; `UiMidia` (e o `logo` do header e do footer) normaliza para `/assets/logo-afisiopop.png`, em um só lugar.

**Fora das 13 fichas (decisões da Fase 10, reversíveis):** `pagina-404` entra (T5.3); `/privacidade` e `/termos` entram como rascunho técnico (T5.1); `cookie-banner` **não entra na v1** enquanto não houver analytics/pixel (só se a decisão de analytics mudar, T5.2); `voltar-topo` **não entra na v1** (a base da tela já é da barra/flutuante; evita colisão). As chaves `microcopy.cookies` e `microcopy.acessibilidade.voltar_ao_topo` ficam no `content.json` sem uso.

## 4. Regras que valem para todos
- **Um único CTA principal:** `UiCtaPrincipal` é o único lugar que emite `data-cta="principal"` (a `UiBarraCta` o embrulha, não cria outro botão; `data-cta-local="barra"`). Os outros links de WhatsApp usam `data-cta="servico"` (cards) ou `data-cta="flutuante"` (botão flutuante). `check-nomes.mjs` (Fase 10) confere.
- **Conteúdo:** nenhum componente tem texto fixo; tudo de `src/lib/conteudo.ts`. Os rótulos de acessibilidade vêm de `microcopy.acessibilidade`.
- **Tokens:** só classes do tema (`bg-bg-alt`, `rounded-lg`, `shadow-2`…); o ESLint barra valor literal.
- **Foco:** anel de 3px em `focus-ring` (branco sobre `bg-inverse`); alvo de toque ≥ `min-h-touch`.
- **Estados:** hover só decorativo; foco, ativo e aberto/fechado têm equivalente por teclado e toque.
- **Cabeçalho de localização** em todo arquivo (seção, ficha, chave do conteúdo, elementos).

## 5. Chaves de conteúdo (criadas na Fase 10, em `content.json` v2)
Componentes precisam destes textos e **não devem ter texto fixo**. As 4 chaves **já existem** no `content.json`:
1. `secoes.depoimentos.rotulo_provisorio` (texto do selo "provisório").
2. `secoes.unidades.mapa_rotulo` (botão "ver no mapa").
3. `secoes.prova_rapida.rotulo_acessivel` (nome acessível da faixa, que não tem título visível).
4. `microcopy.acessibilidade.navegacao_principal` (`aria-label` do `nav`).
