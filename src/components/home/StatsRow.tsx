import ScrollReveal from "@/components/shared/ScrollReveal";

const STATS = [
  { value: "6", label: "Education tracks" },
  { value: "4", label: "Markets covered every session" },
  { value: "6", label: "Free trading tools" },
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
