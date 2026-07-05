# 🕵️ Detetive — Jogo de Investigação Criminal

> **Categoria no portfólio:** Fullstack / Game
> **Prioridade:** 🟡 Média · **Status:** ⚪ Não iniciado
> **Visão:** Web primeiro → Desktop (download) depois

---

## 💡 Ideia Original (Breno)

Jogo onde você está na pele de um detetive. Tem um crime, você investiga, lê os arquivos, vê as pistas, interroga suspeitos e no final escolhe quem é o culpado — dando uma explicação para isso.Resolver um enigma do crime.

A ideia é ter **duas interfaces principais**:
1. **Lousa (Board):** um quadro de detetive onde você faz anotações, conecta pistas com fios, organiza fotos e documentos
2. **Computador (Terminal):** um computador policial onde você acessa documentos do caso, arquivos, fotos, registros, etc.

É um projeto grande — a versão web vem primeiro, mas a ideia é fazer uma versão desktop para download (jogar no computador).

---

## 🎯 Escopo

Jogo de investigação criminal interativo. O jogador assume o papel de um detetive e precisa resolver um crime: coletar evidências, interrogar suspeitos, montar a linha do tempo, conectar pistas na lousa e ao final acusar um culpado com uma explicação baseada nas evidências. O sistema valida se a acusação está correta e se a explicação faz sentido com as pistas.

Interface imersiva com estética noir/dark — como estar em uma sala de investigação policial. O jogo alterna entre **Lousa** (quadro físico do detetive) e **Computador** (terminal policial digital).

### Visão de evolução
- **Fase Web:** jogo jogável no navegador (Next.js + NestJS)
- **Fase Desktop:** versão para download (Tauri ou Electron — joga offline no PC)
- **Fase Expansão:** mais casos, editor de casos (comunidade cria casos custom), multiplayer (detetives cooperam)

### Funcionalidades principais

#### 🎮 Core do Jogo
- **Casos criminais:** cada caso tem descrição, vítima, local, data, narrativa e múltiplos suspeitos
- **Coleta de evidências:** pistas físicas, documentos, fotos, testemunhos, registros
- **Interrogatório:** sistema de diálogo ramificado com suspeitos (perguntas desbloqueiam novas pistas)
- **Linha do tempo:** montar a sequência de eventos cronologicamente
- **Sistema de dedução:** conectar pistas a suspeitos (cada conexão fortalece ou enfraquece a acusação)
- **Acusação final:** escolher culpado + escrever explicação baseada nas evidências
- **Veredicto:** sistema valida acusação + explicação, mostra solução completa
- **Múltiplos casos:** cada caso independente, com dificuldade variável (fácil, médio, difícil)
- **Dificuldade:** casos fáceis dão mais dints, casos difíceis têm pistas contraditórias e red herrings

#### 📋 Lousa (Board do Detetive)
A lousa é o coração da investigação — um quadro visual onde o detetive organiza tudo:
- **Fotos e documentos:** pinar fotos de evidências, documentos, fotos de suspeitos no quadro
- **Fios de conexão:** ligar pistas a suspeitos com fios virtuais (red string board clássico)
- **Anotações:** escrever notas à mão (fonte manuscrita) em qualquer lugar do quadro
- **Post-its:** notas coloridas para marcar observações rápidas
- **Mover e redimensionar:** arrastar elementos livremente pelo quadro
- **Zoom e pan:** navegar pelo quadro (pode ficar grande)
- **Filtrar:** mostrar apenas pistas de um suspeito específico
- **Salvar estado:** o quadro é salvo automaticamente (voltar depois continua de onde parou)
- **Exportar:** salvar imagem do quadro (PNG) para compartilhar
- **Marcadores:** marcar pistas como "confirmada", "duvidosa", "desmentida"

#### 💻 Computador (Terminal Policial)
Um computador policial fictício dentro do jogo — interface diegética que dá acesso aos arquivos do caso:
- **Sistema de arquivos:** navegar por pastas (casos, evidências, suspeitos, registros)
- **Documentos:** abrir PDFs, relatórios, laudos periciais, registros criminais
- **Fotos:** visualizar fotos da cena do crime, evidências, suspeitos (com zoom)
- **Banco de dados:** buscar registros de suspeitos (histórico criminal, antecedentes)
- **E-mails:** ler e-mails relacionados ao caso (pistas em correspondências)
- **Câmeras de segurança:** ver gravações (clips animados ou sequência de frames)
- **Áudios:** ouvir gravações de testemunhas, interceptações telefônicas
- **Navegador fictício:** pesquisar em um "Google" simulado com resultados do caso
- **Mensagens:** ler SMS/WhatsApp fictícios dos suspeitos
- **Relógio:** sistema de tempo do jogo (cada ação consome tempo — pressão)
- **Terminal/Console:** para casos avançados — comandos para acessar dados ocultos

#### 🕐 Sistema de Tempo
- **Tempo limitado:** cada caso tem um prazo (ex: 48h no jogo = X minutos reais)
- **Cada ação consome tempo:** interrogar, analisar evidência, buscar no computador
- **Pressão:** tempo acabando muda a atmosfera (música fica tensa, UI fica mais vermelha)
- **Modo sem tempo:** opção para jogar sem pressão (casual)

#### 🎯 Sistema de Acusação
- **Escolher culpado:** selecionar um suspeito entre os disponíveis
- **Explicação:** escrever (ou selecionar) a justificativa baseada nas evidências
- **Conexões obrigatórias:** deve conectar pelo menos X pistas ao culpado na lousa
- **Validação:** sistema verifica:
  - Acusou a pessoa certa?
  - A explicação cita as evidências corretas?
  - As conexões na lousa fazem sentido?
- **Pontuação:** baseada em tempo, pistas corretas, tentativas, qualidade da explicação
- **Veredicto dramático:** animação de revelação com a solução completa

#### 📊 Progresso & Ranking
- **Perfil do detetive:** nome, avatar, nível, casos resolvidos
- **Histórico:** todos os casos jogados (resolvidos, falhados, em andamento)
- **Estatísticas:** taxa de acerto, tempo médio, melhor pontuação por caso
- **Ranking global:** pontuação total comparada com outros jogadores
- **Conquistas (achievements):** "Primeiro caso resolvido", "Sem pistas erradas", "Sob pressão", etc.
- **Salvamento automático:** progresso salvo a cada ação importante

#### 🔊 Áudio & Atmosfera
- **Música ambiente:** noir/detective (jazz lento, tensão crescente)
- **Sons diegéticos:** teclado digitando, abertura de pastas, telefone tocando
- **Vozes (opcional):** narração do briefing, vozes dos suspeitos no interrogatório
- **Música dinâmica:** muda conforme a tensão (perto do fim do tempo, durante acusação)

---

## 🛠️ Stack Tecnológica

### Versão Web (fase 1)

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) | SSR, rotas, padrão de mercado |
| **UI** | React 18 + TypeScript | Type safety, ecossistema |
| **Estilos** | Tailwind CSS | Utility-first, dark theme, customização |
| **Animações** | Framer Motion | Transições, revelação de pistas, veredicto dramático |
| **Lousa (Board)** | React Flow + custom | Canvas interativo com nodes, edges (fios), drag & drop |
| **Computador** | Componente custom + react-window | Interface de SO fictício com janelas, pastas, apps |
| **State (jogo)** | Zustand | Game state complexo (lousa, progresso, tempo) |
| **State (server)** | TanStack Query | Cache, sync com backend |
| **Backend** | Node.js + NestJS | API modular, lógica de validação |
| **ORM** | Prisma | Type-safe, migrations |
| **Banco** | PostgreSQL | Relacional, relacionamentos complexos |
| **Auth** | NexusAuth | SSO centralizado (integrado com outros projetos) |
| **Áudio** | Howler.js | Controle de áudio, música dinâmica, efeitos |
| **PDF viewer** | react-pdf | Visualizar documentos do caso no computador |
| **Testes** | Vitest + Playwright | Unit + E2E |
| **Container** | Docker + Docker Compose | Ambiente reproduzível |
| **CI/CD** | GitHub Actions | Automatização |
| **Deploy** | Vercel (frontend) + Railway (backend) | Hospedagem moderna |

### Versão Desktop (fase 2)

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Wrapper** | Tauri | Leve, binário pequeno, usa o webview nativo (Rust) |
| **Alt** | Electron | Mais pesado mas mais maduro, melhor compatibilidade |
| **Offline** | SQLite (embedded) | Banco local para jogar sem internet |
| **Sync** | Sync opcional com backend | Sincroniza progresso quando online |
| **Distribuição** | GitHub Releases + auto-update | Download direto, atualizações automáticas |

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                  Detetive — Jogo de Investigação                   │
│                    (Next.js · web · porta 3007)                    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                      Tela Principal                            │ │
│  │                                                               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │ │
│  │  │  Lista   │  │ Briefing │  │  Lousa   │  │  Computador  │ │ │
│  │  │  Casos   │  │  Caso    │  │  (Board) │  │  (Terminal)  │ │ │
│  │  └──────────┘  └──────────┘  └────┬─────┘  └──────┬───────┘ │ │
│  │                                    │                │        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────▼────────────────▼──────┐ │ │
│  │  │ Suspeitos│  │Interrogat│  │    Acusação + Veredicto     │ │ │
│  │  │ + Perfis │  │  Diálogo │  │   (escolher + explicar)     │ │ │
│  │  └──────────┘  └──────────┘  └─────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Zustand (game state) · Howler.js (áudio) · Tempo (timer)     │ │
│  └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼───────────────────────────────────────┐
│                  Detetive Backend (NestJS)                         │
│                      (porta 3008)                                  │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │  Cases   │ │Evidence  │ │Suspects  │ │Dialogue  │ │ Player  │ │
│  │  Module  │ │  Module  │ │  Module  │ │  Engine  │ │ Module  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │Timeline  │ │Deduction │ │ Verdict  │ │  Achievements        │ │
│  │  Module  │ │  Engine  │ │  Engine  │ │  Module              │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Prisma ORM + PostgreSQL                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Lousa (Board) — Arquitetura visual
```
┌─────────────────────────────────────────────────────────┐
│                    LOUSA DO DETETIVE                      │
│                                                           │
│   📸 Foto vítima     📄 Laudo         📸 Cena crime       │
│      │                  │                    │            │
│      │    🔴 Fio        │     🔴 Fio         │            │
│      │                  │                    │            │
│   📸 Suspeito A ◄──────┘◄────────────────────┘            │
│   "Álibi: em casa"                                        │
│                                                           │
│   📸 Suspeito B ◄──── 📄 Registro criminal                │
│   "Álibi: trabalho"  ◄──── 📧 E-mail suspeito             │
│                                                           │
│   📝 Nota manuscrita: "Suspeito B mente sobre horário"    │
│   🟡 Post-it: "Verificar câmera do estacionamento"        │
│                                                           │
│   [Zoom +] [Zoom -] [Filtrar] [Exportar PNG] [Salvar]     │
└─────────────────────────────────────────────────────────┘
```

### Computador (Terminal) — Arquitetura visual
```
┌─────────────────────────────────────────────────────────┐
│  💻 TERMINAL POLICIAL — Departamento de Investigação      │
│  [X]                                          [—] [□] [X] │
├──────┬──────────────────────────────────────────────────┤
│ 📁   │                                                    │
│ Casos│  📂 Caso_001_Assassinato_Mansão                    │
│ 📁   │    📂 Evidências                                   │
│ Evid.│      📄 Laudo_Necroscopico.pdf                    │
│ 📁   │      📄 Laudo_Balistico.pdf                       │
│ Susp.│      🖼️  Foto_Cena_01.jpg                         │
│ 📁   │      🖼️  Foto_Cena_02.jpg                         │
│ Regs.│    📂 Suspeitos                                    │
│ 📁   │      📄 Suspeito_A_Perfil.pdf                     │
│ Audio│      📄 Suspeito_B_Antecedentes.pdf               │
│ 📁   │    📂 Registros                                    │
│ Emails│     📄 Registro_Criminal_A.txt                   │
│ 📁   │    📂 Áudios                                      │
│ Câm. │      🎵 Interceptacao_B.wav                       │
│      │    📂 Emails                                      │
│ 🔍   │      📧 Email_vitima_01.eml                       │
│ Busca│    📂 Câmeras                                     │
│      │      🎥 Camara_Estacionamento.mp4                 │
├──────┴──────────────────────────────────────────────────┤
│  ⏰ Tempo restante: 23h 47min    🔊 Áudio: ON             │
└─────────────────────────────────────────────────────────┘
```

### Estrutura de pastas (Frontend)
```
src/
  app/
    page.tsx              → Lista de casos
    case/[id]/
      page.tsx            → Tela principal do caso
      briefing/page.tsx   → Briefing do crime
      board/page.tsx      → Lousa (board do detetive)
      computer/page.tsx   → Computador (terminal policial)
      suspects/page.tsx   → Lista de suspeitos
      interrogation/[suspectId]/page.tsx → Interrogatório
      accusation/page.tsx → Acusação final
      verdict/page.tsx    → Veredicto
    ranking/page.tsx      → Ranking global
    profile/page.tsx      → Perfil do detetive
  components/
    board/
      Board.tsx           → Canvas principal da lousa
      BoardNode.tsx       → Node (foto, documento, suspeito)
      BoardEdge.tsx       → Fio de conexão (red string)
      StickyNote.tsx      → Post-it
      HandwrittenNote.tsx → Nota manuscrita
      BoardToolbar.tsx    → Toolbar (zoom, filtrar, exportar)
    computer/
      Desktop.tsx         → Desktop do SO fictício
      FileExplorer.tsx    → Navegador de arquivos
      PDFViewer.tsx       → Visualizador de PDF
      ImageViewer.tsx     → Visualizador de imagens
      EmailClient.tsx     → Cliente de email fictício
      AudioPlayer.tsx     → Player de áudio
      VideoPlayer.tsx     → Player de câmeras
      Browser.tsx         → Navegador fictício (busca)
      Terminal.tsx        → Console/terminal (casos avançados)
      Taskbar.tsx         → Barra de tarefas + relógio
    game/
      Timer.tsx           → Sistema de tempo
      ScoreDisplay.tsx    → Pontuação
      AchievementToast.tsx→ Notificação de conquista
    ui/
      Navbar.tsx, Footer.tsx, etc.
  lib/
    game-state.ts         → Zustand store (lousa, progresso, tempo)
    audio.ts              → Howler.js (música + efeitos)
  content/
    cases/                → Dados dos casos (JSON ou do backend)
```

---

## 📊 Modelo de Dados (Prisma)

```prisma
model Player {
  id           String   @id @default(uuid())
  username     String   @unique
  nexusUserId  String?  // link com NexusAuth
  avatar       String?
  level        Int      @default(1)
  xp           Int      @default(0)
  progress     PlayerProgress[]
  achievements PlayerAchievement[]
  createdAt    DateTime @default(now())
}

model Case {
  id            String     @id @default(uuid())
  title         String
  description   String     // narrativa do crime
  victim        String
  location      String
  date          DateTime   // data do crime (ficcional)
  difficulty    Difficulty @default(MEDIUM)
  timeLimit     Int?       // limite em segundos (null = sem limite)
  culpritId     String     // ID do suspeito correto
  solutionText  String     // explicação da solução
  // Relacionamentos
  evidence      Evidence[]
  suspects      Suspect[]
  timeline      TimelineEvent[]
  documents     CaseDocument[]
  emails        CaseEmail[]
  audioFiles    CaseAudio[]
  videoFiles    CaseVideo[]
  progress      PlayerProgress[]
  // Metadata
  createdAt     DateTime   @default(now())
}

model Evidence {
  id              String       @id @default(uuid())
  caseId          String
  case            Case         @relation(fields: [caseId], references: [id])
  title           String
  description     String
  type            EvidenceType
  content         String       // texto detalhado ou URL
  imageUrl        String?      // foto da evidência
  // Conexões com suspeitos (qual suspeito esta evidência incrimina ou absolve)
  linkedSuspectId String?
  linkedSuspect   Suspect?     @relation(fields: [linkedSuspectId], references: [id])
  connectionType  ConnectionType? // INCRIMINATES or ABSOLVES
  // Quando a evidência é descoberta
  discoveredBy    String?      // "computer", "interrogation", "timeline"
  isRedHerring    Boolean      @default(false) // pista falsa
  order           Int          // ordem de descoberta sugerida
}

model Suspect {
  id            String     @id @default(uuid())
  caseId        String
  case          Case       @relation(fields: [caseId], references: [id])
  name          String
  age           Int?
  profile       String     // descrição física e psicológica
  photoUrl      String?
  alibi         String     // álibi do suspeito
  background    String     // histórico, profissão, relacionamento com vítima
  isCulprit     Boolean    @default(false)
  // Registros criminais (acessíveis via computador)
  criminalRecord String?
  // Diálogos
  dialogues     Dialogue[]
  // Evidências ligadas
  linkedEvidence Evidence[]
}

model Dialogue {
  id              String   @id @default(uuid())
  suspectId       String
  suspect         Suspect  @relation(fields: [suspectId], references: [id])
  questionId      String   // ID da pergunta (para ramificação)
  question        String
  answer          String
  // Ramificação
  nextQuestionId  String?  // próxima pergunta (diálogo ramificado)
  // Recompensas
  revealsEvidenceId String? // evidência revelada por esta resposta
  revealsDocumentId String? // documento desbloqueado no computador
  // Condição (ex: só aparece se evidência X foi coletada)
  requiresEvidenceId String?
  isLie           Boolean  @default(false) // suspeito mentindo
}

model TimelineEvent {
  id        String @id @default(uuid())
  caseId    String
  case      Case   @relation(fields: [caseId], references: [id])
  time      String // "22:30"
  event     String
  description String
  order     Int    // ordem cronológica correta
  // Evidência que confirma este evento
  evidenceId String?
}

model CaseDocument {
  id        String @id @default(uuid())
  caseId    String
  case      Case   @relation(fields: [caseId], references: [id])
  title     String
  type      DocumentType // PDF, IMAGE, TEXT, REPORT
  fileUrl   String  // URL do arquivo
  content   String? // texto extraído (busca)
  // No computador
  folder    String  // "Evidências", "Suspeitos", "Registros"
  locked    Boolean @default(false) // precisa desbloquear via interrogatório
  unlockCondition String? // ex: "Interrogar suspeito B"
}

model CaseEmail {
  id        String @id @default(uuid())
  caseId    String
  case      Case   @relation(fields: [caseId], references: [id])
  from      String
  to        String
  subject   String
  body      String
  date      String // data ficional
  read      Boolean @default(false)
  containsEvidence Boolean @default(false)
}

model CaseAudio {
  id        String @id @default(uuid())
  caseId    String
  case      Case   @relation(fields: [caseId], references: [id])
  title     String
  fileUrl   String
  transcript String // transcrição do áudio
  duration  Int    // segundos
  locked    Boolean @default(false)
}

model CaseVideo {
  id        String @id @default(uuid())
  caseId    String
  case      Case   @relation(fields: [caseId], references: [id])
  title     String
  fileUrl   String
  thumbnailUrl String?
  duration  Int
  location  String // "Estacionamento", "Recepção", etc.
  timestamp String // horário da gravação
  containsEvidence Boolean @default(false)
  locked    Boolean @default(false)
}

model BoardState {
  id           String   @id @default(uuid())
  playerId     String
  player       Player   @relation(fields: [playerId], references: [id])
  caseId       String
  // Estado da lousa (JSON com positions, connections, notes)
  nodes        Json     // [{ id, type, x, y, data }]
  edges        Json     // [{ source, target, color }]
  notes        Json     // [{ id, text, x, y, color }]
  postits      Json     // [{ id, text, x, y, color }]
  updatedAt    DateTime @updatedAt
}

model PlayerProgress {
  id           String         @id @default(uuid())
  playerId     String
  player       Player         @relation(fields: [playerId], references: [id])
  caseId       String
  case         Case           @relation(fields: [caseId], references: [id])
  status       ProgressStatus @default(IN_PROGRESS)
  accusedId    String?        // quem o jogador acusou
  correct      Boolean?
  explanation  String?        // explicação escrita pelo jogador
  timeSpent    Int?           // segundos
  score        Int?
  hintsUsed    Int            @default(0)
  evidenceFound Int           @default(0)
  createdAt    DateTime       @default(now())
  completedAt  DateTime?
}

model Achievement {
  id          String   @id @default(uuid())
  name        String
  description String
  icon        String
  condition   String   // ex: "solve_case_without_hints"
}

model PlayerAchievement {
  id           String   @id @default(uuid())
  playerId     String
  player       Player   @relation(fields: [playerId], references: [id])
  achievementId String
  unlockedAt   DateTime @default(now())
}

enum Difficulty   { EASY MEDIUM HARD EXPERT }
enum EvidenceType { PHYSICAL DOCUMENT TESTIMONY PHOTO DIGITAL AUDIO VIDEO }
enum DocumentType { PDF IMAGE TEXT REPORT EMAIL }
enum ConnectionType { INCRIMINATES ABSOLVES }
enum ProgressStatus { IN_PROGRESS SOLVED FAILED ABANDONED }
```

---

## 🎮 Fluxo do Jogo

```
1. Lista de Casos
   └→ Jogador escolhe um caso (por dificuldade ou tema)
      │
2. Briefing (Cinematic)
   └→ Narrativa do crime: vítima, local, data, contexto
   └→ Detetive é designado ao caso
      │
3. Investigação (Loop principal)
   │
   ├─→ 💻 COMPUTADOR: acessar documentos, fotos, registros, emails, áudios, vídeos
   │   └→ Descobre evidências → adiciona à lousa
   │
   ├─→ 📋 LOUSA: organizar pistas, conectar com fios, fazer anotações
   │   └→ Conecta evidências a suspeitos → vê padrões
   │
   ├─→ 🗣️ INTERROGATÓRIO: fazer perguntas a suspeitos
   │   └→ Respostas revelam novas evidências ou mentiras
   │   └→ Novos documentos desbloqueados no computador
   │
   ├─→ ⏰ TEMPO: cada ação consome tempo (se caso tem limite)
   │   └→ Tempo acabando → atmosfera fica mais tensa
   │
   └─→ 📅 LINHA DO TEMPO: montar sequência cronológica
       └→ Eventos confirmados por evidências
      │
4. Acusação
   └→ Escolher culpado entre os suspeitos
   └→ Escrever explicação (baseada nas evidências)
   └→ Deve ter conexões na lousa justificando
      │
5. Veredicto (Cinematic)
   └→ Sistema valida: acusação correta? explicação coerente?
   └→ Animação dramática de revelação
   └→ Solução completa: quem, como, por quê
   └→ Pontuação: tempo, precisão, pistas, tentativas
   └→ Conquistas desbloqueadas
      │
6. Pós-caso
   └→ Estatísticas do caso
   └→ Ranking atualizado
   └→ Próximo caso desbloqueado (se houver)
```

---

## 🎨 UI/UX

### Estética
- **Tema noir/dark:** fundo escuro (#0A0A0F), tipografia monospace nos documentos
- **Lousa:** fundo de quadro escuro (#1A1A2E) com textura sutil
- **Computador:** interface de SO fictício (estilo Windows 95 meets terminal policial moderno)
- **Cores:** dark base, accent âmbar (#FF8C42) para destaque policial, vermelho (#FF4444) para alertas
- **Tipografia:**
  - **Corpo/UI:** Inter (limpo, legível)
  - **Documentos:** JetBrains Mono (aparência de relatório policial)
  - **Anotações da lousa:** Caveat (fonte manuscrita)
  - **Títulos:** Special Elite (máquina de escrever antiga)

### Lousa (Board)
- **Fundo:** quadro escuro com textura sutil de cortiça/madeira
- **Nodes:** fotos com cantos colados (efeito de fita), documentos com sombra
- **Fios:** linhas vermelhas conectando nodes (SVG, animadas ao criar)
- **Post-its:** amarelo, rosa, azul — font manuscrito
- **Anotações:** texto manuscrito branco no quadro
- **Hover:** node eleva + mostra opções (conectar, marcar, remover)
- **Criar conexão:** arrastar de um node a outro → fio vermelho aparece
- **Zoom:** scroll do mouse (min 50%, max 200%)
- **Pan:** arrastar fundo do quadro
- **Marcadores:** badge no node (✓ confirmada, ? duvidosa, ✗ desmentida)

### Computador (Terminal)
- **Boot animation:** tela de loading ao "ligar" o computador
- **Desktop:** ícones de pastas e apps
- **Janelas:** arrastáveis, redimensionáveis, minimizáveis (estilo OS)
- **File explorer:** pastas e arquivos do caso
- **PDF viewer:** documentos com aparência de papel escaneado
- **Image viewer:** fotos com zoom (lupa)
- **Email client:** lista de emails + preview
- **Audio player:** waveform + play/pause
- **Video player:** frames da câmera (com timestamp)
- **Browser fictício:** barra de busca + resultados simulados
- **Taskbar:** relógio do jogo + indicador de tempo restante

### Interrogatório
- **Split screen:** foto do suspeito + interface de diálogo
- **Diálogo:** estilo visual novel (caixa de texto na parte inferior)
- **Opções:** perguntas disponíveis como botões (algumas bloqueadas)
- **Reações:** suspeito muda expressão conforme pergunta
- **Indicador de mentira:** sutil (microexpressão, hesitação no texto) — jogador precisa notar

### Acusação & Veredicto
- **Acusação:** modal dramático com foto do suspeito escolhido
- **Campo de explicação:** textarea grande (ou seleção de evidências)
- **Confirmação:** "Tem certeza? Esta ação não pode ser desfeita."
- **Veredicto:** tela escurece → spotlight no culpado → animação de revelação
- **Solução:** texto + visual mostrando como o crime aconteceu

### Animações
- **Framer Motion:** transições entre telas, revelação de evidências
- **Lousa:** nodes aparecem com scale + fade, fios desenham animadamente
- **Computador:** janelas abrem com scale up, pastas abrem com slide
- **Veredicto:** sequência cinematográfica (fade, zoom, spotlight)
- **Tempo:** UI fica mais vermelha conforme tempo acaba
- **Reduced motion:** respeitar `prefers-reduced-motion`

### Áudio
- **Música ambiente:** jazz noir / detective (loop suave)
- **Tensão crescente:** música fica mais intensa perto do fim do tempo
- **Sons diegéticos:** teclado, abertura de pastas, telefone, sirenes
- **Interrogatório:** tom de voz diferente por suspeito (pitch/tone)
- **Veredicto:** som dramático de revelação

---

## 🗺️ Fases de Desenvolvimento

### Fase 1 — Fundação
- [ ] Configurar Next.js + TypeScript + Tailwind
- [ ] Configurar NestJS backend + Prisma + PostgreSQL
- [ ] Docker Compose (frontend + backend + postgres)
- [ ] Auth com NexusAuth
- [ ] Layout base + estética noir
- [ ] Modelo de dados Prisma completo + migrations

### Fase 2 — Casos & Briefing
- [ ] CRUD de casos (admin)
- [ ] Lista de casos (tela inicial)
- [ ] Tela de briefing (narrativa do crime)
- [ ] Sistema de tempo (timer)
- [ ] 1 caso completo de teste (caso fácil)

### Fase 3 — Computador (Terminal Policial)
- [ ] Desktop do SO fictício (boot animation, ícones, taskbar)
- [ ] File explorer (pastas e arquivos do caso)
- [ ] PDF viewer (documentos do caso)
- [ ] Image viewer (fotos com zoom)
- [ ] Email client (emails do caso)
- [ ] Audio player (gravações)
- [ ] Video player (câmeras de segurança)
- [ ] Browser fictício (busca simulada)
- [ ] Sistema de arquivos trancados (desbloquear via interrogatório)

### Fase 4 — Lousa (Board do Detetive)
- [ ] Canvas interativo (React Flow ou custom)
- [ ] Nodes: fotos, documentos, suspeitos (drag & drop)
- [ ] Fios de conexão (red string — SVG animado)
- [ ] Post-its (notas coloridas)
- [ ] Anotações manuscritas (texto no quadro)
- [ ] Zoom e pan
- [ ] Marcadores (confirmada, duvidosa, desmentida)
- [ ] Exportar PNG do quadro
- [ ] Salvar estado da lousa (BoardState no DB)

### Fase 5 — Suspeitos & Interrogatório
- [ ] Lista de suspeitos com perfis, álibis, fotos
- [ ] Sistema de diálogo ramificado (árvore de perguntas)
- [ ] Revelação de evidências via interrogatório
- [ ] Desbloqueio de documentos no computador via interrogatório
- [ ] Indicadores sutis de mentira
- [ ] Interface estilo visual novel

### Fase 6 — Linha do Tempo & Dedução
- [ ] Montagem da linha do tempo (eventos arrastáveis)
- [ ] Validação cronológica (ordem correta)
- [ ] Conexão de evidências com suspeitos (na lousa)
- [ ] Sistema de dedução (força da acusação baseada nas conexões)

### Fase 7 — Acusação & Veredicto
- [ ] Tela de acusação (escolher culpado)
- [ ] Campo de explicação (texto + seleção de evidências)
- [ ] Validação no backend (acusação + explicação + conexões)
- [ ] Tela de veredicto com animação cinematográfica
- [ ] Solução completa (quem, como, por quê)
- [ ] Salvar progresso + pontuação

### Fase 8 — Progresso, Ranking & Conquistas
- [ ] Perfil do detetive (nome, avatar, nível, XP)
- [ ] Histórico de casos (resolvidos, falhados, em andamento)
- [ ] Estatísticas (taxa de acerto, tempo médio, melhor pontuação)
- [ ] Ranking global
- [ ] Sistema de conquistas (achievements)
- [ ] Salvamento automático

### Fase 9 — Áudio & Atmosfera
- [ ] Música ambiente noir (Howler.js)
- [ ] Música dinâmica (tensão crescente)
- [ ] Sons diegéticos (teclado, pastas, telefone)
- [ ] Vozes dos suspeitos (opcional — TTS ou gravado)
- [ ] Som de veredicto dramático

### Fase 10 — Polimento & Mais Casos
- [ ] 3-5 casos completos (fácil, médio, difícil, expert)
- [ ] Caso com red herrings (pistas falsas)
- [ ] Caso com pistas contraditórias
- [ ] Animações Framer Motion em todas as transições
- [ ] Responsivo (mobile adaptado — lousa simplificada)
- [ ] Testes E2E (Playwright)
- [ ] Deploy (Vercel + Railway)

### Fase 11 — Versão Desktop (Download)
- [ ] Avaliar Tauri vs Electron
- [ ] Wrapper desktop (Tauri preferido — mais leve)
- [ ] SQLite embedded (jogar offline)
- [ ] Sync opcional com backend (quando online)
- [ ] Auto-update (GitHub Releases)
- [ ] Build para Windows, macOS, Linux
- [ ] Installer / executável

### Fase 12 — Expansão (Futuro)
- [ ] Editor de casos (comunidade cria casos custom)
- [ ] Compartilhamento de casos (Steam Workshop style)
- [ ] Multiplayer cooperativo (detetives resolvem juntos)
- [ ] Modo assíncrono (um detetive monta pistas, outro resolve)
- [ ] Casos com múltiplos culpados ou nenhum culpado
- [ ] DLC: novos casos pagos
- [ ] Steam release (se fizer sentido)

---

## 🎓 O que este projeto demonstra no portfólio
- **Fullstack completo** (Next.js + NestJS + PostgreSQL)
- **Game design** (loop de investigação, dedução, validação lógica)
- **Interface diegética** (computador fictício dentro do jogo)
- **Canvas interativo** (lousa com drag & drop, fios, zoom — React Flow)
- **Sistema de diálogo ramificado** (árvore de perguntas e respostas)
- **State management complexo** (Zustand — game state, lousa, tempo, progresso)
- **Modelagem de dados complexa** (12+ tabelas com relacionamentos)
- **UI/UX imersiva** (estética noir, áudio dinâmico, atmosfera)
- **Gamification** (pontuação, ranking, conquistas, níveis, XP)
- **Áudio dinâmico** (Howler.js — música que muda com a tensão)
- **Sistema de tempo** (timer com pressão e atmosfera dinâmica)
- **Desktop app** (Tauri/Electron — versão para download)
- **Docker e containerização**
- **Integração com NexusAuth** (SSO com outros projetos)
- **Testes E2E** (Playwright)
- **Criatividade e narrativa** (design de casos, pistas, red herrings)