/* ============================================================
   DATA.JS — Model central do portfólio
   Todos os dados de conteúdo ficam aqui.
   As páginas consomem via JS — nada hardcoded no HTML.
   Autor: Breno J. Oliveira
============================================================ */

const PORTFOLIO_DATA = {

  /* ──────────────────────────────────────────
     DADOS PESSOAIS
  ────────────────────────────────────────── */
  owner: {
    name:        "Breno J. Oliveira",
    nameShort:   "B.J.O",
    role:        "Desenvolvedor Full-Stack",
    tagline:     "Transformando lógica em experiências que escalam",
    bio:         "Desenvolvedor de sistemas apaixonado por arquitetura de software limpa, performance e sistemas embarcados. Estudante no SENAI, construindo soluções backend robustas com foco em código que resiste ao tempo e ao crescimento. Acredito que a melhor interface é aquela que desaparece — e o melhor código é aquele que você não precisa reescrever.",
    bioLong:     "Atualmente cursando Desenvolvimento de Sistemas no SENAI, venho me especializando em arquitetura de sistemas escaláveis, APIs bem estruturadas e a elegância da programação de baixo nível. Minha jornada começa na intersecção entre hardware e software — desenvolvendo sistemas embarcados com Arduino e C/C++ enquanto construo serviços backend modernos com Node.js e Python. Acredito que entender como as coisas funcionam 'por baixo' me torna um programador melhor em qualquer nível da stack.",
    location:    "[CIDADE, ESTADO]",
    email:       "[SEU@EMAIL.COM]",
    instagram:   "[@SEU_INSTAGRAM]",
    github:      "https://github.com/Breno-J-Oliveira",
    availability: true,
    availableMsg: "Disponível para projetos",
    photo:       "assets/fotos/breno.png",
    cv:          "assets/curriculo.pdf",
  },

  /* ──────────────────────────────────────────
     REDES SOCIAIS
  ────────────────────────────────────────── */
  social: [
    { name: "GitHub",    url: "https://github.com/Breno-J-Oliveira", icon: "github",    color: "#ffffff" },
    { name: "LinkedIn",  url: "#",                                   icon: "linkedin",  color: "#0077b5" },
    { name: "Instagram", url: "#",                                   icon: "instagram", color: "#e1306c" },
  ],

  /* ──────────────────────────────────────────
     ESTATÍSTICAS
  ────────────────────────────────────────── */
  stats: [
    { value: 10,  suffix: "+", label: "Projetos",         desc: "Construídos ao longo da minha jornada" },
    { value: 16,  suffix: "+", label: "Tecnologias",      desc: "Do front ao hardware" },
    { value: 3,   suffix: "+", label: "Anos programando", desc: "Aprendendo e construindo todo dia" },
  ],

  /* ──────────────────────────────────────────
     HABILIDADES TÉCNICAS
  ────────────────────────────────────────── */
  skills: {
    frontend: [
      { name: "HTML/CSS",      level: 90, years: 3, icon: "devicon-html5-plain"           },
      { name: "JavaScript",    level: 85, years: 3, icon: "devicon-javascript-plain"      },
      { name: "React",         level: 65, years: 1, icon: "devicon-react-original"        },
      { name: "TypeScript",    level: 55, years: 1, icon: "devicon-typescript-plain"      },
    ],
    backend: [
      { name: "Node.js",       level: 88, years: 3, icon: "devicon-nodejs-plain"          },
      { name: "Python",        level: 85, years: 3, icon: "devicon-python-plain"          },
      { name: "C/C++",         level: 80, years: 2, icon: "devicon-cplusplus-plain"       },
      { name: "Java",          level: 72, years: 2, icon: "devicon-java-plain"            },
      { name: "PHP",           level: 68, years: 2, icon: "devicon-php-plain"             },
      { name: "Express.js",    level: 82, years: 2, icon: "devicon-express-original"      },
    ],
    tools: [
      { name: "Git/GitHub",    level: 90, years: 3, icon: "devicon-git-plain"             },
      { name: "Linux/Bash",    level: 80, years: 2, icon: "devicon-linux-plain"           },
      { name: "Arduino",       level: 78, years: 2, icon: "devicon-arduino-plain"         },
      { name: "Docker",        level: 60, years: 1, icon: "devicon-docker-plain"          },
      { name: "MySQL",         level: 75, years: 2, icon: "devicon-mysql-plain"           },
      { name: "MongoDB",       level: 65, years: 1, icon: "devicon-mongodb-plain"         },
    ],
  },

  /* ──────────────────────────────────────────
     CONTATO
  ────────────────────────────────────────── */
  contact: {
    formspreeId: "SEU_ID_AQUI",
  },

  /* ──────────────────────────────────────────
     PROJETOS
  ────────────────────────────────────────── */
  projects: [
    {
      id:          1,
      title:       "Intelligent Traffic Control System",
      category:    "Embedded",
      description: "Sistema de controle de tráfego em tempo real com lógica de escalonamento para otimização de fluxo urbano.",
      long:        "Desenvolvimento de uma lógica de controle de tráfego em tempo real para otimizar fluxos urbanos. O sistema aplica princípios de sistemas embarcados e algoritmos de escalonamento adaptativo para reduzir tempos de espera em cruzamentos. Implementado em C++ rodando em microcontroladores Arduino, com comunicação serial entre os módulos de semáforo.",
      stack:       ["C++", "Arduino", "Serial Comm", "Real-time"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/00f5ff?text=Traffic+Control",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/00f5ff?text=Arquitetura+do+Sistema",
        "https://via.placeholder.com/800x500/0a0a1a/b44fff?text=Diagrama+de+Fluxo",
        "https://via.placeholder.com/800x500/0a0a1a/ffd700?text=Hardware+Montado",
      ],
      url:         "https://github.com/Breno-J-Oliveira",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "SENAI — Projeto Acadêmico",
      year:        2024,
      featured:    true,
      challenges:  "O maior desafio foi garantir responsividade em tempo real sem uso de sistema operacional, implementando um scheduler cooperativo simples em C++ puro.",
      results:     "Redução simulada de 35% no tempo médio de espera em cruzamentos. Aprovação máxima na avaliação do SENAI.",
      galaxy:      { angle: 0.5,  dist: 0.20, color: "#00ffff" },
    },
    {
      id:          2,
      title:       "Discord Automation Bots",
      category:    "Backend",
      description: "Arquitetura assíncrona para automação de servidores Discord com integração a APIs externas e processamento de dados.",
      long:        "Desenvolvimento de bots para Discord utilizando Python com as bibliotecas discord.py e Nextcord. A arquitetura é totalmente assíncrona (asyncio), lidando com múltiplos eventos em tempo real. Os bots integram APIs externas, manipulam dados com NumPy e possuem sistema de comandos extensível. Deploy automático via GitHub Actions.",
      stack:       ["Python", "discord.py", "Nextcord", "AsyncIO", "NumPy", "GitHub Actions"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/b44fff?text=Discord+Bots",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/b44fff?text=Arquitetura+Assíncrona",
        "https://via.placeholder.com/800x500/0a0a1a/00f5ff?text=Dashboard+de+Comandos",
      ],
      url:         "https://github.com/Breno-J-Oliveira",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "Comunidades Online",
      year:        2024,
      featured:    true,
      challenges:  "Gerenciar estado consistente entre múltiplas instâncias do bot e garantir que o sistema de eventos não bloqueasse operações críticas.",
      results:     "Bots ativos em servidores com mais de 2.000 usuários, processando centenas de comandos por hora sem degradação de performance.",
      galaxy:      { angle: 1.8,  dist: 0.25, color: "#b44fff" },
    },
    {
      id:          3,
      title:       "API REST de Gestão de Tarefas",
      category:    "Backend",
      description: "API robusta com autenticação JWT, rate limiting e documentação OpenAPI completa.",
      long:        "API RESTful desenvolvida com Node.js + Express, seguindo princípios de Clean Architecture. Implementa autenticação JWT com refresh tokens, controle de rate limiting, validação de dados com Joi, e documentação interativa gerada automaticamente com Swagger/OpenAPI. Banco de dados relacional com MySQL e migrations versionadas.",
      stack:       ["Node.js", "Express", "MySQL", "JWT", "Swagger", "Docker"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/ffd700?text=Task+API",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/ffd700?text=Documentação+Swagger",
        "https://via.placeholder.com/800x500/0a0a1a/00f5ff?text=Diagrama+de+Banco",
      ],
      url:         "#",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "Projeto Pessoal",
      year:        2024,
      featured:    true,
      challenges:  "Implementar refresh token rotation seguro sem comprometer a UX, e garantir que o rate limiting funcionasse corretamente em ambiente com múltiplas instâncias.",
      results:     "API com 99.9% de uptime durante os testes de carga. Documentação que eliminou todas as dúvidas de integração.",
      galaxy:      { angle: 3.2,  dist: 0.22, color: "#ffd700" },
    },
    {
      id:          4,
      title:       "Sistema de Monitoramento IoT",
      category:    "Embedded",
      description: "Dashboard em tempo real para sensores ambientais com ESP32 e visualização web.",
      long:        "Sistema completo de IoT com ESP32 coletando dados de temperatura, umidade e luminosidade, enviando via MQTT para um broker. Backend em Node.js processa e armazena os dados, enquanto um dashboard web exibe gráficos em tempo real via WebSocket. O sistema inclui alertas por e-mail quando valores ultrapassam limiares configurados.",
      stack:       ["ESP32", "C++", "MQTT", "Node.js", "WebSocket", "Chart.js"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/00ff88?text=IoT+Monitor",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/00ff88?text=Dashboard+Web",
        "https://via.placeholder.com/800x500/0a0a1a/00f5ff?text=Hardware+ESP32",
      ],
      url:         "#",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "Projeto Pessoal",
      year:        2023,
      featured:    false,
      challenges:  "Sincronização entre o tempo do microcontrolador e o servidor, e tratamento de reconexão automática do MQTT sem perda de dados.",
      results:     "Sistema operando continuamente por 30+ dias sem reinicialização. Latência média de 200ms da leitura do sensor até exibição no dashboard.",
      galaxy:      { angle: 4.7,  dist: 0.18, color: "#00ff88" },
    },
    {
      id:          5,
      title:       "Portfolio Cosmos — Galáxia Interativa",
      category:    "Web",
      description: "Portfólio pessoal com galáxia girando em Canvas 2D, planetas interativos e design dark sci-fi.",
      long:        "Desenvolvimento do próprio portfólio como demonstração de habilidades em Canvas 2D, JavaScript avançado e design de experiências imersivas. O motor da galáxia gera 600+ estrelas, braços espirais logarítmicos, efeito de parallax com mouse, estrelas cadentes e planetas-projeto interativos. Zero dependências de framework.",
      stack:       ["HTML5 Canvas", "Vanilla JS", "CSS3", "Web Audio API"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/ff6644?text=Portfolio+Cosmos",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/ff6644?text=Galaxy+Engine",
        "https://via.placeholder.com/800x500/0a0a1a/00f5ff?text=Interações+Mobile",
      ],
      url:         "#",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "Projeto Pessoal",
      year:        2025,
      featured:    true,
      challenges:  "Manter 60fps com 1000+ elementos no canvas, especialmente em mobile, sem sacrificar a fidelidade visual.",
      results:     "Motor rodando a 60fps em desktop e 50fps+ em dispositivos mobile mid-range. Score Lighthouse 95+ em performance.",
      galaxy:      { angle: 5.5,  dist: 0.28, color: "#ff6644" },
    },
    {
      id:          6,
      title:       "CLI Tool para Automação de Deploy",
      category:    "DevOps",
      description: "Ferramenta de linha de comando para automatizar deploys com rollback automático e notificações.",
      long:        "CLI desenvolvida em Node.js para automatizar o processo de deploy de aplicações. A ferramenta conecta via SSH ao servidor, executa etapas configuráveis (pull, build, migrate, restart), monitora logs em tempo real e executa rollback automático se a health check falhar. Configuração via arquivo YAML versionado no repositório.",
      stack:       ["Node.js", "Commander.js", "SSH2", "YAML", "Docker"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/8866ff?text=Deploy+CLI",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/8866ff?text=Terminal+Output",
      ],
      url:         "#",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "Uso Interno",
      year:        2024,
      featured:    false,
      challenges:  "Implementar rollback atômico que não deixa a aplicação em estado inconsistente caso qualquer etapa falhe no meio do processo.",
      results:     "Redução de 80% no tempo de deploy manual. Zero downtime em 40+ deploys realizados com a ferramenta.",
      galaxy:      { angle: 2.4,  dist: 0.32, color: "#8866ff" },
    },
    {
      id:          7,
      title:       "E-commerce Backend — Loja Virtual",
      category:    "Backend",
      description: "Backend completo para e-commerce com catálogo, carrinho, pagamentos e gestão de pedidos.",
      long:        "API de e-commerce desenvolvida com Node.js e MySQL, incluindo módulos de catálogo de produtos com busca full-text, carrinho de compras com sessão persistente, integração com gateway de pagamento (Stripe), gestão de pedidos com notificações por e-mail e painel administrativo básico. Arquitetura em camadas com repositórios, serviços e controllers.",
      stack:       ["Node.js", "Express", "MySQL", "Stripe", "Redis", "Nodemailer"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/44aaff?text=E-commerce+API",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/44aaff?text=Diagrama+de+Arquitetura",
        "https://via.placeholder.com/800x500/0a0a1a/b44fff?text=Fluxo+de+Pagamento",
      ],
      url:         "#",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "[CLIENTE PLACEHOLDER]",
      year:        2023,
      featured:    false,
      challenges:  "Garantir consistência transacional nas operações de pedido/pagamento e implementar idempotência nos endpoints críticos.",
      results:     "Sistema processando pedidos com taxa de sucesso de 99.2%. Integração com Stripe validada em ambiente de produção.",
      galaxy:      { angle: 0.2,  dist: 0.15, color: "#44aaff" },
    },
    {
      id:          8,
      title:       "Sistema de Controle de Inventário",
      category:    "Web",
      description: "Aplicação web full-stack para gestão de estoque com relatórios e alertas automáticos.",
      long:        "Sistema de gestão de inventário com frontend em HTML/CSS/JS e backend em PHP + MySQL. Inclui cadastro de produtos com categorias e fornecedores, movimentação de estoque com rastreabilidade completa, relatórios exportáveis em CSV, alertas de estoque mínimo e painel de KPIs em tempo real.",
      stack:       ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Chart.js"],
      image:       "https://via.placeholder.com/600x400/0a0a1a/ff44aa?text=Inventário",
      images:      [
        "https://via.placeholder.com/800x500/0a0a1a/ff44aa?text=Dashboard+KPIs",
        "https://via.placeholder.com/800x500/0a0a1a/ffd700?text=Relatórios",
      ],
      url:         "#",
      repo:        "https://github.com/Breno-J-Oliveira",
      client:      "Projeto Acadêmico SENAI",
      year:        2023,
      featured:    false,
      challenges:  "Implementar relatórios complexos com joins múltiplos mantendo boa performance mesmo com grandes volumes de dados.",
      results:     "Sistema aprovado com distinção no SENAI. Redução estimada de 60% no tempo de inventário manual.",
      galaxy:      null,
    },
  ],

  /* ──────────────────────────────────────────
     SERVIÇOS
  ────────────────────────────────────────── */
  services: [
    {
      id:          1,
      icon:        "backend",
      title:       "Desenvolvimento Backend",
      description: "APIs robustas, serviços escaláveis e arquiteturas que crescem com o seu negócio.",
      includes: [
        "APIs RESTful com documentação OpenAPI/Swagger",
        "Autenticação e autorização (JWT, OAuth)",
        "Modelagem e otimização de banco de dados",
        "Integração com serviços de terceiros (Stripe, SendGrid, etc.)",
        "Testes automatizados (unitários e de integração)",
        "Deploy e configuração em servidores Linux",
      ],
      deadline:    "3 a 8 semanas",
      price:       "A partir de R$ [VALOR]",
      color:       "#00f5ff",
    },
    {
      id:          2,
      icon:        "embedded",
      title:       "Sistemas Embarcados & IoT",
      description: "Do hardware ao software: projetos completos com Arduino, ESP32 e comunicação web.",
      includes: [
        "Prototipagem com Arduino e ESP32",
        "Desenvolvimento de firmware em C/C++",
        "Comunicação MQTT e protocolos IoT",
        "Dashboard web em tempo real via WebSocket",
        "Sistema de alertas e notificações",
        "Documentação técnica completa",
      ],
      deadline:    "4 a 10 semanas",
      price:       "A partir de R$ [VALOR]",
      color:       "#b44fff",
    },
    {
      id:          3,
      icon:        "automation",
      title:       "Automação & DevOps",
      description: "Scripts, bots e pipelines que eliminam trabalho repetitivo e aceleram seu time.",
      includes: [
        "Bots para Discord, Telegram e automações web",
        "Scripts Python/Bash para automação de processos",
        "Pipelines CI/CD com GitHub Actions",
        "Containerização com Docker e Docker Compose",
        "Monitoramento e alertas de aplicações",
        "Migração e integração de sistemas legados",
      ],
      deadline:    "1 a 4 semanas",
      price:       "A partir de R$ [VALOR]",
      color:       "#ffd700",
    },
    {
      id:          4,
      icon:        "web",
      title:       "Desenvolvimento Web Full-Stack",
      description: "Sites e aplicações web completas, do design ao deploy, com performance real.",
      includes: [
        "Frontend responsivo com HTML/CSS/JS ou React",
        "Backend integrado (Node.js ou PHP)",
        "Banco de dados relacional ou NoSQL",
        "SEO técnico e otimização de Core Web Vitals",
        "Formulários com validação e envio seguro",
        "Hospedagem e domínio configurados",
      ],
      deadline:    "2 a 6 semanas",
      price:       "A partir de R$ [VALOR]",
      color:       "#00ff88",
    },
  ],

  /* ──────────────────────────────────────────
     DEPOIMENTOS
  ────────────────────────────────────────── */
  testimonials: [
    {
      name:    "[NOME DO CLIENTE]",
      role:    "[CARGO]",
      company: "[EMPRESA]",
      text:    "O Breno entregou uma API completamente documentada e testada antes do prazo. O nível de atenção aos detalhes técnicos e a comunicação durante o projeto foram excepcionais. Definitivamente voltarei a trabalhar com ele.",
      photo:   "https://via.placeholder.com/80x80/1a1a2e/00f5ff?text=C1",
      rating:  5,
    },
    {
      name:    "[NOME DO CLIENTE]",
      role:    "[CARGO]",
      company: "[EMPRESA]",
      text:    "Projeto de sistema embarcado entregue com documentação de nível profissional. Breno domina tanto o hardware quanto o software, o que é raro e muito valioso para projetos IoT.",
      photo:   "https://via.placeholder.com/80x80/1a1a2e/b44fff?text=C2",
      rating:  5,
    },
    {
      name:    "[NOME DO CLIENTE]",
      role:    "[CARGO]",
      company: "[EMPRESA]",
      text:    "A automação que o Breno desenvolveu reduziu horas de trabalho manual em nossa empresa. Código limpo, bem comentado e fácil de manter. Recomendo sem hesitar.",
      photo:   "https://via.placeholder.com/80x80/1a1a2e/ffd700?text=C3",
      rating:  5,
    },
    {
      name:    "[NOME DO CLIENTE]",
      role:    "[CARGO]",
      company: "[EMPRESA]",
      text:    "Contratei para um projeto de e-commerce e recebi muito mais do que esperava. O backend está sólido, escalável e tem uma documentação que meu time consegue manter sem dificuldade.",
      photo:   "https://via.placeholder.com/80x80/1a1a2e/00ff88?text=C4",
      rating:  5,
    },
  ],

  /* ──────────────────────────────────────────
     TIMELINE DE CARREIRA
  ────────────────────────────────────────── */
  timeline: [
    {
      period:   "2024 – Atual",
      role:     "Desenvolvedor Backend Freelancer",
      company:  "Autônomo",
      desc:     "Desenvolvimento de APIs, sistemas de automação e projetos IoT para clientes nacionais. Especialização em Node.js, Python e arquitetura de sistemas escaláveis.",
      stack:    ["Node.js", "Python", "Docker", "MySQL", "ESP32"],
      current:  true,
    },
    {
      period:   "2022 – Atual",
      role:     "Estudante de Desenvolvimento de Sistemas",
      company:  "SENAI",
      desc:     "Formação técnica em desenvolvimento de sistemas com foco em lógica de programação, banco de dados, desenvolvimento web e sistemas embarcados. Projetos práticos em equipe.",
      stack:    ["C/C++", "Java", "PHP", "MySQL", "Arduino"],
      current:  true,
    },
    {
      period:   "2023",
      role:     "Desenvolvedor de Sistemas Embarcados",
      company:  "Projeto Acadêmico SENAI",
      desc:     "Desenvolvimento do Intelligent Traffic Control System — sistema de controle de tráfego em tempo real implementado em C++ para microcontroladores Arduino.",
      stack:    ["C++", "Arduino", "Protocolos Serial"],
      current:  false,
    },
    {
      period:   "2022 – 2023",
      role:     "Desenvolvedor Python (Bots & Automação)",
      company:  "Projetos Open Source",
      desc:     "Criação de bots para comunidades no Discord usando Python e discord.py/Nextcord. Arquitetura assíncrona com asyncio e integração com APIs externas.",
      stack:    ["Python", "discord.py", "Nextcord", "AsyncIO"],
      current:  false,
    },
  ],

  /* ──────────────────────────────────────────
     EDUCAÇÃO & CERTIFICAÇÕES
  ────────────────────────────────────────── */
  education: [
    {
      type:   "graduation",
      title:  "Técnico em Desenvolvimento de Sistemas",
      school: "SENAI",
      year:   2025,
      link:   "#",
    },
    {
      type:   "course",
      title:  "Node.js — API REST com Express e MySQL",
      school: "[PLATAFORMA]",
      year:   2024,
      link:   "#",
    },
    {
      type:   "certification",
      title:  "Python para Automação e APIs",
      school: "[PLATAFORMA]",
      year:   2023,
      link:   "#",
    },
    {
      type:   "course",
      title:  "Sistemas Embarcados com Arduino e C++",
      school: "[PLATAFORMA]",
      year:   2023,
      link:   "#",
    },
    {
      type:   "certification",
      title:  "Git e GitHub — Controle de Versão Profissional",
      school: "[PLATAFORMA]",
      year:   2022,
      link:   "#",
    },
  ],

  /* ──────────────────────────────────────────
     INTERESSES
  ────────────────────────────────────────── */
  interests: [
    { icon: "⚡", name: "Sistemas Embarcados" },
    { icon: "🐧", name: "Linux & Open Source" },
    { icon: "🎮", name: "Desenvolvimento de Games" },
    { icon: "🔭", name: "Astronomia" },
    { icon: "📚", name: "Leitura Técnica" },
    { icon: "🎵", name: "Música" },
  ],

  /* ──────────────────────────────────────────
     FAQ — PERGUNTAS FREQUENTES
  ────────────────────────────────────────── */
  faq: [
    {
      q: "Qual o prazo médio para desenvolver uma API backend?",
      a: "Depende da complexidade. APIs simples (CRUD com autenticação) ficam prontas em 2 a 3 semanas. Sistemas mais complexos com integrações múltiplas podem levar de 6 a 10 semanas. Após entender seu projeto, apresento um cronograma detalhado.",
    },
    {
      q: "Como funciona o processo de trabalho?",
      a: "Seguimos 5 etapas: 1) Briefing — entendimento do projeto. 2) Proposta — escopo, prazo e valor. 3) Desenvolvimento — sprints semanais com atualização. 4) Revisão — até 2 rodadas de ajustes. 5) Entrega — deploy, documentação e handoff.",
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "PIX, transferência bancária ou boleto. Geralmente trabalhamos com 50% no início e 50% na entrega. Para projetos maiores, podemos dividir em marcos intermediários.",
    },
    {
      q: "Você oferece manutenção após a entrega?",
      a: "Sim. Ofereço 30 dias de suporte gratuito para correção de bugs pós-entrega. Após isso, disponibilizo planos de manutenção mensal para atualizações e monitoramento.",
    },
    {
      q: "Posso solicitar alterações no escopo durante o desenvolvimento?",
      a: "Pequenos ajustes são absorvidos sem custo. Mudanças significativas no escopo são avaliadas e pode haver revisão de prazo e valor, sempre com sua aprovação antes de prosseguir.",
    },
    {
      q: "Trabalha com NDA (acordo de confidencialidade)?",
      a: "Sim. Assino NDA quando necessário. A confidencialidade dos dados e lógica de negócio do cliente é sempre respeitada.",
    },
    {
      q: "Você faz projetos para hardware físico (Arduino/ESP32)?",
      a: "Sim. Faço projetos de sistemas embarcados incluindo prototipagem, desenvolvimento de firmware e integração com backend web. O hardware é responsabilidade do cliente, mas posso indicar componentes.",
    },
    {
      q: "Como é feita a comunicação durante o projeto?",
      a: "Uso WhatsApp ou Telegram para comunicação rápida e GitHub Issues para rastreamento de tarefas. Reuniões semanais por vídeo para atualização de status. Você sempre sabe exatamente onde o projeto está.",
    },
    {
      q: "Onde o projeto é hospedado?",
      a: "Configuro hospedagem em plataformas como Railway, Render, VPS (DigitalOcean, Hetzner) ou AWS/GCP conforme seu orçamento e necessidade. Entrego documentação completa de infraestrutura.",
    },
    {
      q: "Você consegue trabalhar com código existente (projetos legados)?",
      a: "Sim. Trabalho com manutenção e evolução de sistemas existentes. Faço uma análise técnica inicial para entender o estado do código e alinhar expectativas.",
    },
  ],

  /* ──────────────────────────────────────────
     PACOTES / PLANOS
  ────────────────────────────────────────── */
  plans: [
    {
      name:     "Starter",
      price:    "R$ [VALOR]",
      period:   "projeto",
      popular:  false,
      color:    "#00f5ff",
      includes: [
        { item: "API com até 10 endpoints",    yes: true  },
        { item: "Autenticação JWT",            yes: true  },
        { item: "Banco de dados MySQL",        yes: true  },
        { item: "Documentação Swagger",        yes: true  },
        { item: "Testes automatizados",        yes: false },
        { item: "CI/CD configurado",           yes: false },
        { item: "Suporte 30 dias",             yes: true  },
      ],
    },
    {
      name:     "Pro",
      price:    "R$ [VALOR]",
      period:   "projeto",
      popular:  true,
      color:    "#b44fff",
      includes: [
        { item: "API com endpoints ilimitados", yes: true },
        { item: "Autenticação JWT + OAuth",     yes: true },
        { item: "MySQL + Redis (cache)",         yes: true },
        { item: "Documentação Swagger",          yes: true },
        { item: "Testes automatizados",          yes: true },
        { item: "CI/CD configurado",             yes: true },
        { item: "Suporte 30 dias",               yes: true },
      ],
    },
    {
      name:     "Premium",
      price:    "R$ [VALOR]",
      period:   "projeto",
      popular:  false,
      color:    "#ffd700",
      includes: [
        { item: "Tudo do plano Pro",             yes: true },
        { item: "Arquitetura escalável (microserviços)", yes: true },
        { item: "Monitoramento e alertas",       yes: true },
        { item: "Deploy em cloud configurado",   yes: true },
        { item: "Treinamento da equipe",         yes: true },
        { item: "Suporte 90 dias",               yes: true },
      ],
    },
  ],

};

/* Exporta para uso global */
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
