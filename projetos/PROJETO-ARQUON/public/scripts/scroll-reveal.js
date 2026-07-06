/**
 * ARQON - THE VAULT | Scroll Reveal Animation v2.0
 * Sistema de animação de revelação ao scroll com múltiplos efeitos
 */

class ScrollReveal {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.1;
        this.rootMargin = options.rootMargin || '0px 0px -100px 0px';
        this.init();
    }

    init() {
        // Adiciona classe de elementos a serem revelados
        this.addRevealClasses();

        // Configura Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });

        // Observa elementos
        this.observeElements();
    }

    addRevealClasses() {
        // Adiciona classe aos elementos comuns
        const selectors = [
            '.arq-card',
            '.catalog-grid > div',
            '.section-title',
            '.feature-card',
            '.product-detail',
            '.checkout-item',
            '.filter-section',
            '.sidebar-title',
            '.metric-card',
            '.panel-card',
            '.hero-section',
            '.brand-ticker-item',
            '.collection-card',
            '.new-drop-card',
            '.editorial-card',
            '.step-card',
            '.sustainability-card',
            '.faq-item',
            '.product-card',
            '.vault-tab-content > *',
            '.stat-crypto-card',
            '.agent-avatar-wrapper',
            '.form-group',
            '.modal-content > *'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('scroll-reveal')) {
                    el.classList.add('scroll-reveal');
                    // Determina tipo de animação baseado no elemento
                    this.setAnimationType(el);
                }
            });
        });
    }

    setAnimationType(el) {
        // Define tipo de animação baseado na classe ou elemento
        if (el.classList.contains('fade-in')) {
            el.dataset.revealType = 'fade';
        } else if (el.classList.contains('slide-up')) {
            el.dataset.revealType = 'slideUp';
        } else if (el.classList.contains('slide-left')) {
            el.dataset.revealType = 'slideLeft';
        } else if (el.classList.contains('slide-right')) {
            el.dataset.revealType = 'slideRight';
        } else if (el.classList.contains('zoom-in')) {
            el.dataset.revealType = 'zoom';
        } else if (el.classList.contains('flip-in')) {
            el.dataset.revealType = 'flip';
        } else {
            // Animação padrão baseada no tipo de elemento
            if (el.classList.contains('section-title') || el.classList.contains('hero-section')) {
                el.dataset.revealType = 'slideUp';
            } else if (el.classList.contains('metric-card') || el.classList.contains('stat-crypto-card')) {
                el.dataset.revealType = 'zoom';
            } else if (el.classList.contains('product-card') || el.classList.contains('collection-card')) {
                el.dataset.revealType = 'slideUp';
            } else {
                el.dataset.revealType = 'fade';
            }
        }

        // Define delay se especificado
        const delay = el.dataset.revealDelay || 0;
        el.dataset.revealDelay = delay;
    }

    observeElements() {
        document.querySelectorAll('.scroll-reveal').forEach((el, index) => {
            // Estado inicial baseado no tipo de animação
            this.setInitialState(el);

            // Adiciona stagger delay para grids
            if (el.parentElement.classList.contains('catalog-grid') ||
                el.parentElement.classList.contains('metrics-grid') ||
                el.parentElement.classList.contains('mainframe-stats-grid')) {
                const staggerDelay = index * 50; // 50ms de delay entre elementos
                el.dataset.revealDelay = staggerDelay;
            }

            this.observer.observe(el);
        });
    }

    setInitialState(el) {
        const type = el.dataset.revealType || 'fade';

        switch (type) {
            case 'slideUp':
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                break;
            case 'slideLeft':
                el.style.opacity = '0';
                el.style.transform = 'translateX(40px)';
                break;
            case 'slideRight':
                el.style.opacity = '0';
                el.style.transform = 'translateX(-40px)';
                break;
            case 'zoom':
                el.style.opacity = '0';
                el.style.transform = 'scale(0.9)';
                break;
            case 'flip':
                el.style.opacity = '0';
                el.style.transform = 'rotateY(-90deg)';
                break;
            default: // fade
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
        }

        el.style.transition = `opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)`;
    }

    revealElement(el) {
        const delay = parseInt(el.dataset.revealDelay) || 0;

        setTimeout(() => {
            el.classList.add('revealed');
        }, delay);
    }

    refresh() {
        // Remove classe revealed e reseta estado
        document.querySelectorAll('.scroll-reveal.revealed').forEach(el => {
            el.classList.remove('revealed');
            this.setInitialState(el);
        });

        this.addRevealClasses();
        this.observeElements();
    }

    // Método para revelar elemento manualmente
    reveal(el) {
        if (el) {
            this.revealElement(el);
        }
    }
}

// CSS para animação
const style = document.createElement('style');
style.textContent = `
    .scroll-reveal.revealed {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) scale(1) rotateY(0) !important;
    }

    /* Animações específicas podem ser adicionadas via CSS */
    .scroll-reveal[data-reveal-type="flip"].revealed {
        transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Suporte para animações em cascata */
    .stagger-children > * {
        transition-delay: var(--stagger-delay, 0ms);
    }
`;
document.head.appendChild(style);

// Inicializa quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.scrollReveal = new ScrollReveal();
    });
} else {
    window.scrollReveal = new ScrollReveal();
}

// Expor função global para refresh
window.refreshScrollReveal = () => {
    if (window.scrollReveal) {
        window.scrollReveal.refresh();
    }
};
