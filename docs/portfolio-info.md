# Guia de conteúdo

Consulte [status.md](status.md) para o estado atual e as pendências reais.

## Fonte principal

`src/app/data/index.js` disponibiliza `window.PORTFOLIO_DATA`.

| Campo | Conteúdo |
|---|---|
| `owner` | Bio, foto, localização e currículo |
| `social` | Referência dos perfis públicos |
| `stats` | Valores e rótulos verificáveis da página Sobre |
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

Sirva o projeto pelo Apache/XAMPP ou por um servidor HTTP local. `file://` não suporta os widgets carregados por fetch. Confira console, imagens, filtros, teclado, contato e navegação mobile. Incremente `sw.js` quando mudar arquivos precacheados.
