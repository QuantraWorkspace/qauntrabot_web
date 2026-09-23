import BlockHead from "@/components/shared/BlockHead";

const EXECUTION: [string, string][] = [
  ["Platform", "MetaTrader 5"],
  ["Instrument", "XAUUSD"],
  ["Timeframe", "M15"],
  ["Sessions traded", "London, New York"],
  ["Decision logic", "Fixed rules, no discretion"],
  ["Order type", "Market"],
];

const CONTROLS: [string, string][] = [
  ["Risk per trade", "0.5% default"],
  ["Daily loss limit", "2.0%"],
  ["Max open positions", "2"],
  ["Stop loss", "Required on every entry"],
  ["High-impact news filter", "On"],
  ["License binding", "One MT5 account per key"],
];

function Spec({ title, note, rows }: { title: string; note: string; rows: [string, string][] }) {
  return (
    <div className="card-surface p-6 md:p-8">
      <h3 className="text-base font-semibold text-foreground tracking-[-0.015em]">{title}</h3>
      <p className="mt-2 mb-5 text-sm text-muted-foreground leading-relaxed">{note}</p>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="spec-row">
            <dt className="spec-key">{k}</dt>
            <dd className="spec-val">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function AlgoSpec() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="The specification"
          lede="Everything the strategy does is in these two tables. If a rule is not listed here, the EA does not apply it."
        />
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-start">
          <Spec
            title="Execution"
            note="Fixed at build time. Changing any of these means a different strategy, not a different setting."
            rows={EXECUTION}
          />
          <Spec
            title="Risk controls"
            note="Yours to set before you enable live trading. The defaults are conservative on purpose."
            rows={CONTROLS}
          />
        </div>
      </div>
    </section>
  );
}
