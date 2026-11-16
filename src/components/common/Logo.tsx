export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="logo-mark">
        <span>&lt;/&gt;</span>
      </div>
      {!compact && (
        <span className="text-[20px] font-extrabold tracking-[-.04em] text-slate-950">
          CodeLine
        </span>
      )}
    </div>
  );
}
