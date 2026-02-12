// ========================================
// MAGNIPRINTS THEME SYSTEM
// ========================================

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('magniprints-theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createToggle();
    this.updateBodyClass();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.updateToggleUI(theme);
  }

  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('magniprints-theme', newTheme);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: newTheme } 
    }));
  }

  createToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark/light mode');
    toggle.innerHTML = `
      <span class="theme-icon ${this.currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">🌙</span>
      <span class="theme-icon ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light">☀️</span>
    `;
    
    toggle.addEventListener('click', () => this.toggle());
    document.body.appendChild(toggle);
  }

  updateToggleUI(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      icon.classList.toggle('active', icon.dataset.theme === theme);
    });
  }

  updateBodyClass() {
    // This helps with any CSS that needs to know theme
    document.body.classList.toggle('dark-mode', this.currentTheme === 'dark');
    document.body.classList.toggle('light-mode', this.currentTheme === 'light');
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Also export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
