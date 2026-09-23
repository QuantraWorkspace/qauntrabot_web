const RULES = [
  "No naked signal calls. Post an entry if you want, but post the reasoning and the exit with it — otherwise there is nothing for anyone to learn from.",
  "Screenshots need context. A green day on its own proves nothing, and a red one is usually the more useful post.",
  "Questions beat opinions. The threads that help most start with someone saying which part they do not understand.",
  "Nothing gets sold in the channels. Promotion of other services, funded-account referrals and paid groups is removed.",
];

export default function HouseRules() {
  return (
    <section className="section-alt border-y border-border">
      <div className="container-site py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="block-title">How the rooms work</h2>
            <p className="block-lede">Four rules, enforced. They are what keeps the channels worth reading.</p>
          </div>
          <ul className="lg:col-span-8 limits">
            {RULES.map((text) => (
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
