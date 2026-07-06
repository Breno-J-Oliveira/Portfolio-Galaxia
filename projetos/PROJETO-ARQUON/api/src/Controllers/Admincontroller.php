<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/AdminModel.php';

/**
 * ARQON - THE VAULT | Admin Controller
 * Finalidade: Estatísticas, métricas e operações administrativas
 */
class AdminController {

    private AdminModel $adminModel;

    public function __construct() {
        $this->adminModel = new AdminModel();
        $this->exigirControloDeAcesso();
    }

    private function exigirControloDeAcesso(): void {
        // Implemente a validação de sessão aqui, se necessário
    }
    
    public function metricas(): void {
        try {
            $metricas = [
                'total_produtos' => $this->adminModel->getTotalProdutos(),
                'valor_total_inventario' => $this->adminModel->getValorTotalInventario(),
                'taxa_ocupacao' => $this->adminModel->getTaxaOcupacao(),
                'alugaveis_disponiveis' => $this->adminModel->getAlugaveisDisponiveis(),
                'total_usuarios' => $this->adminModel->getTotalUsuarios(),
                'usuarios_ativos_mes' => $this->adminModel->getUsuariosAtivos30dias(),
                'receita_pendente' => $this->adminModel->getReceitaPendente(),
                'receita_mes' => $this->adminModel->getReceitaMes(),
                'ultimas_transacoes' => $this->adminModel->getUltimasTransacoes(10)
            ];
            
            sendResponse(["status" => "success", "data" => $metricas], 200);
        } catch (Throwable $e) {
            sendResponse(["status" => "error", "message" => "Erro ao carregar métricas.", "details" => $e->getMessage()], 500);
        }
    }
    
    public function listarUsuarios(): void {
        try {
            $usuarios = $this->adminModel->listarUsuarios();
            sendResponse(["status" => "success", "data" => $usuarios ? $usuarios : []], 200);
        } catch (Throwable $e) {
            sendResponse(["status" => "error", "message" => "Erro ao listar usuários.", "details" => $e->getMessage()], 500);
        }
    }

    public function listarProdutosInventario(): void {
        try {
            $produtos = $this->adminModel->listarProdutosInventario();
            sendResponse(["status" => "success", "data" => $produtos ? $produtos : []], 200);
        } catch (Throwable $e) {
            sendResponse(["status" => "error", "message" => "Erro ao listar produtos.", "details" => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/produtos
     * Cadastra um novo artefato de forma tolerante a falhas do XAMPP
     */
    public function cadastrarProduto(array $dados, array $arquivos): void {
        try {
            $fotoNome = 'default.jpg';

            // 1. Tratamento robusto da Imagem
            if (isset($arquivos['foto']) && $arquivos['foto']['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($arquivos['foto']['name'], PATHINFO_EXTENSION));
                $extensoesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];
                
                if (!in_array($ext, $extensoesPermitidas, true)) {
                    sendResponse(["status" => "error", "message" => "Apenas imagens (jpg, jpeg, png, webp) são permitidas."], 400);
                    return;
                }

                // Fallback seguro: se o mime_content_type não existir, usa a extensão
                if (function_exists('mime_content_type')) {
                    $mimeType = mime_content_type($arquivos['foto']['tmp_name']);
                } else {
                    $mimeType = 'image/' . $ext;
                }

                if (strpos($mimeType, 'image/') !== 0) {
                    sendResponse(["status" => "error", "message" => "O ficheiro não é uma imagem válida."], 400);
                    return;
                }

                $fotoNome = 'artefato_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                $diretorioDestino = realpath(__DIR__ . '/../../../public/') . '/uploads/';
                
                // Cria a pasta public/uploads caso não exista
                if (!is_dir($diretorioDestino)) {
                    @mkdir($diretorioDestino, 0777, true);
                }
                move_uploaded_file($arquivos['foto']['tmp_name'], $diretorioDestino . $fotoNome);
            }

            // 2. Empacotamento dos Dados
            $payload = [
                'nome'          => $dados['nome'] ?? 'Item sem nome',
                'categoria'     => $dados['categoria'] ?? 'Geral',
                'valor_diaria'  => floatval($dados['valor_diaria'] ?? 0),
                'valor_mercado' => floatval($dados['valor_mercado'] ?? 0),
                'status'        => 'disponivel',
                'foto'          => $fotoNome
            ];

            // 3. Salva no banco de dados
            $sucesso = $this->adminModel->salvarProduto($payload);

            if ($sucesso) {
                sendResponse(["status" => "success", "message" => "Artefato guardado com sucesso!"], 201);
            } else {
                // Caso a Model falhe silenciosamente
                sendResponse(["status" => "error", "message" => "Falha estrutural ao inserir na base de dados."], 400);
            }

        } catch (Throwable $e) { // Captura ERROS FATAIS do PHP
            sendResponse([
                "status" => "error",
                "message" => "Falha crítica do Servidor PHP.",
                "details" => $e->getMessage() . " (Linha: " . $e->getLine() . ")"
            ], 500);
        }
    }
    
    public function atualizarRoleUsuario(array $dados, int $id_usuario): void {
        try {
            if (empty($dados['id_nivel_acesso'])) {
                sendResponse(["status" => "error", "message" => "Nível não fornecido"], 400);
                return;
            }
            $sucesso = $this->adminModel->atualizarRoleUsuario($id_usuario, (int)$dados['id_nivel_acesso']);
            if ($sucesso) {
                sendResponse(["status" => "success", "message" => "Atualizado com sucesso"], 200);
            } else {
                sendResponse(["status" => "error", "message" => "Erro ao atualizar"], 500);
            }
        } catch (Throwable $e) {
            sendResponse(["status" => "error", "message" => "Erro no servidor", "details" => $e->getMessage()], 500);
        }
    }
    
    public function atualizarStatusUsuario(array $dados, int $id_usuario): void {
        try {
            if (empty($dados['status'])) {
                sendResponse(["status" => "error", "message" => "Status inválido"], 400);
                return;
            }
            $sucesso = $this->adminModel->atualizarStatusUsuario($id_usuario, $dados['status']);
            if ($sucesso) {
                sendResponse(["status" => "success", "message" => "Status atualizado"], 200);
            } else {
                sendResponse(["status" => "error", "message" => "Erro ao atualizar"], 500);
            }
        } catch (Throwable $e) {
            sendResponse(["status" => "error", "message" => "Erro no servidor", "details" => $e->getMessage()], 500);
        }
    }
    
    public function getLogs(array $params): void {
        try {
            $dias = (int)($params['dias'] ?? 7);
            $logs = $this->adminModel->getSystemLogs($dias);
            sendResponse(["status" => "success", "data" => $logs ? $logs : [], "filtro_dias" => $dias], 200);
        } catch (Throwable $e) {
            sendResponse(["status" => "error", "message" => "Erro no MySQL", "details" => $e->getMessage()], 500);
        }
    }
}

// Helper Global para prevenir falha de "Função Inexistente"
if (!function_exists('sendResponse')) {
    function sendResponse(array $dados, int $codigoStatus = 200): void {
        http_response_code($codigoStatus);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
        exit;
    }
}