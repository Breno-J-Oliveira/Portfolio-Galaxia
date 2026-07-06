<?php
/**
 * ARQON - THE VAULT | Auth Middleware (The Guard)
 * Caminho: /src/Middlewares/AuthMiddleware.php
 * Finalidade: Interceptar requisições, exigir a apresentação do Token JWT e validá-lo.
 */

declare(strict_types=1);

// Chama a nossa classe JWT que já criamos anteriormente
require_once __DIR__ . '/../utils/JWT.php';

class AuthMiddleware {
    
    /**
     * Verifica a validade do passe de acesso (Token).
     * Se falhar, encerra a execução na mesma hora (exit).
     * Se passar, devolve os dados do usuário.
     */
    public static function check(): array {
        // Captura todos os cabeçalhos enviados pelo Postman/Frontend
        $headers = self::getHeaders();
        
        // Procura pelo cabeçalho "Authorization"
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$authHeader) {
            self::bloquearAcesso(401, "Acesso bloqueado. O cabeçalho de Autorização (Authorization) está ausente.");
        }

        // O padrão esperado é "Bearer MEU_TOKEN_AQUI"
        $parts = explode(' ', $authHeader);
        if (count($parts) !== 2 || strcasecmp($parts[0], 'Bearer') !== 0) {
            self::bloquearAcesso(401, "Acesso bloqueado. Formato de token inválido. Padrão exigido: Bearer <token>");
        }

        $token = $parts[1];

        // Decodifica e valida matematicamente o Token usando a nossa chave secreta
        $decoded = JWT::decode($token);

        if (!$decoded) {
            self::bloquearAcesso(401, "Acesso bloqueado. Token inválido, expirado ou forjado.");
        }

        // Verifica se o token está na blacklist (logout realizado)
        $tokenHash = hash('sha256', $token);
        if (!class_exists('Database')) {
            require_once dirname(__DIR__, 3) . '/database.php';
        }
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT id FROM jwt_blacklist WHERE token_hash = ? AND expires_at > NOW()");
        $stmt->execute([$tokenHash]);
        if ($stmt->fetch()) {
            self::bloquearAcesso(401, "Acesso bloqueado. Sessão encerrada. Faça login novamente.");
        }

        // Se chegou aqui, o Token é 100% verdadeiro! Devolvemos os dados para o index.php
        return $decoded;
    }

    /**
     * Função auxiliar de compatibilidade para pegar cabeçalhos no Apache/Nginx
     */
    private static function getHeaders(): array {
        if (function_exists('apache_request_headers')) {
            return apache_request_headers();
        }
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) === 'HTTP_') {
                $headerName = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$headerName] = $value;
            }
        }
        return $headers;
    }

    /**
     * Encerra imediatamente a requisição devolvendo o Erro 401
     */
    private static function bloquearAcesso(int $code, string $message): void {
        http_response_code($code);
        echo json_encode([
            "status" => "error",
            "timestamp" => date('c'),
            "message" => $message
        ]);
        exit; // Mata o processo PHP aqui. O cofre não é aberto.
    }
}