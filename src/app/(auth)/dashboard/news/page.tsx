import { LatestNewsView } from "@/components/dashboard/pages/NewsViews";

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ market?: string; view?: string }> }) {
  const { market, view } = await searchParams;
  return <LatestNewsView initialMarket={market} initialView={view} />;
}
