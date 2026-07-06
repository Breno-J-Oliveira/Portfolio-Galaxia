<?php
/**
 * ARQON - THE VAULT | Global Configuration Center
 */

declare(strict_types=1);

// Carregar variáveis de ambiente do arquivo .env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

define('ENVIRONMENT', $_ENV['ENVIRONMENT'] ?? getenv('ENVIRONMENT') ?: 'production'); 

if (ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// 2. CREDENCIAIS DO BANCO DE DADOS
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'arqon_db');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_CHARSET', 'utf8mb4');

// 3. IDENTIDADES MESTRES
define('ADMIN_EMAIL', $_ENV['ADMIN_EMAIL'] ?? 'admin@arqon.com');
define('SYSTEM_NAME', 'ARQON - THE VAULT');

// 4. SEGURANÇA E CRIPTOGRAFIA
define('JWT_SECRET_KEY', $_ENV['JWT_SECRET_KEY'] ?? 'arqon-dev-secret-key-change-in-production-2024');
define('JWT_EXPIRATION', (int)($_ENV['JWT_EXPIRATION'] ?? 7200));
define('HASH_ALGO', defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT);

// 5. CONFIGURAÇÕES DE API / CORS
define('ALLOWED_ORIGIN', $_ENV['ALLOWED_ORIGIN'] ?? (ENVIRONMENT === 'development' 
    ? 'http://localhost/' 
    : 'https://www.arqon.com.br'
));

// 6. CAMINHOS E URLS
define('BASE_URL', $_ENV['BASE_URL'] ?? 'http://localhost/');
define('UPLOAD_PATH', __DIR__ . '/public/uploads/');