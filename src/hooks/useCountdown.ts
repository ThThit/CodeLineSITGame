import { useEffect, useState } from "react";

/** Counts down once per second while `running`; `add` extends the time (FR-I8 "add time"). */
export function useCountdown(initialSeconds: number, running = true) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, seconds]);
  return { seconds, add: (extra: number) => setSeconds((s) => s + extra) };
}
