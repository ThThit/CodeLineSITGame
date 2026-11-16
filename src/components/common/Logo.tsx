export function Logo({
  compact = false,
  size = "md",
  tone = "ink",
}: {
  compact?: boolean;
  size?: "md" | "lg";
  /** Text color: ink on light backgrounds, cream on the dark sidebar. */
  tone?: "ink" | "cream";
}) {
  const lg = size === "lg";
  return (
    <div className="flex items-center gap-3">
      <div className={`logo-mark ${lg ? "size-[52px]! rounded-2xl!" : ""}`}>
        <span className={lg ? "text-[17px]!" : ""}>&lt;/&gt;</span>
      </div>
      {!compact && (
        <span
          className={`font-display font-bold ${lg ? "text-[32px]" : "text-[24px]"} ${
            tone === "cream" ? "text-cream" : "text-ink"
          }`}
        >
          CodeLine
        </span>
      )}
    </div>
  );
}
