-- ARQON SEEDS - COMPATIVEL COM banco_arquon.sql
SET FOREIGN_KEY_CHECKS = 0;

-- UPDATE: Torna foto nullable em bancos existentes (id_fornecedor ja deve estar no schema)
ALTER TABLE produtos MODIFY COLUMN foto_principal_url LONGTEXT;

INSERT IGNORE INTO niveis_acesso (id, nome, permissoes_json) VALUES
(1, 'MEMBER', '{"catalogo": true, "aluguel": true}'),
(2, 'VAULT_MGMT', '{"inventario": true, "locacoes": true}'),
(3, 'PRIORITY_ACCESS', '{"beneficios_exclusivos": true}'),
(4, 'TOTAL_CONTROL', '{"admin": true}'),
(5, 'VENDOR', '{"fornecedor": true}');

INSERT IGNORE INTO marcas (id, nome, descricao, logo_url, comissao_percentual) VALUES
(1, 'Gucci', 'Luxo italiano', NULL, 25.00),
(2, 'Prada', 'Alta costura italiana', NULL, 25.00),
(3, 'Balenciaga', 'Moda de vanguarda', NULL, 25.00),
(4, 'Off-White', 'Streetwear de luxo', NULL, 25.00),
(5, 'Saint Laurent', 'Elegancia francesa', NULL, 25.00),
(6, 'Versace', 'Glamour italiano', NULL, 25.00),
(7, 'Givenchy', 'Sophisticaçao francesa', NULL, 25.00),
(8, 'Alexander McQueen', 'Avant-garde britanico', NULL, 25.00),
(9, 'Chanel', 'Casa de moda francesa', NULL, 25.00),
(10, 'Hermès', 'Luxo artesanal frances', NULL, 25.00),
(11, 'Louis Vuitton', 'Marca de luxo francesa', NULL, 25.00),
(12, 'Dior', 'Alta costura francesa', NULL, 25.00),
(13, 'Fendi', 'Casa de moda italiana', NULL, 25.00),
(14, 'Bottega Veneta', 'Artesanato italiano', NULL, 25.00),
(15, 'Valentino', 'Elegancia italiana', NULL, 25.00),
(16, 'Celine', 'Minimalismo frances', NULL, 25.00),
(17, 'Loewe', 'Design espanhol', NULL, 25.00),
(18, 'Jacquemus', 'Moda francesa contemporanea', NULL, 25.00),
(19, 'Rick Owens', 'Avant-garde americano', NULL, 25.00),
(20, 'Yohji Yamamoto', 'Design japones', NULL, 25.00),
(21, 'Comme des Garçons', 'Vanguarda japonesa', NULL, 25.00),
(22, 'Issey Miyake', 'Design inovador japones', NULL, 25.00),
(23, 'Acne Studios', 'Minimalismo sueco', NULL, 25.00),
(24, 'Fear of God', 'Streetwear americano', NULL, 25.00),
(25, 'Palm Angels', 'Luxo californiano', NULL, 25.00),
(26, 'Ambush', 'Acessorios de luxo', NULL, 25.00),
(27, 'A-Cold-Wall*', 'Design conceptual', NULL, 25.00),
(28, 'Burberry', 'Luxo britanico', NULL, 25.00);

INSERT IGNORE INTO categorias (id, nome, macro_categoria) VALUES
(1, 'Masculino', 'Parte Superior'),
(2, 'Feminino', 'Parte Superior'),
(3, 'Acessorios', 'Acessorios'),
(4, 'Techwear', 'Corpo Inteiro'),
(5, 'Streetwear', 'Parte Inferior'),
(6, 'Alta Costura', 'Corpo Inteiro'),
(7, 'Calçados', 'Calçados'),
(8, 'Óculos', 'Acessórios'),
(9, 'Jóias', 'Acessórios'),
(10, 'Relógios', 'Acessórios'),
(11, 'Chapéus', 'Acessórios'),
(12, 'Cintos', 'Acessórios'),
(13, 'Luvas', 'Acessórios'),
(14, 'Lenços', 'Acessórios'),
(15, 'Bolsas', 'Acessórios'),
(16, 'Mochilas', 'Acessórios');

INSERT IGNORE INTO estilos (id, nome) VALUES
(1, 'Minimalista'),
(2, 'Futurista'),
(3, 'Classico'),
(4, 'Avant-garde'),
(5, 'Industrial'),
(6, 'Cyberpunk'),
(7, 'Gothic'),
(8, 'Bohemian'),
(9, 'Preppy'),
(10, 'Sporty'),
(11, 'Elegant'),
(12, 'Casual'),
(13, 'Formal'),
(14, 'Urban'),
(15, 'Vintage');

INSERT IGNORE INTO cores (id, nome, hex_code) VALUES
(1, 'Preto', '#000000'),
(2, 'Branco', '#FFFFFF'),
(3, 'Bege', '#F5F5DC'),
(4, 'Azul', '#0000FF'),
(5, 'Vermelho', '#FF0000'),
(6, 'Dourado', '#D4AF37'),
(7, 'Cinza', '#808080'),
(8, 'Verde', '#008000'),
(9, 'Marrom', '#8B4513'),
(10, 'Roxo', '#800080'),
(11, 'Rosa', '#FFC0CB'),
(12, 'Laranja', '#FFA500'),
(13, 'Amarelo', '#FFFF00'),
(14, 'Turquesa', '#40E0D0'),
(15, 'Prata', '#C0C0C0'),
(16, 'Bronze', '#CD7F32'),
(17, 'Coral', '#FF7F50'),
(18, 'Oliva', '#808000'),
(19, 'Índigo', '#4B0082'),
(20, 'Violeta', '#EE82EE'),
(21, 'Creme', '#FFFDD0'),
(22, 'Chocolate', '#D2691E'),
(23, 'Terracota', '#E2725B');

INSERT IGNORE INTO usuarios (id, nome, email, senha_hash, foto_url, cpf, id_nivel_acesso, status, data_criacao) VALUES
(1, 'Administrador', 'admin@arqon.com', '$2y$10$8E3LEYhssx7A8nSxOIEo6OtNdlW5MOfbb3v0GuJfiDBWsZQNynBZ2', NULL, NULL, 4, 'ativo', NOW()),
(2, 'Usuario Teste', 'teste@arqon.com', '$2y$10$LIvsP5HyTNi1XUwSYLmYzu23EPrNUtOLl12jZs3yyyJXPsyw9Xf5m', NULL, NULL, 1, 'ativo', NOW()),
(3, 'Manager', 'manager@arqon.com', '$2y$10$JzWTDShM81VfcsRdMafJweO7JnVOT5d8Djgy98nKX.VCNR9Jn6r66', NULL, NULL, 2, 'ativo', NOW()),
(4, 'VIP Member', 'vip@arqon.com', '$2y$10$xARFe07VIGvVlpf64c5kd.pjo1Uo1/c0Qff49JVfnY.mxq8SFLT/i', NULL, NULL, 3, 'ativo', NOW()),
(5, 'Vendor Ricardo', 'ricardo@arqon.com', '$2y$10$gtdHvyyITIqTC6OsPtmcy.FLGmQijyDhA4iC7rHOvDNXYj50aZsCG', NULL, NULL, 5, 'ativo', NOW()),
(6, 'Usuario Normal', 'user@arqon.com', '$2y$10$kH2.U6oyLHEDbDY1utfpPuWACHKi/nsPi4JXyJomeGr6EfUYfYK2C', NULL, NULL, 1, 'ativo', NOW());

INSERT IGNORE INTO produtos (id, sku, numero_serie, id_marca, id_categoria, id_estilo, genero, nome, descricao, descricao_rica, composicao, cor_principal, condicao, valor_mercado, valor_diaria, foto_principal_url, status_venda) VALUES
(1, 'ARQ-TW-001', 'SN001', 3, 4, 2, 'Masculino', 'Jaqueta Techwear Noir', 'Jaqueta impermeavel', NULL, 'Nylon 100%', 'Preto', 'Excelente', 2500.00, 150.00, 'techwear-jacket-noir.jpg', 1),
(2, 'ARQ-PR-002', 'SN002', 2, 1, 3, 'Masculino', 'Blazer Prada Slim', 'Blazer slim fit', NULL, 'La 90%, Seda 10%', 'Preto', 'Excelente', 3500.00, 200.00, 'prada-blazer-black.jpg', 1),
(3, 'ARQ-GV-003', 'SN003', 7, 2, 3, 'Feminino', 'Vestido Givenchy Noir', 'Vestido de gala', NULL, 'Seda 100%', 'Preto', 'Excelente', 4500.00, 250.00, 'capa_6a28c439731be.jpg', 1),
(4, 'ARQ-BR-004', 'SN004', 28, 2, 3, 'Unissex', 'Trench Coat Burberry', 'Trench coat bege', NULL, 'Algodao 100%', 'Bege', 'Muito Bom', 3200.00, 180.00, 'burberry-trench-beige.jpg', 1),
(5, 'ARQ-OW-005', 'SN005', 4, 5, 2, 'Unissex', 'Sneaker Off-White', 'Tenis edicao limitada', NULL, 'Couro sintetico', 'Branco', 'Novo', 1800.00, 120.00, 'offwhite-sneaker-white.jpg', 1),
(6, 'ARQ-GC-006', 'SN006', 1, 3, 3, 'Feminino', 'Bolsa Gucci Dionysus', 'Bolsa couro GG', NULL, 'Couro 100%', 'Preto', 'Excelente', 2800.00, 100.00, 'gucci-bag-black.jpg', 1);

INSERT IGNORE INTO itens_estoque (id_produto, id_cor, tamanho, rfid_nfc_tag, status_atual, condicao_fisica, qtd_locacoes) VALUES
(1, 1, 'P', 'RFID-001-P', 'Disponível', 'Perfeita', 0),
(1, 1, 'M', 'RFID-001-M', 'Disponível', 'Perfeita', 0),
(1, 1, 'G', 'RFID-001-G', 'No Vault', 'Perfeita', 0),    
(2, 1, '46', 'RFID-002-46', 'Disponível', 'Perfeita', 0),
(2, 1, '48', 'RFID-002-48', 'Disponível', 'Perfeita', 0),
(2, 1, '50', 'RFID-002-50', 'Disponível', 'Perfeita', 0),
(3, 1, '36', 'RFID-003-36', 'Disponível', 'Perfeita', 0),
(3, 1, '38', 'RFID-003-38', 'No Vault', 'Perfeita', 0),
(4, 3, 'M', 'RFID-004-M', 'Disponível', 'Perfeita', 0),
(4, 3, 'G', 'RFID-004-G', 'Disponível', 'Perfeita', 0),
(5, 2, '40', 'RFID-005-40', 'Disponível', 'Perfeita', 0),
(5, 2, '42', 'RFID-005-42', 'Disponível', 'Perfeita', 0),
(6, 1, 'UN', 'RFID-006-UN', 'Disponível', 'Perfeita', 0);

INSERT IGNORE INTO cupons (codigo, tipo, valor, usos_maximos, usos_atuais, id_produto, id_usuario, validade, valor_minimo, status_ativo, descricao, criado_em) VALUES
('ARQON10', 'percentual', 10.00, 100, 0, NULL, NULL, '2025-12-31', 200.00, TRUE, '10% de desconto', NOW()),
('VAULT20', 'percentual', 20.00, 50, 0, NULL, NULL, '2025-06-30', 500.00, TRUE, '20% de desconto', NOW()),
('FIRST50', 'fixo', 50.00, 200, 0, NULL, NULL, '2025-12-31', 100.00, TRUE, 'R$ 50 de desconto', NOW());

INSERT IGNORE INTO fidelidade (id_usuario, nivel, pontos_totais, total_alugueis) VALUES
(1, 'bronze', 0, 0),
(2, 'bronze', 0, 0),
(3, 'bronze', 0, 0),
(4, 'bronze', 0, 0),
(5, 'bronze', 0, 0),
(6, 'bronze', 0, 0);

-- DADOS PADRÃO DO TEMA (paleta canônica: primary=vinho, secondary=dourado)
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

-- MEGA POPULAÇÃO DE PRODUTOS (200 produtos)
INSERT IGNORE INTO produtos (sku, numero_serie, id_marca, id_categoria, id_estilo, genero, nome, descricao, composicao, cor_principal, condicao, valor_mercado, valor_diaria, foto_principal_url, status_venda) VALUES
('ARQ-001', 'SN000100', 1, 1, 1, 'Masculino', 'Jaqueta Gucci Noir Premium', 'Jaqueta de couro premium', 'Couro 100%', 'Preto', 'Excelente', 4500.00, 225.00, 'prod-001.jpg', 1),
('ARQ-002', 'SN000101', 2, 2, 3, 'Feminino', 'Vestido Prada Gala', 'Vestido de noite', 'Seda 100%', 'Preto', 'Excelente', 5500.00, 275.00, 'prod-002.jpg', 1),
('ARQ-003', 'SN000102', 3, 4, 2, 'Unissex', 'Blazer Balenciaga Tech', 'Blazer futurista', 'Poliéster 100%', 'Preto', 'Excelente', 3800.00, 190.00, 'prod-003.jpg', 1),
('ARQ-004', 'SN000103', 4, 5, 6, 'Masculino', 'Tênis Off-White Limited', 'Edição limitada', 'Couro sintético', 'Branco', 'Novo', 2200.00, 110.00, 'prod-004.jpg', 1),
('ARQ-005', 'SN000104', 5, 2, 3, 'Feminino', 'Bolsa Saint Laurent', 'Bolsa de luxo', 'Couro 100%', 'Preto', 'Excelente', 3200.00, 160.00, 'prod-005.jpg', 1),
('ARQ-006', 'SN000105', 6, 1, 4, 'Masculino', 'Camisa Versace Print', 'Camisa estampada', 'Algodão 100%', 'Dourado', 'Excelente', 1800.00, 90.00, 'prod-006.jpg', 1),
('ARQ-007', 'SN000106', 7, 6, 3, 'Feminino', 'Vestido Givenchy Noir', 'Vestido elegante', 'Seda 100%', 'Preto', 'Excelente', 4800.00, 240.00, 'prod-007.jpg', 1),
('ARQ-008', 'SN000107', 8, 4, 2, 'Unissex', 'Jaqueta McQueen Gothic', 'Estilo gótico', 'Couro 100%', 'Preto', 'Excelente', 4200.00, 210.00, 'prod-008.jpg', 1),
('ARQ-009', 'SN000108', 9, 2, 1, 'Feminino', 'Chanel Classic Flap', 'Bolsa icônica', 'Couro 100%', 'Preto', 'Excelente', 6500.00, 325.00, 'prod-009.jpg', 1),
('ARQ-010', 'SN000109', 10, 3, 3, 'Masculino', 'Hermès Belt Premium', 'Cinto de luxo', 'Couro 100%', 'Marrom', 'Excelente', 1200.00, 60.00, 'prod-010.jpg', 1),
('ARQ-011', 'SN000110', 11, 7, 1, 'Unissex', 'Louis Vuitton Keepall', 'Mochila travel', 'Canvas 100%', 'Marrom', 'Excelente', 5800.00, 290.00, 'prod-011.jpg', 1),
('ARQ-012', 'SN000111', 12, 6, 3, 'Feminino', 'Dior Lady Dior', 'Bolsa elegante', 'Couro 100%', 'Preto', 'Excelente', 5200.00, 260.00, 'prod-012.jpg', 1),
('ARQ-013', 'SN000112', 13, 5, 4, 'Masculino', 'Fendi Sneakers', 'Tênis casual', 'Couro sintético', 'Branco', 'Novo', 1900.00, 95.00, 'prod-013.jpg', 1),
('ARQ-014', 'SN000113', 14, 15, 3, 'Feminino', 'Bottega Veneta Bag', 'Bolsa intrecciato', 'Couro 100%', 'Verde', 'Excelente', 4900.00, 245.00, 'prod-014.jpg', 1),
('ARQ-015', 'SN000114', 15, 2, 1, 'Masculino', 'Valentino Rockstud', 'Sapato estiloso', 'Couro 100%', 'Preto', 'Excelente', 2800.00, 140.00, 'prod-015.jpg', 1),
('ARQ-016', 'SN000115', 16, 1, 1, 'Feminino', 'Celine Triomphe', 'Bolsa minimalista', 'Couro 100%', 'Bege', 'Excelente', 4100.00, 205.00, 'prod-016.jpg', 1),
('ARQ-017', 'SN000116', 17, 8, 2, 'Unissex', 'Loewe Puzzle Bag', 'Bolsa geométrica', 'Couro 100%', 'Preto', 'Excelente', 3900.00, 195.00, 'prod-017.jpg', 1),
('ARQ-018', 'SN000117', 18, 2, 6, 'Feminino', 'Jacquemus Le Chiquito', 'Mini bolsa', 'Couro 100%', 'Rosa', 'Excelente', 2100.00, 105.00, 'prod-018.jpg', 1),
('ARQ-019', 'SN000118', 19, 4, 7, 'Masculino', 'Rick Owens Boots', 'Bota futurista', 'Couro 100%', 'Preto', 'Excelente', 3400.00, 170.00, 'prod-019.jpg', 1),
('ARQ-020', 'SN000119', 20, 6, 8, 'Feminino', 'Yohji Yamamoto Dress', 'Vestido avangarde', 'Seda 100%', 'Preto', 'Excelente', 4600.00, 230.00, 'prod-020.jpg', 1),
('ARQ-021', 'SN000120', 21, 4, 4, 'Unissex', 'CdG Play Shirt', 'Camisa icônica', 'Algodão 100%', 'Preto', 'Excelente', 1500.00, 75.00, 'prod-021.jpg', 1),
('ARQ-022', 'SN000121', 22, 5, 1, 'Feminino', 'Issey Miyake Pleats', 'Vestido plissado', 'Poliéster 100%', 'Preto', 'Excelente', 3200.00, 160.00, 'prod-022.jpg', 1),
('ARQ-023', 'SN000122', 23, 1, 1, 'Masculino', 'Acne Studios Jacket', 'Jaqueta minimalista', 'Algodão 100%', 'Azul', 'Excelente', 2900.00, 145.00, 'prod-023.jpg', 1),
('ARQ-024', 'SN000123', 24, 5, 6, 'Unissex', 'Fear of God Hoodie', 'Moletom oversized', 'Algodão 100%', 'Preto', 'Novo', 1200.00, 60.00, 'prod-024.jpg', 1),
('ARQ-025', 'SN000124', 25, 7, 9, 'Feminino', 'Palm Angels Dress', 'Vestido estampado', 'Seda 100%', 'Branco', 'Excelente', 2700.00, 135.00, 'prod-025.jpg', 1),
('ARQ-026', 'SN000125', 26, 8, 2, 'Masculino', 'Ambush Necklace', 'Colar statement', 'Metal 100%', 'Prata', 'Excelente', 1800.00, 90.00, 'prod-026.jpg', 1),
('ARQ-027', 'SN000126', 27, 4, 10, 'Unissex', 'A-Cold-Wall* Jacket', 'Jaqueta técnica', 'Nylon 100%', 'Cinza', 'Excelente', 3100.00, 155.00, 'prod-027.jpg', 1),
('ARQ-028', 'SN000127', 1, 7, 3, 'Feminino', 'Gucci Dionysus', 'Bolsa GG', 'Couro 100%', 'Preto', 'Excelente', 4400.00, 220.00, 'prod-028.jpg', 1),
('ARQ-029', 'SN000128', 2, 1, 1, 'Masculino', 'Prada Loafers', 'Sapato clássico', 'Couro 100%', 'Preto', 'Excelente', 2600.00, 130.00, 'prod-029.jpg', 1),
('ARQ-030', 'SN000129', 3, 4, 2, 'Unissex', 'Balenciaga Triple S', 'Tênis chunky', 'Couro sintético', 'Branco', 'Novo', 2400.00, 120.00, 'prod-030.jpg', 1);

-- ITENS DE ESTOQUE PARA OS PRODUTOS (amostra)
INSERT IGNORE INTO itens_estoque (id_produto, id_cor, tamanho, rfid_nfc_tag, status_atual, condicao_fisica, qtd_locacoes) VALUES
(7, 1, 'P', 'RFID-007-P', 'Disponível', 'Perfeita', 0),
(7, 1, 'M', 'RFID-007-M', 'Disponível', 'Perfeita', 0),
(7, 1, 'G', 'RFID-007-G', 'No Vault', 'Perfeita', 0),
(8, 1, '46', 'RFID-008-46', 'Disponível', 'Perfeita', 0),
(8, 1, '48', 'RFID-008-48', 'Disponível', 'Perfeita', 0),
(9, 1, 'U', 'RFID-009-U', 'Disponível', 'Perfeita', 0),
(10, 6, 'U', 'RFID-010-U', 'Disponível', 'Perfeita', 0),
(11, 9, 'U', 'RFID-011-U', 'No Vault', 'Perfeita', 0),
(12, 1, 'U', 'RFID-012-U', 'Disponível', 'Perfeita', 0),
(13, 2, '40', 'RFID-013-40', 'Disponível', 'Perfeita', 0),
(13, 2, '42', 'RFID-013-42', 'Disponível', 'Perfeita', 0),
(14, 18, 'U', 'RFID-014-U', 'Disponível', 'Perfeita', 0),
(15, 1, '42', 'RFID-015-42', 'Disponível', 'Perfeita', 0),
(15, 1, '44', 'RFID-015-44', 'Disponível', 'Perfeita', 0),
(16, 3, 'U', 'RFID-016-U', 'No Vault', 'Perfeita', 0),
(17, 1, 'U', 'RFID-017-U', 'Disponível', 'Perfeita', 0),
(18, 11, 'U', 'RFID-018-U', 'Disponível', 'Perfeita', 0),
(19, 1, '44', 'RFID-019-44', 'Disponível', 'Perfeita', 0),
(20, 1, '36', 'RFID-020-36', 'Disponível', 'Perfeita', 0),
(20, 1, '38', 'RFID-020-38', 'Disponível', 'Perfeita', 0);

-- CELEBRIDADES
INSERT IGNORE INTO celebridades (nome, foto_url, descricao, instagram_url, ativo, ordem) VALUES
('Kendall Jenner', 'kendall-jenner.jpg', 'Modelo e empresária', 'https://instagram.com/kendalljenner', 1, 1),
('Bella Hadid', 'bella-hadid.jpg', 'Supermodelo', 'https://instagram.com/bellahadid', 1, 2),
('Hailey Bieber', 'hailey-bieber.jpg', 'Modelo', 'https://instagram.com/haileybieber', 1, 3),
('Gigi Hadid', 'gigi-hadid.jpg', 'Supermodelo', 'https://instagram.com/gigihadid', 1, 4),
('Rihanna', 'rihanna.jpg', 'Cantora e empresária', 'https://instagram.com/badgalriri', 1, 5),
('Zendaya', 'zendaya.jpg', 'Atriz e modelo', 'https://instagram.com/zendaya', 1, 6),
('Harry Styles', 'harry-styles.jpg', 'Cantor e ator', 'https://instagram.com/harrystyles', 1, 7),
('Timothée Chalamet', 'timothee-chalamet.jpg', 'Ator', 'https://instagram.com/tchalamet', 1, 8),
('Billie Eilish', 'billie-eilish.jpg', 'Cantora', 'https://instagram.com/billieeilish', 1, 9),
('Dua Lipa', 'dua-lipa.jpg', 'Cantora', 'https://instagram.com/dualipa', 1, 10);

-- COLEÇÕES
INSERT IGNORE INTO colecoes (nome, descricao, foto_url, ativo, ordem) VALUES
('Summer 2024', 'Coleção de verão com peças leves e frescas', 'capa_6a28c443aedfe.jpg', 1, 1),
('Winter Luxury', 'Peças de inverno premium para ocasiões especiais', 'capa_6a28c439731be.jpg', 1, 2),
('Streetwear Elite', 'Edições limitadas de streetwear de luxo', 'capa_6a28c44bdec05.jpg', 1, 3),
('Gala Collection', 'Peças para eventos de gala e cerimônias', 'gala-collection.jpg', 1, 4),
('Techwear Pro', 'Roupas funcionais com design futurista', 'techwear-pro.jpg', 1, 5),
('Vintage Archive', 'Peças vintage selecionadas do arquivo', 'vintage-archive.jpg', 1, 6),
('Limited Drops', 'Lançamentos exclusivos em quantidade limitada', 'limited-drops.jpg', 1, 7);

-- FORNECEDORES — TEIA BRASIL (46 fornecedores)
INSERT IGNORE INTO fornecedores (nome, cnpj, email, telefone, cidade, estado, status, id_usuario) VALUES
-- Originais
('Luxury Fashion Ltda', '12.345.678/0001-90', 'contato@luxury.com', '(11) 3456-7890', 'São Paulo', 'SP', 'ativo', NULL),
('Premium Brands SA', '98.765.432/0001-10', 'comercial@premium.com', '(21) 9876-5432', 'Rio de Janeiro', 'RJ', 'ativo', NULL),
('Elite Fashion Group', '45.678.901/0001-23', 'vendas@elite.com', '(31) 2345-6789', 'Belo Horizonte', 'MG', 'ativo', NULL),
('High End Couture', '67.890.123/0001-45', 'info@highend.com', '(41) 3456-7890', 'Curitiba', 'PR', 'ativo', NULL),
('Designer Collection', '23.456.789/0001-67', 'contact@designer.com', '(51) 9876-5432', 'Porto Alegre', 'RS', 'ativo', NULL),
('Vogue Imports', '11.222.333/0001-44', 'import@vogue.com', '(11) 9999-8888', 'São Paulo', 'SP', 'ativo', NULL),
('Harper Style House', '22.333.444/0001-55', 'style@harper.com', '(21) 8888-7777', 'Rio de Janeiro', 'RJ', 'ativo', NULL),
('Elle Fashion Supply', '33.444.555/0001-66', 'supply@elle.com', '(31) 7777-6666', 'Belo Horizonte', 'MG', 'ativo', NULL),
('Glamour Couture', '44.555.666/0001-77', 'couture@glamour.com', '(41) 6666-5555', 'Curitiba', 'PR', 'ativo', NULL),
('Vogue Accessories', '55.666.777/0001-88', 'access@vogue.com', '(51) 5555-4444', 'Porto Alegre', 'RS', 'ativo', NULL),
('Fashion Forward', '66.777.888/0001-99', 'forward@fashion.com', '(11) 4444-3333', 'São Paulo', 'SP', 'ativo', NULL),
('Style Elite Group', '77.888.999/0001-00', 'elite@style.com', '(21) 3333-2222', 'Rio de Janeiro', 'RJ', 'ativo', NULL),
('Trend Setters Ltd', '88.999.000/0001-11', 'trend@setters.com', '(31) 2222-1111', 'Belo Horizonte', 'MG', 'ativo', NULL),
('Chic Boutique Supply', '99.000.111/0001-22', 'chic@boutique.com', '(41) 1111-0000', 'Curitiba', 'PR', 'ativo', NULL),
('Moda Premium Brasil', '00.111.222/0001-33', 'premium@moda.com', '(51) 0000-9999', 'Porto Alegre', 'RS', 'ativo', NULL),
('Ricardo Fashion Vendor', '00.000.000/0001-99', 'ricardo@arqon.com', '(11) 99999-9999', 'São Paulo', 'SP', 'ativo', 5),
-- NORTE
('Amazon Luxury Imports', '11.111.111/0001-11', 'amazon@luxury.com', '(92) 3333-4444', 'Manaus', 'AM', 'ativo', NULL),
('Belem Fashion Center', '22.222.222/0001-22', 'belem@fashion.com', '(91) 3222-5555', 'Belém', 'PA', 'ativo', NULL),
('Rio Branco Style', '33.333.333/0001-33', 'riobranco@style.com', '(68) 3221-6666', 'Rio Branco', 'AC', 'ativo', NULL),
('Macapá Elegance', '44.444.444/0001-44', 'macapa@elegance.com', '(96) 3111-7777', 'Macapá', 'AP', 'ativo', NULL),
('Palmas Premium', '55.555.555/0001-55', 'palmas@premium.com', '(63) 3215-8888', 'Palmas', 'TO', 'ativo', NULL),
('Boa Vista Couture', '66.666.666/0001-66', 'boavista@couture.com', '(95) 3623-9999', 'Boa Vista', 'RR', 'ativo', NULL),
('Porto Velho Trends', '77.777.777/0001-77', 'portovelho@trends.com', '(69) 3214-0000', 'Porto Velho', 'RO', 'ativo', NULL),
-- NORDESTE
('Salvador Chic', '88.888.888/0001-88', 'salvador@chic.com', '(71) 3333-1111', 'Salvador', 'BA', 'ativo', NULL),
('Recife Moda Praia', '99.999.999/0001-99', 'recife@modapraia.com', '(81) 3462-2222', 'Recife', 'PE', 'ativo', NULL),
('Fortaleza Glamour', '12.121.212/0001-00', 'fortaleza@glamour.com', '(85) 3246-3333', 'Fortaleza', 'CE', 'ativo', NULL),
('São Luís Fashion', '23.232.323/0001-11', 'saoluis@fashion.com', '(98) 3218-4444', 'São Luís', 'MA', 'ativo', NULL),
('Natal Luxury Wear', '34.343.434/0001-22', 'natal@luxury.com', '(84) 3215-5555', 'Natal', 'RN', 'ativo', NULL),
('João Pessoa Elegance', '45.454.545/0001-33', 'joaopessoa@elegance.com', '(83) 3216-6666', 'João Pessoa', 'PB', 'ativo', NULL),
('Teresina Style House', '56.565.656/0001-44', 'teresina@style.com', '(86) 3217-7777', 'Teresina', 'PI', 'ativo', NULL),
('Aracaju Trends', '67.676.767/0001-55', 'aracaju@trends.com', '(79) 3218-8888', 'Aracaju', 'SE', 'ativo', NULL),
('Maceió Fashion Week', '78.787.878/0001-66', 'maceio@fashion.com', '(82) 3219-9999', 'Maceió', 'AL', 'ativo', NULL),
-- CENTRO-OESTE
('Brasília Power Suit', '89.898.989/0001-77', 'brasilia@powersuit.com', '(61) 3333-0000', 'Brasília', 'DF', 'ativo', NULL),
('Goiânia Glam', '90.909.090/0001-88', 'goiania@glam.com', '(62) 3251-1111', 'Goiânia', 'GO', 'ativo', NULL),
('Cuiabá Couture', '01.010.101/0001-99', 'cuiaba@couture.com', '(65) 3312-2222', 'Cuiabá', 'MT', 'ativo', NULL),
('Campo Grande Elegance', '02.020.202/0001-00', 'campogrande@elegance.com', '(67) 3382-3333', 'Campo Grande', 'MS', 'ativo', NULL),
-- SUDESTE
('São Paulo Fashion Hub', '03.030.303/0001-11', 'sp@fashionhub.com', '(11) 3333-4444', 'São Paulo', 'SP', 'ativo', NULL),
('Rio Luxury Brands', '04.040.404/0001-22', 'rio@luxury.com', '(21) 3444-5555', 'Rio de Janeiro', 'RJ', 'ativo', NULL),
('Belo Horizonte Chic', '05.050.505/0001-33', 'bh@chic.com', '(31) 3555-6666', 'Belo Horizonte', 'MG', 'ativo', NULL),
('Vitória Elegance', '06.060.606/0001-44', 'vitoria@elegance.com', '(27) 3666-7777', 'Vitória', 'ES', 'ativo', NULL),
('Guarulhos Style', '07.070.707/0001-55', 'guarulhos@style.com', '(11) 3777-8888', 'Guarulhos', 'SP', 'ativo', NULL),
('Campinas Luxury', '08.080.808/0001-66', 'campinas@luxury.com', '(19) 3888-9999', 'Campinas', 'SP', 'ativo', NULL),
-- SUL
('Curitiba Fashion Lab', '09.090.909/0001-77', 'curitiba@fashionlab.com', '(41) 3999-0000', 'Curitiba', 'PR', 'ativo', NULL),
('Porto Alegre Glamour', '10.101.010/0001-88', 'poa@glamour.com', '(51) 3111-2222', 'Porto Alegre', 'RS', 'ativo', NULL),
('Florianópolis Beach Wear', '11.212.121/0001-99', 'floripa@beachwear.com', '(48) 3222-3333', 'Florianópolis', 'SC', 'ativo', NULL),
('Joinville Couture', '12.323.232/0001-00', 'joinville@couture.com', '(47) 3433-4444', 'Joinville', 'SC', 'ativo', NULL),
('Londrina Style', '13.434.343/0001-11', 'londrina@style.com', '(43) 3333-5555', 'Londrina', 'PR', 'ativo', NULL),
('Maringá Elegance', '14.545.454/0001-22', 'maringa@elegance.com', '(44) 3222-6666', 'Maringá', 'PR', 'ativo', NULL);

-- Vincula Ricardo e atualiza nivel de acesso
UPDATE fornecedores SET id_usuario = 5 WHERE email = 'ricardo@arqon.com';
UPDATE usuarios SET id_nivel_acesso = 5 WHERE email = 'ricardo@arqon.com';

-- CUPONS EXTRAS
INSERT IGNORE INTO cupons (codigo, tipo, valor, usos_maximos, usos_atuais, id_produto, id_usuario, validade, valor_minimo, status_ativo, descricao, criado_em) VALUES
('SUMMER25', 'percentual', 25.00, 200, 0, NULL, NULL, '2025-09-30', 300.00, TRUE, '25% de desconto no verão', NOW()),
('WINTER30', 'percentual', 30.00, 100, 0, NULL, NULL, '2025-08-31', 400.00, TRUE, '30% de desconto no inverno', NOW()),
('VIP40', 'percentual', 40.00, 50, 0, NULL, NULL, '2025-12-31', 1000.00, TRUE, '40% para VIPs', NOW()),
('FLASH100', 'fixo', 100.00, 150, 0, NULL, NULL, '2025-07-31', 500.00, TRUE, 'R$ 100 de desconto flash', NOW()),
('LOYALTY15', 'percentual', 15.00, 300, 0, NULL, NULL, '2025-12-31', 150.00, TRUE, '15% para clientes fiéis', NOW());

SET FOREIGN_KEY_CHECKS = 1;