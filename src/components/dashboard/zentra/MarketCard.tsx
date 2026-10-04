import type { MarketAsset } from "@/lib/zentra/types";
import { formatPct, formatPrice } from "@/lib/zentra/format";

export function Sparkline({ points, tone, className = "" }: { points: number[]; tone: "up" | "down" | "flat"; className?: string }) {
  const w = 100;
  const h = 32;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / Math.max(points.length - 1, 1);
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)} ${(h - ((p - min) / range) * (h - 4) - 2).toFixed(2)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={`block w-full ${className}`} aria-hidden>
      <path
        d={line}
        fill="none"
        className="z-spark"
        data-tone={tone}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const BIAS_LABEL = { bullish: "Bullish", bearish: "Bearish", neutral: "Neutral" } as const;

export default function MarketCard({ asset }: { asset: MarketAsset }) {
  const tone = asset.changePct > 0 ? "up" : asset.changePct < 0 ? "down" : "flat";
  return (
    <div className="z-market">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="z-market-symbol">{asset.symbol}</p>
          <p className="z-meta truncate">{asset.name}</p>
        </div>
        <span className="z-bias" data-bias={asset.bias}>
          {BIAS_LABEL[asset.bias]}
        </span>
      </div>
      <Sparkline points={asset.history} tone={tone} className="h-8 my-1" />
      <div className="flex items-baseline justify-between gap-2">
        <span className="z-market-price">{formatPrice(asset.price, asset.digits)}</span>
        <span className="z-change" data-tone={tone}>
          {formatPct(asset.changePct)}
        </span>
      </div>
    </div>
  );
}
