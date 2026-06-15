import { MISSIONS } from "../three/missions";

export default function MissionPanel({ missionIndex }) {
  return (
    <aside className="mission-panel">
      <h3>Missions</h3>
      <ol>
        {MISSIONS.map((mission, index) => {
          const status =
            index < missionIndex ? "done" : index === missionIndex ? "active" : "pending";
          return (
            <li key={mission.id} className={`mission-${status}`}>
              <span>{mission.title}</span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
