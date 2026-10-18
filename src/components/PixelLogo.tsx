// PLACEHOLDER: simple pixel Z. Replace with your official Aseprite logo
// (export it to /public/logo.png and render it with `image-rendering: pixelated`).
const rows = ["1111111", "1111111", "0000110", "0001100", "0011000", "0110000", "1111111", "1111111"];

export default function PixelLogo({ size = 8 }: { size?: number }) {
  const cells = rows.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? { x, y } : null))).filter(Boolean) as { x: number; y: number }[];
  return (
    <svg width={8 * size} height={9 * size} viewBox="0 0 8 9" shapeRendering="crispEdges" role="img" aria-label="Zaza Games">
      {cells.map(({ x, y }) => <rect key={`s${x}-${y}`} x={x + 0.5} y={y + 1} width="1" height="1" fill="#000" />)}
      {cells.map(({ x, y }) => <rect key={`f${x}-${y}`} x={x} y={y} width="1" height="1" fill="#f5b800" />)}
    </svg>
  );
}
