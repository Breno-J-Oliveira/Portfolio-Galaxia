# Publicação do portfólio

Repositório: `Breno-J-Oliveira/Portfolio-Galaxia`.

## Configuração

- GitHub Pages a partir da branch `main`, pasta `/`.
- Site estático, sem comando de build e sem dependências de servidor.
- `.nojekyll` preserva os arquivos como estão no repositório.
- Endereço: https://breno-j-oliveira.github.io/Portfolio-Galaxia/
- Os arquivos usam caminhos relativos para funcionar nessa subpasta.

O remoto `portfolio` aponta para o repositório de entrega. O remoto `origin` anterior foi preservado, pois apontava para outro repositório. Use o destino explicitamente ao enviar alterações.

## Conferir a entrega

Após o push, acompanhe o build do Pages e confira o site servido: HTML, imagens, CSS e scripts. Não basta confirmar que o Git recebeu o commit.

O cache atual é `portfolio-v28`, com 58 recursos. CSS e scripts referenciados no HTML usam `v=20261026.6`. Ao alterar esses recursos, atualize tanto o cache quanto essa identificação para que o navegador não reutilize uma versão anterior. Fontes locais e imagem de compartilhamento também fazem parte do cache.

Além das páginas anteriores, confira `index.html` (galáxia como Home), `galaxy.html` (URL compatível), `links.html` (entrada social), as seis faces do cubo e o catálogo completo. Para atualizar os repositórios, execute `python scripts/sync-repositories.py` e revise as mudanças antes de publicar.

O formulário prepara um rascunho de e-mail enquanto não houver endpoint real configurado. O PDF final do currículo continua pendente; o resumo profissional pode ser impresso pelo navegador.

## Recuperação

O estado anterior à revisão Galáxia foi enviado no commit `35cab2c`; o estado anterior à revisão editorial está em `325d182`. Se uma regressão impedir navegação, contato ou acesso aos projetos, Breno pode reverter o commit da revisão e enviar um novo commit, preservando o histórico. Incremente o nome do cache mesmo no retorno para não manter arquivos da versão revertida. Antes de reverter, registre a falha e verifique a correção localmente.

Não publique repositórios em `projetos/`, variáveis de ambiente ou evidências locais em `output/`.
