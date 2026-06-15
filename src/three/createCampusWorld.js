import * as THREE from "three";
import { buildColliderForMesh } from "./collisions";

function addTree(scene, x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.2, 1.1, 10),
    new THREE.MeshStandardMaterial({ color: "#77513b" })
  );
  trunk.position.set(x, 0.55, z);
  trunk.castShadow = true;
  trunk.receiveShadow = true;

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 1.7, 10),
    new THREE.MeshStandardMaterial({ color: "#3b8c4f" })
  );
  leaves.position.set(x, 1.85, z);
  leaves.castShadow = true;

  scene.add(trunk, leaves);
}

function addLamp(scene, x, z) {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: "#5f6572", metalness: 0.35 })
  );
  pole.position.set(x, 1.1, z);
  pole.castShadow = true;

  const lightHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.14, 0.2),
    new THREE.MeshStandardMaterial({ color: "#fff7cf", emissive: "#806d19" })
  );
  lightHead.position.set(x, 2.22, z);
  scene.add(pole, lightHead);
}

function addBench(scene, x, z) {
  const mat = new THREE.MeshStandardMaterial({ color: "#6c4c33" });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.46), mat);
  seat.position.set(x, 0.46, z);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.32, 0.08), mat);
  back.position.set(x, 0.62, z - 0.18);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), mat);
  legL.position.set(x - 0.58, 0.2, z);
  const legR = legL.clone();
  legR.position.x = x + 0.58;
  scene.add(seat, back, legL, legR);
}

function createSign(text, x, z) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1, 6),
    new THREE.MeshStandardMaterial({ color: "#6d7482" })
  );
  pole.position.y = 0.5;
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 0.08),
    new THREE.MeshStandardMaterial({ color: "#1f2635" })
  );
  board.position.y = 1.1;
  group.add(pole, board);
  group.position.set(x, 0, z);

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(23, 30, 47, 0.92)";
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 64);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
  );
  sprite.scale.set(2.3, 1.1, 1);
  sprite.position.set(0, 1.1, 0.1);
  group.add(sprite);
  return group;
}

function addInteractable(scene, interactables, id, x, z, color = "#40b3ff") {
  const marker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.06, 14),
    new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      emissive: color,
      emissiveIntensity: 0.2,
    })
  );
  marker.position.set(x, 0.03, z);
  marker.receiveShadow = true;
  scene.add(marker);
  interactables.push({ id, marker, position: new THREE.Vector3(x, 0, z) });
}

function addBuilding(scene, colliders, label, opts) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(opts.w, opts.h, opts.d),
    new THREE.MeshStandardMaterial({ color: opts.color, roughness: 0.92 })
  );
  mesh.position.set(opts.x, opts.h / 2, opts.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.max(opts.w, opts.d) * 0.5, 0.6, 4),
    new THREE.MeshStandardMaterial({ color: "#4d5568" })
  );
  roof.position.set(opts.x, opts.h + 0.3, opts.z);
  roof.rotation.y = Math.PI * 0.25;
  roof.castShadow = true;
  scene.add(roof);

  scene.add(createSign(label, opts.x, opts.z - opts.d * 0.72));
  colliders.push(buildColliderForMesh(mesh, 0.3));
}

export function createCampusWorld(scene) {
  const colliders = [];
  const interactables = [];
  const worldHalfSize = 42;

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: "#4c9e5a", roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const paths = [
    [0, 0, 10, 70],
    [0, -10, 62, 8],
    [0, 14, 62, 8],
  ];
  for (const [x, z, w, d] of paths) {
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.05, d),
      new THREE.MeshStandardMaterial({ color: "#d4d8df" })
    );
    path.position.set(x, 0.03, z);
    path.receiveShadow = true;
    scene.add(path);
  }

  addBuilding(scene, colliders, "Dorms", {
    x: -25,
    z: -18,
    w: 12,
    h: 5.5,
    d: 10,
    color: "#9fa8c8",
  });
  addBuilding(scene, colliders, "Library", {
    x: -16,
    z: 18,
    w: 13,
    h: 6.2,
    d: 10,
    color: "#c3a98e",
  });
  addBuilding(scene, colliders, "Student Union", {
    x: 0,
    z: 18,
    w: 13,
    h: 5.8,
    d: 9,
    color: "#87acc7",
  });
  addBuilding(scene, colliders, "Tech Lab", {
    x: 16,
    z: 18,
    w: 13,
    h: 6.2,
    d: 10,
    color: "#9cc4b1",
  });
  addBuilding(scene, colliders, "Career Center", {
    x: 16,
    z: -18,
    w: 12,
    h: 5.8,
    d: 10,
    color: "#c8a3a3",
  });

  const fairZone = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 0.08, 24),
    new THREE.MeshStandardMaterial({ color: "#ffc759", transparent: true, opacity: 0.8 })
  );
  fairZone.position.set(0, 0.04, -24);
  fairZone.receiveShadow = true;
  scene.add(fairZone);
  scene.add(createSign("Internship Fair", 0, -29));

  const park = new THREE.Mesh(
    new THREE.CircleGeometry(8, 24),
    new THREE.MeshStandardMaterial({ color: "#67b46f" })
  );
  park.rotation.x = -Math.PI / 2;
  park.position.set(28, 0.05, 0);
  scene.add(park);
  scene.add(createSign("Campus Park", 28, -8));

  for (let i = -34; i <= 34; i += 8) {
    addLamp(scene, i, -4);
    addTree(scene, i * 0.6, 30);
    addTree(scene, i * 0.6, -32);
  }
  addBench(scene, 27.5, 3);
  addBench(scene, 26, -2);

  addInteractable(scene, interactables, "resumeSpot", -20, -9, "#4fd2ff");
  addInteractable(scene, interactables, "libraryDesk", -16, 10, "#4fffd3");
  addInteractable(scene, interactables, "workshopZone", 0, 10, "#66ff84");
  addInteractable(scene, interactables, "debugStation", 16, 10, "#ffcf4f");
  addInteractable(scene, interactables, "careerDesk", 16, -10, "#ffa34f");
  addInteractable(scene, interactables, "internshipStage", 0, -24, "#ff6b88");

  const ambient = new THREE.AmbientLight("#d8e7ff", 0.48);
  const directional = new THREE.DirectionalLight("#fff8da", 1.15);
  directional.position.set(-12, 20, 8);
  directional.castShadow = true;
  directional.shadow.mapSize.width = 2048;
  directional.shadow.mapSize.height = 2048;
  directional.shadow.camera.left = -50;
  directional.shadow.camera.right = 50;
  directional.shadow.camera.top = 50;
  directional.shadow.camera.bottom = -50;
  scene.add(ambient, directional);

  return { colliders, interactables, worldHalfSize };
}
