import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { createCharacter } from "../three/createCharacter";
import { createPet } from "../three/createPet";

const DEFAULTS = {
  playerName: "Alex",
  skinTone: "#f1c89f",
  shirtColor: "#4f86f7",
  pantsColor: "#2f3448",
  hairstyle: "short",
  accessory: "backpack",
  petType: "none",
  petName: "",
};

const SKIN_TONES = ["#f6d2b8", "#d9aa81", "#b8835c", "#8e5f41", "#6b4430"];
const HAIRS = ["short", "curly", "ponytail"];
const ACCESSORIES = ["none", "backpack", "glasses", "headphones"];

export default function CharacterCreator({ initialValue, onStart }) {
  const mountRef = useRef(null);
  const [form, setForm] = useState(() => ({ ...DEFAULTS, ...initialValue }));

  const petOptions = useMemo(
    () => [
      { id: "none", label: "No Pet", copy: "Solo adventure" },
      { id: "cat", label: "Cat", copy: "Calm and clever" },
      { id: "dog", label: "Dog", copy: "Energetic and loyal" },
    ],
    []
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d1425");
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(2.8, 2.2, 3.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const key = new THREE.DirectionalLight("#fef1cd", 1.4);
    key.position.set(4, 7, 3);
    key.castShadow = true;
    const fill = new THREE.AmbientLight("#bcd3ff", 0.58);
    scene.add(key, fill);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.6, 24),
      new THREE.MeshStandardMaterial({ color: "#1f2e4f" })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    let actorBundle = createCharacter(form);
    actorBundle.group.position.set(0, 0, 0);
    scene.add(actorBundle.group);
    let petMesh = createPet(form);
    if (petMesh) {
      petMesh.position.set(-1.05, 0, 0.4);
      scene.add(petMesh);
    }

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsed = clock.getElapsedTime();
      actorBundle.group.rotation.y = Math.sin(elapsed * 0.8) * 0.35 + elapsed * 0.2;
      actorBundle.parts.armLeft.rotation.x = Math.sin(elapsed * 4) * 0.25;
      actorBundle.parts.armRight.rotation.x = Math.cos(elapsed * 4) * 0.25;
      if (petMesh) {
        petMesh.position.y = Math.abs(Math.sin(elapsed * 3.3)) * 0.08;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [form]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onStart({
      ...form,
      playerName: form.playerName.trim() || "Adventurer",
      petName: form.petType === "none" ? "" : form.petName.trim() || `${form.petType} buddy`,
    });
  };

  return (
    <main className="creator-layout">
      <section className="creator-preview">
        <h1>Campus Quest 3D</h1>
        <p>Create your student and begin your campus adventure.</p>
        <div ref={mountRef} className="preview-canvas" />
      </section>
      <form className="creator-form" onSubmit={submit}>
        <h2>Character Creator</h2>
        <label>
          Name
          <input
            value={form.playerName}
            onChange={(event) => update("playerName", event.target.value)}
            placeholder="Enter your name"
            maxLength={20}
          />
        </label>

        <div className="field-group">
          <span>Skin Tone</span>
          <div className="swatch-row">
            {SKIN_TONES.map((tone) => (
              <button
                key={tone}
                type="button"
                className={`swatch ${form.skinTone === tone ? "active" : ""}`}
                style={{ backgroundColor: tone }}
                onClick={() => update("skinTone", tone)}
              />
            ))}
          </div>
        </div>

        <label>
          Shirt Color
          <input
            type="color"
            value={form.shirtColor}
            onChange={(event) => update("shirtColor", event.target.value)}
          />
        </label>
        <label>
          Pants Color
          <input
            type="color"
            value={form.pantsColor}
            onChange={(event) => update("pantsColor", event.target.value)}
          />
        </label>
        <label>
          Hairstyle
          <select value={form.hairstyle} onChange={(event) => update("hairstyle", event.target.value)}>
            {HAIRS.map((hair) => (
              <option key={hair} value={hair}>
                {hair}
              </option>
            ))}
          </select>
        </label>
        <label>
          Accessory
          <select value={form.accessory} onChange={(event) => update("accessory", event.target.value)}>
            {ACCESSORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="field-group">
          <span>Pet</span>
          <div className="pet-cards">
            {petOptions.map((pet) => (
              <button
                key={pet.id}
                type="button"
                className={`pet-card ${form.petType === pet.id ? "active" : ""}`}
                onClick={() => update("petType", pet.id)}
              >
                <strong>{pet.label}</strong>
                <small>{pet.copy}</small>
              </button>
            ))}
          </div>
        </div>

        {form.petType !== "none" ? (
          <label>
            Pet Name
            <input
              value={form.petName}
              onChange={(event) => update("petName", event.target.value)}
              placeholder="Name your companion"
              maxLength={18}
            />
          </label>
        ) : null}

        <button className="primary-btn" type="submit">
          Start Adventure
        </button>
      </form>
    </main>
  );
}
