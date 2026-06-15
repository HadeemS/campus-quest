import * as THREE from "three";

const TEMP_BOX = new THREE.Box3();

export function buildColliderForMesh(mesh, padding = 0.6) {
  const box = new THREE.Box3().setFromObject(mesh);
  box.min.x -= padding;
  box.min.z -= padding;
  box.max.x += padding;
  box.max.z += padding;
  return box;
}

export function collidesWithAny(position, radius, colliders) {
  TEMP_BOX.min.set(position.x - radius, -2, position.z - radius);
  TEMP_BOX.max.set(position.x + radius, 5, position.z + radius);
  return colliders.some((box) => box.intersectsBox(TEMP_BOX));
}

export function isOutOfBounds(position, halfSize) {
  return (
    Math.abs(position.x) > halfSize ||
    Math.abs(position.z) > halfSize
  );
}
