/**
 * ARQON - THE VAULT | Theme Editor Script
 * Finalidade: Edição ao vivo do tema do site
 */

let themeSettings = {};

document.addEventListener('DOMContentLoaded', () => {
    carregarTema();
    configurarEventos();
    aplicarTemaPreview();
});

function carregarTema() {
    fetch(`${ARQON_CONFIG.apiBaseUrl}/tema`)
        .then(r => r.json())
        .then(result => {
            if (result.status === 'success') {
                themeSettings = result.data;
                preencherFormulario();
                aplicarTemaAoSite();
            }
        })
        .catch(error => console.error('[ARQON THEME] Erro ao carregar tema:', error));
}

function preencherFormulario() {
    // Cores
    if (themeSettings['color-primary']) {
        document.getElementById('theme-color-primary').value = themeSettings['color-primary'].valor;
        document.getElementById('theme-color-primary-text').value = themeSettings['color-primary'].valor;
    }
    if (themeSettings['color-primary-light']) {
        document.getElementById('theme-color-primary-light').value = themeSettings['color-primary-light'].valor;
        document.getElementById('theme-color-primary-light-text').value = themeSettings['color-primary-light'].valor;
    }
    if (themeSettings['color-secondary']) {
        document.getElementById('theme-color-secondary').value = themeSettings['color-secondary'].valor;
        document.getElementById('theme-color-secondary-text').value = themeSettings['color-secondary'].valor;
    }
    if (themeSettings['color-tertiary']) {
        document.getElementById('theme-color-tertiary').value = themeSettings['color-tertiary'].valor;
        document.getElementById('theme-color-tertiary-text').value = themeSettings['color-tertiary'].valor;
    }
    if (themeSettings['color-accent']) {
        document.getElementById('theme-color-accent').value = themeSettings['color-accent'].valor;
        document.getElementById('theme-color-accent-text').value = themeSettings['color-accent'].valor;
    }
    if (themeSettings['color-error']) {
        document.getElementById('theme-color-error').value = themeSettings['color-error'].valor;
        document.getElementById('theme-color-error-text').value = themeSettings['color-error'].valor;
    }
    if (themeSettings['color-info']) {
        document.getElementById('theme-color-info').value = themeSettings['color-info'].valor;
        document.getElementById('theme-color-info-text').value = themeSettings['color-info'].valor;
    }
    if (themeSettings['color-bg']) {
        document.getElementById('theme-color-bg').value = themeSettings['color-bg'].valor;
        document.getElementById('theme-color-bg-text').value = themeSettings['color-bg'].valor;
    }
    if (themeSettings['color-surface']) {
        document.getElementById('theme-color-surface').value = themeSettings['color-surface'].valor;
        document.getElementById('theme-color-surface-text').value = themeSettings['color-surface'].valor;
    }
    if (themeSettings['color-text']) {
        document.getElementById('theme-color-text').value = themeSettings['color-text'].valor;
        document.getElementById('theme-color-text-text').value = themeSettings['color-text'].valor;
    }

    // Fontes
    if (themeSettings['font-primary']) {
        document.getElementById('theme-font-primary').value = themeSettings['font-primary'].valor;
    }
    if (themeSettings['font-secondary']) {
        document.getElementById('theme-font-secondary').value = themeSettings['font-secondary'].valor;
    }
    if (themeSettings['font-code']) {
        document.getElementById('theme-font-code').value = themeSettings['font-code'].valor;
    }

    // Espaçamento
    if (themeSettings['border-radius']) {
        document.getElementById('theme-border-radius').value = parseInt(themeSettings['border-radius'].valor);
        document.getElementById('theme-border-radius-value').textContent = themeSettings['border-radius'].valor;
    }
    if (themeSettings['border-radius-large']) {
        document.getElementById('theme-border-radius-large').value = parseInt(themeSettings['border-radius-large'].valor);
        document.getElementById('theme-border-radius-large-value').textContent = themeSettings['border-radius-large'].valor;
    }
    if (themeSettings['spacing-unit']) {
        document.getElementById('theme-spacing-unit').value = parseInt(themeSettings['spacing-unit'].valor);
        document.getElementById('theme-spacing-unit-value').textContent = themeSettings['spacing-unit'].valor;
    }
    if (themeSettings['transition-speed']) {
        document.getElementById('theme-transition-speed').value = parseFloat(themeSettings['transition-speed'].valor);
        document.getElementById('theme-transition-speed-value').textContent = themeSettings['transition-speed'].valor;
    }
}

function configurarEventos() {
    // Cores - Color picker sync com text input
    const colorInputs = [
        { picker: 'theme-color-primary', text: 'theme-color-primary-text', key: 'color-primary' },
        { picker: 'theme-color-primary-light', text: 'theme-color-primary-light-text', key: 'color-primary-light' },
        { picker: 'theme-color-secondary', text: 'theme-color-secondary-text', key: 'color-secondary' },
        { picker: 'theme-color-secondary-light', text: 'theme-color-secondary-light-text', key: 'color-secondary-light' },
        { picker: 'theme-color-tertiary', text: 'theme-color-tertiary-text', key: 'color-tertiary' },
        { picker: 'theme-color-accent', text: 'theme-color-accent-text', key: 'color-accent' },
        { picker: 'theme-color-error', text: 'theme-color-error-text', key: 'color-error' },
        { picker: 'theme-color-info', text: 'theme-color-info-text', key: 'color-info' },
        { picker: 'theme-color-bg', text: 'theme-color-bg-text', key: 'color-bg' },
        { picker: 'theme-color-surface', text: 'theme-color-surface-text', key: 'color-surface' },
        { picker: 'theme-color-text', text: 'theme-color-text-text', key: 'color-text' }
    ];

    colorInputs.forEach(item => {
        const picker = document.getElementById(item.picker);
        const text = document.getElementById(item.text);

        picker.addEventListener('input', (e) => {
            text.value = e.target.value;
            atualizarTemaPreview(item.key, e.target.value);
        });

        text.addEventListener('input', (e) => {
            picker.value = e.target.value;
            atualizarTemaPreview(item.key, e.target.value);
        });
    });

    // Fontes
    document.getElementById('theme-font-primary').addEventListener('change', (e) => {
        atualizarTemaPreview('font-primary', e.target.value);
    });

    document.getElementById('theme-font-secondary').addEventListener('change', (e) => {
        atualizarTemaPreview('font-secondary', e.target.value);
    });

    document.getElementById('theme-font-code').addEventListener('change', (e) => {
        atualizarTemaPreview('font-code', e.target.value);
    });

    // Espaçamento
    document.getElementById('theme-border-radius').addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        document.getElementById('theme-border-radius-value').textContent = value;
        atualizarTemaPreview('border-radius', value);
    });

    document.getElementById('theme-border-radius-large').addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        document.getElementById('theme-border-radius-large-value').textContent = value;
        atualizarTemaPreview('border-radius-large', value);
    });

    document.getElementById('theme-spacing-unit').addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        document.getElementById('theme-spacing-unit-value').textContent = value;
        atualizarTemaPreview('spacing-unit', value);
    });

    document.getElementById('theme-transition-speed').addEventListener('input', (e) => {
        const value = e.target.value + 's';
        document.getElementById('theme-transition-speed-value').textContent = value;
        atualizarTemaPreview('transition-speed', value);
    });

    // Botões
    document.getElementById('btn-salvar-tema').addEventListener('click', salvarTema);
    document.getElementById('btn-resetar-tema').addEventListener('click', resetarTema);
    document.getElementById('btn-preview-tema').addEventListener('click', abrirPreviewSite);
}

function atualizarTemaPreview(chave, valor) {
    themeSettings[chave] = { valor: valor };
    aplicarTemaAoSite();

    // Salva preview no localStorage para outras páginas refletirem a mudança
    const previewData = {};
    Object.entries(themeSettings).forEach(([k, v]) => {
        if (v && typeof v === 'object' && v.valor) previewData[k] = v.valor;
        else if (typeof v === 'string') previewData[k] = v;
    });
    localStorage.setItem('arqon_theme_preview', JSON.stringify(previewData));
}

function aplicarTemaAoSite() {
    const root = document.documentElement;

    // Cores
    if (themeSettings['color-primary']) root.style.setProperty('--color-primary', themeSettings['color-primary'].valor);
    if (themeSettings['color-primary-light']) root.style.setProperty('--color-primary-light', themeSettings['color-primary-light'].valor);
    if (themeSettings['color-secondary']) root.style.setProperty('--color-secondary', themeSettings['color-secondary'].valor);
    if (themeSettings['color-tertiary']) root.style.setProperty('--color-tertiary', themeSettings['color-tertiary'].valor);
    if (themeSettings['color-accent']) root.style.setProperty('--color-accent', themeSettings['color-accent'].valor);
    if (themeSettings['color-error']) root.style.setProperty('--color-error', themeSettings['color-error'].valor);
    if (themeSettings['color-info']) root.style.setProperty('--color-info', themeSettings['color-info'].valor);
    if (themeSettings['color-bg']) root.style.setProperty('--color-bg', themeSettings['color-bg'].valor);
    if (themeSettings['color-surface']) root.style.setProperty('--color-surface', themeSettings['color-surface'].valor);
    if (themeSettings['color-text']) root.style.setProperty('--color-text', themeSettings['color-text'].valor);

    // Fontes
    if (themeSettings['font-primary']) root.style.setProperty('--font-primary', themeSettings['font-primary'].valor);
    if (themeSettings['font-secondary']) root.style.setProperty('--font-secondary', themeSettings['font-secondary'].valor);
    if (themeSettings['font-code']) root.style.setProperty('--font-code', themeSettings['font-code'].valor);

    // Espaçamento
    if (themeSettings['border-radius']) root.style.setProperty('--border-radius', themeSettings['border-radius'].valor);
    if (themeSettings['border-radius-large']) root.style.setProperty('--border-radius-large', themeSettings['border-radius-large'].valor);
    if (themeSettings['spacing-unit']) root.style.setProperty('--spacing-unit', themeSettings['spacing-unit'].valor);
    if (themeSettings['transition-speed']) root.style.setProperty('--transition-speed', themeSettings['transition-speed'].valor);

    // Aplica o mesmo mapeamento usado pelo theme-loader.js para cobrir todas as páginas
    if (typeof aplicarMapeamentoTema === 'function') {
        const flatSettings = {};
        Object.entries(themeSettings).forEach(([k, v]) => {
            if (v && typeof v === 'object' && v.valor) flatSettings[k] = v.valor;
            else if (typeof v === 'string') flatSettings[k] = v;
        });
        aplicarMapeamentoTema(root, flatSettings);
    }

    // Aplicar no preview
    aplicarTemaPreview();
}

function aplicarTemaPreview() {
    const preview = document.getElementById('theme-preview');
    if (!preview) return;

    const root = document.documentElement;
    
    preview.style.backgroundColor = root.style.getPropertyValue('--color-secondary') || '#1A1A2E';
    preview.style.color = root.style.getPropertyValue('--color-tertiary') || '#A0A0A0';
    preview.style.borderRadius = root.style.getPropertyValue('--border-radius') || '8px';
    preview.style.fontFamily = root.style.getPropertyValue('--font-secondary') || 'Inter, sans-serif';

    const previewCard = preview.querySelector('.preview-card');
    if (previewCard) {
        previewCard.style.backgroundColor = root.style.getPropertyValue('--color-primary-light') || '#FFDE4C';
        previewCard.style.color = '#000';
        previewCard.style.borderRadius = root.style.getPropertyValue('--border-radius-large') || '16px';
        previewCard.querySelector('h4').style.fontFamily = root.style.getPropertyValue('--font-primary') || 'Cinzel, serif';
    }

    const previewBtn = preview.querySelector('.preview-btn');
    if (previewBtn) {
        previewBtn.style.backgroundColor = root.style.getPropertyValue('--color-primary') || '#E7B93F';
        previewBtn.style.borderRadius = root.style.getPropertyValue('--border-radius') || '8px';
        previewBtn.style.transition = `all ${root.style.getPropertyValue('--transition-speed') || '0.3s'}`;
    }

    const previewBadge = preview.querySelector('.preview-badge');
    if (previewBadge) {
        previewBadge.style.backgroundColor = root.style.getPropertyValue('--color-accent') || '#10b981';
    }

    const previewError = preview.querySelector('.preview-error');
    if (previewError) {
        previewError.style.backgroundColor = root.style.getPropertyValue('--color-error') || '#ff5268';
    }
}

function salvarTema() {
    const payload = {};

    // Cores
    payload['color-primary'] = document.getElementById('theme-color-primary').value;
    payload['color-primary-light'] = document.getElementById('theme-color-primary-light').value;
    payload['color-secondary'] = document.getElementById('theme-color-secondary').value;
    payload['color-tertiary'] = document.getElementById('theme-color-tertiary').value;
    payload['color-accent'] = document.getElementById('theme-color-accent').value;
    payload['color-error'] = document.getElementById('theme-color-error').value;
    payload['color-info'] = document.getElementById('theme-color-info').value;
    payload['color-bg'] = document.getElementById('theme-color-bg').value;
    payload['color-surface'] = document.getElementById('theme-color-surface').value;
    payload['color-text'] = document.getElementById('theme-color-text').value;

    // Fontes
    payload['font-primary'] = document.getElementById('theme-font-primary').value;
    payload['font-secondary'] = document.getElementById('theme-font-secondary').value;
    payload['font-code'] = document.getElementById('theme-font-code').value;

    // Espaçamento
    payload['border-radius'] = document.getElementById('theme-border-radius').value + 'px';
    payload['border-radius-large'] = document.getElementById('theme-border-radius-large').value + 'px';
    payload['spacing-unit'] = document.getElementById('theme-spacing-unit').value + 'px';
    payload['transition-speed'] = document.getElementById('theme-transition-speed').value + 's';

    fetch(`${ARQON_CONFIG.apiBaseUrl}/tema/batch`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Tema salvo com sucesso!');
        } else {
            alert('Erro ao salvar tema: ' + result.message);
        }
    })
    .catch(error => {
        console.error('[ARQON THEME] Erro ao salvar tema:', error);
        alert('Erro ao salvar tema.');
    });
}

function resetarTema() {
    if (!confirm('Deseja resetar o tema para o padrão?')) return;

    fetch(`${ARQON_CONFIG.apiBaseUrl}/tema/reset`, {
        method: 'POST'
    })
    .then(r => r.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Tema resetado com sucesso!');
            carregarTema();
        } else {
            alert('Erro ao resetar tema: ' + result.message);
        }
    })
    .catch(error => {
        console.error('[ARQON THEME] Erro ao resetar tema:', error);
        alert('Erro ao resetar tema.');
    });
}

function abrirPreviewSite() {
    window.open('catalogo.html', '_blank');
}
