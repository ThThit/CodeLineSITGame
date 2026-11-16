import { useState } from "react";
import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Button } from "@/components/common/Button";
import { StudentShell } from "@/components/layout/StudentShell";
import { students } from "@/data/mock";

export function StudentLeaderboard({ go }: ScreenProps) {
  const [tab, setTab] = useState("This Round");
  return (
    <StudentShell go={go} title="Leaderboard" progress>
      <main className="student-board">
        <div className="celebrate-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="eyebrow">Round complete</span>
        <h1>Nice work, Maya!</h1>
        <p>
          You placed <strong>2nd</strong> this round.
        </p>
        <div className="student-score">
          <span className="avatar large">MC</span>
          <div>
            <small>Your score</small>
            <strong>1,180</strong>
          </div>
          <b>+480</b>
        </div>
        <div className="tabs student-tabs">
          {["This Round", "All Rounds"].map((x) => (
            <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
              {x}
            </button>
          ))}
        </div>
        <div className="mobile-ranks">
          {students.slice(0, 7).map(([name, score], i) => (
            <div className={name === "Maya Chen" ? "me" : ""} key={name}>
              <span className="rank">{i + 1}</span>
              <span className="mini-avatar">{initials(name)}</span>
              <strong>
                {name}
                {name === "Maya Chen" && <small>You</small>}
              </strong>
              <b>{score}</b>
            </div>
          ))}
        </div>
        <Button onClick={() => go("progress")} className="w-full justify-center mt-5">
          View my progress
        </Button>
        <Button variant="ghost" onClick={() => go("join")} className="w-full justify-center mt-2">
          Back to join
        </Button>
      </main>
    </StudentShell>
  );
}
