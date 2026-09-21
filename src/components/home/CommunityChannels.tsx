import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { SOCIAL_LINKS } from "@/lib/site-nav";

const BLURBS: Record<string, string> = {
  Telegram: "Daily market context, signal threads and live discussion.",
  Facebook: "Announcements, education posts and community highlights.",
  TikTok: "Short-form lessons and market breakdowns.",
  YouTube: "Long-form education, tool walkthroughs and reviews.",
};

export default function CommunityChannels() {
  return (
    <section id="contact" className="section-cream scroll-mt-20">
      <div className="container-site py-16 md:py-24">
        <ScrollReveal variant="up" className="max-w-2xl mb-10 md:mb-14">
          <span className="eyebrow">Channels</span>
          <h2 className="section-title mt-5">Where the conversation happens.</h2>
          <p className="lead-text mt-6">
            Pick the channel that fits how you learn. Questions and partnership requests are answered
            through the community channels below.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {SOCIAL_LINKS.map(({ label, href }, i) => {
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    {label}
                  </span>
                  {href ? (
                    <ArrowUpRight size={16} className="text-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  ) : (
                    <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{BLURBS[label]}</p>
              </>
            );
            return (
              <ScrollReveal key={label} variant="up" delay={i * 70} className="h-full">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-surface-hover group h-full p-7 flex flex-col gap-6 cursor-pointer"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="card-surface h-full p-7 flex flex-col gap-6 opacity-80">{body}</div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
