# 📈 Dashboard Financeiro — Controle Financeiro Pessoal & Empresarial

> **Categoria no portfólio:** Fullstack
> **Prioridade:** 🟡 Média · **Status:** ⚪ Não iniciado
> **Integra com:** NexusAuth (auth) · Zenith (gastos pessoais) · SaaS Multiempresa (gastos empresariais)

---

## 💡 Ideia Original (Breno)

Dashboard de controle financeiro completo em **uma página só**. Funciona em dois modos:
- **Modo Pessoal:** integrado com o Zenith — gastos registrados no Zenith aparecem aqui automaticamente
- **Modo Empresarial:** integrado com o SaaS Multiempresa — gastos da empresa aparecem aqui automaticamente

A ideia é centralizar tudo: eu anoto "gastei 25 reais com pastel" no Zenith → a transação passa por tudo e chega no Dashboard. Ou eu registro uma compra no SaaS da minha empresa → o gasto aparece no Dashboard com todas as funcionalidades de análise.

---

## 🎯 Escopo

Aplicação fullstack de gestão financeira com dashboard interativo em **tela única**. Centraliza finanças pessoais (via Zenith) e empresariais (via SaaS Multiempresa) em um só lugar. O dashboard recebe transações de múltiplas fontes via webhooks e API, consolida tudo, e apresenta KPIs, gráficos, tabelas e relatórios em tempo real.

### Como funciona o fluxo de dados

```
┌─────────────────┐     webhook/API      ┌──────────────────┐
│     Zenith      │ ──────────────────→  │     Dashboard     │
│ "gastei 25 com  │   transação criada   │   Financeiro     │
│  pastel"        │   automaticamente    │                  │
│ (modo pessoal)  │                      │  • KPIs          │
└─────────────────┘                      │  • Gráficos      │
                                          │  • Tabela        │
┌─────────────────┐     webhook/API      │  • Relatórios    │
│     SaaS        │ ──────────────────→  │  • Metas         │
│  Multiempresa   │   transação criada   │  • Orçamentos    │
│ (modo empresa)  │   automaticamente    │  • Alertas       │
└─────────────────┘                      └──────────────────┘
```

### Dois modos de uso

#### 👤 Modo Pessoal (integrado com Zenith)
- Gastos registrados no Zenith ("gastei X com Y") → aparecem no Dashboard automaticamente
- Metas financeiras criadas no Zenith → progresso aparece no Dashboard
- Rotinas do Zenith que envolvem dinheiro → registradas como transação
- Dashboard pode criar transações diretamente (não só via Zenith)
- Visão: apenas finanças pessoais do usuário

#### 🏢 Modo Empresarial (integrado com SaaS Multiempresa)
- Compras, vendas e despesas registradas no SaaS → aparecem no Dashboard automaticamente
- Folha de pagamento, impostos, custos operacionais → centralizados
- Múltiplos departamentos/centros de custo
- Múltiplos usuários com roles (admin, contador, visualizador)
- Visão: finanças da empresa isoladas por tenant

#### 🔄 Alternar entre modos
- Toggle no topo do dashboard (Pessoal / Empresarial)
- Cada modo tem seus próprios KPIs, gráficos e dados
- Usuário pode ter ambos (pessoal + empresa) — dados nunca se misturam

### Funcionalidades principais

#### 📊 Dashboard (tela única — tudo em uma página)
- **KPI Cards (topo):** Saldo atual, Receitas do mês, Despesas do mês, Economia líquida
- **Gráfico de linha:** evolução temporal do patrimônio/saldo
- **Gráfico de barras:** receitas vs despesas por mês
- **Gráfico de pizza/donut:** distribuição de despesas por categoria
- **Gráfico de área:** projeção de patrimônio
- **Tabela de transações:** TanStack Table com ordenação, busca, filtros, paginação
- **Filtros globais:** período (diário/semanal/mensal/anual/personalizado), categoria, tipo, fonte (Zenith/SaaS/Manual)
- **Tudo na mesma página** — scroll vertical, sem navegação entre páginas

#### 💰 Transações
- **Registrar receitas e despesas** com categoria, data, descrição, valor e conta
- **Transferências** entre contas
- **Investimentos** (aportes, resgates, rendimentos)
- **Transações recorrentes:** aluguel, salário, assinaturas (gera automaticamente todo mês)
- **Anexos:** comprovante, nota fiscal (upload)
- **Tags:** além de categoria, tags livres para cruzamento (ex: "viagem", "reembolsável")
- **Fonte da transação:** Zenith, SaaS Multiempresa, ou manual (para rastrear origem)
- **Status:** confirmada, pendente, conciliada

#### 🏦 Contas
- **Múltiplas contas:** conta corrente, poupança, cartão de crédito, dinheiro, carteira digital
- **Saldo por conta:** ver saldo individual de cada conta
- **Transferência entre contas:** mover dinheiro entre contas
- **Cartão de crédito:** controle de fatura (limite, fatura atual, vencimento)
- **Conciliação bancária:** marcar transações como conciliadas com extrato

#### 📂 Categorias
- **Categorias personalizáveis:** criar, editar, agrupar
- **Categorias padrão:** Moradia, Alimentação, Transporte, Lazer, Saúde, Educação, Investimentos, etc.
- **Subcategorias:** Moradia → Aluguel, Condomínio, Contas
- **Cor e ícone:** cada categoria tem cor (para gráficos) e ícone
- **Categorias por modo:** pessoais e empresariais separadas

#### 🎯 Metas Financeiras
- **Metas de economia:** "Economizar R$ 5.000 até dezembro"
- **Metas de compra:** "Comprar notebook de R$ 3.000"
- **Metas de receita:** "Ganhar R$ 10.000 neste trimestre"
- **Progresso visual:** barra circular + valor atual / alvo
- **Sincronização com Zenith:** metas criadas no Zenith aparecem aqui e vice-versa
- **Marcos:** quebrar meta em marcos (ex: R$ 1.000, R$ 2.500, R$ 5.000)
- **Contribuição automática:** % das receitas vai para meta automaticamente

#### 📋 Orçamentos
- **Orçamento por categoria:** definir limite mensal (ex: R$ 500 em Lazer)
- **Alertas:** notificação quando atinge 80% e 100% do orçamento
- **Barra de progresso:** quanto já gastou vs limite
- **Orçamento mensal/anual:** visão geral do orçamento
- **Rollover:** saldo não usado passa para o próximo mês (opcional)

#### 📈 Relatórios & Exportação
- **Relatório mensal:** resumo do mês (receitas, despesas, economia, top categorias)
- **Relatório anual:** visão do ano inteiro com comparativos
- **Relatório por categoria:** detalhamento de uma categoria
- **Exportação CSV** (papaparse)
- **Exportação PDF** (react-pdf) — relatório formatado
- **Comparação de períodos:** este mês vs mês anterior, este ano vs ano anterior

#### 🔔 Alertas & Notificações
- **Saldo baixo:** alerta quando saldo fica abaixo de X
- **Gasto acima do orçamento:** alerta quando categoria excede limite
- **Vencimento de conta:** lembrete de contas a pagar
- **Fatura do cartão:** aviso de fatura fechando
- **Meta atingida:** celebração quando meta é completada
- **Transação grande:** alerta para transações acima de X valor

#### 🔗 Integrações (fluxo de dados)

**Zenith → Dashboard (modo pessoal):**
- Usuário anota "gastei 25 com pastel" no Zenith
- Zenith envia webhook `transaction.created` para o Dashboard
- Dashboard cria transação automaticamente (categoria: Alimentação, valor: R$ 25, fonte: Zenith)
- Aparece na tabela, nos KPIs e nos gráficos em tempo real
- Metas financeiras criadas no Zenith → sincronizadas com Dashboard

**SaaS Multiempresa → Dashboard (modo empresarial):**
- Usuário registra compra de mercadoria no SaaS
- SaaS envia webhook `transaction.created` para o Dashboard
- Dashboard cria transação (categoria: Compras, valor, fonte: SaaS, tenant: empresa X)
- Aparece no dashboard empresarial com todos os dados
- Folha de pagamento, impostos, custos operacionais → todos centralizados

**Dashboard → Zenith (bidirecional):**
- Dashboard pode criar transações que aparecem no Zenith
- Metas atualizadas no Dashboard refletem no Zenith
- Sincronização em tempo real via webhooks

**NexusAuth:**
- Login centralizado (SSO)
- 2FA obrigatório (dados financeiros)
- Multi-tenant (modo empresarial usa tenant_id)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) | SSR, rotas, padrão de mercado |
| **UI** | React 18 + TypeScript | Type safety, ecossistema |
| **Estilos** | Tailwind CSS + shadcn/ui | Design system, acessível |
| **Gráficos** | Recharts | Gráficos React declarativos, responsivos |
| **Tabela** | TanStack Table v8 | Ordenação, filtros, paginação virtualizada |
| **Formulários** | React Hook Form + Zod | Validação type-safe |
| **State** | TanStack Query + Zustand | Server state + UI state (modo toggle, filtros) |
| **Backend** | Node.js + NestJS | API modular, webhooks, cron jobs |
| **ORM** | Prisma | Type-safe, migrations |
| **Banco** | PostgreSQL | Relacional, agregações, window functions |
| **Cache** | Redis | Cache de KPIs, rate limiting, filas de webhook |
| **Auth** | NexusAuth | SSO centralizado, 2FA, multi-tenant |
| **Webhooks** | NestJS + Redis queues | Receber webhooks do Zenith e SaaS |
| **Exportação** | papaparse (CSV) + react-pdf (PDF) | Geração de relatórios |
| **Notificações** | Web Push API + Nodemailer | Alertas no navegador + email |
| **Cron Jobs** | @nestjs/schedule | Transações recorrentes, alertas diários |
| **Testes** | Vitest + Playwright | Unit + E2E |
| **Container** | Docker + Docker Compose | Ambiente reproduzível |
| **CI/CD** | GitHub Actions | Automatização |
| **Deploy** | Vercel (frontend) + Railway (backend) | Hospedagem moderna |

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                Dashboard Financeiro (Next.js)                      │
│                     (porta 3003 · tela única)                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Header: [👤 Pessoal | 🏢 Empresarial] toggle · Filtros       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ KPI Card │ │ KPI Card │ │ KPI Card │ │ KPI Card │            │
│  │  Saldo   │ │ Receitas │ │ Despesas │ │ Economia │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│                                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Gráfico      │ │ Gráfico      │ │ Gráfico      │             │
│  │ Linha        │ │ Barras       │ │ Pizza/Donut  │             │
│  │ (evolução)   │ │ (Rec vs Desp)│ │ (categorias) │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                    │
│  ┌──────────────┐ ┌──────────────────────────────────────────┐  │
│  │ Gráfico      │ │  Tabela de Transações (TanStack Table)    │  │
│  │ Área         │ │  [Busca] [Filtros] [Ordenação] [Páginas]  │  │
│  │ (patrimônio) │ │  fonte: Zenith / SaaS / Manual            │  │
│  └──────────────┘ └──────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │ Metas        │ │ Orçamentos   │ │ Contas                    │ │
│  │ (progresso)  │ │ (limites)    │ │ (saldos por conta)        │ │
│  └──────────────┘ └──────────────┘ └──────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Modal: Nova Transação · Nova Meta · Nova Categoria · etc.   ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────┬───────────────────────────────────────┘
                           │ REST API + Webhooks
┌──────────────────────────▼───────────────────────────────────────┐
│                Dashboard Financeiro Backend (NestJS)               │
│                      (porta 3004)                                  │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │Transac.  │ │Categories│ │  KPIs    │ │  Goals   │ │Budgets  │ │
│  │ Module   │ │  Module  │ │  Module  │ │  Module  │ │ Module  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ Accounts │ │ Reports  │ │ Alerts   │ │ Webhook Receiver     │ │
│  │ Module   │ │  Module  │ │  Module  │ │ (Zenith + SaaS)      │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘ │
│  ┌──────────┐ ┌──────────┐                                    │
│  │Recurring│ │  Sync    │                                    │
│  │ Module  │ │  Engine  │                                    │
│  └──────────┘ └──────────┘                                    │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              Prisma ORM + PostgreSQL + Redis                  ││
│  └──────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
          ▲                    ▲                    ▲
          │                    │                    │
    ┌─────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐
    │ NexusAuth  │      │   Zenith    │      │    SaaS     │
    │ (porta     │      │  (porta     │      │ Multiempresa│
    │  3000)     │      │   3002)     │      │ (porta 3005)│
    │ SSO + 2FA  │      │ webhooks →  │      │ webhooks →  │
    └────────────┘      └─────────────┘      └─────────────┘
```

### Estrutura de pastas (Frontend)
```
src/
  app/
    page.tsx              → Dashboard (tela única, tudo aqui)
    layout.tsx            → Metadata, auth guard, NexusAuth
  components/
    dashboard/
      Header.tsx          → Toggle Pessoal/Empresarial + filtros globais
      KPICards.tsx        → 4 cards de KPI (Saldo, Receitas, Despesas, Economia)
      ChartLine.tsx       → Evolução temporal (Recharts)
      ChartBar.tsx        → Receitas vs Despesas (Recharts)
      ChartPie.tsx        → Distribuição por categoria (Recharts)
      ChartArea.tsx       → Projeção de patrimônio (Recharts)
      TransactionsTable.tsx → TanStack Table com filtros
      GoalsPanel.tsx      → Metas com progresso visual
      BudgetsPanel.tsx    → Orçamentos com limites
      AccountsPanel.tsx   → Saldos por conta
      AlertsPanel.tsx     → Alertas e notificações
    modals/
      NewTransactionModal.tsx
      NewGoalModal.tsx
      NewCategoryModal.tsx
      NewAccountModal.tsx
      NewBudgetModal.tsx
      FilterModal.tsx
    ui/
      ModeToggle.tsx      → Toggle Pessoal / Empresarial
      PeriodFilter.tsx    → Seletor de período
      CategoryFilter.tsx  → Dropdown de categoria
      SourceBadge.tsx     → Badge de origem (Zenith / SaaS / Manual)
  lib/
    api.ts                → API client
    websocket.ts          → Real-time updates (webhooks → UI)
  hooks/
    useTransactions.ts    → TanStack Query
    useKPIs.ts            → KPIs em tempo real
    useMode.ts            → Zustand (modo pessoal/empresarial)
```

---

## 📊 Modelo de Dados (Prisma)

```prisma
model User {
  id            String         @id @default(uuid())
  nexusUserId   String         @unique // link com NexusAuth
  transactions  Transaction[]
  categories    Category[]
  goals         FinanceGoal[]
  budgets       Budget[]
  accounts      Account[]
  alerts        Alert[]
  // Modo empresarial
  tenantId      String?        // null = pessoal, preenchido = empresa
  tenant        Tenant?        @relation(fields: [tenantId], references: [id])
  role          UserRole       @default(VIEWER) // apenas no modo empresa
}

model Tenant {
  id            String   @id @default(uuid())
  name          String
  plan          Plan     @default(FREE)
  users         User[]
  transactions  Transaction[]
  categories    Category[]
  accounts      Account[]
  createdAt     DateTime @default(now())
}

model Account {
  id          String   @id @default(uuid())
  userId      String?
  tenantId    String?
  name        String   // "Conta Corrente", "Nubank", "Cartão Visa"
  type        AccountType // CHECKING, SAVINGS, CREDIT_CARD, CASH, DIGITAL_WALLET
  balance     Decimal  @db.Decimal(12,2) @default(0)
  // Cartão de crédito
  creditLimit Decimal? @db.Decimal(12,2)
  creditUsed  Decimal  @db.Decimal(12,2) @default(0)
  dueDay      Int?     // dia de vencimento da fatura
  // Metadata
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Transaction {
  id          String       @id @default(uuid())
  userId      String?
  tenantId    String?
  type        TxType       // INCOME, EXPENSE, TRANSFER, INVESTMENT
  amount      Decimal      @db.Decimal(12,2)
  description String
  categoryId  String
  category    Category     @relation(fields: [categoryId], references: [id])
  accountId   String       // conta de origem
  account     Account      @relation(fields: [accountId], references: [id])
  toAccountId String?      // conta de destino (transferências)
  date        DateTime
  // Origem da transação
  source      TxSource     // ZENITH, SAAS, MANUAL
  sourceId    String?      // ID da transação no Zenith ou SaaS
  // Extras
  tags        String[]     // tags livres
  status      TxStatus     @default(CONFIRMED)
  recurringId String?      // vinculado a transação recorrente
  attachmentUrl String?    // comprovante/nota fiscal
  // Metadata
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Category {
  id           String        @id @default(uuid())
  userId       String?
  tenantId     String?
  name         String
  icon         String?
  color        String        // hex color para gráficos
  type         TxType        // INCOME ou EXPENSE
  parentId     String?       // subcategoria
  parent       Category?     @relation("CategoryParent", fields: [parentId], references: [id])
  children     Category[]    @relation("CategoryParent")
  transactions Transaction[]
  isDefault    Boolean       @default(false) // categorias padrão do sistema
}

model FinanceGoal {
  id            String   @id @default(uuid())
  userId        String?
  tenantId      String?
  title         String   // "Economizar R$ 5000"
  type          GoalType // SAVING, PURCHASE, INCOME, DEBT_PAYOFF
  targetAmount  Decimal  @db.Decimal(12,2)
  currentAmount Decimal  @db.Decimal(12,2) @default(0)
  deadline      DateTime?
  status        GoalStatus @default(ACTIVE)
  // Integração com Zenith
  zenithId      String?  // ID da meta correspondente no Zenith
  // Marcos
  milestones    Milestone[]
  // Contribuição automática
  autoContributePercent Decimal? @db.Decimal(5,2) // % das receitas
  createdAt     DateTime @default(now())
}

model Milestone {
  id          String   @id @default(uuid())
  goalId      String
  goal        FinanceGoal @relation(fields: [goalId], references: [id])
  title       String   // "Primeiro R$ 1000"
  targetAmount Decimal @db.Decimal(12,2)
  reached     Boolean  @default(false)
  reachedAt   DateTime?
}

model Budget {
  id          String   @id @default(uuid())
  userId      String?
  tenantId    String?
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  amount      Decimal  @db.Decimal(12,2) // limite mensal
  period      BudgetPeriod @default(MONTHLY)
  rollover    Boolean  @default(false) // saldo passa para próximo mês
  spent       Decimal  @db.Decimal(12,2) @default(0) // calculado
  // Alertas
  alertThreshold80 Boolean @default(true)
  alertThreshold100 Boolean @default(true)
  createdAt   DateTime @default(now())
}

model RecurringTransaction {
  id          String   @id @default(uuid())
  userId      String?
  tenantId    String?
  type        TxType
  amount      Decimal  @db.Decimal(12,2)
  description String
  categoryId  String
  accountId   String
  frequency   Frequency // DAILY, WEEKLY, MONTHLY, YEARLY
  dayOfMonth  Int?     // dia do mês para mensais
  dayOfWeek   Int?     // dia da semana para semanais
  startDate   DateTime
  endDate     DateTime?
  active      Boolean  @default(true)
  lastGenerated DateTime?
  nextDate    DateTime
  createdAt   DateTime @default(now())
}

model Alert {
  id          String   @id @default(uuid())
  userId      String?
  tenantId    String?
  type        AlertType // LOW_BALANCE, BUDGET_EXCEEDED, BILL_DUE, CARD_CLOSING, GOAL_REACHED, LARGE_TRANSACTION
  message     String
  severity    AlertSeverity @default(INFO)
  read        Boolean  @default(false)
  metadata    Json?    // dados extras (categoryId, amount, etc.)
  createdAt   DateTime @default(now())
}

model WebhookLog {
  id          String   @id @default(uuid())
  source      String   // "zenith" ou "saas"
  event       String   // "transaction.created", "goal.updated"
  payload     Json     // payload recebido
  processed   Boolean  @default(false)
  error       String?
  receivedAt  DateTime @default(now())
  processedAt DateTime?
}

enum TxType       { INCOME EXPENSE TRANSFER INVESTMENT }
enum TxSource     { ZENITH SAAS MANUAL }
enum TxStatus     { CONFIRMED PENDING RECONCILED }
enum AccountType  { CHECKING SAVINGS CREDIT_CARD CASH DIGITAL_WALLET }
enum GoalType     { SAVING PURCHASE INCOME DEBT_PAYOFF }
enum GoalStatus   { ACTIVE COMPLETED PAUSED CANCELLED }
enum BudgetPeriod { MONTHLY YEARLY }
enum Frequency    { DAILY WEEKLY MONTHLY YEARLY }
enum AlertType    { LOW_BALANCE BUDGET_EXCEEDED BILL_DUE CARD_CLOSING GOAL_REACHED LARGE_TRANSACTION }
enum AlertSeverity { INFO WARNING CRITICAL }
enum UserRole     { ADMIN ACCOUNTANT VIEWER }
enum Plan         { FREE PRO ENTERPRISE }
```

---

## 🔌 Endpoints da API

### Transações
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/transactions` | Listar (filtros: período, categoria, tipo, fonte, conta) |
| POST | `/transactions` | Criar transação (manual) |
| PATCH | `/transactions/:id` | Editar |
| DELETE | `/transactions/:id` | Deletar |
| POST | `/transactions/transfer` | Transferência entre contas |
| POST | `/transactions/reconcile/:id` | Marcar como conciliada |

### Contas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/accounts` | Listar contas com saldo |
| POST | `/accounts` | Criar conta |
| PATCH | `/accounts/:id` | Editar conta |
| GET | `/accounts/:id/balance` | Saldo detalhado |

### Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/categories` | Listar (com subcategorias) |
| POST | `/categories` | Criar |
| PATCH | `/categories/:id` | Editar |

### KPIs & Gráficos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/kpis` | KPIs (saldo, receitas, despesas, economia) — modo pessoal ou empresarial |
| GET | `/reports/chart/line` | Dados para gráfico de linha (evolução) |
| GET | `/reports/chart/bar` | Dados para gráfico de barras (rec vs desp) |
| GET | `/reports/chart/pie` | Dados para gráfico de pizza (categorias) |
| GET | `/reports/chart/area` | Dados para gráfico de área (patrimônio) |

### Metas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/goals` | Listar metas com progresso |
| POST | `/goals` | Criar meta |
| PATCH | `/goals/:id` | Atualizar meta |
| POST | `/goals/:id/contribute` | Adicionar valor à meta |
| POST | `/goals/sync-zenith` | Sincronizar metas com Zenith |

### Orçamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/budgets` | Listar orçamentos com % gasto |
| POST | `/budgets` | Criar orçamento |
| PATCH | `/budgets/:id` | Editar orçamento |

### Transações Recorrentes
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/recurring` | Listar transações recorrentes |
| POST | `/recurring` | Criar recorrência |
| DELETE | `/recurring/:id` | Desativar |

### Relatórios & Exportação
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/reports/monthly` | Relatório mensal |
| GET | `/reports/yearly` | Relatório anual |
| GET | `/reports/category/:id` | Relatório por categoria |
| GET | `/reports/export/csv` | Exportar CSV |
| GET | `/reports/export/pdf` | Exportar PDF |

### Alertas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/alerts` | Listar alertas |
| POST | `/alerts/read/:id` | Marcar como lido |
| POST | `/alerts/read-all` | Marcar todos como lidos |

### Webhooks (receber do Zenith e SaaS)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/webhooks/zenith` | Receber webhooks do Zenith (transaction.created, goal.updated) |
| POST | `/webhooks/saas` | Receber webhooks do SaaS Multiempresa (transaction.created) |

### Modo
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/mode` | Retorna modo atual (pessoal/empresarial) + dados do tenant |
| POST | `/mode/switch` | Alternar entre pessoal e empresarial |

---

## 🔗 Integrações

### Fluxo: Zenith → Dashboard
```
1. Usuário anota no Zenith: "gastei 25 com pastel"
2. Zenith processa via IA → cria transação (Alimentação, R$ 25)
3. Zenith envia webhook: POST /webhooks/zenith
   { event: "transaction.created", data: { amount: 25, category: "Alimentação", ... } }
4. Dashboard recebe webhook → cria Transaction com source: ZENITH
5. KPIs, gráficos e tabela atualizam em tempo real
```

### Fluxo: SaaS Multiempresa → Dashboard
```
1. Usuário registra compra no SaaS: "Compra de mercadoria R$ 5.000"
2. SaaS envia webhook: POST /webhooks/saas
   { event: "transaction.created", data: { amount: 5000, category: "Compras", tenantId: "xxx", ... } }
3. Dashboard recebe webhook → cria Transaction com source: SAAS + tenantId
4. Aparece no dashboard empresarial (modo empresarial)
```

### Fluxo: Dashboard → Zenith (bidirecional)
```
1. Usuário cria meta no Dashboard: "Economizar R$ 5.000"
2. Dashboard envia API call para Zenith: POST /api/goals
3. Zenith cria meta correspondente
4. Progresso atualizado em ambos os lados via webhooks
```

### Resumo das integrações

| App | Direção | O que flui | Como |
|-----|---------|-----------|------|
| **Zenith** | → Dashboard | Transações (gastos), metas | Webhook `transaction.created` |
| **Dashboard** | → Zenith | Metas criadas/atualizadas | API call |
| **SaaS Multiempresa** | → Dashboard | Transações (compras, despesas, folha) | Webhook `transaction.created` |
| **NexusAuth** | → Dashboard | Auth, 2FA, tenant, usuário | SDK + JWKS |

---

## 🎨 UI/UX

### Layout (tela única)
- **Header fixo no topo:**
  - Toggle [👤 Pessoal | 🏢 Empresarial] (muda todos os dados)
  - Filtros globais (período, categoria, tipo, fonte)
  - Botão "Nova Transação"
  - Notificações (sino com contador de alertas)
- **KPI Cards (4 cards em linha):**
  - Saldo Atual (com indicador de tendência ↑↓)
  - Receitas do Mês (com % vs mês anterior)
  - Despesas do Mês (com % vs mês anterior)
  - Economia Líquida (receitas - despesas)
- **Gráficos (grid 2x2 + 1 full width):**
  - Linha: evolução do saldo ao longo do tempo
  - Barras: receitas vs despesas por mês
  - Pizza/Donut: distribuição de despesas por categoria
  - Área: projeção de patrimônio
  - Full width: tabela de transações
- **Painéis laterais ou abaixo:**
  - Metas (cards com progresso circular)
  - Orçamentos (barras de progresso com % gasto)
  - Contas (lista com saldo de cada uma)
  - Alertas (lista de notificações recentes)

### Estilo visual
- **Tema:** dark com accent (consistente com portfólio)
- **Pessoal:** accent ciano (#00F5FF) — mesma cor do Zenith
- **Empresarial:** accent azul (#3B82F6) — mesma cor do SaaS
- **Cards:** glassmorphism sutil (backdrop-blur + border)
- **Gráficos:** cores das categorias, tooltip interativo, animações suaves
- **Tabela:** zebra striping, hover highlight, badges de fonte (Zenith/SaaS/Manual)
- **Source badge:** cada transação mostra de onde veio (🔵 Zenith, 🟣 SaaS, ⚪ Manual)

### Animações
- **Count-up:** números dos KPIs animam ao carregar
- **Gráficos:** animação de entrada (Recharts nativo)
- **Transições:** ao trocar modo (Pessoal/Empresarial), dados fazem fade transition
- **Skeleton loading:** enquanto carrega dados
- **Toast:** confirmação de transação criada, meta atingida, etc.
- **Progress bars:** animam suavemente ao atualizar

### Modais (tudo na mesma página, sem navegação)
- Nova Transação (form com conta, categoria, valor, data, tags, anexo)
- Nova Meta (título, valor alvo, prazo, contribuição automática)
- Nova Categoria (nome, cor, ícone, tipo)
- Nova Conta (nome, tipo, saldo inicial)
- Novo Orçamento (categoria, limite, período)
- Filtros avançados
- Detalhes da transação (com anexo)

### Mobile
- Dashboard adapta: cards empilhados, gráficos simplificados
- Tabela com scroll horizontal
- Filtros em drawer (bottom sheet)
- Modais em tela cheia

---

## 🗺️ Fases de Desenvolvimento

### Fase 1 — Fundação
- [ ] Configurar Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Configurar NestJS backend + Prisma + PostgreSQL + Redis
- [ ] Docker Compose (frontend + backend + postgres + redis)
- [ ] Integrar NexusAuth (SSO + 2FA)
- [ ] Layout base do dashboard (tela única, header, grid)
- [ ] Toggle Pessoal/Empresarial (Zustand)

### Fase 2 — Contas & Transações
- [ ] CRUD de contas (corrente, poupança, cartão, cash, digital)
- [ ] CRUD de transações (receita, despesa, transferência, investimento)
- [ ] Transferência entre contas
- [ ] Formulário de nova transação (modal)
- [ ] Tabela de transações (TanStack Table com filtros, busca, paginação)
- [ ] Source badge (Zenith / SaaS / Manual)

### Fase 3 — Categorias & Subcategorias
- [ ] CRUD de categorias com subcategorias
- [ ] Categorias padrão (Moradia, Alimentação, etc.)
- [ ] Cor e ícone por categoria
- [ ] Categorias separadas por modo (pessoal/empresarial)

### Fase 4 — KPIs & Gráficos
- [ ] KPI Cards (Saldo, Receitas, Despesas, Economia) com count-up
- [ ] Gráfico de linha (evolução temporal)
- [ ] Gráfico de barras (receitas vs despesas)
- [ ] Gráfico de pizza/donut (distribuição por categoria)
- [ ] Gráfico de área (projeção de patrimônio)
- [ ] Filtros globais (período, categoria, tipo, fonte)

### Fase 5 — Metas Financeiras
- [ ] CRUD de metas (economia, compra, receita, dívida)
- [ ] Progresso visual (barra circular)
- [ ] Marcos (milestones)
- [ ] Contribuição automática (% das receitas)
- [ ] Integração com Zenith (sincronização via API + webhooks)

### Fase 6 — Orçamentos
- [ ] CRUD de orçamentos por categoria
- [ ] Barra de progresso (% gasto vs limite)
- [ ] Alertas de orçamento (80% e 100%)
- [ ] Rollover opcional (saldo passa para próximo mês)

### Fase 7 — Transações Recorrentes
- [ ] CRUD de transações recorrentes
- [ ] Cron job para gerar transações automaticamente
- [ ] Notificação quando transação recorrente é gerada

### Fase 8 — Webhooks (Zenith + SaaS)
- [ ] Endpoint POST /webhooks/zenith (receber transações do Zenith)
- [ ] Endpoint POST /webhooks/saas (receber transações do SaaS)
- [ ] WebhookLog (rastrear webhooks recebidos)
- [ ] Processamento assíncrono (Redis queues)
- [ ] Validação de webhook (HMAC signature)
- [ ] Real-time: transação aparece na UI sem refresh (WebSocket)

### Fase 9 — Alertas & Notificações
- [ ] Sistema de alertas (saldo baixo, orçamento excedido, vencimento, etc.)
- [ ] Notificações no navegador (Web Push API)
- [ ] Notificações por email (Nodemailer)
- [ ] Sino de notificações no header

### Fase 10 — Relatórios & Exportação
- [ ] Relatório mensal (resumo com comparativos)
- [ ] Relatório anual
- [ ] Relatório por categoria
- [ ] Exportação CSV (papaparse)
- [ ] Exportação PDF (react-pdf)

### Fase 11 — Modo Empresarial
- [ ] Multi-tenant (dados isolados por empresa)
- [ ] Múltiplos usuários com roles (admin, contador, visualizador)
- [ ] Departamentos/centros de custo
- [ ] Integração com SaaS Multiempresa (webhooks)

### Fase 12 — Polimento & Deploy
- [ ] Animações (count-up, gráficos, transições de modo)
- [ ] Skeleton loading
- [ ] Toast notifications
- [ ] Responsivo mobile (cards empilhados, tabela com scroll)
- [ ] Testes E2E (Playwright)
- [ ] Deploy (Vercel + Railway)
- [ ] CI/CD no GitHub Actions

---

## 🎓 O que este projeto demonstra no portfólio
- **Fullstack completo** (Next.js + NestJS + PostgreSQL + Redis)
- **Dashboard em tela única** (tudo em uma página, sem navegação)
- **Dual mode** (pessoal + empresarial com toggle)
- **Visualização de dados** (Recharts, KPIs, 4 tipos de gráficos)
- **Integração entre 3 sistemas** (Zenith + SaaS Multiempresa + NexusAuth)
- **Webhooks** (receber transações de múltiplas fontes em tempo real)
- **Sincronização bidirecional** (Dashboard ↔ Zenith)
- **Multi-tenant** (modo empresarial com isolamento de dados)
- **TanStack Table** (tabelas avançadas com filtros e paginação)
- **State management** (Zustand para modo toggle + TanStack Query para server state)
- **Cron jobs** (transações recorrentes automáticas)
- **Sistema de alertas** (Web Push + email)
- **Type safety end-to-end** (TS + Prisma + Zod)
- **Cálculos financeiros com Decimal** (precisão)
- **Docker e containerização**
- **Redis** (cache de KPIs, filas de webhook)
- **Conexão entre projetos** (hub financeiro central do ecossistema)