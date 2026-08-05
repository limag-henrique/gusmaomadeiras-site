# Reconstrução fiel das imagens de janelas

## Objetivo

Substituir as 30 imagens ambientadas de janelas atualmente usadas no catálogo por fotografias externas, naturais e fotorrealistas que preservem fielmente o produto mostrado nas fotografias originais.

## Escopo

- Processar todos os 30 produtos ativos cujo título contém `Janela` em `data.json`.
- Usar `image` como referência principal e cada caminho de `images` como referência complementar do mesmo produto.
- Substituir somente o arquivo indicado em `aiImage`, mantendo os caminhos, IDs e demais dados do catálogo inalterados.
- Dar atenção prioritária aos quatro modelos com geometria curva:
  - ID 22 — Janela de angelim 01, imperial dupla.
  - ID 24 — Janela de angelim 04, napoleão dupla.
  - ID 33 — Janela de angelim 32, napoleão de vidro.
  - ID 34 — Janela de angelim 33, imperial de vidro.
- Aplicar a mesma verificação rigorosa aos modelos com arco colonial e a qualquer outro produto com bordas, curvas ou divisões distintivas.

## Abordagem aprovada

Cada fotografia original será tratada como alvo de edição, não apenas como inspiração. A janela deverá permanecer visualmente inalterada; a geração será usada para construir apenas o contexto arquitetônico externo ao redor dela e o ambiente visto através das áreas transparentes quando necessário.

Para cada produto:

1. Inventariar as referências originais e registrar uma ficha geométrica: proporção externa, número de folhas, divisões, travessas, montantes, venezianas, almofadas, bordas, molduras, arcos e curvaturas.
2. Inspecionar visualmente todas as referências antes de gerar a nova imagem.
3. Editar a referência principal com o ImageGen integrado, identificando-a explicitamente como alvo e as demais fotografias como referências complementares.
4. Preservar a janela e alterar somente o entorno: fachada externa limpa, residência confortável e bem conservada, profundidade arquitetônica plausível, escala realista, luz natural e sombras coerentes.
5. Comparar a saída lado a lado com a referência e rejeitar qualquer resultado que altere a geometria ou introduza objetos não autorizados.
6. Fazer uma nova tentativa com uma única correção direcionada quando um requisito falhar.
7. Converter somente a versão aprovada para WebP e substituir o arquivo `aiImage` correspondente.

## Direção visual

- Vista exclusivamente externa, em ângulo igual ou o mais próximo possível da referência original.
- Fachada residencial simples, confortável, limpa e bem conservada.
- Integração natural entre parede, vão, moldura e janela, incluindo rebaixo, profundidade, sombra de contato e transição de materiais.
- Iluminação diurna suave e natural, sem aparência de estúdio ou render excessivamente polido.
- Escala arquitetônica plausível e perspectiva sem distorções.
- Nenhuma pedra, cascalho, rocha decorativa, vaso, banco, ornamento, luminária ou componente arquitetônico inventado sob ou ao redor da janela.
- Nenhum texto, logotipo ou marca-d'água.

## Invariantes do produto

Nenhuma saída será aceita se houver alteração em qualquer um destes pontos:

- proporção entre largura e altura;
- quantidade, posição ou espessura de folhas, vidros, painéis, venezianas, almofadas, travessas ou montantes;
- contorno da moldura e das bordas;
- presença, altura, raio, flecha ou perfil de arco;
- curvatura superior dos modelos Napoleão e Imperial;
- acabamento, direção das fibras e caráter visual da madeira;
- puxadores, ferragens ou detalhes construtivos presentes na referência;
- profundidade relativa entre janela, moldura e parede.

## Critérios de aceitação por imagem

Uma imagem somente poderá substituir a atual quando todos os itens abaixo forem confirmados:

1. O produto corresponde ao título e às referências do mesmo registro.
2. A silhueta externa e a proporção coincidem com a referência.
3. Todas as divisões e peças construtivas estão presentes e nas posições corretas.
4. Arcos, bordas, molduras e curvaturas mantêm o perfil original.
5. A janela está instalada no lado externo de uma residência realista.
6. A integração apresenta profundidade, perspectiva, escala, luz e sombras coerentes.
7. Não existem pedras ou objetos desnecessários abaixo ou ao redor da janela.
8. A imagem está nítida, limpa, natural e sem artefatos visuais.
9. O enquadramento mantém a janela inteira visível e em destaque.
10. O arquivo final está no caminho `aiImage`, em WebP válido, e pode ser carregado pelo catálogo.

## Verificação dos quatro modelos prioritários

Os IDs 22, 24, 33 e 34 terão uma etapa adicional de comparação do perfil superior. A verificação deverá confirmar a continuidade da curva, a espessura das bordas, a simetria ou assimetria original, a transição entre arco e laterais, e a profundidade do encaixe na parede. Uma curva apenas semelhante não será considerada suficiente.

## Validação do catálogo

Após substituir todas as imagens:

- validar a sintaxe de `data.json` e `js/app.js`;
- confirmar que existem exatamente 30 produtos ativos de janela e que todos os respectivos caminhos `image`, `images` e `aiImage` existem;
- abrir cada WebP e verificar formato, dimensões e ausência de corrupção;
- gerar uma folha de revisão final com referência e resultado para conferir os 30 pares;
- executar `git diff --check` e revisar a lista exata de arquivos alterados;
- confirmar que nenhum produto, ID, título ou caminho do catálogo foi modificado acidentalmente.

## Publicação

Depois da validação completa, criar um commit contendo as 30 imagens substituídas e qualquer artefato estritamente necessário à verificação. Enviar o commit para `gusmaomadeiras-site/main`, que é a origem atual do site, e confirmar que o domínio publicado carrega as novas imagens. Se a publicação não atualizar imediatamente, verificar o mecanismo de hospedagem antes de realizar qualquer mudança adicional.

## Tratamento de falhas

- Uma saída que modifique o produto será descartada, não corrigida por aceitação parcial.
- Cada nova tentativa terá uma correção única e explícita baseada na divergência observada.
- O arquivo em produção somente será sobrescrito depois que a versão candidata for aprovada.
- Se o ImageGen não conseguir preservar um modelo após tentativas direcionadas, o processo será interrompido para esse item e a limitação será reportada; não será publicada uma imagem sabidamente incorreta.
