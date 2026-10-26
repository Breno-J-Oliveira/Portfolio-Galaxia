# 39 melhorias — segunda rodada de 26/10/2026

Implementadas no código local, preservando a galáxia, os dados de carreira verificados e a stack HTML/CSS/JavaScript. Cada linha descreve uma mudança de conteúdo ou comportamento, não uma contagem de ajustes de margem ou cor.

| Nº | Área | Melhoria entregue |
|---:|---|---|
| 1 | Perfil | Bloco com o momento atual, projeto principal e próximo passo profissional. |
| 2 | Perfil | Página de resumo profissional com modo de impressão e opção de salvar pelo navegador como PDF. |
| 3 | Perfil | Busca de tecnologias na seção de habilidades. |
| 4 | Perfil | Filtro de habilidades por grupo técnico. |
| 5 | Perfil | Filtro da trajetória entre profissional e acadêmica. |
| 6 | Acessibilidade | Detalhes de formação realmente ocultos quando recolhidos, com controle associado ao botão. |
| 7 | Projetos | Busca por título, descrição, categoria e tecnologias, sem depender de acentos. |
| 8 | Projetos | Quantidade de projetos disponível em cada categoria. |
| 9 | Projetos | Ordenação alfabética ou com destaques primeiro. |
| 10 | Projetos | Opção de exibir apenas os projetos em destaque. |
| 11 | Projetos | Botão para limpar busca, categoria e ordenação. |
| 12 | Projetos | Contagem dinâmica e anunciada dos resultados encontrados. |
| 13 | Projetos | Filtros registrados na URL, restaurados ao voltar/avançar no navegador. |
| 14 | Projetos | Link direto que abre os detalhes de um projeto específico. |
| 15 | Projetos | Botão para copiar o link do projeto aberto. |
| 16 | Projetos | Projetos salvos como favoritos neste navegador. |
| 17 | Projetos | Filtro para consultar apenas os favoritos. |
| 18 | Projetos | Botões visíveis de projeto anterior e próximo, respeitando o conjunto filtrado. |
| 19 | Projetos | Galeria com anterior/próxima imagem, indicação de posição e setas do teclado. |
| 20 | Projetos | Ampliação de imagem em diálogo com fechamento por Escape e retorno do foco. |
| 21 | Acessibilidade | Conteúdo ao fundo fica inativo enquanto o modal de projeto está aberto. |
| 22 | Freelance | Montador de briefing com seleção do tipo de projeto. |
| 23 | Freelance | Seleção de requisitos adicionais para compor o escopo. |
| 24 | Freelance | Campos de objetivo e expectativa de prazo, sem inventar valores comerciais. |
| 25 | Freelance | Resumo atualizado em tempo real e orientação conforme o escopo selecionado. |
| 26 | Freelance | Cópia do briefing completo. |
| 27 | Freelance | Reinício do briefing para começar outra ideia. |
| 28 | Freelance | Transferência do briefing para a mensagem de contato, sem enviar dados externos. |
| 29 | Contato | Modo de oportunidade de trabalho que oculta e desativa orçamento. |
| 30 | Contato | Salvamento opcional e recuperação do rascunho neste navegador. |
| 31 | Contato | Limpeza de rascunho com opção de desfazer na mesma página. |
| 32 | Contato | Limite de mensagem e contador de caracteres. |
| 33 | Contato | Botão para copiar o endereço de e-mail. |
| 34 | Preferências | Pausa persistente de animações, incluindo os loops principais de partículas e galáxia. |
| 35 | Preferências | Ajuda de atalhos em diálogo, navegação com Alt+Shift e opção de desativar; digitação preservada. |
| 36 | Preferências | Compartilhamento nativo quando disponível, com cópia de link como alternativa. |
| 37 | Preferências | Aviso de ausência de conexão e atualização ao voltar online. |
| 38 | Preferências | Instalação opcional exibida somente quando o navegador oferece um prompt compatível. |
| 39 | Qualidade | Pré-cache atualizado com cache reload para evitar misturar scripts antigos e novos. |

## Evidências

- Duas baterias de fluxos no Chromium: projetos/perfil e briefing/contato/preferências, concluídas sem erros JavaScript.
- Seis páginas em 320, 375, 768 e 1440 pixels: menu visível onde aplicável e sem transbordamento horizontal. Foco contido no modal, nos dois sentidos do Tab.
- Imagens e layouts inspecionados em capturas de desktop e mobile; o resumo foi verificado com emulação de mídia de impressão.
- Cache `portfolio-v21` com 48 recursos. As seis páginas e a galeria do Nexly abriram offline.
- Respostas 429 e 200 do formulário verificadas com interceptação local. Nenhum e-mail foi enviado.
- Compartilhamento testado no caminho de cópia de link. O prompt de instalação foi simulado para verificar disponibilidade e cancelamento; nenhum aplicativo foi instalado e nenhuma publicação foi feita.
- Sintaxe de JavaScript e referências locais verificadas; `git diff --check` sem erros.
- Scripts de verificação e capturas ficam em `output/playwright/`, ignorados pelo Git. Não são uma suíte permanente de testes.

## Limites que continuam válidos

O resumo profissional é uma visualização imprimível dos dados atuais; não substitui a aprovação do currículo final. O formulário continua preparando um rascunho por e-mail sem endpoint real. Traduções completas, tabela de preços, publicação, testes em aparelhos físicos e auditoria formal de acessibilidade/performance não fazem parte desta entrega.
