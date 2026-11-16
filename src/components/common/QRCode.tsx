export function QRCode() {
  const cells = Array.from(
    { length: 121 },
    (_, i) => (i * 7 + Math.floor(i / 11) * 3 + i * i) % 5 < 2,
  );
  return (
    <div className="qr-code">
      {cells.map((dark, i) => (
        <i key={i} className={dark ? "dark" : ""} />
      ))}
    </div>
  );
}
