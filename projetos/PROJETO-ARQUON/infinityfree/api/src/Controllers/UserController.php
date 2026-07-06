<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../Models/Usuario.php';

/**
 * ARQON - THE VAULT | User Controller
 * Finalidade: Gerenciar perfil, avatar, endereços do usuário de forma dinâmica
 */
class UserController extends BaseController {
    
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
     * GET /api/me
     * Retorna dados do usuário logado
     */
    public function getMe(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $usuario = Usuario::buscarPorId($userId);
            
            if (!$usuario) {
                sendResponse([
                    "status" => "error",
                    "message" => "Usuário não encontrado."
                ], 404);
                return;
            }
            
            // Remove senha hash da resposta
            unset($usuario['senha_hash']);

            // Mapeia nivel_acesso para role (compatibilidade frontend)
            $usuario['role'] = $usuario['nivel_acesso'] ?? 'MEMBER';
            if (!isset($usuario['foto_url'])) {
                $usuario['foto_url'] = null;
            }

            sendResponse([
                "status" => "success",
                "data" => $usuario
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            sendResponse([
                "status" => "error",
                "message" => $e->getMessage()
            ], $code);
        }
    }

    /**
     * PUT /api/user/perfil
     * Atualiza dados do perfil
     */
    public function atualizarPerfil(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $nome = $input['nome'] ?? null;
            $cpf = $input['cpf'] ?? null;
            
            if (empty($nome)) {
                sendResponse([
                    "status" => "error",
                    "message" => "Nome é obrigatório."
                ], 400);
                return;
            }
            
            $db = Database::getInstance();
            
            $fields = [];
            $params = [':id' => $userId];
            
            if ($nome !== null) {
                $fields[] = "nome = :nome";
                $params[':nome'] = $nome;
            }
            if ($cpf !== null) {
                $fields[] = "cpf = :cpf";
                $params[':cpf'] = $cpf;
            }
            
            if (empty($fields)) {
                sendResponse([
                    "status" => "error",
                    "message" => "Nenhum campo para atualizar."
                ], 400);
                return;
            }
            
            $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            
            sendResponse([
                "status" => "success",
                "message" => "Perfil atualizado com sucesso."
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            sendResponse([
                "status" => "error",
                "message" => $e->getMessage()
            ], $code);
        }
    }

    /**
     * GET /api/user/metricas
     * Métricas do usuário (aluguéis, impacto, etc.)
     */
    public function getMetricas(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $db = Database::getInstance();
            
            // Total de locações
            $sqlLocacoes = "SELECT COUNT(*) as total FROM locacoes WHERE id_usuario = :id_usuario";
            $stmtLocacoes = $db->prepare($sqlLocacoes);
            $stmtLocacoes->execute([':id_usuario' => $userId]);
            $totalLocacoes = $stmtLocacoes->fetchColumn() ?: 0;
            
            // Valor total gasto
            $sqlGasto = "SELECT SUM(valor_aluguel) as total FROM locacoes WHERE id_usuario = :id_usuario AND status_pedido IN ('concluido', 'devolvido')";
            $stmtGasto = $db->prepare($sqlGasto);
            $stmtGasto->execute([':id_usuario' => $userId]);
            $valorGasto = $stmtGasto->fetchColumn() ?: 0;
            
            // Locações ativas
            $sqlAtivas = "SELECT COUNT(*) as total FROM locacoes WHERE id_usuario = :id_usuario AND status_pedido IN ('enviado', 'entregue')";
            $stmtAtivas = $db->prepare($sqlAtivas);
            $stmtAtivas->execute([':id_usuario' => $userId]);
            $locacoesAtivas = $stmtAtivas->fetchColumn() ?: 0;
            
            // Wishlist count
            $sqlWishlist = "SELECT COUNT(*) as total FROM wishlist WHERE id_usuario = :id_usuario";
            $stmtWishlist = $db->prepare($sqlWishlist);
            $stmtWishlist->execute([':id_usuario' => $userId]);
            $wishlistCount = $stmtWishlist->fetchColumn() ?: 0;
            
            sendResponse([
                "status" => "success",
                "data" => [
                    "total_locacoes" => (int)$totalLocacoes,
                    "valor_gasto" => (float)$valorGasto,
                    "locacoes_ativas" => (int)$locacoesAtivas,
                    "wishlist_count" => (int)$wishlistCount,
                    "co2_economizado" => $totalLocacoes * 5.5, // Estimativa: 5.5kg CO2 por aluguel
                    "agua_economizada" => $totalLocacoes * 2700 // Estimativa: 2700L água por aluguel
                ]
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            sendResponse([
                "status" => "error",
                "message" => $e->getMessage()
            ], $code);
        }
    }

    /**
     * POST /api/user/upload_avatar
     * Upload de foto do usuário
     */
    public function uploadAvatar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            error_log("[AVATAR] Start. User={$userId}");

            if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
                error_log("[AVATAR] Upload error. FILES=" . print_r($_FILES, true));
                sendResponse(["status" => "error", "message" => "Erro no upload ou arquivo não enviado"], 400);
                return;
            }

            $file = $_FILES['avatar'];
            error_log("[AVATAR] File received: " . $file['name'] . " tmp=" . $file['tmp_name'] . " size=" . $file['size']);
            
            $targetDir = __DIR__ . '/../../../public/uploads/avatars/';
            error_log("[AVATAR] Target dir: {$targetDir}");
            
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0775, true);
            }

            $fileName = "avatar_user_" . $userId . "_" . time() . ".png";
            $filePath = $targetDir . $fileName;
            error_log("[AVATAR] Target path: {$filePath}");

            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                $publicUrl = "/public/uploads/avatars/" . $fileName;
                
                Usuario::atualizarAvatar($userId, $publicUrl);

                sendResponse([
                    "status" => "success",
                    "message" => "Avatar atualizado com sucesso",
                    "foto_url" => $publicUrl
                ], 200);
            } else {
                $err = error_get_last();
                sendResponse(["status" => "error", "message" => "Falha ao mover arquivo: " . ($err['message'] ?? 'Erro desconhecido')], 500);
            }

        } catch (Exception $e) {
            error_log("[AVATAR] Exception: " . $e->getMessage());
            sendResponse(["status" => "error", "message" => $e->getMessage()], 500);
        }
    }
}