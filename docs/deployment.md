# Guia de Deploy — Portfólio Galaxy

Instruções para publicar o portfólio em produção.

---

## 1. Checklist Antes do Deploy

Antes de publicar, verifique:

- [ ] Substituiu todos os `[PLACEHOLDERS]` em `js/data.js`
- [ ] Adicionou foto real em `assets/foto.jpg` (mín. 400×400px)
- [ ] Gerou `assets/og-image.jpg` (1200×630px)
- [ ] Atualizou os links de redes sociais em `data.js → social[]`
- [ ] Configurou o formulário de contato (ver Seção 5)
- [ ] Atualizou `[SEU-DOMINIO]` em todas as meta tags canônicas
- [ ] Verificou o console do navegador sem erros
- [ ] Testou em mobile (tela menor que 768px)
- [ ] Rodou o Lighthouse (meta: 85+ em todas as métricas)

---

## 2. GitHub Pages (Gratuito — Recomendado para iniciantes)

### Passo a passo

1. **Crie um repositório** em github.com com nome `[seu-usuario].github.io`
2. **Suba os arquivos** para a branch `main`:
   ```bash
   git init
   git add .
   git commit -m "feat: portfólio galaxy v1.0"
   git branch -M main
   git remote add origin https://github.com/[seu-usuario]/[seu-usuario].github.io.git
   git push -u origin main
   ```
3. **Ative o GitHub Pages**:
   - Settings → Pages → Source: `Deploy from a branch`
   - Branch: `main` / folder: `/ (root)`
   - Salve e aguarde ~2 minutos

4. **URL do site**: `https://[seu-usuario].github.io`

### Domínio personalizado no GitHub Pages
1. Compre um domínio (ex: `brenooliveira.dev`)
2. Na pasta raiz do projeto, crie o arquivo `CNAME` com o conteúdo:
   ```
   brenooliveira.dev
   ```
3. No provedor do domínio, configure DNS:
   - Tipo: `A` → IPs do GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Tipo: `CNAME` → `[seu-usuario].github.io`
4. Propagação: 24–48 horas

---

## 3. Netlify (Recomendado — Mais recursos)

### Opção A: Arrastar e soltar (mais rápido)
1. Acesse [netlify.com/drop](https://netlify.com/drop)
2. Arraste a pasta `PORTIFOLIO` para a área indicada
3. Aguarde o deploy (~30 segundos)
4. URL gerada automaticamente (ex: `crazy-name-123.netlify.app`)
5. Em Site Settings → Domain management → renomeie para algo memorizável

### Opção B: Conectar ao GitHub (deploy automático)
1. Crie conta em netlify.com
2. "Add new site" → "Import an existing project"
3. Conecte sua conta GitHub e selecione o repositório
4. Configurações de build:
   - **Build command**: (vazio — site estático)
   - **Publish directory**: `.` (raiz do projeto)
5. Deploy! A cada `git push`, o site atualiza automaticamente.

### Formulário de contato com Netlify Forms
Adicione `data-netlify="true"` e `name="contact"` no `<form>` de `contact.html`:
```html
<form id="contact-form" name="contact" data-netlify="true" netlify-honeypot="bot-field">
```
E adicione no `action` do `contact.js`:
```javascript
// Substitua simulateSend por:
const response = await fetch('/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(formData).toString(),
});
```

### Arquivo `_redirects` (se necessário)
Crie `_redirects` na raiz:
```
/about    /about.html   200
/projects /projects.html 200
/services /services.html 200
/contact  /contact.html  200
```

---

## 4. Vercel

1. Instale o CLI: `npm i -g vercel`
2. Na pasta do projeto: `vercel`
3. Siga as instruções:
   - Framework: **Other**
   - Root directory: `.`
   - Build command: (vazio)
   - Output directory: `.`
4. Deploy automático a cada `git push` se conectar o repositório.

Ou via interface web:
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório GitHub
3. Framework preset: **Other**
4. Deploy!

---

## 5. Configurar Formulário de Contato Sem Backend

Escolha uma das opções abaixo e configure em `js/contact.js`:

### Opção A — Formspree (mais simples)
1. Cadastre em [formspree.io](https://formspree.io)
2. Crie um formulário e copie o endpoint
3. Em `contact.js`, substitua `simulateSend`:
```javascript
const response = await fetch('https://formspree.io/f/[SEU_ID]', {
  method: 'POST',
  headers: { 'Accept': 'application/json' },
  body: new FormData(form),
});
if (!response.ok) throw new Error('Falha no envio');
```

### Opção B — EmailJS (envio direto)
1. Cadastre em [emailjs.com](https://emailjs.com)
2. Configure um serviço de e-mail e um template
3. Adicione o SDK no HTML: `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>`
4. Em `contact.js`:
```javascript
await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', data, 'PUBLIC_KEY');
```

### Opção C — Netlify Forms
Ver Seção 3 acima.

---

## 6. Performance Pós-Deploy

### Lighthouse (meta: 85+ em todas as métricas)
1. Abra o site no Chrome
2. DevTools → Lighthouse → Generate report
3. Analise LCP, FID, CLS e Accessibility

### Compressão de imagens
- [TinyPNG](https://tinypng.com) — comprime JPG/PNG sem perda visual
- [Squoosh](https://squoosh.app) — converta para WebP (melhor compressão)

### Gerar og-image.jpg
Use [Canva](https://canva.com) com template 1200×630px ou [Bannerbear](https://bannerbear.com).
