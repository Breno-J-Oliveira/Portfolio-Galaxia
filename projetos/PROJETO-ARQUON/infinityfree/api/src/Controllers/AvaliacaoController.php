<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Avaliacao.php';
require_once __DIR__ . '/../Middlewares/AuthMiddleware.php';

/**
 * ARQON - THE VAULT | Avaliacao Controller
 * Finalidade: Gerenciar avaliações de produtos
 */
class AvaliacaoController {
    
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
     * GET /api/avaliacoes
     * Lista avaliações de um produto
     */
    public function listar(): void {
        try {
            $idProduto = $_GET['id_produto'] ?? null;
            
            if (!$idProduto) {
                throw new Exception("ID do produto obrigatório.", 400);
            }
            
            $avaliacoes = Avaliacao::listarPorProduto((int)$idProduto);
            
            echo json_encode([
                "status" => "success",
                "data" => $avaliacoes
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
     * POST /api/avaliacoes
     * Publica nova avaliação
     */
    public function publicar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $idProduto = $input['id_produto'] ?? null;
            $nota = $input['nota'] ?? null;
            $comentario = $input['comentario'] ?? '';
            
            if (!$idProduto || !$nota) {
                throw new Exception("ID do produto e nota são obrigatórios.", 400);
            }
            
            if ($nota < 1 || $nota > 5) {
                throw new Exception("Nota deve estar entre 1 e 5.", 400);
            }
            
            // Verifica se o usuário já alugou este produto
            $jaAvaliou = Avaliacao::verificarSeAvaliou($userId, (int)$idProduto);
            if ($jaAvaliou) {
                throw new Exception("Você já avaliou este produto.", 400);
            }
            
            $idAvaliacao = Avaliacao::adicionar(
                $userId,
                (int)$idProduto,
                (int)$nota,
                $comentario
            );
            
            echo json_encode([
                "status" => "success",
                "message" => "Avaliação publicada com sucesso.",
                "id" => $idAvaliacao
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
     * GET /api/avaliacoes/minhas
     * Lista avaliações do usuário logado
     */
    public function minhas(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $avaliacoes = Avaliacao::listarPorUsuario($userId);
            
            echo json_encode([
                "status" => "success",
                "data" => $avaliacoes
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
     * DELETE /api/avaliacoes
     * Remove avaliação
     */
    public function remover(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                throw new Exception("ID da avaliação obrigatório.", 400);
            }
            
            $resultado = Avaliacao::remover($userId, (int)$id);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Avaliação removida com sucesso."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Avaliação não encontrada ou não pertence ao usuário."
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
}
