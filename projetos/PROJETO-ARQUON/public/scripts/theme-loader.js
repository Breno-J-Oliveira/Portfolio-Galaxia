/**
 * ARQON - THE VAULT | Theme Loader v4
 * Inspirado no prototipo admin. Carrega tema do banco e aplica via CSS variables.
 */

(function() {
    'use strict';

    const API_URL = (typeof ARQON !== 'undefined' && ARQON.api)
        ? ARQON.api + '/tema'
        : '/PROJETO-ARQUON/index.php/api/tema';

    /* ============================================================
       CONFIGURACOES DE TEMA (mapeamento banco -> CSS variables)
    ============================================================ */
    const THEME_VARS = [
        { key:'--color-primary',         dbKey:'color-primary',         fallback:'#E7B93F' },
        { key:'--color-primary-light',   dbKey:'color-primary-light',   fallback:'#FFDE4C' },
        { key:'--color-secondary',       dbKey:'color-secondary',       fallback:'#1A1A2E' },
        { key:'--color-tertiary',        dbKey:'color-tertiary',        fallback:'#A0A0A0' },
        { key:'--color-accent',          dbKey:'color-accent',          fallback:'#10b981' },
        { key:'--color-error',          dbKey:'color-error',          fallback:'#ff5268' },
        { key:'--color-gold',            dbKey:'color-gold',            fallback:'#E7B93F' },
        { key:'--color-dark',            dbKey:'color-dark',            fallback:'#0C0716' },
        { key:'--color-void',            dbKey:'color-void',            fallback:'#0A0612' },
        { key:'--color-text',            dbKey:'color-text',            fallback:'#DEDDDF' },
        { key:'--color-bg',              dbKey:'color-bg',              fallback:'#0C0716' },
        { key:'--color-light',           dbKey:'color-light',           fallback:'#DEDDDF' },
        { key:'--vh-gold',               dbKey:'color-primary',         fallback:'#E7B93F' },
        { key:'--vh-gold-light',         dbKey:'color-primary-light',   fallback:'#FFDE4C' },
        { key:'--vh-dark',               dbKey:'color-dark',            fallback:'#0C0716' },
        { key:'--vh-muted',              dbKey:'color-tertiary',        fallback:'#A0A0A0' },
        { key:'--vh-void',               dbKey:'color-void',            fallback:'#0A0612' },
        { key:'--vh-text',               dbKey:'color-text',            fallback:'#DEDDDF' },
        { key:'--gold',                  dbKey:'color-primary',         fallback:'#E7B93F' },
        { key:'--gold-hover',            dbKey:'color-primary-light',   fallback:'#FFDE4C' },
        { key:'--arqon-gold',            dbKey:'color-gold',            fallback:'#E7B93F' },
        { key:'--bg-main',               dbKey:'color-dark',            fallback:'#0C0716' },
        { key:'--text-gray',             dbKey:'color-tertiary',        fallback:'#A0A0A0' },
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
            const res = await fetch(API_URL, { headers:{ 'Accept':'application/json' } });
            if (res.ok) {
                const json = await res.json();
                if (json.status === 'success' && json.data) {
                    dados = normalizar(json.data);
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
            data.forEach(c => { if (c.chave) out[c.chave] = c.valor || ''; });
        } else if (data && typeof data === 'object') {
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

        // Aplica todas as variaveis
        Object.entries(valores).forEach(([cssVar, valor]) => {
            if (valor) root.style.setProperty(cssVar, valor);
        });

        // Cor primaria para rgba()
        const primaria = dados.color_primary || '#E7B93F';
        const rgb = hexParaRgb(primaria);
        root.style.setProperty('--theme-primary-rgb', rgb);

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
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
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
            /* === FUNDO ESCURO GLOBAL === */
            body, html {
                background-color: var(--color-bg) !important;
                color: var(--color-text) !important;
            }
            main, section, .container, .wrapper, .page, .content, .main-area, .content-area {
                background-color: transparent !important;
            }
            .card, .panel, .modal-content, .dropdown-menu, .popover {
                background-color: rgba(10, 10, 16, 0.95) !important;
            }

            .masc-tag.active, .fem-tag.active {
                border-color: var(--color-primary);
                color: var(--color-primary);
                background: rgba(var(--theme-primary-rgb), 0.1);
            }
            .masc-filter-options li.active::before,
            .fem-filter-options li.active::before {
                background: var(--color-primary);
                border-color: var(--color-primary);
                box-shadow: 0 0 10px rgba(var(--theme-primary-rgb), 0.5);
            }
            .masc-btn-clear:hover, .fem-btn-clear:hover {
                border-color: var(--color-primary);
                color: var(--color-primary);
                background: rgba(var(--theme-primary-rgb), 0.05);
            }
            .price-value.highlight {
                color: var(--color-primary);
                text-shadow: 0 0 10px rgba(var(--theme-primary-rgb), 0.2);
            }
            .action-btn:hover {
                background: var(--color-primary);
                border-color: var(--color-primary);
                box-shadow: 0 0 15px rgba(var(--theme-primary-rgb), 0.3);
            }
            .role-badge, .pill-tag {
                background: rgba(var(--theme-primary-rgb), 0.1);
                border-color: rgba(var(--theme-primary-rgb), 0.3);
                color: var(--color-primary);
            }
            .btn-outline {
                border-color: rgba(var(--theme-primary-rgb), 0.4);
                color: var(--color-primary);
            }
            .btn-outline:hover {
                border-color: var(--color-primary);
                background: rgba(var(--theme-primary-rgb), 0.1);
            }
            .file-drop-area:hover, .drag-drop-zone:hover, .drag-drop-zone.dragover {
                border-color: var(--color-primary);
                background: rgba(var(--theme-primary-rgb), 0.06);
            }
            .file-drop-area i, .zone-icon, .info-icon {
                color: var(--color-primary);
            }
            .info-icon {
                background: rgba(var(--theme-primary-rgb), 0.08);
            }
            .tab-btn.active, .btn-filter:hover {
                border-color: var(--color-primary);
            }
            .modal-content::-webkit-scrollbar-thumb:hover {
                background: var(--color-primary);
            }
            .form-control:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px rgba(var(--theme-primary-rgb), 0.2);
            }
            .cart-badge {
                background: var(--color-primary);
                color: #000;
            }
            .qa-btn:hover {
                border-color: var(--color-primary);
                color: var(--color-primary);
            }

            /* === HEADER === */
            .search-form:focus-within {
                border-color: var(--color-primary);
                box-shadow: 0 0 15px rgba(var(--theme-primary-rgb), 0.15);
            }
            .login-link:hover {
                background: rgba(var(--theme-primary-rgb), 0.1);
                border-color: var(--color-primary);
            }
            .arqon-header-avatar-svg-wrapper.logado {
                border-color: var(--color-primary);
                background-color: rgba(var(--theme-primary-rgb), 0.05);
                color: var(--color-primary);
                filter: drop-shadow(0 0 5px rgba(var(--theme-primary-rgb), 0.4));
            }
            .avatar-img-header {
                border-color: var(--color-primary);
                filter: drop-shadow(0 0 5px rgba(var(--theme-primary-rgb), 0.4));
            }

            /* === FOOTER === */
            .footer-brand-text {
                color: var(--color-primary);
            }
            .footer-link:hover {
                color: var(--color-primary);
            }
            .social-icon:hover {
                color: var(--color-primary);
                border-color: var(--color-primary);
            }
            .newsletter-btn:hover {
                background: var(--color-primary);
            }
            .footer-bottom-link:hover {
                color: var(--color-primary);
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

    // Funcao tema() global
    window.tema = carregarTema;
})();
