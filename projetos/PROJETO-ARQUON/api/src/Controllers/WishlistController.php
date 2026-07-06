<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Wishlist.php';
require_once __DIR__ . '/../Middlewares/AuthMiddleware.php';

/**
 * ARQON - THE VAULT | Wishlist Controller
 * Finalidade: Gerenciar lista de desejos do usuário
 */
class WishlistController {
    
    private function getUserIdFromToken(): int {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new Exception("Não autenticado.", 401);
        }
        
        require_once __DIR__ . '/../utils/JWT.php';
        $decoded = JWT::decode($matches[1]);
        if (!isset($decoded['user_id']) && !isset($decoded['id_usuario'])) {
            throw new Exception("Token inválido.", 401);
        }
        
        return (int) ($decoded['user_id'] ?? $decoded['id_usuario']);
    }
    
    /**
     * GET /api/wishlist
     * Lista todos os produtos na wishlist do usuário
     */
    public function listar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $wishlist = Wishlist::listarPorUsuario($userId);
            
            echo json_encode([
                "status" => "success",
                "data" => $wishlist
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
     * POST /api/wishlist
     * Adiciona produto à wishlist
     */
    public function adicionar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $idProduto = $input['id_produto'] ?? null;
            if (!$idProduto) {
                throw new Exception("ID do produto obrigatório.", 400);
            }
            
            $resultado = Wishlist::adicionar($userId, (int)$idProduto);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Produto adicionado à wishlist."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Produto já está na wishlist."
                ]);
            }
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * DELETE /api/wishlist
     * Remove produto da wishlist
     */
    public function remover(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $idProduto = $_GET['id_produto'] ?? null;
            
            if (!$idProduto) {
                throw new Exception("ID do produto obrigatório.", 400);
            }
            
            $resultado = Wishlist::remover($userId, (int)$idProduto);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Produto removido da wishlist."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Produto não encontrado na wishlist."
                ]);
            }
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /api/wishlist/verificar
     * Verifica se produto está na wishlist
     */
    public function verificar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $idProduto = $_GET['id_produto'] ?? null;
            
            if (!$idProduto) {
                throw new Exception("ID do produto obrigatório.", 400);
            }
            
            $estaNaWishlist = Wishlist::verificar($userId, (int)$idProduto);
            
            echo json_encode([
                "status" => "success",
                "na_wishlist" => $estaNaWishlist
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
