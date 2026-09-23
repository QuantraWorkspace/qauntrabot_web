import BlockHead from "@/components/shared/BlockHead";

/**
 * The six tracks are a genuine progression — macro before charts, risk before
 * automation — so they are numbered and drawn as a path rather than a grid.
 */
const TRACKS = [
  {
    n: "01",
    title: "Fundamentals",
    text: "Rates, inflation and growth, and the path each one takes before it shows up in price.",
    outcome: "Read a central bank statement and say what it argues for the dollar.",
  },
  {
    n: "02",
    title: "Technical analysis",
    text: "Structure, trend and levels, and how the same chart reads differently across timeframes.",
    outcome: "Mark a chart the same way twice, and defend where you drew each level.",
  },
  {
    n: "03",
    title: "Liquidity and order flow",
    text: "Where resting orders sit, why price reaches for them, and what the smart-money models are actually describing.",
    outcome: "Explain why price swept a high before reversing, instead of calling it manipulation.",
  },
  {
    n: "04",
    title: "Risk management",
    text: "Position sizing from stop distance, drawdown limits, and what a losing streak does to an account.",
    outcome: "Know your worst realistic week before you take the trade, not after.",
  },
  {
    n: "05",
    title: "Trading psychology",
    text: "Routine, decision-making under pressure, and the specific moments where discipline usually breaks.",
    outcome: "Follow your own plan on the day it is hardest to follow.",
  },
  {
    n: "06",
    title: "Algorithmic trading",
    text: "Turning a written rule set into something testable, then reading the backtest without flattering it.",
    outcome: "Express a strategy precisely enough that a machine can run it.",
  },
];

export default function EducationLadder() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="Six tracks, in this order"
          lede="Macro before charts, risk before automation. Each track assumes the one above it, which is why they are numbered."
        />
        <ol className="ladder">
          {TRACKS.map(({ n, title, text, outcome }) => (
            <li key={n} className="rung">
              <span className="rung-mark">{n}</span>
              <div className="min-w-0">
                <h3 className="rung-title">{title}</h3>
                <p className="rung-text">{text}</p>
              </div>
              <p className="rung-outcome">
                <b>After this track</b>
                {outcome}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
