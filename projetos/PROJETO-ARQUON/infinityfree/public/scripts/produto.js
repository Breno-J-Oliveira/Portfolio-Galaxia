/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ARQON - ENGINE DE INTERAÇÃO E GESTÃO DE CUSTÓDIA DA PDP v3.2 (Alta Costura)
 * ═══════════════════════════════════════════════════════════════════════════
 * Finalidade: Controle tridimensional, cálculo matemático de diárias e caução,
 * micro-interações criptográficas e sincronização com o cofre (Cart).
 */

// 🌐 CONFIGURAÇÕES E ENDPOINTS DO ECOSSISTEMA ARQON
const taxaCaucaoPadrao = 0.50; // 50% do valor do artefato é retido como segurança estornável
const intervaloCriptoMs = 40;  // Velocidade do efeito Matrix no botão
const tempoAnimacaoSucesso = 3500;

// Estado para zoom de imagem
let ZoomState = {
    imagens: [],
    indiceAtual: 0
};

// � TOKEN DE AUTENTICAÇÃO
function getAuthToken() {
    return localStorage.getItem('arqon_token');
}

function getAuthHeaders() {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// �️ ESTADO GLOBAL CENTRALIZADO DA INTERFACE (SINGLE SOURCE OF TRUTH)
const CustodyState = {
    produto: null,
    tamanhoSelecionado: null,
    corSelecionada: null,
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

    // 3. Injeção dos Controles Técnicos (Tamanhos, Cores e Accordions)
    gerarGradeTamanhos(p.tamanhos || p.tamanho);
    gerarGradeCores(p.cores || p.cor);
    gerarEstruturaAccordions(p);

    // 4. Adiciona botões de ação (Wishlist, Compartilhar)
    adicionarBotoesAcao();

    // 5. Carrega avaliações do produto
    carregarAvaliacoes(p.id);

    // 6. Verifica se está na wishlist
    verificarWishlist(p.id);

    // 7. Carrega produtos semelhantes
    carregarProdutosSemelhantes(p);

    // 8. Carrega FAQ do produto
    carregarFAQ();

    // 9. Configura zoom de imagem
    configurarZoomImagem(p);

    // 10. Liberação do Botão Principal para Modo de Espera (Aguardando Configurações)
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
    let imagemUrl = produto.foto_url || produto.foto_principal_url || 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON';
    
    // Add prefix for relative paths
    if (imagemUrl && !imagemUrl.startsWith('http') && !imagemUrl.startsWith('/') && !imagemUrl.startsWith('https://placehold.co')) {
      imagemUrl = `/public/uploads/${imagemUrl}`;
    }
    
    mainImg.src = imagemUrl;
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
    const listaMidias = [produto.foto_url];
    if (produto.midias_extras && Array.isArray(produto.midias_extras)) {
        listaMidias.push(...produto.midias_extras);
    } else if (produto.imagens && Array.isArray(produto.imagens)) {
        listaMidias.push(...produto.imagens);
    }

    // Gera os nós de thumbnail se houver mais de uma imagem
    listaMidias.forEach((url, index) => {
        if (!url) return;
        
        // Add prefix for relative paths
        let imageUrl = url;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `/public/uploads/${imageUrl}`;
        }
        
        const thumb = document.createElement('div');
        thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imageUrl}" alt="Ângulo ${index + 1}">`;
        
        thumb.addEventListener('click', () => {
            // Força o retorno para o modo 2D se o usuário clicar numa foto
            if (CustodyState.modoVisualizacao === '3D') btnToggle.click();
            
            document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.src = imageUrl;
        });

        thumbsContainer.appendChild(thumb);
    });
}

/**
 * ✂️ CONSTRUTOR DE CHIPS DE DIMENSÃO (TAMANHOS)
 */
function gerarGradeTamanhos(dadosTamanhos) {
    const container = document.getElementById('pdp-sizes');
    if (!container) {
        console.error('[PRODUTO] Container pdp-sizes não encontrado');
        return;
    }
    
    container.innerHTML = '';

    // Tratamento de dados resiliente (String separada por vírgula ou Array puro)
    let listaTamanhos = [];
    if (typeof dadosTamanhos === 'string') {
        listaTamanhos = dadosTamanhos.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(dadosTamanhos)) {
        listaTamanhos = dadosTamanhos.map(s => String(s).trim()).filter(Boolean);
    }
    // Fallback premium de alfaiataria quando vazio/nulo (evita grade sem chips)
    if (!listaTamanhos.length) {
        listaTamanhos = ['P', 'M', 'G'];
    }

    console.log('[PRODUTO] Gerando tamanhos:', listaTamanhos);

    listaTamanhos.forEach(tamanho => {
        if (!tamanho) return;
        const chip = document.createElement('button');
        chip.className = 'size-chip';
        chip.textContent = tamanho;
        chip.type = 'button';
        chip.setAttribute('data-tamanho', tamanho);

        chip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[PRODUTO] Tamanho selecionado:', tamanho);
            document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            CustodyState.tamanhoSelecionado = tamanho;
            processarMudancaParametros();
        });

        container.appendChild(chip);
    });
}

/**
 * 🎨 CONSTRUTOR DE CHIPS DE CORES
 */
function gerarGradeCores(dadosCores) {
    const container = document.getElementById('pdp-colors');
    if (!container) {
        console.error('[PRODUTO] Container pdp-colors não encontrado');
        return;
    }
    
    container.innerHTML = '';

    // Tratamento de dados resiliente
    let listaCores = [];
    if (typeof dadosCores === 'string') {
        listaCores = dadosCores.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(dadosCores)) {
        listaCores = dadosCores.map(s => String(s).trim()).filter(Boolean);
    }
    // Fallback quando vazio/nulo
    if (!listaCores.length) {
        listaCores = ['#000000', '#FFFFFF', '#E7B93F'];
    }

    console.log('[PRODUTO] Gerando cores:', listaCores);

    listaCores.forEach(cor => {
        if (!cor) return;
        const chip = document.createElement('button');
        chip.className = 'color-chip';
        chip.style.backgroundColor = cor;
        chip.type = 'button';
        chip.setAttribute('data-cor', cor);
        chip.setAttribute('aria-label', 'Cor ' + cor);

        chip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[PRODUTO] Cor selecionada:', cor);
            document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            CustodyState.corSelecionada = cor;
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
        { id: 'info', titulo: 'Informações de Locação', conteudo: gerarInformacoesLocacao(p) },
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
 * 📋 GERADOR DE INFORMAÇÕES DE LOCAÇÃO
 */
function gerarInformacoesLocacao(p) {
    return `
        <div class="pdp-rental-info">
            <h3><i class="fas fa-info-circle"></i> Detalhes da Locação</h3>
            <ul>
                <li><i class="fas fa-clock"></i> <strong>Período Mínimo:</strong> 1 diária</li>
                <li><i class="fas fa-shipping-fast"></i> <strong>Entrega:</strong> Em até 24 horas úteis</li>
                <li><i class="fas fa-undo"></i> <strong>Devolução:</strong> Coleta gratuita em sua residência</li>
                <li><i class="fas fa-shield-alt"></i> <strong>Seguro:</strong> Cobertura completa inclusa</li>
                <li><i class="fas fa-tshirt"></i> <strong>Higienização:</strong> Processo industrial ARQON</li>
                <li><i class="fas fa-exchange-alt"></i> <strong>Troca:</strong> Permitida uma vez durante o período</li>
            </ul>
        </div>
    `;
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
        CustodyState.financeiro.retencaoSeguranca = valorReferenciaArtefato * taxaCaucaoPadrao;
        
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
 * 🔍 CARREGAR PRODUTOS SEMELHANTES
 */
async function carregarProdutosSemelhantes(produto) {
    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/produtos?categoria=${produto.id_categoria || ''}`);
        const result = await response.json();
        
        if (result.status === 'success' || Array.isArray(result)) {
            const produtos = result.status === 'success' ? result.data : result;
            // Filtra o produto atual e limita a 4 produtos
            const produtosSemelhantes = produtos
                .filter(p => p.id !== produto.id)
                .slice(0, 4);
            
            exibirProdutosSemelhantes(produtosSemelhantes);
        }
    } catch (error) {
        console.warn('[ARQON SIMILAR] Erro ao carregar produtos semelhantes:', error);
    }
}

function exibirProdutosSemelhantes(produtos) {
    const container = document.getElementById('pdp-similar-grid');
    if (!container) return;
    
    if (produtos.length === 0) {
        container.innerHTML = '<p style="color: var(--color-tertiary); text-align: center; grid-column: 1/-1;">Nenhum artefato relacionado encontrado.</p>';
        return;
    }
    
    container.innerHTML = produtos.map(p => {
        let imagem = p.foto_url || 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON';
        
        // Add prefix for relative paths
        if (imagem && !imagem.startsWith('http') && !imagem.startsWith('/')) {
          imagem = `/public/uploads/${imagem}`;
        }
        
        const preco = formatarMoeda(p.valor_diaria || p.preco || 0);
        const marca = p.marca_nome || p.marca || 'ARQON';
        
        return `
            <div class="pdp-similar-card" onclick="window.location.href='produto.html?id=${p.id}'">
                <div class="card-img">
                    <img src="${imagem}" alt="${p.nome}" loading="lazy">
                </div>
                <div class="card-info">
                    <div class="card-brand">${marca}</div>
                    <h3 class="card-name">${p.nome}</h3>
                    <div class="card-price">${preco} <small>/diária</small></div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * ❓ CARREGAR FAQ DO PRODUTO
 */
function carregarFAQ() {
    const container = document.getElementById('pdp-faq-container');
    if (!container) return;
    
    const faqData = [
        {
            pergunta: 'Qual é o período mínimo de locação?',
            resposta: 'O período mínimo de locação é de 1 diária. Para eventos especiais, oferecemos pacotes com desconto progressivo.'
        },
        {
            pergunta: 'Como funciona a caução?',
            resposta: 'A caução é uma retenção temporária de 50% do valor patrimonial do artefato. Este valor é estornado integralmente em até 48 horas após a devolução segura do item.'
        },
        {
            pergunta: 'O que acontece se o artefato for danificado?',
            resposta: 'Todos os nossos artefatos incluem seguro completo. Em caso de danos leves, não há cobrança adicional. Para danos significativos, o seguro cobre até 100% do valor.'
        },
        {
            pergunta: 'Posso trocar o tamanho ou cor durante a locação?',
            resposta: 'Sim, permitimos uma troca gratuita durante o período de locação, desde que haja disponibilidade do item desejado.'
        },
        {
            pergunta: 'Como é feita a higienização?',
            resposta: 'Todos os artefatos passam por um processo de higienização industrial certificada antes e após cada locação, garantindo máxima segurança e qualidade.'
        }
    ];
    
    container.innerHTML = faqData.map((item, index) => `
        <div class="faq-item">
            <div class="faq-header" onclick="toggleFAQ(${index})">
                <h3>${item.pergunta}</h3>
                <span class="faq-icon"><i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="faq-content">
                <div class="faq-content-inner">${item.resposta}</div>
            </div>
        </div>
    `).join('');
}

function toggleFAQ(index) {
    const items = document.querySelectorAll('.faq-item');
    const item = items[index];
    
    const isActive = item.classList.contains('active');
    
    // Fecha todos
    items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-content').style.maxHeight = null;
    });
    
    // Abre o clicado se não estava ativo
    if (!isActive) {
        item.classList.add('active');
        item.querySelector('.faq-content').style.maxHeight = item.querySelector('.faq-content').scrollHeight + 'px';
    }
}

/**
 * 🔍 CONFIGURAR ZOOM DE IMAGEM
 */
function configurarZoomImagem(produto) {
    const mainImg = document.getElementById('pdp-main-image');
    if (!mainImg) return;
    
    // Coleta todas as imagens
    const listaMidias = [produto.foto_url];
    if (produto.midias_extras && Array.isArray(produto.midias_extras)) {
        listaMidias.push(...produto.midias_extras);
    } else if (produto.imagens && Array.isArray(produto.imagens)) {
        listaMidias.push(...produto.imagens);
    }
    
    // Add prefix for relative paths
    ZoomState.imagens = listaMidias.filter(url => url).map(url => {
      if (url && !url.startsWith('http') && !url.startsWith('/')) {
        return `/public/uploads/${url}`;
      }
      return url;
    });
    ZoomState.indiceAtual = 0;
    
    // Adiciona evento de clique para zoom
    mainImg.style.cursor = 'zoom-in';
    mainImg.addEventListener('click', () => abrirZoomModal(ZoomState.indiceAtual));
}

function abrirZoomModal(indice) {
    const modal = document.getElementById('zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    
    if (!modal || !zoomImage) return;
    
    ZoomState.indiceAtual = indice;
    zoomImage.src = ZoomState.imagens[indice];
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharZoomModal() {
    const modal = document.getElementById('zoom-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function navegarZoom(direcao) {
    const novoIndice = ZoomState.indiceAtual + direcao;
    
    if (novoIndice >= 0 && novoIndice < ZoomState.imagens.length) {
        ZoomState.indiceAtual = novoIndice;
        const zoomImage = document.getElementById('zoom-image');
        if (zoomImage) {
            zoomImage.src = ZoomState.imagens[novoIndice];
        }
    }
}

// Fecha modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharZoomModal();
    }
});

// Fecha modal clicando fora
document.getElementById('zoom-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'zoom-modal') {
        fecharZoomModal();
    }
});

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
    }, intervaloCriptoMs);
}

/**
 * 📡 BACKEND SYNC: ENVIO FINAL DOS DADOS DE CUSTÓDIA PARA A API DO CARRINHO
 */
async function transmitirArtefatoAoCarrinhoServer() {
    const btn = document.getElementById('btn-alugar');
    const textoBotao = btn.querySelector('.btn-text');

    const payload = {
        id_produto: CustodyState.produto.id,
        quantidade: 1,
        data_inicio: CustodyState.dataInicio,
        data_fim: CustodyState.dataFim
    };

    // 1. Tenta enviar para a nova API de Carrinho
    const token = getAuthToken();
    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/carrinho`, {
            method: 'POST',
            headers: { 
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('[ARQON CARRINHO] Produto adicionado ao carrinho:', result);
        } else {
            console.warn('[ARQON CARRINHO] Erro ao adicionar ao carrinho, usando fallback localStorage');
        }
    } catch (error) {
        console.warn('[ARQON CARRINHO] Erro de conexão, usando fallback localStorage:', error);
    }

    // 2. Efeito Estético de Confirmação Absoluta (Verde Segurança)
    btn.style.backgroundColor = '#10b981'; // Verde Esmeralda ARQON Secure
    btn.style.color = '#fff';
    btn.style.borderColor = '#059669';
    textoBotao.innerHTML = '<i class="fas fa-shield-alt"></i> ARTEFATO ASSEGURADO';

    // 3. Efeito Cinético no Ícone do Carrinho Superior (Header)
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.style.transform = 'scale(1.4) rotate(-5deg)';
        cartBadge.style.background = '#10b981';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1) rotate(0)';
            cartBadge.style.background = ''; // Volta à cor base via CSS
        }, 400);
    }

    // 4. Aguarda 1.5 segundos para o utilizador ler e depois abre a gaveta!
    setTimeout(() => {
        // Restaura a estética do botão
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        textoBotao.textContent = 'ADICIONAR AO COFRE';
        btn.disabled = false;
        
        // 🌟 FINALMENTE: Executa a gravação e manda abrir a gaveta lateral!
        salvarProdutoNoCofre();
        
    }, 1500);
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

// ============================================================================
// ARQON - PROTOCOLOS ADICIONAIS (GUIA DE MEDIDAS, WISHLIST & COMPATIBILIDADE)
// ============================================================================

/**
 * 📏 CONTROLADOR INTERATIVO DO MODAL DE MEDIDAS
 */
function abrirModalMedidas() {
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Acessibilidade e prevenção de scroll no fundo
        document.body.style.overflow = 'hidden';
    }
}

function fecharModalMedidas() {
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * 🔒 SISTEMA DE SINCRONIZAÇÃO DE FAVORITOS (WISHLIST INTERNA)
 */
function alternarFavorito(produtoId) {
    const btnWishlist = document.getElementById('btn-wishlist');
    let favoritos = JSON.parse(localStorage.getItem('arqon_vault_wishlist')) || [];
    
    const index = favoritos.indexOf(produtoId);
    
    if (index === -1) {
        // Adiciona ao cofre de desejos
        favoritos.push(produtoId);
        if (btnWishlist) {
            btnWishlist.innerHTML = '<i class="fas fa-heart" style="color: #e7b93f;"></i>';
            btnWishlist.title = 'Remover do Cofre de Desejos';
        }
        console.log(`[ARQON WISHLIST] Artefato ${produtoId} guardado nos favoritos.`);
    } else {
        // Remove do cofre de desejos
        favoritos.splice(index, 1);
        if (btnWishlist) {
            btnWishlist.innerHTML = '<i class="far fa-heart"></i>';
            btnWishlist.title = 'Adicionar ao Cofre de Desejos';
        }
        console.log(`[ARQON WISHLIST] Artefato ${produtoId} removido dos favoritos.`);
    }
    
    localStorage.setItem('arqon_vault_wishlist', JSON.stringify(favoritos));
}

/**
 * 🔌 INJEÇÃO DE ESCUTA DE EVENTOS ADICIONAIS
 * Vincula as interações do Modal e Fechamento no clique exterior de forma segura.
 */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('size-guide-modal');
    
    // Fecha o modal se o usuário clicar na área escura de fora do card
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModalMedidas();
            }
        });
    }

    // Inicializa o estado visual do botão de favoritos se o produto já estiver guardado
    setTimeout(() => {
        if (CustodyState.produto) {
            const favoritos = JSON.parse(localStorage.getItem('arqon_vault_wishlist')) || [];
            const btnWishlist = document.getElementById('btn-wishlist');
            if (btnWishlist && favoritos.includes(CustodyState.produto.id)) {
                btnWishlist.innerHTML = '<i class="fas fa-heart" style="color: #e7b93f;"></i>';
            }
        }
    }, 1000); // Aguarda o carregamento assíncrono do produto da API
});

/**
 * ➕ ADICIONA BOTÕES DE AÇÃO (WISHLIST, COMPARTILHAR)
 */
function adicionarBotoesAcao() {
    const infoStage = document.getElementById('info-stage');
    if (!infoStage) return;

    const botoesContainer = document.createElement('div');
    botoesContainer.className = 'pdp-action-buttons';
    botoesContainer.innerHTML = `
        <button class="btn-action-wishlist" id="btn-wishlist" onclick="alternarWishlistAPI()">
            <i class="far fa-heart"></i>
            <span>Adicionar ao Cofre de Desejos</span>
        </button>
        <button class="btn-action-share" onclick="compartilharProduto()">
            <i class="fas fa-share-alt"></i>
            <span>Compartilhar</span>
        </button>
    `;

    // Insere antes do botão principal
    const btnPrincipal = document.getElementById('btn-alugar');
    if (btnPrincipal) {
        infoStage.insertBefore(botoesContainer, btnPrincipal);
    }
}

/**
 * ❤️ WISHLIST API INTEGRATION
 */
async function verificarWishlist(produtoId) {
    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/wishlist/verificar?id_produto=${produtoId}`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();
        
        if (result.status === 'success' && result.na_wishlist) {
            const btnWishlist = document.getElementById('btn-wishlist');
            if (btnWishlist) {
                btnWishlist.innerHTML = '<i class="fas fa-heart" style="color: #e7b93f;"></i><span>Remover do Cofre de Desejos</span>';
            }
        }
    } catch (error) {
        console.warn('[ARQON WISHLIST] Erro ao verificar wishlist:', error);
    }
}

async function alternarWishlistAPI() {
    const produtoId = CustodyState.produto?.id;
    if (!produtoId) return;

    const token = getAuthToken();
    if (!token) {
        // Fallback para localStorage se não estiver logado
        alternarFavorito(produtoId);
        return;
    }

    const btnWishlist = document.getElementById('btn-wishlist');
    btnWishlist.disabled = true;

    try {
        // Primeiro verifica se já está na wishlist
        const checkResponse = await fetch(`${ARQON_CONFIG.apiBaseUrl}/wishlist/verificar?id_produto=${produtoId}`, {
            headers: getAuthHeaders()
        });
        const checkResult = await checkResponse.json();

        if (checkResult.status === 'success' && checkResult.na_wishlist) {
            // Remove da wishlist
            await fetch(`${ARQON_CONFIG.apiBaseUrl}/wishlist?id_produto=${produtoId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            
            btnWishlist.innerHTML = '<i class="far fa-heart"></i><span>Adicionar ao Cofre de Desejos</span>';
        } else {
            // Adiciona à wishlist
            await fetch(`${ARQON_CONFIG.apiBaseUrl}/wishlist`, {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_produto: produtoId })
            });
            
            btnWishlist.innerHTML = '<i class="fas fa-heart" style="color: #e7b93f;"></i><span>Remover do Cofre de Desejos</span>';
        }
    } catch (error) {
        console.error('[ARQON WISHLIST] Erro:', error);
        // Fallback para localStorage em caso de erro
        alternarFavorito(produtoId);
    } finally {
        btnWishlist.disabled = false;
    }
}

/**
 * ⭐ AVALIAÇÕES API INTEGRATION
 */
async function carregarAvaliacoes(produtoId) {
    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/avaliacoes?id_produto=${produtoId}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
            exibirAvaliacoes(result.data);
        }
    } catch (error) {
        console.warn('[ARQON AVALIACOES] Erro ao carregar avaliações:', error);
    }
}

function exibirAvaliacoes(avaliacoes) {
    const container = document.getElementById('pdp-accordions');
    if (!container) return;

    const avaliacoesSection = document.createElement('div');
    avaliacoesSection.className = 'acc-item';
    
    let media = 0;
    if (avaliacoes.length > 0) {
        media = avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length;
    }

    let avaliacoesHTML = '';
    if (avaliacoes.length === 0) {
        avaliacoesHTML = '<p style="color: var(--color-tertiary);">Seja o primeiro a avaliar este artefato!</p>';
    } else {
        avaliacoesHTML = avaliacoes.map(a => `
            <div class="avaliacao-item">
                <div class="avaliacao-header">
                    <div class="avaliacao-usuario">
                        <img src="${a.avatar_usuario || 'assets/images/default-avatar.png'}" alt="${a.nome_usuario}">
                        <span>${a.nome_usuario}</span>
                    </div>
                    <div class="avaliacao-nota">
                        ${'★'.repeat(a.nota)}${'☆'.repeat(5 - a.nota)}
                    </div>
                </div>
                <p class="avaliacao-comentario">${a.comentario || ''}</p>
                <small class="avaliacao-data">${new Date(a.data_criacao).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    }

    avaliacoesSection.innerHTML = `
        <button class="acc-header">
            <span>Avaliações (${avaliacoes.length}) - Média: ${media.toFixed(1)} ★</span>
            <span class="acc-icon"><i class="fas fa-chevron-down"></i></span>
        </button>
        <div class="acc-content">
            <div class="acc-inner">
                ${avaliacoesHTML}
                <button class="btn-avaliar" onclick="abrirFormularioAvaliacao()">Avaliar este Artefato</button>
            </div>
        </div>
    `;

    const botaoHeader = avaliacoesSection.querySelector('.acc-header');
    const conteudoCorpo = avaliacoesSection.querySelector('.acc-content');

    botaoHeader.addEventListener('click', () => {
        const estaAtivo = avaliacoesSection.classList.contains('active');
        document.querySelectorAll('.acc-item').forEach(outroItem => {
            outroItem.classList.remove('active');
            outroItem.querySelector('.acc-content').style.maxHeight = null;
        });
        if (!estaAtivo) {
            avaliacoesSection.classList.add('active');
            conteudoCorpo.style.maxHeight = conteudoCorpo.scrollHeight + 'px';
        }
    });

    container.appendChild(avaliacoesSection);
}

function abrirFormularioAvaliacao() {
    const token = getAuthToken();
    if (!token) {
        alert('Faça login para avaliar este artefato.');
        window.location.href = 'login.html';
        return;
    }

    const nota = prompt('Nota de 1 a 5 estrelas:');
    if (!nota || nota < 1 || nota > 5) {
        alert('Nota inválida.');
        return;
    }

    const comentario = prompt('Seu comentário (opcional):');

    enviarAvaliacao(parseInt(nota), comentario);
}

async function enviarAvaliacao(nota, comentario) {
    try {
        const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/avaliacoes`, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_produto: CustodyState.produto.id,
                nota: nota,
                comentario: comentario
            })
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Avaliação enviada com sucesso!');
            carregarAvaliacoes(CustodyState.produto.id);
        } else {
            alert(result.message || 'Erro ao enviar avaliação.');
        }
    } catch (error) {
        console.error('[ARQON AVALIACOES] Erro:', error);
        alert('Erro ao enviar avaliação.');
    }
}

/**
 * 📤 COMPARTILHAR PRODUTO
 */
function compartilharProduto() {
    if (navigator.share) {
        navigator.share({
            title: CustodyState.produto.nome,
            text: `Confira este artefato exclusivo na ARQON: ${CustodyState.produto.nome}`,
            url: window.location.href
        });
    } else {
        // Fallback para copiar link
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
    }
}

/**
 * 🚀 GRAVAÇÃO NO COFRE CENTRAL (LOCALSTORAGE)
 * Esta função pega o estado atual da página do produto (CustodyState)
 * e injeta diretamente no carrinho global de forma 100% dinâmica.
 */
function salvarProdutoNoCofre() {
    console.log("[ARQON PRODUTO] Iniciando salvarProdutoNoCofre...");
    console.log("[ARQON PRODUTO] CustodyState.produto:", CustodyState.produto);
    console.log("[ARQON PRODUTO] CustodyState.tamanhoSelecionado:", CustodyState.tamanhoSelecionado);
    console.log("[ARQON PRODUTO] CustodyState.dataInicio:", CustodyState.dataInicio);
    console.log("[ARQON PRODUTO] CustodyState.dataFim:", CustodyState.dataFim);

    if (!CustodyState.produto) {
        console.error("[ARQON] Nenhum artefato carregado no estado atual.");
        return;
    }

    // 1. Montamos o objeto do produto com as chaves exatas (CamelCase) que o carrinho espera ler
    const novoItem = {
        id: CustodyState.produto.id,
        nome: CustodyState.produto.titulo || CustodyState.produto.nome || "Artefato Exclusivo",
        imagem: CustodyState.produto.foto_url || (CustodyState.produto.midias && CustodyState.produto.midias[0]) || 'https://placehold.co/100x133/0a0107/dcb23c?text=ARQON',
        tamanho: CustodyState.tamanhoSelecionado || 'U',
        data_inicio: CustodyState.dataInicio || 'Imediato',
        data_fim: CustodyState.dataFim || 'A definir',
        
        // 🌟 CORREÇÃO DO PROBLEMA 4: Nomes de chaves mapeados exatamente como a engine do carrinho lê
        totalDias: CustodyState.totalDias || 1,
        valor_diaria: parseFloat(CustodyState.produto.preco_diaria || 0),
        preco: parseFloat(CustodyState.financeiro.subtotalCustodia || 0),
        
        // 🌟 CORREÇÃO DO PROBLEMA 4 (Caução): Definido como null para forçar o operador (??) 
        // do botaocarrinho.js a calcular as 2 diárias fixas obrigatórias corretamente.
        caucao: null,
        quantidade: 1
    };

    console.log("[ARQON PRODUTO] Novo item a ser adicionado:", novoItem);

    // 2. Buscamos o cofre atual ou inicializamos um array vazio
    let cofreAtual = JSON.parse(localStorage.getItem('arqon_cart')) || [];
    console.log("[ARQON PRODUTO] Cofre atual antes de adicionar:", cofreAtual);

    // 🌟 MELHORIA: Evita duplicar linhas para o mesmo item do mesmo tamanho
    const itemExistente = cofreAtual.find(item => item.id === novoItem.id && item.tamanho === novoItem.tamanho);

    if (itemExistente) {
        // Se o artefato com esse tamanho já está no cofre, apenas incrementa a quantidade
        itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
        console.log("[ARQON PRODUTO] Item existente encontrado, quantidade incrementada para:", itemExistente.quantidade);
    } else {
        // Se for um item ou tamanho novo, adiciona ao array
        cofreAtual.push(novoItem);
        console.log("[ARQON PRODUTO] Novo item adicionado ao cofre");
    }

    // 4. Gravamos de volta no localStorage
    localStorage.setItem('arqon_cart', JSON.stringify(cofreAtual));
    console.log("[ARQON PRODUTO] Cofre salvo no localStorage. Verificando...");
    console.log("[ARQON PRODUTO] localStorage.getItem('arqon_cart') após salvar:", localStorage.getItem('arqon_cart'));
    console.log("[ARQON] Artefato integrado ao cofre local com sucesso:", cofreAtual);

    // 🌟 SINCRO: Atualiza imediatamente o contador (bolinha) no Header sem precisar de refresh
    if (typeof atualizarBadgeCarrinho === 'function') {
        atualizarBadgeCarrinho();
    }

    // 5. Acorda o carrinho lateral para abrir e se atualizar na tela
    if (typeof window.arqonOpenCart === 'function') {
        window.arqonOpenCart();
    } else {
        console.warn("[ARQON] O carrinho lateral ainda não foi mapeado pelo index.js.");
    }
}