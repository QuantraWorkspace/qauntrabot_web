import { Bell, Layers, LineChart, Lock, Globe, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BlockHead from "@/components/shared/BlockHead";

/**
 * What the subscription includes, described in terms of what it does for you.
 * No latency or uptime figures: those were quoted precisely ("99.98%",
 * "sub-12ms") without anything measuring them.
 */
const CAPABILITIES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Lock,
    title: "Account-bound licensing",
    text: "One key, bound to one MT5 account number, managed from your dashboard. Transfers are done from the same screen rather than by email.",
  },
  {
    icon: Layers,
    title: "Risk presets you can change",
    text: "Conservative, balanced and aggressive starting points for risk per trade and the daily loss limit. They are starting points, not recommendations.",
  },
  {
    icon: LineChart,
    title: "Your account, in the dashboard",
    text: "Balance, equity and open positions stream in while the EA is attached to a chart, so you are not reading the terminal to know where you stand.",
  },
  {
    icon: Server,
    title: "Runs on a VPS",
    text: "MetaTrader has to stay open and connected for the EA to act. Running it on a VPS rather than a laptop is what stops a closed lid becoming a missed session.",
  },
  {
    icon: Bell,
    title: "Alerts when something changes",
    text: "Optional notifications on fills, on the daily loss limit being reached, and on the EA losing its connection.",
  },
  {
    icon: Globe,
    title: "Any MetaTrader 5 broker",
    text: "No required broker. Spread and execution differ between them and will change your results, which is the reason to test on your own broker's demo.",
  },
];

export default function PlatformCapabilities() {
  return (
    <section className="section-cream">
      <div className="container-site py-16 md:py-24">
        <BlockHead
          title="What the subscription includes"
          lede="Six things, described by what they do for you rather than by how they are built."
        />
        <div className="features-grid">
          {CAPABILITIES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="features-grid-cell">
              <Icon size={22} strokeWidth={1.5} className="text-foreground/70 shrink-0" aria-hidden />
              <div className="flex flex-col gap-2 mt-3">
                <h3 className="font-semibold text-[0.9375rem] text-foreground leading-snug tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
