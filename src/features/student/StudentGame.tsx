import { useState, type DragEvent } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { StudentShell } from "@/components/layout/StudentShell";
import { CodeWorkspace } from "@/components/game/CodeWorkspace";
import { FeedbackToast } from "@/components/game/FeedbackToast";
import { codeLines } from "@/data/mock";

export function StudentGame({ go }: ScreenProps) {
  const [placed, setPlaced] = useState(2);
  const [toast, setToast] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [attempts, setAttempts] = useState(3);
  const tray = [codeLines[5], codeLines[3], codeLines[2], codeLines[4], codeLines[6]];

  function tryLine(line: string) {
    if (line === codeLines[placed]) {
      setPlaced(Math.min(placed + 1, codeLines.length));
      setToast("correct");
    } else {
      setAttempts(Math.max(0, attempts - 1));
      setToast("wrong");
    }
    window.setTimeout(() => setToast(null), 2400);
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    tryLine(e.dataTransfer.getData("text/plain"));
  }
  return (
    <StudentShell go={go} title="Round 1 · Q2/3" progress>
      <main className="game-main">
        <div className="game-status">
          <span>
            <b>Sum an array</b>
            <small>Drag the next line into place</small>
          </span>
          <div className="game-status-actions">
            <span className="streak-chip">3 line streak</span>
            <span className="mobile-timer">
              <Icon name="clock" size={18} />
              0:42
            </span>
          </div>
        </div>
        <div
          className="round-progress"
          aria-label={`${placed} of ${codeLines.length} lines placed`}
        >
          <span style={{ width: `${(placed / codeLines.length) * 100}%` }} />
          <b>
            {placed}/{codeLines.length} lines
          </b>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={drop}>
          <CodeWorkspace student placed={placed} />
        </div>
        <div className="tray-head">
          <span>
            My lines <em>Tap or drag</em>
          </span>
          <small>{attempts} attempts left</small>
        </div>
        <div className="line-tray">
          {tray
            .filter((line) => !codeLines.slice(0, placed).includes(line))
            .map((line) => (
              <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", line)}
                onClick={() => tryLine(line)}
                key={line}
              >
                <span className="drag-grip">⠿</span>
                <code>{line}</code>
              </button>
            ))}
        </div>
        <button
          className="timeout-link"
          onClick={() => {
            setToast("timeout");
            window.setTimeout(() => go("leaderboard"), 1800);
          }}
        >
          End round & view leaderboard
        </button>
      </main>
      {toast && <FeedbackToast type={toast} attempts={attempts} />}
    </StudentShell>
  );
}
