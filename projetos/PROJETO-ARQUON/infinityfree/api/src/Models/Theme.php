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
     * Retorna formato completo com valor, tipo e descricao
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
     * Paleta padrão canônica — ALINHADA 1:1 com reset.css do site.
     * primary = vinho, secondary = dourado (a cor de destaque da marca).
     * [valor, tipo, descricao]
     */
    public static function temaPadrao(): array {
        return [
            'color-primary'         => ['#641838', 'color', 'Cor primária (vinho)'],
            'color-primary-light'   => ['#781D43', 'color', 'Vinho claro'],
            'color-primary-dark'    => ['#50132D', 'color', 'Vinho escuro'],
            'color-secondary'       => ['#E7B93F', 'color', 'Cor de destaque (dourado)'],
            'color-secondary-light' => ['#FFDE4C', 'color', 'Dourado claro'],
            'color-secondary-dark'  => ['#B99432', 'color', 'Dourado escuro'],
            'color-tertiary'        => ['#A0A0A0', 'color', 'Cinza'],
            'color-tertiary-light'  => ['#C0C0C0', 'color', 'Cinza claro'],
            'color-tertiary-dark'   => ['#808080', 'color', 'Cinza escuro'],
            'color-dark'            => ['#0C0716', 'color', 'Fundo principal'],
            'color-dark-dark'       => ['#0A0612', 'color', 'Fundo mais escuro'],
            'color-dark-light'      => ['#0E081A', 'color', 'Fundo claro'],
            'color-light'           => ['#FFFFFF', 'color', 'Texto claro'],
            'color-light-dark'      => ['#DCDCDC', 'color', 'Texto suave'],
            'color-text'            => ['#DEDDDF', 'color', 'Cor do texto'],
            'color-bg'              => ['#0C0716', 'color', 'Cor de fundo'],
            'color-gold'            => ['#E7B93F', 'color', 'Cor âncora (dourado)'],
            'color-void'            => ['#0A0612', 'color', 'Fundo máximo'],
            'color-success'         => ['#4CAF50', 'color', 'Sucesso'],
            'color-danger'          => ['#F44336', 'color', 'Perigo'],
            'color-accent'          => ['#10b981', 'color', 'Destaque alternativo'],
            'color-error'           => ['#ff5268', 'color', 'Erro'],
            'arqon-logo-color'      => ['#DEDDDF', 'color', 'Cor da logo SVG'],
            'font-primary'          => ['"Cinzel", serif', 'font', 'Fonte de títulos'],
            'font-secondary'        => ['"Inter", sans-serif', 'font', 'Fonte de corpo'],
            'font-code'             => ['"Fira Code", monospace', 'font', 'Fonte de código'],
            'border-radius'         => ['8px', 'size', 'Arredondamento'],
            'border-radius-large'   => ['16px', 'size', 'Arredondamento grande'],
            'spacing-unit'          => ['8px', 'size', 'Espaçamento'],
            'transition-speed'      => ['0.3s', 'size', 'Velocidade de transição'],
        ];
    }

    /**
     * Reseta para o tema padrão.
     * Usa upsert para CORRIGIR valores errados E INSERIR chaves faltantes
     * em bancos já existentes (resolve o tema importado com cores invertidas).
     */
    public static function resetarPadrao(): bool {
        $db = Database::getInstance();

        try {
            $db->beginTransaction();

            $sql = "INSERT INTO configuracoes_tema (chave, valor, tipo, descricao)
                    VALUES (:chave, :valor, :tipo, :descricao)
                    ON DUPLICATE KEY UPDATE valor = VALUES(valor)";
            $stmt = $db->prepare($sql);

            foreach (self::temaPadrao() as $chave => $config) {
                $stmt->execute([
                    ':chave' => $chave,
                    ':valor' => $config[0],
                    ':tipo' => $config[1],
                    ':descricao' => $config[2],
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
        $css .= ".text-primary { color: var(--color-primary); }\n";
        $css .= ".text-secondary { color: var(--color-secondary); }\n";
        $css .= ".text-tertiary { color: var(--color-tertiary); }\n";
        $css .= ".bg-primary { background-color: var(--color-primary); }\n";
        $css .= ".bg-secondary { background-color: var(--color-secondary); }\n";
        $css .= ".border-radius { border-radius: var(--border-radius); }\n";
        $css .= ".border-radius-large { border-radius: var(--border-radius-large); }\n";
        
        return $css;
    }
}
