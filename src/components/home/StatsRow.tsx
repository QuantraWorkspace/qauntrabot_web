import ScrollReveal from "@/components/shared/ScrollReveal";

/** Counts of things that exist on this site, and nothing else. Each is
 *  verifiable by opening the page it refers to — keep them in step with it. */
const STATS = [
  { value: "6", label: "Education tracks" },
  { value: "4", label: "Markets read before every session" },
  { value: "3", label: "Tools that need no account" },
];

export default function StatsRow() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-site">
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8 rounded-3xl border border-white/8 bg-white/[0.02]">
          {STATS.map(({ value, label }, i) => (
            <ScrollReveal key={label} variant="up" delay={i * 80} className="px-8 py-10 text-center">
              <p className="stat-figure">{value}</p>
              <p className="mt-3 text-sm text-muted-foreground">{label}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
