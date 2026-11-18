<!-- Ficha por arquivo, gerada na Fase 10 a partir de fichas-secoes.md. Regras comuns e DoD: docs/sections/fichas-secoes.md. Convenção: docs/convencao-de-nomes.md. Motion: docs/jornada-e-motion.md -->

# Ficha — S01 Hero

> **REVISÃO DE 16/11/2026 (pedido do usuário: estrutura de seções como a Superpower, identidade mantida): vale a seção "Revisão: cartão com mídia ao fundo" no FIM deste arquivo.** Onde os campos 4, 5, 8 e 9 falarem de V1 (texto à esquerda e mídia à direita em colunas), `HeroMoldura`, `aspect-hero` ou título `text-h1`/`text-display`, **a revisão substitui**. Texto, CTAs, selo e regras de motion (M7/M10) continuam.

## 1. Identificação
- slug: `hero` · Ordem: 1 · Nível: completo · Âncora: `#inicio`

## 2. Função na narrativa
- Em 5 segundos: é fisioterapia e estética popular, perto de mim, e custa R$ 49,99. Chamar no WhatsApp.
- Papel na jornada: entrada
- Relação com o CTA principal: primeira aparição do CTA principal

## 3. Conteúdo
- Chave: `secoes.hero`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: selo R$ 49,99; mídia do hero (foto/vídeo real pendente)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (texto à esquerda, mídia à direita; no mobile texto primeiro). Destaque serifado em 'caro'.

## 4. Layout (Fase 6)
- **Variação:** V1 (texto à esquerda, mídia à direita). Sem 3D, sem chips duplicados (os indicadores ficam na S02).
- **Fundo:** `bg-bg`. Atrás da mídia, uma `moldura` decorativa (`bg-grad-soft rounded-lg`, deslocada, `aria-hidden`); nunca atrás de texto.
- **Estrutura / ordem de leitura:** `conteudo` { `etiqueta` → `titulo` (h1, com `destaque`) → `subtitulo` → `acoes` { `cta` + `cta-secundario` } → `microcopy` } · `midia` com `selo` sobreposto.
- **Mobile (360–430):** 1 coluna, **texto primeiro** (o CTA tem de aparecer sem rolar, em 360×640 útil): `etiqueta` · `titulo` `text-h1` · `subtitulo` `text-body-lg text-muted` · `acoes` em coluna (`cta` largura total; `cta-secundario` abaixo, `UiBotao--secundario` largura total) · `microcopy` `text-small text-subtle` · `midia` `aspect-hero` (4/5, vertical como o Instagram) com o `selo` no canto superior direito, `p-4` de respiro. `pt-6`, `pb-section`.
- **Tablet (768–1023):** continua em 1 coluna, `conteudo` com `max-w-measure`; `acoes` em linha (`cta` + `cta-secundario`); mídia `aspect-hero` centralizada abaixo do `conteudo`, com `max-w-measure` (decidido na Fase 10; duas colunas só a partir de 1024).
- **Desktop (≥1024):** grid 12 colunas, alinhado ao centro vertical: `conteudo` colunas 1–6, `midia` colunas 7–12 (`aspect-hero`, altura limitada a `max-h` da viewport menos o header). `titulo` até `text-display` (fluido), **mas só a partir de 1536px** (`2xl:text-display`); de 1024 a 1535px fica em `text-h1`. **Desvio aceito pelo usuário (T2.8):** com `text-display` a 1280px o título (88px) ocupava 4 linhas e empurrava o CTA para fora da dobra a 1280×800. `selo` sobrepõe o canto inferior esquerdo da mídia, invadindo ~`space-5` para fora.
- **Selo:** `UiSelo` (`valor` "R$ 49,99" + `rotulo` "Qualquer serviço"), `bg-primary-soft text-foreground` (12,95:1). Item `validar`: segue marcado.
- **Tokens:** `text-h1/display`, `text-body-lg`, `aspect-hero`, `rounded-lg`, `shadow-2` no selo, `bg-grad-soft`.
- **Não fazer:** vídeo com som; texto sobre a foto (se vier, só com véu e reconferir contraste, Fase 12); prometer resultado.

## 5. Componentes (Fase 7)
`UiSecao` · `UiContainer` · `UiTitulo` (h1 + destaque) · `UiChip` (etiqueta) · `UiCtaPrincipal` (local `hero`; entra no observador (`CtaObservador`) que esconde a `UiBarraCta` e é o sinal `heroVisivel` do `WhatsappFloat`, então mantém `data-cta-local="hero"`) · `UiBotao--secundario` (âncora `#servicos`) · `UiMidia` (`priority`, `sizes` por breakpoint, `aspect-hero`) · `UiSelo` · `HeroMoldura` (decoração, sem lógica).

## 6. Jornada (Fase 8; completada na Fase 10 com os 8 campos do `08-JORNADA-UX`)
- **Objetivo único:** em 5 segundos entender (fisioterapia e estética popular, perto, R$ 49,99) e decidir chamar.
- **Vê:** `etiqueta`, h1 com destaque serifado, subtítulo, CTA principal, CTA secundário, `microcopy`, mídia (ou o bloco reservado) com o `selo` R$ 49,99. Tudo no 1º quadro.
- **Faz:** toca no CTA principal **ou** rola; quem ainda não decidiu toca em "Ver serviços por R$ 49,99" (`#servicos`).
- **Reage:** CTA com `:active` imediato (`dur-instant`) e abre o WhatsApp com a mensagem padrão; o secundário rola até os serviços. Sem entrada animada (M10).
- **Sente/entende:** acolhida; "isso cabe no meu mês".
- **Atrito → mitigação:** "é caro / clínica fria" → selo e tom acolhedor, foto real quando vier · "tem pegadinha?" → `microcopy` "sem pegadinha, sem taxa escondida" · mídia lenta → texto e CTA já no 1º quadro, nada espera a imagem.
- **Saída:** WhatsApp (maioria do tráfego quente) ou rolagem para S02/S03.
- **Evento de analytics:** `cta_principal_click` (`local` = `hero`) + `whatsapp_click`; `scroll_depth` (global).
- **Mobile:** texto primeiro, CTA visível sem rolar em 360×640; a barra inferior fica oculta aqui (campo 8).

## 7. Motion (Fase 9)
- **Nível:** **N1** (só microinteração do `botao`; o hero não tem entrada animada). Receitas: `docs/jornada-e-motion.md` §3.4. **Biblioteca:** nenhuma (CSS).
- **Regra M7 / regra 5 do `09-MOTION`: nada acima da dobra começa escondido, com ou sem JS.** `etiqueta`, `titulo` (h1), `subtitulo`, `acoes` (CTA), `microcopy`, `selo` e a imagem da `midia` (LCP) aparecem no primeiro quadro, sem entrada, sem `data-anim` de `reveal` e sem depender de temporizador.
- **Alvos `[data-anim]`:** só `botao` (CTA e CTA secundário). O hero **não tem entrada animada** (regra 5 do `09-MOTION` e M10).
- **`selo`:** **N0, estático** (M10). É conteúdo do 1º viewport: não espera animação, nem JS, nem evento de carregamento da mídia. Nasce visível nas 3 versões (desktop, mobile, reduced-motion). A entrada por `scale`+`opacity` que existia foi **removida** na 2ª passada da Fase 10.
- **`HeroMoldura`:** estática (decoração).
- **Vídeo (quando houver mídia real):** `muted`, `loop`, `playsinline`, `poster` com as dimensões declaradas (sem CLS), inicia ao entrar na tela e pausa ao sair; em reduced-motion só o `poster`. Nenhuma contagem nem chip animado (M3).
- **Não fazer:** parallax, zoom lento na foto, entrada do h1 por `opacity` (atrasa o LCP), vídeo com som.

## 8. Mobile (Fase 9)
- `cta` e `cta-secundario` em largura total, `min-h-touch`; entre os dois `space-3`. Nenhum gesto.
- Em 360×640 útil o CTA aparece sem rolar (verificar com a faixa de preço de 2 linhas). Altura da mídia nunca em `100vh`.
- `priority` na imagem, `sizes` por breakpoint, dimensões declaradas.

## 9. Critérios de aceite (Fase 10)
Vale também o **DoD comum** de `docs/sections/fichas-secoes.md` (C1–C9). Legenda: **[auto]** = Vitest, ESLint ou `check-nomes.mjs`; **[manual NNN]** = conferido no navegador na largura indicada (360, 390, 768, 1280).

Tarefa: T2.6 (`docs/tasks.md`)
- [auto] Existe um único `h1` na página, com o texto de `secoes.hero.headline`; `**caro**` vira `<span class="accent-serif">`.
- [auto] Há um único `data-cta-local="hero"`; texto e destino iguais aos de `site.ctas.principal`; `ui-botao--primario` só aparece via `UiCtaPrincipal`.
- [manual 360×640] O CTA do hero aparece **sem rolar**, mesmo com a faixa de preço em 2 linhas.
- [auto] `cta-secundario` usa `UiBotao--secundario`, aponta para `#servicos` e não usa a classe do primário.
- [auto] Com `midia.src = "pendente"`: nenhum `<img>`; bloco `bg-bg-alt` com `aspect-hero` (CLS 0). Com `src` real: `priority`, `sizes`, `width`/`height` e `alt` do conteúdo.
- [manual] **Regra 5:** sem JS, e também com JS pronto (`data-motion="on"`) e CPU limitada, `etiqueta`, `titulo`, `subtitulo`, `acoes`, `selo` e a imagem aparecem no 1º quadro; `grep`: nenhum desses tem `data-anim="reveal"`/`"stagger-item"`; o LCP não espera nenhum temporizador.
- [manual] `selo`: N0, visível desde o 1º quadro em desktop, mobile e reduced-motion, sem `data-anim`; valor e rótulo vêm de `hero.selo`.
- [manual] **1280×800: o CTA do hero aparece sem rolar** (título em `text-h1`; `text-display` só ≥ 1536px).
- [manual] 360–430: texto primeiro, `acoes` em coluna e largura total, mídia 4/5 com `selo` no canto superior direito; ≥1024: 12 colunas (texto 1–6, mídia 7–12); 768–1023: mídia centralizada abaixo do texto.
- [manual] LCP < 2,5 s, CLS < 0,1, INP < 200 ms (Lighthouse mobile ou equivalente); registrar o resultado no estado.
- [manual] Nenhum texto sobre a foto, nenhum vídeo com som, nenhuma promessa de resultado fora do `content.json`.
- [auto] **Eventos (campo 6, mapa em `docs/jornada-e-motion.md` §1b):** o CTA do hero tem `data-cta="principal"` + `data-cta-local="hero"`. Nenhum script de medição carrega sem consentimento.

## 11. Status
campos 1–9 definidos (Fases 4–10) · construção: T2.6 em `docs/tasks.md` · build: pendente


## Revisão: cartão com mídia ao fundo (16/11/2026, pedido do usuário)
Referência estrutural: a hero da Superpower (cartão arredondado quase da altura da tela, foto ao fundo, texto à esquerda). **Só a estrutura**: cores, Sora, rosa, textos e CTA são os do projeto.
- **Estrutura:** um único `cartao` (`rounded-lg`, `overflow-hidden`, `bg-surface`, `shadow-2`) dentro do `UiContainer`, com altura mínima `--altura-hero-midia` (viewport − header − `space-7`) a partir de 768px. Dentro: `midia` · `veu` · `conteudo` · `selo`.
- **≥768:** a `midia` preenche o cartão (absoluta, `object-cover`); o `veu` (vidro fosco: receita `stage-vidro` de `stage.css`, só desfoque, sem véu branco, borda direita dissolvida; só ≥768, `aria-hidden`; revisão de 17/11/2026, o degradê claro `bg-veu-hero`/`--hero-veu` foi removido) fica entre a mídia e o texto; `conteudo` à esquerda, centrado na vertical (2/3 do cartão no tablet, 1/2 a partir de 1024); `selo` no canto inferior direito do cartão.
- **<768:** a `midia` é uma faixa 4/3 no topo do cartão (**foto antes do texto**, como a Superpower); o `conteudo` vem embaixo sobre `bg-surface` (nenhum texto sobre a foto); `selo` no canto superior direito da foto. O CTA do hero **deixa de aparecer sem rolar em 360×640** (fica em ~710 px); o acesso fica com a barra inferior `UiBarraCta`, que só some quando um CTA principal está na tela.
- **Título:** `h1` semântico na escala `text-h2` (`tamanho="h2"`): calmo como o da Superpower; a 1280×800 o CTA e o CTA secundário ficam dentro da dobra (cartão de 750 px). Mantém Sora 600 e o destaque serifado em **caro**.
- **Mídia pendente:** degradê de marca `bg-grad-soft` (nunca imagem inventada), com a mesma proporção reservada (CLS 0). Mídia real: `priority`, 1600×1200, `sizes` "(min-width: 1280px) 1200px, 100vw". **Quando a foto chegar, reconferir o contraste do texto sobre o véu** (foto clara à esquerda é o caso seguro).
- **Removido:** `HeroMoldura` e o elemento `moldura`. **Novos elementos (convenção §5):** `cartao`, `veu`. Novo token de véu: `--hero-veu` (globals.css) → `bg-veu-hero`.
- **Critérios:** [auto] 1 cartão com mídia, véu, conteúdo e selo dentro; mídia pendente = `bg-grad-soft` + `aspect-card` + `md:absolute md:inset-0`; mídia antes do conteúdo no DOM (mobile); véu `hidden md:block` e `aria-hidden`; `hero.test.tsx` e `hero-midia.test.tsx`. [manual 390/768/1280] sem rolagem lateral, CLS 0, CTA no 1º quadro a 1280×800.

- **Indicadores (16/11/2026):** os 4 itens de `secoes.hero.indicadores` (valor + rótulo; `validar` intacto em "+14 mil", "3 unidades" e "Avaliação incluída") ficam **embaixo, à esquerda do cartão**, depois do conteúdo, como os 3 itens da hero da Superpower. 2 colunas até 1023 e 4 colunas com divisor (`lg:border-l`) a partir de 1024; estáticos (sem contador, M3), sem `data-anim`. Elementos `indicadores`, `indicador`, `indicador-valor`, `indicador-rotulo`. Com eles o cartão fica com ~790 px a 1280×800 e o CTA continua no 1º quadro (y 558).


## Revisão: wireframe da Superpower (16/11/2026, pedido do usuário)
Segue o `<section class="hero">` do wireframe: faixa com `px-2`, **um cartão** `rounded-md` com mídia de fundo, **texto à esquerda** (etiqueta, título, subtítulo, **1 só botão**) e os **indicadores absolutos embaixo à esquerda**, em linha, com fio entre eles (≥768; no mobile, foto no topo e indicadores em 2 colunas). **Saíram do render** (continuam no `content.json`): botão secundário (vai para o CTA final), microcopy e selo R$ 49,99 (o preço já está no subtítulo). **Onde os campos 4, 7 e 9 deste arquivo disserem o contrário, vale esta revisão.**

## Foto real (17/11/2026)
`secoes.hero.midia` = `assets/hero-site.avif` (2752×1536), com `alt` descritivo da cena. O usuário enviou `public/assets/hero.avif`; o otimizador de imagens do Next **recusa** esse arquivo ("isn't a valid image") porque ele usa a marca de arquivo `mif1` (AVIF válido, mas o Next só reconhece `ftypavif`). `hero-site.avif` é a mesma foto reencodada pelo `sharp` (qualidade 65, 93 KB, marca `avif`); o original foi mantido. `UiMidia` ganhou `classesImagem` (a hero usa `object-right`, para o enquadramento do mobile 4/3 manter a paciente e a fisioterapeuta) e o `cartao` agora declara 2752×1536. Com a foto: o texto fica sobre o `veu` claro, à esquerda, na parede teal; a 1280×800 o CTA fica em y 572 (1º quadro), CLS 0, LCP ~0,3 s local. **Reconferir o contraste dos indicadores** (o 4º cai sobre a camisa branca) e o `alt` com a clínica quando houver fotos finais.

**Sobreposição + parallax leve (17/11/2026):** ≥768 e com movimento ligado, o hero (`data-anim="pilha-base"`) trava (`position: sticky`) e a prova-rapida e o como-funciona (`pilha-topo`) passam por cima dele (`UiPilha`, N2; receitas em `src/app/pilha.css`). A prova-rapida ganha cantos de cima arredondados. Parallax leve: enquanto é coberto o hero sobe 20% da própria altura ao longo da 1ª tela de rolagem (CSS `animation-timeline: scroll(root)`, só `transform`, atrás de `@supports`; sem suporte, fica só a sobreposição). Mobile (<768), reduced-motion e sem JS: fluxo normal.
