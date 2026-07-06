<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Produto.php';

/**
 * ARQON - THE VAULT | Produto Controller (ATUALIZADO COM UPLOAD)
 * Finalidade: CRUD de produtos com upload de imagens
 */
class ProdutoController {
    
    /**
     * Rota: GET /api/produtos
     * Lista produtos com filtros opcionais
     */
    public function listar(array $queryParams): void {
        try {
            $produtoModel = new Produto();
            
            // Determinar se é busca por texto ou catálogo com filtros
            if (isset($queryParams['q']) && trim($queryParams['q']) !== '') {
                $termo = trim($queryParams['q']);
                $produtos = $produtoModel->buscarPorTexto($termo);
                $mensagem = "Resultados para: {$termo}";
            } else {
                // Busca com filtros (marca, categoria, estilo)
                $pagina = (int)($queryParams['pagina'] ?? 1);
                $limit = (int)($queryParams['limit'] ?? 20);
                
                // [CORREÇÃO AQUI] Sanitização dos filtros: Converte 'all' para null
                $brand = (isset($queryParams['brand']) && $queryParams['brand'] !== 'all') ? $queryParams['brand'] : null;
                $category = (isset($queryParams['category']) && $queryParams['category'] !== 'all') ? $queryParams['category'] : null;
                $style = (isset($queryParams['style']) && $queryParams['style'] !== 'all') ? $queryParams['style'] : null;
                
                // Agora envia as variáveis limpas para o banco de dados
                $produtos = $produtoModel->buscarCatalogoInteligente(
                    $brand,
                    $category,
                    $style,
                    $pagina,
                    $limit
                );
                $mensagem = "Catálogo sincronizado.";
            }

            sendResponse([
                "status" => "success",
                "message" => $mensagem,
                "data" => $produtos
            ], 200);
            
        } catch (Exception $e) {
            error_log("PRODUTO_LIST_ERROR: " . $e->getMessage());
            sendResponse([
                "status" => "error",
                "message" => "Erro ao carregar produtos"
            ], 500);
        }
    }

    /**
     * Rota: GET /api/produtos/detalhes?id=5
     * Busca detalhes completos de um produto
     */
    public function detalhes(array $queryParams): void {
        try {
            if (!isset($queryParams['id'])) {
                sendResponse([
                    "status" => "error",
                    "message" => "ID do produto não fornecido"
                ], 400);
                return;
            }

            $id = (int)$queryParams['id'];
            $produtoModel = new Produto();
            $detalhes = $produtoModel->buscarDetalhesPorId($id);

            if (!$detalhes) {
                sendResponse([
                    "status" => "error",
                    "message" => "Artefato não encontrado"
                ], 404);
                return;
            }

            sendResponse([
                "status" => "success",
                "data" => $detalhes
            ], 200);
            
        } catch (Exception $e) {
            error_log("PRODUTO_DETAILS_ERROR: " . $e->getMessage());
            sendResponse([
                "status" => "error",
                "message" => "Erro ao buscar detalhes"
            ], 500);
        }
    }

    /**
     * Rota: POST /api/produtos
     * CRIAR novo produto COM UPLOAD DE IMAGEM
     * 
     * Content-Type: multipart/form-data
     * 
     * Fields:
     *   - nome (string, required)
     *   - descricao (string)
     *   - id_categoria (int, required)
     *   - id_marca (int, required)
     *   - id_estilo (int)
     *   - valor_diaria (float, required)
     *   - valor_mercado (float, required)
     *   - foto (file, required) - PNG/JPG, máx 2MB
     */
    public function criar(array $dados): void {
        try {
            // ═══════════════════════════════════════════════════════════════════════
            // 1. VALIDAÇÕES DE DADOS
            // ═══════════════════════════════════════════════════════════════════════
            
            $camposObrigatorios = ['nome', 'valor_diaria', 'id_marca', 'id_categoria'];
            foreach ($camposObrigatorios as $campo) {
                if (empty($dados[$campo])) {
                    sendResponse([
                        "status" => "error",
                        "message" => "Campo obrigatório ausente: '$campo'"
                    ], 400);
                    return;
                }
            }

            // Validar valores numéricos
            $valor_diaria = (float)$dados['valor_diaria'];
            $valor_mercado = (float)($dados['valor_mercado'] ?? 0);

            if ($valor_diaria <= 0) {
                sendResponse([
                    "status" => "error",
                    "message" => "Valor de diária deve ser maior que 0"
                ], 400);
                return;
            }

            // ═══════════════════════════════════════════════════════════════════════
            // 2. PROCESSAR UPLOAD DA IMAGEM
            // ═══════════════════════════════════════════════════════════════════════

            $foto_url = null;

            if (isset($_FILES['foto'])) {
                $foto = $_FILES['foto'];

                // Validar se não houve erro
                if ($foto['error'] !== UPLOAD_ERR_OK) {
                    $erros_upload = [
                        UPLOAD_ERR_INI_SIZE => 'Arquivo muito grande (limite do servidor)',
                        UPLOAD_ERR_FORM_SIZE => 'Arquivo muito grande (limite do formulário)',
                        UPLOAD_ERR_PARTIAL => 'Upload incompleto',
                        UPLOAD_ERR_NO_FILE => 'Nenhum arquivo enviado',
                        UPLOAD_ERR_NO_TMP_DIR => 'Diretório temporário ausente',
                        UPLOAD_ERR_CANT_WRITE => 'Não foi possível escrever o arquivo',
                        UPLOAD_ERR_EXTENSION => 'Extensão não permitida'
                    ];

                    $mensagem = $erros_upload[$foto['error']] ?? 'Erro desconhecido no upload';
                    
                    sendResponse([
                        "status" => "error",
                        "message" => "Erro no upload: $mensagem"
                    ], 400);
                    return;
                }

                // Validar tipo MIME
                $tipos_permitidos = ['image/jpeg', 'image/png', 'image/webp'];
                $mime_type = mime_content_type($foto['tmp_name']);

                if (!in_array($mime_type, $tipos_permitidos)) {
                    sendResponse([
                        "status" => "error",
                        "message" => "Tipo de arquivo não permitido. Use PNG, JPG ou WEBP"
                    ], 400);
                    return;
                }

                // Validar tamanho (máx 2MB)
                $max_size = 2 * 1024 * 1024; // 2MB
                if ($foto['size'] > $max_size) {
                    sendResponse([
                        "status" => "error",
                        "message" => "Arquivo muito grande. Máximo 2MB"
                    ], 400);
                    return;
                }

                // Gerar nome único do arquivo
                $extensao = pathinfo($foto['name'], PATHINFO_EXTENSION);
                $nome_arquivo = 'produto_' . time() . '_' . uniqid() . '.' . strtolower($extensao);
                
                // Caminho de destino (relativo para funcionar no InfinityFree)
                $upload_dir = dirname(__DIR__, 3) . '/public/uploads/produtos/';
                
                // Criar diretório se não existir
                if (!is_dir($upload_dir)) {
                    if (!mkdir($upload_dir, 0777, true)) {
                        sendResponse([
                            "status" => "error",
                            "message" => "Erro ao criar diretório de upload"
                        ], 500);
                        return;
                    }
                }

                $caminho_destino = $upload_dir . $nome_arquivo;

                // Mover arquivo
                if (!move_uploaded_file($foto['tmp_name'], $caminho_destino)) {
                    error_log("UPLOAD_MOVE_ERROR: Falha ao mover arquivo de " . $foto['tmp_name'] . " para " . $caminho_destino);
                    
                    sendResponse([
                        "status" => "error",
                        "message" => "Erro ao salvar arquivo"
                    ], 500);
                    return;
                }

                // URL pública da imagem
                $foto_url = "/public/uploads/produtos/" . $nome_arquivo;
                
                // Verificar se o arquivo foi realmente salvo
                if (!file_exists($caminho_destino)) {
                    error_log("UPLOAD_FILE_NOT_FOUND: Arquivo não encontrado após move_uploaded_file: " . $caminho_destino);
                    sendResponse([
                        "status" => "error",
                        "message" => "Erro ao salvar arquivo no servidor"
                    ], 500);
                    return;
                }
                
                error_log("UPLOAD_SUCCESS: Arquivo salvo em " . $foto_url);
            } else {
                sendResponse([
                    "status" => "error",
                    "message" => "Nenhuma imagem foi enviada"
                ], 400);
                return;
            }

            // ═══════════════════════════════════════════════════════════════════════
            // 3. INSERIR NO BANCO DE DADOS
            // ═══════════════════════════════════════════════════════════════════════

            $produtoModel = new Produto();
            
            $dados_insert = [
                'nome' => $dados['nome'],
                'descricao' => $dados['descricao'] ?? null,
                'valor_diaria' => $valor_diaria,
                'valor_mercado' => $valor_mercado,
                'id_marca' => (int)$dados['id_marca'],
                'id_categoria' => (int)$dados['id_categoria'],
                'id_estilo' => (int)($dados['id_estilo'] ?? 1),
                'foto_principal_url' => $foto_url,
                'status_venda' => isset($dados['status_venda']) ? (bool)$dados['status_venda'] : true
            ];

            $idInserido = $produtoModel->inserir($dados_insert);

            if ($idInserido) {
                error_log("PRODUTO_CREATED: ID=$idInserido, Nome={$dados['nome']}, Foto=$foto_url");
                
                sendResponse([
                    "status" => "success",
                    "message" => "Artefato registrado com sucesso!",
                    "id" => $idInserido,
                    "foto_url" => $foto_url
                ], 201);
            } else {
                // Se inserção falhou, deletar a imagem
                if ($foto_url && file_exists($caminho_destino)) {
                    unlink($caminho_destino);
                }

                sendResponse([
                    "status" => "error",
                    "message" => "Falha ao salvar produto no banco de dados"
                ], 500);
            }

        } catch (Exception $e) {
            error_log("PRODUTO_CREATE_ERROR: " . $e->getMessage());
            
            // Se houver erro, deletar imagem se foi enviada
            if (isset($caminho_destino) && file_exists($caminho_destino)) {
                unlink($caminho_destino);
            }

            sendResponse([
                "status" => "error",
                "message" => "Erro ao processar requisição"
            ], 500);
        }
    }

    /**
     * Rota: DELETE /api/produtos?id=X
     * Remove um produto e suas mídias associadas
     */
    public function excluir(int $id): void {
        try {
            // Validações
            if ($id <= 0) {
                sendResponse([
                    "status" => "error",
                    "message" => "ID inválido"
                ], 400);
                return;
            }

            $produtoModel = new Produto();
            
            // Busca o produto para obter a URL da foto (para deletar o arquivo)
            $produto = $produtoModel->buscarDetalhesPorId($id);
            
            // Tenta deletar
            $sucesso = $produtoModel->excluir($id);

            if ($sucesso) {
                // Se a imagem existe, deletar o arquivo físico
                if ($produto && $produto['foto_principal_url']) {
                    $caminho_arquivo = dirname(__DIR__, 3) . $produto['foto_principal_url'];
                    
                    if (file_exists($caminho_arquivo)) {
                        @unlink($caminho_arquivo); // @ = suprime warnings se falhar
                        error_log("FOTO_DELETED: " . $caminho_arquivo);
                    }
                }

                error_log("PRODUTO_DELETED: ID=$id");
                
                sendResponse([
                    "status" => "success",
                    "message" => "Artefato removido do Cofre com sucesso"
                ], 200);
            } else {
                sendResponse([
                    "status" => "error",
                    "message" => "Artefato não encontrado ou não pôde ser removido"
                ], 400);
            }

        } catch (Exception $e) {
            error_log("PRODUTO_DELETE_ERROR: " . $e->getMessage());
            sendResponse([
                "status" => "error",
                "message" => "Falha crítica ao acessar o Cofre"
            ], 500);
        }
    }

    /**
     * Rota: GET /api/produtos/disponibilidade?id=5
     * Retorna disponibilidade de estoque por tamanho para um produto
     * Sistema de maturidade de luxo: mostra badges de "ÚLTIMA UNIDADE" e "POUCAS UNIDADES"
     */
    public function getDisponibilidade(int $id): void {
        try {
            if ($id <= 0) {
                sendResponse([
                    "status" => "error",
                    "message" => "ID inválido"
                ], 400);
                return;
            }

            $produtoModel = new Produto();
            
            // Busca detalhes do produto
            $produto = $produtoModel->buscarDetalhesPorId($id);
            
            if (!$produto) {
                sendResponse([
                    "status" => "error",
                    "message" => "Artefato não encontrado"
                ], 404);
                return;
            }

            // Extrai tamanhos do produto (se estiverem em formato CSV)
            $tamanhosStr = $produto['tamanhos'] ?? '';
            $tamanhos = array_filter(array_map('trim', explode(',', $tamanhosStr)));
            
            // Simula disponibilidade por tamanho (em produção, isso viria de tabela de SKUs)
            // Para este sistema, assumimos que todos os tamanhos listados têm estoque
            $disponibilidade = [];
            foreach ($tamanhos as $tam) {
                $disponibilidade[] = [
                    'tamanho' => $tam,
                    'disponivel' => true,
                    'estoque' => rand(1, 5) // Simula estoque entre 1 e 5 unidades por tamanho
                ];
            }

            // Calcula totais para badges de luxo
            $estoqueTotal = array_sum(array_column($disponibilidade, 'estoque'));
            $tamanhosDisponiveis = array_filter($disponibilidade, fn($t) => $t['disponivel']);
            
            // Determina badge de maturidade de luxo
            $badgeLuxo = null;
            if ($estoqueTotal <= 2) {
                $badgeLuxo = 'ÚLTIMA UNIDADE';
            } elseif ($estoqueTotal <= 5) {
                $badgeLuxo = 'POUCAS UNIDADES';
            }

            sendResponse([
                "status" => "success",
                "data" => [
                    'id_produto' => $id,
                    'nome' => $produto['nome'],
                    'tamanhos' => $disponibilidade,
                    'estoque_total' => $estoqueTotal,
                    'tamanhos_disponiveis' => array_column($tamanhosDisponiveis, 'tamanho'),
                    'badge_luxo' => $badgeLuxo,
                    'status_geral' => $estoqueTotal > 0 ? 'disponivel' : 'esgotado'
                ]
            ], 200);

        } catch (Exception $e) {
            error_log("PRODUTO_DISPONIBILIDADE_ERROR: " . $e->getMessage());
            sendResponse([
                "status" => "error",
                "message" => "Erro ao verificar disponibilidade"
            ], 500);
        }
    }
}
?>