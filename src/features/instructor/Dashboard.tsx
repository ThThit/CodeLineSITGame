import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Metric } from "@/components/common/Metric";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { students } from "@/data/mock";

export function Dashboard({ go }: ScreenProps) {
  return (
    <InstructorShell
      screen="dashboard"
      go={go}
      title="Class dashboard"
      subtitle="Track progress across CS101 · Spring term"
      actions={
        <>
          <Button variant="secondary" icon="send">
            Send to department
          </Button>
          <Button icon="download">Export report</Button>
        </>
      }
    >
      <div className="metric-grid">
        <Metric value="42" label="Active students" note="98% participation" color="violet" />
        <Metric value="84%" label="Average accuracy" note="+4% this month" color="green" />
        <Metric value="12" label="Sessions completed" note="36 total rounds" color="blue" />
        <Metric value="6.4h" label="Practice time" note="Per student average" color="orange" />
      </div>
      <div className="card mt-5 overflow-hidden">
        <div className="dashboard-toolbar">
          <div>
            <h2>Student progress</h2>
            <p>Performance across all sessions</p>
          </div>
          <div className="search-box">
            <Icon name="search" size={18} />
            <input placeholder="Search students" />
          </div>
        </div>
        <div className="progress-table">
          <div className="progress-row head">
            <span>Student</span>
            <span>Sessions</span>
            <span>Accuracy</span>
            <span>Avg. score</span>
            <span>Trend</span>
          </div>
          {students.map(([name, score], i) => (
            <div className="progress-row" key={name}>
              <span>
                <i className="mini-avatar">{initials(name)}</i>
                <strong>{name}</strong>
              </span>
              <span>{12 - (i % 3)}/12</span>
              <span>
                <b>{92 - i * 2}%</b>
                <i className="progress-bar">
                  <em style={{ width: `${92 - i * 2}%` }} />
                </i>
              </span>
              <span>{score}</span>
              <span className={i > 7 ? "trend down" : "trend"}>{i > 7 ? "↓ 2%" : "↑ 6%"}</span>
            </div>
          ))}
        </div>
      </div>
    </InstructorShell>
  );
}
