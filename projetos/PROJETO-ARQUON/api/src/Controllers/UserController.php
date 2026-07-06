<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Usuario.php';
require_once __DIR__ . '/../Utils/JWT.php';

/**
 * ARQON - THE VAULT | User Controller
 * Finalidade: Gerenciar perfil, avatar, endereços do usuário de forma dinâmica
 */
class UserController {
    
    /**
     * Auxiliar privado para recuperar o ID do usuário de forma segura via JWT
     */
    private function getUserIdFromToken(): int {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new Exception("Não autenticado.", 401);
        }
        
        $decoded = JWT::decode($matches[1]);
        if (!isset($decoded->id_usuario)) {
            throw new Exception("Token inválido.", 401);
        }
        
        return (int) $decoded->id_usuario;
    }
    
    /**
     * GET /api/user/perfil
     * ✅ CORREÇÃO: Retorna os dados REAIS do banco de dados
     */
    public function getPerfil(): void {
        try {
            $userId = $this->getUserIdFromToken();
            
            // Busca dados reais do banco usando o modelo
            $dados = Usuario::buscarPorId($userId);
            
            if (!$dados) {
                sendResponse(["status" => "error", "message" => "Usuário não encontrado"], 404);
                return;
            }

            sendResponse([
                "status" => "success",
                "data" => $dados
            ], 200);

        } catch (Exception $e) {
            $code = $e->getCode() == 401 ? 401 : 500;
            sendResponse(["status" => "error", "message" => $e->getMessage()], $code);
        }
    }

    /**
     * POST /api/user/upload_avatar
     * Upload de foto do usuário
     */
    public function uploadAvatar(): void {
        try {
            $userId = $this->getUserIdFromToken();

            if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
                sendResponse(["status" => "error", "message" => "Erro no upload ou arquivo não enviado"], 400);
                return;
            }

            $file = $_FILES['avatar'];
            
            // ✅ DIRETÓRIO DO UPLOAD: Garanta que a pasta public/uploads/avatars exista
            $targetDir = __DIR__ . '/../../public/uploads/avatars/';
            
            if (!is_dir($targetDir)) {
                // Tenta criar a pasta recursivamente com permissões corretas se ela não existir
                mkdir($targetDir, 0775, true);
            }

            $fileName = "avatar_user_" . $userId . "_" . time() . ".png";
            $filePath = $targetDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                $publicUrl = "/PROJETO-ARQUON/public/uploads/avatars/" . $fileName;
                
                // Salva o caminho real da nova imagem no banco de dados do usuário
                Usuario::atualizarAvatar($userId, $publicUrl);

                sendResponse([
                    "status" => "success",
                    "message" => "Avatar atualizado com sucesso",
                    "foto_url" => $publicUrl
                ], 200);
            } else {
                sendResponse(["status" => "error", "message" => "Falha ao mover arquivo no servidor. Verifique permissões de escrita."], 500);
            }

        } catch (Exception $e) {
            sendResponse(["status" => "error", "message" => $e->getMessage()], 500);
        }
    }
}