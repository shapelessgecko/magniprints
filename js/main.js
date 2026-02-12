/* ============================================
   MagniPrints - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // Theme Toggle - Universal for Desktop & Mobile
    // ============================================
    
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Initialize theme for all toggles
    themeToggles.forEach(toggle => {
        // Add visual feedback on touch
        toggle.addEventListener('mousedown', () => {
            toggle.style.transform = 'scale(0.9)';
        });
        toggle.addEventListener('mouseup', () => {
            toggle.style.transform = '';
        });
        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = '';
        });
        
        // iOS-specific touch handling
        toggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggle.style.transform = 'scale(0.9)';
        }, { passive: false });
        
        toggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggle.style.transform = '';
            
            // Perform theme toggle
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Desktop click handling (separate from touch)
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Prevent double-firing on iOS
            if (e.pointerType === 'touch') return;
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
    
    // ============================================
    // Mobile Hamburger Menu
    // ============================================
    
    const hamburger = document.getElementById('hamburgerMenu');
    const mobileNavSidebar = document.getElementById('mobileNavSidebar');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    
    if (hamburger && mobileNavSidebar && mobileNavOverlay) {
        function openMobileNav() {
            hamburger.classList.add('active');
            mobileNavSidebar.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }
        
        function closeMobileNav() {
            hamburger.classList.remove('active');
            mobileNavSidebar.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Toggle on hamburger click
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (mobileNavSidebar.classList.contains('active')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
        
        // Close on overlay click
        mobileNavOverlay.addEventListener('click', closeMobileNav);
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavSidebar.classList.contains('active')) {
                closeMobileNav();
            }
        });
        
        // Close nav when clicking on a link
        const mobileNavLinks = mobileNavSidebar.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });
        
        // Touch swipe to close
        let touchStartX = 0;
        let touchEndX = 0;
        
        mobileNavSidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        mobileNavSidebar.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 100;
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped left - close menu
                closeMobileNav();
            }
        }
    }
    
    // ============================================
    // Navigation Scroll Effect
    // ============================================
    
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    let scrollRAF = null;
    
    function updateNavBackground() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.style.background = window.matchMedia('(prefers-color-scheme: dark)').matches || 
                document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'rgba(5, 5, 5, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.webkitBackdropFilter = 'blur(20px)';
        } else {
            nav.style.background = document.documentElement.getAttribute('data-theme') === 'light'
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(5, 5, 5, 0.8)';
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', () => {
        if (scrollRAF) cancelAnimationFrame(scrollRAF);
        scrollRAF = requestAnimationFrame(updateNavBackground);
    }, { passive: true });
    
    // ============================================
    // GSAP Animations & ScrollTrigger
    // ============================================
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero entrance animation
        gsap.from('.hero-content', {
            opacity: 0,
            y: 60,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3
        });
        
        gsap.from('.title-line', {
            opacity: 0,
            rotateX: 90,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.5
        });
        
        // Features animation with enhanced stagger
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            rotateX: 10,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
        
        // Stats counter animation
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'));
            
            ScrollTrigger.create({
                trigger: num,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(num, {
                        textContent: target,
                        duration: 2,
                        ease: 'power1.out',
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            num.textContent = Math.round(this.targets()[0].textContent).toLocaleString();
                        }
                    });
                },
                once: true
            });
        });
        
        // Section titles animation
        gsap.from('.section-title', {
            scrollTrigger: {
                trigger: '.section-title',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // CTA animation
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: '.cta',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Product cards stagger animation
        if (document.querySelector('.product-card')) {
            gsap.from('.product-card', {
                scrollTrigger: {
                    trigger: '.products-grid',
                    start: 'top 80%',
                },
                opacity: 0,
                y: 40,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }
    
    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // Button Ripple Effect with iOS optimization
    // ============================================
    
    document.querySelectorAll('.btn, .showcase-btn, .control-btn, .filament-btn, .qty-btn').forEach(btn => {
        function createRipple(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            // Handle both mouse and touch events
            const x = (e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)) - rect.left - size / 2;
            const y = (e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)) - rect.top - size / 2;
            
            if (isNaN(x) || isNaN(y)) return;
            
            const ripple = document.createElement('span');
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
        
        btn.addEventListener('click', createRipple);
        btn.addEventListener('touchend', function(e) {
            // Delay slightly to allow click to fire first
            setTimeout(() => createRipple.call(this, e), 10);
        });
    });
    
    // Add ripple animation to styles
    if (!document.getElementById('ripple-style')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-style';
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    
    // ============================================
    // Intersection Observer for Fade-in Elements
    // ============================================
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });
    
    // ============================================
    // Page Loader
    // ============================================
    
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.classList.add('hidden');
        });
    }
    
    // ============================================
    // Performance: Pause animations when tab is hidden
    // ============================================
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.documentElement.classList.add('animations-paused');
        } else {
            document.documentElement.classList.remove('animations-paused');
        }
    });
    
    // ============================================
    // WebGL Performance Enhancement
    // ============================================
    
    // Detect low-power devices and reduce WebGL complexity
    const isLowPowerDevice = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return true;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Check for software renderers or low-power GPUs
            if (renderer && (renderer.includes('Software') || renderer.includes('SwiftShader'))) {
                return true;
            }
        }
        
        // Check for touch device (often mobile with limited GPU)
        if (window.matchMedia('(pointer: coarse)').matches) {
            return true;
        }
        
        return false;
    };
    
    // Store device capability in data attribute
    if (isLowPowerDevice()) {
        document.documentElement.setAttribute('data-low-power', 'true');
        console.log('📱 Low-power device detected - WebGL optimizations enabled');
    }
    
    // ============================================
    // 3D Viewer Loading Skeleton
    // ============================================
    
    function showViewerSkeleton(viewerId) {
        const viewer = document.getElementById(viewerId);
        if (viewer) {
            viewer.classList.add('skeleton');
        }
    }
    
    function hideViewerSkeleton(viewerId) {
        const viewer = document.getElementById(viewerId);
        if (viewer) {
            viewer.classList.remove('skeleton');
        }
    }
    
    // Auto-show skeleton for showcase canvas
    if (document.getElementById('showcase-canvas')) {
        showViewerSkeleton('showcase-canvas');
        
        // Hide when WebGL initializes (handled in hero-3d.js)
        window.addEventListener('hero3d-loaded', () => {
            hideViewerSkeleton('showcase-canvas');
        });
        
        // Fallback: remove skeleton after 5 seconds if not loaded
        setTimeout(() => {
            hideViewerSkeleton('showcase-canvas');
        }, 5000);
    }
    
    // ============================================
    // Product Showcase Animations
    // ============================================
    
    const showcaseBtns = document.querySelectorAll('.showcase-btn');
    showcaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showcaseBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Dispatch product change event for 3D viewer
            const product = this.dataset.product;
            if (product) {
                window.dispatchEvent(new CustomEvent('product-change', { 
                    detail: { product: product }
                }));
            }
            
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
        });
    });
    
    // ============================================
    // Feature Cards 3D Tilt Effect (Desktop only)
    // ============================================
    
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    if (!window.matchMedia('(pointer: coarse)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    // ============================================
    // iOS Safari Viewport Fix
    // ============================================
    
    // Fix for iOS Safari bottom bar causing viewport issues
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    console.log('🚀 MagniPrints loaded successfully!');
    
    // ============================================
    // Quantity Selector Enhancement
    // ============================================
    
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    
    if (qtyInput && qtyMinus && qtyPlus) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
                qtyInput.dispatchEvent(new Event('change'));
            }
        });
        
        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 100) {
                qtyInput.value = val + 1;
                qtyInput.dispatchEvent(new Event('change'));
            }
        });
        
        // Prevent invalid input
        qtyInput.addEventListener('input', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 1) qtyInput.value = 1;
            if (val > 100) qtyInput.value = 100;
        });
    }
});

// ============================================
// Utility: Debounce function
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Utility: Throttle function
// ============================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
