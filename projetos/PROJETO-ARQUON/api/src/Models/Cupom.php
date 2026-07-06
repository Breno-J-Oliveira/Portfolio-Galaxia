<?php
declare(strict_types=1);

if (!class_exists('Database')) {
    require_once dirname(__DIR__, 3) . '/database.php';
}

/**
 * ARQON - THE VAULT | Cupom Model
 * Finalidade: Gerenciar cupons de desconto no banco de dados
 */
class Cupom {
    
    /**
     * Valida código de cupom
     */
    public static function validar(string $codigo, float $valorTotal): ?array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                id,
                codigo,
                tipo,
                valor,
                usos_maximos,
                usos_atuais,
                validade,
                valor_minimo,
                descricao
            FROM cupons
            WHERE codigo = :codigo
            AND status_ativo = 1
            LIMIT 1
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':codigo' => strtoupper($codigo)]);
        $cupom = $stmt->fetch();
        
        if (!$cupom) {
            return null;
        }
        
        // Verifica validade
        if ($cupom['validade'] && strtotime($cupom['validade']) < time()) {
            return null;
        }
        
        // Verifica valor mínimo
        if ($cupom['valor_minimo'] && $valorTotal < $cupom['valor_minimo']) {
            return null;
        }
        
        // Verifica usos máximos
        if ($cupom['usos_maximos'] && $cupom['usos_atuais'] >= $cupom['usos_maximos']) {
            return null;
        }
        
        // Calcula desconto
        $desconto = $cupom['tipo'] === 'percentual' 
            ? $valorTotal * ($cupom['valor'] / 100)
            : $cupom['valor'];
        
        return [
            'id' => $cupom['id'],
            'codigo' => $cupom['codigo'],
            'tipo' => $cupom['tipo'],
            'valor' => $cupom['valor'],
            'desconto' => $desconto,
            'descricao' => $cupom['descricao']
        ];
    }
    
    /**
     * Lista todos os cupons
     */
    public static function listarTodos(): array {
        $db = Database::getInstance();
        
        $sql = "
            SELECT 
                id,
                codigo,
                tipo,
                valor,
                usos_maximos,
                usos_atuais,
                validade,
                valor_minimo,
                status_ativo,
                descricao,
                criado_em
            FROM cupons
            ORDER BY criado_em DESC
        ";
        
        $stmt = $db->query($sql);
        return $stmt->fetchAll();
    }
    
    /**
     * Cria novo cupom
     */
    public static function criar(
        string $codigo,
        string $tipo,
        float $valor,
        ?int $usosMaximos = null,
        ?string $validade = null,
        string $descricao = '',
        ?float $valorMinimo = null
    ): int {
        $db = Database::getInstance();
        
        $sql = "
            INSERT INTO cupons 
            (codigo, tipo, valor, usos_maximos, validade, descricao, valor_minimo, status_ativo, criado_em)
            VALUES 
            (:codigo, :tipo, :valor, :usos_maximos, :validade, :descricao, :valor_minimo, 1, NOW())
        ";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':codigo' => strtoupper($codigo),
            ':tipo' => $tipo,
            ':valor' => $valor,
            ':usos_maximos' => $usosMaximos,
            ':validade' => $validade,
            ':descricao' => $descricao,
            ':valor_minimo' => $valorMinimo
        ]);
        
        return (int) $db->lastInsertId();
    }
    
    /**
     * Incrementa uso do cupom
     */
    public static function incrementarUso(int $idCupom): bool {
        $db = Database::getInstance();
        
        $sql = "UPDATE cupons SET usos_atuais = usos_atuais + 1 WHERE id = :id";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id' => $idCupom]);
    }
    
    /**
     * Desativa cupom
     */
    public static function desativar(int $idCupom): bool {
        $db = Database::getInstance();
        
        $sql = "UPDATE cupons SET status_ativo = 0 WHERE id = :id";
        $stmt = $db->prepare($sql);
        
        return $stmt->execute([':id' => $idCupom]);
    }
}
