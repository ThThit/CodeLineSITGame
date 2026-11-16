import type { ScreenProps } from "@/types/navigation";
import { Button } from "@/components/common/Button";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { codeLines, students, questions } from "@/data/mock";

export function CreateQuestion({ go }: ScreenProps) {
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
