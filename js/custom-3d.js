/* ============================================
   MagniPrints — Custom Print 3D Viewer
   STL Upload & Sample Models
   ============================================ */

(function() {
    'use strict';

    // State
    const state = {
        currentMesh: null,
        sampleModel: 'phone-stand',
        hasFile: false,
        fileName: null,
        layerHeight: 0.2,
        infill: 20,
        supports: 'none',
        material: 'pla',
        materialPrice: 2, // per gram
        color: 0xc9b896,
        modelVolume: 0, // cubic mm
        modelWeight: 0, // grams
        printTime: 0, // hours
        dimensions: { x: 0, y: 0, z: 0 }
    };

    // ============================================
    // Main 3D Viewer Setup
    // ============================================

    const container = document.getElementById('custom-viewer');
    const placeholder = document.getElementById('viewer-placeholder');
    
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(12, 10, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    let controls;
    const setupControls = () => {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
    };

    if (typeof THREE.OrbitControls !== 'undefined') {
        setupControls();
    } else {
        const checkControls = setInterval(() => {
            if (typeof THREE.OrbitControls !== 'undefined') {
                clearInterval(checkControls);
                setupControls();
            }
        }, 100);
    }

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc9b896, 0.3);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // Grid & Ground
    let gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Material
    function createMaterial(color) {
        const isTPU = state.material === 'tpu';
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: isTPU ? 0.8 : 0.4,
            metalness: state.material === 'petg' ? 0.2 : 0.05,
            transparent: isTPU,
            opacity: isTPU ? 0.85 : 1
        });
    }

    // ============================================
    // Sample Model Generators
    // ============================================

    function createPhoneStandSample() {
        const group = new THREE.Group();
        const material = createMaterial(state.color);

        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.4, 3),
            material
        );
        base.position.y = -0.8;
        base.castShadow = true;
        group.add(base);

        // Back support
        const support = new THREE.Mesh(
            new THREE.BoxGeometry(3, 2.5, 0.4),
            material
        );
        support.position.set(0, 0.5, -0.6);
        support.rotation.x = -0.3;
        support.castShadow = true;
        group.add(support);

        // Cradle
        const cradle = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.3, 0.8),
            material
        );
        cradle.position.set(0, 0.4, 0.4);
        cradle.castShadow = true;
        group.add(cradle);

        return group;
    }

    function createVaseSample() {
        const group = new THREE.Group();
        const material = createMaterial(state.color);

        // Create twisted vase geometry
        const points = [];
        for (let i = 0; i < 15; i++) {
            const y = i * 0.3;
            const r = 0.8 + (i * 0.15);
            points.push(new THREE.Vector2(r, y));
        }
        
        const geometry = new THREE.LatheGeometry(points, 32);
        const vase = new THREE.Mesh(geometry, material);
        vase.castShadow = true;
        
        // Twist effect using vertex manipulation
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const angle = y * 0.5;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            positions.setX(i, x * cos - z * sin);
            positions.setZ(i, x * sin + z * cos);
        }
        geometry.computeVertexNormals();
        
        vase.position.y = -2;
        group.add(vase);

        return group;
    }

    function createFigurineSample() {
        const group = new THREE.Group();
        
        // Body
        const bodyMat = createMaterial(state.color);
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.6, 2, 16),
            bodyMat
        );
        body.position.y = 0;
        body.castShadow = true;
        group.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 24, 24),
            bodyMat
        );
        head.position.y = 1.5;
        head.castShadow = true;
        group.add(head);

        // Eyes (dark material)
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), eyeMat);
        eye1.position.set(-0.25, 1.6, 0.6);
        group.add(eye1);
        
        const eye2 = eye1.clone();
        eye2.position.set(0.25, 1.6, 0.6);
        group.add(eye2);

        // Antenna
        const antenna = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8),
            bodyMat
        );
        antenna.position.set(0, 2.3, 0);
        group.add(antenna);

        const antennaTip = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        );
        antennaTip.position.set(0, 2.7, 0);
        group.add(antennaTip);

        // Arms
        const armGeo = new THREE.CapsuleGeometry(0.15, 1.2, 4, 8);
        const arm1 = new THREE.Mesh(armGeo, bodyMat);
        arm1.position.set(-1, 0.5, 0);
        arm1.rotation.z = 0.3;
        group.add(arm1);

        const arm2 = arm1.clone();
        arm2.position.set(1, 0.5, 0);
        arm2.rotation.z = -0.3;
        group.add(arm2);

        return group;
    }

    // ============================================
    // Load & Display Model
    // ============================================

    function loadModel(mesh) {
        // Remove existing
        if (state.currentMesh) {
            scene.remove(state.currentMesh);
        }

        state.currentMesh = mesh;
        scene.add(mesh);

        // Hide placeholder
        if (placeholder) {
            placeholder.classList.add('hidden');
        }

        // Calculate model stats
        calculateModelStats(mesh);
        
        // Center and scale
        centerAndScale(mesh);
        
        // Update price
        updatePriceEstimate();

        // Reset controls
        if (controls) {
            controls.reset();
            camera.position.set(12, 10, 12);
        }
    }

    function centerAndScale(mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Calculate scale to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / maxDim;
        
        mesh.scale.setScalar(scale);
        
        // Center
        mesh.position.sub(center.multiplyScalar(scale));
        mesh.position.y += 1;

        // Store dimensions
        state.dimensions = {
            x: (size.x * scale).toFixed(1),
            y: (size.y * scale).toFixed(1),
            z: (size.z * scale).toFixed(1)
        };

        updateModelInfo();
    }

    function calculateModelStats(mesh) {
        let volume = 0;
        let triangles = 0;

        mesh.traverse(child => {
            if (child.isMesh && child.geometry) {
                const geo = child.geometry;
                
                // Count triangles
                if (geo.index) {
                    triangles += geo.index.count / 3;
                } else {
                    triangles += geo.attributes.position.count / 3;
                }

                // Calculate volume
                const positions = geo.attributes.position.array;
                for (let i = 0; i < positions.length; i += 9) {
                    const ax = positions[i], ay = positions[i + 1], az = positions[i + 2];
                    const bx = positions[i + 3], by = positions[i + 4], bz = positions[i + 5];
                    const cx = positions[i + 6], cy = positions[i + 7], cz = positions[i + 8];
                    
                    // Signed volume of tetrahedron
                    volume += (
                        ax * (by - cy) * (bz - cz) +
                        ay * (bz - cz) * (bx - cx) +
                        az * (bx - cx) * (by - cy) -
                        cx * (by - ay) * (bz - az) -
                        cy * (bz - az) * (bx - ax) -
                        cz * (bx - ax) * (by - ay)
                    ) / 6;
                }
            }
        });

        state.modelVolume = Math.abs(volume);
        
        // Estimate weight based on material density and infill
        const densityMap = { 'pla': 1.24, 'petg': 1.27, 'tpu': 1.21 };
        const density = densityMap[state.material] || 1.24;
        const infillMultiplier = 0.2 + (state.infill / 100) * 0.8; // 20% base walls + infill
        
        state.modelWeight = (state.modelVolume * density * infillMultiplier / 1000).toFixed(1);
    }

    function updatePriceEstimate() {
        const materialCost = (state.modelWeight * state.materialPrice).toFixed(0);
        
        // Estimate print time based on volume and layer height
        // Simplified calculation: roughly 4g per hour at 0.2mm layer height
        const timeMultiplier = 0.2 / state.layerHeight;
        state.printTime = Math.max(1, Math.round((state.modelWeight / 4) * timeMultiplier));
        
        const printCost = state.printTime * 50; // ₹50 per hour
        const setupFee = 50;
        const total = parseInt(materialCost) + printCost + setupFee;

        // Update UI
        document.getElementById('estimate-price').textContent = '₹' + total;
        document.getElementById('breakdown-material').textContent = '₹' + materialCost;
        document.getElementById('breakdown-time').textContent = '₹' + printCost;
        document.getElementById('est-time').textContent = state.printTime;

        updateOrderButton(total);
    }

    function updateModelInfo() {
        document.getElementById('info-dimensions').textContent = 
            `${state.dimensions.x} × ${state.dimensions.y} × ${state.dimensions.z} mm`;
        document.getElementById('info-volume').textContent = 
            (state.modelVolume / 1000).toFixed(2) + ' cm³';
        document.getElementById('info-triangles').textContent = 
            Math.round(state.modelVolume / 10).toLocaleString();
        document.getElementById('info-weight').textContent = 
            state.modelWeight + ' g';
    }

    function loadSampleModel(type) {
        state.hasFile = false;
        state.sampleModel = type;

        let mesh;
        switch(type) {
            case 'phone-stand':
                mesh = createPhoneStandSample();
                break;
            case 'vase':
                mesh = createVaseSample();
                break;
            case 'figurine':
                mesh = createFigurineSample();
                break;
            default:
                mesh = createPhoneStandSample();
        }

        loadModel(mesh);
    }

    // ============================================
    // STL File Load
    // ============================================

    function loadSTLFile(file) {
        const reader = new FileReader();
        
        // Show progress
        const progressDiv = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressDiv) progressDiv.classList.remove('hidden');
        
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                if (progressFill) progressFill.style.width = percent + '%';
            }
        };

        reader.onload = (e) => {
            const contents = e.target.result;
            
            if (progressText) progressText.textContent = 'Parsing...';

            try {
                const loader = new THREE.STLLoader();
                const geometry = loader.parse(contents);
                
                const material = createMaterial(state.color);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                
                state.hasFile = true;
                state.fileName = file.name;
                
                loadModel(mesh);

                if (progressDiv) progressDiv.classList.add('hidden');
                if (progressFill) progressFill.style.width = '0%';

            } catch (error) {
                console.error('STL parsing error:', error);
                if (progressText) progressText.textContent = 'Error loading file';
                setTimeout(() => {
                    if (progressDiv) progressDiv.classList.add('hidden');
                }, 2000);
            }
        };

        reader.readAsArrayBuffer(file);
    }

    // ============================================
    // Event Listeners
    // ============================================

    // Sample model selection
    document.querySelectorAll('.sample-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            loadSampleModel(card.dataset.sample);
        });
    });

    // File upload
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('stl-input');
    const browseBtn = document.getElementById('browse-btn');

    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                loadSTLFile(file);
            }
        });
    }

    // Drag and drop
    if (uploadZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.remove('drag-over');
            });
        });

        uploadZone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file && file.name.toLowerCase().endsWith('.stl')) {
                loadSTLFile(file);
            }
        });
    }

    // Layer height slider
    const layerSlider = document.getElementById('layer-height');
    const layerValue = document.getElementById('layer-value');

    if (layerSlider && layerValue) {
        layerSlider.addEventListener('input', () => {
            state.layerHeight = parseFloat(layerSlider.value);
            layerValue.textContent = state.layerHeight.toFixed(2) + 'mm';
            
            if (!state.hasFile) {
                calculateModelStats(state.currentMesh);
                updatePriceEstimate();
            }
        });
    }

    // Infill slider
    const infillSlider = document.getElementById('infill');
    const infillValue = document.getElementById('infill-value');

    if (infillSlider && infillValue) {
        infillSlider.addEventListener('input', () => {
            state.infill = parseInt(infillSlider.value);
            infillValue.textContent = state.infill + '%';
            
            if (state.currentMesh) {
                calculateModelStats(state.currentMesh);
                updatePriceEstimate();
            }
        });
    }

    // Supports toggle
    document.querySelectorAll('[data-supports]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-supports]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.supports = btn.dataset.supports;
        });
    });

    // Material selection
    document.querySelectorAll('.material-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.material-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            state.material = btn.dataset.material;
            state.materialPrice = parseInt(btn.dataset.price);
            
            if (state.currentMesh) {
                // Update material
                const newMat = createMaterial(state.color);
                state.currentMesh.traverse(child => {
                    if (child.isMesh && child.material.color) {
                        child.material = newMat;
                    }
                });
                
                calculateModelStats(state.currentMesh);
                updatePriceEstimate();
            }
        });
    });

    // Color selection
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            state.color = parseInt(btn.dataset.color);
            
            if (state.currentMesh) {
                const newMat = createMaterial(state.color);
                state.currentMesh.traverse(child => {
                    if (child.isMesh && child.material.color) {
                        // Don't override special materials (eyes, etc.)
                        const hex = child.material.color.getHex();
                        if (hex !== 0x333333 && hex !== 0xff0000) {
                            child.material = newMat;
                        }
                    }
                });
            }
        });
    });

    // Viewer controls
    document.getElementById('btn-reset-view')?.addEventListener('click', () => {
        if (state.currentMesh) {
            centerAndScale(state.currentMesh);
        }
        if (controls) {
            controls.reset();
            camera.position.set(12, 10, 12);
        }
    });

    document.getElementById('btn-toggle-grid')?.addEventListener('click', function() {
        this.classList.toggle('active');
        gridHelper.visible = this.classList.contains('active');
    });

    document.getElementById('btn-measure')?.addEventListener('click', () => {
        alert(`Model Dimensions:\nX: ${state.dimensions.x}mm\nY: ${state.dimensions.y}mm\nZ: ${state.dimensions.z}mm`);
    });

    function updateOrderButton(total) {
        const modelName = state.hasFile ? state.fileName : state.sampleModel + ' (sample)';
        const layer = state.layerHeight + 'mm';
        const infill = state.infill + '%';
        const supports = state.supports;
        const material = state.material.toUpperCase();
        
        const message = `Hi MagniPrints! I'd like to order a custom print:

Model: ${modelName}
Material: ${material}
Layer Height: ${layer}
Infill: ${infill}
Supports: ${supports}
Estimated Price: ₹${total}

Please confirm availability.`;

        const encodedMessage = encodeURIComponent(message);
        const btn = document.getElementById('custom-order-btn');
        if (btn) {
            btn.href = `https://wa.me/918800000000?text=${encodedMessage}`;
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (controls) {
            controls.update();
        }
        
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // ============================================
    // Sample Thumbnails
    // ============================================

    function initThumbnail(containerId, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(6, 4, 6);

        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(1);
        container.appendChild(renderer.domElement);

        // Simple lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dir = new THREE.DirectionalLight(0xffffff, 0.7);
        dir.position.set(5, 5, 5);
        scene.add(dir);

        // Get mesh
        let mesh;
        switch(type) {
            case 'phone-stand':
                mesh = createPhoneStandSample();
                break;
            case 'vase':
                mesh = createVaseSample();
                break;
            case 'figurine':
                mesh = createFigurineSample();
                break;
        }

        if (mesh) {
            scene.add(mesh);

            function animateThumb() {
                requestAnimationFrame(animateThumb);
                mesh.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animateThumb();
        }
    }

    // Init thumbnails
    setTimeout(() => {
        initThumbnail('thumb-phone-stand', 'phone-stand');
        initThumbnail('thumb-vase', 'vase');
        initThumbnail('thumb-figurine', 'figurine');
        
        // Load default sample
        loadSampleModel('phone-stand');
    }, 100);

    console.log('🔧 MagniPrints Custom 3D loaded!');

})();
