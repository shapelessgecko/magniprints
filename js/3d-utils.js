// ========================================
// MAGNIPRINTS 3D UTILITIES
// Procedural model generation with Three.js
// ========================================

// Product model definitions using Three.js primitives
const ProductModels = {
  // Phone Stand - Angled holder with base
  phoneStand: (scene, material) => {
    const group = new THREE.Group();
    
    // Base
    const baseGeom = new THREE.BoxGeometry(3, 0.3, 3);
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 0.15;
    group.add(base);
    
    // Back support
    const backGeom = new THREE.BoxGeometry(3, 1.5, 0.3);
    const back = new THREE.Mesh(backGeom, material);
    back.position.set(0, 0.75, -1.35);
    back.rotation.x = -0.2;
    group.add(back);
    
    // Phone rest lip
    const lipGeom = new THREE.BoxGeometry(3, 0.4, 0.4);
    const lip = new THREE.Mesh(lipGeom, material);
    lip.position.set(0, 0.2, -1.2);
    lip.rotation.x = 0.2;
    group.add(lip);
    
    // Charging cutout
    const cutoutGeom = new THREE.BoxGeometry(0.8, 0.4, 0.5);
    const cutout = new THREE.Mesh(cutoutGeom, new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0 }));
    cutout.position.set(0, 0.3, 0.1);
    group.add(cutout);
    
    return group;
  },

  // Succulent Planter - Geometric pot
  succulentPlanter: (scene, material) => {
    const group = new THREE.Group();
    
    // Main pot - tapered cylinder with geometric pattern
    const potGeom = new THREE.CylinderGeometry(1.2, 0.8, 2, 8);
    const pot = new THREE.Mesh(potGeom, material);
    pot.position.y = 1;
    group.add(pot);
    
    // Rim
    const rimGeom = new THREE.TorusGeometry(1.2, 0.1, 8, 8);
    const rim = new THREE.Mesh(rimGeom, material);
    rim.position.y = 2;
    rim.rotation.x = Math.PI / 2;
    group.add(rim);
    
    // Inner soil representation
    const soilGeom = new THREE.CylinderGeometry(1, 1, 0.1, 8);
    const soilMat = new THREE.MeshStandardMaterial({ 
      color: 0x3d2314, 
      roughness: 1,
      metalness: 0
    });
    const soil = new THREE.Mesh(soilGeom, soilMat);
    soil.position.y = 1.5;
    group.add(soil);
    
    // Small succulent plant
    const plantGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const leafGeom = new THREE.SphereGeometry(0.2, 6, 4);
      leafGeom.scale(1, 0.3, 0.6);
      const leafMat = new THREE.MeshStandardMaterial({ 
        color: 0x4a7c59, 
        roughness: 0.8 
      });
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.position.set(
        Math.cos(i * Math.PI * 0.4) * 0.3,
        1.6 + Math.sin(i * 0.5) * 0.1,
        Math.sin(i * Math.PI * 0.4) * 0.3
      );
      leaf.rotation.y = i * Math.PI * 0.4;
      leaf.rotation.z = 0.2;
      plantGroup.add(leaf);
    }
    group.add(plantGroup);
    
    return group;
  },

  // Cable Organizer - Wave design with slots
  cableOrganizer: (scene, material) => {
    const group = new THREE.Group();
    
    // Main curved body using scaled cylinder segments
    for (let i = 0; i < 5; i++) {
      const segmentGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
      const segment = new THREE.Mesh(segmentGeom, material);
      segment.rotation.z = Math.PI / 2;
      segment.position.set(-1.5 + i * 0.7, 0.3 + Math.sin(i * 0.5) * 0.1, 0);
      group.add(segment);
      
      // Add gaps between segments
      if (i < 4) {
        const notchGeom = new THREE.BoxGeometry(0.1, 0.3, 0.4);
        const notch = new THREE.Mesh(notchGeom, material);
        notch.position.set(-1.15 + i * 0.7, 0.3, 0);
        group.add(notch);
      }
    }
    
    // Base feet
    const footGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
    [-1.5, 0, 1.5].forEach((x, i) => {
      const foot = new THREE.Mesh(footGeom, material);
      foot.position.set(x, 0.15, 0.4);
      group.add(foot);
      const foot2 = foot.clone();
      foot2.position.set(x, 0.15, -0.4);
      group.add(foot2);
    });
    
    return group;
  },

  // Keychain - Ring with charm
  keychain: (scene, material) => {
    const group = new THREE.Group();
    
    // Split ring
    const ringGeom = new THREE.TorusGeometry(0.4, 0.08, 8, 32);
    const ring = new THREE.Mesh(ringGeom, material);
    ring.position.y = 1.2;
    ring.scale.set(1, 1, 0.5);
    group.add(ring);
    
    // Connector link
    const linkGeom = new THREE.TorusGeometry(0.12, 0.04, 6, 16);
    const link = new THREE.Mesh(linkGeom, material);
    link.position.set(0, 0.7, 0);
    group.add(link);
    
    // Main charm - geometric shape
    const charmGeom = new THREE.IcosahedronGeometry(0.5, 1);
    const charm = new THREE.Mesh(charmGeom, material);
    charm.position.set(0, 0.3, 0);
    charm.scale.set(1, 0.8, 0.4);
    group.add(charm);
    
    // Logo engraving (simulated with smaller geometry)
    const logoGeom = new THREE.BoxGeometry(0.15, 0.02, 0.3);
    const logoMat = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      roughness: 0.2,
      metalness: 0.8
    });
    const logo = new THREE.Mesh(logoGeom, logoMat);
    logo.position.set(0, 0.71, 0);
    group.add(logo);
    
    return group;
  },

  // Controller Stand - Dual support for game controllers
  controllerStand: (scene, material) => {
    const group = new THREE.Group();
    
    // Base plate
    const baseGeom = new THREE.BoxGeometry(4, 0.2, 2);
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 0.1;
    group.add(base);
    
    // Left support
    const supportGeom = new THREE.BoxGeometry(0.3, 1.5, 1.5);
    const leftSupport = new THREE.Mesh(supportGeom, material);
    leftSupport.position.set(-1.5, 0.75, 0);
    leftSupport.rotation.z = -0.15;
    group.add(leftSupport);
    
    // Right support
    const rightSupport = new THREE.Mesh(supportGeom, material);
    rightSupport.position.set(1.5, 0.75, 0);
    rightSupport.rotation.z = 0.15;
    group.add(rightSupport);
    
    // Top cradles - curved
    const cradleGeom = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 16);
    const leftCradle = new THREE.Mesh(cradleGeom, material);
    leftCradle.rotation.z = Math.PI / 2;
    leftCradle.rotation.y = -0.15;
    leftCradle.position.set(-1.3, 1.4, 0);
    group.add(leftCradle);
    
    const rightCradle = new THREE.Mesh(cradleGeom, material);
    rightCradle.rotation.z = Math.PI / 2;
    rightCradle.rotation.y = 0.15;
    rightCradle.position.set(1.3, 1.4, 0);
    group.add(rightCradle);
    
    // Cable management holes
    [0.5, 1.5, 2.5, 3.5].forEach(x => {
      const holeGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.25, 12);
      const hole = new THREE.Mesh(holeGeom, new THREE.MeshBasicMaterial({ color: 0 }));
      hole.position.set(x - 2, 0.1, 0.5);
      group.add(hole);
    });
    
    return group;
  },

  // Desk Organizer - Multi-compartment tray
  deskOrganizer: (scene, material) => {
    const group = new THREE.Group();
    
    // Base
    const baseGeom = new THREE.BoxGeometry(5, 0.3, 4);
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 0.15;
    group.add(base);
    
    // Back wall
    const backWallGeom = new THREE.BoxGeometry(5, 1.5, 0.3);
    const backWall = new THREE.Mesh(backWallGeom, material);
    backWall.position.set(0, 0.75, -1.85);
    group.add(backWall);
    
    // Side walls
    const sideWallGeom = new THREE.BoxGeometry(0.3, 1.5, 4);
    const leftWall = new THREE.Mesh(sideWallGeom, material);
    leftWall.position.set(-2.35, 0.75, 0);
    group.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeom, material);
    rightWall.position.set(2.35, 0.75, 0);
    group.add(rightWall);
    
    // Divider 1 - Creates phone section
    const divider1Geom = new THREE.BoxGeometry(2.2, 1.2, 0.3);
    const divider1 = new THREE.Mesh(divider1Geom, material);
    divider1.position.set(-1.4, 0.6, 0.5);
    group.add(divider1);
    
    // Divider 2 - Small items section
    const divider2Geom = new THREE.BoxGeometry(2.2, 1.2, 0.3);
    const divider2 = new THREE.Mesh(divider2Geom, material);
    divider2.position.set(1.4, 0.6, -0.5);
    group.add(divider2);
    
    // Pen holder section
    const penHolderGeom = new THREE.BoxGeometry(1, 1.2, 1.5);
    const penHolder = new THREE.Mesh(penHolderGeom, material);
    penHolder.position.set(1.9, 0.6, 1.25);
    group.add(penHolder);
    
    // Front lip for phone section
    const lipGeom = new THREE.BoxGeometry(2.2, 0.4, 0.3);
    const lip = new THREE.Mesh(lipGeom, material);
    lip.position.set(-1.4, 0.2, 1.85);
    group.add(lip);
    
    return group;
  },

  // Lithophane Frame - Thin frame with decorative border
  lithophaneFrame: (scene, material) => {
    const group = new THREE.Group();
    
    // Outer frame
    const frameGeom = new THREE.BoxGeometry(4, 5, 0.5);
    const frame = new THREE.Mesh(frameGeom, material);
    frame.position.y = 2.5;
    group.add(frame);
    
    // Inner recessed area for lithophane
    const innerGeom = new THREE.BoxGeometry(3.2, 4.2, 0.4);
    const inner = new THREE.Mesh(innerGeom, new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0
    }));
    inner.position.set(0, 2.5, 0.06);
    group.add(inner);
    
    // Back stand
    const standGeom = new THREE.BoxGeometry(3, 2, 0.3);
    const stand = new THREE.Mesh(standGeom, material);
    stand.position.set(0, 1.5, -0.5);
    stand.rotation.x = 0.3;
    group.add(stand);
    
    // Decorative corner details
    [
      [-1.8, 0.3, 0.2],
      [1.8, 0.3, 0.2],
      [-1.8, 4.7, 0.2],
      [1.8, 4.7, 0.2]
    ].forEach(pos => {
      const cornerGeom = new THREE.SphereGeometry(0.2, 12, 8);
      const corner = new THREE.Mesh(cornerGeom, material);
      corner.position.set(...pos);
      group.add(corner);
    });
    
    return group;
  },

  // Sample models for Custom Upload page
  sampleVase: (scene, material) => {
    const group = new THREE.Group();
    
    // Curved vase using lathe geometry effect with cylinders
    const baseGeom = new THREE.CylinderGeometry(1.5, 1.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 0.25;
    group.add(base);
    
    const bodyGeom = new THREE.CylinderGeometry(1, 2, 3, 32);
    const body = new THREE.Mesh(bodyGeom, material);
    body.position.y = 2;
    group.add(body);
    
    const neckGeom = new THREE.CylinderGeometry(0.8, 1, 1, 32);
    const neck = new THREE.Mesh(neckGeom, material);
    neck.position.y = 4;
    group.add(neck);
    
    const rimGeom = new THREE.TorusGeometry(0.8, 0.15, 12, 32);
    const rim = new THREE.Mesh(rimGeom, material);
    rim.position.y = 4.5;
    rim.rotation.x = Math.PI / 2;
    group.add(rim);
    
    return group;
  },

  sampleFigurine: (scene, material) => {
    const group = new THREE.Group();
    
    // Base
    const baseGeom = new THREE.CylinderGeometry(1, 1.2, 0.3, 16);
    const base = new THREE.Mesh(baseGeom, material);
    base.position.y = 0.15;
    group.add(base);
    
    // Body (rounded)
    const bodyGeom = new THREE.SphereGeometry(0.8, 20, 16);
    const body = new THREE.Mesh(bodyGeom, material);
    body.position.y = 1.2;
    body.scale.y = 1.3;
    group.add(body);
    
    // Head
    const headGeom = new THREE.SphereGeometry(0.5, 16, 12);
    const head = new THREE.Mesh(headGeom, material);
    head.position.y = 2.3;
    group.add(head);
    
    // Arms
    const armGeom = new THREE.CapsuleGeometry(0.15, 1, 4, 8);
    const leftArm = new THREE.Mesh(armGeom, material);
    leftArm.position.set(-0.9, 1.5, 0);
    leftArm.rotation.z = 0.3;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeom, material);
    rightArm.position.set(0.9, 1.5, 0);
    rightArm.rotation.z = -0.3;
    group.add(rightArm);
    
    return group;
  }
};

// Material presets for different filaments
const FilamentMaterials = {
  pla: (theme) => new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.6,
    metalness: 0.1,
    name: 'PLA'
  }),
  petg: (theme) => new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.4,
    metalness: 0.2,
    name: 'PETG'
  }),
  tpu: (theme) => new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0,
    transparent: true,
    opacity: 0.95,
    name: 'TPU'
  }),
  // Color variants
  white: () => new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.5,
    metalness: 0.1,
    name: 'White'
  }),
  black: () => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.5,
    metalness: 0.1,
    name: 'Black'
  }),
  accent: (theme) => new THREE.MeshStandardMaterial({
    color: theme === 'light' ? 0x22c55e : 0x667eea,
    roughness: 0.3,
    metalness: 0.4,
    emissive: theme === 'light' ? 0x22c55e : 0x667eea,
    emissiveIntensity: 0.1,
    name: 'Accent'
  })
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductModels, FilamentMaterials };
}
