<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Theme.php';

/**
 * ARQON - THE VAULT | Theme Controller
 * Finalidade: Gerenciar configurações de tema dinâmico
 */
class ThemeController {
    
    /**
     * GET /api/tema
     * Retorna todas as configurações de tema
     */
    public function listar(): void {
        try {
            $configuracoes = Theme::obterTodas();
            
            echo json_encode([
                "status" => "success",
                "data" => $configuracoes
            ]);
        } catch (Exception $e) {
            http_response_code((int)($e->getCode() ?: 500));
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /api/tema/css
     * Retorna CSS dinâmico gerado
     */
    public function gerarCSS(): void {
        try {
            $css = Theme::gerarCSS();
            
            header('Content-Type: text/css');
            echo $css;
        } catch (Exception $e) {
            http_response_code((int)($e->getCode() ?: 500));
            echo "/* Erro ao gerar CSS: {$e->getMessage()} */";
        }
    }
    
    /**
     * PUT /api/tema
     * Atualiza uma configuração específica
     */
    public function atualizar(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $chave = $input['chave'] ?? null;
            $valor = $input['valor'] ?? null;
            
            if (!$chave || $valor === null) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Chave e valor são obrigatórios."
                ]);
                http_response_code(400);
                return;
            }
            
            $sucesso = Theme::atualizar($chave, $valor);
            
            if ($sucesso) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Configuração atualizada com sucesso."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Erro ao atualizar configuração."
                ]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            http_response_code((int)($e->getCode() ?: 500));
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * PUT /api/tema/batch
     * Atualiza múltiplas configurações de uma vez
     */
    public function atualizarMultiplos(): void {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!is_array($input)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Formato inválido. Esperado objeto com configurações."
                ]);
                http_response_code(400);
                return;
            }
            
            $sucesso = Theme::atualizarMultiplos($input);
            
            if ($sucesso) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Configurações atualizadas com sucesso."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Erro ao atualizar configurações."
                ]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            http_response_code((int)($e->getCode() ?: 500));
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * POST /api/tema/reset
     * Reseta para o tema padrão
     */
    public function resetar(): void {
        try {
            $sucesso = Theme::resetarPadrao();
            
            if ($sucesso) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Tema resetado para o padrão."
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Erro ao resetar tema."
                ]);
                http_response_code(500);
            }
        } catch (Exception $e) {
            http_response_code((int)($e->getCode() ?: 500));
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * POST /api/tema/seed
     * Popula a tabela de configurações de tema com valores padrão
     */
    public function seed(): void {
        try {
            $db = Database::getInstance();
            
            // Verifica se a tabela existe
            $checkTable = $db->query("SHOW TABLES LIKE 'configuracoes_tema'");
            if ($checkTable->fetch() === false) {
                // Cria a tabela
                $db->query("
                    CREATE TABLE IF NOT EXISTS configuracoes_tema (
                        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                        chave VARCHAR(100) NOT NULL UNIQUE,
                        valor VARCHAR(255) NOT NULL,
                        tipo ENUM('color','font','size','other') DEFAULT 'color',
                        descricao VARCHAR(200),
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB
                ");
            }
            
            // Paleta canônica (vinho=primary, dourado=secondary) — alinhada ao reset.css
            $temaPadrao = Theme::temaPadrao();

            $db->beginTransaction();

            // upsert: insere chaves faltantes e corrige valores errados de bancos antigos
            $stmt = $db->prepare("INSERT INTO configuracoes_tema (chave, valor, tipo, descricao)
                                  VALUES (?, ?, ?, ?)
                                  ON DUPLICATE KEY UPDATE valor = VALUES(valor)");

            foreach ($temaPadrao as $chave => $config) {
                $stmt->execute([$chave, $config[0], $config[1], $config[2]]);
            }
            
            $db->commit();
            
            echo json_encode([
                "status" => "success",
                "message" => "Configurações de tema populadas com sucesso."
            ]);
        } catch (Exception $e) {
            if (isset($db) && $db->inTransaction()) {
                $db->rollBack();
            }
            http_response_code((int)($e->getCode() ?: 500));
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
}
