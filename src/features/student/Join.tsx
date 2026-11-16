import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { StudentShell } from "@/components/layout/StudentShell";
import { me, session } from "@/data/mock";

const LENGTH = 6;

/** Screen 11 / FR-S2: enter the game code (pre-filled when arriving from the QR code or link). */
export function Join({ go }: ScreenProps) {
  const [digits, setDigits] = useState<string[]>(
    session.gameCode.slice(0, 4).split("").concat(["", ""]),
  );
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const complete = digits.every((d) => d !== "");

  function setDigit(i: number, value: string) {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => prev.map((x, j) => (j === i ? d : x)));
    if (d && i < LENGTH - 1) refs.current[i + 1]?.focus();
  }
  function onKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }
  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? ""));
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  return (
    <StudentShell go={go} progress>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-20 size-44 rounded-full bg-sun opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-[300px] size-28 rotate-[20deg] rounded-[30px] bg-sky"
      />

      <main className="relative flex flex-1 flex-col justify-center gap-4 py-6">
        <div aria-hidden="true" className="mb-2 flex flex-col gap-2 self-center">
          <span className="-rotate-[4deg] rounded-xl border-[3px] border-ink bg-white px-3.5 py-2 font-mono text-sm font-bold shadow-pop-sm">
            int score = 0;
          </span>
          <span className="rotate-[3deg] self-end rounded-xl border-[3px] border-mint-ink bg-mint px-3.5 py-2 font-mono text-sm font-bold text-mint-deep">
            score += 100;
          </span>
        </div>
        <span className="self-center text-[15px] font-extrabold uppercase tracking-[0.12em] text-soft">
          Hi, {me.firstName}
        </span>
        <h1 className="text-center font-display text-[42px] font-bold leading-[1.05]">
          Got a game code?
        </h1>
        <p className="text-center font-bold text-soft">
          It’s on the big screen at the front of the room.
        </p>

        <form
          className="mt-2 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (complete) go("waiting");
          }}
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-extrabold uppercase tracking-[0.1em]">
              Game code
            </legend>
            <div className="grid grid-cols-6 gap-[7px]">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  aria-label={`Digit ${i + 1}`}
                  value={d}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  onPaste={onPaste}
                  className={`h-16 min-w-0 rounded-[14px] border-[3px] border-ink text-center font-display text-[30px] font-bold text-ink focus:bg-paper focus:shadow-[0_0_0_4px_var(--sun)] ${
                    d ? "bg-white shadow-pop-sm" : "border-dashed bg-white"
                  }`}
                />
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!complete}
            className="mt-4 flex min-h-16 items-center justify-center gap-2.5 rounded-[20px] border-[3px] border-ink bg-primary font-display text-2xl font-bold text-ink shadow-pop transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50"
          >
            Let’s go <Icon name="arrow" size={24} />
          </button>
        </form>
        <button
          type="button"
          onClick={() => go("progress")}
          className="min-h-11 self-center font-extrabold underline-offset-4 hover:underline"
        >
          See my progress
        </button>
        <button
          type="button"
          onClick={() => go("home")}
          className="min-h-11 self-center text-sm font-extrabold text-soft underline-offset-4 hover:underline"
        >
          Switch to instructor view
        </button>
      </main>
    </StudentShell>
  );
}
