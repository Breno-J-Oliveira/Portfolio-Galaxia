<?php
/** @psalm-suppress MissingClassMethod @psalm-suppress InvalidClass @phpstan-ignore-next-line */
/**
 * ARQON - THE VAULT | Database Connection Manager
 * Padrão: Singleton
 */

declare(strict_types=1);

// 🔍 Garante que o config.php esteja carregado para existirem as constantes do banco
if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

class Database {
    /** @var \PDO|null $instance */
    private static $instance = null;

    private function __construct() {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Blindagem nativa contra SQL Injection
        ];

        try {
            /** @var \PDO $pdoInstance */
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("ARQON DB ERROR: " . $e->getMessage());
            http_response_code(500);
            die(json_encode([
                "status" => "error", 
                "message" => "O Cofre está temporariamente inacessível. Falha de conexão."
            ]));
        }
    }

    private function __clone() {}

    public function __wakeup() {
        throw new Exception("Não é possível desserializar um Singleton.");
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            new self();
        }
        return self::$instance;
    }
}