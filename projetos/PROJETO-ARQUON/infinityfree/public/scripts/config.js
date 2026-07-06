/**
 * ARQON - THE VAULT | Global Configuration
 * Central configuration for all frontend scripts
 */

// Auto-detect base path para suportar subdiretórios no localhost (XAMPP) e raiz em Produção
let basePath = '';
const pathname = window.location.pathname;
if (pathname.includes('/PROJETO-ARQUON/infinityfree')) {
    basePath = '/PROJETO-ARQUON/infinityfree';
}

const ARQON = {
    api: basePath + '/api',
    uploads: basePath + '/public/uploads/',
    version: '1.0.0'
};

// Backward compatibility - keep ARQON_CONFIG for existing code
const ARQON_CONFIG = {
    apiBaseUrl: ARQON.api
};

// Base de API global usada por home.js, catalogo-universal.js, etc.
window.ARQON_API_BASE = ARQON.api;

// Helper universal para resolver URLs de imagens vindas do banco (uploads)
window.arqonImageUrl = function (path) {
    const fallback = 'https://placehold.co/400x500/0a0107/dcb23c?text=ARQON';
    if (!path || path === 'null' || path === 'undefined') return fallback;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) return path;
    return ARQON.uploads + path;
};

// Navegação global usada no header
window.navigateTo = function(page) {
    const routes = {
        home: 'index.html',
        catalogo: 'catalogo.html',
        masculino: 'masculino.html',
        feminino: 'feminino.html',
        login: 'login.html',
        profile: 'profile.html'
    };
    if (routes[page]) {
        window.location.href = routes[page];
    }
};
