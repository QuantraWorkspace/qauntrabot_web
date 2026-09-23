import Link from "next/link";

import ScrollReveal from "@/components/shared/ScrollReveal";
import { EDUCATION_TRACKS } from "@/lib/education-tracks";

/**
 * Homepage summary only: names the tracks and links through. The full
 * curriculum, with what each track leaves you able to do, lives on /education —
 * restating it here is what let the two copies drift apart before.
 */
export default function EducationSection() {
  return (
    <section id="education" className="section-cream scroll-mt-20">
      <div className="container-site py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <ScrollReveal variant="up" className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="section-title">
              A curriculum,
              <br />
              not a playlist.
            </h2>
            <p className="lead-text max-w-md">
              Six tracks that assume the one before them, ending at the point where a strategy is
              precise enough for a machine to run. Each one closes with something you can do.
            </p>
            <Link href="/education" className="btn-primary-brand w-fit">
              See what each track covers
            </Link>
          </ScrollReveal>

          <div className="lg:col-span-7">
            <ol className="rounded-3xl glass overflow-hidden">
              {EDUCATION_TRACKS.map(({ n, title }, i) => (
                <li key={n}>
                  <div
                    className={`grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr] items-center gap-4 px-5 sm:px-7 py-5 ${
                      i < EDUCATION_TRACKS.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="card-number">{n}</span>
                    <h3 className="text-base font-semibold text-foreground tracking-[-0.015em]">
                      {title}
                    </h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
