export type Feedback =
  | { kind: "correct"; points: number }
  | { kind: "wrong"; detail: string }
  | { kind: "auto-placed" }
  | { kind: "timeout" };

/** FR-S6: immediate feedback after each placement. */
export function FeedbackToast({ feedback }: { feedback: Feedback }) {
  const view = {
    correct: {
      bg: "bg-mint",
      mark: "✓",
      title: "Locked in!",
      text: feedback.kind === "correct" ? `+${feedback.points} points. Nice one.` : "",
    },
    wrong: {
      bg: "bg-peach",
      mark: "!",
      title: "Not that spot",
      text: feedback.kind === "wrong" ? feedback.detail : "",
    },
    "auto-placed": {
      bg: "bg-lilac",
      mark: "0",
      title: "Out of tries",
      text: "We placed it for you. 0 points.",
    },
    timeout: {
      bg: "bg-sun",
      mark: "⏱",
      title: "Time’s up",
      text: "No more placements this round.",
    },
  }[feedback.kind];
  return (
    <div
      role="status"
      className={`fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-[420px] items-center gap-3 rounded-[18px] border-[3px] border-ink px-4 py-3.5 text-ink shadow-pop ${view.bg}`}
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink bg-white font-display text-xl font-bold"
      >
        {view.mark}
      </span>
      <span className="flex flex-col">
        <strong className="font-display text-xl font-bold">{view.title}</strong>
        <span className="text-sm font-bold">{view.text}</span>
      </span>
    </div>
  );
}
