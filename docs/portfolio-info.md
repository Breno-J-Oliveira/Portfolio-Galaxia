# portfolio-info.md — Guia de Personalização

## Como usar este arquivo

Abra o arquivo `src/app/data/index.js` e substitua cada campo indicado abaixo com suas informações reais.
Os placeholders seguem o padrão `[MAIÚSCULAS]`.

> **Dica:** Use Ctrl+F para encontrar `[` no arquivo e navegar por todos os placeholders rapidamente.

---

## 1. Dados Pessoais

| Campo           | Onde alterar             | Exemplo                                           |
|-----------------|--------------------------|---------------------------------------------------|
| Nome completo   | `data.js → owner.name`   | `"Breno J. Oliveira"`                            |
| Nome curto      | `data.js → owner.nameShort` | `"B.J.O"`                                     |
| Cargo principal | `data.js → owner.role`   | `"Backend Developer & Systems Engineer"`         |
| Tagline         | `data.js → owner.tagline` | `"Transformando lógica em experiências que escalam"` |
| Bio curta       | `data.js → owner.bio`    | Parágrafo de 2-3 linhas, direto ao ponto          |
| Bio longa       | `data.js → owner.bioLong` | 3-4 parágrafos para a página Sobre               |
| Cidade/Estado   | `data.js → owner.location` | `"São Paulo, SP"`                               |
| E-mail          | `data.js → owner.email`  | `"breno@email.com"`                              |
| WhatsApp        | `data.js → owner.whatsapp` | `"+55 11 99999-9999"`                          |
| GitHub URL      | `data.js → owner.github` | `"https://github.com/seu-usuario"`               |
| Foto            | Substituir `assets/foto.jpg` | JPG quadrado, mínimo 400×400px              |
| Currículo       | Substituir `assets/curriculo.pdf` | PDF do currículo                     |

**Também atualizar em `contact.html`:**
- Link do WhatsApp no `<a href="https://wa.me/[NUMERO]">`
- E-mail no `<a href="mailto:[SEU@EMAIL.COM]">`

---

## 2. Redes Sociais

Em `data.js → social[]`, preencha as URLs:

| Rede      | Campo          | Exemplo                                   |
|-----------|----------------|-------------------------------------------|
| GitHub    | `social[0].url` | `"https://github.com/seu-usuario"`        |
| LinkedIn  | `social[1].url` | `"https://linkedin.com/in/seu-perfil"`   |
| Instagram | `social[2].url` | `"https://instagram.com/seu-usuario"`    |
| Twitter   | `social[3].url` | `"https://twitter.com/seu-usuario"`      |

Remova redes que não usa ou adicione novas com o mesmo formato `{ name, url, icon, color }`.

---

## 3. Estatísticas

Em `data.js → stats[]`:

| Estatística           | Campo             | Alterar para       |
|-----------------------|-------------------|--------------------|
| Projetos entregues    | `stats[0].value`  | Número real        |
| Anos de experiência   | `stats[1].value`  | Número real        |
| Clientes satisfeitos  | `stats[2].value`  | Número real        |

Também edite `stats[x].label` e `stats[x].desc` para refletir sua realidade.

---

## 4. Habilidades Técnicas

Em `data.js → skills.{frontend|backend|tools}`:

- Ajuste o `level` (0–100) conforme seu nível real
- `years` = anos de experiência com a tecnologia
- `icon` = classe do Devicon — veja todos em [devicon.dev](https://devicon.dev)
- Adicione ou remova skills conforme necessário

---

## 5. Projetos (mínimo recomendado: 6)

Para cada projeto em `data.js → projects[]`:

| Campo        | Descrição                                                        |
|--------------|------------------------------------------------------------------|
| `title`      | Nome do projeto                                                  |
| `category`   | `"Backend"`, `"Embedded"`, `"Web"` ou `"DevOps"`               |
| `description`| 1–2 linhas, aparece no card                                     |
| `long`       | Parágrafo longo para o modal de detalhes                        |
| `stack`      | Array de strings com as tecnologias usadas                      |
| `image`      | URL da screenshot — substitua as URLs via.placeholder.com        |
| `url`        | Link do projeto ao vivo (ou `"#"` se não houver)                |
| `repo`       | Link do repositório GitHub                                       |
| `client`     | Nome do cliente ou `"Projeto Pessoal"`                          |
| `year`       | Ano do projeto                                                   |
| `featured`   | `true` para aparecer na home                                     |
| `galaxy`     | `{ angle, dist, color }` para aparecer como planeta na galáxia  |
| `challenges` | Desafios técnicos e como foram resolvidos                        |
| `results`    | Métricas e resultados alcançados                                 |

**Screenshots:** Salve em `assets/` ou use URLs externas. Dimensão recomendada: 800×450px (16:9).

**Remover da galáxia:** Defina `galaxy: null` no projeto.

---

## 6. Serviços

Em `data.js → services[]`:

- Adapte `title` e `description` para seus serviços reais
- Edite `includes[]` com o que está de fato incluído
- Atualize `deadline` (prazo típico) e `price` (faixa de preço real)
- Os ícones disponíveis: `"backend"`, `"embedded"`, `"automation"`, `"web"` (altere o mapa em `services.html`)

---

## 7. Depoimentos

Para cada item em `data.js → testimonials[]`:

- `name` → nome real do cliente (peça permissão)
- `role` → cargo do cliente
- `company` → empresa
- `text` → texto do depoimento (literal ou parafrasado com aprovação)
- `photo` → URL da foto (80×80px) — salve em `assets/fotos/`
- `rating` → 1 a 5 estrelas

---

## 8. Timeline de Carreira

Em `data.js → timeline[]` (da mais recente à mais antiga):

- `current: true` apenas na posição atual
- `period` → ex: `"2024 – Atual"` ou `"2022 – 2023"`
- `stack` → tecnologias usadas nessa posição

---

## 9. Educação & Certificações

Em `data.js → education[]`:

- `type` → `"graduation"`, `"course"` ou `"certification"`
- `link` → URL de verificação do certificado (ou `"#"`)
- Os ícones são mapeados automaticamente: 🎓 graduação, 📚 curso, 🏆 certificação

---

## 10. FAQ

Em `data.js → faq[]`:

- Adapte as perguntas para seus processos reais
- Inclua informações sobre seus prazos típicos, formas de pagamento e política de revisões
- Recomendado: 8–12 perguntas

---

## 11. Planos / Pacotes

Em `data.js → plans[]`:

- Atualize os preços reais em `price`
- Ajuste os itens em `includes[]` conforme o que você realmente oferece
- O plano do meio (`popular: true`) fica em destaque visual

---

## 12. SEO

Em todas as páginas HTML, atualize:

```html
<title>[Página] — Breno J. Oliveira</title>
<meta name="description" content="[150–160 caracteres descrevendo a página]">
<meta property="og:url" content="https://[SEU-DOMINIO].com/[pagina].html">
<link rel="canonical" href="https://[SEU-DOMINIO].com/[pagina].html">
```

**og-image.jpg (1200×630px):** Crie com Canva ou Figma — use seu nome, cargo e identidade visual.

---

## 13. Hospedagem (sugestões gratuitas)

| Opção            | Dificuldade | Link                       |
|------------------|-------------|----------------------------|
| **GitHub Pages** | Fácil       | pages.github.com           |
| **Netlify**      | Fácil       | netlify.com/drop           |
| **Vercel**       | Fácil       | vercel.com                 |

Ver `docs/deployment.md` para instruções detalhadas de cada opção.

---

## 14. Arquivos de Assets Necessários

| Arquivo               | Dimensão     | Formato | Descrição                   |
|-----------------------|--------------|---------|-----------------------------|
| `assets/foto.jpg`     | 400×400px+   | JPG     | Foto de perfil quadrada     |
| `assets/og-image.jpg` | 1200×630px   | JPG     | Imagem Open Graph           |
| `assets/curriculo.pdf`| —            | PDF     | Currículo para download      |

Crie a pasta `assets/fotos/` para fotos dos clientes nos depoimentos.
