import * as THREE from 'three';

export class CathedralBuilder {
  static build(scene) {
    const group = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x161820,
      roughness: 0.85
    });

    // Crypt Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.35;
    floor.receiveShadow = true;
    group.add(floor);

    // Gothic Nave Columns along Perimeter
    for (let z = -18; z <= 18; z += 6) {
      [-12, 12].forEach(x => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 18, 12), pillarMat);
        col.position.set(x, 6.5, z);
        col.castShadow = true;
        group.add(col);
      });
    }

    // Backlit Rose Window
    const roseRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.2, 0.32, 12, 32),
      new THREE.MeshBasicMaterial({ color: 0x6c8cff })
    );
    roseRing.position.set(0, 9.5, -22);
    group.add(roseRing);

    scene.add(group);
  }
}
