/**
 * Zentra mark: two levels with the move between them, which is also the letter Z.
 * Drawn in `currentColor` so it takes the colour of wherever it sits — the old
 * PNG needed `filter: brightness(0) invert(1)` to go white.
 */

type MarkProps = {
  /** Rendered size in px. The mark is optically centred in a square box. */
  size?: number;
  className?: string;
};

export function ZentraMark({ size = 26, className = "" }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <path d="M5.5 7.5H26.5" />
        <path d="M23.5 7.5L8.5 24.5" />
        <path d="M5.5 24.5H26.5" />
      </g>
    </svg>
  );
}

type WordmarkProps = {
  /** Second line under the name, e.g. the positioning line in the top nav. */
  tagline?: string;
  taglineClassName?: string;
  size?: number;
  nameClassName?: string;
  markClassName?: string;
};

export function ZentraWordmark({
  tagline,
  taglineClassName = "",
  size = 26,
  nameClassName = "text-[0.8125rem] font-bold text-foreground",
  markClassName = "",
}: WordmarkProps) {
  return (
    <>
      <ZentraMark size={size} className={`shrink-0 ${markClassName}`} />
      <span className="flex flex-col leading-none">
        <span className={nameClassName}>Zentra</span>
        {tagline && <span className={taglineClassName}>{tagline}</span>}
      </span>
    </>
  );
}
