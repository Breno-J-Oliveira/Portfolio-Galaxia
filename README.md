# Portfólio Galáxia · Breno J. Oliveira

Portfólio de desenvolvimento Full Stack, em HTML, CSS e JavaScript, publicado em [GitHub Pages](https://breno-j-oliveira.github.io/Portfolio-Galaxia/).

A galáxia interativa em Canvas 2D é a Home e o centro da identidade do site. O menu direto fica sempre disponível; o cubo 3D da página Sobre retoma um elemento do portfólio anterior. O [plano de design e navegação](docs/direcao-galaxia.md) registra as decisões.

## Páginas

| Página | Conteúdo |
| --- | --- |
| `index.html` | Galáxia original em tela cheia, estrelas de navegação e menu direto |
| `about.html` | Perfil, cubo com seis faces, tecnologias, trajetória e formação |
| `projects.html` | Casos com galeria e catálogo de 81 repositórios públicos |
| `services.html` | Serviços e briefing que segue para o contato |
| `contact.html` | E-mail, LinkedIn e preparação opcional de mensagem |
| `resume.html` | Resumo profissional para leitura, impressão e PDF |
| `links.html` | Entrada curta para usar nas redes sociais |
| `galaxy.html` | Endereço compatível da mesma galáxia, com canônica na Home |

## Executar localmente

Sirva esta pasta com Apache/XAMPP ou Python:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765/`. Não há build de aplicação nem dependências npm para o site. O menu e o catálogo são HTML estático. Os recursos interativos são aprimoramentos em JavaScript; o service worker requer HTTP/HTTPS.

## Organização

- `src/app/data/index.js`: perfil, projetos selecionados, formação e serviços.
- `src/app/styles/cosmos.css`: direção visual atual e responsividade.
- `src/app/styles/experience.css`: controles compartilhados e preferências.
- `src/pages/*/model/`: comportamento de cada página.
- `src/features/profile-cube/cube.js`: rotação manual e seleção das faces.
- `src/pages/projects/model/catalogue.js`: filtros, paginação e URL do catálogo.
- `src/widgets/`: templates de referência do menu/modal e estilos compartilhados. Menu e modal são incorporados no HTML servido.
- `assets/fonts/`: Orbitron, Rajdhani e Space Mono originais servidas localmente; Inter preservada para compatibilidade, com licenças OFL.
- `assets/projetos/`: imagens públicas; independente dos checkouts locais ignorados.
- `assets/social-card.png`: imagem de compartilhamento das páginas.
- `sw.js`: cache offline dos recursos públicos.
- `docs/`: design, conteúdo, publicação e registros de validação.

## Atualizar os repositórios

```powershell
python scripts/sync-repositories.py
```

O script consulta os repositórios **públicos**, inclui paginação do GitHub e atualiza o catálogo estático. Não precisa de token, não publica arquivos locais e preserva a página se a consulta falhar. Os forks ficam identificados. Descrições revisadas podem ser cadastradas em `src/app/data/repository-descriptions.json`; ausência de descrição não vira informação inventada.

Depois de atualizar, confira o diff e os links, aumente a versão do cache e publique. O catálogo registra sua data de consulta; ele não promete atualização em tempo real.

## Contato e redes

A página [links.html](https://breno-j-oliveira.github.io/Portfolio-Galaxia/links.html) pode ser usada na bio. O fluxo distingue recrutamento, projetos freelance e interesse técnico. Veja [fluxo de entrada e contato](docs/fluxo-redes.md).

Sem endpoint configurado, o formulário prepara um `mailto:` para o visitante revisar e enviar no seu aplicativo de e-mail. Não afirma ter enviado mensagens. O rascunho local é opcional. O currículo final em PDF ainda não foi fornecido; `resume.html` pode ser impresso.

## Publicar e verificar

GitHub Pages usa `main`, pasta `/`, com `.nojekyll`. O remoto de entrega neste checkout é `portfolio`; `origin` aponta para outro repositório e foi preservado. Consulte [publicação](docs/deployment.md), [estado atual](docs/status.md) e [evidências desta revisão](docs/validacao-galaxia.md).

`projetos/`, `BACKUP/`, `output/`, variáveis de ambiente e arquivos privados não fazem parte da publicação.
