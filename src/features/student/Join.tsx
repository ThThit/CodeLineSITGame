import { useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { StudentShell } from "@/components/layout/StudentShell";

export function Join({ go }: ScreenProps) {
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
