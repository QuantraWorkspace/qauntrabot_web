import BlockHead from "@/components/shared/BlockHead";
import { SOCIAL_LINKS } from "@/lib/site-nav";

const BLURBS: Record<string, string> = {
  Telegram: "Daily market context, EA build notes and live discussion during sessions.",
  Facebook: "Announcements, education posts and longer write-ups from the desk.",
  TikTok: "Short lessons and market breakdowns, usually under two minutes.",
  YouTube: "Recorded walkthroughs of the tools, the tracks and the weekly review.",
};

export default function ChannelDirectory() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="The channels"
          lede="Pick the one that fits how you take things in. Anything not open yet is marked, rather than linked to an empty room."
        />
        <div>
          {SOCIAL_LINKS.map(({ label, href }) => {
            const body = (
              <>
                <span className="dir-name">{label}</span>
                <p className="dir-text">{BLURBS[label]}</p>
                <span className="state-chip" data-state={href ? "live" : undefined}>
                  <span className="state-dot" aria-hidden />
                  {href ? "Open" : "Not open yet"}
                </span>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="dir-row transition-colors"
              >
                {body}
              </a>
            ) : (
              <div key={label} className="dir-row">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
