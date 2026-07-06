<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Locacao Model
 * Finalidade: Gerenciar locações/aluguéis no banco de dados
 */
class Locacao {
    
    /**
     * Lista locações de um usuário
     */
    public static function listarPorUsuario(int $idUsuario): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                l.id,
                l.data_inicio,
                l.data_fim,
                l.valor_aluguel,
                l.valor_caucao,
                l.status_pedido,
                p.nome as produto_nome,
                p.foto_principal_url as foto_url,
                e.codigo_rastreio
            FROM locacoes l
            INNER JOIN itens_estoque ie ON l.id_item_estoque = ie.id
            INNER JOIN produtos p ON ie.id_produto = p.id
            LEFT JOIN entregas e ON l.id = e.id_locacao
            WHERE l.id_usuario = :id_usuario
            ORDER BY l.id DESC
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Cria nova locação
     */
    public static function criar(
        int $idUsuario,
        int $idItemEstoque,
        string $dataInicio,
        string $dataFim,
        ?int $idEndereco = null
    ): int {
        $db = Database::getInstance();
        
        try {
            $db->beginTransaction();
            
            // Busca informações do produto para calcular valores
            $sqlProd = "
                SELECT p.valor_diaria
                FROM itens_estoque ie
                INNER JOIN produtos p ON ie.id_produto = p.id
                WHERE ie.id = :id_item_estoque
            ";
            $stmtProd = $db->prepare($sqlProd);
            $stmtProd->execute([':id_item_estoque' => $idItemEstoque]);
            $produto = $stmtProd->fetch();

            if (!$produto) {
                throw new Exception("Item de estoque não encontrado.", 404);
            }

            // Verifica disponibilidade
            $sqlDisp = "SELECT status_atual FROM itens_estoque WHERE id = :id_item_estoque";
            $stmtDisp = $db->prepare($sqlDisp);
            $stmtDisp->execute([':id_item_estoque' => $idItemEstoque]);
            $status = $stmtDisp->fetchColumn();

            if ($status !== 'Disponível') {
                throw new Exception("Item não está disponível para locação.", 400);
            }

            // Calcula número de dias
            $inicio = new DateTime($dataInicio);
            $fim = new DateTime($dataFim);
            $dias = $inicio->diff($fim)->days;

            if ($dias < 4) {
                throw new Exception("Período mínimo de aluguel é 4 dias.", 400);
            }
            if ($dias > 15) {
                throw new Exception("Período máximo de aluguel é 15 dias.", 400);
            }

            // Calcula valores (caução = 2x diária, já que produtos não tem coluna valor_caucao)
            $valorAluguel = $produto['valor_diaria'] * $dias;
            $valorCaucao = $produto['valor_diaria'] * 2;
            
            // Cria locação
            $sql = "
                INSERT INTO locacoes 
                (id_usuario, id_item_estoque, data_inicio, data_fim, valor_aluguel, valor_caucao, status_pedido)
                VALUES 
                (:id_usuario, :id_item_estoque, :data_inicio, :data_fim, :valor_aluguel, :valor_caucao, 'pendente')
            ";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':id_usuario' => $idUsuario,
                ':id_item_estoque' => $idItemEstoque,
                ':data_inicio' => $dataInicio,
                ':data_fim' => $dataFim,
                ':valor_aluguel' => $valorAluguel,
                ':valor_caucao' => $valorCaucao
            ]);
            
            $idLocacao = (int) $db->lastInsertId();
            
            // Atualiza status do item
            $sqlItem = "UPDATE itens_estoque SET status_atual = 'No Vault' WHERE id = :id_item_estoque";
            $stmtItem = $db->prepare($sqlItem);
            $stmtItem->execute([':id_item_estoque' => $idItemEstoque]);
            
            $db->commit();
            return $idLocacao;
            
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    
    /**
     * Atualiza status da locação
     */
    public static function atualizarStatus(int $id, string $status): bool {
        $db = Database::getInstance();
        
        $sql = "UPDATE locacoes SET status_pedido = :status WHERE id = :id";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':status' => $status, ':id' => $id]) && $stmt->rowCount() > 0;
    }
    
    /**
     * Cancela locação (apenas se status = pendente)
     */
    public static function cancelar(int $idUsuario, int $id): bool {
        $db = Database::getInstance();
        
        try {
            $db->beginTransaction();
            
            // Busca locação
            $sql = "SELECT id_item_estoque, status_pedido FROM locacoes WHERE id = :id AND id_usuario = :id_usuario";
            $stmt = $db->prepare($sql);
            $stmt->execute([':id' => $id, ':id_usuario' => $idUsuario]);
            $locacao = $stmt->fetch();
            
            if (!$locacao) {
                throw new Exception("Locação não encontrada.", 404);
            }
            
            if ($locacao['status_pedido'] !== 'pendente') {
                throw new Exception("Locação não pode ser cancelada.", 400);
            }
            
            // Atualiza status
            $sqlUpdate = "UPDATE locacoes SET status_pedido = 'cancelado' WHERE id = :id";
            $stmtUpdate = $db->prepare($sqlUpdate);
            $stmtUpdate->execute([':id' => $id]);
            
            // Libera item
            $sqlItem = "UPDATE itens_estoque SET status_atual = 'Disponível' WHERE id = :id_item_estoque";
            $stmtItem = $db->prepare($sqlItem);
            $stmtItem->execute([':id_item_estoque' => $locacao['id_item_estoque']]);
            
            $db->commit();
            return true;
            
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    
    /**
     * Busca locação por ID
     */
    public static function buscarPorId(int $idUsuario, int $id): ?array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                l.id,
                l.data_inicio,
                l.data_fim,
                l.valor_aluguel,
                l.valor_caucao,
                l.status_pedido,
                p.nome as produto_nome,
                p.descricao,
                p.foto_principal_url as foto_url,
                m.nome as marca,
                ie.tamanho,
                c.nome as cor,
                e.codigo_rastreio,
                ue.logradouro,
                ue.numero,
                ue.bairro,
                ue.cidade,
                ue.cep
            FROM locacoes l
            INNER JOIN itens_estoque ie ON l.id_item_estoque = ie.id
            INNER JOIN produtos p ON ie.id_produto = p.id
            LEFT JOIN marcas m ON p.id_marca = m.id
            LEFT JOIN cores c ON ie.id_cor = c.id
            LEFT JOIN entregas e ON l.id = e.id_locacao
            LEFT JOIN usuarios_enderecos ue ON l.id_endereco = ue.id
            WHERE l.id = :id AND l.id_usuario = :id_usuario
            LIMIT 1
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $id, ':id_usuario' => $idUsuario]);
        
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    /**
     * Lista todas as locações (admin)
     */
    public static function listarTodas(): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                l.id,
                l.data_inicio,
                l.data_fim,
                l.valor_aluguel,
                l.valor_caucao,
                l.status_pedido,
                u.nome as usuario_nome,
                u.email as usuario_email,
                p.nome as produto_nome,
                p.foto_principal_url as foto_url
            FROM locacoes l
            INNER JOIN usuarios u ON l.id_usuario = u.id
            INNER JOIN itens_estoque ie ON l.id_item_estoque = ie.id
            INNER JOIN produtos p ON ie.id_produto = p.id
            ORDER BY l.id DESC
        ";
        
        $stmt = $db->query($sql);
        return $stmt->fetchAll();
    }
}
