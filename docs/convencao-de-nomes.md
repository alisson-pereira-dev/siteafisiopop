# Convenção de Nomes — A.FISIO POP

**Objetivo:** ao inspecionar qualquer elemento no navegador, saber **qual seção, qual parte, qual arquivo e qual texto** ele é, sem abrir o projeto inteiro. Isso também economiza tokens: o Claude Code acha o arquivo com um `grep` e lê só ele.

**Regra de ouro:** todo elemento que recebe estilo, conteúdo ou comportamento **tem nome**. Nenhum `div` anônimo.

## 1. As 4 camadas de nome

| Camada | O que é | Exemplo |
|---|---|---|
| **Âncora** (`id`) | Navegação por link; 1 por seção | `id="servicos"` |
| **Classe-nome (BEM)** | Etiqueta de identificação, **sempre a primeira classe** do elemento | `class="servicos__card-icone ..."` |
| **Atributos `data-*`** | Localizar conteúdo, ficha, animação, CTA e analytics | `data-conteudo="secoes.servicos"` |
| **Arquivo / componente** | Onde o código mora, com o mesmo nome do bloco | `src/secoes/servicos/ServicosCard.tsx` |

A ficha de cada seção é o arquivo `docs/sections/fichas/{slug}.md` (o `slug` é o do bloco: `servicos`, `prova-rapida`…). `data-ficha` guarda o código curto (`S06`); o índice `docs/sections/fichas-secoes.md` liga código, slug e arquivo.

## 2. Classe-nome (BEM em pt-BR)

Formato: `bloco__elemento` e `bloco__elemento--modificador`. Tudo em **kebab-case, sem acento, em português**, igual às chaves do `content.json`.

- **Bloco** = slug da seção em kebab-case: `hero`, `prova-rapida`, `problema-solucao`, `servicos`, `como-funciona`, `preco-pop`, `para-quem`, `depoimentos`, `unidades`, `faq`, `cta-final`, `header`, `footer`.
- **Elemento** = o **papel**, não a aparência: `hero__selo` (certo), `hero__circulo-rosa` (errado).
- **Modificador** = variação: `servicos__card--destaque`, `ui-botao--primario`.
- A classe-nome é **só etiqueta**: **não se escreve CSS nela**. O estilo vem dos utilitários do Tailwind e dos tokens, na mesma `class`, depois do nome.
- Profundidade máxima: `bloco__elemento`. Se precisar de mais um nível, junte com hífen (`servicos__card-icone`) ou vire componente próprio.

```tsx
<article
  className="servicos__card rounded-lg bg-surface p-5 shadow-1"
  data-item="drenagem-linfatica"
>
  <span className="servicos__card-icone rounded-icon ..."><Droplets /></span>
  <h3 className="servicos__card-nome ...">Drenagem Linfática</h3>
  <p className="servicos__card-descricao ...">...</p>
</article>
```

### Componentes compartilhados (prefixo `ui-`)
`ui-secao` · `ui-container` · `ui-titulo` · `ui-botao` (`--primario`, `--secundario`) · `ui-link` · `ui-barra-cta` (barra inferior fixa do mobile; raiz `ui-barra-cta`, sem elementos próprios: o botão dentro é `ui-botao--primario`) · `ui-selo` · `ui-card` · `ui-icone` · `ui-chip` · `ui-accordion` · `ui-pilha` (empilha duas seções: a de cima sobrepõe a de baixo ao rolar; só raiz, sem elementos) · `ui-midia`.
O componente compartilhado recebe a classe-nome da seção por `className` (ela vem primeiro); nunca se monta classe-nome por concatenação, para o `grep` funcionar. Dentro de `src/ui/` usa-se `juntar(className, "ui-x ...")` (`src/lib/classes.ts`): a classe-nome do chamador fica primeiro e `className` ausente não vira `undefined`; o `check-nomes` entende essa forma e confere o nome no ponto de chamada.
Globais fora das seções: `whatsapp-float`, `voltar-topo`, `cookie-banner`, `pagina-404`, `pagina-legal` (rotas `/privacidade` e `/termos`, rascunho técnico, noindex). Página interna de verificação (rota `/teste-tokens`, noindex): bloco `teste-tokens`.

## 3. Atributos `data-*`

| Atributo | Onde | Exemplo | Para quê |
|---|---|---|---|
| `data-section` | raiz da seção | `data-section="servicos"` | Achar a seção no DOM |
| `data-ficha` | raiz da seção | `data-ficha="S06"` | Ir direto à ficha |
| `data-conteudo` | raiz da seção | `data-conteudo="secoes.servicos"` | Saber **onde está o texto** (`content.json`) |
| `data-item` | itens repetidos (cards, pares, perguntas do FAQ como `pergunta-1`…`pergunta-7`, unidades) | `data-item="drenagem-linfatica"` | Distinguir itens iguais |
| `data-cta` + `data-cta-local` | todo CTA | `data-cta="principal" data-cta-local="hero"` | Analytics e conferir o CTA único. Valores: `principal` (só `UiCtaPrincipal`), `servico` (link contextual de card), `flutuante` (botão do WhatsApp, só ≥768px). Locais de `principal`: `header`, `header-painel`, `hero`, `problema-solucao`, `como-funciona`, `preco-pop`, `unidades`, `cta-final`, `barra` (`ui-barra-cta`, só <768px) |
| `data-anim` | elemento animado | `data-anim="reveal"` | **Único seletor das animações**. Valores (catálogo em `jornada-e-motion.md` §3.4): `reveal` · `stagger-item` · `header-pilula` · `header-logo` · `header-link` · `header-menu` · `painel` · `painel-fundo` · `barra-cta` · `float` · `float-pulso` · `botao` · `card-realce` · `accordion-icone` · `accordion-resposta` · `stage-passos` · `stage-passo` · `stage-passo-rotulo` · `stage-anel` · `stage-anel-fill` · `stage-copias` · `stage-copia` · `stage-visual` · `stage-vidro` · `stage-raiz` · `stage-lateral` · `stage-faq` · `stage-faq-icone` · `stage-modal` · `chat` · `chat-video` · `chat-mensagem` · `chat-vidro` · `chat-usuario` · `chat-avatar` · `chat-palavra` · `chat-ponto` · `carrossel-faixa` · `carrossel-slide` · `carrossel-navegacao` · `carrossel-segmento` · `carrossel-progresso` · `carrossel-fundo` · `carrossel-vidro` · `pilha-parallax` · `desce` · `pilha` · `pilha-base` · `pilha-topo` · `mapa-embed`. (`marquee` removido: decisão M2; `selo` removido: decisão M10, o selo do hero é estático). Cada valor tem nível (N0–N3) e as 3 versões no catálogo |
| `data-estado` | quando há estado | `data-estado="aberto"` | Estado visível no inspetor. Valores: `aberto` (painel; `UiAccordion` opcional) · `rolado` (header) · `visivel`/`oculta`/`pendente` (`ui-barra-cta`, `whatsapp-float`) · `visto` (`reveal`/`stagger-item` já revelado) · `ativa`/`inativa`/`salto` (faixa do carrossel sem transição durante o teleporte do loop) (`queixa`, S03 desktop) |
| `data-js` · `data-motion` · `data-js-pronto` · `data-js-falhou` | **só no `<html>`** | `data-motion="on"` | `data-js` = há JS (posto pelo script inline, antes da 1ª pintura; habilita o layout do palco e o estado `pendente` da barra/flutuante, **nunca esconde conteúdo**). `data-motion="on"` = o JS de animação está **pronto** e não há `prefers-reduced-motion` (posto por `MotionInit`, **não** pelo script inline; só então valem os estados iniciais ocultos dos `reveal`, nunca para o que já está na tela). `data-js-pronto` = o 1º componente client iniciou (posto por `CtaObservador` ou `MotionInit`). `data-js-falhou` = erro, ou o *watchdog* de 4 s (só com JS) venceu sem `data-js-pronto`: o CSS mostra barra e flutuante e desliga o palco (`jornada-e-motion.md` §3.3) |

`data-anim` aceita uma **lista separada por espaço** quando o mesmo elemento tem duas receitas (ex.: `data-anim="stagger-item card-realce"`, `data-anim="botao stagger-item"`); o CSS e o `MotionInit` usam `[data-anim~="x"]`.

**Modo palco (S03):** a variante `palco:` do Tailwind (`tailwind.config.ts`) liga só quando há `html[data-js]` sem `data-js-falhou`, ≥1024px e sem reduced-motion. Serve a estilos do `ProblemaSolucao*` que mudam entre a grade estática e o palco (nada de CSS em classe-nome). Ao criar uma variante com `addVariant`, usar **uma string única com o seletor aninhado**; a forma em array gera duas regras (OU, não E).

**Animações** selecionam **somente** `[data-anim]`, nunca classe-nome nem utilitário. Assim reestilizar não quebra animação e vice-versa. Na v1 não há biblioteca de animação: a regra vale para o CSS (`[data-motion="on"] [data-anim="..."]`) e para os observers.

## 4. Raiz de cada seção (modelo obrigatório)
```tsx
<section
  id="servicos"
  className="servicos ..."
  data-section="servicos"
  data-ficha="S06"
  data-conteudo="secoes.servicos"
  aria-labelledby="servicos__titulo"
>
```

## 5. Elementos por seção (lista oficial)
Ao precisar de um elemento que não está aqui, **adicione na lista antes de usar**.

| Bloco | Elementos |
|---|---|
| `header` | `pular-conteudo` · `faixa-preco` · `barra` · `barra-conteudo` · `pilula` (a barra que vira pílula de vidro) · `nav-simples` · `nav-simples-link` (lista de links dentro de `noscript`) · `logo` · `nav` · `nav-link` · `cta` · `botao-menu` · `botao-menu-pontos` · `botao-menu-ponto` · `painel-fundo` (fundo escurecido da gaveta) · `painel` (gaveta lateral) · `painel-cabecalho` · `painel-titulo` · `painel-fechar` · `painel-lista` · `painel-link` · `painel-cta` |
| `hero` | `grade` · `cartao` (cartão arredondado que contém mídia e texto) · `veu` (degradê claro sobre a mídia, lado do texto) · `conteudo` · `etiqueta` · `titulo` · `destaque` · `subtitulo` · `acoes` · `cta` · `cta-secundario` · `microcopy` · `midia` · `selo` · `indicadores` · `indicador` · `indicador-valor` · `indicador-rotulo` |
| `prova-rapida` | `legenda` · `lista` · `item` · `valor` · `rotulo` |
| `problema-solucao` | `cabecalho` · `titulo` · `subtitulo` · `stage` · `media` · `visual` (camada de mídia em crossfade) · `video` · `chat` · `chat-mensagem` · `chat-avatar` · `chat-pilula` · `chat-pontos` · `chat-ponto` · `chat-balao` · `chat-balao-usuario` · `chat-palavra` · `veu` · `lateral` · `controles` · `passos` (pílula 01–05) · `passo` · `passo-ponto` · `passo-anel` · `passo-numero` · `passo-rotulo` · `pausa` · `copias` · `copia` · `copia-corpo` · `copia-titulo` · `copia-texto` · `copia-link` · `faq` · `faq-item` · `faq-item-icone` · `modal` · `modal-corpo` · `modal-fechar` · `modal-titulo` · `modal-texto` · `apoio` · `cta` |
| `servicos` | `cabecalho` · `titulo` · `subtitulo` · `grade` · `card` · `card-icone` · `card-nome` · `card-descricao` · `card-midia` · `card-link` |
| `como-funciona` | `cabecalho` · `titulo` · `subtitulo` · `grade` · `passo` · `passo-midia` · `passo-corpo` · `passo-numero` (numeral do ladrilho ou etiqueta sobre a foto) · `passo-titulo` · `passo-descricao` · `cta` |
| `preco-pop` | `galeria` · `palco` · `etiqueta` · `conteudo` · `titulo` · `texto` · `texto-destaque` · `preco-valor` · `preco-periodo` · `inclui` · `inclui-item` · `inclui-marca` · `cta` · `oferta` · `oferta-faixa` · `oferta-cartao` · `oferta-cabecalho` · `oferta-descricao` · `oferta-preco` · `oferta-incluso` · `oferta-titulo` · `oferta-subtitulo` · `oferta-valor` · `oferta-periodo` · `oferta-servicos-rotulo` · `oferta-servicos` · `oferta-servico` · `numeros` · `numeros-lista` · `numero` · `numero-valor` · `numero-rotulo` · `duvidas` · `duvidas-titulo` · `duvidas-subtitulo` · `duvidas-lista` · `duvida` · `duvida-pergunta` · `duvida-pergunta-icone` · `duvida-resposta` |
| `para-quem` | `cabecalho` · `subtitulo` · `titulo` · `lista-voce` · `item` · `nao-e-para` · `nao-e-para-titulo` · `nao-e-para-texto` |
| `depoimentos` | `fundo` · `vidro` · `legenda` · `cabecalho` · `titulo` · `subtitulo` · `carrossel` · `slider` · `faixa` · `slide` · `navegacao` · `segmentos` · `segmento` · `segmento-progresso` · `contador` · `pausa` · `card` · `card-corpo` · `midia` · `aspas` · `citacao` · `autor` · `contexto` · `selo-provisorio` |
| `unidades` | `cabecalho` · `titulo` · `texto` · `lista` · `card` · `card-midia` · `card-nome` · `card-local` · `card-endereco` · `card-horarios` · `card-mapa` · `card-mapa-embed` · `card-cta` (reservado, não renderiza) · `cta` |
| `cta-final` | `conteudo` · `titulo` · `subtexto` · `selos` · `selo` · `acoes` · `cta` · `cta-secundario` |
| `footer` | `cartao` · `marca` · `logo` · `descricao` · `colunas` · `coluna` · `coluna-titulo` · `link` · `registro` · `legal` · `copyright` |
| `whatsapp-float` | `pulso` (anel decorativo do `float-pulso`, `aria-hidden`) |
| `pagina-404` | `conteudo` · `titulo` · `texto` · `cta` (botão `ui-botao--secundario`, nunca o CTA principal) |
| `pagina-legal` | `faixa-rascunho` · `conteudo` · `cabecalho` · `titulo` · `data` · `intro` · `bloco` · `bloco-titulo` · `paragrafo` · `lista` · `lista-item` · `voltar` |

## 6. Arquivos e componentes

| Item | Regra | Exemplo |
|---|---|---|
| Pasta da seção | `src/secoes/{slug}/` | `src/secoes/servicos/` |
| Componente principal | PascalCase do bloco | `Servicos.tsx` |
| Subcomponente | bloco + elemento | `ServicosCard.tsx` |
| Compartilhados | `src/ui/` | `src/ui/UiBotao.tsx` |
| Conteúdo | só `content.json`, por chave | `secoes.servicos.itens` |
| Tokens | só `design-tokens.css` | `var(--color-primary)` |

Todo arquivo começa com **cabeçalho de localização**:
```tsx
/**
 * Seção S06 · servicos
 * Ficha: docs/sections/fichas/servicos.md (S06) · Conteúdo: content.json → secoes.servicos
 * Elementos: servicos__cabecalho, __grade, __card, __card-icone ...
 */
```

## 7. Como achar o que alterar (fluxo de manutenção)
1. Inspecionou um elemento → leia a **primeira classe** (`servicos__card-icone`).
2. `grep -rn "servicos__card-icone" src/` → 1 arquivo. Abra só ele.
3. Problema é de **texto**? Veja `data-conteudo` na raiz da seção → chave em `content.json`.
4. Problema é de **cor/espaço/fonte**? Troque o token, nunca o valor.
5. Problema é de **animação**? Procure o `data-anim` do elemento e a receita na ficha (campo 7).
6. Ao pedir um ajuste ao Claude, cite o nome: *"em `servicos__card-descricao` no mobile, reduzir a fonte"*.

## 8. Proibido
- `div`/`span` estrutural sem classe-nome.
- Nomes genéricos: `wrapper`, `container` (exceto `ui-container`), `box`, `inner`, `content`, `item` sozinho, `div1`, `section2`.
- Nome de aparência: `rosa-grande`, `esquerda`, `azul`.
- Duas seções ou dois elementos com o mesmo nome-bloco.
- Escrever CSS em classe-nome. Animar por classe. Texto fixo dentro de componente.

## 9. Verificação (entra no DoD de toda seção e na Fase 10)
- [ ] Raiz da seção com `id`, `data-section`, `data-ficha`, `data-conteudo`
- [ ] Todo elemento estrutural com classe-nome da lista oficial
- [ ] Todo CTA com `data-cta="principal"` e `data-cta-local`
- [ ] Toda animação com `data-anim`
- [ ] Cabeçalho de localização no arquivo
- [ ] `scripts/check-nomes.mjs` passa (tarefa T2.0 de `docs/tasks.md`): falha se achar `<div` ou `<span` sem `className` iniciado por um bloco válido, nome proibido, ou seção sem `data-section`

**Exceções que o `check-nomes.mjs` precisa conhecer:** (1) `<span className="accent-serif">` (destaque `**palavra**`, sem classe-nome BEM); (2) `header` e `footer` têm raiz própria (sem `UiSecao`, mas com `data-section` e `data-ficha`); (3) `data-js`, `data-motion`, `data-js-pronto` e `data-js-falhou` só valem no `<html>` (script inline em `layout.tsx`; `data-motion` e `data-js-pronto` também em `MotionInit`/`CtaObservador`, via `document.documentElement`; a falha segura `data-js-falhou` também em `ProblemaSolucaoPalco`); (4) a raiz de `prova-rapida` usa `aria-label` (não há título visível) em vez de `aria-labelledby`; (5) `data-cta-local="unidades-{slug}"` está **reservado** e deve falhar enquanto o WhatsApp for único.
