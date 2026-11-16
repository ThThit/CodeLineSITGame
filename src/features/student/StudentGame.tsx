import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { ScreenProps } from "@/types/navigation";
import { StudentShell } from "@/components/layout/StudentShell";
import { StudentBoard } from "@/components/game/StudentBoard";
import { FeedbackToast, type Feedback } from "@/components/game/FeedbackToast";
import { Timer } from "@/components/game/Timer";
import { useCountdown } from "@/hooks/useCountdown";
import { pointsDelta, scorePlacement, splitCode, type Penalty } from "@/lib/game";
import { questionStore } from "@/data/questionStore";

// Demo round settings (what the instructor would pick in session setup).
const ATTEMPTS = 3;
const PENALTY: Penalty = { kind: "cooldown", seconds: 5 };
const ROUND_SECONDS = 90;
// Demo question: FizzBuzz is long enough to show scrolling and long lines.
const QUESTION_ID = "q3";
const MY_LINES = [2, 5, 7, 9];
const LOCKED_BY_OTHERS = [0, 1, 10];

const DRAG_THRESHOLD = 6; // px before a press becomes a drag
const EDGE = 90; // px from the top/bottom where dragging auto-scrolls

const tries = (n: number) => `${n} ${n === 1 ? "try" : "tries"}`;

type Drag = { line: number; x: number; y: number };

/**
 * Screens 13–14 / FR-S4–S7. Place a line by tapping it then tapping a slot,
 * or by dragging it (mouse or finger) onto a slot.
 */
export function StudentGame({ go }: ScreenProps) {
  const question = useMemo(() => questionStore.get(QUESTION_ID), []);
  const lines = useMemo(() => splitCode(question?.code ?? ""), [question]);
  const steps = (question?.pseudocode ?? "").split(/\r?\n/).filter(Boolean);

  const { seconds } = useCountdown(ROUND_SECONDS);
  const [placed, setPlaced] = useState<number[]>(LOCKED_BY_OTHERS);
  const [selected, setSelected] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<Record<number, number>>({});
  const [score, setScore] = useState(480);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [wrap, setWrap] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);

  const timeUp = seconds <= 0;
  const tray = MY_LINES.filter((i) => !placed.includes(i));
  const done = timeUp || tray.length === 0;
  const locked = cooldown > 0 || done;

  useEffect(() => {
    if (timeUp) setFeedback({ kind: "timeout" });
  }, [timeUp]);

  useEffect(() => {
    if (!feedback || feedback.kind === "timeout") return;
    const id = window.setTimeout(() => setFeedback(null), 2200);
    return () => window.clearTimeout(id);
  }, [feedback]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  function place(slot: number, lineIndex: number) {
    if (locked || placed.includes(slot)) return;
    const left = attemptsLeft[lineIndex] ?? ATTEMPTS;
    const result = scorePlacement(lines[lineIndex], slot, left, PENALTY);
    setSelected(null);
    setScore((s) => s + pointsDelta(result));
    if (result.kind === "correct") {
      setPlaced((p) => [...p, slot]);
      setFeedback({ kind: "correct", points: result.points });
    } else if (result.kind === "auto-placed") {
      setPlaced((p) => [...p, lineIndex]);
      setFeedback({ kind: "auto-placed" });
    } else {
      const remaining = result.attemptsLeft ?? left;
      setAttemptsLeft((a) => ({ ...a, [lineIndex]: remaining }));
      if (result.penalty.kind === "cooldown") setCooldown(result.penalty.seconds);
      const cost =
        result.penalty.kind === "cooldown"
          ? `${result.penalty.seconds} sec cooldown`
          : `-${result.penalty.points} points`;
      setFeedback({ kind: "wrong", detail: `${cost} · ${tries(remaining)} left on this line` });
    }
  }

  // ----- Pointer dragging (works for mouse, pen and touch) -----
  const press = useRef<{ line: number; x: number; y: number; dragging: boolean } | null>(null);
  const suppressClick = useRef(false);
  const pointerY = useRef(0);
  // Edge scrolling only starts once the finger has left the bottom zone, because
  // drags begin in the tray, which sits inside that zone.
  const edgeReady = useRef(false);

  function slotAt(x: number, y: number) {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-slot]");
    return el ? Number(el.dataset.slot) : null;
  }

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>, line: number) {
    if (locked || e.button !== 0) return;
    press.current = { line, x: e.clientX, y: e.clientY, dragging: false };
    suppressClick.current = false;
    edgeReady.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const p = press.current;
    if (!p) return;
    if (!p.dragging && Math.hypot(e.clientX - p.x, e.clientY - p.y) < DRAG_THRESHOLD) return;
    p.dragging = true;
    pointerY.current = e.clientY;
    if (e.clientY < window.innerHeight - EDGE * 1.5) edgeReady.current = true;
    setDrag({ line: p.line, x: e.clientX, y: e.clientY });
    setHoverSlot(slotAt(e.clientX, e.clientY));
  }

  function onPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const p = press.current;
    press.current = null;
    if (!p?.dragging) return; // a tap: the click handler selects the line
    // Swallow the click that follows this pointerup, then clear the flag.
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);
    const slot = slotAt(e.clientX, e.clientY);
    setDrag(null);
    setHoverSlot(null);
    if (slot !== null) place(slot, p.line);
  }

  function onPointerCancel() {
    press.current = null;
    setDrag(null);
    setHoverSlot(null);
  }

  // Auto-scroll while dragging near the top or bottom edge of the screen.
  const dragging = drag !== null;
  useEffect(() => {
    if (!dragging) return;
    let frame = 0;
    const tick = () => {
      const y = pointerY.current;
      const bottom = window.innerHeight - EDGE;
      const atTop = y < EDGE;
      const atBottom = edgeReady.current && y > bottom;
      const speed = atTop ? -Math.ceil((EDGE - y) / 6) : atBottom ? Math.ceil((y - bottom) / 6) : 0;
      if (speed !== 0) window.scrollBy(0, speed);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dragging]);

  const progress = Math.round((placed.length / Math.max(1, lines.length)) * 100);
  const selectedLeft = selected === null ? null : (attemptsLeft[selected] ?? ATTEMPTS);

  return (
    <StudentShell go={go} progress wide>
      {/* Phone: one column. Desktop (lg+): pseudocode | code board | my lines. */}
      <main
        className={`mt-4 flex min-w-0 flex-1 flex-col gap-3 lg:grid lg:grid-cols-[260px_minmax(0,1fr)_340px] lg:content-start lg:items-start lg:gap-x-6 lg:gap-y-4 ${dragging ? "select-none" : ""}`}
      >
        <div className="flex items-center justify-between gap-3 lg:col-span-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-soft">
              Round 1 · Q3 of 3
            </span>
            <span className="truncate font-display text-[22px] font-bold">{question?.title}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className="rounded-full border-[2.5px] border-ink bg-white px-3 py-1.5 font-display text-lg font-bold"
              aria-label={`Score ${score}`}
            >
              {score.toLocaleString()}
            </span>
            <Timer seconds={seconds} size="sm" />
          </div>
        </div>

        <div
          role="progressbar"
          aria-label="Lines placed"
          aria-valuenow={placed.length}
          aria-valuemin={0}
          aria-valuemax={lines.length}
          className="h-3.5 overflow-hidden rounded-full border-[2.5px] border-ink bg-white lg:col-span-3"
        >
          <div
            className="h-full bg-mint-ink transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pseudocode: desktop only (phones rely on the projected screen). */}
        <aside
          aria-labelledby="pseudo-title"
          className="hidden lg:sticky lg:top-4 lg:flex lg:flex-col lg:gap-3 lg:rounded-[22px] lg:border-[3px] lg:border-ink lg:bg-paper lg:p-5 lg:shadow-pop"
        >
          <h2
            id="pseudo-title"
            className="text-sm font-extrabold uppercase tracking-[0.1em] text-soft"
          >
            Pseudocode
          </h2>
          <ul className="flex flex-col gap-2.5">
            {steps.map((step) => (
              <li key={step} className="text-[15px] font-bold leading-snug">
                {step}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.1em]">
              {dragging
                ? "Drop it on a yellow slot"
                : selected === null
                  ? "Shared code space"
                  : "Now tap where it goes"}
            </span>
            <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={wrap}
                onChange={(e) => setWrap(e.target.checked)}
                className="size-4 accent-[var(--ink)]"
              />
              Wrap long lines
            </label>
          </div>

          <StudentBoard
            lines={lines.map((l) => l.text)}
            locked={(i) => placed.includes(i)}
            armed={selected !== null || dragging}
            hoverSlot={hoverSlot}
            wrap={wrap}
            onSlot={locked ? undefined : (slot) => selected !== null && place(slot, selected)}
          />
        </div>

        {/* My lines stay pinned at the bottom while the board scrolls; they slide away during a drag. */}
        <section
          aria-label="My lines"
          className={`sticky bottom-0 z-20 -mx-4 mt-auto border-t-[3px] border-ink bg-cream px-4 pb-4 pt-3 transition-transform duration-200 sm:-mx-5 sm:px-5 lg:top-4 lg:bottom-auto lg:mx-0 lg:mt-0 lg:rounded-[22px] lg:border-[3px] lg:bg-white lg:p-4 lg:shadow-pop ${
            dragging ? "max-lg:translate-y-[calc(100%-56px)]" : ""
          }`}
        >
          <div className="flex items-baseline justify-between px-0.5">
            <span className="font-display text-xl font-bold">
              My lines <span className="text-base text-soft">({tray.length})</span>
            </span>
            <span className="text-sm font-extrabold text-soft">
              {cooldown > 0
                ? `Cooldown ${cooldown}s`
                : selectedLeft === null
                  ? `Tap or drag · ${tries(ATTEMPTS)} each`
                  : `${tries(selectedLeft)} left`}
            </span>
          </div>
          <div className="mt-2 flex max-h-[34vh] flex-col gap-2 overflow-y-auto pb-1 pr-1 lg:max-h-[calc(100dvh-180px)]">
            {!done &&
              tray.map((i) => {
                const active = selected === i;
                const lifted = drag?.line === i;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={cooldown > 0}
                    aria-pressed={active}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                      }
                      setSelected(active ? null : i);
                    }}
                    onPointerDown={(e) => onPointerDown(e, i)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    className={`flex min-h-[50px] w-full touch-none select-none items-center gap-2.5 rounded-[14px] border-[3px] border-ink px-3 text-left disabled:opacity-50 ${
                      lifted
                        ? "border-dashed bg-transparent opacity-40"
                        : active
                          ? "-translate-x-0.5 -translate-y-0.5 bg-sun shadow-[5px_5px_0_var(--ink)]"
                          : "bg-white shadow-pop-sm"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="20"
                      viewBox="0 0 14 20"
                      fill="currentColor"
                      className="shrink-0"
                    >
                      <circle cx="4" cy="4" r="1.8" />
                      <circle cx="10" cy="4" r="1.8" />
                      <circle cx="4" cy="10" r="1.8" />
                      <circle cx="10" cy="10" r="1.8" />
                      <circle cx="4" cy="16" r="1.8" />
                      <circle cx="10" cy="16" r="1.8" />
                    </svg>
                    <code className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-sm font-bold">
                      {lines[i].text.trim()}
                    </code>
                  </button>
                );
              })}
            {done && (
              <button
                type="button"
                onClick={() => go("leaderboard")}
                className="min-h-14 rounded-2xl border-[3px] border-ink bg-sun px-4 font-display text-xl font-bold shadow-pop-sm"
              >
                {timeUp ? "Time’s up! See the scores" : "All your lines are in! See the scores"}
              </button>
            )}
          </div>
        </section>
      </main>

      {drag && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-4 z-50 mx-auto max-w-[440px] -translate-y-1/2 rotate-1 rounded-[14px] border-[3px] border-ink bg-sun px-3 py-2.5 shadow-[6px_6px_0_var(--ink)]"
          // Phones: full-width card at the finger. Desktop: follows the cursor.
          style={
            window.innerWidth >= 1024
              ? { top: drag.y, left: drag.x - 24, right: "auto", width: "max-content" }
              : { top: drag.y }
          }
        >
          <code className="whitespace-pre-wrap break-words font-mono text-sm font-bold">
            {lines[drag.line].text.trim()}
          </code>
        </div>
      )}
      {feedback && <FeedbackToast feedback={feedback} />}
    </StudentShell>
  );
}
