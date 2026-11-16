import { useEffect, useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Notice } from "@/components/common/Notice";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { lineCount, useQuestions, type Question } from "@/data/questionStore";

type Purpose = "Quiz" | "Activity" | "Participation";

type Round = {
  id: number;
  questionIds: string[];
  seconds: number;
  /** 0 = unlimited */
  attempts: number;
  penalty: "cooldown-5" | "cooldown-10" | "deduct-50";
  timeout: "reveal" | "empty";
  music: boolean;
};

type Draft = { name: string; purpose: Purpose; rounds: Round[] };

const newRound = (id: number, questionIds: string[] = []): Round => ({
  id,
  questionIds,
  seconds: 90,
  attempts: 3,
  penalty: "cooldown-5",
  timeout: "reveal",
  music: true,
});

// Kept for the tab's lifetime so going to the lobby and back keeps your setup.
let savedDraft: Draft = {
  name: "Java Arrays Review",
  purpose: "Activity",
  rounds: [newRound(1, ["q1", "q2"]), newRound(2, ["q3"])],
};

const penaltyLabel: Record<Round["penalty"], string> = {
  "cooldown-5": "5 sec cooldown",
  "cooldown-10": "10 sec cooldown",
  "deduct-50": "−50 points",
};

/** Screen 5 / FR-I5–I6: name, purpose and per-round rules. */
export function SessionSetup({ go }: ScreenProps) {
  const questions = useQuestions();
  const [draft, setDraft] = useState<Draft>(savedDraft);
  const [openId, setOpenId] = useState<number | null>(draft.rounds[0]?.id ?? null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    savedDraft = draft;
  }, [draft]);

  // Drop selections of questions that were deleted from the bank.
  const known = new Set(questions.map((q) => q.id));
  const rounds = draft.rounds.map((r) => ({
    ...r,
    questionIds: r.questionIds.filter((id) => known.has(id)),
  }));

  const updateRound = (id: number, patch: Partial<Round>) =>
    setDraft((d) => ({
      ...d,
      rounds: d.rounds.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));

  const totalQuestions = rounds.reduce((n, r) => n + r.questionIds.length, 0);
  const minutes = Math.ceil(rounds.reduce((s, r) => s + r.questionIds.length * r.seconds, 0) / 60);
  const problems = [
    !draft.name.trim() && "Add a session name.",
    ...rounds.map(
      (r, i) => r.questionIds.length === 0 && `Pick at least one question for round ${i + 1}.`,
    ),
  ].filter(Boolean) as string[];

  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Set up session"
      subtitle="Choose the rules, then open the lobby for your class."
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setNotice("Draft saved. It stays until you close this tab.")}
          >
            Save draft
          </Button>
          <Button onClick={() => go("lobby")} disabled={problems.length > 0} title={problems[0]}>
            Open lobby <Icon name="arrow" size={18} />
          </Button>
        </>
      }
    >
      <div className="setup-layout">
        <div className="flex flex-col gap-5">
          <section className="card form-card" aria-labelledby="details-title">
            <h2 id="details-title" className="text-lg font-extrabold">
              Session details
            </h2>
            <label className="field-label mt-4" htmlFor="session-name">
              Session name
            </label>
            <input
              id="session-name"
              className="input"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <span className="field-label mt-5" id="purpose-label">
              Purpose
            </span>
            <div className="segment" role="radiogroup" aria-labelledby="purpose-label">
              {(["Quiz", "Activity", "Participation"] as const).map((p) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={draft.purpose === p}
                  className={draft.purpose === p ? "active" : ""}
                  key={p}
                  onClick={() => setDraft((d) => ({ ...d, purpose: p }))}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section className="card form-card" aria-labelledby="rounds-title">
            <h2 id="rounds-title" className="text-lg font-extrabold">
              Rounds
            </h2>
            <p className="mt-1 text-sm font-bold text-soft">
              Each round can use different questions, timing and rules.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {rounds.map((round, i) => (
                <RoundCard
                  key={round.id}
                  index={i}
                  round={round}
                  questions={questions}
                  open={openId === round.id}
                  onToggle={() => setOpenId(openId === round.id ? null : round.id)}
                  onChange={(patch) => updateRound(round.id, patch)}
                  onRemove={
                    rounds.length > 1
                      ? () =>
                          setDraft((d) => ({
                            ...d,
                            rounds: d.rounds.filter((r) => r.id !== round.id),
                          }))
                      : undefined
                  }
                />
              ))}
            </div>
            <Button
              variant="secondary"
              icon="plus"
              className="mt-4 w-full justify-center"
              onClick={() => {
                const id = Math.max(0, ...draft.rounds.map((r) => r.id)) + 1;
                setDraft((d) => ({ ...d, rounds: [...d.rounds, newRound(id)] }));
                setOpenId(id);
              }}
            >
              Add round
            </Button>
          </section>
        </div>

        <aside className="setup-summary card" aria-labelledby="summary-title">
          <h2 id="summary-title" className="text-base font-extrabold">
            Summary
          </h2>
          <p className="mt-1 break-words text-sm font-bold text-soft">
            {draft.name.trim() || "Untitled session"}
          </p>
          <dl className="mt-3">
            {[
              ["Purpose", draft.purpose],
              ["Rounds", rounds.length],
              ["Questions", totalQuestions],
              ["Est. duration", `${minutes} min`],
            ].map(([k, v]) => (
              <div className="summary-row" key={k}>
                <dt>{k}</dt>
                <dd className="font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>
          {problems.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-1.5 rounded-lg border border-[#f5c2a7] bg-[#fff4ed] p-3 text-sm font-bold text-primary-text">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg border border-mint-ink/30 bg-mint p-3 text-sm font-bold text-mint-deep">
              Ready. You can still add time and send hints during the game.
            </p>
          )}
        </aside>
      </div>
      {notice && <Notice message={notice} onClose={() => setNotice(null)} />}
    </InstructorShell>
  );
}

function RoundCard({
  index,
  round,
  questions,
  open,
  onToggle,
  onChange,
  onRemove,
}: {
  index: number;
  round: Round;
  questions: Question[];
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<Round>) => void;
  onRemove?: () => void;
}) {
  const n = index + 1;
  const picked = questions.filter((q) => round.questionIds.includes(q.id));
  const summary = [
    `${picked.length} ${picked.length === 1 ? "question" : "questions"}`,
    `${round.seconds} sec`,
    round.attempts === 0 ? "unlimited tries" : `${round.attempts} tries`,
    penaltyLabel[round.penalty],
  ].join(" · ");
  const toggleQuestion = (id: string) =>
    onChange({
      questionIds: round.questionIds.includes(id)
        ? round.questionIds.filter((x) => x !== id)
        : [...round.questionIds, id],
    });

  return (
    <div className="round-card">
      <button type="button" className="round-head" onClick={onToggle} aria-expanded={open}>
        <span className="round-number">R{n}</span>
        <span>
          <strong>Round {n}</strong>
          <small>{summary}</small>
        </span>
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
          <Icon name="chevron" />
        </span>
      </button>
      {open && (
        <div className="round-content">
          <fieldset>
            <legend className="field-label">Questions</legend>
            <div className="max-h-56 overflow-y-auto rounded-lg border border-line bg-white">
              {questions.map((q) => (
                <label
                  key={q.id}
                  className="flex min-h-11 cursor-pointer items-center gap-3 border-b border-line px-3 py-2 last:border-0 hover:bg-paper"
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--ink)]"
                    checked={round.questionIds.includes(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                  />
                  <span className="flex-1 text-sm font-bold">{q.title}</span>
                  <span className="text-xs font-bold text-soft">{lineCount(q.code)} lines</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="settings-grid">
            <Select
              label="Time limit per question"
              value={String(round.seconds)}
              onChange={(v) => onChange({ seconds: Number(v) })}
              options={[
                ["60", "60 seconds"],
                ["90", "90 seconds"],
                ["120", "2 minutes"],
                ["180", "3 minutes"],
              ]}
            />
            <Select
              label="Tries per line"
              value={String(round.attempts)}
              onChange={(v) => onChange({ attempts: Number(v) })}
              options={[
                ["1", "1 try"],
                ["3", "3 tries"],
                ["5", "5 tries"],
                ["0", "Unlimited"],
              ]}
            />
            <Select
              label="Wrong placement"
              value={round.penalty}
              onChange={(v) => onChange({ penalty: v as Round["penalty"] })}
              options={Object.entries(penaltyLabel)}
            />
            <Select
              label="When time runs out"
              value={round.timeout}
              onChange={(v) => onChange({ timeout: v as Round["timeout"] })}
              options={[
                ["reveal", "Reveal the full code"],
                ["empty", "Leave unplaced lines empty"],
              ]}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
            <span id={`music-${round.id}`} className="flex items-center gap-2 text-sm font-bold">
              <Icon name="music" size={18} /> Background music
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={round.music}
              aria-labelledby={`music-${round.id}`}
              className={`toggle ${round.music ? "on" : ""}`}
              onClick={() => onChange({ music: !round.music })}
            >
              <span />
            </button>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="mt-3 min-h-9 rounded-lg px-2 text-sm font-bold text-[#b42318] hover:bg-[#fef3f2]"
            >
              Remove round {n}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label>
      {label}
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
