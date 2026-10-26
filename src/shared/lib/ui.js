/* Preferências locais e utilitários de interface. Sem chamadas externas. */
(function () {
  'use strict';
  const memory = new Map();
  const storage = {
    get(key, fallback = null) { try { const value = localStorage.getItem('portfolio:' + key); return value === null ? fallback : JSON.parse(value); } catch (_) { return memory.has(key) ? memory.get(key) : fallback; } },
    set(key, value) { memory.set(key, value); try { localStorage.setItem('portfolio:' + key, JSON.stringify(value)); return true; } catch (_) { return false; } },
    remove(key) { memory.delete(key); try { localStorage.removeItem('portfolio:' + key); } catch (_) {} }
  };
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const paused = () => storage.get('motion', media.matches ? 'paused' : 'active') === 'paused';
  document.documentElement.dataset.motion = paused() ? 'paused' : 'active';
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) {
      const focus = document.activeElement;
      const input = document.createElement('textarea');
      input.value = text; input.setAttribute('aria-label', 'Texto para copiar');
      input.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;height:1px;';
      document.body.appendChild(input); input.select();
      let result = false; try { result = document.execCommand('copy'); } catch (_) {}
      input.remove(); if (focus && focus.focus) focus.focus(); return result;
    }
  }
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  window.PortfolioUI = { storage, copy, normalize, paused };
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); window.PortfolioUI.installPrompt = event;
    document.dispatchEvent(new Event('portfolio:install-ready'));
  });
  media.addEventListener('change', () => {
    document.documentElement.dataset.motion = paused() ? 'paused' : 'active';
    document.dispatchEvent(new Event('portfolio:motion'));
  });
})();
