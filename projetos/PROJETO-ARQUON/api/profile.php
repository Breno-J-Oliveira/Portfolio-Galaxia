<?php
/**
 * ARQON | THE VAULT - ENDPOINT OPERACIONAL PERFIL (MY VAULT CONTROL)
 * Finalidade: Executar queries limpas via Prepared Statements
 * Arquitetura: PROJETO-ARQUON/api/profile.php
 */

declare(strict_types=1);

// 1. IMPORTAÇÃO DOS NÚCLEOS DO SISTEMA
// Como o arquivo está em /api/, subimos um nível (../) para achar a raiz
if (file_exists(__DIR__ . '/../config.php')) {
    require_once __DIR__ . '/../config.php';
} else if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}

if (file_exists(__DIR__ . '/../database.php')) {
    require_once __DIR__ . '/../database.php';
} else if (file_exists(__DIR__ . '/database.php')) {
    require_once __DIR__ . '/database.php';
}

if (file_exists(__DIR__ . '/../api/src/utils/JWT.php')) {
    require_once __DIR__ . '/../api/src/utils/JWT.php';
} else if (file_exists(__DIR__ . '/src/utils/JWT.php')) {
    require_once __DIR__ . '/src/utils/JWT.php';
}

// Inicializa a conexão segura via Singleton
$pdo = Database::getInstance(); 

// 2. CONFIGURAÇÃO DE CABEÇALHOS (CORS TOTALMENTE LIMPO E SEM BARRAS)
header('Content-Type: application/json; charset=utf-8');

if (defined('ALLOWED_ORIGIN')) {
    header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 3. VALIDAÇÃO E EXTRAÇÃO DO JWT TOKEN
$headers = getallheaders();
$authHeader = $headers['Authorization'] 
    ?? $headers['authorization'] 
    ?? $_SERVER['HTTP_AUTHORIZATION'] 
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] 
    ?? '';

if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Acesso Negado: Token ausente ou inválido."]);
    exit;
}

$token = $matches[1];
$decodedToken = JWT::decode($token);

if ($decodedToken === null) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Token inválido, expirado ou falsificado."]);
    exit;
}

$userId = $decodedToken['user_id'] ?? $decodedToken['id'] ?? null;
if (empty($userId)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Identificador de usuário não encontrado no token."]);
    exit;
}
// 4. PROCESSADOR DE AÇÕES (GET / POST)
$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    if (empty($action)) {
        $action = $inputData['action'] ?? '';
    }
}

switch ($action) {
    case 'perfil':
        try {
            $stmt = $pdo->prepare("SELECT id, nome, email, foto_url FROM usuarios WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            if (!$user) {
                echo json_encode(["status" => "error", "message" => "Usuário não localizado no banco de dados."]);
                exit;
            }
            
            echo json_encode([
                "status" => "success",
                "data" => [
                    "id" => $user['id'],
                    "nome" => $user['nome'],
                    "email" => $user['email'],
                    "foto_url" => !empty($user['foto_url']) ? $user['foto_url'] : 'assets/images/default-avatar.png'
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Erro ao processar dados cadastrais: " . $e->getMessage()]);
        }
        break;

    case 'dashboard_dados':
        try {
            // Busca histórico de locações/pedidos vinculados ao ID do usuário
            // Exemplo mudando para bater com o seu banco:
            $stmt = $pdo->prepare("SELECT id, total, status, created_at AS data_locacao FROM locacoes WHERE id_usuario = ?");
            $stmt->execute([$userId]);
            $pedidos = $stmt->fetchAll();

            // Busca os artefatos favoritos na lista de desejos do usuário
            $stmtFavoritos = $pdo->prepare("
                SELECT p.id, p.nome, p.preco_diaria, p.imagem_url 
                FROM favoritos f 
                JOIN produtos p ON f.id_produto = p.id 
                WHERE f.id_usuario = ?
            ");
            $stmtFavoritos->execute([$userId]);
            $favoritos = $stmtFavoritos->fetchAll();

            echo json_encode([
                "status" => "success",
                "pedidos" => $pedidos ? $pedidos : [],
                "favoritos" => $favoritos ? $favoritos : []
            ]);
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Erro ao abrir registros do painel: " . $e->getMessage()]);
        }
        break;

    case 'alterar_senha':
        $senhaAtual = $inputData['pass-current'] ?? '';
        $novaSenha = $inputData['pass-new'] ?? '';

        if (empty($senhaAtual) || empty($novaSenha)) {
            echo json_encode(["status" => "error", "message" => "Preencha todos os campos obrigatórios de senha."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("SELECT senha_hash FROM usuarios WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($senhaAtual, $user['senha_hash'])) {
                echo json_encode(["status" => "error", "message" => "A senha atual digitada está incorreta."]);
                exit;
            }

            // Algoritmo mestre definido globalmente
            $algoritmo = defined('HASH_ALGO') ? HASH_ALGO : PASSWORD_ARGON2ID;
            $novoHash = password_hash($novaSenha, $algoritmo);

            $update = $pdo->prepare("UPDATE usuarios SET senha_hash = ? WHERE id = ?");
            $update->execute([$novoHash, $userId]);

            echo json_encode(["status" => "success", "message" => "Chave alterada com sucesso."]);
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Erro ao processar atualização criptográfica."]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Ação inválida ou não especificada no ecossistema."]);
        break;
}