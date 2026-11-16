import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Button } from "@/components/common/Button";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { splitCode } from "@/lib/game";
import { questionStore } from "@/data/questionStore";

/** Stable "shuffle" for the preview so it doesn't jump around while typing. */
function previewOrder(texts: string[]) {
  const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return texts.map((text, i) => ({ text, i, k: hash(text + i) })).sort((a, b) => a.k - b.k);
}

/** Screens 4 / FR-I2–I3: create or edit a question and preview how it splits into lines. */
export function CreateQuestion({ go }: ScreenProps) {
  const editing = useMemo(() => questionStore.editing(), []);
  const [title, setTitle] = useState(editing?.title ?? "");
  const [topics, setTopics] = useState(editing?.topics.join(", ") ?? "");
  const [pseudocode, setPseudocode] = useState(editing?.pseudocode ?? "");
  const [code, setCode] = useState(editing?.code ?? "");
  const [shuffled, setShuffled] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const lines = splitCode(code);
  const repeated = lines.length - new Set(lines.map((l) => l.text.trim())).size;
  const errors = {
    title: title.trim() ? "" : "Give the question a title.",
    code: lines.length >= 2 ? "" : "Paste at least 2 lines of code.",
  };
  const valid = !errors.title && !errors.code;
  const dirty =
    title !== (editing?.title ?? "") ||
    topics !== (editing?.topics.join(", ") ?? "") ||
    pseudocode !== (editing?.pseudocode ?? "") ||
    code !== (editing?.code ?? "");

  function save(e?: FormEvent) {
    e?.preventDefault();
    setSubmitted(true);
    if (!valid) return;
    questionStore.save(
      {
        title: title.trim(),
        topics: topics
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        pseudocode: pseudocode.trim(),
        code: code.replace(/\s+$/, ""),
      },
      editing?.id,
    );
    questionStore.startEdit(null);
    go("questions");
  }

  function cancel() {
    if (dirty && !window.confirm("Discard your changes to this question?")) return;
    questionStore.startEdit(null);
    go("questions");
  }

  const shown = shuffled
    ? previewOrder(lines.map((l) => l.text))
    : lines.map((l) => ({ text: l.text, i: l.index }));

  return (
    <InstructorShell
      screen="questions"
      go={go}
      title={editing ? "Edit question" : "New question"}
      subtitle="Students get these lines shuffled and put them back in order."
    >
      <div className="editor-grid">
        <form className="card form-card flex flex-col gap-5" onSubmit={save} noValidate>
          <Field id="q-title" label="Title" error={submitted ? errors.title : ""}>
            <input
              id="q-title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sum the values in an array"
              aria-invalid={submitted && !!errors.title}
            />
          </Field>
          <Field id="q-topics" label="Topics" hint="Separate with commas, used for filtering">
            <input
              id="q-topics"
              className="input"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Arrays, Loops"
            />
          </Field>
          <Field id="q-pseudo" label="Pseudocode" hint="Shown to students during the round">
            <textarea
              id="q-pseudo"
              className="textarea"
              rows={5}
              value={pseudocode}
              onChange={(e) => setPseudocode(e.target.value)}
              placeholder={"Create a variable to hold the total\nLoop through each number…"}
            />
          </Field>
          <Field
            id="q-code"
            label="Java code"
            hint={`One statement per line · ${lines.length} ${lines.length === 1 ? "line" : "lines"} detected`}
            error={submitted ? errors.code : ""}
          >
            <textarea
              id="q-code"
              className="textarea code-input"
              rows={11}
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the correct program here"
              aria-invalid={submitted && !!errors.code}
            />
          </Field>
          <button type="submit" className="sr-only">
            Save
          </button>
        </form>

        <section aria-labelledby="preview-title">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="preview-title" className="text-base font-extrabold">
              Line preview
            </h2>
            <div className="segment mt-0! grid-cols-2!" role="group" aria-label="Preview order">
              <button
                type="button"
                className={shuffled ? "active" : ""}
                aria-pressed={shuffled}
                onClick={() => setShuffled(true)}
              >
                Shuffled
              </button>
              <button
                type="button"
                className={!shuffled ? "active" : ""}
                aria-pressed={!shuffled}
                onClick={() => setShuffled(false)}
              >
                Correct order
              </button>
            </div>
          </div>
          <div className="preview-panel">
            {lines.length === 0 ? (
              <p className="py-8 text-center text-sm">
                Paste code on the left to see the lines here.
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {shown.map(({ text, i }) => (
                  <li className="preview-line" key={`${i}-${text}`}>
                    <span>{i + 1}</span>
                    <code>{text.trim()}</code>
                  </li>
                ))}
              </ol>
            )}
          </div>
          {repeated > 0 && (
            <p className="mt-3 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-soft">
              {repeated} {repeated === 1 ? "line repeats" : "lines repeat"} (for example a closing
              brace). Students may place identical lines in either spot.
            </p>
          )}
          <p className="mt-3 text-sm font-bold text-soft">
            Numbers show each line’s correct position.
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5">
        <Button variant="secondary" onClick={cancel}>
          Cancel
        </Button>
        <Button onClick={() => save()}>{editing ? "Save changes" : "Save question"}</Button>
      </div>
    </InstructorShell>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="field-label m-0">
          {label}
        </label>
        {hint && <span className="text-xs font-bold text-soft">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-sm font-bold text-[#b42318]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
