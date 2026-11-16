import { type ReactNode } from "react";
import type { Screen, Navigate } from "@/types/navigation";
import { Icon, type IconName } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";

const tabs: readonly { target: Screen; label: string; icon: IconName }[] = [
  { target: "home", label: "Home", icon: "home" },
  { target: "questions", label: "Question Bank", icon: "book" },
  { target: "dashboard", label: "Dashboard", icon: "dashboard" },
];

/** Instructor page frame: top bar with logo, three tab buttons and profile, then the page heading. */
export function InstructorShell({
  screen,
  go,
  children,
  title,
  subtitle,
  actions,
}: {
  /** Which tab is highlighted (sub-pages pass their parent tab). */
  screen: Screen;
  go: Navigate;
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="instructor-ui min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 border-b border-[var(--line-strong)] bg-white">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-[clamp(24px,4vw,56px)]">
          <button type="button" aria-label="CodeLine home" onClick={() => go("home")}>
            <Logo />
          </button>

          <nav
            aria-label="Instructor"
            className="order-last w-full md:order-none md:mx-auto md:w-auto"
          >
            <ul className="flex gap-1 rounded-xl border border-[var(--line-strong)] bg-cream p-1">
              {tabs.map(({ target, label, icon }) => {
                const active = screen === target;
                return (
                  <li key={target} className="flex-1 md:flex-none">
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => go(target)}
                      className={`flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-[15px] font-extrabold transition-colors sm:px-4 ${
                        active ? "bg-ink text-cream" : "text-ink hover:bg-paper"
                      }`}
                    >
                      <Icon name={icon} size={18} />
                      <span className="max-sm:sr-only">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <span className="hidden text-right leading-tight lg:block">
              <strong className="block text-sm font-extrabold">Alex Morgan</strong>
              <span className="text-xs font-bold text-soft">Instructor</span>
            </span>
            <span className="avatar" aria-hidden="true">
              AM
            </span>
          </div>
        </div>
      </header>

      <div className="page-head mx-auto max-w-[1380px]">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <main className="page-body">{children}</main>
    </div>
  );
}
