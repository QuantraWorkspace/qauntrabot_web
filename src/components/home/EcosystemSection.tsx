import ScrollReveal from "@/components/shared/ScrollReveal";

const PILLARS = [
  "Education",
  "Market intelligence",
  "Trading tools",
  "Signals",
  "Automation",
  "Community",
];

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="section-white border-y border-border scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <ScrollReveal variant="up" className="lg:col-span-7 flex flex-col gap-6">
            <span className="eyebrow">The Quantra ecosystem</span>
            <h2 className="section-title">
              One ecosystem.
              <br />
              <span className="section-title-accent">Everything a trader needs.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={120} className="lg:col-span-5 lg:pt-14 flex flex-col gap-8">
            <p className="lead-text">
              Quantra brings education, market intelligence, trading tools, signals, automation and
              community into one place, helping traders make better-informed decisions and
              continuously improve their process.
            </p>
            <ul className="flex flex-wrap gap-2">
              {PILLARS.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md"
                >
                  {label}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
