# Estado do Projeto — A.FISIO POP

> **Leia este arquivo primeiro e, se possível, só ele + os arquivos da seção "Próxima sessão".** Não reconstrua o histórico da conversa anterior: tudo que importa está aqui e nos arquivos listados.
> Última atualização: 16/11/2026 · Sessão 1 · Atualizado por: Claude

## 1. Resumo em 5 linhas
Site de uma página (home) para a **A.FISIO POP**, clínica de Fisioterapia & Estética Popular com 3 unidades (Lauro de Freitas e Salvador, BA). Promessa: "Cuidar de você não precisa ser caro. Qualquer serviço por R$ 49,99." Público: mulheres de 25–55 anos que chegam do Instagram pelo celular. **CTA único: Agendar no WhatsApp.** Direção: *premium acessível*, estrutura da Superpower (peso 60%), calma da Odyssée (20%) e foto/vídeo real à la Biograph (20%), com a identidade POP (rosa + teal). Nível: **completo**. Motion: **N1 com 1 momento N2**, sem N3.

## 2. Onde estamos
| Fase | Status | Saída |
|---|---|---|
| 1 Conteúdo | ✅ concluída | `dossie.md` |
| 2 Marca e ativos | ✅ concluída | `marca.md`, `assets-needed.md` |
| 3 Referências / Direção de Arte | ✅ concluída | `direcao-de-arte.md` |
| 4 Seções | ✅ concluída | `mapa-do-site.md`, `content.json`, `fichas-secoes.md` (campos 1–3) |
| 5 Design System | ✅ concluída | `design-tokens.css/json`, `design-system.md` |
| **6 Referências por seção** | ⏭️ **próxima** | campo 4 (Layout) das fichas |
| 7 Componentes | pendente | `componentes.md` |
| 8 Jornada UX | pendente | campo 6 das fichas + mapa macro |
| 9 Animações | pendente | campos 7 e 8 das fichas |
| 10 Handoff | parcial | `CLAUDE.md` **v0 criado** (`06-handoff/CLAUDE.md`, só T0 e T1.1 liberados). Pendentes: `PRD.md`, `tasks.md`, `CLAUDE.md` final, `content.json` final |
| 11 Build / 12 Pré-lançamento | Claude Code | site + checklist |

Pausa A: aprovada. Pausa B: apresentada; sem objeções até agora.

## 3. Decisões fixas (não reabrir sem o usuário pedir)
- **Unidades: 3** (Shopping Vida Nova em Lauro de Freitas; Shopping da Gente e Cajazeiras X em Salvador). Segue o briefing.
- **Seções, em ordem:** header · hero · prova-rapida · problema-solucao · servicos · como-funciona · preco-pop · para-quem · depoimentos · unidades · faq · cta-final · footer (+ WhatsApp flutuante).
- **CTA principal:** "Agendar meu horário no WhatsApp", texto idêntico em todo o site; o preço fica no texto ao redor.
- **Cores:** primária `#D6145F` (CTA e links), teal de ação `#007E78`, texto de apoio `#6B6572`. Rosa `#E92E7A` só em destaque serifado grande e decoração. Ícone do WhatsApp em tinta. Tudo em tokens, nenhum hex solto.
- **Tipografia:** Sora 600 (títulos), Instrument Serif itálico (1–2 palavras de destaque, via `**palavra**` no `content.json`), Inter (corpo).
- **Logo:** o **real** (PNG transparente, `assets/logo-afisiopop.png`), não o redesenho do DS. SVG e versão branca pendentes.
- **Depoimentos:** 3 comentários do Instagram, **provisórios** (`provisorio: true`), sem nome nem foto inventados. Trocar antes do lançamento.
- **Copy de saúde:** mantida como no briefing, por decisão do cliente. Exceção: "por uma hora" foi retirado (duração não confirmada).
- **WhatsApp e endereço de Lauro de Freitas:** provisórios, vindos de um perfil pessoal do Facebook. E-mail pessoal e histórico profissional **não** usados.
- **Convenção de nomes obrigatória:** `convencao-de-nomes.md` (classe-nome BEM, `data-section`, `data-conteudo`, `data-cta`, `data-anim`). Toda ficha e todo componente seguem.
- **Mobile é o caso principal** (tráfego do Instagram). Animações sempre em 3 versões (desktop, mobile, reduced-motion).

## 4. Pergunta aberta (aguarda o usuário)
1. O WhatsApp `(71) 98865-6153` é o oficial da clínica e vale para as 3 unidades? Se houver um número por unidade, o CTA abre uma escolha rápida de unidade.
2. O endereço "Avenida Santo Amaro de Ipitanga, 464" é do Shopping Vida Nova? "Shopping Vida Nova" e "Shopping Empresarial Vida Nova" são o mesmo local?

Se não houver resposta, **seguir com os provisórios** e manter os itens em `validar`.

## 5. Mapa de arquivos (quando ler cada um)
Todos em `afisiopop/` no Projeto, salvo indicação.

| Arquivo | Para que serve | Ler na fase |
|---|---|---|
| `00-ESTADO-DO-PROJETO.md` | **este arquivo** | sempre, primeiro |
| `convencao-de-nomes.md` | nomes de classes, data-*, arquivos | 6 a 11 (resumo na seção 3) |
| `fichas-secoes.md` | 13 fichas; é o arquivo que **cresce** a cada fase | 6, 7, 8, 9, 10 |
| `content.json` | todo o texto do site + `meta.pendencias_validar` | 6 (consultar), 10 |
| `direcao-de-arte.md` | conceito, mapa Superpower→clínica, motion | 6, 9 |
| `design-system.md` | decisões e regras de uso dos tokens | 6, 7 |
| `design-tokens.css` / `.json` | tokens (código) | 7, 10, 11 |
| `mapa-do-site.md` | ordem e papel de cada seção | 6, 8 |
| `CLAUDE.md` (v0) | regras do repositório para o Claude Code; lista o que já pode ser construído (T0, T1.1) | Fase 10 (completar); e no início do build |
| `marca.md` | identidade, logo, contraste | só se mexer na marca |
| `dossie.md` | fatos do negócio, fontes, lacunas | só se um fato for questionado |
| `assets-needed.md` | o que falta receber do cliente | 10 |

**Não carregar:** o HTML do Design System original (283 KB), o briefing .docx e os prints. Já foram destilados nos arquivos acima. O logo PNG só é necessário no build; o usuário reanexa se preciso.
**Fora do Projeto (só no download do usuário):** `assets/logo-afisiopop.png`.

### Estrutura de pastas (no computador do usuário e no repositório)
No Projeto do Claude os arquivos ficam todos em `afisiopop/` (sem subpastas, o Projeto não as suporta). No computador, use esta organização; os nomes dos arquivos são os mesmos.

```
afisiopop/
├─ 00-ESTADO-DO-PROJETO.md          ← ler sempre primeiro
├─ 01-planejamento/
│  ├─ dossie.md
│  ├─ marca.md
│  ├─ direcao-de-arte.md
│  ├─ mapa-do-site.md
│  └─ assets-needed.md
├─ 02-conteudo/
│  └─ content.json
├─ 03-design/
│  ├─ design-system.md
│  ├─ design-tokens.css
│  └─ design-tokens.json
├─ 04-secoes/
│  └─ fichas-secoes.md              ← vira 1 arquivo por seção na Fase 10
├─ 05-convencoes/
│  └─ convencao-de-nomes.md
├─ 06-handoff/
│  └─ CLAUDE.md                     ← v0; vai para a RAIZ do repositório
└─ assets/
   └─ logo-afisiopop.png
```
Nas fases seguintes entram `04-secoes/componentes.md` (Fase 7) e, na Fase 10, `06-handoff/` (`PRD.md`, `CLAUDE.md`, `tasks.md`). No build, `02-conteudo/content.json` vira `src/content/content.json` e `03-design/design-tokens.css` vira `src/styles/design-tokens.css`.

## 6. Pendências do cliente (bloqueiam o lançamento, não o planejamento)
Resumo; a lista viva está em `content.json → meta.pendencias_validar` (26 itens) e em `assets-needed.md`.
- WhatsApp oficial (por unidade ou único) · endereços e horários das 3 unidades · confirmar preço R$ 49,99, exceções e "por serviço".
- Tabela POP final (Auriculoterapia, Massagem Abdominal e TENS ficaram de fora até confirmar).
- Responsável técnica, CREFITO, CNPJ (rodapé) · domínio.
- 3–5 depoimentos com nome e autorização · fotos e vídeos reais · SVG do logo.
- Revisão das afirmações de saúde pela responsável técnica e normas de publicidade do CREFITO (não sou advogado: é alerta, não conclusão jurídica).

## 7. Plano das próximas sessões (uma sessão nova por bloco)
| Sessão | Fases | Entrega | Lê |
|---|---|---|---|
| **2** | 6 + 7 | Campo 4 (Layout) e campo 5 (Componentes) de todas as fichas; `componentes.md` | este arquivo, `fichas-secoes.md`, `direcao-de-arte.md`, `design-system.md`, `convencao-de-nomes.md`; consulta `content.json` |
| **3** | 8 + 9 | Campo 6 (Jornada) e campos 7 e 8 (Motion, Mobile) das fichas; mapa macro de scroll | este arquivo, `fichas-secoes.md`, `direcao-de-arte.md` (seção Movimento) |
| **4** | 10 | `PRD.md`, `CLAUDE.md` (inclui a convenção de nomes), `tasks.md` (1ª tarefa = fatia vertical: tokens + header + hero; tarefa de `check-nomes.mjs`), fichas divididas em 1 arquivo por seção, `content.json` final | este arquivo + todos os acima |

## 8. Próxima sessão (Sessão 2: Fases 6 e 7)
**Objetivo:** definir o layout de cada uma das 13 seções (variação do catálogo ou referência do usuário) e especificar só os componentes usados.
**Como começar:** ler este arquivo; abrir `fichas-secoes.md`, `direcao-de-arte.md`, `design-system.md`, `convencao-de-nomes.md`. Consultar `03-CATALOGO-DE-SECOES.md` (variações V1–V4) e `07-COMPONENTES.md` do framework.
**Ponto de atenção:** o usuário quer **peso grande na Superpower**; ele pode enviar prints dela por seção (hero, como funciona, preço, depoimentos). Se enviar, usar como referência de seção; senão, propor as variações já anotadas em cada ficha (campo "Notas de layout") e seguir.
**Perguntas ao usuário:** no máximo uma por vez.
**Ao terminar a sessão:**
1. Atualizar as fichas (campos 4 e 5) e criar `componentes.md`.
2. **Reescrever este arquivo** (seções 2, 3, 4, 8 e o log) para a Sessão 3.
3. Salvar no Projeto, em `afisiopop/`, os arquivos alterados.
4. Dizer ao usuário: "Pode abrir uma nova sessão e colar o prompt de retomada."

## 9. Prompt de retomada (o usuário cola na sessão nova)
```
Retome o projeto A.FISIO POP. Leia só afisiopop/00-ESTADO-DO-PROJETO.md
e siga a seção "Próxima sessão". Não releia o histórico nem os arquivos
originais. Ao terminar, atualize o estado e me avise para abrir outra sessão.
```

## 10. Regras de economia de tokens (valem para todas as sessões)
1. Uma fase (ou par de fases) por sessão. Ao fechar, atualizar este arquivo.
2. Ler este arquivo + os arquivos da fase. Mais nada.
3. Ao editar um arquivo grande do Projeto: `project_read`, mudar, `project_write` do arquivo completo. Por isso, manter arquivos pequenos e por assunto.
4. Respostas ao usuário curtas: o conteúdo vai nos arquivos, não na conversa.
5. Na Fase 10, dividir as fichas em `fichas/{slug}.md`, para o build ler só a seção em que está trabalhando.
6. No build, localizar por nome (`grep` da classe-nome), nunca por leitura de pastas inteiras.

## 11. Log de sessões
| # | Data | Fases | Resumo |
|---|---|---|---|
| 1 | 16/11/2026 | 1–5 | Dossiê, marca, direção de arte, mapa, content.json, fichas, tokens; decisões do usuário (3 unidades, contraste, depoimentos provisórios, copy de saúde); convenção de nomes e este estado |
