import * as THREE from 'three';

/**
 * KUNJ SODHI — 25+ YEAR SENIOR FRONTEND CREATIVE 3D WORLD
 * High-performance WebGL Engine:
 * - 3D Neural Constellation Network (dynamic distance line graph)
 * - Orbiting Floating Geometries (Wireframe Icosahedron & Torus Knot)
 * - Scroll-Driven Camera 3D Trajectory
 * - Fluid Mouse Magnetism & Inertial Parallax
 * - Battery-friendly auto-pause and capped DPR
 */
export class Scene3DWorld {
  constructor(canvasId = 'webgl-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 3D Objects
    this.particleSystem = null;
    this.linesMesh = null;
    this.heroCore = null;
    this.floatingKnot = null;
    this.orbitingGroup = null;

    // Interactive State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.targetScrollProgress = 0;
    this.scrollProgress = 0;

    // Dimensions
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.rafId = null;
    this.clock = new THREE.Clock();
    this.isVisible = true;

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 22);

    // 2. High-Performance Renderer
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL not supported:', e);
      return;
    }

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    // 3. Build 3D Entities
    this.buildConstellation();
    this.buildHeroSculptures();
    this.buildLighting();

    // 4. Event Listeners
    this.bindEvents();

    // 5. Start Animation Loop
    this.render();
  }

  /**
   * Generates a circular luminous particle texture in memory
   */
  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(16, 72, 239, 0.85)');
    gradient.addColorStop(0.5, 'rgba(255, 196, 0, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * 3D Neural Constellation Network
   */
  buildConstellation() {
    this.particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const velocities = [];

    const cobalt = new THREE.Color('#1048EF');
    const gold = new THREE.Color('#FFC400');
    const crimson = new THREE.Color('#E02424');

    const spreadX = 46;
    const spreadY = 40;
    const spreadZ = 28;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spreadX;
      positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

      // Color distribution: Cobalt & Warm Gold
      const pick = Math.random();
      const col = pick > 0.6 ? gold : pick > 0.15 ? cobalt : crimson;
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.008,
        baseX: positions[i3],
        baseY: positions[i3 + 1],
        baseZ: positions[i3 + 2]
      });
    }

    this.particleVelocities = velocities;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.85,
      map: this.createGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);

    // Dynamic Connection Lines (Constellation Mesh)
    const maxLines = 450;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.linesMesh);
  }

  /**
   * Hero 3D Interactive Floating Sculptures
   */
  buildHeroSculptures() {
    this.orbitingGroup = new THREE.Group();
    this.orbitingGroup.position.set(7.5, 1.2, 0);

    // 1. Dual-Cage Wireframe Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x1048EF,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    this.heroCoreOuter = new THREE.Mesh(outerGeo, outerMat);
    this.orbitingGroup.add(this.heroCoreOuter);

    // 2. Inner Golden Dodecahedron
    const innerGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xF59E0B,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    this.heroCoreInner = new THREE.Mesh(innerGeo, innerMat);
    this.orbitingGroup.add(this.heroCoreInner);

    // 3. Floating Torus Knot on the deeper plane
    const knotGeo = new THREE.TorusKnotGeometry(1.8, 0.45, 90, 16);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x2563EB,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    this.floatingKnot = new THREE.Mesh(knotGeo, knotMat);
    this.floatingKnot.position.set(-10, -5, -8);
    this.scene.add(this.floatingKnot);

    this.scene.add(this.orbitingGroup);
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    this.scene.add(ambientLight);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
      this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) this.clock.start();
    });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.camera && this.renderer) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  /**
   * Hook for Lenis or window scroll progress
   */
  setScrollProgress(progress) {
    this.targetScrollProgress = Math.min(Math.max(progress, 0), 1);
  }

  updatePhysics(delta, elapsed) {
    // 1. Smooth mouse damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Smooth scroll progress interpolation
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // 3. Scroll-Driven 3D Camera Path
    // Camera travels in an S-curve arc across 3D space as user scrolls
    const sp = this.scrollProgress;
    const targetCamX = Math.sin(sp * Math.PI * 2) * 4 + this.mouse.x * 1.5;
    const targetCamY = -sp * 14 + 1.5 + this.mouse.y * 1.2;
    const targetCamZ = 22 - Math.sin(sp * Math.PI) * 7;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;

    this.camera.lookAt(this.mouse.x * 2, -sp * 12, 0);

    // 4. Animate Floating Geometric Sculptures
    if (this.heroCoreOuter) {
      this.heroCoreOuter.rotation.x = elapsed * 0.22 + sp * 3;
      this.heroCoreOuter.rotation.y = elapsed * 0.35 + sp * 2;
    }
    if (this.heroCoreInner) {
      this.heroCoreInner.rotation.x = -elapsed * 0.38;
      this.heroCoreInner.rotation.y = elapsed * 0.52;
    }
    if (this.floatingKnot) {
      this.floatingKnot.rotation.x = elapsed * 0.18 + sp * 2;
      this.floatingKnot.rotation.y = elapsed * 0.26;
      this.floatingKnot.position.y = -5 - sp * 10 + Math.sin(elapsed * 0.8) * 0.8;
    }

    // 5. Update Particle Cloud & Dynamic Constellation Lines
    if (this.particleSystem && this.linesMesh) {
      const positions = this.particleSystem.geometry.attributes.position.array;
      const linePositions = this.linesMesh.geometry.attributes.position.array;
      const lineColors = this.linesMesh.geometry.attributes.color.array;

      let lineIndex = 0;
      const maxConnectDistance = 5.2;

      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const vel = this.particleVelocities[i];

        // Organic floating
        positions[i3] += vel.x;
        positions[i3 + 1] += vel.y + Math.sin(elapsed + i) * 0.003;
        positions[i3 + 2] += vel.z;

        // Subtle mouse repulsion in 3D
        const dx = positions[i3] - (this.mouse.x * 12);
        const dy = positions[i3 + 1] - (this.mouse.y * 10);
        const distSq = dx * dx + dy * dy;

        if (distSq < 36) {
          const force = (1 - Math.sqrt(distSq) / 6) * 0.035;
          positions[i3] += dx * force;
          positions[i3 + 1] += dy * force;
        }

        // Connect nearby particles with luminous lines
        for (let j = i + 1; j < this.particleCount; j++) {
          if (lineIndex >= 440) break;

          const j3 = j * 3;
          const pDist = Math.hypot(
            positions[i3] - positions[j3],
            positions[i3 + 1] - positions[j3 + 1],
            positions[i3 + 2] - positions[j3 + 2]
          );

          if (pDist < maxConnectDistance) {
            const alpha = 1 - (pDist / maxConnectDistance);
            const lIdx = lineIndex * 6;

            linePositions[lIdx] = positions[i3];
            linePositions[lIdx + 1] = positions[i3 + 1];
            linePositions[lIdx + 2] = positions[i3 + 2];

            linePositions[lIdx + 3] = positions[j3];
            linePositions[lIdx + 4] = positions[j3 + 1];
            linePositions[lIdx + 5] = positions[j3 + 2];

            // Electric cobalt tint with fade
            lineColors[lIdx] = 0.06 * alpha;
            lineColors[lIdx + 1] = 0.28 * alpha;
            lineColors[lIdx + 2] = 0.94 * alpha;

            lineColors[lIdx + 3] = 0.06 * alpha;
            lineColors[lIdx + 4] = 0.28 * alpha;
            lineColors[lIdx + 5] = 0.94 * alpha;

            lineIndex++;
          }
        }
      }

      this.particleSystem.geometry.attributes.position.needsUpdate = true;
      this.linesMesh.geometry.setDrawRange(0, lineIndex * 2);
      this.linesMesh.geometry.attributes.position.needsUpdate = true;
      this.linesMesh.geometry.attributes.color.needsUpdate = true;
    }
  }

  render() {
    this.rafId = requestAnimationFrame(() => this.render());

    if (!this.isVisible) return;

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    this.updatePhysics(delta, elapsed);

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.renderer) this.renderer.dispose();
  }
}
