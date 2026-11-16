import { useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { questions } from "@/data/mock";

export function SessionSetup({ go }: ScreenProps) {
  const [rounds, setRounds] = useState([1, 2]);
  const [purpose, setPurpose] = useState("Activity");
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Set up session"
      subtitle="Choose the rules, then invite your class."
      actions={
        <>
          <Button variant="secondary" onClick={() => go("home")}>
            Save draft
          </Button>
          <Button onClick={() => go("lobby")}>
            Continue to lobby <Icon name="arrow" size={18} />
          </Button>
        </>
      }
    >
      <div className="setup-layout">
        <div className="space-y-5">
          <section className="card form-card">
            <div className="step-title">
              <span>1</span>
              <div>
                <h2>Session details</h2>
                <p>Name this activity and choose how it counts.</p>
              </div>
            </div>
            <label className="field-label mt-6">Session name</label>
            <input className="input" defaultValue="Java Arrays Review" />
            <label className="field-label mt-5">Purpose</label>
            <div className="segment">
              {["Quiz", "Activity", "Participation"].map((item) => (
                <button
                  className={purpose === item ? "active" : ""}
                  key={item}
                  onClick={() => setPurpose(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
          <section className="card form-card">
            <div className="step-title">
              <span>2</span>
              <div>
                <h2>Rounds</h2>
                <p>Each round can have different timing and rules.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {rounds.map((round) => (
                <RoundCard
                  key={round}
                  round={round}
                  remove={() => setRounds((r) => r.filter((x) => x !== round))}
                />
              ))}
            </div>
            <Button
              variant="secondary"
              icon="plus"
              className="mt-4 w-full justify-center"
              onClick={() => setRounds((r) => [...r, (r.at(-1) ?? 0) + 1])}
            >
              Add round
            </Button>
          </section>
        </div>
        <aside className="setup-summary card">
          <span className="eyebrow">Session summary</span>
          <h3>Java Arrays Review</h3>
          <div className="summary-row">
            <span>Purpose</span>
            <strong>{purpose}</strong>
          </div>
          <div className="summary-row">
            <span>Rounds</span>
            <strong>{rounds.length}</strong>
          </div>
          <div className="summary-row">
            <span>Questions</span>
            <strong>{rounds.length * 3}</strong>
          </div>
          <div className="summary-row">
            <span>Est. duration</span>
            <strong>{rounds.length * 6} min</strong>
          </div>
          <div className="summary-note">
            <Icon name="hint" size={19} />
            <p>You can change round settings during the live session.</p>
          </div>
        </aside>
      </div>
    </InstructorShell>
  );
}

export function RoundCard({ round, remove }: { round: number; remove: () => void }) {
  const [open, setOpen] = useState(round === 1);
  const [music, setMusic] = useState(true);
  return (
    <div className="round-card">
      <button className="round-head" onClick={() => setOpen(!open)}>
        <span className="round-number">R{round}</span>
        <span>
          <strong>Round {round}</strong>
          <small>3 questions · 90 sec each</small>
        </span>
        <span className={open ? "rotate-90" : ""}>
          <Icon name="chevron" />
        </span>
      </button>
      {open && (
        <div className="round-content">
          <div className="question-select">
            <Icon name="book" size={18} />
            <span>
              <strong>3 questions selected</strong>
              <small>Sum an array, Find the largest value, FizzBuzz</small>
            </span>
            <button>Change</button>
          </div>
          <div className="settings-grid">
            <label>
              Time limit
              <select className="select">
                <option>90 seconds</option>
                <option>60 seconds</option>
              </select>
            </label>
            <label>
              Attempts
              <select className="select">
                <option>3 attempts</option>
                <option>Unlimited</option>
              </select>
            </label>
            <label>
              Wrong answer
              <select className="select">
                <option>5 sec cooldown</option>
                <option>-50 points</option>
              </select>
            </label>
            <label>
              On timeout
              <select className="select">
                <option>Reveal code</option>
                <option>Leave empty</option>
              </select>
            </label>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="music" size={18} /> Background music
            </span>
            <button className={`toggle ${music ? "on" : ""}`} onClick={() => setMusic(!music)}>
              <span />
            </button>
          </div>
          {round > 1 && (
            <button onClick={remove} className="mt-3 text-xs font-bold text-red-500">
              Remove round
            </button>
          )}
        </div>
      )}
    </div>
  );
}
