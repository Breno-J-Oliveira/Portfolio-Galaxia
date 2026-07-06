<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Cupom.php';

/**
 * ARQON - THE VAULT | Cupom Controller
 * Finalidade: Validação e gerenciamento de cupons de desconto
 */
class CupomController {
    
    /**
     * POST /api/cupons/validar
     * Valida código de cupom
     */
    public function validar(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $codigo = $input['codigo'] ?? '';
            $valorTotal = $input['valor_total'] ?? 0;
            
            if (empty($codigo)) {
                throw new Exception("Código do cupom é obrigatório.", 400);
            }
            
            $resultado = Cupom::validar($codigo, (float)$valorTotal);
            
            if ($resultado) {
                echo json_encode([
                    "status" => "success",
                    "data" => $resultado
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Cupom inválido ou expirado."
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
     * GET /api/cupons
     * Lista cupons disponíveis (admin)
     */
    public function listar(): void {
        try {
            $cupons = Cupom::listarTodos();
            
            echo json_encode([
                "status" => "success",
                "data" => $cupons
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
     * POST /api/cupons
     * Cria novo cupom (admin)
     */
    public function criar(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $codigo = $input['codigo'] ?? '';
            $tipo = $input['tipo'] ?? 'percentual';
            $valor = $input['valor'] ?? 0;
            $usosMaximos = $input['usos_maximos'] ?? null;
            $validade = $input['validade'] ?? null;
            $descricao = $input['descricao'] ?? '';
            
            if (empty($codigo) || $valor <= 0) {
                throw new Exception("Código e valor são obrigatórios.", 400);
            }
            
            $idCupom = Cupom::criar(
                $codigo,
                $tipo,
                (float)$valor,
                $usosMaximos ? (int)$usosMaximos : null,
                $validade,
                $descricao
            );
            
            echo json_encode([
                "status" => "success",
                "message" => "Cupom criado com sucesso.",
                "id" => $idCupom
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
