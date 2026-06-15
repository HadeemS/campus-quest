export const MISSIONS = [
  {
    id: "resume",
    title: "Leave the dorm and pick up your resume",
    targetId: "resumeSpot",
    reward: 25,
  },
  {
    id: "library",
    title: "Study at the library",
    targetId: "libraryDesk",
    reward: 30,
  },
  {
    id: "union",
    title: "Attend a student union workshop",
    targetId: "workshopZone",
    reward: 35,
  },
  {
    id: "techlab",
    title: "Debug code at the tech lab",
    targetId: "debugStation",
    reward: 40,
  },
  {
    id: "career",
    title: "Visit the career center",
    targetId: "careerDesk",
    reward: 45,
  },
  {
    id: "fair",
    title: "Present yourself at the internship fair",
    targetId: "internshipStage",
    reward: 55,
  },
];

export function getMission(index) {
  return MISSIONS[index] ?? null;
}

export function isMissionComplete(index) {
  return index >= MISSIONS.length;
}
