/**
 * ARQON - THE VAULT | Authenticated Fetch with Token Refresh
 * Sistema de fetch autenticado com refresh token automático
 */

const API_BASE = '/PROJETO-ARQUON';

/**
 * Tenta renovar o token JWT
 */
async function tentarRefresh() {
    const token = localStorage.getItem('arqon_token');
    if (!token) return false;

    try {
        const response = await fetch(`${API_BASE}/api/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('arqon_token', data.token);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('[ARQON] Erro ao renovar token:', error);
        return false;
    }
}

/**
 * Faz logout do usuário
 */
function logout() {
    localStorage.removeItem('arqon_token');
    localStorage.removeItem('arqon_user');
    window.location.href = '/PROJETO-ARQUON/public/login.html';
}

/**
 * Fetch autenticado com refresh automático
 * @param {string} url - URL da requisição
 * @param {object} options - Opções do fetch
 * @returns {Promise<Response>}
 */
async function fetchAutenticado(url, options = {}) {
    const token = localStorage.getItem('arqon_token');
    
    // Adiciona o token aos headers se não existir
    if (!options.headers) {
        options.headers = {};
    }
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, options);

    // Se receber 401 (Unauthorized), tenta renovar o token
    if (response.status === 401 && token) {
        const refreshed = await tentarRefresh();
        if (refreshed) {
            // Atualiza o token nos headers e tenta novamente
            const newToken = localStorage.getItem('arqon_token');
            options.headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, options);
        } else {
            // Se não conseguiu renovar, faz logout
            logout();
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
    }

    return response;
}

// Exporta para uso global
window.ArqonAuth = {
    fetch: fetchAutenticado,
    refresh: tentarRefresh,
    logout: logout
};
