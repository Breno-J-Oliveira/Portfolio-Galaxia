<?php

namespace ARQON\Api\Controllers;

use ARQON\Api\Models\Fornecedor;

class FornecedorController
{
    private $fornecedor;

    public function __construct($db)
    {
        $this->fornecedor = new Fornecedor($db);
    }

    public function listar($ativo = true)
    {
        $fornecedores = $this->fornecedor->listar($ativo);
        return [
            'status' => 'success',
            'data' => $fornecedores,
            'count' => count($fornecedores)
        ];
    }

    public function buscar($id)
    {
        $fornecedor = $this->fornecedor->buscarPorId($id);
        
        if (!$fornecedor) {
            return [
                'status' => 'error',
                'message' => 'Fornecedor não encontrado'
            ];
        }
        
        return [
            'status' => 'success',
            'data' => $fornecedor
        ];
    }

    public function criar($dados)
    {
        $required = ['nome'];
        foreach ($required as $field) {
            if (empty($dados[$field])) {
                return [
                    'status' => 'error',
                    'message' => "Campo obrigatório: {$field}"
                ];
            }
        }

        try {
            $fornecedor = $this->fornecedor->criar($dados);
            
            if ($fornecedor) {
                return [
                    'status' => 'success',
                    'message' => 'Fornecedor criado com sucesso',
                    'data' => $fornecedor
                ];
            }
            
            return [
                'status' => 'error',
                'message' => 'Erro ao criar fornecedor'
            ];
        } catch (\PDOException $e) {
            // Captura erro de violação de chave única (CNPJ duplicado)
            if (strpos($e->getMessage(), '1062') !== false || strpos($e->getMessage(), 'Duplicate entry') !== false) {
                return [
                    'status' => 'error',
                    'message' => 'Já existe um fornecedor cadastrado com este CNPJ.'
                ];
            }
            // Outros erros de banco
            error_log("[FORNECEDOR] Erro PDO: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Erro ao criar fornecedor: ' . $e->getMessage()
            ];
        } catch (\Exception $e) {
            error_log("[FORNECEDOR] Erro geral: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => 'Erro ao criar fornecedor: ' . $e->getMessage()
            ];
        }
    }

    public function atualizar($id, $dados)
    {
        $required = ['nome'];
        foreach ($required as $field) {
            if (empty($dados[$field])) {
                return [
                    'status' => 'error',
                    'message' => "Campo obrigatório: {$field}"
                ];
            }
        }

        $fornecedor = $this->fornecedor->atualizar($id, $dados);
        
        if ($fornecedor) {
            return [
                'status' => 'success',
                'message' => 'Fornecedor atualizado com sucesso',
                'data' => $fornecedor
            ];
        }
        
        return [
            'status' => 'error',
            'message' => 'Erro ao atualizar fornecedor'
        ];
    }

    public function deletar($id)
    {
        $fornecedor = $this->fornecedor->buscarPorId($id);
        
        if (!$fornecedor) {
            return [
                'status' => 'error',
                'message' => 'Fornecedor não encontrado'
            ];
        }

        if ($this->fornecedor->deletar($id)) {
            return [
                'status' => 'success',
                'message' => 'Fornecedor deletado com sucesso'
            ];
        }
        
        return [
            'status' => 'error',
            'message' => 'Erro ao deletar fornecedor'
        ];
    }
}
