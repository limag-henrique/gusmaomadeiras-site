# Window Image Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recriar e publicar as 30 imagens ambientadas de janelas do catálogo, preservando integralmente a geometria de cada fotografia original e mostrando o produto instalado no exterior de uma residência realista.

**Architecture:** Cada referência principal será tratada como alvo de edição pelo ImageGen integrado; referências adicionais serão usadas somente para confirmar detalhes construtivos. As versões candidatas permanecerão fora do catálogo até passarem por comparação visual e validação estrutural, quando serão convertidas para WebP e substituirão os caminhos `aiImage` existentes.

**Tech Stack:** HTML/JavaScript estático, JSON, WebP, ImageGen integrado, PowerShell, Node.js, Python/Pillow somente para folhas de revisão e conversão de formato, Git/GitHub.

## Global Constraints

- Mostrar exclusivamente o lado externo da casa.
- Usar `image` como alvo principal e `images` como referências complementares definitivas.
- Não redesenhar, simplificar, remover, inventar ou modificar componentes da janela.
- Preservar moldura, bordas, arcos, curvaturas, guarnições, divisões, proporções, ferragens e detalhes construtivos.
- Integrar cada janela naturalmente a uma residência confortável e bem conservada, com profundidade, perspectiva, sombras, materiais, escala e luz plausíveis.
- Não adicionar pedras, cascalho, rochas decorativas, vasos, bancos, ornamentos, luminárias ou outros objetos desnecessários.
- Rejeitar qualquer candidato que altere o produto; nunca publicar uma versão sabidamente incorreta.
- Manter IDs, títulos, referências e caminhos `aiImage` de `data.json` inalterados.
- Substituir as imagens atuais somente depois da aprovação visual de cada candidato.

---

### Task 1: Criar inventário verificável dos 30 modelos

**Files:**
- Read: `data.json`
- Read: `Images/*.webp`
- Create temporarily: `tmp/window-review/manifest.json`
- Create temporarily: `tmp/window-review/baseline-01.jpg` through `tmp/window-review/baseline-05.jpg`

**Interfaces:**
- Consumes: produtos ativos de `data.json` cujo título contém `Janela`.
- Produces: manifesto com `id`, `title`, `image`, `images`, `aiImage`, proporção e lista de referências; folhas de revisão com original e imagem ambientada atual.

- [ ] **Step 1: Gerar o manifesto a partir do catálogo**

Run:

```powershell
New-Item -ItemType Directory -Force tmp/window-review | Out-Null
@'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const products = data.products.filter(p => !p.url.includes('/page/') && p.title.trim().toLowerCase() !== 'produtos');
const windows = products.map((p, id) => ({ id, ...p })).filter(p => !p.removed && p.title.toLowerCase().includes('janela'));
if (windows.length !== 30) throw new Error(`Expected 30 active windows, got ${windows.length}`);
fs.writeFileSync('tmp/window-review/manifest.json', JSON.stringify(windows, null, 2));
'@ | node -
```

Expected: `tmp/window-review/manifest.json` contém exatamente 30 registros.

- [ ] **Step 2: Verificar a existência de todas as referências e destinos**

Run:

```powershell
@'
const fs = require('fs');
const items = JSON.parse(fs.readFileSync('tmp/window-review/manifest.json', 'utf8'));
for (const p of items) {
  for (const path of [p.image, ...(p.images || []), p.aiImage]) {
    if (!fs.existsSync(path)) throw new Error(`Missing ${p.id}: ${path}`);
  }
}
console.log(`Verified ${items.length} window records`);
'@ | node -
```

Expected: `Verified 30 window records`.

- [ ] **Step 3: Gerar folhas de revisão de referência**

Use Pillow para montar cinco folhas com seis linhas cada. Cada linha deve mostrar ID, título, referência principal e `aiImage` atual sem alterar os arquivos de origem.

Expected: cinco JPGs legíveis em `tmp/window-review/`.

- [ ] **Step 4: Inspecionar todas as referências com `view_image`**

Abrir as cinco folhas e, quando um detalhe estiver pequeno, abrir a fotografia original individual em resolução original. Registrar no manifesto, para cada modelo, contagem de folhas, painéis, vidros, venezianas, almofadas, travessas, montantes, perfil superior e ferragens.

- [ ] **Step 5: Confirmar que o inventário não alterou o projeto**

Run:

```powershell
git status --short
```

Expected: somente `tmp/window-review/` aparece como não rastreado, além dos documentos de planejamento já commitados.

---

### Task 2: Recriar as 13 janelas retangulares e de vidro temperado

**Files:**
- Replace: `Images/ai-usage/janela-de-angelim-41-panoramica-de-correr-ia.webp` (ID 0)
- Replace: `Images/ai-usage/janela-de-angelim-44-panoramica-de-correr-ia.webp` (ID 21)
- Replace: `Images/ai-usage/janela-de-angelim-02-dupla-vidro-e-veneziana-ia.webp` (ID 23)
- Replace: `Images/ai-usage/janela-de-angelim-09-imperial-de-abrir-por-fora-e-correr-interno-ia.webp` (ID 26)
- Replace: `Images/ai-usage/janela-de-angelim-29-abrir-por-fora-e-correr-interno-ia.webp` (ID 27)
- Replace: `Images/ai-usage/janela-de-angelim-10-dupla-de-correr-ia.webp` (ID 28)
- Replace: `Images/ai-usage/janela-de-angelim-06-vidro-quadriculado-de-correr-ia.webp` (ID 29)
- Replace: `Images/ai-usage/janela-de-angelim-17-vidro-quadriculado-de-correr-ia.webp` (ID 30)
- Replace: `Images/ai-usage/janela-de-angelim-18-vidro-quadriculado-ia.webp` (ID 32)
- Replace: `Images/ai-usage/janela-de-angelim-t102-com-vidro-temperado-ia.webp` (ID 48)
- Replace: `Images/ai-usage/janela-de-angelim-t101-com-vidro-temperado-ia.webp` (ID 49)
- Replace: `Images/ai-usage/janela-de-angelim-05-vidro-e-almofada-ia.webp` (ID 83)
- Replace: `Images/ai-usage/janela-de-angelim-21-vidro-e-veneziana-ia.webp` (ID 84)

**Interfaces:**
- Consumes: referências e fichas geométricas dos IDs listados.
- Produces: 13 WebPs aprovados nos caminhos `aiImage` existentes.

- [ ] **Step 1: Abrir cada referência original antes da edição**

Use `view_image` para a referência principal e referências adicionais de cada ID.

- [ ] **Step 2: Gerar um candidato por modelo com o ImageGen integrado**

Use uma chamada separada por modelo com este molde preenchido pela ficha geométrica:

```text
Use case: precise-object-edit
Asset type: fotografia de catálogo para o site Gusmão Madeiras
Input images: Image 1: alvo de edição e fonte definitiva do produto; Images 2..N: referências complementares do mesmo produto
Primary request: manter a janela da Image 1 integralmente inalterada e substituir somente o fundo branco/entorno por uma fachada residencial vista do exterior
Scene/backdrop: exterior de residência brasileira confortável, simples, limpa e bem conservada
Composition/framing: mesmo ponto de vista e proporção da referência; janela inteira em destaque
Lighting/mood: luz diurna natural e suave; sombras de contato realistas
Constraints: inserir literalmente no prompt a descrição `geometry` do registro atual em `manifest.json`; preservar moldura, bordas, divisões, ferragens, proporções e profundidade; integrar o vão naturalmente à parede
Avoid: redesenhar o produto; pedras; cascalho; vasos; bancos; ornamentos; luminárias; peças extras; texto; logotipo; marca-d'água
```

- [ ] **Step 3: Comparar cada candidato com sua ficha geométrica**

Rejeitar o candidato se qualquer contagem, proporção, borda, ferragem ou detalhe divergir. Para falhas, emitir uma única nova tentativa descrevendo somente a divergência e repetindo todas as invariantes. Para cada candidato aprovado, registrar em `tmp/window-review/accepted.json` um objeto com o caminho absoluto retornado em `output_hint` no campo `candidate` e o caminho `aiImage` do registro no campo `destination`.

- [ ] **Step 4: Converter somente candidatos aprovados para WebP**

Run depois de registrar os candidatos aprovados:

```powershell
@'
import json
from PIL import Image
items=json.load(open('tmp/window-review/accepted.json',encoding='utf8'))
for item in items:
    Image.open(item['candidate']).convert('RGB').save(item['destination'], 'WEBP', quality=92, method=6)
'@ | python -
```

Expected: os 13 destinos abrem como WebP e mantêm resolução suficiente para o catálogo.

- [ ] **Step 5: Gerar e inspecionar folha de revisão do grupo**

Criar `tmp/window-review/review-rectangular.jpg` com referência e resultado lado a lado. Abrir com `view_image` e repetir Steps 2–4 para qualquer item reprovado.

---

### Task 3: Corrigir os quatro modelos prioritários com curvas superiores

**Files:**
- Replace: `Images/ai-usage/janela-de-angelim-01-imperial-dupla-ia.webp` (ID 22)
- Replace: `Images/ai-usage/janela-de-angelim-04-napoleao-dupla-ia.webp` (ID 24)
- Replace: `Images/ai-usage/janela-de-angelim-32-napoleao-de-vidro-ia.webp` (ID 33)
- Replace: `Images/ai-usage/janela-de-angelim-33-imperial-de-vidro-ia.webp` (ID 34)

**Interfaces:**
- Consumes: todas as referências dos IDs 22, 24, 33 e 34.
- Produces: quatro WebPs com perfil superior, moldura e encaixe arquitetônico aprovados.

- [ ] **Step 1: Inspecionar individualmente todas as referências em resolução original**

Registrar o contorno superior, raio/flecha da curva, espessura da moldura, encontro da curva com as laterais, quantidade de folhas e posição das divisões.

- [ ] **Step 2: Editar cada referência principal sem redesenhar a janela**

Usar o molde da Task 2 e acrescentar:

```text
Critical invariant: preserve the exact upper contour pixel-for-pixel in shape: curvature height, radius, border thickness, center transition, side transitions, trim profile and architectural depth must match Image 1. Do not replace the curve with a generic arch or a straight lintel.
```

- [ ] **Step 3: Fazer validação ampliada do perfil superior**

Criar `tmp/window-review/review-curved.jpg` com recortes ampliados do terço superior da referência e do candidato, além das imagens completas.

Acceptance: curva, bordas, moldura, divisões e proporção externa coincidem visualmente; o encaixe na parede possui profundidade natural; nenhum elemento adicional foi criado.

- [ ] **Step 4: Repetir uma correção dirigida quando necessário**

Uma nova tentativa deve nomear somente o erro observado, por exemplo: `restore the shallow double-bowed Napoleão contour; the candidate is too semicircular`, mantendo as demais invariantes.

- [ ] **Step 5: Converter e substituir somente os quatro candidatos aprovados**

Usar a conversão WebP da Task 2 e confirmar os quatro destinos com Pillow.

---

### Task 4: Recriar os quatro modelos com arco colonial

**Files:**
- Replace: `Images/ai-usage/janela-de-angelim-18a-vidro-quadriculado-com-arco-colonial-ia.webp` (ID 68)
- Replace: `Images/ai-usage/janela-de-angelim-26a-almofada-com-arco-colonial-ia.webp` (ID 69)
- Replace: `Images/ai-usage/janela-de-angelim-02a-dupla-vidro-e-veneziana-com-arco-colonial-ia.webp` (ID 70)
- Replace: `Images/ai-usage/janela-de-angelim-05a-vidro-e-almofada-com-arco-colonial-ia.webp` (ID 86)

**Interfaces:**
- Consumes: referências e ficha geométrica dos quatro modelos coloniais.
- Produces: quatro WebPs com arco, bandeira, divisões radiais e molduras aprovados.

- [ ] **Step 1: Inspecionar referências principais e adicionais**

Registrar quantidade e ângulo das divisões radiais, altura do arco, continuidade da moldura, folhas inferiores, venezianas, vidros e almofadas.

- [ ] **Step 2: Gerar um candidato por modelo usando o molde da Task 2**

Acrescentar a lista exata de divisões radiais e componentes inferiores da ficha geométrica. Proibir arco de alvenaria extra e qualquer peitoril de pedra.

- [ ] **Step 3: Criar `tmp/window-review/review-colonial.jpg` e validar**

Acceptance: arco, bandeira, raios, moldura, folhas e detalhes inferiores coincidem com a referência; fachada e rebaixo são naturais.

- [ ] **Step 4: Corrigir candidatos reprovados com uma mudança por tentativa**

Repetir todas as invariantes e nomear somente a diferença observada.

- [ ] **Step 5: Converter e substituir os quatro candidatos aprovados**

Usar WebP quality 92/method 6 e verificar abertura com Pillow.

---

### Task 5: Recriar os nove modelos com geometrias distintivas ou painéis maciços

**Files:**
- Replace: `Images/ai-usage/janela-de-angelim-37-dupla-vidro-e-almofada-diagonal-ia.webp` (ID 25)
- Replace: `Images/ai-usage/janela-de-angelim-31-tucano-de-correr-ia.webp` (ID 31)
- Replace: `Images/ai-usage/janela-de-angelim-39-vidro-diagonal-ia.webp` (ID 35)
- Replace: `Images/ai-usage/janela-de-angelim-38-almofada-diagonal-ia.webp` (ID 55)
- Replace: `Images/ai-usage/janela-de-angelim-42-bigbrother-de-correr-ia.webp` (ID 65)
- Replace: `Images/ai-usage/janela-de-angelim-26-almofada-ia.webp` (ID 85)
- Replace: `Images/ai-usage/janela-de-angelim-34-mexicana-ia.webp` (ID 87)
- Replace: `Images/ai-usage/janela-de-angelim-35-imperial-mexicana-ia.webp` (ID 88)
- Replace: `Images/ai-usage/janela-de-angelim-40-bigbrother-ia.webp` (ID 89)

**Interfaces:**
- Consumes: referências e fichas geométricas dos nove modelos.
- Produces: nove WebPs aprovados com desenhos diagonais, tucano, almofadas e réguas preservados.

- [ ] **Step 1: Inspecionar todas as referências de cada ID**

Registrar contagem e direção de diagonais, raios/curvas do tucano, almofadas, réguas, folhas, juntas e molduras.

- [ ] **Step 2: Gerar um candidato por modelo com a ficha geométrica explícita**

Usar o molde da Task 2. Para painéis maciços, proibir a criação de vidros; para desenhos diagonais/tucano, exigir todas as peças na mesma posição e orientação da referência.

- [ ] **Step 3: Criar `tmp/window-review/review-distinctive.jpg` e validar**

Acceptance: todas as peças distintivas, contagens, direções, juntas e molduras coincidem; a fachada externa não contém objetos inventados.

- [ ] **Step 4: Corrigir cada reprovação com uma tentativa dirigida**

Repetir o ciclo gerar → comparar → corrigir até obter um candidato aceito ou registrar incapacidade do modelo sem publicar imagem incorreta.

- [ ] **Step 5: Converter e substituir os nove candidatos aprovados**

Usar WebP quality 92/method 6 e verificar abertura com Pillow.

---

### Task 6: Executar auditoria final do catálogo e das imagens

**Files:**
- Verify: `data.json`
- Verify: `js/app.js`
- Verify: 30 files under `Images/ai-usage/janela-*.webp`
- Create temporarily: `tmp/window-review/final-01.jpg` through `tmp/window-review/final-05.jpg`

**Interfaces:**
- Consumes: 30 WebPs substituídos.
- Produces: evidência de integridade do catálogo e revisão visual final.

- [ ] **Step 1: Validar sintaxe e inventário**

Run:

```powershell
node --check js/app.js
@'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const products = data.products.filter(p => !p.url.includes('/page/') && p.title.trim().toLowerCase() !== 'produtos');
const windows = products.map((p, id) => ({ id, ...p })).filter(p => !p.removed && p.title.toLowerCase().includes('janela'));
if (windows.length !== 30) throw new Error(`Expected 30 active windows, got ${windows.length}`);
for (const p of windows) {
  for (const path of [p.image, ...(p.images || []), p.aiImage]) {
    if (!fs.existsSync(path)) throw new Error(`Missing ${p.id}: ${path}`);
  }
}
console.log('Catalog integrity OK: 30 windows');
'@ | node -
```

Expected: JavaScript syntax exit 0 and `Catalog integrity OK: 30 windows`.

- [ ] **Step 2: Verificar os 30 WebPs com Pillow**

Run:

```powershell
@'
import json
from PIL import Image
items=json.load(open('tmp/window-review/manifest.json',encoding='utf8'))
for item in items:
    with Image.open(item['aiImage']) as im:
        im.verify()
        if im.format != 'WEBP': raise RuntimeError(f"Not WEBP: {item['aiImage']}")
print(f"Verified {len(items)} WebP files")
'@ | python -
```

Expected: `Verified 30 WebP files`.

- [ ] **Step 3: Gerar as cinco folhas finais**

Cada linha deve mostrar ID, título, referência principal e resultado final. Abrir todas com `view_image` em detalhe original e reconferir os dez critérios da especificação.

- [ ] **Step 4: Confirmar o escopo exato da alteração**

Run:

```powershell
git diff --check
git diff --name-only
```

Expected: exatamente os 30 arquivos `Images/ai-usage/janela-*.webp` aparecem como alterações de produto; nenhum ID, título ou caminho em `data.json` mudou.

- [ ] **Step 5: Remover artefatos temporários verificados**

Remover somente `tmp/window-review/` após confirmar que o caminho absoluto está dentro do workspace e que contém apenas manifestos e folhas de revisão criados por este plano.

---

### Task 7: Versionar, publicar e confirmar o site

**Files:**
- Commit: 30 files under `Images/ai-usage/janela-*.webp`

**Interfaces:**
- Consumes: auditoria final aprovada.
- Produces: commit publicado em `gusmaomadeiras-site/main` e confirmação no domínio.

- [ ] **Step 1: Executar novamente as verificações críticas imediatamente antes do commit**

Run:

```powershell
node --check js/app.js
git diff --check
git status --short
```

Expected: exit 0 e somente as 30 imagens aprovadas aparecem modificadas.

- [ ] **Step 2: Criar o commit das imagens**

Run:

```powershell
git add -- Images/ai-usage/janela-*.webp
git commit -m "pictures: refazer imagens externas das janelas"
```

Expected: commit criado com exatamente 30 arquivos binários.

- [ ] **Step 3: Enviar a branch principal**

Run:

```powershell
git push gusmaomadeiras-site main
```

Expected: `main -> main` sem rejeição.

- [ ] **Step 4: Confirmar publicação**

Abrir `https://www.gusmaomadeiras.com.br/produtos.html`, aguardar o mecanismo de hospedagem e verificar por hash/conteúdo que ao menos um arquivo novo e os quatro modelos prioritários são servidos pelo domínio. Se o cache persistir, testar com parâmetro de consulta sem alterar o código.

- [ ] **Step 5: Registrar evidência final**

Run:

```powershell
git status --short
git rev-parse --short HEAD
git rev-parse --short gusmaomadeiras-site/main
```

Expected: working tree limpo e os dois hashes idênticos.
