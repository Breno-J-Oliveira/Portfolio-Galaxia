# Catálogo de Componentes — Portfólio Galaxy

Documentação de todos os componentes reutilizáveis.

---

## 1. Navbar

**Arquivo:** `css/nav.css` + `js/nav.js`  
**Presente em:** todas as páginas

### Estados
- **Padrão** (topo da página): altura 70px, fundo transparente
- **Scrolled** (após 60px de scroll): altura 58px, `backdrop-filter: blur(20px)`, borda inferior
- **Mobile** (< 768px): hamburguer visível, links e CTA ocultos

### Scroll Spy
O link da página atual recebe classe `active` (underline cyan). Para seções internas, o link é atualizado conforme a seção visível.

### Drawer Mobile
- Abre com `hamburger.click()` → botão anima para X
- Fecha com: clique no overlay, link de navegação, ou tecla `Escape`
- `body.overflow = 'hidden'` durante abertura (impede scroll do fundo)

### Indicador de progresso
`#reading-progress` — linha de 2px no topo, preenchida conforme scroll.

---

## 2. Galaxy Canvas

**Arquivo:** `js/galaxy.js` + `css/galaxy.css`  
**Presente em:** `index.html`

Ver `docs/galaxy-engine.md` para documentação técnica completa.

### Inicialização
```javascript
// Chamado no DOMContentLoaded do index.html
galaxyInit('galaxy-canvas');
```

### Tooltip
```html
<div id="galaxy-tooltip">
  <div class="galaxy-tooltip-inner">
    <div class="gt-label" id="gt-label">Projeto</div>
    <div class="gt-name"  id="gt-name">—</div>
    <div class="gt-desc"  id="gt-desc">—</div>
    <div class="gt-tags"  id="gt-tags"></div>
    <div class="gt-action">↩ Clique para explorar</div>
  </div>
</div>
```

---

## 3. Project Card

**Arquivo:** `css/cards.css`  
**Renderizado via:** `js/projects.js` (projects.html) e `index.html` inline JS

### Estrutura HTML
```html
<div class="project-card tilt-card">
  <div class="project-card-img">
    <img src="..." alt="Screenshot" />
    <div class="project-card-overlay">
      <a href="..." class="project-card-overlay-btn">↗</a>
      <button class="project-card-overlay-btn" data-project-id="1">⊕</button>
    </div>
  </div>
  <div class="project-card-body">
    <div class="project-card-category">Backend</div>
    <h3 class="project-card-title">Nome do Projeto</h3>
    <p class="project-card-desc">Descrição curta...</p>
    <div class="project-card-stack">
      <span class="tag">Node.js</span>
    </div>
  </div>
  <div class="project-card-footer">
    <a href="..." class="btn btn-ghost btn-sm">GitHub</a>
    <button class="btn btn-secondary btn-sm" data-project-id="1">Detalhes</button>
  </div>
</div>
```

### Variação Featured
Adicione `.project-card--featured` — exibe badge "Destaque" e borda cyan.

### Tilt 3D
A classe `.tilt-card` ativa o efeito via `js/animations.js`. Desabilitado com `prefers-reduced-motion`.

### Dados do objeto `project`
Ver `js/data.js → projects[]` para todos os campos.

---

## 4. Project Modal

**Arquivo:** `js/projects.js`  
**Presente em:** `projects.html`

### Abrir programaticamente
```javascript
const proj = PORTFOLIO_DATA.projects.find(p => p.id === 1);
openModal(proj); // função privada no projects.js
```

### Fechar
```javascript
closeModal(); // função privada no projects.js
// Ou: tecla Escape, clique no backdrop, botão ✕
```

### Campos exibidos
`category`, `title`, `client`, `year`, `long` (descrição longa), `stack`, `challenges`, `results`, `url`, `repo`

---

## 5. Skills Tab

**Arquivo:** `about.html` (CSS inline) + `js/animations.js`  
**Tabs:** Frontend | Backend | Ferramentas

### Estrutura
```html
<div data-tabs>
  <div class="tabs-nav" role="tablist">
    <button data-tab="frontend" class="active" role="tab">Frontend</button>
    <button data-tab="backend"  role="tab">Backend</button>
  </div>
  <div data-tab-content="frontend" class="tab-pane active">
    <div class="skills-grid" id="skills-frontend"></div>
  </div>
  <div data-tab-content="backend"  class="tab-pane">
    <div class="skills-grid" id="skills-backend"></div>
  </div>
</div>
```

### Skill Item
```html
<div class="skill-item" data-level="85">
  <div class="skill-header">
    <div class="skill-info">
      <i class="devicon-nodejs-plain skill-icon"></i>
      <span class="skill-name">Node.js</span>
    </div>
    <div class="skill-meta"><span>85%</span><span>3a exp.</span></div>
  </div>
  <div class="skill-bar-wrap">
    <div class="skill-bar-fill"></div>
  </div>
</div>
```

---

## 6. Testimonial Carousel

**Arquivo:** `js/animations.js` (função `initTestimonialCarousel`)  
**Presente em:** `index.html`

- Auto-play a cada 4s
- Pausa no `mouseenter`
- Swipe mobile suportado
- Responsivo: 3 cards desktop → 2 tablet → 1 mobile

### Controles
```html
<button id="test-prev">‹</button>
<div id="test-dots"></div>
<button id="test-next">›</button>
```

---

## 7. Timeline

**Arquivo:** `about.html` (CSS inline) + renderizado via JS

```html
<div class="timeline">
  <div class="timeline-item current">
    <div class="timeline-dot"></div>
    <div class="timeline-period">2024 – Atual</div>
    <div class="timeline-role">Backend Developer</div>
    <div class="timeline-company">
      Empresa
      <span class="timeline-current-badge">Atualmente</span>
    </div>
    <p class="timeline-desc">Descrição...</p>
    <div class="timeline-stack">
      <span class="tag">Node.js</span>
    </div>
  </div>
</div>
```

- Linha vertical à esquerda com gradient cyan→purple
- Ponto pulsante (`.timeline-dot`) na posição atual

---

## 8. Contact Form

**Arquivo:** `js/contact.js`  
**Presente em:** `contact.html`

### Campos
| Campo          | Tipo       | Validação                      |
|----------------|------------|-------------------------------|
| `name`         | text       | Obrigatório                   |
| `email`        | email      | Obrigatório + regex de e-mail |
| `project_type` | select     | Opcional                      |
| `budget`       | select     | Opcional                      |
| `deadline`     | date       | Opcional                      |
| `message`      | textarea   | Obrigatório + mín. 20 chars   |
| `privacy`      | checkbox   | Obrigatório                   |
| `_honeypot`    | text       | Oculto — anti-spam             |

### Estados do botão Submit
1. **Normal**: "Enviar mensagem"
2. **Loading**: "Enviando..." + spinner + `disabled`
3. **Sucesso**: form some, `#form-success` aparece com animação

---

## 9. FAQ Accordion

**Arquivo:** `services.html` (inline JS)  
**Dados de:** `data.js → faq[]`

- Clique abre/fecha com `max-height` transition
- Apenas um item aberto por vez
- ARIA: `aria-expanded` atualizado no botão

---

## 10. Footer

**Presente em:** todas as páginas  
**Estilo:** `css/nav.css` (`.site-footer`)

Estrutura de 3 colunas (logo+bio | links | redes sociais), responsivo para 1 coluna em mobile.

Dados das redes sociais renderizados via JS a partir de `PORTFOLIO_DATA.social`.
