<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Endereco.php';
require_once __DIR__ . '/../Middlewares/AuthMiddleware.php';

/**
 * ARQON - THE VAULT | Endereco Controller
 * Finalidade: Gerenciar endereços de entrega do usuário
 */
class EnderecoController {
    
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
     * GET /api/enderecos
     * Lista todos os endereços do usuário
     */
    public function listar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $enderecos = Endereco::listarPorUsuario($userId);
            
            echo json_encode([
                "status" => "success",
                "data" => $enderecos
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
     * POST /api/enderecos
     * Adiciona novo endereço
     */
    public function adicionar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $titulo = $input['titulo'] ?? 'Casa';
            $cep = $input['cep'] ?? '';
            $logradouro = $input['logradouro'] ?? '';
            $numero = $input['numero'] ?? '';
            $bairro = $input['bairro'] ?? '';
            $cidade = $input['cidade'] ?? '';
            $padrao = $input['padrao_entrega'] ?? false;
            
            if (empty($cep) || empty($logradouro) || empty($numero)) {
                throw new Exception("CEP, logradouro e número são obrigatórios.", 400);
            }
            
            $idEndereco = Endereco::adicionar(
                $userId,
                $titulo,
                $cep,
                $logradouro,
                $numero,
                $bairro,
                $cidade,
                $padrao
            );
            
            if ($padrao) {
                Endereco::definirPadrao($userId, $idEndereco);
            }
            
            echo json_encode([
                "status" => "success",
                "message" => "Endereço adicionado com sucesso.",
                "id" => $idEndereco
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
     * PUT /api/enderecos
     * Atualiza endereço existente
     */
    public function atualizar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $id = $input['id'] ?? null;
            if (!$id) {
                throw new Exception("ID do endereço obrigatório.", 400);
            }
            
            $titulo = $input['titulo'] ?? null;
            $cep = $input['cep'] ?? null;
            $logradouro = $input['logradouro'] ?? null;
            $numero = $input['numero'] ?? null;
            $bairro = $input['bairro'] ?? null;
            $cidade = $input['cidade'] ?? null;
            $padrao = $input['padrao_entrega'] ?? null;
            
            $resultado = Endereco::atualizar(
                $userId,
                (int)$id,
                $titulo,
                $cep,
                $logradouro,
                $numero,
                $bairro,
                $cidade,
                $padrao
            );
            
            if ($padrao) {
                Endereco::definirPadrao($userId, (int)$id);
            }
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Endereço atualizado com sucesso."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Endereço não encontrado ou não pertence ao usuário."
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
     * DELETE /api/enderecos
     * Remove endereço
     */
    public function remover(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                throw new Exception("ID do endereço obrigatório.", 400);
            }
            
            $resultado = Endereco::remover($userId, (int)$id);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Endereço removido com sucesso."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Endereço não encontrado ou não pertence ao usuário."
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
     * PUT /api/enderecos/padrao
     * Define endereço como padrão
     */
    public function definirPadrao(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);
            
            $id = $input['id'] ?? null;
            if (!$id) {
                throw new Exception("ID do endereço obrigatório.", 400);
            }
            
            Endereco::definirPadrao($userId, (int)$id);
            
            echo json_encode([
                "status" => "success",
                "message" => "Endereço definido como padrão."
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
