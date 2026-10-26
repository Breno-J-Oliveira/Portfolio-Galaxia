# Galáxia: identidade e caminhos de navegação

## Intenção

Preservar o universo espacial criado por Breno sem exigir que o visitante aprenda a navegar num canvas. O portfólio antigo em `projetos/REPOSITORIO/fazer readme/_portfolios/Portifolio_antigo` fornece a referência do cubo. O chat PERFIL e os projetos locais fornecem o conteúdo profissional. Dados públicos do GitHub conferidos em 26/10/2026; o LinkedIn bloqueou leitura automática.

## Direção visual

- Espaço: `#050810`; superfície: `#0d1423`; texto: `#edf3ff`; secundário: `#a9b7cd`.
- Ciano `#75e5e0` conecta a marca, órbitas e ações. Violeta `#b9a0ff` marca informação pessoal. Azul, verde e âmbar aparecem em pequenos indicadores das seções, sem trocar o fundo inteiro.
- Orbitron nos títulos e na assinatura, retomando a origem. Inter no texto e nos controles para leitura confortável. Sem letras vazadas, títulos com degradê ou blocos inteiros em caixa alta.
- Cabeçalho constante, conteúdo alinhado à esquerda, margens generosas. Órbitas e coordenadas visuais vinculam as páginas ao mesmo universo.
- A interação memorável da página Sobre é o cubo. A Home apresenta um mapa estático e acesso à galáxia original. Nenhum deles é obrigatório para chegar ao conteúdo.
- Navegação imediata, sem transições entre páginas. Cubo gira apenas por ação do visitante e respeita redução de movimento.

## Fluxo

```text
LinkedIn / GitHub / Instagram
          |
      links.html (entrada curta para a bio)
          |
  +-------+----------+----------------+
  |                  |                |
Projetos         Resumo/Sobre     Contato/Serviços
  |                  |                |
Casos + código   Formação + cubo  E-mail / LinkedIn
  |                                   |
Catálogo completo                 Rascunho opcional

index.html → apresentação + projetos + caminhos claros
galaxy.html → exploração opcional → mesmas páginas
```

Recrutamento: apresentação → projetos com contexto → resumo profissional → contato com assunto de oportunidade. Projeto freelance: serviços → escopo opcional → contato com briefing preservado. Interesse técnico: casos → código/documentação → catálogo de repositórios. Redes sociais têm links explícitos e destino informado; nenhuma mensagem é enviada automaticamente.

## Estrutura visual

```text
Home:     [marca       Início / Sobre / Projetos / Serviços / Contato]
          [nome + apresentação + ações] [mapa do universo + Galáxia]
          [Nexly em destaque] [ARQON / Zenith / NexusAuth]
          [trajetória / contato]

Sobre:    [apresentação] [retrato com órbita]
          [cubo + controles] [conteúdo legível da face escolhida]
          [tecnologias / trajetória / formação]

Projetos: [casos selecionados / todos os repositórios]
          [filtros e cards com galeria]
          [catálogo: busca + linguagem + tipo + paginação]

Contato:  [Vamos conversar.] [sinal orbital discreto]
          [e-mail + LinkedIn + redes] [formulário opcional]
```

## Critérios de entrega

- Toda página tem menu funcional mesmo sem JavaScript; em 320 px os links permanecem visíveis.
- A Home convencional é o ponto de entrada, sem bloquear o uso da galáxia.
- Cubo possui seis faces, controles por botão/teclado e alternativa textual completa.
- Todos os repositórios públicos encontrados aparecem no catálogo, com forks identificados e sem inventar documentação, implantação ou descrições.
- Busca, filtros, estados vazios, paginação, URL, modal e retorno funcionam.
- Contato diferencia oportunidade de projeto, preserva dados e explica a preparação do e-mail.
- Fontes, contraste, zoom, teclado, movimento reduzido e responsividade são verificados em navegador.
- Publicar somente após verificar a integração; confirmar o commit do build e as páginas públicas.

## Revisão da direção

A solução anterior apagava identidade ao uniformizar todos os títulos e cores. A nova direção recupera Orbitron, o fundo espacial e o cubo real da história do autor. A interface evita decoração em cada card: órbitas ficam nas áreas de apresentação, e o conteúdo usa uma superfície consistente. Recursos já funcionais (galeria, favoritos, briefing e rascunho) são preservados.
