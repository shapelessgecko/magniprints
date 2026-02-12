/* ============================================
   MagniPrints - Hero 3D Effects
   Optimized Morphing Sphere & Particle System
   ============================================ */

(function() {
    'use strict';

    // Device Detection
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isMobile = window.innerWidth < 768 || isIOS || isAndroid;
    const isLowPower = document.documentElement.getAttribute('data-low-power') === 'true';
    
    // Performance Settings
    const CONFIG = {
        desktop: {
            particleCount: 2000,
            antialias: true,
            pixelRatio: 2,
            fps: 60,
            frameInterval: 16,
            maxConnections: 3,
            connectionDistance: 0.8,
            shadows: true
        },
        mobile: {
            particleCount: 800,
            antialias: false,
            pixelRatio: 1.5,
            fps: 30,
            frameInterval: 33,
            maxConnections: 2,
            connectionDistance: 0.6,
            shadows: false
        },
        lowPower: {
            particleCount: 400,
            antialias: false,
            pixelRatio: 1,
            fps: 30,
            frameInterval: 33,
            maxConnections: 1,
            connectionDistance: 0.5,
            shadows: false,
            disableLines: true
        }
    };
    
    const settings = isLowPower ? CONFIG.lowPower : (isMobile ? CONFIG.mobile : CONFIG.desktop);

    // Three.js Setup
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    
    // Check WebGL support
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.warn('WebGL not supported - falling back to static background');
        canvas.style.display = 'none';
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: settings.antialias,
        alpha: true,
        powerPreference: isLowPower ? 'low-power' : 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
    renderer.setClearColor(0x000000, 0);

    camera.position.z = 5;
    
    // Enable context loss recovery
    canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('WebGL context lost - attempting recovery');
        location.reload();
    }, false);

    // ============================================
    // Morphing Sphere / Particle System
    // ============================================
    
    const particleCount = settings.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0xc9b896);
    const color2 = new THREE.Color(0x8b7355);
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        // Create sphere distribution with Fibonacci sphere for better distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
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
        
        // Random velocities for animation
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        
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
    
    // ============================================
    // Floating Wireframe Objects - VISIBLE 3D SHAPES ON ALL DEVICES
    // ============================================
    
    const wireframeObjects = [];
    
    // Show wireframes on ALL devices (simpler on mobile)
    const isMobileDevice = window.innerWidth < 768 || isIOS || isAndroid;
    
    // Icosahedron - Floating wireframe (smaller on mobile)
    const icoSize = isMobileDevice ? 1.5 : 2.5;
    const icoGeo = new THREE.IcosahedronGeometry(icoSize, 0);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: isMobileDevice ? 0.4 : 0.6
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(isMobileDevice ? -2 : -4, 2, -8);
    scene.add(icosahedron);
    wireframeObjects.push({ mesh: icosahedron, rotSpeed: { x: 0.008, y: 0.012 }, floatSpeed: 0.001, floatAmp: 0.8 });
    
    // Torus - Floating wireframe
    const torusRadius = isMobileDevice ? 1.2 : 2;
    const torusGeo = new THREE.TorusGeometry(torusRadius, isMobileDevice ? 0.3 : 0.5, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x8b7355,
        wireframe: true,
        transparent: true,
        opacity: isMobileDevice ? 0.35 : 0.5
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(isMobileDevice ? 2.5 : 5, -1, -10);
    scene.add(torus);
    wireframeObjects.push({ mesh: torus, rotSpeed: { x: -0.01, y: 0.005 }, floatSpeed: 0.0015, floatAmp: 0.6 });
    
    // Octahedron - Floating wireframe
    const octSize = isMobileDevice ? 0.9 : 1.5;
    const octGeo = new THREE.OctahedronGeometry(octSize, 0);
    const octMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        wireframe: true,
        transparent: true,
        opacity: isMobileDevice ? 0.3 : 0.4
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(isMobileDevice ? 1 : 2, isMobileDevice ? 2 : 3, -6);
    scene.add(octahedron);
    wireframeObjects.push({ mesh: octahedron, rotSpeed: { x: 0.015, y: 0.008 }, floatSpeed: 0.002, floatAmp: 0.5 });
    
    // Cube wireframe (only on desktop, or smaller on mobile)
    if (!isMobileDevice || isMobileDevice) {
        const cubeSize = isMobileDevice ? 1.2 : 2;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            wireframe: true,
            transparent: true,
            opacity: isMobileDevice ? 0.25 : 0.35
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(isMobileDevice ? -1.5 : -3, isMobileDevice ? -2 : -3, -7);
        scene.add(cube);
        wireframeObjects.push({ mesh: cube, rotSpeed: { x: 0.006, y: -0.01 }, floatSpeed: 0.0012, floatAmp: 0.4 });
    }

    // Shader Material for particles with simplified calculations for mobile
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
                
                // Simplified wave animation for performance
                #ifdef MOBILE
                    float wave = sin(pos.x * 2.0 + uTime) * 0.08;
                    pos.z += wave;
                #else
                    float wave = sin(pos.x * 2.0 + uTime) * 0.1;
                    float wave2 = cos(pos.y * 2.0 + uTime * 0.8) * 0.1;
                    pos.z += wave + wave2;
                    
                    // Mouse interaction only on desktop
                    float dist = distance(pos.xy, uMouse * 3.0);
                    float push = smoothstep(2.0, 0.0, dist) * 0.2;
                    pos += normalize(pos) * push;
                #endif
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
            }
        `.replace(isMobile ? '//' : '', ''), // Simplified for mobile
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Circular particle
                vec2 xy = gl_PointCoord.xy - vec2(0.5);
                float radius = length(xy);
                if (radius > 0.5) discard;
                
                #ifdef MOBILE
                    gl_FragColor = vec4(vColor, 0.6);
                #else
                    // Glow effect for desktop
                    float glow = 1.0 - (radius * 2.0);
                    glow = pow(glow, 1.5);
                    gl_FragColor = vec4(vColor, glow * 0.8);
                #endif
            }
        `.replace(isMobile ? '//' : '', ''),
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Add connecting lines (only for desktop/high-performance)
    let lineSegments = null;
    if (!isMobile && !settings.disableLines) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(particleCount * 6);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xc9b896,
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
    let mouseInactive = true;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseInactive = false;
        
        // Reset inactivity timer
        clearTimeout(mouseInactivityTimeout);
        mouseInactivityTimeout = setTimeout(() => {
            mouseInactive = true;
        }, 100);
    }, { passive: true });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }, { passive: true });

    let mouseInactivityTimeout;

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
    // Animation Loop with Frame Skipping
    // ============================================
    
    let lastTime = 0;
    let frameCount = 0;
    
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        if (deltaTime < settings.frameInterval) return;
        lastTime = currentTime;
        
        const time = currentTime * 0.001;
        frameCount++;
        
        // Smooth mouse movement
        if (!mouseInactive) {
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;
        }
        
        // Update uniforms
        particleMaterial.uniforms.uTime.value = time;
        particleMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
        
        // Rotate particles slowly
        particles.rotation.y = time * 0.1;
        particles.rotation.x = Math.sin(time * 0.2) * 0.1;
        
        // Animate floating wireframe objects
        wireframeObjects.forEach((obj, i) => {
            obj.mesh.rotation.x += obj.rotSpeed.x;
            obj.mesh.rotation.y += obj.rotSpeed.y;
            obj.mesh.position.y = obj.mesh.userData?.baseY || obj.mesh.position.y + 
                Math.sin(time * obj.floatSpeed + i) * obj.floatAmp * 0.01;
            if (!obj.mesh.userData) obj.mesh.userData = { baseY: obj.mesh.position.y };
        });
        
        // Update line connections (less frequently for performance)
        if (lineSegments && frameCount % 3 === 0) {
            updateConnections();
        }
        
        // Update 3D text response (only every few frames)
        if (frameCount % 2 === 0 && !isMobile) {
            update3DText();
        }
        
        renderer.render(scene, camera);
    }
    
    function updateConnections() {
        const positions = geometry.attributes.position.array;
        const linePositions = lineSegments.geometry.attributes.position.array;
        let lineIndex = 0;
        
        // Optimize: Only check subset of particles
        const checkStep = isLowPower ? 3 : 2;
        
        for (let i = 0; i < particleCount; i += checkStep) {
            let connections = 0;
            for (let j = i + 1; j < particleCount && connections < settings.maxConnections; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;
                const threshold = settings.connectionDistance * settings.connectionDistance;
                
                if (distSq < threshold) {
                    linePositions[lineIndex++] = positions[i * 3];
                    linePositions[lineIndex++] = positions[i * 3 + 1];
                    linePositions[lineIndex++] = positions[i * 3 + 2];
                    linePositions[lineIndex++] = positions[j * 3];
                    linePositions[lineIndex++] = positions[j * 3 + 1];
                    linePositions[lineIndex++] = positions[j * 3 + 2];
                    connections++;
                    
                    if (lineIndex >= particleCount * 6) return;
                }
            }
        }
        
        // Clear remaining lines
        while (lineIndex < particleCount * 6) {
            linePositions[lineIndex++] = 0;
        }
        
        lineSegments.geometry.attributes.position.needsUpdate = true;
    }

    // ============================================
    // Resize Handler with Debounce
    // ============================================
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
        }, 200);
    }, { passive: true });

    // ============================================
    // Scroll Effects with Throttling
    // ============================================
    
    let scrollY = 0;
    let targetScrollY = 0;
    let scrollActive = true;
    
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });
    
    // Pause expensive calculations when tab hidden
    document.addEventListener('visibilitychange', () => {
        scrollActive = !document.hidden;
        if (!document.hidden) {
            lastTime = performance.now();
        }
    });
    
    function updateScrollEffects() {
        if (scrollActive && !isLowPower) {
            scrollY += (targetScrollY - scrollY) * 0.1;
            particles.position.y = -scrollY * 0.001;
        }
        requestAnimationFrame(updateScrollEffects);
    }
    updateScrollEffects();

    // Start animation
    animate(0);

    // ============================================
    // Showcase 3D Viewer - Optimized
    // ============================================
    
    const showcaseContainer = document.getElementById('showcase-canvas');
    if (showcaseContainer) {
        initShowcaseViewer(showcaseContainer);
    }

    function initShowcaseViewer(container) {
        try {
            const showcaseScene = new THREE.Scene();
            
            // Dynamic background based on theme
            const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
            showcaseScene.background = new THREE.Color(isLightTheme ? 0xf1f3f4 : 0x111111);
            
            // Listen for theme changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'data-theme') {
                        const newTheme = document.documentElement.getAttribute('data-theme');
                        showcaseScene.background = new THREE.Color(newTheme === 'light' ? 0xf1f3f4 : 0x111111);
                    }
                });
            });
            observer.observe(document.documentElement, { attributes: true });
            
            const showcaseCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
            showcaseCamera.position.set(0, 0, 8);
            
            const showcaseRenderer = new THREE.WebGLRenderer({ 
                antialias: !isMobile,
                alpha: true
            });
            showcaseRenderer.setSize(container.clientWidth, container.clientHeight);
            showcaseRenderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
            if (settings.shadows) {
                showcaseRenderer.shadowMap.enabled = true;
                showcaseRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }
            container.appendChild(showcaseRenderer.domElement);
            
            // Dispatch event that 3D viewer is loaded
            window.dispatchEvent(new CustomEvent('hero3d-loaded'));
            
            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            showcaseScene.add(ambientLight);
            
            const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
            keyLight.position.set(5, 5, 5);
            if (settings.shadows) {
                keyLight.castShadow = true;
                keyLight.shadow.mapSize.width = isMobile ? 512 : 1024;
                keyLight.shadow.mapSize.height = isMobile ? 512 : 1024;
            }
            showcaseScene.add(keyLight);
            
            // Add rim light only on higher-end devices
            if (!isLowPower) {
                const rimLight = new THREE.PointLight(0xc9b896, 0.5);
                rimLight.position.set(-5, 3, -5);
                showcaseScene.add(rimLight);
            }
            
            // Current product mesh
            let currentMesh = null;
            let currentProduct = 'stand';
            let targetRotation = 0.005;
            
            // Pre-allocate materials
            const materials = {
                primary: new THREE.MeshStandardMaterial({ 
                    color: 0xc9b896, 
                    roughness: 0.3, 
                    metalness: 0.2 
                }),
                secondary: new THREE.MeshStandardMaterial({ 
                    color: 0x8b7355, 
                    roughness: 0.3, 
                    metalness: 0.2 
                }),
                green: new THREE.MeshStandardMaterial({ 
                    color: 0x22c55e, 
                    roughness: 0.4, 
                    metalness: 0.1 
                }),
                plant: new THREE.MeshStandardMaterial({ 
                    color: 0x4ade80, 
                    roughness: 0.5 
                })
            };
            
            // Product geometries
            function createPhoneStand() {
                const group = new THREE.Group();
                
                const base = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 3), materials.primary);
                base.position.y = -1;
                if (settings.shadows) base.castShadow = true;
                group.add(base);
                
                const support = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 0.5), materials.secondary);
                support.position.set(0, 0.2, -1);
                support.rotation.x = -0.3;
                if (settings.shadows) support.castShadow = true;
                group.add(support);
                
                const lip = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.3, 0.8), materials.primary);
                lip.position.set(0, -0.3, 0.8);
                if (settings.shadows) lip.castShadow = true;
                group.add(lip);
                
                return group;
            }
            
            function createPlanter() {
                const group = new THREE.Group();
                
                const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.2, 3, isLowPower ? 16 : 32), materials.green);
                pot.position.y = 0;
                if (settings.shadows) pot.castShadow = true;
                group.add(pot);
                
                // Simplified plant for low-power
                const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), new THREE.MeshBasicMaterial({ color: 0x2d5a27 }));
                stem.position.y = 2;
                group.add(stem);
                
                if (!isLowPower) {
                    const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, isMobile ? 8 : 16, 16), materials.plant);
                    leaf1.position.set(0.3, 2.5, 0);
                    leaf1.scale.z = 0.3;
                    group.add(leaf1);
                    
                    const leaf2 = leaf1.clone();
                    leaf2.position.set(-0.25, 2.3, 0.2);
                    leaf2.scale.set(0.35, 0.35, 0.1);
                    group.add(leaf2);
                }
                
                return group;
            }
            
            function createOrganizer() {
                const group = new THREE.Group();
                
                const tray = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 3), materials.primary);
                tray.position.y = -0.5;
                if (settings.shadows) tray.castShadow = true;
                group.add(tray);
                
                const penH = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, isLowPower ? 12 : 24), materials.secondary);
                penH.position.set(-1.2, 0.5, -0.5);
                if (settings.shadows) penH.castShadow = true;
                group.add(penH);
                
                const smallT = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), materials.primary);
                smallT.position.set(1, 0, 0.5);
                if (settings.shadows) smallT.castShadow = true;
                group.add(smallT);
                
                return group;
            }
            
            function createControllerStand() {
                const group = new THREE.Group();
                
                const base = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 3), materials.primary);
                base.position.y = -1;
                if (settings.shadows) base.castShadow = true;
                group.add(base);
                
                const geometry = new THREE.CylinderGeometry(0.6, 0.6, 1.5, isLowPower ? 8 : 16, 1, false, 0, Math.PI);
                const cradle1 = new THREE.Mesh(geometry, materials.secondary);
                cradle1.position.set(-1.5, -0.2, 0);
                cradle1.rotation.z = Math.PI / 2;
                if (settings.shadows) cradle1.castShadow = true;
                group.add(cradle1);
                
                const cradle2 = cradle1.clone();
                cradle2.position.set(1.5, -0.2, 0);
                group.add(cradle2);
                
                return group;
            }
            
            // Load product with loading indicator
            function loadProduct(type) {
                // Show loading skeleton
                container.classList.add('skeleton');
                
                // Remove old mesh
                if (currentMesh) {
                    showcaseScene.remove(currentMesh);
                    // Clean up geometries
                    currentMesh.traverse((child) => {
                        if (child.geometry) child.geometry.dispose();
                    });
                }
                
                // Small delay to show transition
                setTimeout(() => {
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
                    
                    // Hide skeleton
                    container.classList.remove('skeleton');
                    
                    // Rotate to show product change
                    if (currentMesh) {
                        currentMesh.rotation.y = 0;
                    }
                }, 200);
            }
            
            // Load initial product
            loadProduct('stand');
            
            // Listen for product change events
            window.addEventListener('product-change', (e) => {
                if (e.detail && e.detail.product) {
                    loadProduct(e.detail.product);
                }
            });
            
            // Animation with frame skipping
            let lastFrame = 0;
            function animateShowcase(currentTime) {
                requestAnimationFrame(animateShowcase);
                
                const elapsed = currentTime - lastFrame;
                if (elapsed < settings.frameInterval) return;
                lastFrame = currentTime;
                
                if (currentMesh) {
                    currentMesh.rotation.y += targetRotation;
                }
                
                showcaseRenderer.render(showcaseScene, showcaseCamera);
            }
            animateShowcase(0);
            
            // Resize with debounce
            let showcaseResizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(showcaseResizeTimeout);
                showcaseResizeTimeout = setTimeout(() => {
                    showcaseCamera.aspect = container.clientWidth / container.clientHeight;
                    showcaseCamera.updateProjectionMatrix();
                    showcaseRenderer.setSize(container.clientWidth, container.clientHeight);
                }, 250);
            }, { passive: true });
            
        } catch (e) {
            console.error('Showcase viewer error:', e);
            container.innerHTML = '<div class="viewer-placeholder-content">3D Preview Coming Soon</div>';
            container.classList.remove('skeleton');
        }
    }

    // ============================================
    // Card Tilt Effect with RequestAnimationFrame
    // ============================================
    
    if (!isMobile) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            let rafId = null;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            function updateTransform() {
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
                
                card.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(10px)`;
                
                if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                    rafId = requestAnimationFrame(updateTransform);
                }
            }
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                targetX = (y - centerY) / 20;
                targetY = (centerX - x) / 20;
                
                if (!rafId) {
                    rafId = requestAnimationFrame(updateTransform);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                targetX = 0;
                targetY = 0;
                if (!rafId) {
                    rafId = requestAnimationFrame(updateTransform);
                }
            });
        });
    }

    console.log('🎨 Hero 3D initialized with', settings.particleCount, 'particles', isMobile ? '(mobile mode)' : '(desktop mode)');

})();
