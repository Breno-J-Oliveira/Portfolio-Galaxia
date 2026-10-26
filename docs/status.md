# Estado do portfólio — 26/10/2026

Este registro substitui os checkboxes históricos de `planejamento.md` como referência do estado atual. A galáxia e a arquitetura em HTML, CSS e JavaScript foram preservadas.

## Revisão atual

A [revisão editorial e de navegação](revisao-editorial.md) simplifica a interface, reescreve os textos e remove esperas artificiais. O cache atual é `portfolio-v24`, com 45 recursos. O commit anterior foi enviado ao GitHub como `325d182`.

## Histórico da segunda rodada: 39 melhorias

Veja [a lista completa das melhorias e verificações](melhorias-2026-10-26.md). O site agora tem resumo profissional imprimível, favoritos, links diretos para projetos, briefing de freelance, rascunhos opcionais e preferências de navegação. Naquela rodada, o cache era `portfolio-v21`, com 48 recursos. Os resultados v17 abaixo registram a primeira rodada.

## Conteúdo atualizado

- Desenvolvedor Full Stack, buscando a primeira oportunidade profissional em desenvolvimento. Freelance permanece como possibilidade secundária.
- Santo André, SP. Técnico em Desenvolvimento de Sistemas no SENAI em curso (jan/2025 a dez/2026, conclusão prevista) e Ensino Médio no SESI 221.
- Gestão de equipe de produção de ativos publicitários na Axtron.IO desde nov/2025. Essa experiência não é apresentada como emprego anterior de desenvolvimento.
- Projetos principais: Nexly, ARQON, ZENITH e NexusAuth. Estudos em Python e este portfólio aparecem como extras.
- Projetos, skills, trajetória, formação, idiomas, serviços e FAQ usam `src/app/data/index.js`.
- Imagens em `assets/projetos/`, independentes dos repositórios ignorados em `projetos/`. Telas do Nexly são demonstrativas, com dados fictícios. Capa do ZENITH é ilustrativa.
- Removidos depoimentos fictícios, cursos sem comprovação, percentuais de domínio de tecnologias e números arbitrários de experiência.

## Contato

Sem `contact.formspreeId`, o formulário valida os campos e prepara um rascunho por `mailto:`. O visitante abre seu aplicativo, revisa e envia. O site não afirma que enviou uma mensagem. Alterar os campos invalida o rascunho anterior.

O código preserva envio pelo Formspree se um endpoint real for configurado. Há tratamento de falha e tempo limite. Nenhuma conta foi provisionada e nenhum e-mail foi enviado nesta atualização.

## Pendências reais

- Currículo final em PDF: não existe no projeto. O botão permite solicitar por e-mail. Para ativar download, adicionar o arquivo público, cadastrar `owner.cv` e definir `owner.cvAvailable: true`.
- Gravações de idiomas: não fornecidas. O site mostra português nativo e inglês técnico, sem simular reprodução.
- Depoimentos e credenciais: adicionar somente conteúdo real e autorizado.
- Tabela/calculadora de preços e traduções completas continuam pendentes de escopo e conteúdo próprios. O montador de briefing está implementado e não calcula valores inventados.
- Publicação: destino definido em `Breno-J-Oliveira/Portfolio-Galaxia`, branch `main`, com GitHub Pages. Consulte `docs/deployment.md` para a configuração e verificação da entrega.

## Fontes e limites

Chat PERFIL e contexto de carreira de 21/10/2026; documentação e arquivos locais de Nexly, ZENITH, NexusAuth e ARQON; consulta ao GitHub para confirmar os links específicos.

As descrições não equivalem a uma auditoria de cada aplicação. Não há afirmação de certificação de segurança, métricas de produção ou aprovação atual das suítes dos projetos externos.

## Verificação desta atualização

- JavaScript validado com `node --check`; `git diff --check` sem erros.
- Cinco páginas verificadas em 320 e 375 pixels: sem transbordamento horizontal, com navegação visível.
- 30 verificações de comportamento no navegador: validação, rascunho Unicode, invalidação após edição, busca, filtros, quatro modais, galeria, foco por teclado, FAQ e conteúdo de carreira. Sem erros JavaScript nessas execuções.
- `portfolio-v17` com 42 recursos: as cinco páginas e a galeria do Nexly abriram offline. Serviços externos, como fontes, não fazem parte do cache.
- Respostas HTTP 429 e 200 do formulário testadas com interceptação local; erro preserva os campos e sucesso confirma a resposta. Nenhuma mensagem foi enviada para serviço externo.
- HTML verificado para IDs duplicados e referências locais ausentes.
- Capturas e scripts de verificação estão em `output/playwright/`, ignorada pelo Git. Não foi criada uma suíte permanente de regressão.

Essas verificações usaram Chromium e um servidor HTTP estático local. Não representam Lighthouse, teste em aparelhos físicos, validação do Apache ou entrega real de e-mail.
