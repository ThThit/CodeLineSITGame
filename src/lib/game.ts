/**
 * Game rules for the demo (proposal §7): split code into lines, check a
 * placement, and score it. Pure functions, no UI.
 */

/** One line of a question's code. `index` is its correct 0-based position. */
export type CodeLine = { index: number; text: string };

/** What a wrong placement costs: a cooldown or points off. */
export type Penalty = { kind: "cooldown"; seconds: number } | { kind: "deduct"; points: number };

export type PlacementResult =
  | { kind: "correct"; points: number }
  | { kind: "incorrect"; penalty: Penalty; attemptsLeft: number | null }
  /** Out of attempts: the line is placed in its correct position and scores 0. */
  | { kind: "auto-placed"; points: 0 };

export const POINTS_PER_LINE = 100;

/** Split code into lines, dropping blank ones. */
export function splitCode(code: string): CodeLine[] {
  return code
    .split(/\r?\n/)
    .filter((text) => text.trim() !== "")
    .map((text, index) => ({ index, text }));
}

export function isCorrectPlacement(line: CodeLine, slot: number) {
  return line.index === slot;
}

/** Score one attempt. `attemptsLeft` is how many the student had before it (`null` = unlimited). */
export function scorePlacement(
  line: CodeLine,
  slot: number,
  attemptsLeft: number | null,
  penalty: Penalty,
): PlacementResult {
  if (isCorrectPlacement(line, slot)) return { kind: "correct", points: POINTS_PER_LINE };
  if (attemptsLeft === null) return { kind: "incorrect", penalty, attemptsLeft: null };
  const remaining = Math.max(0, attemptsLeft - 1);
  if (remaining === 0) return { kind: "auto-placed", points: 0 };
  return { kind: "incorrect", penalty, attemptsLeft: remaining };
}

/** Points change for a result: deduct penalties subtract, cooldowns cost time instead. */
export function pointsDelta(result: PlacementResult) {
  if (result.kind === "incorrect" && result.penalty.kind === "deduct") {
    return -result.penalty.points;
  }
  return result.kind === "incorrect" ? 0 : result.points;
}
