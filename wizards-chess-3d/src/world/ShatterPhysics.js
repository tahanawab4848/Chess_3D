import * as THREE from 'three';

export class ShatterPhysics {
  constructor(scene) {
    this.scene = scene;
    this.shards = [];
  }

  spawnExplosion(worldPosition, color) {
    const isWhite = color === 'w';
    const mat = new THREE.MeshStandardMaterial({
      color: isWhite ? 0xf3efe6 : 0x191920,
      emissive: isWhite ? 0x332800 : 0x661a00,
      roughness: 0.3,
      metalness: 0.4
    });

    for (let i = 0; i < 34; i++) {
      const size = 0.06 + Math.random() * 0.11;
      const geo = new THREE.DodecahedronGeometry(size, 0);
      const shard = new THREE.Mesh(geo, mat);

      shard.position.copy(worldPosition);
      shard.position.y += 0.2 + Math.random() * 0.6;

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.6 + Math.random() * 3.8;
      shard.userData = {
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          2.2 + Math.random() * 3.5,
          Math.sin(angle) * speed
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        life: 2.2
      };

      this.scene.add(shard);
      this.shards.push(shard);
    }
  }

  update(dt) {
    for (let i = this.shards.length - 1; i >= 0; i--) {
      const s = this.shards[i];
      s.userData.vel.y -= 9.8 * dt;
      s.position.addScaledVector(s.userData.vel, dt);

      if (s.position.y < 0.06) {
        s.position.y = 0.06;
        s.userData.vel.y *= -0.45;
        s.userData.vel.x *= 0.78;
        s.userData.vel.z *= 0.78;
      }

      s.rotation.x += s.userData.rotVel.x * dt;
      s.rotation.y += s.userData.rotVel.y * dt;
      s.userData.life -= dt;

      if (s.userData.life <= 0) {
        this.scene.remove(s);
        s.geometry.dispose();
        this.shards.splice(i, 1);
      }
    }
  }
}
