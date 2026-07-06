# ✦ ARQON — THE VAULT ✦

## Roteiro de Apresentação

> **"A ARQON não é uma loja. É um cofre. Cada peça é um artefato. Cada aluguel é uma experiência."**

---

## Contexto do Projeto

A ARQON — THE VAULT é uma plataforma web completa de locação de roupas e artefatos de luxo sustentáveis. O conceito central é tratar cada peça como um artefato exclusivo guardado em um cofre digital, oferecendo ao usuário uma experiência de aluguel sofisticada, segura e fluida. O projeto foi desenvolvido como atividade acadêmica do 2º Termo do 1º Semestre de 2025, em parceria fictícia com a ABC Technology, dentro do desafio de criar soluções de personalização e consumo sob demanda.

---

## Da Ideia ao Site

O projeto nasceu a partir de uma necessidade real: oferecer acesso a peças premium para ocasiões especiais sem a necessidade de compra. Na primeira sprint fizemos todo o planejamento, levantamento de requisitos, cronograma, definimos a identidade visual com a paleta de cores dark luxury e produzimos a prototipagem de alta fidelidade no Figma. Escolhemos o tema aluguel de roupas entre as cinco opções do desafio.

Na segunda sprint começamos a construir as telas com base na prototipagem, criamos o nosso próprio Design System usando CSS Variables para garantir consistência visual, modelamos o banco de dados relacional com mais de trinta tabelas e desenvolvemos os primeiros componentes modulares como header, footer e o carrinho flutuante.

Na terceira e última sprint integramos todo o back-end em PHP oito ponto dois puro com arquitetura MVC, construímos a API RESTful completa, implementamos o sistema de autenticação com JWT, fizemos a integração entre front e back via Fetch API, desenvolvemos o painel administrativo e realizamos o deploy no InfinityFree.

---

## Apresentando o Site

Ao abrir o site a primeira impressão é a home. A landing page foi pensada para transmitir a sensação de luxo desde o primeiro segundo. A hero section traz estatísticas da plataforma como número de artefatos disponíveis e avaliações médias, passando credibilidade imediata. Logo abaixo o marquee animado exibe os nomes das marcas parceiras reais, reforçando o posicionamento premium. O new drop slider mostra os lançamentos mais recentes puxados dinamicamente da API. Descendo a página temos a seção como funciona que explica o passo a passo do processo de locação de forma visual e simples. Em seguida o bento grid de categorias permite navegar por estilos de forma intuitiva. A coleção limitada destaca peças exclusivas, enquanto a área de celebridades mostra influenciadores que usam a plataforma. O site ainda traz uma seção sobre sustentabilidade reforçando o compromisso eco-friendly, a história da marca, um FAQ com as dúvidas mais comuns e um formulário de newsletter para captura de e-mails.

A partir da home o usuário pode navegar para o catálogo geral ou para as páginas dedicadas de masculino e feminino. O catálogo é uma das partes mais robustas do projeto. Ele oferece listagem completa com filtros por categoria, estilo, marca, cor, gênero, status e faixa de preço. A ordenação permite exibir os mais recentes, o menor ou o maior preço. A busca universal procura por produtos, categorias e marcas simultaneamente. A paginação com load more e o lazy loading de imagens garantem performance mesmo com muitos itens. Os filtros são dinâmicos e alimentados por metadados vindos da API, então conforme novas marcas ou categorias são cadastradas elas aparecem automaticamente nos selects.

Clicando em um produto chegamos à página de detalhes. Aqui temos a galeria de imagens com miniaturas interativas. O usuário pode selecionar dinamicamente os tamanhos e cores disponíveis, que vêm diretamente do estoque. O sistema calcula automaticamente o valor da diária e a caução correspondente ao dobro desse valor. As avaliações com média de estrelas e comentários aparecem logo abaixo, e os botões de adicionar ao carrinho e à wishlist ficam em destaque.

O carrinho é persistente no banco de dados. Isso significa que o usuário pode adicionar itens, remover, atualizar quantidades ou limpar tudo, e tudo fica salvo. O checkout calcula automaticamente o subtotal, a caução e o total geral. O usuário pode aplicar cupons de desconto que são validados em tempo real pela API. Na etapa de endereço existe a busca automática por CEP através da integração com a API ViaCEP, preenchendo rua, bairro, cidade e estado. O formulário possui máscara e validação de CPF. Ao finalizar a locação o sistema envia um POST para o endpoint de locações e registra tudo no banco.

O perfil do usuário reúne todas as informações pessoais em um só lugar. É possível editar os dados, fazer upload e corte da foto de perfil usando o Cropper.js, consultar o histórico completo de locações, visualizar a wishlist de favoritos e gerenciar múltiplos endereços de entrega com a opção de definir um padrão. O sistema também exibe métricas pessoais de uso.

A autenticação foi construída com segurança em mente. O login utiliza hash Argon2id, recomendado pelo OWASP. O registro permite upload de avatar com recorte na hora. A validação em tempo real exibe mensagens de erro claras. O rate limiting anti brute-force protege contra tentativas excessivas de login. O JWT utilizado é do tipo stateless com expiração de duas horas e o frontend possui mecanismo automático de refresh token através do auth-fetch.js.

O painel administrativo é onde a plataforma ganha vida por trás das cortinas. O dashboard apresenta métricas em tempo real e gráficos Chart.js mostrando vendas, locações e comportamento de usuários. O administrador pode executar o CRUD completo de produtos incluindo upload de imagens, duplicação de itens e alteração de status. A gestão de estoque permite adicionar itens, mudar status e sincronizar tudo. O gerenciamento de usuários possibilita ativar, inativar e alterar o nível de acesso de cada conta. O gestor também controla marcas e cores, gerencia locações atualizando status manualmente, consulta o audit trail com logs do sistema, visualiza o mapa de logística interativo construído com Leaflet.js, edita o tema dinâmico com oito presets de cores que afetam todo o site instantaneamente e exporta relatórios.

O painel do fornecedor é um acesso restrito ao perfil VENDOR. Ele oferece uma visão simplificada e focada apenas nos produtos cadastrados por aquele fornecedor, permitindo que parceiros gerenciem seu próprio catálogo sem acesso ao restante do sistema.

Além das funcionalidades principais, a plataforma conta com sistemas auxiliares que enriquecem a experiência. O sistema de avaliações permite notas de uma a cinco estrelas com comentário. Os cupons de desconto podem ser percentuais ou fixos. A wishlist verifica se o produto já está nos favoritos do usuário. As notificações in-app alertam sobre eventos importantes. O programa de fidelidade classifica os clientes nos níveis bronze, prata, ouro e platinum conforme o histórico de locações. As coleções e celebridades funcionam como destaques editoriais. Por fim, as toast notifications fornecem feedback global em toda a plataforma e as animações de scroll reveal dão movimento às seções conforme o usuário rola a página.

---

## Evolução Técnica

O projeto evoluiu muito além do escopo inicial proposto na atividade. O que sugeria persistência em arquivos JSON migrou para um banco MySQL com PDO e prepared statements em todas as queries. O que sugeria estilização com Bootstrap virou um Design System CSS próprio baseado em variáveis. A autenticação que seria feita com sessão PHP foi substituída por JWT stateless com refresh token automático. A segurança básica foi substituída por Argon2id, rate limiting, CORS controlado e blacklist de tokens. A arquitetura de scripts soltos deu lugar ao padrão MVC com roteador central. E as páginas estáticas se transformaram em uma experiência SPA-like com componentes modulares carregados dinamicamente via fetch.

---

## Tecnologias Utilizadas

A estrutura do projeto é composta por PHP oito ponto dois no back-end com MySQL oito ponto zero e PDO nativo, JWT em HS256 para autenticação e Argon2id para hash de senhas. No front-end usamos HTML5 semântico, CSS3 com Design System próprio, JavaScript ES6+ com Fetch API e async await, além das bibliotecas Chart.js para gráficos, Leaflet.js para mapas e Cropper.js para recorte de imagens. O servidor roda Apache dois ponto quatro com mod rewrite e o ambiente de desenvolvimento foi o XAMPP. O deploy está hospedado no InfinityFree. O design foi prototipado no Figma, os ícones são do Font Awesome seis ponto quatro e as tipografias vêm do Google Fonts. O versionamento foi feito com Git e GitHub, o código escrito no VS Code e o banco administrado via phpMyAdmin.

---

## Dados de Demonstração

Abaixo seguem os dados prontos para usar durante a apresentação ao vivo.

### Tabela de Logins

| Perfil | E-mail | Senha | Nível de Acesso |
|---|---|---|---|
| Administrador | admin@arqon.com | admin123 | TOTAL_CONTROL |
| Usuário Membro | user@arqon.com | user123 | MEMBER |

### Tabela de Produto Fictício

| Campo | Valor |
|---|---|
| Nome | Vestido de Gala Aurora |
| Descrição | Vestido longo em seda pura com acabamento em renda francesa e cristais Swarovski. Ideal para eventos de gala e casamentos. |
| Categoria | Vestidos |
| Marca | Atelier Luxe |
| Estilo | Black Tie |
| Cor | Preto |
| Gênero | Feminino |
| Tamanhos Disponíveis | P, M, G |
| Valor da Diária | R$ 450,00 |
| Caução | R$ 900,00 |
| Status | Disponível |
| Foto | vestido_aurora.jpg |

### Tabela de Fornecedor Fictício

| Campo | Valor |
|---|---|
| Nome | Atelier Luxe Brasil |
| CNPJ | 12.345.678/0001-90 |
| E-mail | contato@atelierluxe.com.br |
| Telefone | (11) 3456-7890 |
| Endereço | Rua Oscar Freire, 1500, Sala 42 |
| Cidade | São Paulo |
| Estado | SP |
| CEP | 01426-001 |
| Contato Principal | Fernanda Lopes |
| Status | Ativo |
| Data de Cadastro | 2025-03-15 |

---

*Documento gerado para facilitar a apresentação ao vivo da plataforma ARQON — THE VAULT.*
