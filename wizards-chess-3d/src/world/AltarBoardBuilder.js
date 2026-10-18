import * as THREE from 'three';

export class AltarBoardBuilder {
  static build(scene) {
    const boardGroup = new THREE.Group();
    const tileMeshes = new Map();

    const lightTileMat = new THREE.MeshStandardMaterial({
      color: 0xd8d0c0,
      roughness: 0.42,
      metalness: 0.08
    });

    const darkTileMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c22,
      roughness: 0.28,
      metalness: 0.25
    });

    const mortarMat = new THREE.MeshStandardMaterial({
      color: 0x0b0c10,
      roughness: 0.9
    });

    // Recessed Mortar Bed
    const bed = new THREE.Mesh(new THREE.BoxGeometry(8.35, 0.22, 8.35), mortarMat);
    bed.position.y = -0.12;
    bed.receiveShadow = true;
    boardGroup.add(bed);

    // 64 Chiseled Beveled Stone Squares
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const tileGeo = new THREE.BoxGeometry(0.95, 0.14, 0.95);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const squareName = `${files[c]}${8 - r}`;
        const tile = new THREE.Mesh(tileGeo, (isLight ? lightTileMat : darkTileMat).clone());

        tile.position.set(c - 3.5, -0.02, r - 3.5);
        tile.receiveShadow = true;
        tile.userData = { square: squareName, isLight, baseColor: isLight ? 0xd8d0c0 : 0x1a1c22 };

        boardGroup.add(tile);
        tileMeshes.set(squareName, tile);
      }
    }

    // Monumental Multi-Tiered Gothic Stone Altar Plinth
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x262830,
      roughness: 0.78,
      metalness: 0.12
    });
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb8933c,
      roughness: 0.35,
      metalness: 0.8
    });

    // Perimeter Curb Frame
    const curb = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.36, 9.4), stoneMat);
    curb.position.y = -0.22;
    curb.receiveShadow = true;
    boardGroup.add(curb);

    // Bronze Molding Trim
    const trim = new THREE.Mesh(new THREE.BoxGeometry(8.55, 0.26, 8.55), bronzeMat);
    trim.position.y = -0.14;
    boardGroup.add(trim);

    // Stepped Crypt Dais Tiers
    const tiers = [
      { size: 10.6, height: 0.55, y: -0.65 },
      { size: 12.2, height: 0.65, y: -1.25 },
      { size: 14.4, height: 0.75, y: -1.95 }
    ];
    tiers.forEach(t => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(t.size, t.height, t.size), stoneMat);
      mesh.position.y = t.y;
      mesh.receiveShadow = true;
      boardGroup.add(mesh);
    });

    // Corner Bastion Turrets & Flaming Braziers
    const corners = [
      [-4.6, -4.6], [4.6, -4.6],
      [-4.6, 4.6], [4.6, 4.6]
    ];
    const flameCones = [];

    corners.forEach(([cx, cz]) => {
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.78, 2.5, 8), stoneMat);
      turret.position.set(cx, -1.0, cz);
      boardGroup.add(turret);

      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.25, 0.28, 12), bronzeMat);
      bowl.position.set(cx, 0.35, cz);
      boardGroup.add(bowl);

      const flameMat = new THREE.MeshBasicMaterial({ color: 0xff7722 });
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.65, 8), flameMat);
      flame.position.set(cx, 0.75, cz);
      boardGroup.add(flame);

      const fireLight = new THREE.PointLight(0xff7722, 2.2, 9);
      fireLight.position.set(cx, 1.1, cz);
      boardGroup.add(fireLight);

      flameCones.push({ flame, fireLight, phase: Math.random() * Math.PI * 2 });
    });

    scene.add(boardGroup);
    return { boardGroup, tileMeshes, flameCones };
  }
}
