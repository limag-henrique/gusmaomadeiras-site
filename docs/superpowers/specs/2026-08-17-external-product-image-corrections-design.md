# Correção das imagens externas de produtos

## Objetivo

Substituir as imagens geradas por IA de 38 produtos do catálogo por fotografias externas, naturais e fotorrealistas. Cada peça deve manter o desenho original e aparecer instalada de verdade na estrutura de uma residência, com alizares visíveis, profundidade arquitetônica plausível e contexto residencial suficiente para a cena ter aparência de casa.

## Escopo

Corrigir os produtos acessados pelos seguintes IDs filtrados da rota `produtos.html#product?id=`:

`0, 4, 5, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 40, 41, 42, 44, 48, 49, 64, 65, 68, 69, 70, 71, 74, 85, 86, 87, 88, 89`.

Os IDs são os índices de `productsData` depois da filtragem aplicada em `js/app.js`, não os índices brutos do array `products` de `data.json`.

## Abordagem aprovada

Usar edição fiel da fotografia original. O campo `image` de cada produto será o alvo principal e cada item de `images` será uma referência complementar definitiva do mesmo modelo. A IA deverá preservar a peça e construir somente o contexto arquitetônico externo ao redor dela.

Não será usada regeneração livre do produto. Um candidato que modifique sua geometria, desenho, abertura ou acabamento será descartado.

## Direção visual

- Vista exclusivamente pelo lado externo da residência.
- Fachada residencial brasileira simples, confortável, limpa e bem conservada.
- Enquadramento com uma porção suficiente da fachada para a imagem ter contexto de casa.
- A peça inteira permanece em destaque, ocupando aproximadamente metade da composição.
- Alizares completos e visíveis em todos os lados aplicáveis.
- Vão com espessura, rebaixo, sombra de contato e encontro plausível entre parede, alizar, marco e peça.
- Luz diurna suave, perspectiva natural e escala arquitetônica coerente.
- Podem aparecer beiral, continuação da parede, piso externo, jardim distante ou elementos residenciais discretos.
- Elementos de contexto devem permanecer afastados da peça e não podem encostar, apoiar, sobrepor ou decorar o produto.
- Nenhum texto, logotipo ou marca-d'água.

## Elementos proibidos

- Pedras, cascalho ou rochas decorativas acima, abaixo ou ao redor imediato da peça.
- Vasos, bancos, luminárias, ornamentos ou decoração sobre ou encostada no produto.
- Peitoril, moldura ou acabamento de pedra inventado.
- Peça chapada, flutuante, pendurada ou projetada sobre a parede.
- Peça enterrada dentro da parede sem alizares e profundidade de instalação.
- Vista interna, mobiliário interno ou acabamento que situe a câmera dentro da casa.
- Componentes arquitetônicos inventados que alterem o produto.

## Invariantes do produto

Cada resultado deve preservar, em relação às referências do mesmo registro:

- proporção externa entre largura e altura;
- número e posição de folhas, painéis, vidros, venezianas, almofadas, travessas e montantes;
- espessura aparente das peças de madeira;
- desenho das réguas, diagonais, curvas, arcos e elementos decorativos originais;
- contorno do marco e da peça;
- ferragens, puxadores, dobradiças, correntes e demais mecanismos visíveis;
- sentido de abertura e orientação entre lado interno e externo;
- acabamento, cor, direção das fibras e caráter visual da madeira;
- relação de profundidade entre folha, marco, alizar e parede.

## Tratamento especial por produto

- ID 40 — preservar exatamente o desenho da báscula panorâmica mostrado na fotografia original; não transformar o mecanismo ou inventar travessas.
- ID 41 — mostrar a báscula Tucano pelo lado externo, mantendo seu desenho e abertura.
- ID 42 — preservar formato, ferragens e sistema de abertura da báscula de vidro temperado.
- ID 65 — preservar o desenho e a organização das folhas da janela BigBrother de correr.
- ID 68 — preservar o arco colonial, as divisões radiais, as folhas inferiores e o formato de abertura.
- ID 71 — mostrar a porta marchetada vertical pelo lado externo da residência.
- IDs 22, 24, 33, 34 e 88 — preservar rigorosamente os perfis superiores imperial, napoleão ou curvo.
- IDs 36, 68, 69, 70, 74 e 86 — preservar altura, raio, divisões e transição lateral dos arcos coloniais.
- IDs 4, 5, 15, 64 e 71 — evitar aparência de painel encaixado ou colado; mostrar folha, batente, alizares e vão de porta plausíveis.

## Processo por imagem

1. Confirmar o produto correspondente ao ID filtrado.
2. Inspecionar a referência principal, as referências complementares e a imagem IA atual.
3. Registrar mentalmente ou no manifesto a geometria e os mecanismos que não podem mudar.
4. Editar a referência principal com o ImageGen integrado, identificando as demais imagens apenas como referências complementares.
5. Pedir alteração somente do entorno e preenchimento das áreas transparentes, mantendo a peça.
6. Comparar o candidato lado a lado com as referências.
7. Rejeitar qualquer candidato que falhe em uma invariante.
8. Fazer nova tentativa com uma única correção direcionada e repetir todas as invariantes essenciais.
9. Substituir o caminho `aiImage` somente depois da aprovação visual.

## Critérios de aceitação

Uma imagem somente será aceita quando:

1. corresponder ao título e às referências do produto;
2. preservar a silhueta e todas as divisões da peça;
3. mostrar o lado externo da residência;
4. incluir alizares visíveis e instalação com profundidade realista;
5. apresentar contexto residencial externo discreto e afastado do produto;
6. não incluir pedras ou decoração sobre, acima, abaixo ou encostada na peça;
7. manter sentido de abertura, ferragens e orientação corretos;
8. apresentar iluminação, perspectiva, escala e sombras coerentes;
9. manter a peça inteira, nítida e em destaque;
10. carregar como WebP válido no caminho `aiImage` já usado pelo catálogo.

## Validação final

- Gerar folhas de revisão com referência e resultado lado a lado para os 38 IDs.
- Inspecionar visualmente todos os pares e ampliar os modelos com curvas, arcos ou mecanismos distintivos.
- Confirmar que todos os arquivos `image`, `images` e `aiImage` do escopo existem e podem ser abertos.
- Validar a sintaxe de `data.json` e `js/app.js`.
- Confirmar que IDs, títulos e caminhos do catálogo não foram alterados.
- Executar `git diff --check` e revisar a lista exata de arquivos modificados.
- Executar `graphify update .` ao concluir, pois o repositório possui o comando Graphify disponível.

## Tratamento de falhas

- Não aceitar parcialmente uma imagem com desenho incorreto.
- Não sobrescrever a imagem atual antes de aprovar a candidata.
- Repetir a geração com uma correção por vez para reduzir deriva.
- Se o ImageGen não conseguir preservar um modelo após tentativas direcionadas, manter o arquivo atual desse item e reportar a limitação de forma explícita.

## Fora de escopo

- Alterar títulos, descrições, categorias, IDs ou rotas do catálogo.
- Modificar fotos originais em `image` ou `images`.
- Publicar, enviar alterações ou criar commits automaticamente.
- Corrigir produtos que não estejam na lista de 38 IDs.
