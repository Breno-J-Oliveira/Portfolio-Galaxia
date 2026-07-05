# Galaxy Engine — Documentação Técnica

Motor da galáxia em Canvas 2D (`js/galaxy.js`). Responsável por toda a experiência visual do hero.

---

## 1. Visão Geral

O `galaxy.js` é o motor de renderização 2D que cria a galáxia interativa no hero. Usa `requestAnimationFrame` para um loop de ~60fps.

### Responsabilidades
- Renderizar 600+ estrelas de fundo com brilho individual
- Desenhar braços espirais logarítmicos
- Animar o núcleo central com glow multicamada
- Posicionar e animar planetas-projeto (lidos de `data.js`)
- Detectar hover e clique nos planetas com tooltip
- Parallax suave via mouse/toque
- Zoom via scroll com easing
- Estrelas cadentes periódicas

### Diagrama da estrutura de dados
```
galaxy.js
├── GALAXY_CONFIG          — configurações do motor
├── bgStars[]              — estrelas de fundo distribuídas em círculo
├── spiralStars[]          — estrelas dos braços espirais
├── planetStars[]          — planetas-projeto (lidos de PORTFOLIO_DATA)
├── dustParticles[]        — nebulosidade/poeira cósmica
└── shootingStars[]        — estrelas cadentes transitórias
```

---

## 2. GALAXY_CONFIG — Referência Completa

| Parâmetro        | Tipo     | Padrão   | Descrição                                         |
|------------------|----------|----------|---------------------------------------------------|
| `bgStarCount`    | `number` | `600`    | Quantidade de estrelas de fundo dispersas         |
| `spiralArms`     | `number` | `3`      | Número de braços espirais logarítmicos            |
| `armStarCount`   | `number` | `200`    | Estrelas por braço espiral                        |
| `rotationSpeed`  | `number` | `0.00012`| Velocidade de rotação em radianos por frame       |
| `parallaxFactor` | `number` | `0.04`   | Intensidade do deslocamento com o mouse (0–1)    |
| `shootInterval`  | `number` | `2800`   | Intervalo entre estrelas cadentes em ms           |
| `shootTrailLen`  | `number` | `22`     | Comprimento do rastro da estrela cadente          |
| `zoomMin`        | `number` | `0.5`    | Zoom mínimo ao fazer scroll para fora             |
| `zoomMax`        | `number` | `2.2`    | Zoom máximo ao fazer scroll para dentro           |
| `nucleusRadius`  | `number` | `0.06`   | Raio do núcleo como proporção do raio galáctico   |
| `hitRadius`      | `number` | `45`     | Raio de detecção de clique nos planetas (px)      |

### Como alterar configurações
```javascript
// Em js/galaxy.js, modifique o objeto antes da inicialização:
GALAXY_CONFIG.rotationSpeed = 0.00008;  // mais devagar
GALAXY_CONFIG.bgStarCount   = 800;     // mais estrelas
GALAXY_CONFIG.parallaxFactor = 0.06;   // parallax mais intenso
```

---

## 3. Como Adicionar um Novo Planeta-Projeto

1. Abra `js/data.js`
2. No array `projects`, adicione ou edite um projeto com a propriedade `galaxy`:

```javascript
{
  id: 9,
  title: "Meu Novo Projeto",
  // ... outros campos ...
  galaxy: {
    angle: 1.2,   // posição angular em RADIANOS (0 a 6.28)
    dist:  0.25,  // distância do centro como proporção (0.1 a 0.4)
    color: "#ff8800", // cor em HEX
  }
}
```

**Guia de ângulos (em radianos):**
- `0.0` → direita
- `1.57` → baixo (π/2)
- `3.14` → esquerda (π)
- `4.71` → cima (3π/2)
- `6.28` → volta à direita (2π)

**Guia de distância (`dist`):**
- `0.10–0.15` → perto do núcleo (zona central)
- `0.15–0.25` → zona dos braços espirais
- `0.25–0.35` → borda da galáxia
- `> 0.40` → fora da galáxia (evitar)

---

## 4. API de Controle

```javascript
// Inicializa o motor no canvas com id especificado
galaxyInit('galaxy-canvas');

// Pausa a animação (economiza CPU)
galaxyPause();

// Retoma a animação
galaxyResume();

// Define zoom programaticamente (0.5 a 2.2)
galaxySetZoom(1.5);
```

---

## 5. Performance

### Limites recomendados
| Dispositivo     | bgStarCount | armStarCount | FPS esperado |
|-----------------|-------------|--------------|--------------|
| Desktop moderno | 600         | 200          | 60 fps       |
| Laptop mid-range| 400         | 150          | 55–60 fps    |
| Mobile          | 300         | 100          | 45–55 fps    |

### devicePixelRatio (Retina)
O motor detecta automaticamente `window.devicePixelRatio` e escala o canvas. Em telas Retina (dpr=2), o canvas renderiza em resolução 2x mas é exibido no tamanho CSS normal.

### Cálculos fora do loop de draw
Posições iniciais das estrelas são calculadas em `buildAll()` e só recalculadas no `resize`. O loop `loop()` apenas aplica transformações de rotação/zoom, sem recalcular geometria.

---

## 6. Acessibilidade

### `prefers-reduced-motion`
Quando o usuário ativa a opção "reduzir movimento" no sistema operacional:
- A variável `reducedMotion` é `true`
- O loop `requestAnimationFrame` não é iniciado
- É chamado `drawStatic()` que renderiza uma versão estática da galáxia
- Todas as animações CSS também são desabilitadas via `animations.css`

```javascript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  loop();
} else {
  drawStatic();
}
```

### ARIA no canvas
```html
<canvas
  id="galaxy-canvas"
  role="img"
  aria-label="Galáxia interativa com planetas representando projetos — navegue com o mouse"
></canvas>
```

---

## 7. Interações Suportadas

| Interação          | Comportamento                                              |
|--------------------|------------------------------------------------------------|
| `mousemove`        | Parallax — galáxia se desloca suavemente oposto ao cursor |
| `wheel`            | Zoom in/out com easing suave                              |
| `click` em planeta | Navega para a URL do projeto com fade-out                 |
| `touchmove`        | Parallax por toque (50% da intensidade do mouse)          |
| `touchend`         | Restaura posição central                                   |
| `resize`           | Reconstrói tudo mantendo proporções                        |
