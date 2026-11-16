import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { StudentShell } from "@/components/layout/StudentShell";

export function Waiting({ go }: ScreenProps) {
  return (
    <StudentShell go={go} title="Java Arrays Review">
      <main className="waiting-screen">
        <div className="class-room-pill">
          <Icon name="book" size={16} />
          CS101 · Room 4A
        </div>
        <div className="waiting-animation">
          <span />
          <span />
          <span />
        </div>
        <span className="eyebrow">You’re in!</span>
        <h1>
          Waiting for Alex
          <br />
          to start the game
        </h1>
        <div className="waiting-card">
          <span className="avatar large">MC</span>
          <div>
            <strong>Maya Chen</strong>
            <small>Joined as student 10</small>
          </div>
          <Icon name="check" />
        </div>
        <div className="waiting-meta">
          <span>
            <Icon name="people" />
            10 joined
          </span>
          <span>
            <Icon name="clock" />
            Starting soon
          </span>
        </div>
        <Button variant="secondary" onClick={() => go("game")} className="mt-8">
          Preview game screen
        </Button>
      </main>
    </StudentShell>
  );
}
