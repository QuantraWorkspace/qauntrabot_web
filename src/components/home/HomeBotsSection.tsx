"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { deserializeBot, type SerializableBot } from "@/lib/bot-display";
import type { BotDoc } from "@/lib/firestore";
import SectionHeader from "@/components/shared/SectionHeader";
import BotCatalogCard, { BotCatalogCardSkeleton } from "@/components/bots/BotCatalogCard";
import ScrollReveal from "@/components/shared/ScrollReveal";

type Filter = "all" | "live" | "beta" | "soon";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All Bots",
  live: "Live",
  beta: "Beta",
  soon: "Coming Soon",
};

export default function HomeBotsSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [bots, setBots] = useState<BotDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/bots")
      .then((r) => r.json())
      .then((data: SerializableBot[]) => {
        if (Array.isArray(data)) setBots(data.map(deserializeBot));
      })
      .catch(() => setBots([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? bots : bots.filter((b) => b.status === filter);

  return (
    <section id="bots" className={`section-cream ${hideHeader ? "pt-8 md:pt-10 pb-16 md:pb-24" : "section-y"}`}>
      <div className="container-site">
        {!hideHeader && (
        <ScrollReveal variant="up" className="headline-gap">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <SectionHeader
              eyebrow="Strategy Catalogue"
              title="Available"
              accent="Trading Bots."
              description="Expert advisors for gold, forex, and more — deployable on MT5 with fully isolated risk parameters."
              className="max-w-xl"
            />
            <Link
              href="/pricing"
              className="btn-outline-brand shrink-0 self-start md:self-auto"
            >
              View pricing
            </Link>
          </div>
        </ScrollReveal>
        )}

        {/* Filter tabs — pointless until something is listed */}
        {(loading || bots.length > 0) && (
        <div className="tab-group mb-8">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 cursor-pointer ${filter === f ? "tab-pill-active" : ""}`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-site">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => <BotCatalogCardSkeleton key={i} />)}

          {!loading && filtered.map((bot, i) => (
            <ScrollReveal key={bot.id} variant="up" delay={60 + i * 60} className="h-full">
              <BotCatalogCard bot={bot} />
            </ScrollReveal>
          ))}

          {!loading && bots.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-12 text-center">
              <p className="text-sm font-semibold text-foreground">Nothing is published yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                Strategies are listed here once they have run a full month on demo. Until then the
                specification above is the accurate description of what exists.
              </p>
            </div>
          )}

          {!loading && bots.length > 0 && filtered.length === 0 && (
            <p className="sm:col-span-2 lg:col-span-3 text-center text-sm text-muted-foreground py-12">
              No bots match this filter.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
