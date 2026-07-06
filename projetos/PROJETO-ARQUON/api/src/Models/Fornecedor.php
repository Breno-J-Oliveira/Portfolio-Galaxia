<?php

namespace ARQON\Api\Models;

use PDO;

class Fornecedor
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function listar($ativo = true)
    {
        $sql = "SELECT f.id, f.uuid, f.nome, f.cnpj, f.email, f.telefone, f.endereco, f.cidade, f.estado, f.cep, 
                f.contato_principal, f.status, f.data_criacao, f.id_usuario, u.nome as usuario_nome, u.email as usuario_email
                FROM fornecedores f
                LEFT JOIN usuarios u ON u.id = f.id_usuario";
        
        if ($ativo) {
            $sql .= " WHERE f.status = 'ativo'";
        }
        
        $sql .= " ORDER BY f.nome ASC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT * FROM fornecedores WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function buscarPorUuid($uuid)
    {
        $sql = "SELECT * FROM fornecedores WHERE uuid = :uuid";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function criar($dados)
    {
        $sql = "INSERT INTO fornecedores (uuid, nome, cnpj, email, telefone, endereco, cidade, estado, cep, 
                contato_principal, status, id_usuario) 
                VALUES (:uuid, :nome, :cnpj, :email, :telefone, :endereco, :cidade, :estado, :cep, 
                :contato_principal, :status, :id_usuario)";
        
        $uuid = $dados['uuid'] ?? uniqid();
        $stmt = $this->db->prepare($sql);
        
        $idUsuario = !empty($dados['id_usuario']) ? (int)$dados['id_usuario'] : null;
        
        $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->bindParam(':nome', $dados['nome'], PDO::PARAM_STR);
        $stmt->bindParam(':cnpj', $dados['cnpj'], PDO::PARAM_STR);
        $stmt->bindParam(':email', $dados['email'], PDO::PARAM_STR);
        $stmt->bindParam(':telefone', $dados['telefone'], PDO::PARAM_STR);
        $stmt->bindParam(':endereco', $dados['endereco'], PDO::PARAM_STR);
        $stmt->bindParam(':cidade', $dados['cidade'], PDO::PARAM_STR);
        $stmt->bindParam(':estado', $dados['estado'], PDO::PARAM_STR);
        $stmt->bindParam(':cep', $dados['cep'], PDO::PARAM_STR);
        $stmt->bindParam(':contato_principal', $dados['contato_principal'], PDO::PARAM_STR);
        $stmt->bindParam(':status', $dados['status'] ?? 'ativo', PDO::PARAM_STR);
        $stmt->bindParam(':id_usuario', $idUsuario, $idUsuario === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $id = $this->db->lastInsertId();
            // Se vinculou um usuário, atualiza a role para VENDOR
            if ($idUsuario) {
                $this->db->prepare("UPDATE usuarios SET nivel_acesso = 'VENDOR' WHERE id = ?")
                    ->execute([$idUsuario]);
            }
            return $this->buscarPorId($id);
        }
        return false;
    }

    public function atualizar($id, $dados)
    {
        $sql = "UPDATE fornecedores SET 
                nome = :nome, 
                cnpj = :cnpj, 
                email = :email, 
                telefone = :telefone, 
                endereco = :endereco, 
                cidade = :cidade, 
                estado = :estado, 
                cep = :cep, 
                contato_principal = :contato_principal, 
                status = :status,
                id_usuario = :id_usuario
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $idUsuario = !empty($dados['id_usuario']) ? (int)$dados['id_usuario'] : null;
        
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':nome', $dados['nome'], PDO::PARAM_STR);
        $stmt->bindParam(':cnpj', $dados['cnpj'], PDO::PARAM_STR);
        $stmt->bindParam(':email', $dados['email'], PDO::PARAM_STR);
        $stmt->bindParam(':telefone', $dados['telefone'], PDO::PARAM_STR);
        $stmt->bindParam(':endereco', $dados['endereco'], PDO::PARAM_STR);
        $stmt->bindParam(':cidade', $dados['cidade'], PDO::PARAM_STR);
        $stmt->bindParam(':estado', $dados['estado'], PDO::PARAM_STR);
        $stmt->bindParam(':cep', $dados['cep'], PDO::PARAM_STR);
        $stmt->bindParam(':contato_principal', $dados['contato_principal'], PDO::PARAM_STR);
        $stmt->bindParam(':status', $dados['status'], PDO::PARAM_STR);
        $stmt->bindParam(':id_usuario', $idUsuario, $idUsuario === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            // Se vinculou um usuário, atualiza a role para VENDOR
            if ($idUsuario) {
                $this->db->prepare("UPDATE usuarios SET nivel_acesso = 'VENDOR' WHERE id = ?")
                    ->execute([$idUsuario]);
            }
            return $this->buscarPorId($id);
        }
        return false;
    }

    public function deletar($id)
    {
        $sql = "DELETE FROM fornecedores WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
