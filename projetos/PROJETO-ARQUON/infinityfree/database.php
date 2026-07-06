<?php
/**
 * ARQON - THE VAULT | Database Connection Manager
 * Padrão: Singleton (Corrigido)
 */

declare(strict_types=1);

// 🔍 Garante que o config.php esteja carregado para existiren as constantes do banco
if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

class Database {
    // Definido explicitamente como ?PDO para tipagem forte
    private static ?PDO $instance = null;

    // O construtor deve ficar completamente vazio e privado
    private function __construct() {}

    /**
     * Retorna a instância única e nativa do PDO
     */
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false, // Proteção nativa contra SQL Injection
            ];

            try {
                // A atribuição do PDO acontece aqui de forma isolada e segura
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                error_log("ARQON DB ERROR: " . $e->getMessage());
                http_response_code(500);
                die(json_encode([
                    "status" => "error", 
                    "message" => "ERRO REAL DO MYSQL: " . $e->getMessage()
                ]));
            }
        }
        return self::$instance;
    }

    private function __clone() {}
}