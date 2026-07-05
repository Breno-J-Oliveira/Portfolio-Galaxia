# BRENO J. OLIVEIRA — Portfolio

> Backend Developer & Systems Engineer

Portfolio interativo com tema espacial/galáxia, engine de canvas customizada e design dark luxury.

## Estrutura do Projeto (FSD — Feature-Sliced Design)

```
PORTIFOLIO/
├── index.html              # Página da Galáxia (home)
├── about.html              # Sobre mim
├── projects.html           # Projetos
├── services.html           # Serviços
├── contact.html            # Contato
├── 404.html                # Página 404 personalizada
├── sw.js                   # Service Worker
├── .htaccess               # Configuração Apache
├── manifest.webmanifest    # PWA Manifest
├── sitemap.xml             # SEO
├── favicon.svg
│
├── src/                    # Código fonte (FSD)
│   ├── app/                # Núcleo da aplicação
│   │   ├── styles/globals.css   # Variáveis CSS, reset, base
│   │   └── data/index.js        # Dados centralizados
│   │
│   ├── pages/              # Páginas (uma slice por página)
│   │   ├── galaxy/              # styles/ + model/
│   │   ├── about/
│   │   ├── projects/
│   │   ├── services/
│   │   └── contact/
│   │
├── widgets/            # Componentes reutilizáveis (injetados via fetch)
│   │   ├── hud/                 # hud.html + hud.css + hud.js
│   │   ├── loader/              # loader.html + loader.css
│   │   └── modal/               # modal.html + modal.css
│   │
│   ├── features/           # Funcionalidades transversais
│   │   ├── theme-toggle/        # Tema claro/escuro + accent picker
│   │   ├── shortcuts/           # Atalhos de teclado
│   │   └── transitions/         # Transições entre páginas
│   │
│   └── shared/             # Código compartilhado
│       └── lib/utils.js         # Cursor, bg-canvas, progress, reveal
│
├── assets/                 # Recursos estáticos
│   ├── fotos/                   # Fotos pessoais
│   └── projetos/                # Imagens de projetos
│
├── projetos/               # Projetos de exemplo (demos)
│   ├── PROJETO-ARQUON/
│   ├── api-auth/
│   ├── dashboard-financeiro/
│   └── ...
│
├── docs/                   # Documentação
│   ├── animations.md
│   ├── changelog.md
│   ├── components.md
│   ├── deployment.md
│   ├── design-system.md
│   ├── galaxy-engine.md
│   ├── seo.md
│   ├── typography.md
│   └── portfolio-info.md       # Guia de personalização
│
├── BACKUP/                 # Backups de segurança
│   ├── css-v1/                  # CSS anterior à FSD
│   ├── js-v1/                   # JS anterior à FSD
│   └── README-arqon.md          # README do projeto ARQON
│
├── claude.md               # Guia de arquitetura FSD
├── ADICOES INTERRESANTES.md # Checklist de features
└── README.md               # Este arquivo
```

## Como rodar

1. Instale e inicie o **XAMPP**
2. Coloque o projeto em `c:\xampp\htdocs\PORTIFOLIO\`
3. Acesse `http://localhost/PORTIFOLIO/`

> O projeto usa `fetch()` para injetar componentes (HUD, loader, modal), então **é necessário um servidor web** — não funciona abrindo direto do `file://`.

## Personalização

Edite `src/app/data/index.js` para alterar conteúdo (projetos, textos, links).
Consulte `docs/portfolio-info.md` para o guia completo.

## Stack

- HTML5 semântico
- CSS3 (custom properties, grid, flexbox, animations)
- JavaScript vanilla (sem frameworks)
- Canvas 2D (engine de galáxia customizada)
- Service Worker (PWA offline)
- XAMPP/Apache (servidor local)
