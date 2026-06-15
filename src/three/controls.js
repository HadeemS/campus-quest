import * as THREE from "three";

export function createInputController(canvas) {
  const keys = {};
  let dragging = false;
  let dragButton = 0;
  let prevX = 0;
  let prevY = 0;
  let cameraYaw = 0;
  let cameraPitch = 0.45;
  let cameraDistance = 6.4;
  let lookSensitivity = 1;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const onKeyDown = (event) => {
    keys[event.key.toLowerCase()] = true;
  };

  const onKeyUp = (event) => {
    keys[event.key.toLowerCase()] = false;
  };

  const onMouseDown = (event) => {
    if (event.button !== 0 && event.button !== 2) return;
    dragging = true;
    dragButton = event.button;
    prevX = event.clientX;
    prevY = event.clientY;
  };

  const onMouseUp = () => {
    dragging = false;
    dragButton = 0;
  };

  const onMouseMove = (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - prevX;
    const deltaY = event.clientY - prevY;
    prevX = event.clientX;
    prevY = event.clientY;
    if (dragButton === 2 || dragButton === 0) {
      cameraYaw -= deltaX * 0.004 * lookSensitivity;
      cameraPitch = clamp(cameraPitch - deltaY * 0.003 * lookSensitivity, 0.18, 1.2);
    }
  };

  const onWheel = (event) => {
    cameraDistance = clamp(cameraDistance + event.deltaY * 0.004, 3.2, 9.5);
  };

  const onContextMenu = (event) => {
    event.preventDefault();
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);

  canvas.addEventListener("wheel", onWheel, { passive: true });
  canvas.addEventListener("contextmenu", onContextMenu);

  return {
    keys,
    getCameraYaw() {
      return cameraYaw;
    },
    getCameraPitch() {
      return cameraPitch;
    },
    getCameraDistance() {
      return cameraDistance;
    },
    setCameraYaw(value) {
      cameraYaw = value;
    },
    setCameraPitch(value) {
      cameraPitch = clamp(value, 0.18, 1.2);
    },
    setCameraDistance(value) {
      cameraDistance = clamp(value, 3.2, 9.5);
    },
    setLookSensitivity(value) {
      lookSensitivity = clamp(value, 0.3, 2.1);
    },
    getMovementVector() {
      const move = new THREE.Vector2(0, 0);
      if (keys.w || keys.arrowup) move.y += 1;
      if (keys.s || keys.arrowdown) move.y -= 1;
      if (keys.a || keys.arrowleft) move.x -= 1;
      if (keys.d || keys.arrowright) move.x += 1;
      if (move.lengthSq() > 1) move.normalize();
      return move;
    },
    dispose() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContextMenu);
    },
  };
}
