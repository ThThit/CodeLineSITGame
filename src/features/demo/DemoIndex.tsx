import type { Screen, ScreenProps } from "@/types/navigation";
import { Logo } from "@/components/common/Logo";

type Card = { screen: Screen; num: number; name: string; what: string; tryIt?: boolean };

const groups: { title: string; note: string; cards: Card[] }[] = [
  {
    title: "Start",
    note: "Where every user begins",
    cards: [
      {
        screen: "login",
        num: 1,
        name: "Sign in",
        what: "sign in with a student ID email to reach Join, or a staff email to reach instructor Home.",
        tryIt: true,
      },
    ],
  },
  {
    title: "Instructor",
    note: "Laptop screens for preparing and reviewing sessions",
    cards: [
      {
        screen: "home",
        num: 2,
        name: "Home",
        what: "Start a session, recent sessions, shortcuts.",
      },
      {
        screen: "questions",
        num: 3,
        name: "Question bank",
        what: "search, filter by topic, duplicate, delete then Undo.",
        tryIt: true,
      },
      {
        screen: "create-question",
        num: 4,
        name: "Create question",
        what: "paste code and watch the shuffled line preview; save with empty fields to see the checks.",
        tryIt: true,
      },
      {
        screen: "setup",
        num: 5,
        name: "Session setup",
        what: "per-round time, tries and penalty; untick all questions and Open lobby locks.",
        tryIt: true,
      },
      {
        screen: "results",
        num: 8,
        name: "Round results",
        what: "This round / all rounds leaderboard; open a question to see its correct code.",
      },
      {
        screen: "dashboard",
        num: 9,
        name: "Dashboard",
        what: "sort columns, search students, Export CSV.",
        tryIt: true,
      },
    ],
  },
  {
    title: "Projector",
    note: "Shown to the whole class on the big screen",
    cards: [
      {
        screen: "lobby",
        num: 6,
        name: "Lobby",
        what: "QR code and game code; students appear as they join.",
      },
      {
        screen: "live",
        num: 7,
        name: "Live round",
        what: "Shared code space: correct lines lock green, wrong tries flash and get rejected. Add time, send a hint.",
      },
    ],
  },
  {
    title: "Student",
    note: "Phone screens (best viewed narrow)",
    cards: [
      { screen: "join", num: 11, name: "Join with code", what: "Enter the 6-digit game code." },
      {
        screen: "waiting",
        num: 12,
        name: "Waiting lobby",
        what: "“You’re in” while the instructor starts.",
      },
      {
        screen: "game",
        num: 13,
        name: "Game",
        what: "drag a line onto a slot, or tap a line then a slot. Wrong spots cost a try and a cooldown.",
        tryIt: true,
      },
      {
        screen: "leaderboard",
        num: 15,
        name: "Leaderboard",
        what: "Podium and ranks for this round and all rounds.",
      },
      {
        screen: "progress",
        num: 16,
        name: "My progress",
        what: "Past sessions, accuracy and class rank.",
      },
    ],
  },
];

const notes = [
  [
    "Moving around",
    "Use the round orange button (bottom right) to jump to any page, including back to this index. Browser Back works too.",
  ],
  [
    "Simulated activity",
    "Students joining the lobby and placing lines in the live round are simulated so you can watch it happen. Each has Pause and Replay.",
  ],
  [
    "Resets on reload",
    "Questions you add, edit or delete stay while the tab is open. Reloading restores the sample data.",
  ],
] as const;

/** Start page for reviewers: says this is a demo and links to every screen. */
export function DemoIndex({ go }: ScreenProps) {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <div className="mx-auto flex max-w-[1040px] flex-col gap-7 px-4 pb-24 pt-7 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Logo />
          <span className="inline-flex items-center rounded-full border-2 border-ink bg-sun px-3 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.06em]">
            UI demo · sample data
          </span>
        </header>

        <div>
          <h1 className="font-display text-[clamp(30px,5vw,48px)] font-bold leading-[1.05] [text-wrap:balance]">
            Every CodeLine screen, ready to click through
          </h1>
          <p className="mt-2.5 max-w-[62ch] text-[17px] font-semibold leading-relaxed text-soft">
            CodeLine turns the paper “put the code lines in order” exercise into a live classroom
            game. This is a clickable wireframe for review: sign-in is a mock, there is no server
            and nothing is saved. Pick any screen below to open it.
          </p>
        </div>

        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
          {notes.map(([title, text]) => (
            <div
              key={title}
              className="rounded-[14px] border border-line bg-white px-4 py-3.5 text-sm font-semibold leading-normal text-soft"
            >
              <strong className="mb-0.5 block text-[15px] text-ink">{title}</strong>
              {text}
            </div>
          ))}
        </div>

        {groups.map((g) => (
          <section key={g.title} className="flex flex-col gap-3" aria-labelledby={`g-${g.title}`}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id={`g-${g.title}`} className="font-display text-[22px] font-bold">
                {g.title}
              </h2>
              <span className="text-sm font-bold text-soft">{g.note}</span>
            </div>
            <ul className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
              {g.cards.map((c) => (
                <li key={c.screen}>
                  <button
                    type="button"
                    onClick={() => go(c.screen)}
                    className="grid h-full w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-[14px] border-[1.5px] border-line bg-white px-4 py-3.5 text-left transition hover:-translate-x-px hover:-translate-y-px hover:border-ink hover:shadow-[3px_3px_0_var(--ink)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
                  >
                    <span className="row-span-3 grid size-[34px] place-items-center rounded-full border-2 border-ink text-[13px] font-extrabold tabular-nums">
                      {c.num}
                    </span>
                    <span className="text-base font-extrabold">{c.name}</span>
                    <span className="text-sm font-semibold leading-snug text-soft">
                      {c.tryIt && <span className="text-mint-ink">Try: </span>}
                      {c.what}
                    </span>
                    <span className="font-mono text-xs font-semibold text-soft">#{c.screen}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="text-[13px] font-semibold text-soft">
          Numbers match the wireframe list in the CodeLine proposal. Sign-in is a single mock screen
          covering wireframes 1 and 10.
        </p>
      </div>
    </div>
  );
}
