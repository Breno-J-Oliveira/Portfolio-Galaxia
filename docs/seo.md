# SEO — Portfólio Galaxy

Guia de SEO técnico e checklist de meta tags.

---

## 1. Checklist de Meta Tags por Página

| Página          | `<title>`                          | `description`               | canonical                       |
|-----------------|------------------------------------|-----------------------------|--------------------------------|
| `index.html`    | Breno J. Oliveira — Backend Dev    | Bio + especialidade         | `https://[dominio].com/`        |
| `about.html`    | Sobre — Breno J. Oliveira          | Skills + trajetória         | `https://[dominio].com/about.html` |
| `projects.html` | Projetos — Breno J. Oliveira       | Tipos de projetos           | `https://[dominio].com/projects.html` |
| `services.html` | Serviços — Breno J. Oliveira       | Serviços + preços           | `https://[dominio].com/services.html` |
| `contact.html`  | Contato — Breno J. Oliveira        | CTA de contato              | `https://[dominio].com/contact.html` |

### Meta tags obrigatórias (todas as páginas):
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Breno J. Oliveira — Backend Developer</title>
<meta name="description" content="[150-160 caracteres descrevendo a página]">

<!-- Open Graph -->
<meta property="og:title"       content="[Título da página]">
<meta property="og:description" content="[Descrição para redes sociais]">
<meta property="og:image"       content="https://[dominio].com/assets/og-image.jpg">
<meta property="og:url"         content="https://[dominio].com/[pagina].html">
<meta property="og:type"        content="website">

<!-- Twitter Cards -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="[Título]">
<meta name="twitter:description" content="[Descrição]">
<meta name="twitter:image"       content="https://[dominio].com/assets/og-image.jpg">

<!-- Canonical -->
<link rel="canonical" href="https://[dominio].com/[pagina].html">
```

---

## 2. Boas Práticas Aplicadas no Projeto

### Estrutura de headings
- `<h1>` único por página (usado no título principal da seção hero)
- `<h2>` para títulos de seção
- `<h3>` para títulos de card
- Nunca pule níveis (h1 → h3 sem h2)

### Alt text em imagens
```html
<!-- Projeto -->
<img src="..." alt="Screenshot do projeto Intelligent Traffic Control System">

<!-- Foto de perfil -->
<img src="foto.jpg" alt="Foto de Breno J. Oliveira">

<!-- Placeholder -->
<img src="..." alt="[DESCRIÇÃO DO QUE A IMAGEM MOSTRA]">
```

### lang no html
```html
<html lang="pt-BR">
```

### Sitemap
Gere um `sitemap.xml` na raiz:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://[dominio].com/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://[dominio].com/about.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://[dominio].com/projects.html</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://[dominio].com/services.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://[dominio].com/contact.html</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
</urlset>
```

---

## 3. Velocidade e Core Web Vitals

| Métrica | O que mede                        | Meta      |
|---------|-----------------------------------|-----------|
| **LCP** | Largest Contentful Paint          | < 2.5s    |
| **INP** | Interaction to Next Paint         | < 200ms   |
| **CLS** | Cumulative Layout Shift           | < 0.1     |

### Galaxy Canvas e LCP
O canvas pode atrasar o LCP porque é a maior imagem na tela. Mitação:
1. Loading screen mascaraa o LCP real até o canvas estar pronto
2. Fontes usam `display=swap` → texto visível antes da fonte carregar
3. Imagens dos projetos têm `loading="lazy"` → não bloqueiam o carregamento inicial

### Fontes Google — evitar FOIT
```html
<!-- Já configurado no projeto com display=swap -->
&family=Space+Grotesk:...&display=swap
```

---

## 4. Schema.org — Pessoa/Profissional

Cole no `<head>` do `index.html`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Breno J. Oliveira",
  "jobTitle": "Backend Developer & Systems Engineer",
  "description": "Desenvolvedor especializado em APIs, sistemas embarcados e automação",
  "url": "https://[SEU-DOMINIO].com",
  "email": "[SEU@EMAIL.COM]",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[CIDADE]",
    "addressCountry": "BR"
  },
  "sameAs": [
    "https://github.com/Breno-J-Oliveira",
    "https://linkedin.com/in/[SEU-PERFIL]"
  ]
}
</script>
```

---

## 5. Google Search Console

1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione propriedade → verifique via meta tag ou arquivo HTML
3. Submeta o sitemap em: Sitemaps → `https://[dominio].com/sitemap.xml`
4. Monitore:
   - **Cobertura**: páginas indexadas vs com erro
   - **Desempenho**: cliques, impressões, CTR
   - **Core Web Vitals**: métricas reais de usuários

---

## 6. robots.txt

Crie `robots.txt` na raiz:
```
User-agent: *
Allow: /

Sitemap: https://[SEU-DOMINIO].com/sitemap.xml
```
