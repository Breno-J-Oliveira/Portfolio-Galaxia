<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Usuario.php';
require_once __DIR__ . '/../Utils/JWT.php';

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

            // 3. Determinar nível de acesso com base no ID da tabela
            $nivelAcesso = $this->determinarNivelAcesso((int)$usuario['id_nivel_acesso']);

            // 4. Montar Payload Criptográfico do JWT
            $payload = [
                'user_id' => $usuario['id'],
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
     * Mapeia o ID numérico do nível de acesso para a nomenclatura String (IAM)
     */
    private function determinarNivelAcesso(int $id_nivel): string {
        $niveis = [
            1 => 'MEMBER',
            2 => 'PRIORITY_ACCESS',
            3 => 'VAULT_MGMT',
            4 => 'TOTAL_CONTROL'
        ];
        return $niveis[$id_nivel] ?? 'MEMBER';
    }

    /**
     * 🚀 NOVO MÉTODO: Define qual a view/página de destino com base na role
     */
    private function redirecionarPorRole(string $role): string {
        switch ($role) {
            case 'TOTAL_CONTROL':
                return 'admin.html'; // 👑 Administrador Mestre vai para o Dashboard Admin
            case 'VAULT_MGMT':
                return 'admin.html'; // Gerente do cofre também pode ir para a gerência
            case 'PRIORITY_ACCESS':
            case 'MEMBER':
            default:
                return 'profile.html'; // Clientes normais vão para o cofre pessoal deles
        }
    }
}