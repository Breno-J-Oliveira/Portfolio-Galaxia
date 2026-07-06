<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/AdminModel.php';

/**
 * ARQON - THE VAULT | Admin Controller
 * Finalidade: Estatísticas, métricas e operações administrativas
 * Rotas protegidas: Requer TOTAL_CONTROL ou VAULT_MGMT
 */
class AdminController {
    
    /**
     * GET /api/admin/metricas
     * Retorna dashboard com estatísticas completas do cofre
     */
    public function metricas(): void {
        try {
            $adminModel = new AdminModel();
            
            $metricas = [
                'total_produtos' => $adminModel->getTotalProdutos(),
                'valor_total_inventario' => $adminModel->getValorTotalInventario(),
                'taxa_ocupacao' => $adminModel->getTaxaOcupacao(),
                'alugaveis_disponiveis' => $adminModel->getAlugaveisDisponiveis(),
                'total_usuarios' => $adminModel->getTotalUsuarios(),
                'usuarios_ativos_mes' => $adminModel->getUsuariosAtivos30dias(),
                'receita_pendente' => $adminModel->getReceitaPendente(),
                'receita_mes' => $adminModel->getReceitaMes(),
                'ultimas_transacoes' => $adminModel->getUltimasTransacoes(10)
            ];
            
            sendResponse([
                "status" => "success",
                "data" => $metricas
            ], 200);
            
        } catch (Exception $e) {
            error_log("ADMIN_METRICAS_ERROR: " . $e->getMessage());
            sendResponse([
                "status" => "error",
                "message" => "Erro ao carregar métricas"
            ], 500);
        }
    }
    
    /**
     * GET /api/admin/usuarios
     * Retorna lista de usuários com paginação
     */
    public function listarUsuarios(array $params): void {
        try {
            $pagina = (int)($params['pagina'] ?? 1);
            $limit = (int)($params['limit'] ?? 20);
            
            $adminModel = new AdminModel();
            
            $usuarios = $adminModel->getUsuarios($pagina, $limit);
            $total = $adminModel->getTotalUsuarios();
            
            sendResponse([
                "status" => "success",
                "data" => $usuarios,
                "total" => $total,
                "pagina" => $pagina,
                "por_pagina" => $limit
            ], 200);
            
        } catch (Exception $e) {
            sendResponse([
                "status" => "error",
                "message" => "Erro ao carregar usuários"
            ], 500);
        }
    }
    
    /**
     * PUT /api/admin/usuario/:id/role
     * Altera o nível de acesso de um usuário
     */
    public function atualizarRoleUsuario(array $dados, int $id_usuario): void {
        try {
            // Validações
            if (empty($dados['id_nivel_acesso'])) {
                sendResponse([
                    "status" => "error",
                    "message" => "Nível de acesso não fornecido"
                ], 400);
                return;
            }
            
            $adminModel = new AdminModel();
            $sucesso = $adminModel->atualizarRoleUsuario($id_usuario, (int)$dados['id_nivel_acesso']);
            
            if ($sucesso) {
                sendResponse([
                    "status" => "success",
                    "message" => "Nível de acesso atualizado com sucesso"
                ], 200);
            } else {
                sendResponse([
                    "status" => "error",
                    "message" => "Erro ao atualizar nível de acesso"
                ], 500);
            }
            
        } catch (Exception $e) {
            sendResponse([
                "status" => "error",
                "message" => "Erro no servidor"
            ], 500);
        }
    }
    
    /**
     * PUT /api/admin/usuario/:id/status
     * Altera o status do usuário (ativo/inativo/bloqueado)
     */
    public function atualizarStatusUsuario(array $dados, int $id_usuario): void {
        try {
            if (empty($dados['status']) || !in_array($dados['status'], ['ativo', 'inativo', 'bloqueado'])) {
                sendResponse([
                    "status" => "error",
                    "message" => "Status inválido"
                ], 400);
                return;
            }
            
            $adminModel = new AdminModel();
            $sucesso = $adminModel->atualizarStatusUsuario($id_usuario, $dados['status']);
            
            if ($sucesso) {
                sendResponse([
                    "status" => "success",
                    "message" => "Status do usuário atualizado"
                ], 200);
            } else {
                sendResponse([
                    "status" => "error",
                    "message" => "Erro ao atualizar status"
                ], 500);
            }
            
        } catch (Exception $e) {
            sendResponse([
                "status" => "error",
                "message" => "Erro no servidor"
            ], 500);
        }
    }
    
    /**
     * GET /api/admin/logs?dias=7
     * Retorna logs de atividades dos últimos N dias
     */
    public function getLogs(array $params): void {
        try {
            $dias = (int)($params['dias'] ?? 7);
            $adminModel = new AdminModel();
            
            $logs = $adminModel->getSystemLogs($dias);
            
            sendResponse([
                "status" => "success",
                "data" => $logs,
                "filtro_dias" => $dias
            ], 200);
            
        } catch (Exception $e) {
            sendResponse([
                "status" => "error",
                "message" => "Erro ao carregar logs"
            ], 500);
        }
    }
}
?>