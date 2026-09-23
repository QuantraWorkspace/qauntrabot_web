const LIMITS = [
  "There is no signal room attached to this. The tracks teach you to build your own read, which takes longer and is the entire point.",
  "No track promises a return, and none is priced against a win rate. Education changes how you decide; it does not change what the market does.",
  "Tracks are published as they are finished rather than on a schedule, so the list above describes the curriculum, not a release date.",
];

export default function EducationLimits() {
  return (
    <section className="section-alt border-y border-border">
      <div className="container-site py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <h2 className="lg:col-span-4 block-title">What this isn&apos;t</h2>
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
