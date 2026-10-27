# Projetos: navegação e apresentação — 27/10/2026

A direção permanece a original: galáxia na Home, Orbitron, Rajdhani, Space Mono e acentos por seção. Esta rodada trata das páginas internas.

## Problemas reproduzidos e correções

- O botão de fechar os detalhes saía da tela ao rolar. A barra do projeto agora permanece visível, com nome e botão textual de fechar.
- Cards com aparência clicável só abriam pelo botão pequeno no rodapé. O clique na capa ou no corpo agora abre os detalhes; seleção de texto e botão de salvar têm comportamento próprio. O botão nativo continua disponível para teclado.
- A troca de projeto mantinha a rolagem no fim do conteúdo. Cada projeto passa a abrir no início dos detalhes.
- Um projeto recebido por link direto podia estar fora do filtro atual. Anterior/próximo agora respeitam os limites e a ordem dos resultados visíveis.
- Galerias com uma única imagem exibiam miniatura e controles sem função. Esses controles ficam ocultos; a ampliação continua disponível.
- As imagens têm descrições próprias, atualizadas ao mudar a seleção, inclusive na ampliação.
- Busca sem resultados agora oferece um botão direto para limpar busca e filtros. Filtros recebidos pela URL ficam visíveis.
- As capas com letras soltas foram substituídas: captura real da galáxia e ilustração identificada de pesquisa binária. O catálogo mantém 81 repositórios públicos.
- A ação “Conversar sobre este projeto” leva o nome e o link ao contato. O visitante escreve sua mensagem; o contexto aparece visivelmente e segue no rascunho de e-mail. IDs desconhecidos são ignorados.

## Fontes

As imagens de Nexly e ARQON e as informações dos casos permanecem nas fontes já registradas. A pasta pública `Entendendo os Algoritmos/Pesquisa Binaria` de `_estudos-python` foi conferida pelo conector GitHub para fundamentar o tema da nova ilustração. Ela não é apresentada como captura de interface ou resultado de execução. A capa do portfólio foi capturada no próprio site pelo navegador e salva como JPEG de aproximadamente 75 KB.

## Verificação executada

- `projects-refinement-check.js`: 35 verificações funcionais, incluindo foco, abrir pela capa, salvar, fechar após rolagem, trocar projeto, filtro/URL, estado vazio, descrições da galeria e projeto no contato.
- Detalhes verificados em 320, 375, 768 e 1440 px, com botão de fechar visível, foco contido no modal e sem rolagem horizontal.
- axe-core no modal e no contato com contexto: nenhuma violação detectada nos critérios A/AA executados. Não equivale a uma declaração completa de conformidade.
- `projects-release-check.js`: Home continua sendo a galáxia; cache `portfolio-v29`, 60 recursos; novas capas e caminho projeto → contato funcionam offline.
- Formspree simulado no navegador: o payload inclui o projeto e seu link; erro preserva os campos e sucesso é tratado. Nenhuma mensagem real foi enviada. O site continua em modo de preparação de e-mail, pois o endpoint real está vazio.
- Nove HTMLs, 17 arquivos JavaScript, IDs, referências locais e recursos do cache conferidos. `node --check` e `git diff --check` passaram.
- Capturas reais: `projects-refined-grid.png`, `projects-refined-mobile.png`, `projects-refined-scrolled.png` e `project-contact-mobile.png`, em `output/playwright/`.

## Publicação e manutenção

Assets usam `v=20261027.1`. O cache foi aumentado para `portfolio-v29`. A entrega usa o remoto `portfolio`, branch `main`, GitHub Pages. As verificações do build e da página pública são registradas no chat da entrega.
