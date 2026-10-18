import * as THREE from 'three';

export class PieceFactory {
  static createPieceMesh(type, color) {
    const group = new THREE.Group();
    const isWhite = color === 'w';

    const mainMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xf3efe6 : 0x16161b,
      roughness: isWhite ? 0.25 : 0.18,
      metalness: isWhite ? 0.1 : 0.45
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xd4af37 : 0xff5722,
      emissive: isWhite ? 0x2a1f04 : 0x551200,
      roughness: 0.25,
      metalness: 0.85
    });

    // Pedestal Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.18, 16), mainMat);
    base.position.y = 0.09;
    base.castShadow = true;
    group.add(base);

    const trimRing = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24), accentMat);
    trimRing.rotation.x = Math.PI / 2;
    trimRing.position.y = 0.18;
    group.add(trimRing);

    // Sculpted Body by Piece Type
    let height = 0.7;
    if (type === 'p') height = 0.55;
    if (type === 'r' || type === 'n') height = 0.75;
    if (type === 'b') height = 0.88;
    if (type === 'q') height = 1.05;
    if (type === 'k') height = 1.18;

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, height, 12), mainMat);
    body.position.y = 0.18 + height / 2;
    body.castShadow = true;
    group.add(body);

    // Finial / Crown
    let crown;
    if (type === 'p') {
      crown = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), mainMat);
    } else if (type === 'r') {
      crown = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.42), mainMat);
    } else if (type === 'n') {
      crown = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.45, 6), mainMat);
      crown.rotation.z = isWhite ? -0.35 : 0.35;
    } else if (type === 'b') {
      crown = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), accentMat);
    } else if (type === 'q') {
      crown = new THREE.Mesh(new THREE.TorusKnotGeometry(0.14, 0.04, 32, 8), accentMat);
    } else {
      crown = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 1), accentMat);
    }

    crown.position.y = 0.24 + height;
    crown.castShadow = true;
    group.add(crown);

    group.userData = { type, color, crown, phase: Math.random() * Math.PI * 2 };
    return group;
  }
}
