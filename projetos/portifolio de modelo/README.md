# 💼 Portfólio de Nene — Site de Modelo com Cores Pastéis

> **Categoria no portfólio:** Frontend
> **Prioridade:** 🔴 Alta · **Status:** 🔵 Em andamento
> **Observação:** Portfólio da minha namorada (modelo)

---

## 💡 Ideia Original (Breno)

Portfólio de uma modelo. Site leve, bem usável, com cores pastéis, cheio de animações bonitas e leves. O objetivo é ser funcional — uma agência de modelos visitando o site precisa conseguir avaliar tudo o que precisa sobre a modelo de forma rápida e agradável.

---

## 🎯 Escopo

Site de portfólio profissional para modelo, pensado como **ferramenta de avaliação para agências**. A agência precisa ver fotos, medidas, experiência, vídeos, polaroids e entrar em contato — tudo em poucos cliques. Estética suave e feminina (cores pastéis), animações leves e fluidas, performance máxima. O site é a vitrine digital da modelo.

### O que uma agência procura (e o site entrega)

| Agência procura | O site tem |
|----------------|------------|
| Fotos profissionais (Book) | Galeria completa com filtros + carrossel do book |
| Polaroids (fotos sem maquiagem/produção) | Seção dedicada de polaroids |
| Medidas exatas | Ficha técnica completa (altura, manequim, calçado, etc.) |
| Experiência comprovada | Timeline de trabalhos, marcas e eventos |
| Vídeos (showreel, passarela, comercial) | Player de vídeos integrado |
| Idiomas que fala | Seção de idiomas |
| Disponibilidade e localização | Status de disponibilidade + cidade base |
| Contato rápido | Formulário de booking + WhatsApp + email direto |
| Redes sociais | Instagram, TikTok, YouTube (se houver) |
| Download do comp card | Botão para baixar PDF do comp card |

### Funcionalidades principais

#### 🏠 Hero / Apresentação
- Foto em destaque (full-screen ou near-full-screen)
- Nome da modelo + categoria (editorial, comercial, passarela)
- CTA: "Ver Portfólio" + "Baixar Comp Card"
- Animação de entrada suave (fade + slide)
- Indicador de scroll

#### 👤 Sobre / Ficha Técnica
- Biografia curta e profissional
- **Ficha técnica completa:**
  - Altura, peso (opcional)
  - Busto, cintura, quadril
  - Manequim, calçado
  - Cor dos olhos, cor do cabelo, tipo de cabelo
  - Pele (tom)
  - Tatuagens/marcas (sim/não + localização)
- Idiomas que fala (com flags)
- Cidade base + disponibilidade para viagem
- Disponibilidade atual (disponível, em projeto, indisponível)

#### 📸 Galeria / Book
- Grid masonry de fotos profissionais
- **Filtros por categoria:** Editorial, Comercial, Passarela, Lifestyle, Beauty, Swimwear
- **Lightbox:** visualização ampliada com navegação por teclado (← →) e swipe mobile
- Informações em cada foto: fotógrafo, marca/evento, data
- Lazy loading + next/image para performance

#### 🎞️ Carrossel do Book
- Carrossel horizontal com as melhores fotos (seleção curada)
- Auto-play opcional (com pausa no hover)
- Navegação por dots e setas
- Swipe no mobile

#### 📷 Polaroids
- Seção dedicada a polaroids (fotos sem produção, sem maquiagem pesada)
- Grid simples: frente, perfil, costas
- Essencial para agências avaliarem o visual natural

#### 🎬 Showreel / Vídeos
- Player de vídeos integrado (YouTube/Vimeo embed ou hospedagem própria)
- Categorias: showreel, passarela, comercial, backstage
- Thumbnail com play button animado

#### 📅 Experiência / Trabalhos
- Timeline visual de trabalhos realizados
- **Cards por trabalho:** marca/evento, tipo (editorial, desfile, comercial), data, fotógrafo, local
- Filtros por tipo de trabalho
- Logos de marcas (se disponível)

#### 📄 Comp Card (Download)
- **Comp card em PDF:** foto principal + medidas + contato + fotos secundárias
- Botão "Baixar Comp Card" no hero e na seção sobre
- Gerado automaticamente ou PDF estático

#### 📬 Contato / Booking
- Formulário de booking: nome, email, empresa/agência, tipo de trabalho, data proposta, mensagem
- Validação com Zod
- Integração com Resend ou Formspree
- **WhatsApp** direto (botão flutuante)
- Email direto
- Links de redes sociais

#### 🌐 Redes Sociais
- Instagram, TikTok, YouTube (se houver)
- Link para agência (se aplicável)
- Ícones com hover animado

#### ✨ Animações (leves e bonitas)
- Scroll reveal (fade + slide up suave)
- Parallax sutil no hero
- Hover com zoom suave nas fotos
- Transições suaves entre filtros da galeria
- Cursor personalizado (opcional, só desktop)
- Loader inicial elegante
- Texto digitando no hero (nome + categoria)
- Contador de fotos/trabalhos (count-up)
- Floating elements sutis (partículas pastéis, elementos decorativos)

#### 📱 Mobile-first
- Todas as funcionalidades funcionam no mobile
- Galeria adaptada para toque (swipe no carrossel e lightbox)
- Menu mobile elegante (hamburger com animação)
- Bottom navigation bar (opcional)
- WhatsApp button flutuante

#### 🔍 SEO & Performance
- Meta tags completas (OG, Twitter Cards)
- Structured data (Person schema)
- Sitemap.xml + robots.txt
- next/image para otimização automática
- Lighthouse 90+ em todas as métricas
- Lazy loading de imagens e vídeos

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG, SEO, next/image |
| **UI** | React 18 + TypeScript | Type safety, ecossistema |
| **Estilos** | Tailwind CSS | Utility-first, leve, sem CSS pesado |
| **Animações** | Framer Motion | Scroll reveal, transições, hover — leve e fluido |
| **Imagens** | next/image + Cloudinary | Otimização automática, responsive images |
| **Carrossel** | Embla Carousel | Leve, acessível, swipe nativo |
| **Lightbox** | yet-another-react-lightbox | Acessível, navegação por teclado, swipe |
| **Formulário** | React Hook Form + Zod | Validação type-safe |
| **Email** | Resend ou Formspree | Envio do formulário de booking |
| **PDF** | react-pdf ou PDF estático | Comp card para download |
| **Vídeo** | react-player | Player de YouTube/Vimeo |
| **SEO** | Next.js metadata API | Meta tags, OG, structured data |
| **Deploy** | Vercel | Hospedagem otimizada para Next.js |

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│              Portfólio de Nene (Next.js)                   │
│                                                            │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │   Hero    │ │  Sobre    │ │  Galeria  │ │ Carrossel │ │
│  │ Foto+Nome │ │ Ficha Téc.│ │ + Filtros │ │  do Book  │ │
│  │ + CTA     │ │ + Idiomas │ │ + Lightbox│ │  (Embla)  │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │ Polaroids │ │  Vídeos   │ │Experiência│ │  Contato  │ │
│  │ Frente/   │ │ Showreel  │ │ Timeline  │ │  Booking  │ │
│  │ Perfil    │ │ + Comercial│ │ + Marcas  │ │  + Redes  │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Comp Card PDF (download) · WhatsApp flutuante        │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX

### Paleta de cores pastéis
```
Rosa suave     #F5E6E8   (backgrounds, seções)
Lilás          #E8E0F5   (backgrounds alternativos)
Pêssego        #F5E6DC   (accents suaves)
Branco quente  #FAFAFA   (base)
Rosa principal #E8B4B8   (botões, highlights)
Lilás escuro   #C8B4D8   (hover, elementos ativos)
Dourado        #D4A574   (detalhes, comp card)
Texto escuro   #4A4A4A   (texto principal)
Texto suave    #8A8A8A   (texto secundário)
```

### Tipografia
- **Títulos:** Playfair Display (elegante, feminino, serif)
- **Corpo:** Inter (limpo, legível, sans-serif)
- **Destaques:** Cormorant Garamond (italic, para citações/frases)

### Estilo visual
- **Hero:** foto full-screen com overlay gradiente pastel suave + nome com animação de digitação + CTA
- **Seções:** backgrounds alternando entre rosa suave, lilás e branco quente
- **Galeria:** grid masonry com cantos arredondados (rounded-2xl) + sombras suaves
- **Cards:** cantos arredondados, sombras leves, hover com elevação + zoom na imagem
- **Botões:** pastel com hover suave (escurece levemente + eleva)
- **Divisores:** elementos decorativos sutis (linhas finas, flores, formas orgânicas)
- **Loader inicial:** tela branca com nome aparecendo em fade + spinner pastel

### Animações (leves, não pesadas)
- **Scroll reveal:** fade + slide up (duração 0.6s, easing suave)
- **Parallax:** sutil no hero (foto move 10% mais lento que o scroll)
- **Hover fotos:** zoom 1.05 + elevação de sombra (transição 0.3s)
- **Filtros galeria:** reorganização animada com layout animation (Framer Motion)
- **Carrossel:** transição suave entre slides (0.4s ease)
- **Lightbox:** fade in + scale up ao abrir, fade out ao fechar
- **Count-up:** números de fotos, trabalhos, seguidores (animado ao entrar na viewport)
- **Floating elements:** partículas pastéis sutis flutuando no hero (opcional, leve)
- **Menu mobile:** slide in da direita com overlay
- **WhatsApp button:** pulse sutil a cada 3s para chamar atenção

### Acessibilidade
- Alt text em todas as fotos
- Navegação por teclado no lightbox (← → Esc)
- Focus visible em todos os elementos interativos
- Contraste adequado (mesmo com cores pastéis)
- Reduced motion: respeitar `prefers-reduced-motion`

---

## 📊 Estrutura de Dados (content)

```typescript
const profile = {
  name: "Nene",
  category: "Modelo", // editorial, comercial, passarela
  tagline: "...", // frase curta abaixo do nome
  bio: "...",
  city: "São Paulo, BR",
  available: true, // disponível para trabalho
  travelReady: true, // disponível para viagem
  measurements: {
    height: "174cm",
    bust: "86cm",
    waist: "62cm",
    hips: "90cm",
    dress: "36 (BR)",
    shoe: "39",
    eyes: "Castanho",
    hair: "Castanho",
    hairType: "Liso",
    skin: "Morena clara",
    tattoos: false,
    piercings: true,
  },
  languages: [
    { lang: "Português", level: "Nativo", flag: "🇧🇷" },
    { lang: "Inglês", level: "Intermediário", flag: "🇺🇸" },
  ],
  social: {
    instagram: "@...",
    tiktok: "@...",
    youtube: "...",
    agency: "...",
  },
  contact: {
    email: "...",
    whatsapp: "+55 ...",
  },
};

const gallery = [
  { id: 1, category: "editorial", url: "...", photographer: "...", date: "2024", caption: "..." },
  { id: 2, category: "comercial", url: "...", photographer: "...", date: "2024", caption: "..." },
  { id: 3, category: "passarela", url: "...", photographer: "...", date: "2024", caption: "..." },
  { id: 4, category: "lifestyle", url: "...", photographer: "...", date: "2024", caption: "..." },
  { id: 5, category: "beauty", url: "...", photographer: "...", date: "2024", caption: "..." },
  { id: 6, category: "swimwear", url: "...", photographer: "...", date: "2024", caption: "..." },
];

const polaroids = [
  { id: 1, angle: "frente", url: "..." },
  { id: 2, angle: "perfil", url: "..." },
  { id: 3, angle: "costas", url: "..." },
];

const videos = [
  { id: 1, category: "showreel", title: "...", url: "youtube/...", thumbnail: "..." },
  { id: 2, category: "passarela", title: "...", url: "youtube/...", thumbnail: "..." },
  { id: 3, category: "comercial", title: "...", url: "vimeo/...", thumbnail: "..." },
];

const experience = [
  { brand: "...", type: "editorial", event: "...", date: "Jan 2024", photographer: "...", location: "São Paulo", description: "..." },
  { brand: "...", type: "passarela", event: "SPFW", date: "Nov 2023", photographer: "—", location: "São Paulo", description: "..." },
  { brand: "...", type: "comercial", event: "Campanha TV", date: "Set 2023", photographer: "...", location: "Rio de Janeiro", description: "..." },
];

const bookCarousel = [
  { id: 1, url: "...", caption: "Editorial — Fotógrafo X" },
  // seleção curada das melhores 8-12 fotos
];
```

---

## 🗺️ Fases de Desenvolvimento

### Fase 1 — Fundação
- [ ] Configurar Next.js + TypeScript + Tailwind
- [ ] Definir paleta pastel + tipografia (Playfair Display + Inter + Cormorant)
- [ ] Layout base + navegação suave (scroll suave entre seções)
- [ ] Loader inicial elegante
- [ ] SEO base (metadata, OG tags, structured data Person)
- [ ] Sitemap + robots.txt

### Fase 2 — Hero
- [ ] Hero com foto full-screen + overlay gradiente pastel
- [ ] Nome com animação de digitação
- [ ] Categoria + tagline
- [ ] CTAs: "Ver Portfólio" + "Baixar Comp Card"
- [ ] Parallax sutil na foto
- [ ] Indicador de scroll animado
- [ ] Floating elements sutis (opcional)

### Fase 3 — Sobre / Ficha Técnica
- [ ] Biografia
- [ ] Ficha técnica completa (medidas, olhos, cabelo, pele, tatuagens)
- [ ] Idiomas com flags
- [ ] Cidade base + disponibilidade + travel ready
- [ ] Status de disponibilidade (badge animado)
- [ ] Scroll reveal animations

### Fase 4 — Galeria & Lightbox
- [ ] Grid masonry de fotos
- [ ] Filtros por categoria (editorial, comercial, passarela, lifestyle, beauty, swimwear)
- [ ] Animação de reorganização ao filtrar (Framer Motion layout)
- [ ] Lightbox com navegação (teclado ← → Esc + swipe mobile)
- [ ] Info em cada foto (fotógrafo, data)
- [ ] Lazy loading + next/image

### Fase 5 — Carrossel do Book
- [ ] Carrossel horizontal com seleção curada (Embla)
- [ ] Auto-play opcional (pausa no hover)
- [ ] Dots + setas de navegação
- [ ] Swipe no mobile
- [ ] Caption em cada foto

### Fase 6 — Polaroids
- [ ] Grid simples: frente, perfil, costas
- [ ] Layout limpo sem produção
- [ ] Hover suave (zoom leve)

### Fase 7 — Vídeos / Showreel
- [ ] Grid de vídeos com thumbnails
- [ ] Player integrado (react-player — YouTube/Vimeo)
- [ ] Categorias: showreel, passarela, comercial, backstage
- [ ] Thumbnail com play button animado

### Fase 8 — Experiência / Trabalhos
- [ ] Timeline visual de trabalhos
- [ ] Cards: marca, tipo, data, fotógrafo, local
- [ ] Filtros por tipo de trabalho
- [ ] Logos de marcas (se disponível)
- [ ] Count-up de total de trabalhos

### Fase 9 — Comp Card (PDF)
- [ ] Layout do comp card (foto principal + medidas + contato + fotos secundárias)
- [ ] Botão "Baixar Comp Card" no hero e na seção sobre
- [ ] Gerar PDF (react-pdf ou PDF estático)

### Fase 10 — Contato & Redes
- [ ] Formulário de booking (nome, email, empresa, tipo de trabalho, data, mensagem)
- [ ] Validação com Zod
- [ ] Integração com Resend ou Formspree
- [ ] WhatsApp button flutuante (com pulse sutil)
- [ ] Links de redes sociais (Instagram, TikTok, YouTube)
- [ ] Link para agência (se aplicável)

### Fase 11 — Animações & Polimento
- [ ] Scroll reveal em todas as seções (fade + slide up)
- [ ] Hover com zoom suave nas fotos
- [ ] Count-up nos números (fotos, trabalhos, seguidores)
- [ ] Transições suaves entre seções
- [ ] Menu mobile elegante (slide in + overlay)
- [ ] Reduced motion (prefers-reduced-motion)
- [ ] Cursor personalizado (opcional, só desktop)

### Fase 12 — Performance & Deploy
- [ ] Otimizar Lighthouse 90+ (todas as métricas)
- [ ] Lazy loading de imagens e vídeos
- [ ] Otimizar CLS (Cumulative Layout Shift)
- [ ] Deploy na Vercel
- [ ] Configurar domínio (se aplicável)
- [ ] Analytics (Vercel Analytics ou Google Analytics)

---

## 🎓 O que este projeto demonstra no portfólio
- Frontend moderno e completo (Next.js + Tailwind + Framer Motion)
- UI/UX com estética própria (cores pastéis, tipografia elegante, animações leves)
- Galeria interativa (grid masonry + filtros animados + lightbox acessível)
- Carrossel profissional (Embla com auto-play e swipe)
- Player de vídeo integrado
- Timeline de experiência visual
- Geração de PDF (comp card para download)
- SEO técnico (meta tags, OG, structured data, sitemap)
- Responsivo mobile-first com touch/swipe
- Performance web (Lighthouse 90+, next/image, lazy loading)
- Acessibilidade (alt text, keyboard nav, reduced motion, focus visible)
- Trabalho real para cliente (freela)