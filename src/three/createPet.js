import * as THREE from "three";

function createLabelSprite(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(15, 18, 30, 0.8)";
  ctx.fillRect(10, 12, 236, 68);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 48);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    })
  );
  sprite.scale.set(1.7, 0.64, 1);
  sprite.position.set(0, 1.6, 0);
  return sprite;
}

function createDog() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: "#9f7b5d" });
  const dark = new THREE.MeshStandardMaterial({ color: "#2f2a28" });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.36, 0.36), mat);
  body.position.y = 0.34;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.28), mat);
  head.position.set(0.36, 0.44, 0);
  const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), dark);
  earL.position.set(0.39, 0.57, -0.09);
  const earR = earL.clone();
  earR.position.z = 0.09;
  g.add(body, head, earL, earR);
  return g;
}

function createCat() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: "#6f7d8f" });
  const dark = new THREE.MeshStandardMaterial({ color: "#425164" });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.28, 0.32), mat);
  body.position.y = 0.32;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), mat);
  head.position.set(0.3, 0.42, 0);
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.11, 4), dark);
  earL.position.set(0.36, 0.58, -0.07);
  const earR = earL.clone();
  earR.position.z = 0.07;
  g.add(body, head, earL, earR);
  return g;
}

export function createPet(config) {
  if (!config.petType || config.petType === "none") {
    return null;
  }

  const group = config.petType === "dog" ? createDog() : createCat();
  group.traverse((obj) => {
    obj.castShadow = true;
    obj.receiveShadow = true;
  });
  if (config.petName?.trim()) {
    group.add(createLabelSprite(config.petName.trim()));
  }
  group.userData.phase = Math.random() * Math.PI * 2;
  return group;
}

export function updatePetFollow(pet, playerPosition, dt, elapsedTime) {
  if (!pet) return;
  const followTarget = new THREE.Vector3(
    playerPosition.x - 1.05,
    0,
    playerPosition.z + 0.9
  );
  pet.position.lerp(followTarget, Math.min(1, dt * 3.4));
  const bob = Math.sin(elapsedTime * 3 + pet.userData.phase) * 0.05;
  pet.position.y = 0.02 + Math.abs(bob);
}
