/* ============================================
   MagniPrints - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // Theme Toggle
    // ============================================
    
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // ============================================
    // Navigation Scroll Effect
    // ============================================
    
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(5, 5, 5, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
        }
        
        lastScroll = currentScroll;
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
        
        // Features animation
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
            ease: 'power3.out'
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
    // Button Ripple Effect
    // ============================================
    
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
        });
    });
    
    // Add ripple animation to styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
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
    // Mobile Menu Toggle (if needed)
    // ============================================
    
    // Can be expanded for mobile hamburger menu
    
    // ============================================
    // Performance: Pause animations when tab is hidden
    // ============================================
    
    let animationPaused = false;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            animationPaused = true;
        } else {
            animationPaused = false;
        }
    });
    
    console.log('🚀 MagniPrints loaded successfully!');
});
