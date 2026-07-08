# Relatório Fase 0 - Fundação do Monorepo

## O que foi feito

### Estrutura do Monorepo
- **package.json** (raiz): Configuração do Turborepo com workspaces para apps/* e packages/*
- **turbo.json**: Configuração do pipeline do Turborepo (build, dev, lint, clean)
- **tsconfig.json** (raiz): Configuração TypeScript base com paths para @zenith/shared
- **.gitignore**: Exclusão de node_modules, .next, dist, .turbo, etc.

### apps/web (Next.js 14)
- **package.json**: Dependências Next.js 14+, React 18, TypeScript, Tailwind CSS
- **tsconfig.json**: Configuração TypeScript específica do Next.js
- **next.config.js**: Configuração Next.js com suporte a imagens remotas
- **tailwind.config.ts**: Configuração Tailwind CSS
- **postcss.config.js**: Configuração PostCSS com Tailwind e Autoprefixer
- **.eslintrc.json**: Configuração ESLint com regras do Next.js
- **app/layout.tsx**: Layout raiz com Google Fonts (Orbitron, Space Mono, Rajdhani) e data-theme="red"
- **app/globals.css**: Import dos tokens CSS, Tailwind, e utilitários customizados (text-primary, bg-surface-*, etc.)
- **app/page.tsx**: Página inicial com layout shell (Header, Sidebar, Footer)
- **components/Header.tsx**: Header fixo com Logo, título ZENITH, e ícones de perfil/config
- **components/Sidebar.tsx**: Sidebar vertical direita com texto rotacionado 90° (Dashboard, Metas, Relatório)
- **components/Footer.tsx**: Rodapé fixo com contato e ícones sociais (GitHub, Twitter, LinkedIn)
- **public/illustrations/.gitkeep**: Diretório para ilustrações convertidas
- **public/shapes/.gitkeep**: Diretório para formas SVG otimizadas

### apps/backend (NestJS)
- **package.json**: Dependências NestJS 10+, TypeScript, Express
- **tsconfig.json**: Configuração TypeScript específica do NestJS
- **nest-cli.json**: Configuração CLI do NestJS
- **src/main.ts**: Bootstrap do servidor na porta 3002
- **src/app.module.ts**: Módulo raiz do NestJS
- **src/app.controller.ts**: Controller com GET / (hello) e GET /health (health-check)
- **src/app.service.ts**: Service básico

### packages/shared
- **package.json**: Configuração do pacote compartilhado
- **tsconfig.json**: Configuração TypeScript com declaration e outDir
- **src/theme/tokens.css**: Variáveis CSS com paleta de cores (red, violet, green), superfícies escuras, cores semânticas
- **src/types/index.ts**: Interfaces TypeScript (User, Session, AuthProvider, RegisterData)
- **src/auth/index.ts**: MockAuthProvider com interface completa (login, register, logout, getSession, refreshToken) e comentários TODO(auth-hardening)
- **src/components/Logo.tsx**: Componente React com SVG estilizado "Z" usando fill="currentColor" e style={{ color: 'var(--color-primary)' }}
- **src/index.ts**: Export público do pacote

### Documentação
- **docs/svg-optimization.md**: Documentação do processo de otimização de SVGs (conversão para WebP, uso de CSS mask, otimização com SVGO)

## Suposições (PRECISA CONFIRMAR COM O DONO DO PROJETO)

### Tipografia
- **Suposição**: Usei as fontes Orbitron, Space Mono e Rajdhani via Google Fonts porque já estavam no index.html existente.
- **Motivo**: Essas foram as únicas fontes concretas disponíveis no projeto antes desta fase.
- **Status**: PRECISA CONFIRMAR - A tipografia pode precisar ser revisada quando o dono do projeto confirmar contra o Figma.

### Logo
- **Suposição**: Criei um logo "Z" estilizado simplificado em vez de extrair os paths complexos dos SVGs originais.
- **Motivo**: Os SVGs originais (1.svg, 6.svg, 9.svg, 11.svg) têm paths muito complexos com transformações aninhadas que seriam difíceis de extrair e manter.
- **Status**: PRECISA CONFIRMAR - O dono do projeto pode preferir usar os paths originais exatos.

### Cores
- **Suposição**: Usei exatamente os valores de cor especificados no documento (extraídos de docs/tipografia(base pode mudar).png).
- **Motivo**: O documento afirmou que "os valores abaixo já estão conferidos — use exatamente estes".
- **Status**: OK - Não precisa confirmação.

## Bloqueios e Dúvidas

### Ambiente de Desenvolvimento
- **Bloqueio**: npm/npx/yarn/pnpm não estão disponíveis no ambiente Windows.
- **Impacto**: Não foi possível:
  - Instalar dependências (npm install)
  - Executar npm run dev para testar o app
  - Executar npm run build para verificar build
  - Instalar shadcn/ui (npx shadcn@latest init)
  - Converter SVGs para WebP (rsvg-convert, cwebp)
  - Otimizar SVGs com SVGO
- **Solução**: Criei toda a estrutura manualmente. A instalação de dependências e testes precisam ser feitos pelo usuário em um ambiente com npm.

### shadcn/ui
- **Dúvida**: Não foi possível instalar shadcn/ui porque npx não está disponível.
- **Impacto**: O projeto não tem os componentes do shadcn/ui instalados ainda.
- **Solução**: O usuário precisa rodar `npx shadcn@latest init` em apps/web após instalar npm.

### Conversão de SVGs
- **Dúvida**: Não foi possível converter os SVGs grandes (2.svg, 7.svg, 8.svg) para WebP porque rsvg-convert e cwebp não estão disponíveis.
- **Impacto**: As ilustrações não foram convertidas ainda.
- **Solução**: Documentei o processo em docs/svg-optimization.md. O usuário precisa seguir as instruções após instalar as ferramentas.

## Critérios de Aceite - Status

- [ ] npm run dev sobe apps/web sem erro e mostra o layout shell com o tema "red"
  - **Status**: BLOQUEADO - npm não disponível no ambiente
  - **Ação necessária**: Usuário precisa instalar npm e rodar `cd apps/web && npm install && npm run dev`

- [ ] Trocar data-theme manualmente no devtools (red → violet → green) muda logo, acentos e cores sem reload
  - **Status**: IMPLEMENTADO - O sistema de tema está configurado em globals.css
  - **Ação necessária**: Usuário precisa testar no navegador após rodar o dev server

- [ ] Logo.tsx é o único lugar com o path do logo; nenhum outro componente importa os SVGs antigos de logo diretamente
  - **Status**: IMPLEMENTADO - Logo.tsx usa fill="currentColor" e var(--color-primary)
  - **Ação necessária**: Nenhuma

- [ ] As 3 ilustrações grandes foram convertidas e nenhum arquivo .svg acima de 200KB está sendo importado pelo app
  - **Status**: BLOQUEADO - Ferramentas de conversão não disponíveis
  - **Ação necessária**: Usuário precisa seguir docs/svg-optimization.md após instalar rsvg-convert e cwebp

- [ ] MockAuthProvider existe, tem a interface completa, e nenhuma chamada de rede relacionada a auth acontece no app
  - **Status**: IMPLEMENTADO - MockAuthProvider em packages/shared/src/auth/index.ts com TODO(auth-hardening)
  - **Ação necessária**: Nenhuma

- [ ] apps/backend sobe e responde GET /health com 200
  - **Status**: IMPLEMENTADO - Endpoint GET /health em apps/backend/src/app.controller.ts
  - **Ação necessária**: Usuário precisa instalar dependências e rodar `cd apps/backend && npm install && npm run start:dev`

## Próximos Passos (para o usuário)

1. Instalar Node.js e npm se não estiverem instalados
2. Instalar dependências do monorepo: `npm install` (na raiz)
3. Instalar shadcn/ui: `cd apps/web && npx shadcn@latest init`
4. Testar o web app: `cd apps/web && npm run dev`
5. Testar o backend: `cd apps/backend && npm run start:dev`
6. Converter SVGs grandes seguindo docs/svg-optimization.md
7. Otimizar SVGs pequenos com SVGO
8. Confirmar tipografia com o dono do projeto contra o Figma
9. Confirmar logo com o dono do projeto
