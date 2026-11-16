import { type ReactNode } from "react";
import type { Screen, Navigate } from "@/types/navigation";
import { Logo } from "@/components/common/Logo";

export function StudentShell({
  children,
  go,
  title,
  back,
  progress,
}: {
  children: ReactNode;
  go: Navigate;
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
