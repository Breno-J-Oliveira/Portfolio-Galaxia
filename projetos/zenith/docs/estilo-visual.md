# Estilo Visual do Zenith — Anotação de Referência

## Paleta
- **Fundo**: Quase preto (#030303)
- **Superfícies**: #0B0B0D (cards, header, sidebar, footer), #282C33 (bordas/divisores)
- **Primária (red padrão)**: #FF2B51 (botões, acentos, logo)
- **Texto**: Branco (#FFFFFF) principal, #8899AA para texto secundário/dim

## Tipografia
- **Headings/Título**: Orbitron (futurística, geométrica)
- **Labels/Mono**: Space Mono (monoespaçada, números, labels técnicos)
- **Corpo**: Rajdhani (condensada, legível, UI geral)

## Layout Shell (presente em todas as telas)
- **Header fixo** (topo, h-16): Logo Z + "ZENITH" à esquerda, ícones de config/perfil à direita
- **Sidebar direita fixa** (w-16): Texto rotacionado 90° (Dashboard, Metas, Relatório)
- **Footer fixo** (base, h-12): Email de contato à esquerda, ícones sociais à direita
- **Conteúdo**: Área central com padding-top 16, padding-right 16, padding-bottom 12

## Print 1 — Tela de Login/Cadastro
- Fundo escuro puro
- Logo ZENITH centralizada ou no topo
- Botões "Create account" / "Sign in" em --color-primary (vermelho)
- Layout minimalista, centralizado
- Inputs com fundo surface-1, bordas sutis
- Sidebar e footer presentes

## Print 2 — Dashboard
- Avatar circular no topo (placeholder)
- Card "Your specifications" com dados mockados:
  - Nível
  - Metas ativas
  - Progresso semanal
- Gráfico de barras simples (semana)
- Métricas em Space Mono (números/labels)
- Títulos em Orbitron
- Mesmo shell (header, sidebar direita, footer)

## Print 3 — Configurações
- Seletor de tema (dropdown: red / violet / green)
- Formulário de perfil:
  - Nome
  - Email
  - Horário
- Botão salvar em --color-primary
- Mesmo shell
- Layout em cards surface-1

## Princípios Gerais
- Tudo usa CSS variables (var(--color-primary), etc) — nunca hex fixo
- Tema troca instantaneamente via data-theme no <html>
- Estilo dark, neon, futurístico
- Bordas sutis (var(--color-surface-2))
- Transições suaves nos hovers
