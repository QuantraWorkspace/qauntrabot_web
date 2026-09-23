const PILLARS = [
  ["Market intelligence", "A written read on four markets, published before London opens."],
  ["Education", "Six tracks, ordered so each one assumes the last."],
  ["Tools", "Indicators, calculators and templates for the mechanical steps."],
  ["Community", "Channels where reasoning gets challenged instead of traded."],
  ["Algo", "Rule-based expert advisors for MT5, with the logic published."],
];

export default function AboutStory() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7 read-col">
            <p>
              Quantra began as a single expert advisor for MetaTrader 5. It did one job — apply a gold
              strategy without the hesitation that costs most traders their edge — and it did that job
              well enough that the questions started arriving.
            </p>
            <p>
              Almost none of them were about the EA. They were about what sat underneath it. Why the
              strategy waited for that level. What a stop distance had to do with position size. How
              anyone is supposed to tell a normal losing run from a broken system.
            </p>
            <p>
              Those questions are the reason for everything else here. An automated strategy only helps
              someone who already understands what it is doing; handed to someone who doesn&apos;t, it is
              just a faster way to lose money. So <strong>the EA stopped being the product and became one
              part of it</strong>.
            </p>
            <p>
              What exists now is five things built around one idea: a trader improves by having a process
              and reviewing it, not by finding a better entry. The market read goes out before the session
              so the plan exists before the emotion does. The education is sequenced so risk comes before
              automation. The tools take care of the steps that are purely mechanical. The community is
              where the reasoning gets argued with. The algo runs the rules once you can defend them.
            </p>
            <p>
              None of it promises a return. That isn&apos;t modesty — it&apos;s the only claim that
              survives contact with a drawdown.
            </p>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <h2 className="block-title">The five parts</h2>
            <dl className="mt-6">
              {PILLARS.map(([name, what]) => (
                <div key={name} className="py-4 border-t border-border first:border-t-0 first:pt-0">
                  <dt className="text-sm font-semibold text-foreground">{name}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
