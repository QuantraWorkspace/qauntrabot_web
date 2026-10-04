import { AnalysisView } from "@/components/dashboard/pages/NewsViews";

export default async function AnalysisPage({ searchParams }: { searchParams: Promise<{ market?: string }> }) {
  const { market } = await searchParams;
  return <AnalysisView initialMarket={market} />;
}
