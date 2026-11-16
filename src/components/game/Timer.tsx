import { Icon } from "@/components/common/Icon";

export function formatClock(seconds: number) {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** The yellow countdown pill used on the main display and the student game. */
export function Timer({ seconds, size = "md" }: { seconds: number; size?: "sm" | "md" | "lg" }) {
  const styles = {
    sm: "gap-1.5 rounded-[14px] px-3 py-1.5 text-xl shadow-pop-sm border-[2.5px]",
    md: "gap-2 rounded-[18px] px-4 py-2 text-3xl shadow-pop border-[3px]",
    lg: "gap-2.5 rounded-[22px] py-2 pl-3.5 pr-5 text-[44px] shadow-pop border-[3px]",
  }[size];
  const low = seconds <= 10;
  return (
    <span
      role="timer"
      aria-label={`${seconds} seconds left`}
      className={`inline-flex items-center border-ink font-display font-bold leading-none text-ink ${
        low ? "bg-primary" : "bg-sun"
      } ${styles}`}
    >
      <Icon name="clock" size={size === "lg" ? 30 : size === "md" ? 24 : 18} />
      {formatClock(seconds)}
    </span>
  );
}
