import type { ScreenProps } from "@/types/navigation";
import { type IconName, Icon } from "@/components/common/Icon";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { students, questions } from "@/data/mock";
import { Dashboard } from "@/features/instructor/Dashboard";

export function Home({ go }: ScreenProps) {
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Good morning, Alex."
      subtitle="What would you like to do with CS101 today?"
    >
      <button className="new-session-card" onClick={() => go("setup")}>
        <span className="big-plus">
          <Icon name="plus" size={28} />
        </span>
        <span>
          <strong>Start a new session</strong>
          <small>Set up a live coding activity for your class</small>
        </span>
        <Icon name="arrow" size={24} />
      </button>
      <div className="section-title">
        <h2>Quick access</h2>
      </div>
      <div className="quick-grid">
        <QuickCard
          icon="book"
          color="violet"
          title="Question Bank"
          caption="24 saved questions"
          onClick={() => go("questions")}
        />
        <QuickCard
          icon="dashboard"
          color="blue"
          title="Dashboard"
          caption="View student progress"
          onClick={() => go("dashboard")}
        />
        <QuickCard
          icon="clock"
          color="orange"
          title="Recent Sessions"
          caption="8 sessions this month"
          onClick={() => go("results")}
        />
      </div>
      <div className="section-title mt-9">
        <h2>Recent sessions</h2>
        <button onClick={() => go("results")}>View all</button>
      </div>
      <div className="card overflow-hidden">
        {[
          ["Java Arrays Review", "Today, 9:00 AM", "42 students", "87% avg."],
          ["Loops & Iteration", "May 14, 2:00 PM", "38 students", "81% avg."],
          ["Methods Warm-up", "May 10, 11:00 AM", "40 students", "92% avg."],
        ].map((row, i) => (
          <button key={row[0]} className="recent-row" onClick={() => go("results")}>
            <span className="session-icon">
              <Icon name={i === 0 ? "play" : "check"} size={18} />
            </span>
            <span>
              <strong>{row[0]}</strong>
              <small>{row[1]}</small>
            </span>
            <span className="row-stat">{row[2]}</span>
            <span className="row-stat">{row[3]}</span>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </div>
    </InstructorShell>
  );
}

export function QuickCard({
  icon,
  color,
  title,
  caption,
  onClick,
}: {
  icon: IconName;
  color: string;
  title: string;
  caption: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-card" onClick={onClick}>
      <span className={`quick-icon ${color}`}>
        <Icon name={icon} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{caption}</small>
      </span>
      <Icon name="chevron" size={18} />
    </button>
  );
}
