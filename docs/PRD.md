# PRD — Site A.FISIO POP (v1)

> Documento de produto do handoff (Fase 10, Sessão 4, 16/11/2026). Resume **o que** se constrói e **por quê**. O **como** está em `CLAUDE.md` (regras), `docs/tasks.md` (ordem de trabalho), `docs/sections/fichas/` (uma ficha por seção) e `content/content.json` (texto). Em conflito, vale: `content.json` (texto) > fichas (layout e comportamento) > este PRD (intenção).

## 1. Objetivo
Levar a pessoa que vem do Instagram, pelo celular, a **agendar pelo WhatsApp**. É o **único objetivo e o único CTA principal**: "Agendar meu horário no WhatsApp", mesmo botão, mesmo texto e mesmo destino em todo o site (`site.ctas.principal`).

## 2. Negócio e público
- **A.FISIO POP**, clínica de Fisioterapia & Estética Popular, desde 2024. Unidades: Shopping Vida Nova (Lauro de Freitas), Shopping da Gente e Cajazeiras X (Salvador), BA.
- **Público:** mulheres de 25 a 55 anos que chegam do Instagram **pelo celular** (mobile é o caso principal; 360–430px primeiro).
- **Promessa:** "Cuidar de você não precisa ser caro. Qualquer serviço por R$ 49,99."
- **Tom:** acolhedor, direto, popular, leve e motivador; "você"; frases curtas. Sem urgência falsa, sem contagem regressiva, sem visual de "promoção", sem clínica fria.
- **Direção de arte:** *premium acessível*: estrutura da Superpower (60%), calma da Odyssée (20%), foto/vídeo real à la Biograph (20%), com a identidade POP (rosa `#D6145F` + teal). Detalhe em `docs/direcao-de-arte.md` e `docs/design-system.md`.

## 3. Escopo da v1
Página única (home) com **13 blocos** em ordem, mais dois acessos fixos ao WhatsApp e páginas de sistema.

| # | Bloco | Ficha | CTA principal na tela |
|---|---|---|---|
| 0 | Faixa de preço + header | `fichas/header.md` | CTA no header ≥768px |
| 1 | Hero | `fichas/hero.md` | sim |
| 2 | Barra de confiança | `fichas/prova-rapida.md` | — |
| 3 | Um problema, uma solução | `fichas/problema-solucao.md` | sim (fim da seção) |
| 4 | Serviços (7) | `fichas/servicos.md` | não (links contextuais por serviço) |
| 5 | Como funciona | `fichas/como-funciona.md` | sim |
| 6 | Preço POP | `fichas/preco-pop.md` | sim |
| 7 | Para quem é | `fichas/para-quem.md` | — |
| 8 | Depoimentos (provisórios) | `fichas/depoimentos.md` | — |
| 9 | Unidades | `fichas/unidades.md` | sim |
| 10 | FAQ (7 perguntas) | `fichas/faq.md` | — |
| 11 | CTA final | `fichas/cta-final.md` | sim |
| 12 | Footer | `fichas/footer.md` | — (contato em link de texto) |
| — | Acesso fixo: barra inferior (<768px) e botão flutuante (≥768px) | `fichas/global-acesso-fixo.md` | o mesmo CTA |

**Páginas de sistema:** `404` (copy pronta); `/privacidade` e `/termos` como **rascunho técnico** que exige revisão jurídica (LGPD).

## 4. Fora do escopo (e quando poderia entrar)
| Item | Motivo | Quando entra |
|---|---|---|
| S04 Sobre · S13 Equipe | Sem história, fotos, nomes ou CREFITO com fonte | Quando o cliente enviar |
| S11 Números | Os números reais já estão na barra de confiança | — |
| S14 Antes e depois | Sem casos reais; sensibilidade de publicidade em saúde | Só com autorização e revisão da responsável técnica |
| S15 Galeria · S22 Blog | Sem material | Se houver fotos reais |
| S18 Formulário | O CTA é o WhatsApp | — |
| Banner de cookies | A v1 não tem analytics nem pixel | Se a decisão de analytics mudar (T5.2) |
| Botão "voltar ao topo" | A base da tela já é da barra/flutuante | Reavaliar após testes de uso |
| Motion, GSAP, Lenis; marquee; contador numérico; carrossel; 3D no hero | Peso, calma da marca, WCAG 2.2.2 (decisões M1–M3) | Só se o usuário pedir (pergunta aberta 3) |
| Auriculoterapia, Massagem Abdominal, TENS | Tabela POP não confirmada | Quando a clínica confirmar |

## 5. Requisitos funcionais
1. **CTA único.** Todo `data-cta="principal"` sai de `UiCtaPrincipal`; texto, destino e mensagem vêm de `src/lib/cta.ts` e `whatsapp.ts`. Nenhum outro elemento imita o estilo `ui-botao--primario`.
2. **Link do WhatsApp:** `https://wa.me/{numero}?text={mensagem}` com `encodeURIComponent`. Nos serviços, `{servico}` entra em `mensagem_servico`, e o cliente chega à conversa **com o serviço escolhido**.
3. **Acesso fixo:** no mobile, barra inferior com o texto completo que **esconde quando outro CTA principal está visível** e aparece nos trechos sem CTA; ≥768px, CTA no header + flutuante depois do hero. Regra e valores em `docs/jornada-e-motion.md` §5.
4. **Conteúdo 100% de `content.json`.** Campo vazio **não renderiza** (endereço, horários, mapa, registro profissional). `**palavra**` vira destaque serifado.
5. **Serviços:** 7 cards; mídia só quando houver foto real (`src` ≠ `pendente`).
6. **Unidades:** mapa só ao toque (nenhum iframe no carregamento); CTA por unidade só se houver número por unidade.
7. **FAQ:** `<details>`, funciona sem JS; sem dados estruturados até as respostas serem validadas.
8. **Navegação:** âncoras com `scroll-padding` (nada sob o header ou a barra).
9. **Mapa de eventos** (`cta_principal_click`, `whatsapp_click`, `servico_click`, `faq_open`, `scroll_depth`; extras `menu_open`, `mapa_open`, `solucao_click`) definido em `docs/jornada-e-motion.md` §1b e alimentado por `data-*`; a v1 **não** carrega medição; só com consentimento.
10. **Depoimentos provisórios** exibem selo "provisório" enquanto `provisorio: true`; o build de lançamento falha enquanto houver.

## 6. Requisitos não funcionais
- **Acessibilidade AA:** contraste só pelos pares verificados em `docs/design-system.md`; foco visível; teclado completo; `alt`; `lang="pt-BR"`; alvos de toque ≥ 48px. Sobre `bg-teal` o texto é tinta; texto rosa pequeno usa `--color-primary`, nunca o `brand-pink`.
- **Performance (alvo no build):** LCP < 2,5 s · INP < 200 ms · CLS < 0,1. Hero priorizado, demais imagens `lazy`, dimensões declaradas, nenhum iframe no load, código próprio de motion < 5 KB gzip.
- **Motion (conferido com o `09-MOTION`):** toda receita com nível e 3 versões; N1 com **um** momento N2 ("Um problema, uma solução", só ≥1024). Só `transform` e `opacity`; conteúdo visível sem JS; 3 versões (desktop/tablet, mobile, reduced-motion); nada acima da dobra começa escondido nem espera temporizador (o estado oculto só vale depois do JS de animação pronto); um destaque por tela; rolagem suave desligada no toque; falha segura (M9). Regras em `docs/jornada-e-motion.md`.
- **SEO:** `title` e `description` de `seo.home`; imagem OG pendente; `LocalBusiness` só com dados confirmados (endereço, telefone e horários **não** entram antes); `robots`/`sitemap` e `metadataBase` quando o domínio existir.
- **Privacidade (LGPD):** política, termos e eventual banner são **rascunho técnico** com revisão humana/jurídica obrigatória; pixel/analytics só com consentimento; sem segredos no frontend; sem coleta de dados na v1 (não há formulário).
- **Saúde e publicidade:** sem promessa de resultado, "antes e depois" ou comparação de preço fora do `content.json`. A copy de saúde foi mantida por decisão do cliente (exceto "por uma hora", retirado) e fica `validar` para a responsável técnica e as normas de publicidade do CREFITO (alerta, não conclusão jurídica).
- **Qualidade:** `npm run build`, `lint`, `test` e `check-nomes.mjs` verdes; `/teste-tokens` fora do build de produção (T5.5).

## 7. Decisões fixas (resumo; lista completa e justificativas em `docs/00-ESTADO-DO-PROJETO.md` §3)
Três unidades · um CTA com texto único (preço fica no texto ao redor) · primária `#D6145F`, teal de ação `#007E78`, apoio `#6B6572`, rosa vivo só em destaque grande · Sora 600 + Instrument Serif itálico (1–2 palavras) + Inter · logo **real** em PNG · depoimentos provisórios sem nome ou foto inventados · WhatsApp e endereço de Lauro de Freitas **provisórios** · tema claro com faixas escuras (preço e CTA final) · sem formulário · sem 3D · Next 16 + Tailwind 4 com tokens como únicas medidas · convenção de nomes obrigatória.

Decisões tomadas na Fase 10 (reversíveis, Pausa C): watchdog de falha segura (M9) · `data-motion` só depois do JS pronto e selo do hero **estático** (M10) · um destaque por tela (palco × pulso) · tablet do hero e do preço com mídia/card centralizado abaixo do texto · `cookie-banner` e `voltar-topo` fora da v1 · `/teste-tokens` fora da produção · `404`, `/privacidade` e `/termos` na v1.

## 8. Pendências que bloqueiam o lançamento (`npm run build:launch` falha com 9)
Dependem de dado da clínica; resolver = confirmar e remover `validar`/`provisorio` do `content.json`.
1. **WhatsApp oficial** (hoje `(71) 98865-6153`, de perfil pessoal): é o oficial e vale para as 3 unidades? Se houver número por unidade, o CTA abre escolha de unidade.
2. **Unidades** (3 itens): endereço, horários e mapa; "Shopping Vida Nova" × "Shopping Empresarial Vida Nova".
3. **Registro profissional** no rodapé: responsável técnica, CREFITO, CNPJ.
4. **Depoimentos** (bloco + 3 itens): trocar por 3–5 com nome, cidade e autorização.

Não bloqueiam o `build:launch`, mas bloqueiam o lançamento real: **domínio e DNS**, confirmação do **preço R$ 49,99** (exceções, "por serviço", "avaliação incluída", "na hora"), tabela POP final, revisão das afirmações de saúde, SVG e versão branca do logo, favicon definitivo e imagem OG, fotos e vídeos reais (`docs/assets-needed.md`).

## 9. Riscos
| Risco | Mitigação |
|---|---|
| WhatsApp errado vai ao ar | `check-pendencias` com `LAUNCH=1` falha; confirmar número antes |
| Preço muda e fica texto velho | `meta.ocorrencias_preco` lista os 12 caminhos a atualizar |
| Copy de saúde reprovada pela responsável técnica | Itens `validar` mantidos; revisão antes do lançamento |
| Depoimento provisório com resultado ("andar novamente") | Selo provisório; troca obrigatória; `build:launch` falha |
| Barra do mobile cansa ao ligar/desligar ~6 vezes | Histerese de 300 ms, `ratio ≥ 0,5`; alternativa: só depois do hero (pergunta 4) |
| JS lento ou bloqueado esconde CTA ou conteúdo | Sem JS tudo visível; watchdog de 4 s (M9) |
| LCP ruim sem foto real (o LCP vira texto) | Fontes `swap` com fallback ajustado; foto real do hero é prioridade do cliente |
| Palco N2 causa CLS | Layout decidido antes da 1ª pintura (M8); teste de CLS no T4.1 |

## 10. Critério de pronto da v1
- Todas as tarefas de `docs/tasks.md` até T5 concluídas e registradas no estado.
- DoD comum (C1–C9) e o campo 9 de cada ficha verificados.
- Lighthouse mobile com LCP < 2,5 s, INP < 200 ms, CLS < 0,1 na home.
- `npm run build:launch` passa (zero pendência bloqueante) **somente depois** que a clínica confirmar os dados da seção 8.

## 11. Mapa de documentos
`CLAUDE.md` (raiz) · `docs/00-ESTADO-DO-PROJETO.md` (estado e log) · `docs/tasks.md` · `docs/sections/fichas-secoes.md` (índice, DoD comum) · `docs/sections/fichas/*.md` · `docs/sections/componentes.md` · `docs/convencao-de-nomes.md` · `docs/jornada-e-motion.md` · `docs/conferencia-jornada-motion.md` · `docs/design-system.md` · `styles/design-tokens.css` · `content/content.json` · consulta pontual: `docs/direcao-de-arte.md`, `docs/marca.md`, `docs/dossie.md`, `docs/mapa-do-site.md`, `docs/assets-needed.md`.
