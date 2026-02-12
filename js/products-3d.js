/* ============================================
   MagniPrints — Products 3D Viewer
   Procedural 3D Models & Price Calculator
   ============================================ */

(function() {
    'use strict';

    // State
    const state = {
        product: 'phone-stand',
        productBasePrice: 299,
        filament: 'pla',
        filamentPrice: 0,
        color: 0x667eea,
        colorHex: '0x667eea',
        quantity: 1,
        autoRotate: true,
        wireframe: false
    };

    // Color map for filament types
    const colorMap = {
        'pla': [0x667eea, 0x22c55e, 0xef4444, 0x3b82f6, 0xf59e0b, 0xec4899, 0x14b8a6, 0xffffff, 0x1a1a1a, 0xfbbf24],
        'petg': [0x3b82f6, 0x22c55e, 0xef4444, 0x667eea, 0xf59e0b, 0xec4899, 0x14b8a6, 0xffffff, 0x1a1a1a, 0x06b6d4],
        'tpu': [0xf59e0b, 0x22c55e, 0xef4444, 0x3b82f6, 0x667eea, 0xec4899, 0x14b8a6, 0xffffff, 0x1a1a1a, 0xf97316]
    };

    // ============================================
    // Main 3D Viewer Setup
    // ============================================

    const container = document.getElementById('product-viewer');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(8, 6, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    let controls;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    } else {
        // Fallback if OrbitControls not loaded from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        script.onload = () => {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            setupControls();
        };
        document.head.appendChild(script);
    }

    function setupControls() {
        if (!controls) return;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 20;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
    }

    setupControls();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(8, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x667eea, 0.3);
    fillLight.position.set(-8, 4, -8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.4);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    // Ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // ============================================
    // Product Geometry Generators
    // ============================================

    function createMaterial(color) {
        const isTPU = state.filament === 'tpu';
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: isTPU ? 0.8 : 0.3,
            metalness: state.filament === 'petg' ? 0.3 : 0.1,
            transparent: isTPU,
            opacity: isTPU ? 0.9 : 1,
            wireframe: state.wireframe
        });
    }

    function getFilamentColor() {
        return state.color;
    }

    // 1. Phone Stand
    function createPhoneStand() {
        const group = new THREE.Group();
        const material = createMaterial(getFilamentColor());

        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.4, 3),
            material
        );
        base.position.y = -0.8;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Back support with curved profile
        const supportShape = new THREE.Shape();
        supportShape.moveTo(0, 0);
        supportShape.lineTo(2.8, 0);
        supportShape.lineTo(2.8, 3);
        supportShape.lineTo(0, 2.2);
        supportShape.lineTo(0, 0);

        const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const supportGeo = new THREE.ExtrudeGeometry(supportShape, extrudeSettings);
        const support = new THREE.Mesh(supportGeo, material);
        support.position.set(-1.4, -1.2, -0.5);
        support.rotation.x = -0.25;
        support.castShadow = true;
        group.add(support);

        // Bottom lip/cradle
        const lipGeo = new THREE.BoxGeometry(3.2, 0.3, 0.8);
        const lip = new THREE.Mesh(lipGeo, material);
        lip.position.set(0, 0.4, 0.5);
        lip.castShadow = true;
        group.add(lip);

        // Side supports
        const sideSupportGeo = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const side1 = new THREE.Mesh(sideSupportGeo, material);
        side1.position.set(-1.4, -0.2, 0.5);
        side1.rotation.x = -0.5;
        side1.castShadow = true;
        group.add(side1);

        const side2 = side1.clone();
        side2.position.set(1.4, -0.2, 0.5);
        group.add(side2);

        return group;
    }

    // 2. Planter
    function createPlanter() {
        const group = new THREE.Group();
        const material = createMaterial(getFilamentColor());

        // Pot body with hexagonal pattern
        const potGeo = new THREE.CylinderGeometry(1.8, 1.3, 3.2, 6);
        const pot = new THREE.Mesh(potGeo, material);
        pot.position.y = 0.6;
        pot.castShadow = true;
        pot.receiveShadow = true;
        group.add(pot);

        // Decorative ring
        const ringGeo = new THREE.TorusGeometry(1.6, 0.15, 8, 6);
        const ring = new THREE.Mesh(ringGeo, material);
        ring.position.y = 1.5;
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = Math.PI / 6;
        group.add(ring);

        // Base platform
        const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.4, 6);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = -1;
        base.castShadow = true;
        group.add(base);

        // Soil (visible at top)
        const soilGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
        const soilMat = new THREE.MeshStandardMaterial({ 
            color: 0x4a3728, 
            roughness: 0.9 
        });
        const soil = new THREE.Mesh(soilGeo, soilMat);
        soil.position.y = 2.2;
        group.add(soil);

        // Simple plant
        const stemGeo = new THREE.CylinderGeometry(0.06, 0.08, 2, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 3;
        group.add(stem);

        // Leaves
        const leafGeo = new THREE.SphereGeometry(0.35, 16, 8);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
        
        const leaf1 = new THREE.Mesh(leafGeo, leafMat);
        leaf1.position.set(0.35, 3.8, 0);
        leaf1.scale.set(1.5, 0.3, 0.8);
        group.add(leaf1);

        const leaf2 = new THREE.Mesh(leafGeo, leafMat);
        leaf2.position.set(-0.3, 3.5, 0.3);
        leaf2.scale.set(1.3, 0.25, 0.7);
        group.add(leaf2);

        const leaf3 = new THREE.Mesh(leafGeo, leafMat);
        leaf3.position.set(0, 3.6, -0.3);
        leaf3.scale.set(1.2, 0.25, 0.7);
        group.add(leaf3);

        return group;
    }

    // 3. Cable Holder
    function createCableHolder() {
        const group = new THREE.Group();
        const material = createMaterial(getFilamentColor());

        const positions = [
            { x: -1.5, size: 0.6 },
            { x: 0, size: 0.8 },
            { x: 1.5, size: 1 }
        ];

        positions.forEach((pos, i) => {
            const holderGroup = new THREE.Group();

            // Base
            const baseGeo = new THREE.BoxGeometry(pos.size + 0.4, 0.3, pos.size + 0.2);
            const base = new THREE.Mesh(baseGeo, material);
            base.position.y = 0;
            base.castShadow = true;
            holderGroup.add(base);

            // Arch
            const archShape = new THREE.Shape();
            archShape.absarc(0, 0, pos.size / 2 + 0.15, 0, Math.PI, false);
            
            const archExtrude = new THREE.ExtrudeGeometry(archShape, { depth: 0.3, bevelEnabled: false });
            const arch = new THREE.Mesh(archExtrude, material);
            arch.position.y = 0.15;
            arch.position.z = -0.15;
            arch.castShadow = true;
            holderGroup.add(arch);

            holderGroup.position.x = pos.x;
            holderGroup.position.y = i * 0.1;
            group.add(holderGroup);
        });

        return group;
    }

    // 4. Keychain
    function createKeychain() {
        const group = new THREE.Group();
        const material = createMaterial(getFilamentColor());

        // Main tag shape
        const tagShape = new THREE.Shape();
        tagShape.moveTo(-1.2, 1);
        tagShape.lineTo(1.2, 1);
        tagShape.lineTo(1.2, -0.8);
        tagShape.quadraticCurveTo(1.2, -1.2, 0.8, -1.2);
        tagShape.lineTo(0.3, -1.2);
        tagShape.absarc(0, -1.2, 0.3, 0, Math.PI, false);
        tagShape.lineTo(-0.8, -1.2);
        tagShape.quadraticCurveTo(-1.2, -1.2, -1.2, -0.8);
        tagShape.lineTo(-1.2, 1);

        const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 };
        const tagGeo = new THREE.ExtrudeGeometry(tagShape, extrudeSettings);
        const tag = new THREE.Mesh(tagGeo, material);
        tag.castShadow = true;
        group.add(tag);

        // Key ring
        const ringGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, -1.7, 0.08);
        group.add(ring);

        // Add some decorative elements
        const decoGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6);
        const deco = new THREE.Mesh(decoGeo, material);
        deco.position.set(-0.7, 0.2, 0.08);
        group.add(deco);

        return group;
    }

    // 5. Controller Stand
    function createControllerStand() {
        const group = new THREE.Group();
        const material = createMaterial(getFilamentColor());

        // Base platform
        const baseGeo = new THREE.BoxGeometry(6, 0.5, 4);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = -1;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Controller cradles
        const cradlePositions = [-1.8, 1.8];
        cradlePositions.forEach(x => {
            const cradleGroup = new THREE.Group();

            // Back support
            const backShape = new THREE.Shape();
            backShape.moveTo(0, 0);
            backShape.lineTo(1.4, 0);
            backShape.lineTo(1.2, 2.5);
            backShape.quadraticCurveTo(0.7, 3, 0, 2.8);
            backShape.lineTo(0, 0);

            const backGeo = new THREE.ExtrudeGeometry(backShape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
            const back = new THREE.Mesh(backGeo, material);
            back.position.set(-0.7, -0.5, -0.8);
            back.rotation.x = -0.15;
            back.castShadow = true;
            cradleGroup.add(back);

            // Side arms
            const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.2, 8);
            const arm1 = new THREE.Mesh(armGeo, material);
            arm1.position.set(-0.8, 0.8, -0.3);
            arm1.rotation.x = -0.3;
            cradleGroup.add(arm1);

            const arm2 = arm1.clone();
            arm2.position.set(0.8, 0.8, -0.3);
            cradleGroup.add(arm2);

            // Bottom cradle
            const bottomGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.3, 32, 1, false, 0, Math.PI);
            const bottom = new THREE.Mesh(bottomGeo, material);
            bottom.position.set(0, -0.35, 0.5);
            cradleGroup.add(bottom);

            cradleGroup.position.x = x;
            group.add(cradleGroup);
        });

        return group;
    }

    // 6. Desk Organizer
    function createDeskOrganizer() {
        const group = new THREE.Group();
        const material = createMaterial(getFilamentColor());

        // Main tray base
        const trayLength = 4;
        const trayWidth = 3;
        const trayHeight = 0.3;
        
        // Base
        const baseGeo = new THREE.BoxGeometry(trayLength, trayHeight, trayWidth);
        const base = new THREE.Mesh(baseGeo, material);
        base.position.y = -1;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Back wall
        const backWallGeo = new THREE.BoxGeometry(trayLength, 1.5, 0.2);
        const backWall = new THREE.Mesh(backWallGeo, material);
        backWall.position.set(0, -0.1, -trayWidth/2 + 0.1);
        backWall.castShadow = true;
        group.add(backWall);

        // Left wall (shorter - pen holder section)
        const leftWallGeo = new THREE.BoxGeometry(0.2, 2.5, trayWidth/2);
        const leftWall = new THREE.Mesh(leftWallGeo, material);
        leftWall.position.set(-trayLength/2 + 0.1, 0.15, trayWidth/4);
        leftWall.castShadow = true;
        group.add(leftWall);

        // Divider
        const dividerGeo = new THREE.BoxGeometry(0.15, 1.2, trayWidth/2 - 0.2);
        const divider = new THREE.Mesh(dividerGeo, material);
        divider.position.set(-trayLength/4, -0.15, trayWidth/4);
        divider.castShadow = true;
        group.add(divider);

        // Pen holder cylinder
        const penHolderGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.2, 24);
        const penHolder = new THREE.Mesh(penHolderGeo, material);
        penHolder.position.set(-1.5, 0.1, -0.5);
        penHolder.castShadow = true;
        group.add(penHolder);

        // Phone slot stand
        const phoneStandGeo = new THREE.BoxGeometry(0.3, 1.8, 1.2);
        const phoneStand = new THREE.Mesh(phoneStandGeo, material);
        phoneStand.position.set(1.2, 0.3, 0);
        phoneStand.rotation.z = -0.15;
        phoneStand.castShadow = true;
        group.add(phoneStand);

        // Small accessory tray
        const smallTrayBaseGeo = new THREE.BoxGeometry(1.5, 0.2, 1);
        const smallTray = new THREE.Mesh(smallTrayBaseGeo, material);
        smallTray.position.set(1, -0.9, 0.8);
        smallTray.castShadow = true;
        group.add(smallTray);

        return group;
    }

    // 7. Lithophane
    function createLithophane() {
        const group = new THREE.Group();
        
        // Lithophane is typically white/translucent material
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.4,
            metalness: 0,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });

        // Create a textured plane representing the lithophane
        const width = 3;
        const height = 4;
        const segmentsW = 64;
        const segmentsH = 80;
        
        const geometry = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH);
        
        // Add displacement to simulate image data
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            // Create a gradient pattern resembling a "photo"
            const dist = Math.sqrt(x*x + y*y);
            const z = Math.sin(x * 2) * Math.cos(y * 1.5) * 0.15 + 
                     Math.sin(dist * 2) * 0.1;
            positions.setZ(i, z);
        }
        
        geometry.computeVertexNormals();
        
        const lithophane = new THREE.Mesh(geometry, material);
        lithophane.castShadow = true;
        group.add(lithophane);

        // Frame
        const frameMaterial = createMaterial(getFilamentColor());
        const frameThickness = 0.2;
        const frameDepth = 0.3;

        // Top frame
        const topFrame = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.4, frameThickness, frameDepth),
            frameMaterial
        );
        topFrame.position.set(0, height/2 + frameThickness/2, frameDepth/2);
        group.add(topFrame);

        // Bottom frame
        const bottomFrame = topFrame.clone();
        bottomFrame.position.set(0, -height/2 - frameThickness/2, frameDepth/2);
        group.add(bottomFrame);

        // Left frame
        const leftFrame = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, height, frameDepth),
            frameMaterial
        );
        leftFrame.position.set(-width/2 - frameThickness/2, 0, frameDepth/2);
        group.add(leftFrame);

        // Right frame
        const rightFrame = leftFrame.clone();
        rightFrame.position.set(width/2 + frameThickness/2, 0, frameDepth/2);
        group.add(rightFrame);

        // Back plate
        const backPlate = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.4, height + 0.4, 0.1),
            frameMaterial
        );
        backPlate.position.z = -0.1;
        group.add(backPlate);

        // Stand
        const standGeo = new THREE.BoxGeometry(2, 0.3, 1.5);
        const stand = new THREE.Mesh(standGeo, frameMaterial);
        stand.position.set(0, -height/2 - 0.6, 0.8);
        stand.rotation.x = 0.3;
        group.add(stand);

        return group;
    }

    // Product Registry
    const products = {
        'phone-stand': { create: createPhoneStand, basePrice: 299, name: 'Phone Stand' },
        'planter': { create: createPlanter, basePrice: 349, name: 'Geometric Planter' },
        'cable-holder': { create: createCableHolder, basePrice: 149, name: 'Cable Holder Set' },
        'keychain': { create: createKeychain, basePrice: 99, name: 'Custom Keychain' },
        'controller-stand': { create: createControllerStand, basePrice: 449, name: 'Controller Stand' },
        'desk-organizer': { create: createDeskOrganizer, basePrice: 399, name: 'Desk Organizer' },
        'lithophane': { create: createLithophane, basePrice: 599, name: '3D Lithophane' }
    };

    // ============================================
    // Main 3D Viewer — Load Product
    // ============================================

    let currentMesh = null;

    function loadProduct(productId) {
        const product = products[productId];
        if (!product) return;

        // Remove current mesh
        if (currentMesh) {
            scene.remove(currentMesh);
            // Cleanup
            currentMesh.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        // Create new product
        currentMesh = product.create();
        scene.add(currentMesh);

        // Reset camera position for new product
        camera.position.set(8, 6, 10);
        camera.lookAt(0, 0, 0);
        if (controls) {
            controls.reset();
        }

        // Update state
        state.product = productId;
        state.productBasePrice = product.basePrice;
        updatePriceCalculator();
        updateOrderButton();
    }

    // Update material color
    function updateMaterialColor() {
        if (!currentMesh) return;
        
        const newMaterial = createMaterial(getFilamentColor());
        
        currentMesh.traverse(child => {
            if (child.isMesh) {
                // Don't override soil, stems, leaves, or metal parts
                const hex = child.material.color.getHex();
                if (hex !== 0x4a3728 && hex !== 0x2d5a27 && hex !== 0x4ade80 && hex !== 0xc0c0c0 && hex !== 0xffffff) {
                    child.material = newMaterial;
                }
            }
        });
    }

    // Update wireframe mode
    function updateWireframe() {
        if (!currentMesh) return;
        
        currentMesh.traverse(child => {
            if (child.isMesh) {
                child.material.wireframe = state.wireframe;
            }
        });
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (controls) {
            controls.update();
        }
        
        renderer.render(scene, camera);
    }

    animate();

    // ============================================
    // Event Listeners
    // ============================================

    // Product cards click
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.product-card').forEach(c => c.classList.remove('active'));
            // Add active to clicked
            card.classList.add('active');
            
            const productId = card.dataset.product;
            loadProduct(productId);
        });
    });

    // Filament selection
    document.querySelectorAll('.filament-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filament-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            state.filament = btn.dataset.filament;
            state.filamentPrice = parseInt(btn.dataset.price);
            
            // Update color options for this filament
            updateColorOptions();
            
            updateMaterialColor();
            updatePriceCalculator();
        });
    });

    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            state.color = parseInt(btn.dataset.color);
            state.colorHex = btn.dataset.color;
            
            updateMaterialColor();
        });
    });

    function updateColorOptions() {
        const container = document.getElementById('color-options');
        const colors = colorMap[state.filament];
        
        // Clear current options
        container.innerHTML = '';
        
        // Add new options
        colors.forEach((color, i) => {
            const btn = document.createElement('button');
            btn.className = 'color-btn' + (i === 0 ? ' active' : '');
            btn.style.background = '#' + color.toString(16).padStart(6, '0');
            btn.dataset.color = '0x' + color.toString(16);
            btn.title = 'Color ' + (i + 1);
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.color = color;
                state.colorHex = color.toString(16);
                updateMaterialColor();
            });
            
            container.appendChild(btn);
        });
        
        // Update state to first color of new filament
        state.color = colors[0];
        state.colorHex = colors[0].toString(16);
    }

    // Viewer controls
    document.getElementById('btn-rotate').addEventListener('click', function() {
        state.autoRotate = !state.autoRotate;
        this.classList.toggle('active', state.autoRotate);
        if (controls) {
            controls.autoRotate = state.autoRotate;
        }
    });

    document.getElementById('btn-wireframe').addEventListener('click', function() {
        state.wireframe = !state.wireframe;
        this.classList.toggle('active', state.wireframe);
        updateWireframe();
    });

    document.getElementById('btn-reset').addEventListener('click', function() {
        if (controls) {
            controls.reset();
        }
        camera.position.set(8, 6, 10);
        camera.lookAt(0, 0, 0);
    });

    document.getElementById('btn-fullscreen').addEventListener('click', function() {
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Quantity controls
    const qtyInput = document.getElementById('qty-input');
    
    document.getElementById('qty-minus').addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) {
            qtyInput.value = val - 1;
            state.quantity = val - 1;
            updatePriceCalculator();
        }
    });

    document.getElementById('qty-plus').addEventListener('click', () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val < 100) {
            qtyInput.value = val + 1;
            state.quantity = val + 1;
            updatePriceCalculator();
        }
    });

    qtyInput.addEventListener('change', () => {
        let val = parseInt(qtyInput.value) || 1;
        val = Math.max(1, Math.min(100, val));
        qtyInput.value = val;
        state.quantity = val;
        updatePriceCalculator();
    });

    // ============================================
    // Price Calculator
    // ============================================

    function updatePriceCalculator() {
        const productName = products[state.product].name;
        const filamentName = state.filament.toUpperCase() + ' (' + 
            (state.filament === 'pla' ? 'Standard' : state.filament === 'petg' ? 'Strong' : 'Flexible') + ')';
        
        const basePrice = state.productBasePrice;
        const surcharge = state.filamentPrice;
        const total = (basePrice + surcharge) * state.quantity;
        
        document.getElementById('calc-product').textContent = productName;
        document.getElementById('calc-filament').textContent = filamentName;
        document.getElementById('calc-base').textContent = '₹' + basePrice;
        document.getElementById('calc-surcharge').textContent = '₹' + surcharge;
        document.getElementById('calc-total').textContent = '₹' + total;
    }

    function updateOrderButton() {
        const productName = products[state.product].name;
        const basePrice = state.productBasePrice;
        const surcharge = state.filamentPrice;
        const total = (basePrice + surcharge) * state.quantity;
        const filamentName = state.filament.toUpperCase();
        
        const message = `Hi MagniPrints, I want to order a ${productName} in ${filamentName} color (approx ${document.querySelector('.color-btn.active')?.title || 'Purple'}). Quantity: ${state.quantity}. Total: ₹${total}`;
        
        const encodedMessage = encodeURIComponent(message);
        document.getElementById('order-btn').href = `https://wa.me/918800000000?text=${encodedMessage}`;
    }

    // Update order button when quantity or filament changes
    document.getElementById('qty-input').addEventListener('input', updateOrderButton);
    document.querySelectorAll('.filament-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(updateOrderButton, 100);
        });
    });
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(updateOrderButton, 100);
        });
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Initialize
    loadProduct('phone-stand');
    updatePriceCalculator();
    updateOrderButton();

    // ============================================
    // Mini Preview 3D (for product cards)
    // ============================================

    function initMiniPreview(containerId, productId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(6, 4, 6);

        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(1);
        container.appendChild(renderer.domElement);

        // Simple lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambient);

        const dir = new THREE.DirectionalLight(0xffffff, 0.7);
        dir.position.set(5, 5, 5);
        scene.add(dir);

        // Get product
        const product = products[productId];
        if (product) {
            const mesh = product.create();
            scene.add(mesh);

            function animate() {
                requestAnimationFrame(animate);
                mesh.rotation.y += 0.008;
                renderer.render(scene, camera);
            }
            animate();
        }
    }

    // Initialize mini previews
    setTimeout(() => {
        initMiniPreview('preview-phone-stand', 'phone-stand');
        initMiniPreview('preview-planter', 'planter');
        initMiniPreview('preview-cable-holder', 'cable-holder');
        initMiniPreview('preview-keychain', 'keychain');
        initMiniPreview('preview-controller-stand', 'controller-stand');
        initMiniPreview('preview-desk-organizer', 'desk-organizer');
        initMiniPreview('preview-lithophane', 'lithophane');
    }, 100);

    console.log('🎨 MagniPrints Products 3D loaded!');

})();
