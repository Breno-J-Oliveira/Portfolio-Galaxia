/**
 * ARQON - THE VAULT | Theme Loader v4
 * Inspirado no prototipo admin. Carrega tema do banco e aplica via CSS variables.
 */

(function() {
    'use strict';

    const API_URL = (typeof ARQON !== 'undefined' && ARQON.api)
        ? ARQON.api + '/tema'
        : '/api/tema';

    /* ============================================================
       CONFIGURACOES DE TEMA (mapeamento banco -> CSS variables)
    ============================================================ */
    const THEME_VARS = [
        { key:'--color-primary',         dbKey:'color-primary',         fallback:'#641838' },
        { key:'--color-primary-light',   dbKey:'color-primary-light',   fallback:'#781D43' },
        { key:'--color-primary-dark',    dbKey:'color-primary-dark',    fallback:'#50132D' },
        { key:'--color-secondary',       dbKey:'color-secondary',       fallback:'#E7B93F' },
        { key:'--color-secondary-light', dbKey:'color-secondary-light', fallback:'#FFDE4C' },
        { key:'--color-secondary-dark',  dbKey:'color-secondary-dark',  fallback:'#B99432' },
        { key:'--color-tertiary',        dbKey:'color-tertiary',        fallback:'#A0A0A0' },
        { key:'--color-tertiary-light',  dbKey:'color-tertiary-light',  fallback:'#C0C0C0' },
        { key:'--color-tertiary-dark',   dbKey:'color-tertiary-dark',   fallback:'#808080' },
        { key:'--color-accent',          dbKey:'color-accent',          fallback:'#10b981' },
        { key:'--color-error',           dbKey:'color-error',           fallback:'#ff5268' },
        { key:'--color-gold',            dbKey:'color-gold',            fallback:'#E7B93F' },
        { key:'--color-dark',            dbKey:'color-dark',            fallback:'#0C0716' },
        { key:'--color-dark-light',      dbKey:'color-dark-light',      fallback:'#0E081A' },
        { key:'--color-dark-dark',       dbKey:'color-dark-dark',       fallback:'#0A0612' },
        { key:'--color-void',            dbKey:'color-void',            fallback:'#0A0612' },
        { key:'--color-text',            dbKey:'color-text',            fallback:'#DEDDDF' },
        { key:'--color-bg',              dbKey:'color-bg',              fallback:'#0C0716' },
        { key:'--color-light',           dbKey:'color-light',           fallback:'#FFFFFF' },
        { key:'--color-light-dark',      dbKey:'color-light-dark',      fallback:'#DCDCDC' },
        { key:'--vh-gold',               dbKey:'color-secondary',       fallback:'#E7B93F' },
        { key:'--vh-gold-light',         dbKey:'color-secondary-light',fallback:'#FFDE4C' },
        { key:'--vh-dark',               dbKey:'color-dark',            fallback:'#0C0716' },
        { key:'--vh-muted',              dbKey:'color-tertiary',        fallback:'#A0A0A0' },
        { key:'--vh-void',               dbKey:'color-void',            fallback:'#0A0612' },
        { key:'--vh-text',               dbKey:'color-text',            fallback:'#DEDDDF' },
        { key:'--gold',                  dbKey:'color-secondary',       fallback:'#E7B93F' },
        { key:'--gold-hover',            dbKey:'color-secondary-light', fallback:'#FFDE4C' },
        { key:'--arqon-gold',            dbKey:'color-gold',            fallback:'#E7B93F' },
        { key:'--bg-main',               dbKey:'color-dark',            fallback:'#0C0716' },
        { key:'--text-gray',             dbKey:'color-tertiary',        fallback:'#A0A0A0' },
        { key:'--color-success',         dbKey:'color-success',         fallback:'#4CAF50' },
        { key:'--color-danger',          dbKey:'color-danger',          fallback:'#F44336' },
        { key:'--arqon-logo-color',      dbKey:'arqon-logo-color',      fallback:'#DEDDDF' },
        { key:'--font-primary',          dbKey:'font-primary',          fallback:'"Cinzel", serif' },
        { key:'--font-secondary',        dbKey:'font-secondary',        fallback:'"Inter", sans-serif' },
        { key:'--font-code',             dbKey:'font-code',             fallback:'"Fira Code", monospace' },
        { key:'--border-radius',         dbKey:'border-radius',         fallback:'8px' },
        { key:'--border-radius-large',   dbKey:'border-radius-large',   fallback:'16px' },
        { key:'--spacing-unit',          dbKey:'spacing-unit',          fallback:'8px' },
        { key:'--transition-speed',      dbKey:'transition-speed',      fallback:'0.3s' },
    ];

    /* ============================================================
       CORE FUNCTIONS
    ============================================================ */

    async function carregarTema() {
        const root = document.documentElement;
        let dados = null;

        // 1. Busca do banco
        try {
            console.log('[THEME] Buscando tema de:', API_URL);
            const res = await fetch(API_URL, { headers:{ 'Accept':'application/json' } });
            console.log('[THEME] Resposta status:', res.status);
            if (res.ok) {
                const json = await res.json();
                console.log('[THEME] Resposta JSON:', json);
                if (json.status === 'success' && json.data) {
                    dados = normalizar(json.data);
                    console.log('[THEME] Dados normalizados:', dados);
                }
            } else if (res.status === 404 || res.status === 500) {
                // Tenta fazer seed se a tabela não existe ou está vazia
                console.log('[THEME] Tabela de tema não encontrada, tentando criar...');
                try {
                    const seedRes = await fetch(API_URL + '/seed', {
                        method: 'POST',
                        headers:{ 'Accept':'application/json' }
                    });
                    console.log('[THEME] Seed status:', seedRes.status);
                    if (seedRes.ok) {
                        // Tenta carregar novamente após o seed
                        const retryRes = await fetch(API_URL, { headers:{ 'Accept':'application/json' } });
                        if (retryRes.ok) {
                            const retryJson = await retryRes.json();
                            if (retryJson.status === 'success' && retryJson.data) {
                                dados = normalizar(retryJson.data);
                            }
                        }
                    }
                } catch(seedErr) {
                    console.warn('[THEME] Erro ao fazer seed:', seedErr.message);
                }
            }
        } catch(e) { console.warn('[THEME] API offline:', e.message); }

        // 2. Fallback localStorage
        if (!dados) {
            const preview = localStorage.getItem('arqon_theme_preview');
            if (preview) { try { dados = JSON.parse(preview); } catch(e) {} }
        }

        // 3. Aplica
        if (dados) {
            aplicarTema(root, dados);
            console.log('[THEME] Tema aplicado do banco.');
        } else {
            console.log('[THEME] Usando fallback CSS estatico.');
        }
    }

    function normalizar(data) {
        const out = {};
        if (Array.isArray(data)) {
            // Formato antigo: [{chave: 'color-primary', valor: '#E7B93F'}, ...]
            data.forEach(c => { if (c.chave) out[c.chave] = c.valor || ''; });
        } else if (data && typeof data === 'object') {
            // Formato atual: {color-primary: {valor: '#E7B93F', tipo: 'color', ...}, ...}
            Object.entries(data).forEach(([k, v]) => {
                out[k] = (v && typeof v === 'object') ? (v.valor || v.value || '') : v;
            });
        }
        return out;
    }

    function aplicarTema(root, dados) {
        // Converte dbKey -> valor
        const valores = {};
        THEME_VARS.forEach(tv => {
            if (!valores[tv.key]) {
                valores[tv.key] = dados[tv.dbKey] || tv.fallback;
            }
        });

        // Aplica todas as variaveis no :root
        Object.entries(valores).forEach(([cssVar, valor]) => {
            if (valor) {
                root.style.setProperty(cssVar, valor);
                console.log(`[THEME] ${cssVar} = ${valor}`);
            }
        });

        // Cor primaria para rgba()
        const primaria = dados['color-primary'] || dados.color_primary || '#641838';
        const rgb = hexParaRgb(primaria);
        root.style.setProperty('--theme-primary-rgb', rgb);

        // Cor de destaque (dourado / secundaria) para rgba() dos brilhos
        const destaque = dados['color-secondary'] || dados.color_secondary || '#E7B93F';
        root.style.setProperty('--theme-gold-rgb', hexParaRgb(destaque));

        // Cores adicionais para rgba()
        const dark = dados['color-dark'] || '#0C0716';
        root.style.setProperty('--theme-dark-rgb', hexParaRgb(dark));
        const tertiary = dados['color-tertiary'] || '#A0A0A0';
        root.style.setProperty('--theme-tertiary-rgb', hexParaRgb(tertiary));

        // Gradientes dinâmicos
        const primaryDark = dados['color-primary-dark'] || '#50132D';
        const secondaryDark = dados['color-secondary-dark'] || '#B99432';
        const secondaryLight = dados['color-secondary-light'] || '#FFDE4C';
        root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${primaryDark}, ${primaria})`);
        root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${secondaryDark}, ${destaque})`);
        root.style.setProperty('--gradient-gold', `linear-gradient(135deg, ${secondaryDark}, ${destaque}, ${secondaryLight})`);
        root.style.setProperty('--shadow-gold', `0 4px 20px rgba(${hexParaRgb(destaque)}, 0.3)`);

        // Meta tag theme-color
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.content = primaria;

        // CSS dinamico elegante (sem !important)
        injetarCSSAjustes();
    }

    function hexParaRgb(hex) {
        if (!hex || typeof hex !== 'string') return '231, 185, 63';
        let h = hex.trim();
        if (!h.startsWith('#')) h = '#' + h;
        if (h.length === 4) {
            h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
        }
        if (h.length !== 7) return '231, 185, 63';
        const r = parseInt(h.slice(1,3), 16);
        const g = parseInt(h.slice(3,5), 16);
        const b = parseInt(h.slice(5,7), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return '231, 185, 63';
        return `${r}, ${g}, ${b}`;
    }

    /* ============================================================
       CSS DINAMICO ELEGANTE
    ============================================================ */
    function injetarCSSAjustes() {
        let style = document.getElementById('arqon-theme-ajustes');
        if (!style) {
            style = document.createElement('style');
            style.id = 'arqon-theme-ajustes';
            document.head.appendChild(style);
        }

        style.textContent = `
            ::selection {
                background-color: var(--color-secondary);
                color: var(--color-dark-dark);
            }
            ::-moz-selection {
                background-color: var(--color-secondary);
                color: var(--color-dark-dark);
            }

            .masc-tag.active, .fem-tag.active {
                border-color: var(--color-secondary);
                color: var(--color-secondary);
                background: rgba(var(--theme-gold-rgb), 0.1);
            }
            .masc-filter-options li.active::before,
            .fem-filter-options li.active::before {
                background: var(--color-secondary);
                border-color: var(--color-secondary);
                box-shadow: 0 0 10px rgba(var(--theme-gold-rgb), 0.5);
            }
            .masc-btn-clear:hover, .fem-btn-clear:hover {
                border-color: var(--color-secondary);
                color: var(--color-secondary);
                background: rgba(var(--theme-gold-rgb), 0.05);
            }
            .price-value.highlight {
                color: var(--color-secondary);
                text-shadow: 0 0 10px rgba(var(--theme-gold-rgb), 0.2);
            }
            .action-btn:hover {
                background: var(--color-secondary);
                border-color: var(--color-secondary);
                box-shadow: 0 0 15px rgba(var(--theme-gold-rgb), 0.3);
            }
            .role-badge, .pill-tag {
                background: rgba(var(--theme-gold-rgb), 0.1);
                border-color: rgba(var(--theme-gold-rgb), 0.3);
                color: var(--color-secondary);
            }
            .btn-outline {
                border-color: rgba(var(--theme-gold-rgb), 0.4);
                color: var(--color-secondary);
            }
            .btn-outline:hover {
                border-color: var(--color-secondary);
                background: rgba(var(--theme-gold-rgb), 0.1);
            }
            .file-drop-area:hover, .drag-drop-zone:hover, .drag-drop-zone.dragover {
                border-color: var(--color-secondary);
                background: rgba(var(--theme-gold-rgb), 0.06);
            }
            .file-drop-area i, .zone-icon, .info-icon {
                color: var(--color-secondary);
            }
            .info-icon {
                background: rgba(var(--theme-gold-rgb), 0.08);
            }
            .tab-btn.active, .btn-filter:hover {
                border-color: var(--color-secondary);
            }
            .modal-content::-webkit-scrollbar-thumb:hover {
                background: var(--color-secondary);
            }
            .form-control:focus {
                border-color: var(--color-secondary);
                box-shadow: 0 0 0 2px rgba(var(--theme-gold-rgb), 0.2);
            }
            .cart-badge {
                background: var(--color-primary);
                color: #fff;
            }
            .qa-btn:hover {
                border-color: var(--color-secondary);
                color: var(--color-secondary);
            }

            /* === HEADER === */
            .search-form:focus-within {
                border-color: var(--color-secondary);
                box-shadow: 0 0 15px rgba(var(--theme-gold-rgb), 0.15);
            }
            .login-link:hover {
                background: rgba(var(--theme-gold-rgb), 0.1);
                border-color: var(--color-secondary);
            }
            .arqon-header-avatar-svg-wrapper.logado {
                border-color: var(--color-secondary);
                background-color: rgba(var(--theme-gold-rgb), 0.05);
                color: var(--color-secondary);
                filter: drop-shadow(0 0 5px rgba(var(--theme-gold-rgb), 0.4));
            }
            .avatar-img-header {
                border-color: var(--color-secondary);
                filter: drop-shadow(0 0 5px rgba(var(--theme-gold-rgb), 0.4));
            }

            /* === FOOTER === */
            .footer-brand-text {
                color: var(--color-secondary);
            }
            .footer-link:hover {
                color: var(--color-secondary);
            }
            .social-icon:hover {
                color: var(--color-secondary);
                border-color: var(--color-secondary);
            }
            .newsletter-btn:hover {
                background: var(--color-secondary);
            }
            .footer-bottom-link:hover {
                color: var(--color-secondary);
            }

            /* === BOTÕES === */
            .btn-gold, .btn-primary-gold {
                background: var(--color-secondary);
                color: var(--color-dark);
            }
            .btn-gold:hover, .btn-primary-gold:hover {
                background: var(--color-secondary-light);
                box-shadow: 0 0 20px rgba(var(--theme-gold-rgb), 0.4);
            }
            .btn-wine, .btn-primary {
                background: var(--color-primary);
                color: var(--color-light);
            }
            .btn-wine:hover, .btn-primary:hover {
                background: var(--color-primary-light);
            }

            /* === CARDS E PRODUTOS === */
            .product-card:hover, .card:hover {
                border-color: rgba(var(--theme-gold-rgb), 0.3);
                box-shadow: 0 8px 32px rgba(var(--theme-gold-rgb), 0.1);
            }
            .product-price, .price-highlight {
                color: var(--color-secondary);
            }
            .product-badge, .badge-new, .badge-exclusive {
                background: var(--color-secondary);
                color: var(--color-dark);
            }

            /* === INPUTS E FORMS === */
            input:focus, textarea:focus, select:focus {
                border-color: var(--color-secondary);
                box-shadow: 0 0 0 2px rgba(var(--theme-gold-rgb), 0.15);
            }
            .input-group:focus-within {
                border-color: var(--color-secondary);
            }

            /* === LINKS E NAVEGAÇÃO === */
            a:hover {
                color: var(--color-secondary);
            }
            .nav-link.active, .nav-item.active {
                color: var(--color-secondary);
                border-color: var(--color-secondary);
            }

            /* === CARRINHO === */
            .cart-item-price {
                color: var(--color-secondary);
            }
            .cart-total {
                color: var(--color-secondary);
            }

            /* === CHECKOUT === */
            .checkout-total {
                color: var(--color-secondary);
            }
            .step-indicator.active {
                background: var(--color-secondary);
                color: var(--color-dark);
            }

            /* === PROFILE === */
            .profile-stat-value {
                color: var(--color-secondary);
            }
            .tab-btn.active {
                border-color: var(--color-secondary);
                color: var(--color-secondary);
            }

            /* === LOGO SVG === */
            .arqon-logo-svg path, .arqon-footer-svg path {
                fill: var(--arqon-logo-color, var(--color-text));
            }

            /* === SCROLLBAR === */
            ::-webkit-scrollbar-thumb {
                background: rgba(var(--theme-gold-rgb), 0.3);
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--color-secondary);
            }

            /* === SELECTION === */
            ::selection {
                background: rgba(var(--theme-gold-rgb), 0.3);
                color: var(--color-light);
            }
        `;
    }

    /* ============================================================
       INIT
    ============================================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', carregarTema);
    } else {
        carregarTema();
    }

    // Funcao tema() global para recarregar manualmente
    window.tema = carregarTema;
    window.recargarTema = carregarTema;
})();
