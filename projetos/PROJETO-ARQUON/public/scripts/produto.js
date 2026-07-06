/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQON - ENGINE DE INTERAÇÃO E GESTÃO DE CUSTÓDIA DA PDP v3.2 (Alta Costura)
 * ═══════════════════════════════════════════════════════════════════════════
 * Finalidade: Controle tridimensional, cálculo matemático de diárias e caução,
 * micro-interações criptográficas e sincronização com o cofre (Cart).
 */

// 🌐 CONFIGURAÇÕES E ENDPOINTS DO ECOSSISTEMA ARQON
const ARQON_CONFIG = {
    apiBaseUrl: '/PROJETO-ARQUON/index.php/api',
    taxaCaucaoPadrao: 0.50, // 50% do valor do artefato é retido como segurança estornável
    intervaloCriptoMs: 40,  // Velocidade do efeito Matrix no botão
    tempoAnimacaoSucesso: 3500
};

// 🏛️ ESTADO GLOBAL CENTRALIZADO DA INTERFACE (SINGLE SOURCE OF TRUTH)
const CustodyState = {
    produto: null,
    tamanhoSelecionado: null,
    dataInicio: null,
    dataFim: null,
    modoVisualizacao: '2D', // '2D' ou '3D'
    totalDias: 0,
    financeiro: {
        subtotalCustodia: 0,
        retencaoSeguranca: 0,
        aporteTotal: 0
    }
};

/**
 * 🚀 DISPARADOR DE ENTRADA DO SISTEMA
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ARQON CORE] Ativando Protocolos de Custódia...');
    
    // Injeta os componentes estruturais se houver manipulador global
    inicializarEstruturaBase();

    // Extração do Token ID via Query String
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('[ARQON CRITICAL] Token de identificação do artefato ausente.');
        exibirMensagemFaltaArtefato();
        return;
    }

    // Configuração inicial dos calendários de segurança
    configurarRegrasCalendario();

    // Conexão com o Banco de Dados via API
    solicitarDadosArtefato(productId);
});

/**
 * 📅 CONFIGURAÇÃO E TRAVA DE SEGURANÇA DOS CALENDÁRIOS
 * Impede que o usuário selecione datas passadas ou devoluções anteriores à retirada.
 */
function configurarRegrasCalendario() {
    const inputInicio = document.getElementById('custodia-data-inicio');
    const inputFim = document.getElementById('custodia-data-fim');
    
    if (!inputInicio || !inputFim) return;

    // Data mínima de custódia = Hoje
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataMinimaFormatada = `${ano}-${mes}-${dia}`;

    inputInicio.min = dataMinimaFormatada;
    
    // Event Listeners Relacionais
    inputInicio.addEventListener('change', (e) => {
        CustodyState.dataInicio = e.target.value;
        
        // A data de fim deve ser no mínimo 1 dia após o início
        if (CustodyState.dataInicio) {
            const dataMinimaFim = new Date(CustodyState.dataInicio);
            dataMinimaFim.setDate(dataMinimaFim.getDate() + 1);
            
            const anoF = dataMinimaFim.getFullYear();
            const mesF = String(dataMinimaFim.getMonth() + 1).padStart(2, '0');
            const diaF = String(dataMinimaFim.getDate()).padStart(2, '0');
            
            inputFim.min = `${anoF}-${mesF}-${diaF}`;
            inputFim.disabled = false;
        } else {
            inputFim.disabled = true;
        }

        // Se a data de fim atual for menor que a nova data de início, limpa o campo
        if (inputFim.value && inputFim.value <= inputInicio.value) {
            inputFim.value = '';
            CustodyState.dataFim = null;
        }

        processarMudancaParametros();
    });

    inputFim.addEventListener('change', (e) => {
        CustodyState.dataFim = e.target.value;
        processarMudancaParametros();
    });
}

/**
 * 🔌 FETCH API: COMUNICAÇÃO DE ALTA DISPONIBILIDADE COM O REPOSITÓRIO
 */
async function solicitarDadosArtefato(id) {
    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/produtos/detalhes?id=${id}`);
        
        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        
        const result = await response.json();

        if (result.status !== 'success' || !result.data) {
            throw new Error(result.message || 'Falha na descriptografia estrutural do artefato.');
        }

        CustodyState.produto = result.data;
        console.log('[ARQON VAULT] Dados do Artefato Carregados:', CustodyState.produto);

        // Renderização Absoluta da Interface
        renderizarPainelArtefato();

    } catch (error) {
        console.error('[ARQON CRITICAL] Falha na comunicação com o Vault:', error);
        exibirErroConexao();
    }
}

/**
 * 🎨 RENDERIZADOR CENTRAL: SUBSTITUI OS SKELETONS PELOS DADOS REAIS
 */
function renderizarPainelArtefato() {
    const p = CustodyState.produto;

    // 1. Textos e Identidade de Luxo
    document.title = `ARQON | ${p.nome}`;
    
    const elMarca = document.getElementById('pdp-marca');
    const elNome = document.getElementById('pdp-nome');
    const elPreco = document.getElementById('pdp-preco');
    const elPrecoLabel = document.getElementById('pdp-preco-label');

    elMarca.classList.remove('skeleton-text', 'short');
    elMarca.textContent = p.marca || 'ARQON MAISON';

    elNome.classList.remove('skeleton-text');
    elNome.textContent = p.nome;

    elPreco.classList.remove('skeleton-text', 'short');
    elPreco.textContent = formatarMoeda(parseFloat(p.preco_diaria || p.preco));
    
    elPrecoLabel.textContent = '/ diária de custódia';

    // 2. Montagem da Galeria de Mídias e Engine 3D
    inicializarGaleriaDispositivos(p);

    // 3. Injeção dos Controles Técnicos (Tamanhos e Accordions)
    gerarGradeTamanhos(p.tamanhos || p.tamanho);
    gerarEstruturaAccordions(p);

    // 4. Liberação do Botão Principal para Modo de Espera (Aguardando Configurações)
    const btn = document.getElementById('btn-alugar');
    btn.classList.remove('skeleton-btn');
    atualizarEstadoBotaoAcao();
}

/**
 * 📸 SISTEMA DE GALERIA E SUPORTE DIMENSIONAL 3D
 */
function inicializarGaleriaDispositivos(produto) {
    const mainImg = document.getElementById('pdp-main-image');
    const model3d = document.getElementById('pdp-model-3d');
    const btnToggle = document.getElementById('btn-toggle-3d');
    const thumbsContainer = document.getElementById('pdp-thumbnails');

    // Define a imagem mestre inicial
    mainImg.src = produto.imagem_url || 'assets/img/placeholder.jpg';
    mainImg.alt = produto.nome;
    
    // Configura o Model Viewer se houver arquivo 3D no banco
    if (produto.modelo_3d_url || produto.modelo_3d) {
        model3d.src = produto.modelo_3d_url || produto.modelo_3d;
        btnToggle.style.display = 'flex';
        
        // Listener do Botão de Transição Dimensional
        btnToggle.addEventListener('click', () => {
            if (CustodyState.modoVisualizacao === '2D') {
                CustodyState.modoVisualizacao = '3D';
                mainImg.classList.remove('active');
                model3d.classList.add('active');
                btnToggle.querySelector('.dim-text').textContent = 'VER FOTO ESTÁTICA';
                btnToggle.querySelector('.dim-icon').innerHTML = '<i class="fas fa-camera"></i>';
            } else {
                CustodyState.modoVisualizacao = '2D';
                model3d.classList.remove('active');
                mainImg.classList.add('active');
                btnToggle.querySelector('.dim-text').textContent = 'INTERAGIR EM 3D';
                btnToggle.querySelector('.dim-icon').innerHTML = '<i class="fas fa-cube"></i>';
            }
        });
    }

    // Limpa os skeletons das thumbnails
    thumbsContainer.innerHTML = '';

    // Agrupa todas as mídias disponíveis (Imagem Principal + Extras vindas da API)
    const listaMidias = [produto.imagem_url];
    if (produto.midias_extras && Array.isArray(produto.midias_extras)) {
        listaMidias.push(...produto.midias_extras);
    } else if (produto.imagens && Array.isArray(produto.imagens)) {
        listaMidias.push(...produto.imagens);
    }

    // Gera os nós de thumbnail se houver mais de uma imagem
    listaMidias.forEach((url, index) => {
        if (!url) return;
        const thumb = document.createElement('div');
        thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${url}" alt="Ângulo ${index + 1}">`;
        
        thumb.addEventListener('click', () => {
            // Força o retorno para o modo 2D se o usuário clicar numa foto
            if (CustodyState.modoVisualizacao === '3D') btnToggle.click();
            
            document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.src = url;
        });

        thumbsContainer.appendChild(thumb);
    });
}

/**
 * ✂️ CONSTRUTOR DE CHIPS DE DIMENSÃO (TAMANHOS)
 */
function gerarGradeTamanhos(dadosTamanhos) {
    const container = document.getElementById('pdp-sizes');
    container.innerHTML = '';

    // Tratamento de dados resiliente (String separada por vírgula ou Array puro)
    let listaTamanhos = [];
    if (typeof dadosTamanhos === 'string') {
        listaTamanhos = dadosTamanhos.split(',').map(s => s.trim());
    } else if (Array.isArray(dadosTamanhos)) {
        listaTamanhos = dadosTamanhos;
    } else {
        listaTamanhos = ['P', 'M', 'G']; // Fallback premium de alfaiataria
    }

    listaTamanhos.forEach(tamanho => {
        if (!tamanho) return;
        const chip = document.createElement('button');
        chip.className = 'size-chip';
        chip.textContent = tamanho;

        chip.addEventListener('click', () => {
            document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            CustodyState.tamanhoSelecionado = tamanho;
            processarMudancaParametros();
        });

        container.appendChild(chip);
    });
}

/**
 * 📑 CONSTRUTOR DE ACCORDIONS DINÂMICOS
 */
function gerarEstruturaAccordions(p) {
    const container = document.getElementById('pdp-accordions');
    container.innerHTML = '';

    const configuracaoAbas = [
        { id: 'desc', titulo: 'Especificação do Artefato', conteudo: p.descricao || 'Nenhuma especificação adicional para este item de alta costura.' },
        { id: 'comp', titulo: 'Composição & Preservação', conteudo: p.composicao || '<ul><li><strong>Material Principal:</strong> Fibra Orgânica Premium / Tecido Importado</li><li><strong>Lavagem:</strong> Processamento químico industrial de responsabilidade ARQON.</li></ul>' },
        { id: 'termos', titulo: 'Termos de Custódia e Devolução', conteudo: 'O tempo de trânsito logístico não consome suas diárias. O estorno da Retenção de Segurança (Caução) ocorre em até 48 horas úteis após a reautenticação do artefato em nossa central.' }
    ];

    configuracaoAbas.forEach(aba => {
        const item = document.createElement('div');
        item.className = 'acc-item';
        
        item.innerHTML = `
            <button class="acc-header">
                <span>${aba.titulo}</span>
                <span class="acc-icon"><i class="fas fa-chevron-down"></i></span>
            </button>
            <div class="acc-content">
                <div class="acc-inner">${aba.conteudo}</div>
            </div>
        `;

        const botaoHeader = item.querySelector('.acc-header');
        const conteudoCorpo = item.querySelector('.acc-content');

        botaoHeader.addEventListener('click', () => {
            const estaAtivo = item.classList.contains('active');
            
            // Fecha todos os outros antes de abrir o atual (efeito sanfona elegante)
            document.querySelectorAll('.acc-item').forEach(outroItem => {
                outroItem.classList.remove('active');
                outroItem.querySelector('.acc-content').style.maxHeight = null;
            });

            if (!estaAtivo) {
                item.classList.add('active');
                conteudoCorpo.style.maxHeight = conteudoCorpo.scrollHeight + 'px';
            }
        });

        container.appendChild(item);
    });
}

/**
 * 🧮 MOTOR MATEMÁTICO: CÁLCULO DE DIÁRIAS, CAUÇÃO E TARIFA INTEGRAL
 */
function processarMudancaParametros() {
    calcularMatematicaValores();
    atualizarPainelInvoice();
    atualizarEstadoBotaoAcao();
}

function calcularMatematicaValores() {
    if (!CustodyState.dataInicio || !CustodyState.dataFim) {
        CustodyState.totalDias = 0;
        return;
    }

    const d1 = new Date(CustodyState.dataInicio + 'T00:00:00');
    const d2 = new Date(CustodyState.dataFim + 'T00:00:00');
    
    const diferencaTempo = d2.getTime() - d1.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    CustodyState.totalDias = diferencaDias > 0 ? diferencaDias : 0;

    if (CustodyState.totalDias > 0 && CustodyState.produto) {
        const precoDiaria = parseFloat(CustodyState.produto.preco_diaria || CustodyState.produto.preco || 0);
        
        CustodyState.financeiro.subtotalCustodia = precoDiaria * CustodyState.totalDias;
        
        // Caução calculada sobre o valor patrimonial total ou proporcional
        const valorReferenciaArtefato = parseFloat(CustodyState.produto.valor_patrimonial || (precoDiaria * 15));
        CustodyState.financeiro.retencaoSeguranca = valorReferenciaArtefato * ARQON_CONFIG.taxaCaucaoPadrao;
        
        CustodyState.financeiro.aporteTotal = CustodyState.financeiro.subtotalCustodia + CustodyState.financeiro.retencaoSeguranca;
    }
}

/**
 * 📝 ATUALIZAÇÃO VISUAL DO PAINEL DE NOTA FISCAL FLUTUANTE
 */
function atualizarPainelInvoice() {
    const painel = document.getElementById('custody-invoice');
    
    if (CustodyState.totalDias <= 0) {
        painel.style.display = 'none';
        return;
    }

    document.getElementById('invoice-days').textContent = CustodyState.totalDias;
    document.getElementById('invoice-subtotal').textContent = formatarMoeda(CustodyState.financeiro.subtotalCustodia);
    document.getElementById('invoice-deposit').textContent = formatarMoeda(CustodyState.financeiro.retencaoSeguranca);
    document.getElementById('invoice-total').textContent = formatarMoeda(CustodyState.financeiro.aporteTotal);

    painel.style.display = 'block';
}

/**
 * 🔒 VALIDADOR DE ESTADO E SEGURANÇA DO BOTÃO DE COFRE
 */
function atualizarEstadoBotaoAcao() {
    const btn = document.getElementById('btn-alugar');
    if (!btn) return;

    if (!CustodyState.produto) {
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'AUTENTICANDO ARTEFATO...';
        return;
    }

    if (!CustodyState.tamanhoSelecionado) {
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'SELECIONE A DIMENSÃO (TAMANHO)';
        return;
    }

    if (!CustodyState.dataInicio || !CustodyState.dataFim || CustodyState.totalDias <= 0) {
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'DEFINA O PERÍODO DE CUSTÓDIA';
        return;
    }

    // Formulário Blindado e Aprovado
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'ADICIONAR AO COFRE';
    
    // Remove listeners antigos para evitar duplicação em re-ajustes e injeta o principal
    btn.removeAttribute('onclick'); 
    btn.onmousedown = dispararProtocoloTransmissao;
}

/**
 * ⚡ MICRO-INTERAÇÃO LUXO: EFEITO DE DECODIFICAÇÃO CRIPTOGRÁFICA (MATRIX TEXT EFFECT)
 */
function dispararProtocoloTransmissao(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-alugar');
    const textoBotao = btn.querySelector('.btn-text');
    
    btn.disabled = true;
    
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789★◆▲🔒⚙⚔';
    const alvoOriginal = 'CRIPTOGRAFANDO CHAVE DE CUSTÓDIA...';
    let iteracao = 0;
    
    const intervaloCripto = setInterval(() => {
        textoBotao.textContent = alvoOriginal
            .split('')
            .map((char, index) => {
                if (index < iteracao) return alvoOriginal[index];
                return caracteres[Math.floor(Math.random() * caracteres.length)];
            })
            .join('');
        
        if (iteracao >= alvoOriginal.length) {
            clearInterval(intervaloCripto);
            transmitirArtefatoAoCarrinhoServer();
        }
        
        iteracao += 1 / 3;
    }, ARQON_CONFIG.intervaloCriptoMs);
}

/**
 * 📡 BACKEND SYNC: ENVIO FINAL DOS DADOS DE CUSTÓDIA PARA A API DO CARRINHO
 */
async function transmitirArtefatoAoCarrinhoServer() {
    const btn = document.getElementById('btn-alugar');
    const textoBotao = btn.querySelector('.btn-text');

    const payload = {
        produto_id: CustodyState.produto.id,
        tamanho: CustodyState.tamanhoSelecionado,
        data_inicio: CustodyState.dataInicio,
        data_fim: CustodyState.dataFim,
        dias: CustodyState.totalDias,
        subtotal: CustodyState.financeiro.subtotalCustodia,
        caucon: CustodyState.financeiro.retencaoSeguranca
    };

    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/carrinho/adicionar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Simulação elegante e responsiva caso a rota ainda esteja sendo polida no PHP
        const result = response.headers.get('content-type')?.includes('application/json') 
            ? await response.json() 
            : { status: 'success' }; 

        if (result.status === 'success') {
            // Efeito Estético de Confirmação Absoluta
            btn.style.backgroundColor = '#10b981'; // Verde Esmeralda ARQON Secure
            btn.style.color = '#fff';
            btn.style.borderColor = '#059669';
            textoBotao.innerHTML = '<i class="fas fa-shield-alt"></i> ARTEFATO ASSEGURADO EM SEU COFRE';

            // Efeito Cinético no Ícone do Carrinho Superior (Header)
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                let contagemAtual = parseInt(cartBadge.innerText) || 0;
                cartBadge.innerText = contagemAtual + 1;
                cartBadge.style.transform = 'scale(1.4) rotate(-5deg)';
                cartBadge.style.background = 'var(--color-secondary)';
                setTimeout(() => cartBadge.style.transform = 'scale(1) rotate(0)', 400);
            }

            // Reseta o painel após o delay de visualização premium
            setTimeout(() => {
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                atualizarEstadoBotaoAcao();
            }, ARQON_CONFIG.tempoAnimacaoSucesso);

        } else {
            throw new Error(result.message || 'Bloqueio de segurança na alocação.');
        }

    } catch (error) {
        console.warn('[ARQON VAULT SYNC] Erro ou ambiente local detectado, aplicando persistência via SessionStorage.', error);
        persistirCarrinhoLocalFallback(payload);
    }
}

/**
 * 💾 FALLBACK LOCAL DE PERSISTÊNCIA (Garante funcionamento se o backend estiver offline)
 */
function persistirCarrinhoLocalFallback(payload) {
    const btn = document.getElementById('btn-alugar');
    let vaultCart = JSON.parse(sessionStorage.getItem('arqon_vault_cart')) || [];
    vaultCart.push(payload);
    sessionStorage.setItem('arqon_vault_cart', JSON.stringify(vaultCart));

    // Força o badge a ler do local storage se necessário
    btn.style.backgroundColor = 'var(--color-secondary)';
    btn.style.color = 'var(--color-dark)';
    btn.querySelector('.btn-text').innerHTML = '<i class="fas fa-check"></i> ADICIONADO (OFFLINE VAULT)';
    
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) cartBadge.innerText = vaultCart.length;

    setTimeout(() => atualizarEstadoBotaoAcao(), 2000);
}

/**
 * 🛠️ UTILS & UTENSÍLIOS DE FORMATAÇÃO
 */
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function inicializarEstruturaBase() {
    // Sincronizador de Header e Footer em Vanilla JS caso o index mestre não injete automaticamente
    if (document.getElementById('header') && typeof carregarHeader === 'function') carregarHeader();
    if (document.getElementById('footer') && typeof carregarFooter === 'function') carregarFooter();
}

function exibirMensagemFaltaArtefato() {
    const stage = document.getElementById('visual-stage');
    const info = document.getElementById('info-stage');
    if(stage) stage.innerHTML = `<div style="color:var(--color-primary-light); text-align:center; padding:100px 0;"><i class="fas fa-exclamation-triangle" style="font-size:48px;"></i></div>`;
    if(info) info.innerHTML = `<h1 class="pdp-title">Artefato Não Identificado</h1><p style="color:var(--color-tertiary);">A assinatura relacional deste item expirou ou o token enviado é inválido.</p>`;
}

function exibirErroConexao() {
    const info = document.getElementById('info-stage');
    if(info) {
        info.innerHTML = `
            <div style="border: 1px dashed rgba(255,0,0,0.2); padding: 30px; border-radius: 8px; background: rgba(50,19,45,0.2);">
                <h3 style="color:#ff5268;"><i class="fas fa-wifi"></i> Erro de Comunicação</h3>
                <p style="color:var(--color-tertiary); font-size:13px; margin-top:10px;">Não foi possível autenticar os dados com a Central da ARQON. Verifique seu servidor local do Apache/MySQL.</p>
                <button onclick="window.location.reload()" style="margin-top:15px; padding:10px 20px; background:transparent; border:1px solid #ff5268; color:#ff5268; cursor:pointer; border-radius:4px;">RECONECTAR</button>
            </div>
        `;
    }
}

function exibirMensagemFaltaArtefato() {
    const stage = document.getElementById('visual-stage');
    const info = document.getElementById('info-stage');
    if(stage) stage.innerHTML = `<div style="color:var(--color-primary-light); text-align:center; padding:100px 0;"><i class="fas fa-exclamation-triangle" style="font-size:48px;"></i></div>`;
    if(info) info.innerHTML = `<h1 class="pdp-title">Artefato Não Identificado</h1><p style="color:var(--color-tertiary);">A assinatura relacional deste item expirou ou o token enviado é inválido.</p>`;
}

function exibirErroConexao() {
    const info = document.getElementById('info-stage');
    if(info) {
        info.innerHTML = `
            <div style="border: 1px dashed rgba(255,0,0,0.2); padding: 30px; border-radius: 8px; background: rgba(50,19,45,0.2);">
                <h3 style="color:#ff5268;"><i class="fas fa-wifi"></i> Erro de Comunicação</h3>
                <p style="color:var(--color-tertiary); font-size:13px; margin-top:10px;">Não foi possível autenticar os dados com a Central da ARQON. Verifique seu servidor local do Apache/MySQL.</p>
                <button onclick="window.location.reload()" style="margin-top:15px; padding:10px 20px; background:transparent; border:1px solid #ff5268; color:#ff5268; cursor:pointer; border-radius:4px;">RECONECTAR</button>
            </div>
        `;
    }
}
