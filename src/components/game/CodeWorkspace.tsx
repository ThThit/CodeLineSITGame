import { Icon } from "@/components/common/Icon";
import { codeLines } from "@/data/mock";
import { Waiting } from "@/features/student/Waiting";

export function CodeWorkspace({
  student = false,
  placed = 4,
}: {
  student?: boolean;
  placed?: number;
}) {
  return (
    <div className={`code-workspace ${student ? "student-code" : ""}`}>
      {codeLines.map((line, i) => (
        <div key={line} className={`code-slot ${i < placed ? "correct" : ""}`}>
          <span className="line-num">{i + 1}</span>
          {i < placed ? (
            <code>{line}</code>
          ) : (
            <span className="empty-line">
              {student ? "Drop a line here" : "Waiting for a correct line…"}
            </span>
          )}
          {i < placed && <Icon name="check" size={17} />}
        </div>
      ))}
    </div>
  );
}
