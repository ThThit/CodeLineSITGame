/** Every screen in the proposal's wireframe list (§10). */
export type Screen =
  // Demo index (start page)
  | "demo"
  // Instructor (screens 2–9)
  | "home"
  | "questions"
  | "create-question"
  | "setup"
  | "lobby"
  | "live"
  | "results"
  | "dashboard"
  // Student (screens 11–16)
  | "join"
  | "waiting"
  | "game"
  | "leaderboard"
  | "progress";

export type Navigate = (screen: Screen) => void;

export type ScreenProps = { go: Navigate };

export type PageInfo = {
  screen: Screen;
  label: string;
  group: "Instructor" | "Student";
  /** Wireframe number from the proposal (§10). */
  wireframe: number;
};

/** All pages in demo order. Drives the hash router and the page navigator. */
export const pages: readonly PageInfo[] = [
  { screen: "home", label: "Home", group: "Instructor", wireframe: 2 },
  { screen: "questions", label: "Question bank", group: "Instructor", wireframe: 3 },
  { screen: "create-question", label: "Create question", group: "Instructor", wireframe: 4 },
  { screen: "setup", label: "Session setup", group: "Instructor", wireframe: 5 },
  { screen: "lobby", label: "Lobby (projected)", group: "Instructor", wireframe: 6 },
  { screen: "live", label: "Live round (projected)", group: "Instructor", wireframe: 7 },
  { screen: "results", label: "Round results", group: "Instructor", wireframe: 8 },
  { screen: "dashboard", label: "Dashboard", group: "Instructor", wireframe: 9 },
  { screen: "join", label: "Join with code", group: "Student", wireframe: 11 },
  { screen: "waiting", label: "Waiting lobby", group: "Student", wireframe: 12 },
  { screen: "game", label: "Game", group: "Student", wireframe: 13 },
  { screen: "leaderboard", label: "Leaderboard", group: "Student", wireframe: 15 },
  { screen: "progress", label: "My progress", group: "Student", wireframe: 16 },
];

/** History entries the app pushes carry their position, so we know if "back" stays inside the app. */
type HistoryState = { idx: number } | null;

export function historyIndex() {
  return (window.history.state as HistoryState)?.idx ?? 0;
}
