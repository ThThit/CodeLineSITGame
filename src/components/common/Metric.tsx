export function Metric({
  value,
  label,
  note,
  color,
}: {
  value: string;
  label: string;
  note: string;
  color: string;
}) {
  return (
    <div className="card metric">
      <span className={`metric-accent ${color}`} />
      <strong>{value}</strong>
      <b>{label}</b>
      <small>{note}</small>
    </div>
  );
}
