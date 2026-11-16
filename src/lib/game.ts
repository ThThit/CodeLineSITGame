/**
 * Pure game rules from the proposal (§7 and FR-SYS2–4). No UI, no I/O, so the
 * same logic can move to the server unchanged once a backend exists.
 */
import type { CodeLine, Penalty, PlacementResult } from "@/types/domain";

export const POINTS_PER_LINE = 100;

/** FR-I3 / FR-SYS2: split code into lines, dropping blank ones. */
export function splitCode(code: string): CodeLine[] {
  return code
    .split(/\r?\n/)
    .filter((text) => text.trim() !== "")
    .map((text, index) => ({ index, text }));
}

/** Fisher–Yates shuffle. `random` is injectable so tests can be deterministic. */
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * FR-SYS2: hand lines out at random so every student gets some. When there are
 * more students than lines, lines are reused so nobody is left empty-handed.
 */
export function distributeLines(
  lines: readonly CodeLine[],
  studentIds: readonly string[],
  random = Math.random,
): Map<string, CodeLine[]> {
  const hands = new Map<string, CodeLine[]>(studentIds.map((id) => [id, []]));
  if (lines.length === 0 || studentIds.length === 0) return hands;

  const deck = shuffle(lines, random);
  const students = shuffle(studentIds, random);
  const total = Math.max(deck.length, students.length);
  for (let i = 0; i < total; i++) {
    hands.get(students[i % students.length])!.push(deck[i % deck.length]);
  }
  return hands;
}

/** FR-SYS3: a placement is correct when the line belongs at that slot. */
export function isCorrectPlacement(line: CodeLine, slot: number) {
  return line.index === slot;
}

/**
 * FR-SYS4: score one attempt. `attemptsLeft` is how many the student had
 * before this attempt (`null` = unlimited).
 */
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
  if (result.kind === "incorrect" && result.penalty.kind === "deduct")
    return -result.penalty.points;
  return result.kind === "incorrect" ? 0 : result.points;
}
