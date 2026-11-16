import { useState, type DragEvent, type ReactNode } from "react";

type Screen =
  | "login-instructor"
  | "home"
  | "questions"
  | "create-question"
  | "setup"
  | "lobby"
  | "live"
  | "results"
  | "dashboard"
  | "login-student"
  | "join"
  | "waiting"
  | "game"
  | "leaderboard"
  | "progress";

type IconName =
  | "arrow"
  | "bank"
  | "book"
  | "check"
  | "chevron"
  | "clock"
  | "copy"
  | "dashboard"
  | "download"
  | "edit"
  | "hint"
  | "home"
  | "link"
  | "logout"
  | "menu"
  | "music"
  | "people"
  | "play"
  | "plus"
  | "search"
  | "send"
  | "settings"
  | "trash"
  | "trophy"
  | "x";

const codeLines = [
  "public static int sum(int[] nums) {",
  "    int total = 0;",
  "    for (int num : nums) {",
  "        total += num;",
  "    }",
  "    return total;",
  "}",
];

const students = [
  ["Maya Chen", 1240],
  ["Theo Martin", 1180],
  ["Amara Okafor", 1120],
  ["Lucas Silva", 1060],
  ["Sofia Patel", 980],
  ["Noah Williams", 920],
  ["Leila Hassan", 860],
  ["Ethan Kim", 810],
  ["Zoe Brown", 760],
  ["Sam Rivera", 720],
] as const;

const questions = [
  ["Sum an array", "Arrays · Loops", "7 lines", "2 days ago"],
  ["Find the largest value", "Arrays · Conditionals", "9 lines", "4 days ago"],
  ["FizzBuzz", "Loops · Conditionals", "12 lines", "1 week ago"],
  ["Reverse a string", "Strings · Loops", "8 lines", "1 week ago"],
  ["Count vowels", "Strings · Conditionals", "11 lines", "2 weeks ago"],
] as const;

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    bank: (
      <>
        <path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M3 18h18M12 3l9 5H3l9-5Z" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M5 21h14" />
      </>
    ),
    edit: (
      <>
        <path d="m4 16-1 5 5-1L19 9l-4-4L4 16Z" />
        <path d="m13 7 4 4" />
      </>
    ),
    hint: (
      <>
        <path d="M9 18h6M10 22h4" />
        <path d="M8.2 14.5A7 7 0 1 1 15.8 14.5c-1.2.8-1.8 1.6-1.8 2.5h-4c0-.9-.6-1.7-1.8-2.5Z" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7V5Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 21h8M9 17h6" />
        <path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="logo-mark">
        <span>&lt;/&gt;</span>
      </div>
      {!compact && (
        <span className="text-[20px] font-extrabold tracking-[-.04em] text-slate-950">
          CodeLine
        </span>
      )}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  icon?: IconName;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className={`btn btn-${variant} ${className}`}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

function AuthLayout({
  role,
  onSwitch,
  onContinue,
}: {
  role: "instructor" | "student";
  onSwitch: () => void;
  onContinue: () => void;
}) {
  const instructor = role === "instructor";
  return (
    <div className="auth-page">
      <header className="auth-header">
        <Logo />
        <button
          onClick={onSwitch}
          className="text-sm font-bold text-slate-600 hover:text-violet-700"
        >
          {instructor ? "Student login" : "Instructor login"} <span className="ml-1">→</span>
        </button>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <div className="eyebrow">{instructor ? "Instructor portal" : "Student portal"}</div>
          <h1>{instructor ? "Make code click." : "Ready to play?"}</h1>
          <p className="mt-3 text-[16px] leading-7 text-slate-500">
            {instructor
              ? "Turn Java practice into a fast, collaborative classroom game."
              : "Sign in with your university account to join your class."}
          </p>
          <button onClick={onContinue} className="university-button">
            <span className="university-icon">
              <Icon name="bank" size={19} />
            </span>
            Continue with University Account
            <Icon name="arrow" size={19} />
          </button>
          <div className="divider">
            <span>or use email</span>
          </div>
          <label className="field-label" htmlFor={`${role}-email`}>
            University email
          </label>
          <input
            id={`${role}-email`}
            className="input"
            defaultValue={instructor ? "alex.morgan@northbridge.edu" : "maya.chen@northbridge.edu"}
          />
          <label className="field-label mt-4" htmlFor={`${role}-password`}>
            Password
          </label>
          <input
            id={`${role}-password`}
            type="password"
            className="input"
            defaultValue="password123"
          />
          <Button onClick={onContinue} className="mt-6 w-full justify-center">
            Sign in <Icon name="arrow" size={18} />
          </Button>
          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to CodeLine’s Terms and Privacy Policy.
          </p>
        </section>
      </main>
      <div className="auth-art" aria-hidden="true">
        <span className="code-chip chip-a">int score = 100;</span>
        <span className="code-chip chip-b">if (correct) &#123;</span>
        <span className="code-chip chip-c">return total;</span>
      </div>
    </div>
  );
}

function InstructorShell({
  screen,
  go,
  children,
  title,
  subtitle,
  actions,
}: {
  screen: Screen;
  go: (screen: Screen) => void;
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const nav = [
    ["home", "Home", "home"],
    ["questions", "Question Bank", "book"],
    ["dashboard", "Dashboard", "dashboard"],
  ] as const;
  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <aside className="desktop-sidebar">
        <Logo />
        <nav className="mt-10 space-y-1.5">
          {nav.map(([target, label, icon]) => (
            <button
              key={target}
              className={`side-nav ${screen === target ? "active" : ""}`}
              onClick={() => go(target)}
            >
              <Icon name={icon} size={20} />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="profile-block">
            <div className="avatar">AM</div>
            <div className="min-w-0">
              <strong>Alex Morgan</strong>
              <span>Instructor</span>
            </div>
          </div>
          <button className="side-nav mt-2" onClick={() => go("login-instructor")}>
            <Icon name="logout" />
            Log out
          </button>
        </div>
      </aside>
      <div className="desktop-content">
        <header className="mobile-top">
          <Logo />
          <button className="icon-button">
            <Icon name="menu" />
          </button>
        </header>
        <div className="page-head">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}

function Home({ go }: { go: (screen: Screen) => void }) {
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Good morning, Alex."
      subtitle="What would you like to do with CS101 today?"
    >
      <button className="new-session-card" onClick={() => go("setup")}>
        <span className="big-plus">
          <Icon name="plus" size={28} />
        </span>
        <span>
          <strong>Start a new session</strong>
          <small>Set up a live coding activity for your class</small>
        </span>
        <Icon name="arrow" size={24} />
      </button>
      <div className="section-title">
        <h2>Quick access</h2>
      </div>
      <div className="quick-grid">
        <QuickCard
          icon="book"
          color="violet"
          title="Question Bank"
          caption="24 saved questions"
          onClick={() => go("questions")}
        />
        <QuickCard
          icon="dashboard"
          color="blue"
          title="Dashboard"
          caption="View student progress"
          onClick={() => go("dashboard")}
        />
        <QuickCard
          icon="clock"
          color="orange"
          title="Recent Sessions"
          caption="8 sessions this month"
          onClick={() => go("results")}
        />
      </div>
      <div className="section-title mt-9">
        <h2>Recent sessions</h2>
        <button onClick={() => go("results")}>View all</button>
      </div>
      <div className="card overflow-hidden">
        {[
          ["Java Arrays Review", "Today, 9:00 AM", "42 students", "87% avg."],
          ["Loops & Iteration", "May 14, 2:00 PM", "38 students", "81% avg."],
          ["Methods Warm-up", "May 10, 11:00 AM", "40 students", "92% avg."],
        ].map((row, i) => (
          <button key={row[0]} className="recent-row" onClick={() => go("results")}>
            <span className="session-icon">
              <Icon name={i === 0 ? "play" : "check"} size={18} />
            </span>
            <span>
              <strong>{row[0]}</strong>
              <small>{row[1]}</small>
            </span>
            <span className="row-stat">{row[2]}</span>
            <span className="row-stat">{row[3]}</span>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </div>
    </InstructorShell>
  );
}

function QuickCard({
  icon,
  color,
  title,
  caption,
  onClick,
}: {
  icon: IconName;
  color: string;
  title: string;
  caption: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-card" onClick={onClick}>
      <span className={`quick-icon ${color}`}>
        <Icon name={icon} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{caption}</small>
      </span>
      <Icon name="chevron" size={18} />
    </button>
  );
}

function QuestionBank({ go }: { go: (screen: Screen) => void }) {
  const [query, setQuery] = useState("");
  const filtered = questions.filter((q) => q[0].toLowerCase().includes(query.toLowerCase()));
  return (
    <InstructorShell
      screen="questions"
      go={go}
      title="Question Bank"
      subtitle="Create and manage reusable Java challenges."
      actions={
        <Button icon="plus" onClick={() => go("create-question")}>
          New question
        </Button>
      }
    >
      <div className="toolbar card">
        <div className="search-box">
          <Icon name="search" size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
          />
        </div>
        <select className="select">
          <option>All topics</option>
          <option>Arrays</option>
          <option>Loops</option>
        </select>
        <select className="select">
          <option>Last updated</option>
          <option>Title</option>
        </select>
      </div>
      <div className="card mt-4 overflow-hidden">
        <div className="table-head question-row">
          <span>Question</span>
          <span>Lines</span>
          <span>Updated</span>
          <span></span>
        </div>
        {filtered.map((q) => (
          <div className="question-row" key={q[0]}>
            <span>
              <strong>{q[0]}</strong>
              <small>{q[1]}</small>
            </span>
            <span className="muted-cell">{q[2]}</span>
            <span className="muted-cell">{q[3]}</span>
            <span className="row-actions">
              <button title="Edit" onClick={() => go("create-question")}>
                <Icon name="edit" size={17} />
              </button>
              <button title="Duplicate">
                <Icon name="copy" size={17} />
              </button>
              <button title="Delete">
                <Icon name="trash" size={17} />
              </button>
            </span>
          </div>
        ))}
      </div>
    </InstructorShell>
  );
}

function CreateQuestion({ go }: { go: (screen: Screen) => void }) {
  return (
    <InstructorShell
      screen="questions"
      go={go}
      title="Create question"
      subtitle="Build a line-ordering challenge for your students."
      actions={
        <>
          <Button variant="secondary" onClick={() => go("questions")}>
            Cancel
          </Button>
          <Button onClick={() => go("questions")}>Save question</Button>
        </>
      }
    >
      <div className="editor-grid">
        <div className="card form-card">
          <label className="field-label">Question title</label>
          <input className="input" defaultValue="Sum the values in an array" />
          <label className="field-label mt-5">Pseudocode</label>
          <textarea
            className="textarea"
            rows={6}
            defaultValue={
              "Create a variable to hold the total\nLoop through each number in the array\nAdd the number to the total\nReturn the total"
            }
          />
          <div className="flex items-end justify-between gap-4 mt-5">
            <label className="field-label m-0">
              Java code <span className="font-normal text-slate-400">One statement per line</span>
            </label>
            <span className="text-xs font-bold text-slate-400">7 lines detected</span>
          </div>
          <textarea
            className="textarea code-input mt-2"
            rows={10}
            defaultValue={codeLines.join("\n")}
          />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900">Line preview</h3>
            <span className="status-pill">Student view</span>
          </div>
          <div className="preview-panel">
            <p className="text-sm text-slate-500 mb-4">Lines will be shuffled for students.</p>
            {[
              codeLines[3],
              codeLines[0],
              codeLines[5],
              codeLines[1],
              codeLines[6],
              codeLines[2],
              codeLines[4],
            ].map((line, i) => (
              <div className="preview-line" key={line}>
                <span>{i + 1}</span>
                <code>{line}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InstructorShell>
  );
}

function SessionSetup({ go }: { go: (screen: Screen) => void }) {
  const [rounds, setRounds] = useState([1, 2]);
  const [purpose, setPurpose] = useState("Activity");
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Set up session"
      subtitle="Choose the rules, then invite your class."
      actions={
        <>
          <Button variant="secondary" onClick={() => go("home")}>
            Save draft
          </Button>
          <Button onClick={() => go("lobby")}>
            Continue to lobby <Icon name="arrow" size={18} />
          </Button>
        </>
      }
    >
      <div className="setup-layout">
        <div className="space-y-5">
          <section className="card form-card">
            <div className="step-title">
              <span>1</span>
              <div>
                <h2>Session details</h2>
                <p>Name this activity and choose how it counts.</p>
              </div>
            </div>
            <label className="field-label mt-6">Session name</label>
            <input className="input" defaultValue="Java Arrays Review" />
            <label className="field-label mt-5">Purpose</label>
            <div className="segment">
              {["Quiz", "Activity", "Participation"].map((item) => (
                <button
                  className={purpose === item ? "active" : ""}
                  key={item}
                  onClick={() => setPurpose(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
          <section className="card form-card">
            <div className="step-title">
              <span>2</span>
              <div>
                <h2>Rounds</h2>
                <p>Each round can have different timing and rules.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {rounds.map((round) => (
                <RoundCard
                  key={round}
                  round={round}
                  remove={() => setRounds((r) => r.filter((x) => x !== round))}
                />
              ))}
            </div>
            <Button
              variant="secondary"
              icon="plus"
              className="mt-4 w-full justify-center"
              onClick={() => setRounds((r) => [...r, (r.at(-1) ?? 0) + 1])}
            >
              Add round
            </Button>
          </section>
        </div>
        <aside className="setup-summary card">
          <span className="eyebrow">Session summary</span>
          <h3>Java Arrays Review</h3>
          <div className="summary-row">
            <span>Purpose</span>
            <strong>{purpose}</strong>
          </div>
          <div className="summary-row">
            <span>Rounds</span>
            <strong>{rounds.length}</strong>
          </div>
          <div className="summary-row">
            <span>Questions</span>
            <strong>{rounds.length * 3}</strong>
          </div>
          <div className="summary-row">
            <span>Est. duration</span>
            <strong>{rounds.length * 6} min</strong>
          </div>
          <div className="summary-note">
            <Icon name="hint" size={19} />
            <p>You can change round settings during the live session.</p>
          </div>
        </aside>
      </div>
    </InstructorShell>
  );
}

function RoundCard({ round, remove }: { round: number; remove: () => void }) {
  const [open, setOpen] = useState(round === 1);
  const [music, setMusic] = useState(true);
  return (
    <div className="round-card">
      <button className="round-head" onClick={() => setOpen(!open)}>
        <span className="round-number">R{round}</span>
        <span>
          <strong>Round {round}</strong>
          <small>3 questions · 90 sec each</small>
        </span>
        <span className={open ? "rotate-90" : ""}>
          <Icon name="chevron" />
        </span>
      </button>
      {open && (
        <div className="round-content">
          <div className="question-select">
            <Icon name="book" size={18} />
            <span>
              <strong>3 questions selected</strong>
              <small>Sum an array, Find the largest value, FizzBuzz</small>
            </span>
            <button>Change</button>
          </div>
          <div className="settings-grid">
            <label>
              Time limit
              <select className="select">
                <option>90 seconds</option>
                <option>60 seconds</option>
              </select>
            </label>
            <label>
              Attempts
              <select className="select">
                <option>3 attempts</option>
                <option>Unlimited</option>
              </select>
            </label>
            <label>
              Wrong answer
              <select className="select">
                <option>5 sec cooldown</option>
                <option>-50 points</option>
              </select>
            </label>
            <label>
              On timeout
              <select className="select">
                <option>Reveal code</option>
                <option>Leave empty</option>
              </select>
            </label>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="music" size={18} /> Background music
            </span>
            <button className={`toggle ${music ? "on" : ""}`} onClick={() => setMusic(!music)}>
              <span />
            </button>
          </div>
          {round > 1 && (
            <button onClick={remove} className="mt-3 text-xs font-bold text-red-500">
              Remove round
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QRCode() {
  const cells = Array.from(
    { length: 121 },
    (_, i) => (i * 7 + Math.floor(i / 11) * 3 + i * i) % 5 < 2,
  );
  return (
    <div className="qr-code">
      {cells.map((dark, i) => (
        <i key={i} className={dark ? "dark" : ""} />
      ))}
    </div>
  );
}

function Lobby({ go }: { go: (screen: Screen) => void }) {
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Students, join the game!"
      subtitle="Java Arrays Review · Waiting for students"
    >
      <div className="lobby-grid">
        <div className="card join-panel">
          <div>
            <QRCode />
          </div>
          <div className="join-details">
            <span className="eyebrow">Join at</span>
            <div className="join-link">
              codeline.app/join{" "}
              <button>
                <Icon name="copy" size={18} />
              </button>
            </div>
            <span className="eyebrow mt-7">Game code</span>
            <div className="game-code">847 291</div>
            <p>Open CodeLine on any device, then enter the game code.</p>
          </div>
        </div>
        <div className="card roster-panel">
          <div className="roster-title">
            <span>
              <Icon name="people" />
              <strong>10 joined</strong>
            </span>
            <span className="live-dot">Live</span>
          </div>
          <div className="student-chips">
            {students.map(([name], i) => (
              <div className="student-chip" key={name}>
                <span style={{ background: ["#ddd6fe", "#bfdbfe", "#fed7aa", "#bbf7d0"][i % 4] }}>
                  {name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                {name}
                <Icon name="check" size={15} />
              </div>
            ))}
          </div>
          <div className="roster-footer">
            <span>
              <strong>CS101</strong>
              <small>10 of 42 students joined</small>
            </span>
            <Button icon="play" onClick={() => go("live")}>
              Start session
            </Button>
          </div>
        </div>
      </div>
    </InstructorShell>
  );
}

function CodeWorkspace({ student = false, placed = 4 }: { student?: boolean; placed?: number }) {
  return (
    <div className={`code-workspace ${student ? "student-code" : ""}`}>
      {codeLines.map((line, i) => (
        <div key={line} className={`code-slot ${i < placed ? "correct" : ""}`}>
          <span className="line-num">{i + 1}</span>
          {i < placed ? (
            <code>{line}</code>
          ) : (
            <span className="empty-line">
              {student ? "Drop a line here" : "Waiting for a correct line…"}
            </span>
          )}
          {i < placed && <Icon name="check" size={17} />}
        </div>
      ))}
    </div>
  );
}

function LiveGame({ go }: { go: (screen: Screen) => void }) {
  const [seconds, setSeconds] = useState(42);
  const [hint, setHint] = useState(false);
  return (
    <div className="live-screen">
      <header className="live-header">
        <Logo />
        <div className="round-badge">
          Round 1 of 2 <span>Question 2 of 3</span>
        </div>
        <div className="live-controls">
          <div className="timer">
            <Icon name="clock" />
            <strong>0:{String(seconds).padStart(2, "0")}</strong>
          </div>
          <Button variant="secondary" icon="plus" onClick={() => setSeconds(seconds + 15)}>
            Add time
          </Button>
          <Button variant="secondary" icon="hint" onClick={() => setHint(true)}>
            Send hint
          </Button>
          <Button variant="dark" onClick={() => go("results")}>
            Next round <Icon name="arrow" />
          </Button>
        </div>
      </header>
      {hint && (
        <div className="hint-banner">
          <Icon name="hint" size={18} /> Hint sent: Start by declaring a variable to store the
          total.
          <button onClick={() => setHint(false)}>
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
      <main className="live-grid">
        <section className="prompt-panel">
          <span className="eyebrow">Challenge</span>
          <h1>Sum the values in an array</h1>
          <p>Arrange the Java code to match the pseudocode.</p>
          <div className="pseudo-box">
            <span>Pseudocode</span>
            <ol>
              <li>Create a variable to hold the total</li>
              <li>Loop through each number</li>
              <li>Add it to the total</li>
              <li>Return the total</li>
            </ol>
          </div>
          <div className="class-progress">
            <span>
              <strong>24</strong> correct lines
            </span>
            <span>
              <strong>18</strong> students active
            </span>
          </div>
        </section>
        <section className="shared-panel">
          <div className="panel-label">
            <span>Shared code space</span>
            <span className="live-dot">Live</span>
          </div>
          <CodeWorkspace />
        </section>
        <aside className="leader-panel">
          <div className="panel-label">
            <span>
              <Icon name="trophy" size={18} /> Leaderboard
            </span>
            <span>Points</span>
          </div>
          {students.slice(0, 7).map(([name, score], i) => (
            <div className={`rank-row ${i < 3 ? "top" : ""}`} key={name}>
              <span className="rank">{i + 1}</span>
              <span className="mini-avatar">
                {name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <span>
                <strong>{name}</strong>
                <small>{i + 3} correct lines</small>
              </span>
              <b>{score}</b>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}

function Results({ go }: { go: (screen: Screen) => void }) {
  const [tab, setTab] = useState("This Round");
  const [revealed, setRevealed] = useState(false);
  return (
    <InstructorShell
      screen="home"
      go={go}
      title="Round complete!"
      subtitle="Great work. Here’s how the class performed."
      actions={
        <>
          <Button variant="secondary" onClick={() => setRevealed(!revealed)}>
            {revealed ? "Hide code" : "Reveal code"}
          </Button>
          <Button onClick={() => go("dashboard")}>
            Finish session <Icon name="arrow" />
          </Button>
        </>
      }
    >
      <div className="metric-grid">
        <Metric value="87%" label="Class accuracy" note="+6% vs. last round" color="green" />
        <Metric value="1:14" label="Average time" note="16 sec under limit" color="violet" />
        <Metric value="8,420" label="Points earned" note="Across 42 students" color="orange" />
        <Metric value="36/42" label="Completed" note="6 timed out" color="blue" />
      </div>
      <div className="results-grid mt-5">
        <section className="card">
          <div className="card-title-row">
            <div className="tabs">
              {["This Round", "All Rounds"].map((x) => (
                <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
                  {x}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">Points</span>
          </div>
          <div className="podium">
            {[students[1], students[0], students[2]].map(([name, score], i) => (
              <div className={`podium-person p${i}`} key={name}>
                <span className="podium-avatar">
                  {name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <strong>{name.split(" ")[0]}</strong>
                <b>{score}</b>
                <i>{i === 1 ? 1 : i === 0 ? 2 : 3}</i>
              </div>
            ))}
          </div>
          <div className="px-6 pb-4">
            {students.slice(3, 8).map(([name, score], i) => (
              <div className="simple-rank" key={name}>
                <span>{i + 4}</span>
                <strong>{name}</strong>
                <b>{score}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <div className="card-title-row">
            <h2>Question results</h2>
            <span>Accuracy</span>
          </div>
          <div className="question-results">
            {[
              ["Sum an array", 92, "39 correct"],
              ["Find the largest value", 81, "34 correct"],
              ["FizzBuzz", 76, "32 correct"],
            ].map(([name, pct, note], i) => (
              <button key={name} onClick={() => setRevealed(!revealed)}>
                <span className="q-number">0{i + 1}</span>
                <span>
                  <strong>{name}</strong>
                  <small>
                    {note} · {i + 4} timed out
                  </small>
                  <i>
                    <em style={{ width: `${pct}%` }} />
                  </i>
                </span>
                <b>{pct}%</b>
                <Icon name="chevron" size={17} />
              </button>
            ))}
          </div>
          {revealed && (
            <div className="revealed-code">
              <span>Correct solution</span>
              {codeLines.map((line) => (
                <code key={line}>{line}</code>
              ))}
            </div>
          )}
        </section>
      </div>
    </InstructorShell>
  );
}

function Metric({
  value,
  label,
  note,
  color,
}: {
  value: string;
  label: string;
  note: string;
  color: string;
}) {
  return (
    <div className="card metric">
      <span className={`metric-accent ${color}`} />
      <strong>{value}</strong>
      <b>{label}</b>
      <small>{note}</small>
    </div>
  );
}

function Dashboard({ go }: { go: (screen: Screen) => void }) {
  return (
    <InstructorShell
      screen="dashboard"
      go={go}
      title="Class dashboard"
      subtitle="Track progress across CS101 · Spring term"
      actions={
        <>
          <Button variant="secondary" icon="send">
            Send to department
          </Button>
          <Button icon="download">Export report</Button>
        </>
      }
    >
      <div className="metric-grid">
        <Metric value="42" label="Active students" note="98% participation" color="violet" />
        <Metric value="84%" label="Average accuracy" note="+4% this month" color="green" />
        <Metric value="12" label="Sessions completed" note="36 total rounds" color="blue" />
        <Metric value="6.4h" label="Practice time" note="Per student average" color="orange" />
      </div>
      <div className="card mt-5 overflow-hidden">
        <div className="dashboard-toolbar">
          <div>
            <h2>Student progress</h2>
            <p>Performance across all sessions</p>
          </div>
          <div className="search-box">
            <Icon name="search" size={18} />
            <input placeholder="Search students" />
          </div>
        </div>
        <div className="progress-table">
          <div className="progress-row head">
            <span>Student</span>
            <span>Sessions</span>
            <span>Accuracy</span>
            <span>Avg. score</span>
            <span>Trend</span>
          </div>
          {students.map(([name, score], i) => (
            <div className="progress-row" key={name}>
              <span>
                <i className="mini-avatar">
                  {name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </i>
                <strong>{name}</strong>
              </span>
              <span>{12 - (i % 3)}/12</span>
              <span>
                <b>{92 - i * 2}%</b>
                <i className="progress-bar">
                  <em style={{ width: `${92 - i * 2}%` }} />
                </i>
              </span>
              <span>{score}</span>
              <span className={i > 7 ? "trend down" : "trend"}>{i > 7 ? "↓ 2%" : "↑ 6%"}</span>
            </div>
          ))}
        </div>
      </div>
    </InstructorShell>
  );
}

function StudentShell({
  children,
  go,
  title,
  back,
  progress,
}: {
  children: ReactNode;
  go: (s: Screen) => void;
  title?: string;
  back?: Screen;
  progress?: boolean;
}) {
  return (
    <div className="student-page">
      <header className="student-header">
        {back ? (
          <button className="round-back" onClick={() => go(back)}>
            ‹
          </button>
        ) : (
          <Logo />
        )}
        {title && <strong>{title}</strong>}
        {progress ? (
          <button className="avatar" onClick={() => go("progress")}>
            MC
          </button>
        ) : (
          <span />
        )}
      </header>
      {children}
    </div>
  );
}

function Join({ go }: { go: (screen: Screen) => void }) {
  const [code, setCode] = useState("847291");
  return (
    <StudentShell go={go} progress>
      <main className="student-centered">
        <div className="student-illustration">
          <span>&lt;/&gt;</span>
          <i className="spark s1" />
          <i className="spark s2" />
          <i className="spark s3" />
        </div>
        <span className="eyebrow">Hi, Maya</span>
        <h1>Join your class</h1>
        <p>Enter the 6-digit code shown by your instructor.</p>
        <div className="code-entry">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              value={code[i] ?? ""}
              onChange={(e) => {
                const chars = code.split("");
                chars[i] = e.target.value.slice(-1);
                setCode(chars.join(""));
              }}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>
        <Button className="w-full justify-center mt-7" onClick={() => go("waiting")}>
          Join game <Icon name="arrow" />
        </Button>
        <button className="mt-7 text-sm font-bold text-slate-500" onClick={() => go("progress")}>
          View my progress
        </button>
      </main>
    </StudentShell>
  );
}

function Waiting({ go }: { go: (screen: Screen) => void }) {
  return (
    <StudentShell go={go} title="Java Arrays Review">
      <main className="waiting-screen">
        <div className="class-room-pill">
          <Icon name="book" size={16} />
          CS101 · Room 4A
        </div>
        <div className="waiting-animation">
          <span />
          <span />
          <span />
        </div>
        <span className="eyebrow">You’re in!</span>
        <h1>
          Waiting for Alex
          <br />
          to start the game
        </h1>
        <div className="waiting-card">
          <span className="avatar large">MC</span>
          <div>
            <strong>Maya Chen</strong>
            <small>Joined as student 10</small>
          </div>
          <Icon name="check" />
        </div>
        <div className="waiting-meta">
          <span>
            <Icon name="people" />
            10 joined
          </span>
          <span>
            <Icon name="clock" />
            Starting soon
          </span>
        </div>
        <Button variant="secondary" onClick={() => go("game")} className="mt-8">
          Preview game screen
        </Button>
      </main>
    </StudentShell>
  );
}

function StudentGame({ go }: { go: (screen: Screen) => void }) {
  const [placed, setPlaced] = useState(2);
  const [toast, setToast] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [attempts, setAttempts] = useState(3);
  const tray = [codeLines[5], codeLines[3], codeLines[2], codeLines[4], codeLines[6]];

  function tryLine(line: string) {
    if (line === codeLines[placed]) {
      setPlaced(Math.min(placed + 1, codeLines.length));
      setToast("correct");
    } else {
      setAttempts(Math.max(0, attempts - 1));
      setToast("wrong");
    }
    window.setTimeout(() => setToast(null), 2400);
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    tryLine(e.dataTransfer.getData("text/plain"));
  }
  return (
    <StudentShell go={go} title="Round 1 · Q2/3" progress>
      <main className="game-main">
        <div className="game-status">
          <span>
            <b>Sum an array</b>
            <small>Drag the next line into place</small>
          </span>
          <div className="game-status-actions">
            <span className="streak-chip">3 line streak</span>
            <span className="mobile-timer">
              <Icon name="clock" size={18} />
              0:42
            </span>
          </div>
        </div>
        <div
          className="round-progress"
          aria-label={`${placed} of ${codeLines.length} lines placed`}
        >
          <span style={{ width: `${(placed / codeLines.length) * 100}%` }} />
          <b>
            {placed}/{codeLines.length} lines
          </b>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={drop}>
          <CodeWorkspace student placed={placed} />
        </div>
        <div className="tray-head">
          <span>
            My lines <em>Tap or drag</em>
          </span>
          <small>{attempts} attempts left</small>
        </div>
        <div className="line-tray">
          {tray
            .filter((line) => !codeLines.slice(0, placed).includes(line))
            .map((line) => (
              <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", line)}
                onClick={() => tryLine(line)}
                key={line}
              >
                <span className="drag-grip">⠿</span>
                <code>{line}</code>
              </button>
            ))}
        </div>
        <button
          className="timeout-link"
          onClick={() => {
            setToast("timeout");
            window.setTimeout(() => go("leaderboard"), 1800);
          }}
        >
          End round & view leaderboard
        </button>
      </main>
      {toast && <FeedbackToast type={toast} attempts={attempts} />}
    </StudentShell>
  );
}

function FeedbackToast({
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

function StudentLeaderboard({ go }: { go: (screen: Screen) => void }) {
  const [tab, setTab] = useState("This Round");
  return (
    <StudentShell go={go} title="Leaderboard" progress>
      <main className="student-board">
        <div className="celebrate-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="eyebrow">Round complete</span>
        <h1>Nice work, Maya!</h1>
        <p>
          You placed <strong>2nd</strong> this round.
        </p>
        <div className="student-score">
          <span className="avatar large">MC</span>
          <div>
            <small>Your score</small>
            <strong>1,180</strong>
          </div>
          <b>+480</b>
        </div>
        <div className="tabs student-tabs">
          {["This Round", "All Rounds"].map((x) => (
            <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>
              {x}
            </button>
          ))}
        </div>
        <div className="mobile-ranks">
          {students.slice(0, 7).map(([name, score], i) => (
            <div className={name === "Maya Chen" ? "me" : ""} key={name}>
              <span className="rank">{i + 1}</span>
              <span className="mini-avatar">
                {name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <strong>
                {name}
                {name === "Maya Chen" && <small>You</small>}
              </strong>
              <b>{score}</b>
            </div>
          ))}
        </div>
        <Button onClick={() => go("progress")} className="w-full justify-center mt-5">
          View my progress
        </Button>
        <Button variant="ghost" onClick={() => go("join")} className="w-full justify-center mt-2">
          Back to join
        </Button>
      </main>
    </StudentShell>
  );
}

function StudentProgress({ go }: { go: (screen: Screen) => void }) {
  return (
    <StudentShell go={go} title="My progress" back="join">
      <main className="progress-main">
        <section className="profile-hero">
          <span className="avatar xl">MC</span>
          <h1>Maya Chen</h1>
          <p>CS101 · Spring term</p>
          <div>
            <span>
              <strong>8</strong>
              <small>Sessions</small>
            </span>
            <span>
              <strong>89%</strong>
              <small>Accuracy</small>
            </span>
            <span>
              <strong>#3</strong>
              <small>Class rank</small>
            </span>
          </div>
        </section>
        <h2>Past sessions</h2>
        <div className="past-sessions">
          {[
            ["Java Arrays Review", "Today", "1,180", "92%"],
            ["Loops & Iteration", "May 14", "1,040", "88%"],
            ["Methods Warm-up", "May 10", "960", "84%"],
            ["Conditionals", "May 6", "1,120", "91%"],
          ].map(([name, date, score, accuracy]) => (
            <div key={name}>
              <span className="session-icon">
                <Icon name="check" size={18} />
              </span>
              <span>
                <strong>{name}</strong>
                <small>
                  {date} · {accuracy} accuracy
                </small>
              </span>
              <b>
                {score}
                <small>points</small>
              </b>
            </div>
          ))}
        </div>
      </main>
    </StudentShell>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login-instructor");
  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  switch (screen) {
    case "login-instructor":
      return (
        <AuthLayout
          role="instructor"
          onSwitch={() => go("login-student")}
          onContinue={() => go("home")}
        />
      );
    case "home":
      return <Home go={go} />;
    case "questions":
      return <QuestionBank go={go} />;
    case "create-question":
      return <CreateQuestion go={go} />;
    case "setup":
      return <SessionSetup go={go} />;
    case "lobby":
      return <Lobby go={go} />;
    case "live":
      return <LiveGame go={go} />;
    case "results":
      return <Results go={go} />;
    case "dashboard":
      return <Dashboard go={go} />;
    case "login-student":
      return (
        <AuthLayout
          role="student"
          onSwitch={() => go("login-instructor")}
          onContinue={() => go("join")}
        />
      );
    case "join":
      return <Join go={go} />;
    case "waiting":
      return <Waiting go={go} />;
    case "game":
      return <StudentGame go={go} />;
    case "leaderboard":
      return <StudentLeaderboard go={go} />;
    case "progress":
      return <StudentProgress go={go} />;
  }
}
