# 🎓 TCC SENAI — Aplicação Fullstack

> **Categoria no portfólio:** Fullstack
> **Prioridade:** 🔴 Alta · **Status:** ⚪ Não iniciado (tema a definir com o grupo)
> **Observação:** Ainda em processo de definição com o grupo do SENAI

---

## 💡 Ideia Original (Breno)

Trabalho final do SENAI. Como ainda não sentei e decidi com o grupo, não tenho ideia do que vai ser — ainda está em processo.

---

## 🎯 Escopo

Aplicação fullstack completa e documentada como Trabalho de Conclusão de Curso do SENAI. Deve atender aos requisitos acadêmicos: documentação técnica, diagramas, testes e apresentação. O tema será definido em conjunto com o grupo, mas a arquitetura técnica já pode ser decidida.

### Requisitos acadêmicos (SENAI)
- Documentação técnica completa (arquitetura, ERD, fluxogramas)
- Código versionado em Git
- Apresentação final
- Funcionalidade end-to-end
- Testes (pelo menos básicos)

### Funcionalidades (a definir)
- **Tema:** a definir com o grupo
- **Escopo:** a definir após escolha do tema
- **Mínimo:** CRUD completo + auth + relatórios

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) | SSR, rotas, padrão de mercado |
| **UI** | React 18 + TypeScript | Type safety, ecossistema |
| **Estilos** | Tailwind CSS + shadcn/ui | Design system, acessível |
| **Backend** | Node.js + Express ou NestJS | Express = mais simples para TCC; NestJS = mais robusto |
| **ORM** | Prisma | Type-safe, migrations, documentação automática |
| **Banco** | PostgreSQL ou MySQL | PostgreSQL = mais robusto; MySQL = comum no SENAI |
| **Auth** | JWT (próprio) ou NexusAuth | Se o tema permitir, usar NexusAuth |
| **Validação** | Zod | Type-safe |
| **Testes** | Jest + Supertest | Unit + integration |
| **Documentação** | Swagger/OpenAPI | Documentação interativa da API |
| **Container** | Docker + Docker Compose | Padronização |
| **CI/CD** | GitHub Actions | Automatização |
| **Deploy** | Vercel (frontend) + Railway/Render (backend) | Hospedagem |

> **Nota:** A stack pode ser ajustada conforme requisitos do SENAI (ex: se exigirem Java ou PHP). Esta é a stack ideal se houver liberdade de escolha.

---

## 🏗️ Arquitetura (base)

```
┌─────────────────────────────────────────────────┐
│                  TCC Frontend                    │
│                  (Next.js)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │   Auth   │ │   CRUD   │ │   Relatórios     ││
│  │  Pages   │ │  Pages   │ │   & Dashboard    ││
│  └──────────┘ └──────────┘ └──────────────────┘│
└──────────────────┬──────────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────────┐
│                  TCC Backend                      │
│               (Express/NestJS)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │   Auth   │ │  CRUD    │ │   Reports        ││
│  │ Module   │ │  Module  │ │   Module         ││
│  └──────────┘ └──────────┘ └──────────────────┘│
│  ┌──────────────────────────────────────────────┐│
│  │           Prisma ORM + Database               ││
│  └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

---

## 📦 Entregáveis Acadêmicos

- [ ] Documentação técnica (PDF)
  - Descrição do projeto
  - Diagrama de arquitetura
  - Diagrama ER (modelo relacional)
  - Fluxogramas de funcionalidades principais
  - Casos de uso
- [ ] Código fonte versionado em Git
- [ ] README com instruções de setup
- [ ] Docker Compose para rodar local
- [ ] Documentação da API (Swagger)
- [ ] Testes (Jest)
- [ ] Apresentação (slides)
- [ ] Deploy funcionando (opcional, mas recomendado)

---

## 🗺️ Fases de Desenvolvimento

### Fase 0 — Definição (com o grupo)
- [ ] Definir tema do TCC
- [ ] Levantar requisitos funcionais
- [ ] Levantar requisitos não funcionais
- [ ] Aprovar com professor/orientador

### Fase 1 — Fundação
- [ ] Configurar projeto (Next.js + backend + banco)
- [ ] Docker Compose
- [ ] Schema do banco + migrations
- [ ] Auth (JWT)

### Fase 2 — CRUD Principal
- [ ] Modelar entidades principais
- [ ] CRUD completo (criar, listar, editar, deletar)
- [ ] Validações (Zod)
- [ ] Frontend do CRUD

### Fase 3 — Features Específicas
- [ ] Implementar funcionalidades específicas do tema
- [ ] Relatórios/Dashboard
- [ ] Filtros e busca

### Fase 4 — Documentação & Testes
- [ ] Documentação técnica (PDF)
- [ ] Swagger da API
- [ ] Testes (Jest)
- [ ] Diagramas (arquitetura, ER, fluxogramas)

### Fase 5 — Apresentação
- [ ] Slides
- [ ] Demo ao vivo
- [ ] Deploy (opcional)

---

## 🎓 O que este projeto demonstra no portfólio
- Fullstack completo (Next.js + Node.js + banco relacional)
- Documentação técnica (diagramas, ERD, casos de uso)
- Versionamento Git
- Testes automatizados
- Docker e containerização
- Capacidade de trabalhar em equipe
- Cumprimento de requisitos acadêmicos