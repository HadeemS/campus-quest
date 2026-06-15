import * as THREE from "three";

function createLimb(color) {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.12, 0.8, 8),
    new THREE.MeshStandardMaterial({ color })
  );
}

function createHair(style, color = "#2f1f12") {
  const hair = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color });

  if (style === "ponytail") {
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 12), material);
    top.position.y = 1.78;
    hair.add(top);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), material);
    tail.position.set(0, 1.62, -0.34);
    tail.rotation.x = Math.PI * 0.45;
    hair.add(tail);
  } else if (style === "short") {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), material);
    cap.scale.y = 0.7;
    cap.position.y = 1.76;
    hair.add(cap);
  } else {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), material);
    puff.scale.y = 0.8;
    puff.position.y = 1.8;
    hair.add(puff);
  }

  return hair;
}

function createAccessory(type) {
  const accessory = new THREE.Group();
  const darkMaterial = new THREE.MeshStandardMaterial({ color: "#1f2430" });

  if (type === "backpack") {
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.72, 0.24), darkMaterial);
    pack.position.set(0, 1.02, -0.36);
    accessory.add(pack);
  } else if (type === "glasses") {
    const ringGeometry = new THREE.TorusGeometry(0.11, 0.02, 8, 14);
    const left = new THREE.Mesh(ringGeometry, darkMaterial);
    left.position.set(-0.14, 1.56, 0.33);
    left.rotation.x = Math.PI / 2;
    const right = left.clone();
    right.position.x = 0.14;
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.02, 0.02), darkMaterial);
    bridge.position.set(0, 1.56, 0.33);
    accessory.add(left, right, bridge);
  } else if (type === "headphones") {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.03, 8, 16, Math.PI), darkMaterial);
    band.position.set(0, 1.73, 0);
    band.rotation.z = Math.PI;
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 10), darkMaterial);
    earL.position.set(-0.28, 1.56, 0);
    earL.rotation.z = Math.PI / 2;
    const earR = earL.clone();
    earR.position.x = 0.28;
    accessory.add(band, earL, earR);
  }

  return accessory;
}

export function createCharacter(config) {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: config.skinTone });
  const shirtMat = new THREE.MeshStandardMaterial({ color: config.shirtColor });
  const pantsMat = new THREE.MeshStandardMaterial({ color: config.pantsColor });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 1.02, 16), shirtMat);
  body.position.y = 1.02;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
  head.position.y = 1.68;

  const legLeft = createLimb(config.pantsColor);
  legLeft.position.set(-0.14, 0.43, 0);
  const legRight = createLimb(config.pantsColor);
  legRight.position.set(0.14, 0.43, 0);

  const armLeft = createLimb(config.skinTone);
  armLeft.position.set(-0.4, 1.14, 0);
  armLeft.rotation.z = Math.PI * 0.08;
  const armRight = createLimb(config.skinTone);
  armRight.position.set(0.4, 1.14, 0);
  armRight.rotation.z = -Math.PI * 0.08;

  const hair = createHair(config.hairstyle);
  const accessory = createAccessory(config.accessory);

  group.add(body, head, legLeft, legRight, armLeft, armRight, hair, accessory);
  group.castShadow = true;
  group.traverse((obj) => {
    obj.castShadow = true;
    obj.receiveShadow = true;
  });

  return {
    group,
    parts: { armLeft, armRight, legLeft, legRight, body },
  };
}
