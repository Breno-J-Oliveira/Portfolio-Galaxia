<?php
/**
 * ARQON - THE VAULT | Model de Usuário
 * Diretório: api/src/Models/Usuario.php
 */
declare(strict_types=1);

if (!class_exists('Database')) {
    // dirname(__DIR__, 3) sobe EXATAMENTE 3 níveis, chegando na raiz do projeto
    require_once dirname(__DIR__, 3) . '/database.php'; 
}

class Usuario {
    
    /**
     * Busca um usuário pelo e-mail para autenticação.
     * Sincronizado com o Módulo de Identidade e Acessos (IAM).
     */
    public static function buscarPorEmail(string $email): array|false {
        $db = Database::getInstance();
        
        $sql = "SELECT id, email, senha_hash, id_nivel_acesso, nome, foto_url 
                FROM usuarios 
                WHERE email = :email \r\n" .
               "LIMIT 1";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':email' => $email]);
        
        return $stmt->fetch();
    }

    /**
     * Atualiza a URL da foto de perfil do usuário.
     */
    public static function atualizarAvatar(int $id, string $url): bool {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE usuarios SET foto_url = :url WHERE id = :id");
        return $stmt->execute([
            ':url' => $url,
            ':id' => $id
        ]);
    }
}