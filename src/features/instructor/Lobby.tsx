import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { QRCode } from "@/components/common/QRCode";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { students } from "@/data/mock";
import { Join } from "@/features/student/Join";
import { Waiting } from "@/features/student/Waiting";

export function Lobby({ go }: ScreenProps) {
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Students, join the game!"
      subtitle="Java Arrays Review · Waiting for students"
    >
      <div className="lobby-grid">
        <div className="card join-panel">
          <div>
            <QRCode />
          </div>
          <div className="join-details">
            <span className="eyebrow">Join at</span>
            <div className="join-link">
              codeline.app/join{" "}
              <button>
                <Icon name="copy" size={18} />
              </button>
            </div>
            <span className="eyebrow mt-7">Game code</span>
            <div className="game-code">847 291</div>
            <p>Open CodeLine on any device, then enter the game code.</p>
          </div>
        </div>
        <div className="card roster-panel">
          <div className="roster-title">
            <span>
              <Icon name="people" />
              <strong>10 joined</strong>
            </span>
            <span className="live-dot">Live</span>
          </div>
          <div className="student-chips">
            {students.map(([name], i) => (
              <div className="student-chip" key={name}>
                <span style={{ background: ["#ddd6fe", "#bfdbfe", "#fed7aa", "#bbf7d0"][i % 4] }}>
                  {initials(name)}
                </span>
                {name}
                <Icon name="check" size={15} />
              </div>
            ))}
          </div>
          <div className="roster-footer">
            <span>
              <strong>CS101</strong>
              <small>10 of 42 students joined</small>
            </span>
            <Button icon="play" onClick={() => go("live")}>
              Start session
            </Button>
          </div>
        </div>
      </div>
    </InstructorShell>
  );
}
