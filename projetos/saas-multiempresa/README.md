# 🏢 ERP Cloud — Sistema Completo de Gestão Empresarial Multi-tenant

> **Categoria no portfólio:** Fullstack
> **Prioridade:** 🔴 Alta · **Status:** ⚪ Não iniciado
> **Integra com:** NexusAuth (auth com tenant_id)

---

## 💡 Ideia Original (Breno)

Sistema de organização de empresas. Pode ter várias empresas cadastradas. Vai ter produtos, fornecedores, gastos, precificação, funcionários — tudo. Um sistema completo de gestão de empresas.

---

## 🎯 Escopo

Plataforma SaaS multi-tenant que funciona como um **ERP completo** para pequenas e médias empresas. Cada empresa (tenant) tem dados totalmente isolados e acesso a todos os módulos de gestão: produtos, estoque, fornecedores, compras, vendas, clientes, funcionários, financeiro, precificação e relatórios. O sistema é modular — a empresa ativa os módulos que precisa.

### Módulos do sistema

#### 📊 Dashboard
- KPIs em tempo real: receita do mês, despesas do mês, lucro líquido, ticket médio
- Gráficos: vendas por período, despesas por categoria, produtos mais vendidos
- Alertas: estoque baixo, contas a vencer, metas de venda
- Fluxo de caixa simplificado (entradas vs saídas)

#### 📦 Produtos & Categorias
- CRUD de produtos com: nome, descrição, SKU, código de barras, foto
- **Categorias e subcategorias** de produtos
- **Precificação automática:** custo + markup % = preço de venda sugerido
- **Histórico de preços:** rastreia mudanças de preço ao longo do tempo
- **Fornecedor do produto:** qual fornecedor fornece cada produto
- **Estoque mínimo:** alerta quando estoque fica abaixo do mínimo
- Variações de produto (tamanho, cor, etc.) — opcional

#### 🏷️ Estoque
- Controle de quantidade por produto
- **Movimentações de estoque:** entrada (compra), saída (venda), ajuste manual
- **Alertas de estoque baixo:** notificação quando produto atinge mínimo
- **Valor de estoque:** soma do custo dos produtos em estoque
- **Inventário:** registro de contagem física vs sistema
- Múltiplos depósitos/lojas (opcional)

#### 🚚 Fornecedores
- CRUD de fornecedores com: nome, CNPJ, contato, email, telefone, endereço
- **Produtos por fornecedor:** quais produtos cada fornecedor fornece
- **Ordens de compra:** registrar compras de fornecedores
- **Histórico de compras:** todas as compras de um fornecedor
- **Prazo de entrega:** tempo médio de entrega por fornecedor
- Avaliação/rating do fornecedor

#### 🛒 Compras
- **Ordem de compra:** criar pedido para fornecedor (produtos + quantidades + preços)
- **Recebimento:** confirmar chegada da mercadoria → dá entrada no estoque
- **Status:** pendente, parcial, recebido, cancelado
- **Conta a pagar:** gera conta a pagar no módulo Financeiro

#### 👥 Clientes (CRM)
- CRUD de clientes com: nome, CPF/CNPJ, email, telefone, endereço
- **Histórico de compras:** todas as vendas do cliente
- **Total comprado:** soma de todas as compras
- **Última compra:** data da última venda
- **Segmentação:** tags e categorias de clientes (VIP, novo, inativo)
- Observações e notas sobre o cliente

#### 💰 Vendas & Pedidos
- **Pedido de venda:** criar venda com múltiplos itens (produtos e/ou serviços)
- **Cálculo automático:** subtotal, descontos, impostos, total
- **Baixa de estoque:** ao confirmar venda, dá baixa no estoque
- **Status:** rascunho, confirmado, pago, entregue, cancelado
- **Formas de pagamento:** dinheiro, cartão (crédito/débito), pix, prazo
- **Conta a receber:** gera conta a receber no módulo Financeiro
- **Nota fiscal:** campo para número de NF (opcional)
- Cupom/desconto no pedido

#### 💸 Financeiro
- **Contas a pagar:** despesas (compras de fornecedores, aluguel, salários, etc.)
- **Contas a receber:** receitas (vendas a prazo, etc.)
- **Fluxo de caixa:** entradas e saídas por período
- **Categorias financeiras:** alimentação, transporte, salários, impostos, etc.
- **Centro de custos:** agrupar gastos por departamento/área
- **Conciliação:** marcar conta como paga/recebida
- **Relatório financeiro:** DRE simplificado, fluxo de caixa, balanço
- **Gastos gerais:** registrar despesas avulsas (luz, água, internet, etc.)

#### 📐 Precificação
- **Cálculo de custo:** custo do produto + frete + impostos = custo total
- **Markup:** definir markup % por produto ou categoria
- **Preço de venda sugerido:** custo total × (1 + markup) = preço sugerido
- **Margem de lucro:** visualizar margem real por produto
- **Simulador:** "se eu vender X unidades por Y preço, quanto lucro?"
- **Histórico de preços:** rastreia todas as mudanças de preço
- **Preço por canal:** preço diferente para balcão, online, atacado (opcional)

#### 👨‍💼 Funcionários (RH)
- CRUD de funcionários com: nome, CPF, cargo, salário, data admissão
- **Departamentos:** organizar funcionários por área
- **Carga horária:** horário de trabalho
- **Folha de pagamento:** salário + benefícios + descontos
- **Vincular usuário:** funcionário pode ter acesso ao sistema (com role)
- **Férias e ausências:** registrar (opcional)

#### 🛠️ Serviços
- CRUD de serviços que a empresa oferece (diferente de produtos)
- **Preço de serviço:** valor cobrado pelo serviço
- **Tempo estimado:** duração do serviço
- **Vincular em vendas:** serviços podem ser vendidos junto com produtos

#### 📈 Relatórios
- **Vendas:** por período, por produto, por cliente, por vendedor
- **Financeiro:** fluxo de caixa, DRE, contas a pagar/receber
- **Estoque:** valor de estoque, produtos parados, giro de estoque
- **Compras:** por fornecedor, por período
- **Produtos:** mais vendidos, menos vendidos, margem de lucro
- **Exportação:** CSV e PDF

#### ⚙️ Configurações
- **Dados da empresa:** nome, CNPJ, endereço, logo, cor de tema
- **Usuários e permissões:** convidar usuários, definir roles (owner, admin, manager, employee)
- **Impostos:** configurar alíquotas (ICMS, ISS, etc.)
- **Categorias:** gerenciar categorias de produtos e financeiras
- **Integrações:** NexusAuth, Stripe
- **Notificações:** configurar alertas (estoque baixo, contas vencendo)

#### 🔐 Multi-tenant & Auth
- **Isolamento total:** cada empresa só vê e acessa seus próprios dados
- **NexusAuth:** JWT com `tenant_id` injetado — isola dados automaticamente
- **RBAC:** roles dentro da empresa (owner, admin, manager, employee)
- **Onboarding:** wizard de cadastro de nova empresa

#### 💳 Planos & Billing
- **Free, Pro, Enterprise** — integração com Stripe
- **Trial de 14 dias** no plano Pro
- Limite de usuários e módulos por plano

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) | SSR, rotas, padrão de mercado |
| **UI** | React 18 + TypeScript | Type safety, ecossistema |
| **Estilos** | Tailwind CSS + shadcn/ui | Design system, acessível |
| **Tabela** | TanStack Table v8 | Tabelas de produtos, clientes, vendas, etc. |
| **Formulários** | React Hook Form + Zod | Validação type-safe |
| **Gráficos** | Recharts | Dashboard com KPIs e relatórios |
| **Backend** | Node.js + NestJS | API modular, multi-tenant ready |
| **ORM** | Prisma | Type-safe + middleware para tenant isolation |
| **Banco** | PostgreSQL | RLS (Row Level Security) opcional para isolamento máximo |
| **Cache** | Redis | Cache de sessões, rate limiting, cache de KPIs |
| **Auth** | NexusAuth (com tenant_id no JWT) | Auth centralizada multi-tenant |
| **Pagamentos** | Stripe | Assinaturas recorrentes, billing do SaaS |
| **Upload** | Cloudinary ou UploadThing | Fotos de produtos, logo da empresa |
| **Email** | Resend ou Nodemailer | Notificações, recibos, convites |
| **Relatórios** | papaparse (CSV) + react-pdf (PDF) | Exportação de relatórios |
| **State** | TanStack Query + Zustand | Server state + UI state |
| **Testes** | Vitest + Playwright | Unit + E2E |
| **Container** | Docker + Docker Compose | Ambiente reproduzível |
| **CI/CD** | GitHub Actions | Automatização |
| **Deploy** | Vercel (frontend) + Railway/Render (backend) | Hospedagem moderna |

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                    ERP Cloud Frontend (Next.js)                    │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│  │Dashboard │ │ Produtos │ │ Estoque  │ │Fornecedor│ │ Clientes││
│  │  KPIs    │ │ & Categ. │ │ Moviment.│ │ & Compras│ │  (CRM)  ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│  │ Vendas & │ │Financeiro│ │Precifica.│ │Funcionár.│ │Serviços ││
│  │ Pedidos  │ │Contas Px │ │Custo+Marg│ │   (RH)   │ │         ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘│
│  ┌──────────┐ ┌──────────┐ ┌───────────────────────────────────┐│
│  │Relatórios│ │Config.   │ │   Onboarding + Billing (Stripe)    ││
│  │Export    │ │Empresa   │ │                                    ││
│  └──────────┘ └──────────┘ └───────────────────────────────────┘│
└──────────────────────────┬────────────────────────────────────────┘
                           │ REST API (tenant_id no JWT)
┌──────────────────────────▼────────────────────────────────────────┐
│                    ERP Cloud Backend (NestJS)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Tenant Middleware (Prisma)                       │ │
│  │  Intercepta TODA query → filtra por tenant_id                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│  │ Products │ │  Stock   │ │Suppliers │ │Purchase  │ │Customers││
│  │ Module   │ │  Module  │ │  Module  │ │Orders    │ │ Module  ││
│  │          │ │          │ │          │ │ Module   │ │  (CRM)  ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│  │  Sales   │ │Finance   │ │Pricing   │ │   HR     │ │Services ││
│  │ Module   │ │ Module   │ │ Module   │ │ Module   │ │ Module  ││
│  │          │ │Pay/Reciv │ │Cost+Marg │ │Employees │ │         ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────────────────┐ │
│  │ Reports  │ │Settings  │ │   Billing Module (Stripe)         │ │
│  │ Module   │ │ Module   │ │   Onboarding Module               │ │
│  └──────────┘ └──────────┘ └──────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              Prisma ORM + PostgreSQL                           ││
│  │         (RLS opcional por tenant_id)                           ││
│  └──────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────┘
          │                              │
    ┌─────▼──────┐                ┌──────▼──────┐
    │ NexusAuth  │                │   Stripe    │
    │ (porta 3000)│               │   (API)     │
    │ tenant_id  │                └─────────────┘
    │ no JWT     │
    └────────────┘
```

---

## 📊 Modelo de Dados (Prisma)

```prisma
// === TENANT & USERS ===

model Tenant {
  id            String   @id @default(uuid())
  name          String
  cnpj          String?
  email         String?
  phone         String?
  address       String?
  logo          String?
  themeColor    String   @default("#00ffff")
  plan          Plan     @default(FREE)
  stripeCustomerId String?
  trialEndsAt   DateTime?
  active        Boolean  @default(true)
  users         User[]
  products      Product[]
  categories    Category[]
  suppliers     Supplier[]
  purchaseOrders PurchaseOrder[]
  customers     Customer[]
  sales         Sale[]
  employees     Employee[]
  departments   Department[]
  services      Service[]
  expenses      Expense[]
  accountsPayable  AccountPayable[]
  accountsReceivable AccountReceivable[]
  stockMovements   StockMovement[]
  priceHistory     PriceHistory[]
  notifications    Notification[]
  createdAt     DateTime @default(now())
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  role      Role     @default(EMPLOYEE)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  employeeId String?  // se vinculado a um funcionário
}

enum Plan { FREE PRO ENTERPRISE }
enum Role { OWNER ADMIN MANAGER EMPLOYEE }

// === PRODUTOS & CATEGORIAS ===

model Category {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  name      String
  parentId  String?  // subcategorias
  parent    Category? @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  products  Product[]
}

model Product {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  desc        String?
  sku         String?  // código interno
  barcode     String?  // código de barras
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  // Custos
  costPrice   Decimal  @db.Decimal(10,2) @default(0) // custo de compra
  freightCost Decimal  @db.Decimal(10,2) @default(0) // frete por unidade
  taxCost     Decimal  @db.Decimal(10,2) @default(0) // imposto por unidade
  totalCost   Decimal  @db.Decimal(10,2) @default(0) // custo total calculado
  // Venda
  salePrice   Decimal  @db.Decimal(10,2) @default(0)
  markup      Decimal  @db.Decimal(5,2)  @default(0) // % markup
  margin      Decimal  @db.Decimal(5,2)  @default(0) // % margem calculada
  // Estoque
  stock       Int      @default(0)
  minStock    Int      @default(0) // estoque mínimo para alerta
  // Fornecedor
  supplierId  String?
  supplier    Supplier? @relation(fields: [supplierId], references: [id])
  photo       String?
  active      Boolean  @default(true)
  unit        String   @default("un") // un, kg, L, m, etc.
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  saleItems   SaleItem[]
  purchaseItems PurchaseOrderItem[]
  stockMovements StockMovement[]
  priceHistory  PriceHistory[]
}

// === FORNECEDORES & COMPRAS ===

model Supplier {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  cnpj        String?
  contactName String?  // nome do contato
  email       String?
  phone       String?
  address     String?
  deliveryDays Int?    // prazo de entrega médio (dias)
  rating      Int?     // 1-5
  products    Product[]
  purchaseOrders PurchaseOrder[]
  createdAt   DateTime @default(now())
}

model PurchaseOrder {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  supplierId  String
  supplier    Supplier @relation(fields: [supplierId], references: [id])
  status      POStatus @default(PENDING)
  total       Decimal  @db.Decimal(12,2)
  items       PurchaseOrderItem[]
  // Conta a pagar gerada
  accountPayableId String?
  expectedDate DateTime? // data prevista de entrega
  receivedDate DateTime? // data real de recebimento
  createdAt   DateTime @default(now())
}

model PurchaseOrderItem {
  id          String   @id @default(uuid())
  purchaseOrderId String
  purchaseOrder PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  quantity    Int
  unitCost    Decimal  @db.Decimal(10,2)
  subtotal    Decimal  @db.Decimal(12,2)
}

enum POStatus { PENDING PARTIAL RECEIVED CANCELLED }

// === CLIENTES & VENDAS ===

model Customer {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  cpfCnpj     String?
  email       String?
  phone       String?
  address     String?
  tags        String[] // VIP, novo, inativo, etc.
  notes       String?
  totalBought Decimal  @db.Decimal(12,2) @default(0)
  lastPurchase DateTime?
  sales       Sale[]
  createdAt   DateTime @default(now())
}

model Sale {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  customerId  String?
  customer    Customer? @relation(fields: [customerId], references: [id])
  // Vendedor (funcionário que fez a venda)
  employeeId  String?
  // Valores
  subtotal    Decimal  @db.Decimal(12,2)
  discount    Decimal  @db.Decimal(10,2) @default(0)
  taxAmount   Decimal  @db.Decimal(10,2) @default(0)
  total       Decimal  @db.Decimal(12,2)
  // Status
  status      SaleStatus @default(DRAFT)
  paymentMethod PaymentMethod?
  // Conta a receber gerada
  accountReceivableId String?
  nfNumber    String?  // número da nota fiscal
  items       SaleItem[]
  createdAt   DateTime @default(now())
}

model SaleItem {
  id        String   @id @default(uuid())
  saleId    String
  sale      Sale     @relation(fields: [saleId], references: [id])
  // Pode ser produto ou serviço
  productId String?
  product   Product? @relation(fields: [productId], references: [id])
  serviceId String?
  service   Service? @relation(fields: [serviceId], references: [id])
  quantity  Int
  unitPrice Decimal  @db.Decimal(10,2)
  subtotal  Decimal  @db.Decimal(12,2)
}

enum SaleStatus { DRAFT CONFIRMED PAID DELIVERED CANCELLED }
enum PaymentMethod { CASH CREDIT DEBIT PIX INSTALLMENT }

// === ESTOQUE ===

model StockMovement {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  type        MovementType // IN (entrada), OUT (saída), ADJUST (ajuste)
  quantity    Int      // positivo para IN, negativo para OUT
  reason      String   // "compra", "venda", "ajuste manual", "perda"
  refId       String?  // ID da venda/compra que gerou a movimentação
  createdAt   DateTime @default(now())
}

enum MovementType { IN OUT ADJUST }

// === FINANCEIRO ===

model Expense {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  description String
  amount      Decimal  @db.Decimal(10,2)
  category    String   // aluguel, luz, água, internet, salários, impostos, etc.
  costCenter  String?  // departamento/área
  date        DateTime
  recurring   Boolean  @default(false) // despesa fixa mensal
  createdAt   DateTime @default(now())
}

model AccountPayable {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  description String
  amount      Decimal  @db.Decimal(12,2)
  supplierId  String?  // se for de fornecedor
  dueDate     DateTime
  paidDate    DateTime?
  status      PaymentStatus @default(PENDING)
  source      String?  // "purchase_order", "expense", "manual"
  refId       String?  // ID da ordem de compra ou despesa
  createdAt   DateTime @default(now())
}

model AccountReceivable {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  description String
  amount      Decimal  @db.Decimal(12,2)
  customerId  String?  // se for de cliente
  dueDate     DateTime
  receivedDate DateTime?
  status      PaymentStatus @default(PENDING)
  source      String?  // "sale", "manual"
  refId       String?  // ID da venda
  createdAt   DateTime @default(now())
}

enum PaymentStatus { PENDING PAID OVERDUE CANCELLED }

// === PRECIFICAÇÃO ===

model PriceHistory {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  oldPrice    Decimal  @db.Decimal(10,2)
  newPrice    Decimal  @db.Decimal(10,2)
  reason      String?  // "markup ajustado", "aumento de custo", "promoção"
  changedAt   DateTime @default(now())
}

// === FUNCIONÁRIOS (RH) ===

model Department {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  name      String
  employees Employee[]
}

model Employee {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  cpf         String?
  position    String   // cargo
  departmentId String?
  department  Department? @relation(fields: [departmentId], references: [id])
  salary      Decimal  @db.Decimal(10,2)
  benefits    Decimal  @db.Decimal(10,2) @default(0) // vale-transporte, vale-refeição, etc.
  discounts   Decimal  @db.Decimal(10,2) @default(0) // INSS, IRRF, etc.
  netSalary   Decimal  @db.Decimal(10,2) @default(0) // salário líquido calculado
  hiredAt     DateTime
  workHours   String?  // "08:00-17:00"
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// === SERVIÇOS ===

model Service {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  desc        String?
  price       Decimal  @db.Decimal(10,2)
  estimatedHours Int?  // tempo estimado em horas
  active      Boolean  @default(true)
  saleItems   SaleItem[]
  createdAt   DateTime @default(now())
}

// === NOTIFICAÇÕES ===

model Notification {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  type      NotificationType
  title     String
  message   String
  read      Boolean  @default(false)
  refId     String?  // ID do item relacionado
  createdAt DateTime @default(now())
}

enum NotificationType {
  LOW_STOCK
  PAYMENT_DUE
  PAYMENT_OVERDUE
  NEW_SALE
  NEW_CUSTOMER
  TRIAL_ENDING
}
```

---

## 🔒 Isolamento Multi-tenant

### Estratégia: Shared Database + tenant_id (com Prisma middleware)

1. **NexusAuth** injeta `tenant_id` no JWT
2. **NestJS middleware** extrai `tenant_id` do JWT e injeta no request
3. **Prisma extension/middleware** intercepta todas as queries e adiciona `WHERE tenant_id = ?` automaticamente
4. **RLS (Row Level Security) opcional:** no PostgreSQL, criar policy por `tenant_id` para isolamento em nível de banco

### Prisma middleware (exemplo)
```typescript
prisma.$use(async (params, next) => {
  if (params.model && params.action !== 'createMany') {
    const tenantId = getCurrentTenantId();
    if (tenantId) {
      if (params.action === 'findMany' || params.action === 'findFirst') {
        params.args.where = { ...params.args.where, tenantId };
      }
      if (params.action === 'create') {
        params.args.data = { ...params.args.data, tenantId };
      }
    }
  }
  return next(params);
});
```

---

## 🔌 Endpoints da API (por módulo)

### Tenant & Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tenants/register` | Onboarding de nova empresa |
| GET | `/tenants/me` | Dados da empresa logada |
| PATCH | `/tenants/me` | Atualizar dados da empresa |
| POST | `/tenants/invite` | Convidar usuário para empresa |

### Produtos & Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/products` | CRUD de produtos |
| GET/POST/PATCH/DELETE | `/categories` | CRUD de categorias |
| GET | `/products/:id/margin` | Margem de lucro do produto |
| POST | `/products/:id/recalculate` | Recalcular custo + preço |

### Estoque
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/stock/movements` | Histórico de movimentações |
| POST | `/stock/movements` | Registrar movimentação manual |
| GET | `/stock/alerts` | Produtos com estoque baixo |
| GET | `/stock/value` | Valor total de estoque |

### Fornecedores & Compras
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/suppliers` | CRUD de fornecedores |
| GET/POST/PATCH | `/purchase-orders` | Ordens de compra |
| POST | `/purchase-orders/:id/receive` | Receber mercadoria (dá entrada no estoque) |

### Clientes & Vendas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/customers` | CRUD de clientes |
| GET/POST/PATCH | `/sales` | Pedidos de venda |
| POST | `/sales/:id/confirm` | Confirmar venda (baixa estoque + gera conta a receber) |
| POST | `/sales/:id/cancel` | Cancelar venda (estorna estoque) |

### Financeiro
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/expenses` | Despesas avulsas |
| GET/POST/PATCH | `/accounts-payable` | Contas a pagar |
| POST | `/accounts-payable/:id/pay` | Marcar como paga |
| GET/POST/PATCH | `/accounts-receivable` | Contas a receber |
| POST | `/accounts-receivable/:id/receive` | Marcar como recebida |
| GET | `/finance/cash-flow` | Fluxo de caixa por período |
| GET | `/finance/dre` | DRE simplificado |

### Precificação
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/pricing/:productId` | Cálculo de custo + margem |
| POST | `/pricing/simulate` | Simulador de lucro |
| GET | `/pricing/:productId/history` | Histórico de preços |

### Funcionários
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/employees` | CRUD de funcionários |
| GET/POST/PATCH/DELETE | `/departments` | CRUD de departamentos |
| GET | `/employees/:id/payroll` | Folha de pagamento |

### Serviços
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/services` | CRUD de serviços |

### Relatórios
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/reports/sales` | Relatório de vendas |
| GET | `/reports/financial` | Relatório financeiro |
| GET | `/reports/inventory` | Relatório de estoque |
| GET | `/reports/products` | Produtos mais/menos vendidos |
| GET | `/reports/export` | Exportar CSV/PDF |

### Dashboard
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/dashboard/kpis` | KPIs principais |
| GET | `/dashboard/charts` | Dados para gráficos |
| GET | `/notifications` | Notificações da empresa |

### Billing
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/billing/subscribe` | Assinar plano (Stripe) |
| POST | `/billing/webhook` | Webhook do Stripe |

---

## 💳 Planos & Billing

| Plano | Preço | Usuários | Módulos | Limite |
|-------|-------|----------|---------|--------|
| **Free** | R$ 0 | 1 | Dashboard + Produtos + Vendas | 50 produtos, 100 vendas/mês |
| **Pro** | R$ 49/mês | 5 | Todos os módulos | Produtos e vendas ilimitados |
| **Enterprise** | R$ 199/mês | Ilimitado | Todos + relatórios avançados | Ilimitado + suporte prioritário |

- Stripe Checkout para assinatura recorrente
- Webhook para ativar/desativar empresa conforme pagamento
- Trial de 14 dias no plano Pro
- Downgrade automático para Free se pagamento falhar

---

## 🎨 UI/UX

### Estrutura de navegação
- **Landing page:** apresentação do SaaS + CTA de cadastro
- **Onboarding:** wizard de 4 passos (dados da empresa → escolher plano → configurar módulos → convidar usuários)
- **App:** sidebar com todos os módulos + topbar com perfil e notificações

### Sidebar (módulos)
```
📊 Dashboard
📦 Produtos
   → Categorias
🏷️ Estoque
   → Movimentações
   → Alertas
🚚 Fornecedores
   → Ordens de Compra
👥 Clientes
💰 Vendas
   → Novo Pedido
💸 Financeiro
   → Contas a Pagar
   → Contas a Receber
   → Despesas
   → Fluxo de Caixa
📐 Precificação
👨‍💼 Funcionários
   → Departamentos
🛠️ Serviços
📈 Relatórios
⚙️ Configurações
   → Dados da Empresa
   → Usuários & Permissões
   → Impostos
   → Notificações
```

### Design
- **Tema:** dark com accent de cor por empresa (cada empresa escolhe sua cor)
- **Tabelas:** TanStack Table com filtros, ordenação, paginação e busca
- **Forms:** React Hook Form + Zod com validação em tempo real
- **Modais:** para criar/editar rapidamente sem sair da página
- **Skeleton loading** enquanto carrega dados
- **Toast notifications** para ações (criar, editar, deletar, erro)
- **Mobile:** todas as operações CRUD funcionais no celular (sidebar vira bottom tab)

---

## 🗺️ Fases de Desenvolvimento

### Fase 1 — Fundação & Multi-tenant
- [ ] Configurar Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Configurar NestJS backend + Prisma + PostgreSQL
- [ ] Docker Compose (frontend + backend + postgres + redis)
- [ ] Integrar NexusAuth (com tenant_id no JWT)
- [ ] Prisma middleware para isolamento por tenant_id
- [ ] Schema Prisma completo (todas as tabelas)
- [ ] Landing page + wizard de onboarding (4 passos)

### Fase 2 — Produtos, Categorias & Estoque
- [ ] CRUD de categorias (com subcategorias)
- [ ] CRUD de produtos (com custo, preço, markup, estoque mínimo)
- [ ] Upload de fotos de produtos (Cloudinary)
- [ ] Movimentações de estoque (entrada, saída, ajuste)
- [ ] Alertas de estoque baixo
- [ ] Valor de estoque

### Fase 3 — Fornecedores & Compras
- [ ] CRUD de fornecedores
- [ ] Ordens de compra (criar, listar, editar)
- [ ] Recebimento de mercadoria (dá entrada no estoque)
- [ ] Vincular fornecedor ao produto
- [ ] Gera conta a pagar no Financeiro

### Fase 4 — Clientes & Vendas
- [ ] CRUD de clientes (com tags, histórico, total comprado)
- [ ] Pedido de venda (produtos + serviços)
- [ ] Cálculo automático (subtotal, desconto, imposto, total)
- [ ] Baixa de estoque ao confirmar venda
- [ ] Formas de pagamento
- [ ] Gera conta a receber no Financeiro
- [ ] Cancelamento de venda (estorna estoque)

### Fase 5 — Financeiro
- [ ] Despesas avulsas (com categoria e centro de custo)
- [ ] Contas a pagar (de compras + despesas fixas)
- [ ] Contas a receber (de vendas a prazo)
- [ ] Marcar como pago/recebido
- [ ] Fluxo de caixa (entradas vs saídas por período)
- [ ] DRE simplificado

### Fase 6 — Precificação
- [ ] Cálculo de custo total (custo + frete + imposto)
- [ ] Markup e margem de lucro por produto
- [ ] Preço de venda sugerido
- [ ] Simulador de lucro
- [ ] Histórico de preços

### Fase 7 — Funcionários & Serviços
- [ ] CRUD de departamentos
- [ ] CRUD de funcionários (cargo, salário, benefícios, descontos)
- [ ] Folha de pagamento (salário líquido)
- [ ] Vincular funcionário a usuário do sistema
- [ ] CRUD de serviços

### Fase 8 — Dashboard & Relatórios
- [ ] KPIs principais (receita, despesas, lucro, ticket médio)
- [ ] Gráficos (vendas, despesas, produtos mais vendidos)
- [ ] Alertas no dashboard (estoque baixo, contas vencendo)
- [ ] Relatório de vendas (por período, produto, cliente, vendedor)
- [ ] Relatório financeiro (fluxo de caixa, DRE)
- [ ] Relatório de estoque (valor, giro, produtos parados)
- [ ] Exportação CSV e PDF

### Fase 9 — Notificações & Configurações
- [ ] Sistema de notificações (estoque baixo, contas vencendo, trial)
- [ ] Configurações da empresa (dados, logo, cor de tema)
- [ ] Usuários e permissões (convidar, roles)
- [ ] Configuração de impostos
- [ ] Categorias financeiras personalizáveis

### Fase 10 — Billing & Stripe
- [ ] Integrar Stripe Checkout
- [ ] Planos (Free, Pro, Enterprise)
- [ ] Trial de 14 dias
- [ ] Webhook do Stripe
- [ ] Downgrade automático se pagamento falhar

### Fase 11 — Polimento & Deploy
- [ ] Animações e skeleton loading
- [ ] Toast notifications
- [ ] Modais de criação rápida
- [ ] Mobile responsivo (sidebar → bottom tab)
- [ ] Testes E2E (Playwright)
- [ ] RLS no PostgreSQL (opcional)
- [ ] Deploy (Vercel + Railway)
- [ ] CI/CD

---

## 🎓 O que este projeto demonstra no portfólio
- **ERP completo** (sistema de gestão empresarial end-to-end)
- **Arquitetura SaaS multi-tenant** (isolamento de dados via Prisma middleware)
- **NestJS modular** (cada módulo independente: products, sales, finance, etc.)
- **Modelagem de dados complexa** (20+ tabelas com relacionamentos)
- **Integração de pagamentos** (Stripe, assinaturas recorrentes)
- **RBAC** (roles por empresa: owner, admin, manager, employee)
- **Dashboard com KPIs e gráficos** (Recharts)
- **Relatórios com exportação** (CSV, PDF)
- **Fullstack completo** (Next.js + NestJS + Postgres)
- **Docker e containerização**
- **Type safety end-to-end** (TS + Prisma + Zod)
- **Onboarding flow** (wizard multi-step)