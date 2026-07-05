# Design System — Portfólio Galaxy Dark Luxury

Documentação oficial do design system. Esta é a fonte da verdade para cores, tipografia, espaçamento e efeitos visuais.

---

## 1. Paleta de Cores

Todas as cores são definidas como CSS Custom Properties em `:root` no arquivo `css/style.css`.

| Variável CSS                  | Hex / Valor                  | Função / Uso                                      |
|-------------------------------|------------------------------|---------------------------------------------------|
| `--color-bg-primary`          | `#000000`                    | Fundo base — preto puro                           |
| `--color-bg-secondary`        | `#080808`                    | Seções alternadas, cards                          |
| `--color-bg-tertiary`         | `#0d0d0d`                    | Inputs, hover suave, backgrounds internos         |
| `--color-bg-card`             | `rgba(8,8,8,0.8)`            | Cards com semitransparência                       |
| `--color-bg-glass`            | `rgba(255,255,255,0.03)`     | Glassmorphism leve                                |
| `--color-bg-overlay`          | `rgba(0,0,0,0.75)`           | Overlays de modal                                 |
| `--color-accent-cyan`         | `#00f5ff`                    | **Cor principal** — links, bordas ativas, CTA     |
| `--color-accent-purple`       | `#b44fff`                    | **Cor secundária** — hover, gradientes            |
| `--color-accent-gold`         | `#ffd700`                    | Detalhes premium, ratings, conquistas             |
| `--color-accent-pink`         | `#ff2d78`                    | Erros, alertas, CTAs de urgência                  |
| `--color-accent-green`        | `#00ff88`                    | Status disponível, sucesso, validação ok          |
| `--color-text-primary`        | `#ffffff`                    | Títulos, texto principal                          |
| `--color-text-secondary`      | `#a0a0b0`                    | Parágrafos, descrições                            |
| `--color-text-muted`          | `#505060`                    | Placeholders, labels, metadata                   |
| `--color-border`              | `rgba(255,255,255,0.06)`     | Bordas padrão (6% opacidade)                     |
| `--color-border-hover`        | `rgba(0,245,255,0.3)`        | Bordas no hover (cyan 30%)                        |
| `--color-glow-cyan`           | `rgba(0,245,255,0.15)`       | Glow/brilho em elementos cyan                     |
| `--color-glow-purple`         | `rgba(180,79,255,0.15)`      | Glow/brilho em elementos roxos                    |
| `--color-glow-gold`           | `rgba(255,215,0,0.15)`       | Glow/brilho em elementos dourados                 |

### Regras de Uso

**Combinações permitidas (contraste WCAG AA):**
- Texto branco `#fff` sobre fundo `#000` — ✅ 21:1
- Cyan `#00f5ff` sobre fundo `#000` — ✅ adequado para UI (não para corpo de texto extenso)
- Texto `#a0a0b0` sobre fundo `#000` — ✅ 4.6:1

**Combinações proibidas:**
- ❌ Cyan `#00f5ff` sobre roxo `#b44fff` — contraste insuficiente (~1.2:1)
- ❌ Gold `#ffd700` sobre branco — ilegível
- ❌ Muted `#505060` como cor de texto sobre fundo secundário — falha WCAG

---

## 2. Tokens de Espaçamento

Escala multiplicada por 4 (sistema 4px):

| Token        | Valor   | Uso típico                                    |
|--------------|---------|-----------------------------------------------|
| `--space-1`  | `4px`   | Gap mínimo, padding de badges                 |
| `--space-2`  | `8px`   | Gap entre ícone e texto, padding de tags      |
| `--space-3`  | `12px`  | Gap de lista, padding pequeno                 |
| `--space-4`  | `16px`  | Padding de card compacto, gap de grid pequeno |
| `--space-6`  | `24px`  | Padding de card, gap de seção interna         |
| `--space-8`  | `32px`  | Padding padrão de card, gap de grid           |
| `--space-12` | `48px`  | Espaçamento entre elementos de seção          |
| `--space-16` | `64px`  | Padding de seção compacta                     |
| `--space-24` | `96px`  | Padding de seção normal                       |
| `--space-32` | `128px` | Padding de hero/seção grande                  |

**Seções:** `padding-block: var(--section-padding)` onde `--section-padding: clamp(64px, 10vw, 128px)`

---

## 3. Breakpoints

| Nome      | Largura mínima | O que muda                                          |
|-----------|----------------|-----------------------------------------------------|
| Mobile    | Base (< 768px) | 1 coluna, nav hamburguer, galáxia reduzida (300 estrelas) |
| Tablet    | `768px`        | 2 colunas em grids, nav desktop aparece             |
| Desktop   | `1024px`       | 3 colunas, layout completo                          |
| Wide      | `1440px`       | Container max 1200px centralizado                   |

```css
/* Mobile-first */
/* Mobile: base styles (< 768px) */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Wide */ }
```

---

## 4. Efeitos Visuais

### Glassmorphism
```css
.glass-element {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
}
.glass-element:hover {
  border-color: rgba(0, 245, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.15);
}
```

### Neon Glow (multi-camada)
```css
.neon-cyan {
  box-shadow:
    0 0 10px rgba(0, 245, 255, 0.4),
    0 0 30px rgba(0, 245, 255, 0.2),
    0 0 60px rgba(0, 245, 255, 0.1);
}
.neon-purple {
  box-shadow:
    0 0 10px rgba(180, 79, 255, 0.4),
    0 0 30px rgba(180, 79, 255, 0.2);
}
```

### Grain Texture (pseudo-elemento no body)
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,...feTurbulence...");
  background-size: 256px;
}
```

### Scanlines
```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
}
```

---

## 5. Variáveis CSS Completas (`:root`)

Ver `css/style.css` — seção `:root` com todos os tokens comentados.

---

## 6. Bordas Arredondadas

| Token            | Valor     | Uso                          |
|------------------|-----------|------------------------------|
| `--radius-sm`    | `4px`     | Tags, inputs, badges pequenos |
| `--radius-md`    | `8px`     | Botões, inputs padrão        |
| `--radius-lg`    | `16px`    | Cards padrão                 |
| `--radius-xl`    | `24px`    | Cards grandes, modais        |
| `--radius-full`  | `9999px`  | Pills, badges, dots           |
