<?php

require_once __DIR__ . '/../Models/Colecao.php';

class ColecaoController {
    private $colecaoModel;

    public function __construct() {
        $this->colecaoModel = new Colecao();
    }

    public function listar() {
        try {
            $colecoes = $this->colecaoModel->listarAtivas();
            
            foreach ($colecoes as &$col) {
                // Corrige caminho da foto
                if (!empty($col['foto_url']) && !str_starts_with($col['foto_url'], 'http') && !str_starts_with($col['foto_url'], '/')) {
                    $col['foto_url'] = '/public/uploads/' . $col['foto_url'];
                }
                
                // Busca produtos associados
                $col['produtos'] = $this->colecaoModel->buscarProdutos($col['id']);
                
                // Corrige caminhos das fotos dos produtos
                foreach ($col['produtos'] as &$prod) {
                    if (!empty($prod['foto_url']) && !str_starts_with($prod['foto_url'], 'http') && !str_starts_with($prod['foto_url'], '/')) {
                        $prod['foto_url'] = '/public/uploads/' . $prod['foto_url'];
                    }
                    $prod['preco'] = $prod['valor_diaria'];
                }
                unset($prod);
            }
            
            sendResponse(['status' => 'success', 'data' => $colecoes], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao buscar coleções: ' . $e->getMessage()], 500);
        }
    }

    public function buscar() {
        $id = (int)($_GET['id'] ?? 0);
        
        if ($id <= 0) {
            sendResponse(['status' => 'error', 'message' => 'ID inválido'], 400);
        }
        
        try {
            $colecao = $this->colecaoModel->buscarPorId($id);
            
            if (!$colecao) {
                sendResponse(['status' => 'error', 'message' => 'Coleção não encontrada'], 404);
            }
            
            // Corrige caminho da foto
            if (!empty($colecao['foto_url']) && !str_starts_with($colecao['foto_url'], 'http') && !str_starts_with($colecao['foto_url'], '/')) {
                $colecao['foto_url'] = '/public/uploads/' . $colecao['foto_url'];
            }
            
            // Busca produtos associados
            $colecao['produtos'] = $this->colecaoModel->buscarProdutos($id);
            
            // Corrige caminhos das fotos dos produtos
            foreach ($colecao['produtos'] as &$prod) {
                if (!empty($prod['foto_url']) && !str_starts_with($prod['foto_url'], 'http') && !str_starts_with($prod['foto_url'], '/')) {
                    $prod['foto_url'] = '/public/uploads/' . $prod['foto_url'];
                }
                $prod['preco'] = $prod['valor_diaria'];
            }
            
            sendResponse(['status' => 'success', 'data' => $colecao], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao buscar coleção: ' . $e->getMessage()], 500);
        }
    }

    public function criar() {
        global $input;
        
        $required = ['nome', 'foto_url'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendResponse(['status' => 'error', 'message' => "Campo '$field' é obrigatório"], 400);
            }
        }
        
        try {
            $id = $this->colecaoModel->criar($input);
            sendResponse(['status' => 'success', 'message' => 'Coleção criada', 'id' => $id], 201);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao criar coleção: ' . $e->getMessage()], 500);
        }
    }

    public function atualizar() {
        global $input;
        $id = (int)($_GET['id'] ?? 0);
        
        if ($id <= 0) {
            sendResponse(['status' => 'error', 'message' => 'ID inválido'], 400);
        }
        
        try {
            $this->colecaoModel->atualizar($id, $input);
            sendResponse(['status' => 'success', 'message' => 'Coleção atualizada'], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao atualizar coleção: ' . $e->getMessage()], 500);
        }
    }

    public function deletar() {
        $id = (int)($_GET['id'] ?? 0);
        
        if ($id <= 0) {
            sendResponse(['status' => 'error', 'message' => 'ID inválido'], 400);
        }
        
        try {
            $this->colecaoModel->deletar($id);
            sendResponse(['status' => 'success', 'message' => 'Coleção deletada'], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao deletar coleção: ' . $e->getMessage()], 500);
        }
    }

    public function adicionarProduto() {
        global $input;
        
        $idColecao = (int)($input['id_colecao'] ?? 0);
        $idProduto = (int)($input['id_produto'] ?? 0);
        
        if ($idColecao <= 0 || $idProduto <= 0) {
            sendResponse(['status' => 'error', 'message' => 'IDs inválidos'], 400);
        }
        
        try {
            $this->colecaoModel->adicionarProduto($idColecao, $idProduto);
            sendResponse(['status' => 'success', 'message' => 'Produto adicionado à coleção'], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao adicionar produto: ' . $e->getMessage()], 500);
        }
    }

    public function removerProduto() {
        global $input;
        
        $idColecao = (int)($input['id_colecao'] ?? 0);
        $idProduto = (int)($input['id_produto'] ?? 0);
        
        if ($idColecao <= 0 || $idProduto <= 0) {
            sendResponse(['status' => 'error', 'message' => 'IDs inválidos'], 400);
        }
        
        try {
            $this->colecaoModel->removerProduto($idColecao, $idProduto);
            sendResponse(['status' => 'success', 'message' => 'Produto removido da coleção'], 200);
        } catch (Throwable $e) {
            sendResponse(['status' => 'error', 'message' => 'Erro ao remover produto: ' . $e->getMessage()], 500);
        }
    }
}
