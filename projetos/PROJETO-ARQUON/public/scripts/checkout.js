/**
 * ARQON - THE VAULT | Checkout Enhanced Script
 * Finalidade: Checkout com integração das novas APIs
 */

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('arqon_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const headersAutenticados = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let carrinhoItens = [];
    let enderecos = [];
    let enderecoSelecionado = null;

    inicializarCheckout();

    async function inicializarCheckout() {
        await carregarCarrinho();
        await carregarEnderecos();
        configurarEventos();
    }

    async function carregarCarrinho() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/carrinho`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                carrinhoItens = result.data;
                renderizarCarrinho(carrinhoItens);
                calcularTotais(carrinhoItens);
            } else {
                // Fallback para localStorage
                carrinhoItens = JSON.parse(localStorage.getItem('arqon_cart')) || [];
                renderizarCarrinho(carrinhoItens);
                calcularTotais(carrinhoItens);
            }
        } catch (error) {
            console.error('[ARQON CHECKOUT] Erro ao carregar carrinho:', error);
            // Fallback para localStorage
            carrinhoItens = JSON.parse(localStorage.getItem('arqon_cart')) || [];
            renderizarCarrinho(carrinhoItens);
            calcularTotais(carrinhoItens);
        }
    }

    async function carregarEnderecos() {
        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/enderecos`, { headers: headersAutenticados });
            const result = await response.json();

            if (result.status === 'success') {
                enderecos = result.data;
                if (enderecos.length > 0) {
                    enderecoSelecionado = enderecos.find(e => e.padrao_entrega) || enderecos[0];
                    preencherEndereco(enderecoSelecionado);
                }
            }
        } catch (error) {
            console.error('[ARQON CHECKOUT] Erro ao carregar endereços:', error);
        }
    }

    function renderizarCarrinho(itens) {
        const container = document.getElementById('checkout-items-list');
        if (!container) return;

        if (itens.length === 0) {
            container.innerHTML = '<p style="color: var(--color-tertiary); text-align: center; padding: 20px;">Seu cofre está vazio.</p>';
            return;
        }

        const resolveImg = window.arqonImageUrl || ((p) => p || 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON');

        container.innerHTML = itens.map(item => `
            <div class="checkout-item">
                <div class="item-visual">
                    <img src="${resolveImg(item.foto_url || item.imagem)}" alt="${item.nome}">
                </div>
                <div class="item-details">
                    <h4>${item.nome || item.titulo}</h4>
                    <p class="item-meta">${item.marca || 'ARQON'} | ${item.tamanho || 'U'}</p>
                    <p class="item-period">${item.data_inicio || 'A definir'} → ${item.data_fim || 'A definir'}</p>
                </div>
                <div class="item-price">
                    ${formatarMoeda(item.valor_diaria || item.preco || 0)}
                </div>
            </div>
        `).join('');
    }

    function calcularTotais(itens) {
        let subtotal = 0;
        let caucao = 0;

        itens.forEach(item => {
            subtotal += parseFloat(item.valor_diaria || item.preco || 0);
            caucao += parseFloat(item.valor_caucao || (item.valor_diaria * 2) || 0);
        });

        const frete = 35; // Fixo por enquanto
        const limpeza = 35;
        const total = subtotal + frete + limpeza + caucao;

        document.getElementById('chk-subtotal').textContent = formatarMoeda(subtotal);
        document.getElementById('chk-caucao').textContent = formatarMoeda(caucao);
        document.getElementById('chk-frete').textContent = formatarMoeda(frete);
        document.getElementById('chk-total-final').textContent = formatarMoeda(total);
    }

    function preencherEndereco(endereco) {
        if (!endereco) return;

        document.getElementById('chk-cep').value = endereco.cep || '';
        document.getElementById('chk-rua').value = endereco.logradouro || '';
        document.getElementById('chk-numero').value = endereco.numero || '';
        document.getElementById('chk-bairro').value = endereco.bairro || '';
        document.getElementById('chk-complemento').value = endereco.complemento || '';
        const cidadeInput = document.getElementById('chk-cidade');
        const estadoInput = document.getElementById('chk-estado');
        if (cidadeInput) cidadeInput.value = endereco.cidade || '';
        if (estadoInput) estadoInput.value = endereco.estado || '';
    }

    function configurarEventos() {
        // Busca CEP
        const btnBuscarCep = document.getElementById('btn-buscar-cep');
        if (btnBuscarCep) {
            btnBuscarCep.addEventListener('click', buscarCEP);
        }

        // Tabs de pagamento
        const payTabs = document.querySelectorAll('.pay-tab');
        payTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                payTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const method = tab.getAttribute('data-method');
                document.querySelectorAll('.payment-panel').forEach(panel => panel.style.display = 'none');
                document.getElementById(`panel-${method}`).style.display = 'block';
            });
        });

        // Finalizar
        const btnFinalizar = document.getElementById('btn-finalizar-protocolo');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', finalizarCheckout);
        }

        // Voltar ao catálogo
        const btnVoltar = document.getElementById('btn-voltar-catalogo');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => {
                window.location.href = 'catalogo.html';
            });
        }
    }

    async function buscarCEP() {
        const cep = document.getElementById('chk-cep').value.replace(/\D/g, '');
        if (cep.length !== 8) {
            alert('CEP inválido.');
            return;
        }

        try {
            const response = await fetch(`${ARQON_CONFIG.apiBaseUrl}/cep?cep=${cep}`);
            const result = await response.json();

            if (result.status === 'success') {
                const data = result.data;
                document.getElementById('chk-rua').value = data.logradouro || '';
                document.getElementById('chk-bairro').value = data.bairro || '';
                document.getElementById('chk-complemento').value = data.complemento || '';
                // Preencher cidade e estado se os campos existirem
                const cidadeInput = document.getElementById('chk-cidade');
                const estadoInput = document.getElementById('chk-estado');
                if (cidadeInput) cidadeInput.value = data.cidade || data.localidade || '';
                if (estadoInput) estadoInput.value = data.uf || '';
            } else {
                alert('CEP não encontrado.');
            }
        } catch (error) {
            console.error('[ARQON CHECKOUT] Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP.');
        }
    }

    async function finalizarCheckout() {
        const btn = document.getElementById('btn-finalizar-protocolo');
        
        // Verifica se há itens no carrinho
        if (!carrinhoItens || carrinhoItens.length === 0) {
            alert('Seu cofre está vazio. Adicione artefatos antes de finalizar.');
            return;
        }
        
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = 'PROCESSANDO...';

        // Validação básica
        const nome = document.getElementById('chk-nome').value;
        const cep = document.getElementById('chk-cep').value;
        const rua = document.getElementById('chk-rua').value;
        const numero = document.getElementById('chk-numero').value;

        if (!nome || !cep || !rua || !numero) {
            alert('Preencha todos os campos obrigatórios.');
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = 'AUTORIZAR TRANSAÇÃO';
            return;
        }

        // Salvar endereço se não existir
        if (!enderecoSelecionado) {
            try {
                const enderecoResponse = await fetch(`${ARQON_CONFIG.apiBaseUrl}/enderecos`, {
                    method: 'POST',
                    headers: headersAutenticados,
                    body: JSON.stringify({
                        titulo: 'Endereço de Entrega',
                        cep: cep,
                        logradouro: rua,
                        numero: numero,
                        bairro: document.getElementById('chk-bairro').value,
                        complemento: document.getElementById('chk-complemento').value,
                        cidade: document.getElementById('chk-cidade')?.value || document.getElementById('chk-bairro').value,
                        estado: document.getElementById('chk-estado')?.value || '',
                        padrao_entrega: true
                    })
                });
                const enderecoResult = await enderecoResponse.json();
                if (enderecoResult.status === 'success' && enderecoResult.data) {
                    enderecoSelecionado = enderecoResult.data;
                }
            } catch (error) {
                console.error('[ARQON CHECKOUT] Erro ao salvar endereço:', error);
            }
        }

        // Criar locação no backend
        try {
            const hoje = new Date();
            const dataInicioPadrao = hoje.toISOString().split('T')[0];
            const dataFimPadrao = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const metodoPagamento = document.querySelector('.pay-tab.active')?.getAttribute('data-method') || 'pix';

            // Sanitiza datas de cada item: garante mínimo 4 dias
            const itensSanitizados = carrinhoItens.map(item => {
                let inicio = item.data_inicio || dataInicioPadrao;
                let fim = item.data_fim || dataFimPadrao;
                const d1 = new Date(inicio);
                const d2 = new Date(fim);
                const diffDias = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
                if (diffDias < 4) {
                    fim = new Date(d1.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                }
                return {
                    ...item,
                    data_inicio: inicio,
                    data_fim: fim
                };
            });

            const payload = {
                itens: itensSanitizados,
                endereco_id: enderecoSelecionado?.id || null,
                data_inicio: dataInicioPadrao,
                data_fim: dataFimPadrao,
                metodo_pagamento: metodoPagamento
            };
            console.log('[ARQON CHECKOUT] Payload:', payload);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const locacaoResponse = await fetch(`${ARQON_CONFIG.apiBaseUrl}/locacoes`, {
                method: 'POST',
                headers: headersAutenticados,
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log('[ARQON CHECKOUT] Response status:', locacaoResponse.status);
            const locacaoResult = await locacaoResponse.json();
            console.log('[ARQON CHECKOUT] Response body:', locacaoResult);

            if (locacaoResult.status === 'success') {
                // Exibir sucesso
                const overlay = document.getElementById('success-overlay');
                if (overlay) overlay.classList.add('active');

                document.getElementById('receipt-id').textContent = `#ARQ-${locacaoResult.data?.id || Date.now().toString().slice(-6)}`;
                document.getElementById('receipt-date').textContent = new Date().toLocaleDateString('pt-BR');
                document.getElementById('receipt-total').textContent = document.getElementById('chk-total-final').textContent;

                // Limpar carrinho
                localStorage.removeItem('arqon_cart');
                await fetch(`${ARQON_CONFIG.apiBaseUrl}/carrinho/limpar`, {
                    method: 'DELETE',
                    headers: headersAutenticados
                }).catch(() => {});
            } else {
                throw new Error(locacaoResult.message || 'Erro ao criar locação');
            }
        } catch (error) {
            console.error('[ARQON CHECKOUT] Erro ao criar locação:', error);
            alert('Erro ao processar locação: ' + error.message);
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = 'AUTORIZAR TRANSAÇÃO';
        }
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
});
