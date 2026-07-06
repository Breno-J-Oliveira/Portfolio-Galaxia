/**
 * ARQON - THE VAULT | Toast Notifications System
 * Sistema de notificações universal para feedback ao usuário
 */

class ArqonToast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Cria o container de toasts se não existir
        if (!document.getElementById('arqon-toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'arqon-toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('arqon-toast-container');
        }
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        
        // Define cores baseadas no tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.style.cssText = `
            background: rgba(10, 1, 7, 0.95);
            border-left: 4px solid ${colors[type]};
            color: #fff;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            font-family: var(--font-main, 'Segoe UI', sans-serif);
            font-size: 14px;
        `;

        toast.innerHTML = `
            <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 18px;"></i>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        // Remove após a duração
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Adiciona animações CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @media (max-width: 480px) {
        #arqon-toast-container {
            top: 10px !important;
            right: 10px !important;
            left: 10px !important;
        }
        #arqon-toast-container > div {
            min-width: auto !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 12px 16px !important;
            font-size: 13px !important;
        }
    }
`;
document.head.appendChild(toastStyle);

// Instância global
window.ArqonToast = new ArqonToast();

// Atalhos globais — objeto callable (suporta tanto toast('msg','type') quanto toast.success('msg'))
const _toast = function(message, type = 'info', duration) {
    const t = type.toLowerCase();
    if (['success','error','warning','info'].includes(t)) {
        window.ArqonToast.show(message, t, duration);
    } else {
        window.ArqonToast.info(message, duration);
    }
};
_toast.success = (msg, dur) => window.ArqonToast.success(msg, dur);
_toast.error   = (msg, dur) => window.ArqonToast.error(msg, dur);
_toast.warning = (msg, dur) => window.ArqonToast.warning(msg, dur);
_toast.info    = (msg, dur) => window.ArqonToast.info(msg, dur);
window.toast = _toast;
window.arqonToast = _toast;
