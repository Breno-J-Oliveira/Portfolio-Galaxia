<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Carrinho Model
 * Finalidade: Gerenciar carrinho de compras (usando tabela temporária ou localStorage)
 * Nota: Para MVP, vamos usar uma tabela temporária para carrinhos não finalizados
 */
class Carrinho {
    
    /**
     * Lista itens do carrinho do usuário
     */
    public static function listarPorUsuario(int $idUsuario): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                c.id as carrinho_id,
                c.quantidade,
                c.data_inicio,
                c.data_fim,
                p.id as produto_id,
                p.nome,
                p.descricao,
                p.valor_diaria,
                (p.valor_diaria * 2) as valor_caucao,
                p.foto_principal_url as foto_url,
                m.nome as marca,
                cat.nome as categoria
            FROM carrinho_temp c
            INNER JOIN produtos p ON c.id_produto = p.id
            LEFT JOIN marcas m ON p.id_marca = m.id
            LEFT JOIN categorias cat ON p.id_categoria = cat.id
            WHERE c.id_usuario = :id_usuario
            ORDER BY c.id DESC
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Adiciona item ao carrinho
     */
    public static function adicionar(
        int $idUsuario,
        int $idProduto,
        int $quantidade = 1,
        ?string $dataInicio = null,
        ?string $dataFim = null
    ): int {
        $db = Database::getInstance();
        
        // Verifica se o produto existe
        $prodSql = "SELECT valor_diaria FROM produtos WHERE id = :id_produto LIMIT 1";
        $prodStmt = $db->prepare($prodSql);
        $prodStmt->execute([':id_produto' => $idProduto]);
        $produto = $prodStmt->fetch();
        
        if (!$produto) {
            throw new Exception("Produto não encontrado.", 404);
        }
        
        // Verifica se já existe no carrinho
        $checkSql = "SELECT id, quantidade FROM carrinho_temp WHERE id_usuario = :id_usuario AND id_produto = :id_produto LIMIT 1";
        $checkStmt = $db->prepare($checkSql);
        $checkStmt->execute([':id_usuario' => $idUsuario, ':id_produto' => $idProduto]);
        $existente = $checkStmt->fetch();
        
        if ($existente) {
            // Atualiza quantidade
            $sql = "UPDATE carrinho_temp SET quantidade = quantidade + :quantidade WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([':quantidade' => $quantidade, ':id' => $existente['id']]);
            return (int) $existente['id'];
        }
        
        // Adiciona novo item
        $sql = "
            INSERT INTO carrinho_temp 
            (id_usuario, id_produto, quantidade, data_inicio, data_fim, data_criacao)
            VALUES 
            (:id_usuario, :id_produto, :quantidade, :data_inicio, :data_fim, NOW())
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id_usuario' => $idUsuario,
            ':id_produto' => $idProduto,
            ':quantidade' => $quantidade,
            ':data_inicio' => $dataInicio,
            ':data_fim' => $dataFim
        ]);
        
        return (int) $db->lastInsertId();
    }
    
    /**
     * Atualiza item do carrinho
     */
    public static function atualizar(
        int $idUsuario,
        int $id,
        ?int $quantidade = null,
        ?string $dataInicio = null,
        ?string $dataFim = null
    ): bool {
        $db = Database::getInstance();
        
        $fields = [];
        $params = [':id_usuario' => $idUsuario, ':id' => $id];
        
        if ($quantidade !== null) {
            $fields[] = "quantidade = :quantidade";
            $params[':quantidade'] = $quantidade;
        }
        if ($dataInicio !== null) {
            $fields[] = "data_inicio = :data_inicio";
            $params[':data_inicio'] = $dataInicio;
        }
        if ($dataFim !== null) {
            $fields[] = "data_fim = :data_fim";
            $params[':data_fim'] = $dataFim;
        }
        
        if (empty($fields)) {
            return false;
        }
        
        $sql = "UPDATE carrinho_temp SET " . implode(', ', $fields) . " WHERE id = :id AND id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute($params) && $stmt->rowCount() > 0;
    }
    
    /**
     * Remove item do carrinho
     */
    public static function remover(int $idUsuario, int $id): bool {
        $db = Database::getInstance();
        
        $sql = "DELETE FROM carrinho_temp WHERE id = :id AND id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id' => $id, ':id_usuario' => $idUsuario]) && $stmt->rowCount() > 0;
    }
    
    /**
     * Limpa carrinho do usuário
     */
    public static function limpar(int $idUsuario): bool {
        $db = Database::getInstance();
        
        $sql = "DELETE FROM carrinho_temp WHERE id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id_usuario' => $idUsuario]);
    }
    
    /**
     * Calcula total do carrinho
     */
    public static function calcularTotal(int $idUsuario): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                SUM(p.valor_diaria * c.quantidade) as subtotal_aluguel,
                SUM(p.valor_diaria * 2 * c.quantidade) as subtotal_caucao,
                COUNT(*) as total_itens
            FROM carrinho_temp c
            INNER JOIN produtos p ON c.id_produto = p.id
            WHERE c.id_usuario = :id_usuario
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        $result = $stmt->fetch();
        
        return [
            'subtotal_aluguel' => (float)($result['subtotal_aluguel'] ?? 0),
            'subtotal_caucao' => (float)($result['subtotal_caucao'] ?? 0),
            'total' => (float)(($result['subtotal_aluguel'] ?? 0) + ($result['subtotal_caucao'] ?? 0)),
            'total_itens' => (int)($result['total_itens'] ?? 0)
        ];
    }
}
