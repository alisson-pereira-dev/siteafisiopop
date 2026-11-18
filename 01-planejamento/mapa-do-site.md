# Mapa do Site — A.FISIO POP

**Tipo:** serviço local · **Narrativa:** AIDA + prova local, com um toque de PAS no "Um problema, uma solução" · **Nível:** completo · **Página única (home)** + páginas de sistema.
**CTA principal (único):** "Agendar meu horário no WhatsApp". Definido uma vez em `site.ctas.principal` e referenciado como `@ctas.principal` em todo o site.

## Ordem da narrativa

| # | Seção (slug) | Catálogo | Papel | Fala com o CTA | Motion máx. |
|---|---|---|---|---|---|
| 0 | Faixa de preço + Header (`header`) | S00 | entrada | CTA fixo no header | N1 |
| 1 | Hero (`hero`) | S01 · V1 | entrada | **CTA principal 1** | N1 |
| 2 | Barra de confiança (`prova_rapida`) | S02 · V2 | confiança | — | N1 |
| 3 | Um problema, uma solução (`problema_solucao`) | S03 adaptada | interesse | CTA (meio) via texto de apoio | **N2** (desktop), N1 (mobile) |
| 4 | Serviços (`servicos`) | S06 · V1 | interesse | link contextual por serviço (mensagem pré-preenchida) | N1 |
| 5 | Como funciona (`como_funciona`) | S07 · V2 | decisão | **CTA principal 2** | N1 |
| 6 | Preço POP (`preco_pop`) | S12 adaptada (preço único) | decisão | **CTA principal 3** | N1 |
| 7 | Para quem é (`para_quem`) | S05 adaptada | decisão | — | N1 |
| 8 | Depoimentos (`depoimentos`) | S10 · V1 | confiança | — | N1 |
| 9 | Unidades (`unidades`) | S17 · V3 | conversão | CTA | N0–N1 |
| 10 | FAQ (`faq`) | S16 · V1 | conversão | — | N1 |
| 11 | CTA final (`cta_final`) | S19 · V1 | conversão | **CTA principal 4** | N1 |
| 12 | Footer (`footer`) | S23 · V1 | fecho | contatos | N0–N1 |
| — | WhatsApp flutuante (global) | componente | conversão | mesmo CTA | N1 (pulso) |

O CTA aparece no hero, no meio (como funciona e preço) e no fim. É sempre o mesmo botão, o mesmo texto e o mesmo destino.

## Seções do catálogo que ficaram de fora (e por quê)
| Seção | Motivo | Quando entra |
|---|---|---|
| S04 Sobre | Sem história ou marcos com fonte | Quando o cliente enviar a história real |
| S13 Equipe | Sem fotos, nomes e CREFITO | Quando chegarem (cabe logo antes das Unidades) |
| S11 Números | Os poucos números reais já estão na barra de confiança | — |
| S14 Antes e depois | Sem casos reais e com sensibilidade de publicidade em saúde | Só com autorização e revisão da responsável técnica |
| S15 Galeria / S22 Blog | Sem material | Depois, se houver fotos reais |
| S18 Formulário | O CTA é WhatsApp, não formulário | — |
| S08, S09, S20, S21 | Não se aplicam | — |

## Verificação (checklist do catálogo)
- [x] Cada seção serve ao CTA ou à confiança para chegar a ele
- [x] Todos os campos obrigatórios têm conteúdo (itens sem fonte estão marcados `validar`)
- [x] Nenhuma seção depende de prova inexistente: a de depoimentos está **provisória** e sinalizada
- [x] Sem duas seções com a mesma função (barra de confiança ≠ depoimentos; "problema" ≠ "serviços")
- [x] Ordem entrada → convencimento → conversão
- [x] CTA no hero, no meio e no fim
- [x] Coerente com o nível completo

## Páginas de sistema
`404` (copy pronta) · `/privacidade` e `/termos` (rascunho técnico na Fase 10, **exige revisão jurídica, LGPD**) · banner de cookies (só se houver analytics/pixel não essencial; copy pronta).

## Decisões de conteúdo registradas
1. **Unidades: 3** (segue o briefing). O texto do FAQ do Design System que dizia "duas unidades" foi corrigido.
2. **Um único texto de CTA** em todo o site. O briefing tinha variações ("Quero agendar por R$ 49,99", "Agendar agora por R$ 49,99"); o preço foi movido para o texto ao redor do botão, para que o CTA seja idêntico em toda parte.
3. **Depoimentos provisórios:** os 3 comentários do Instagram entram marcados `provisorio: true`, sem nome inventado e sem foto, atribuídos a "Cliente da A.FISIO POP · comentário no Instagram". A lista de pendências do lançamento exige a troca ou a confirmação.
4. **Copy de saúde:** mantida como no briefing, a pedido do cliente. Mantive `validar` nos itens com afirmação de resultado para a responsável técnica poder revisar. A única mudança foi retirar "por uma hora" (duração não confirmada).
5. **Dados de contato recebidos por print** (telefone e endereço de um perfil pessoal do Facebook) entram como **provisórios**: o telefone como WhatsApp do CTA e o endereço na unidade de Lauro de Freitas, ambos `validar`. O e-mail pessoal e o histórico profissional do perfil **não** entram no site.
6. **Auriculoterapia, Massagem Abdominal e TENS/Eletroterapia** ficaram fora dos cards até a tabela POP ser confirmada.
