import { useEffect, useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { QRCode } from "@/components/common/QRCode";
import { initials } from "@/lib/format";
import { joinOrder, session } from "@/data/mock";

const tints = ["bg-sun", "bg-sky", "bg-peach", "bg-mint", "bg-lilac"];
const tilts = ["-rotate-2", "rotate-[1.5deg]", "rotate-0", "-rotate-1", "rotate-2"];

/** Gap before the next student joins: 0.6–1.8 s, varied but repeatable. */
const joinDelay = (n: number) => 600 + ((n * 397) % 1200);

/**
 * Simulated join stream for the demo: students trickle in one by one.
 * In the real app this would come from the server as students enter the code.
 */
function useSimulatedJoins() {
  const [count, setCount] = useState(2);
  const [paused, setPaused] = useState(false);
  const done = count >= joinOrder.length;

  useEffect(() => {
    if (paused || done) return;
    const id = window.setTimeout(() => setCount((c) => c + 1), joinDelay(count));
    return () => window.clearTimeout(id);
  }, [count, paused, done]);

  return {
    joined: joinOrder.slice(0, count),
    paused,
    done,
    togglePause: () => setPaused((p) => !p),
    replay: () => {
      setCount(0);
      setPaused(false);
    },
  };
}

/** Screen 6 / FR-I7: projected lobby with QR, link, game code and students joining live. */
export function Lobby({ go }: ScreenProps) {
  const { joined, paused, done, togglePause, replay } = useSimulatedJoins();
  const latest = joined.at(-1);
  const newestFirst = [...joined].reverse();
  const pct = Math.round((joined.length / session.classSize) * 100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream font-sans text-ink">
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 size-64 rounded-full bg-sun opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 right-28 size-48 -rotate-[14deg] rounded-[48px] bg-sky opacity-80"
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-10 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Logo size="lg" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border-[3px] border-ink bg-white px-4 py-2 font-extrabold">
              {session.name} · {session.purpose} · {session.rounds} rounds
            </span>
            <button type="button" className="btn btn-secondary" onClick={() => go("setup")}>
              <Icon name="settings" size={18} /> Edit setup
            </button>
          </div>
        </header>

        <h1 className="font-display text-[40px] font-bold leading-none sm:text-[64px]">
          Grab your phone and jump in!
        </h1>

        <main className="grid flex-1 items-start gap-7 lg:grid-cols-2">
          {/* Container query: QR beside the code only when this card is wide enough. */}
          <section className="@container rounded-[30px] border-[3px] border-ink bg-white p-6 shadow-[8px_8px_0_var(--ink)] sm:p-8">
            <div className="flex flex-col items-center gap-8 @xl:flex-row @xl:items-center">
              <QRCode className="size-[200px] @md:size-[240px]" />
              <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
                <span className="text-[15px] font-extrabold uppercase tracking-[0.1em] text-soft">
                  Go to
                </span>
                <span className="break-all font-mono text-xl font-bold @md:text-2xl">
                  [CAMPUS HOST]/join
                </span>
                <span className="mt-3.5 text-[15px] font-extrabold uppercase tracking-[0.1em] text-soft">
                  Game code
                </span>
                <div
                  role="img"
                  aria-label={`Game code ${session.gameCode.split("").join(" ")}`}
                  className="grid w-full max-w-[380px] grid-cols-6 gap-1.5 @md:gap-2"
                >
                  {session.gameCode.split("").map((digit, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={`flex aspect-[4/5] min-w-0 items-center justify-center rounded-xl border-[3px] border-ink font-display text-[clamp(26px,10cqw,44px)] font-bold shadow-pop-sm @md:rounded-2xl ${
                        i % 2 ? "bg-paper" : "bg-white"
                      }`}
                    >
                      {digit}
                    </span>
                  ))}
                </div>
                <span className="mt-2 text-[17px] font-bold text-soft">
                  Scan the QR code or type the code on your phone.
                </span>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-col gap-4 rounded-[30px] bg-ink p-6 text-cream shadow-[8px_8px_0_var(--primary)] sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[56px] font-bold leading-none tabular-nums">
                {joined.length}
                <span className="text-[26px] font-semibold text-[#c9c4e6]">
                  {" "}
                  of {session.classSize} joined
                </span>
              </span>
              <span className="flex items-center gap-2 rounded-full bg-night px-3 py-1.5 text-sm font-extrabold">
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full bg-[#4ade80] ${paused || done ? "" : "motion-safe:animate-pulse"}`}
                />
                LIVE
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-night"
              role="progressbar"
              aria-label="Students joined"
              aria-valuenow={joined.length}
              aria-valuemin={0}
              aria-valuemax={session.classSize}
            >
              <div
                className="h-full rounded-full bg-[#4ade80] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <p
              className="flex min-h-7 items-center gap-2 text-lg font-extrabold"
              aria-live="polite"
            >
              {latest ? (
                <>
                  <span className="text-sun">
                    <Icon name="people" size={20} />
                  </span>
                  <span
                    key={latest}
                    className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2"
                  >
                    {latest} joined
                  </span>
                </>
              ) : (
                <span className="text-[#c9c4e6]">Waiting for the first student…</span>
              )}
            </p>

            <ul
              className="-mx-2 flex max-h-[300px] flex-wrap content-start gap-2.5 overflow-y-auto p-2"
              aria-label="Students who joined, newest first"
            >
              {newestFirst.map((name, i) => {
                const n = joined.length - 1 - i; // join position, keeps each chip's colour stable
                const isNew = i === 0;
                return (
                  <li
                    key={name}
                    className={`flex items-center gap-2 rounded-full py-[7px] pl-[7px] pr-3.5 font-extrabold text-ink ${
                      tints[n % tints.length]
                    } ${tilts[n % tilts.length]} ${
                      isNew
                        ? "ring-4 ring-cream motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:fade-in motion-safe:duration-300"
                        : ""
                    }`}
                  >
                    <span className="flex size-[30px] items-center justify-center rounded-full border-2 border-ink bg-white text-xs">
                      {initials(name)}
                    </span>
                    {name}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#c9c4e6]">
              <span className="rounded-md bg-night px-2 py-1 text-xs font-extrabold uppercase tracking-[0.1em]">
                Demo
              </span>
              <span className="mr-auto">
                {done ? "Everyone in the demo roster has joined." : "Joins are simulated."}
              </span>
              {!done && (
                <button
                  type="button"
                  onClick={togglePause}
                  className="min-h-9 rounded-lg px-3 text-cream hover:bg-night"
                >
                  {paused ? "Resume" : "Pause"}
                </button>
              )}
              <button
                type="button"
                onClick={replay}
                className="min-h-9 rounded-lg px-3 text-cream hover:bg-night"
              >
                Replay joins
              </button>
            </div>

            <button
              type="button"
              disabled={joined.length === 0}
              onClick={() => go("live")}
              className="flex min-h-[72px] items-center justify-center gap-3 rounded-[22px] border-[3px] border-cream bg-primary font-display text-[28px] font-bold text-ink transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50 sm:text-[30px]"
            >
              <Icon name="play" size={28} />
              {joined.length === 0
                ? "Waiting for players"
                : `Start with ${joined.length} ${joined.length === 1 ? "player" : "players"}`}
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
