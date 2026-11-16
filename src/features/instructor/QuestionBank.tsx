import { useState } from "react";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { questions } from "@/data/mock";

export function QuestionBank({ go }: ScreenProps) {
  const [query, setQuery] = useState("");
  const filtered = questions.filter((q) => q[0].toLowerCase().includes(query.toLowerCase()));
  return (
    <InstructorShell
      screen="questions"
      go={go}
      title="Question Bank"
      subtitle="Create and manage reusable Java challenges."
      actions={
        <Button icon="plus" onClick={() => go("create-question")}>
          New question
        </Button>
      }
    >
      <div className="toolbar card">
        <div className="search-box">
          <Icon name="search" size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
          />
        </div>
        <select className="select">
          <option>All topics</option>
          <option>Arrays</option>
          <option>Loops</option>
        </select>
        <select className="select">
          <option>Last updated</option>
          <option>Title</option>
        </select>
      </div>
      <div className="card mt-4 overflow-hidden">
        <div className="table-head question-row">
          <span>Question</span>
          <span>Lines</span>
          <span>Updated</span>
          <span></span>
        </div>
        {filtered.map((q) => (
          <div className="question-row" key={q[0]}>
            <span>
              <strong>{q[0]}</strong>
              <small>{q[1]}</small>
            </span>
            <span className="muted-cell">{q[2]}</span>
            <span className="muted-cell">{q[3]}</span>
            <span className="row-actions">
              <button title="Edit" onClick={() => go("create-question")}>
                <Icon name="edit" size={17} />
              </button>
              <button title="Duplicate">
                <Icon name="copy" size={17} />
              </button>
              <button title="Delete">
                <Icon name="trash" size={17} />
              </button>
            </span>
          </div>
        ))}
      </div>
    </InstructorShell>
  );
}
