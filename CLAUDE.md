# CLAUDE.md — A.FISIO POP (versão final do handoff, Fase 10)

> Substitui a v0. O planejamento (fases 1–10) está **fechado**: o build segue `docs/tasks.md`, **uma tarefa por vez, na ordem**. T0–T4 (aprovadas) e T5 (T5.1, T5.3–T5.5) já estão feitas; a **T5 aguarda revisão do usuário** antes da T6. A T4.3 (scrub/GSAP) **não** se faz. Não adivinhe layout, jornada ou animação: tudo está na ficha da seção. Faltou dado ou decisão? **Pare e avise.**

## Contexto
- **Negócio:** A.FISIO POP, clínica de Fisioterapia & Estética Popular, desde 2024. Unidades: Shopping Vida Nova (Lauro de Freitas), Shopping da Gente e Cajazeiras X (Salvador), BA.
- **Objetivo único / CTA principal:** agendar pelo WhatsApp. Texto: "Agendar meu horário no WhatsApp". É o **mesmo botão (estilo) e destino em todo o site**; o texto canônico vale no hero, na barra do mobile e no painel do menu, e os demais contextos têm texto próprio (`site.cta_texto_por_local`, decisão do usuário em 18/11/2026).
- **Promessa:** "Cuidar de você não precisa ser caro. Qualquer serviço por R$ 49,99."
- **Público:** mulheres de 25 a 55 anos que chegam do Instagram **pelo celular**. Mobile é o caso principal.
- **Tom de voz:** acolhedor, direto, popular, leve e motivador; "você"; frases curtas.
- **Direção de Arte:** *premium acessível*: editorial claro e arejado, estrutura da Superpower (60%), calma da Odyssée (20%), foto/vídeo real à la Biograph (20%), com a identidade POP (rosa + teal). Sem visual de "promoção" e sem clínica fria.
- **Nível:** completo · **Motion:** N1; exceções documentadas só para o **header** (pílula de vidro), o **stage do S03** (slide do usuário, autoplay de 6 s) e o **carrossel de depoimentos do S10** (slide do usuário, autoplay de 8 s), **sem N2/N3**, **sem biblioteca de motion na v1**.

## Fontes da verdade
| O quê | Onde |
|---|---|
| Estado e próximos passos | `docs/00-ESTADO-DO-PROJETO.md` (seção 12 = estado do build) |
| Ordem de trabalho e aceite | `docs/tasks.md` |
| Escopo, requisitos, pendências de lançamento | `docs/PRD.md` |
| Texto, CTAs, SEO, pendências | `content/content.json` — **nenhum texto fixo em componente** |
| Cores, fontes, espaço, sombra, raio, motion | `styles/design-tokens.css` — **nenhum valor literal** |
| Regras e justificativas dos tokens | `docs/design-system.md` |
| Ficha de cada seção (campos 1–9) | `docs/sections/fichas/{slug}.md` (índice, DoD comum e regras de layout: `docs/sections/fichas-secoes.md`) |
| Componentes (props, variantes, `"use client"`) | `docs/sections/componentes.md` |
| Nomes de classes, `data-*`, arquivos | `docs/convencao-de-nomes.md` — **obrigatória** |
| Jornada, decisões M1–M9, receitas `data-anim`, N2, regra da barra | `docs/jornada-e-motion.md` |
| Conferência com o framework (`08-JORNADA-UX`, `09-MOTION`), mapa de eventos em `jornada-e-motion.md` §1b | `docs/conferencia-jornada-motion.md` |
| Direção de arte, marca, fatos (consultar só se precisar) | `docs/direcao-de-arte.md`, `docs/marca.md`, `docs/dossie.md`, `docs/mapa-do-site.md`, `docs/assets-needed.md` |

Em conflito: `content.json` (texto) > ficha (layout e comportamento) > PRD (intenção).

## Estrutura do repositório
```
/CLAUDE.md
/docs/                (estado, PRD, tasks, design-system, convenção, jornada-e-motion, direção de arte, marca, dossiê, mapa, assets)
/docs/sections/       (fichas-secoes.md = índice · componentes.md · fichas/{slug}.md)
/content/content.json
/styles/design-tokens.css · design-tokens.json
/public/assets/       (logo-afisiopop.png e demais mídias)
/src/app/             (layout, page, globals.css, rotas)
/src/secoes/{slug}/   (um componente por seção)
/src/ui/              (componentes compartilhados, prefixo ui-)
/src/lib/             (conteúdo, CTA, WhatsApp, destaque, cta-visibilidade)
/scripts/             (check-nomes.mjs, check-pendencias.mjs)
```
Pastas `01-planejamento/` … `06-handoff/` e `assets/` na raiz são o pacote original, **só leitura**; vale o que está em `docs/`.

## Ordem de trabalho
1. Ler este arquivo, a **seção 12** de `docs/00-ESTADO-DO-PROJETO.md` e a tarefa em `docs/tasks.md`. Abrir **só** a ficha da seção (`docs/sections/fichas/{slug}.md`) e os arquivos que a tarefa cita. Achar código por nome: `grep -rn "classe-nome" src/`.
2. Executar a tarefa. Depois: `npm run build`, `npm run lint`, `npm test` e `npm run check:nomes` (existe a partir da T2.0). Conferir o **campo 9** da ficha (`[auto]` vira teste; `[manual NNN]` se confere no navegador, em 360, 390, 768 e 1280).
3. Ao concluir qualquer tarefa, atualizar `docs/00-ESTADO-DO-PROJETO.md` (status, decisões, arquivos criados ou alterados, pendências, próximo passo) e o log de sessões. É a única coisa que o planejamento lê para saber onde o projeto está.
4. Ao fim da T2.8 (fatia vertical), da T3.11 (página completa), da T4 (motion) e da T5 (sistema e SEO) **pare e peça aprovação** do usuário antes da etapa seguinte (as três primeiras já aprovadas).

## Regras inegociáveis
- **Mobile-first.** Testar 360–430px primeiro; sem rolagem lateral de 360 a 1440px.
- **Um único CTA principal** (`site.ctas.principal`, `ui-botao--primario`). **Todo `data-cta="principal"` sai de `UiCtaPrincipal`** (único emissor); a `UiBarraCta` o embrulha (`data-cta-local="barra"`). Os outros links de WhatsApp são `data-cta="servico"` (cards, discretos) e `data-cta="flutuante"` (botão ≥768px, ícone, nunca imita o primário). `data-cta-local="unidades-{slug}"` é **reservado** (só se houver número por unidade).
- **Acesso fixo ao WhatsApp:** mobile (<768px) = barra inferior; ≥768px = só o CTA no header (o botão flutuante foi REMOVIDO em 18/11/2026, pedido do usuário; o componente `WhatsappFloat` segue no repositório, sem uso, e o `CtaObservador` tolera a ausência dele); nunca barra e flutuante juntos. A barra esconde quando qualquer outro CTA principal está visível (`intersectionRatio ≥ 0,5`; esconde imediato, mostra após 300 ms; `inert` quando escondida). Quem decide é **um** `CtaObservador`; `UiBarraCta` e `WhatsappFloat` são **server**. Detalhes: `jornada-e-motion.md` §5.
- **Fatos só com fonte.** Itens `validar: true` e `provisorio: true` não são apresentados como verdade definitiva; manter a marcação e **só remover com dado confirmado da clínica**. **Não inventar conteúdo** (nome, foto, estrela, endereço, horário, duração, resultado): faltou dado, usar o texto neutro do `content.json` ou sinalizar. **Campo vazio não renderiza** (registro profissional, endereço, horários, mapa). Mídia `src: "pendente"` não vira imagem inventada.
- **Acessibilidade AA:** contraste só pelos pares verificados em `docs/design-system.md`; foco visível; teclado; `alt`; `lang="pt-BR"`; alvos ≥ 48px (`min-h-touch`). Sobre `bg-teal` o texto é tinta; texto rosa pequeno usa `--color-primary`, nunca o `brand-pink`.
- **Tokens:** só classes do tema (`bg-surface`, `text-muted`, `rounded-lg`, `shadow-2`, `p-5`…). Nenhuma cor ou medida literal (o ESLint barra `bg-[#fff]`, `p-[13px]`; `var(--token)` passa). `design-tokens.css` não se edita; variáveis novas vão em `globals.css`.
- **Motion (decisões M1–M10, `jornada-e-motion.md`; conferido com o `09-MOTION` original):**
  - **Sem Motion, GSAP e Lenis na v1.** N1 = CSS + `IntersectionObserver`s (um por finalidade). N2 = `position: sticky` nativo + observer, **sem pin de biblioteca, sem scrub**. Só T4.3 (condicional, a pedido do usuário) traria GSAP.
  - Só `transform` e `opacity` (filter com moderação; **nunca** `width`, `height`, `top`, `left`, `margin`). Estados viram camada/pseudo-elemento; nunca animar cor, fundo, sombra ou altura. Nenhum listener de `scroll`/`wheel`, nenhum `preventDefault`, nenhum `scroll-snap`, nenhum scroll-jacking.
  - **Toda receita declara nível (N0–N3) e as 3 versões** (desktop/tablet ≥768: `dur-slow`, stagger 60 ms, teto de 3 passos · mobile <768: `dur-base`, sem stagger · reduced-motion: **estado instantâneo, não "sem animação"**: sem parallax, zoom, rotação, pulso, autoplay). Durações só dos tokens: microinteração 100–250 ms, reveal 300–600 ms, transição até ~800 ms; reveals disparam **uma vez**; `will-change` só durante a animação e em poucos elementos. Mobile: teto N2 simplificado; N3 não existe na v1.
  - **Conteúdo nunca fica invisível esperando animação (regra 5).** Sem JS tudo visível, **sem temporizador**. O script inline (só com JS) põe **apenas `data-js`** no `<html>` (layout do palco e estado `pendente` da barra/flutuante) e arma o watchdog de 4 s (M9). **`data-motion="on"` é posto por `MotionInit` quando o JS de animação está pronto**, depois de marcar `visto` o que já está na tela; só então valem os estados iniciais ocultos dos `reveal`. Nada do 1º viewport (h1, subtítulo, CTA, selo, mídia LCP) tem `data-anim` de reveal (M7/M10). Rolagem suave **só** com `(hover: hover) and (pointer: fine)` e sem reduced-motion (desligada no toque).
  - **Um efeito de destaque por tela** (§3.6): só o palco do S03 e o `float-pulso` podem ser destaque, e o pulso é cancelado com o palco na tela; o resto é segundo plano. Hover sempre com equivalente no foco/toque (`botao`, `card-realce`); feedback de toque < 100 ms (`:active` em `dur-instant`). Sem marquee, sem contagem numérica, sem carrossel; header sem `backdrop-blur` **(exceto a pílula de vidro, ver a exceção abaixo)**; nada depende de hover.
  - Animações selecionam **só** `[data-anim]`.
  - **EXCEÇÃO DO CARROSSEL DO S10 (decisão do usuário, 16/11/2026, slide "sp2-testimonials2"):** autoplay de 8 s por `requestAnimationFrame`, loop infinito com cópias e animação de `flex-grow`/`width` da barra de progresso, em `src/app/carrossel.css` (`motion.test.ts` cobre). Continuam valendo: sem autoplay em reduced-motion, pausa por mouse/foco e por botão, sem JS os depoimentos empilhados. ("Sem carrossel" deixa de valer só para esta seção.)
  - **EXCEÇÃO DO STAGE DO S03 (decisão do usuário, 16/11/2026, slide "How it works / painel lateral"):** autoplay de 6 s por `requestAnimationFrame` (sem `setInterval`), animação de `max-width`/`padding`/`stroke-dashoffset` e `backdrop-filter` nos itens de FAQ, em `src/app/stage.css` (`motion.test.ts` cobre). Regras que continuam: **sem autoplay em reduced-motion**, pausa por mouse/foco e por botão, cópia inativa só por `opacity` (nunca `display:none`/`visibility:hidden`).
  - **EXCEÇÃO DO ACCORDION DAS DÚVIDAS (decisão do usuário, 18/11/2026, "a animação está muito seca"):** só o `UiAccordion` pode animar a altura (`block-size`) de `::details-content` ao abrir e fechar, com `interpolate-size`, em `src/app/accordion.css` (progressivo: sem suporte, abre na hora). A resposta entra por `opacity` + `translateY`; reduced-motion instantâneo. Segue valendo: nada de JS, tokens de duração e curva.
  - **EXCEÇÃO DO HEADER (decisão do usuário, 16/11/2026, referência "pílula de vidro"):** só o header pode usar listener de `scroll` (um único, em `HeaderBarra`: passivo, rAF, histerese 60/52), `backdrop-filter` e animar `padding`/`max-width`/`gap`/cor/fundo/filtro. Essas receitas vivem em `src/app/header.css` (fora do `globals.css`, que segue só `transform`/`opacity`, sem blur e sem listener de scroll); `motion.test.ts` cobre a exceção. Ver a revisão no fim de `docs/sections/fichas/header.md`.
- **Performance (alvo, verificado no build):** LCP < 2,5 s · INP < 200 ms · CLS < 0,1. Imagem do hero priorizada, demais `lazy`, dimensões declaradas, nenhum iframe no carregamento, código próprio de motion < 5 KB gzip.
- **Sem segredos no frontend.**
- **Privacidade:** política, termos e banner de cookies são **rascunho técnico** que exige revisão humana/jurídica (LGPD); nunca afirmar conformidade. Pixel/analytics só com consentimento (v1 sem analytics).
- **Saúde e publicidade:** não acrescentar promessas de resultado, "antes e depois" ou comparações de preço que não estejam no `content.json`.
- **Next 16:** o framework tem mudanças de API; consultar `node_modules/next/dist/docs/` antes de usar uma API dele (ver `AGENTS.md`).

## Convenção de nomes (completa em `docs/convencao-de-nomes.md`)
Ao inspecionar qualquer elemento, saber **seção, parte, arquivo e texto**. Nenhum `div` anônimo.
- **Classe-nome BEM em pt-BR, sempre a primeira classe:** `bloco__elemento[--modificador]`, kebab-case, sem acento: `servicos__card-icone`. Bloco = slug da seção (`hero`, `prova-rapida`, `problema-solucao`, `servicos`, `como-funciona`, `preco-pop`, `para-quem`, `depoimentos`, `unidades`, `faq`, `cta-final`, `header`, `footer`). Elemento = **papel**, não aparência. Profundidade máxima `bloco__elemento` (mais fundo: hífen ou componente). **A classe-nome é só etiqueta: nunca se escreve CSS nela**; o estilo vem dos utilitários do tema.
- **Elementos** só os da lista oficial (§5 da convenção); precisou de um novo? **Adicione à lista antes de usar.**
- **Compartilhados:** prefixo `ui-` (`ui-secao`, `ui-container`, `ui-titulo`, `ui-botao`, `ui-link`, `ui-barra-cta`, `ui-selo`, `ui-card`, `ui-icone`, `ui-chip`, `ui-accordion`, `ui-midia`). Globais: `whatsapp-float`, `pagina-404`, `teste-tokens`. O componente compartilhado recebe a classe-nome da seção por `className` (ela vem primeiro); **nunca montar classe-nome por concatenação** (quebra o `grep`).
- **Raiz da seção:** `id`, `data-section`, `data-ficha` (`S06`), `data-conteudo` (`secoes.servicos`) e `aria-labelledby` (exceção: `prova-rapida` usa `aria-label`). `header` e `footer` têm raiz própria.
- **Atributos:** `data-item` (itens repetidos) · `data-cta` + `data-cta-local` (valores e locais fechados na convenção §3) · `data-anim` (catálogo em `jornada-e-motion.md` §3.4) · `data-estado` (`aberto`, `rolado`, `visivel`/`oculta`/`pendente`, `visto`, `ativa`/`inativa`) · `data-js`/`data-motion`/`data-js-pronto`/`data-js-falhou` (**só** no `<html>`).
- **Arquivos:** `src/secoes/{slug}/` com componente em PascalCase (`Servicos.tsx`) e subcomponentes bloco+elemento (`ServicosCard.tsx`); compartilhados em `src/ui/`. **Todo arquivo abre com cabeçalho de localização** (seção, ficha `docs/sections/fichas/{slug}.md`, chave do conteúdo, elementos).
- **Destaque serifado:** `**palavra**` → `<span class="accent-serif">` (única exceção a "sem span anônimo").
- **Proibido:** `div`/`span` estrutural sem classe-nome; `wrapper`, `container` (exceto `ui-container`), `box`, `inner`, `content`, `item` sozinho, `div1`, `section2`; nome de aparência; duas seções com o mesmo bloco; CSS em classe-nome; animar por classe; texto fixo em componente.
- **Verificação:** `npm run check:nomes` (T2.0) precisa passar.

## Decisões do projeto
| Decisão | Valor | Motivo |
|---|---|---|
| Nível de motion | N1, 1 momento N2, sem biblioteca (M1) | Tráfego mobile do Instagram; direção calma |
| 3D no hero | não | Custo alto, ganho baixo para esse público |
| Tema | claro, com faixas escuras (`bg-inverse`: preço e CTA final) | Direção de arte |
| Formulário | não | O CTA é o WhatsApp |
| Analytics | fora da v1 (decidir depois; cliques via `data-cta`) | Só com consentimento; sem banner na v1 |
| `cookie-banner`, `voltar-topo` | fora da v1 (reversível) | Sem analytics; base da tela é da barra/flutuante |
| `/teste-tokens` | fora da produção (T5.5) | Página interna |
| Header | "pílula de vidro": transparente no topo, pílula de vidro ao rolar, menu em gaveta lateral (exceção às regras de motion só para ele) | Pedido do usuário em 16/11/2026, com a página de referência |
| Logo | PNG transparente real; SVG e versão branca pendentes | Cliente |
| Cor primária | `#D6145F` | AA com texto branco e perto do carmim do logo |
| Tablet do hero e do preço | mídia/card centralizado abaixo do texto (lado a lado só ≥1024) | Decidido na Fase 10 (reversível) |

## Skills a usar (se estiverem instaladas)
- **`run`** (subir o app e ver a mudança de verdade) e **`web-design-guidelines`** (revisar acessibilidade e UX da seção pronta, também na T6.3).
- **`code-review`** e **`simplify`** ao fechar cada bloco de tarefas (T2, T3, T4).
- **`frontend-design:frontend-design`** só para acabamento dentro da direção já fechada; **não** muda paleta, tipografia, layout nem motion (mandam os tokens e as fichas).
- **Não usar:** `gsap-skills:*` (sem GSAP na v1; só se a T4.3 for liberada), `remotion-*`, `instagram-copy` e qualquer skill de copy (o texto vem do `content.json`), `n8n-*`.

## Mudanças em relação ao boilerplate
Registrar aqui o que for criado do zero e merecer virar boilerplate: tokens semânticos, helper de CTA/WhatsApp, `check-nomes.mjs`, `check-pendencias.mjs`, regra de visibilidade da barra.

Criado nas tarefas T0/T1.1 (Next 16 + Tailwind 4):
- `tailwind.config.ts` (carregado por `@config` em `src/app/globals.css`): `theme` sem `extend`, só `var(--...)`. Cores: `bg-bg`, `bg-inverse`, `bg-surface`, `text-foreground`, `text-muted`, `text-subtle`, `text-on-inverse`; espaço `p-1…p-10`, `px-pad`, `h-header`, `min-h-touch`; `rounded-icon`, `shadow-1…4`, `shadow-cta`, `text-h2`, `font-title|serif|body`, `font-regular|strong|heading`. ESLint bloqueia valor literal (`bg-[#fff]`, `p-[13px]`) em `className`.
- `globals.css` religa `--font-title/-serif/-body` às variáveis do `next/font` (o `design-tokens.css` não foi editado).
- `npm test` (vitest 3), `npm run check:pendencias`, `npm run build:launch` (falha com pendência bloqueante; equivale a `LAUNCH=1`).
- `/teste-tokens`: página interna de verificação (escala, paleta, contrastes), conferida por `src/app/teste-tokens/dados.test.ts` contra `docs/design-system.md`.

Criado nas tarefas T2.0–T2.7 (fatia vertical):
- `scripts/check-nomes.mjs` (`npm run check:nomes`, também no `build`): lê a lista oficial de elementos da tabela §5 de `docs/convencao-de-nomes.md` e confere regras a–h (nomes, raízes de seção, `data-cta*`, `data-anim`/`data-estado`, `data-js*`, cabeçalho de localização, `UiBotao primario`). Fixtures em `scripts/check-nomes.test.mjs`.
- `src/lib/cta-visibilidade.ts`: máquina **pura** da regra da barra/flutuante (limiar 0,5; esconde imediato; mostra após 300 ms; foco; painel). Testada com timers falsos.
- `src/lib/classes.ts` (`juntar`), `src/lib/midia.ts` (`normalizarSrc`, `LOGO`, `midiaPendente`), `src/lib/eventos.ts` (evento do painel do menu → `CtaObservador`).
- `src/test/render.tsx` + `mock-next-image.tsx` (alias no `vitest.config.ts`): testes de marcação sem JSDOM.
- `src/app/globals.css`: variáveis (`--safe-bottom`, `--barra-cta-altura`, `--scale-*`, `--altura-painel`…) e as receitas `data-anim` já implementadas (reveal/stagger, header-fundo, painel, barra-cta, float, float-pulso, botao, pin-palco mínimo). As demais entram com cada seção.
Criado na T3: `data-anim` aceita lista separada por espaço (`[data-anim~="x"]`); `UiAccordion` (server, `<details>`); `src/lib/slug.ts`; `.section-inverse .accent-serif` em `globals.css` (CSS sem camada vence utilitário do Tailwind: estilos que disputam com `design-tokens.css` vão em `globals.css`, sem `@layer`).
Criado na T4: `scripts/check-motion.mjs` (`npm run check:motion`, também no `build`): mede o gzip do JS próprio de motion (esbuild) e falha acima de 5 KB (hoje 4,63 KB); `src/motion.test.ts` (só transform/opacity, sem listener de scroll, sem biblioteca, 3 versões por receita); variante `palco:` do Tailwind (`tailwind.config.ts`); `ProblemaSolucaoPalco` (único momento N2). **Armadilhas:** (1) `addVariant(nome, [a, b])` gera duas regras (OU); para E use uma string só com o seletor aninhado, e confira o CSS gerado; (2) um elemento que troca de `sr-only` para estático ao receber foco desloca o layout (CLS): prefira absoluto + `opacity-0`; (3) um teste de erro forçado que substitui `IntersectionObserver` derruba também a hidratação do Next, então faça o objeto lançar só para as opções do componente-alvo.
Criado na T5: `src/lib/ancora.ts` (`hrefDaHome`: `#faq` → `/#faq`; header e footer vivem no layout e, nas subpáginas, a âncora crua só rolaria a própria página); `src/lib/site-url.ts` (`urlDoSite`, lê `SITE_URL`; sem domínio **nenhuma URL absoluta** em canonical, sitemap, Open Graph ou JSON-LD); `src/lib/schema.ts` (LocalBusiness só com `seo.home.schema.campos`); blocos globais `pagina-legal` e `pagina-404` na convenção §5; regra bloqueante nova de `check-pendencias` (`paginas.privacidade|termos`). **Armadilhas:** (1) o `check-nomes` lia só `[a-z-]` no nome do bloco (`pagina-404` tem dígitos) e passou a aceitar `[a-z0-9-]`; (2) o canal de escrita de arquivos desfaz sequências de escape unicode e entidades dentro do código: montar o escape do JSON-LD por `String.fromCharCode` e ter teste que confira o resultado; (3) `npx node` instala um Node alfa: nunca usar.
- Header **e** `<main id="conteudo">` ficam em `layout.tsx` (com `UiBarraCta`, `WhatsappFloat`, `CtaObservador`, `MotionInit`); `page.tsx` só tem as seções.

**Armadilha (vale para futuros projetos com tokens em CSS puro + Tailwind em `@layer`):** o `design-tokens.css` é CSS **sem camada** e vence qualquer utilitário do Tailwind (que vive em `@layer utilities`), mesmo com menos especificidade. Exemplo real (T3): `.accent-serif { color: brand-pink }` ganhava de `[&_.accent-serif]:text-on-inverse-primary`, e o destaque sobre faixa escura saía no rosa de marca (`#E92E7A`) em vez de `#FF6AA5`. **Regra:** qualquer regra de cor/estado que dispute com uma regra do `design-tokens.css` (cor sobre fundo escuro, anel de foco em cartão claro dentro de faixa escura…) fica em `globals.css`, **sem `@layer`**, e ganha um **teste** (em `src/ui/acesso-fixo.test.tsx`) que lê o CSS e confere a regra; depois, conferir a cor **computada** no navegador, não só a classe no HTML.

## Definition of Done (global; cada ficha acrescenta o seu campo 9)
- [ ] Conteúdo vem do `content.json` (nenhum texto fixo)
- [ ] Só tokens, sem valores literais
- [ ] Responsivo 360 → 1440px+ sem rolagem lateral
- [ ] AA: contraste dos pares verificados, foco, teclado, `alt`
- [ ] Nomes conforme a convenção (`check:nomes` passa; cabeçalho de localização)
- [ ] CTA único: todo `data-cta="principal"` via `UiCtaPrincipal`
- [ ] Motion nas 3 versões, só `transform`/`opacity`, visível sem JS, nada acima da dobra escondido
- [ ] Itens `validar`/`provisorio` intactos; campo vazio não renderiza
- [ ] Sem regressão de LCP/INP/CLS
- [ ] `npm run build`, `lint`, `test` sem erros; estado atualizado

## Quando estiver em dúvida
Perguntar antes de assumir. Preferir a opção mais simples que atenda à ficha. Se faltar algo do planejamento, **parar e avisar** em vez de decidir layout, jornada ou animação por conta própria.
