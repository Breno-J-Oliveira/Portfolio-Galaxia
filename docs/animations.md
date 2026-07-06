# Catálogo de Animações — Portfólio Galaxy

Todas as animações disponíveis, como ativá-las e seus parâmetros.

---

## 1. Animações via Intersection Observer (CSS + JS)

Ativadas automaticamente quando o elemento entra no viewport. Inicialmente `opacity: 0`.

| Classe CSS            | Efeito                              | Parâmetro             |
|-----------------------|-------------------------------------|-----------------------|
| `.animate-fade-up`    | Fade-in + sobe 30px                 | `data-delay="200"`    |
| `.animate-fade-in`    | Fade-in puro                        | `data-delay="0"`      |
| `.animate-slide-left` | Desliza da direita para o centro    | —                     |
| `.animate-slide-right`| Desliza da esquerda para o centro   | —                     |
| `.animate-scale-in`   | Escala de 85% para 100%             | —                     |
| `.stagger-children`   | Filhos entram em sequência (80ms)   | —                     |
| `.reveal`             | Fade-up suave (transição, não anim.)| —                     |

### Exemplo de uso

```html
<!-- Elemento com fade-up -->
<div class="animate-fade-up">Conteúdo que aparece</div>

<!-- Grupo com stagger (filhos animam em sequência) -->
<div class="stagger-children">
  <div>Item 1 — aparece primeiro</div>
  <div>Item 2 — aparece 80ms depois</div>
  <div>Item 3 — aparece 160ms depois</div>
</div>
```

### Delays manuais
```html
<div class="animate-fade-up animate-delay-200">Com 200ms de delay</div>
<div class="animate-fade-up animate-delay-400">Com 400ms de delay</div>
```

---

## 2. Typewriter

| Função/Atributo       | Descrição                          | Parâmetros                  |
|-----------------------|------------------------------------|-----------------------------|
| `data-typewriter`     | Textos separados por `\|`          | —                           |
| `data-tw-speed`       | Velocidade em ms por caractere     | Padrão: `60`                |
| `data-tw-delay`       | Pausa entre textos em ms           | Padrão: `1500`              |

```html
<span
  data-typewriter="Backend Developer|Systems Engineer|API Architect"
  data-tw-speed="60"
  data-tw-delay="2000"
></span>
```

---

## 3. Contadores Animados

| Atributo         | Descrição                 | Exemplo        |
|------------------|---------------------------|----------------|
| `data-counter`   | Marca o elemento          | —              |
| `data-target`    | Valor final               | `"47"`         |
| `data-suffix`    | Sufixo após o número      | `"+"` ou `"k"` |

```html
<span data-counter data-target="47" data-suffix="+">0</span>
```
O número sobe de 0 ao valor real com easing `ease-out-expo` em 1800ms.

---

## 4. Skill Bars

```html
<div data-level="85">  <!-- atributo no elemento pai -->
  <div class="skill-bar-wrap">
    <div class="skill-bar-fill"></div>  <!-- largura setada via JS -->
  </div>
</div>
```
A barra preenche quando o elemento entra no viewport (IntersectionObserver threshold 0.3).

---

## 5. Parallax

```html
<div data-parallax="0.3">
  <!-- Elemento se move 30% mais devagar que o scroll -->
</div>
```

- `0.1` → paralelo quase estático
- `0.3` → sutil (recomendado)
- `0.5` → parallax notável
- `0.8` → intenso

---

## 6. Tilt 3D

```html
<div class="tilt-card" data-tilt-max="10">
  <!-- Card inclina até 10° em X e Y com o mouse -->
</div>
```

- Funciona no `mousemove`
- Se restaura no `mouseleave`
- **Desabilitado** com `prefers-reduced-motion`

---

## 7. Ripple em Botões

Automático em todos os elementos `.btn`. Ao clicar, uma onda se expande a partir do ponto de clique.

```html
<button class="btn btn-primary">Clique aqui</button>
```

---

## 8. Transição de Página

Automática para todos os links `a[href]` que apontam para páginas internas (não âncoras, não links externos).

- **Saída**: fade-out do overlay em 300ms
- **Entrada**: fade-in após carregamento

O overlay `#page-transition-overlay` já está incluído em todas as páginas com `class="page-transition-overlay active"` — a classe `active` é removida em ~50ms no `DOMContentLoaded`.

---

## 9. Accordion (FAQ)

```html
<div class="accordion-item">
  <button class="accordion-btn">
    <span>Pergunta?</span>
    <div class="accordion-icon">+</div>
  </button>
  <div class="accordion-body">
    <div class="accordion-body-inner">Resposta.</div>
  </div>
</div>
```

- Abre com `max-height` transitioning de `0` a `400px`
- Ícone `+` roda 45° quando aberto
- Por padrão, fechar um abre outro (comportamento accordion clássico)

---

## 10. Keyframes Disponíveis

Todos definidos em `css/animations.css`. Use diretamente em CSS customizado:

```css
.meu-elemento {
  animation: fade-up 0.6s var(--ease-out) forwards;
}
```

| Keyframe         | Descrição                        |
|------------------|----------------------------------|
| `fade-in`        | Opacidade 0→1                   |
| `fade-up`        | Opacity + translateY(30px→0)    |
| `fade-down`      | Opacity + translateY(-30px→0)   |
| `slide-left`     | Opacity + translateX(40px→0)    |
| `slide-right`    | Opacity + translateX(-40px→0)   |
| `scale-in`       | Opacity + scale(0.85→1)         |
| `pulse`          | scale(1→1.05→1) loop            |
| `float`          | translateY(0→-12px→0) loop      |
| `shimmer`        | Gradiente deslizante             |
| `spin`           | rotate(0→360deg) loop           |
| `border-gradient-x` | Gradiente de borda animado   |
