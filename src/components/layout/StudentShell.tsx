import { type ReactNode } from "react";
import type { Screen, Navigate } from "@/types/navigation";
import { Logo } from "@/components/common/Logo";
import { Icon } from "@/components/common/Icon";
import { initials } from "@/lib/format";
import { me } from "@/data/mock";

/** Phone-first frame for every student screen: cream paper, logo or back, avatar. */
export function StudentShell({
  children,
  go,
  title,
  back,
  progress,
  wide = false,
}: {
  children: ReactNode;
  go: Navigate;
  title?: string;
  back?: Screen;
  progress?: boolean;
  /** Let the page grow to a desktop layout on wide screens (phones look the same). */
  wide?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-cream font-sans text-ink">
      <div
        className={`relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 pb-6 pt-5 sm:px-5 ${
          wide ? "lg:max-w-[1280px] lg:px-8" : ""
        }`}
      >
        <header className="relative z-10 flex items-center justify-between gap-3">
          {back ? (
            <button
              type="button"
              aria-label="Back"
              onClick={() => go(back)}
              className="flex size-11 items-center justify-center rounded-full border-[3px] border-ink bg-white"
            >
              <span className="rotate-180">
                <Icon name="chevron" size={20} />
              </span>
            </button>
          ) : (
            <Logo compact={Boolean(title)} />
          )}
          {title && (
            <strong className="truncate text-sm font-extrabold uppercase tracking-[0.12em] text-soft">
              {title}
            </strong>
          )}
          {progress ? (
            <button
              type="button"
              aria-label="My progress"
              onClick={() => go("progress")}
              className="flex size-11 items-center justify-center rounded-full border-[3px] border-ink bg-lilac text-[15px] font-extrabold"
            >
              {initials(me.name)}
            </button>
          ) : (
            <span className="size-11" />
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
