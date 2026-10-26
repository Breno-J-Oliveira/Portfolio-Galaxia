# Guia de conteúdo

Consulte [status.md](status.md) para o estado atual e as pendências reais.

## Fonte principal

`src/app/data/index.js` disponibiliza `window.PORTFOLIO_DATA`.

| Campo | Conteúdo |
|---|---|
| `owner` | Bio, foto, localização e currículo |
| `social` | Referência dos perfis públicos |
| `stats` | Dados históricos preservados; não são exibidos como contadores |
| `skills`, `skillCategories`, `tools` | Tecnologias agrupadas, sem percentuais de proficiência |
| `timeline`, `education` | Experiência, projetos acadêmicos e formação em andamento |
| `polyglot.languages` | Idiomas; áudio só aparece com arquivo real em `audio` |
| `projects` | Cards, filtros e modais |
| `services`, `faq` | Serviços freelance e dúvidas |
| `contact` | E-mail e endpoint opcional de formulário |

Os metadados, links sociais e textos de fallback também existem no HTML. Mantenha-os coerentes com o model ao alterar o perfil.

## Projetos

Cada projeto aceita `id`, `title`, `category`, `categoryLabel`, `status`, `featured`, `desc`, `longDesc`, `tags`, `cover`, `gallery`, `mediaNote`, `github`, `docs`, `demo` e `live`.

- Categorias: `fullstack`, `backend` ou `frontend`.
- `featured: false` inclui o item no filtro de estudos e extras.
- `live: false` quando não houver demo pública confirmada.
- Imagens publicáveis ficam em `assets/projetos/`. A pasta raiz `projetos/` é ignorada e contém repositórios separados.
- `mediaNote` identifica dados fictícios e imagens ilustrativas.
- Os campos são conteúdo editorial confiável do repositório; não inserir HTML recebido de visitantes.

## Currículo e contato

Adicione o PDF final, confira a regra de `.gitignore` para incluir explicitamente esse arquivo, cadastre `owner.cv` e só então ative `owner.cvAvailable`. Sem PDF, o botão oferece solicitação por e-mail.

`contact.formspreeId: ""` prepara um rascunho no aplicativo do visitante. Um ID real ativa envio HTTP. Teste entrega e falhas antes de publicar; não coloque tokens privados no frontend.

## Verificação

Sirva o projeto pelo Apache/XAMPP ou por um servidor HTTP local. Menu e modal estão incorporados ao HTML; HTTP/HTTPS continua necessário para verificar corretamente cache, fontes e navegação. Confira console, imagens, filtros, teclado, contato e navegação mobile. Incremente `sw.js` quando mudar arquivos precacheados.

## Cubo, catálogo e entrada social

O cubo tem o texto de referência em `about.html` e os dados usados na seleção em `src/features/profile-cube/cube.js`; mantenha ambos coerentes ao alterar as seis faces. O visual e a rotação são CSS 3D, sem biblioteca WebGL ou rotação automática.

O catálogo público é atualizado por `scripts/sync-repositories.py`. Descrições confirmadas podem ser revisadas em `src/app/data/repository-descriptions.json`. O script não publica os arquivos locais de `projetos/` e não altera os repositórios externos.

`links.html` é a página de entrada para a bio das redes. Atualize os títulos, endereços canônicos e a imagem `assets/social-card.png` quando a identidade pública mudar.
