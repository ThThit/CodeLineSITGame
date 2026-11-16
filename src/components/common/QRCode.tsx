const SIZE = 11;

/** Decorative stand-in until a real QR encoder is wired to the join link. */
export function QRCode({
  label = "QR code that opens the join page",
  className = "size-[220px] sm:size-[260px]",
}: {
  label?: string;
  /** Size classes. */
  className?: string;
}) {
  const inFinder = (r: number, c: number) =>
    [
      [0, 0],
      [0, SIZE - 3],
      [SIZE - 3, 0],
    ].some(([r0, c0]) => r >= r0 && r < r0 + 3 && c >= c0 && c < c0 + 3);
  const cells = Array.from({ length: SIZE * SIZE }, (_, i) => {
    const r = Math.floor(i / SIZE);
    const c = i % SIZE;
    return inFinder(r, c) || (i * 7 + r * 3 + i * i) % 5 < 2;
  });
  return (
    <div
      role="img"
      aria-label={label}
      className={`grid shrink-0 -rotate-2 grid-cols-11 gap-[3px] rounded-[22px] border-[3px] border-ink bg-white p-4 ${className}`}
    >
      {cells.map((dark, i) => (
        <span key={i} className={`rounded-[4px] ${dark ? "bg-ink" : "bg-white"}`} />
      ))}
    </div>
  );
}
