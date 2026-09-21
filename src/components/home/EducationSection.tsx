import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export const EDUCATION_TRACKS = [
  { n: "01", title: "Fundamentals", text: "Rates, inflation, growth and how macro flows into price." },
  { n: "02", title: "Technical Analysis", text: "Structure, trend, levels and timing across timeframes." },
  { n: "03", title: "ICT Concepts", text: "Liquidity, order flow and the logic behind smart-money models." },
  { n: "04", title: "Risk Management", text: "Position sizing, drawdown control and surviving losing streaks." },
  { n: "05", title: "Trading Psychology", text: "Discipline, routine and decision-making under pressure." },
  { n: "06", title: "Algorithmic Trading", text: "From rule-based strategy to backtest to automated execution." },
];

type EducationSectionProps = { hideHeader?: boolean };

export default function EducationSection({ hideHeader = false }: EducationSectionProps) {
  return (
    <section id="education" className="section-cream scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {!hideHeader && (
            <ScrollReveal variant="up" className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
              <span className="eyebrow">Education</span>
              <h2 className="section-title">
                Learn the framework.
                <br />
                <span className="section-title-accent">Build your process.</span>
              </h2>
              <p className="lead-text max-w-md">
                Structured tracks that move from concept to execution. No shortcuts, no promises,
                just a repeatable way to read markets and manage risk.
              </p>
              <Link href="/education" className="btn-primary-brand w-fit group">
                Start Learning
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </ScrollReveal>
          )}

          <div className={hideHeader ? "lg:col-span-12" : "lg:col-span-7"}>
            <ol className="rounded-3xl glass overflow-hidden">
              {EDUCATION_TRACKS.map(({ n, title, text }, i) => (
                <ScrollReveal key={n} as="li" variant="up" delay={i * 60}>
                  <div
                    className={`group grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_auto] items-center gap-4 px-5 sm:px-7 py-6 transition-colors hover:bg-white/[0.04] ${
                      i < EDUCATION_TRACKS.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="card-number">{n}</span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-foreground tracking-[-0.015em]">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-muted-foreground transition-all duration-200 group-hover:text-foreground group-hover:translate-x-0.5"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
