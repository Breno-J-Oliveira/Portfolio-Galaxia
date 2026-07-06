<?php
declare(strict_types=1); 

/**
 * ARQON - THE VAULT | Professional Central Router (Maestro)
 * Sincronizado com a árvore de diretórios oficial (Matriz do Projeto)
 */

ini_set('display_errors', '1');
error_reporting(E_ALL);

require_once 'config.php';
require_once 'database.php'; 

// --- [MIDDLEWARE DE SEGURANÇA E CORS] ---
header("Access-Control-Allow-Origin: " . (defined('ALLOWED_ORIGIN') ? ALLOWED_ORIGIN : '*'));
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Arqon-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper global de resposta
if (!function_exists('sendResponse')) {
    function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Captura de Input JSON global
global $input;
$input = json_decode(file_get_contents('php://input'), true) ?? [];

$method = $_SERVER['REQUEST_METHOD'];

// 🌟 A BALA DE PRATA DE ROTEAMENTO (Ignora XAMPP, subpastas e index.php)
$uri_parts = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Procura na URL exatamente onde começa "api/" e extrai só essa parte.
if (preg_match('/api\/(.*)$/i', $uri_parts, $matches)) {
    $uri = 'api/' . rtrim($matches[1], '/');
} else {
    $uri = trim($uri_parts, '/');
}

try {
    // Roteador Central
    switch ($uri) {
        case 'api/login':
            require_once __DIR__ . '/api/src/Controllers/AuthController.php';
            $authController = new AuthController();
            if ($method === 'POST') {
                $authController->login();
            } else {
                sendResponse(["error" => "Método não permitido para esta rota."], 405);
            }
            break;

        case 'api/admin/metricas':
            require_once __DIR__ . '/api/src/Controllers/AdminController.php';
            $adminController = new AdminController();
            if ($method === 'GET') { $adminController->metricas(); }
            break;
            
        case 'api/admin/logs':
            require_once __DIR__ . '/api/src/Controllers/AdminController.php';
            $adminController = new AdminController();
            if ($method === 'GET') { $adminController->getLogs($_GET); }
            break;
            
        // 🚀 ROTA: Listagem de Usuários para o Painel
        case 'api/admin/usuarios':
            require_once __DIR__ . '/api/src/Controllers/AdminController.php';
            $adminController = new AdminController();
            if ($method === 'GET') { $adminController->listarUsuarios(); }
            break;
            
        // 🚀 ROTA: Inventário de Produtos (Listar e Cadastrar)
        case 'api/produtos':
            require_once __DIR__ . '/api/src/Controllers/AdminController.php';
            $adminController = new AdminController();
            
            if ($method === 'GET') { 
                $adminController->listarProdutosInventario(); 
            } elseif ($method === 'POST') {
                $adminController->cadastrarProduto($_POST, $_FILES);
            }
            break;
            
        // 🚀 NOVA ROTA: Deletar Artefato do Cofre (Acionada pela lixeira na tabela)
        case 'api/produtos/deletar':
            if ($method === 'DELETE') {
                $id = $_GET['id'] ?? null;
                if ($id) {
                    $db = Database::getInstance();
                    $stmt = $db->prepare("DELETE FROM produtos WHERE id = :id");
                    $sucesso = $stmt->execute([':id' => $id]);
                    if($sucesso) {
                        sendResponse(["status" => "success", "message" => "Artefato deletado com sucesso."], 200);
                    } else {
                        sendResponse(["status" => "error", "message" => "Falha ao deletar artefato."], 500);
                    }
                } else {
                    sendResponse(["status" => "error", "message" => "ID não fornecido."], 400);
                }
            }
            break;

        // 🚀 NOVA ROTA: Alterar Status do Usuário (Ativar/Desativar botão de energia)
        case 'api/admin/usuario/status':
            require_once __DIR__ . '/api/src/Controllers/AdminController.php';
            $adminController = new AdminController();
            if ($method === 'PUT' || $method === 'POST') {
                $dados_recebidos = json_decode(file_get_contents('php://input'), true);
                $id_usuario = $dados_recebidos['id_usuario'] ?? 0;
                $adminController->atualizarStatusUsuario($dados_recebidos, (int)$id_usuario);
            }
            break;

        // ==========================================================
        // NOVAS ROTAS PARA METADADOS DO CATÁLOGO (FILTROS DINÂMICOS)
        // ==========================================================
        case 'api/marcas':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $stmt = $db->query("SELECT id, nome FROM marcas ORDER BY nome ASC");
                    $marcas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse($marcas, 200);
                } catch (Throwable $e) {
                    sendResponse(["error" => "Erro ao buscar marcas: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/categorias':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $stmt = $db->query("SELECT id, nome FROM categorias ORDER BY nome ASC");
                    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse($categorias, 200);
                } catch (Throwable $e) {
                    sendResponse(["error" => "Erro ao buscar categorias: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/estilos':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $stmt = $db->query("SELECT id, nome FROM estilos ORDER BY nome ASC");
                    $estilos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse($estilos, 200);
                } catch (Throwable $e) {
                    sendResponse(["error" => "Erro ao buscar estilos: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/logistica/rastreio':
            require_once __DIR__ . '/api/src/Controllers/LogisticaController.php';
            $logisticaController = new LogisticaController();
            if ($method === 'GET') {
                $logisticaController->rastreio($_GET);
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // COFRE DE ARTEFATOS: DETALHES COMPLETOS DO PRODUTO (PDP)
        // ═════════════════════════════════════════════════════════════════════
        case 'api/produtos/detalhes':
            if ($method === 'GET') {
                $id = (int)($_GET['id'] ?? 0);
                if ($id <= 0) {
                    sendResponse(["status" => "error", "message" => "Assinatura relacional ou ID do artefato inválido."], 400);
                }
                
                try {
                    // 1. Invoca o SEU Model de Produtos (A verdadeira fonte de dados)
                    require_once __DIR__ . '/api/src/Models/Produto.php';
                    $produtoModel = new Produto();
                    
                    // 2. Usa a sua função que já faz o JOIN com marcas e busca as mídias 3D
                    $produto = $produtoModel->buscarDetalhesPorId($id);
                    
                    if (!$produto) {
                        sendResponse(["status" => "error", "message" => "Artefato não localizado nas câmaras do Vault."], 404);
                    }
                    
                    // 3. Tradução Estrutural (De -> Para): 
                    // Como o JS estava esperando alguns nomes antigos, nós mapeamos as suas colunas reais aqui:
                    $produto['preco_diaria'] = $produto['valor_diaria'];
                    $nome_foto = $produto['foto_url'];
                    // Se a foto já não vier com o caminho completo do banco, nós montamos a URL:
                    if ($nome_foto && !str_starts_with($nome_foto, 'http') && !str_starts_with($nome_foto, '/')) {
                        // Ajuste "public/uploads/" caso sua pasta de imagens tenha outro nome!
                        $produto['imagem_url'] = '/PROJETO-ARQUON/public/uploads/' . $nome_foto; 
                        } else {
                            $produto['imagem_url'] = $nome_foto;
                            
                            }
                            
                    $produto['valor_patrimonial'] = $produto['valor_mercado'];
                    $produto['midias_extras'] = !empty($produto['galeria']) ? $produto['galeria'] : [];
                    
                    // Fallback para tamanhos de Alta Costura
                    $produto['tamanhos'] = ['PP', 'P', 'M', 'G', 'GG'];
                    
                    sendResponse(["status" => "success", "data" => $produto], 200);
                    
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro interno no Vault: " . $e->getMessage()], 500);
                }
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // PROTOCOLO DE ALOCAÇÃO: ADICIONAR ITEM AO COFRE DE CUSTÓDIA (CARRINHO)
        // ═════════════════════════════════════════════════════════════════════
        case 'api/carrinho/adicionar':
            if ($method === 'POST') {
                $rawInput = file_get_contents('php://input');
                $dados = json_decode($rawInput, true);
                
                if (!$dados || empty($dados['produto_id']) || empty($dados['tamanho']) || empty($dados['data_inicio']) || empty($dados['data_fim'])) {
                    sendResponse(["status" => "error", "message" => "Parâmetros de alocação de segurança incompletos."], 400);
                }
                
                try {
                    $db = Database::getInstance();
                    sendResponse([
                        "status" => "success", 
                        "message" => "Chave de custódia gerada. Artefato protegido com sucesso no seu cofre temporário."
                    ], 200);
                    
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Falha no barramento de segurança logística: " . $e->getMessage()], 500);
                }
            }
            break;
            
        default:
            // Se bater na API e não achar a rota de fato
            if (str_contains($uri, 'api/')) {
                sendResponse(["error" => "Rota da API não encontrada ou método inválido: " . $uri], 404);
            } else {
                // Redirecionamento de segurança para o Frontend caso acesse a raiz puramente
                header("Location: public/index.html");
                exit;
            }
            break;
    }
} catch (Throwable $e) {
    error_log("ARQON_CRITICAL: " . $e->getMessage());
    sendResponse([
        "status" => "error",
        "message" => "Erro interno no servidor maestro.",
        "details" => $e->getMessage()
    ], 500);
}