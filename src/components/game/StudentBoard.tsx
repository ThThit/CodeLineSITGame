import { Icon } from "@/components/common/Icon";

const indentOf = (line: string) => line.length - line.trimStart().length;

/**
 * The student's view of the shared code space, built for long programs:
 * - the whole board scrolls sideways as one block, so indentation stays aligned
 * - line numbers stay pinned on the left while scrolling sideways
 * - optional wrapping shows every long line in full
 * - empty slots carry `data-slot` so a pointer drag can find the slot under the finger
 */
export function StudentBoard({
  lines,
  locked,
  armed,
  hoverSlot,
  wrap,
  onSlot,
}: {
  lines: string[];
  locked: (index: number) => boolean;
  /** A line is selected or being dragged: empty slots become targets. */
  armed: boolean;
  hoverSlot: number | null;
  wrap: boolean;
  onSlot?: (index: number) => void;
}) {
  const text = wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre";
  return (
    <div className={`rounded-2xl bg-ink p-2 ${wrap ? "" : "overflow-x-auto"}`}>
      <ol className={`flex flex-col gap-1.5 ${wrap ? "w-full" : "min-w-max"}`}>
        {lines.map((line, i) => {
          const isLocked = locked(i);
          const hovered = hoverSlot === i;
          return (
            <li key={i} className="flex items-stretch gap-1.5">
              <span
                aria-hidden="true"
                className="sticky left-0 z-10 flex w-7 shrink-0 items-center justify-end bg-ink pr-1 font-mono text-xs font-bold text-[#a9a4c6]"
              >
                {i + 1}
              </span>
              {isLocked ? (
                <div className="flex min-h-10 flex-1 items-center gap-2 rounded-lg border-2 border-mint-ink bg-mint px-2.5 py-1.5">
                  <code
                    className={`flex-1 font-mono text-[13px] font-bold text-mint-deep ${text}`}
                    // When wrapping, keep the indent as padding so wrapped text lines up under itself.
                    style={wrap ? { paddingLeft: `${indentOf(line)}ch` } : undefined}
                  >
                    {wrap ? line.trimStart() : line}
                  </code>
                  <span className="text-mint-ink" aria-label="Locked">
                    <Icon name="check" size={16} />
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  data-slot={i}
                  disabled={!onSlot}
                  onClick={() => onSlot?.(i)}
                  aria-label={`Slot ${i + 1}, empty`}
                  className={`flex min-h-10 flex-1 items-center rounded-lg border-2 border-dashed px-2.5 text-left text-[13px] font-bold transition-colors disabled:cursor-default ${
                    hovered
                      ? "border-solid border-sun bg-sun text-ink"
                      : armed
                        ? "cursor-pointer border-sun bg-night text-[#e9e4ff]"
                        : "border-[#57527a] text-[#a9a4c6]"
                  } ${wrap ? "" : "min-w-[220px]"}`}
                >
                  {hovered ? "Drop here" : armed ? "Put it here?" : "Empty"}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
