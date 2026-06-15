import { useMemo, useState } from "react";
import CharacterCreator from "./components/CharacterCreator";
import Game3D from "./components/Game3D";
import { loadCustomization, saveCustomization } from "./utils/storage";

export default function App() {
  const stored = useMemo(() => loadCustomization(), []);
  const [customization, setCustomization] = useState(stored);
  const [started, setStarted] = useState(false);

  const handleStart = (config) => {
    setCustomization(config);
    saveCustomization(config);
    setStarted(true);
  };

  if (!started || !customization) {
    return <CharacterCreator initialValue={customization} onStart={handleStart} />;
  }

  return (
    <Game3D
      customization={customization}
      onRestartToCreator={() => {
        setStarted(false);
      }}
    />
  );
}
