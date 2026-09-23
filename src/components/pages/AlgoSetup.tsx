import BlockHead from "@/components/shared/BlockHead";

const STEPS = [
  {
    n: "Step 1",
    title: "Bind the license",
    text: "One key, one MT5 account number, set from your dashboard. Transfers are done from the same screen.",
  },
  {
    n: "Step 2",
    title: "Set your risk first",
    text: "Enter risk per trade and the daily loss limit before you enable automated trading, not after the first position.",
  },
  {
    n: "Step 3",
    title: "Run a month on demo",
    text: "Watch it through a full cycle of sessions and at least one high-impact release. Live comes after that, or not at all.",
  },
];

export default function AlgoSetup() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="Running it"
          lede="Three steps, and the third one is not optional."
        />
        <ol className="flow md:grid-cols-3">
          {STEPS.map(({ n, title, text }) => (
            <li key={n} className="flow-step">
              <span className="flow-when">{n}</span>
              <h3 className="flow-title">{title}</h3>
              <p className="flow-text">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
