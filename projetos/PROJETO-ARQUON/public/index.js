/**
 * ARQON - FRONT-END MAESTRO (index.js)
 * Sincronizado com os IDs corretos do index.html
 */

async function loadComponent(id, file) {
    try {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`[ARQON] O container #${id} não foi encontrado no HTML.`);
            return;
        }
        
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Erro ao buscar arquivo: ${file} (Status: ${res.status})`);
        
        el.innerHTML = await res.text();
        console.log(`[ARQON] Componente ${file} injetado com sucesso em #${id}`);
    } catch (error) {
        console.error(`[ARQON_ERROR] Falha crítica no componente:`, error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. O Maestro injeta o Header (Topo)
    await loadComponent("header", "components/header.html");
    
    // Liga o motor lógico do Header (Login, Busca e Logout)
    if (typeof iniciarHeader === 'function') {
        iniciarHeader();
    }
    
    // 2. Injeta o Main (Corpo do site - onde os produtos aparecem)
    await loadComponent("main", "components/main.html");

    // 3. CARREGA O MOTOR DE CATÁLOGO UNIVERSAL
    // Criamos o script dinamicamente para garantir que ele rode 
    // APENAS DEPOIS que o 'main' já foi injetado no HTML.
    const scriptCatalogo = document.createElement('script');
    scriptCatalogo.src = 'scripts/catalogo-universal.js';
    scriptCatalogo.id = 'motor-catalogo-script';
    document.body.appendChild(scriptCatalogo);
    
    // 4. Injeta o Footer (Rodapé)
    await loadComponent("footer", "components/footer.html");
    
    console.log("[ARQON] Sistema completo e sincronizado.");
});

function atualizarHeaderAuth() {
    // Procura o link de login no seu header. Adapte o seletor se o seu link tiver uma class específica como '.btn-login'
    const loginLinks = document.querySelectorAll('a[href="login.html"], a[href="public/login.html"]');
    const token = localStorage.getItem('arqon_token');
    const nomeUsuario = localStorage.getItem('arqon_user_nome');

    if (token && loginLinks.length > 0) {
        // Se tem token, o usuário está logado!
        loginLinks.forEach(link => {
            // Troca o destino para o perfil
            link.href = 'profile.html';
            
            // Troca o texto para o primeiro nome do usuário (Ex: "PERFIL" ou "MY VAULT")
            const primeiroNome = nomeUsuario ? nomeUsuario.split(' ')[0] : 'VAULT';
            
            // Supondo que seu link tenha um ícone, vamos mantê-lo e mudar o texto
            link.innerHTML = `<i class="fa-solid fa-user-shield"></i> <span>${primeiroNome.toUpperCase()}</span>`;
            
            // Efeito visual para mostrar que ele é VIP/Logado
            link.style.color = 'var(--arqon-gold)';
        });
    }
}

// Chame essa função assim que o Header terminar de carregar!
// Exemplo: se você usa fetch para o header, coloque atualizarHeaderAuth() no `.then()` do fetch.
// Se o header for fixo, use: document.addEventListener('DOMContentLoaded', atualizarHeaderAuth);