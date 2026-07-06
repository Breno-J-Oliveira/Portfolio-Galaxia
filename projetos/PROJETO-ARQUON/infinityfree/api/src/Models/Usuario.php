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
        
        $sql = "SELECT u.id, u.email, u.senha_hash, u.id_nivel_acesso, u.nome, u.foto_url,
                       n.nome AS nivel_nome
                FROM usuarios u
                INNER JOIN niveis_acesso n ON n.id = u.id_nivel_acesso
                WHERE u.email = :email
                LIMIT 1";
        
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

    /**
     * Busca um usuário por ID
     */
    public static function buscarPorId(int $id): array|false {
        $db = Database::getInstance();
        
        $sql = "SELECT u.id, u.email, u.nome, u.foto_url, u.senha_hash, u.status, u.data_criacao,
                       n.nome AS nivel_acesso, n.id AS id_nivel_acesso
                FROM usuarios u
                INNER JOIN niveis_acesso n ON n.id = u.id_nivel_acesso
                WHERE u.id = :id
                LIMIT 1";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        return $stmt->fetch();
    }

    /**
     * Registra um novo membro/artefato de acesso no ecossistema ARQON.
     * Vincula por padrão ao nível 'MEMBER' (ID: 1) de acordo com o IAM.
     */
    public static function criar(string $nome, string $email, string $senhaHash, ?string $fotoUrl = null): int|false {
        $db = Database::getInstance();

        // 1. Evita duplicação de identidades no cofre
        $checkSql = "SELECT id FROM usuarios WHERE email = :email LIMIT 1";
        $checkStmt = $db->prepare($checkSql);
        $checkStmt->execute([':email' => $email]);
        
        if ($checkStmt->fetch()) {
            return false; 
        }

        // 2. Define o fallback se a foto estiver vazia ou nula
        $fotoFinal = (!empty($fotoUrl)) ? $fotoUrl : 'assets/images/default-avatar.png';

        // 3. Persistência segura com Prepared Statements
        $sql = "INSERT INTO usuarios (nome, email, senha_hash, id_nivel_acesso, foto_url) 
                VALUES (:nome, :email, :senha_hash, :id_nivel_acesso, :foto_url)";
        
        $stmt = $db->prepare($sql);
        $sucesso = $stmt->execute([
            ':nome'            => $nome,
            ':email'           => $email,
            ':senha_hash'      => $senhaHash,
            ':id_nivel_acesso' => 1, // Nível 'MEMBER' padrão via IAM
            ':foto_url'        => $fotoFinal
        ]);

        if ($sucesso) {
            return (int)$db->lastInsertId();
        }

        return false;
    }
}