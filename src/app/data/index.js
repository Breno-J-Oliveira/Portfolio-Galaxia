/* Conteúdo do portfólio. Revisado em 26/10/2026 com o perfil e os repositórios. */
(function () {
  "use strict";
  window.PORTFOLIO_DATA = {
  "updatedAt": "2026-10-26",
  "owner": {
    "name": "Breno J. Oliveira",
    "nameShort": "B.J.O",
    "role": "Desenvolvedor Full Stack",
    "tagline": "Aplicações web do banco de dados à interface.",
    "bio": "Sou desenvolvedor Full Stack e estudante de Desenvolvimento de Sistemas no SENAI, em Santo André. Trabalho com React, Next.js, Node.js, NestJS, TypeScript e bancos SQL para transformar ideias em aplicações completas.",
    "bioLong": "Meu principal projeto atual é o Nexly, TCC desenvolvido com a NexusTech. Também construo o ZENITH e o NexusAuth, estudo algoritmos em Python e levo para o desenvolvimento a experiência de organização de equipe na Axtron.IO. Busco minha primeira oportunidade profissional em desenvolvimento para aprender com um time e contribuir com projetos reais.",
    "location": "Santo André, SP · Brasil",
    "email": "breno.emailsenai@gmail.com",
    "instagram": "@brenoov",
    "github": "https://github.com/Breno-J-Oliveira",
    "photo": "assets/fotos/breno.png",
    "cv": "",
    "cvAvailable": false
  },
  "social": [
    {
      "name": "GitHub",
      "url": "https://github.com/Breno-J-Oliveira"
    },
    {
      "name": "LinkedIn",
      "url": "https://www.linkedin.com/in/brenojoliveira/"
    },
    {
      "name": "Instagram",
      "url": "https://www.instagram.com/brenoov/"
    }
  ],
  "stats": [
    {
      "value": 4,
      "suffix": "",
      "label": "Projetos em destaque"
    },
    {
      "value": 2026,
      "suffix": "",
      "label": "Conclusão prevista · SENAI"
    },
    {
      "value": 1,
      "suffix": "",
      "label": "TCC em equipe"
    }
  ],
  "skills": {
    "frontend": [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML & CSS",
      "Tailwind CSS"
    ],
    "backend": [
      "Node.js",
      "NestJS",
      "Express",
      "PHP",
      "APIs REST"
    ],
    "database": [
      "PostgreSQL",
      "MySQL",
      "Prisma",
      "Redis",
      "SQLite"
    ],
    "devops": [
      "Git & GitHub",
      "Docker",
      "GitHub Actions",
      "Turborepo"
    ],
    "security": [
      "JWT / RS256",
      "JWKS",
      "Argon2id",
      "RBAC",
      "Gestão de sessões"
    ],
    "languages": [
      "Python · algoritmos",
      "Jest",
      "Vitest",
      "Playwright",
      "Scrum"
    ]
  },
  "skillCategories": {
    "frontend": "Frontend",
    "backend": "Backend",
    "database": "Dados",
    "devops": "Ferramentas & entrega",
    "security": "Autenticação & acesso",
    "languages": "Testes & fundamentos"
  },
  "tools": [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "PHP",
    "Python",
    "PostgreSQL",
    "MySQL",
    "Prisma",
    "Redis",
    "Docker",
    "Git",
    "GitHub Actions",
    "Turborepo",
    "Jest",
    "Vitest",
    "Playwright"
  ],
  "contact": {
    "formspreeId": "",
    "emailDirect": "breno.emailsenai@gmail.com"
  },
  "projects": [
    {
      "id": "nexly",
      "title": "NEXLY",
      "category": "fullstack",
      "categoryLabel": "Full Stack · TCC / NexusTech",
      "color": "c1",
      "featured": true,
      "status": "Em desenvolvimento · Sprint 2",
      "cover": "assets/projetos/nexly/dashboard-demo.webp",
      "gallery": [
        "assets/projetos/nexly/dashboard-demo.webp",
        "assets/projetos/nexly/agenda-demo.webp",
        "assets/projetos/nexly/estoque-demo.webp",
        "assets/projetos/nexly/pdv-demo.webp"
      ],
      "mediaNote": "Interfaces demonstrativas do produto, com dados fictícios.",
      "desc": "Agenda, estoque e PDV no mesmo SaaS para pequenos negócios. Meu TCC no SENAI, desenvolvido com a NexusTech.",
      "longDesc": "PROBLEMA\nPequenos negócios precisam conectar os atendimentos ao consumo de produtos e às vendas.\n\nSOLUÇÃO\nUma aplicação multiempresa com agenda, clientes, serviços, estoque, PDV e relatórios. A relação entre serviços e insumos conecta o atendimento às movimentações de estoque.\n\nMINHA PARTICIPAÇÃO\nDesenvolvimento Full Stack e atuação como Product Owner na equipe acadêmica NexusTech.\n\nMOMENTO ATUAL\nEm desenvolvimento. A entrega da Sprint 2, registrada em 23/10/2026, documenta integração frontend/backend, persistência com Prisma/PostgreSQL, operações CRUD e testes iniciais. A evolução e as evidências estão no repositório.",
      "tags": [
        "Next.js",
        "React",
        "TypeScript",
        "NestJS",
        "Prisma",
        "PostgreSQL",
        "Redis",
        "Docker"
      ],
      "github": "https://github.com/Breno-J-Oliveira/Nexly",
      "docs": "https://github.com/Breno-J-Oliveira/Nexly#readme",
      "demo": "",
      "live": false
    },
    {
      "id": "arqon",
      "title": "ARQON — THE VAULT",
      "category": "fullstack",
      "categoryLabel": "Full Stack · Projeto acadêmico",
      "color": "c3",
      "featured": true,
      "status": "Projeto acadêmico",
      "cover": "assets/projetos/arqon/home.png",
      "gallery": [
        "assets/projetos/arqon/home.png",
        "assets/projetos/arqon/catalogo.png",
        "assets/projetos/arqon/produto.png"
      ],
      "mediaNote": "Capturas da interface do projeto acadêmico.",
      "desc": "Plataforma de locação de roupas e artefatos de luxo, com catálogo, autenticação e painel administrativo em PHP e MySQL.",
      "longDesc": "PROBLEMA\nOrganizar catálogo, usuários e operações de uma plataforma de locação em uma única aplicação.\n\nSOLUÇÃO\nAplicação web com PHP em arquitetura MVC, banco MySQL e API REST. Catálogo e painel administrativo fazem parte do mesmo fluxo.\n\nAPRENDIZADOS\nDesenvolvimento em equipe, organização de rotas e responsabilidades, autenticação e modelagem relacional. O projeto foi um marco na minha evolução de páginas isoladas para sistemas completos.\n\nCONTEXTO\nProjeto acadêmico da minha formação no SENAI. Código e documentação disponíveis no GitHub.",
      "tags": [
        "PHP",
        "MySQL",
        "MVC",
        "JavaScript",
        "JWT",
        "API REST"
      ],
      "github": "https://github.com/Breno-J-Oliveira/PROJETO-ARQUON",
      "docs": "https://github.com/Breno-J-Oliveira/PROJETO-ARQUON#readme",
      "demo": "",
      "live": false
    },
    {
      "id": "zenith",
      "title": "ZENITH",
      "category": "fullstack",
      "categoryLabel": "Full Stack · Projeto pessoal",
      "color": "c2",
      "featured": true,
      "status": "Em evolução",
      "cover": "assets/projetos/zenith.svg",
      "gallery": [
        "assets/projetos/zenith.svg"
      ],
      "mediaNote": "Diagrama ilustrativo das plataformas do projeto.",
      "desc": "Organização pessoal com tarefas, metas, calendário e recursos de IA. Um monorepo que explora web, desktop e mobile.",
      "longDesc": "PROBLEMA\nReunir tarefas, metas, rotinas e compromissos sem espalhar a organização por várias ferramentas.\n\nSOLUÇÃO\nAplicação de produtividade com páginas e blocos, calendário e chat com IA. O monorepo reúne as frentes web, desktop e mobile.\n\nMINHA PARTICIPAÇÃO\nProjeto pessoal: desenvolvimento e estudo de integração entre Next.js, NestJS, Prisma e NexusAuth, com exploração de Tauri e Expo.\n\nMOMENTO ATUAL\nEm evolução. Recursos de IA podem usar um provedor simulado conforme a configuração. A documentação descreve a arquitetura e o que está disponível em cada plataforma.",
      "tags": [
        "Next.js",
        "TypeScript",
        "NestJS",
        "Prisma",
        "Tauri",
        "Expo",
        "Turborepo"
      ],
      "github": "https://github.com/Breno-J-Oliveira/Zenith",
      "docs": "https://github.com/Breno-J-Oliveira/Zenith#readme",
      "demo": "",
      "live": false
    },
    {
      "id": "nexusauth",
      "title": "NEXUSAUTH",
      "category": "backend",
      "categoryLabel": "Backend · Autenticação",
      "color": "c4",
      "featured": true,
      "status": "Projeto pessoal",
      "cover": "assets/projetos/nexusauth.png",
      "gallery": [
        "assets/projetos/nexusauth.png"
      ],
      "mediaNote": "Identidade visual do microsserviço.",
      "desc": "Microsserviço de autenticação centralizada com NestJS, JWT RS256, JWKS, autorização por papéis e integração entre aplicações.",
      "longDesc": "PROBLEMA\nEvitar recriar a autenticação a cada aplicação e concentrar o gerenciamento de acesso em um serviço.\n\nSOLUÇÃO\nAPI independente em NestJS e TypeScript, com PostgreSQL, Redis e Prisma. O projeto trabalha autenticação por JWT RS256, publicação de chaves via JWKS e autorização por papéis.\n\nMINHA PARTICIPAÇÃO\nProjeto pessoal dedicado ao estudo e à implementação de autenticação, sessões, integração de serviços e testes.\n\nEVIDÊNCIAS\nO repositório reúne implementação, configuração local e documentação dos fluxos. É um projeto de portfólio em evolução, sem alegação de certificação ou auditoria externa.",
      "tags": [
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "Redis",
        "JWT RS256",
        "JWKS",
        "Docker",
        "Jest"
      ],
      "github": "https://github.com/Breno-J-Oliveira/NexusAuth",
      "docs": "https://github.com/Breno-J-Oliveira/NexusAuth#readme",
      "demo": "",
      "live": false
    },
    {
      "id": "estudos-python",
      "title": "ALGORITMOS EM PYTHON",
      "category": "backend",
      "categoryLabel": "Estudos · Algoritmos",
      "color": "c6",
      "featured": false,
      "status": "Estudo contínuo",
      "cover": "",
      "gallery": [],
      "desc": "Exercícios de busca, estruturas de dados e aplicações práticas a partir de Entendendo Algoritmos.",
      "longDesc": "ESTUDO CONTÍNUO\nExercícios de algoritmos e estruturas de dados em Python. Inclui busca binária e experimentos práticos para entender custo de execução e organização de dados.\n\nO repositório acompanha meu aprendizado e complementa os projetos de aplicações completas.",
      "tags": [
        "Python",
        "Algoritmos",
        "Estruturas de dados"
      ],
      "github": "https://github.com/Breno-J-Oliveira/_estudos-python",
      "docs": "https://github.com/Breno-J-Oliveira/_estudos-python#readme",
      "demo": "",
      "live": false
    },
    {
      "id": "cosmos",
      "title": "PORTFÓLIO GALÁXIA",
      "category": "frontend",
      "categoryLabel": "Frontend · Experiência interativa",
      "color": "c5",
      "featured": false,
      "status": "Em evolução",
      "cover": "",
      "gallery": [],
      "desc": "Este portfólio: navegação por uma galáxia em Canvas 2D, temas por página e JavaScript sem framework.",
      "longDesc": "EXPERIÊNCIA INTERATIVA\nUm portfólio com identidade espacial e navegação por estrelas. Desenvolvido em HTML, CSS e JavaScript, com Canvas 2D, transições e componentes compartilhados.\n\nA organização por funcionalidades preserva o código da galáxia e permite evoluir cada página de forma independente.",
      "tags": [
        "JavaScript",
        "HTML",
        "CSS",
        "Canvas 2D",
        "PWA"
      ],
      "github": "https://github.com/Breno-J-Oliveira/Portfolio-Galaxia",
      "docs": "https://github.com/Breno-J-Oliveira/Portfolio-Galaxia#readme",
      "demo": "index.html",
      "live": false
    }
  ],
  "testimonials": [],
  "timeline": [
    {
      "period": "2026 · Atual",
      "role": "Full Stack & Product Owner",
      "company": "NexusTech · Equipe acadêmica / Nexly",
      "tone": 1,
      "current": true,
      "desc": "Desenvolvimento do TCC do SENAI: um SaaS para conectar agenda, estoque e PDV de pequenos negócios.",
      "achievements": [
        "Organização de requisitos e prioridades com a equipe",
        "Desenvolvimento da interface e integração com a API",
        "Entrega da Sprint 2 documentada em outubro de 2026"
      ],
      "stack": [
        "Next.js",
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "Scrum"
      ]
    },
    {
      "period": "Nov/2025 · Atual",
      "role": "Gerente de equipe",
      "company": "Axtron.IO · Autônomo / remoto",
      "tone": 3,
      "current": true,
      "desc": "Gestão de uma equipe de produção de ativos para publicidade. Experiência em organização de demandas, comunicação e acompanhamento das entregas.",
      "achievements": [
        "Coordenação do trabalho em equipe",
        "Organização de prioridades e acompanhamento de produção"
      ],
      "stack": [
        "Gestão de equipe",
        "Comunicação",
        "Organização"
      ]
    },
    {
      "period": "2025 – 2026",
      "role": "Formação técnica & projetos acadêmicos",
      "company": "SENAI · Desenvolvimento de Sistemas",
      "tone": 2,
      "current": true,
      "desc": "Formação iniciada em janeiro de 2025, com conclusão prevista para dezembro de 2026. Aplicação de desenvolvimento web, banco de dados e trabalho em equipe em projetos como ARQON e Nexly.",
      "achievements": [
        "Construção de aplicações Full Stack",
        "Prática de modelagem de dados e APIs",
        "Colaboração em projetos acadêmicos com Scrum"
      ],
      "stack": [
        "JavaScript",
        "PHP",
        "SQL",
        "Git"
      ]
    }
  ],
  "education": [
    {
      "type": "graduation",
      "title": "Técnico em Desenvolvimento de Sistemas",
      "school": "SENAI · A. Jacob Lafer",
      "year": "Jan/2025 – Dez/2026 · em curso",
      "link": "",
      "description": "Conclusão prevista para dezembro de 2026. Desenvolvimento de sistemas, banco de dados, programação web e projetos integradores em equipe.",
      "photos": []
    },
    {
      "type": "graduation",
      "title": "Ensino Médio",
      "school": "SESI 221",
      "year": "Conclusão prevista em 2026",
      "link": "",
      "description": "Ensino Médio em andamento, em paralelo à formação técnica no SENAI.",
      "photos": []
    }
  ],
  "polyglot": {
    "title": "Idiomas",
    "subtitle": "Comunicação e aprendizado",
    "languages": [
      {
        "code": "pt",
        "flag": "🇧🇷",
        "name": "Português",
        "level": "Nativo",
        "audio": ""
      },
      {
        "code": "en",
        "flag": "🇺🇸",
        "name": "Inglês",
        "level": "Inglês técnico · em desenvolvimento",
        "audio": ""
      }
    ]
  },
  "services": [
    {
      "title": "Sites & interfaces",
      "icon": "◈",
      "description": "Páginas e interfaces responsivas com foco em clareza, navegação e integração.",
      "includes": [
        "HTML, CSS e JavaScript",
        "React e Next.js",
        "Formulários e integração com APIs"
      ]
    },
    {
      "title": "APIs & aplicações",
      "icon": "⌘",
      "description": "Desenvolvimento de aplicações web, serviços e organização de dados.",
      "includes": [
        "Node.js / NestJS ou PHP",
        "PostgreSQL e MySQL",
        "Autenticação e autorização"
      ]
    },
    {
      "title": "Integrações & automações",
      "icon": "↻",
      "description": "Scripts e integrações para reduzir tarefas manuais e conectar ferramentas.",
      "includes": [
        "Python e JavaScript",
        "Consumo de APIs",
        "Rotinas e tratamento de dados"
      ]
    }
  ],
  "faq": [
    {
      "q": "Você busca uma vaga ou projetos freelance?",
      "a": "Meu foco é a primeira oportunidade profissional em desenvolvimento Full Stack. Também posso avaliar projetos freelance com escopo definido."
    },
    {
      "q": "Como começamos um projeto?",
      "a": "Me envie o objetivo, o público e o que precisa ser entregue. A partir disso, alinhamos o escopo, o prazo e uma proposta adequada."
    },
    {
      "q": "Você trabalha em equipe?",
      "a": "Sim. Atuo em projetos acadêmicos com Scrum na NexusTech e gerencio uma equipe de produção na Axtron.IO."
    },
    {
      "q": "Como são definidos valores e prazos?",
      "a": "São combinados após entender os requisitos e as integrações. Mudanças de escopo também precisam de um novo alinhamento."
    },
    {
      "q": "Posso ver seu código?",
      "a": "Sim. Os projetos em destaque têm links específicos para código e documentação na página Projetos."
    }
  ]
};
})();
