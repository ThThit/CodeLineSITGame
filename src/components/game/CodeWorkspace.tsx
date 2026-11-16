import { Icon } from "@/components/common/Icon";

export type Slot = {
  text: string;
  locked: boolean;
  /** Who placed it. */
  by?: string | null;
  /** Just locked: glow briefly. */
  fresh?: boolean;
  /** A wrong attempt currently flashing on this slot. */
  rejected?: { text: string; by: string } | null;
};

const indentOf = (line: string) => line.length - line.trimStart().length;

/**
 * Density by program length so long code still fits a projector without scrolling.
 * Row height and font shrink as the line count grows.
 */
function density(n: number) {
  if (n <= 8) return { font: "text-[clamp(15px,2.2vh,20px)]", gap: "gap-2" };
  if (n <= 14) return { font: "text-[clamp(13px,1.9vh,18px)]", gap: "gap-1.5" };
  if (n <= 22) return { font: "text-[clamp(12px,1.6vh,16px)]", gap: "gap-1" };
  return { font: "text-[clamp(11px,1.3vh,14px)]", gap: "gap-[3px]" };
}

/**
 * The projected shared code space on the main display. Correct lines lock in
 * green with the student's name; wrong attempts flash on the slot and clear.
 * Long lines wrap with their indent kept instead of being cut off.
 */
export function CodeWorkspace({
  slots,
  title = "Shared code space",
}: {
  slots: Slot[];
  title?: string;
}) {
  const d = density(slots.length);
  return (
    <section className="flex h-full min-h-0 flex-col gap-3 rounded-[28px] bg-ink p-4 shadow-[6px_6px_0_var(--primary)]">
      <div className="flex items-center justify-between gap-3 px-1 text-cream">
        <span className="font-display text-[22px] font-semibold">{title}</span>
        <span className="flex items-center gap-3 text-sm font-extrabold">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-mint" aria-hidden="true" /> Locked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-peach" aria-hidden="true" /> Rejected
          </span>
          <span className="flex items-center gap-2 rounded-full bg-night px-3 py-1 text-xs">
            <span
              className="size-2.5 rounded-full bg-[#4ade80] motion-safe:animate-pulse"
              aria-hidden="true"
            />
            LIVE
          </span>
        </span>
      </div>
      <ol
        className={`grid min-h-0 flex-1 ${d.gap}`}
        // Every row gets an equal share of the board height, so any length fits the screen.
        style={{ gridTemplateRows: `repeat(${slots.length}, minmax(0, 1fr))` }}
      >
        {slots.map((slot, i) => {
          const pad = { paddingLeft: `${indentOf(slot.text)}ch` };
          return (
            <li key={i} className="flex min-h-0 items-stretch gap-2">
              <span className="flex w-8 shrink-0 items-center justify-end font-mono text-sm font-bold text-[#a9a4c6]">
                {i + 1}
              </span>
              {slot.rejected ? (
                <div
                  key={`r-${slot.rejected.by}-${slot.rejected.text}`}
                  className={`flex flex-1 items-center gap-3 rounded-xl border-[3px] border-[#b93a0b] bg-peach px-3 text-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-1 min-h-0 py-0.5`}
                >
                  <code
                    className={`min-w-0 flex-1 overflow-hidden whitespace-pre-wrap break-words font-mono font-bold line-through decoration-2 ${d.font}`}
                    style={{ paddingLeft: `${indentOf(slot.rejected.text)}ch` }}
                  >
                    {slot.rejected.text.trimStart()}
                  </code>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-extrabold">
                    <Icon name="x" size={18} /> {slot.rejected.by}
                  </span>
                </div>
              ) : slot.locked ? (
                <div
                  className={`flex flex-1 items-center gap-3 rounded-xl border-[3px] border-mint-ink bg-mint px-3 transition-shadow duration-700 min-h-0 py-0.5 ${
                    slot.fresh ? "shadow-[0_0_0_5px_var(--sun)]" : ""
                  }`}
                >
                  <code
                    className={`min-w-0 flex-1 overflow-hidden whitespace-pre-wrap break-words font-mono font-bold text-mint-deep ${d.font}`}
                    style={pad}
                  >
                    {slot.text.trimStart()}
                  </code>
                  {slot.by && (
                    <span className="shrink-0 text-sm font-extrabold text-mint-deep">
                      {slot.by}
                    </span>
                  )}
                  <span className="shrink-0 text-mint-ink">
                    <Icon name="check" size={20} />
                  </span>
                </div>
              ) : (
                <div
                  className={`flex flex-1 items-center rounded-xl border-[3px] border-dashed border-[#57527a] px-3 font-bold text-[#a9a4c6] min-h-0 py-0.5`}
                >
                  <span className="text-sm">Waiting…</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
