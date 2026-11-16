/** Every screen in the proposal's wireframe list (§10). */
export type Screen =
  // Instructor (screens 1–9)
  | "login-instructor"
  | "home"
  | "questions"
  | "create-question"
  | "setup"
  | "lobby"
  | "live"
  | "results"
  | "dashboard"
  // Student (screens 10–16)
  | "login-student"
  | "join"
  | "waiting"
  | "game"
  | "leaderboard"
  | "progress";

export type Navigate = (screen: Screen) => void;

export type ScreenProps = { go: Navigate };
