import { useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";

/** Small status bar for confirmations ("Question deleted · Undo"). Auto-hides after 6 s. */
export function Notice({
  message,
  action,
  onClose,
}: {
  message: string;
  action?: { label: string; onClick: () => void };
  onClose: () => void;
}) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const id = window.setTimeout(() => close.current(), 6000);
    return () => window.clearTimeout(id);
  }, [message]);
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 flex w-[min(calc(100vw-32px),480px)] -translate-x-1/2 items-center gap-3 rounded-xl bg-ink py-2 pl-4 pr-2 text-sm font-bold text-cream shadow-lg"
    >
      <span className="flex-1">{message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            onClose();
          }}
          className="min-h-9 rounded-lg px-3 font-extrabold text-sun underline-offset-4 hover:underline"
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="flex size-9 items-center justify-center rounded-lg hover:bg-night"
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
