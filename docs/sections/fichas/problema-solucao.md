<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S03 Um problema, uma solução

## 1. Identificação
- slug: `problema_solucao` · Ordem: 3 · Nível: completo · Âncora: `#problema-solucao`

## 2. Função na narrativa
- O visitante se reconhece na queixa e vê o cuidado certo. Momento 'wow' do site.
- Papel na jornada: interesse
- Relação com o CTA principal: leva à escolha do serviço e ao CTA do texto de apoio

## 3. Conteúdo
- Chave: `secoes.problema_solucao`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: —
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Adaptação do S03 com pares queixa → serviço. N2 no desktop, N1 no mobile.

## 4. Layout (Fase 6)
- **Princípio:** a **base é a lista de pares** (funciona sem JS, no mobile e com `prefers-reduced-motion`). O **palco fixo** do desktop é um aprimoramento por cima dela (Fase 9 define o comportamento).
- **Fundo:** `bg-bg`.
- **Estrutura:** `cabecalho` { `titulo` · `subtitulo` } → `lista` (`ul`) → 5 × `par` { `queixa` · `seta` · `solucao` (link para `ancora`, com `icone`) } → `apoio` (texto) → `cta`. O `palco` (desktop) é o contêiner visual do aprimoramento; sem JS não é renderizado.
- **Mobile (360–430):** `par` empilhados (`gap-4`), cada um `UiCard` (`p-5`): `queixa` em `text-h3` (frase do usuário); `seta` (ícone ArrowDown, `text-subtle`, `aria-hidden`); `solucao` = ícone em contêiner `bg-bg-teal` + nome em `text-body font-strong text-foreground` + seta de link; **o nome da solução é o link** para `#servicos` (alvo `min-h-touch`). `apoio` `text-body-lg text-muted max-w-measure`; `cta` largura total. Sem pin, sem gestos.
- **Tablet (≥768), estático:** `lista` em 2 colunas (`grid-cols-2 gap-5`); o 5º par ("Dor que não passa → Avaliação + Fisioterapia") ocupa as 2 colunas (`col-span-2`), por ser o caso "não sei qual escolher". `apoio` + `cta` centralizados abaixo.
- **Desktop (≥1024), aprimorado (N2):** grid 12 colunas: `lista` de queixas nas colunas 1–6 (`queixa` em `text-h2`, **todas em `text-foreground`**; a ativa é marcada por `queixa-marca` e deslocamento, ver campo 7; nunca opacidade que reduza o contraste); `palco` nas colunas 8–12, `sticky` abaixo do header (`top` = `h-header` + `space-5`), `aspect-square rounded-lg bg-surface shadow-2 p-6`, mostrando a solução da queixa ativa (ícone grande em `bg-bg-teal`, nome em `text-h3`; **sem link**: o palco é espelho visual e o link fica na `solucao` da lista, ver campo 7). A altura da seção cobre o percurso das 5 queixas. Sem JS ou com redução de movimento, o desktop usa a grade estática do tablet.
- **Tokens:** `text-h2/h3`, `bg-bg-teal` (ícone, texto em tinta), `shadow-2`, `rounded-lg`, `border-border`.
- **Não fazer:** sequestrar a rolagem no mobile; esconder queixas atrás de hover; mídia inventada (se vier vídeo curto da queixa, entra dentro do `palco`, sem mudar a estrutura).

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` (h2 + destaque) · `UiCard` · `UiIcone` (container `bg-bg-teal`) · `UiLink` (solução) · `UiCtaPrincipal` (local `problema-solucao`) · `ProblemaSolucaoPar` · **`ProblemaSolucaoPalco`** (client, só ≥1024 e sem reduced-motion; especificado na Fase 9).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** fazer a pessoa se reconhecer em uma queixa e ver que existe o cuidado certo (o momento "wow").
- **Vê:** título, 5 pares queixa → solução (com ícone), texto de apoio e o CTA; ≥1024 também o palco com a solução da queixa em foco.
- **Faz:** lê as queixas até achar a sua; toca no nome da solução (→ `#servicos`) ou segue até o CTA do fim.
- **Reage:** link da solução com `:active` imediato e rolagem à âncora; ≥1024 o palco troca conforme a queixa cruza o centro da tela; `Tab`/foco num par também o ativa e mostra a solução; CTA com `:active`.
- **Sente/entende:** reconhecimento e alívio ("então existe um cuidado para isso").
- **Atrito → mitigação:** "não sei o que tenho / qual serviço" → 5º par ("dor que não passa → Avaliação + Fisioterapia") e o texto de apoio · palco inacessível por teclado → a `solucao` aparece ao receber foco · lista longa no mobile → pares curtos, sem pin.
- **Saída:** serviço (S06) pelo link, ou WhatsApp pelo CTA do fim. Sem beco.
- **Evento de analytics:** `cta_principal_click` (`local` = `problema-solucao`) + `whatsapp_click`; `solucao_click` (extra, `data-item` do par); `scroll_depth`.
- **Mobile:** pares empilhados, sem palco; o CTA do fim esconde a barra (campo 8).

## 7. Motion (Fase 9) — o único momento N2
- **Nível:** **N2** só em ≥1024 com `data-js` (script inline) e sem reduced-motion; **N1** no resto (mobile: teto N2 simplificado = lista com `reveal`, sem palco; N3 não existe). Especificação completa em `docs/jornada-e-motion.md` §4. **Biblioteca:** nenhuma: `position: sticky` nativo + um `IntersectionObserver` (M1). **Sem pin com ScrollTrigger, sem scroll-jacking, sem scrub.**
- **Alvos `[data-anim]`:** `pin-palco` (o palco `sticky`) · `palco-painel` (5, um por queixa) · `queixa` (os 5 `par`, com `data-estado="ativa"|"inativa"`) · `queixa-marca` · `reveal`/`stagger-item` na base **só fora do modo palco**: no modo palco os `par` **não** têm `reveal`/`stagger-item` (um destaque por tela, `jornada-e-motion.md` §3.6); o `cabecalho` pode ter `reveal` (segundo plano).
- **Desktop (≥1024, sem reduced-motion):** a `lista` (cols 1–6) tem etapas de `py-9`; o palco (cols 8–12) fica `sticky` abaixo do header. A faixa central da viewport (`rootMargin -45% 0 -45% 0`) define o `par` ativo; o `palco-painel` correspondente entra (`opacity 0→1` + `translateY(reveal-distance→0)`, `dur-slow`, `ease-out`) e o anterior sai (`opacity 1→0`, `dur-base`, `ease-in`), sobrepostos. A queixa ativa recebe `queixa-marca` (`scaleY 0→1`, `dur-base`) e `translateX(space-3)`. Todas as queixas ficam em `text-foreground` (contraste cheio).
- **Tablet (768–1023):** grade de 2 colunas estática, pares com `stagger-item` (60ms); o 5º par ocupa as 2 colunas. **Mobile:** pares empilhados, cada um com `reveal` (`dur-base`), sem stagger, sem pin, sem gestos. **Reduced-motion (qualquer largura):** grade estática, tudo visível, sem palco.
- **Layout do palco decidido antes da primeira pintura** por `html[data-js]` + media query `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` + `:not([data-js-falhou])` (M8), **não** por `data-motion` (que só existe depois do JS de animação pronto): nunca trocar a grade pelo palco depois de hidratar (CLS). O palco não esconde conteúdo: a lista fica inteira visível e o 1º `par` já vem `ativa` no HTML. `ProblemaSolucaoPalco` (client) só liga a observação e a troca de `data-estado`.
- **Acessibilidade:** o palco é espelho visual (`aria-hidden`, `inert`, sem link). A `solucao` de cada par continua no DOM; no modo palco fica `sr-only` e aparece ao receber foco; `focusin` num par o torna ativo. Palco e lista nunca anunciam duas vezes.
- **Falha segura:** erro em `ProblemaSolucaoPalco`, ou o watchdog de 4 s, põe `data-js-falhou` → o CSS volta à grade estática com as 5 queixas e as 5 soluções.
- **Ficha de layout ajustada:** a queixa inativa **não** usa mais `text-subtle`; a ativa é marcada por `queixa-marca` e deslocamento (M5: não se anima cor).
- **Não fazer:** esconder queixa por hover; prender a rolagem; animar a seção inteira; mídia inventada no palco.

- **Implementação (T4.1, desvios mínimos e reversíveis):** (1) o modo palco é uma variante do Tailwind, `palco:` (`tailwind.config.ts`; ≥1024 + sem reduced-motion + `html[data-js]:not([data-js-falhou])`, uma regra só), então o layout é decidido por CSS antes da 1ª pintura; (2) `data-anim="queixa"` e `data-estado` ficam **na `queixa`** (que contém a `queixa-marca`), não no `par`; o `par` guarda `data-item` e o `stagger-item` da base, que o `ProblemaSolucaoPalco` remove no modo palco; (3) a `solucao` no modo palco fica **absoluta, `opacity-0` e `pointer-events-none`** no `padding` inferior do par (não `sr-only`): continua lida e focável, aparece ao receber foco **sem deslocar o layout** (com `sr-only`→estática a medição deu CLS 0,05); (4) o 5º par volta a `col-span-1` no modo palco (senão a lista cria coluna implícita e os pares se sobrepõem).
- **Desvios ACEITOS pelo usuário (16/11/2026, revisão da T4):** os desvios (2), (3) e (4) acima e o ajuste de remoção do `stagger-item` no modo palco estão **aprovados**. **Condição:** a solução do par só pode ficar escondida **visualmente** (`opacity-0` + posição absoluta), **nunca** com `display:none`, `visibility:hidden`, `hidden`, `aria-hidden` ou `inert`, para o leitor de tela seguir lendo. Coberta por teste em `src/secoes/secoes.test.tsx` ("a solução da lista fica invisível e fora do fluxo…": classes, atributos e CSS).

## 8. Mobile (Fase 9)
- `solucao` (link) com alvo `min-h-touch`, largura total do card. `seta` decorativa (`aria-hidden`). Sem pin, sem swipe, sem gesto horizontal.
- O CTA do fim da seção esconde a barra enquanto visível (margem descontando a barra).
- Em 360px a `queixa` em `text-h3` pode ocupar 2–3 linhas; o card cresce, nada é cortado.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefas: T3.2 (base: lista, sem palco) e T4.1 (palco N2) (`docs/tasks.md`)
**Base (T3.2)**
- [auto] **Sem JS** (HTML renderizado no servidor): 5 `par`, cada um com `queixa`, `solucao` (link para `ancora`) e `icone`; `apoio` e 1 CTA `problema-solucao`. Os textos são os de `secoes.problema_solucao`.
- [manual 360–430] `par` empilhados em `UiCard`; o link da solução tem alvo ≥ 48px; nada é cortado (a `queixa` pode ocupar 3 linhas).
- [manual 768–1023] 2 colunas; o 5º `par` ocupa as 2 (`col-span-2`). Em reduced-motion qualquer largura usa essa grade estática.
- [manual] O CTA do fim esconde a `UiBarraCta` enquanto estiver na tela.
- [manual] Motion: `reveal` por `par` no mobile; `stagger-item` no tablet; nada no reduced-motion.
**Palco (T4.1)**
- [manual 1280] Com `data-js` (palco ativo): `palco` `sticky` abaixo do header; o 1º `par` já nasce `ativa` **no HTML** (palco nunca vazio, nem antes da hidratação); a troca acontece quando um `par` cruza a faixa central (`rootMargin -45% 0 -45% 0`); só um `par` tem `data-estado="ativa"`.
- [manual] **Sem CLS:** o layout do palco é decidido por `html[data-js]` + media query antes da 1ª pintura; comparar a página carregada com e sem JS: o deslocamento é 0. **Um destaque por tela:** no modo palco nenhum `par` tem `data-anim="reveal"`/`"stagger-item"` (`grep`), e o `float-pulso` não roda enquanto o palco está na tela.
- [auto] Todas as `queixa` em `text-foreground` (nenhum `text-subtle`); a ativa ganha `queixa-marca` (`scaleY`) e `translateX`; nenhuma animação de cor.
- [manual] Acessibilidade: `palco` com `aria-hidden` + `inert`, sem link; cada solução é lida **uma vez** por leitor de tela; `Tab` num `par` mostra a `solucao` (`focus-within`) e `focusin` o torna ativo.
- [manual] Falha segura: forçar um erro em `ProblemaSolucaoPalco` (ou bloquear o JS por mais de 4 s) põe `data-js-falhou` e a grade estática mostra as 5 queixas e as 5 soluções.
- [auto] Sem scrub, sem listener de `scroll`/`wheel`, sem `preventDefault`, sem biblioteca; o pin é `position: sticky` (`grep`).
- [manual 390 e 1023] Nenhum palco, nenhum pin, nenhum gesto.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** CTA com `data-cta-local="problema-solucao"`; cada `par` com `data-item` (para `solucao_click`). Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T3.2 (base) ✅ e T4.1 (palco N2) ✅ · conferido em 1280/390/1023, reduced-motion, sem JS, JS bloqueado e erro forçado (ver `docs/00-ESTADO-DO-PROJETO.md` §12)

- **Abas numeradas (16/11/2026, mapa do usuário):** cada queixa ganha o numeral `01`–`05` (`numero`, `aria-hidden`, `text-primary`) acima do texto, como as abas "01–04" do bloco de features da Superpower. A Superpower tem ali um mockup de celular e auto-avanço: **não** foram feitos (sem asset de produto; autoplay é vetado; o painel do palco faz esse papel).


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
**Substitui o palco sticky pelo stage de features:** faixa de largura total com fundo de marca (`bg-grad-soft`), **pílula de passos 01–05** (botões; o ativo mostra o rótulo), a **cópia do passo** (título = queixa; link para a âncora = solução) com crossfade por `opacity`, e o **mock** à direita (ícone + nome da solução). **Sem autoplay** (regra do projeto). Sem JS: pílula e mock somem e as 5 cópias ficam empilhadas. **Condição do usuário mantida:** a cópia inativa só some por `opacity: 0` (nunca `display:none`/`visibility:hidden`/`aria-hidden`/`inert`); os links inativos saem do Tab (`tabIndex -1`). Removidos: `ProblemaSolucaoPalco`, `ProblemaSolucaoPar`, receitas `pin-palco`, `palco-painel`, `queixa`, `queixa-marca` e a variante `palco:`; o único momento N2 deixa de existir (a v1 fica só com N1). Não há mockup de celular nem foto de fundo (mídia pendente). **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

## Revisão 2: slide "How it works / painel lateral" (16/11/2026, pedido do usuário) — substitui a revisão anterior do stage
O usuário enviou o HTML do slide. Implementado em `ProblemaSolucaoStage` (client) + `src/app/stage.css`: **autoplay de 6 s** (anel SVG que enche, volta ao 1º depois do 5º; clique num passo vai até ele e reinicia o anel), **pílula** 01–05 (o ativo expande o rótulo = a queixa), **texto em crossfade** (título = queixa; texto = descrição do serviço; link para a âncora), **mídia de fundo em crossfade** (5 camadas; gradientes de marca enquanto `imagem.src` = `pendente`, foto real entra com `next/image fill`; véu claro `bg-veu-hero`), **perguntas de FAQ "vidro"** no rodapé do painel que abrem **modal** (`<dialog>` nativo: foco preso, Esc, clique no fundo e X fecham; o foco volta ao botão).
- **Conteúdo:** nada duplicado. Cada item de `problema_solucao.itens` ganhou `servico` (nome em `secoes.servicos`, de onde vem a descrição), `perguntas` (textos de `secoes.faq.perguntas`, de onde vêm pergunta e resposta) e `imagem` (pendente). Mapa: Dor nas costas→Liberação Miofascial→"A liberação miofascial dói?" · Barriga e pernas inchadas→Drenagem Linfática→"Posso fazer drenagem se estou no pós-operatório?" · Cansaço e estresse→Massagem Relaxante→"Posso voltar todo mês?" · Gordura localizada→Massagem Modeladora→"Qualquer serviço é mesmo R$ 49,99?" · Dor que não passa→Fisioterapia Ortopédica→"A avaliação é cobrada à parte?". As marcações `validar` ficam nos itens de origem. Rótulos novos em `microcopy.acessibilidade` (`pausar_passos`, `retomar_passos`, `fechar_pergunta`).
- **EXCEÇÃO documentada (como o header):** autoplay por `requestAnimationFrame`, animação de `max-width`/`padding`/`stroke-dashoffset` e `backdrop-filter` nos itens de FAQ, tudo em `stage.css`; coberto por testes em `motion.test.ts`. O CLAUDE.md vetava autoplay: foi liberado só para este slide.
- **Acessibilidade (acréscimos meus, o slide não tinha):** **sem autoplay em reduced-motion**; pausa automática com mouse ou foco no painel; **botão de pausa/retomar** (WCAG 2.2.2); a cópia inativa só some por `opacity: 0` — **nunca** `display:none`/`visibility:hidden` (o slide usava `visibility:hidden`; mantive a condição que você pôs antes) — e seus botões/links saem do Tab (`tabIndex -1`) e do clique (`pointer-events: none`).
- **Desvios do slide:** textos escuros sobre gradiente claro (o slide usa branco sobre foto escura); sem o degradê escuro lateral; o painel é fluxo normal (não absoluto) com a FAQ no rodapé da altura da cópia mais alta; `dur-base`/`dur-slower` dos tokens no lugar de .45 s/.7 s; modal sem imagem no topo e sem desfoque do fundo. Sem JS: pílula some e as 5 cópias ficam empilhadas (as perguntas viram botões sem efeito: só abrem o modal com JS; sem JS o FAQ completo continua na seção FAQ).

## Vídeo no passo 1 (17/11/2026)
O usuário colocou `public/assets/dor_nas_costas.mp4` (1280×720, 8 s, 2,6 MB, **com faixa de áudio**). Preparado para a web com o ffmpeg (original mantido): `dor_nas_costas-site.mp4` (H.264, **sem áudio**, CRF 27, `faststart`, 371 KB) e `dor_nas_costas-poster.webp` (16 KB, quadro de 0,4 s). Conteúdo: `problema_solucao.itens[0].video` = `{ src, poster }` (opcional; só o passo 1 tem). No stage, a camada de mídia do passo 1 é um `<video>` (`muted`, `loop`, `playsInline`, `preload="metadata"`, pôster, sem `autoplay` nem `controls`); as demais seguem com os gradientes de marca.
- **Regras de vídeo da ficha do hero, aplicadas:** sem som; toca **só** quando o passo 1 está ativo **e** o stage está na tela (um `IntersectionObserver`, 25%) **e** o usuário não pausou **e** não há reduced-motion (aí só o pôster); recomeça do início a cada visita ao passo; pausa ao sair da tela. O botão de pausa agora também pausa o vídeo (rótulos de `microcopy.acessibilidade` atualizados). Sem JS: só o pôster.
- **Layout:** a ≥768 o vídeo é o fundo do stage (a pessoa cai à direita, o texto à esquerda sobre o `veu`); **<768 a mídia é uma faixa 16:9 no topo** (`aspect-wide`; `aspect-video` não existe no tema) e o texto vem embaixo, sem texto sobre o vídeo; o véu só ≥768.
- **Vídeo × passo:** o passo dura 6 s e o vídeo 8 s: o clipe é cortado no fim do passo (recomeça quando o passo volta). Se preferir o vídeo inteiro, dá para segurar o passo 1 por 8 s.
- **Verificado no navegador:** não toca fora da tela; toca no passo 1 (mudo, loop); pausa nos outros passos e volta do início; o botão de pausa congela; reduced-motion não toca; sem JS mostra o pôster; mobile sem rolagem lateral.

## Chat de vidro sobre o vídeo "Dor nas costas" (17/11/2026, prompt do usuário)
Implementado em `ProblemaSolucaoChat` (client) + `src/app/chat.css`, montado pelo stage como **irmão do `<video>`** dentro da camada de mídia do passo 1 (`relative` + `overflow-hidden`; a camada só tem `opacity` no crossfade, nenhum `transform`/`filter` entre a bolha e o vídeo). Seguidos do prompt: contêiner `absolute` `right 2rem · bottom 5rem · width 22rem · max-width 64% · z-index 3 · pointer-events none · flex column · gap .625rem`; bolhas escuras `rgba(20,18,16,.42)` + borda `1px rgba(255,255,255,.16)` + `blur(20px) saturate(1.3)` (com e sem `-webkit-`); bolhas do usuário `#fff`, **sem blur**, sombra `0 10px 30px -10px rgba(0,0,0,.35)`; vídeo com `brightness(.86)`; mensagens ocultas = **`display:none`**, `data-estado="visivel"` liga o display e dispara `pop .55s cubic-bezier(.22,1,.36,1) both` (opacity 0 + translateY(.5rem) + blur(6px) → sem transform/filter); linha do tempo em JS (`T` = 0,5 · 1,3 · 2,7 · palavra 30 ms · 4,2 · ciclo 8,0 s, loop, só `setTimeout`); palavras em `<span>` com opacity 0→1 em .25 s; spinner SVG de 20 linhas a cada 18° (r 4,8→11, stroke 1,5, round, `#9CA3AF`, 1,1 s linear infinito). Os valores literais (rgba, `#fff`, curva, duração) ficam nas variáveis do `:root` de `chat.css` (**exceção documentada**: o resto do site é só tokens).
- **O arquivo `chat-vidro-sobre-video.html` NÃO estava no projeto nem nas pastas do usuário.** Implementado só com as regras do prompt. **Estimados (aguardam o arquivo para calibrar):** padding, raio e fonte das bolhas (usei tokens: `px-4 py-3`, `rounded-md`, `text-body`/`text-small`), formato do avatar (círculo `2rem` com a inicial do site e anel branco de 2px; o prompt só dá o tamanho), o espaçamento entre avatar e bolha e a ordem/quem fala em cada mensagem (msg1 usuário · msg2 pílula "pensando" · msg3 assistente · msg4 usuário).
- **Textos (conteúdo `itens[0].chat`, sem promessa nova):** usuário "Estou com dor nas costas. O que você indica?" · "Pensando" · assistente "Vem que a gente avalia. A Liberação Miofascial destrava, alivia a dor e devolve seu movimento." (só copy já aprovada) · usuário "Quero agendar meu horário."
- **Quando roda:** como o vídeo — passo 1 ativo + stage na tela + sem pausa + sem reduced-motion; em **reduced-motion mostra o estado final, parado** (msgs 1, 3 e 4); sem JS não aparece (decorativo, `aria-hidden`). Abaixo de 1024px o chat é ocultado (`display:none` no contêiner: o texto fica por cima da mídia; o prompt não define o mobile).
- **Ajuste meu:** o passo 1 agora dura **8 s** (`DURACAO_COM_VIDEO_MS`), igual ao ciclo do chat e ao clipe (com 6 s a troca cortava a mensagem 4 e o vídeo).
- **Verificado no navegador (1280):** mensagens aparecem a ~0,5/1,3/2,7/4,2 s; msg2 some quando a msg3 entra e as 16 palavras ligam; estilos computados idênticos ao prompt; chat é irmão do vídeo; some ao trocar de passo e recomeça ao voltar; pausa zera; reduced-motion mostra o final; mobile sem chat.

## Vidro fosco no lugar do véu branco (17/11/2026, pedido do usuário)
O `veu` (degradê `bg-veu-hero`) que clareava o lado do texto foi **removido** do stage: o usuário não quer overlay branco, só um efeito desfocado de glassmorphism. Agora `problema-solucao__veu` (≥768, `data-anim="stage-vidro"`) é uma camada **atrás do texto** (`left-0`, 4/5 da largura no tablet e 3/5 a partir de 1024) com `backdrop-filter: blur(28px) saturate(1.1)` (variável `--stage-vidro-desfoque`) e tinta quase transparente (`--stage-vidro-tinta` = `--color-surface` a 8%), e uma máscara `linear-gradient(90deg, black 0 → 65%, transparent 100%)` que dissolve o desfoque para o vídeo nítido à direita. O subtítulo e a descrição do passo passaram de `text-muted` para `text-foreground` (sem o véu o cinza perdia contraste sobre o vídeo). Receita `stage-vidro` em `stage.css` (exceção do stage). **Reconferir o contraste dos textos sobre cada foto/vídeo final** (passos 2–5 ainda são gradientes de marca).

## Aviso "1 Issue" do modo dev (17/11/2026)
Era um **erro de hidratação só do `next dev`**: o `MotionInit` escrevia `style="--stagger-i"` nos itens `stagger-item` antes de o React hidratá-los. Agora o atraso do stagger é **CSS puro** (`:nth-child(2|3|n+4)` em `globals.css`, teto de 3 passos) e o `MotionInit` não toca mais no `style` desses itens. Verificado no servidor dev: 0 erros de console; em produção o stagger segue 0/1/2/3.

## Experimento: imagem no lugar do vídeo, passo 1 (17/11/2026, pedido do usuário)
O vídeo "Dor nas costas" foi **trocado** pela imagem `public/assets/img_dor_costas.jpg` (2752×1536, 2,5 MB, cena noturna em verde-petróleo, homem com a mão nas costas). Preparação: `img_dor_costas-site.webp` (2449×1536, 96 KB), **cortada à direita** para tirar a faixa preta e manter o homem à direita; o `jpg` original foi mantido. Conteúdo: `itens[0].imagem` = `{ src: "assets/img_dor_costas-site.webp", alt, tom: "escuro" }` e o `video` foi **removido** do passo 1 (os arquivos `dor_nas_costas*.mp4/webp` ficam em `public/assets` sem uso; **para voltar ao vídeo basta recolocar `video` no conteúdo**, o código do stage continua suportando). Renderizada por `next/image` (`fill`, `priority`). O chat de vidro continua sobre a imagem (ele não depende do vídeo) e o passo 1 segue durando 8 s (`DURACAO_COM_CHAT_MS`).
- **Tom escuro:** como a imagem é escura, o texto escuro ficaria ilegível. `imagem.tom = "escuro"` faz o stage (`stage-raiz[data-tom]`) redefinir, **só a partir de 768px**, as variáveis de cor do painel (`--color-text`/`--color-text-muted` claros, `--color-surface` e `--color-secondary-soft` translúcidos escuros) e a tinta do vidro: título, subtítulo, descrição, link, pílula e FAQ ficam claros sobre vidro escuro, **sem mudar classe de nenhum componente**. Ao trocar para um passo de mídia clara (`tom` ausente) o texto volta ao escuro. No mobile a mídia é uma faixa separada e o texto fica sobre fundo claro (por isso o tom escuro não vale ali: bug pego no teste em 390px, o texto branco ficava invisível).
- **Verificado no navegador:** `data-tom` troca com o passo (escuro no 1, claro no 2); cores computadas brancas no passo 1; 0 erros no console; mobile 390 sem rolagem lateral e com texto escuro legível.

### Revisão de 17/11/2026 (fotos dos passos 2–4)
Passos 1–4 têm foto real (`imagem.src` webp, `tom: "escuro"`); o passo 5 tem vídeo (`video_dor_n_passa-site.mp4`, mudo, loop, pôster, `tom: "escuro"`). Só o passo 1 tem chat. Os 5 passos têm mídia real.

**Mobile (17/11/2026, referência do usuário):** ordem título → pílula dos passos → título e descrição do passo → perguntas → mídia em cartão arredondado 4:3 por último (substitui a faixa 16:9 no topo). Sem texto sobre a mídia no mobile.

**Chat (18/11/2026):** avatar = foto de perfil do usuário (`chat.avatar`); a pílula "Pensando" virou "Digitando" com 3 pontinhos animados (substitui o spinner). Exceção do chat (`chat.css`) mantida.
