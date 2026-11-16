import { useState } from "react";
import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { CodeWorkspace } from "@/components/game/CodeWorkspace";
import { students } from "@/data/mock";

export function LiveGame({ go }: ScreenProps) {
  const [seconds, setSeconds] = useState(42);
  const [hint, setHint] = useState(false);
  return (
    <div className="live-screen">
      <header className="live-header">
        <Logo />
        <div className="round-badge">
          Round 1 of 2 <span>Question 2 of 3</span>
        </div>
        <div className="live-controls">
          <div className="timer">
            <Icon name="clock" />
            <strong>0:{String(seconds).padStart(2, "0")}</strong>
          </div>
          <Button variant="secondary" icon="plus" onClick={() => setSeconds(seconds + 15)}>
            Add time
          </Button>
          <Button variant="secondary" icon="hint" onClick={() => setHint(true)}>
            Send hint
          </Button>
          <Button variant="dark" onClick={() => go("results")}>
            Next round <Icon name="arrow" />
          </Button>
        </div>
      </header>
      {hint && (
        <div className="hint-banner">
          <Icon name="hint" size={18} /> Hint sent: Start by declaring a variable to store the
          total.
          <button onClick={() => setHint(false)}>
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
      <main className="live-grid">
        <section className="prompt-panel">
          <span className="eyebrow">Challenge</span>
          <h1>Sum the values in an array</h1>
          <p>Arrange the Java code to match the pseudocode.</p>
          <div className="pseudo-box">
            <span>Pseudocode</span>
            <ol>
              <li>Create a variable to hold the total</li>
              <li>Loop through each number</li>
              <li>Add it to the total</li>
              <li>Return the total</li>
            </ol>
          </div>
          <div className="class-progress">
            <span>
              <strong>24</strong> correct lines
            </span>
            <span>
              <strong>18</strong> students active
            </span>
          </div>
        </section>
        <section className="shared-panel">
          <div className="panel-label">
            <span>Shared code space</span>
            <span className="live-dot">Live</span>
          </div>
          <CodeWorkspace />
        </section>
        <aside className="leader-panel">
          <div className="panel-label">
            <span>
              <Icon name="trophy" size={18} /> Leaderboard
            </span>
            <span>Points</span>
          </div>
          {students.slice(0, 7).map(([name, score], i) => (
            <div className={`rank-row ${i < 3 ? "top" : ""}`} key={name}>
              <span className="rank">{i + 1}</span>
              <span className="mini-avatar">{initials(name)}</span>
              <span>
                <strong>{name}</strong>
                <small>{i + 3} correct lines</small>
              </span>
              <b>{score}</b>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}
