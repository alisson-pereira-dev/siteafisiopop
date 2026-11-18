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
`ui-container` · `ui-botao` (`--primario`, `--secundario`) · `ui-selo` · `ui-card` · `ui-icone` · `ui-chip` · `ui-accordion` · `ui-midia`.
Globais fora das seções: `whatsapp-float`, `voltar-topo`, `cookie-banner`, `pagina-404`.

## 3. Atributos `data-*`

| Atributo | Onde | Exemplo | Para quê |
|---|---|---|---|
| `data-section` | raiz da seção | `data-section="servicos"` | Achar a seção no DOM |
| `data-ficha` | raiz da seção | `data-ficha="S06"` | Ir direto à ficha |
| `data-conteudo` | raiz da seção | `data-conteudo="secoes.servicos"` | Saber **onde está o texto** (`content.json`) |
| `data-item` | itens repetidos | `data-item="drenagem-linfatica"` | Distinguir itens iguais |
| `data-cta` + `data-cta-local` | todo CTA | `data-cta="principal" data-cta-local="hero"` | Analytics e conferir o CTA único |
| `data-anim` | elemento animado | `data-anim="reveal"` · `stagger-item` · `pin-palco` · `marquee` | **Único seletor das animações** |
| `data-estado` | quando há estado | `data-estado="aberto"` | Estado visível no inspetor |

**Animações** (GSAP/Motion) selecionam **somente** `[data-anim]`, nunca classe-nome nem utilitário. Assim reestilizar não quebra animação e vice-versa.

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
| `header` | `faixa-preco` · `barra` · `logo` · `nav` · `nav-link` · `cta` · `botao-menu` · `painel` |
| `hero` | `conteudo` · `etiqueta` · `titulo` · `destaque` · `subtitulo` · `acoes` · `cta` · `cta-secundario` · `microcopy` · `midia` · `selo` |
| `prova-rapida` | `lista` · `item` · `valor` · `rotulo` |
| `problema-solucao` | `cabecalho` · `titulo` · `subtitulo` · `palco` · `lista` · `par` · `queixa` · `solucao` · `icone` · `apoio` · `cta` |
| `servicos` | `cabecalho` · `titulo` · `subtitulo` · `grade` · `card` · `card-icone` · `card-nome` · `card-descricao` · `card-midia` · `card-link` |
| `como-funciona` | `cabecalho` · `titulo` · `linha-tempo` · `passo` · `passo-numero` · `passo-titulo` · `passo-descricao` · `cta` |
| `preco-pop` | `etiqueta` · `titulo` · `texto` · `preco` · `preco-valor` · `preco-periodo` · `inclui` · `inclui-item` · `cta` |
| `para-quem` | `titulo` · `lista-voce` · `item` · `nao-e-para` · `nao-e-para-titulo` · `nao-e-para-texto` |
| `depoimentos` | `cabecalho` · `titulo` · `subtitulo` · `grade` · `card` · `citacao` · `autor` · `contexto` · `selo-provisorio` |
| `unidades` | `cabecalho` · `titulo` · `texto` · `lista` · `card` · `card-nome` · `card-local` · `card-endereco` · `card-horarios` · `card-mapa` · `card-cta` |
| `faq` | `cabecalho` · `titulo` · `lista` · `item` · `pergunta` · `resposta` |
| `cta-final` | `conteudo` · `titulo` · `subtexto` · `cta` |
| `footer` | `marca` · `descricao` · `colunas` · `coluna` · `coluna-titulo` · `link` · `registro` · `legal` · `copyright` |

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
 * Ficha: fichas-secoes.md (S06) · Conteúdo: content.json → secoes.servicos
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
- [ ] `scripts/check-nomes.mjs` passa (tarefa da Fase 10): falha se achar `<div` ou `<span` sem `className` iniciado por um bloco válido, nome proibido, ou seção sem `data-section`
