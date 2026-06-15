export default function PauseMenu({
  paused,
  settings,
  onResume,
  onRestart,
  onSettingsChange,
}) {
  if (!paused) return null;

  return (
    <div className="pause-overlay">
      <div className="pause-panel">
        <h2>Paused</h2>
        <p>Press P to resume anytime.</p>
        <div className="settings-group">
          <label>
            Camera Sensitivity
            <input
              type="range"
              min="0.3"
              max="1.8"
              step="0.1"
              value={settings.cameraSensitivity}
              onChange={(event) =>
                onSettingsChange("cameraSensitivity", Number(event.target.value))
              }
            />
          </label>
          <label>
            Music Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(event) => onSettingsChange("musicVolume", Number(event.target.value))}
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.shadows}
              onChange={(event) => onSettingsChange("shadows", event.target.checked)}
            />
            Enable shadows
          </label>
        </div>
        <div className="pause-actions">
          <button onClick={onResume}>Resume</button>
          <button onClick={onRestart}>Restart (R)</button>
        </div>
      </div>
    </div>
  );
}
