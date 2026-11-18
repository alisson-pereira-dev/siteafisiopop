# CLAUDE.md — A.FISIO POP (v0, provisório)

> **Versão 0, criada na Sessão 1 (fases 1–5).** Falta fechar as fases 6–9 (layout, componentes, jornada, motion) e o handoff completo (Fase 10), que gera a versão final deste arquivo, o `PRD.md` e o `tasks.md`. Até lá, **só se constrói o que está na seção "Pode ser feito agora"**. Não adivinhe layout, jornada ou animação.

## Contexto
- **Negócio:** A.FISIO POP, clínica de Fisioterapia & Estética Popular, desde 2024. Unidades: Shopping Vida Nova (Lauro de Freitas), Shopping da Gente e Cajazeiras X (Salvador), BA.
- **Objetivo único / CTA principal:** agendar pelo WhatsApp. Texto: "Agendar meu horário no WhatsApp". É o **mesmo botão, texto e destino em todo o site**.
- **Promessa:** "Cuidar de você não precisa ser caro. Qualquer serviço por R$ 49,99."
- **Público:** mulheres de 25 a 55 anos que chegam do Instagram **pelo celular**. Mobile é o caso principal.
- **Tom de voz:** acolhedor, direto, popular, leve e motivador; "você"; frases curtas.
- **Direção de Arte:** *premium acessível*: editorial claro e arejado, estrutura da Superpower (peso 60%), calma da Odyssée (20%), foto/vídeo real à la Biograph (20%), com a identidade POP (rosa + teal). Sem visual de "promoção" e sem clínica fria.
- **Nível:** completo · **Motion:** N1 com 1 momento N2 ("Um problema, uma solução"), **sem N3**.

## Fontes da verdade
| O quê | Onde |
|---|---|
| Texto, CTAs, SEO, pendências | `content/content.json` — **nenhum texto fixo em componente** |
| Cores, fontes, espaço, sombra, raio, motion | `styles/design-tokens.css` — **nenhum valor literal** |
| Regras e justificativas dos tokens | `docs/design-system.md` |
| Seções (ficha por seção) | `docs/sections/fichas-secoes.md` |
| Nomes de classes, `data-*`, arquivos | `docs/convencao-de-nomes.md` — **obrigatória** |
| Estado e próximos passos | `docs/00-ESTADO-DO-PROJETO.md` |
| Direção de arte, marca, fatos | `docs/direcao-de-arte.md`, `docs/marca.md`, `docs/dossie.md` (consultar só se precisar) |

## Estrutura do repositório
```
/CLAUDE.md
/docs/                (planejamento: estado, design-system, convencao-de-nomes, direcao-de-arte, marca, dossie, mapa-do-site, assets-needed)
/docs/sections/       (fichas)
/content/content.json
/styles/design-tokens.css · design-tokens.json
/public/assets/       (logo-afisiopop.png e demais mídias)
/src/secoes/{slug}/   (um componente por seção)
/src/ui/              (componentes compartilhados, prefixo ui-)
/src/lib/             (helpers: conteúdo, CTA, WhatsApp)
/scripts/             (check-nomes.mjs, check-pendencias.mjs)
```

## Pode ser feito agora (tarefas T0 e T1.1)
1. **T0.1** Criar o projeto: Next.js (App Router) + TypeScript + Tailwind. O boilerplate do framework ainda não existe; as bibliotecas de motion (Motion, GSAP, Lenis) são **papéis** definidos em `09-MOTION`, não versões travadas, e **só entram quando a Fase 9 estiver pronta**. Aceite: `dev`, `build` e `lint` rodam.
2. **T0.2** Copiar `content.json`, tokens, docs e logo para os caminhos acima. Aceite: tokens carregados globalmente.
3. **T0.3** Mapear os tokens no tema do Tailwind (`bg-surface`, `text-muted`, `rounded-lg`, `rounded-icon`, `shadow-1…4`, `text-h2` etc.) apontando para `var(--...)`. Aceite: nenhuma classe com cor ou medida literal.
4. **T0.4** Fontes com `next/font` (self-host, `display: swap`): Sora 600, Instrument Serif itálico, Inter 400/600. `lang="pt-BR"`. Favicon provisório.
5. **T0.5** Helpers em `src/lib`: ler o conteúdo; resolver `@ctas.*` **em um só lugar**; montar o link `https://wa.me/{numero}?text={mensagem}` com `encodeURIComponent` (para os serviços, trocar `{servico}` em `mensagem_servico`); renderizar `**palavra**` como `<span class="accent-serif">`. Aceite: testes simples dos helpers.
6. **T0.6** `scripts/check-pendencias.mjs`: lista os caminhos com `validar: true` e `provisorio: true`. Em desenvolvimento só avisa; no build de lançamento (`LAUNCH=1`) **falha** enquanto houver pendência bloqueante (WhatsApp, endereços, registro profissional, depoimentos provisórios). Aceite: roda no `build`.
7. **T1.1** Página de teste com a escala tipográfica, a paleta e os pares de contraste. Aceite: bate com `docs/design-system.md`.

**Não construir ainda:** header, hero e demais seções. Os campos Layout, Componentes, Jornada, Motion e Mobile das fichas estão vazios até as fases 6–9. Quando estiverem prontos, este arquivo e o `tasks.md` serão atualizados com a fatia vertical (tokens + header + hero) como primeira tarefa visual.

## Regras inegociáveis
- **Mobile-first.** Testar 360–430px primeiro.
- **Um único CTA principal** (`site.ctas.principal`), sempre com o mesmo estilo (`ui-botao--primario`). Nenhum outro elemento o imita. Os links de serviço são contextuais e discretos.
- **Fatos só com fonte.** Itens `validar: true` e `provisorio: true` não são apresentados como verdade definitiva; manter a marcação. **Não inventar conteúdo**: faltou dado, usar o texto neutro do `content.json` ou sinalizar. Registro profissional vazio **não renderiza**.
- **Acessibilidade AA:** contraste (usar só os pares verificados em `docs/design-system.md`), foco visível, teclado, `alt`, `lang="pt-BR"`. Sobre `bg-teal` o texto é sempre tinta; texto rosa pequeno usa `--color-primary`, nunca o `brand-pink`.
- **Motion** (quando entrar): as 10 regras de `09-MOTION`; 3 versões por animação (desktop, mobile, reduced-motion); uma biblioteca por elemento; só `transform` e `opacity`; conteúdo visível sem JS; nada depende de hover; sem scroll-jacking no mobile; Lenis desligado no toque.
- **Performance (alvo, verificado no build):** LCP < 2,5s · INP < 200ms · CLS < 0,1. Imagem do hero priorizada, demais com lazy, dimensões declaradas.
- **Sem segredos no frontend.**
- **Privacidade:** política, termos e banner de cookies são **rascunho técnico** e precisam de revisão humana/jurídica (LGPD). Pixel/analytics só com consentimento.
- **Saúde e publicidade:** não acrescentar promessas de resultado, "antes e depois" ou comparações de preço que não estejam no `content.json`.

## Convenção de nomes (resumo; vale `docs/convencao-de-nomes.md`)
- Todo elemento estrutural tem **classe-nome BEM em pt-BR** como **primeira classe**: `servicos__card-icone`. Sem `div` anônimo; proibidos `wrapper`, `box`, `inner`, `item` sozinho.
- Raiz da seção: `id`, `data-section`, `data-ficha`, `data-conteudo` (caminho no `content.json`).
- CTA: `data-cta="principal"` + `data-cta-local`. Itens repetidos: `data-item`.
- Animações selecionam **só** `[data-anim]`.
- Pasta `src/secoes/{slug}/`, componente em PascalCase; todo arquivo abre com **cabeçalho de localização** (seção, ficha, chave do conteúdo, elementos).
- Para achar algo: `grep -rn "classe-nome" src/`. Abrir só o arquivo encontrado.

## Decisões do projeto
| Decisão | Valor | Motivo |
|---|---|---|
| Nível de motion | N1, 1 momento N2 | Tráfego mobile do Instagram; direção calma |
| 3D no hero | não | Custo alto, ganho baixo para esse público |
| Tema | claro, com seções escuras (`bg-inverse`) | Direção de arte |
| Formulário | não | O CTA é o WhatsApp |
| Analytics | a definir (cliques no WhatsApp via `data-cta`) | Só com consentimento |
| Logo | PNG transparente real; SVG e versão branca pendentes | Cliente |
| Cor primária | `#D6145F` | AA com texto branco e perto do carmim do logo |

## Skills a usar
A definir na Fase 10, quando o boilerplate e a lista de skills existirem.

## Mudanças em relação ao boilerplate
Ainda não há boilerplate. Registrar aqui o que for criado do zero e merecer virar boilerplate: tokens semânticos, helper de CTA/WhatsApp, `check-nomes.mjs`, `check-pendencias.mjs`.

## Definition of Done (global)
- [ ] Conteúdo vem do `content.json`
- [ ] Só tokens, sem valores literais
- [ ] Responsivo 360px → 1440px+ sem rolagem lateral
- [ ] AA, foco, teclado, `alt`
- [ ] Nomes conforme a convenção (`check-nomes.mjs` passa)
- [ ] Motion nas 3 versões (quando houver)
- [ ] Sem regressão de performance
- [ ] Build e lint sem erros

## Quando estiver em dúvida
Perguntar antes de assumir. Preferir a opção mais simples que atenda à ficha. Se faltar algo do planejamento, **parar e avisar** em vez de decidir layout, jornada ou animação por conta própria.
