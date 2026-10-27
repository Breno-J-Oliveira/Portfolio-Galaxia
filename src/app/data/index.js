/* Conteúdo do portfólio, revisado em 26/10/2026. */
(function () {
  "use strict";
  window.PORTFOLIO_DATA = {
  "updatedAt": "2026-10-26",
  "owner": {
    "name": "Breno J. Oliveira",
    "nameShort": "B.J.O",
    "role": "Desenvolvedor Full Stack",
    "tagline": "Aplicações web do banco de dados à interface.",
    "bio": "Sou de Santo André e estudo Desenvolvimento de Sistemas no SENAI. Nos meus projetos, uso React, Next.js, NestJS e TypeScript.",
    "bioLong": "Hoje desenvolvo o Nexly com a NexusTech para o TCC. Também mantenho projetos pessoais de produtividade e autenticação. Busco minha primeira vaga em desenvolvimento; na Axtron.IO, minha experiência é com gestão de equipe.",
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
      "title": "Nexly",
      "category": "fullstack",
      "categoryLabel": "Full Stack",
      "color": "c1",
      "featured": true,
      "status": "TCC · Em desenvolvimento",
      "cover": "assets/projetos/nexly/dashboard-demo.webp",
      "gallery": [
        "assets/projetos/nexly/dashboard-demo.webp",
        "assets/projetos/nexly/agenda-demo.webp",
        "assets/projetos/nexly/estoque-demo.webp",
        "assets/projetos/nexly/pdv-demo.webp"
      ],
      "mediaNote": "Interfaces demonstrativas do produto, com dados fictícios.",
      "desc": "Agenda, estoque e vendas para pequenos negócios. TCC desenvolvido em equipe na NexusTech.",
      "longDesc": "Desenvolvo o Nexly com a NexusTech como TCC do SENAI. A aplicação reúne agendamentos, clientes, estoque e ponto de venda para pequenos negócios.\n\nAtuo no desenvolvimento Full Stack e na organização das prioridades do produto. O projeto usa Next.js, NestJS e PostgreSQL.\n\nA entrega de outubro de 2026 inclui integração entre interface e API, persistência e operações CRUD. O trabalho continua em desenvolvimento; o repositório reúne o código e a documentação.",
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
      "live": false,
      "galleryLabels": [
        "Painel geral do Nexly com dados de demonstração",
        "Agenda de atendimentos do Nexly com dados de demonstração",
        "Gestão de estoque no Nexly com dados de demonstração",
        "Ponto de venda do Nexly com dados de demonstração"
      ]
    },
    {
      "id": "arqon",
      "title": "ARQON",
      "category": "fullstack",
      "categoryLabel": "Full Stack",
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
      "desc": "Plataforma acadêmica de locação, com catálogo, autenticação e administração em PHP e MySQL.",
      "longDesc": "ARQON foi um dos meus primeiros projetos de uma aplicação completa: uma plataforma de locação de roupas e artefatos de luxo.\n\nO trabalho acadêmico usa PHP com arquitetura MVC, MySQL e JavaScript. Reúne catálogo, autenticação e painel administrativo.\n\nFoi nesse projeto que comecei a entender melhor a importância de organizar requisitos, rotas e responsabilidades antes de aumentar o código. O repositório registra a implementação e sua documentação.",
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
      "live": false,
      "galleryLabels": [
        "Página inicial da plataforma ARQON",
        "Catálogo de roupas e artefatos do ARQON",
        "Página de um produto do ARQON"
      ]
    },
    {
      "id": "zenith",
      "title": "Zenith",
      "category": "fullstack",
      "categoryLabel": "Full Stack",
      "color": "c2",
      "featured": true,
      "status": "Projeto pessoal · Em desenvolvimento",
      "cover": "assets/projetos/zenith.svg",
      "gallery": [
        "assets/projetos/zenith.svg"
      ],
      "mediaNote": "Diagrama ilustrativo das plataformas do projeto.",
      "desc": "Projeto pessoal de organização, com tarefas, calendário e estudo de recursos de IA.",
      "longDesc": "O Zenith é um projeto pessoal de organização: tarefas, metas, rotinas e calendário em um mesmo lugar.\n\nUso o projeto para estudar a integração de Next.js, NestJS, Prisma e NexusAuth. O monorepo também reúne as frentes de desktop e mobile, com Tauri e Expo.\n\nO desenvolvimento está em evolução. Os recursos de IA dependem da configuração do provedor e podem funcionar com uma implementação simulada no ambiente local.",
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
      "title": "NexusAuth",
      "category": "backend",
      "categoryLabel": "Backend",
      "color": "c4",
      "featured": true,
      "status": "Projeto pessoal",
      "cover": "assets/projetos/nexusauth.png",
      "gallery": [
        "assets/projetos/nexusauth.png"
      ],
      "mediaNote": "Identidade visual do microsserviço.",
      "desc": "Serviço de autenticação em NestJS, com JWT, sessões e autorização por papéis.",
      "longDesc": "Desenvolvi o NexusAuth para concentrar autenticação e autorização em um serviço que possa ser usado por outras aplicações.\n\nO projeto usa NestJS, TypeScript, PostgreSQL e Redis. Trabalha com JWT RS256, publicação de chaves por JWKS e controle de acesso por papéis.\n\nÉ também meu espaço de estudo de sessões, integração entre serviços e testes. O repositório explica como executar e integrar a API.",
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
      "title": "Algoritmos em Python",
      "category": "backend",
      "categoryLabel": "Backend",
      "color": "c6",
      "featured": false,
      "status": "Estudo contínuo",
      "cover": "assets/projetos/python.svg",
      "gallery": [
        "assets/projetos/python.svg"
      ],
      "desc": "Exercícios de busca e estruturas de dados que acompanham meus estudos de Python.",
      "longDesc": "Repositório de estudos a partir do livro Entendendo Algoritmos.\n\nReúne exercícios de busca binária, organização de dados e pequenos experimentos em Python. Uso esses exercícios para entender melhor os fundamentos que aparecem nas aplicações.",
      "tags": [
        "Python",
        "Algoritmos",
        "Estruturas de dados"
      ],
      "github": "https://github.com/Breno-J-Oliveira/_estudos-python",
      "docs": "https://github.com/Breno-J-Oliveira/_estudos-python#readme",
      "demo": "",
      "live": false,
      "galleryLabels": [
        "Ilustração de pesquisa binária em uma lista de números ordenados"
      ],
      "mediaNote": "Ilustração de pesquisa binária, um dos temas dos estudos. Não é uma captura de interface."
    },
    {
      "id": "cosmos",
      "title": "Portfólio Galáxia",
      "category": "frontend",
      "categoryLabel": "Frontend",
      "color": "c5",
      "featured": false,
      "status": "Em evolução",
      "cover": "assets/projetos/galaxia.jpg",
      "gallery": [
        "assets/projetos/galaxia.jpg"
      ],
      "desc": "Este site, feito com HTML, CSS, JavaScript e uma galáxia em Canvas 2D.",
      "longDesc": "Este é o código do portfólio que você está visitando.\n\nA Home é a galáxia interativa em Canvas 2D, com estrelas de navegação e um menu direto sempre disponível. O cubo 3D da página Sobre retoma meu portfólio anterior. O site usa HTML, CSS e JavaScript, com componentes compartilhados.\n\nO site também tem uma versão de leitura offline e um resumo profissional para impressão.",
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
      "live": false,
      "galleryLabels": [
        "Galáxia interativa da página inicial deste portfólio"
      ],
      "mediaNote": "Captura da Home deste portfólio, com a galáxia e suas estrelas de navegação."
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
      "description": "Sites e interfaces para apresentar um negócio ou organizar uma tarefa.",
      "includes": [
        "HTML, CSS e JavaScript",
        "React e Next.js",
        "Formulários e integração com APIs"
      ]
    },
    {
      "title": "APIs & aplicações",
      "icon": "⌘",
      "description": "Aplicações web com API, banco de dados e controle de acesso.",
      "includes": [
        "Node.js / NestJS ou PHP",
        "PostgreSQL e MySQL",
        "Autenticação e autorização"
      ]
    },
    {
      "title": "Integrações & automações",
      "icon": "↻",
      "description": "Scripts e integrações entre ferramentas para tarefas que se repetem.",
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
      "a": "Me conte o que precisa ser feito e quem vai usar. Com isso, consigo avaliar o escopo, as integrações e o prazo antes de enviar uma proposta."
    },
    {
      "q": "Você trabalha em equipe?",
      "a": "Sim. Atuo em projetos acadêmicos com Scrum na NexusTech e gerencio uma equipe de produção na Axtron.IO."
    },
    {
      "q": "Como são definidos valores e prazos?",
      "a": "Depois de entender o escopo. Se aparecer uma necessidade nova durante o trabalho, combinamos o impacto antes de continuar."
    },
    {
      "q": "Posso ver seu código?",
      "a": "Sim. Os projetos em destaque têm links específicos para código e documentação na página Projetos."
    }
  ]
};
})();
