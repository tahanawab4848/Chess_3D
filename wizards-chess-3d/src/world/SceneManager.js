import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CathedralBuilder } from './CathedralBuilder.js';
import { AltarBoardBuilder } from './AltarBoardBuilder.js';
import { PieceFactory } from './PieceFactory.js';
import { ShatterPhysics } from './ShatterPhysics.js';

export class SceneManager {
  constructor(container, onSquareClicked) {
    this.container = container;
    this.onSquareClicked = onSquareClicked;
    this.pieceMeshes = new Map();
    this.cameraPresetIndex = 0;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07080c);
    this.scene.fog = new THREE.FogExp2(0x07080c, 0.032);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
    this.camera.position.set(0, 7.5, 9.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 18;

    this.setupLights();
    CathedralBuilder.build(this.scene);
    const altar = AltarBoardBuilder.build(this.scene);
    this.tileMeshes = altar.tileMeshes;
    this.flameCones = altar.flameCones;

    this.shatterPhysics = new ShatterPhysics(this.scene);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.bindEvents();
  }

  setupLights() {
    this.scene.add(new THREE.AmbientLight(0x6e7ea8, 0.75));
    const moonLight = new THREE.DirectionalLight(0xdce6ff, 1.8);
    moonLight.position.set(6, 15, 8);
    moonLight.castShadow = true;
    this.scene.add(moonLight);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const tiles = Array.from(this.tileMeshes.values());
      const hits = this.raycaster.intersectObjects(tiles, false);
      if (hits.length > 0) {
        this.onSquareClicked(hits[0].object.userData.square);
      }
    });
  }

  squareToWorld(square) {
    const file = square.charCodeAt(0) - 97;
    const rank = 8 - parseInt(square[1], 10);
    return new THREE.Vector3(file - 3.5, 0.05, rank - 3.5);
  }

  syncBoard(board2D) {
    this.pieceMeshes.forEach(mesh => this.scene.remove(mesh));
    this.pieceMeshes.clear();

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board2D[r][c];
        if (!cell) continue;
        const square = `${files[c]}${8 - r}`;
        const mesh = PieceFactory.createPieceMesh(cell.type, cell.color);
        mesh.position.copy(this.squareToWorld(square));
        this.scene.add(mesh);
        this.pieceMeshes.set(square, mesh);
      }
    }
  }

  highlightSquares(selectedSq, legalMoves = []) {
    this.tileMeshes.forEach(tile => {
      tile.material.color.setHex(tile.userData.baseColor);
      tile.material.emissive.setHex(0x000000);
    });

    if (selectedSq && this.tileMeshes.has(selectedSq)) {
      const t = this.tileMeshes.get(selectedSq);
      t.material.emissive.setHex(0x665214);
    }

    legalMoves.forEach(m => {
      const t = this.tileMeshes.get(m.to);
      if (t) {
        t.material.emissive.setHex(m.captured ? 0x6b1515 : 0x1e4d2b);
      }
    });
  }

  triggerCaptureShatter(square, capturedColor) {
    const worldPos = this.squareToWorld(square);
    this.shatterPhysics.spawnExplosion(worldPos, capturedColor);
  }

  cycleCameraPreset() {
    const presets = [
      { name: 'Orbit', pos: [0, 7.5, 9.2] },
      { name: 'White', pos: [0, 5.2, 8.8] },
      { name: 'Black', pos: [0, 5.2, -8.8] },
      { name: 'Top', pos: [0, 13.5, 0.01] }
    ];
    this.cameraPresetIndex = (this.cameraPresetIndex + 1) % presets.length;
    const p = presets[this.cameraPresetIndex];
    this.camera.position.set(...p.pos);
    this.controls.target.set(0, 0, 0);
    return p.name;
  }

  animate(dt, elapsed) {
    // Idle crown rotation
    this.pieceMeshes.forEach(mesh => {
      if (mesh.userData.crown) {
        mesh.userData.crown.rotation.y = elapsed * 1.2 + mesh.userData.phase;
      }
    });

    // Flickering corner braziers
    this.flameCones.forEach(fc => {
      const s = 0.9 + Math.sin(elapsed * 9 + fc.phase) * 0.14;
      fc.flame.scale.set(s, s, s);
      fc.fireLight.intensity = 2.0 + Math.sin(elapsed * 11 + fc.phase) * 0.4;
    });

    this.shatterPhysics.update(dt);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
