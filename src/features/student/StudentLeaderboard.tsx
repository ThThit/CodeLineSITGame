import { useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { StudentShell } from "@/components/layout/StudentShell";
import { initials } from "@/lib/format";
import { allRoundsResults, me, roundResults } from "@/data/mock";

type Tab = "round" | "all";
const ordinal = (n: number) =>
  `${n}${["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ?? "th"}`;

const podiumStyle = [
  { medal: "bg-sun", height: "h-[124px]", tint: "bg-sky" },
  { medal: "bg-silver", height: "h-24", tint: "bg-lilac" },
  { medal: "bg-bronze", height: "h-[78px]", tint: "bg-mint" },
];

/** Screen 15 / FR-S8: this round and all rounds, with the student's own result up top. */
export function StudentLeaderboard({ go }: ScreenProps) {
  const [tab, setTab] = useState<Tab>("round");
  const rows = tab === "round" ? roundResults : allRoundsResults;
  const myRank = rows.findIndex(([name]) => name === me.name) + 1;
  const myScore = rows.find(([name]) => name === me.name)?.[1] ?? 0;
  // Podium reads 2nd, 1st, 3rd from left to right.
  const podium = [1, 0, 2].map((i) => ({
    rank: i + 1,
    name: rows[i][0],
    score: rows[i][1],
    ...podiumStyle[i],
  }));

  return (
    <StudentShell go={go} title="Round 1 complete" back="join">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 h-32">
        <span className="absolute left-8 top-5 size-3.5 rotate-[20deg] rounded-[4px] bg-primary" />
        <span className="absolute right-12 top-0 size-3 rounded-full bg-sky-strong" />
        <span className="absolute right-24 top-20 h-2 w-4 -rotate-[30deg] rounded bg-[#b69cff]" />
        <span className="absolute left-20 top-28 size-2.5 rounded-full bg-[#4ade80]" />
      </div>

      <main className="relative mt-4 flex flex-1 flex-col gap-3.5">
        <div className="text-center">
          <h1 className="font-display text-[38px] font-bold leading-[1.05]">
            {myRank === 1 ? "You won!" : `You came ${ordinal(myRank)}!`}
          </h1>
          <p className="mt-1.5 font-bold text-soft">
            {tab === "round" ? "5 lines locked · 1 wrong try" : "Across both rounds"}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-[20px] bg-ink px-4 py-3.5 text-cream shadow-[4px_4px_0_var(--primary)]">
          <span className="flex size-12 items-center justify-center rounded-full border-[3px] border-cream bg-lilac text-[17px] font-extrabold text-ink">
            {initials(me.name)}
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#c9c4e6]">
              Your score
            </span>
            <span className="font-display text-[32px] font-bold leading-none">
              {myScore.toLocaleString()}
            </span>
          </span>
          {tab === "round" && (
            <span className="rounded-full bg-[#4ade80] px-3 py-1.5 font-display text-lg font-bold text-mint-deep">
              +480
            </span>
          )}
        </div>

        <ol className="mt-1 grid grid-cols-3 items-end gap-2" aria-label="Top three">
          {podium.map((p) => (
            <li key={p.name} className="flex flex-col items-center gap-1.5">
              <span
                className={`flex size-12 items-center justify-center rounded-full border-[3px] border-ink font-extrabold ${p.tint}`}
              >
                {initials(p.name)}
              </span>
              <strong className="text-[15px] font-extrabold">
                {p.name.split(" ")[0]}
                {p.name === me.name && " (you)"}
              </strong>
              <div
                className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-t-2xl rounded-b-md border-[3px] border-ink shadow-pop-sm ${p.medal} ${p.height}`}
              >
                <span className="font-display text-[34px] font-bold leading-none">{p.rank}</span>
                <span className="text-sm font-extrabold">{p.score.toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ol>

        <div
          role="tablist"
          aria-label="Leaderboard range"
          className="grid grid-cols-2 gap-1.5 rounded-2xl border-[2.5px] border-ink bg-white p-[5px]"
        >
          {(
            [
              ["round", "This round"],
              ["all", "All rounds"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`min-h-11 rounded-xl text-[15px] font-extrabold ${tab === key ? "bg-ink text-cream" : "text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <ol className="flex flex-col gap-1.5" start={4}>
          {rows.slice(3).map(([name, score], i) => (
            <li
              key={name}
              className={`flex items-center gap-3 rounded-[14px] border-2 px-3 py-2 ${
                name === me.name ? "border-ink bg-paper" : "border-line bg-white"
              }`}
            >
              <span className="w-6 font-display text-lg font-bold text-soft">{i + 4}</span>
              <strong className="flex-1 font-extrabold">{name}</strong>
              <span className="font-display text-lg font-bold">{score.toLocaleString()}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => go("game")}
          className="mt-auto min-h-[60px] rounded-[20px] border-[3px] border-ink bg-primary font-display text-[22px] font-bold shadow-pop"
        >
          Ready for round 2
        </button>
      </main>
    </StudentShell>
  );
}
