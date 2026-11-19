import { useEffect, useRef, useState } from "react";
import { pages, type Navigate, type Screen } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";

/**
 * Floating button (bottom-right) that lists every page so a developer or
 * reviewer can jump straight to any screen of the demo.
 */
export function PageNavigator({ current, go }: { current: Screen; go: Navigate }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const groups = ["Instructor", "Student"] as const;

  return (
    <div
      ref={root}
      className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 font-sans text-ink"
    >
      {open && (
        <nav
          id="page-navigator"
          aria-label="All pages"
          className="max-h-[min(70vh,560px)] w-[min(calc(100vw-32px),340px)] overflow-y-auto rounded-[22px] border-[3px] border-ink bg-white p-3 shadow-pop-lg"
        >
          <p className="px-2 pb-2 pt-1 font-display text-lg font-bold">Jump to a page</p>
          {(
            [
              ["demo", "Demo index", "dashboard"],
              ["login", "Sign in", "logout"],
            ] as const
          ).map(([target, label, icon]) => (
            <button
              key={target}
              type="button"
              aria-current={current === target ? "page" : undefined}
              onClick={() => {
                go(target);
                setOpen(false);
              }}
              className={`mb-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left font-extrabold transition-colors ${
                current === target ? "bg-sun" : "hover:bg-paper"
              }`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink text-cream">
                <Icon name={icon} size={14} />
              </span>
              <span className="flex-1">{label}</span>
              <span className="font-mono text-xs text-soft">#{target}</span>
            </button>
          ))}
          {groups.map((group) => (
            <div key={group} className="mb-2 last:mb-0">
              <p className="px-2 pb-1 pt-2 text-xs font-extrabold uppercase tracking-[0.12em] text-soft">
                {group}
              </p>
              <ul className="flex flex-col gap-1">
                {pages
                  .filter((p) => p.group === group)
                  .map((p) => {
                    const active = p.screen === current;
                    return (
                      <li key={p.screen}>
                        <button
                          type="button"
                          aria-current={active ? "page" : undefined}
                          onClick={() => {
                            go(p.screen);
                            setOpen(false);
                          }}
                          className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left font-bold transition-colors ${
                            active ? "bg-sun" : "hover:bg-paper"
                          }`}
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-xs font-extrabold">
                            {p.wireframe}
                          </span>
                          <span className="flex-1">{p.label}</span>
                          <span className="font-mono text-xs text-soft">#{p.screen}</span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      )}
      <button
        ref={toggle}
        type="button"
        aria-label={open ? "Close page list" : "Open page list"}
        aria-expanded={open}
        aria-controls="page-navigator"
        onClick={() => setOpen((o) => !o)}
        className="flex size-14 items-center justify-center rounded-full border-[3px] border-ink bg-primary shadow-pop transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        <Icon name={open ? "x" : "menu"} size={24} />
      </button>
    </div>
  );
}
