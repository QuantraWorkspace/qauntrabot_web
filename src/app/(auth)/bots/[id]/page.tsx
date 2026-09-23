import { notFound } from "next/navigation";
import Link from "next/link";
import BotDetailView from "@/components/bots/BotDetailView";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHead from "@/components/shared/PageHead";
import { BotProductJsonLd } from "@/components/seo/JsonLd";
import { serializeBot } from "@/lib/bot-display";
import { getAllBots, getBot } from "@/lib/firestore-api";
import { createPageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  try {
    const bots = await getAllBots();
    return bots.map((b) => ({ id: b.id }));
  } catch {
    return [];
  }
}

async function resolveBot(id: string) {
  try {
    return await getBot(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const bot = await resolveBot(id);
  if (!bot) {
    return createPageMetadata({
      title: "Bot not found",
      description: "This trading bot could not be found.",
      path: `/bots/${id}`,
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: bot.name,
    description: bot.description,
    path: `/bots/${id}`,
    keywords: [
      bot.name,
      bot.asset,
      "expert advisor",
      "MT5 EA",
      "algorithmic trading",
    ],
  });
}

export default async function BotDetailPage({ params }: Params) {
  const { id } = await params;
  const bot = await resolveBot(id);

  if (!bot) {
    notFound();
  }

  const isActive = bot.status !== "soon";

  return (
    <>
      <BotProductJsonLd
        id={bot.id}
        name={bot.name}
        description={bot.description}
        asset={bot.asset}
      />
      <Navbar />
      <main id="main" className="flex-1 pt-20 md:pt-24 pb-28 lg:pb-0">
        <PageHead
          title={bot.name}
          lede={bot.subtitle.endsWith(".") ? bot.subtitle : `${bot.subtitle}.`}
          aside={
            <dl className="rounded-2xl border border-border bg-white/[0.025] p-5 sm:p-6">
              {[
                ["Instrument", bot.assetTag],
                ["Market", bot.asset],
                ["Risk profile", bot.risk],
                ["Minimum deposit", bot.minDeposit],
              ].map(([k, v]) => (
                <div key={k} className="spec-row">
                  <dt className="spec-key">{k}</dt>
                  <dd className="spec-val">{v}</dd>
                </div>
              ))}
            </dl>
          }
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {isActive && (
              <Link href="/pricing" className="btn-primary-brand justify-center">
                View pricing
              </Link>
            )}
            <Link href="/bots" className="btn-outline-brand justify-center">
              All strategies
            </Link>
          </div>
        </PageHead>
        <BotDetailView bot={serializeBot(bot)} />
      </main>
      <Footer />
    </>
  );
}
