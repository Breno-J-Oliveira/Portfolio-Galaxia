<?php
declare(strict_types=1);

require_once __DIR__ . '/../utils/JWT.php';

/**
 * ARQON - THE VAULT | Base Controller
 * Finalidade: Fornece métodos comuns a todos os controllers (autenticação, etc.)
 */
abstract class BaseController {

    /**
     * Fallback para getallheaders() em servidores sem Apache mod_php (ex: InfinityFree)
     */
    protected function getAllHeadersSafe(): array {
        if (function_exists('getallheaders')) {
            return getallheaders();
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
     * Auxiliar protegido para recuperar o ID do usuário de forma segura via JWT
     * Este método é compartilhado por todos os controllers que extendem BaseController
     */
    protected function getUserIdFromToken(): int {
        $headers = $this->getAllHeadersSafe();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new Exception("Não autenticado.", 401);
        }

        $decoded = JWT::decode($matches[1]);
        if (!isset($decoded['user_id']) && !isset($decoded['id_usuario'])) {
            throw new Exception("Token inválido.", 401);
        }

        return (int) ($decoded['user_id'] ?? $decoded['id_usuario']);
    }
}
