import { ArrowRight } from "lucide-react";
import HeroOrbits from "./HeroOrbits";
import HeroDashboardMock from "./HeroDashboardMock";

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-x-clip">
      <div className="grid-backdrop" aria-hidden />
      <HeroOrbits />

      <div className="container-site flex flex-col items-center text-center pt-32 md:pt-40 pb-10">
        <span className="eyebrow-pill hero-enter hero-d-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-profit" />
          </span>
          Built for traders
        </span>

        <h1 className="hero-title mt-8 max-w-4xl hero-enter hero-d-1">
          Build your edge.
          <br />
          Trade with{" "}
          <span className="selection-frame">
            purpose
            <i aria-hidden />
          </span>
          .
        </h1>

        <p className="lead-text mt-7 max-w-2xl hero-enter hero-d-2">
          Education, market analysis, trading tools, signals and automation, built into one
          trader-first ecosystem.
        </p>

        <form
          action="/register"
          method="get"
          className="mt-9 w-full max-w-xl hero-enter hero-d-3 flex items-center gap-2 rounded-full glass-strong p-1.5 pl-5"
        >
          <label htmlFor="hero-email" className="sr-only">
            Email address
          </label>
          <input
            id="hero-email"
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 outline-none"
          />
          <button type="submit" className="btn-primary-brand group shrink-0 !py-3.5">
            Join Quantra
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>

      <div className="container-site pb-16 md:pb-24 hero-card-enter hero-d-chart">
        <HeroDashboardMock />
      </div>
    </section>
  );
}
