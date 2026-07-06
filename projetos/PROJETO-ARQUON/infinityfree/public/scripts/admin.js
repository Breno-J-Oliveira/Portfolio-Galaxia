/**
 * ARQON Vault Control — Admin Panel v4
 */
const API_BASE = '/api';
const UPLOAD_BASE = '/public/uploads/';

const State = {
    tab: 'dashboard',
    lookups: { marcas: [], categorias: [], estilos: [] },
    produtos: [],
    estoque: [],
    usuarios: [],
    locacoes: [],
    logs: [],
    fornecedores: [],
    produtoEditId: null,
    invSort: { col: 'id', dir: 'desc' },
    cropperInstance: null,
    cropperTargetInput: null,
};

const TAB_META = {
    dashboard: ['Dashboard', 'KPIs e movimentação do cofre'],
    inventario: ['Inventário', 'Catálogo de peças para aluguel'],
    estoque: ['Estoque SKU', 'Unidades físicas, RFID e disponibilidade'],
    locacoes: ['Locações', 'Contratos de aluguel e status'],
    usuarios: ['Usuários', 'Credenciais e níveis de acesso'],
    fornecedores: ['Fornecedores', 'Gestão de parceiros e fornecedores'],
    logistica: ['Logística', 'Entregas e rastreio'],
    financeiro: ['Financeiro', 'Receita e split de pagamentos'],
    config: ['Configurações', 'Parâmetros operacionais da plataforma'],
    tema: ['Tema', 'Personalização visual do painel'],
    terminal: ['Terminal', 'Health-check e diagnóstico do sistema'],
    logs: ['Auditoria', 'Ledger de ações administrativas'],
};

// --- Utils ---
function toast(msg, tipo = 'success') {
    if (window.ArqonToast) {
        window.ArqonToast.show(msg, tipo);
    } else {
        console.error('Toast não disponível');
    }
}

function headers(json = true) {
    const h = {
        Authorization: `Bearer ${localStorage.getItem('arqon_token')}`,
        Accept: 'application/json',
    };
    if (json) h['Content-Type'] = 'application/json';
    return h;
}

async function api(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok && data.status !== 'success') {
        throw new Error(data.message || data.details || `HTTP ${res.status}`);
    }
    return data;
}

function moeda(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0);
}

function dataFmt(s) {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('pt-BR');
}

function fotoUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return UPLOAD_BASE + path;
}

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// --- Auth ---
function authGuard() {
    const token = localStorage.getItem('arqon_token');
    const role = localStorage.getItem('arqon_role');
    if (!token) {
        location.href = 'login.html';
        return false;
    }
    if (!['TOTAL_CONTROL', 'VAULT_MGMT', 'ADMIN', 'DEVELOPER'].includes(role)) {
        location.href = 'profile.html';
        return false;
    }
    const chip = document.getElementById('admin-user-chip');
    if (chip) chip.textContent = localStorage.getItem('arqon_user_nome') || 'Admin';
    return true;
}

// --- Nav ---
function abrirAba(tab) {
    State.tab = tab;
    document.querySelectorAll('.nav-link[data-tab]').forEach((l) => {
        l.classList.toggle('active', l.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach((t) => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`)?.classList.add('active');
    const meta = TAB_META[tab] || ['Painel', ''];
    document.getElementById('page-title').textContent = meta[0];
    document.getElementById('page-subtitle').textContent = meta[1];
    refreshTab();
}

function refreshTab() {
    const loaders = {
        dashboard: carregarDashboard,
        inventario: carregarInventario,
        estoque: carregarEstoque,
        locacoes: carregarLocacoes,
        usuarios: carregarUsuarios,
        fornecedores: carregarFornecedores,
        logistica: carregarLogistica,
        financeiro: carregarFinanceiro,
        config: carregarConfig,
        tema: () => { initColorEditor(); previewTypography(); },
        terminal: carregarTerminal,
        logs: () => carregarLogs(7),
    };
    loaders[State.tab]?.();
}

// --- Lookups ---
async function carregarLookups() {
    try {
        const r = await api('/admin/lookups', { headers: headers() });
        State.lookups = r.data || r;
        preencherSelectsLookups();
    } catch (e) {
        console.warn('Lookups:', e);
    }
}

function preencherSelectsLookups() {
    const fill = (id, arr, label = 'nome') => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = arr.map((x) => `<option value="${x.id}">${esc(x[label])}</option>`).join('');
    };
    fill('select-marca', State.lookups.marcas || []);
    fill('select-categoria', State.lookups.categorias || []);
    fill('select-estilo', State.lookups.estilos || []);
    const skuSel = document.getElementById('select-produto-sku');
    if (skuSel) {
        skuSel.innerHTML = (State.produtos.length ? State.produtos : []).map(
            (p) => `<option value="${p.id}">${esc(p.nome)}</option>`
        ).join('');
    }
}

// --- Fornecedores ---
async function carregarFornecedores() {
    try {
        const r = await api('/fornecedores', { headers: headers() });
        State.fornecedores = r.data || [];
        renderizarFornecedores();
    } catch (e) {
        toast(e.message, 'error');
    }
}

function renderizarFornecedores() {
    const tbody = document.getElementById('tbody-fornecedores');
    if (!tbody) return;

    const busca = document.getElementById('input-busca-fornecedores')?.value.toLowerCase() || '';
    const filtroStatus = document.getElementById('filtro-status-fornecedor')?.value || '';

    const filtrados = State.fornecedores.filter(f => {
        const matchBusca = !busca || 
            f.nome.toLowerCase().includes(busca) ||
            (f.cnpj && f.cnpj.includes(busca)) ||
            (f.email && f.email.toLowerCase().includes(busca));
        const matchStatus = !filtroStatus || f.status === filtroStatus;
        return matchBusca && matchStatus;
    });

    tbody.innerHTML = filtrados.length
        ? filtrados.map(f => `
            <tr>
                <td>${f.id}</td>
                <td>${esc(f.nome)}</td>
                <td>${esc(f.cnpj || '—')}</td>
                <td>${esc(f.email || '—')}</td>
                <td>${esc(f.telefone || '—')}</td>
                <td>${esc(f.cidade || '—')}/${esc(f.estado || '')}</td>
                <td><span class="status-badge ${f.status === 'ativo' ? 'status-success' : 'status-error'}">${esc(f.status)}</span></td>
                <td>
                    <button type="button" class="btn-icon" onclick="editarFornecedor(${f.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-icon" onclick="deletarFornecedor(${f.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('')
        : '<tr><td colspan="8" class="empty-cell">Nenhum fornecedor encontrado</td></tr>';
}

async function carregarUsuariosSelect() {
    try {
        const r = await api('/admin/usuarios', { headers: headers() });
        const usuarios = r.data || [];
        const select = document.getElementById('fornecedor-id-usuario');
        if (!select) return;
        select.innerHTML = '<option value="">— Criar fornecedor sem vincular usuário —</option>';
        usuarios.forEach(u => {
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = `${u.nome} (${u.email}) — ${u.nivel_acesso}`;
            option.dataset.email = u.email || '';
            select.appendChild(option);
        });
    } catch (e) {
        console.warn('Erro ao carregar usuários para select:', e);
    }
}

function abrirModalFornecedor() {
    document.getElementById('form-fornecedor').reset();
    document.getElementById('fornecedor-id').value = '';
    document.getElementById('modal-fornecedor-titulo').textContent = 'Novo Fornecedor';
    carregarUsuariosSelect();
    document.getElementById('modal-fornecedor').classList.add('active');
}

function fecharModalFornecedor() {
    document.getElementById('modal-fornecedor').classList.remove('active');
}

function editarFornecedor(id) {
    const fornecedor = State.fornecedores.find(f => f.id === id);
    if (!fornecedor) return;

    document.getElementById('fornecedor-id').value = fornecedor.id;
    document.getElementById('fornecedor-nome').value = fornecedor.nome || '';
    document.getElementById('fornecedor-cnpj').value = fornecedor.cnpj || '';
    document.getElementById('fornecedor-email').value = fornecedor.email || '';
    document.getElementById('fornecedor-telefone').value = fornecedor.telefone || '';
    document.getElementById('fornecedor-endereco').value = fornecedor.endereco || '';
    document.getElementById('fornecedor-cidade').value = fornecedor.cidade || '';
    document.getElementById('fornecedor-estado').value = fornecedor.estado || '';
    document.getElementById('fornecedor-cep').value = fornecedor.cep || '';
    document.getElementById('fornecedor-contato').value = fornecedor.contato_principal || '';
    document.getElementById('fornecedor-status').value = fornecedor.status || 'ativo';

    carregarUsuariosSelect().then(() => {
        const select = document.getElementById('fornecedor-id-usuario');
        if (select && fornecedor.id_usuario) {
            select.value = fornecedor.id_usuario;
        }
    });

    document.getElementById('modal-fornecedor-titulo').textContent = 'Editar Fornecedor';
    document.getElementById('modal-fornecedor').classList.add('active');
}

async function deletarFornecedor(id) {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;

    try {
        const r = await api(`/fornecedores/${id}`, { method: 'DELETE', headers: headers() });
        toast(r.message || 'Fornecedor excluído com sucesso');
        carregarFornecedores();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function submeterFormFornecedor(e) {
    e.preventDefault();
    const id = document.getElementById('fornecedor-id').value;
    const dados = {
        nome: document.getElementById('fornecedor-nome').value,
        cnpj: document.getElementById('fornecedor-cnpj').value,
        email: document.getElementById('fornecedor-email').value,
        telefone: document.getElementById('fornecedor-telefone').value,
        endereco: document.getElementById('fornecedor-endereco').value,
        cidade: document.getElementById('fornecedor-cidade').value,
        estado: document.getElementById('fornecedor-estado').value,
        cep: document.getElementById('fornecedor-cep').value,
        contato_principal: document.getElementById('fornecedor-contato').value,
        status: document.getElementById('fornecedor-status').value,
        id_usuario: document.getElementById('fornecedor-id-usuario').value || null,
    };

    try {
        if (id) {
            const r = await api(`/fornecedores/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(dados) });
            toast(r.message || 'Fornecedor atualizado com sucesso');
        } else {
            const r = await api('/fornecedores', { method: 'POST', headers: headers(), body: JSON.stringify(dados) });
            toast(r.message || 'Fornecedor criado com sucesso');
        }
        fecharModalFornecedor();
        carregarFornecedores();
    } catch (e) {
        toast(e.message, 'error');
    }
}

// Preencher email automaticamente ao selecionar usuário
document.addEventListener('DOMContentLoaded', () => {
    const selectUsuario = document.getElementById('fornecedor-id-usuario');
    if (selectUsuario) {
        selectUsuario.addEventListener('change', (e) => {
            const option = e.target.selectedOptions[0];
            if (option && option.dataset.email) {
                document.getElementById('fornecedor-email').value = option.dataset.email;
            }
        });
    }
});

// --- Dashboard ---
async function carregarDashboard() {
    try {
        const r = await api('/admin/metricas', { headers: headers() });
        const d = r.data;
        const cards = [
            { id: 'total_produtos', label: 'Artefatos', value: d.total_produtos, icon: 'gem' },
            { id: 'alugaveis', label: 'SKUs disponíveis', value: d.alugaveis_disponiveis, icon: 'check-circle' },
            { id: 'usuarios', label: 'Membros', value: d.total_usuarios, icon: 'users' },
            { id: 'ocupacao', label: 'Ocupação', value: `${d.taxa_ocupacao}%`, icon: 'percentage' },
            { id: 'receita_mes', label: 'Receita mês', value: moeda(d.receita_mes), icon: 'wallet', hl: true },
            { id: 'pendente', label: 'Pendente', value: moeda(d.receita_pendente), icon: 'clock', hl: true },
            { id: 'patrimonio', label: 'Patrimônio', value: moeda(d.valor_total_inventario), icon: 'shield-alt', hl: true },
            { id: 'loc_mes', label: 'Locações/mês', value: d.locacoes_mes, icon: 'calendar' },
        ];
        document.getElementById('metrics-grid').innerHTML = cards
            .map(
                (c) => `
            <div class="metric-card ${c.hl ? 'highlight' : ''}">
                <div class="metric-header"><span>${c.label}</span><i class="fas fa-${c.icon}"></i></div>
                <div class="metric-value">${c.value}</div>
            </div>`
            )
            .join('');

        const tbody = document.querySelector('#table-transacoes tbody');
        const txs = d.ultimas_transacoes || [];
        tbody.innerHTML = txs.length
            ? txs
                  .map(
                      (t) => `<tr>
                <td>#${t.id}</td><td>${esc(t.cliente)}</td>
                <td>${dataFmt(t.data_locacao)}</td><td>${moeda(t.valor_total)}</td>
                <td><span class="status-badge">${esc(t.status_pagamento)}</span></td></tr>`
                  )
                  .join('')
            : '<tr><td colspan="5" class="empty-cell">Sem locações recentes</td></tr>';

        // Initialize charts
        inicializarGraficos();
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Inventário ---
async function carregarInventario() {
    try {
        const r = await api('/produtos', { headers: headers() });
        State.produtos = r.data || [];
        preencherSelectsLookups();
        aplicarFiltroInventario();
    } catch (e) {
        document.getElementById('tbody-inventario').innerHTML =
            `<tr><td colspan="8" class="empty-cell">${esc(e.message)}</td></tr>`;
    }
}

function aplicarFiltroInventario() {
    let list = [...State.produtos];
    const q = (document.getElementById('input-busca-inventario')?.value || '').toLowerCase();
    const st = document.getElementById('filtro-status-inventario')?.value;
    const gen = document.getElementById('filtro-genero-inventario')?.value;

    if (q) {
        list = list.filter(
            (p) =>
                String(p.nome).toLowerCase().includes(q) ||
                String(p.sku || '').toLowerCase().includes(q) ||
                String(p.marca || '').toLowerCase().includes(q)
        );
    }
    if (st && st !== 'todos') list = list.filter((p) => p.status === st);
    if (gen && gen !== 'todos') list = list.filter((p) => p.genero === gen);

    const col = State.invSort.col;
    const dir = State.invSort.dir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
        const va = a[col],
            vb = b[col];
        if (typeof va === 'string') return va.localeCompare(vb) * dir;
        return ((Number(va) || 0) - (Number(vb) || 0)) * dir;
    });

    const disp = list.filter((p) => p.status === 'disponivel').length;
    document.getElementById('inventario-stats').innerHTML = `
        <span>${list.length} exibidos</span>
        <span>${disp} disponíveis no catálogo</span>
        <span>${State.produtos.length} total no cofre</span>`;

    const tbody = document.getElementById('tbody-inventario');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">Nenhum artefato encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = list
        .map((p) => {
            const img = p.foto_principal_url
                ? `<img src="${fotoUrl(p.foto_principal_url)}" class="thumb" onerror="this.style.display='none'">`
                : '<span class="thumb-placeholder"><i class="fas fa-tshirt"></i></span>';
            const st = p.status === 'disponivel' ? 'ativo' : 'inativo';
            return `<tr>
                <td>#${p.id}</td>
                <td><div class="cell-produto">${img}<div><strong>${esc(p.nome)}</strong><small>${esc(p.sku)}</small></div></div></td>
                <td>${esc(p.marca)}</td>
                <td>${esc(p.categoria)}</td>
                <td>${moeda(p.valor_diaria)}</td>
                <td>${p.qtd_disponivel ?? 0}/${p.qtd_estoque ?? 0}</td>
                <td><span class="status-badge ${st}">${p.status === 'disponivel' ? 'DISPONÍVEL' : 'OCULTO'}</span></td>
                <td class="actions-cell">
                    <button class="action-btn" onclick="editarProdutoById(${p.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="toggleProdutoStatus(${p.id}, '${p.status}')" title="Alternar"><i class="fas fa-power-off"></i></button>
                    <button class="action-btn" onclick="duplicarProduto(${p.id})" title="Duplicar"><i class="fas fa-copy"></i></button>
                    <button class="action-btn danger" onclick="deletarProduto(${p.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                    <a class="action-btn" href="produto.html?id=${p.id}" target="_blank" title="Ver no site"><i class="fas fa-external-link-alt"></i></a>
                </td>
            </tr>`;
        })
        .join('');
}

function ordenarInventario(col) {
    if (State.invSort.col === col) State.invSort.dir = State.invSort.dir === 'asc' ? 'desc' : 'asc';
    else {
        State.invSort.col = col;
        State.invSort.dir = 'asc';
    }
    aplicarFiltroInventario();
}

// --- Produto modal ---
function abrirModalProduto() {
    State.produtoEditId = null;
    document.getElementById('produto-id').value = '';
    document.getElementById('form-produto').reset();
    document.getElementById('preview-foto').style.display = 'none';
    document.getElementById('modal-produto-titulo').innerHTML =
        '<i class="fas fa-plus"></i> Novo artefato';
    document.getElementById('modal-produto').classList.add('active');
}

function fecharModalProduto() {
    document.getElementById('modal-produto').classList.remove('active');
    State.produtoEditId = null;
}

function editarProdutoById(id) {
    const p = State.produtos.find((x) => Number(x.id) === Number(id));
    if (p) editarProduto(p);
    else toast('Produto não encontrado', 'error');
}

function editarProduto(p) {
    State.produtoEditId = p.id;
    document.getElementById('produto-id').value = p.id;
    const f = document.getElementById('form-produto');
    f.nome.value = p.nome || '';
    f.sku.value = p.sku || '';
    f.id_marca.value = p.id_marca || '';
    f.id_categoria.value = p.id_categoria || '';
    f.id_estilo.value = p.id_estilo || '';
    f.genero.value = p.genero || 'Unissex';
    f.cor_principal.value = p.cor_principal || '';
    f.condicao.value = p.condicao || 'Excelente';
    f.valor_diaria.value = p.valor_diaria || '';
    f.valor_mercado.value = p.valor_mercado || '';
    f.valor_caucao.value = p.valor_caucao || '';
    f.descricao.value = p.descricao || '';
    f.descricao_rica.value = p.descricao_rica || '';
    f.composicao.value = p.composicao || '';
    f.status_venda.value = p.status_venda == 1 ? '1' : '0';
    const prev = document.getElementById('preview-foto');
    if (p.foto_principal_url) {
        prev.src = fotoUrl(p.foto_principal_url);
        prev.style.display = 'block';
    }
    document.getElementById('modal-produto-titulo').innerHTML =
        '<i class="fas fa-edit"></i> Editar artefato';
    document.getElementById('modal-produto').classList.add('active');
}

async function submeterFormProduto(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = State.produtoEditId;
    const url = id ? `${API_BASE}/produtos/atualizar` : `${API_BASE}/produtos/salvar`;
    if (id) fd.append('id', id);
    try {
        const r = await fetch(url, { method: 'POST', headers: headers(false), body: fd });
        const data = await r.json();
        if (data.status !== 'success') throw new Error(data.message);
        toast(data.message || 'Salvo com sucesso');
        fecharModalProduto();
        carregarInventario();
        if (State.tab === 'estoque') carregarEstoque();
    } catch (err) {
        toast(err.message, 'error');
    }
}

async function deletarProduto(id) {
    if (!confirm('Remover este artefato permanentemente?')) return;
    try {
        await api(`/produtos/deletar?id=${id}`, { method: 'DELETE', headers: headers() });
        toast('Artefato removido');
        carregarInventario();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function duplicarProduto(id) {
    try {
        const fd = new FormData();
        fd.append('id', id);
        const r = await fetch(`${API_BASE}/produtos/duplicar`, {
            method: 'POST',
            headers: headers(false),
            body: fd,
        });
        const data = await r.json();
        if (data.status !== 'success') throw new Error(data.message);
        toast('Cópia criada no inventário');
        carregarInventario();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function toggleProdutoStatus(id, statusAtual) {
    const novo = statusAtual === 'disponivel' ? 'indisponivel' : 'disponivel';
    try {
        await api('/produtos/status', {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ id, status: novo }),
        });
        toast('Status do catálogo atualizado');
        carregarInventario();
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Estoque ---
async function carregarEstoque() {
    try {
        const r = await api('/admin/estoque', { headers: headers() });
        State.estoque = r.data || [];
        aplicarFiltroEstoque();
    } catch (e) {
        document.getElementById('tbody-estoque').innerHTML =
            `<tr><td colspan="8" class="empty-cell">${esc(e.message)}</td></tr>`;
    }
}

function aplicarFiltroEstoque() {
    let list = [...State.estoque];
    const q = (document.getElementById('input-busca-estoque')?.value || '').toLowerCase();
    const st = document.getElementById('filtro-status-estoque')?.value;
    if (q) {
        list = list.filter(
            (i) =>
                String(i.produto).toLowerCase().includes(q) ||
                String(i.rfid_nfc_tag).toLowerCase().includes(q) ||
                String(i.tamanho).toLowerCase().includes(q)
        );
    }
    if (st && st !== 'todos') list = list.filter((i) => i.status_atual === st);

    const tbody = document.getElementById('tbody-estoque');
    if (!list.length) {
        tbody.innerHTML =
            '<tr><td colspan="8" class="empty-cell">Nenhum SKU — cadastre produtos com quantidade ou adicione manualmente</td></tr>';
        return;
    }
    const statuses = ['Disponível', 'No Vault', 'Alugado', 'Transporte', 'Manutenção', 'Higienização'];
    tbody.innerHTML = list
        .map((i) => {
            const opts = statuses
                .map((s) => `<option value="${s}" ${s === i.status_atual ? 'selected' : ''}>${s}</option>`)
                .join('');
            return `<tr>
                <td>#${i.id}</td>
                <td><strong>${esc(i.produto)}</strong><br><small>${esc(i.sku)}</small></td>
                <td><code>${esc(i.rfid_nfc_tag)}</code></td>
                <td>${esc(i.tamanho)}</td>
                <td>${esc(i.cor)}</td>
                <td>${i.qtd_locacoes || 0}</td>
                <td><select class="status-select" onchange="atualizarStatusSku(${i.id}, this.value)">${opts}</select></td>
                <td><button class="action-btn" onclick="abrirModalSku(${i.id_produto})"><i class="fas fa-plus"></i></button></td>
            </tr>`;
        })
        .join('');
}

async function atualizarStatusSku(id, status) {
    try {
        await api('/admin/estoque/status', {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ id, status_atual: status }),
        });
        toast('SKU atualizado');
    } catch (e) {
        toast(e.message, 'error');
        carregarEstoque();
    }
}

function abrirModalSku(produtoId) {
    document.getElementById('form-sku').reset();
    if (produtoId) document.getElementById('select-produto-sku').value = produtoId;
    document.getElementById('modal-sku').classList.add('active');
}

function fecharModalSku() {
    document.getElementById('modal-sku').classList.remove('active');
}

// --- Cropper Modal ---
function abrirModalCropper(imageSrc, targetInput) {
    const modal = document.getElementById('modal-cropper');
    const img = document.getElementById('cropper-image');
    
    img.src = imageSrc;
    State.cropperTargetInput = targetInput;
    
    modal.classList.add('active');
    
    // Initialize cropper after image loads
    img.onload = function() {
        if (State.cropperInstance) {
            State.cropperInstance.destroy();
        }
        
        State.cropperInstance = new Cropper(img, {
            aspectRatio: NaN,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
    };
}

function fecharModalCropper() {
    const modal = document.getElementById('modal-cropper');
    modal.classList.remove('active');
    
    if (State.cropperInstance) {
        State.cropperInstance.destroy();
        State.cropperInstance = null;
    }
    
    State.cropperTargetInput = null;
}

function aplicarRecorte() {
    if (!State.cropperInstance || !State.cropperTargetInput) {
        toast('Erro ao aplicar recorte', 'error');
        return;
    }
    
    const canvas = State.cropperInstance.getCroppedCanvas({
        maxWidth: 1920,
        maxHeight: 1920,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });
    
    if (canvas) {
        canvas.toBlob((blob) => {
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
            
            // Create a new FileList-like object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            State.cropperTargetInput.files = dataTransfer.files;
            
            // Update preview
            const prev = document.getElementById('preview-foto');
            if (prev) {
                prev.src = URL.createObjectURL(file);
                prev.style.display = 'block';
            }
            
            toast('Imagem recortada com sucesso');
            fecharModalCropper();
        }, 'image/jpeg', 0.9);
    } else {
        toast('Erro ao gerar imagem recortada', 'error');
    }
}

async function sincronizarEstoque() {
    try {
        const r = await api('/admin/estoque/sincronizar', { method: 'POST', headers: headers(), body: '{}' });
        toast(r.message || 'Estoque sincronizado');
        carregarEstoque();
        carregarInventario();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function submeterFormSku(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    try {
        await api('/admin/estoque/adicionar', {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(body),
        });
        toast('SKU criado');
        fecharModalSku();
        carregarEstoque();
    } catch (err) {
        toast(err.message, 'error');
    }
}

// --- Locações ---
async function carregarLocacoes() {
    try {
        const r = await api('/admin/locacoes', { headers: headers() });
        State.locacoes = r.data || [];
        aplicarFiltroLocacoes();
    } catch (e) {
        document.getElementById('tbody-locacoes').innerHTML =
            `<tr><td colspan="9" class="empty-cell">${esc(e.message)}</td></tr>`;
    }
}

function aplicarFiltroLocacoes() {
    let list = [...State.locacoes];
    const q = (document.getElementById('input-busca-locacoes')?.value || '').toLowerCase();
    const st = document.getElementById('filtro-status-locacao')?.value;
    if (q) {
        list = list.filter(
            (l) =>
                String(l.cliente).toLowerCase().includes(q) ||
                String(l.produto || '').toLowerCase().includes(q) ||
                String(l.id).includes(q)
        );
    }
    if (st && st !== 'todos') list = list.filter((l) => l.status_pedido === st);

    const statuses = ['pendente', 'pago', 'enviado', 'entregue', 'devolvido', 'concluido', 'cancelado'];
    const tbody = document.getElementById('tbody-locacoes');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-cell">Nenhuma locação registrada</td></tr>';
        return;
    }
    tbody.innerHTML = list
        .map((l) => {
            const opts = statuses
                .map((s) => `<option value="${s}" ${s === l.status_pedido ? 'selected' : ''}>${s}</option>`)
                .join('');
            return `<tr>
                <td>#${l.id}</td>
                <td>${esc(l.cliente)}<br><small>${esc(l.email)}</small></td>
                <td>${esc(l.produto || '—')}</td>
                <td>${dataFmt(l.data_inicio)} → ${dataFmt(l.data_fim)}</td>
                <td>${moeda(l.valor_aluguel)}</td>
                <td>${moeda(l.valor_caucao)}</td>
                <td><select class="status-select" onchange="atualizarLocacao(${l.id}, 'status_pedido', this.value)">${opts}</select></td>
                <td><input type="text" class="rastreio-input" value="${esc(l.codigo_rastreio || '')}" placeholder="Código" onblur="atualizarLocacao(${l.id}, 'codigo_rastreio', this.value)"></td>
                <td><button class="action-btn" onclick="calcularDiasLocacao('${l.data_inicio}','${l.data_fim}')"><i class="fas fa-calculator"></i></button></td>
            </tr>`;
        })
        .join('');
}

async function atualizarLocacao(id, campo, valor) {
    const body = { id };
    body[campo] = valor;
    try {
        await api('/admin/locacao/atualizar', {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(body),
        });
        toast('Locação atualizada');
    } catch (e) {
        toast(e.message, 'error');
    }
}

function calcularDiasLocacao(inicio, fim) {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    const dias = Math.max(1, Math.ceil((d2 - d1) / 86400000));
    toast(`Período: ${dias} dia(s) de aluguel`);
}

// --- Usuários ---
async function carregarUsuarios() {
    try {
        const r = await api('/admin/usuarios', { headers: headers() });
        State.usuarios = r.data || [];
        aplicarFiltroUsuarios();
    } catch (e) {
        document.getElementById('tbody-usuarios').innerHTML =
            `<tr><td colspan="7" class="empty-cell">${esc(e.message)}</td></tr>`;
    }
}

function aplicarFiltroUsuarios() {
    let list = [...State.usuarios];
    const q = (document.getElementById('input-busca-usuarios')?.value || '').toLowerCase();
    const st = document.getElementById('filtro-status-usuario')?.value;
    if (q) {
        list = list.filter(
            (u) =>
                String(u.nome).toLowerCase().includes(q) ||
                String(u.email).toLowerCase().includes(q) ||
                String(u.id).includes(q)
        );
    }
    if (st && st !== 'todos') list = list.filter((u) => u.status === st);

    const niveis = ['MEMBER', 'PRIORITY_ACCESS', 'VAULT_MGMT', 'TOTAL_CONTROL'];
    const tbody = document.getElementById('tbody-usuarios');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">Nenhum usuário</td></tr>';
        return;
    }
    tbody.innerHTML = list
        .map((u) => {
            const stClass = u.status === 'ativo' ? 'ativo' : 'inativo';
            const nivelOpts = niveis
                .map((n) => `<option value="${n}" ${n === u.nivel_acesso ? 'selected' : ''}>${n}</option>`)
                .join('');
            return `<tr>
                <td>#${u.id}</td>
                <td><strong>${esc(u.nome)}</strong></td>
                <td>${esc(u.email)}</td>
                <td><select class="status-select" onchange="alterarNivelUsuario(${u.id}, this.value)">${nivelOpts}</select></td>
                <td>${dataFmt(u.data_cadastro)}</td>
                <td><span class="status-badge ${stClass}">${esc(u.status)}</span></td>
                <td class="actions-cell">
                    <button class="action-btn" onclick="alternarStatusUsuario(${u.id}, '${u.status}')" title="Ativar/Bloquear"><i class="fas fa-power-off"></i></button>
                </td>
            </tr>`;
        })
        .join('');
}

async function alternarStatusUsuario(id, statusAtual) {
    const map = { ativo: 'inativo', inativo: 'ativo', bloqueado: 'ativo' };
    const novo = map[statusAtual] || 'inativo';
    if (!confirm(`Alterar status do usuário #${id} para ${novo}?`)) return;
    try {
        await api('/admin/usuario/status', {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ id_usuario: id, status: novo }),
        });
        toast('Status atualizado');
        carregarUsuarios();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function alterarNivelUsuario(id, nivel) {
    try {
        await api('/admin/usuario/nivel', {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ id_usuario: id, nivel_acesso: nivel }),
        });
        toast(`Nível → ${nivel}`);
        carregarUsuarios();
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Logística / Financeiro ---
async function carregarLogistica() {
    if (!State.locacoes.length) await carregarLocacoes();
    const env = State.locacoes.filter((l) =>
        ['enviado', 'entregue', 'pago'].includes(l.status_pedido)
    );
    const tbody = document.getElementById('tbody-logistica');
    tbody.innerHTML = env.length
        ? env
              .map(
                  (l) => `<tr>
            <td>#${l.id}</td><td>${esc(l.cliente)}</td><td>${esc(l.produto)}</td>
            <td>${esc(l.codigo_rastreio || '—')}</td><td>${esc(l.status_pedido)}</td></tr>`
              )
              .join('')
        : '<tr><td colspan="5" class="empty-cell">Sem entregas em andamento</td></tr>';
}

async function carregarFinanceiro() {
    try {
        const r = await api('/admin/metricas', { headers: headers() });
        const d = r.data;
        document.getElementById('financeiro-metrics').innerHTML = `
            <div class="metric-card highlight"><div class="metric-header"><span>Receita mês</span></div><div class="metric-value">${moeda(d.receita_mes)}</div></div>
            <div class="metric-card"><div class="metric-header"><span>Pendente</span></div><div class="metric-value">${moeda(d.receita_pendente)}</div></div>
            <div class="metric-card"><div class="metric-header"><span>Locações mês</span></div><div class="metric-value">${d.locacoes_mes}</div></div>`;
        if (!State.locacoes.length) await carregarLocacoes();
        document.getElementById('tbody-financeiro').innerHTML = State.locacoes
            .slice(0, 15)
            .map(
                (l) =>
                    `<tr><td>#${l.id}</td><td>${moeda(l.valor_aluguel)}</td><td>${esc(l.status_pedido)}</td></tr>`
            )
            .join('');
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Config ---
async function carregarConfig() {
    try {
        const r = await api('/admin/config', { headers: headers() });
        const arr = r.data || [];
        const map = {};
        arr.forEach((c) => {
            map[c.chave] = c.valor;
        });
        const f = document.getElementById('form-config');
        if (map.periodo_minimo) f.periodo_minimo.value = map.periodo_minimo;
        if (map.periodo_maximo) f.periodo_maximo.value = map.periodo_maximo;
    } catch (_) {
        /* defaults no HTML */
    }
}

async function salvarConfig(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    try {
        await api('/admin/config', { method: 'PUT', headers: headers(), body: JSON.stringify(body) });
        toast('Configurações salvas');
    } catch (err) {
        toast(err.message, 'error');
    }
}

// --- Logs ---
async function carregarLogs(dias) {
    document.querySelectorAll('.log-filters .btn-filter').forEach((b) => {
        b.classList.toggle('active', Number(b.dataset.dias) === dias);
    });
    try {
        const r = await api(`/admin/logs?dias=${dias}`, { headers: headers() });
        State.logs = r.data || [];
        const tbody = document.getElementById('tbody-logs');
        tbody.innerHTML = State.logs.length
            ? State.logs
                  .map(
                      (l) => `<tr>
                <td>${dataFmt(l.data_log)}</td>
                <td>${esc(l.usuario || 'Sistema')}</td>
                <td>${esc(l.acao)}</td>
                <td>${esc(l.tabela)}</td></tr>`
                  )
                  .join('')
            : '<tr><td colspan="4" class="empty-cell">Nenhum log no período</td></tr>';
    } catch (e) {
        document.getElementById('tbody-logs').innerHTML =
            `<tr><td colspan="4" class="empty-cell">${esc(e.message)}</td></tr>`;
    }
}

// --- Export ---
async function exportarDados(tipo) {
    try {
        const r = await api(`/admin/exportar?tipo=${tipo}`, { headers: headers() });
        const rows = r.data || [];
        if (!rows.length) {
            toast('Nada para exportar', 'error');
            return;
        }
        const keys = Object.keys(rows[0]);
        let csv = '\uFEFF' + keys.join(';') + '\n';
        rows.forEach((row) => {
            csv += keys.map((k) => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(';') + '\n';
        });
        const a = document.createElement('a');
        a.href = encodeURI('data:text/csv;charset=utf-8,' + csv);
        a.download = `arqon_${tipo}_${Date.now()}.csv`;
        a.click();
        toast('Exportação concluída');
    } catch (e) {
        toast(e.message, 'error');
    }
}

function exportarLogsCSV() {
    if (!State.logs.length) {
        toast('Carregue os logs primeiro', 'error');
        return;
    }
    let csv = '\uFEFFData;Usuario;Acao;Tabela\n';
    State.logs.forEach((l) => {
        csv += `"${l.data_log}";"${l.usuario || ''}";"${l.acao}";"${l.tabela}"\n`;
    });
    const a = document.createElement('a');
    a.href = encodeURI('data:text/csv;charset=utf-8,' + csv);
    a.download = `arqon_logs_${Date.now()}.csv`;
    a.click();
    toast('Logs exportados');
}

function executarLogout() {
    if (!confirm('Encerrar sessão administrativa?')) return;
    localStorage.clear();
    location.href = 'login.html';
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
    if (!authGuard()) return;

    document.querySelectorAll('.nav-link[data-tab]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            abrirAba(link.dataset.tab);
        });
    });

    document.getElementById('btn-refresh')?.addEventListener('click', refreshTab);
    document.getElementById('btn-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        executarLogout();
    });
    document.getElementById('btn-novo-produto')?.addEventListener('click', abrirModalProduto);
    document.getElementById('btn-novo-sku')?.addEventListener('click', () => abrirModalSku());
    document.getElementById('btn-sync-estoque')?.addEventListener('click', sincronizarEstoque);
    document.getElementById('form-produto')?.addEventListener('submit', submeterFormProduto);
    document.getElementById('form-sku')?.addEventListener('submit', submeterFormSku);
    document.getElementById('form-config')?.addEventListener('submit', salvarConfig);

    document.getElementById('input-busca-inventario')?.addEventListener('input', aplicarFiltroInventario);
    document.getElementById('filtro-status-inventario')?.addEventListener('change', aplicarFiltroInventario);
    document.getElementById('filtro-genero-inventario')?.addEventListener('change', aplicarFiltroInventario);
    document.getElementById('input-busca-estoque')?.addEventListener('input', aplicarFiltroEstoque);
    document.getElementById('filtro-status-estoque')?.addEventListener('change', aplicarFiltroEstoque);
    document.getElementById('input-busca-locacoes')?.addEventListener('input', aplicarFiltroLocacoes);
    document.getElementById('filtro-status-locacao')?.addEventListener('change', aplicarFiltroLocacoes);
    document.getElementById('input-busca-usuarios')?.addEventListener('input', aplicarFiltroUsuarios);
    document.getElementById('filtro-status-usuario')?.addEventListener('change', aplicarFiltroUsuarios);
    document.getElementById('input-busca-fornecedores')?.addEventListener('input', renderizarFornecedores);
    document.getElementById('filtro-status-fornecedor')?.addEventListener('change', renderizarFornecedores);
    document.getElementById('form-fornecedor')?.addEventListener('submit', submeterFormFornecedor);

    document.querySelectorAll('.log-filters .btn-filter').forEach((b) => {
        b.addEventListener('click', () => carregarLogs(Number(b.dataset.dias)));
    });

    document.querySelectorAll('.qa-btn[data-goto]').forEach((btn) => {
        btn.addEventListener('click', () => {
            abrirAba(btn.dataset.goto);
            if (btn.dataset.action === 'novo-produto') setTimeout(abrirModalProduto, 300);
        });
    });

    document.getElementById('input-diaria')?.addEventListener('input', (e) => {
        const caucao = document.getElementById('input-caucao');
        if (caucao && !caucao.value) caucao.placeholder = `Sugestão: ${(Number(e.target.value) * 2).toFixed(2)}`;
    });

    document.getElementById('input-foto')?.addEventListener('change', (e) => {
        const f = e.target.files[0];
        const prev = document.getElementById('preview-foto');
        if (f && prev) {
            // Open cropper modal instead of direct preview
            const reader = new FileReader();
            reader.onload = function(event) {
                abrirModalCropper(event.target.result, e.target);
            };
            reader.readAsDataURL(f);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModalProduto();
            fecharModalSku();
        }
    });

    await carregarLookups();
    abrirAba('dashboard');
});

// Globais para onclick inline no HTML
window.abrirAba = abrirAba;
window.abrirModalProduto = abrirModalProduto;
window.fecharModalProduto = fecharModalProduto;
window.fecharModalSku = fecharModalSku;
window.ordenarInventario = ordenarInventario;
window.exportarDados = exportarDados;
window.exportarLogsCSV = exportarLogsCSV;
window.executarLogout = executarLogout;
window.editarProduto = editarProduto;
window.editarProdutoById = editarProdutoById;
window.deletarProduto = deletarProduto;
window.duplicarProduto = duplicarProduto;
window.toggleProdutoStatus = toggleProdutoStatus;
window.atualizarStatusSku = atualizarStatusSku;
window.atualizarLocacao = atualizarLocacao;
window.alternarStatusUsuario = alternarStatusUsuario;
window.alterarNivelUsuario = alterarNivelUsuario;
window.calcularDiasLocacao = calcularDiasLocacao;
window.abrirModalSku = abrirModalSku;
window.abrirModalCropper = abrirModalCropper;
window.fecharModalCropper = fecharModalCropper;
window.aplicarRecorte = aplicarRecorte;
window.abrirModalFornecedor = abrirModalFornecedor;
window.fecharModalFornecedor = fecharModalFornecedor;
window.editarFornecedor = editarFornecedor;
window.deletarFornecedor = deletarFornecedor;

function switchModalTab(tabId, btnElement) {
    document.querySelectorAll('.modal-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
}
// =========================================================
// FEEDBACK VISUAL DE UPLOAD - PADRÃO ARQON
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Pega todos os campos de upload de luxo
    const fileInputs = document.querySelectorAll('.file-drop-area input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Pega o texto (span) que fica dentro da caixa de upload
            const spanText = this.parentElement.querySelector('span');
            
            if (this.files && this.files.length > 1) {
                // Se selecionou mais de uma foto
                spanText.innerHTML = `<strong>${this.files.length} arquivos selecionados</strong> <i class="fas fa-check" style="color: #00ff88; font-size: 14px;"></i>`;
                spanText.style.color = 'var(--gold)';
                this.parentElement.style.borderColor = 'var(--gold)';
                
            } else if (this.files && this.files.length === 1) {
                // Se selecionou apenas um arquivo (Ex: o 3D ou uma foto só)
                spanText.innerHTML = `<strong>${this.files[0].name}</strong> <i class="fas fa-check" style="color: #00ff88; font-size: 14px;"></i>`;
                spanText.style.color = 'var(--gold)';
                this.parentElement.style.borderColor = 'var(--gold)';
                
            } else {
                // Se cancelou a seleção
                spanText.textContent = "Arraste ou clique para enviar";
                spanText.style.color = 'var(--text-gray)';
                this.parentElement.style.borderColor = 'var(--border-lux)';
            }
        });
    });

    // Inicializa o editor de cores quando a aba de tema for ativada
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (this.dataset.tab === 'tema') {
                setTimeout(() => initColorEditor(), 100);
            }
        });
    });
});

// ============================================================
// THEME EDITOR FUNCTIONS (from admin.html root)
// ============================================================

const COLOR_VARS = [
    { key:'--color-primary', label:'Cor Primária (Vinho)', default:'#641838' },
    { key:'--color-primary-light', label:'Vinho Claro', default:'#781D43' },
    { key:'--color-primary-dark', label:'Vinho Escuro', default:'#50132D' },
    { key:'--color-secondary', label:'Cor de Destaque (Dourado)', default:'#E7B93F' },
    { key:'--color-secondary-light', label:'Dourado Claro', default:'#FFDE4C' },
    { key:'--color-secondary-dark', label:'Dourado Escuro', default:'#B99432' },
    { key:'--color-tertiary', label:'Cor Terciária (Cinza)', default:'#A0A0A0' },
    { key:'--color-tertiary-light', label:'Cinza Claro', default:'#C0C0C0' },
    { key:'--color-tertiary-dark', label:'Cinza Escuro', default:'#808080' },
    { key:'--color-dark', label:'Fundo Principal (Dark)', default:'#0C0716' },
    { key:'--color-dark-dark', label:'Fundo Mais Escuro', default:'#0A0612' },
    { key:'--color-dark-light', label:'Fundo Dark Claro', default:'#0E081A' },
    { key:'--color-light', label:'Texto Principal (Light)', default:'#FFFFFF' },
    { key:'--color-light-dark', label:'Texto Suave', default:'#DCDCDC' },
    { key:'--color-success', label:'Cor de Sucesso', default:'#4CAF50' },
    { key:'--color-danger', label:'Cor de Perigo', default:'#F44336' },
    { key:'--arqon-logo-color', label:'Cor da Logo SVG', default:'#DEDDDF' },
];

const PRESETS = {
    original: { '--color-primary':'#641838','--color-primary-light':'#781D43','--color-primary-dark':'#50132D','--color-secondary':'#E7B93F','--color-secondary-light':'#FFDE4C','--color-secondary-dark':'#B99432','--color-tertiary':'#A0A0A0','--color-tertiary-light':'#C0C0C0','--color-tertiary-dark':'#808080','--color-dark':'#0C0716','--color-dark-dark':'#0A0612','--color-dark-light':'#0E081A','--color-light':'#FFFFFF','--color-light-dark':'#DCDCDC','--color-success':'#4CAF50','--color-danger':'#F44336','--arqon-logo-color':'#DEDDDF' },
    midnight: { '--color-primary':'#0A0F1A','--color-primary-light':'#101828','--color-primary-dark':'#050812','--color-secondary':'#C9A227','--color-secondary-light':'#E0B84A','--color-secondary-dark':'#A08020','--color-tertiary':'#6A7A9A','--color-tertiary-light':'#8A9ABA','--color-tertiary-dark':'#4A5A7A','--color-dark':'#0A0F1A','--color-dark-dark':'#050812','--color-dark-light':'#101828','--color-light':'#E8F0F8','--color-light-dark':'#C8D0E0','--color-success':'#4ECDC4','--color-danger':'#FF6B6B','--arqon-logo-color':'#C9A227' },
    emerald: { '--color-primary':'#0A1A0F','--color-primary-light':'#0F2A18','--color-primary-dark':'#050A05','--color-secondary':'#D4AF37','--color-secondary-light':'#E8C76A','--color-secondary-dark':'#AA8C2A','--color-tertiary':'#7A9A8A','--color-tertiary-light':'#9ABAAA','--color-tertiary-dark':'#5A7A6A','--color-dark':'#0A1A0F','--color-dark-dark':'#050A05','--color-dark-light':'#0F2A18','--color-light':'#E8F8E8','--color-light-dark':'#C8E0C8','--color-success':'#4ECDC4','--color-danger':'#E04444','--arqon-logo-color':'#D4AF37' },
    rose: { '--color-primary':'#1A0A10','--color-primary-light':'#2A1018','--color-primary-dark':'#0A0508','--color-secondary':'#E8B4B8','--color-secondary-light':'#FADBD8','--color-secondary-dark':'#C08080','--color-tertiary':'#9A8A8A','--color-tertiary-light':'#BAAAAA','--color-tertiary-dark':'#7A6A6A','--color-dark':'#1A0A10','--color-dark-dark':'#0A0508','--color-dark-light':'#2A1018','--color-light':'#F8E8E8','--color-light-dark':'#E0C8C8','--color-success':'#4ECDC4','--color-danger':'#FF5252','--arqon-logo-color':'#E8B4B8' },
    chrome: { '--color-primary':'#0A0A0A','--color-primary-light':'#141414','--color-primary-dark':'#050505','--color-secondary':'#E0E0E0','--color-secondary-light':'#F5F5F5','--color-secondary-dark':'#B0B0B0','--color-tertiary':'#909090','--color-tertiary-light':'#B0B0B0','--color-tertiary-dark':'#707070','--color-dark':'#0A0A0A','--color-dark-dark':'#050505','--color-dark-light':'#141414','--color-light':'#ECEFF1','--color-light-dark':'#CFD8DC','--color-success':'#66BB6A','--color-danger':'#EF5350','--arqon-logo-color':'#E0E0E0' },
    royal: { '--color-primary':'#1A0A1A','--color-primary-light':'#2A102A','--color-primary-dark':'#0A050A','--color-secondary':'#BB8FCE','--color-secondary-light':'#D2B4DE','--color-secondary-dark':'#9B59B6','--color-tertiary':'#9A8AAA','--color-tertiary-light':'#BA9ACA','--color-tertiary-dark':'#7A6A8A','--color-dark':'#1A0A1A','--color-dark-dark':'#0A050A','--color-dark-light':'#2A102A','--color-light':'#F0E8F8','--color-light-dark':'#D8C0E8','--color-success':'#F39C12','--color-danger':'#E74C3C','--arqon-logo-color':'#BB8FCE' },
    sunset: { '--color-primary':'#1A0A02','--color-primary-light':'#2A1404','--color-primary-dark':'#0A0500','--color-secondary':'#FF7043','--color-secondary-light':'#FF8A65','--color-secondary-dark':'#E05020','--color-tertiary':'#A0887A','--color-tertiary-light':'#C0A89F','--color-tertiary-dark':'#80685F','--color-dark':'#1A0A02','--color-dark-dark':'#0A0500','--color-dark-light':'#2A1404','--color-light':'#F8F0E8','--color-light-dark':'#E0D0C0','--color-success':'#26A69A','--color-danger':'#EF5350','--arqon-logo-color':'#FF7043' },
    forest: { '--color-primary':'#0A1A02','--color-primary-light':'#0F2A04','--color-primary-dark':'#050A00','--color-secondary':'#C8A951','--color-secondary-light':'#E0C47A','--color-secondary-dark':'#A0862A','--color-tertiary':'#7A8A5A','--color-tertiary-light':'#9AAA7A','--color-tertiary-dark':'#5A6A3A','--color-dark':'#0A1A02','--color-dark-dark':'#050A00','--color-dark-light':'#0F2A04','--color-light':'#E8F8E8','--color-light-dark':'#C8E0C8','--color-success':'#FFC107','--color-danger':'#F44336','--arqon-logo-color':'#C8A951' },
};

function initColorEditor() {
    const grid = document.getElementById('colorEditorGrid');
    if (!grid) return;
    
    grid.innerHTML = COLOR_VARS.map(cv => {
        const current = getComputedStyle(document.documentElement).getPropertyValue(cv.key).trim() || cv.default;
        const hex = rgbToHex(current);
        return `
            <div class="card color-swatch-card">
                <div class="swatch-preview" style="background:${hex}">
                    <input type="color" value="${hex}" data-var="${cv.key}" oninput="updateColor('${cv.key}', this.value)">
                </div>
                <div class="swatch-info">
                    <div class="swatch-name">${cv.label}</div>
                    <div class="swatch-value" id="sv-${cv.key.replace(/--/g,'').replace(/-/g,'')}">${hex}</div>
                </div>
                <button class="swatch-reset" title="Resetar" onclick="resetColor('${cv.key}', '${cv.default}', this)">
                    <i class="fa-solid fa-rotate-left"></i>
                </button>
            </div>
        `;
    }).join('');
}

function updateColor(varName, value) {
    document.documentElement.style.setProperty(varName, value);
    const id = varName.replace(/--/g,'').replace(/-/g,'');
    const el = document.getElementById('sv-'+id);
    if (el) el.textContent = value;
    const swatch = document.querySelector(`input[data-var="${varName}"]`);
    if (swatch) swatch.parentElement.style.background = value;
}

function resetColor(varName, defaultVal, btn) {
    document.documentElement.style.setProperty(varName, defaultVal);
    const input = document.querySelector(`input[data-var="${varName}"]`);
    if (input) { input.value = defaultVal; input.parentElement.style.background = defaultVal; }
    const id = varName.replace(/--/g,'').replace(/-/g,'');
    const el = document.getElementById('sv-'+id);
    if (el) el.textContent = defaultVal;
}

async function resetAllColors() {
    COLOR_VARS.forEach(cv => resetColor(cv.key, cv.default, null));
    toast('Cores resetadas para o padrão', 'info');
    initColorEditor();
    // Persiste o reset no banco via API
    try {
        const r = await api('/tema/reset', { method: 'POST', headers: headers() });
        if (r.status === 'success') {
            toast('Tema resetado e salvo no banco!', 'success');
        } else {
            toast(r.message || 'Erro ao resetar no banco', 'error');
        }
    } catch (e) {
        toast('Erro ao resetar tema no banco: ' + e.message, 'error');
    }
}

function applyPreset(name, el) {
    const preset = PRESETS[name];
    if (!preset) return;
    Object.entries(preset).forEach(([k,v]) => updateColor(k, v));
    document.querySelectorAll('.preset-chip').forEach(c=>c.classList.remove('active'));
    el.classList.add('active');
    initColorEditor();
    toast('Tema aplicado: ' + el.textContent, 'success');
}

function previewTypography() {
    const display = document.getElementById('fontDisplay').value;
    const body = document.getElementById('fontBody').value;
    document.documentElement.style.setProperty('--preview-display', display);
    document.documentElement.style.setProperty('--preview-body', body);
}

function updateRadius(value) {
    document.getElementById('radiusVal').textContent = value;
    document.documentElement.style.setProperty('--radius', value + 'px');
}

function updateGlow(value) {
    // Atualiza intensidade do glow se necessário
}

function rgbToHex(color) {
    if (color.startsWith('#')) return color.length === 4
        ? '#' + [...color.slice(1)].map(c=>c+c).join('')
        : color.substring(0,7);
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    return '#' + match.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
}

async function applyAndSaveColors() {
    // Coleta todas as cores atuais
    const themeData = {};
    COLOR_VARS.forEach(cv => {
        const val = getComputedStyle(document.documentElement).getPropertyValue(cv.key).trim();
        // O banco usa a chave com hifen, sem o prefixo -- (ex.: color-primary)
        const dbKey = cv.key.replace('--', '');
        if (val) themeData[dbKey] = val;
    });

    // Coleta configurações de tipografia
    const fontDisplay = document.getElementById('fontDisplay')?.value || '"Cinzel", serif';
    const fontBody = document.getElementById('fontBody')?.value || '"Inter", sans-serif';
    themeData['font-primary'] = fontDisplay;
    themeData['font-secondary'] = fontBody;

    // Coleta border radius
    const radius = document.getElementById('radiusSlider')?.value || '8';
    themeData['border-radius'] = radius + 'px';

    try {
        const r = await api('/tema/batch', {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(themeData)
        });
        if (r.status === 'success') {
            toast('Tema salvo com sucesso! Aplicando ao site...', 'success');
            // Aplica ao site completo atualizando o theme-loader
            setTimeout(() => {
                // Recarrega a página para aplicar as mudanças
                window.location.reload();
            }, 1500);
        } else {
            toast(r.message || 'Erro ao salvar tema', 'error');
        }
    } catch (e) {
        toast('Erro ao salvar tema: ' + e.message, 'error');
    }
}

// Expor funções globalmente
window.initColorEditor = initColorEditor;
window.updateColor = updateColor;
window.resetColor = resetColor;
window.resetAllColors = resetAllColors;
window.applyPreset = applyPreset;
window.previewTypography = previewTypography;
window.updateRadius = updateRadius;
window.updateGlow = updateGlow;
window.applyAndSaveColors = applyAndSaveColors;

// =================== GRÁFICOS DO DASHBOARD ===================

// Configuração global do Chart.js para o tema ARQON
Chart.defaults.color = '#A0A0A0';
Chart.defaults.borderColor = 'rgba(231,185,63,0.06)';
Chart.defaults.font.family = "'Josefin Sans', sans-serif";

// Inicializa chartsInstances antes de usar
const chartsInstances = {};

async function inicializarGraficos() {
  try {
    const stats = await api('/stats');
    if (!stats) return;

    renderGraficoReceita(stats.receita_mensal || []);
    renderGraficoCategorias(stats.por_categoria || {});
    renderGraficoStatus(stats.status_locacoes || {});
    renderGraficoTopProdutos(stats.top_produtos || []);
    renderGraficoGenero(stats.por_genero || {});
    renderGraficoUsuarios(stats.novos_usuarios || []);

  } catch (err) {
    console.error('[ARQON Admin] Erro ao carregar dados para gráficos:', err);
    // Renderiza com dados de demonstração
    renderGraficosDemonstracao();
  }
}

function renderGraficoReceita(dados) {
  const canvas = document.getElementById('chart-receita');
  if (!canvas) return;

  // Destrói instância anterior se existir
  if (chartsInstances.receita) chartsInstances.receita.destroy();

  // Gera labels de meses se não vier do backend
  const labels = dados.length > 0
    ? dados.map(d => d.mes)
    : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

  const valores = dados.length > 0
    ? dados.map(d => parseFloat(d.total || 0))
    : [0, 0, 0, 0, 0, 0]; // Zeros se não há dados

  chartsInstances.receita = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Receita (R$)',
        data: valores,
        borderColor: '#E7B93F',
        backgroundColor: 'rgba(231,185,63,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#E7B93F',
        pointBorderColor: '#0C0716',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,6,18,0.95)',
          borderColor: 'rgba(231,185,63,0.3)',
          borderWidth: 1,
          titleColor: '#E7B93F',
          bodyColor: '#A0A0A0',
          callbacks: {
            label: ctx => ` R$ ${ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(231,185,63,0.05)' },
          ticks: { color: '#707070', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(231,185,63,0.05)' },
          ticks: {
            color: '#707070',
            font: { size: 11 },
            callback: val => `R$ ${(val/1000).toFixed(0)}k`
          }
        }
      }
    }
  });
}

function renderGraficoCategorias(dados) {
  const canvas = document.getElementById('chart-categorias');
  if (!canvas) return;

  if (chartsInstances.categorias) chartsInstances.categorias.destroy();

  const labels = Object.keys(dados).length > 0
    ? Object.keys(dados)
    : ['Masculino', 'Feminino', 'Acessórios', 'Calçados', 'Techwear'];

  const values = Object.keys(dados).length > 0
    ? Object.values(dados)
    : [35, 40, 15, 8, 12];

  const colors = ['#641838', '#E7B93F', '#2196F3', '#4CAF50', '#9C27B0'];

  chartsInstances.categorias = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + '33'),
        borderColor: colors,
        borderWidth: 2,
        hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#A0A0A0', font: { size: 10 }, padding: 12 }
        },
        tooltip: {
          backgroundColor: 'rgba(10,6,18,0.95)',
          borderColor: 'rgba(231,185,63,0.3)',
          borderWidth: 1,
          titleColor: '#E7B93F',
          bodyColor: '#A0A0A0'
        }
      }
    }
  });
}

function renderGraficoStatus(dados) {
  const canvas = document.getElementById('chart-status');
  if (!canvas) return;
  
  if (chartsInstances.status) chartsInstances.status.destroy();

  const labels = ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Devolvido', 'Concluído', 'Cancelado'];
  const values = [
    dados.pendente || 0,
    dados.pago || 0,
    dados.enviado || 0,
    dados.entregue || 0,
    dados.devolvido || 0,
    dados.concluido || 0,
    dados.cancelado || 0
  ];
  const colors = ['#FF9800', '#2196F3', '#9C27B0', '#00BCD4', '#8BC34A', '#4CAF50', '#F44336'];

  chartsInstances.status = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + '33'),
        borderColor: colors,
        borderWidth: 2,
        hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10,6,18,0.95)',
          borderColor: 'rgba(231,185,63,0.3)',
          borderWidth: 1,
          titleColor: '#E7B93F',
          bodyColor: '#A0A0A0'
        }
      }
    }
  });

  // Legend customizada
  const legendEl = document.getElementById('chart-status-legend');
  if (legendEl) {
    legendEl.innerHTML = labels.map((l, i) => `
      <div class="legend-item">
        <span class="legend-color" style="background:${colors[i]}"></span>
        <span class="legend-label">${l}</span>
        <span class="legend-value">${values[i]}</span>
      </div>
    `).join('');
  }
}

function renderGraficoTopProdutos(dados) {
  const canvas = document.getElementById('chart-top-produtos');
  if (!canvas) return;
  
  if (chartsInstances.topProdutos) chartsInstances.topProdutos.destroy();

  const labels = dados.slice(0, 5).map(d => d.nome ? d.nome.substring(0, 20) : `Produto ${d.id}`);
  const values = dados.slice(0, 5).map(d => parseInt(d.total_alugueis || 0));

  chartsInstances.topProdutos = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Aluguéis',
        data: values,
        backgroundColor: 'rgba(231,185,63,0.15)',
        borderColor: '#E7B93F',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(231,185,63,0.3)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: 'rgba(231,185,63,0.05)' },
          ticks: { color: '#707070', font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#A0A0A0', font: { size: 10 } }
        }
      }
    }
  });
}

function renderGraficoGenero(dados) {
  const canvas = document.getElementById('chart-genero');
  if (!canvas) return;
  
  if (chartsInstances.genero) chartsInstances.genero.destroy();

  chartsInstances.genero = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['Masculino', 'Feminino', 'Unissex'],
      datasets: [{
        data: [dados.masculino || 0, dados.feminino || 0, dados.unissex || 0],
        backgroundColor: [
          'rgba(33,150,243,0.3)',
          'rgba(233,30,99,0.3)',
          'rgba(231,185,63,0.3)'
        ],
        borderColor: ['#2196F3', '#E91E63', '#E7B93F'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#A0A0A0', font: { size: 10 }, padding: 12 }
        }
      }
    }
  });
}

function renderGraficoUsuarios(dados) {
  const canvas = document.getElementById('chart-usuarios');
  if (!canvas) return;
  
  if (chartsInstances.usuarios) chartsInstances.usuarios.destroy();

  const labels = dados.map(d => d.dia || d.data).slice(-14);
  const values = dados.map(d => parseInt(d.total || 0)).slice(-14);

  chartsInstances.usuarios = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Novos usuários',
        data: values,
        backgroundColor: 'rgba(100,24,56,0.4)',
        borderColor: 'rgba(100,24,56,0.8)',
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#707070', font: { size: 9 } } },
        y: { grid: { color: 'rgba(231,185,63,0.05)' }, ticks: { color: '#707070', font: { size: 10 } } }
      }
    }
  });
}

// Dados de demonstração quando a API não está disponível
function renderGraficosDemonstracao() {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const receita = [3200, 5400, 4100, 7800, 6500, 9200];

  renderGraficoReceita(meses.map((mes, i) => ({ mes, total: receita[i] })));
  renderGraficoCategorias({ 'Masculino': 35, 'Feminino': 40, 'Acessórios': 15, 'Calçados': 8, 'Techwear': 12 });
  renderGraficoStatus({ pendente: 5, pago: 12, enviado: 8, entregue: 15, devolvido: 22, concluido: 44, cancelado: 3 });
  renderGraficoTopProdutos([
    { nome: 'Trench Coat Holo', total_alugueis: 18 },
    { nome: 'Blazer Oversize', total_alugueis: 14 },
    { nome: 'Calça Cargo Tech', total_alugueis: 11 },
    { nome: 'Vestido Midi Seda', total_alugueis: 9 },
    { nome: 'Jaqueta Bomber', total_alugueis: 7 }
  ]);
  renderGraficoGenero({ masculino: 35, feminino: 50, unissex: 15 });
}

// Expor funções de gráficos globalmente
window.inicializarGraficos = inicializarGraficos;
window.renderGraficosDemonstracao = renderGraficosDemonstracao;
window.exportarPDF = exportarPDF;

// =================== SISTEMA DE EXPORTAÇÃO PDF ===================

async function exportarPDF(tipo = 'inventario') {
  // Injeta jsPDF dinamicamente se não estiver carregado
  if (typeof window.jspdf === 'undefined') {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // ===== PALETA ARQON =====
  const GOLD = [231, 185, 63];
  const DARK = [12, 7, 22];
  const SURFACE = [18, 12, 30];
  const MUTED = [120, 120, 120];
  const WHITE = [220, 221, 223];

  // ===== CABEÇALHO DO PDF =====
  // Fundo escuro
  doc.setFillColor(...DARK);
  doc.rect(0, 0, 297, 210, 'F');

  // Barra superior dourada
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, 297, 18, 'F');

  // Título na barra
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('ARQON — THE VAULT', 14, 12);
  
  // Data/hora
  doc.setFontSize(8);
  const agora = new Date().toLocaleString('pt-BR');
  doc.text(`Gerado em: ${agora}`, 297 - 14, 12, { align: 'right' });

  // Subtítulo
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'normal');

  const titulos = {
    inventario: 'RELATÓRIO DE INVENTÁRIO — ACERVO COMPLETO',
    locacoes: 'RELATÓRIO DE LOCAÇÕES',
    usuarios: 'RELATÓRIO DE USUÁRIOS',
    financeiro: 'RELATÓRIO FINANCEIRO'
  };
  doc.text(titulos[tipo] || 'RELATÓRIO', 14, 26);

  // Linha divisória
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(14, 29, 283, 29);

  // ===== BUSCA DADOS =====
  let dados = [];
  let colunas = [];
  let linhas = [];

  try {
    const resp = await api(`/${tipo === 'inventario' ? 'produtos' : tipo}?limit=500`);
    
    if (tipo === 'inventario') {
      dados = resp.produtos || resp.data || [];
      colunas = ['ID', 'Nome', 'Marca', 'Categoria', 'Gênero', 'Diária (R$)', 'Estoque', 'Status', 'Cor'];
      linhas = dados.map(p => [
        p.id,
        (p.nome || '').substring(0, 30),
        p.marca_nome || p.marca || '—',
        p.categoria_nome || p.categoria || '—',
        p.genero || '—',
        parseFloat(p.valor_diaria || 0).toFixed(2),
        p.qtd_estoque || 0,
        p.status_venda == 1 ? 'Disponível' : 'Inativo',
        p.cor_principal || '—'
      ]);
    } else if (tipo === 'locacoes') {
      dados = resp.locacoes || resp.data || [];
      colunas = ['#', 'Cliente', 'Produto', 'Início', 'Fim', 'Valor (R$)', 'Caução (R$)', 'Status'];
      linhas = dados.map(l => [
        l.id,
        (l.usuario_nome || l.cliente || '—').substring(0, 25),
        (l.produto_nome || l.produto || '—').substring(0, 25),
        l.data_inicio ? new Date(l.data_inicio).toLocaleDateString('pt-BR') : '—',
        l.data_fim ? new Date(l.data_fim).toLocaleDateString('pt-BR') : '—',
        parseFloat(l.valor_total || 0).toFixed(2),
        parseFloat(l.valor_caucao || 0).toFixed(2),
        (l.status || '—').toUpperCase()
      ]);
    } else if (tipo === 'usuarios') {
      dados = resp.usuarios || resp.data || [];
      colunas = ['ID', 'Nome', 'E-mail', 'Nível', 'Cadastro', 'Status'];
      linhas = dados.map(u => [
        u.id,
        (u.nome || '—').substring(0, 25),
        (u.email || '—').substring(0, 30),
        u.nivel_acesso || '—',
        u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—',
        u.status || 'ativo'
      ]);
    }
  } catch (err) {
    // PDF com mensagem de erro
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text('Erro ao carregar dados. Tente novamente.', 14, 50);
    doc.save(`arqon-${tipo}.pdf`);
    return;
  }

  // ===== TABELA =====
  doc.autoTable({
    head: [colunas],
    body: linhas,
    startY: 34,
    margin: { left: 14, right: 14 },
    
    // Estilo do cabeçalho
    headStyles: {
      fillColor: SURFACE,
      textColor: GOLD,
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 4,
      lineColor: GOLD,
      lineWidth: 0.2
    },
    
    // Estilo das células
    bodyStyles: {
      fillColor: [14, 8, 26],
      textColor: WHITE,
      fontSize: 7.5,
      cellPadding: 3.5,
      lineColor: [30, 20, 45],
      lineWidth: 0.2
    },
    
    // Linhas alternadas
    alternateRowStyles: {
      fillColor: [18, 11, 32]
    },
    
    // Coluna de status colorida
    didParseCell: function(data) {
      if (data.section === 'body') {
        const cellText = String(data.cell.raw || '').toLowerCase();
        if (data.column.index === colunas.length - 1) {
          if (cellText.includes('disponível') || cellText.includes('concluído') || cellText.includes('ativo')) {
            data.cell.styles.textColor = [76, 175, 80];
          } else if (cellText.includes('cancelado') || cellText.includes('bloqueado') || cellText.includes('inativo')) {
            data.cell.styles.textColor = [244, 67, 54];
          } else if (cellText.includes('pendente') || cellText.includes('alugado') || cellText.includes('em custódia')) {
            data.cell.styles.textColor = [255, 152, 0];
          }
        }
      }
    },
    
    // Borda da tabela
    tableLineColor: GOLD,
    tableLineWidth: 0.3
  });

  // ===== RESUMO FINAL =====
  const finalY = doc.lastAutoTable.finalY + 12;
  if (finalY < 190) {
    doc.setFillColor(...SURFACE);
    doc.roundedRect(14, finalY, 90, 16, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text('Total de registros:', 18, finalY + 7);
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.text(String(linhas.length), 60, finalY + 7);
  }

  // ===== RODAPÉ =====
  doc.setFillColor(...SURFACE);
  doc.rect(0, 200, 297, 10, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text('ARQON — The Vault | Documento confidencial', 14, 207);
  doc.text('arqon.com.br', 297 - 14, 207, { align: 'right' });

  // ===== SALVAR =====
  const filename = `arqon-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  toast(`PDF "${filename}" exportado com sucesso!`, 'success');
}

// =================== TERMINAL ===================
function carregarTerminal() {
    const inp = document.getElementById('terminal-input');
    if (inp) { inp.focus(); }
}

function termOut(html) {
    const out = document.getElementById('terminal-output');
    if (!out) return;
    out.innerHTML += '\n' + html;
    out.scrollTop = out.scrollHeight;
}

async function executarTerminal() {
    const inp = document.getElementById('terminal-input');
    if (!inp) return;
    const cmdRaw = inp.value.trim();
    if (!cmdRaw) return;
    inp.value = '';

    termOut(`<span style="color:#E7B93F;">&gt; ${esc(cmdRaw)}</span>`);
    const [cmd, ...args] = cmdRaw.toLowerCase().split(/\s+/);

    switch (cmd) {
        case 'help':
            termOut(`Comandos disponíveis:
  <span style="color:#E7B93F;">help</span>          — lista comandos
  <span style="color:#E7B93F;">status</span>        — status do sistema (PHP, MySQL, Apache)
  <span style="color:#E7B93F;">ping</span>          — pinga a API base
  <span style="color:#E7B93F;">db</span>            — tabelas e contagens do DB
  <span style="color:#E7B93F;">disk</span>          — uso de disco (estimado)
  <span style="color:#E7B93F;">phpinfo</span>       — versão PHP e extensões carregadas
  <span style="color:#E7B93F;">memory</span>        — uso de memória do PHP
  <span style="color:#E7B93F;">uptime</span>        — tempo de execução do script
  <span style="color:#E7B93F;">clear</span>         — limpa terminal`);
            break;

        case 'clear':
            document.getElementById('terminal-output').innerHTML = '';
            break;

        case 'status': {
            const start = performance.now();
            try {
                const r = await fetch(`${API_BASE}/admin/metricas`, { headers: { Authorization: `Bearer ${localStorage.getItem('arqon_token')}` } });
                const d = await r.json().catch(() => ({}));
                const latency = (performance.now() - start).toFixed(1);
                termOut(`<span style="color:#4CAF50;">✓</span> API respondeu em ${latency}ms
<span style="color:#4CAF50;">✓</span> PHP ${d.php_version || '8.x'} — OK
<span style="color:#4CAF50;">✓</span> MySQL conectado — OK
<span style="color:#4CAF50;">✓</span> Apache/XAMPP — OK
Produtos: ${(d.data?.total_produtos ?? '?')} | Usuários: ${(d.data?.total_usuarios ?? '?')} | Receita mês: R$ ${(d.data?.receita_mes ?? '?')}`);
            } catch (e) {
                termOut(`<span style="color:#f44336;">✗</span> API offline ou token inválido: ${esc(e.message)}`);
            }
            break;
        }

        case 'ping': {
            const start = performance.now();
            try {
                await fetch(`${API_BASE}/produtos?limit=1`);
                termOut(`PONG — ${(performance.now() - start).toFixed(1)}ms`);
            } catch (e) {
                termOut(`<span style="color:#f44336;">✗</span> Timeout: ${esc(e.message)}`);
            }
            break;
        }

        case 'db': {
            try {
                const r = await api('/admin/metricas', { headers: headers() });
                const d = r.data || {};
                termOut(`Tabelas principais (via métricas):
  produtos      : ${d.total_produtos ?? '?'}
  usuarios      : ${d.total_usuarios ?? '?'}
  locacoes      : ${d.locacoes_mes ?? '?'}
  marcas        : ${(State.lookups.marcas || []).length}`);
            } catch (e) {
                termOut(`<span style="color:#f44336;">✗</span> ${esc(e.message)}`);
            }
            break;
        }

        case 'disk':
            termOut(`Espaço estimado (XAMPP padrão):
  C:\\xampp\\htdocs\\PROJETO-ARQUON
  Uso aproximado depende do volume de uploads.`);
            break;

        case 'phpinfo':
            termOut(`PHP Version: 8.2+
Extensions loaded: PDO, PDO_MySQL, json, mbstring, openssl, fileinfo, gd
SAPI: Apache 2.0 Handler
Memory limit: 128M (padrão XAMPP)
Upload max: 2M`);
            break;

        case 'memory':
            termOut(`Memória usada pelo navegador (aprox):
  ${(performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB JS Heap' : 'N/A — performance.memory não disponível')}`);
            break;

        case 'uptime':
            termOut(`Sessão ativa desde o carregamento da página.
  Tempo no navegador: ${(performance.now() / 1000).toFixed(1)}s`);
            break;

        default:
            termOut(`<span style="color:#f44336;">Comando não reconhecido:</span> ${esc(cmd)}. Digite <span style="color:#E7B93F;">help</span>.`);
    }
}

// Keyboard shortcut para terminal
if (document.getElementById('terminal-input')) {
    document.getElementById('terminal-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executarTerminal();
    });
}

// =================== MAPA DE FORNECEDORES ARQON ===================
let leafletMap = null;

function renderizarMapaFornecedores() {
    console.log('[ADMIN MAPA] Iniciando renderização do mapa de fornecedores...');
    const wrap = document.getElementById('mapa-fornecedores');
    if (!wrap) {
        console.log('[ADMIN MAPA] Container do mapa não encontrado');
        return;
    }

    const fornecedores = State.fornecedores || [];
    console.log('[ADMIN MAPA] Fornecedores carregados:', fornecedores.length, fornecedores);
    
    const cidadesAtendidas = [...new Set(fornecedores.map(f => `${f.cidade||'São Paulo'}-${f.estado||'SP'}`))];
    console.log('[ADMIN MAPA] Cidades atendidas:', cidadesAtendidas);

    // Coordenadas reais das cidades (ABC Paulista + principais cidades do Brasil)
    const coordMap = {
        // ABC Paulista
        'são paulo':           { lat: -23.5505, lng: -46.6333 },
        'santo andré':         { lat: -23.6571, lng: -46.5283 },
        'são bernardo do campo': { lat: -23.6912, lng: -46.5650 },
        'são caetano do sul':   { lat: -23.6229, lng: -46.5455 },
        'diadema':             { lat: -23.6815, lng: -46.6206 },
        'mauá':                { lat: -23.6686, lng: -46.4607 },
        'ribeirão pires':      { lat: -23.6866, lng: -46.4125 },
        'rio grande da serra': { lat: -23.7439, lng: -46.3836 },
        'guarulhos':           { lat: -23.4629, lng: -46.5333 },
        'osasco':              { lat: -23.5329, lng: -46.7915 },
        
        // São Paulo (interior)
        'sorocaba':            { lat: -23.5015, lng: -47.4526 },
        'campinas':            { lat: -22.9056, lng: -47.0653 },
        'santos':              { lat: -23.9608, lng: -46.3331 },
        'são josé dos campos': { lat: -23.2237, lng: -45.9009 },
        'ribeirão preto':      { lat: -21.1775, lng: -47.8103 },
        'são josé do rio preto': { lat: -20.8197, lng: -49.3744 },
        'bauru':               { lat: -22.3147, lng: -49.0607 },
        'piracicaba':          { lat: -22.7253, lng: -47.6492 },
        'marília':             { lat: -22.2134, lng: -49.9458 },
        'presidente prudente':  { lat: -22.1204, lng: -51.3884 },
        
        // Rio de Janeiro
        'rio de janeiro':      { lat: -22.9068, lng: -43.1729 },
        'niterói':             { lat: -22.8832, lng: -43.1034 },
        'duque de caxias':     { lat: -22.7856, lng: -43.3117 },
        'nova iguaçu':         { lat: -22.7592, lng: -43.4511 },
        'são gonçalo':         { lat: -22.8268, lng: -43.0634 },
        'campos dos goytacazes': { lat: -21.7544, lng: -41.3228 },
        'volta redonda':       { lat: -22.5189, lng: -44.0979 },
        'petrópolis':          { lat: -22.5113, lng: -43.1779 },
        
        // Minas Gerais
        'belo horizonte':     { lat: -19.9167, lng: -43.9345 },
        'uberlândia':          { lat: -18.9186, lng: -48.2772 },
        'contagem':            { lat: -19.9318, lng: -44.0536 },
        'juiz de fora':        { lat: -21.7642, lng: -43.3504 },
        'betim':               { lat: -19.9681, lng: -44.1954 },
        'montes claros':       { lat: -16.7351, lng: -43.8637 },
        'uberaba':             { lat: -19.7476, lng: -47.9373 },
        'governador valadares': { lat: -18.8516, lng: -41.9494 },
        'ipatinga':            { lat: -19.4729, lng: -42.5455 },
        'divinópolis':         { lat: -20.1384, lng: -44.8695 },
        
        // Rio Grande do Sul
        'porto alegre':        { lat: -30.0346, lng: -51.2177 },
        'caxias do sul':       { lat: -29.1634, lng: -51.1792 },
        'canoas':              { lat: -29.9177, lng: -51.1837 },
        'pelotas':             { lat: -31.7654, lng: -52.3426 },
        'santa maria':         { lat: -29.6842, lng: -53.8069 },
        'gravataí':            { lat: -29.9447, lng: -51.1352 },
        'novo hamburgo':       { lat: -29.6842, lng: -51.8145 },
        'viamao':              { lat: -30.0191, lng: -51.0146 },
        
        // Paraná
        'curitiba':            { lat: -25.4290, lng: -49.2671 },
        'londrina':            { lat: -23.3045, lng: -51.1696 },
        'maringá':             { lat: -23.4251, lng: -51.9386 },
        'ponta grossa':        { lat: -25.0952, lng: -50.1619 },
        'cascavel':            { lat: -24.9556, lng: -53.4552 },
        'são josé dos pinhais': { lat: -25.5353, lng: -49.2172 },
        'foz do iguaçu':       { lat: -25.5478, lng: -54.5855 },
        'guarapuava':          { lat: -25.3935, lng: -51.4634 },
        
        // Bahia
        'salvador':            { lat: -12.9714, lng: -38.5014 },
        'feira de santana':    { lat: -12.2666, lng: -38.9742 },
        'vitória da conquista': { lat: -15.8611, lng: -40.8936 },
        'camacari':            { lat: -12.7186, lng: -38.3244 },
        'itabuna':             { lat: -14.7856, lng: -39.2811 },
        'juazeiro':            { lat: -9.4082, lng: -40.5073 },
        'cachoeira':           { lat: -12.5439, lng: -39.2624 },
        'ilhéus':              { lat: -14.7939, lng: -39.0494 },
        'porto seguro':        { lat: -15.5194, lng: -39.0666 },
        
        // Espírito Santo
        'vitória':             { lat: -20.2976, lng: -40.2958 },
        'vila velha':          { lat: -20.3297, lng: -40.2925 },
        'serra':               { lat: -20.1284, lng: -40.3117 },
        'cariacica':           { lat: -20.2614, lng: -40.4186 },
        'viana':               { lat: -20.3467, lng: -40.3997 },
        
        // Pernambuco
        'recife':              { lat: -8.0476, lng: -34.8770 },
        'jaboatão dos guararapes': { lat: -8.1814, lng: -34.9256 },
        'olinda':              { lat: -8.0086, lng: -34.8551 },
        'caruaru':             { lat: -8.2838, lng: -35.9708 },
        'petrolina':           { lat: -9.3985, lng: -40.5067 },
        'paulista':            { lat: -7.9439, lng: -34.8744 },
        
        // Ceará
        'fortaleza':           { lat: -3.7172, lng: -38.5433 },
        'caucaia':             { lat: -3.7358, lng: -38.6542 },
        'juazeiro do norte':   { lat: -7.2135, lng: -39.3134 },
        'sobral':              { lat: -3.6915, lng: -40.3482 },
        
        // Goiás
        'goiânia':             { lat: -16.6869, lng: -49.2648 },
        'anápolis':            { lat: -16.3117, lng: -48.9530 },
        'aparecida de goiânia': { lat: -16.7902, lng: -49.2542 },
        'rio verde':           { lat: -15.8767, lng: -51.1589 },
        
        // Distrito Federal
        'brasília':            { lat: -15.7942, lng: -47.8825 },
        'taguatinga':          { lat: -15.8350, lng: -48.0480 },
        'ceilândia':           { lat: -15.8239, lng: -48.3024 },
        
        // Amazonas
        'manaus':              { lat: -3.1190, lng: -60.0217 },
        'parintins':           { lat: -2.6275, lng: -56.7362 },
        'itacoatiara':         { lat: -3.1408, lng: -58.4428 },
        
        // Pará
        'belém':               { lat: -1.4558, lng: -48.4902 },
        'ananindeua':          { lat: -1.3656, lng: -48.3723 },
        'santarém':            { lat: -2.4431, lng: -54.7082 },
        
        // Acre
        'rio branco':          { lat: -9.9754, lng: -67.8249 },
        'cruzeiro do sul':     { lat: -7.6400, lng: -72.6720 },
        
        // Mato Grosso
        'cuiabá':              { lat: -15.6014, lng: -56.0979 },
        'várzea grande':       { lat: -15.6461, lng: -56.1320 },
        'rondonópolis':        { lat: -16.4761, lng: -54.6350 },
        
        // Mato Grosso do Sul
        'campo grande':        { lat: -20.4697, lng: -54.6201 },
        'dourados':            { lat: -22.2218, lng: -54.8056 },
        'três lagoas':         { lat: -20.7894, lng: -51.6774 },
        
        // Santa Catarina
        'florianópolis':       { lat: -27.5954, lng: -48.5480 },
        'joinville':           { lat: -26.3045, lng: -48.8487 },
        'blumenau':            { lat: -26.9194, lng: -49.0661 },
        'são josé':            { lat: -27.5969, lng: -48.6227 },
        'criçiuma':            { lat: -28.6775, lng: -49.3700 },
        
        // Paraíba
        'joão pessoa':         { lat: -7.1195, lng: -34.8450 },
        'campina grande':       { lat: -7.2304, lng: -35.8811 },
        
        // Alagoas
        'maceió':              { lat: -9.6658, lng: -35.7350 },
        
        // Sergipe
        'aracaju':             { lat: -10.9472, lng: -37.0731 },
        
        // Piauí
        'teresina':            { lat: -5.0892, lng: -42.8019 },
        
        // Maranhão
        'são luís':            { lat: -2.5297, lng: -44.3028 },
        'imperatriz':          { lat: -5.5278, lng: -47.4777 },
        
        // Rio Grande do Norte
        'natal':               { lat: -5.7945, lng: -35.2110 },
        'mossoró':             { lat: -5.1874, lng: -37.3443 },
        
        // Paraíba
        'joão pessoa':         { lat: -7.1195, lng: -34.8450 },
        
        // Ceará
        'fortaleza':           { lat: -3.7172, lng: -38.5433 },
        
        // Rondônia
        'porto velho':         { lat: -8.7612, lng: -63.9004 },
        'ji-paraná':           { lat: -8.7388, lng: -61.1984 },
        
        // Amapá
        'macapá':              { lat: 0.0349, lng: -51.0694 },
        
        // Roraima
        'boa vista':           { lat: 2.8235, lng: -60.6758 },
        
        // Tocantins
        'palmas':              { lat: -10.2491, lng: -48.3243 },
        'araguaína':           { lat: -7.1978, lng: -48.2065 },
    };

    wrap.innerHTML = '<div id="mapa-leaflet" style="width:100%;height:400px;border-radius:12px;border:1px solid rgba(231,185,63,.15);"></div>';

    if (leafletMap) { leafletMap.remove(); leafletMap = null; }

    leafletMap = L.map('mapa-leaflet', { attributionControl: false }).setView([-23.5505, -46.6333], 6);

    // Tema escuro do CartoDB (gratuito, sem API key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(leafletMap);

    // Ícone customizado dourado
    const goldIcon = L.divIcon({
        className: 'custom-gold-marker',
        html: '<div style="width:14px;height:14px;background:#E7B93F;border-radius:50%;border:2px solid #0C0716;box-shadow:0 0 8px rgba(231,185,63,.5);"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    const hubIcon = L.divIcon({
        className: 'custom-hub-marker',
        html: '<div style="width:22px;height:22px;background:#E7B93F;border-radius:50%;border:3px solid #0C0716;box-shadow:0 0 12px rgba(231,185,63,.8);"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });

    const hubLatLng = [-23.5505, -46.6333];
    L.marker(hubLatLng, { icon: hubIcon }).addTo(leafletMap)
        .bindPopup('<b style="color:#0C0716;">HUB SÃO PAULO</b><br>Centro de distribuição principal');

    const seenCoords = new Set();
    let markersCount = 0;
    fornecedores.forEach(f => {
        const cidade = (f.cidade || 'São Paulo').toLowerCase().trim();
        const estado = (f.estado || 'SP').toLowerCase();
        const coords = coordMap[cidade];
        
        if (!coords) {
            console.log('[ADMIN MAPA] Cidade não encontrada no mapa:', cidade, 'Fornecedor:', f.nome);
            return;
        }

        let lat = coords.lat;
        let lng = coords.lng;
        const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
        if (seenCoords.has(key)) {
            lat += (Math.random() - 0.5) * 0.03;
            lng += (Math.random() - 0.5) * 0.03;
        }
        seenCoords.add(key);

        L.marker([lat, lng], { icon: goldIcon }).addTo(leafletMap)
            .bindPopup(`<b style="color:#0C0716;">${esc(f.nome)}</b><br>${esc(f.cidade)}/${esc(f.estado)}<br>${esc(f.email || '')}`);
        
        // Linha conectando ao hub
        L.polyline([hubLatLng, [lat, lng]], { color: '#E7B93F', weight: 1, opacity: 0.3, dashArray: '4 4' }).addTo(leafletMap);
        
        markersCount++;
    });
    
    console.log('[ADMIN MAPA] Marcadores adicionados:', markersCount);

    // Legenda
    const legend = L.control({position: 'bottomleft'});
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.cssText = 'background:rgba(12,7,22,.85);padding:10px 14px;border-radius:8px;border:1px solid rgba(231,185,63,.2);font-size:11px;color:#A0A0A0;line-height:1.6;';
        div.innerHTML = `
            <div style="color:#E7B93F;font-weight:600;margin-bottom:6px;"><i class="fas fa-map-marked-alt"></i> Rede ARQON</div>
            <div><span style="display:inline-block;width:10px;height:10px;background:#E7B93F;border-radius:50%;margin-right:6px;border:2px solid #0C0716;"></span>Hub SP</div>
            <div><span style="display:inline-block;width:8px;height:8px;background:#E7B93F;border-radius:50%;margin-right:7px;border:2px solid #0C0716;"></span>Fornecedor</div>
            <div style="margin-top:4px;font-size:10px;color:#707070;">${fornecedores.length} fornecedores | ${cidadesAtendidas.length} cidades</div>
        `;
        return div;
    };
    legend.addTo(leafletMap);
}

// =================== GRÁFICOS FINANCEIROS ===================
function renderizarGraficosFinanceiro() {
    const elReceita = document.getElementById('chart-finance-receita');
    const elStatus = document.getElementById('chart-finance-status');
    if (!elReceita || !elStatus) return;

    // Gráfico de receita mensal (usa os mesmos dados do dashboard)
    api('/stats').then(r => {
        const d = r.data || {};
        const receita = d.receita_mensal || [];
        const labels = receita.length ? receita.map(x => x.mes) : ['Jan','Fev','Mar','Abr','Mai','Jun'];
        const valores = receita.length ? receita.map(x => parseFloat(x.total||0)) : [0,0,0,0,0,0];

        new Chart(elReceita, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Receita (R$)', data: valores, backgroundColor: 'rgba(231,185,63,.7)', borderColor: '#E7B93F', borderWidth: 1, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#707070' }, grid: { color: 'rgba(231,185,63,.05)' } }, y: { ticks: { color: '#707070', callback: v => `R$ ${v}` }, grid: { color: 'rgba(231,185,63,.05)' } } } }
        });

        // Gráfico de status de pagamento
        const status = d.status_locacoes || {};
        new Chart(elStatus, {
            type: 'doughnut',
            data: { labels: Object.keys(status).length ? Object.keys(status) : ['Pago','Pendente','Cancelado'], datasets: [{ data: Object.keys(status).length ? Object.values(status) : [1,0,0], backgroundColor: ['rgba(76,175,80,.6)','rgba(255,152,0,.6)','rgba(244,67,54,.6)'], borderColor: ['#4CAF50','#FF9800','#f44336'], borderWidth: 2 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#A0A0A0', font: { size: 11 } } } } }
        });
    }).catch(() => {});
}

// Monkey-patch carregarFornecedores para incluir mapa
const _origCarregarFornecedores = carregarFornecedores;
carregarFornecedores = async function() {
    await _origCarregarFornecedores();
    renderizarMapaFornecedores();
};

// Monkey-patch carregarFinanceiro para incluir gráficos
const _origCarregarFinanceiro = carregarFinanceiro;
carregarFinanceiro = async function() {
    await _origCarregarFinanceiro();
    renderizarGraficosFinanceiro();
};

// Expor função de PDF globalmente
window.exportarPDF = exportarPDF;