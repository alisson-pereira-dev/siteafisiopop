# Fichas das Seções — A.FISIO POP (fase 4: campos 1–3)

> Fichas iniciadas. Os campos **4 Layout** (fase 6), **5 Componentes** (fase 7), **6 Jornada** (fase 8), **7 Motion** e **8 Mobile** (fase 9) e **9 Critérios de aceite** (fase 10) são preenchidos nas próximas fases. O texto vive em `content.json`; a ficha só aponta para ele.

**DoD padrão** (vale para todas, detalhado na fase 10): conteúdo do `content.json` · só tokens · 360–1440px sem rolagem lateral · contraste AA · imagens com alt e dimensões · foco visível e teclado · motion em 3 versões · nada depende de hover · sem regressão de CLS/LCP · CTA = principal · **nomes conforme `convencao-de-nomes.md`** (classe-nome BEM, `data-section`, `data-conteudo`, `data-cta`, `data-anim`, cabeçalho de arquivo).

---

# Ficha — S00 Faixa de preço + Header

## 1. Identificação
- slug: `header` · Ordem: 0 · Nível: completo · Âncora: `(topo)`

## 2. Função na narrativa
- Orientar e manter o CTA principal sempre à mão. Mostrar o preço único antes de qualquer rolagem.
- Papel na jornada: entrada
- Relação com o CTA principal: é o CTA fixo em todas as telas

## 3. Conteúdo
- Chave: `header / site.menu / site.ctas / site.faixa_topo / site.logo`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: faixa_topo (preço, avaliação incluída)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Variação sugerida: V1 fixo que ganha fundo ao rolar. Logo REAL (PNG), não o redesenho do DS.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S01 Hero

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

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S02 Barra de confiança

## 1. Identificação
- slug: `prova_rapida` · Ordem: 2 · Nível: completo · Âncora: `#confianca`

## 2. Função na narrativa
- Reduzir a dúvida logo abaixo do hero com 4 indicadores reais.
- Papel na jornada: confiança
- Relação com o CTA principal: apoia o CTA do hero com confiança

## 3. Conteúdo
- Chave: `secoes.prova_rapida`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: '+14 mil', '3 unidades', 'Avaliação incluída'
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V2 (4 indicadores curtos). Sem logos inventados; CREFITO entra quando chegar.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

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

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S06 Serviços

## 1. Identificação
- slug: `servicos` · Ordem: 4 · Nível: completo · Âncora: `#servicos`

## 2. Função na narrativa
- Ver os 7 serviços em linguagem de benefício. Cada um leva ao WhatsApp com o serviço já escolhido.
- Papel na jornada: interesse
- Relação com o CTA principal: cada card tem link contextual para o mesmo WhatsApp (não compete com o CTA principal)

## 3. Conteúdo
- Chave: `secoes.servicos`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: Drenagem, Massagem Modeladora, Ventosaterapia, Ortopédica (validar); imagens pendentes
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (cards com ícone Lucide), com foto/vídeo por serviço quando houver.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S07 Como funciona

## 1. Identificação
- slug: `como_funciona` · Ordem: 5 · Nível: completo · Âncora: `#como-funciona`

## 2. Função na narrativa
- Mostrar que é simples: agenda, avalia, sai mais leve.
- Papel na jornada: decisão
- Relação com o CTA principal: CTA principal (meio)

## 3. Conteúdo
- Chave: `secoes.como_funciona`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: 'na hora' (promessa de prazo)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V2 (timeline vertical), vertical também no desktop se o espaço pedir.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S12 Preço POP

## 1. Identificação
- slug: `preco_pop` · Ordem: 6 · Nível: completo · Âncora: `#preco`

## 2. Função na narrativa
- Entender que o preço é único, transparente e cabe todo mês.
- Papel na jornada: decisão
- Relação com o CTA principal: CTA principal (meio), no ponto de maior intenção

## 3. Conteúdo
- Chave: `secoes.preco_pop`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: preço, 'por serviço'
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Faixa escura full-bleed. Sem comparação de mercado inventada.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S05 Para quem é

## 1. Identificação
- slug: `para_quem` · Ordem: 7 · Nível: completo · Âncora: `#para-quem`

## 2. Função na narrativa
- Reconhecer-se (ou não) no público; alinhar expectativa honesta.
- Papel na jornada: decisão
- Relação com o CTA principal: filtra e aquece quem vai chamar

## 3. Conteúdo
- Chave: `secoes.para_quem`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: —
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: Adaptação: lista 'é para você' + bloco 'não é para'.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S10 Depoimentos (provisória)

## 1. Identificação
- slug: `depoimentos` · Ordem: 8 · Nível: completo · Âncora: `#depoimentos`

## 2. Função na narrativa
- Prova social humana. Hoje com 3 comentários do Instagram, sem autor.
- Papel na jornada: confiança
- Relação com o CTA principal: reforça a confiança antes de decidir

## 3. Conteúdo
- Chave: `secoes.depoimentos`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: TODOS provisórios; trocar antes do lançamento
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (grade de cards). Marca de 'provisório' no build, para não ir ao ar sem revisão.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S17 Unidades

## 1. Identificação
- slug: `unidades` · Ordem: 9 · Nível: completo · Âncora: `#unidades`

## 2. Função na narrativa
- Escolher a unidade mais perto e agendar.
- Papel na jornada: conversão
- Relação com o CTA principal: CTA após escolher a unidade

## 3. Conteúdo
- Chave: `secoes.unidades`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: 3 unidades; endereços/horários pendentes; endereço de Lauro de Freitas provisório
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V3 (lista por unidade). Mapa só ao tocar.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S16 FAQ

## 1. Identificação
- slug: `faq` · Ordem: 10 · Nível: completo · Âncora: `#faq`

## 2. Função na narrativa
- Quebrar as objeções finais (preço, avaliação, dor, pós-operatório).
- Papel na jornada: conversão
- Relação com o CTA principal: remove a última objeção antes do CTA final

## 3. Conteúdo
- Chave: `secoes.faq`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: preço e avaliação incluída
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (accordion). Dados estruturados de FAQ só depois de validar as respostas.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S19 CTA final

## 1. Identificação
- slug: `cta_final` · Ordem: 11 · Nível: completo · Âncora: `#agendar`

## 2. Função na narrativa
- Último convite, sem informação nova.
- Papel na jornada: conversão
- Relação com o CTA principal: CTA principal (fim)

## 3. Conteúdo
- Chave: `secoes.cta_final`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: —
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (faixa contrastante escura).

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho

---

# Ficha — S23 Footer

## 1. Identificação
- slug: `footer` · Ordem: 12 · Nível: completo · Âncora: `(rodapé)`

## 2. Função na narrativa
- Fechar com contatos, unidades, links legais e registro profissional.
- Papel na jornada: fecho
- Relação com o CTA principal: repete o contato

## 3. Conteúdo
- Chave: `secoes.footer`
- Campos obrigatórios preenchidos: sim
- Itens `validar`: registro profissional / CNPJ (bloqueia)
- Mídia: ver `assets-needed.md`
- Notas de layout para a fase 6: V1 (colunas). Renderizar registro só quando preenchido.

## 4–9. A preencher nas fases 6 a 10

## 11. Status
rascunho
