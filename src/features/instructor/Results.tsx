import { useState } from "react";
import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Metric } from "@/components/common/Metric";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { codeLines, students } from "@/data/mock";

export function Results({ go }: ScreenProps) {
  const [tab, setTab] = useState("This Round");
  const [revealed, setRevealed] = useState(false);
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Round complete!"
      subtitle="Great work. Here’s how the class performed."
      actions={
        <>
          <Button variant="secondary" onClick={() => setRevealed(!revealed)}>
            {revealed ? "Hide code" : "Reveal code"}
          </Button>
          <Button onClick={() => go("dashboard")}>
            Finish session <Icon name="arrow" />
          </Button>
        </>
      }
    >
      <div className="metric-grid">
        <Metric value="87%" label="Class accuracy" note="+6% vs. last round" color="green" />
        <Metric value="1:14" label="Average time" note="16 sec under limit" color="violet" />
        <Metric value="8,420" label="Points earned" note="Across 42 students" color="orange" />
        <Metric value="36/42" label="Completed" note="6 timed out" color="blue" />
      </div>
      <div className="results-grid mt-5">
        <section className="card">
          <div className="card-title-row">
            <div className="tabs">
              {["This Round", "All Rounds"].map((x) => (
                <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
                  {x}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">Points</span>
          </div>
          <div className="podium">
            {[students[1], students[0], students[2]].map(([name, score], i) => (
              <div className={`podium-person p${i}`} key={name}>
                <span className="podium-avatar">{initials(name)}</span>
                <strong>{name.split(" ")[0]}</strong>
                <b>{score}</b>
                <i>{i === 1 ? 1 : i === 0 ? 2 : 3}</i>
              </div>
            ))}
          </div>
          <div className="px-6 pb-4">
            {students.slice(3, 8).map(([name, score], i) => (
              <div className="simple-rank" key={name}>
                <span>{i + 4}</span>
                <strong>{name}</strong>
                <b>{score}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <div className="card-title-row">
            <h2>Question results</h2>
            <span>Accuracy</span>
          </div>
          <div className="question-results">
            {[
              ["Sum an array", 92, "39 correct"],
              ["Find the largest value", 81, "34 correct"],
              ["FizzBuzz", 76, "32 correct"],
            ].map(([name, pct, note], i) => (
              <button key={name} onClick={() => setRevealed(!revealed)}>
                <span className="q-number">0{i + 1}</span>
                <span>
                  <strong>{name}</strong>
                  <small>
                    {note} · {i + 4} timed out
                  </small>
                  <i>
                    <em style={{ width: `${pct}%` }} />
                  </i>
                </span>
                <b>{pct}%</b>
                <Icon name="chevron" size={17} />
              </button>
            ))}
          </div>
          {revealed && (
            <div className="revealed-code">
              <span>Correct solution</span>
              {codeLines.map((line) => (
                <code key={line}>{line}</code>
              ))}
            </div>
          )}
        </section>
      </div>
    </InstructorShell>
  );
}
