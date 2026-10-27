# Changelog

Todos os registros de mudanças importantes neste projeto.

---

## 26/10/2026 — Restauração da Home e das referências originais

- Galáxia original restaurada como `index.html`, sem apresentação convencional na abertura.
- Menu direto complementa as estrelas, mantendo acesso simples às páginas internas.
- Fontes originais Orbitron, Rajdhani e Space Mono, fundo preto, HUD e acentos por seção recuperados.
- Cubo, catálogo de 81 repositórios e fluxos de contato preservados.
- Cache `portfolio-v28`, recursos `v=20261026.6`.

## 26/10/2026 — Identidade Galáxia, cubo e caminhos de navegação (rodada anterior)

- Home com apresentação direta, mapa estático e projetos; galáxia original em uma rota opcional.
- Orbitron, órbitas, estrelas discretas e marcadores de cor recuperam a identidade sem transições de tela.
- Cubo 3D inspirado no portfólio anterior, seis faces, teclado, botões e alternativa textual.
- Menu estático com cinco destinos, legível no celular e utilizável sem JavaScript.
- Catálogo dos 81 repositórios públicos, com forks identificados, filtros, paginação e script de atualização.
- Página de links para redes, metadados e imagem própria de compartilhamento.
- Contato por intenção, canais diretos e preservação do briefing/rascunho.
- Fontes locais com licenças OFL; cache `portfolio-v26`.
- [Direção e fluxo](direcao-galaxia.md), [redes](fluxo-redes.md) e [verificação](validacao-galaxia.md).

## 26/10/2026 — Revisão editorial e de navegação

- Navegação nativa, sem atrasos, warp ou carregamento simulado.
- Textos dos projetos reescritos, títulos diretos e tipografia mais legível.
- Removidos contadores, princípios genéricos e ferramentas duplicadas.
- Filtros secundários e montador de pedido recolhidos inicialmente.
- Galáxia preservada na Home; cursor nativo e páginas internas sem partículas/parallax.
- Tab e toque corrigidos na Home para não capturar a navegação do menu.
- Recursos versionados e cache isolado em `portfolio-v24`.
- Configuração de publicação estática por GitHub Pages, com `.nojekyll`.
- Validação detalhada em [revisao-editorial.md](revisao-editorial.md).

## 26/10/2026 — Segunda rodada: experiência e recursos

- 39 melhorias detalhadas em [melhorias-2026-10-26.md](melhorias-2026-10-26.md).
- Resumo profissional imprimível, filtros de habilidades e trajetória.
- Explorador com favoritos, ordenação, filtros na URL e links diretos.
- Controles de galeria, ampliação acessível e navegação entre projetos.
- Montador de briefing integrado ao formulário; salvamento opcional de rascunho.
- Preferências de movimento e atalhos, compartilhamento e aviso offline.
- Cache `portfolio-v21` com 48 recursos e recarga explícita dos assets no pré-cache.

## 26/10/2026 — Atualização de carreira e projetos

- Perfil Full Stack, formação em andamento e experiência na Axtron.IO.
- Nexly, ARQON, ZENITH e NexusAuth com links próprios, contexto, status e imagens públicas.
- Model central compartilhado entre Sobre, Projetos e Serviços.
- Removidos depoimentos/credenciais fictícios e percentuais de proficiência.
- Contato com validação e rascunho de e-mail explícito, sem simulação de envio.
- Solicitação de currículo enquanto o PDF não é fornecido; idiomas sem áudio fictício.
- Navegação mobile, modais por teclado, estado vazio da busca e legibilidade.
- Cache `portfolio-v17`, sem interceptar POSTs ou respostas externas.
- Estado atual em [status.md](status.md). Entradas abaixo são históricas.

---

## [1.0.0] — 2025 — Versão inicial completa

### Adicionado

**Motor da Galáxia**
- Galáxia rotativa com 600+ estrelas de fundo e cintilação individual
- 3 braços espirais logarítmicos com gradiente de densidade
- Núcleo central com 3 camadas de glow radial
- 6 planetas-projeto posicionados na galáxia (lidos de `data.js`)
- Estrelas cadentes periódicas com rastro fade
- Parallax suave com mouse e toque
- Zoom via scroll com easing
- Tooltip ao hover nos planetas
- Cursor personalizado com expansão nos planetas
- Suporte a `prefers-reduced-motion` (modo estático)

**Páginas (5)**
- `index.html` — Hero galáxia + Stats + Projetos + Serviços + Depoimentos + CTA
- `about.html` — Bio + Skills com tabs + Timeline + Educação + Interesses
- `projects.html` — Grid filtrado + busca + modal de detalhes
- `services.html` — Cards de serviços + processo de trabalho + planos + FAQ
- `contact.html` — Formulário validado + honeypot + info de contato

**Design System**
- Dark Luxury com CSS Custom Properties completo
- Glassmorphism em cards
- Neon glow nos elementos hover
- Grain texture sutil no body
- Scanlines overlay
- Cursor personalizado
- Scrollbar customizada
- Seleção de texto com cor accent

**Arquitetura**
- `js/data.js` — Model central (todos os dados em um lugar)
- `css/style.css` — Tokens globais, reset, tipografia
- `css/animations.css` — Keyframes e classes de animação
- `css/galaxy.css` — Estilos do hero canvas
- `css/nav.css` — Navbar + drawer mobile + footer
- `css/cards.css` — Cards de projeto, serviço, depoimento, plano
- `js/galaxy.js` — Motor da galáxia
- `js/nav.js` — Navegação responsiva + cursor + transição de página
- `js/animations.js` — IntersectionObserver + typewriter + contadores + carrossel
- `js/projects.js` — Grid + filtros + busca + modal
- `js/contact.js` — Validação + honeypot + estados de submit

**Acessibilidade**
- Skip link no topo de todas as páginas
- `role` e `aria-label` no canvas
- `aria-live` na mensagem de sucesso do formulário
- Foco visível customizado com cor accent
- `prefers-reduced-motion` desliga todas as animações
- Contraste WCAG AA em todos os textos principais

**Documentação (`docs/`)**
- `design-system.md` — Paleta, tokens, efeitos, espaçamento
- `typography.md` — Fontes, escala, regras de uso
- `components.md` — Catálogo de componentes
- `galaxy-engine.md` — Documentação técnica do motor
- `animations.md` — Catálogo de animações
- `deployment.md` — GitHub Pages, Netlify e Vercel
- `seo.md` — Checklist de SEO e meta tags
- `changelog.md` — Este arquivo

**Guia de personalização**
- `portfolio-info.md` — Todos os campos a substituir com informações reais

### Tecnologias utilizadas
- HTML5 semântico
- CSS3 com Custom Properties
- JavaScript ES2020+ (sem frameworks)
- Canvas 2D API
- Intersection Observer API
- Web Animations API
- Google Fonts (Space Grotesk, Inter, JetBrains Mono)
- Devicons CDN

---

## Pendente para próximas versões

- [ ] Modo claro (toggle light/dark)
- [ ] Blog / seção de artigos técnicos
- [ ] Integração com GitHub API (stats em tempo real)
- [ ] Versão PWA com Service Worker
- [ ] Página 404 temática (buraco negro)
- [ ] Terminal oculto (easter egg)
- [ ] Integração com Konami Code
- [ ] Analytics privacy-first (Plausible ou Fathom)
- [ ] Internacionalização (PT-BR / EN)
- [ ] WebGL para efeitos avançados na galáxia
