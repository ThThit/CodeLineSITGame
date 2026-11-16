import { useMemo, useState } from "react";
import { initials } from "@/lib/format";
import type { ScreenProps } from "@/types/navigation";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/common/Button";
import { Metric } from "@/components/common/Metric";
import { Notice } from "@/components/common/Notice";
import { InstructorShell } from "@/components/layout/InstructorShell";
import { students } from "@/data/mock";

type Row = { name: string; sessions: number; accuracy: number; score: number; trend: number };
type SortKey = keyof Row;

const rows: Row[] = students.map(([name, score], i) => ({
  name,
  sessions: 12 - (i % 3),
  accuracy: 92 - i * 2,
  score,
  trend: i > 7 ? -2 : 6 - (i % 4),
}));

const columns: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "name", label: "Student" },
  { key: "sessions", label: "Sessions", numeric: true },
  { key: "accuracy", label: "Accuracy", numeric: true },
  { key: "score", label: "Avg. score", numeric: true },
  { key: "trend", label: "Trend", numeric: true },
];

function downloadCsv(data: Row[]) {
  const header = "Student,Sessions attended,Accuracy %,Average score,Trend %";
  const lines = data.map((r) =>
    [`"${r.name}"`, `${r.sessions}/12`, r.accuracy, r.score, r.trend].join(","),
  );
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: "cs101-progress.csv",
  });
  a.click();
  URL.revokeObjectURL(url);
}

/** Screen 9 / FR-I10: class progress across sessions, with export. */
export function Dashboard({ go }: ScreenProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "score", dir: -1 });
  const [notice, setNotice] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => !q || r.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        return (
          (typeof x === "string" ? x.localeCompare(y as string) : x - (y as number)) * sort.dir
        );
      });
  }, [query, sort]);

  const sortBy = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "name" ? 1 : -1 },
    );

  return (
    <InstructorShell
      screen="dashboard"
      go={go}
      title="Class dashboard"
      subtitle="CS101 · Spring term · all sessions"
      actions={
        <>
          <Button
            icon="download"
            onClick={() => {
              downloadCsv(shown);
              setNotice(`Exported ${shown.length} students to cs101-progress.csv.`);
            }}
          >
            Export CSV
          </Button>
        </>
      }
    >
      <div className="metric-grid">
        <Metric value="42" label="Active students" note="98% participation" color="violet" />
        <Metric value="84%" label="Average accuracy" note="+4% this month" color="green" />
        <Metric value="12" label="Sessions completed" note="36 rounds in total" color="blue" />
        <Metric value="6.4h" label="Practice time" note="Average per student" color="orange" />
      </div>

      <section className="card mt-5" aria-labelledby="progress-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="progress-title" className="text-lg font-extrabold">
              Student progress
            </h2>
            <p className="text-sm font-bold text-soft">Click a column heading to sort.</p>
          </div>
          <label className="w-full sm:w-72">
            <span className="sr-only">Search students</span>
            <span className="search-box">
              <Icon name="search" size={18} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students"
              />
            </span>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line">
                {columns.map((c) => {
                  const active = sort.key === c.key;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                      className="px-5 py-2"
                    >
                      <button
                        type="button"
                        onClick={() => sortBy(c.key)}
                        className={`flex min-h-9 items-center gap-1 text-xs font-extrabold uppercase tracking-[0.08em] ${
                          active ? "text-ink" : "text-soft hover:text-ink"
                        }`}
                      >
                        {c.label}
                        <span aria-hidden="true" className="w-3">
                          {active ? (sort.dir === 1 ? "▲" : "▼") : ""}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.name} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-3">
                      <span className="mini-avatar" aria-hidden="true">
                        {initials(r.name)}
                      </span>
                      <strong className="font-extrabold">{r.name}</strong>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-bold">{r.sessions}/12</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-3">
                      <b className="w-10 text-sm">{r.accuracy}%</b>
                      <span
                        className="h-2 w-24 overflow-hidden rounded-full bg-line"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-full rounded-full bg-mint-ink"
                          style={{ width: `${r.accuracy}%` }}
                        />
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-bold">{r.score.toLocaleString()}</td>
                  <td
                    className={`px-5 py-3 text-sm font-extrabold ${r.trend < 0 ? "text-primary-text" : "text-mint-ink"}`}
                  >
                    {r.trend < 0 ? "↓" : "↑"} {Math.abs(r.trend)}%
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-10 text-center font-bold text-soft"
                  >
                    No students match “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {notice && <Notice message={notice} onClose={() => setNotice(null)} />}
    </InstructorShell>
  );
}
