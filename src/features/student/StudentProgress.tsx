import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { StudentShell } from "@/components/layout/StudentShell";

export function StudentProgress({ go }: ScreenProps) {
  return (
    <StudentShell go={go} title="My progress" back="join">
      <main className="progress-main">
        <section className="profile-hero">
          <span className="avatar xl">MC</span>
          <h1>Maya Chen</h1>
          <p>CS101 · Spring term</p>
          <div>
            <span>
              <strong>8</strong>
              <small>Sessions</small>
            </span>
            <span>
              <strong>89%</strong>
              <small>Accuracy</small>
            </span>
            <span>
              <strong>#3</strong>
              <small>Class rank</small>
            </span>
          </div>
        </section>
        <h2>Past sessions</h2>
        <div className="past-sessions">
          {[
            ["Java Arrays Review", "Today", "1,180", "92%"],
            ["Loops & Iteration", "May 14", "1,040", "88%"],
            ["Methods Warm-up", "May 10", "960", "84%"],
            ["Conditionals", "May 6", "1,120", "91%"],
          ].map(([name, date, score, accuracy]) => (
            <div key={name}>
              <span className="session-icon">
                <Icon name="check" size={18} />
              </span>
              <span>
                <strong>{name}</strong>
                <small>
                  {date} · {accuracy} accuracy
                </small>
              </span>
              <b>
                {score}
                <small>points</small>
              </b>
            </div>
          ))}
        </div>
      </main>
    </StudentShell>
  );
}
