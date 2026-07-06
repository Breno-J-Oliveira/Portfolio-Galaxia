<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Theme Model
 * Finalidade: Gerenciar configurações de tema dinâmico
 */
class Theme {
    
    /**
     * Obtém todas as configurações de tema
     */
    public static function obterTodas(): array {
        $db = Database::getInstance();
        
        $sql = "SELECT chave, valor, tipo, descricao FROM configuracoes_tema ORDER BY chave";
        $stmt = $db->query($sql);
        
        $configuracoes = [];
        while ($row = $stmt->fetch()) {
            $configuracoes[$row['chave']] = [
                'valor' => $row['valor'],
                'tipo' => $row['tipo'],
                'descricao' => $row['descricao']
            ];
        }
        
        return $configuracoes;
    }
    
    /**
     * Obtém uma configuração específica
     */
    public static function obter(string $chave): ?string {
        $db = Database::getInstance();
        
        $sql = "SELECT valor FROM configuracoes_tema WHERE chave = :chave LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([':chave' => $chave]);
        
        $result = $stmt->fetch();
        return $result ? $result['valor'] : null;
    }
    
    /**
     * Atualiza uma configuração de tema
     */
    public static function atualizar(string $chave, string $valor): bool {
        $db = Database::getInstance();
        
        $sql = "UPDATE configuracoes_tema SET valor = :valor WHERE chave = :chave";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([
            ':valor' => $valor,
            ':chave' => $chave
        ]);
    }
    
    /**
     * Atualiza múltiplas configurações de uma vez
     */
    public static function atualizarMultiplos(array $configuracoes): bool {
        $db = Database::getInstance();
        
        try {
            $db->beginTransaction();
            
            $sql = "UPDATE configuracoes_tema SET valor = :valor WHERE chave = :chave";
            $stmt = $db->prepare($sql);
            
            foreach ($configuracoes as $chave => $valor) {
                $stmt->execute([
                    ':valor' => $valor,
                    ':chave' => $chave
                ]);
            }
            
            $db->commit();
            return true;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    
    /**
     * Reseta para o tema padrão
     */
    public static function resetarPadrao(): bool {
        $db = Database::getInstance();
        
        $temaPadrao = [
            'color_primary' => '#E7B93F',
            'color_primary_light' => '#FFDE4C',
            'color_secondary' => '#1A1A2E',
            'color_tertiary' => '#A0A0A0',
            'color_accent' => '#10b981',
            'color_error' => '#ff5268',
            'font_primary' => 'Cinzel, serif',
            'font_secondary' => 'Inter, sans-serif',
            'font_code' => 'Fira Code, monospace',
            'border_radius' => '8px',
            'border_radius_large' => '16px',
            'spacing_unit' => '8px',
            'transition_speed' => '0.3s',
        ];
        
        try {
            $db->beginTransaction();
            
            $sql = "UPDATE configuracoes_tema SET valor = :valor WHERE chave = :chave";
            $stmt = $db->prepare($sql);
            
            foreach ($temaPadrao as $chave => $valor) {
                $stmt->execute([
                    ':valor' => $valor,
                    ':chave' => $chave
                ]);
            }
            
            $db->commit();
            return true;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
    
    /**
     * Gera CSS dinâmico baseado nas configurações
     */
    public static function gerarCSS(): string {
        $configuracoes = self::obterTodas();
        
        $css = ":root {\n";
        
        foreach ($configuracoes as $chave => $config) {
            $css .= "    --{$chave}: {$config['valor']};\n";
        }
        
        $css .= "}\n\n";
        
        // Adiciona classes utilitárias
        $css .= ".text-primary { color: var(--color_primary); }\n";
        $css .= ".text-secondary { color: var(--color_secondary); }\n";
        $css .= ".text-tertiary { color: var(--color_tertiary); }\n";
        $css .= ".bg-primary { background-color: var(--color_primary); }\n";
        $css .= ".bg-secondary { background-color: var(--color_secondary); }\n";
        $css .= ".border-radius { border-radius: var(--border_radius); }\n";
        $css .= ".border-radius-large { border-radius: var(--border_radius_large); }\n";
        
        return $css;
    }
}
