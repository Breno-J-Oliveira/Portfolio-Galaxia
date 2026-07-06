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
    if (themeSettings.color_primary) {
        document.getElementById('theme-color-primary').value = themeSettings.color_primary.valor;
        document.getElementById('theme-color-primary-text').value = themeSettings.color_primary.valor;
    }
    if (themeSettings.color_primary_light) {
        document.getElementById('theme-color-primary-light').value = themeSettings.color_primary_light.valor;
        document.getElementById('theme-color-primary-light-text').value = themeSettings.color_primary_light.valor;
    }
    if (themeSettings.color_secondary) {
        document.getElementById('theme-color-secondary').value = themeSettings.color_secondary.valor;
        document.getElementById('theme-color-secondary-text').value = themeSettings.color_secondary.valor;
    }
    if (themeSettings.color_tertiary) {
        document.getElementById('theme-color-tertiary').value = themeSettings.color_tertiary.valor;
        document.getElementById('theme-color-tertiary-text').value = themeSettings.color_tertiary.valor;
    }
    if (themeSettings.color_accent) {
        document.getElementById('theme-color-accent').value = themeSettings.color_accent.valor;
        document.getElementById('theme-color-accent-text').value = themeSettings.color_accent.valor;
    }
    if (themeSettings.color_error) {
        document.getElementById('theme-color-error').value = themeSettings.color_error.valor;
        document.getElementById('theme-color-error-text').value = themeSettings.color_error.valor;
    }
    if (themeSettings.color_info) {
        document.getElementById('theme-color-info').value = themeSettings.color_info.valor;
        document.getElementById('theme-color-info-text').value = themeSettings.color_info.valor;
    }
    if (themeSettings.color_bg) {
        document.getElementById('theme-color-bg').value = themeSettings.color_bg.valor;
        document.getElementById('theme-color-bg-text').value = themeSettings.color_bg.valor;
    }
    if (themeSettings.color_surface) {
        document.getElementById('theme-color-surface').value = themeSettings.color_surface.valor;
        document.getElementById('theme-color-surface-text').value = themeSettings.color_surface.valor;
    }
    if (themeSettings.color_text) {
        document.getElementById('theme-color-text').value = themeSettings.color_text.valor;
        document.getElementById('theme-color-text-text').value = themeSettings.color_text.valor;
    }

    // Fontes
    if (themeSettings.font_primary) {
        document.getElementById('theme-font-primary').value = themeSettings.font_primary.valor;
    }
    if (themeSettings.font_secondary) {
        document.getElementById('theme-font-secondary').value = themeSettings.font_secondary.valor;
    }
    if (themeSettings.font_code) {
        document.getElementById('theme-font-code').value = themeSettings.font_code.valor;
    }

    // Espaçamento
    if (themeSettings.border_radius) {
        document.getElementById('theme-border-radius').value = parseInt(themeSettings.border_radius.valor);
        document.getElementById('theme-border-radius-value').textContent = themeSettings.border_radius.valor;
    }
    if (themeSettings.border_radius_large) {
        document.getElementById('theme-border-radius-large').value = parseInt(themeSettings.border_radius_large.valor);
        document.getElementById('theme-border-radius-large-value').textContent = themeSettings.border_radius_large.valor;
    }
    if (themeSettings.spacing_unit) {
        document.getElementById('theme-spacing-unit').value = parseInt(themeSettings.spacing_unit.valor);
        document.getElementById('theme-spacing-unit-value').textContent = themeSettings.spacing_unit.valor;
    }
    if (themeSettings.transition_speed) {
        document.getElementById('theme-transition-speed').value = parseFloat(themeSettings.transition_speed.valor);
        document.getElementById('theme-transition-speed-value').textContent = themeSettings.transition_speed.valor;
    }
}

function configurarEventos() {
    // Cores - Color picker sync com text input
    const colorInputs = [
        { picker: 'theme-color-primary', text: 'theme-color-primary-text', key: 'color_primary' },
        { picker: 'theme-color-primary-light', text: 'theme-color-primary-light-text', key: 'color_primary_light' },
        { picker: 'theme-color-secondary', text: 'theme-color-secondary-text', key: 'color_secondary' },
        { picker: 'theme-color-secondary-light', text: 'theme-color-secondary-light-text', key: 'color_secondary_light' },
        { picker: 'theme-color-tertiary', text: 'theme-color-tertiary-text', key: 'color_tertiary' },
        { picker: 'theme-color-accent', text: 'theme-color-accent-text', key: 'color_accent' },
        { picker: 'theme-color-error', text: 'theme-color-error-text', key: 'color_error' },
        { picker: 'theme-color-info', text: 'theme-color-info-text', key: 'color_info' },
        { picker: 'theme-color-bg', text: 'theme-color-bg-text', key: 'color_bg' },
        { picker: 'theme-color-surface', text: 'theme-color-surface-text', key: 'color_surface' },
        { picker: 'theme-color-text', text: 'theme-color-text-text', key: 'color_text' }
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
        atualizarTemaPreview('font_primary', e.target.value);
    });

    document.getElementById('theme-font-secondary').addEventListener('change', (e) => {
        atualizarTemaPreview('font_secondary', e.target.value);
    });

    document.getElementById('theme-font-code').addEventListener('change', (e) => {
        atualizarTemaPreview('font_code', e.target.value);
    });

    // Espaçamento
    document.getElementById('theme-border-radius').addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        document.getElementById('theme-border-radius-value').textContent = value;
        atualizarTemaPreview('border_radius', value);
    });

    document.getElementById('theme-border-radius-large').addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        document.getElementById('theme-border-radius-large-value').textContent = value;
        atualizarTemaPreview('border_radius_large', value);
    });

    document.getElementById('theme-spacing-unit').addEventListener('input', (e) => {
        const value = e.target.value + 'px';
        document.getElementById('theme-spacing-unit-value').textContent = value;
        atualizarTemaPreview('spacing_unit', value);
    });

    document.getElementById('theme-transition-speed').addEventListener('input', (e) => {
        const value = e.target.value + 's';
        document.getElementById('theme-transition-speed-value').textContent = value;
        atualizarTemaPreview('transition_speed', value);
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
    if (themeSettings.color_primary) root.style.setProperty('--color-primary', themeSettings.color_primary.valor);
    if (themeSettings.color_primary_light) root.style.setProperty('--color-primary-light', themeSettings.color_primary_light.valor);
    if (themeSettings.color_secondary) root.style.setProperty('--color-secondary', themeSettings.color_secondary.valor);
    if (themeSettings.color_tertiary) root.style.setProperty('--color-tertiary', themeSettings.color_tertiary.valor);
    if (themeSettings.color_accent) root.style.setProperty('--color-accent', themeSettings.color_accent.valor);
    if (themeSettings.color_error) root.style.setProperty('--color-error', themeSettings.color_error.valor);
    if (themeSettings.color_info) root.style.setProperty('--color-info', themeSettings.color_info.valor);
    if (themeSettings.color_bg) root.style.setProperty('--color-bg', themeSettings.color_bg.valor);
    if (themeSettings.color_surface) root.style.setProperty('--color-surface', themeSettings.color_surface.valor);
    if (themeSettings.color_text) root.style.setProperty('--color-text', themeSettings.color_text.valor);

    // Fontes
    if (themeSettings.font_primary) root.style.setProperty('--font-primary', themeSettings.font_primary.valor);
    if (themeSettings.font_secondary) root.style.setProperty('--font-secondary', themeSettings.font_secondary.valor);
    if (themeSettings.font_code) root.style.setProperty('--font-code', themeSettings.font_code.valor);

    // Espaçamento
    if (themeSettings.border_radius) root.style.setProperty('--border-radius', themeSettings.border_radius.valor);
    if (themeSettings.border_radius_large) root.style.setProperty('--border-radius-large', themeSettings.border_radius_large.valor);
    if (themeSettings.spacing_unit) root.style.setProperty('--spacing-unit', themeSettings.spacing_unit.valor);
    if (themeSettings.transition_speed) root.style.setProperty('--transition-speed', themeSettings.transition_speed.valor);

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
    payload['color_primary'] = document.getElementById('theme-color-primary').value;
    payload['color_primary_light'] = document.getElementById('theme-color-primary-light').value;
    payload['color_secondary'] = document.getElementById('theme-color-secondary').value;
    payload['color_tertiary'] = document.getElementById('theme-color-tertiary').value;
    payload['color_accent'] = document.getElementById('theme-color-accent').value;
    payload['color_error'] = document.getElementById('theme-color-error').value;
    payload['color_info'] = document.getElementById('theme-color-info').value;
    payload['color_bg'] = document.getElementById('theme-color-bg').value;
    payload['color_surface'] = document.getElementById('theme-color-surface').value;
    payload['color_text'] = document.getElementById('theme-color-text').value;

    // Fontes
    payload['font_primary'] = document.getElementById('theme-font-primary').value;
    payload['font_secondary'] = document.getElementById('theme-font-secondary').value;
    payload['font_code'] = document.getElementById('theme-font-code').value;

    // Espaçamento
    payload['border_radius'] = document.getElementById('theme-border-radius').value + 'px';
    payload['border_radius_large'] = document.getElementById('theme-border-radius-large').value + 'px';
    payload['spacing_unit'] = document.getElementById('theme-spacing-unit').value + 'px';
    payload['transition_speed'] = document.getElementById('theme-transition-speed').value + 's';

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
