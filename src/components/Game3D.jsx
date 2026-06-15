import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import HUD from "./HUD";
import MissionPanel from "./MissionPanel";
import PauseMenu from "./PauseMenu";
import Leaderboard from "./Leaderboard";
import { createCampusWorld } from "../three/createCampusWorld";
import { createCharacter } from "../three/createCharacter";
import { createInputController } from "../three/controls";
import { collidesWithAny, isOutOfBounds } from "../three/collisions";
import { createPet, updatePetFollow } from "../three/createPet";
import { getMission, isMissionComplete } from "../three/missions";
import { addLeaderboardEntry, clearProgress, loadLeaderboard, loadProgress, saveProgress } from "../utils/storage";

const PLAYER_RADIUS = 0.55;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Game3D({ customization, onRestartToCreator }) {
  const mountRef = useRef(null);
  const pausedRef = useRef(false);
  const settingsRef = useRef({
    cameraSensitivity: 1,
    musicVolume: 0.45,
    shadows: true,
  });
  const [hudState, setHudState] = useState(() => ({
    careerPoints: 0,
    energy: 100,
    missionIndex: 0,
    interactionPrompt: "Find your first mission marker near the Dorms.",
  }));
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState({
    cameraSensitivity: 1,
    musicVolume: 0.45,
    shadows: true,
  });
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard());
  const completedRunRef = useRef(false);

  const titleMission = useMemo(() => getMission(hudState.missionIndex), [hudState.missionIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const saved = loadProgress();
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#bed5f5", 45, 95);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const world = createCampusWorld(scene);
    const player = createCharacter(customization);
    player.group.position.set(-25, 0, -6);
    if (saved?.playerPosition) {
      player.group.position.set(saved.playerPosition.x, 0, saved.playerPosition.z);
    }
    scene.add(player.group);

    const pet = createPet(customization);
    if (pet) {
      pet.position.set(player.group.position.x - 1, 0, player.group.position.z + 1);
      scene.add(pet);
    }

    const controller = createInputController(renderer.domElement);
    const rayTarget = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;
    let saveAccumulator = 0;
    let missionIndex = saved?.missionIndex ?? 0;
    let careerPoints = saved?.careerPoints ?? 0;
    let energy = saved?.energy ?? 100;
    let priorP = false;
    let priorR = false;
    let priorE = false;
    let interactionPrompt = "Explore campus and follow your mission markers.";
    setHudState({ careerPoints, energy, missionIndex, interactionPrompt });

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const restartRun = () => {
      missionIndex = 0;
      careerPoints = 0;
      energy = 100;
      completedRunRef.current = false;
      clearProgress();
      player.group.position.set(-25, 0, -6);
      interactionPrompt = "Run restarted. Head to your first marker!";
    };

    const handleMissionComplete = () => {
      const mission = getMission(missionIndex);
      if (!mission) return;
      careerPoints += mission.reward;
      energy = clamp(energy + 20, 0, 100);
      missionIndex += 1;
      interactionPrompt = isMissionComplete(missionIndex)
        ? "All missions complete! Press R to play again."
        : "Mission complete! Move to the next marker.";

      if (isMissionComplete(missionIndex) && !completedRunRef.current) {
        completedRunRef.current = true;
        const rows = addLeaderboardEntry({
          name: customization.playerName,
          careerPoints,
          completedAt: new Date().toISOString(),
        });
        setLeaderboard(rows);
      }
    };

    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const keys = controller.keys;
      const pPressed = Boolean(keys.p);
      const rPressed = Boolean(keys.r);
      const ePressed = Boolean(keys.e);

      if (pPressed && !priorP) {
        pausedRef.current = !pausedRef.current;
        setPaused(pausedRef.current);
      }
      if (rPressed && !priorR) {
        restartRun();
      }
      priorP = pPressed;
      priorR = rPressed;

      if (!pausedRef.current) {
        const input = controller.getMovementVector();
        const yaw = controller.getCameraYaw() * settingsRef.current.cameraSensitivity;
        const direction = new THREE.Vector3(
          input.x * Math.cos(yaw) - input.y * Math.sin(yaw),
          0,
          input.x * Math.sin(yaw) + input.y * Math.cos(yaw)
        );

        const isMoving = direction.lengthSq() > 0.0001 && energy > 0;
        const speed = isMoving ? 5.5 : 0;

        if (isMoving) {
          direction.normalize();
          const nextPos = player.group.position.clone().addScaledVector(direction, speed * dt);
          if (
            !collidesWithAny(nextPos, PLAYER_RADIUS, world.colliders) &&
            !isOutOfBounds(nextPos, world.worldHalfSize)
          ) {
            player.group.position.copy(nextPos);
          }
          player.group.rotation.y = Math.atan2(direction.x, direction.z);

          const swing = Math.sin(elapsed * 12) * 0.6;
          player.parts.armLeft.rotation.x = swing;
          player.parts.armRight.rotation.x = -swing;
          player.parts.legLeft.rotation.x = -swing;
          player.parts.legRight.rotation.x = swing;
          player.parts.body.position.y = 1.02 + Math.abs(Math.sin(elapsed * 12)) * 0.06;
          energy = clamp(energy - dt * 12, 0, 100);
        } else {
          player.parts.armLeft.rotation.x *= 0.8;
          player.parts.armRight.rotation.x *= 0.8;
          player.parts.legLeft.rotation.x *= 0.8;
          player.parts.legRight.rotation.x *= 0.8;
          player.parts.body.position.y = 1.02;
          energy = clamp(energy + dt * 7, 0, 100);
        }

        updatePetFollow(pet, player.group.position, dt, elapsed);

        const desiredCamera = new THREE.Vector3(
          player.group.position.x + Math.sin(yaw) * 6.5,
          4.5,
          player.group.position.z + Math.cos(yaw) * 6.5
        );
        camera.position.lerp(desiredCamera, 0.08);
        rayTarget.set(player.group.position.x, 1.2, player.group.position.z);
        camera.lookAt(rayTarget);

        const mission = getMission(missionIndex);
        const activeMarker = world.interactables.find((spot) => spot.id === mission?.targetId);
        if (activeMarker) {
          const dist = player.group.position.distanceTo(activeMarker.position);
          const pulse = 0.6 + Math.sin(elapsed * 4) * 0.2;
          activeMarker.marker.scale.setScalar(pulse);
          interactionPrompt =
            dist < 1.9 ? "Press E to interact" : "Go to the highlighted mission marker";
          if (ePressed && !priorE && dist < 1.9) {
            handleMissionComplete();
          }
        } else if (isMissionComplete(missionIndex)) {
          interactionPrompt = "You completed Campus Quest 3D. Press R to replay.";
        }

        priorE = ePressed;

        renderer.shadowMap.enabled = settingsRef.current.shadows;
        renderer.render(scene, camera);

        saveAccumulator += dt;
        if (saveAccumulator > 1.5) {
          saveProgress({
            missionIndex,
            careerPoints,
            energy,
            playerPosition: {
              x: player.group.position.x,
              z: player.group.position.z,
            },
          });
          saveAccumulator = 0;
        }
      } else {
        renderer.render(scene, camera);
      }

      setHudState({
        careerPoints: Math.floor(careerPoints),
        energy: Math.floor(energy),
        missionIndex,
        interactionPrompt,
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controller.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [customization]);

  return (
    <div className="game-shell">
      <div ref={mountRef} className="game-canvas" />
      <HUD
        playerName={customization.playerName}
        petName={customization.petType !== "none" ? customization.petName : ""}
        careerPoints={hudState.careerPoints}
        energy={hudState.energy}
        currentMission={titleMission?.title}
        interactionPrompt={hudState.interactionPrompt}
      />
      <MissionPanel missionIndex={hudState.missionIndex} />
      <Leaderboard entries={leaderboard} />
      <PauseMenu
        paused={paused}
        settings={settings}
        onResume={() => {
          pausedRef.current = false;
          setPaused(false);
        }}
        onRestart={() => {
          setPaused(false);
          clearProgress();
          window.location.reload();
        }}
        onSettingsChange={(key, value) =>
          setSettings((prev) => {
            const next = { ...prev, [key]: value };
            settingsRef.current = next;
            return next;
          })
        }
      />
      <button className="back-btn" onClick={onRestartToCreator}>
        Character Creator
      </button>
    </div>
  );
}
