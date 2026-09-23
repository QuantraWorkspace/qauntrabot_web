import BlockHead from "@/components/shared/BlockHead";

/** The desk's day, in the order it happens. */
const STEPS = [
  {
    when: "Pre-London",
    title: "Set the context",
    text: "What rates, inflation and risk appetite argue for today, and which releases could change it.",
  },
  {
    when: "08:00 UTC",
    title: "Mark the structure",
    text: "Trend and key levels on H4 and H1, plus where liquidity is resting on either side.",
  },
  {
    when: "Session open",
    title: "Wait for the level",
    text: "No entry until price reaches a level marked in advance. Chasing is what the plan exists to prevent.",
  },
  {
    when: "After the close",
    title: "Review against the plan",
    text: "What happened versus what was expected, logged so the same mistake is visible the second time.",
  },
];

export default function MarketMethod() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="How the bias gets built"
          lede="The same four steps every day, in the same order. The point is repeatability, not prediction."
        />
        <ol className="flow md:grid-cols-4">
          {STEPS.map(({ when, title, text }) => (
            <li key={when} className="flow-step">
              <span className="flow-when">{when}</span>
              <h3 className="flow-title">{title}</h3>
              <p className="flow-text">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
