type MiniChartProps = {
  points: number[];
  tone?: "up" | "down" | "flat";
  className?: string;
  /** Unique id suffix so gradients don't collide when rendered multiple times. */
  id: string;
};

const TONE: Record<NonNullable<MiniChartProps["tone"]>, string> = {
  up: "var(--profit)",
  down: "var(--loss)",
  flat: "var(--foreground)",
};

/** Illustrative sparkline for UI mockups — values are not market data. */
export default function MiniChart({ points, tone = "up", className = "", id }: MiniChartProps) {
  const w = 100;
  const h = 40;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 6) - 3] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  const [lastX, lastY] = coords[coords.length - 1];
  const stroke = TONE[tone];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`mc-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#mc-fill-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
      />
      <circle cx={lastX} cy={lastY} r="1.8" fill={stroke} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
