const CUSTOMIZATION_KEY = "campusQuest3d:customization";
const PROGRESS_KEY = "campusQuest3d:progress";
const LEADERBOARD_KEY = "campusQuest3d:leaderboard";

export function loadCustomization() {
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to load customization", error);
    return null;
  }
}

export function saveCustomization(customization) {
  localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(customization));
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to load progress", error);
    return null;
  }
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}

export function addLeaderboardEntry(entry) {
  const rows = loadLeaderboard();
  rows.push(entry);
  rows.sort((a, b) => b.careerPoints - a.careerPoints);
  const sliced = rows.slice(0, 8);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sliced));
  return sliced;
}

export function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Failed to load leaderboard", error);
    return [];
  }
}
