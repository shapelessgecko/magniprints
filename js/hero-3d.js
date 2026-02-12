/* ============================================
   MagniPrints - Hero 3D Effects
   Morphing Sphere & Particle System
   ============================================ */

(function() {
    'use strict';

    // Detect iOS Safari for simplified rendering
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobile = window.innerWidth < 768 || isIOS;

    // Three.js Setup
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);

    camera.position.z = 5;

    // ============================================
    // Morphing Sphere / Particle System
    // ============================================
    
    const particleCount = isMobile ? 800 : 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x667eea);
    const color2 = new THREE.Color(0x764ba2);
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        // Create sphere distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 1.5 + Math.random() * 0.5;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;
        
        // Gradient colors
        const mixFactor = Math.random();
        tempColor.copy(color1).lerp(color2, mixFactor);
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
        
        sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader Material for particles
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uPixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute vec3 color;
            attribute float size;
            varying vec3 vColor;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uPixelRatio;
            
            void main() {
                vColor = color;
                vec3 pos = position;
                
                // Wave animation
                float wave = sin(pos.x * 2.0 + uTime) * 0.1;
                float wave2 = cos(pos.y * 2.0 + uTime * 0.8) * 0.1;
                pos.z += wave + wave2;
                
                // Mouse interaction - subtle push
                float dist = distance(pos.xy, uMouse * 3.0);
                float push = smoothstep(2.0, 0.0, dist) * 0.2;
                pos += normalize(pos) * push;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Circular particle
                vec2 xy = gl_PointCoord.xy - vec2(0.5);
                float radius = length(xy);
                if (radius > 0.5) discard;
                
                // Glow effect
                float glow = 1.0 - (radius * 2.0);
                glow = pow(glow, 1.5);
                
                gl_FragColor = vec4(vColor, glow * 0.8);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Add connecting lines (for non-mobile)
    let lineSegments;
    if (!isMobile) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(particleCount * 6);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        
        lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineSegments);
    }

    // ============================================
    // Mouse Movement Effect
    // ============================================
    
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }, { passive: true });

    // ============================================
    // 3D Text Effect
    // ============================================
    
    const titleLines = document.querySelectorAll('[data-3d-text]');
    
    function update3DText() {
        const rotateX = mouseY * 5;
        const rotateY = mouseX * 5;
        
        titleLines.forEach((line, index) => {
            const depth = index === 0 ? 1 : -1;
            line.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY * depth}deg) translateZ(${index * 10}px)`;
        });
    }

    // ============================================
    // Animation Loop
    // ============================================
    
    let lastTime = 0;
    const frameInterval = isMobile ? 33 : 16; // 30fps on mobile, 60fps on desktop
    
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameInterval) return;
        lastTime = currentTime;
        
        const time = currentTime * 0.001;
        
        // Smooth mouse movement
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Update uniforms
        particleMaterial.uniforms.uTime.value = time;
        particleMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
        
        // Rotate particles slowly
        particles.rotation.y = time * 0.1;
        particles.rotation.x = Math.sin(time * 0.2) * 0.1;
        
        // Update line connections (not every frame for performance)
        if (lineSegments && Math.floor(time * 10) % 3 === 0) {
            updateConnections();
        }
        
        // Update 3D text response
        update3DText();
        
        renderer.render(scene, camera);
    }
    
    function updateConnections() {
        const positions = geometry.attributes.position.array;
        const linePositions = lineSegments.geometry.attributes.position.array;
        let lineIndex = 0;
        const connectionDistance = 0.8;
        const maxConnections = 3;
        
        for (let i = 0; i < particleCount; i++) {
            let connections = 0;
            for (let j = i + 1; j < particleCount; j++) {
                if (connections >= maxConnections) break;
                
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < connectionDistance) {
                    linePositions[lineIndex++] = positions[i * 3];
                    linePositions[lineIndex++] = positions[i * 3 + 1];
                    linePositions[lineIndex++] = positions[i * 3 + 2];
                    linePositions[lineIndex++] = positions[j * 3];
                    linePositions[lineIndex++] = positions[j * 3 + 1];
                    linePositions[lineIndex++] = positions[j * 3 + 2];
                    connections++;
                    
                    if (lineIndex >= particleCount * 6) break;
                }
            }
            if (lineIndex >= particleCount * 6) break;
        }
        
        // Clear remaining lines
        while (lineIndex < particleCount * 6) {
            linePositions[lineIndex++] = 0;
        }
        
        lineSegments.geometry.attributes.position.needsUpdate = true;
    }

    // ============================================
    // Resize Handler
    // ============================================
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    }, { passive: true });

    // ============================================
    // Scroll Effects
    // ============================================
    
    let scrollY = 0;
    let targetScrollY = 0;
    
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });
    
    function updateScrollEffects() {
        scrollY += (targetScrollY - scrollY) * 0.1;
        
        // Parallax effect on particles
        particles.position.y = -scrollY * 0.001;
        
        requestAnimationFrame(updateScrollEffects);
    }
    updateScrollEffects();

    // Start animation
    animate(0);

    // ============================================
    // Showcase 3D Viewer
    // ============================================
    
    const showcaseContainer = document.getElementById('showcase-canvas');
    if (showcaseContainer) {
        initShowcaseViewer(showcaseContainer);
    }

    function initShowcaseViewer(container) {
        const showcaseScene = new THREE.Scene();
        showcaseScene.background = new THREE.Color(0x111111);
        
        const showcaseCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        showcaseCamera.position.set(0, 0, 8);
        
        const showcaseRenderer = new THREE.WebGLRenderer({ antialias: true });
        showcaseRenderer.setSize(container.clientWidth, container.clientHeight);
        showcaseRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        showcaseRenderer.shadowMap.enabled = true;
        showcaseRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(showcaseRenderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        showcaseScene.add(ambientLight);
        
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        showcaseScene.add(keyLight);
        
        const rimLight = new THREE.PointLight(0x667eea, 0.5);
        rimLight.position.set(-5, 3, -5);
        showcaseScene.add(rimLight);
        
        // Current product mesh
        let currentMesh = null;
        let currentProduct = 'stand';
        
        // Product geometries
        function createPhoneStand() {
            const group = new THREE.Group();
            
            // Base
            const base = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.4, 3),
                new THREE.MeshStandardMaterial({ color: 0x667eea, roughness: 0.3, metalness: 0.2 })
            );
            base.position.y = -1;
            base.castShadow = true;
            group.add(base);
            
            // Back support
            const support = new THREE.Mesh(
                new THREE.BoxGeometry(2.5, 2, 0.5),
                new THREE.MeshStandardMaterial({ color: 0x764ba2, roughness: 0.3, metalness: 0.2 })
            );
            support.position.set(0, 0.2, -1);
            support.rotation.x = -0.3;
            support.castShadow = true;
            group.add(support);
            
            // Bottom lip
            const lip = new THREE.Mesh(
                new THREE.BoxGeometry(2.8, 0.3, 0.8),
                new THREE.MeshStandardMaterial({ color: 0x667eea, roughness: 0.3, metalness: 0.2 })
            );
            lip.position.set(0, -0.3, 0.8);
            lip.castShadow = true;
            group.add(lip);
            
            return group;
        }
        
        function createPlanter() {
            const group = new THREE.Group();
            
            // Main pot
            const pot = new THREE.Mesh(
                new THREE.CylinderGeometry(1.8, 1.2, 3, 32),
                new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4, metalness: 0.1 })
            );
            pot.position.y = 0;
            pot.castShadow = true;
            group.add(pot);
            
            // Soil
            const soil = new THREE.Mesh(
                new THREE.CircleGeometry(1.5, 32),
                new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 })
            );
            soil.position.y = 1.4;
            soil.rotation.x = -Math.PI / 2;
            group.add(soil);
            
            // Small plant (stylized)
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 1.5),
                new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
            );
            stem.position.y = 2;
            group.add(stem);
            
            const leaf1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x4ade80 })
            );
            leaf1.position.set(0.3, 2.5, 0);
            leaf1.scale.z = 0.3;
            group.add(leaf1);
            
            const leaf2 = new THREE.Mesh(
                new THREE.SphereGeometry(0.35, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x4ade80 })
            );
            leaf2.position.set(-0.25, 2.3, 0.2);
            leaf2.scale.z = 0.3;
            group.add(leaf2);
            
            return group;
        }
        
        function createOrganizer() {
            const group = new THREE.Group();
            
            // Main tray
            const tray = new THREE.Mesh(
                new THREE.BoxGeometry(4, 0.3, 3),
                new THREE.MeshStandardMaterial({ color: 0x667eea, roughness: 0.3, metalness: 0.2 })
            );
            tray.position.y = -0.5;
            tray.castShadow = true;
            group.add(tray);
            
            // Pen holder
            const penH = new THREE.Mesh(
                new THREE.CylinderGeometry(0.8, 0.8, 2, 24),
                new THREE.MeshStandardMaterial({ color: 0x764ba2, roughness: 0.3, metalness: 0.2 })
            );
            penH.position.set(-1.2, 0.5, -0.5);
            penH.castShadow = true;
            group.add(penH);
            
            // Small tray
            const smallT = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 1, 1.5),
                new THREE.MeshStandardMaterial({ color: 0x667eea, roughness: 0.3, metalness: 0.2 })
            );
            smallT.position.set(1, 0, 0.5);
            smallT.castShadow = true;
            group.add(smallT);
            
            // Phone slot
            const slot = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.8, 2.5),
                new THREE.MeshStandardMaterial({ color: 0x764ba2, roughness: 0.3, metalness: 0.2 })
            );
            slot.position.set(0, 0.2, 0);
            slot.castShadow = true;
            group.add(slot);
            
            return group;
        }
        
        function createControllerStand() {
            const group = new THREE.Group();
            
            // Base platform
            const base = new THREE.Mesh(
                new THREE.BoxGeometry(5, 0.5, 3),
                new THREE.MeshStandardMaterial({ color: 0x667eea, roughness: 0.3, metalness: 0.2 })
            );
            base.position.y = -1;
            base.castShadow = true;
            group.add(base);
            
            // Cradles for controllers
            const cradle1 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16, 1, false, 0, Math.PI),
                new THREE.MeshStandardMaterial({ color: 0x764ba2, roughness: 0.3, metalness: 0.2 })
            );
            cradle1.position.set(-1.5, -0.2, 0);
            cradle1.rotation.z = Math.PI / 2;
            cradle1.castShadow = true;
            group.add(cradle1);
            
            const cradle2 = cradle1.clone();
            cradle2.position.set(1.5, -0.2, 0);
            group.add(cradle2);
            
            return group;
        }
        
        function loadProduct(type) {
            if (currentMesh) {
                showcaseScene.remove(currentMesh);
            }
            
            switch(type) {
                case 'stand':
                    currentMesh = createPhoneStand();
                    break;
                case 'planter':
                    currentMesh = createPlanter();
                    break;
                case 'organizer':
                    currentMesh = createOrganizer();
                    break;
                case 'controller':
                    currentMesh = createControllerStand();
                    break;
                default:
                    currentMesh = createPhoneStand();
            }
            
            showcaseScene.add(currentMesh);
            currentProduct = type;
        }
        
        // Load initial product
        loadProduct('stand');
        
        // Button handlers
        document.querySelectorAll('.showcase-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.showcase-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadProduct(btn.dataset.product);
            });
        });
        
        // Animation
        function animateShowcase() {
            requestAnimationFrame(animateShowcase);
            
            if (currentMesh) {
                currentMesh.rotation.y += 0.005;
            }
            
            showcaseRenderer.render(showcaseScene, showcaseCamera);
        }
        animateShowcase();
        
        // Resize handler
        window.addEventListener('resize', () => {
            showcaseCamera.aspect = container.clientWidth / container.clientHeight;
            showcaseCamera.updateProjectionMatrix();
            showcaseRenderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // ============================================
    // Card Tilt Effect
    // ============================================
    
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

})();
