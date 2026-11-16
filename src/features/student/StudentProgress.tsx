import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { StudentShell } from "@/components/layout/StudentShell";
import { initials } from "@/lib/format";
import { me } from "@/data/mock";

const stats = [
  ["8", "Sessions"],
  ["89%", "Accuracy"],
  ["#3", "Class rank"],
] as const;

const sessions = [
  ["Java Arrays Review", "Today", "1,180", "92%"],
  ["Loops & Iteration", "May 14", "1,040", "88%"],
  ["Methods Warm-up", "May 10", "960", "84%"],
  ["Conditionals", "May 6", "1,120", "91%"],
] as const;

/** Screen 16 / FR-S9: the student's own progress across past sessions. */
export function StudentProgress({ go }: ScreenProps) {
  return (
    <StudentShell go={go} title="My progress" back="join">
      <main className="mt-5 flex flex-col gap-6 pb-20">
        <section className="flex flex-col items-center rounded-[26px] bg-ink px-5 pb-5 pt-7 text-center text-cream shadow-[6px_6px_0_var(--primary)]">
          <span className="flex size-20 items-center justify-center rounded-full border-[3px] border-cream bg-lilac text-2xl font-extrabold text-ink">
            {initials(me.name)}
          </span>
          <h1 className="mt-3 font-display text-[28px] font-bold">{me.name}</h1>
          <p className="text-sm font-bold text-[#c9c4e6]">CS101 · Spring term</p>
          <dl className="mt-5 grid w-full grid-cols-3 gap-2">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="flex flex-col items-center justify-start gap-1.5 rounded-2xl bg-night px-1 py-3"
              >
                <dt className="order-2 whitespace-nowrap text-xs font-extrabold uppercase tracking-[0.04em] text-[#c9c4e6]">
                  {label}
                </dt>
                <dd className="order-1 font-display text-2xl font-bold leading-none">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="past-title">
          <h2 id="past-title" className="mb-3 font-display text-xl font-bold">
            Past sessions
          </h2>
          <ul className="flex flex-col gap-3">
            {sessions.map(([name, date, score, accuracy]) => (
              <li
                key={name}
                className="flex items-center gap-3 rounded-[18px] border-[3px] border-ink bg-white p-3 shadow-pop"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-mint-ink bg-mint text-mint-deep">
                  <Icon name="check" size={20} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <strong className="truncate font-extrabold">{name}</strong>
                  <span className="text-[13px] font-bold text-soft">
                    {date} · {accuracy} accuracy
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end">
                  <strong className="font-display text-xl font-bold leading-none">{score}</strong>
                  <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-soft">
                    points
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </StudentShell>
  );
}
