<?php
declare(strict_types=1);

/**
 * ARQON - THE VAULT | CEP Controller
 * Finalidade: Busca de endereço por CEP (ViaCEP API)
 */
class CEPController {
    
    /**
     * GET /api/cep
     * Busca endereço por CEP
     */
    public function buscar(): void {
        try {
            $cep = $_GET['cep'] ?? '';
            
            if (empty($cep)) {
                throw new Exception("CEP é obrigatório.", 400);
            }
            
            // Remove caracteres não numéricos
            $cep = preg_replace('/[^0-9]/', '', $cep);
            
            if (strlen($cep) !== 8) {
                throw new Exception("CEP inválido.", 400);
            }
            
            // Busca na API ViaCEP
            $url = "https://viacep.com.br/ws/{$cep}/json/";
            $response = file_get_contents($url);
            
            if ($response === false) {
                throw new Exception("Erro ao buscar CEP.", 500);
            }
            
            $data = json_decode($response, true);
            
            if (isset($data['erro'])) {
                throw new Exception("CEP não encontrado.", 404);
            }
            
            echo json_encode([
                "status" => "success",
                "data" => [
                    "cep" => $data['cep'] ?? '',
                    "logradouro" => $data['logradouro'] ?? '',
                    "complemento" => $data['complemento'] ?? '',
                    "bairro" => $data['bairro'] ?? '',
                    "localidade" => $data['localidade'] ?? '',
                    "uf" => $data['uf'] ?? '',
                    "cidade" => $data['localidade'] ?? ''
                ]
            ]);
        } catch (Exception $e) {
            $httpCode = (int) $e->getCode(); http_response_code(($httpCode >= 100 && $httpCode <= 599) ? $httpCode : 500);
            echo json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
}
