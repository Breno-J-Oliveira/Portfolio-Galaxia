<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config.php';
require_once __DIR__ . '/../../../database.php';

class Produto {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Busca os detalhes completos para a página do produto
     */
    /**
     * Busca os detalhes completos para a página do produto
     */
    /**
     * Busca os detalhes completos para a página do produto
     */
    public function buscarDetalhesPorId(int $id): ?array {
        $sql = "
            SELECT 
                p.*, 
                m.nome AS marca, 
                c.nome AS categoria,
                (SELECT url_midia FROM produto_midias WHERE id_produto = p.id AND tipo_midia = '3d_model' LIMIT 1) as modelo_3d
            FROM produtos p
            LEFT JOIN marcas m ON p.id_marca = m.id
            LEFT JOIN categorias c ON p.id_categoria = c.id
            WHERE p.id = :id
        ";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$resultado) {
                return null;
            }

            $sqlMidias = "SELECT url_midia FROM produto_midias WHERE id_produto = :id AND tipo_midia = 'imagem'";
            $stmtMidias = $this->db->prepare($sqlMidias);
            $stmtMidias->execute([':id' => $id]);
            $midias = $stmtMidias->fetchAll(PDO::FETCH_COLUMN);

            $resultado['galeria'] = $midias ? $midias : [];

            return $resultado;

        } catch (Exception $e) {
            error_log("MODEL_DETAIL_ERROR: " . $e->getMessage());
            throw $e; 
        }
    }

    /**
     * Listagem geral e busca por texto
     */
    public function buscarPorTexto(string $query): array {
        $sql = "SELECT p.*, m.nome as marca FROM produtos p 
                INNER JOIN marcas m ON p.id_marca = m.id
                WHERE p.nome LIKE :q OR m.nome LIKE :q";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':q' => "%$query%"]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarCatalogoInteligente(
        ?string $marca = null, 
        ?string $categoria = null, 
        ?string $estilo = null,
        int $pagina = 1,
        int $porPagina = 20
    ): array {
        $sql = "SELECT p.id, p.nome, p.descricao, p.valor_diaria, p.valor_mercado, 
                       p.foto_url, p.composicao, p.status_venda,
                       m.nome AS marca, 
                       c.nome AS categoria,
                       e.nome AS estilo
                FROM produtos p 
                LEFT JOIN marcas m ON p.id_marca = m.id
                LEFT JOIN categorias c ON p.id_categoria = c.id
                LEFT JOIN estilos e ON p.id_estilo = e.id
                WHERE p.status_venda = true";
        
        try {
            // Monta as condições dinamicamente
            if ($marca) $sql .= " AND m.nome = :marca"; 
            if ($categoria) $sql .= " AND c.nome = :categoria"; 
            if ($estilo) $sql .= " AND e.nome = :estilo"; 
            
            // Paginação
            $offset = ($pagina - 1) * $porPagina;
            $sql .= " LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            
            // Faz o bind dinâmico como String
            if ($marca) $stmt->bindValue(':marca', $marca, PDO::PARAM_STR);
            if ($categoria) $stmt->bindValue(':categoria', $categoria, PDO::PARAM_STR);
            if ($estilo) $stmt->bindValue(':estilo', $estilo, PDO::PARAM_STR);
            
            //  O SEGREDO: Força o bind como Inteiro para o LIMIT e OFFSET não quebrarem a query
            $stmt->bindValue(':limit', (int)$porPagina, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (Exception $e) {
            error_log("Query Error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Insere um novo artefato no banco de dados
     * Retorna o ID gerado ou false em caso de erro
     */
    public function inserir(array $dados): int|bool {
        $sql = "INSERT INTO produtos (nome, descricao, valor_diaria, valor_mercado, id_marca, id_categoria, id_estilo, foto_url, status_venda) 
                VALUES (:nome, :descricao, :valor_diaria, :valor_mercado, :id_marca, :id_categoria, :id_estilo, :foto_url, :status_venda)";
        
        try {
            $stmt = $this->db->prepare($sql);
            
            $sucesso = $stmt->execute([
                ':nome'          => $dados['nome'],
                ':descricao'     => $dados['descricao'] ?? null,
                ':valor_diaria'  => $dados['valor_diaria'],
                ':valor_mercado' => $dados['valor_mercado'] ?? 0,
                ':id_marca'      => $dados['id_marca'],
                ':id_categoria'  => $dados['id_categoria'],
                ':id_estilo'     => $dados['id_estilo'] ?? null,
                ':foto_url'      => $dados['foto_url'] ?? null,
                ':status_venda'  => $dados['status_venda'] ?? 1
            ]);

            return $sucesso ? (int)$this->db->lastInsertId() : false;

        } catch (Exception $e) {
            error_log("MODEL_INSERT_ERROR: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Executa a remoção física do artefato no banco de dados.
     * O vínculo 'ON DELETE CASCADE' nas FKs limpará as mídias associadas.
     */
    public function excluir(int $id): bool {
        try {
            $sql = "DELETE FROM produtos WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            
            // Retorna true se a execução foi bem-sucedida
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            // Registra o erro no log do servidor (C:\xampp\apache\logs\error.log)
            error_log("ARQON_SQL_ERROR [Excluir Produto]: " . $e->getMessage());
            return false;
        }
    }
}