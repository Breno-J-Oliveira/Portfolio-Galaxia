<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Locacao.php';
require_once __DIR__ . '/../Middlewares/AuthMiddleware.php';

/**
 * ARQON - THE VAULT | Locacao Controller
 * Finalidade: Gerenciar locações/aluguéis de produtos
 */
class LocacaoController {
    
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
     * GET /api/locacoes
     * Lista locações do usuário logado
     */
    public function listar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $locacoes = Locacao::listarPorUsuario($userId);
            
            echo json_encode([
                "status" => "success",
                "data" => $locacoes
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
     * POST /api/locacoes
     * Cria nova locação (checkout)
     * Suporta tanto payload de carrinho {itens:[], endereco_id, data_inicio, data_fim}
     * quanto payload simples {id_item_estoque, data_inicio, data_fim, id_endereco}
     */
    public function criar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $input = json_decode(file_get_contents('php://input'), true);

            $dataInicio = $input['data_inicio'] ?? null;
            $dataFim = $input['data_fim'] ?? null;
            $idEndereco = $input['endereco_id'] ?? $input['id_endereco'] ?? null;

            if (!$dataInicio || !$dataFim) {
                throw new Exception("Data início e data fim são obrigatórios.", 400);
            }

            $db = Database::getInstance();
            $idsCriados = [];
            $erros = [];

            // Se vier como payload de carrinho (array de itens)
            if (!empty($input['itens']) && is_array($input['itens'])) {
                foreach ($input['itens'] as $item) {
                    $produtoId = $item['produto_id'] ?? $item['id'] ?? null;
                    $qtd = (int) ($item['quantidade'] ?? 1);
                    $itemDataInicio = $item['data_inicio'] ?? $dataInicio;
                    $itemDataFim = $item['data_fim'] ?? $dataFim;

                    // Se já tem id_item_estoque, usa direto; senão busca um disponível para o produto
                    $idItemEstoque = $item['id_item_estoque'] ?? null;

                    if (!$idItemEstoque && $produtoId) {
                        $stmt = $db->prepare(
                            "SELECT id FROM itens_estoque WHERE id_produto = ? AND status_atual = 'Disponível' ORDER BY id ASC LIMIT 1"
                        );
                        $stmt->execute([(int)$produtoId]);
                        $idItemEstoque = $stmt->fetchColumn();
                    }

                    if (!$idItemEstoque) {
                        $erros[] = "Item de estoque não disponível para produto ID {$produtoId}.";
                        continue;
                    }

                    // Cria a locação
                    $idLocacao = Locacao::criar(
                        $userId,
                        (int)$idItemEstoque,
                        $itemDataInicio,
                        $itemDataFim,
                        $idEndereco ? (int)$idEndereco : null
                    );
                    $idsCriados[] = $idLocacao;
                }
            } else {
                // Payload simples (compatibilidade)
                $idItemEstoque = $input['id_item_estoque'] ?? null;
                if (!$idItemEstoque) {
                    throw new Exception("Item de estoque, data início e data fim são obrigatórios.", 400);
                }
                $idLocacao = Locacao::criar(
                    $userId,
                    (int)$idItemEstoque,
                    $dataInicio,
                    $dataFim,
                    $idEndereco ? (int)$idEndereco : null
                );
                $idsCriados[] = $idLocacao;
            }

            if (empty($idsCriados)) {
                throw new Exception(implode(' ', $erros), 400);
            }

            echo json_encode([
                "status" => "success",
                "message" => "Locação criada com sucesso.",
                "id" => $idsCriados[0],
                "ids" => $idsCriados,
                "erros" => $erros ?: null
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
     * PUT /api/locacoes/status
     * Atualiza status da locação (admin)
     */
    public function atualizarStatus(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $id = $input['id'] ?? null;
            $status = $input['status'] ?? null;
            
            if (!$id || !$status) {
                throw new Exception("ID e status são obrigatórios.", 400);
            }
            
            $resultado = Locacao::atualizarStatus((int)$id, $status);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Status atualizado."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Locação não encontrada."
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
     * DELETE /api/locacoes
     * Cancela locação (apenas se status = pendente)
     */
    public function cancelar(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                throw new Exception("ID da locação obrigatório.", 400);
            }
            
            $resultado = Locacao::cancelar($userId, (int)$id);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Locação cancelada com sucesso."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Locação não encontrada ou não pode ser cancelada."
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
     * GET /api/locacoes/detalhes
     * Detalhes de uma locação específica
     */
    public function detalhes(): void {
        try {
            $userId = $this->getUserIdFromToken();
            $id = $_GET['id'] ?? null;
            
            if (!$id) {
                throw new Exception("ID da locação obrigatório.", 400);
            }
            
            $locacao = Locacao::buscarPorId($userId, (int)$id);
            
            if ($locacao) {
                echo json_encode([
                    "status" => "success",
                    "data" => $locacao
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Locação não encontrada."
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
