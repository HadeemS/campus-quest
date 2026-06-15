import * as THREE from "three";

export function createInputController(canvas) {
  const keys = {};
  let dragging = false;
  let prevX = 0;
  let cameraYaw = 0;

  const onKeyDown = (event) => {
    keys[event.key.toLowerCase()] = true;
  };

  const onKeyUp = (event) => {
    keys[event.key.toLowerCase()] = false;
  };

  const onMouseDown = (event) => {
    if (event.button !== 0) return;
    dragging = true;
    prevX = event.clientX;
  };

  const onMouseUp = () => {
    dragging = false;
  };

  const onMouseMove = (event) => {
    if (!dragging) return;
    const delta = event.clientX - prevX;
    prevX = event.clientX;
    cameraYaw -= delta * 0.005;
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);

  return {
    keys,
    getCameraYaw() {
      return cameraYaw;
    },
    setCameraYaw(value) {
      cameraYaw = value;
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
    },
  };
}
