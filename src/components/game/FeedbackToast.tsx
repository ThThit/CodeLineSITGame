import { Icon } from "@/components/common/Icon";

export function FeedbackToast({
  type,
  attempts,
}: {
  type: "correct" | "wrong" | "timeout";
  attempts: number;
}) {
  const content = {
    correct: ["Correct!", "+100 points — keep it going.", "check"],
    wrong: ["Not quite", `5 second cooldown · ${attempts} attempts left`, "x"],
    timeout: ["Time’s up", "The correct code is being revealed.", "clock"],
  } as const;
  const [title, text, icon] = content[type];
  return (
    <div className={`feedback-toast ${type}`}>
      <span>
        <Icon name={icon} size={22} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}
