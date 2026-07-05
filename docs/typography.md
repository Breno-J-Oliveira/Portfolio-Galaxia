# Tipografia — Portfólio Galaxy

---

## 1. Fontes Utilizadas

| Fonte            | Papel        | Pesos               | CDN                        |
|------------------|--------------|---------------------|----------------------------|
| Space Grotesk    | Display      | 300, 400, 500, 600, 700 | Google Fonts           |
| Inter            | Body         | 300, 400, 500, 600  | Google Fonts               |
| JetBrains Mono   | Mono         | 400, 500            | Google Fonts               |

**Import URL:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

---

## 2. Escala Tipográfica

| Token         | Tamanho          | Peso | Uso                            |
|---------------|------------------|------|--------------------------------|
| `--text-xs`   | `11px`           | 400  | Legendas, tooltips, badges     |
| `--text-sm`   | `13px`           | 400  | Labels, tags, captions, meta   |
| `--text-base` | `16px`           | 400  | Corpo de texto padrão          |
| `--text-lg`   | `18px`           | 500  | Subtítulos, destaques          |
| `--text-xl`   | `22px`           | 600  | Títulos de card e seção interna|
| `--text-2xl`  | `28px`           | 600  | Títulos de página secundária   |
| `--text-3xl`  | `clamp(28,4vw,36px)` | 700 | Títulos de seção          |
| `--text-4xl`  | `clamp(36,5vw,48px)` | 700 | Títulos principais        |
| `--text-hero` | `clamp(40,7vw,80px)` | 700 | Nome no hero              |

---

## 3. Regras de Uso

- **Space Grotesk** → títulos, headings, hero, labels de seção, botões. Nunca usar em corpo de texto longo.
- **Inter** → parágrafos, descrições, listas. Nunca usar em tamanhos acima de 28px sem ajuste de `letter-spacing`.
- **JetBrains Mono** → código, badges técnicos, labels de categoria, labels de seção. Tamanho mínimo: 11px.

### line-height
- Body (Inter): `1.7`
- Headings (Space Grotesk): `1.2`
- Mono (JetBrains Mono): `1.0` ou `1.5` em blocos de código

---

## 4. Tokens CSS Completos

```css
:root {
  --font-display: 'Space Grotesk', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 16px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  clamp(28px, 4vw, 36px);
  --text-4xl:  clamp(36px, 5vw, 48px);
  --text-hero: clamp(40px, 7vw, 80px);
}
```

---

## 5. Responsividade com `clamp()`

```css
/* Título do hero — responsivo sem media queries */
.hero-name {
  font-size: clamp(40px, 7vw, 80px);
}

/* Título de seção */
.section-title {
  font-size: clamp(28px, 5vw, 48px);
}
```

---

## 6. Fallback Stack

Se as fontes do Google Fonts não carregarem:

```css
--font-display: 'Space Grotesk', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
--font-body:    'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
```

Use `font-display: swap` no import (já incluído no URL do Google Fonts) para evitar FOIT (Flash of Invisible Text).

---

## 7. Por que Space Grotesk + Inter?

- **Space Grotesk** tem personalidade geométrica e ligeira irregularidade que combina com o estilo sci-fi/dark. Os pesos 600–700 têm excelente impacto visual em tamanhos grandes.
- **Inter** foi projetada especificamente para legibilidade em telas pequenas. Tem excelente kerning automático e é altamente legível em tamanhos de 14–18px.
- O contraste entre a expressividade do Space Grotesk nos títulos e a neutralidade do Inter no corpo cria hierarquia visual clara sem precisar de mais de duas fontes.
