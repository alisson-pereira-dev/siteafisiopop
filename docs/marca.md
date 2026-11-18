# Marca e Ativos — A.FISIO POP

## Decisão de identidade
**Manter.** O cliente já tem identidade consolidada no Instagram e um Design System v1.1 aprovado (rosa + teal, Sora + Instrument Serif + Inter, logo das duas figuras com swoosh). O trabalho aqui é **elevar o acabamento** para o nível premium das referências, sem trocar a identidade. Nada de evoluir logo ou paleta nesta rodada.

## Logo
- **Logo real recebido (16/11/2026):** PNG com fundo transparente, 2172×724. Uma figura de braços abertos dividida em rosa e teal, dois swooshes rosa e o texto **A.FISIOPOP** em serifada pesada (A.FISIO em rosa, POP em teal) com "SAÚDE & ESTÉTICA" abaixo. **É diferente do redesenho do DS** (que mostrava duas figuras): vale o logo real. Cores medidas no arquivo: carmim ≈ `#DE0050` e teal ≈ `#008A84`, ambos um pouco mais fechados que o rosa e o teal do DS. Grafia do logo: **A.FISIOPOP**; em texto corrido, o briefing usa "A.FISIO POP" (**validar**). Arquivo em `assets/logo-afisiopop.png`.
- **Anteriormente:** o logo só aparecia **redesenhado em SVG dentro do HTML do DS** ("duas figuras de braços levantados" + swoosh rosa + "SAÚDE & ESTÉTICA").
- **Versões descritas no DS:** principal, monocromática e sobre cor. Regras: não redesenhar à mão, não trocar as cores, não colocar sombra, não usar sobre foto sem véu; área de respiro mínima igual à altura da letra; tamanho mínimo definido.
- **Problemas:** sem o arquivo-fonte, existe risco de divergência com o logo real do Instagram. A grafia varia entre "A.FISIO POP" e "A.FISIOPOP".
- **Ação necessária:** pedir o logo original (SVG ou PNG transparente de alta resolução, versões principal e negativa) e confirmar a grafia oficial.

## Cores
| Papel | Token | Hex | Origem |
|---|---|---|---|
| Primária (ação, preço) | `--pink` | #E92E7A | recebida (DS) |
| Primária escura (hover, texto) | `--pink-dark` | #C2185E | recebida |
| Rosa claro (chips, selos) | `--pink-light` | #FFD6E8 | recebida |
| Rosa fundo (seções alternadas) | `--pink-bg` | #FFF2F7 | recebida |
| Secundária (confiança, saúde) | `--teal` | #00B4AB | recebida |
| Teal escuro | `--teal-dark` | #007E78 | recebida |
| Teal claro | `--teal-light` | #D6F5F2 | recebida |
| Tinta (texto, fundos escuros) | `--ink` | #1F1B22 | recebida |
| Grafite (texto secundário) | `--graphite` | #4A4450 | recebida |
| Cinza (legendas) | `--gray` | #8A8490 | recebida |
| Borda | `--border` | #EEE8EE | recebida |
| Fundo da página | — | #FFFDFE | usada no DS, **fora do bloco de tokens** |
| Teal vivo (sobre fundo escuro) | — | #00E6D8 | usada no DS, **fora do bloco de tokens** |
| Sucesso / Atenção / Erro | — | #1FA47A / #F5A623 / #E53935 | usadas no DS, **fora do bloco de tokens** |
| WhatsApp | — | #25D366 | usada no DS, **fora do bloco de tokens** |

O bloco `tokens.css` do DS tem só uma parte dessas cores. A Fase 5 completa o conjunto para que nenhum hex fique solto no código.

### ⚠️ Contraste (WCAG AA = 4,5:1 para texto normal, 3:1 para texto grande e componentes)
Calculei os pares que o DS usa. Alguns **não passam em AA** e precisam de ajuste antes do build:

| Par | Razão | Resultado | Correção proposta |
|---|---|---|---|
| Texto branco sobre rosa #E92E7A (botão principal, 16px/600) | 4,09 | ❌ falha | Botão com fundo `#E3186A` (4,56:1, praticamente a mesma cor) **ou** texto grande/bold ≥ 18,66px |
| Texto branco sobre teal #00B4AB (botão do header no DS) | 2,59 | ❌ falha grave | Botão teal só com **texto `--ink`** (6,56:1) ou fundo `--teal-dark` (4,93:1) |
| Rosa #E92E7A como texto sobre fundo claro | 4,04 | ❌ falha (texto pequeno) | Usar `--pink-dark` #C2185E (≥ 5,8:1) em texto pequeno; o rosa puro fica para títulos grandes e destaques serifados |
| Rosa sobre rosa fundo #FFF2F7 | 3,76 | ❌ falha em texto pequeno | Mesma regra: `--pink-dark` |
| Teal escuro sobre teal claro | 4,28 | ⚠️ limite | Usar `--ink` em texto pequeno sobre `--teal-light` |
| Cinza #8A8490 sobre fundo claro | 3,58 | ❌ falha | Usar só em elementos decorativos; texto de apoio em `--graphite` (9,28:1) |
| Ícone branco no botão WhatsApp verde #25D366 | 1,98 | ❌ falha (componente de UI exige 3:1) | Ícone em `--ink` (8,55:1) ou verde mais escuro no botão flutuante |
| Teal vivo #00E6D8 sobre tinta | 10,75 | ✅ | — |
| Grafite sobre fundo da página | 9,28 | ✅ | — |

**Decisão tomada na Fase 5 (a pedido do usuário):** primária `#D6145F` (5,09:1 com branco), teal de ação `#007E78`, texto de apoio `#6B6572`, ícone do WhatsApp em tinta. O rosa `#E92E7A` e o teal `#00B4AB` ficam só para destaque grande e decoração. Detalhes e tabela completa em `design-system.md`.

## Tipografia
- **Fontes da marca (DS):** Sora 600 nos títulos (-0.02em, line-height 1.1), Instrument Serif itálico em 1–2 palavras de destaque, Inter 400/600 no corpo e nos botões. Sem uppercase em corpo e botões.
- **Fonte descartada:** o DS registra que a fonte anterior foi abandonada por ser "pesada demais, com cara de promoção".
- **Substitutas:** não são necessárias, as três são gratuitas no Google Fonts.
- **Observação de produção:** carregar via `next/font` (self-host, `display: swap`) em vez do `@import` do DS, por desempenho.

## Mood
- **Palavras:** acolhedor, leve, popular, confiável, vivo.
- **Se fosse uma pessoa/lugar/som (DS):** amiga que recebe com abraço · clínica clara, cheirosa, com música leve · um pop leve com respiro fundo no refrão.
- **Evitar:** clínica fria/hospital, visual "promoção", gritaria de cor, fonte pesada, hex solto.

## Elementos de marca existentes (reaproveitar)
Swoosh rosa como assinatura de movimento · figuras de braços levantados · selo "R$ 49,99" · faixa/marquee escura com os serviços · selo flutuante rotacionado · botão WhatsApp flutuante com pulso · grid de pontos (`dot-grid`) de fundo · ícones **Lucide** sempre dentro de um container de 12px · gradientes: Hero (rosa → teal), Card (rosa → rosa vivo #FF6AA5), Selo (rosa claro → teal claro).

## Pontos do DS que a Fase 5 precisa reconciliar
- `--radius-card: 16px` nos tokens, mas a página do DS usa `rounded-3xl` (24px) nos cards. Decidir um valor só.
- O FAQ e o checklist do DS dizem "2 unidades" (conflito com o briefing, ver dossiê).
- O DS lista "Auriculoterapia", que não está no briefing.
- O DS prevê "Banner sazonal" (Dia das Mães etc.): decidir se entra no site e como entra sem competir com o CTA único.

## Imagens e mídia
| Ativo | Situação | Uso previsto | Qualidade |
|---|---|---|---|
| Fotos das unidades (fachada, recepção, salas) | pendente | hero, unidades | — |
| Fotos da equipe | pendente | "como funciona", autoridade | — |
| Fotos/vídeos de atendimentos | pendente (existem no Instagram) | "um problema, uma solução", serviços | — |
| Vídeos curtos do Instagram | existem, não recebidos | loops no hero e na seção de serviços | — |
| Fotos de clientes (depoimentos) | pendente, com autorização | depoimentos | — |
| Ilustrações/ícones | existem no DS (Lucide, figuras, swoosh) | fallback onde faltar foto | boa |

## Estratégia de imagens
1. **Do cliente (prioridade):** fotos e vídeos reais dos atendimentos, das unidades e da equipe, com autorização. A diretriz do briefing é não depender de banco de imagem.
2. **Banco de imagens:** não usar para simular o negócio. Só se for abstrato e coerente.
3. **Ilustração/vetor da própria marca:** figuras, swoosh, ícones Lucide e gradientes cobrem o lugar das fotos enquanto elas não chegam.
4. **Placeholder honesto:** todo espaço de foto real fica marcado como `pendente` em `assets-needed.md`.
