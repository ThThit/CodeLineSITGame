import { useEffect, useMemo, useRef, useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { CodeWorkspace, type Slot } from "@/components/game/CodeWorkspace";
import { Timer } from "@/components/game/Timer";
import { useCountdown } from "@/hooks/useCountdown";
import { splitCode } from "@/lib/game";
import { questionStore } from "@/data/questionStore";
import { session, students } from "@/data/mock";

const medals = ["bg-sun", "bg-silver", "bg-bronze"];
// Same demo question as the student phones.
const QUESTION_ID = "q3";
const PRELOCKED: Record<number, string> = { 0: "Maya", 1: "Theo", 10: "Amara" };
const TICK_MS = 1500; // a student places a line about every 1.5 s
const REJECT_SHOW_MS = 1400; // how long a rejected attempt stays on the board

type Event = { id: number; ok: boolean; by: string; slot: number };
type Player = { name: string; first: string; score: number; lines: number };

/**
 * Simulated stream of student placements for the demo: mostly correct locks,
 * some wrong attempts that are rejected. In the real app these arrive from the server.
 */
function useSimulatedPlacements(lineCount: number, texts: string[], running: boolean) {
  const [lockedBy, setLockedBy] = useState<(string | null)[]>(() =>
    Array.from({ length: lineCount }, (_, i) => PRELOCKED[i] ?? null),
  );
  const [rejected, setRejected] = useState<Record<number, { text: string; by: string }>>({});
  const [fresh, setFresh] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [players, setPlayers] = useState<Player[]>(() =>
    students.slice(0, 10).map(([name, score]) => ({
      name,
      first: name.split(" ")[0],
      score,
      lines: Object.values(PRELOCKED).includes(name.split(" ")[0]) ? 1 : 0,
    })),
  );
  const tick = useRef(0);
  const timers = useRef<number[]>([]);

  const empties = lockedBy.flatMap((by, i) => (by === null ? [i] : []));
  const finished = empties.length === 0;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Latest values for the interval callback (it must not restart on every render).
  const latest = useRef({ empties, players });
  latest.current = { empties, players };

  useEffect(() => {
    if (!running || finished) return;
    const id = window.setInterval(() => {
      const { empties, players } = latest.current;
      if (empties.length === 0) return;
      const n = ++tick.current;
      const slot = empties[(n * 7) % empties.length];
      const player = players[(n * 3) % players.length];
      const correct = n % 3 !== 2 || empties.length === 1;
      if (correct) {
        setLockedBy((l) => l.map((by, i) => (i === slot ? player.first : by)));
        setPlayers((ps) =>
          ps.map((p) =>
            p.name === player.name ? { ...p, score: p.score + 100, lines: p.lines + 1 } : p,
          ),
        );
        setFresh(slot);
        timers.current.push(
          window.setTimeout(() => setFresh((f) => (f === slot ? null : f)), 1200),
        );
      } else {
        // A wrong line: one that belongs in a different empty slot.
        const wrong = empties.find((e) => e !== slot) ?? slot;
        setRejected((r) => ({ ...r, [slot]: { text: texts[wrong], by: player.first } }));
        setWrongCount((w) => w + 1);
        timers.current.push(
          window.setTimeout(
            () =>
              setRejected((r) => {
                const next = { ...r };
                delete next[slot];
                return next;
              }),
            REJECT_SHOW_MS,
          ),
        );
      }
      setEvents((ev) => [{ id: n, ok: correct, by: player.first, slot }, ...ev].slice(0, 3));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [running, finished, texts]);

  const correct = lockedBy.filter(Boolean).length;
  return { lockedBy, rejected, fresh, events, players, correct, wrongCount, finished };
}

/** Screen 7 / FR-I8: the projected main display plus the instructor's live controls. */
export function LiveGame({ go }: ScreenProps) {
  const question = useMemo(() => questionStore.get(QUESTION_ID), []);
  const lines = useMemo(() => splitCode(question?.code ?? ""), [question]);
  const texts = useMemo(() => lines.map((l) => l.text), [lines]);
  const steps = (question?.pseudocode ?? "").split("\n").filter(Boolean);

  const { seconds, add } = useCountdown(90);
  const [hintSent, setHintSent] = useState(false);
  const [paused, setPaused] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  // The class keeps playing while the instructor decides; only the demo simulation pauses.
  const sim = useSimulatedPlacements(lines.length, texts, !paused && !confirmEnd && seconds > 0);

  const slots: Slot[] = lines.map((l, i) => ({
    text: l.text,
    locked: sim.lockedBy[i] !== null,
    by: sim.lockedBy[i],
    fresh: sim.fresh === i,
    rejected: sim.rejected[i] ?? null,
  }));
  const board = [...sim.players].sort((a, b) => b.score - a.score);

  return (
    // Fixed to the window on projector-size screens: nothing scrolls, nothing needs zooming out.
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cream font-sans text-ink lg:h-dvh lg:min-h-0">
      <div
        aria-hidden="true"
        className="absolute -right-16 top-32 size-56 rounded-full bg-sun opacity-55"
      />

      <div className="relative mx-auto flex min-h-0 w-full max-w-[1680px] flex-1 flex-col gap-3 px-4 py-3 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Logo />
          <div
            className="flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-white px-4 py-1.5 shadow-pop-sm"
            aria-label={`Game code ${session.gameCode}`}
          >
            <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-soft">
              Code
            </span>
            <span className="font-display text-[28px] font-bold leading-none tracking-[0.12em]">
              {session.gameCode.slice(0, 3)} {session.gameCode.slice(3)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border-[3px] border-ink bg-white px-3 py-1.5 text-[15px] font-extrabold">
              Round 1 of 2
            </span>
            <span className="rounded-full bg-ink px-3 py-2 text-[15px] font-extrabold text-cream">
              Question 3 of 3
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end">
              <span className="text-sm font-extrabold uppercase tracking-[0.1em] text-soft">
                Locked
              </span>
              <span className="font-display text-[24px] font-bold leading-none tabular-nums">
                {sim.correct} / {lines.length}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-extrabold uppercase tracking-[0.1em] text-soft">
                Rejected
              </span>
              <span className="font-display text-[24px] font-bold leading-none tabular-nums text-primary-text">
                {sim.wrongCount}
              </span>
            </div>
            <Timer seconds={seconds} size="md" />
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2.5" aria-label="Instructor controls">
          <button type="button" className="btn btn-secondary" onClick={() => add(15)}>
            <Icon name="plus" size={18} /> Add 15 sec
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setHintSent(true)}>
            <Icon name="hint" size={18} /> Send hint
          </button>
          <span className="ml-2 flex items-center gap-2 text-sm font-bold text-soft">
            <span className="rounded-md bg-ink px-2 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-cream">
              Demo
            </span>
            {sim.finished ? "All lines placed." : "Student moves are simulated."}
            {!sim.finished && (
              <button
                type="button"
                className="min-h-9 rounded-lg px-2 font-extrabold text-ink underline-offset-4 hover:underline"
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? "Resume" : "Pause"}
              </button>
            )}
          </span>
          <button
            type="button"
            className="btn btn-dark ml-auto"
            onClick={() => setConfirmEnd(true)}
          >
            End round <Icon name="arrow" size={18} />
          </button>
        </div>

        {hintSent && (
          <div className="flex items-center gap-3 rounded-[14px] border-[3px] border-dashed border-lilac-strong bg-lilac px-4 py-2 text-base font-extrabold">
            <span className="text-lilac-strong">
              <Icon name="hint" size={24} />
            </span>
            <span className="flex-1">
              Hint sent: check which numbers are multiples of both 3 and 5 first.
            </span>
            <button type="button" aria-label="Dismiss hint" onClick={() => setHintSent(false)}>
              <Icon name="x" size={18} />
            </button>
          </div>
        )}

        <main className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)_280px] 2xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <section className="flex min-h-0 flex-col gap-2.5 overflow-hidden rounded-[24px] border-[3px] border-ink bg-paper p-4 shadow-pop">
            <span className="self-start rounded-[10px] bg-primary px-3 py-1.5 text-sm font-extrabold uppercase tracking-[0.1em]">
              Challenge
            </span>
            <h1 className="font-display text-[26px] font-bold leading-[1.1]">{question?.title}</h1>
            <span className="text-sm font-extrabold uppercase tracking-[0.1em] text-soft">
              Pseudocode
            </span>
            <ul className="flex flex-col gap-2">
              {steps.map((step) => (
                <li key={step} className="flex gap-2 text-[15px] font-bold leading-snug">
                  {step}
                </li>
              ))}
            </ul>
          </section>

          <CodeWorkspace slots={slots} />

          <div className="flex min-h-0 flex-col gap-3">
            <aside className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-[24px] border-[3px] border-ink bg-white p-3 shadow-pop">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-[22px] font-semibold">
                  <Icon name="trophy" size={22} /> Leaderboard
                </span>
                <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-soft">
                  Points
                </span>
              </div>
              <ol
                className="-mr-1 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain pr-1"
                aria-label="All players, highest score first"
                tabIndex={0}
              >
                {board.map((p, i) => (
                  <li
                    key={p.name}
                    className={`flex shrink-0 items-center gap-3 rounded-2xl border-[2.5px] px-2.5 py-1 transition-colors ${
                      i < 3 ? "border-ink" : "border-line"
                    } ${i === 0 ? "bg-[#fff3c2]" : "bg-white"}`}
                  >
                    <span
                      className={`flex size-8 items-center justify-center rounded-full border-[2.5px] border-ink font-display font-bold ${
                        medals[i] ?? "bg-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <strong className="truncate text-base font-extrabold">{p.name}</strong>
                      <span className="text-[13px] font-bold text-soft">
                        {p.lines} {p.lines === 1 ? "line" : "lines"} locked
                      </span>
                    </span>
                    <span className="font-display text-xl font-bold tabular-nums">
                      {p.score.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ol>
            </aside>

            <aside
              className="flex flex-col gap-2 rounded-[24px] bg-ink p-4 text-cream"
              aria-labelledby="feed-title"
            >
              <span id="feed-title" className="font-display text-lg font-semibold">
                Live activity
              </span>
              <ol className="flex flex-col gap-1.5" aria-live="polite">
                {sim.events.length === 0 && (
                  <li className="text-sm font-bold text-[#c9c4e6]">Waiting for the first move…</li>
                )}
                {sim.events.map((e) => (
                  <li
                    key={e.id}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-bold motion-safe:animate-in motion-safe:fade-in ${
                      e.ok ? "bg-mint text-mint-deep" : "bg-peach text-ink"
                    }`}
                  >
                    <Icon name={e.ok ? "check" : "x"} size={16} />
                    <span className="flex-1">
                      {e.by} {e.ok ? "locked" : "tried"} line {e.slot + 1}
                    </span>
                    <span className="text-xs font-extrabold uppercase">
                      {e.ok ? "+100" : "Rejected"}
                    </span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </main>
      </div>
      {confirmEnd && (
        <EndRoundDialog
          locked={sim.correct}
          total={lines.length}
          seconds={seconds}
          onCancel={() => setConfirmEnd(false)}
          onConfirm={() => go("results")}
        />
      )}
    </div>
  );
}

/** Confirmation before ending the round early (the projector shows it too, so keep it clear). */
function EndRoundDialog({
  locked,
  total,
  seconds,
  onCancel,
  onConfirm,
}: {
  locked: number;
  total: number;
  seconds: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);
  const unplaced = total - locked;
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="end-title"
        aria-describedby="end-desc"
        className="w-full max-w-[460px] rounded-[24px] border-[3px] border-ink bg-white p-6 shadow-pop-lg motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in"
      >
        <h2 id="end-title" className="font-display text-[28px] font-bold leading-tight">
          End round 1 now?
        </h2>
        <div id="end-desc" className="mt-3 flex flex-col gap-2 text-base font-bold text-soft">
          <p>
            {locked} of {total} lines are locked
            {seconds > 0
              ? ` and ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} is left on the clock`
              : ""}
            .
          </p>
          {unplaced > 0 && (
            <p>
              Students stop placing lines and the {unplaced} unplaced{" "}
              {unplaced === 1 ? "line is" : "lines are"} revealed.
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={onCancel}>
            Keep playing
          </button>
          <button type="button" className="btn btn-dark" onClick={onConfirm}>
            End round
          </button>
        </div>
      </div>
    </div>
  );
}
