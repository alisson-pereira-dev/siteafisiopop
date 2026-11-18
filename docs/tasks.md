# Tasks — A.FISIO POP (build, Fase 11)

> Gerado na Fase 10 (Sessão 4). **T0, T1.1, T2, T3 e T4 (aprovadas) e T5 (T5.1, T5.3, T5.4, T5.5 ✅; T5.2 não se faz) já estão concluídas; a T5 aguarda revisão do usuário antes da T6** (T4.3 não se faz: a pergunta 3 segue "não") (ver `docs/00-ESTADO-DO-PROJETO.md` §12). Daqui em diante a ordem é: **T2 (fatia vertical)** → **T3 (uma seção por tarefa)** → **T4 (palco N2 e conferência de motion)** → **T5 (sistema)** → **T6 (pré-lançamento)**.

## Como trabalhar uma tarefa
1. Ler `CLAUDE.md`, a seção 12 do estado e **só** os arquivos da coluna "Lê" (a ficha da seção em `docs/sections/fichas/{slug}.md`, não o índice inteiro). Localizar código por nome: `grep -rn "classe-nome" src/`.
2. Executar. Parar e avisar se faltar planejamento ou dado (nunca inventar texto, layout ou animação).
3. Ao fim: `npm run build`, `npm run lint`, `npm test` e, depois da T2.0, `npm run check:nomes`. Conferir o **campo 9 da ficha** (itens `[auto]` viram teste; itens `[manual NNN]` são conferidos no navegador nas larguras indicadas).
4. Atualizar a seção 12 e o log de `docs/00-ESTADO-DO-PROJETO.md` (status, decisões, arquivos, pendências, próximo passo).
5. Uma tarefa por vez, na ordem. Cada seção entra em `src/app/page.tsx` na ordem do mapa.

**Infra de teste das tarefas `[auto]`** (criar na T2.4, usar depois): helper `src/test/render.tsx` com `renderToStaticMarkup` (componentes server, **sem JSDOM**) e mock de `next/image`. O que exigir navegador (observer, foco, layout, CLS) fica `[manual]` e é registrado no estado com a largura testada.

Larguras de conferência: **360, 390, 768, 1280** (e 430, 1024, 1440 para rolagem lateral).

---

## T2: Fatia vertical (tokens + header + hero + acesso fixo)

### T2.0 `scripts/check-nomes.mjs`
- **Lê:** `docs/convencao-de-nomes.md` (§2, §3, §5, §8, §9 e a lista de exceções).
- **Faz:** script Node (usa o `typescript` já instalado para ler o JSX; sem dependência nova) que varre `src/**/*.tsx` e falha (exit 1) se: (a) `<div`/`<span` sem `className` cuja **primeira classe** é um nome válido da lista oficial (bloco `bloco__elemento[--mod]`, `ui-*`, `whatsapp-float`, `voltar-topo`, `cookie-banner`, `pagina-404`, `teste-tokens`); (b) nome proibido (`wrapper`, `container` exceto `ui-container`, `box`, `inner`, `content`, `item` sozinho, `div1`, `section2`, nomes de aparência); (c) raiz de seção sem `id`, `data-section`, `data-ficha`, `data-conteudo`; (d) `data-cta` fora de `principal|servico|flutuante`, `data-cta="principal"` fora de `UiCtaPrincipal.tsx`, ou `data-cta-local` fora da lista (inclui `unidades-*`, **reservado**); (e) `data-anim` ou `data-estado` fora dos valores da convenção; (f) `data-js`, `data-motion`, `data-js-pronto`, `data-js-falhou` fora de `layout.tsx`/script do `<html>`; (g) arquivo sem cabeçalho de localização. **Exceções:** `<span className="accent-serif">`; `header` e `footer` com raiz própria; `aria-label` no lugar de `aria-labelledby` na raiz de `prova-rapida`.
- **Também:** `package.json` ganha `check:nomes`, e `build` passa a rodar `check-pendencias`, `check-nomes` e `next build` (a T4.2 acrescentou `check-motion`). Teste `scripts/check-nomes.test.mjs` com fixtures boas e ruins.
- **Aceite:** passa em `src/app/**` atual; falha em 8 fixtures ruins (uma por regra a–g + `unidades-*`); `npm test` e `build` verdes.

### T2.1 `globals.css`, `layout.tsx` e script inline
- **Lê:** `docs/jornada-e-motion.md` §3.3, §3.5, §5 · `docs/sections/fichas/global-acesso-fixo.md` (campos 4, 7, 8) · `AGENTS.md` (Next 16: consultar `node_modules/next/dist/docs/` antes de usar API do framework).
- **Faz:** em `globals.css`: `--safe-bottom: env(safe-area-inset-bottom)`, `--barra-cta-altura: 0px`, `--scale-hover: 1.02`, `--scale-press: 0.98`; `scroll-padding-top: calc(var(--header-height) + var(--space-4))`, `scroll-padding-bottom: var(--barra-cta-altura)` (<768); `scroll-behavior: smooth` **só** em `(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)` (desligado no toque); regras `[data-motion="on"] [data-anim="reveal"]:not([data-estado="visto"])` (estado inicial, só depois que `MotionInit` põe `data-motion`), o layout do palco por `html[data-js]` + media query `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` + `:not([data-js-falhou])` (M8), e o fallback `html[data-js-falhou]` (barra/flutuante visíveis, palco desligado); classes de transição das receitas de `jornada-e-motion.md` §3.4 **só com tokens**. Em `layout.tsx`: `viewport` com `viewportFit: "cover"`; script inline antes da 1ª pintura que, **só quando há JS**, põe **apenas `data-js`** (não põe `data-motion`) e arma o **watchdog de 4 s** (M9: sem `data-js-pronto` → põe `data-js-falhou`; sem JS não existe temporizador); `suppressHydrationWarning` no `<html>`; `<main id="conteudo">`.
- **Aceite:** HTML inicial traz o script e `viewport-fit=cover`; o script inline **não** põe `data-motion`; simular `data-js-falhou` (bloquear o bundle e esperar 4 s) mostra barra/flutuante e desliga o palco; sem JS nenhum nada fica escondido e não há temporizador; no mobile (toque) a âncora não usa rolagem suave; nenhum valor literal fora do script (a constante de 4 s fica nomeada); build e lint verdes.

### T2.2 `src/lib/cta-visibilidade.ts` + testes
- **Lê:** `docs/jornada-e-motion.md` §5 · `fichas/global-acesso-fixo.md` (campo 9).
- **Faz:** função/máquina **pura** (sem DOM): entra `{ctaLocal, razao}` por CTA observado, `focoNaBarra`, `painelAberto`, tempo; sai o estado da barra (`pendente|visivel|oculta`) e do flutuante. Constantes: limiar 0,5; atraso de 300 ms só para **mostrar**; esconder é imediato.
- **Aceite:** Vitest com timers falsos cobre: esconde imediato; mostra só após 300 ms contínuos; **dois CTAs separados por menos de 300 ms não reexibem**; `:focus-within` impede esconder; `heroVisivel` governa o flutuante; painel aberto = `inert` e volta ao estado calculado; estado inicial `pendente`.

### T2.3 `lucide-react` + `UiIcone`
- **Lê:** `docs/sections/componentes.md` (§1, registro de ícones).
- **Faz:** instalar `lucide-react`; `UiIcone` com **registro fechado** (`activity`, `droplets`, `moon`, `ruler`, `circle-dot`, `sparkles`, `bone`, `stethoscope`, `menu`, `x`, `check`, `arrow-right`, `arrow-down`, `chevron-down`, `map-pin`, `message-circle`); nome fora do registro **lança erro**; decorativo = `aria-hidden`, com significado = `role="img"` + `aria-label`; tamanhos 16/20/24/32 e contêiner `rounded-icon`.
- **Aceite:** teste confere que todo `icone` de `content.json` está no registro e que nome desconhecido lança; build/lint verdes.

### T2.4 Componentes `ui-*` base
- **Lê:** `docs/sections/componentes.md` (§1 e §4) · `docs/convencao-de-nomes.md` · `src/lib/*`.
- **Faz:** `UiSecao`, `UiContainer`, `UiTitulo` (h1/h2/h3, `**destaque**`, tom `claro`/`inverso`), **`UiCtaPrincipal`** (único emissor de `data-cta="principal"`, `data-cta-local`, `ui-botao--primario`), `UiBotao` (`secundario`), `UiLink` (externo com `rel="noopener noreferrer"`), `UiChip`, `UiSelo`, `UiCard`, `UiMidia`. `UiMidia` com `src="pendente"` não renderiza imagem (card) ou reserva o bloco `bg-bg-alt` com a proporção (hero) e **normaliza `site.logo.src`** para `/assets/logo-afisiopop.png` em um só lugar. Cabeçalho de localização em todo arquivo; sem texto fixo. Criar `src/test/render.tsx`.
- **Aceite:** testes de marcação: `UiCtaPrincipal` devolve texto/`href` de `site.ctas.principal` e `data-cta`/`data-cta-local`; `UiSecao` emite `id`, `data-section`, `data-ficha`, `data-conteudo`; `UiMidia` pendente; `UiTitulo` transforma `**x**` em `accent-serif`; `check:nomes` passa.

### T2.5 Header (`Header`, `HeaderBarra`, `HeaderPainel`)
- **Lê:** `docs/sections/fichas/header.md`.
- **Faz:** faixa de preço + barra + `nav` + CTA (≥768) + `botao-menu`/`painel`; ~~`header-fundo` por observer na faixa~~ (substituído em 16/11/2026 pela "pílula de vidro": ver a revisão no fim de `docs/sections/fichas/header.md`); gaveta lateral com foco preso, Esc, `inert`, trava de rolagem; **link "Pular para o conteúdo"** (`microcopy.acessibilidade.pular_para_conteudo`, primeiro foco, leva a `#conteudo`); `aria-label` do `nav` = `navegacao_principal`; `aria-label` do botão = `abrir_menu`/`fechar_menu`. Logo com `next/image priority`.
- **Aceite:** campo 9 da ficha `header`.

### T2.6 Hero (`Hero`, `HeroMoldura`)
- **Lê:** `docs/sections/fichas/hero.md`.
- **Faz:** conteúdo + mídia + selo, mobile primeiro; só `data-anim="botao"`; **selo estático (N0)** e nada acima da dobra começa escondido, com ou sem JS (M7/M10).
- **Aceite:** campo 9 da ficha `hero`. **Registrar LCP, CLS e INP** da fatia no estado.

### T2.7 `UiBarraCta`, `WhatsappFloat`, `CtaObservador`, `MotionInit`
- **Lê:** `docs/sections/fichas/global-acesso-fixo.md` · `docs/jornada-e-motion.md` §3.3 e §5 · T2.2.
- **Faz:** `UiBarraCta` e `WhatsappFloat` **server**; `CtaObservador` e `MotionInit` **client** sem saída visual, montados uma vez no layout. `CtaObservador` observa `[data-cta="principal"]` exceto `barra`, `header`, `header-painel`, usa a regra da T2.2, mede a barra com `ResizeObserver` em `--barra-cta-altura` e escreve `data-estado`/`inert` no DOM. `MotionInit` cria o observer de `reveal`/`stagger-item` (`threshold` 0,15; `rootMargin` inferior −10%; o que já está na tela nasce `visto` sem animar). **O primeiro que iniciar marca `data-js-pronto`**; ambos têm `catch` que põe `data-js-falhou` e remove `data-motion`. **`MotionInit` põe `data-motion="on"` só depois de marcar `visto` o que já intersecta a viewport** e só sem reduced-motion. `CtaObservador` cancela o `float-pulso` se `pin-palco` estiver na tela (um destaque por tela).
- **Aceite:** campo 9 da ficha `global-acesso-fixo`.

### T2.8 Conferência da fatia vertical (portão) — ✅ aprovada pelo usuário (ajustes feitos: menu sem JS e desvio do título do hero na ficha)
- Montar `src/app/page.tsx` = `Header` + `Hero` + (provisório) restante vazio. Conferir em 360, 390, 768 e 1280: sem rolagem lateral, CTA do hero sem rolar em 360×640, barra e flutuante corretos, painel do menu, foco, reduced-motion, JS bloqueado (watchdog).
- Rodar `build`, `lint`, `test`, `check:nomes`. Atualizar o estado e **pedir ao usuário que aprove a fatia** antes da T3.

---

## T3: Seções (uma por tarefa, na ordem da página)
Para cada uma: ler **só** a ficha; criar `src/secoes/{slug}/` (componente principal em PascalCase, subcomponentes bloco+elemento); adicionar a seção a `page.tsx`; cumprir o campo 9 + DoD comum (C1–C9); tipar o que vem do `content.json` quando o tipo inferido não bastar (ex.: `horarios: []` infere `never[]`).

| Tarefa | Seção | Ficha | Cuidados |
|---|---|---|---|
| **T3.1** | S02 `prova-rapida` | `fichas/prova-rapida.md` | `aria-label` (sem título visível); sem contador |
| **T3.2** | S03 `problema-solucao` **base** (lista de pares, sem palco) | `fichas/problema-solucao.md` (campos 1–8, e do 9 só "Base") | funciona sem JS; 5º par `col-span-2` no tablet; deixar `data-anim`/`data-estado` previstos para a T4.1 |
| **T3.3** | S06 `servicos` | `fichas/servicos.md` | link por serviço com `{servico}` e `encodeURIComponent`; mídia só se `src ≠ pendente`; `card-realce` |
| **T3.4** | S07 `como-funciona` | `fichas/como-funciona.md` | timeline estática; `cabecalho` sticky ≥1024 |
| **T3.5** | S12 `preco-pop` | `fichas/preco-pop.md` | só os 4 itens do conteúdo; sem comparação; tablet com card centralizado |
| **T3.6** | S05 `para-quem` | `fichas/para-quem.md` | Check em `text-secondary` sobre `bg`, nunca sobre teal |
| **T3.7** | S10 `depoimentos` | `fichas/depoimentos.md` | selo provisório por `provisorio`; nada inventado |
| **T3.8** | S17 `unidades` + `UnidadesMapa` | `fichas/unidades.md` | campo vazio não renderiza; nenhum iframe no load; sem `card-cta` |
| **T3.9** | S16 `faq` + `UiAccordion` | `fichas/faq.md` | `<details>` sem JS; sem JSON-LD de FAQ |
| **T3.10** | S19 `cta-final` | `fichas/cta-final.md` | sem informação nova nem segundo botão |
| **T3.11** | S23 `footer` + `FooterColuna` | `fichas/footer.md` | `registro` só quando preenchido; `pb` para a barra; sem `data-anim` |

**Status: T3.1–T3.11 ✅ e aprovadas pelo usuário (decisão: NÃO antecipar a T5.1; os links `/privacidade` e `/termos` ficam como estão até a T5.1).** Ao fim da T3.11 a página está completa **sem o palco**. Conferir a varredura completa 390×844 e 1280×800 (a barra nunca com dois CTAs iguais na tela).

---

## T4: Momento N2 e conferência de motion

### T4.1 Palco "Um problema, uma solução" (`ProblemaSolucaoPalco`) — ✅ concluída
- **Lê:** `docs/sections/fichas/problema-solucao.md` (campo 7 e 9 "Palco") · `docs/jornada-e-motion.md` §4 (e M8).
- **Faz:** só ≥1024 com `data-js` e sem reduced-motion: `sticky` nativo, 1º `par` já `ativa` no HTML, sem `reveal`/`stagger-item` nos `par` (um destaque por tela), observer com faixa central (`rootMargin −45% 0 −45% 0`), `data-estado="ativa|inativa"`, `palco-painel` com `opacity`/`translateY`, `queixa-marca` com `scaleY`; palco `aria-hidden` + `inert`, sem link; `solucao` `sr-only` que aparece com `focus-within`; falha segura que remove `data-motion`.
- **Aceite:** campo 9 "Palco" inteiro, incluindo **CLS = 0** (com e sem JS) e o teste de erro forçado.

### T4.2 Conferência final de motion — ✅ concluída (`scripts/check-motion.mjs` + `src/motion.test.ts`; 4,63 KB gzip)
- Passar por **todas** as receitas de `jornada-e-motion.md` §3.4 nas 3 versões (≥768, <768, reduced-motion) e **JS bloqueado**; `grep` por `transition`/`animation` que toquem propriedade fora de `transform`/`opacity`; nenhum listener de `scroll`/`wheel`; peso do código próprio de motion < 5 KB gzip; INP < 200 ms.
- **Se o usuário trouxer `09-MOTION`/`08-JORNADA-UX`:** repetir a conferência de `docs/conferencia-jornada-motion.md` §3 antes de fechar esta tarefa.

### T4.3 (condicional) Palco com scrub — ⏭ NÃO feita (pergunta 3 = "não"; o palco usa `sticky` nativo)
- Só se o usuário responder **sim** à pergunta 3 do estado. Então entra GSAP + ScrollTrigger **só** no palco, ≥1024, carregado sob demanda, sem pin no mobile; revisar M1 e o orçamento de peso. Caso contrário, **não fazer**.

---

## T5: Sistema e SEO — ✅ concluída; **PARE e aguarde a revisão do usuário antes da T6**

### T5.1 `/privacidade` e `/termos` (rascunho técnico) — ✅ concluída (11 bloqueantes no `LAUNCH=1`)
- **Faz:** duas rotas com texto em `content.json` (`paginas.privacidade`, `paginas.termos`; sem texto fixo em componente), baseado só em fatos do site: não há formulário nem cadastro; o contato é o WhatsApp e o Instagram; nenhum cookie não essencial na v1. Faixa visível "Rascunho técnico: revisão jurídica pendente" e `noindex` até a revisão. Marcar `validar: true` + `provisorio: true` e **incluir regra bloqueante em `scripts/check-pendencias.mjs`** (`^paginas\.(privacidade|termos)`) com teste.
- **Aceite:** links do footer não dão 404; `build:launch` falha enquanto o rascunho estiver marcado; **não** afirmar conformidade legal em lugar nenhum.

### T5.2 (condicional) Banner de cookies — ⏭ não feita (sem analytics na v1)
- Só se a decisão de analytics/pixel mudar. Usa `microcopy.cookies`; analytics só carrega com consentimento; `data-cta` sozinho não exige banner. Sem decisão de analytics, **não fazer**.

### T5.3 Página 404 — ✅ concluída
- `src/app/not-found.tsx` com `microcopy.pagina_404` (título, texto, botão "Voltar ao início" como `UiBotao--secundario`). O WhatsApp já está acessível pela barra/flutuante do layout; **não** criar segundo CTA principal.

### T5.4 SEO e metadados — ✅ concluída (sem `SITE_URL`: sem URL absoluta)
- `seo.home` (título, descrição) já existe; adicionar `robots`, `sitemap` e `metadataBase` lendo `SITE_URL` (domínio ainda vazio: sem ele, não gerar URL absoluta falsa). Open Graph **sem imagem** enquanto `og_imagem.src = "pendente"`. JSON-LD `LocalBusiness` só com os campos de `seo.home.schema.campos` (sem endereço, telefone ou horário até confirmar). Nenhum `FAQPage`.

### T5.5 `/teste-tokens` fora da produção — ✅ concluída (404 em produção, ok em `next dev`)
- A rota responde `notFound()` quando `NODE_ENV === "production"` (continua em `next dev`). Os testes de `dados.test.ts` seguem passando.

---

## T6: Pré-lançamento (Fase 12)
- **T6.1 Dados da clínica:** resolver as pendências do PRD §8 no `content.json` (remover `validar`/`provisorio` **só** com dado confirmado); `npm run build:launch` passa com 0 bloqueante.
- **T6.2 Performance:** Lighthouse mobile na home com LCP < 2,5 s, INP < 200 ms, CLS < 0,1; com foto real do hero (`priority`).
- **T6.3 Acessibilidade:** passada de teclado completa, foco visível, zoom 200%, reduced-motion, leitor de tela nos fluxos barra/menu/FAQ/palco, contraste dos pares usados; revisar a UI com a skill `web-design-guidelines`.
- **T6.4 Revisões humanas:** responsável técnica (afirmações de saúde), CREFITO (publicidade), jurídico (privacidade/termos, LGPD). O site não afirma conformidade.
- **T6.5 Publicação e analytics:** domínio e DNS, `SITE_URL`, redirecionamentos, decisão final de analytics (e banner se houver); **se houver analytics, implementar o mapa de eventos** de `jornada-e-motion.md` §1b (`cta_principal_click`, `whatsapp_click`, `servico_click`, `faq_open`, `scroll_depth` + extras) lendo só `data-*` e **só após consentimento**; SVG/logo branco/favicon/OG definitivos.
- **T6.6 Checklist final:** DoD global do `CLAUDE.md`, `check:nomes`, `check:pendencias`, testes, varredura de links, CTA único em todo o site.
