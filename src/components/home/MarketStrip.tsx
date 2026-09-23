import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * The four markets the desk note actually covers — it listed six, adding Euro
 * and the S&P, which the /markets page does not read. Untinted: six gradient
 * discs were decoration, and the loss and warning hues are reserved for
 * direction.
 */
const MARKETS = [
  { code: "XAU", name: "Gold" },
  { code: "NDX", name: "Nasdaq" },
  { code: "DXY", name: "Dollar" },
  { code: "BTC", name: "Bitcoin" },
];

export default function MarketStrip() {
  return (
    <section className="py-6 md:py-10">
      <ScrollReveal variant="fade" className="container-site">
        <p className="text-center text-[0.6875rem] font-semibold text-muted-foreground">
          Read before every session
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {MARKETS.map(({ code, name }) => (
            <li key={code} className="flex flex-col items-center gap-2.5">
              <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[0.75rem] font-bold text-foreground">
                {code}
              </span>
              <span className="text-xs text-muted-foreground">{name}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}
