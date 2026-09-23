import SessionClock from "./SessionClock";
import HeroDashboardMock from "./HeroDashboardMock";

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-x-clip">
      <div className="grid-backdrop" aria-hidden />

      <div className="container-site pt-32 md:pt-40 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-8 items-end">
        <div className="lg:col-span-7 flex flex-col gap-7">
          <h1 className="hero-title max-w-3xl hero-enter hero-d-0">
            Build your edge.
            <br />
            Trade with purpose.
          </h1>
          <p className="lead-text max-w-xl hero-enter hero-d-1">
            Expert advisors, education, market analysis and free tools for traders who want a
            process, in one place.
          </p>
          <form
            action="/register"
            method="get"
            className="w-full max-w-lg hero-enter hero-d-2 flex items-center gap-2 rounded-full glass-strong p-1.5 pl-5"
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
            <button type="submit" className="btn-primary-brand shrink-0 !py-3.5">
              Join Quantra
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 hero-enter hero-d-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
            <SessionClock />
            <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
              Quantra publishes market context before London opens and reviews ideas after New York
              closes. Times are UTC.
            </p>
          </div>
        </div>
      </div>

      <div className="container-site pb-16 md:pb-24 hero-card-enter hero-d-chart">
        <HeroDashboardMock />
      </div>
    </section>
  );
}
