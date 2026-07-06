<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Wishlist Model
 * Finalidade: Gerenciar lista de desejos no banco de dados
 */
class Wishlist {
    
    /**
     * Lista todos os produtos na wishlist do usuário
     */
    public static function listarPorUsuario(int $idUsuario): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                w.id as wishlist_id,
                p.id,
                p.nome,
                p.descricao,
                p.valor_diaria,
                p.valor_mercado,
                p.foto_principal_url as foto_url,
                m.nome as marca,
                c.nome as categoria,
                e.nome as estilo
            FROM wishlist w
            INNER JOIN produtos p ON w.id_produto = p.id
            LEFT JOIN marcas m ON p.id_marca = m.id
            LEFT JOIN categorias c ON p.id_categoria = c.id
            LEFT JOIN estilos e ON p.id_estilo = e.id
            WHERE w.id_usuario = :id_usuario
            ORDER BY w.id DESC
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Adiciona produto à wishlist
     */
    public static function adicionar(int $idUsuario, int $idProduto): bool {
        $db = Database::getInstance();
        
        // Verifica se já existe
        $checkSql = "SELECT id FROM wishlist WHERE id_usuario = :id_usuario AND id_produto = :id_produto LIMIT 1";
        $checkStmt = $db->prepare($checkSql);
        $checkStmt->execute([':id_usuario' => $idUsuario, ':id_produto' => $idProduto]);
        
        if ($checkStmt->fetch()) {
            return false; // Já existe na wishlist
        }
        
        // Verifica se o produto existe
        $prodSql = "SELECT id FROM produtos WHERE id = :id_produto LIMIT 1";
        $prodStmt = $db->prepare($prodSql);
        $prodStmt->execute([':id_produto' => $idProduto]);
        
        if (!$prodStmt->fetch()) {
            throw new Exception("Produto não encontrado.", 404);
        }
        
        // Adiciona à wishlist
        $sql = "INSERT INTO wishlist (id_usuario, id_produto) VALUES (:id_usuario, :id_produto)";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([
            ':id_usuario' => $idUsuario,
            ':id_produto' => $idProduto
        ]);
    }
    
    /**
     * Remove produto da wishlist
     */
    public static function remover(int $idUsuario, int $idProduto): bool {
        $db = Database::getInstance();
        
        $sql = "DELETE FROM wishlist WHERE id_usuario = :id_usuario AND id_produto = :id_produto";
        $stmt = $db->prepare($sql);
        
        $stmt->execute([
            ':id_usuario' => $idUsuario,
            ':id_produto' => $idProduto
        ]);
        
        return $stmt->rowCount() > 0;
    }
    
    /**
     * Verifica se produto está na wishlist
     */
    public static function verificar(int $idUsuario, int $idProduto): bool {
        $db = Database::getInstance();
        
        $sql = "SELECT id FROM wishlist WHERE id_usuario = :id_usuario AND id_produto = :id_produto LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario, ':id_produto' => $idProduto]);
        
        return (bool) $stmt->fetch();
    }
    
    /**
     * Limpa toda a wishlist do usuário
     */
    public static function limpar(int $idUsuario): bool {
        $db = Database::getInstance();
        
        $sql = "DELETE FROM wishlist WHERE id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id_usuario' => $idUsuario]);
    }
}
