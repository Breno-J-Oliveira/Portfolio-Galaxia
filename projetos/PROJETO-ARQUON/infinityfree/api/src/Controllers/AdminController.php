<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/AdminModel.php';
require_once __DIR__ . '/../Middlewares/AuthMiddleware.php';

class AdminController {
    private AdminModel $adminModel;
    private ?array $authUser = null;

    public function __construct() {
        $this->adminModel = new AdminModel();
        
        // 1. Pega a rota que está a ser acedida
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $method = $_SERVER['REQUEST_METHOD'] ?? '';
        
        // 2. Define quais rotas são a "Via Verde" (Públicas)
        // Se a pessoa estiver a usar GET para listar produtos ou ver detalhes, deixa passar.
        $is_public_route = ($method === 'GET' && (str_contains($uri, 'api/produtos') || str_contains($uri, 'api/produtos/detalhes')));
        
        // 3. Se NÃO for uma rota pública, exige o Token de Segurança (Login)
        if (!$is_public_route) {
            $this->exigirControloDeAcesso();
        }
    }
    private function exigirControloDeAcesso(): void {
        try {
            $this->authUser = AuthMiddleware::check();
            $role = $this->authUser['role'] ?? '';
            if (!in_array($role, ['TOTAL_CONTROL', 'VAULT_MGMT', 'ADMIN'], true)) {
                sendResponse(['status' => 'error', 'message' => 'Acesso negado ao painel administrativo.'], 403);
            }
        } catch (Throwable $e) {
            // AuthMiddleware já encerra com JSON
        }
    }

    private function uploadDir(): string {
        $dir = dirname(__DIR__, 3) . '/public/uploads/';
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0777, true)) {
                throw new RuntimeException('Erro ao criar diretório de uploads');
            }
        }
        return $dir;
    }

    private function processarUploads(array &$midias): string {
        $uploadDir = $this->uploadDir();
        $fotoPrincipal = 'default.jpg';

        $mapaArquivos = [
            'foto' => ['capa_', 'foto_principal'],
            'foto_principal' => ['capa_', 'foto_principal'],
            'fotos_extras' => ['galeria_', 'fotos_secundarias'],
            'fotos_secundarias' => ['galeria_', 'fotos_secundarias'],
            'video_produto' => ['video_', 'video'],
            'video' => ['video_', 'video'],
            'arquivo_3d' => ['3d_', 'modelo_3d'],
            'modelo_3d' => ['3d_', 'modelo_3d'],
        ];

        foreach (['foto', 'foto_principal'] as $campo) {
            if (!empty($_FILES[$campo]['name']) && $_FILES[$campo]['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                    $nome = 'capa_' . uniqid() . '.' . $ext;
                    if (move_uploaded_file($_FILES[$campo]['tmp_name'], $uploadDir . $nome)) {
                        $fotoPrincipal = $nome;
                    }
                }
                break;
            }
        }

        foreach (['fotos_extras', 'fotos_secundarias'] as $campo) {
            if (!empty($_FILES[$campo]['name'][0])) {
                foreach ($_FILES[$campo]['name'] as $key => $name) {
                    if (($_FILES[$campo]['error'][$key] ?? 1) !== UPLOAD_ERR_OK) {
                        continue;
                    }
                    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                        $nomeUnico = 'galeria_' . uniqid() . '.' . $ext;
                        if (move_uploaded_file($_FILES[$campo]['tmp_name'][$key], $uploadDir . $nomeUnico)) {
                            $midias[] = ['tipo' => 'imagem', 'url' => $nomeUnico, 'ordem' => $key + 1];
                        }
                    }
                }
            }
        }

        foreach (['video_produto', 'video'] as $campo) {
            if (!empty($_FILES[$campo]['name']) && $_FILES[$campo]['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['mp4', 'webm', 'mov'], true)) {
                    $nomeUnico = 'video_' . uniqid() . '.' . $ext;
                    if (move_uploaded_file($_FILES[$campo]['tmp_name'], $uploadDir . $nomeUnico)) {
                        $midias[] = ['tipo' => 'video', 'url' => $nomeUnico, 'ordem' => 0];
                    }
                }
                break;
            }
        }

        foreach (['arquivo_3d', 'modelo_3d'] as $campo) {
            if (!empty($_FILES[$campo]['name']) && $_FILES[$campo]['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['glb', 'gltf', 'obj'], true)) {
                    $nomeUnico = '3d_' . uniqid() . '.' . $ext;
                    if (move_uploaded_file($_FILES[$campo]['tmp_name'], $uploadDir . $nomeUnico)) {
                        $midias[] = ['tipo' => '3d_model', 'url' => $nomeUnico, 'ordem' => 0];
                    }
                }
                break;
            }
        }

        return $fotoPrincipal;
    }

    public function metricas(): void {
        try {
            sendResponse([
                'status' => 'success',
                'data' => [
                    'total_produtos' => $this->adminModel->getTotalProdutos(),
                    'valor_total_inventario' => $this->adminModel->getValorTotalInventario(),
                    'taxa_ocupacao' => $this->adminModel->getTaxaOcupacao(),
                    'alugaveis_disponiveis' => $this->adminModel->getAlugaveisDisponiveis(),
                    'total_usuarios' => $this->adminModel->getTotalUsuarios(),
                    'usuarios_ativos_mes' => $this->adminModel->getUsuariosAtivos30dias(),
                    'receita_pendente' => $this->adminModel->getReceitaPendente(),
                    'receita_mes' => $this->adminModel->getReceitaMes(),
                    'locacoes_mes' => $this->adminModel->getLocacoesMes(),
                    'locacoes_semana' => $this->adminModel->getLocacoesSemana(),
                    'locacoes_hoje' => $this->adminModel->getLocacoesHoje(),
                    'ultimas_transacoes' => $this->adminModel->getUltimasTransacoes(12),
                ],
            ], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getProdutos(): void {
        try {
            $produtos = $this->adminModel->getProdutosAdmin();
            sendResponse(['status' => 'success', 'data' => $produtos], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function criarProduto(): void {
        $this->adicionarProduto();
    }

    public function adicionarProduto(): void {
        try {
            $dados = $_POST;
            $midias = [];
            $foto = $this->processarUploads($midias);
            $id = $this->adminModel->adicionarProdutoLuxo($dados, $foto, $midias);
            $uid = (int)($this->authUser['user_id'] ?? 0);
            $this->adminModel->registrarLog($uid, "Produto #{$id} cadastrado", 'produtos');
            sendResponse(['status' => 'success', 'message' => 'Artefato integrado ao cofre.', 'id' => $id], 201);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function atualizarProduto(): void {
        try {
            $dados = $_POST;
            $id = (int)($dados['id'] ?? 0);
            if ($id <= 0) {
                sendResponse(['status' => 'error', 'message' => 'ID inválido'], 400);
            }
            $midias = [];
            $foto = null;
            if (!empty($_FILES)) {
                $fotoNova = $this->processarUploads($midias);
                if ($fotoNova !== 'default.jpg') {
                    $foto = $fotoNova;
                }
            }
            $this->adminModel->atualizarProdutoLuxo($id, $dados, $foto, $midias);
            $uid = (int)($this->authUser['user_id'] ?? 0);
            $this->adminModel->registrarLog($uid, "Produto #{$id} atualizado", 'produtos');
            sendResponse(['status' => 'success', 'message' => 'Artefato atualizado.'], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function excluirProduto(): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            sendResponse(['status' => 'error', 'message' => 'ID não informado'], 400);
        }
        $ok = $this->adminModel->excluirProduto($id);
        if ($ok) {
            $uid = (int)($this->authUser['user_id'] ?? 0);
            $this->adminModel->registrarLog($uid, "Produto #{$id} removido", 'produtos');
            sendResponse(['status' => 'success', 'message' => 'Artefato removido.'], 200);
        }
        sendResponse(['status' => 'error', 'message' => 'Falha ao remover'], 500);
    }

    public function duplicarProduto(): void {
        $id = (int)($_GET['id'] ?? $_POST['id'] ?? 0);
        $novoId = $this->adminModel->duplicarProduto($id);
        if ($novoId) {
            sendResponse(['status' => 'success', 'message' => 'Cópia criada.', 'id' => $novoId], 201);
        }
        sendResponse(['status' => 'error', 'message' => 'Não foi possível duplicar'], 404);
    }

    public function toggleStatusProduto(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $id = (int)($dados['id'] ?? 0);
        $status = $dados['status'] ?? 'disponivel';
        $ok = $this->adminModel->atualizarStatusProduto($id, $status);
        sendResponse($ok
            ? ['status' => 'success', 'message' => 'Status atualizado']
            : ['status' => 'error', 'message' => 'Falha'], $ok ? 200 : 500);
    }

    public function getEstoque(): void {
        sendResponse(['status' => 'success', 'data' => $this->adminModel->getEstoqueAdmin()], 200);
    }

    public function atualizarEstoque(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int)($dados['id'] ?? 0);
        $status = $dados['status_atual'] ?? '';
        if ($id <= 0 || $status === '') {
            sendResponse(['status' => 'error', 'message' => 'Dados inválidos'], 400);
        }
        $ok = $this->adminModel->atualizarStatusEstoque($id, $status);
        sendResponse($ok ? ['status' => 'success'] : ['status' => 'error'], $ok ? 200 : 500);
    }

    public function adicionarEstoque(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $id = $this->adminModel->adicionarItemEstoque($dados);
        sendResponse(['status' => 'success', 'id' => $id], 201);
    }

    public function getLocacoes(): void {
        sendResponse(['status' => 'success', 'data' => $this->adminModel->getLocacoesAdmin()], 200);
    }

    public function atualizarLocacao(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int)($dados['id'] ?? 0);
        if (!empty($dados['status_pedido'])) {
            $this->adminModel->atualizarStatusLocacao($id, $dados['status_pedido']);
        }
        if (!empty($dados['codigo_rastreio'])) {
            $this->adminModel->atualizarRastreioLocacao($id, $dados['codigo_rastreio']);
        }
        sendResponse(['status' => 'success', 'message' => 'Locação atualizada'], 200);
    }

    public function getUsuarios(): void {
        try {
            sendResponse(['status' => 'success', 'data' => $this->adminModel->getUsuariosAdmin()], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function atualizarStatusUsuario(int $id_usuario, array $dados): void {
        if (!isset($dados['status'])) {
            sendResponse(['status' => 'error', 'message' => 'Status inválido'], 400);
        }
        $ok = $this->adminModel->atualizarStatusUsuario($id_usuario, $dados['status']);
        if ($ok) {
            $uid = (int)($this->authUser['user_id'] ?? 0);
            $this->adminModel->registrarLog($uid, "Usuário #{$id_usuario} status → {$dados['status']}", 'usuarios');
        }
        sendResponse($ok ? ['status' => 'success'] : ['status' => 'error'], $ok ? 200 : 500);
    }

    public function atualizarNivelUsuario(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int)($dados['id_usuario'] ?? 0);
        $nivel = $dados['nivel_acesso'] ?? '';
        if ($id <= 0 || $nivel === '') {
            sendResponse(['status' => 'error', 'message' => 'Dados inválidos'], 400);
        }
        $ok = $this->adminModel->atualizarNivelUsuario($id, $nivel);
        sendResponse($ok ? ['status' => 'success', 'message' => 'Nível atualizado'] : ['status' => 'error'], $ok ? 200 : 500);
    }

    public function getLogs(array $params): void {
        $dias = (int)($params['dias'] ?? 7);
        sendResponse([
            'status' => 'success',
            'data' => $this->adminModel->getSystemLogs($dias),
            'filtro_dias' => $dias,
        ], 200);
    }

    public function getLookups(): void {
        sendResponse([
            'status' => 'success',
            'data' => [
                'marcas' => $this->adminModel->getMarcas(),
                'categorias' => $this->adminModel->getCategorias(),
                'estilos' => $this->adminModel->getEstilos(),
                'cores' => $this->adminModel->getCores(),
            ],
        ], 200);
    }

    public function getConfig(): void {
        sendResponse(['status' => 'success', 'data' => $this->adminModel->getConfiguracoes()], 200);
    }

    public function salvarConfig(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
        foreach ($dados as $chave => $valor) {
            $this->adminModel->salvarConfiguracao((string)$chave, (string)$valor);
        }
        sendResponse(['status' => 'success', 'message' => 'Configurações salvas'], 200);
    }

    public function sincronizarEstoque(): void {
        try {
            $n = $this->adminModel->sincronizarEstoqueProdutos();
            $uid = (int)($this->authUser['user_id'] ?? 0);
            $this->adminModel->registrarLog($uid, "Sincronizados {$n} SKUs", 'itens_estoque');
            sendResponse(['status' => 'success', 'message' => "{$n} SKU(s) gerado(s)", 'criados' => $n], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function exportar(): void {
        $tipo = $_GET['tipo'] ?? 'produtos';
        if ($tipo === 'usuarios') {
            $rows = $this->adminModel->getUsuariosAdmin();
        } elseif ($tipo === 'locacoes') {
            $rows = $this->adminModel->getLocacoesAdmin();
        } else {
            $rows = $this->adminModel->getProdutosAdmin();
        }
        sendResponse(['status' => 'success', 'data' => $rows, 'tipo' => $tipo], 200);
    }

    // --- CRUD Marcas ---
    public function criarMarca(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $nome = trim($dados['nome'] ?? '');
        if ($nome === '') { sendResponse(['status' => 'error', 'message' => 'Nome obrigatório'], 400); return; }
        $id = $this->adminModel->criarMarca($nome);
        sendResponse(['status' => 'success', 'id' => $id], 201);
    }

    public function atualizarMarca(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $id = (int)($dados['id'] ?? 0);
        $nome = trim($dados['nome'] ?? '');
        if ($id <= 0 || $nome === '') { sendResponse(['status' => 'error', 'message' => 'Dados inválidos'], 400); return; }
        $this->adminModel->atualizarMarca($id, $nome);
        sendResponse(['status' => 'success'], 200);
    }

    public function deletarMarca(): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) { sendResponse(['status' => 'error', 'message' => 'ID inválido'], 400); return; }
        $this->adminModel->deletarMarca($id);
        sendResponse(['status' => 'success'], 200);
    }

    // --- CRUD Cores ---
    public function criarCor(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $nome = trim($dados['nome'] ?? '');
        $hex = trim($dados['hex_code'] ?? '#000000');
        if ($nome === '') { sendResponse(['status' => 'error', 'message' => 'Nome obrigatório'], 400); return; }
        $id = $this->adminModel->criarCor($nome, $hex);
        sendResponse(['status' => 'success', 'id' => $id], 201);
    }

    public function atualizarCor(): void {
        $dados = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $id = (int)($dados['id'] ?? 0);
        $nome = trim($dados['nome'] ?? '');
        $hex = trim($dados['hex_code'] ?? '#000000');
        if ($id <= 0 || $nome === '') { sendResponse(['status' => 'error', 'message' => 'Dados inválidos'], 400); return; }
        $this->adminModel->atualizarCor($id, $nome, $hex);
        sendResponse(['status' => 'success'], 200);
    }

    public function deletarCor(): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) { sendResponse(['status' => 'error', 'message' => 'ID inválido'], 400); return; }
        $this->adminModel->deletarCor($id);
        sendResponse(['status' => 'success'], 200);
    }
}
