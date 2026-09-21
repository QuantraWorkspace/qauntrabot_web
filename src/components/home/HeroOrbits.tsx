const ORBITS = [
  { rx: 520, ry: 190, rot: -18, o: 0.95, orbs: [{ c: "#8FF0C4", d: 22, b: 0 }, { c: "#6EA8FF", d: 22, b: -11 }] },
  { rx: 560, ry: 230, rot: 12, o: 0.8, orbs: [{ c: "#FFFFFF", d: 30, b: -7 }] },
  { rx: 480, ry: 260, rot: 38, o: 0.7, orbs: [{ c: "#6EA8FF", d: 26, b: -4 }, { c: "#8FF0C4", d: 26, b: -17 }] },
  { rx: 600, ry: 170, rot: -42, o: 0.65, orbs: [{ c: "#8FF0C4", d: 34, b: -20 }] },
  { rx: 440, ry: 300, rot: 70, o: 0.6, orbs: [{ c: "#FFFFFF", d: 28, b: -13 }] },
  { rx: 580, ry: 120, rot: 4, o: 0.5, orbs: [{ c: "#6EA8FF", d: 36, b: -9 }] },
  { rx: 500, ry: 330, rot: -65, o: 0.45, orbs: [{ c: "#8FF0C4", d: 40, b: -25 }] },
];

const CX = 700;
const CY = 380;

function ellipsePath(rx: number, ry: number) {
  return `M ${CX - rx} ${CY} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
}

/** Decorative glowing orbit lines with orbs travelling along them — purely visual. */
export default function HeroOrbits() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 w-[120rem] max-w-none opacity-50">
        <svg viewBox="0 0 1400 700" className="w-full h-auto" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3ECF8E" stopOpacity="0" />
              <stop offset="35%" stopColor="#3ECF8E" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#6EA8FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6EA8FF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="orbit-fade" cx="50%" cy="50%" r="62%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="orbit-mask">
              <rect width="1400" height="700" fill="url(#orbit-fade)" />
            </mask>
            <filter id="orbit-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="orb-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          <g mask="url(#orbit-mask)">
            {ORBITS.map(({ rx, ry, rot, o, orbs }, i) => (
              <g key={i} transform={`rotate(${rot} ${CX} ${CY})`}>
                <path
                  id={`orbit-${i}`}
                  d={ellipsePath(rx, ry)}
                  fill="none"
                  stroke="url(#orbit-stroke)"
                  strokeWidth="1.5"
                  opacity={o}
                  filter="url(#orbit-glow)"
                />
                {orbs.map(({ c, d, b }, j) => (
                  <g key={j} className="hero-orb">
                    <circle r="14" fill={c} opacity="0.5" filter="url(#orb-glow)">
                      <animateMotion dur={`${d}s`} begin={`${b}s`} repeatCount="indefinite">
                        <mpath href={`#orbit-${i}`} />
                      </animateMotion>
                    </circle>
                    <circle r="3.4" fill={c}>
                      <animateMotion dur={`${d}s`} begin={`${b}s`} repeatCount="indefinite">
                        <mpath href={`#orbit-${i}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div
        className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 h-[36rem] w-[36rem] rounded-full hero-core"
        style={{
          background:
            "radial-gradient(closest-side, rgba(62,207,142,0.16), rgba(62,207,142,0.04) 55%, transparent 75%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
