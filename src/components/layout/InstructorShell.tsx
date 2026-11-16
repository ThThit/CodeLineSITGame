import { type ReactNode } from "react";
import type { Screen, Navigate } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Logo } from "@/components/common/Logo";
import { questions } from "@/data/mock";
import { Home } from "@/features/instructor/Home";
import { Dashboard } from "@/features/instructor/Dashboard";

export function InstructorShell({
  screen,
  go,
  children,
  title,
  subtitle,
  actions,
}: {
  screen: Screen;
  go: Navigate;
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
