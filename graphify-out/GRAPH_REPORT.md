# Graph Report - site-gusmao  (2026-08-17)

## Corpus Check
- 11 files · ~4,549,463 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 103 nodes · 159 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `83b5c817`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Correção das imagens externas de produtos
- renderProductDetail
- Reconstrução fiel das imagens de janelas
- app.js
- Global Constraints
- Global Constraints
- readProductGallery
- review_images.py
- handleRoute
- isProductGalleryControl
- syncRouteSeo
- navigate

## God Nodes (most connected - your core abstractions)
1. `Correção das imagens externas de produtos` - 13 edges
2. `Reconstrução fiel das imagens de janelas` - 11 edges
3. `handleRoute()` - 9 edges
4. `renderProducts()` - 8 edges
5. `renderProductDetail()` - 8 edges
6. `Global Constraints` - 8 edges
7. `Global Constraints` - 8 edges
8. `iconSvg()` - 7 edges
9. `readProductGallery()` - 7 edges
10. `classifyCategory()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `navigate()` --calls--> `handleRoute()`  [EXTRACTED]
  js/app.js → js/app.js  _Bridges community 11 → community 8_
- `handleRoute()` --calls--> `renderProductDetail()`  [EXTRACTED]
  js/app.js → js/app.js  _Bridges community 8 → community 1_
- `handleRoute()` --calls--> `syncRouteSeo()`  [EXTRACTED]
  js/app.js → js/app.js  _Bridges community 8 → community 10_
- `updateProductGalleryControls()` --calls--> `getGalleryChoiceLabel()`  [EXTRACTED]
  js/app.js → js/app.js  _Bridges community 1 → community 6_
- `startProductGallerySwipe()` --calls--> `readProductGallery()`  [EXTRACTED]
  js/app.js → js/app.js  _Bridges community 6 → community 9_

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "Correção das imagens externas de produtos"
Cohesion: 0.14
Nodes (13): Abordagem aprovada, Correção das imagens externas de produtos, Critérios de aceitação, Direção visual, Elementos proibidos, Escopo, Fora de escopo, Invariantes do produto (+5 more)

### Community 1 - "renderProductDetail"
Cohesion: 0.26
Nodes (13): classifyCategory(), getCatalogCount(), getCategoryName(), getGalleryChoiceLabel(), getHighlights(), getProductDetailHref(), getProductLine(), getResultsTitle() (+5 more)

### Community 2 - "Reconstrução fiel das imagens de janelas"
Cohesion: 0.17
Nodes (11): Abordagem aprovada, Critérios de aceitação por imagem, Direção visual, Escopo, Invariantes do produto, Objetivo, Publicação, Reconstrução fiel das imagens de janelas (+3 more)

### Community 3 - "app.js"
Cohesion: 0.26
Nodes (10): categoriesData, heroFloatingProducts, IconAlisaresPortais(), IconBasculas(), IconJanelas(), IconPortas(), IconPortasCorrer(), IconSeteiras() (+2 more)

### Community 4 - "Global Constraints"
Cohesion: 0.20
Nodes (9): Global Constraints, Task 1: Criar inventário verificável dos 30 modelos, Task 2: Recriar as 13 janelas retangulares e de vidro temperado, Task 3: Corrigir os quatro modelos prioritários com curvas superiores, Task 4: Recriar os quatro modelos com arco colonial, Task 5: Recriar os nove modelos com geometrias distintivas ou painéis maciços, Task 6: Executar auditoria final do catálogo e das imagens, Task 7: Versionar, publicar e confirmar o site (+1 more)

### Community 5 - "Global Constraints"
Cohesion: 0.20
Nodes (9): External Product Image Corrections Implementation Plan, Global Constraints, Task 1: Inventariar o escopo e preparar a revisão visual, Task 2: Corrigir portas maciças e marchetadas, Task 3: Corrigir janelas retangulares e de vidro temperado, Task 4: Corrigir janelas com venezianas, desenhos distintivos e perfis curvos, Task 5: Corrigir modelos com arco colonial, Task 6: Corrigir básculas externas e porta de correr (+1 more)

### Community 6 - "readProductGallery"
Cohesion: 0.43
Nodes (8): cancelProductGallerySwipe(), endProductGallerySwipe(), handleProductGalleryImageError(), nextProductDetailImage(), previousProductDetailImage(), readProductGallery(), setProductDetailImage(), updateProductGalleryControls()

### Community 7 - "review_images.py"
Cohesion: 0.50
Nodes (7): contain(), create_group_review(), create_manifest(), create_sheets(), install_group(), print_dimensions(), products()

### Community 8 - "handleRoute"
Cohesion: 0.40
Nodes (6): handleRoute(), initHeroFloatMotion(), loadData(), renderHome(), stopHeroFloatMotion(), updateActiveNav()

### Community 9 - "isProductGalleryControl"
Cohesion: 0.67
Nodes (3): handleProductImageClick(), isProductGalleryControl(), startProductGallerySwipe()

### Community 10 - "syncRouteSeo"
Cohesion: 0.67
Nodes (3): setCanonical(), setMetaContent(), syncRouteSeo()

## Knowledge Gaps
- **39 isolated node(s):** `productsData`, `categoriesData`, `heroFloatingProducts`, `Task 1: Criar inventário verificável dos 30 modelos`, `Task 2: Recriar as 13 janelas retangulares e de vidro temperado` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `productsData`, `categoriesData`, `heroFloatingProducts` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Correção das imagens externas de produtos` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._