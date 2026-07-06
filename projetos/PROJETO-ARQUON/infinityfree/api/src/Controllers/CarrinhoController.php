<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Carrinho.php';
require_once __DIR__ . '/../Middlewares/AuthMiddleware.php';

/**
 * ARQON - THE VAULT | Carrinho Controller
 * Finalidade: Gerenciar carrinho de compras
 */
class CarrinhoController {
    
    private function getAllHeadersSafe(): array {
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

    private function getUserIdFromToken(): int {
        $headers = $this->getAllHeadersSafe();
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
     * GET /api/carrinho
     * Lista itens do carrinho do usuário
     */
    public function listar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $carrinho = Carrinho::listarPorUsuario($userId);
            
            echo json_encode([
                "status" => "success",
                "data" => $carrinho
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
     * POST /api/carrinho
     * Adiciona item ao carrinho
     */
    public function adicionar(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $idProduto = $input['id_produto'] ?? null;
            $quantidade = $input['quantidade'] ?? 1;
            $dataInicio = $input['data_inicio'] ?? null;
            $dataFim = $input['data_fim'] ?? null;
            
            if (!$idProduto) {
                throw new Exception("ID do produto obrigatório.", 400);
            }
            
            // Tenta obter userId do token, mas permite carrinho para visitantes
            $userId = null;
            try {
                $userId = $this->getUserIdFromToken();
            } catch (Exception $e) {
                // Usuário não autenticado - usa modo visitante
                error_log("[CARRINHO] Usuário não autenticado: " . $e->getMessage());
                $userId = null;
            }
            
            if ($userId) {
                // Usuário autenticado - persiste no banco
                try {
                    $resultado = Carrinho::adicionar(
                        $userId,
                        (int)$idProduto,
                        (int)$quantidade,
                        $dataInicio,
                        $dataFim
                    );
                    
                    echo json_encode([
                        "status" => "success",
                        "message" => "Item adicionado ao carrinho.",
                        "id" => $resultado,
                        "authenticated" => true
                    ]);
                } catch (Exception $dbError) {
                    error_log("[CARRINHO] Erro ao persistir no banco: " . $dbError->getMessage());
                    // Fallback para modo visitante se o banco falhar
                    echo json_encode([
                        "status" => "success",
                        "message" => "Item adicionado ao carrinho (modo visitante - fallback).",
                        "authenticated" => false
                    ]);
                }
            } else {
                // Visitante - retorna sucesso para que o frontend use localStorage
                echo json_encode([
                    "status" => "success",
                    "message" => "Item adicionado ao carrinho (modo visitante).",
                    "authenticated" => false
                ]);
            }
        } catch (Exception $e) {
            error_log("[CARRINHO] Erro geral: " . $e->getMessage());
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * PUT /api/carrinho
     * Atualiza quantidade ou período do item
     */
    public function atualizar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $id = $input['id'] ?? null;
            $quantidade = $input['quantidade'] ?? null;
            $dataInicio = $input['data_inicio'] ?? null;
            $dataFim = $input['data_fim'] ?? null;
            
            if (!$id) {
                throw new Exception("ID do item obrigatório.", 400);
            }
            
            $resultado = Carrinho::atualizar(
                $userId,
                (int)$id,
                $quantidade,
                $dataInicio,
                $dataFim
            );
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Item atualizado."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Item não encontrado no carrinho."
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
     * DELETE /api/carrinho
     * Remove item do carrinho
     */
    public function remover(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                throw new Exception("ID do item obrigatório.", 400);
            }
            
            $resultado = Carrinho::remover($userId, (int)$id);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Item removido do carrinho."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Item não encontrado no carrinho."
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
     * DELETE /api/carrinho/limpar
     * Limpa todo o carrinho
     */
    public function limpar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            Carrinho::limpar($userId);
            
            echo json_encode([
                "status" => "success",
                "message" => "Carrinho limpo com sucesso."
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
     * GET /api/carrinho/total
     * Calcula total do carrinho
     */
    public function calcularTotal(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $total = Carrinho::calcularTotal($userId);
            
            echo json_encode([
                "status" => "success",
                "data" => $total
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
