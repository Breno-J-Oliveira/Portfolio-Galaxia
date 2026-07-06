<?php

class Colecao {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function listarAtivas() {
        $stmt = $this->db->query("
            SELECT c.*, 
                   (SELECT COUNT(*) FROM colecao_produtos cp WHERE cp.id_colecao = c.id) as total_produtos
            FROM colecoes c
            WHERE c.ativo = TRUE
            ORDER BY c.ordem ASC, c.criado_em DESC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPorId($id) {
        $stmt = $this->db->prepare("
            SELECT c.*, 
                   (SELECT COUNT(*) FROM colecao_produtos cp WHERE cp.id_colecao = c.id) as total_produtos
            FROM colecoes c
            WHERE c.id = ? AND c.ativo = TRUE
        ");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function buscarProdutos($idColecao) {
        $stmt = $this->db->prepare("
            SELECT p.*, m.nome as marca_nome, cat.nome as categoria_nome
            FROM colecao_produtos cp
            INNER JOIN produtos p ON cp.id_produto = p.id
            LEFT JOIN marcas m ON p.id_marca = m.id
            LEFT JOIN categorias cat ON p.id_categoria = cat.id
            WHERE cp.id_colecao = ? AND p.status_venda = TRUE
            ORDER BY p.nome ASC
        ");
        $stmt->execute([$idColecao]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function criar($dados) {
        $stmt = $this->db->prepare("
            INSERT INTO colecoes (nome, foto_url, descricao, ativo, ordem)
            VALUES (?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $dados['nome'],
            $dados['foto_url'],
            $dados['descricao'] ?? null,
            $dados['ativo'] ?? true,
            $dados['ordem'] ?? 0
        ]);
    }

    public function atualizar($id, $dados) {
        $stmt = $this->db->prepare("
            UPDATE colecoes
            SET nome = ?, foto_url = ?, descricao = ?, ativo = ?, ordem = ?
            WHERE id = ?
        ");
        return $stmt->execute([
            $dados['nome'],
            $dados['foto_url'],
            $dados['descricao'] ?? null,
            $dados['ativo'] ?? true,
            $dados['ordem'] ?? 0,
            $id
        ]);
    }

    public function deletar($id) {
        $stmt = $this->db->prepare("DELETE FROM colecoes WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function adicionarProduto($idColecao, $idProduto) {
        $stmt = $this->db->prepare("
            INSERT IGNORE INTO colecao_produtos (id_colecao, id_produto)
            VALUES (?, ?)
        ");
        return $stmt->execute([$idColecao, $idProduto]);
    }

    public function removerProduto($idColecao, $idProduto) {
        $stmt = $this->db->prepare("
            DELETE FROM colecao_produtos
            WHERE id_colecao = ? AND id_produto = ?
        ");
        return $stmt->execute([$idColecao, $idProduto]);
    }
}
