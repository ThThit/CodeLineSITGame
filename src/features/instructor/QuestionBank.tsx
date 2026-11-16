import { useMemo, useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Notice } from "@/components/common/Notice";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { lineCount, questionStore, relativeDate, useQuestions } from "@/data/questionStore";

type Sort = "updated" | "title" | "lines";

/** Screen 3 / FR-I4: search, filter, edit, duplicate and delete saved questions. */
export function QuestionBank({ go }: ScreenProps) {
  const questions = useQuestions();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [notice, setNotice] = useState<{ message: string; undo?: () => void } | null>(null);

  const topics = useMemo(
    () => [...new Set(questions.flatMap((q) => q.topics))].sort(),
    [questions],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions
      .filter((x) => topic === "all" || x.topics.includes(topic))
      .filter(
        (x) =>
          !q ||
          x.title.toLowerCase().includes(q) ||
          x.topics.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) =>
        sort === "title"
          ? a.title.localeCompare(b.title)
          : sort === "lines"
            ? lineCount(a.code) - lineCount(b.code)
            : b.updatedAt - a.updatedAt,
      );
  }, [questions, query, topic, sort]);

  const filtering = query !== "" || topic !== "all";

  function edit(id: string | null) {
    questionStore.startEdit(id);
    go("create-question");
  }

  return (
    <InstructorShell
      screen="questions"
      go={go}
      title="Question Bank"
      subtitle="Reusable line-ordering challenges for your sessions."
      actions={
        <Button icon="plus" onClick={() => edit(null)}>
          New question
        </Button>
      }
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="field-label m-0">Search</span>
          <span className="search-box">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title or topic"
            />
          </span>
        </label>
        <label className="flex w-full flex-col gap-1.5 sm:w-48">
          <span className="field-label m-0">Topic</span>
          <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex w-full flex-col gap-1.5 sm:w-48">
          <span className="field-label m-0">Sort by</span>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="updated">Last updated</option>
            <option value="title">Title (A–Z)</option>
            <option value="lines">Number of lines</option>
          </select>
        </label>
      </div>

      <p className="mt-5 text-sm font-bold text-soft" aria-live="polite">
        {shown.length} of {questions.length} questions
      </p>

      <div className="card mt-2 overflow-x-auto">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <p className="font-extrabold">No questions match.</p>
            {filtering && (
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setTopic("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line text-xs font-extrabold uppercase tracking-[0.08em] text-soft">
                <th scope="col" className="px-5 py-3">
                  Question
                </th>
                <th scope="col" className="w-24 px-3 py-3">
                  Lines
                </th>
                <th scope="col" className="w-36 px-3 py-3">
                  Updated
                </th>
                <th scope="col" className="w-36 px-5 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((q) => (
                <tr key={q.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => edit(q.id)}
                      className="text-left font-extrabold underline-offset-4 hover:underline"
                    >
                      {q.title}
                    </button>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {q.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-cream px-2 py-0.5 text-xs font-bold text-soft"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-bold">{lineCount(q.code)}</td>
                  <td className="px-3 py-3 text-sm font-bold text-soft">
                    {relativeDate(q.updatedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <IconAction
                        icon="edit"
                        label={`Edit ${q.title}`}
                        onClick={() => edit(q.id)}
                      />
                      <IconAction
                        icon="copy"
                        label={`Duplicate ${q.title}`}
                        onClick={() => {
                          questionStore.duplicate(q.id);
                          setNotice({ message: `Duplicated “${q.title}”.` });
                        }}
                      />
                      <IconAction
                        icon="trash"
                        label={`Delete ${q.title}`}
                        danger
                        onClick={() => {
                          const undo = questionStore.remove(q.id);
                          setNotice({ message: `Deleted “${q.title}”.`, undo });
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {notice && (
        <Notice
          message={notice.message}
          action={notice.undo ? { label: "Undo", onClick: notice.undo } : undefined}
          onClose={() => setNotice(null)}
        />
      )}
    </InstructorShell>
  );
}

function IconAction({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: "edit" | "copy" | "trash";
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex size-10 items-center justify-center rounded-lg border border-line bg-white transition-colors ${
        danger ? "text-[#b42318] hover:border-[#b42318] hover:bg-[#fef3f2]" : "hover:border-ink"
      }`}
    >
      <Icon name={icon} size={17} />
    </button>
  );
}
