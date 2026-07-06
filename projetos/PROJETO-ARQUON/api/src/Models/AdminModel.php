<?php
declare(strict_types=1);

// 🛡️ BLINDAGEM DE INCLUSÃO: Evita Erro 500 caso o caminho mude dependendo do ambiente
if (!defined('DB_HOST')) {
    if (file_exists(__DIR__ . '/../../../config.php')) {
        require_once __DIR__ . '/../../../config.php';
    } elseif (file_exists(__DIR__ . '/../../config.php')) {
        require_once __DIR__ . '/../../config.php';
    }
}

if (!class_exists('Database')) {
    if (file_exists(__DIR__ . '/../../../database.php')) {
        require_once __DIR__ . '/../../../database.php';
    } elseif (file_exists(__DIR__ . '/../../database.php')) {
        require_once __DIR__ . '/../../database.php';
    }
}

class AdminModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // =========================================================================
    // MÉTRICAS DO DASHBOARD
    // =========================================================================

    public function getTotalProdutos(): int {
        try {
            $stmt = $this->db->query("SELECT COUNT(*) FROM produtos");
            return (int)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getTotalUsuarios(): int {
        try {
            $stmt = $this->db->query("SELECT COUNT(*) FROM usuarios");
            return (int)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getValorTotalInventario(): float {
        try {
            $stmt = $this->db->query("SELECT SUM(valor_mercado) FROM produtos");
            return (float)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0.0;
        }
    }

    public function getAlugaveisDisponiveis(): int {
        try {
            $stmt = $this->db->query("SELECT COUNT(*) FROM produtos WHERE status = 'disponível' OR status = 'disponivel'");
            return (int)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getTaxaOcupacao(): float {
        try {
            $total = $this->getTotalProdutos();
            if ($total === 0) return 0.0;
            
            $stmt = $this->db->query("SELECT COUNT(*) FROM produtos WHERE status = 'alugado' OR status = 'indisponivel'");
            $alugados = (int)$stmt->fetchColumn();
            
            return round(($alugados / $total) * 100, 1);
        } catch (Exception $e) {
            return 0.0;
        }
    }

    public function getUsuariosAtivos30dias(): int {
        try {
            $stmt = $this->db->query("SELECT COUNT(*) FROM usuarios WHERE status = 'ativo'");
            return (int)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getReceitaPendente(): float {
        try {
            $stmt = $this->db->query("SELECT SUM(valor_total) FROM alugueis WHERE status_pagamento = 'pendente'");
            return (float)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0.0;
        }
    }

    public function getReceitaMes(): float {
        try {
            $stmt = $this->db->query("SELECT SUM(valor_total) FROM alugueis WHERE status_pagamento = 'pago'");
            return (float)$stmt->fetchColumn();
        } catch (Exception $e) {
            return 0.0;
        }
    }

    public function getUltimasTransacoes(int $limit = 10): array {
        try {
            $stmt = $this->db->prepare("
                SELECT a.id, u.nome as cliente, a.data_reserva as data_locacao, a.valor_total as total, a.status_pagamento, a.status_envio 
                FROM alugueis a
                LEFT JOIN usuarios u ON a.id_usuario = u.id
                ORDER BY a.data_reserva DESC 
                LIMIT :limit
            ");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return [];
        }
    }
    
    public function getSystemLogs(int $dias): array {
        try {
            $stmt = $this->db->prepare("SELECT acao, descricao, data_log FROM logs WHERE data_log >= DATE_SUB(NOW(), INTERVAL :dias DAY) ORDER BY data_log DESC LIMIT 50");
            $stmt->bindValue(':dias', $dias, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return [];
        }
    }

    // =========================================================================
    // GERENCIAMENTO DE USUÁRIOS & ALIASES SESSÃO ANTI-ERRO 500
    // =========================================================================

    public function listarUsuarios(): array {
        try {
            $stmt = $this->db->query("
                SELECT u.id, u.nome, u.email, u.status, n.nome as nivel_acesso 
                FROM usuarios u
                LEFT JOIN niveis_acesso n ON u.id_nivel_acesso = n.id
                ORDER BY u.id DESC
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return [];
        }
    }

    // 💡 ALIASES: Evita quebra se o Controller chamar por nomes diferentes
    public function getUsuarios(): array { return $this->listarUsuarios(); }
    public function usuarios(): array { return $this->listarUsuarios(); }

    public function atualizarStatusUsuario(int $id_usuario, string $status): bool {
        try {
            $stmt = $this->db->prepare("UPDATE usuarios SET status = :status WHERE id = :id");
            return $stmt->execute([':status' => $status, ':id' => $id_usuario]);
        } catch (Exception $e) {
            return false;
        }
    }

    // =========================================================================
    // GERENCIAMENTO DE PRODUTOS & ALIASES SESSÃO ANTI-ERRO 500
    // =========================================================================

    public function listarProdutos(): array {
        try {
            $stmt = $this->db->query("
                SELECT id, nome, categoria, valor_diaria, valor_mercado, status, foto 
                FROM produtos 
                ORDER BY id DESC
            ");
            $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Tratamento híbrido mapeado para bater perfeitamente com as chaves do admin.js
            foreach ($produtos as &$p) {
                $p['preco_diaria'] = $p['valor_diaria'];
                $p['foto_url'] = !empty($p['foto']) ? $p['foto'] : 'assets/images/default-item.png';
            }
            return $produtos;
        } catch (Exception $e) {
            return [];
        }
    }

    // 💡 ALIASES: Garante a compatibilidade total com index.php e AdminController
    public function listarProdutosInventario(): array {
        try {
            // Esta é a query que está a tentar rodar. Se o nome de alguma tabela 
            // estiver errado (ex: 'marcas' em vez de 'marca'), ela vai disparar o catch.
            $sql = "SELECT p.*, 
                           COALESCE(m.nome, 'Geral') as marca, 
                           COALESCE(c.nome, 'Geral') as categoria, 
                           COALESCE(e.nome, 'Geral') as estilo
                    FROM produtos p
                    LEFT JOIN marcas m ON p.id_marca = m.id
                    LEFT JOIN categorias c ON p.id_categoria = c.id
                    LEFT JOIN estilos e ON p.id_estilo = e.id
                    ORDER BY p.id DESC";
            
            $stmt = $this->db->query($sql);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            // 🚨 FORÇA O ERRO REAL A APARECER: Permite ver o erro exato do MySQL no Network
            throw new Exception("Erro na Query de Listagem: " . $e->getMessage());
        }
    }
    public function getProdutos(): array { return $this->listarProdutos(); }
    public function getInventario(): array { return $this->listarProdutos(); }

    public function salvarProduto(array $dados): bool {
        try {
            // Consulta SQL perfeitamente alinhada com o setup_db.php
            $sql = "INSERT INTO produtos (id_marca, id_categoria, id_estilo, nome, valor_diaria, valor_mercado, status_venda, foto_url) 
                    VALUES (:id_marca, :id_categoria, :id_estilo, :nome, :valor_diaria, :valor_mercado, :status_venda, :foto_url)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                // Como o form ainda não envia IDs específicos de marca e estilo, usamos 1 como padrão para não quebrar o banco
                ':id_marca'      => 1, 
                ':id_categoria'  => 1, 
                ':id_estilo'     => 1, 
                
                // Dados vindos do formulário
                ':nome'          => $dados['nome'] ?? 'Artefato sem nome',
                ':valor_diaria'  => (float)($dados['valor_diaria'] ?? 0),
                ':valor_mercado' => (float)($dados['valor_mercado'] ?? 0),
                
                // Conversão do status texto para o BOOLEAN (1) exigido pelo setup_db.php
                ':status_venda'  => 1, 
                
                // O ficheiro envia foto, mas o banco salva como foto_url
                ':foto_url'      => $dados['foto'] ?? 'default.jpg'
            ]);
            
            return true;
            
        } catch (Exception $e) {
            // Mostra o erro do BD caso aconteça
            throw new Exception("SQL ERROR: " . $e->getMessage());
        }
    }

    public function atualizarStatusProduto(int $id_produto, string $status): bool {
        try {
            $stmt = $this->db->prepare("UPDATE produtos SET status = :status WHERE id = :id");
            return $stmt->execute([':status' => $status, ':id' => $id_produto]);
        } catch (Exception $e) {
            return false;
        }
    }
}