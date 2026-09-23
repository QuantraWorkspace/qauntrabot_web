const LIMITS = [
  "It does not predict. It applies one rule set to whatever the market gives it, which means it will take the losing trades in a run of them and keep going.",
  "It does not adapt on its own. Different behaviour means different inputs, and that stays your decision, made deliberately rather than mid-drawdown.",
  "It does not replace a risk budget. A rule set running on money you cannot afford to lose fails faster, not slower.",
  "It does not carry a performance claim. Figures shown anywhere in the interface are illustrative — run it on demo for a full month and generate your own.",
];

export default function AlgoLimits() {
  return (
    <section className="section-alt border-y border-border">
      <div className="container-site py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="block-title">What it does not do</h2>
            <p className="block-lede">
              Worth reading before the specification, not after.
            </p>
          </div>
          <ul className="lg:col-span-8 limits">
            {LIMITS.map((text) => (
              <li key={text} className="limits-item">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
