/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQON - ADMIN DASHBOARD | admin.js v3.0 (PREMIUM & FULLY INTEGRATED)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const API_BASE_URL = '/PROJETO-ARQUON/index.php/api';

// =========================================================================
//                    0. SISTEMA DE NOTIFICAÇÕES (TOASTS DINÂMICOS)
// =========================================================================
function mostrarToast(mensagem, tipo = 'success') {
    let container = document.getElementById('arqon-toast-container');
    
    // Cria o container de toasts dinamicamente se não existir
    if (!container) {
        container = document.createElement('div');
        container.id = 'arqon-toast-container';
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            display: flex; flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgCor = tipo === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
    const icone = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    toast.style.cssText = `
        background: ${bgCor}; color: white; padding: 15px 20px; border-radius: 8px;
        font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex; align-items: center; gap: 10px;
        transform: translateX(100%); opacity: 0; transition: all 0.3s ease;
        backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2);
    `;
    
    toast.innerHTML = `<i class="fas ${icone}"></i> ${mensagem}`;
    container.appendChild(toast);

    // Animação de entrada
    setTimeout(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; }, 10);

    // Animação de saída e remoção
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)'; toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// =========================================================================
//                    1. AUTH GUARD (Proteção de Acesso)
// =========================================================================
function authGuard() {
    const token = localStorage.getItem('arqon_token');
    const role = localStorage.getItem('arqon_role');
    
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Apenas TOTAL_CONTROL e VAULT_MGMT têm acesso administrativo
    if (role !== 'TOTAL_CONTROL' && role !== 'VAULT_MGMT') {
        alert('❌ Acesso negado. Nível de credencial insuficiente.');
        window.location.href = 'profile.html';
        return false;
    }
    return true;
}

function getHeaders(contentType = 'application/json') {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('arqon_token')}` };
    if (contentType) headers['Content-Type'] = contentType;
    return headers;
}

function exibirLoadingTabela(tbodySelector, colunas) {
    const tbody = document.querySelector(tbodySelector);
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="${colunas}" style="text-align:center; padding: 30px; color: var(--gold);">
            <i class="fas fa-spinner fa-spin" style="font-size: 20px; margin-right: 10px;"></i> 
            Acessando registros do cofre...
        </td></tr>`;
    }
}

// =========================================================================
//                    2. INICIALIZAÇÃO E ABAS
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (!authGuard()) return;

    abrirAba('dashboard');

    // Setup do Preview de Imagem no Modal de Produtos
    const inputFoto = document.getElementById('input-foto');
    if (inputFoto) {
        inputFoto.addEventListener('change', function(e) {
            const preview = document.getElementById('preview-foto');
            const file = e.target.files[0];
            if (file && preview) {
                const reader = new FileReader();
                reader.onload = (upload) => {
                    preview.src = upload.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

function abrirAba(abaId) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const linkAtivo = document.querySelector(`[onclick="abrirAba('${abaId}')"]`);
    if (linkAtivo) linkAtivo.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    const tabAtiva = document.getElementById(`tab-${abaId}`);
    if (tabAtiva) tabAtiva.classList.add('active');

    // Roteamento interno de chamadas com feedback de loading
    switch(abaId) {
        case 'dashboard': carregarMetricasDashboard(); break;
        case 'inventario': carregarTabelaInventario(); break;
        case 'usuarios': carregarTabelaUsuarios(); break;
        case 'logs': carregarLogsSistema(7); break;
    }
}

// =========================================================================
//                    3. DASHBOARD (MÉTRICAS)
// =========================================================================
async function carregarMetricasDashboard() {
    exibirLoadingTabela('#tab-dashboard .data-table tbody', 5);

    try {
        const response = await fetch(`${API_BASE_URL}/admin/metricas`, {
            method: 'GET', headers: getHeaders()
        });

        if (!response.ok) throw new Error(`Erro API: ${response.status}`);
        const resultado = await response.json();

        if (resultado.status === 'success') {
            const data = resultado.data;
            const fmt = val => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

            document.getElementById('metric-total-produtos').textContent = data.total_produtos;
            document.getElementById('metric-alugaveis').textContent = data.alugaveis_disponiveis;
            document.getElementById('metric-usuarios').textContent = data.total_usuarios;
            document.getElementById('metric-taxa-ocupacao').textContent = `${data.taxa_ocupacao}%`;
            document.getElementById('metric-receita-mes').textContent = fmt(data.receita_mes);
            document.getElementById('metric-receita-pendente').textContent = fmt(data.receita_pendente);
            document.getElementById('metric-valor-inventario').textContent = fmt(data.valor_total_inventario);

            renderTransacoesDashboard(data.ultimas_transacoes);
        }
    } catch (err) {
        console.error('Falha no Dashboard:', err);
        mostrarToast('Falha ao carregar métricas principais.', 'error');
    }
}

function renderTransacoesDashboard(transacoes) {
    const tbody = document.querySelector('#tab-dashboard .data-table tbody');
    if (!tbody) return;

    if (!transacoes || transacoes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhuma movimentação recente no cofre.</td></tr>`;
        return;
    }

    tbody.innerHTML = transacoes.map(t => {
        const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.total);
        const data = new Date(t.data_locacao).toLocaleDateString('pt-BR');
        const stClass = t.status_pagamento.toLowerCase() === 'pago' ? 'ativo' : 'inativo';
        return `
            <tr>
                <td>#${t.id}</td>
                <td><strong>${t.cliente || 'Membro do Cofre'}</strong></td>
                <td>${data}</td>
                <td><span class="role-badge">${valor}</span></td>
                <td><span class="status-badge ${stClass}">${t.status_pagamento.toUpperCase()}</span></td>
            </tr>`;
    }).join('');
}

// =========================================================================
//                    4. INVENTÁRIO DE PRODUTOS
// =========================================================================
async function carregarTabelaInventario() {
    exibirLoadingTabela('.inventory-table tbody', 6);
    const tbody = document.querySelector('.inventory-table tbody');

    try {
        const response = await fetch(`${API_BASE_URL}/produtos`, { method: 'GET', headers: getHeaders() });
        if (!response.ok) throw new Error(`Erro API: ${response.status}`);
        
        const resultado = await response.json();
        // Garante a leitura correta do array que está dentro de 'resultado.data'
        const produtos = resultado.data || resultado; 

        if (!produtos || produtos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">O cofre está vazio. Adicione artefatos.</td></tr>`;
            return;
        }

        tbody.innerHTML = produtos.map(p => {
            // Correção da leitura dos valores monetários vindo da API (valor_diaria)
            const precoDiaria = p.valor_diaria || p.preco_diaria || 0;
            const valDiaria = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoDiaria);
            
            // Correção do mapeamento de status: o banco usa 'status_venda' (1 para ativo, 0 para inativo)
            const ehAtivo = p.status_venda == 1 || p.status === 'disponível' || p.status === 'disponivel';
            const stClass = ehAtivo ? 'ativo' : 'inativo';
            const stTexto = ehAtivo ? 'DISPONÍVEL' : 'INDISPONÍVEL';
            
            // 🖼️ CONTROLE DA IMAGEM PREMIUM / SVG FALLBACK
            let tagImagem = '';
            
            if (p.foto_url) {
                // Se houver imagem cadastrada, monta o caminho completo
                const urlImagem = p.foto_url.startsWith('http') 
                    ? p.foto_url 
                    : `/PROJETO-ARQUON/public/uploads/${p.foto_url}`;
                
                // Gera a tag img normal (com uma função para injetar o SVG elegante caso o arquivo físico tenha sido deletado)
                tagImagem = `<img src="${urlImagem}" style="width:40px; height:40px; border-radius:6px; object-fit:cover; border:1px solid var(--border-lux);" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
            }

            // Este é o Placeholder elegante: Um escudo/cofre minimalista geométrico em tons de dourado mate e preto acetinado
            const placeholderElegante = `
                <div class="premium-placeholder" style="width:40px; height:40px; border-radius:6px; background: linear-gradient(135deg, #1a1a1a, #0d0d0d); border: 1px solid rgba(212, 175, 55, 0.3); display: ${p.foto_url ? 'none' : 'flex'}; align-items: center; justify-content: center; box-shadow: inset 0 0 8px rgba(212, 175, 55, 0.1);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        <circle cx="12" cy="16" r="1"></circle>
                    </svg>
                </div>
            `;

            return `
                <tr>
                    <td>#${p.id}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="position: relative; width:40px; height:40px; display:flex;">
                                ${tagImagem}
                                ${placeholderElegante}
                            </div>
                            <div>
                                <strong style="color: #fff; font-size: 14px;">${p.nome}</strong>
                            </div>
                        </div>
                    </td>
                    <td><span style="color: #e5e5e5; font-size: 13px;">${p.categoria || 'Artefato'}</span></td>
                    <td><span class="role-badge">${valDiaria}</span></td>
                    <td><span class="status-badge ${stClass}">${stTexto}</span></td>
                    <td>
                        <button class="action-btn" title="Editar Artefato" onclick="prepararEdicaoProduto(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" title="Remover Artefato" onclick="deletarProduto(${p.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
    } catch (err) {
        console.error("Erro ao renderizar inventário:", err);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#F44336;">Falha ao carregar o inventário do cofre.</td></tr>`;
    }
}

async function submeterFormProduto(event) {
    event.preventDefault();
    const form = event.target;
    const btnSubmit = form.querySelector('.btn-submit');
    const formData = new FormData(form);

    // Bloqueia o botão para evitar cliques duplos
    const btnOriginalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sincronizando...';
    btnSubmit.disabled = true;

    try {
        let url = `${API_BASE_URL}/produtos`;
        
        // 🚨 SE ESTIVER EM MODO DE EDIÇÃO:
        // Anexa o ID ao formulário. O seu PHP vai receber $_POST['id'] e saberá que é uma atualização!
        if (produtoEmEdicaoId) {
            formData.append('id', produtoEmEdicaoId);
            
            // Se o seu backend usar uma rota específica para atualizar, descomente a linha abaixo:
            // url = `${API_BASE_URL}/produtos/atualizar`; 
        }

        const response = await fetch(url, { 
            method: 'POST', // Mantemos POST porque o PHP gerencia upload de ficheiros nativamente melhor assim
            headers: getHeaders(null), // null limpa o Content-Type para o navegador setar o Multipart/form-data correto
            body: formData
        });

        if (!response.ok) throw new Error("Falha de Comunicação com o Backend.");
        const resultado = await response.json();

        if (resultado.status === 'success' || resultado.id) {
            mostrarToast('Artefato atualizado e protegido no acervo!', 'success');
            fecharModalProduto();      // Fecha o modal e limpa os campos
            carregarTabelaInventario(); // Atualiza a tabela na hora
        } else {
            mostrarToast(resultado.message || 'Falha ao processar operação.', 'error');
        }
    } catch (err) {
        mostrarToast('Erro crítico na comunicação com o servidor.', 'error');
        console.error(err);
    } finally {
        // Devolve o estado original ao botão
        btnSubmit.innerHTML = btnOriginalText;
        btnSubmit.disabled = false;
    }
}

async function deletarProduto(id) {
    if (!confirm('Atenção: Deseja realmente remover permanentemente este artefato do cofre? Essa ação é irreversível.')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/produtos/deletar?id=${id}`, {
            method: 'DELETE', headers: getHeaders()
        });
        if (!response.ok) throw new Error("Erro na exclusão");
        
        const resultado = await response.json();
        if (resultado.status === 'success') {
            mostrarToast('Artefato expurgado do cofre com sucesso.', 'success');
            carregarTabelaInventario();
        } else {
            mostrarToast(resultado.message || 'Falha ao deletar item.', 'error');
        }
    } catch (err) {
        mostrarToast('Erro de conexão ao tentar deletar.', 'error');
    }
}

// Modais do Inventário
function abrirModalProduto() { document.getElementById('modal-produto')?.classList.add('active'); }
function fecharModalProduto() {
    const modal = document.getElementById('modal-produto');
    if (modal) modal.classList.remove('active');
    document.getElementById('form-produto')?.reset();
    const preview = document.getElementById('preview-foto');
    if (preview) preview.style.display = 'none';
}

// =========================================================================
//                    5. GERENCIAMENTO DE USUÁRIOS
// =========================================================================
async function carregarTabelaUsuarios() {
    exibirLoadingTabela('#tab-usuarios .data-table tbody', 6);
    const tbody = document.querySelector('#tab-usuarios .data-table tbody');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
            method: 'GET', headers: getHeaders()
        });
        if (!response.ok) throw new Error("Erro servidor");
        
        const resultado = await response.json();

        if (resultado.status === 'success') {
            tbody.innerHTML = resultado.data.map(u => {
                const stClass = u.status === 'ativo' ? 'ativo' : 'inativo';
                return `
                    <tr>
                        <td>#${u.id}</td>
                        <td><strong>${u.nome}</strong></td>
                        <td>${u.email}</td>
                        <td><span class="role-badge">${u.nivel_acesso || 'MEMBER'}</span></td>
                        <td><span class="status-badge ${stClass}">${u.status.toUpperCase()}</span></td>
                        <td>
                            <button class="action-btn" title="Alternar Status" onclick="alternarStatusUsuario(${u.id}, '${u.status}')">
                                <i class="fas fa-power-off"></i>
                            </button>
                        </td>
                    </tr>`;
            }).join('');
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#F44336;">Falha ao carregar credenciais.</td></tr>`;
    }
}

async function alternarStatusUsuario(id, statusAtual) {
    const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo';
    if (!confirm(`Confirmar alteração de credencial para o status: ${novoStatus.toUpperCase()}?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/usuario/status`, {
            method: 'PUT', // Seguindo padrão REST para atualização
            headers: getHeaders('application/json'),
            body: JSON.stringify({ id_usuario: id, status: novoStatus })
        });
        
        // Se a sua API aceita POST invés de PUT, mude o method acima para POST
        if (!response.ok) throw new Error("Erro na atualização");
        const resultado = await response.json();

        if (resultado.status === 'success') {
            mostrarToast(`Status operacional atualizado para ${novoStatus}.`, 'success');
            carregarTabelaUsuarios();
        } else {
            mostrarToast('Não foi possível alterar a credencial.', 'error');
        }
    } catch (err) {
        mostrarToast('Erro ao comunicar com o servidor de acessos.', 'error');
    }
}

// =========================================================================
//                    6. LOGS DE AUDITORIA (LEDGER)
// =========================================================================
async function carregarLogsSistema(dias) {
    exibirLoadingTabela('#tab-logs .data-table tbody', 3);
    const tbody = document.querySelector('#tab-logs .data-table tbody');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/logs?dias=${dias}`, {
            method: 'GET', headers: getHeaders()
        });
        if (!response.ok) throw new Error("Erro ao buscar logs");
        const resultado = await response.json();

        if (resultado.status === 'success' && resultado.data.length > 0) {
            tbody.innerHTML = resultado.data.map(l => {
                const data = new Date(l.data_log).toLocaleString('pt-BR');
                return `
                    <tr>
                        <td><code style="color:var(--gold); font-size:11px;">${data}</code></td>
                        <td><strong>${l.acao}</strong></td>
                        <td style="color:var(--text-gray); font-size:13px;">${l.descricao}</td>
                    </tr>`;
            }).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">O Ledger está limpo. Nenhum log no período.</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#F44336;">Falha de comunicação com o Ledger do sistema.</td></tr>`;
    }
}

// =========================================================================
//                    7. LOGOUT GERAL
// =========================================================================
function executarLogout() {
    if (confirm('Deseja lacrar o cofre e encerrar a sessão administrativa?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Variável global para armazenar o ID do produto que está sendo editado
let produtoEmEdicaoId = null;

function prepararEdicaoProduto(produto) {
    // 1. Guarda o ID do produto que foi clicado
    produtoEmEdicaoId = produto.id;
    
    // 2. Abre o modal de cadastro que você já tem no HTML
    abrirModalProduto();
    
    // 3. Muda o título do modal e o texto do botão para o modo de Edição
    const modalTitulo = document.querySelector('#modal-produto h2');
    if (modalTitulo) modalTitulo.textContent = 'Editar Artefato do Cofre';
    
    const btnSubmit = document.querySelector('#form-produto .btn-submit');
    if (btnSubmit) btnSubmit.innerHTML = '<i class="fas fa-save"></i> Atualizar Artefato';

    // 4. Preenche automaticamente os campos do formulário com os dados do produto
    const form = document.getElementById('form-produto');
    if (form) {
        if (form.elements['nome']) form.elements['nome'].value = produto.nome || '';
        if (form.elements['categoria']) form.elements['categoria'].value = produto.id_categoria || produto.categoria || '';
        if (form.elements['valor_diaria']) form.elements['valor_diaria'].value = produto.valor_diaria || '';
        if (form.elements['valor_mercado']) form.elements['valor_mercado'].value = produto.valor_mercado || '';
        if (form.elements['descricao']) form.elements['descricao'].value = produto.descricao || '';
        if (form.elements['composicao']) form.elements['composicao'].value = produto.composicao || '';
        
        // Define o select do status (se o banco retornar status_venda)
        if (form.elements['status']) {
            form.elements['status'].value = (produto.status_venda == 1) ? 'disponivel' : 'indisponivel';
        }
    }

    // 5. Se o produto tiver imagem, atualiza o preview do modal
    const preview = document.getElementById('preview-foto');
    if (preview && produto.foto_url) {
        preview.src = produto.foto_url.startsWith('http') ? produto.foto_url : `/PROJETO-ARQUON/public/uploads/${produto.foto_url}`;
        preview.style.display = 'block';
    }
}

// Intercepta a função de fechar o modal para limpar o modo de edição
const fecharModalOriginal = fecharModalProduto;
fecharModalProduto = function() {
    fecharModalOriginal();
    produtoEmEdicaoId = null; // Limpa o ID
    
    // Restaura os textos originais do modal para o modo "Novo"
    const modalTitulo = document.querySelector('#modal-produto h2');
    if (modalTitulo) modalTitulo.textContent = 'Novo Artefato';
    const btnSubmit = document.querySelector('#form-produto .btn-submit');
    if (btnSubmit) btnSubmit.innerHTML = '<i class="fas fa-shield-alt"></i> Integrar ao Cofre';
};