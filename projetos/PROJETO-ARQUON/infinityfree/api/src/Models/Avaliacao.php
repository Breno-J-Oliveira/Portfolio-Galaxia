<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Avaliacao Model
 * Finalidade: Gerenciar avaliações de produtos no banco de dados
 */
class Avaliacao {
    
    /**
     * Lista avaliações de um produto
     */
    public static function listarPorProduto(int $idProduto): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                a.id,
                a.nota,
                a.comentario,
                a.data_criacao,
                u.nome as nome_usuario,
                u.foto_url as avatar_usuario
            FROM avaliacoes a
            INNER JOIN usuarios u ON a.id_usuario = u.id
            WHERE a.id_produto = :id_produto
            ORDER BY a.data_criacao DESC
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_produto' => $idProduto]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Lista avaliações de um usuário
     */
    public static function listarPorUsuario(int $idUsuario): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                a.id,
                a.nota,
                a.comentario,
                a.data_criacao,
                p.nome as nome_produto,
                p.foto_principal_url as foto_produto
            FROM avaliacoes a
            INNER JOIN produtos p ON a.id_produto = p.id
            WHERE a.id_usuario = :id_usuario
            ORDER BY a.data_criacao DESC
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Adiciona nova avaliação
     */
    public static function adicionar(int $idUsuario, int $idProduto, int $nota, string $comentario): int {
        $db = Database::getInstance();
        
        $sql = "
            INSERT INTO avaliacoes (id_usuario, id_produto, nota, comentario, data_criacao)
            VALUES (:id_usuario, :id_produto, :nota, :comentario, NOW())
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id_usuario' => $idUsuario,
            ':id_produto' => $idProduto,
            ':nota' => $nota,
            ':comentario' => $comentario
        ]);
        
        return (int) $db->lastInsertId();
    }
    
    /**
     * Remove avaliação
     */
    public static function remover(int $idUsuario, int $id): bool {
        $db = Database::getInstance();
        
        $sql = "DELETE FROM avaliacoes WHERE id = :id AND id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id' => $id, ':id_usuario' => $idUsuario]) && $stmt->rowCount() > 0;
    }
    
    /**
     * Verifica se usuário já avaliou o produto
     */
    public static function verificarSeAvaliou(int $idUsuario, int $idProduto): bool {
        $db = Database::getInstance();
        
        $sql = "SELECT id FROM avaliacoes WHERE id_usuario = :id_usuario AND id_produto = :id_produto LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario, ':id_produto' => $idProduto]);
        
        return (bool) $stmt->fetch();
    }
    
    /**
     * Calcula média de avaliações de um produto
     */
    public static function calcularMedia(int $idProduto): float {
        $db = Database::getInstance();
        
        $sql = "SELECT AVG(nota) as media FROM avaliacoes WHERE id_produto = :id_produto";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_produto' => $idProduto]);
        
        $result = $stmt->fetch();
        return $result ? (float) $result['media'] : 0.0;
    }
    
    /**
     * Conta total de avaliações de um produto
     */
    public static function contarTotal(int $idProduto): int {
        $db = Database::getInstance();
        
        $sql = "SELECT COUNT(*) as total FROM avaliacoes WHERE id_produto = :id_produto";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_produto' => $idProduto]);
        
        $result = $stmt->fetch();
        return $result ? (int) $result['total'] : 0;
    }
}
