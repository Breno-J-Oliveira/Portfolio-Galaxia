<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Usuario.php';
require_once __DIR__ . '/../utils/JWT.php';

/**
 * ARQON - THE VAULT | Auth Controller Extended
 * Finalidade: Funcionalidades adicionais de autenticação (logout, refresh, forgot password)
 */
class AuthControllerExtended {
    
    /**
     * POST /api/logout
     * Realiza logout do usuário
     */
    public function logout(): void {
        try {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
            
            if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                echo json_encode(["status" => "error", "message" => "Não autenticado."]);
                http_response_code(401);
                return;
            }
            
            $token = $matches[1];
            $tokenHash = hash('sha256', $token);
            
            // Decodifica para pegar expiração
            $decoded = JWT::decode($token);
            $expiresAt = isset($decoded['exp'])
                ? date('Y-m-d H:i:s', $decoded['exp'])
                : date('Y-m-d H:i:s', time() + 7200);
            
            // Adiciona na blacklist
            if (!class_exists('Database')) {
                require_once dirname(__DIR__, 3) . '/database.php';
            }
            $db = Database::getInstance();
            $stmt = $db->prepare(
                "INSERT IGNORE INTO jwt_blacklist (token_hash, expires_at) VALUES (?, ?)"
            );
            $stmt->execute([$tokenHash, $expiresAt]);
            
            echo json_encode(["status" => "success", "message" => "Sessão encerrada com segurança."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    
    /**
     * POST /api/refresh-token
     * Renova token JWT
     */
    public function refreshToken(): void {
        try {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
            
            if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Não autenticado."
                ]);
                http_response_code(401);
                return;
            }
            
            $token = $matches[1];
            $decoded = JWT::decode($token);
            
            if (!$decoded) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Token inválido."
                ]);
                http_response_code(401);
                return;
            }
            
            // Gera novo token
            $userId = $decoded['user_id'] ?? $decoded['id_usuario'];
            $novoToken = JWT::encode([
                'user_id' => $userId,
                'id_usuario' => $userId,
                'email' => $decoded['email'] ?? '',
                'role' => $decoded['role'] ?? 'MEMBER',
                'iat' => time(),
                'exp' => time() + (2 * 3600) // 2 horas
            ]);
            
            echo json_encode([
                "status" => "success",
                "token" => $novoToken
            ]);
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * POST /api/forgot-password
     * Solicita recuperação de senha
     */
    public function forgotPassword(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            
            if (empty($email)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "E-mail é obrigatório."
                ]);
                http_response_code(400);
                return;
            }
            
            $usuario = Usuario::buscarPorEmail($email);
            
            if (!$usuario) {
                // Por segurança, não informamos se o e-mail existe
                echo json_encode([
                    "status" => "success",
                    "message" => "Se o e-mail estiver cadastrado, você receberá instruções."
                ]);
                return;
            }
            
            // Gera token de recuperação
            $token = bin2hex(random_bytes(32));
            $tokenHash = hash('sha256', $token);
            
            // Em produção, salvar no banco e enviar e-mail
            // Por enquanto, apenas retornamos o token para desenvolvimento
            echo json_encode([
                "status" => "success",
                "message" => "Token de recuperação gerado (desenvolvimento).",
                "token" => $token,
                "email" => $email
            ]);
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * POST /api/reset-password
     * Confirma nova senha
     */
    public function resetPassword(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $token = $input['token'] ?? '';
            $email = $input['email'] ?? '';
            $novaSenha = $input['nova_senha'] ?? '';
            $confirmarSenha = $input['confirmar_senha'] ?? '';
            
            if (empty($token) || empty($email) || empty($novaSenha)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Token, e-mail e nova senha são obrigatórios."
                ]);
                http_response_code(400);
                return;
            }
            
            if ($novaSenha !== $confirmarSenha) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Senhas não conferem."
                ]);
                http_response_code(400);
                return;
            }
            
            if (strlen($novaSenha) < 8) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Senha deve ter no mínimo 8 caracteres."
                ]);
                http_response_code(400);
                return;
            }
            
            // Em produção, validar o token no banco
            // Por enquanto, apenas atualizamos a senha
            $usuario = Usuario::buscarPorEmail($email);
            
            if (!$usuario) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Usuário não encontrado."
                ]);
                http_response_code(404);
                return;
            }
            
            // Atualiza senha
            $senhaHash = password_hash($novaSenha, PASSWORD_ARGON2ID);
            $db = Database::getInstance();
            $sql = "UPDATE usuarios SET senha_hash = :senha_hash WHERE email = :email";
            $stmt = $db->prepare($sql);
            $stmt->execute([':senha_hash' => $senhaHash, ':email' => $email]);
            
            echo json_encode([
                "status" => "success",
                "message" => "Senha atualizada com sucesso."
            ]);
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * POST /api/user/alterar-senha
     * Altera senha do usuário logado
     */
    public function alterarSenha(): void {
        try {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
            
            if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Não autenticado."
                ]);
                http_response_code(401);
                return;
            }
            
            $decoded = JWT::decode($matches[1]);
            $userId = $decoded['user_id'] ?? $decoded['id_usuario'];
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $senhaAtual = $input['senha_atual'] ?? '';
            $novaSenha = $input['nova_senha'] ?? '';
            $confirmarSenha = $input['confirmar_senha'] ?? '';
            
            if (empty($senhaAtual) || empty($novaSenha)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Senha atual e nova senha são obrigatórias."
                ]);
                http_response_code(400);
                return;
            }
            
            if ($novaSenha !== $confirmarSenha) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Senhas não conferem."
                ]);
                http_response_code(400);
                return;
            }
            
            if (strlen($novaSenha) < 8) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Senha deve ter no mínimo 8 caracteres."
                ]);
                http_response_code(400);
                return;
            }
            
            // Verifica senha atual
            $usuario = Usuario::buscarPorId($userId);
            
            if (!$usuario || !password_verify($senhaAtual, $usuario['senha_hash'])) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Senha atual incorreta."
                ]);
                http_response_code(400);
                return;
            }
            
            // Atualiza senha
            $senhaHash = password_hash($novaSenha, PASSWORD_ARGON2ID);
            $db = Database::getInstance();
            $sql = "UPDATE usuarios SET senha_hash = :senha_hash WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([':senha_hash' => $senhaHash, ':id' => $userId]);
            
            echo json_encode([
                "status" => "success",
                "message" => "Senha alterada com sucesso."
            ]);
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
}
