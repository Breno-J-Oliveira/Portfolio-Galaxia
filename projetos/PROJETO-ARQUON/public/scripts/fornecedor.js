/* ARQON — Painel do Fornecedor */
const API_BASE = window.ARQON_API_BASE || '/PROJETO-ARQUON/index.php/api';

function headers() {
    return { Authorization: `Bearer ${localStorage.getItem('arqon_token')}`, Accept: 'application/json' };
}

function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

let allProdutos = [];

async function api(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok && data.status !== 'success') throw new Error(data.message || `HTTP ${res.status}`);
    return data;
}

async function init() {
    const token = localStorage.getItem('arqon_token');
    const role = localStorage.getItem('arqon_role');
    if (!token || role !== 'VENDOR') {
        window.location.href = 'login.html';
        return;
    }

    // Carrega dados do usuário (não bloqueia o resto se falhar)
    let userEmail = '';
    try {
        const user = await api('/me', { headers: headers() });
        if (user && user.data) {
            userEmail = user.data.email || '';
            const chip = document.getElementById('admin-user-chip');
            if (chip) chip.textContent = user.data.nome || 'Fornecedor';
            document.getElementById('perfil-nome').value = user.data.nome || '';
            document.getElementById('perfil-email').value = user.data.email || '';
        }
    } catch (e) {
        console.warn('[FORNECEDOR] /me falhou:', e.message);
    }

    // Carrega fornecedor vinculado para preencher cidade/estado do mapa
    try {
        const all = await api('/fornecedores', { headers: headers() });
        const forn = (all.data || []).find(f => f.email === userEmail);
        if (forn) {
            if (document.getElementById('perfil-cidade')) document.getElementById('perfil-cidade').value = forn.cidade || '';
            if (document.getElementById('perfil-estado')) document.getElementById('perfil-estado').value = forn.estado || '';
            if (document.getElementById('perfil-cep')) document.getElementById('perfil-cep').value = forn.cep || '';
            if (document.getElementById('forn-produtos')) document.getElementById('forn-produtos').textContent = forn.produtos_count || '0';
            // Re-renderiza mapa se a aba estiver visível
            if (document.getElementById('tab-mapa')?.classList.contains('active')) {
                renderMapa();
            }
        }
    } catch (e) {
        console.warn('[FORNECEDOR] Busca fornecedor falhou:', e.message);
    }

    // Tab nav
    document.querySelectorAll('.admin-nav .nav-link').forEach(l => {
        l.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = l.dataset.tab;
            document.querySelectorAll('.admin-nav .nav-link').forEach(x => x.classList.remove('active'));
            l.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${tab}`).classList.add('active');
            const meta = { produtos: ['Meus Produtos','Gerencie seus artefatos no cofre'], mapa: ['Localização','Sua posição na rede logística'], perfil: ['Perfil','Dados cadastrais'] };
            document.getElementById('page-title').textContent = meta[tab][0];
            document.getElementById('page-subtitle').textContent = meta[tab][1];
            if (tab === 'mapa') renderMapa();
        });
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    document.getElementById('btn-refresh')?.addEventListener('click', () => {
        carregarProdutos();
        toast('Produtos atualizados', 'success');
    });

    document.getElementById('input-busca-produtos')?.addEventListener('input', (e) => filtrarProdutos(e.target.value));
    document.getElementById('filtro-status')?.addEventListener('change', () => renderProdutos(allProdutos));

    document.getElementById('form-perfil')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api('/user/perfil', { method: 'PUT', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ cidade: document.getElementById('perfil-cidade').value, estado: document.getElementById('perfil-estado').value }) });
            toast('Perfil atualizado', 'success');
        } catch (err) { toast(err.message, 'error'); }
    });

    // CRUD Produtos
    document.getElementById('btn-novo-produto')?.addEventListener('click', () => abrirModalProduto());
    document.getElementById('form-produto')?.addEventListener('submit', salvarProduto);

    await carregarProdutos();
}

async function carregarProdutos() {
    try {
        const r = await api('/fornecedor/produtos', { headers: headers() });
        allProdutos = (r.data || []).slice(0, 50);
        document.getElementById('forn-produtos').textContent = allProdutos.filter(p => p.status_venda == 1).length;
        renderProdutos(allProdutos);
    } catch (e) {
        document.getElementById('tbody-produtos').innerHTML = '<tr><td colspan="7" style="text-align:center;color:#A0A0A0;">Nenhum produto encontrado.</td></tr>';
    }
}

function abrirModalProduto(produto = null) {
    const modal = document.getElementById('modal-produto');
    document.getElementById('modal-produto-titulo').textContent = produto ? 'Editar Produto' : 'Novo Produto';
    document.getElementById('prod-id').value = produto ? produto.id : '';
    document.getElementById('prod-nome').value = produto ? produto.nome : '';
    document.getElementById('prod-descricao').value = produto ? (produto.descricao || '') : '';
    document.getElementById('prod-composicao').value = produto ? (produto.composicao || '') : '';
    document.getElementById('prod-valor-mercado').value = produto ? produto.valor_mercado : '';
    document.getElementById('prod-valor-diaria').value = produto ? produto.valor_diaria : '';
    document.getElementById('prod-status').value = produto ? (produto.status_venda ?? 1) : '1';
    document.getElementById('prod-genero').value = produto ? (produto.genero || 'unissex') : 'unissex';
    modal.classList.add('active');
}

function fecharModalProduto() {
    document.getElementById('modal-produto').classList.remove('active');
    document.getElementById('form-produto').reset();
    document.getElementById('prod-id').value = '';
}

async function salvarProduto(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const body = {
        nome: document.getElementById('prod-nome').value,
        descricao: document.getElementById('prod-descricao').value,
        composicao: document.getElementById('prod-composicao').value,
        valor_mercado: parseFloat(document.getElementById('prod-valor-mercado').value) || 0,
        valor_diaria: parseFloat(document.getElementById('prod-valor-diaria').value) || 0,
        status_venda: parseInt(document.getElementById('prod-status').value),
        genero: document.getElementById('prod-genero').value
    };
    try {
        if (id) {
            body.id = parseInt(id);
            await api('/fornecedor/produtos', { method: 'PUT', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            toast('Produto atualizado', 'success');
        } else {
            await api('/fornecedor/produtos', { method: 'POST', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            toast('Produto cadastrado', 'success');
        }
        fecharModalProduto();
        await carregarProdutos();
    } catch (err) {
        toast(err.message, 'error');
    }
}

async function editarProduto(id) {
    const produto = allProdutos.find(p => p.id == id);
    if (produto) abrirModalProduto(produto);
}

async function excluirProduto(id) {
    if (!confirm('Remover este produto permanentemente?')) return;
    try {
        await api(`/fornecedor/produtos?id=${id}`, { method: 'DELETE', headers: headers() });
        toast('Produto removido', 'success');
        await carregarProdutos();
    } catch (err) {
        toast(err.message, 'error');
    }
}

function filtrarProdutos(termo) {
    const filtrados = allProdutos.filter(p => {
        const t = termo.toLowerCase();
        return (p.nome || '').toLowerCase().includes(t) || (p.marca_nome || p.marca || '').toLowerCase().includes(t);
    });
    renderProdutos(filtrados);
}

function renderProdutos(lista) {
    const statusFiltro = document.getElementById('filtro-status')?.value || 'todos';
    const filtrados = lista.filter(p => statusFiltro === 'todos' || String(p.status_venda) === statusFiltro);
    const tbody = document.getElementById('tbody-produtos');
    if (!filtrados.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#A0A0A0;">Nenhum produto.</td></tr>';
        return;
    }
    tbody.innerHTML = filtrados.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><strong>${esc(p.nome)}</strong></td>
            <td>${esc(p.marca_nome || p.marca || '—')}</td>
            <td>${esc(p.categoria_nome || p.categoria || '—')}</td>
            <td>R$ ${Number(p.valor_diaria).toFixed(2)}</td>
            <td><span class="status-badge ${p.status_venda == 1 ? 'status-ativo' : 'status-inativo'}">${p.status_venda == 1 ? 'Disponível' : 'Oculto'}</span></td>
            <td>
                <button class="btn-icon" onclick="editarProduto(${p.id})" title="Editar"><i class="fas fa-pen"></i></button>
                <button class="btn-icon" onclick="excluirProduto(${p.id})" title="Excluir" style="color:#ff5268;margin-left:6px;"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

let fornLeafletMap = null;

function renderMapa() {
    const wrap = document.getElementById('mapa-fornecedor');
    if (!wrap) return;

    // Verifica se Leaflet está disponível
    if (typeof L === 'undefined') {
        wrap.innerHTML = '<p style="color:#A0A0A0;text-align:center;padding:20px;"><i class="fas fa-exclamation-triangle"></i> Biblioteca de mapa não carregada. Recarregue a página.</p>';
        return;
    }

    const cidade = document.getElementById('perfil-cidade')?.value || 'São Paulo';
    const estado = document.getElementById('perfil-estado')?.value || 'SP';
    document.getElementById('forn-cidade').textContent = cidade || '—';
    document.getElementById('forn-estado').textContent = estado || '—';

    // Limpa e recria o container para evitar problemas de re-inicialização
    wrap.innerHTML = '<div id="mapa-fornecedor-leaflet" style="width:100%;height:320px;border-radius:12px;border:1px solid rgba(231,185,63,.15);background:#0C0716;"></div>';

    if (fornLeafletMap) { fornLeafletMap.remove(); fornLeafletMap = null; }

    const coordMap = {
        'são paulo':      { lat: -23.5505, lng: -46.6333 },
        'santo andré':    { lat: -23.6571, lng: -46.5283 },
        'guarulhos':      { lat: -23.4629, lng: -46.5333 },
        'osasco':         { lat: -23.5329, lng: -46.7915 },
        'diadema':        { lat: -23.6815, lng: -46.6206 },
        'sorocaba':       { lat: -23.5015, lng: -47.4526 },
        'campinas':       { lat: -22.9056, lng: -47.0653 },
        'santos':         { lat: -23.9608, lng: -46.3331 },
        'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
        'niterói':        { lat: -22.8832, lng: -43.1034 },
        'belo horizonte': { lat: -19.9167, lng: -43.9345 },
        'curitiba':       { lat: -25.4290, lng: -49.2671 },
        'porto alegre':   { lat: -30.0346, lng: -51.2177 },
        'vitória':        { lat: -20.2976, lng: -40.2958 },
    };

    const cidadeKey = cidade.toLowerCase().trim();
    const coords = coordMap[cidadeKey] || { lat: -23.5505, lng: -46.6333 };

    try {
        fornLeafletMap = L.map('mapa-fornecedor-leaflet', { attributionControl: false, zoomControl: true }).setView([coords.lat, coords.lng], 11);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(fornLeafletMap);

        // Corrige renderização quando container vem de aba oculta
        requestAnimationFrame(() => {
            setTimeout(() => { if (fornLeafletMap) fornLeafletMap.invalidateSize(); }, 200);
        });

        const goldIcon = L.divIcon({
            className: 'custom-gold-marker',
            html: '<div style="width:14px;height:14px;background:#E7B93F;border-radius:50%;border:2px solid #0C0716;box-shadow:0 0 8px rgba(231,185,63,.5);"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        L.marker([coords.lat, coords.lng], { icon: goldIcon }).addTo(fornLeafletMap)
            .bindPopup('<b style="color:#0C0716;">' + esc(cidade) + '/' + esc(estado) + '</b><br>Sua localização na rede ARQON');

        // Hub SP
        L.marker([-23.5505, -46.6333], {
            icon: L.divIcon({
                className: 'custom-hub-marker',
                html: '<div style="width:18px;height:18px;background:#E7B93F;border-radius:50%;border:3px solid #0C0716;box-shadow:0 0 10px rgba(231,185,63,.7);"></div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            })
        }).addTo(fornLeafletMap)
            .bindPopup('<b style="color:#0C0716;">HUB SÃO PAULO</b><br>Centro de distribuição principal');

        // Rota até o hub
        L.polyline([[coords.lat, coords.lng], [-23.5505, -46.6333]], { color: '#E7B93F', weight: 1.5, opacity: 0.35, dashArray: '4 4' }).addTo(fornLeafletMap);
    } catch (e) {
        console.error('[FORNECEDOR] Erro ao renderizar mapa:', e);
        wrap.innerHTML = '<p style="color:#ff5268;text-align:center;padding:20px;"><i class="fas fa-exclamation-circle"></i> Erro ao carregar mapa.</p>';
    }
}

// Expõe funções globais para onclick no HTML
window.abrirModalProduto = abrirModalProduto;
window.fecharModalProduto = fecharModalProduto;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;

init();
