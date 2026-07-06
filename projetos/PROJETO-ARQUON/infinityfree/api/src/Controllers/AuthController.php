<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Usuario.php';
require_once __DIR__ . '/../utils/JWT.php';

class AuthController {
    
    public function login(): void {
        global $input;
        
        $email = $input['email'] ?? '';
        $senha = $input['password'] ?? '';

        if (empty($email) || empty($senha)) {
            sendResponse([
                "status" => "error", 
                "details" => "E-mail e senha são obrigatórios"
            ], 400);
            return;
        }

        try {
            // 1. Buscar o usuário no banco de dados
            $usuario = Usuario::buscarPorEmail($email);

            if (!$usuario) {
                sendResponse([
                    "status" => "error",
                    "details" => "E-mail ou senha inválidos"
                ], 401);
                return;
            }

            // 2. Validar a senha com hash seguro (Argon2id)
            if (!password_verify($senha, $usuario['senha_hash'])) {
                sendResponse([
                    "status" => "error",
                    "details" => "E-mail ou senha inválidos"
                ], 401);
                return;
            }

            // 3. Role vem do banco (niveis_acesso.nome), com fallback pelo ID
            $nivelAcesso = !empty($usuario['nivel_nome'])
                ? (string)$usuario['nivel_nome']
                : $this->determinarNivelAcesso((int)$usuario['id_nivel_acesso']);

            // 4. Montar Payload Criptográfico do JWT
            $payload = [
                'user_id' => $usuario['id'],
                'id_usuario' => $usuario['id'], // Para compatibilidade com UserController
                'email' => $usuario['email'],
                'role' => $nivelAcesso
            ];

            $token = JWT::encode($payload);

            // 5. Enviar resposta de sucesso incluindo a URL dinâmica de redirecionamento
            sendResponse([
                "status" => "success",
                "token" => $token,
                "role" => $nivelAcesso,
                "redirect" => $this->redirecionarPorRole($nivelAcesso), // 🚀 Rota dinâmica aqui
                "message" => "Acesso concedido ao Cofre",
                "user" => [
                    "id" => $usuario['id'],
                    "nome" => $usuario['nome'],
                    "foto_url" => !empty($usuario['foto_url']) ? $usuario['foto_url'] : 'assets/images/default-avatar.png'
                ]
            ], 200);

        } catch (Exception $e) {
            error_log("AUTH_ERROR: " . $e->getMessage());
            sendResponse([
                "status" => "error",
                "details" => "Erro ao processar login"
            ], 500);
        }
    }

    /**
     * 👑 NOVO MÉTODO: Registra um novo membro com upload de avatar opcional
     */
    public function register(): void {
        // Captura direta via $_POST por conta do formato multipart/form-data
        $nome  = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $senha = $_POST['password'] ?? '';
        $fotoUrl = null;

        // 1. Validação de campos obrigatórios no servidor
        if (empty($nome) || empty($email) || empty($senha)) {
            sendResponse([
                "status"  => "error", 
                "details" => "Preencha todos os campos fundamentais para requisitar acesso."
            ], 400);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse([
                "status"  => "error", 
                "details" => "O formato do e-mail inserido não é válido."
            ], 400);
            return;
        }

        if (strlen($senha) < 8) {
            sendResponse([
                "status"  => "error", 
                "details" => "A senha requer o padrão mínimo de 8 caracteres de segurança."
            ], 400);
            return;
        }

        // 2. Processamento e Isolamento do Upload de Imagem (Se houver arquivo)
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['profile_picture']['tmp_name'];
            $fileName = $_FILES['profile_picture']['name'];
            
            // Filtro estrito de extensões permitidas
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            
            if (!in_array($fileExtension, $allowedExtensions, true)) {
                sendResponse([
                    "status" => "error",
                    "details" => "Formato de imagem inválido. Use apenas JPG, PNG ou WEBP."
                ], 400);
                return;
            }

            // Define e valida a existência do diretório de uploads do sistema
            $uploadDir = dirname(__DIR__, 3) . '/public/uploads/avatars/';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true)) {
                    sendResponse([
                        "status" => "error",
                        "details" => "Erro ao criar diretório de avatares"
                    ], 500);
                    return;
                }
            }

            // Gera um hash único para o arquivo para evitar colisões de nomes no servidor
            $newFileName = md5(uniqid((string)rand(), true)) . '.' . $fileExtension;
            $destPath = $uploadDir . $newFileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                // Verificar se o arquivo foi salvo
                if (!file_exists($destPath)) {
                    sendResponse([
                        "status" => "error",
                        "details" => "Erro ao salvar arquivo de avatar"
                    ], 500);
                    return;
                }
                // Caminho relativo ideal para armazenamento seguro na tabela
                $fotoUrl = '/public/uploads/avatars/' . $newFileName;
            } else {
                sendResponse([
                    "status" => "error",
                    "details" => "Erro ao mover arquivo de avatar para o destino"
                ], 500);
                return;
            }
        }

        try {
            // 3. Encriptação segura usando ARGON2ID de acordo com os critérios de segurança
            $senhaHash = password_hash($senha, PASSWORD_ARGON2ID, [
                'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
                'time_cost'   => PASSWORD_ARGON2_DEFAULT_TIME_COST,
                'threads'     => PASSWORD_ARGON2_DEFAULT_THREADS
            ]);

            // 4. Delegação à Model para persistência no banco
            $novoId = Usuario::criar($nome, $email, $senhaHash, $fotoUrl);

            if (!$novoId) {
                sendResponse([
                    "status"  => "error",
                    "details" => "Este endereço de e-mail já possui credenciais de acesso ao cofre."
                ], 409); // Código de Conflito HTTP
                return;
            }

            sendResponse([
                "status"  => "success",
                "message" => "Acesso concedido. Bem-vindo à elite ARQON.",
                "user_id" => $novoId
            ], 201); // Código de Criação HTTP

        } catch (Exception $e) {
            sendResponse([
                "status"  => "error",
                "details" => "Erro real: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mapeia o ID numérico do nível de acesso para a nomenclatura String (IAM)
     */
    private function determinarNivelAcesso(int $id_nivel): string {
        // Alinhado com seeds.sql / niveis_acesso
        $niveis = [
            1 => 'MEMBER',
            2 => 'VAULT_MGMT',
            3 => 'PRIORITY_ACCESS',
            4 => 'TOTAL_CONTROL',
            5 => 'VENDOR',
        ];
        return $niveis[$id_nivel] ?? 'MEMBER';
    }

    /**
     * 🚀 NOVO MÉTODO: Define qual a view/página de destino com base na role
     */
    private function redirecionarPorRole(string $role): string {
        if ($this->isAdminRole($role)) {
            return 'admin.html';
        }
        if ($role === 'VENDOR') {
            return 'fornecedor.html';
        }
        return 'profile.html';
    }

    private function isAdminRole(string $role): bool {
        return in_array($role, ['TOTAL_CONTROL', 'VAULT_MGMT', 'ADMIN', 'DEVELOPER'], true);
    }
}