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
