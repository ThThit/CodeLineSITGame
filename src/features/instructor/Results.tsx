import { useState } from "react";
import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Metric } from "@/components/common/Metric";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { questionStore } from "@/data/questionStore";
import { allRoundsResults, roundResults } from "@/data/mock";

const questionResults = [
  { id: "q1", pct: 92, correct: 39, timedOut: 4 },
  { id: "q2", pct: 81, correct: 34, timedOut: 5 },
  { id: "q3", pct: 76, correct: 32, timedOut: 6 },
];

/** Screen 8 / FR-I9: leaderboard for this round or all rounds, plus per-question results. */
export function Results({ go }: ScreenProps) {
  const [tab, setTab] = useState<"round" | "all">("round");
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = tab === "round" ? roundResults : allRoundsResults;
  // Podium reads 2nd, 1st, 3rd.
  const podium = [1, 0, 2].map((i) => ({ rank: i + 1, name: rows[i][0], score: rows[i][1] }));

  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Round 1 results"
      subtitle="Java Arrays Review · Round 1 of 2"
      actions={
        <>
          <Button variant="secondary" onClick={() => go("dashboard")}>
            End session
          </Button>
          <Button onClick={() => go("live")}>
            Start round 2 <Icon name="arrow" size={18} />
          </Button>
        </>
      }
    >
      <div className="metric-grid">
        <Metric value="87%" label="Class accuracy" note="+6% vs. last round" color="green" />
        <Metric value="1:14" label="Average time" note="16 sec under the limit" color="violet" />
        <Metric value="8,420" label="Points earned" note="Across 42 students" color="orange" />
        <Metric value="36/42" label="Finished" note="6 timed out" color="blue" />
      </div>

      <div className="results-grid mt-5">
        <section className="card" aria-labelledby="board-title">
          <div className="card-title-row">
            <h2 id="board-title" className="sr-only">
              Leaderboard
            </h2>
            <div className="tabs" role="tablist" aria-label="Leaderboard range">
              {(
                [
                  ["round", "This round"],
                  ["all", "All rounds"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  className={tab === key ? "active" : ""}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-soft">Points</span>
          </div>
          <div className="podium">
            {podium.map((p, i) => (
              <div className={`podium-person p${i}`} key={p.name}>
                <span className="podium-avatar">{initials(p.name)}</span>
                <strong>{p.name.split(" ")[0]}</strong>
                <b>{p.score.toLocaleString()}</b>
                <i>{p.rank}</i>
              </div>
            ))}
          </div>
          <ol className="px-6 pb-4" start={4}>
            {rows.slice(3).map(([name, score], i) => (
              <li className="simple-rank" key={name}>
                <span>{i + 4}</span>
                <strong>{name}</strong>
                <b>{score.toLocaleString()}</b>
              </li>
            ))}
          </ol>
        </section>

        <section className="card" aria-labelledby="qr-title">
          <div className="card-title-row">
            <h2 id="qr-title">Question results</h2>
            <span>Accuracy</span>
          </div>
          <p className="px-6 pt-3 text-sm font-bold text-soft">
            Select a question to see its correct code.
          </p>
          <div className="question-results">
            {questionResults.map((r, i) => {
              const q = questionStore.get(r.id);
              const open = openId === r.id;
              return (
                <div key={r.id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : r.id)}
                  >
                    <span className="q-number">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <strong>{q?.title ?? "Deleted question"}</strong>
                      <small>
                        {r.correct} correct · {r.timedOut} timed out
                      </small>
                      <i>
                        <em style={{ width: `${r.pct}%` }} />
                      </i>
                    </span>
                    <b>{r.pct}%</b>
                    <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
                      <Icon name="chevron" size={17} />
                    </span>
                  </button>
                  {open && q && (
                    <div className="revealed-code">
                      <span>Correct solution</span>
                      {q.code.split("\n").map((line, n) => (
                        <code key={n}>{line}</code>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </InstructorShell>
  );
}
