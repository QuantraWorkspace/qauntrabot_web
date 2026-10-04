import { IndicatorDetailView } from "@/components/dashboard/pages/IndicatorViews";

export default async function IndicatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IndicatorDetailView id={id} />;
}
