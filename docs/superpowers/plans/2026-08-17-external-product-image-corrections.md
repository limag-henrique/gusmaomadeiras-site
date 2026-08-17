# External Product Image Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recriar as imagens de uso dos 38 produtos indicados, mantendo fielmente cada peça e mostrando-a instalada pelo lado externo de uma residência realista.

**Architecture:** Cada `image` será tratado como alvo de edição pelo ImageGen integrado, e cada entrada de `images` será uma referência complementar do mesmo produto. As imagens candidatas ficarão fora dos destinos do catálogo até passarem por comparação visual; somente candidatas aprovadas serão convertidas para WebP e substituirão os respectivos caminhos `aiImage`.

**Tech Stack:** Site estático HTML/JavaScript, JSON, WebP, ImageGen integrado, Python 3 com Pillow para inventário/conversão/folhas de revisão, PowerShell e Graphify.

## Global Constraints

- Trabalhar somente na branch atual; não trocar de branch.
- Não criar commits automaticamente.
- Corrigir somente os IDs filtrados `0, 4, 5, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 40, 41, 42, 44, 48, 49, 64, 65, 68, 69, 70, 71, 74, 85, 86, 87, 88, 89`.
- Usar o ID depois da filtragem de `productsData` em `js/app.js`, não o índice bruto de `data.json`.
- Usar `image` como alvo principal e `images` somente como referências complementares definitivas.
- Mostrar exclusivamente o lado externo da residência.
- Preservar proporção, folhas, painéis, vidros, venezianas, almofadas, travessas, montantes, ferragens, curvas, arcos, desenhos, acabamento e sentido de abertura.
- Mostrar alizares completos e visíveis e um vão com profundidade arquitetônica plausível.
- Permitir beiral, continuação da parede, piso externo e jardim distante somente quando afastados da peça.
- Proibir pedras, cascalho, rochas, vasos, bancos, luminárias ou ornamentos sobre, acima, abaixo, encostados ou sobrepostos ao produto.
- Proibir aparência de peça chapada, flutuante, colada, pendurada, projetada sobre a parede ou enterrada sem alizares.
- Não alterar `data.json`, `js/app.js`, títulos, IDs, rotas ou caminhos do catálogo.
- Não sobrescrever um `aiImage` antes de aprovar visualmente a candidata.
- Se uma candidata modificar a peça, descartá-la e fazer uma tentativa dirigida; não aceitar parcialmente.

---

### Task 1: Inventariar o escopo e preparar a revisão visual

**Files:**
- Read: `data.json`
- Read: `js/app.js`
- Read: `Images/*.webp`
- Read: `Images/ai-usage/*.webp`
- Create temporarily: `tmp/external-image-review/manifest.json`
- Create temporarily: `tmp/external-image-review/baseline-01.jpg` through `tmp/external-image-review/baseline-08.jpg`

**Interfaces:**
- Consumes: array `data.products` e a regra de filtragem de `productsData`.
- Produces: manifesto com `id`, `title`, `image`, `images`, `aiImage`, dimensões e grupo de revisão; oito folhas de linha de base.

- [ ] **Step 1: Gerar o manifesto dos 38 IDs filtrados**

Usar Python para aplicar exatamente a filtragem `"/page/" not in product["url"]` e `product["title"].strip().lower() != "produtos"`. Para cada ID, registrar os campos `id`, `title`, `image`, `images`, `aiImage`, `originalSize` e `currentAiSize`.

Expected: `manifest.json` contém exatamente 38 objetos, em ordem crescente de ID, sem caminhos ausentes.

- [ ] **Step 2: Validar todas as entradas antes de gerar**

Run:

```powershell
python -c "import json,pathlib; m=json.load(open('tmp/external-image-review/manifest.json',encoding='utf-8')); assert len(m)==38; missing=[str(p) for x in m for p in [x['image'],*x['images'],x['aiImage']] if not pathlib.Path(p).is_file()]; assert not missing, missing; print('38 products and all source paths verified')"
```

Expected: `38 products and all source paths verified`.

- [ ] **Step 3: Gerar oito folhas de linha de base**

Montar folhas com até cinco linhas, mostrando ID, título, referência principal e IA atual. Usar fundo neutro e conter cada imagem sem recortar a peça.

Expected: oito JPGs legíveis em `tmp/external-image-review/`.

- [ ] **Step 4: Inspecionar todas as folhas**

Abrir cada folha com `view_image`. Para detalhes pequenos, abrir individualmente a referência principal, as referências complementares e a IA atual. Registrar no manifesto a contagem e a disposição dos componentes que não podem mudar.

- [ ] **Step 5: Confirmar que nenhuma imagem do catálogo foi alterada**

Run:

```powershell
git status --short
```

Expected: somente documentação e arquivos temporários aparecem como novos; nenhum arquivo em `Images/ai-usage/` está modificado.

---

### Task 2: Corrigir portas maciças e marchetadas

**Files:**
- Replace after approval: `Images/ai-usage/porta-de-angelim-36-bigbrother-espacada-ia.webp` (ID 4)
- Replace after approval: `Images/ai-usage/porta-de-angelim-26-bigbrother-ia.webp` (ID 5)
- Replace after approval: `Images/ai-usage/porta-de-angelim-25-mexicana-ia.webp` (ID 15)
- Replace after approval: `Images/ai-usage/porta-de-angelim-104-estruturada-ia.webp` (ID 64)
- Replace after approval: `Images/ai-usage/porta-de-angelim-35-marchetada-vertical-ia.webp` (ID 71)
- Create temporarily: `tmp/external-image-review/candidates/id-04.*`
- Create temporarily: `tmp/external-image-review/candidates/id-05.*`
- Create temporarily: `tmp/external-image-review/candidates/id-15.*`
- Create temporarily: `tmp/external-image-review/candidates/id-64.*`
- Create temporarily: `tmp/external-image-review/candidates/id-71.*`

**Interfaces:**
- Consumes: referências e ficha geométrica dos cinco IDs no manifesto.
- Produces: cinco WebPs externos aprovados, com folha, batente, alizares e vão de porta plausíveis.

- [ ] **Step 1: Abrir as referências de cada porta**

Usar `view_image` antes de cada edição. Para o ID 5, usar as três imagens adicionais para confirmar as réguas; para o ID 71, confirmar qual face corresponde ao exterior.

- [ ] **Step 2: Gerar uma candidata separada por ID**

Usar uma chamada do ImageGen por produto com este molde, preenchendo os componentes exatos observados:

```text
Use case: precise-object-edit
Asset type: fotografia de catálogo para o site Gusmão Madeiras
Input images: Image 1: alvo de edição e fonte definitiva da porta; Images 2..N: referências complementares do mesmo produto
Primary request: preservar integralmente a porta da Image 1 e construir somente o exterior de uma residência ao redor dela
Scene/backdrop: fachada externa residencial brasileira simples, confortável e bem conservada, com contexto discreto afastado da peça
Composition/framing: porta inteira em destaque, ocupando aproximadamente metade da imagem; câmera no lado externo
Lighting/mood: luz diurna natural e sombras de contato realistas
Constraints: preservar exatamente o desenho, contagem e posição das réguas ou painéis; mostrar folha, batente, marco, alizares completos e profundidade do vão; a porta deve parecer instalada e operável
Avoid: redesenhar a porta; vista interna; peça chapada ou colada; pedras; cascalho; vasos; bancos; luminárias; ornamentos; decoração sobre ou encostada na peça; texto; logotipo; marca-d'água
```

- [ ] **Step 3: Validar cada candidata antes da substituição**

Comparar referência e candidata lado a lado. Rejeitar diferenças no número, largura, direção e posição das réguas, no acabamento da madeira ou na orientação externa. Confirmar alizares visíveis e sombra de contato em toda a volta aplicável.

- [ ] **Step 4: Corrigir somente a divergência observada**

Se necessário, fazer uma nova edição por ID nomeando um único erro, repetindo as invariantes e pedindo para manter todo o restante inalterado.

- [ ] **Step 5: Converter e instalar as cinco candidatas aprovadas**

Converter para RGB WebP com qualidade 92 e método 6, gravando somente nos cinco destinos `aiImage` listados nesta tarefa.

- [ ] **Step 6: Gerar e inspecionar `review-doors.jpg`**

Mostrar referência e resultado lado a lado para os IDs 4, 5, 15, 64 e 71. Reabrir individualmente qualquer item cuja geometria ou instalação não esteja clara na folha.

---

### Task 3: Corrigir janelas retangulares e de vidro temperado

**Files:**
- Replace after approval: `Images/ai-usage/janela-de-angelim-41-panoramica-de-correr-ia.webp` (ID 0)
- Replace after approval: `Images/ai-usage/janela-de-angelim-44-panoramica-de-correr-ia.webp` (ID 21)
- Replace after approval: `Images/ai-usage/janela-de-angelim-10-dupla-de-correr-ia.webp` (ID 28)
- Replace after approval: `Images/ai-usage/janela-de-angelim-06-vidro-quadriculado-de-correr-ia.webp` (ID 29)
- Replace after approval: `Images/ai-usage/janela-de-angelim-17-vidro-quadriculado-de-correr-ia.webp` (ID 30)
- Replace after approval: `Images/ai-usage/janela-de-angelim-18-vidro-quadriculado-ia.webp` (ID 32)
- Replace after approval: `Images/ai-usage/janela-de-angelim-t102-com-vidro-temperado-ia.webp` (ID 48)
- Replace after approval: `Images/ai-usage/janela-de-angelim-t101-com-vidro-temperado-ia.webp` (ID 49)
- Create temporarily: `tmp/external-image-review/candidates/id-00.*`, `id-21.*`, `id-28.*`, `id-29.*`, `id-30.*`, `id-32.*`, `id-48.*`, `id-49.*`

**Interfaces:**
- Consumes: referências e fichas geométricas dos oito IDs.
- Produces: oito WebPs externos aprovados com contagens e ferragens preservadas.

- [ ] **Step 1: Abrir todas as referências antes da edição**

Contar folhas, montantes, travessas e vidros. Nos IDs 48 e 49, registrar posição e quantidade das ferragens pretas; no ID 49, usar todas as referências complementares.

- [ ] **Step 2: Gerar uma candidata por modelo**

Usar o molde da Task 2, substituindo `porta` por `janela` e incluindo no prompt a contagem exata registrada. Exigir câmera no exterior, alizares completos, rebaixo e espessura de parede visíveis.

- [ ] **Step 3: Validar estrutura, instalação e contexto**

Rejeitar qualquer alteração na quantidade de folhas, divisões, vidros ou ferragens. Rejeitar enquadramento de parede sem contexto residencial ou produto que pareça embutido sem alizar.

- [ ] **Step 4: Fazer correções dirigidas**

Uma nova tentativa por falha, descrevendo somente a divergência observada e repetindo as contagens e invariantes.

- [ ] **Step 5: Converter e instalar as oito candidatas aprovadas**

Converter para RGB WebP com qualidade 92 e método 6, nos destinos listados.

- [ ] **Step 6: Gerar e inspecionar `review-rectangular-windows.jpg`**

Verificar lado externo, alizares, vão, contexto e fidelidade de todos os oito pares.

---

### Task 4: Corrigir janelas com venezianas, desenhos distintivos e perfis curvos

**Files:**
- Replace after approval: `Images/ai-usage/janela-de-angelim-01-imperial-dupla-ia.webp` (ID 22)
- Replace after approval: `Images/ai-usage/janela-de-angelim-02-dupla-vidro-e-veneziana-ia.webp` (ID 23)
- Replace after approval: `Images/ai-usage/janela-de-angelim-04-napoleao-dupla-ia.webp` (ID 24)
- Replace after approval: `Images/ai-usage/janela-de-angelim-37-dupla-vidro-e-almofada-diagonal-ia.webp` (ID 25)
- Replace after approval: `Images/ai-usage/janela-de-angelim-09-imperial-de-abrir-por-fora-e-correr-interno-ia.webp` (ID 26)
- Replace after approval: `Images/ai-usage/janela-de-angelim-29-abrir-por-fora-e-correr-interno-ia.webp` (ID 27)
- Replace after approval: `Images/ai-usage/janela-de-angelim-31-tucano-de-correr-ia.webp` (ID 31)
- Replace after approval: `Images/ai-usage/janela-de-angelim-32-napoleao-de-vidro-ia.webp` (ID 33)
- Replace after approval: `Images/ai-usage/janela-de-angelim-33-imperial-de-vidro-ia.webp` (ID 34)
- Replace after approval: `Images/ai-usage/janela-de-angelim-39-vidro-diagonal-ia.webp` (ID 35)
- Replace after approval: `Images/ai-usage/janela-de-angelim-42-bigbrother-de-correr-ia.webp` (ID 65)
- Replace after approval: `Images/ai-usage/janela-de-angelim-26-almofada-ia.webp` (ID 85)
- Replace after approval: `Images/ai-usage/janela-de-angelim-34-mexicana-ia.webp` (ID 87)
- Replace after approval: `Images/ai-usage/janela-de-angelim-35-imperial-mexicana-ia.webp` (ID 88)
- Replace after approval: `Images/ai-usage/janela-de-angelim-40-bigbrother-ia.webp` (ID 89)
- Create temporarily: one candidate file per ID under `tmp/external-image-review/candidates/`

**Interfaces:**
- Consumes: referências e fichas geométricas dos 15 IDs.
- Produces: 15 WebPs externos aprovados, preservando perfis curvos, venezianas, diagonais, desenhos Tucano e painéis maciços.

- [ ] **Step 1: Inspecionar individualmente todas as referências**

Registrar contagens e direções das diagonais, divisões dos vidros, folhas externas, venezianas, painéis maciços e perfis superiores. Para IDs 22, 24, 33, 34 e 88, registrar altura, raio e transição lateral da curva.

- [ ] **Step 2: Gerar uma candidata separada por ID**

Usar o molde de janela da Task 3 e acrescentar a geometria exata de cada item. Para os perfis curvos, acrescentar:

```text
Critical invariant: preserve the exact upper contour from Image 1: curve height, radius, center profile, side transitions, border thickness and trim profile. Do not replace it with a generic arch or a straight lintel.
```

- [ ] **Step 3: Validar o ID 65 com todas as referências**

Confirmar número, largura e posição das folhas de correr e dos painéis BigBrother. Rejeitar qualquer simplificação ou organização diferente.

- [ ] **Step 4: Validar perfis curvos em ampliação**

Criar recortes ampliados do terço superior da referência e da candidata para IDs 22, 24, 33, 34 e 88. Curva apenas semelhante não é suficiente.

- [ ] **Step 5: Validar instalação e contexto**

Confirmar alizares completos, espessura de parede, sombra de contato e contexto de fachada. Rejeitar peças que pareçam painéis pendurados ou encaixados sem instalação.

- [ ] **Step 6: Corrigir divergências uma por vez**

Repetir a edição somente para os itens reprovados, nomeando a divergência e preservando o restante.

- [ ] **Step 7: Converter e instalar as 15 candidatas aprovadas**

Converter para RGB WebP com qualidade 92 e método 6, nos destinos listados.

- [ ] **Step 8: Gerar e inspecionar `review-distinctive-windows.jpg`**

Incluir pares completos e ampliações dos cinco perfis curvos.

---

### Task 5: Corrigir modelos com arco colonial

**Files:**
- Replace after approval: `Images/ai-usage/bascula-de-angelim-03a-vidro-quadriculado-com-arco-colonial-ia.webp` (ID 36)
- Replace after approval: `Images/ai-usage/janela-de-angelim-18a-vidro-quadriculado-com-arco-colonial-ia.webp` (ID 68)
- Replace after approval: `Images/ai-usage/janela-de-angelim-26a-almofada-com-arco-colonial-ia.webp` (ID 69)
- Replace after approval: `Images/ai-usage/janela-de-angelim-02a-dupla-vidro-e-veneziana-com-arco-colonial-ia.webp` (ID 70)
- Replace after approval: `Images/ai-usage/seteira-de-angelim-01a-vidro-quadriculado-com-arco-colonial-ia.webp` (ID 74)
- Replace after approval: `Images/ai-usage/janela-de-angelim-05a-vidro-e-almofada-com-arco-colonial-ia.webp` (ID 86)
- Create temporarily: one candidate file per ID under `tmp/external-image-review/candidates/`

**Interfaces:**
- Consumes: referências e fichas geométricas dos seis IDs.
- Produces: seis WebPs externos aprovados com arco, divisões radiais, folhas inferiores e abertura preservados.

- [ ] **Step 1: Inspecionar cada arco em resolução original**

Registrar altura, raio, número e ângulo das divisões radiais, espessura da moldura, travessa horizontal e componentes inferiores.

- [ ] **Step 2: Gerar uma candidata separada por ID**

Usar o molde de janela e repetir explicitamente todas as contagens do arco e da parte inferior. Proibir arco de alvenaria extra e acabamento de pedra.

- [ ] **Step 3: Validar o formato e a abertura do ID 68**

Comparar com a referência principal e confirmar que as divisões radiais, as folhas inferiores e o sistema de abertura foram preservados sem simplificação.

- [ ] **Step 4: Validar todos os arcos em ampliação**

Rejeitar qualquer diferença em raio, altura, número de raios, travessa ou encontro com as laterais.

- [ ] **Step 5: Corrigir divergências uma por vez**

Repetir todas as invariantes e nomear somente o erro observado em cada nova tentativa.

- [ ] **Step 6: Converter e instalar as seis candidatas aprovadas**

Converter para RGB WebP com qualidade 92 e método 6, nos destinos listados.

- [ ] **Step 7: Gerar e inspecionar `review-colonial.jpg`**

Incluir imagens completas e ampliações dos arcos dos seis IDs.

---

### Task 6: Corrigir básculas externas e porta de correr

**Files:**
- Replace after approval: `Images/ai-usage/bascula-de-angelim-15-panoramica-ia.webp` (ID 40)
- Replace after approval: `Images/ai-usage/bascula-de-angelim-11-tucano-ia.webp` (ID 41)
- Replace after approval: `Images/ai-usage/bascula-de-angelim-t202-com-vidro-temperado-ia.webp` (ID 42)
- Replace after approval: `Images/ai-usage/porta-de-correr-de-angelim-07-panoramica-ia.webp` (ID 44)
- Create temporarily: one candidate file per ID under `tmp/external-image-review/candidates/`

**Interfaces:**
- Consumes: referências e fichas geométricas dos quatro IDs.
- Produces: quatro WebPs externos aprovados com desenho e abertura preservados.

- [ ] **Step 1: Inspecionar mecanismos e lados de abertura**

Para o ID 40, registrar o marco simples e o mecanismo panorâmico correto. Para o ID 41, registrar o desenho Tucano e o lado externo. Para o ID 42, registrar ferragens, corrente e movimento do vidro temperado. Para o ID 44, contar as quatro folhas verticais.

- [ ] **Step 2: Gerar uma candidata separada por ID**

Usar o molde de edição fiel, exigir câmera externa e descrever explicitamente o mecanismo observado. A candidata deve mostrar a peça instalada em fachada residencial, não em cozinha, banheiro ou outro ambiente interno.

- [ ] **Step 3: Validar os erros prioritários**

- ID 40: desenho idêntico à referência, sem folha maxim-ar inventada.
- ID 41: orientação externa e desenho Tucano preservado.
- ID 42: formato, ferragens e sistema de abertura idênticos à referência.
- ID 44: quatro folhas verticais e trilho de correr preservados.

- [ ] **Step 4: Corrigir divergências uma por vez**

Fazer nova edição somente nos itens reprovados, mantendo os demais atributos inalterados.

- [ ] **Step 5: Converter e instalar as quatro candidatas aprovadas**

Converter para RGB WebP com qualidade 92 e método 6, nos destinos listados.

- [ ] **Step 6: Gerar e inspecionar `review-openings.jpg`**

Confirmar lado externo, alizares, mecanismos, contexto e fidelidade dos quatro pares.

---

### Task 7: Validar o catálogo completo e atualizar o grafo local

**Files:**
- Verify: the 38 `Images/ai-usage/*.webp` files listed in Tasks 2–6
- Verify: `data.json`
- Verify: `js/app.js`
- Create temporarily: `tmp/external-image-review/final-01.jpg` through `tmp/external-image-review/final-08.jpg`
- Update locally if Graphify produces changes: `graphify-out/`

**Interfaces:**
- Consumes: 38 imagens aprovadas e instaladas.
- Produces: catálogo validado, oito folhas finais e grafo local atualizado.

- [ ] **Step 1: Validar todos os caminhos e formatos**

Para cada registro do manifesto, confirmar que `image`, todas as entradas de `images` e `aiImage` existem. Abrir os 38 `aiImage` com Pillow, confirmar `format == "WEBP"`, largura e altura positivas e ausência de corrupção.

- [ ] **Step 2: Confirmar que catálogo e código continuam válidos**

Run:

```powershell
node -e "JSON.parse(require('fs').readFileSync('data.json','utf8')); new Function(require('fs').readFileSync('js/app.js','utf8')); console.log('data.json and js/app.js valid')"
```

Expected: `data.json and js/app.js valid`.

- [ ] **Step 3: Confirmar que metadados do catálogo não mudaram**

Run:

```powershell
git diff -- data.json js/app.js
```

Expected: sem saída.

- [ ] **Step 4: Gerar oito folhas de revisão final**

Mostrar ID, título, referência original e resultado final para todos os 38 IDs, sem recortar as peças.

- [ ] **Step 5: Inspecionar todas as folhas finais**

Confirmar novamente os dez critérios de aceitação da especificação. Abrir individualmente qualquer imagem cuja instalação, curva, arco, desenho ou mecanismo não esteja claro.

- [ ] **Step 6: Executar verificações do Git**

Run:

```powershell
git diff --check
git status --short
```

Expected: sem erros de whitespace; somente a documentação, os 38 WebPs aprovados e eventuais artefatos Graphify aparecem como mudanças rastreadas ou novas.

- [ ] **Step 7: Atualizar o Graphify**

Run:

```powershell
graphify update .
```

Expected: comando concluído sem erro; qualquer saída permanece como artefato local e não é commitada automaticamente.

- [ ] **Step 8: Relatar resultados e limitações**

Listar quantos dos 38 produtos foram substituídos e indicar explicitamente qualquer ID mantido com a imagem anterior por não atingir os critérios. Informar os caminhos das folhas finais e confirmar que nenhum commit, push ou troca de branch foi realizado.
