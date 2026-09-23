import Link from "next/link";
import { MessageSquareText, Sparkles, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const FEED = [
  {
    icon: TrendingUp,
    channel: "#gold-analysis",
    text: "Pre-London bias posted: buying H4 demand while structure holds. Levels in thread.",
    meta: "Market desk",
  },
  {
    icon: MessageSquareText,
    channel: "#trade-review",
    text: "Journaled 12 trades this week. Biggest leak was entering before the session open.",
    meta: "Member review",
  },
  {
    icon: Sparkles,
    channel: "#tools",
    text: "New TradingView session indicator released. Free for everyone in the community.",
    meta: "Quantra tools",
  },
];

type CommunitySectionProps = { hideHeader?: boolean };

export default function CommunitySection({ hideHeader = false }: CommunitySectionProps) {
  return (
    <section id="community" className="section-cream scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {!hideHeader && (
          <ScrollReveal variant="up" className="lg:col-span-6 flex flex-col gap-6">
            <span className="eyebrow">Community</span>
            <h2 className="section-title">Don&apos;t trade alone.</h2>
            <p className="lead-text max-w-md">
              Join a growing community of traders sharing market ideas, analysis, education and tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/community" className="btn-primary-brand justify-center group">
                Join Community
              </Link>
              <Link href="/tools" className="btn-outline-brand justify-center group">
                Explore Free Resources
              </Link>
            </div>
          </ScrollReveal>
          )}

          <ScrollReveal variant="up" delay={120} className={hideHeader ? "lg:col-span-8 lg:col-start-3" : "lg:col-span-6"}>
            <div className="rounded-3xl glass-inset p-3 sm:p-4 flex flex-col gap-3">
              {FEED.map(({ icon: Icon, channel, text, meta }) => (
                <article
                  key={channel}
                  className="rounded-2xl glass p-5 flex gap-4 transition-colors hover:border-white/25"
                >
                  <span className="icon-tile !w-10 !h-10 shrink-0">
                    <Icon size={17} className="text-foreground" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-foreground">{channel}</span>
                      <span className="text-muted-foreground">{meta}</span>
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{text}</p>
                  </div>
                </article>
              ))}
              <p className="px-2 pt-1 text-[0.6875rem] text-muted-foreground">Example threads, shown for illustration.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
