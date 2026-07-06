# Changelog

Todos os registros de mudanças importantes neste projeto.

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
