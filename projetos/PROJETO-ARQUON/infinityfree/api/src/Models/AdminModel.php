<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

class AdminModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function registrarLog(?int $idUsuario, string $acao, string $tabela = 'sistema'): void {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO sistema_logs (id_usuario, acao, tabela) VALUES (:uid, :acao, :tab)'
            );
            $stmt->execute([
                ':uid' => $idUsuario,
                ':acao' => $acao,
                ':tab' => $tabela,
            ]);
        } catch (Exception $e) {
            error_log('LOG_AUDIT: ' . $e->getMessage());
        }
    }

    // --- Métricas reais ---
    public function getTotalProdutos(): int {
        return (int)$this->db->query('SELECT COUNT(*) FROM produtos')->fetchColumn();
    }

    public function getValorTotalInventario(): float {
        return (float)($this->db->query('SELECT COALESCE(SUM(valor_mercado),0) FROM produtos')->fetchColumn() ?: 0);
    }

    public function getTaxaOcupacao(): int {
        try {
            $total = (int)$this->db->query('SELECT COUNT(*) FROM itens_estoque')->fetchColumn();
            if ($total === 0) {
                return 0;
            }
            $alugados = (int)$this->db->query(
                "SELECT COUNT(*) FROM itens_estoque WHERE status_atual IN ('Alugado','Transporte')"
            )->fetchColumn();
            return (int)round(($alugados / $total) * 100);
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getAlugaveisDisponiveis(): int {
        try {
            return (int)$this->db->query(
                "SELECT COUNT(*) FROM itens_estoque WHERE status_atual IN ('Disponível','No Vault')"
            )->fetchColumn();
        } catch (Exception $e) {
            return (int)$this->db->query('SELECT COUNT(*) FROM produtos WHERE status_venda = 1')->fetchColumn();
        }
    }

    public function getTotalUsuarios(): int {
        return (int)$this->db->query('SELECT COUNT(*) FROM usuarios')->fetchColumn();
    }

    public function getUsuariosAtivos30dias(): int {
        return (int)$this->db->query(
            "SELECT COUNT(*) FROM usuarios WHERE status = 'ativo' AND data_criacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
        )->fetchColumn();
    }

    public function getReceitaPendente(): float {
        return (float)($this->db->query(
            "SELECT COALESCE(SUM(valor_aluguel),0) FROM locacoes WHERE status_pedido IN ('pendente','pago','enviado')"
        )->fetchColumn() ?: 0);
    }

    public function getReceitaMes(): float {
        return (float)($this->db->query(
            "SELECT COALESCE(SUM(valor_aluguel),0) FROM locacoes 
             WHERE status_pedido NOT IN ('cancelado') 
             AND MONTH(data_inicio) = MONTH(CURRENT_DATE()) 
             AND YEAR(data_inicio) = YEAR(CURRENT_DATE())"
        )->fetchColumn() ?: 0);
    }

    public function getLocacoesMes(): int {
        return (int)$this->db->query(
            "SELECT COUNT(*) FROM locacoes 
             WHERE MONTH(data_inicio) = MONTH(CURRENT_DATE())"
        )->fetchColumn();
    }

    public function getLocacoesSemana(): int {
        return (int)$this->db->query(
            "SELECT COUNT(*) FROM locacoes WHERE data_inicio >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
        )->fetchColumn();
    }

    public function getLocacoesHoje(): int {
        return (int)$this->db->query(
            'SELECT COUNT(*) FROM locacoes WHERE DATE(data_inicio) = CURDATE()'
        )->fetchColumn();
    }

    public function getUltimasTransacoes(int $limite = 10): array {
        try {
            $sql = "SELECT l.id, l.data_inicio as data_locacao, l.valor_aluguel as valor_total,
                           l.status_pedido as status_pagamento, u.nome as cliente, p.nome as produto
                    FROM locacoes l
                    INNER JOIN usuarios u ON u.id = l.id_usuario
                    LEFT JOIN itens_estoque ie ON ie.id = l.id_item_estoque
                    LEFT JOIN produtos p ON p.id = ie.id_produto
                    ORDER BY l.id DESC LIMIT :lim";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':lim', $limite, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            return [];
        }
    }

    public function getProdutosAdmin(): array {
        $sql = "SELECT p.id, p.nome, p.composicao, p.descricao,
                       p.valor_diaria, p.valor_mercado, p.status_venda,
                       p.foto_principal_url, p.id_marca, p.id_categoria, p.id_estilo,
                       p.genero,
                       m.nome AS marca, c.nome AS categoria, e.nome AS estilo
                FROM produtos p
                LEFT JOIN marcas m ON p.id_marca = m.id
                LEFT JOIN categorias c ON p.id_categoria = c.id
                LEFT JOIN estilos e ON p.id_estilo = e.id
                ORDER BY p.id DESC";
        $rows = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];

        $estoque = $this->getDisponibilidadePorProduto();
        $ordem = ['PP' => 1, 'P' => 2, 'M' => 3, 'G' => 4, 'GG' => 5, 'XG' => 6, 'XGG' => 7, 'U' => 8];

        foreach ($rows as &$r) {
            $pid = (int)$r['id'];
            $info = $estoque[$pid] ?? ['total' => 0, 'disp' => 0, 'tamanhos' => []];
            usort($info['tamanhos'], fn($a, $b) => ($ordem[$a['tamanho']] ?? 99) <=> ($ordem[$b['tamanho']] ?? 99));

            $r['categoria'] = $r['categoria'] ?? '';
            $r['qtd_estoque'] = $info['total'];
            $r['qtd_disponivel'] = $info['disp'];
            $r['estoque_disponivel'] = $info['disp'];
            $r['estoque_detalhado'] = $info['tamanhos'];
            $r['tamanhos'] = implode(',', array_map(fn($t) => $t['tamanho'], $info['tamanhos']));
            $r['tamanhos_disponiveis'] = array_values(array_map(
                fn($t) => $t['tamanho'],
                array_filter($info['tamanhos'], fn($t) => $t['disponivel'] > 0)
            ));

            $ativo = ((int)$r['status_venda'] === 1);
            $temEstoque = $info['disp'] > 0;
            $r['disponivel'] = ($ativo && $temEstoque);
            if (!$ativo) {
                $r['status'] = 'indisponivel';
            } elseif (!$temEstoque) {
                $r['status'] = 'esgotado';
            } else {
                $r['status'] = 'disponivel';
            }
        }
        return $rows;
    }

    /**
     * Disponibilidade agregada por produto e tamanho (núcleo do sistema de escassez de luxo).
     * Retorna [id_produto => ['total'=>int, 'disp'=>int, 'tamanhos'=>[['tamanho','total','disponivel'], ...]]]
     */
    public function getDisponibilidadePorProduto(): array {
        $mapa = [];
        try {
            $q = $this->db->query(
                "SELECT id_produto, tamanho,
                        COUNT(*) AS total,
                        SUM(CASE WHEN status_atual IN ('Disponível','No Vault') THEN 1 ELSE 0 END) AS disp
                 FROM itens_estoque
                 GROUP BY id_produto, tamanho"
            );
            foreach ($q as $r) {
                $pid = (int)$r['id_produto'];
                if (!isset($mapa[$pid])) {
                    $mapa[$pid] = ['total' => 0, 'disp' => 0, 'tamanhos' => []];
                }
                $mapa[$pid]['total'] += (int)$r['total'];
                $mapa[$pid]['disp'] += (int)$r['disp'];
                $mapa[$pid]['tamanhos'][] = [
                    'tamanho' => $r['tamanho'],
                    'total' => (int)$r['total'],
                    'disponivel' => (int)$r['disp'],
                ];
            }
        } catch (Exception $e) {
            error_log('ESTOQUE_AGG: ' . $e->getMessage());
        }
        return $mapa;
    }

    public function getProdutoPorId(int $id): ?array {
        $stmt = $this->db->prepare(
            'SELECT p.*, m.nome AS marca, c.nome AS categoria, e.nome AS estilo
             FROM produtos p
             LEFT JOIN marcas m ON m.id = p.id_marca
             LEFT JOIN categorias c ON c.id = p.id_categoria
             LEFT JOIN estilos e ON e.id = p.id_estilo
             WHERE p.id = :id'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function adicionarProdutoLuxo(array $dados, string $fotoPrincipalUrl, array $midias): int {
        $this->db->beginTransaction();
        try {
            $valorDiaria = (float)($dados['valor_diaria'] ?? 0);

            $sql = 'INSERT INTO produtos 
                (id_marca, id_categoria, id_estilo, nome, descricao, composicao, valor_mercado, valor_diaria, foto_principal_url, status_venda, genero)
                VALUES 
                (:id_marca, :id_categoria, :id_estilo, :nome, :descricao, :composicao, :valor_mercado, :valor_diaria, :foto, :status_venda, :genero)';

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id_marca' => (int)($dados['id_marca'] ?? 1),
                ':id_categoria' => (int)($dados['id_categoria'] ?? 1),
                ':id_estilo' => (int)($dados['id_estilo'] ?? 1),
                ':nome' => $dados['nome'] ?? 'Artefato',
                ':descricao' => $dados['descricao'] ?? null,
                ':composicao' => $dados['composicao'] ?? null,
                ':valor_mercado' => (float)($dados['valor_mercado'] ?? 0),
                ':valor_diaria' => $valorDiaria,
                ':foto' => $fotoPrincipalUrl,
                ':status_venda' => isset($dados['status_venda']) ? (int)$dados['status_venda'] : 1,
                ':genero' => $dados['genero'] ?? 'Unissex',
            ]);

            $idProduto = (int)$this->db->lastInsertId();
            $this->salvarMidias($idProduto, $midias);

            $qtdEstoque = max(1, (int)($dados['qtd_estoque'] ?? 1));
            $tamanhos = $dados['tamanhos'] ?? 'M';
            if (is_string($tamanhos)) {
                $tamanhos = array_map('trim', explode(',', $tamanhos));
            }
            $this->gerarItensEstoqueInicial($idProduto, $qtdEstoque, $tamanhos, 'Preto');

            $this->db->commit();
            return $idProduto;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function atualizarProdutoLuxo(int $id, array $dados, ?string $fotoPrincipalUrl, array $midias): bool {
        $this->db->beginTransaction();
        try {
            $valorDiaria = (float)($dados['valor_diaria'] ?? 0);

            $sql = 'UPDATE produtos SET
                id_marca = :id_marca, id_categoria = :id_categoria,
                id_estilo = :id_estilo, nome = :nome, descricao = :descricao,
                composicao = :composicao, valor_mercado = :valor_mercado, valor_diaria = :valor_diaria,
                status_venda = :status_venda, genero = :genero';
            if ($fotoPrincipalUrl) {
                $sql .= ', foto_principal_url = :foto';
            }
            $sql .= ' WHERE id = :id';

            $params = [
                ':id_marca' => (int)($dados['id_marca'] ?? 1),
                ':id_categoria' => (int)($dados['id_categoria'] ?? 1),
                ':id_estilo' => (int)($dados['id_estilo'] ?? 1),
                ':nome' => $dados['nome'] ?? 'Artefato',
                ':descricao' => $dados['descricao'] ?? null,
                ':composicao' => $dados['composicao'] ?? null,
                ':valor_mercado' => (float)($dados['valor_mercado'] ?? 0),
                ':valor_diaria' => $valorDiaria,
                ':status_venda' => isset($dados['status_venda']) ? (int)$dados['status_venda'] : 1,
                ':genero' => $dados['genero'] ?? 'Unissex',
                ':id' => $id,
            ];
            if ($fotoPrincipalUrl) {
                $params[':foto'] = $fotoPrincipalUrl;
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            if (!empty($midias)) {
                $this->db->prepare('DELETE FROM produto_midias WHERE id_produto = :id')->execute([':id' => $id]);
                $this->salvarMidias($id, $midias);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    private function salvarMidias(int $idProduto, array $midias): void {
        if (empty($midias)) {
            return;
        }
        $stmt = $this->db->prepare(
            'INSERT INTO produto_midias (id_produto, tipo_midia, url_midia, ordem) VALUES (:pid, :tipo, :url, :ordem)'
        );
        foreach ($midias as $midia) {
            $stmt->execute([
                ':pid' => $idProduto,
                ':tipo' => $midia['tipo'],
                ':url' => $midia['url'],
                ':ordem' => $midia['ordem'] ?? 0,
            ]);
        }
    }

    private function gerarItensEstoqueInicial(int $idProduto, int $qtd, array $tamanhos, string $corNome): void {
        $idCor = $this->obterOuCriarCor($corNome);
        $stmt = $this->db->prepare(
            'INSERT INTO itens_estoque (id_produto, id_cor, tamanho, rfid_nfc_tag, status_atual, condicao_fisica)
             VALUES (:pid, :cor, :tam, :rfid, :status, :cond)'
        );
        for ($i = 0; $i < $qtd; $i++) {
            $tam = $tamanhos[$i % count($tamanhos)] ?? 'M';
            $rfid = 'RFID-' . $idProduto . '-' . strtoupper(uniqid());
            $stmt->execute([
                ':pid' => $idProduto,
                ':cor' => $idCor,
                ':tam' => $tam,
                ':rfid' => $rfid,
                ':status' => 'Disponível',
                ':cond' => 'Perfeita',
            ]);
        }
    }

    private function obterOuCriarCor(string $nome): int {
        $stmt = $this->db->prepare('SELECT id FROM cores WHERE nome = :n LIMIT 1');
        $stmt->execute([':n' => $nome]);
        $id = $stmt->fetchColumn();
        if ($id) {
            return (int)$id;
        }
        $hex = '#000000';
        $ins = $this->db->prepare('INSERT INTO cores (nome, hex_code) VALUES (:n, :h)');
        $ins->execute([':n' => $nome, ':h' => $hex]);
        return (int)$this->db->lastInsertId();
    }

    public function excluirProduto(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM produtos WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    public function duplicarProduto(int $id): ?int {
        $p = $this->getProdutoPorId($id);
        if (!$p) {
            return null;
        }
        $dados = $p;
        $dados['nome'] = ($p['nome'] ?? 'Cópia') . ' (Cópia)';
        return $this->adicionarProdutoLuxo($dados, $p['foto_principal_url'] ?? 'default.jpg', []);
    }

    public function atualizarStatusProduto(int $idProduto, string $status): bool {
        $statusBit = ($status === 'disponivel' || $status === '1') ? 1 : 0;
        $stmt = $this->db->prepare('UPDATE produtos SET status_venda = :s WHERE id = :id');
        return $stmt->execute([':s' => $statusBit, ':id' => $idProduto]);
    }

    public function getEstoqueAdmin(): array {
        $sql = "SELECT ie.id, ie.rfid_nfc_tag, ie.tamanho, ie.status_atual, ie.condicao_fisica, ie.qtd_locacoes,
                       p.id AS id_produto, p.nome AS produto, m.nome AS marca,
                       c.nome AS cor, c.hex_code
                FROM itens_estoque ie
                INNER JOIN produtos p ON p.id = ie.id_produto
                LEFT JOIN marcas m ON m.id = p.id_marca
                LEFT JOIN cores c ON c.id = ie.id_cor
                ORDER BY ie.id DESC";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function atualizarStatusEstoque(int $idItem, string $status): bool {
        $stmt = $this->db->prepare('UPDATE itens_estoque SET status_atual = :s WHERE id = :id');
        return $stmt->execute([':s' => $status, ':id' => $idItem]);
    }

    public function adicionarItemEstoque(array $dados): int {
        $idCor = $this->obterOuCriarCor($dados['cor'] ?? 'Preto');
        $rfid = $dados['rfid_nfc_tag'] ?? ('RFID-' . ($dados['id_produto'] ?? 0) . '-' . strtoupper(uniqid()));
        $stmt = $this->db->prepare(
            'INSERT INTO itens_estoque (id_produto, id_cor, tamanho, rfid_nfc_tag, status_atual, condicao_fisica)
             VALUES (:pid, :cor, :tam, :rfid, :status, :cond)'
        );
        $stmt->execute([
            ':pid' => (int)$dados['id_produto'],
            ':cor' => $idCor,
            ':tam' => $dados['tamanho'] ?? 'M',
            ':rfid' => $rfid,
            ':status' => $dados['status_atual'] ?? 'Disponível',
            ':cond' => $dados['condicao_fisica'] ?? 'Perfeita',
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function getLocacoesAdmin(): array {
        $sql = "SELECT l.*, u.nome AS cliente, u.email, p.nome AS produto,
                       ie.tamanho, ie.rfid_nfc_tag, e.codigo_rastreio
                FROM locacoes l
                INNER JOIN usuarios u ON u.id = l.id_usuario
                LEFT JOIN itens_estoque ie ON ie.id = l.id_item_estoque
                LEFT JOIN produtos p ON p.id = ie.id_produto
                LEFT JOIN entregas e ON e.id_locacao = l.id
                ORDER BY l.id DESC";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function atualizarStatusLocacao(int $id, string $status): bool {
        $stmt = $this->db->prepare('UPDATE locacoes SET status_pedido = :s WHERE id = :id');
        return $stmt->execute([':s' => $status, ':id' => $id]);
    }

    public function atualizarRastreioLocacao(int $idLocacao, string $codigo): bool {
        $check = $this->db->prepare('SELECT id FROM entregas WHERE id_locacao = :id LIMIT 1');
        $check->execute([':id' => $idLocacao]);
        $entregaId = $check->fetchColumn();
        if ($entregaId) {
            $stmt = $this->db->prepare('UPDATE entregas SET codigo_rastreio = :c WHERE id_locacao = :id');
            return $stmt->execute([':c' => $codigo, ':id' => $idLocacao]);
        }
        $stmt = $this->db->prepare(
            'INSERT INTO entregas (id_locacao, codigo_rastreio, data_postagem) VALUES (:id, :c, NOW())'
        );
        return $stmt->execute([':id' => $idLocacao, ':c' => $codigo]);
    }

    public function getUsuariosAdmin(): array {
        $sql = "SELECT u.id, u.nome, u.email, u.status, u.data_criacao AS data_cadastro,
                       n.nome AS nivel_acesso, n.id AS id_nivel_acesso
                FROM usuarios u
                LEFT JOIN niveis_acesso n ON n.id = u.id_nivel_acesso
                ORDER BY u.id DESC";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function atualizarStatusUsuario(int $idUsuario, string $status): bool {
        $permitidos = ['ativo', 'inativo', 'bloqueado'];
        if (!in_array($status, $permitidos, true)) {
            $status = $status === 'ativo' ? 'ativo' : 'inativo';
        }
        $stmt = $this->db->prepare('UPDATE usuarios SET status = :s WHERE id = :id');
        return $stmt->execute([':s' => $status, ':id' => $idUsuario]);
    }

    public function atualizarNivelUsuario(int $idUsuario, string $nivelNome): bool {
        $mapa = [
            'TOTAL_CONTROL' => 1,
            'VAULT_MGMT' => 2,
            'PRIORITY_ACCESS' => 3,
            'MEMBER' => 4,
            'ADMIN' => 1,
        ];
        $idNivel = $mapa[$nivelNome] ?? 4;
        $stmt = $this->db->prepare('UPDATE usuarios SET id_nivel_acesso = :n WHERE id = :id');
        return $stmt->execute([':n' => $idNivel, ':id' => $idUsuario]);
    }

    public function getSystemLogs(int $dias = 7): array {
        $stmt = $this->db->prepare(
            "SELECT l.id, l.acao, l.tabela, l.data_hora AS data_log, l.data_hora AS created_at,
                    u.nome AS usuario,
                    CONCAT(l.acao, ' — ', l.tabela) AS descricao
             FROM sistema_logs l
             LEFT JOIN usuarios u ON u.id = l.id_usuario
             WHERE l.data_hora >= DATE_SUB(NOW(), INTERVAL :d DAY)
             ORDER BY l.data_hora DESC LIMIT 500"
        );
        $stmt->bindValue(':d', $dias, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    // --- CRUD Marcas ---
    public function getMarcas(): array {
        return $this->db->query('SELECT id, nome FROM marcas ORDER BY nome')->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function criarMarca(string $nome): int {
        $stmt = $this->db->prepare('INSERT INTO marcas (nome) VALUES (:n)');
        $stmt->execute([':n' => $nome]);
        return (int)$this->db->lastInsertId();
    }

    public function atualizarMarca(int $id, string $nome): bool {
        $stmt = $this->db->prepare('UPDATE marcas SET nome = :n WHERE id = :id');
        return $stmt->execute([':n' => $nome, ':id' => $id]);
    }

    public function deletarMarca(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM marcas WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    // --- CRUD Cores ---
    public function getCores(): array {
        try {
            return $this->db->query('SELECT id, nome, hex_code FROM cores ORDER BY nome')->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            return [];
        }
    }

    public function criarCor(string $nome, string $hex): int {
        $stmt = $this->db->prepare('INSERT INTO cores (nome, hex_code) VALUES (:n, :h)');
        $stmt->execute([':n' => $nome, ':h' => $hex]);
        return (int)$this->db->lastInsertId();
    }

    public function atualizarCor(int $id, string $nome, string $hex): bool {
        $stmt = $this->db->prepare('UPDATE cores SET nome = :n, hex_code = :h WHERE id = :id');
        return $stmt->execute([':n' => $nome, ':h' => $hex, ':id' => $id]);
    }

    public function deletarCor(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM cores WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    public function getCategorias(): array {
        return $this->db->query('SELECT id, nome, macro_categoria FROM categorias ORDER BY nome')->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function getEstilos(): array {
        return $this->db->query('SELECT id, nome FROM estilos ORDER BY nome')->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function getConfiguracoes(): array {
        try {
            return $this->db->query('SELECT chave, valor, descricao FROM configuracoes_sistema')->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            return [];
        }
    }

    public function sincronizarEstoqueProdutos(): int {
        $sql = "SELECT p.id FROM produtos p
                WHERE NOT EXISTS (SELECT 1 FROM itens_estoque ie WHERE ie.id_produto = p.id)";
        $rows = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        $criados = 0;
        foreach ($rows as $row) {
            $this->gerarItensEstoqueInicial(
                (int)$row['id'],
                1,
                ['M'],
                'Preto'
            );
            $criados++;
        }
        return $criados;
    }

    public function salvarConfiguracao(string $chave, string $valor): bool {
        $stmt = $this->db->prepare(
            'INSERT INTO configuracoes_sistema (chave, valor) VALUES (:k, :v)
             ON DUPLICATE KEY UPDATE valor = :v2'
        );
        return $stmt->execute([':k' => $chave, ':v' => $valor, ':v2' => $valor]);
    }
}
