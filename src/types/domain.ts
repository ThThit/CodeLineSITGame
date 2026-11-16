/**
 * Domain model for CodeLine, taken from CodeLine_Proposed_Solution.md.
 * The UI still runs on mock data; these types are the shape the backend/API should follow.
 */

export type Role = "instructor" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/** FR-I2: a title, pseudocode, and the correct code (one line per statement). */
export type Question = {
  id: string;
  title: string;
  topics: string[];
  pseudocode: string;
  code: string;
  updatedAt: string;
};

/** FR-I5: what the session counts as. */
export type SessionPurpose = "quiz" | "activity" | "participation";

/** §7: the penalty for a wrong placement. */
export type Penalty = { kind: "cooldown"; seconds: number } | { kind: "deduct"; points: number };

/** §7: what happens to unplaced lines when the timer runs out. */
export type TimeoutBehaviour = "reveal" | "leave-empty";

/** FR-I6: per-round settings. `attempts: null` means unlimited. */
export type RoundSettings = {
  questionIds: string[];
  timeLimitSeconds: number;
  attempts: number | null;
  penalty: Penalty;
  timeout: TimeoutBehaviour;
  music: boolean;
};

export type SessionStatus = "draft" | "lobby" | "live" | "finished";

export type Session = {
  id: string;
  name: string;
  purpose: SessionPurpose;
  rounds: RoundSettings[];
  /** 6-digit game code students enter (or get from the QR code / link). */
  gameCode: string;
  status: SessionStatus;
  createdAt: string;
};

/** One line of a question's code, as handed out to a student (FR-SYS2). */
export type CodeLine = {
  /** Correct 0-based position in the program. */
  index: number;
  text: string;
};

/** The outcome of one placement attempt (FR-SYS3, FR-SYS4). */
export type PlacementResult =
  | { kind: "correct"; points: number }
  | { kind: "incorrect"; penalty: Penalty; attemptsLeft: number | null }
  /** Out of attempts: the line is placed in its correct position and scores 0. */
  | { kind: "auto-placed"; points: 0 };

export type LeaderboardEntry = {
  studentId: string;
  name: string;
  points: number;
  correctLines: number;
};
