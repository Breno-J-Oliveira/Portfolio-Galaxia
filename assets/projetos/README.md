# Fotos e Vídeos dos Projetos

Cada projeto da página `projects.html` tem uma pasta própria aqui dentro.
Basta colocar as imagens com os nomes certos — o site carrega automaticamente.
Se uma imagem não existir, o card mostra um **fallback** (a inicial do projeto), sem quebrar.

## Estrutura de cada pasta

```
assets/projetos/<id-do-projeto>/
├── cover.jpg     ← foto de CAPA do card (obrigatória p/ aparecer no card)
├── 1.jpg         ← galeria do modal (até 6 fotos: 1.jpg ... 6.jpg)
├── 2.jpg
├── 3.jpg
└── demo.mp4      ← vídeo opcional do projeto
```

## IDs das pastas (já configurados no projects.html)

| Pasta                          | Projeto                              |
|--------------------------------|--------------------------------------|
| `estoque/`                     | API de Controle de Estoque           |
| `auth/`                        | Sistema de Autenticação              |
| `dashboard/`                   | Dashboard de Monitoramento           |
| `iot-temp/`                    | Sistema IoT — Controle de Temperatura|
| `rfid/`                        | Controlador de Acesso RFID           |
| `telegram-bot/`                | Bot de Alertas Telegram              |
| `cicd/`                        | Pipeline CI/CD Automatizado          |
| `meteo/`                       | Estação Meteorológica IoT            |
| `cosmos/`                      | Portfólio Cosmos                     |

## Recomendações

- **cover.jpg**: 800×600px (4:3) ou maior. JPG ou PNG.
- **Galeria (1.jpg..6.jpg)**: 1280×720px (16:9) fica perfeito no modal.
- **Vídeo**: MP4 (`demo.mp4`) OU link do YouTube/Vimeo no formato embed
  (ex.: `https://www.youtube.com/embed/SEU_ID`). Configure no array `PROJECTS`
  dentro de `projects.html`, campo `video`.

## Onde editar título, descrição, GitHub e links

Tudo fica no array `PROJECTS`, no `<script>` no final de `projects.html`.
Cada projeto tem: `title`, `desc`, `longDesc`, `tags`, `github`, `demo`, `video`, `gallery`, `cover`.
