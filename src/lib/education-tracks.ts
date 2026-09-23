export type EducationTrack = {
  n: string;
  title: string;
  /** What the track covers. */
  text: string;
  /** What you can do once you have finished it. */
  outcome: string;
};

/**
 * The single source for the curriculum. The homepage summary and the /education
 * ladder both read from here — they previously held separate copies, which had
 * already drifted apart on three of the six titles.
 *
 * The order is a real progression (macro before charts, risk before
 * automation), which is why these are numbered.
 */
export const EDUCATION_TRACKS: EducationTrack[] = [
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
