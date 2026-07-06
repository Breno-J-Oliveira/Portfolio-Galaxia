# ✨ Zenith — Organização Pessoal com IA · Site + App

> **Categoria no portfólio:** Fullstack
> **Prioridade:** 🔴 Alta · **Status:** ⚪ Não iniciado
> **Integra com:** NexusAuth (auth) · Dashboard Financeiro (gastos/metas)
> **Protótipo:** Já existe versão no Figma (prints em `docs/prototipagem/`)
> **Design de referência:** Notion (blocos + páginas) + IA como orquestradora central

---

## 💡 Ideia Original (Breno)

Site e app de organização pessoal. O objetivo é **praticidade** — pegar o celular, anotar na hora e pronto. A IA organiza a maior parte de tudo. A ideia vem bastante do Notion: dá pra colocar a rotina, deixar as missões certinhas. Mas com a integração e o planejamento da IA — a IA pega e te ajuda a mexer com tudo e organizar.

A IA é **adaptativa**: dia 23 vou ter um compromisso → a IA pega e muda a rotina para esse objetivo, reorganiza o dia. A rotina nova ela muda sozinha.

Quero anotar os gastos também: "comi um pastel, deu 25" → IA anota o dia, hora, coloca na categoria e fechado.

Quero fazer **site e app**. O objetivo é praticidade — eu pego meu celular, anoto na hora e já vai.

---

## 🎯 Escopo

Aplicação fullstack de produtividade pessoal inspirada no Notion, com a IA como **orquestradora central** — não é um recurso extra, é o núcleo. O usuário interage por **linguagem natural** (texto ou voz no celular) e a IA entende, categoriza, agenda e reorganiza tudo automaticamente. A interface é tipo Notion (blocos, páginas, drag-and-drop) mas com a IA fazendo o trabalho pesado.

### Princípios de design
1. **Praticidade acima de tudo** — mínimo esforço do usuário, máximo trabalho da IA
2. **Input por linguagem natural** — falar/escrever como pensa, IA estrutura
3. **Adaptativo** — IA reorganiza rotina quando imprevistos surgem
4. **Mobile-first** — celular é a porta de entrada principal
5. **Notion-like** — blocos, páginas, visual flexível e organizável

### Funcionalidades principais

#### 🤖 IA como núcleo (não feature extra)
- **Quick Input (texto/voz):** usuário escreve/fala qualquer coisa → IA entende, categoriza e age
  - Ex: "comi um pastel deu 25" → cria transação no Dashboard Financeiro (categoria: alimentação, valor: R$ 25, data/hora: agora)
  - Ex: "tenho que entregar o TCC até dia 20" → cria meta + marcos + tarefas + rotina de estudo
  - Ex: "reunião dia 23 às 14h" → cria compromisso + IA reorganiza a rotina do dia 23
- **Reorganização adaptativa:** quando um compromisso novo surge, a IA move tarefas de rotina para outros horários/dias automaticamente
- **Sugestões proativas:** IA sugere reorganizações quando detecta conflitos de horário ou sobrecarga
- **Resumo diário:** IA gera um briefing do dia de manhã (tarefas, metas, gastos, lembretes)

#### 📋 Metas & Marcos (estilo Notion)
- **Metas:** definir metas com data limite, categoria e prioridade
- **Marcos (milestones):** dividir metas em etapas intermediárias com datas
- **Visual em blocos:** como Notion — arrastar, reordenar, aninhar
- **Progresso visual:** barra de progresso por meta e por marco

#### 📅 Planejamento & Calendário
- **Visão diária:** o que fazer hoje (tarefas + rotinas + compromissos)
- **Visão semanal/mensal:** calendário com tudo organizado
- **Drag-and-drop:** mover tarefas entre dias/horários
- **Compromissos:** eventos pontuais que disparam reorganização da IA

#### 🔁 Rotinas
- **Rotinas recorrentes:** diária, semanal, mensal
- **Rotina adaptativa:** IA ajusta a rotina quando imprevistos surgem
  - Ex: rotina normal é estudar 19h-21h, mas dia 23 tem reunião 14h-16h → IA move estudo para 21h-23h ou outro dia
- **Lembretes:** notificações push no celular + email opcional

#### 💰 Gastos rápidos (integração Dashboard Financeiro)
- **Input natural:** "gastei 25 no pastel" → IA cria transação no Dashboard Financeiro
- **Categorização automática:** IA categoriza o gasto (alimentação, transporte, lazer, etc.)
- **Sincronização:** gastos registrados no Zenith aparecem no Dashboard Financeiro
- **Metas financeiras:** "quero economizar 5000 até dezembro" → IA cria meta + acompanha progresso

#### 📸 Fotos & Anexos
- **Anexar imagens** em metas, tarefas e blocos (como Notion)
- **Galeria visual** por meta ou página

#### 🎨 Temas
- **Dark/light + paletas** personalizáveis (cyan, violet, green, amber)
- **Salvo no perfil** do usuário

#### 🔐 Auth
- **NexusAuth:** login centralizado (JWT)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Web (site)** | Next.js 14+ (App Router) | SSR, rotas, SEO, padrão de mercado |
| **Mobile (app)** | React Native + Expo | Compartilha lógica com web, deploy fácil, OTA updates |
| **UI Web** | React 18 + TypeScript + shadcn/ui | Type safety, design system acessível |
| **UI Mobile** | React Native + NativeWind (Tailwind) | Mesma estilização do web, consistência |
| **Animações** | Framer Motion (web) + Reanimated 3 (mobile) | Animações fluidas em ambas plataformas |
| **Editor de blocos** | BlockNote ou Tiptap | Editor tipo Notion (blocos, drag-and-drop) |
| **Calendário** | @fullcalendar (web) + react-native-calendars (mobile) | Visualização de tarefas e compromissos |
| **Gráficos** | Recharts (web) + react-native-chart-kit (mobile) | Stats pessoais, progresso de metas |
| **Backend** | Node.js + NestJS | API robusta, modular, serve web e mobile |
| **ORM** | Prisma | Type-safe, migrations |
| **Banco** | PostgreSQL | Relacional, confiável |
| **Cache/Filas** | Redis | Cache de IA, filas de notificação, rate limiting |
| **IA** | OpenAI API (GPT-4o-mini) | Parsing de linguagem natural → JSON estruturado |
| **Auth** | NexusAuth (microsserviço próprio) | JWT centralizado |
| **Notificações** | Expo Push Notifications (mobile) + Web Push API (web) + Nodemailer (email) | Lembretes multi-canal |
| **Upload** | Cloudinary ou UploadThing | Fotos e anexos |
| **State** | TanStack Query + Zustand | Server state + UI state |
| **Compartilhado** | Monorepo (Turborepo) com packages shared | Lógica de IA, tipos, validação compartilhados entre web e mobile |
| **Testes** | Vitest + Playwright (web) + Detox (mobile) | Unit + E2E |
| **Container** | Docker + Docker Compose | Ambiente reproduzível |
| **CI/CD** | GitHub Actions + EAS (Expo Application Services) | Automatização web + mobile |
| **Deploy Web** | Vercel | Hospedagem otimizada para Next.js |
| **Deploy Mobile** | EAS (Expo) | Build e publish nas lojas (Play Store + App Store) |

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                        Zenith Monorepo                        │
│                      (Turborepo + TS)                         │
│                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│  │   apps/web      │  │  apps/mobile    │  │  packages/    │ │
│  │   (Next.js)     │  │  (Expo/RN)      │  │  shared/      │ │
│  │                  │  │                  │  │  - types      │ │
│  │  ┌───────────┐  │  │  ┌───────────┐  │  │  - api-client │ │
│  │  │ Dashboard │  │  │  │ Dashboard │  │  │  - ai-logic   │ │
│  │  │ (blocos)  │  │  │  │ (blocos)  │  │  │  - validation │ │
│  │  └───────────┘  │  │  └───────────┘  │  │  - theme      │ │
│  │  ┌───────────┐  │  │  ┌───────────┐  │  └───────────────┘ │
│  │  │ Calendário│  │  │  │ Calendário│  │                     │
│  │  └───────────┘  │  │  └───────────┘  │                     │
│  │  ┌───────────┐  │  │  ┌───────────┐  │                     │
│  │  │Quick Input│  │  │  │Quick Input│  │                     │
│  │  │(texto/voz)│  │  │  │(texto/voz)│  │                     │
│  │  └───────────┘  │  │  └───────────┘  │                     │
│  └────────┬────────┘  └────────┬────────┘                     │
│           │                    │                               │
│           └──────────┬─────────┘                               │
│                      │ REST API (compartilhada)                │
└──────────────────────┼─────────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────────┐
│                    Zenith Backend                              │
│                  (NestJS · porta 3002)                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              AI Orchestrator (núcleo)                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │ │
│  │  │ Natural  │ │ Scheduler│ │ Finance  │ │  Proactive   │ │ │
│  │  │ Language │ │ Adapter  │ │ Logger   │ │  Suggestions │ │ │
│  │  │ Parser   │ │          │ │          │ │              │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │ │
│  │  Goals   │ │  Tasks   │ │ Routines │ │  Calendar    │    │ │
│  │  Module  │ │  Module  │ │  Module  │ │  Module      │    │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘    │ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────────────┐  │ │
│  │  Blocks  │ │  Photos  │ │ Finance Integration          │  │ │
│  │  Module  │ │  Module  │ │ (→ Dashboard Financeiro API) │  │ │
│  │ (Notion) │ │          │ │                              │  │ │
│  └──────────┘ └──────────┘ └──────────────────────────────┘  │ │
│  ┌──────────────────────────────────────────────────────────┐ │ │
│  │              Prisma ORM + PostgreSQL                      │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
          │                                    │
    ┌─────▼──────┐                    ┌────────▼────────┐
    │ NexusAuth  │                    │ Dashboard       │
    │ (porta 3000)│                   │ Financeiro API  │
    └────────────┘                    └─────────────────┘
```

### Por que monorepo (Turborepo)?

O Zenith é **site + app**. O monorepo permite:
- **Compartilhar lógica de IA** entre web e mobile (mesmo prompt, mesmo parsing)
- **Compartilhar tipos** TypeScript (uma fonte de verdade)
- **Compartilhar validação** (Zod schemas)
- **Compartilhar tema** (paletas, tokens)
- **Um único backend** servindo ambas as plataformas

---

## 📊 Modelo de Dados (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  avatar    String?
  theme     String   @default("dark-cyan")
  pages     Page[]
  goals     Goal[]
  tasks     Task[]
  routines  Routine[]
  expenses  Expense[]   // gastos rápidos via IA
}

// --- Sistema de blocos (estilo Notion) ---

model Page {
  id        String   @id @default(uuid())
  userId    String
  title     String
  icon      String?  // emoji ou ícone
  parentId  String?  // páginas aninhadas
  blocks    Block[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Block {
  id        String   @id @default(uuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id])
  type      BlockType
  content   Json     // conteúdo flexível por tipo
  order     Int      // posição na página
  taskId    String?  // se o bloco é uma tarefa
  goalId    String?  // se o bloco é uma meta
}

enum BlockType {
  HEADING
  TEXT
  TODO
  TASK
  GOAL
  CALLOUT
  DIVIDER
  IMAGE
  QUOTE
  CODE
}

// --- Metas & Marcos ---

model Goal {
  id          String   @id @default(uuid())
  userId      String
  title       String
  description String?
  category    String   // pessoal, trabalho, financeiro, saude
  priority    Int      @default(3) // 1-5
  deadline    DateTime
  status      Status   @default(ACTIVE)
  milestones  Milestone[]
  tasks       Task[]
  photos      Photo[]
  createdAt   DateTime @default(now())
}

model Milestone {
  id        String   @id @default(uuid())
  goalId    String
  title     String
  deadline  DateTime
  done      Boolean  @default(false)
}

// --- Tarefas ---

model Task {
  id        String   @id @default(uuid())
  userId    String
  goalId    String?
  title     String
  desc      String?
  date      DateTime
  duration  Int?     // minutos
  done      Boolean  @default(false)
  routineId String?
  source    TaskSource @default(MANUAL) // IA, MANUAL, ROUTINE
}

enum TaskSource { IA MANUAL ROUTINE }

// --- Rotinas ---

model Routine {
  id        String   @id @default(uuid())
  userId    String
  title     String
  frequency String   // daily, weekly, monthly
  time      String   // "08:00"
  duration  Int?     // minutos
  active    Boolean  @default(true)
  tasks     Task[]
  adaptable Boolean  @default(true) // IA pode mover esta rotina
}

// --- Gastos rápidos (via IA → Dashboard Financeiro) ---

model Expense {
  id        String   @id @default(uuid())
  userId    String
  amount    Decimal  @db.Decimal(10,2)
  description String
  category  String   // alimentação, transporte, lazer, etc.
  date      DateTime @default(now())
  syncDashId String? // ID da transação no Dashboard Financeiro
}

// --- Fotos ---

model Photo {
  id     String @id @default(uuid())
  goalId String?
  pageId String?
  url    String
  caption String?
}

// --- Log de ações da IA ---

model AILog {
  id        String   @id @default(uuid())
  userId    String
  input     String   // texto original do usuário
  action    String   // o que a IA fez (CREATE_GOAL, REORGANIZE_ROUTINE, LOG_EXPENSE, etc.)
  result    Json     // resultado estruturado
  createdAt DateTime @default(now())
}

enum Status { ACTIVE COMPLETED PAUSED CANCELLED }
```

---

## 🤖 IA Orchestrator — Como funciona (em detalhe)

A IA não é um chatbot. É o **núcleo do app**. Tudo passa por ela.

### 1. Quick Input (input natural)

O usuário escreve/fala qualquer coisa. A IA identifica a intenção e age:

| Input do usuário | IA entende | Ação |
|-----------------|-----------|------|
| "comi um pastel deu 25" | Gasto de R$ 25, alimentação | Cria `Expense` → sincroniza com Dashboard Financeiro |
| "tenho que entregar o TCC até dia 20" | Meta com deadline 20/12 | Cria `Goal` + `Milestone[]` + `Task[]` + `Routine` de estudo |
| "reunião dia 23 às 14h" | Compromisso pontual | Cria `Task` + **reorganiza rotina do dia 23** |
| "quero economizar 5000 até dezembro" | Meta financeira | Cria `Goal` (financeiro) + acompanha no Dashboard |
| "estudar React das 19h às 21h todo dia" | Rotina diária | Cria `Routine` + gera `Task` para cada dia |
| "lembra de pagar a conta amanhã" | Lembrete | Cria `Task` para amanhã + notificação push |

### 2. Reorganização adaptativa (Scheduler Adapter)

Quando um compromisso novo surge, a IA **reorganiza a rotina automaticamente**:

```
Cenário: usuário marca reunião dia 23 às 14h-16h

Rotina normal do dia 23:
  08h-09h: Academia
  09h-12h: Trabalho
  12h-13h: Almoço
  14h-16h: Estudo React  ← CONFLITO
  16h-18h: Trabalho
  19h-21h: Estudo TCC

IA reorganiza:
  08h-09h: Academia
  09h-12h: Trabalho
  12h-13h: Almoço
  14h-16h: REUNIÃO (compromisso)
  16h-18h: Trabalho
  19h-21h: Estudo TCC
  21h-23h: Estudo React (MOVIDO pela IA)

→ Notifica usuário: "Reorganizei sua rotina do dia 23. Estudo React movido para 21h-23h. Ok?"
→ Usuário pode aceitar ou ajustar
```

### 3. Resumo diário (proativo)

Toda manhã a IA gera um briefing:
- Tarefas do dia (rotinas + compromissos + tarefas de metas)
- Progresso das metas
- Gastos de ontem (do Dashboard Financeiro)
- Lembretes pendentes
- Sugestões ("você está sobrecarregado na terça, quer mover X para quarta?")

### 4. Prompt template (exemplo)

```
Você é o orquestrador do Zenith, um app de produtividade.
Receba o texto do usuário e identifique a intenção:

INTENTS possíveis:
- CREATE_GOAL: criar meta com marcos e tarefas
- CREATE_TASK: criar tarefa simples
- CREATE_ROUTINE: criar rotina recorrente
- LOG_EXPENSE: registrar gasto (amount, category, description)
- CREATE_APPOINTMENT: criar compromisso + reorganizar rotina do dia
- SET_REMINDER: criar lembrete
- DAILY_BRIEFING: gerar resumo do dia

Retorne JSON com:
{
  "intent": "...",
  "data": { ... },
  "sideEffects": [ "REORGANIZE_ROUTINE", "SYNC_DASHBOARD", "SEND_NOTIFICATION" ]
}

Contexto do usuário (metas ativas, rotinas, tarefas de hoje):
{context}
```

---

## 📱 Mobile App (React Native + Expo)

O app mobile é a **porta de entrada principal** — o objetivo é praticidade.

### Fluxo principal no mobile
1. **Abrir app** → tela inicial com Quick Input em destaque
2. **Falar/digitar** → "comi um pastel deu 25" → IA processa → toast "Gasto registrado: R$ 25 · Alimentação"
3. **Ver dia** → lista de tarefas/rotinas do dia (swipe para marcar done)
4. **Ver metas** → cards de metas com progresso
5. **Calendário** → visão mensal/semanal

### Features mobile específicas
- **Quick Input widget** na home screen (digitar sem abrir o app)
- **Voice input** (speech-to-text nativo)
- **Push notifications** (Expo Push) para lembretes
- **Offline-first** com sync quando volta online
- **Swipe gestures** para marcar tarefa done, arquivar, deletar
- **Haptic feedback** ao completar tarefas

---

## 🔗 Integrações

- **NexusAuth:** login/registro/refresh/logout — Zenith consome a API de auth
- **Dashboard Financeiro:**
  - Gastos registrados no Zenith via Quick Input → criam transações no Dashboard Financeiro
  - Metas financeiras criadas no Zenith → aparecem no Dashboard
  - Sincronização via API REST + webhook para tempo real
- **OpenAI API:** IA para parsing de linguagem natural → JSON estruturado

---

## 🎨 UI/UX

### Referência visual
- **Notion:** sistema de blocos, páginas aninhadas, drag-and-drop, visual limpo
- **Protótipo Figma:** já existe em `docs/prototipagem/` — usar como base
- **Tipografia:** estudo em `docs/tipografia(base pode mudar).png` — base que pode mudar

### Design system
- **shadcn/ui + Tailwind** (web) / **NativeWind** (mobile) — consistência entre plataformas
- **Framer Motion** (web) / **Reanimated 3** (mobile) — animações fluidas
- **Temas:** dark/light + paletas (cyan, violet, green, amber) — salvo no perfil
- **Editor de blocos:** BlockNote ou Tiptap (tipo Notion)

### Telas principais
- **Dashboard/Home:** Quick Input em destaque + tarefas do dia + próximas metas
- **Páginas (Notion-like):** blocos organizáveis, arrastar, aninhar
- **Calendário:** mensal/semanal/diário com drag-and-drop
- **Metas:** cards com progresso, marcos, tarefas vinculadas
- **Rotinas:** lista de rotinas com toggle de ativação
- **Gastos:** lista rápida + resumo (sincronizado com Dashboard)
- **Configurações:** tema, notificações, integrações

### Mobile
- **Bottom tab bar:** Hoje | Calendário | Metas | Gastos | Config
- **Quick Input:** botão flutuante (FAB) sempre visível → abre input de texto/voz
- **Swipe:** direita = done, esquerda = arquivar/deletar
- **Pull to refresh:** sincroniza com backend

---

## 🗺️ Fases de Desenvolvimento

### Fase 1 — Fundação & Monorepo
- [ ] Configurar Turborepo (apps/web + apps/mobile + packages/shared)
- [ ] Configurar Next.js + TypeScript + Tailwind + shadcn/ui (web)
- [ ] Configurar Expo + React Native + NativeWind (mobile)
- [ ] Configurar NestJS backend + Prisma + PostgreSQL
- [ ] Docker Compose (backend + postgres + redis)
- [ ] Integrar NexusAuth (login/registro)
- [ ] Layout base + navegação + tema dark (web e mobile)
- [ ] Packages shared: tipos, validação (Zod), api-client

### Fase 2 — Quick Input + IA (núcleo)
- [ ] Integrar OpenAI API no backend
- [ ] Endpoint `/ai/parse` — recebe texto livre → retorna JSON estruturado
- [ ] Quick Input UI (web + mobile) — campo de texto + voice input
- [ ] Identificar intents: CREATE_GOAL, CREATE_TASK, LOG_EXPENSE, etc.
- [ ] Persistir resultados (criar metas, tarefas, gastos conforme intent)
- [ ] Toast de confirmação após ação da IA
- [ ] Log de ações da IA (AILog)

### Fase 3 — Metas, Marcos & Tarefas
- [ ] CRUD de metas (criar, editar, arquivar, deletar)
- [ ] CRUD de marcos dentro de metas
- [ ] CRUD de tarefas
- [ ] Visualização de metas em cards + progresso
- [ ] Tarefas vinculadas a metas
- [ ] Filtro por categoria e status

### Fase 4 — Rotinas & Reorganização Adaptativa
- [ ] CRUD de rotinas (diária/semanal/mensal)
- [ ] Geração automática de tarefas a partir de rotinas
- [ ] **Scheduler Adapter:** quando compromisso surge, IA reorganiza rotina
- [ ] Notificação ao usuário: "Reorganizei sua rotina do dia X. Ok?"
- [ ] Usuário pode aceitar ou ajustar reorganização

### Fase 5 — Calendário & Planejamento
- [ ] Calendário visual (mensal/semanal/diário) — web e mobile
- [ ] Drag-and-drop de tarefas (web) / swipe (mobile)
- [ ] Visão "Hoje" com tudo organizado
- [ ] Resumo diário gerado pela IA (briefing da manhã)

### Fase 6 — Sistema de Blocos (Notion-like)
- [ ] Integrar BlockNote ou Tiptap
- [ ] Páginas com blocos (heading, text, todo, task, goal, image, divider)
- [ ] Drag-and-drop de blocos
- [ ] Páginas aninhadas (parentId)
- [ ] Anexar fotos em blocos

### Fase 7 — Gastos & Integração Dashboard Financeiro
- [ ] Quick Input de gastos ("comi um pastel deu 25" → Expense)
- [ ] Categorização automática pela IA
- [ ] Sincronização com Dashboard Financeiro API
- [ ] Widget de gastos no Zenith
- [ ] Metas financeiras sincronizadas

### Fase 8 — Notificações & Lembretes
- [ ] Push notifications (Expo Push — mobile)
- [ ] Web Push API (web)
- [ ] Email (Nodemailer) — opcional
- [ ] Lembretes de tarefas, marcos e metas

### Fase 9 — Fotos & Temas
- [ ] Upload de fotos (Cloudinary)
- [ ] Galeria de fotos por meta/página
- [ ] Sistema de temas (dark/light + paletas)
- [ ] Persistência de tema no perfil

### Fase 10 — Polimento & Deploy
- [ ] Animações Framer Motion (web) + Reanimated 3 (mobile)
- [ ] Offline-first no mobile (sync quando online)
- [ ] Quick Input widget na home screen (mobile)
- [ ] Haptic feedback (mobile)
- [ ] Testes E2E (Playwright web + Detox mobile)
- [ ] Deploy web (Vercel)
- [ ] Build mobile (EAS → Play Store + App Store)
- [ ] CI/CD (GitHub Actions + EAS)

---

## 🎓 O que este projeto demonstra no portfólio
- **Fullstack completo** (Next.js + NestJS + Postgres + React Native)
- **Monorepo** (Turborepo — web + mobile + shared packages)
- **IA como núcleo** (LLM parsing de linguagem natural → ações estruturadas)
- **IA adaptativa** (reorganização automática de rotina)
- **App mobile real** (React Native + Expo → Play Store / App Store)
- **Editor de blocos** (tipo Notion — BlockNote/Tiptap)
- **Arquitetura modular** (microsserviços com NexusAuth)
- **Integração entre sistemas** (Dashboard Financeiro)
- **Offline-first** (mobile)
- **Push notifications** (Expo Push + Web Push)
- **Type safety end-to-end** (TS + Prisma + Zod)
- **Docker e containerização**