/* ============================================
   MagniPrints — Order Tracking
   Live Print Preview & G-Code Stream
   ============================================ */

(function() {
    'use strict';

    // Demo state
    const state = {
        orderId: null,
        isDemo: false,
        totalLayers: 312,
        currentLayer: 147,
        progress: 47.1,
        isPrinting: false,
        countdownSeconds: 9000, // 2.5 hours in seconds
        nozzleTemp: 205,
        targetNozzleTemp: 205,
        bedTemp: 60,
        printSpeed: 60,
        filamentUsed: 142,
        totalFilament: 320
    };

    // ============================================
    // Order Search
    // ============================================

    const trackBtn = document.getElementById('track-btn');
    const orderInput = document.getElementById('order-input');
    const orderStatus = document.getElementById('order-status');

    if (trackBtn && orderInput) {
        trackBtn.addEventListener('click', () => {
            const orderId = orderInput.value.trim().toUpperCase();
            if (orderId) {
                trackOrder(orderId);
            }
        });

        orderInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                trackBtn.click();
            }
        });
    }

    function trackOrder(orderId) {
        state.orderId = orderId;
        state.isDemo = orderId === 'DEMO';

        // Update order ID display
        document.getElementById('display-order-id').textContent = 
            state.isDemo ? 'MP25021201' : orderId;

        // Show status container
        orderStatus.classList.remove('hidden');

        // Scroll to results
        setTimeout(() => {
            orderStatus.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // Start demo simulation
        if (state.isDemo) {
            startDemoSimulation();
        }
    }

    // ============================================
    // Countdown Timer
    // ============================================

    function updateCountdown() {
        const hours = Math.floor(state.countdownSeconds / 3600);
        const minutes = Math.floor((state.countdownSeconds % 3600) / 60);
        const seconds = state.countdownSeconds % 60;

        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        if (state.countdownSeconds > 0) {
            state.countdownSeconds--;
        }
    }

    setInterval(updateCountdown, 1000);

    // ============================================
    // Layer Visualization (Three.js)
    // ============================================

    const vizContainer = document.getElementById('layer-visualizer');
    if (!vizContainer) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, vizContainer.clientWidth / vizContainer.clientHeight, 0.1, 100);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(vizContainer.clientWidth, vizContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    vizContainer.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    
    const spotLight = new THREE.SpotLight(0xc9b896, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = 0.5;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.5);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    // Build plate
    const plateGeo = new THREE.CylinderGeometry(4, 4, 0.1, 64);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.05;
    plate.receiveShadow = true;
    scene.add(plate);

    // Grid on build plate
    const gridHelper = new THREE.PolarGridHelper(4, 16, 8, 64, 0x444444, 0x222222);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Object representation (growing layers)
    let objectGroup = new THREE.Group();
    objectGroup.position.y = 0.05;
    scene.add(objectGroup);

    // Create object representation
    function createObjectLayers(completedRatio) {
        // Clear existing
        while(objectGroup.children.length > 0) {
            objectGroup.remove(objectGroup.children[0]);
        }

        const material = new THREE.MeshStandardMaterial({ 
            color: 0xc9b896, 
            roughness: 0.3,
            metalness: 0.1
        });

        // Create a phone stand representation
        const totalHeight = 3.5;
        const currentHeight = totalHeight * completedRatio;
        const layerCount = Math.max(1, Math.floor(currentHeight / 0.1));

        // Build plate for the object
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.2, 2.5),
            material
        );
        base.position.y = 0.1;
        base.castShadow = true;
        objectGroup.add(base);

        // Add layers progressively
        for (let i = 1; i <= layerCount; i++) {
            const layerY = 0.2 + (i * 0.1);
            const layerProgress = i / (totalHeight / 0.1);
            
            // Simple representation - grows in height
            const layerObj = new THREE.Mesh(
                new THREE.BoxGeometry(
                    3 - layerProgress * 0.3, 
                    0.08, 
                    2.5 - layerProgress * 0.2
                ),
                material
            );
            layerObj.position.y = layerY;
            layerObj.castShadow = true;
            objectGroup.add(layerObj);
        }
    }

    // Initial creation
    createObjectLayers(state.progress / 100);

    // Nozzle visualization
    const nozzleGroup = new THREE.Group();
    
    // Nozzle body
    const nozzleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 })
    );
    nozzleBody.position.y = 0.4;
    
    // Hotend (copper)
    const hotend = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16),
        new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 })
    );
    hotend.position.y = 1;
    
    // Heat block
    const heatBlock = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.4, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 })
    );
    heatBlock.position.y = 1.4;
    
    nozzleGroup.add(nozzleBody, hotend, heatBlock);
    nozzleGroup.position.set(1.5, 0.8, 0.5);
    scene.add(nozzleGroup);

    // Animation
    let nozzleAngle = 0;
    function animateViz() {
        requestAnimationFrame(animateViz);

        // Animate nozzle
        if (state.isPrinting) {
            nozzleAngle += 0.02;
            nozzleGroup.position.x = Math.sin(nozzleAngle) * 1.5;
            nozzleGroup.position.z = Math.cos(nozzleAngle * 0.7) * 1.5;
            nozzleGroup.position.y = 0.8 + Math.abs(Math.sin(nozzleAngle * 2)) * 0.3;
        }

        // Gentle rotation of object
        objectGroup.rotation.y += 0.003;

        renderer.render(scene, camera);
    }
    animateViz();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = vizContainer.clientWidth / vizContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(vizContainer.clientWidth, vizContainer.clientHeight);
    });

    // ============================================
    // Demo Simulation
    // ============================================

    function startDemoSimulation() {
        state.isPrinting = true;

        // Update layer and progress periodically
        const progressInterval = setInterval(() => {
            if (state.currentLayer < state.totalLayers && state.isPrinting) {
                state.currentLayer++;
                state.progress = (state.currentLayer / state.totalLayers * 100);
                state.filamentUsed += 0.5;

                // Update UI
                updatePrintStats();
                createObjectLayers(state.progress / 100);

                // Add G-code lines
                addGCodeLine();

            } else if (state.currentLayer >= state.totalLayers) {
                state.isPrinting = false;
                clearInterval(progressInterval);
                completePrint();
            }
        }, 2000); // New layer every 2 seconds in demo
    }

    function updatePrintStats() {
        document.getElementById('current-layer').textContent = 
            `${state.currentLayer} / ${state.totalLayers}`;
        document.getElementById('print-progress').textContent = 
            state.progress.toFixed(1) + '%';
        document.getElementById('detail-filament').textContent = 
            `${Math.floor(state.filamentUsed)}g / ${state.totalFilament}g`;

        // Update step progress
        const stepProgress = document.getElementById('step-progress');
        if (stepProgress) {
            const percentage = 40 + (state.progress * 0.2); // 40-60% range during printing
            stepProgress.style.width = percentage + '%';
        }

        // Simulate temp fluctuations
        state.nozzleTemp = state.targetNozzleTemp + (Math.random() - 0.5) * 2;
        state.bedTemp = 60 + (Math.random() - 0.5) * 1;
        
        document.getElementById('nozzle-temp').textContent = 
            Math.round(state.nozzleTemp) + '°C';
        document.getElementById('bed-temp').textContent = 
            Math.round(state.bedTemp) + '°C';

        // Vary speed occasionally
        if (Math.random() > 0.7) {
            state.printSpeed = 55 + Math.floor(Math.random() * 20);
            document.getElementById('print-speed').textContent = 
                state.printSpeed + 'mm/s';
        }
    }

    function completePrint() {
        // Move to next step
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Mark printing as complete and QC as active
        const printStep = document.querySelector('[data-step="3"]');
        const qcStep = document.querySelector('[data-step="4"]');
        
        if (printStep) {
            printStep.classList.remove('active');
            printStep.classList.add('completed');
            printStep.querySelector('.step-time').textContent = 'Completed';
        }
        
        if (qcStep) {
            qcStep.classList.add('active');
            qcStep.querySelector('.step-time').textContent = 'In Progress';
        }

        // Update progress bar to 80%
        document.getElementById('step-progress').style.width = '80%';

        // Add complete message to terminal
        addSystemMessage('Print completed successfully! Starting quality check...');
    }

    // ============================================
    // G-Code Terminal
    // ============================================

    const terminal = document.getElementById('gcode-terminal');
    const gcodeCommands = [
        { cmd: 'G1', params: ['X', 'Y', 'Z', 'E', 'F'], ranges: [[0, 100], [0, 80], [0.2, 3.5], [0.5, 15], [1200, 2400]] },
        { cmd: 'G0', params: ['X', 'Y', 'Z', 'F'], ranges: [[0, 100], [0, 80], [0.2, 3.5], [3000, 6000]] },
        { cmd: 'G28', params: [], ranges: [] },
        { cmd: 'M104', params: ['S'], ranges: [[195, 215]] },
        { cmd: 'M140', params: ['S'], ranges: [[55, 65]] },
        { cmd: 'M109', params: ['S'], ranges: [[195, 215]] }
    ];

    function addGCodeLine() {
        if (!terminal) return;

        const cmdTemplate = gcodeCommands[Math.floor(Math.random() * 4)]; // Only G0/G1 most of the time
        const line = document.createElement('div');
        line.className = 'terminal-line gcode recent';

        const time = new Date().toTimeString().slice(0, 8);
        
        let paramsStr = '';
        if (cmdTemplate.params.length > 0) {
            cmdTemplate.params.forEach((param, i) => {
                const [min, max] = cmdTemplate.ranges[i];
                let val;
                if (param === 'X' || param === 'Y') {
                    val = (min + Math.random() * (max - min)).toFixed(1);
                } else if (param === 'Z') {
                    val = (0.2 + (state.currentLayer * 0.1)).toFixed(1);
                } else if (param === 'E') {
                    val = (min + Math.random() * (max - min)).toFixed(2);
                } else if (param === 'F') {
                    val = Math.floor(min + Math.random() * (max - min));
                } else {
                    val = Math.floor(min + Math.random() * (max - min));
                }
                paramsStr += `${param}${val} `;
            });
        }

        line.innerHTML = `
            <span class="timestamp">[${time}]</span>
            <span class="cmd">${cmdTemplate.cmd}</span>
            <span class="params">${paramsStr}</span>
        `;

        terminal.appendChild(line);

        // Remove 'recent' class from older lines
        const allLines = terminal.querySelectorAll('.terminal-line');
        allLines.forEach((l, i) => {
            if (i < allLines.length - 2) {
                l.classList.remove('recent');
            }
        });

        // Auto scroll
        terminal.scrollTop = terminal.scrollHeight;

        // Limit lines
        while (terminal.children.length > 100) {
            terminal.removeChild(terminal.firstChild);
        }
    }

    function addSystemMessage(msg) {
        if (!terminal) return;

        const line = document.createElement('div');
        line.className = 'terminal-line system recent';
        
        const time = new Date().toTimeString().slice(0, 8);
        line.innerHTML = `
            <span class="timestamp">[${time}]</span>
            <span class="message">${msg}</span>
        `;

        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Terminal controls
    document.getElementById('pause-term')?.addEventListener('click', () => {
        state.isPrinting = !state.isPrinting;
        addSystemMessage(state.isPrinting ? 'Print resumed' : 'Print paused');
    });

    document.getElementById('clear-term')?.addEventListener('click', () => {
        if (terminal) {
            terminal.innerHTML = '';
            addSystemMessage('Terminal cleared');
        }
    });

    // ============================================
    // Notifications
    // ============================================

    document.getElementById('notify-btn')?.addEventListener('click', () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('MagniPrints', {
                        body: `Order ${state.orderId || 'MP25021201'} - You'll receive updates on your print progress!`,
                        icon: '/assets/logo.png'
                    });
                }
            });
        } else {
            alert('Notifications enabled! You\'ll receive updates on your print progress.');
        }
    });

    // ============================================
    // Step Progress Animation
    // ============================================

    function animateStepProgress() {
        const progress = document.getElementById('step-progress');
        if (progress) {
            // Initial 40% - 2 steps completed
            setTimeout(() => {
                progress.style.width = '40%';
            }, 200);
        }
    }

    if (orderStatus) {
        const observer = new MutationObserver(() => {
            if (!orderStatus.classList.contains('hidden')) {
                animateStepProgress();
            }
        });
        observer.observe(orderStatus, { attributes: true, attributeFilter: ['class'] });
    }

    console.log('🔍 MagniPrints Track Order loaded!');

})();
