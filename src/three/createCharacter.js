import * as THREE from "three";

function createArmPivot(skinMaterial, shirtMaterial, side = 1) {
  const pivot = new THREE.Group();
  pivot.position.set(0.43 * side, 1.34, 0);

  const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.36, 6, 10), shirtMaterial);
  upperArm.position.y = -0.24;
  upperArm.rotation.z = side > 0 ? Math.PI * 0.07 : -Math.PI * 0.07;

  const lowerArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.3, 6, 10), skinMaterial);
  lowerArm.position.y = -0.62;

  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), skinMaterial);
  hand.position.y = -0.85;
  hand.scale.set(0.95, 0.8, 1);

  pivot.add(upperArm, lowerArm, hand);
  return pivot;
}

function createLegPivot(pantsMaterial, shoeMaterial, side = 1) {
  const pivot = new THREE.Group();
  pivot.position.set(0.17 * side, 0.88, 0.02);

  const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.42, 6, 10), pantsMaterial);
  thigh.position.y = -0.28;

  const calf = new THREE.Mesh(new THREE.CapsuleGeometry(0.096, 0.38, 6, 10), pantsMaterial);
  calf.position.y = -0.66;

  const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.35), shoeMaterial);
  shoe.position.set(0, -0.94, 0.09);

  pivot.add(thigh, calf, shoe);
  return pivot;
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
    pack.position.set(0, 1.02, -0.34);
    accessory.add(pack);
  } else if (type === "glasses") {
    const ringGeometry = new THREE.TorusGeometry(0.11, 0.02, 8, 14);
    const left = new THREE.Mesh(ringGeometry, darkMaterial);
    left.position.set(-0.1, 1.8, 0.24);
    left.rotation.x = Math.PI / 2;
    const right = left.clone();
    right.position.x = 0.1;
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.02, 0.02), darkMaterial);
    bridge.position.set(0, 1.8, 0.24);
    accessory.add(left, right, bridge);
  } else if (type === "headphones") {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.03, 8, 16, Math.PI), darkMaterial);
    band.position.set(0, 1.98, 0);
    band.rotation.z = Math.PI;
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 10), darkMaterial);
    earL.position.set(-0.28, 1.8, 0);
    earL.rotation.z = Math.PI / 2;
    const earR = earL.clone();
    earR.position.x = 0.28;
    accessory.add(band, earL, earR);
  }

  return accessory;
}

export function createCharacter(config) {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: config.skinTone, roughness: 0.65 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: config.shirtColor, roughness: 0.55 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: config.pantsColor, roughness: 0.62 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: "#242937", roughness: 0.78 });

  const body = new THREE.Group();
  const torsoUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.29, 0.34, 8, 14), shirtMat);
  torsoUpper.position.y = 1.27;
  torsoUpper.scale.set(1.08, 1.14, 0.92);

  const torsoLower = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.22, 8, 12), shirtMat);
  torsoLower.position.y = 0.95;
  torsoLower.scale.set(1, 0.95, 0.86);

  const belt = new THREE.Mesh(
    new THREE.TorusGeometry(0.26, 0.028, 8, 20),
    new THREE.MeshStandardMaterial({ color: "#242b36", roughness: 0.6 })
  );
  belt.position.y = 0.82;
  belt.rotation.x = Math.PI / 2;

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.14, 12), skinMat);
  neck.position.y = 1.52;
  body.add(torsoUpper, torsoLower, belt, neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 18), skinMat);
  head.position.y = 1.79;
  head.scale.set(1, 1.03, 0.96);

  const browMat = new THREE.MeshStandardMaterial({ color: "#24150e", roughness: 0.85 });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: "#eef4ff", roughness: 0.25 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: "#1a2133", roughness: 0.15 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: "#944656", roughness: 0.7 });
  const blushMat = new THREE.MeshStandardMaterial({ color: "#ef9aa5", transparent: true, opacity: 0.55 });

  const eyeLeftWhite = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyeWhiteMat);
  eyeLeftWhite.position.set(-0.095, 1.81, 0.225);
  eyeLeftWhite.scale.set(1, 0.8, 0.35);
  const eyeRightWhite = eyeLeftWhite.clone();
  eyeRightWhite.position.x = 0.095;

  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), pupilMat);
  leftPupil.position.set(-0.095, 1.81, 0.252);
  const rightPupil = leftPupil.clone();
  rightPupil.position.x = 0.095;

  const browLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.022, 0.02), browMat);
  browLeft.position.set(-0.096, 1.86, 0.22);
  browLeft.rotation.z = Math.PI * 0.08;
  const browRight = browLeft.clone();
  browRight.position.x = 0.096;
  browRight.rotation.z = -Math.PI * 0.08;

  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 8, 16, Math.PI), mouthMat);
  mouth.position.set(0, 1.69, 0.226);
  mouth.rotation.z = Math.PI;

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.075, 10), skinMat);
  nose.position.set(0, 1.75, 0.258);
  nose.rotation.x = Math.PI * 0.52;

  const earLeft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), skinMat);
  earLeft.position.set(-0.265, 1.79, 0.02);
  earLeft.scale.set(0.56, 0.8, 0.5);
  const earRight = earLeft.clone();
  earRight.position.x = 0.265;

  const cheekLeft = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), blushMat);
  cheekLeft.position.set(-0.14, 1.71, 0.23);
  cheekLeft.scale.set(1.2, 0.8, 0.35);
  const cheekRight = cheekLeft.clone();
  cheekRight.position.x = 0.14;

  const legLeft = createLegPivot(pantsMat, shoeMat, -1);
  const legRight = createLegPivot(pantsMat, shoeMat, 1);

  const armLeft = createArmPivot(skinMat, shirtMat, -1);
  const armRight = createArmPivot(skinMat, shirtMat, 1);

  const hair = createHair(config.hairstyle);
  const accessory = createAccessory(config.accessory);

  group.add(
    body,
    head,
    legLeft,
    legRight,
    armLeft,
    armRight,
    hair,
    accessory,
    eyeLeftWhite,
    eyeRightWhite,
    leftPupil,
    rightPupil,
    browLeft,
    browRight,
    mouth,
    nose,
    earLeft,
    earRight,
    cheekLeft,
    cheekRight
  );
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
