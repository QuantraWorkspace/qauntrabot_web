const LIMITS = [
  "A bias is not a signal. It says which direction has the better argument today — not where to enter, what size to take, or when to exit.",
  "Levels are marked before London opens and are not revised intraday. If price invalidates them, the note is wrong for that day and says so the next morning.",
  "Everything published here is for education. It is not a recommendation to buy or sell, and it does not account for your account size or risk tolerance.",
];

export default function MarketLimits() {
  return (
    <section className="section-alt border-y border-border">
      <div className="container-site py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <h2 className="lg:col-span-4 block-title">What the desk note is not</h2>
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
