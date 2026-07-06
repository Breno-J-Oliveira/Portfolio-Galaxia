<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Endereco Model
 * Finalidade: Gerenciar endereços de entrega no banco de dados
 */
class Endereco {
    
    /**
     * Lista todos os endereços do usuário
     */
    public static function listarPorUsuario(int $idUsuario): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                id,
                titulo,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                padrao_entrega
            FROM usuarios_enderecos
            WHERE id_usuario = :id_usuario
            ORDER BY padrao_entrega DESC, id DESC
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Adiciona novo endereço
     */
    public static function adicionar(
        int $idUsuario,
        string $titulo,
        string $cep,
        string $logradouro,
        string $numero,
        ?string $bairro = null,
        ?string $cidade = null,
        bool $padrao = false
    ): int {
        $db = Database::getInstance();
        
        $sql = "
            INSERT INTO usuarios_enderecos 
            (id_usuario, titulo, cep, logradouro, numero, bairro, cidade, padrao_entrega)
            VALUES 
            (:id_usuario, :titulo, :cep, :logradouro, :numero, :bairro, :cidade, :padrao)
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id_usuario' => $idUsuario,
            ':titulo' => $titulo,
            ':cep' => $cep,
            ':logradouro' => $logradouro,
            ':numero' => $numero,
            ':bairro' => $bairro,
            ':cidade' => $cidade,
            ':padrao' => $padrao ? 1 : 0
        ]);
        
        return (int) $db->lastInsertId();
    }
    
    /**
     * Atualiza endereço existente
     */
    public static function atualizar(
        int $idUsuario,
        int $id,
        ?string $titulo = null,
        ?string $cep = null,
        ?string $logradouro = null,
        ?string $numero = null,
        ?string $bairro = null,
        ?string $cidade = null,
        ?bool $padrao = null
    ): bool {
        $db = Database::getInstance();
        
        // Constrói a query dinamicamente baseado nos campos fornecidos
        $fields = [];
        $params = [':id_usuario' => $idUsuario, ':id' => $id];
        
        if ($titulo !== null) {
            $fields[] = "titulo = :titulo";
            $params[':titulo'] = $titulo;
        }
        if ($cep !== null) {
            $fields[] = "cep = :cep";
            $params[':cep'] = $cep;
        }
        if ($logradouro !== null) {
            $fields[] = "logradouro = :logradouro";
            $params[':logradouro'] = $logradouro;
        }
        if ($numero !== null) {
            $fields[] = "numero = :numero";
            $params[':numero'] = $numero;
        }
        if ($bairro !== null) {
            $fields[] = "bairro = :bairro";
            $params[':bairro'] = $bairro;
        }
        if ($cidade !== null) {
            $fields[] = "cidade = :cidade";
            $params[':cidade'] = $cidade;
        }
        if ($padrao !== null) {
            $fields[] = "padrao_entrega = :padrao";
            $params[':padrao'] = $padrao ? 1 : 0;
        }
        
        if (empty($fields)) {
            return false;
        }
        
        $sql = "UPDATE usuarios_enderecos SET " . implode(', ', $fields) . " WHERE id = :id AND id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute($params);
    }
    
    /**
     * Remove endereço
     */
    public static function remover(int $idUsuario, int $id): bool {
        $db = Database::getInstance();
        
        $sql = "DELETE FROM usuarios_enderecos WHERE id = :id AND id_usuario = :id_usuario";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id' => $id, ':id_usuario' => $idUsuario]) && $stmt->rowCount() > 0;
    }
    
    /**
     * Define endereço como padrão (remove padrão dos outros)
     */
    public static function definirPadrao(int $idUsuario, int $id): bool {
        $db = Database::getInstance();
        
        try {
            $db->beginTransaction();
            
            // Remove padrão de todos os endereços do usuário
            $sql1 = "UPDATE usuarios_enderecos SET padrao_entrega = 0 WHERE id_usuario = :id_usuario";
            $stmt1 = $db->prepare($sql1);
            $stmt1->execute([':id_usuario' => $idUsuario]);
            
            // Define o novo padrão
            $sql2 = "UPDATE usuarios_enderecos SET padrao_entrega = 1 WHERE id = :id AND id_usuario = :id_usuario";
            $stmt2 = $db->prepare($sql2);
            $stmt2->execute([':id' => $id, ':id_usuario' => $idUsuario]);
            
            $db->commit();
            return true;
        } catch (Exception $e) {
            $db->rollBack();
            return false;
        }
    }
    
    /**
     * Busca endereço por ID
     */
    public static function buscarPorId(int $idUsuario, int $id): ?array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                id,
                titulo,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                padrao_entrega
            FROM usuarios_enderecos
            WHERE id = :id AND id_usuario = :id_usuario
            LIMIT 1
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $id, ':id_usuario' => $idUsuario]);
        
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    /**
     * Busca endereço padrão do usuário
     */
    public static function buscarPadrao(int $idUsuario): ?array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                id,
                titulo,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                padrao_entrega
            FROM usuarios_enderecos
            WHERE id_usuario = :id_usuario AND padrao_entrega = 1
            LIMIT 1
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id_usuario' => $idUsuario]);
        
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
