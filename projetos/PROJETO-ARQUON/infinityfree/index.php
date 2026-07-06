<?php
declare(strict_types=1); 

/**
 * ARQON - THE VAULT | Professional Central Router (Maestro)
 * Sincronizado com a árvore de diretórios oficial (Matriz do Projeto)
 */

// Captura global de erros para evitar 500 em carrinho
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("[GLOBAL ERROR] $errno: $errstr in $errfile:$errline");
    // Para requisições de carrinho, não interrompe execução
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/api/carrinho') !== false && $_SERVER['REQUEST_METHOD'] === 'POST') {
        return true; // Continua execução
    }
    return false;
});

set_exception_handler(function($exception) {
    error_log("[GLOBAL EXCEPTION] " . $exception->getMessage());
    // Para requisições de carrinho, retorna sucesso para fallback
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/api/carrinho') !== false && $_SERVER['REQUEST_METHOD'] === 'POST') {
        header('Content-Type: application/json');
        echo json_encode([
            "status" => "success",
            "message" => "Item adicionado ao carrinho (modo visitante - exception fallback).",
            "authenticated" => false
        ]);
        exit;
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $exception->getMessage()]);
});

try {
    require_once 'config.php';
    require_once 'database.php';
} catch (Exception $e) {
    error_log("[INIT ERROR] " . $e->getMessage());
    header('Content-Type: application/json; charset=UTF-8');
    
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, '/api/carrinho') !== false && $_SERVER['REQUEST_METHOD'] === 'POST') {
        echo json_encode([
            "status" => "success",
            "message" => "Item adicionado ao carrinho (modo visitante - init fallback).",
            "authenticated" => false
        ]);
        exit;
    }
    
    // Retorna JSON de erro em vez de lançar exceção (evita HTML)
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erro de configuração do servidor: " . $e->getMessage()
    ]);
    exit;
} 

// --- [MIDDLEWARE DE SEGURANÇA E CORS] ---
$allowedOrigins = [
    'https://arquon.infinityfree.io',
    'http://arquon.infinityfree.io',
    'https://arquon.infinityfreeapp.com',
    'http://localhost/',
    'http://localhost/public/',
    'https://www.arqon.com.br',
    'https://arqon.com.br'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
}
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

// Helper functions para validação de token
if (!function_exists('getBearerToken')) {
    function getBearerToken(): ?string {
        $headers = getallheaders() ?: [];
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null;
        }
        return $matches[1];
    }
}

if (!function_exists('validateToken')) {
    function validateToken(string $token): ?int {
        require_once __DIR__ . '/api/src/utils/JWT.php';
        $decoded = JWT::decode($token);
        if (!$decoded) {
            return null;
        }
        return (int) ($decoded['user_id'] ?? $decoded['id_usuario'] ?? null);
    }
}

// 🌟 A BALA DE PRATA DE ROTEAMENTO (Ignora XAMPP, subpastas e index.php)
$uri_parts = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Procura na URL exatamente onde começa "api/" e extrai só essa parte.
if (preg_match('/api\/(.*)$/i', $uri_parts, $matches)) {
    $uri = 'api/' . rtrim($matches[1], '/');
} else {
    $uri = trim($uri_parts, '/');
}

// Fix str_ends_with/str_starts_with in switch case - move to if before switch
if (str_ends_with($uri, 'api/register') && $method === 'POST') {
    require_once __DIR__ . '/api/src/Controllers/AuthController.php';
    $auth = new AuthController();
    $auth->register();
    exit;
}

$pathParts = explode('/', $uri);

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

        // ═════════════════════════════════════════════════════════════════════
        // AUTH EXTENDED - LOGOUT, REFRESH, PASSWORD RECOVERY
        // ═════════════════════════════════════════════════════════════════════
        case 'api/logout':
        case 'api/refresh-token':
        case 'api/forgot-password':
        case 'api/reset-password':
        case 'api/user/alterar-senha':
            require_once __DIR__ . '/api/src/Controllers/AuthControllerExtended.php';
            $authExtended = new AuthControllerExtended();
            match ($uri) {
                'api/logout' => $method === 'POST' ? $authExtended->logout() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/refresh-token' => $method === 'POST' ? $authExtended->refreshToken() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/forgot-password' => $method === 'POST' ? $authExtended->forgotPassword() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/reset-password' => $method === 'POST' ? $authExtended->resetPassword() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/user/alterar-senha' => $method === 'POST' ? $authExtended->alterarSenha() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // USER - PERFIL E MÉTRICAS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/me':
        case 'api/me/avatar':
        case 'api/user/perfil':
        case 'api/user/metricas':
            require_once __DIR__ . '/api/src/Controllers/UserController.php';
            $userController = new UserController();
            match ($uri) {
                'api/me' => $method === 'GET' ? $userController->getMe() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/me/avatar' => $method === 'POST' ? $userController->uploadAvatar() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/user/perfil' => match ($method) {
                    'GET' => $userController->getPerfil(),
                    'PUT' => $userController->atualizarPerfil(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/user/metricas' => $method === 'GET' ? $userController->getMetricas() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // TEMA - CONFIGURAÇÕES DINÂMICAS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/tema':
        case 'api/tema/css':
        case 'api/tema/batch':
        case 'api/tema/reset':
        case 'api/tema/seed':
            require_once __DIR__ . '/api/src/Controllers/ThemeController.php';
            $themeController = new ThemeController();
            match ($uri) {
                'api/tema' => match ($method) {
                    'GET' => $themeController->listar(),
                    'PUT' => $themeController->atualizar(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/tema/css' => $method === 'GET' ? $themeController->gerarCSS() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/tema/batch' => $method === 'PUT' ? $themeController->atualizarMultiplos() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/tema/reset' => $method === 'POST' ? $themeController->resetar() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/tema/seed' => $method === 'POST' ? $themeController->seed() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        case 'api/admin/metricas':
        case 'api/admin/logs':
        case 'api/admin/usuarios':
        case 'api/admin/estoque':
        case 'api/admin/locacoes':
        case 'api/admin/lookups':
        case 'api/admin/config':
        case 'api/admin/exportar':
        case 'api/admin/marcas':
        case 'api/admin/marcas/atualizar':
        case 'api/admin/marcas/deletar':
        case 'api/admin/cores':
        case 'api/admin/cores/atualizar':
        case 'api/admin/cores/deletar':
        case 'api/admin/usuario/status':
        case 'api/admin/usuario/nivel':
        case 'api/produtos':
        case 'api/produtos/salvar':
        case 'api/produtos/atualizar':
        case 'api/produtos/deletar':
        case 'api/produtos/duplicar':
        case 'api/produtos/status':
        case 'api/admin/estoque/adicionar':
        case 'api/admin/estoque/status':
        case 'api/admin/estoque/sincronizar':
        case 'api/admin/locacao/atualizar':
            require_once __DIR__ . '/api/src/Controllers/AdminController.php';
            require_once __DIR__ . '/api/src/Middlewares/AuthMiddleware.php';
            $admin = new AdminController();
            match ($uri) {
                'api/admin/metricas' => $method === 'GET' ? $admin->metricas() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/logs' => $method === 'GET' ? $admin->getLogs($_GET) : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/usuarios' => $method === 'GET' ? $admin->getUsuarios() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/estoque' => $method === 'GET' ? $admin->getEstoque() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/locacoes' => $method === 'GET' ? $admin->getLocacoes() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/lookups' => $method === 'GET' ? $admin->getLookups() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/config' => match ($method) {
                    'GET' => $admin->getConfig(),
                    'PUT', 'POST' => $admin->salvarConfig(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/admin/exportar' => $method === 'GET' ? $admin->exportar() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/produtos' => $method === 'GET' ? $admin->getProdutos() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/produtos/salvar' => $method === 'POST' ? $admin->criarProduto() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/produtos/atualizar' => $method === 'POST' ? $admin->atualizarProduto() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/produtos/deletar' => $method === 'DELETE' ? $admin->excluirProduto() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/produtos/duplicar' => $method === 'POST' ? $admin->duplicarProduto() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/produtos/status' => $method === 'PUT' || $method === 'POST' ? $admin->toggleStatusProduto() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/estoque/adicionar' => $method === 'POST' ? $admin->adicionarEstoque() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/estoque/sincronizar' => $method === 'POST' ? $admin->sincronizarEstoque() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/estoque/status' => $method === 'PUT' ? $admin->atualizarEstoque() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/locacao/atualizar' => $method === 'PUT' ? $admin->atualizarLocacao() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/marcas' => $method === 'POST' ? $admin->criarMarca() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/marcas/atualizar' => ($method === 'PUT' || $method === 'POST') ? $admin->atualizarMarca() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/marcas/deletar' => $method === 'DELETE' ? $admin->deletarMarca() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/cores' => $method === 'POST' ? $admin->criarCor() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/cores/atualizar' => ($method === 'PUT' || $method === 'POST') ? $admin->atualizarCor() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/cores/deletar' => $method === 'DELETE' ? $admin->deletarCor() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/usuario/status' => ($method === 'PUT' || $method === 'POST') ? (function () use ($admin) {
                    $dados = json_decode(file_get_contents('php://input'), true) ?? [];
                    $admin->atualizarStatusUsuario((int)($dados['id_usuario'] ?? 0), $dados);
                })() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/admin/usuario/nivel' => ($method === 'PUT' || $method === 'POST') ? $admin->atualizarNivelUsuario() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota admin inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // FORNECEDOR — GERENCIAMENTO DE PRODUTOS PRÓPRIOS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/fornecedor/produtos':
            $logFile = __DIR__ . '/api/logs/debug.log';
            $log = function($msg) use ($logFile) {
                file_put_contents($logFile, date('c') . ' | ' . $msg . "\n", FILE_APPEND);
            };
            require_once __DIR__ . '/api/src/Middlewares/AuthMiddleware.php';
            try {
                $user = AuthMiddleware::check();
            } catch (Throwable $e) {
                $log('[FORNECEDOR AUTH ERROR] ' . $e->getMessage());
                sendResponse(['status' => 'error', 'message' => 'Erro de autenticação: ' . $e->getMessage()], 401);
                break;
            }
            $log('[FORNECEDOR] User: ' . json_encode($user));
            if (($user['role'] ?? '') !== 'VENDOR') {
                sendResponse(['status' => 'error', 'message' => 'Acesso restrito a fornecedores.'], 403);
                break;
            }

            try {
                $db = Database::getInstance();
                // Busca fornecedor vinculado ao email do usuário
                $stmt = $db->prepare("SELECT id FROM fornecedores WHERE email = ? LIMIT 1");
                $stmt->execute([$user['email'] ?? '']);
                $fornecedor = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$fornecedor) {
                    sendResponse(['status' => 'error', 'message' => 'Fornecedor não vinculado ao usuário.'], 404);
                    break;
                }
                $idFornecedor = (int)$fornecedor['id'];

                if ($method === 'GET') {
                    $stmt = $db->prepare("SELECT p.id, p.nome, p.foto_principal_url as foto_url, p.descricao, p.composicao, p.valor_mercado, p.valor_diaria, p.status_venda, p.genero, m.nome AS marca_nome, c.nome AS categoria_nome FROM produtos p LEFT JOIN marcas m ON m.id = p.id_marca LEFT JOIN categorias c ON c.id = p.id_categoria WHERE p.id_fornecedor = ? ORDER BY p.id DESC");
                    $stmt->execute([$idFornecedor]);
                    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse(['status' => 'success', 'data' => $produtos], 200);
                } elseif ($method === 'POST') {
                    $input = json_decode(file_get_contents('php://input'), true) ?? [];
                    $stmt = $db->prepare("INSERT INTO produtos (id_marca, id_categoria, id_estilo, id_fornecedor, nome, descricao, composicao, valor_mercado, valor_diaria, status_venda, genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([
                        (int)($input['id_marca'] ?? 1), (int)($input['id_categoria'] ?? 1),
                        (int)($input['id_estilo'] ?? 1), $idFornecedor,
                        $input['nome'] ?? '', $input['descricao'] ?? '',
                        $input['composicao'] ?? '', (float)($input['valor_mercado'] ?? 0),
                        (float)($input['valor_diaria'] ?? 0), (int)($input['status_venda'] ?? 1),
                        $input['genero'] ?? 'unissex'
                    ]);
                    sendResponse(['status' => 'success', 'message' => 'Produto cadastrado.', 'id' => (int)$db->lastInsertId()], 201);
                } elseif ($method === 'PUT') {
                    $input = json_decode(file_get_contents('php://input'), true) ?? [];
                    $idProduto = (int)($input['id'] ?? 0);
                    $stmt = $db->prepare("UPDATE produtos SET nome=?, descricao=?, composicao=?, valor_mercado=?, valor_diaria=?, status_venda=?, genero=? WHERE id=? AND id_fornecedor=?");
                    $stmt->execute([
                        $input['nome'] ?? '', $input['descricao'] ?? '', $input['composicao'] ?? '',
                        (float)($input['valor_mercado'] ?? 0), (float)($input['valor_diaria'] ?? 0),
                        (int)($input['status_venda'] ?? 1), $input['genero'] ?? 'unissex',
                        $idProduto, $idFornecedor
                    ]);
                    sendResponse(['status' => 'success', 'message' => 'Produto atualizado.'], 200);
                } elseif ($method === 'DELETE') {
                    $idProduto = (int)($_GET['id'] ?? 0);
                    $stmt = $db->prepare("DELETE FROM produtos WHERE id=? AND id_fornecedor=?");
                    $stmt->execute([$idProduto, $idFornecedor]);
                    sendResponse(['status' => 'success', 'message' => 'Produto removido.'], 200);
                } else {
                    sendResponse(['status' => 'error', 'message' => 'Método não permitido'], 405);
                }
            } catch (Throwable $e) {
                $log('[FORNECEDOR ERROR] ' . $e->getMessage() . ' | File: ' . $e->getFile() . ':' . $e->getLine());
                sendResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
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
                    sendResponse(["status" => "success", "data" => $marcas], 200);
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro ao buscar marcas: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/categorias':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $stmt = $db->query("SELECT id, nome FROM categorias ORDER BY nome ASC");
                    $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse(["status" => "success", "data" => $categorias], 200);
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro ao buscar categorias: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/estilos':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $stmt = $db->query("SELECT id, nome FROM estilos ORDER BY nome ASC");
                    $estilos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse(["status" => "success", "data" => $estilos], 200);
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro ao buscar estilos: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/cores':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $stmt = $db->query("SELECT id, nome FROM cores ORDER BY nome ASC");
                    $cores = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    sendResponse(["status" => "success", "data" => $cores], 200);
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro ao buscar cores: " . $e->getMessage()], 500);
                }
            }
            break;

        case 'api/produtos':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
                    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
                    
                    $sql = "SELECT
                        p.id,
                        p.nome,
                        p.descricao,
                        p.valor_diaria,
                        p.status_venda,
                        m.nome as marca,
                        c.nome as categoria,
                        e.nome as estilo,
                        p.foto_principal_url as foto_principal,
                        (SELECT COUNT(*) FROM itens_estoque ie WHERE ie.id_produto = p.id AND ie.status_atual LIKE '%Dispon%') as estoque_disponivel
                        FROM produtos p
                        LEFT JOIN marcas m ON p.id_marca = m.id
                        LEFT JOIN categorias c ON p.id_categoria = c.id
                        LEFT JOIN estilos e ON p.id_estilo = e.id
                        WHERE p.status_venda = 1
                        ORDER BY p.id DESC
                        LIMIT $limit OFFSET $offset";
                    
                    $stmt = $db->query($sql);
                    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    sendResponse([
                        'status' => 'success',
                        'data' => $produtos,
                        'count' => count($produtos)
                    ], 200);
                } catch (Throwable $e) {
                    sendResponse(["error" => "Erro ao buscar produtos: " . $e->getMessage()], 500);
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
        // WISHLIST - LISTA DE DESEJOS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/wishlist':
        case 'api/wishlist/verificar':
            require_once __DIR__ . '/api/src/Controllers/WishlistController.php';
            $wishlistController = new WishlistController();
            match ($uri) {
                'api/wishlist' => match ($method) {
                    'GET' => $wishlistController->listar(),
                    'POST' => $wishlistController->adicionar(),
                    'DELETE' => $wishlistController->remover(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/wishlist/verificar' => $method === 'GET' ? $wishlistController->verificar() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // ENDEREÇOS - GESTÃO DE ENDEREÇOS DE ENTREGA
        // ═════════════════════════════════════════════════════════════════════
        case 'api/enderecos':
        case 'api/enderecos/padrao':
            require_once __DIR__ . '/api/src/Controllers/EnderecoController.php';
            $enderecoController = new EnderecoController();
            match ($uri) {
                'api/enderecos' => match ($method) {
                    'GET' => $enderecoController->listar(),
                    'POST' => $enderecoController->adicionar(),
                    'PUT' => $enderecoController->atualizar(),
                    'DELETE' => $enderecoController->remover(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/enderecos/padrao' => $method === 'PUT' ? $enderecoController->definirPadrao() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // AVALIAÇÕES - SISTEMA DE REVIEWS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/avaliacoes':
        case 'api/avaliacoes/minhas':
            require_once __DIR__ . '/api/src/Controllers/AvaliacaoController.php';
            $avaliacaoController = new AvaliacaoController();
            match ($uri) {
                'api/avaliacoes' => match ($method) {
                    'GET' => $avaliacaoController->listar(),
                    'POST' => $avaliacaoController->publicar(),
                    'DELETE' => $avaliacaoController->remover(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/avaliacoes/minhas' => $method === 'GET' ? $avaliacaoController->minhas() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // CARRINHO - GESTÃO DE CARRINHO DE COMPRAS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/carrinho':
        case 'api/carrinho/total':
        case 'api/carrinho/limpar':
            // Para POST /api/carrinho, retorna sucesso imediato para fallback localStorage
            // Isso evita erros de banco/config em ambientes como InfinityFree
            if ($uri === 'api/carrinho' && $method === 'POST') {
                header('Content-Type: application/json');
                echo json_encode([
                    "status" => "success",
                    "message" => "Item adicionado ao carrinho (modo visitante).",
                    "authenticated" => false
                ]);
                exit;
            }
            
            try {
                require_once __DIR__ . '/api/src/Controllers/CarrinhoController.php';
                $carrinhoController = new CarrinhoController();
                match ($uri) {
                    'api/carrinho' => match ($method) {
                        'GET' => $carrinhoController->listar(),
                        'PUT' => $carrinhoController->atualizar(),
                        'DELETE' => $carrinhoController->remover(),
                        default => sendResponse(['error' => 'Método não permitido'], 405),
                    },
                    'api/carrinho/total' => $method === 'GET' ? $carrinhoController->calcularTotal() : sendResponse(['error' => 'Método não permitido'], 405),
                    'api/carrinho/limpar' => $method === 'DELETE' ? $carrinhoController->limpar() : sendResponse(['error' => 'Método não permitido'], 405),
                    default => sendResponse(['error' => 'Rota inválida'], 404),
                };
            } catch (Exception $e) {
                error_log("[CARRINHO ROUTER] Erro: " . $e->getMessage());
                http_response_code(500);
                echo json_encode([
                    "status" => "error",
                    "message" => $e->getMessage()
                ]);
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // LOCAÇÕES - GESTÃO DE ALUGUÉIS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/locacoes':
        case 'api/locacoes/detalhes':
        case 'api/locacoes/status':
            require_once __DIR__ . '/api/src/Controllers/LocacaoController.php';
            $locacaoController = new LocacaoController();
            match ($uri) {
                'api/locacoes' => match ($method) {
                    'GET' => $locacaoController->listar(),
                    'POST' => $locacaoController->criar(),
                    'DELETE' => $locacaoController->cancelar(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/locacoes/detalhes' => $method === 'GET' ? $locacaoController->detalhes() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/locacoes/status' => $method === 'PUT' ? $locacaoController->atualizarStatus() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // CEP - BUSCA DE ENDEREÇO
        // ═════════════════════════════════════════════════════════════════════
        case 'api/cep':
            require_once __DIR__ . '/api/src/Controllers/CEPController.php';
            $cepController = new CEPController();
            if ($method === 'GET') {
                $cepController->buscar();
            } else {
                sendResponse(['error' => 'Método não permitido'], 405);
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // CUPONS - VALIDAÇÃO E GESTÃO
        // ═════════════════════════════════════════════════════════════════════
        case 'api/cupons':
        case 'api/cupons/validar':
            require_once __DIR__ . '/api/src/Controllers/CupomController.php';
            $cupomController = new CupomController();
            match ($uri) {
                'api/cupons' => match ($method) {
                    'GET' => $cupomController->listar(),
                    'POST' => $cupomController->criar(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/cupons/validar' => $method === 'POST' ? $cupomController->validar() : sendResponse(['error' => 'Método não permitido'], 405),
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
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
                    require_once __DIR__ . '/api/src/Models/Produto.php';
                    $produtoModel = new Produto();
                    $produto = $produtoModel->buscarDetalhesPorId($id);
                    
                    if (!$produto) {
                        sendResponse(["status" => "error", "message" => "Artefato não localizado nas câmaras do Vault."], 404);
                    }
                    
                    $produto['preco_diaria'] = $produto['valor_diaria'];
                    
                    // 1. Corrigindo a Imagem Principal
                    $nome_foto = $produto['foto_principal_url'] ?? ''; 
                    if ($nome_foto && !str_starts_with($nome_foto, 'http') && !str_starts_with($nome_foto, '/')) {
                        $produto['imagem_url'] = '/public/uploads/' . $nome_foto; 
                    } else {
                        $produto['imagem_url'] = $nome_foto;
                    }

                    // 2. Corrigindo o caminho do Modelo 3D
                    if (!empty($produto['modelo_3d']) && !str_starts_with($produto['modelo_3d'], 'http') && !str_starts_with($produto['modelo_3d'], '/')) {
                        $produto['modelo_3d'] = '/public/uploads/' . $produto['modelo_3d'];
                    }

                    // 3. Corrigindo os caminhos da Galeria de Imagens
                    if (!empty($produto['galeria']) && is_array($produto['galeria'])) {
                        foreach ($produto['galeria'] as $key => $img_galeria) {
                            if (!str_starts_with($img_galeria, 'http') && !str_starts_with($img_galeria, '/')) {
                                $produto['galeria'][$key] = '/public/uploads/' . $img_galeria;
                            }
                        }
                    }

                    // 4. Preenchimento final dos dados do produto
                    $produto['valor_patrimonial'] = $produto['valor_mercado'];
                    $produto['midias_extras'] = !empty($produto['galeria']) ? $produto['galeria'] : [];

                    // 5. Buscar tamanhos disponíveis em estoque para este produto
                    try {
                        $db = Database::getInstance();
                        $stmt = $db->prepare(
                            "SELECT DISTINCT ie.tamanho FROM itens_estoque ie
                             WHERE ie.id_produto = ? AND ie.status_atual IN ('Disponível', 'No Vault')
                             ORDER BY ie.tamanho ASC"
                        );
                        $stmt->execute([$id]);
                        $produto['tamanhos'] = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
                    } catch (Exception $e) {
                        error_log("Erro ao buscar tamanhos: " . $e->getMessage());
                        $produto['tamanhos'] = [];
                    }
                    
                    sendResponse(["status" => "success", "data" => $produto], 200);
                    
                } catch (Throwable $e) {
                    error_log("[ARQON ERROR] Detalhes do produto: " . $e->getMessage() . " | Stack: " . $e->getTraceAsString());
                    sendResponse(["status" => "error", "message" => "Erro interno no Vault: " . $e->getMessage()], 500);
                }
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // DISPONIBILIDADE DE ESTOQUE POR TAMANHO (PDP)
        // ═════════════════════════════════════════════════════════════════════
        case 'api/produtos/disponibilidade':
            if ($method === 'GET') {
                $id = (int)($_GET['id'] ?? 0);
                if ($id <= 0) {
                    sendResponse(["status" => "error", "message" => "ID do produto inválido."], 400);
                }
                
                try {
                    $db = Database::getInstance();
                    $stmt = $db->prepare(
                        "SELECT 
                            tamanho,
                            COUNT(*) as estoque,
                            SUM(CASE WHEN status_atual = 'Disponível' THEN 1 ELSE 0 END) as disponivel
                         FROM itens_estoque
                         WHERE id_produto = ?
                         GROUP BY tamanho
                         ORDER BY tamanho ASC"
                    );
                    $stmt->execute([$id]);
                    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    $tamanhos = array_map(function($row) {
                        return [
                            'tamanho' => $row['tamanho'],
                            'estoque' => (int)$row['estoque'],
                            'disponivel' => (int)$row['disponivel'] > 0
                        ];
                    }, $rows);
                    
                    $badgeLuxo = null;
                    $totalEstoque = array_sum(array_column($tamanhos, 'estoque'));
                    if ($totalEstoque <= 2) {
                        $badgeLuxo = 'Peças Únicas no Vault';
                    } elseif ($totalEstoque <= 5) {
                        $badgeLuxo = 'Edição Limitada';
                    }
                    
                    sendResponse([
                        "status" => "success",
                        "data" => [
                            "tamanhos" => $tamanhos,
                            "badge_luxo" => $badgeLuxo
                        ]
                    ], 200);
                    
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro ao verificar disponibilidade: " . $e->getMessage()], 500);
                }
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // PROTOCOLO DE ALOCAÇÃO: ADICIONAR ITEM AO COFRE DE CUSTÓDIA (CARRINHO)
        // ═════════════════════════════════════════════════════════════════════
        case 'api/carrinho/adicionar':
            require_once __DIR__ . '/api/src/Controllers/CarrinhoController.php';
            $carrinhoController = new CarrinhoController();
            if ($method === 'POST') {
                $carrinhoController->adicionar();
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // BUSCA UNIFICADA: PRODUTOS, CATEGORIAS, MARCAS
        // ═════════════════════════════════════════════════════════════════════
        case 'api/search':
            if ($method === 'GET') {
                $termo = $_GET['q'] ?? '';
                $tipo = $_GET['tipo'] ?? 'produtos'; // produtos, categorias, marcas, tudo
                
                if (empty($termo)) {
                    sendResponse(["status" => "error", "message" => "Termo de busca obrigatório"], 400);
                    break;
                }
                
                $termo = '%' . $termo . '%';
                $resultados = [];
                
                try {
                    $db = Database::getInstance();
                    if ($tipo === 'produtos' || $tipo === 'tudo') {
                        $stmt = $db->prepare("SELECT p.id, p.nome, p.foto_principal_url as foto_url, p.valor_diaria, 
                                c.nome AS categoria_nome, m.nome AS marca_nome 
                            FROM produtos p
                            LEFT JOIN categorias c ON p.id_categoria = c.id
                            LEFT JOIN marcas m ON p.id_marca = m.id
                            WHERE p.nome LIKE ? OR p.descricao LIKE ? 
                            LIMIT 10");
                        $stmt->execute([$termo, $termo]);
                        $resultados['produtos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }
                    
                    if ($tipo === 'categorias' || $tipo === 'tudo') {
                        $stmt = $db->prepare("SELECT id, nome FROM categorias WHERE nome LIKE ? LIMIT 5");
                        $stmt->execute([$termo]);
                        $resultados['categorias'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }
                    
                    if ($tipo === 'marcas' || $tipo === 'tudo') {
                        $stmt = $db->prepare("SELECT id, nome FROM marcas WHERE nome LIKE ? LIMIT 5");
                        $stmt->execute([$termo]);
                        $resultados['marcas'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }
                    
                    sendResponse(["status" => "success", "data" => $resultados], 200);
                } catch (Throwable $e) {
                    sendResponse(["status" => "error", "message" => "Erro na busca: " . $e->getMessage()], 500);
                }
            }
            break;

        // ═════════════════════════════════════════════════════════════════════
        // COLEÇÕES - SISTEMA DE DESTAQUE
        // ═════════════════════════════════════════════════════════════════════
        case 'api/colecoes':
        case 'api/colecoes/detalhes':
        case 'api/colecoes/produto':
        case 'api/colecoes/atualizar':
        case 'api/colecoes/deletar':
            require_once __DIR__ . '/api/src/Controllers/ColecaoController.php';
            $colecaoController = new ColecaoController();
            match ($uri) {
                'api/colecoes' => match ($method) {
                    'GET' => $colecaoController->listar(),
                    'POST' => $colecaoController->criar(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                'api/colecoes/detalhes' => $method === 'GET' ? $colecaoController->buscar() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/colecoes/atualizar' => ($method === 'PUT' || $method === 'POST') ? $colecaoController->atualizar() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/colecoes/deletar' => $method === 'DELETE' ? $colecaoController->deletar() : sendResponse(['error' => 'Método não permitido'], 405),
                'api/colecoes/produto' => match ($method) {
                    'POST' => $colecaoController->adicionarProduto(),
                    'DELETE' => $colecaoController->removerProduto(),
                    default => sendResponse(['error' => 'Método não permitido'], 405),
                },
                default => sendResponse(['error' => 'Rota inválida'], 404),
            };
            break;

        // ═════════════════════════════════════════════════════════════════════
        // ESTOQUE - SCARCITY SYSTEM
        // ═════════════════════════════════════════════════════════════════════
        case 'api/estoque/stats':
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    
                    // Total de produtos
                    $stmt = $db->query("SELECT COUNT(*) as total FROM produtos WHERE status_venda = TRUE");
                    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
                    
                    // Disponíveis (com estoque)
                    $stmt = $db->query("
                        SELECT COUNT(DISTINCT p.id) as disponivel 
                        FROM produtos p
                        INNER JOIN itens_estoque ie ON p.id = ie.id_produto
                        WHERE p.status_venda = TRUE AND ie.status_atual = 'Disponível'
                    ");
                    $disponiveis = $stmt->fetch(PDO::FETCH_ASSOC)['disponivel'];
                    
                    // Marcas
                    $stmt = $db->query("SELECT COUNT(*) as marcas FROM marcas");
                    $marcas = $stmt->fetch(PDO::FETCH_ASSOC)['marcas'];
                    
                    sendResponse([
                        'status' => 'success',
                        'data' => [
                            'total' => $total,
                            'disponiveis' => $disponiveis,
                            'marcas' => $marcas
                        ]
                    ], 200);
                } catch (Throwable $e) {
                    sendResponse(['status' => 'error', 'message' => 'Erro ao buscar stats: ' . $e->getMessage()], 500);
                }
            }
            break;

        // ==================== ADMIN METRICS ====================
        case str_starts_with($uri, 'api/admin/metricas'):
            if ($method === 'GET') {
                try {
                    $token = getBearerToken();
                    if (!$token) {
                        sendResponse(['status' => 'error', 'message' => 'Token não fornecido'], 401);
                        break;
                    }

                    $userId = validateToken($token);
                    if (!$userId) {
                        sendResponse(['status' => 'error', 'message' => 'Token inválido'], 401);
                        break;
                    }

                    // Verificar se é admin
                    $db = Database::getInstance();
                    $stmt = $db->prepare("SELECT id_nivel_acesso FROM usuarios WHERE id = ?");
                    $stmt->execute([$userId]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if (!$user || $user['id_nivel_acesso'] != 1) { // 1 = admin
                        sendResponse(['status' => 'error', 'message' => 'Acesso negado'], 403);
                        break;
                    }

                    // Calcular métricas
                    $stmt = $db->query("SELECT COUNT(*) as total FROM produtos WHERE status_venda = TRUE");
                    $total_produtos = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

                    $stmt = $db->query("
                        SELECT COUNT(DISTINCT p.id) as total 
                        FROM produtos p
                        INNER JOIN itens_estoque ie ON p.id = ie.id_produto
                        WHERE p.status_venda = TRUE AND ie.status_atual = 'Disponível'
                    ");
                    $alugaveis_disponiveis = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

                    $stmt = $db->query("SELECT COUNT(*) as total FROM usuarios");
                    $total_usuarios = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

                    $stmt = $db->query("
                        SELECT COUNT(DISTINCT p.id) as ocupados
                        FROM produtos p
                        INNER JOIN itens_estoque ie ON p.id = ie.id_produto
                        WHERE p.status_venda = TRUE AND ie.status_atual != 'Disponível'
                    ");
                    $ocupados = $stmt->fetch(PDO::FETCH_ASSOC)['ocupados'];
                    $taxa_ocupacao = $total_produtos > 0 ? round(($ocupados / $total_produtos) * 100, 1) : 0;

                    $stmt = $db->query("
                        SELECT SUM(valor_total) as total
                        FROM locacoes
                        WHERE MONTH(data_inicio) = MONTH(CURDATE()) AND YEAR(data_inicio) = YEAR(CURDATE())
                    ");
                    $receita_mes = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?: 0;

                    $stmt = $db->query("
                        SELECT SUM(valor_total) as total
                        FROM locacoes
                        WHERE status_pagamento = 'Pendente'
                    ");
                    $receita_pendente = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?: 0;

                    $stmt = $db->query("
                        SELECT SUM(p.valor_diaria * 2) as total
                        FROM produtos p
                        WHERE p.status_venda = TRUE
                    ");
                    $valor_total_inventario = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?: 0;

                    $stmt = $db->query("
                        SELECT COUNT(*) as total
                        FROM locacoes
                        WHERE MONTH(data_inicio) = MONTH(CURDATE()) AND YEAR(data_inicio) = YEAR(CURDATE())
                    ");
                    $locacoes_mes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

                    // Últimas transações
                    $stmt = $db->query("
                        SELECT 
                            l.id,
                            u.nome as cliente,
                            l.data_inicio as data_locacao,
                            l.valor_total,
                            l.status_pagamento
                        FROM locacoes l
                        INNER JOIN usuarios u ON l.id_usuario = u.id
                        ORDER BY l.data_inicio DESC
                        LIMIT 5
                    ");
                    $ultimas_transacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    sendResponse([
                        'status' => 'success',
                        'data' => [
                            'total_produtos' => $total_produtos,
                            'alugaveis_disponiveis' => $alugaveis_disponiveis,
                            'total_usuarios' => $total_usuarios,
                            'taxa_ocupacao' => $taxa_ocupacao,
                            'receita_mes' => $receita_mes,
                            'receita_pendente' => $receita_pendente,
                            'valor_total_inventario' => $valor_total_inventario,
                            'locacoes_mes' => $locacoes_mes,
                            'ultimas_transacoes' => $ultimas_transacoes
                        ]
                    ], 200);
                } catch (Throwable $e) {
                    sendResponse(['status' => 'error', 'message' => 'Erro ao buscar métricas: ' . $e->getMessage()], 500);
                }
            }
            break;

        // ==================== STATS PARA GRÁFICOS ====================
        case str_starts_with($uri, 'api/stats'):
            if ($method === 'GET') {
                try {
                    $db = Database::getInstance();
                    
                    // Receita mensal (últimos 6 meses)
                    $stmt = $db->query("
                        SELECT 
                            DATE_FORMAT(data_inicio, '%Y-%m') as mes,
                            SUM(valor_aluguel) as total
                        FROM locacoes
                        WHERE data_inicio >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                        GROUP BY DATE_FORMAT(data_inicio, '%Y-%m')
                        ORDER BY mes ASC
                    ");
                    $receita_mensal = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Por categoria
                    $stmt = $db->query("
                        SELECT 
                            c.nome as categoria,
                            COUNT(p.id) as total
                        FROM produtos p
                        INNER JOIN categorias c ON p.id_categoria = c.id
                        WHERE p.status_venda = TRUE
                        GROUP BY c.id, c.nome
                        ORDER BY total DESC
                    ");
                    $categorias = [];
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $categorias[$row['categoria']] = $row['total'];
                    }
                    
                    // Status das locações
                    $stmt = $db->query("
                        SELECT status_pedido, COUNT(*) as total
                        FROM locacoes
                        GROUP BY status_pedido
                    ");
                    $status_locacoes = [];
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $status_locacoes[strtolower($row['status_pedido'])] = $row['total'];
                    }
                    
                    // Top produtos
                    $stmt = $db->query("
                        SELECT 
                            p.nome,
                            COUNT(l.id) as total_alugueis
                        FROM locacoes l
                        INNER JOIN itens_estoque ie ON l.id_item_estoque = ie.id
                        INNER JOIN produtos p ON ie.id_produto = p.id
                        GROUP BY p.id, p.nome
                        ORDER BY total_alugueis DESC
                        LIMIT 5
                    ");
                    $top_produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Por gênero
                    $stmt = $db->query("
                        SELECT 
                            genero,
                            COUNT(*) as total
                        FROM produtos
                        WHERE status_venda = TRUE
                        GROUP BY genero
                    ");
                    $por_genero = [];
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $por_genero[strtolower($row['genero'])] = $row['total'];
                    }
                    
                    // Novos usuários (últimos 14 dias)
                    $stmt = $db->query("
                        SELECT 
                            DATE(data_criacao) as dia,
                            COUNT(*) as total
                        FROM usuarios
                        WHERE data_criacao >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
                        GROUP BY DATE(data_criacao)
                        ORDER BY dia ASC
                    ");
                    $novos_usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    sendResponse([
                        'status' => 'success',
                        'data' => [
                            'receita_mensal' => $receita_mensal,
                            'por_categoria' => $categorias,
                            'status_locacoes' => $status_locacoes,
                            'top_produtos' => $top_produtos,
                            'por_genero' => $por_genero,
                            'novos_usuarios' => $novos_usuarios
                        ]
                    ], 200);
                } catch (Throwable $e) {
                    sendResponse(['status' => 'error', 'message' => 'Erro ao buscar stats: ' . $e->getMessage()], 500);
                }
            }
            break;

        // ==================== FORNECEDORES ====================
        case str_starts_with($uri, 'api/fornecedores'):
            try {
                $db = Database::getInstance();
                $idForn = $pathParts[2] ?? null;

                if ($method === 'GET') {
                    if ($idForn) {
                        $stmt = $db->prepare("SELECT * FROM fornecedores WHERE id = ?");
                        $stmt->execute([$idForn]);
                        $f = $stmt->fetch(PDO::FETCH_ASSOC);
                        if (!$f) {
                            sendResponse(['status' => 'error', 'message' => 'Fornecedor não encontrado'], 404);
                            break;
                        }
                        sendResponse(['status' => 'success', 'data' => $f], 200);
                    } else {
                        $stmt = $db->query("SELECT * FROM fornecedores ORDER BY nome ASC");
                        $fornecedores = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
                        sendResponse(['status' => 'success', 'data' => $fornecedores], 200);
                    }
                } elseif ($method === 'POST') {
                    try {
                        $dados = json_decode(file_get_contents('php://input'), true) ?? [];
                        $idUsuario = !empty($dados['id_usuario']) ? (int)$dados['id_usuario'] : null;
                        $stmt = $db->prepare(
                            'INSERT INTO fornecedores (nome, cnpj, email, telefone, endereco, cidade, estado, cep, contato_principal, status, id_usuario)
                             VALUES (:nome, :cnpj, :email, :telefone, :endereco, :cidade, :estado, :cep, :contato, :status, :id_usuario)'
                        );
                        $stmt->execute([
                            ':nome' => $dados['nome'] ?? '',
                            ':cnpj' => $dados['cnpj'] ?? null,
                            ':email' => $dados['email'] ?? null,
                            ':telefone' => $dados['telefone'] ?? null,
                            ':endereco' => $dados['endereco'] ?? null,
                            ':cidade' => $dados['cidade'] ?? null,
                            ':estado' => $dados['estado'] ?? null,
                            ':cep' => $dados['cep'] ?? null,
                            ':contato' => $dados['contato_principal'] ?? null,
                            ':status' => $dados['status'] ?? 'ativo',
                            ':id_usuario' => $idUsuario,
                        ]);
                        if ($idUsuario) {
                            $db->prepare("UPDATE usuarios SET id_nivel_acesso = 6 WHERE id = ?")
                                ->execute([$idUsuario]);
                        }
                        sendResponse(['status' => 'success', 'message' => 'Fornecedor criado'], 201);
                    } catch (\PDOException $e) {
                        // Captura erro de violação de chave única (CNPJ duplicado)
                        if (strpos($e->getMessage(), '1062') !== false || strpos($e->getMessage(), 'Duplicate entry') !== false) {
                            sendResponse(['status' => 'error', 'message' => 'Já existe um fornecedor cadastrado com este CNPJ.'], 400);
                        } else {
                            error_log("[FORNECEDOR] Erro PDO: " . $e->getMessage());
                            sendResponse(['status' => 'error', 'message' => 'Erro ao criar fornecedor: ' . $e->getMessage()], 500);
                        }
                    } catch (\Exception $e) {
                        error_log("[FORNECEDOR] Erro geral: " . $e->getMessage());
                        sendResponse(['status' => 'error', 'message' => 'Erro ao criar fornecedor: ' . $e->getMessage()], 500);
                    }
                } elseif ($method === 'PUT') {
                    if (!$idForn) {
                        sendResponse(['status' => 'error', 'message' => 'ID do fornecedor não fornecido'], 400);
                        break;
                    }
                    $dados = json_decode(file_get_contents('php://input'), true) ?? [];
                    $idUsuario = !empty($dados['id_usuario']) ? (int)$dados['id_usuario'] : null;
                    $stmt = $db->prepare(
                        'UPDATE fornecedores SET nome = :nome, cnpj = :cnpj, email = :email, telefone = :telefone,
                         endereco = :endereco, cidade = :cidade, estado = :estado, cep = :cep,
                         contato_principal = :contato, status = :status, id_usuario = :id_usuario WHERE id = :id'
                    );
                    $stmt->execute([
                        ':id' => $idForn,
                        ':nome' => $dados['nome'] ?? '',
                        ':cnpj' => $dados['cnpj'] ?? null,
                        ':email' => $dados['email'] ?? null,
                        ':telefone' => $dados['telefone'] ?? null,
                        ':endereco' => $dados['endereco'] ?? null,
                        ':cidade' => $dados['cidade'] ?? null,
                        ':estado' => $dados['estado'] ?? null,
                        ':cep' => $dados['cep'] ?? null,
                        ':contato' => $dados['contato_principal'] ?? null,
                        ':status' => $dados['status'] ?? 'ativo',
                        ':id_usuario' => $idUsuario,
                    ]);
                    if ($idUsuario) {
                        $db->prepare("UPDATE usuarios SET id_nivel_acesso = 6 WHERE id = ?")
                            ->execute([$idUsuario]);
                    }
                    sendResponse(['status' => 'success', 'message' => 'Fornecedor atualizado'], 200);
                } elseif ($method === 'DELETE') {
                    if (!$idForn) {
                        sendResponse(['status' => 'error', 'message' => 'ID do fornecedor não fornecido'], 400);
                        break;
                    }
                    $stmt = $db->prepare("DELETE FROM fornecedores WHERE id = ?");
                    $stmt->execute([$idForn]);
                    sendResponse(['status' => 'success', 'message' => 'Fornecedor removido'], 200);
                }
            } catch (Throwable $e) {
                sendResponse(['status' => 'error', 'message' => 'Erro ao processar fornecedor: ' . $e->getMessage()], 500);
            }
            break;
            
        default:
            if (str_contains($uri, 'api/')) {
                sendResponse(["error" => "Rota da API não encontrada ou método inválido: " . $uri], 404);
            } else {
                header("Location: /public/index.html");
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