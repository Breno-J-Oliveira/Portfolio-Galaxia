
-- BANCO DE DADOS ARQON - VERSÃO PROFISSIONAL 2.0 (MODULAR)
-- Atualização: Adição da coluna foto_url na tabela usuarios e tabela fornecedores
-- NOTA: Execute drop_tables.sql primeiro para limpar tabelas existentes


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- MÓDULO 1: IAM (IDENTIDADE E ACESSOS)

CREATE TABLE IF NOT EXISTS niveis_acesso (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    permissoes_json JSON NOT NULL -- Armazena as flags de permissão
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    foto_url VARCHAR(255) DEFAULT NULL, -- [COLUNA ADICIONADA AQUI]
    cpf VARCHAR(14) UNIQUE,
    id_nivel_acesso INT UNSIGNED NOT NULL,
    status ENUM('ativo', 'inativo', 'bloqueado') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_nivel FOREIGN KEY (id_nivel_acesso) REFERENCES niveis_acesso(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios_enderecos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    titulo VARCHAR(50) DEFAULT 'Casa', -- Casa, Trabalho, Hotel
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    padrao_entrega BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_end_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fornecedores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE,
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    email VARCHAR(150),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    contato_principal VARCHAR(150),
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    id_usuario INT UNSIGNED,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fornecedor_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS api_keys (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chave_hash VARCHAR(255) NOT NULL UNIQUE,
    descricao VARCHAR(100), -- Ex: "Leitor RFID Galpão 01"
    status_ativo BOOLEAN DEFAULT TRUE,
    data_expiracao DATETIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- MÓDULO 2: ATIVOS DE LUXO (CATÁLOGOS E SKUS)

CREATE TABLE IF NOT EXISTS marcas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    logo_url VARCHAR(255),
    comissao_percentual DECIMAL(5,2) DEFAULT 25.00
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE,
    macro_categoria ENUM('Parte Superior', 'Parte Inferior', 'Corpo Inteiro', 'Acessórios', 'Calçados')
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS estilos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE -- Streetwear, Gala, Casual Chic
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    hex_code CHAR(7) NOT NULL -- #000000
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    numero_serie VARCHAR(50),
    id_marca INT UNSIGNED NOT NULL,
    id_categoria INT UNSIGNED NOT NULL,
    id_estilo INT UNSIGNED NOT NULL,
    id_fornecedor INT UNSIGNED,
    genero VARCHAR(20) DEFAULT 'Unissex',
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    descricao_rica TEXT,
    composicao VARCHAR(255),
    cor_principal VARCHAR(50),
    condicao VARCHAR(50) DEFAULT 'Excelente',
    valor_mercado DECIMAL(10,2) NOT NULL,
    valor_diaria DECIMAL(10,2) NOT NULL,
    foto_principal_url LONGTEXT,
    status_venda BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_prod_marca FOREIGN KEY (id_marca) REFERENCES marcas(id),
    CONSTRAINT fk_prod_cat FOREIGN KEY (id_categoria) REFERENCES categorias(id),
    CONSTRAINT fk_prod_estilo FOREIGN KEY (id_estilo) REFERENCES estilos(id),
    CONSTRAINT fk_prod_fornecedor FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS itens_estoque (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- SKU Real
    id_produto INT UNSIGNED NOT NULL,
    id_cor INT UNSIGNED NOT NULL,
    tamanho VARCHAR(10) NOT NULL,
    rfid_nfc_tag VARCHAR(100) UNIQUE NOT NULL,
    status_atual ENUM('Disponível', 'No Vault', 'Alugado', 'Transporte', 'Manutenção', 'Higienização') DEFAULT 'Disponível',
    condicao_fisica VARCHAR(100) DEFAULT 'Perfeita',
    qtd_locacoes INT DEFAULT 0,
    CONSTRAINT fk_item_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_cor FOREIGN KEY (id_cor) REFERENCES cores(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produto_midias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_produto INT UNSIGNED NOT NULL,
    tipo_midia ENUM('imagem', 'video', '3d_model') DEFAULT 'imagem',
    url_midia VARCHAR(255) NOT NULL,
    ordem INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_midia_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
) ENGINE=InnoDB;



-- MÓDULO 3: LOGÍSTICA E ALUGUÉIS

CREATE TABLE IF NOT EXISTS locacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_item_estoque INT UNSIGNED NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    valor_aluguel DECIMAL(10,2) NOT NULL,
    valor_caucao DECIMAL(10,2) NOT NULL,
    status_pedido ENUM('pendente', 'pago', 'enviado', 'entregue', 'devolvido', 'concluido', 'cancelado') DEFAULT 'pendente',
    CONSTRAINT fk_loc_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_loc_item FOREIGN KEY (id_item_estoque) REFERENCES itens_estoque(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS entregas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_locacao INT UNSIGNED NOT NULL,
    codigo_rastreio VARCHAR(100),
    status_gps VARCHAR(100),
    data_postagem DATETIME,
    CONSTRAINT fk_ent_loc FOREIGN KEY (id_locacao) REFERENCES locacoes(id)
) ENGINE=InnoDB;


-- MÓDULO 4: FINANCEIRO (SPLIT E CAUÇÃO)

CREATE TABLE IF NOT EXISTS transacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_locacao INT UNSIGNED NOT NULL,
    gateway_id VARCHAR(100), -- ID da Stripe/Pagarme
    valor_total DECIMAL(10,2) NOT NULL,
    metodo ENUM('cartao', 'pix'),
    status ENUM('sucesso', 'falha', 'estornado'),
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trans_loc FOREIGN KEY (id_locacao) REFERENCES locacoes(id)
) ENGINE=InnoDB;


-- MÓDULO 5: INTELIGÊNCIA E MARKETING

CREATE TABLE IF NOT EXISTS wishlist (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    CONSTRAINT fk_wish_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_wish_prod FOREIGN KEY (id_produto) REFERENCES produtos(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lookbooks_ia (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    produtos_json JSON, -- IDs sugeridos pela IA
    estilo_referencia VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ia_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB;


-- MÓDULO 6: AUDITORIA E SAÚDE

CREATE TABLE IF NOT EXISTS sistema_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED,
    acao VARCHAR(255),
    tabela VARCHAR(50),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- MÓDULO 7: CONFIGURAÇÕES E WEBHOOKS

CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descricao TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS logs_webhooks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    servico_origem VARCHAR(50), -- Stripe, Correios, RFID
    payload_recebido JSON,
    status_processamento VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jwt_blacklist (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_jwt_hash (token_hash),
    INDEX idx_jwt_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ══════════════════════════════════════════════
-- TABELAS FALTANDO (ADICIONAR AO BANCO_ARQUON.SQL)
-- ══════════════════════════════════════════════

-- Carrinho temporário
CREATE TABLE IF NOT EXISTS carrinho_temp (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    quantidade INT DEFAULT 1,
    tamanho VARCHAR(10),
    data_inicio DATE,
    data_fim DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Avaliações de produtos
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_produto INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    nota TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    nota_qualidade TINYINT CHECK (nota_qualidade BETWEEN 1 AND 5),
    nota_tamanho TINYINT CHECK (nota_tamanho BETWEEN 1 AND 5),
    nota_custo_beneficio TINYINT CHECK (nota_custo_beneficio BETWEEN 1 AND 5),
    comentario TEXT,
    foto_url VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_avaliacao (id_produto, id_usuario),
    CONSTRAINT fk_av_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
    CONSTRAINT fk_av_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- Cupons de desconto
CREATE TABLE IF NOT EXISTS cupons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    tipo ENUM('percentual','fixo') NOT NULL DEFAULT 'percentual',
    valor DECIMAL(10,2) NOT NULL,
    usos_maximos INT UNSIGNED DEFAULT 100,
    usos_atuais INT UNSIGNED DEFAULT 0,
    id_produto INT UNSIGNED DEFAULT NULL,
    id_usuario INT UNSIGNED DEFAULT NULL,
    validade DATE,
    valor_minimo DECIMAL(10,2),
    status_ativo BOOLEAN DEFAULT TRUE,
    descricao VARCHAR(200),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cupom_prod FOREIGN KEY (id_produto) REFERENCES produtos(id),
    CONSTRAINT fk_cupom_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- Tema dinâmico
CREATE TABLE IF NOT EXISTS configuracoes_tema (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor VARCHAR(255) NOT NULL,
    tipo ENUM('color','font','size','other') DEFAULT 'color',
    descricao VARCHAR(200),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Dados padrão do tema (paleta canônica: primary=vinho, secondary=dourado)
INSERT IGNORE INTO configuracoes_tema (chave, valor, tipo, descricao) VALUES
('color-primary', '#641838', 'color', 'Cor primária (vinho)'),
('color-primary-light', '#781D43', 'color', 'Vinho claro'),
('color-primary-dark', '#50132D', 'color', 'Vinho escuro'),
('color-secondary', '#E7B93F', 'color', 'Cor de destaque (dourado)'),
('color-secondary-light', '#FFDE4C', 'color', 'Dourado claro'),
('color-secondary-dark', '#B99432', 'color', 'Dourado escuro'),
('color-tertiary', '#A0A0A0', 'color', 'Cinza'),
('color-tertiary-light', '#C0C0C0', 'color', 'Cinza claro'),
('color-tertiary-dark', '#808080', 'color', 'Cinza escuro'),
('color-dark', '#0C0716', 'color', 'Fundo principal'),
('color-dark-dark', '#0A0612', 'color', 'Fundo mais escuro'),
('color-dark-light', '#0E081A', 'color', 'Fundo claro'),
('color-light', '#FFFFFF', 'color', 'Texto claro'),
('color-light-dark', '#DCDCDC', 'color', 'Texto suave'),
('color-text', '#DEDDDF', 'color', 'Cor do texto'),
('color-bg', '#0C0716', 'color', 'Cor de fundo'),
('color-gold', '#E7B93F', 'color', 'Cor âncora (dourado)'),
('color-void', '#0A0612', 'color', 'Fundo máximo'),
('color-accent', '#10b981', 'color', 'Destaque alternativo'),
('color-error', '#ff5268', 'color', 'Cor de erro'),
('color-success', '#4CAF50', 'color', 'Sucesso'),
('color-danger', '#F44336', 'color', 'Perigo'),
('arqon-logo-color', '#DEDDDF', 'color', 'Cor da logo SVG'),
('font-primary', 'Cinzel, serif', 'font', 'Fonte primária'),
('font-secondary', 'Inter, sans-serif', 'font', 'Fonte secundária'),
('font-code', 'Fira Code, monospace', 'font', 'Fonte de código'),
('border-radius', '8px', 'size', 'Border radius padrão'),
('border-radius-large', '16px', 'size', 'Border radius grande'),
('spacing-unit', '8px', 'size', 'Unidade de espaçamento'),
('transition-speed', '0.3s', 'size', 'Velocidade de transição');

-- Recuperação de senha
CREATE TABLE IF NOT EXISTS password_resets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_email (email)
) ENGINE=InnoDB;

-- Log de tentativas de login
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150),
    ip_address VARCHAR(45),
    sucesso BOOLEAN DEFAULT FALSE,
    tentado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_la_email (email),
    INDEX idx_la_ip (ip_address)
) ENGINE=InnoDB;

-- Programa de fidelidade
CREATE TABLE IF NOT EXISTS fidelidade (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL UNIQUE,
    nivel ENUM('bronze','prata','ouro','platinum') DEFAULT 'bronze',
    pontos_totais INT UNSIGNED DEFAULT 0,
    total_alugueis INT UNSIGNED DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fid_user FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- Notificações in-app
CREATE TABLE IF NOT EXISTS notificacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT,
    tipo ENUM('info','sucesso','aviso','erro') DEFAULT 'info',
    lida BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_not_user (id_usuario),
    INDEX idx_not_lida (lida)
) ENGINE=InnoDB;

-- Contatos recebidos
CREATE TABLE IF NOT EXISTS contatos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    assunto VARCHAR(200),
    mensagem TEXT NOT NULL,
    lido BOOLEAN DEFAULT FALSE,
    respondido BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Celebrities para o sistema de destaque
CREATE TABLE IF NOT EXISTS celebridades (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    foto_url VARCHAR(255) NOT NULL,
    descricao TEXT,
    instagram_url VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    ordem INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Produtos associados a celebridades
CREATE TABLE IF NOT EXISTS celebridade_produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_celebridade INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    CONSTRAINT fk_cp_celeb FOREIGN KEY (id_celebridade) REFERENCES celebridades(id) ON DELETE CASCADE,
    CONSTRAINT fk_cp_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Coleções para o sistema de destaque
CREATE TABLE IF NOT EXISTS colecoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    foto_url VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    ordem INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Produtos associados a coleções
CREATE TABLE IF NOT EXISTS colecao_produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_colecao INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    CONSTRAINT fk_colp_colecao FOREIGN KEY (id_colecao) REFERENCES colecoes(id) ON DELETE CASCADE,
    CONSTRAINT fk_colp_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;