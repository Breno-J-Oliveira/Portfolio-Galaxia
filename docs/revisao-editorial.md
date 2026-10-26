# Revisão editorial e de navegação — 26/10/2026

O estado anterior foi preservado no commit `325d182` e enviado para `Breno-J-Oliveira/Portfolio-Galaxia` antes desta revisão.

## Direção

A galáxia continua na Home. As páginas internas passam a priorizar os projetos, a trajetória e os meios de contato: uma família de fontes para a interface, texto em caixa normal, cores mais discretas e menos elementos repetidos.

Foram retirados contadores, a lista duplicada de ferramentas, o bloco de princípios genéricos, as órbitas do retrato e o processo de freelance descrito em etapas. Filtros avançados e o montador de pedido continuam disponíveis, mas recolhidos inicialmente.

Os textos foram reescritos com contexto concreto: o que é cada projeto, a participação de Breno e o estágio do trabalho. Não foram acrescentados clientes, resultados comerciais ou experiência profissional de desenvolvimento.

## Navegação

- Links internos usam a navegação nativa, sem espera de meio segundo.
- As estrelas abrem a página diretamente, sem espera adicional ou animação warp.
- A Home inicia o canvas sem percentual de carregamento simulado.
- Tab mantém a navegação normal pelos links; o zoom por teclado fica restrito ao canvas.
- Toque e roda de zoom também ficam restritos ao canvas. Menus e diálogos não acionam estrelas ao fundo.
- O navegador usa seu próprio cursor; as páginas internas não executam partículas de fundo nem parallax do retrato.

## Atualização de arquivos

CSS, scripts e widgets recebem uma identificação de versão nas páginas. O service worker `portfolio-v24` consulta apenas o cache da versão atual e reconhece esses arquivos versionados também offline. A instalação recarrega os recursos da rede para evitar uma combinação de arquivos de versões diferentes.

## Verificação

- Fluxos de perfil, filtros, projetos, galeria, briefing e contato verificados no Chromium.
- Navegação por Tab, botão Voltar e interação por toque verificados, inclusive na Home.
- Seis páginas verificadas nas larguras de 320, 375, 768 e 1440 pixels.
- Leitura offline e galeria do Nexly verificadas. O cache contém 45 recursos.
- Respostas de sucesso e falha do formulário verificadas com interceptação local; nenhum e-mail foi enviado.
- JavaScript validado com `node --check`; referências locais e diff verificados antes do envio.

Esses testes não representam uma auditoria formal de acessibilidade ou performance. O currículo final e um endpoint real de envio continuam pendentes. O formulário prepara um rascunho por e-mail quando não há endpoint configurado.
