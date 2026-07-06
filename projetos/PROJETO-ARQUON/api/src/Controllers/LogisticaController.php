<?php
declare(strict_types=1);

/**
 * ARQON - THE VAULT | Logística Controller
 * Finalidade: Gerenciar status de aluguel, devoluções, rastreamento
 */
class LogisticaController {
    
    /**
     * GET /api/logistica/rastreio?id_locacao=5
     * Retorna status de entrega/rastreamento
     */
    public function rastreio(array $params): void {
        try {
            $id_locacao = $params['id_locacao'] ?? null;
            
            if (!$id_locacao) {
                sendResponse(["status" => "error", "message" => "ID da locação obrigatório"], 400);
                return;
            }

            // Aqui futuramente buscaremos no banco
            sendResponse([
                "status" => "success",
                "data" => [
                    "id_locacao" => $id_locacao,
                    "status" => "Enviado",
                    "codigo_rastreio" => "ARQON123456789",
                    "data_postagem" => date('Y-m-d H:i:s'),
                    "status_gps" => "Em trânsito"
                ]
            ], 200);
        } catch (Exception $e) {
            sendResponse(["status" => "error", "error" => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/logistica/devolver
     * Registra devolução de item
     */
    public function devolver(array $dados): void {
        // Lógica futura
        sendResponse(["status" => "success", "message" => "Devolução registrada"], 200);
    }

    /**
     * GET /api/logistica/status?id_item=42
     * Status atual do item no estoque
     */
    public function statusItem(array $params): void {
        // Lógica futura
        sendResponse(["status" => "success", "data" => []], 200);
    }
}
?>