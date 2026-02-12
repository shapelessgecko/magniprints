/**
 * MagniPrints - Main JavaScript
 * WordPress-Ready Interactive Components
 */

// ========================================
// 1. LENIS SMOOTH SCROLL
// ========================================
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  });
  
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  
  // GSAP ScrollTrigger integration
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// ========================================
// 2. THEME TOGGLE
// ========================================
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const html = document.documentElement;
  const icon = themeToggle.querySelector('.mp-theme-toggle__icon') || themeToggle;
  
  // Check saved theme
  const savedTheme = localStorage.getItem('magniprints-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('magniprints-theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Update WebGL if exists
    if (window.updateWebGLColors) {
      window.updateWebGLColors(newTheme);
    }
  });
  
  function updateThemeIcon(theme) {
    if (icon === themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    } else {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

// ========================================
// 3. MOBILE NAVIGATION
// ========================================
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  
  if (!menuToggle || !mobileNav) return;
  
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    mobileNav.setAttribute('aria-expanded', !expanded);
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });
  
  // Close mobile nav on link click
  mobileNav.querySelectorAll('.mp-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// 4. HEADER SCROLL EFFECT
// ========================================
function initHeaderScroll() {
  const header = document.querySelector('.mp-header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      header.classList.add('mp-header--scrolled');
    } else {
      header.classList.remove('mp-header--scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

// ========================================
// 5. ANIMATION OBSERVER
// ========================================
function initAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// 6. WEBGL BACKGROUND UTILITIES
// ========================================
const WebGLBackgrounds = {
  scenes: [],
  renderers: [],
  cameras: [],
  objects: [],
  
  create(type, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return null;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.parentElement.clientWidth / canvas.parentElement.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const sceneObjects = [];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? 0xffffff : 0x000000;
    const opacity = isDark ? 0.15 : 0.08;
    
    if (type === 'hero') {
      // Floating geometric shapes
      const geometryTypes = [
        new THREE.IcosahedronGeometry(3, 0),
        new THREE.OctahedronGeometry(2.5, 0),
        new THREE.TetrahedronGeometry(2.5, 0),
        new THREE.BoxGeometry(2.5, 2.5, 2.5),
        new THREE.DodecahedronGeometry(2.5, 0)
      ];
      
      for (let i = 0; i < 12; i++) {
        const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
        const material = new THREE.MeshBasicMaterial({
          color: color,
          wireframe: true,
          transparent: true,
          opacity: opacity
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 60;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 20;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.01,
          rotSpeedY: (Math.random() - 0.5) * 0.01,
          floatSpeed: Math.random() * 0.5 + 0.5,
          floatOffset: Math.random() * Math.PI * 2,
          baseY: mesh.position.y
        };
        
        scene.add(mesh);
        sceneObjects.push(mesh);
      }
    } else if (type === 'particles') {
      // Floating particles
      const particleCount = 200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: color,
        size: 0.3,
        transparent: true,
        opacity: opacity * 2
      });
      
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      sceneObjects.push(points);
      
      // Wireframe grid
      const gridHelper = new THREE.GridHelper(50, 20, color, color);
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = opacity * 0.5;
      gridHelper.position.y = -15;
      scene.add(gridHelper);
      sceneObjects.push(gridHelper);
    } else if (type === 'rings') {
      // Rotating 3D print layers
      const ringCount = 8;
      for (let i = 0; i < ringCount; i++) {
        const radius = 3 + i * 1.5;
        const geometry = new THREE.RingGeometry(radius - 0.3, radius, 64);
        const material = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: opacity * (1 - i / ringCount * 0.5)
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.position.z = i * 1 - ringCount / 2;
        ring.userData = { 
          rotSpeed: (ringCount - i) * 0.002,
          baseZ: i * 1 - ringCount / 2
        };
        scene.add(ring);
        sceneObjects.push(ring);
      }
    } else if (type === 'network') {
      // Connected nodes
      const nodeCount = 8;
      const nodes = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity * 4
        });
        const node = new THREE.Mesh(geometry, material);
        
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = 15;
        node.position.x = Math.cos(angle) * radius;
        node.position.y = Math.sin(angle) * radius;
        node.position.z = (Math.random() - 0.5) * 10;
        
        node.userData = { 
          angle: angle,
          radius: radius,
          speed: 0.002 + Math.random() * 0.001,
          phase: i / nodeCount
        };
        
        scene.add(node);
        nodes.push(node);
        sceneObjects.push(node);
      }
      
      // Connecting lines
      const lineGeometry = new THREE.BufferGeometry();
      const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity * 2
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      lines.userData = { nodes: nodes };
      scene.add(lines);
      sceneObjects.push(lines);
    }
    
    this.scenes.push(scene);
    this.renderers.push(renderer);
    this.cameras.push(camera);
    this.objects.push(sceneObjects);
    
    return {
      scene,
      renderer,
      camera,
      objects: sceneObjects
    };
  },
  
  animate() {
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      
      this.scenes.forEach((scene, sceneIndex) => {
        const sceneObjs = this.objects[sceneIndex];
        
        sceneObjs.forEach(obj => {
          if (obj.userData.rotSpeedX !== undefined) {
            obj.rotation.x += obj.userData.rotSpeedX;
            obj.rotation.y += obj.userData.rotSpeedY;
            obj.position.y = obj.userData.baseY + Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 2;
          }
          if (obj.userData.rotSpeed !== undefined) {
            obj.rotation.z += obj.userData.rotSpeed;
            obj.position.z = obj.userData.baseZ + Math.sin(time + obj.userData.rotSpeed * 100) * 1;
          }
          if (obj.userData.angle !== undefined) {
            obj.userData.angle += obj.userData.speed;
            obj.position.x = Math.cos(obj.userData.angle) * obj.userData.radius;
            obj.position.y = Math.sin(obj.userData.angle) * obj.userData.radius;
          }
          if (obj.userData.nodes) {
            // Update connecting lines
            const nodes = obj.userData.nodes;
            const positions = [];
            for (let i = 0; i < nodes.length; i++) {
              for (let j = i + 1; j < nodes.length; j++) {
                const dist = nodes[i].position.distanceTo(nodes[j].position);
                if (dist < 25) {
                  positions.push(
                    nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                    nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                  );
                }
              }
            }
            obj.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
          }
        });
        
        if (this.renderers[sceneIndex]) {
          this.renderers[sceneIndex].render(scene, this.cameras[sceneIndex]);
        }
      });
    };
    animate();
  },
  
  updateColors(theme) {
    const color = theme === 'dark' ? 0xffffff : 0x000000;
    const opacity = theme === 'dark' ? 0.15 : 0.08;
    
    this.scenes.forEach((scene, i) => {
      this.objects[i].forEach(obj => {
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => {
              m.color.setHex(color);
            });
          } else {
            obj.material.color.setHex(color);
          }
        }
      });
      if (this.renderers[i]) {
        this.renderers[i].render(scene, this.cameras[i]);
      }
    });
  },
  
  handleResize() {
    window.addEventListener('resize', () => {
      this.scenes.forEach((scene, i) => {
        if (this.cameras[i]) {
          const canvas = this.renderers[i]?.domElement?.parentElement;
          if (canvas) {
            this.cameras[i].aspect = canvas.clientWidth / canvas.clientHeight;
            this.cameras[i].updateProjectionMatrix();
            this.renderers[i].setSize(canvas.clientWidth, canvas.clientHeight);
          }
        }
      });
    });
  }
};

// ========================================
// 7. FORM VALIDATION
// ========================================
const FormValidator = {
  validate(input, rules) {
    const errors = [];
    const value = input.value.trim();
    
    if (rules.required && !value) {
      errors.push('This field is required');
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} characters required`);
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} characters allowed`);
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || 'Invalid format');
    }
    
    if (rules.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        errors.push('Please enter a valid email');
      }
    }
    
    return errors;
  },
  
  showError(input, message) {
    input.classList.add('mp-input--error');
    const existingError = input.parentElement.querySelector('.mp-form-error');
    if (existingError) existingError.remove();
    
    const errorEl = document.createElement('p');
    errorEl.className = 'mp-form-error';
    errorEl.textContent = message;
    input.parentElement.appendChild(errorEl);
  },
  
  clearError(input) {
    input.classList.remove('mp-input--error');
    const errorEl = input.parentElement.querySelector('.mp-form-error');
    if (errorEl) errorEl.remove();
  },
  
  showSuccess(input) {
    input.classList.add('mp-input--success');
    this.clearError(input);
  }
};

// ========================================
// 8. UTILITY FUNCTIONS
// ========================================
const Utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  formatCurrency(amount, currency = '₹') {
    return `${currency}${amount.toLocaleString('en-IN')}`;
  },
  
  formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  },
  
  generateOrderId() {
    return 'MP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  },
  
  copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve();
  },
  
  sanitizeHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
};

// ========================================
// 9. LAZY LOADING IMAGES
// ========================================
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.onload = () => {
            if (img.classList.contains('mp-skeleton')) {
              img.classList.remove('mp-skeleton');
            }
          };
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ========================================
// 10. INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initTheme();
  initMobileNav();
  initHeaderScroll();
  initAnimations();
  initLazyLoading();
  
  // Expose WebGL Backgrounds globally
  window.WebGLBackgrounds = WebGLBackgrounds;
  window.updateWebGLColors = (theme) => WebGLBackgrounds.updateColors(theme);
  
  // Start WebGL animation loop
  WebGLBackgrounds.animate();
  WebGLBackgrounds.handleResize();
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Utils, FormValidator, WebGLBackgrounds };
}
