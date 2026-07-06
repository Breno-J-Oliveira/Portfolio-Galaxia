<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config.php';
require_once __DIR__ . '/../../../database.php';

/**
 * ARQON - THE VAULT | Config Model
 * Finalidade: Queries para leitura/escrita de configurações_sistema
 */
class Config {
    private PDO $db;
    private array $cache = []; // Cache em memória
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->carregarCache();
    }
    
    /**
     * Carrega todas as configurações em cache
     */
    private function carregarCache(): void {
        $sql = "SELECT chave, valor FROM configuracoes_sistema";
        try {
            $stmt = $this->db->query($sql);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($rows as $row) {
                $this->cache[$row['chave']] = $row['valor'];
            }
        } catch (Exception $e) {
            error_log("CONFIG_CACHE_ERROR: " . $e->getMessage());
        }
    }
    
    /**
     * Obter valor de uma configuração
     */
    public function getConfig(string $chave): ?string {
        // Primeiro tenta cache
        if (isset($this->cache[$chave])) {
            return $this->cache[$chave];
        }
        
        // Se não está em cache, busca no banco
        $sql = "SELECT valor FROM configuracoes_sistema WHERE chave = ?";
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$chave]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                // Atualiza cache
                $this->cache[$chave] = $result['valor'];
                return $result['valor'];
            }
        } catch (Exception $e) {
            error_log("CONFIG_GET_ERROR: " . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Obter todas as configurações
     */
    public function getAllConfigs(): array {
        $sql = "SELECT chave, valor, descricao FROM configuracoes_sistema ORDER BY chave";
        try {
            $stmt = $this->db->query($sql);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("CONFIG_GET_ALL_ERROR: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Definir/atualizar uma configuração
     */
    public function setConfig(string $chave, string $valor): bool {
        try {
            // Tenta UPDATE primeiro (se existe)
            $sql = "UPDATE configuracoes_sistema SET valor = ? WHERE chave = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$valor, $chave]);
            
            // Se não atualizou nada, INSERT
            if ($stmt->rowCount() === 0) {
                $sql = "INSERT INTO configuracoes_sistema (chave, valor) VALUES (?, ?)";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([$chave, $valor]);
            }
            
            // Atualiza cache
            $this->cache[$chave] = $valor;
            
            // Registra log
            $this->registrarLog("UPDATE_CONFIG", "configuracoes_sistema", $chave);
            
            return true;
        } catch (Exception $e) {
            error_log("CONFIG_SET_ERROR: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Deletar uma configuração
     */
    public function deleteConfig(string $chave): bool {
        try {
            $sql = "DELETE FROM configuracoes_sistema WHERE chave = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$chave]);
            
            // Remove do cache
            unset($this->cache[$chave]);
            
            return $stmt->rowCount() > 0;
        } catch (Exception $e) {
            error_log("CONFIG_DELETE_ERROR: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obter configuração como tipo específico
     */
    public function getConfigAsBoolean(string $chave, bool $default = false): bool {
        $valor = $this->getConfig($chave);
        if ($valor === null) return $default;
        return filter_var($valor, FILTER_VALIDATE_BOOLEAN);
    }
    
    public function getConfigAsInt(string $chave, int $default = 0): int {
        $valor = $this->getConfig($chave);
        if ($valor === null) return $default;
        return (int)$valor;
    }
    
    public function getConfigAsFloat(string $chave, float $default = 0.0): float {
        $valor = $this->getConfig($chave);
        if ($valor === null) return $default;
        return (float)$valor;
    }
    
    /**
     * Obter múltiplas configurações de uma vez
     */
    public function getConfigsBatch(array $chaves): array {
        $result = [];
        foreach ($chaves as $chave) {
            $result[$chave] = $this->getConfig($chave);
        }
        return $result;
    }
    
    /**
     * Restaurar configurações padrão
     */
    public function restaurarDefaults(): bool {
        try {
            $defaults = [
                'taxa_plataforma' => '15',
                'taxa_marca' => '35',
                'taxa_ecologica' => '2',
                'comissao_default' => '15',
                'modo_manutencao' => 'false',
                'tempo_processamento_pedidos' => '2',
                'dias_prazo_devolucao' => '7'
            ];
            
            foreach ($defaults as $chave => $valor) {
                $this->setConfig($chave, $valor);
            }
            
            return true;
        } catch (Exception $e) {
            error_log("CONFIG_RESTORE_ERROR: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Registra log da alteração
     */
    private function registrarLog(string $acao, string $tabela, string $detalhes): void {
        try {
            $sql = "INSERT INTO sistema_logs (acao, tabela, data_hora) VALUES (?, ?, NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$acao . ": " . $detalhes, $tabela]);
        } catch (Exception $e) {
            // Silencioso - não quebra a operação
        }
    }
}
?>