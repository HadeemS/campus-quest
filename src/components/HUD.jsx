export default function HUD({
  playerName,
  petName,
  careerPoints,
  energy,
  currentMission,
  interactionPrompt,
}) {
  return (
    <div className="hud">
      <div className="hud-card">
        <div className="hud-row">
          <span>Player</span>
          <strong>{playerName}</strong>
        </div>
        {petName ? (
          <div className="hud-row">
            <span>Pet</span>
            <strong>{petName}</strong>
          </div>
        ) : null}
        <div className="hud-row">
          <span>Career Points</span>
          <strong>{careerPoints}</strong>
        </div>
      </div>
      <div className="hud-card">
        <div className="hud-label">Energy</div>
        <div className="energy-track">
          <div className="energy-fill" style={{ width: `${Math.max(0, energy)}%` }} />
        </div>
        <div className="hud-label">Current mission</div>
        <p className="mission-copy">{currentMission || "All missions completed. Explore campus!"}</p>
        <p className="interaction-prompt">{interactionPrompt || "Move with WASD / Arrows"}</p>
      </div>
    </div>
  );
}
