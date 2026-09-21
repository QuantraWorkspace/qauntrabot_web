import ScrollReveal from "@/components/shared/ScrollReveal";

const MARKETS = [
  { code: "XAU", name: "Gold", from: "#FDE68A", to: "#D97706" },
  { code: "NDX", name: "Nasdaq", from: "#93C5FD", to: "#2563EB" },
  { code: "USD", name: "Dollar", from: "#86EFAC", to: "#15803D" },
  { code: "BTC", name: "Bitcoin", from: "#FDBA74", to: "#EA580C" },
  { code: "EUR", name: "Euro", from: "#A5B4FC", to: "#4F46E5" },
  { code: "SPX", name: "S&P 500", from: "#F9A8D4", to: "#BE185D" },
];

export default function MarketStrip() {
  return (
    <section className="py-6 md:py-10">
      <ScrollReveal variant="fade" className="container-site">
        <p className="text-center text-[0.6875rem] font-semibold tracking-[0.22em] uppercase text-muted-foreground">
          Markets covered daily
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {MARKETS.map(({ code, name, from, to }, i) => (
            <li key={code} className="flex flex-col items-center gap-2">
              <span
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full text-[0.75rem] font-bold tracking-[0.06em] text-[#0A0C10] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]"
                style={{
                  background: `linear-gradient(145deg, ${from}, ${to})`,
                  transform: `translateY(${i % 2 === 0 ? 0 : 10}px)`,
                }}
              >
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
